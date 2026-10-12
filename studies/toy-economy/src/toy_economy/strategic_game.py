"""A reversible human/robot/exit game, separate from the cash-flow ledger.

Active firms share final sales equally. A robot's setup cost is converted into
a recurring private hurdle; it is not an installation order or a GDP deduction.
Best-response rounds are an algorithm for this stationary game, not economic
time. Entry is free and capacity, finance, sunk costs and strategic prices are
absent. These assumptions deliberately test the binary retention comparison.
"""

from dataclasses import dataclass
from math import isfinite
from typing import Literal

from .incentives import IncentiveParameters, annuity_factor

Action = Literal["human", "robot", "exit"]
UpdateMode = Literal["asynchronous", "simultaneous"]
ACTIONS: tuple[Action, ...] = ("human", "robot", "exit")
TOLERANCE = 1e-9


@dataclass(frozen=True)
class StrategyCounts:
    human: int
    robot: int
    exit: int

    def __post_init__(self) -> None:
        for name in ACTIONS:
            value = getattr(self, name)
            if type(value) is not int or value < 0:
                raise ValueError("strategy counts must be nonnegative integers")

    @property
    def active(self) -> int:
        return self.human + self.robot

    @property
    def total(self) -> int:
        return self.active + self.exit

    def changing(self, action: Action, change: int) -> "StrategyCounts":
        if action not in ACTIONS:
            raise ValueError("unknown strategy")
        return StrategyCounts(
            self.human + (change if action == "human" else 0),
            self.robot + (change if action == "robot" else 0),
            self.exit + (change if action == "exit" else 0),
        )


@dataclass(frozen=True)
class GameTerms:
    demand_multiplier: float
    autonomous_sales_floor: float
    human_wage: float
    setup_cost: float
    annuity_factor: float
    robot_hurdle_per_period: float


@dataclass(frozen=True)
class StrategyAllocation:
    counts: StrategyCounts
    desired_sales: float
    nominal_gdp: float
    unserved_demand: float
    wages: float
    sales_per_active_firm: float
    human_payoff: float | None
    robot_payoff: float | None
    exit_payoff: float = 0.0


@dataclass(frozen=True)
class ChoicePayoffs:
    human: float
    robot: float
    exit: float = 0.0

    def for_action(self, action: Action) -> float:
        if action not in ACTIONS:
            raise ValueError("unknown strategy")
        return float(getattr(self, action))


@dataclass(frozen=True)
class PureEquilibrium:
    allocation: StrategyAllocation
    maximum_deviation_gain: float


@dataclass(frozen=True)
class BestResponseState:
    round: int
    actions: tuple[Action, ...]
    allocation: StrategyAllocation
    maximum_deviation_gain: float


@dataclass(frozen=True)
class BestResponseResult:
    mode: UpdateMode
    status: Literal["fixed_point", "cycle", "iteration_limit"]
    states: tuple[BestResponseState, ...]
    cycle_start: int | None = None
    cycle_length: int | None = None


def game_terms(parameters: IncentiveParameters) -> GameTerms:
    p = parameters
    denominator = 1 - p.owner_propensity - p.investment_share
    multiplier = (p.worker_propensity - p.owner_propensity) / denominator
    floor = p.autonomous_investment / denominator
    wage = p.initial_wages / p.firms
    cost = p.setup_cost_per_wage_unit * wage
    annuity = annuity_factor(p.discount_rate, p.payoff_periods)
    hurdle = cost / annuity
    all_human_sales = multiplier * p.initial_wages + floor
    if not all(isfinite(v) for v in (multiplier, floor, wage, cost, hurdle, all_human_sales)):
        raise ValueError("computed game terms exceed finite numerical range")
    if all_human_sales < p.initial_wages - TOLERANCE:
        raise ValueError("aggregate owner losses require a different demand closure")
    return GameTerms(multiplier, floor, wage, cost, annuity, hurdle)


def _allocation(counts: StrategyCounts, terms: GameTerms) -> StrategyAllocation:
    wages = terms.human_wage * counts.human
    desired = terms.demand_multiplier * wages + terms.autonomous_sales_floor
    # An autonomous order cannot be delivered when every producer has exited.
    output = desired if counts.active else 0.0
    sales = output / counts.active if counts.active else 0.0
    return StrategyAllocation(
        counts,
        desired,
        output,
        desired - output,
        wages,
        sales,
        sales - terms.human_wage if counts.human else None,
        sales - terms.robot_hurdle_per_period if counts.robot else None,
    )


def strategy_allocation(
    counts: StrategyCounts, parameters: IncentiveParameters | None = None
) -> StrategyAllocation:
    p = parameters or IncentiveParameters()
    if counts.total != p.firms:
        raise ValueError("strategy counts must sum to firms")
    return _allocation(counts, game_terms(p))


def _choice_payoffs(others: StrategyCounts, terms: GameTerms) -> ChoicePayoffs:
    human = _allocation(others.changing("human", 1), terms)
    robot = _allocation(others.changing("robot", 1), terms)
    assert human.human_payoff is not None and robot.robot_payoff is not None
    return ChoicePayoffs(human.human_payoff, robot.robot_payoff)


def choice_payoffs(
    others: StrategyCounts, parameters: IncentiveParameters | None = None
) -> ChoicePayoffs:
    """Each unilateral choice recomputes both demand and the active market share."""
    p = parameters or IncentiveParameters()
    if others.total != p.firms - 1:
        raise ValueError("others must contain exactly firms minus one players")
    return _choice_payoffs(others, game_terms(p))


def best_response(payoffs: ChoicePayoffs, current: Action) -> Action:
    """Retain the current choice on ties; remaining ties use human/robot/exit order."""
    if current not in ACTIONS:
        raise ValueError("unknown strategy")
    best = max(payoffs.for_action(action) for action in ACTIONS)
    if payoffs.for_action(current) >= best - TOLERANCE:
        return current
    return next(action for action in ACTIONS if payoffs.for_action(action) >= best - TOLERANCE)


def _maximum_deviation_gain(counts: StrategyCounts, terms: GameTerms) -> float:
    gain = 0.0
    for action in ACTIONS:
        if getattr(counts, action):
            payoffs = _choice_payoffs(counts.changing(action, -1), terms)
            current = payoffs.for_action(action)
            gain = max(gain, *(payoffs.for_action(other) - current for other in ACTIONS))
    return gain


def enumerate_pure_nash(
    parameters: IncentiveParameters | None = None,
) -> tuple[PureEquilibrium, ...]:
    """Enumerate all symmetric count profiles, checking every occupied strategy.

    Each retained profile represents all labeled-player permutations of those
    counts. An empty result means no pure equilibrium, not no mixed equilibrium.
    """
    p = parameters or IncentiveParameters()
    terms = game_terms(p)
    equilibria: list[PureEquilibrium] = []
    for humans in range(p.firms + 1):
        for robots in range(p.firms - humans + 1):
            counts = StrategyCounts(humans, robots, p.firms - humans - robots)
            gain = _maximum_deviation_gain(counts, terms)
            if gain <= TOLERANCE:
                equilibria.append(PureEquilibrium(_allocation(counts, terms), gain))
    return tuple(equilibria)


def counts_for_actions(actions: tuple[Action, ...]) -> StrategyCounts:
    if any(action not in ACTIONS for action in actions):
        raise ValueError("unknown strategy")
    return StrategyCounts(actions.count("human"), actions.count("robot"), actions.count("exit"))


def simulate_best_responses(
    parameters: IncentiveParameters | None = None,
    *,
    initial: tuple[Action, ...] | None = None,
    mode: UpdateMode = "asynchronous",
    max_rounds: int = 200,
) -> BestResponseResult:
    """Apply deterministic reversible best responses and detect repeated profiles.

    Asynchronous means one fixed-order sweep through labeled firms per round;
    simultaneous means all respond to the preceding round's profile. Cycles are
    checked on full action tuples at the same sweep phase, not on counts alone.
    """
    p = parameters or IncentiveParameters()
    terms = game_terms(p)
    if mode not in ("asynchronous", "simultaneous"):
        raise ValueError("unknown update mode")
    if type(max_rounds) is not int or max_rounds < 1:
        raise ValueError("max_rounds must be a positive integer")
    starting_action: Action = "human"
    actions = initial if initial is not None else (starting_action,) * p.firms
    if len(actions) != p.firms:
        raise ValueError("initial actions must contain exactly firms players")
    counts = counts_for_actions(actions)
    states = [
        BestResponseState(
            0, actions, _allocation(counts, terms), _maximum_deviation_gain(counts, terms)
        )
    ]
    if states[0].maximum_deviation_gain <= TOLERANCE:
        return BestResponseResult(mode, "fixed_point", tuple(states))
    seen = {actions: 0}
    for round_number in range(1, max_rounds + 1):
        revised = list(actions)
        if mode == "asynchronous":
            for index, current in enumerate(actions):
                replacement = best_response(
                    _choice_payoffs(counts.changing(current, -1), terms), current
                )
                revised[index] = replacement
                counts = counts.changing(current, -1).changing(replacement, 1)
        else:
            for index, current in enumerate(actions):
                revised[index] = best_response(
                    _choice_payoffs(counts.changing(current, -1), terms), current
                )
            counts = counts_for_actions(tuple(revised))
        actions = tuple(revised)
        state = BestResponseState(
            round_number,
            actions,
            _allocation(counts, terms),
            _maximum_deviation_gain(counts, terms),
        )
        states.append(state)
        if state.maximum_deviation_gain <= TOLERANCE:
            return BestResponseResult(mode, "fixed_point", tuple(states))
        if actions in seen:
            start = seen[actions]
            return BestResponseResult(mode, "cycle", tuple(states), start, round_number - start)
        seen[actions] = round_number
    return BestResponseResult(mode, "iteration_limit", tuple(states))

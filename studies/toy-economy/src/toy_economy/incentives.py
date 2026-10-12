"""A symmetric automation game with an explicit aggregate-demand externality.

This analytical game is separate from the ten-firm cash ledger. Firms share
final sales equally and internalize their own share of the long-run sales loss.
Negative operating payoffs expose a need for finance/exit; they are not a
claim that loss-making firms can operate indefinitely without funding.
"""

from dataclasses import dataclass
from math import fsum

from .closure import nonnegative, proportion


@dataclass(frozen=True)
class IncentiveParameters:
    firms: int = 10
    initial_wages: float = 60.0
    worker_propensity: float = 1.0
    owner_propensity: float = 0.5
    investment_share: float = 0.2
    autonomous_investment: float = 0.0
    setup_cost_per_wage_unit: float = 1.0
    discount_rate: float = 0.05
    payoff_periods: int = 10

    def __post_init__(self) -> None:
        if type(self.firms) is not int or not 1 <= self.firms <= 1000:
            raise ValueError("firms must be an integer from one to 1000")
        if type(self.payoff_periods) is not int or not 1 <= self.payoff_periods <= 1000:
            raise ValueError("payoff_periods must be an integer from one to 1000")
        for name in (
            "initial_wages",
            "autonomous_investment",
            "setup_cost_per_wage_unit",
            "discount_rate",
        ):
            nonnegative(name, getattr(self, name))
        for name in ("worker_propensity", "owner_propensity", "investment_share"):
            proportion(name, getattr(self, name))
        if self.owner_propensity + self.investment_share >= 1:
            raise ValueError("stationary closure requires owner propensity + investment share < 1")
        if self.worker_propensity < self.owner_propensity:
            raise ValueError(
                "this displacement experiment requires workers to spend at least as much"
            )


@dataclass(frozen=True)
class AdoptionAllocation:
    adopters: int
    nominal_gdp: float
    wages: float
    worker_consumption: float
    owner_consumption: float
    investment: float
    aggregate_gross_surplus: float
    adopter_operating_surplus: float | None
    nonadopter_operating_surplus: float | None
    nonadopters_need_financing: bool


@dataclass(frozen=True)
class IncentiveResult:
    demand_multiplier: float
    wage_saved_per_firm: float
    aggregate_sales_lost_per_adoption: float
    own_sales_lost_per_adoption: float
    private_recurring_gain: float
    collective_recurring_surplus_change: float
    setup_cost: float
    annuity_factor: float
    private_net_present_value: float
    adoption_beats_retention: bool
    allocations: tuple[AdoptionAllocation, ...]


def annuity_factor(rate: float, periods: int) -> float:
    """Value of one unit received at each of the next `periods` period ends."""
    nonnegative("rate", rate)
    if type(periods) is not int or not 1 <= periods <= 1000:
        raise ValueError("periods must be an integer from one to 1000")
    return fsum((1.0 + rate) ** (-t) for t in range(1, periods + 1))


def adoption_allocation(adopters: int, p: IncentiveParameters) -> AdoptionAllocation:
    if type(adopters) is not int or not 0 <= adopters <= p.firms:
        raise ValueError("adopters must be between zero and the number of firms")
    wage = p.initial_wages / p.firms
    wages = wage * (p.firms - adopters)
    denominator = 1 - p.owner_propensity - p.investment_share
    output = (
        (p.worker_propensity - p.owner_propensity) * wages + p.autonomous_investment
    ) / denominator
    surplus = output - wages
    if surplus < -1e-9:
        raise ValueError("aggregate losses require a different financing closure")
    per_firm_sales = output / p.firms
    return AdoptionAllocation(
        adopters,
        output,
        wages,
        p.worker_propensity * wages,
        p.owner_propensity * surplus,
        p.autonomous_investment + p.investment_share * output,
        surplus,
        per_firm_sales if adopters else None,
        per_firm_sales - wage if adopters < p.firms else None,
        adopters < p.firms and per_firm_sales < wage - 1e-9,
    )


def solve_incentives(p: IncentiveParameters | None = None) -> IncentiveResult:
    """Compare adopting and retaining labor in a binary choice, rivals fixed.

    Setup cost is a private NPV hurdle, not deducted from recurring GDP here.
    An actual installation would create a temporary investment order and require
    finance. Rival responses, exit, setup production and transition timing are
    deliberately outside this stationary payoff screen.
    """
    p = p or IncentiveParameters()
    multiplier = (p.worker_propensity - p.owner_propensity) / (
        1 - p.owner_propensity - p.investment_share
    )
    wage = p.initial_wages / p.firms
    sales_lost = multiplier * wage
    private_gain = wage - sales_lost / p.firms
    cost = p.setup_cost_per_wage_unit * wage
    annuity = annuity_factor(p.discount_rate, p.payoff_periods)
    npv = private_gain * annuity - cost
    return IncentiveResult(
        multiplier,
        wage,
        sales_lost,
        sales_lost / p.firms,
        private_gain,
        wage - sales_lost,
        cost,
        annuity,
        npv,
        npv > 1e-9,
        tuple(adoption_allocation(k, p) for k in range(p.firms + 1)),
    )

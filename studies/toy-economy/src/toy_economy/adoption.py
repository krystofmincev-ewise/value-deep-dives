"""A separate four-firm town for gradual adoption, pay contracts and prices.

Two consumer producers employ the ten workers. The domestic AI-service and
capital-equipment producers use exogenous maintained automated infrastructure.
This topology is intentionally separate from the earlier ten-firm IO economy.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from math import ceil, fsum
from typing import Literal

from .closure import nonnegative, proportion
from .ledger import Payment

Consumer = Literal["consumer_a", "consumer_b"]
PayContract = Literal["salary_protected", "hourly_pay", "layoffs"]
CapacityUse = Literal["take_time", "redeploy"]
InvestmentRule = Literal["fixed", "sales_responsive"]
CONSUMERS: tuple[Consumer, Consumer] = ("consumer_a", "consumer_b")
WORKERS = tuple(f"worker_{index}" for index in range(1, 11))
Pair = tuple[float, float]


@dataclass(frozen=True)
class AdoptionParameters:
    periods: int = 40
    pay_contract: PayContract = "salary_protected"
    capacity_use: CapacityUse = "redeploy"
    adoption_rule: Literal["scheduled", "bounded_myopic"] = "scheduled"
    adoption_step: float = 0.2
    adoption_hurdle: float = 0.0
    labor_demand_rule: Literal["reference", "lagged_sales"] = "reference"
    labor_sales_buffer: float = 1.1
    worker_shift_pattern: Literal["smooth", "rotating"] = "smooth"
    price_pass_through: float = 0.8
    price_adjustment_speed: float = 1.0
    price_elasticity: float = 2.0
    pricing_capacity_rule: Literal["resource_aware", "optimistic"] = "resource_aware"
    ai_fee_per_task_hour: float = 3.0
    ai_service_capacity: float = 10.0
    consumer_capital_capacity: float = 100.0
    equipment_capacity: float = 40.0
    autonomous_investment: float = 20.0
    investment_rule: InvestmentRule = "fixed"
    investment_sales_share: float = 0.2
    depreciation_rate: float = 0.1
    worker_spending_propensity: float = 1.0
    owner_spending_propensity: float = 0.5
    worker_bonus_share: float = 0.0
    worker_ownership_share: float = 0.0
    worker_ownership_start_period: int = 0
    initial_worker_cash: float = 60.0
    initial_owner_cash: float = 40.0
    initial_firm_cash: float = 100.0
    initial_lagged_worker_income: float = 60.0
    initial_lagged_owner_income: float = 40.0
    initial_lagged_nominal_gdp: float = 100.0

    def __post_init__(self) -> None:
        if type(self.periods) is not int or self.periods < 1:
            raise ValueError("periods must be a positive integer")
        if (
            type(self.worker_ownership_start_period) is not int
            or self.worker_ownership_start_period < 0
        ):
            raise ValueError("worker ownership start must be a nonnegative integer")
        if self.pay_contract not in ("salary_protected", "hourly_pay", "layoffs"):
            raise ValueError("unknown pay contract")
        if self.capacity_use not in ("take_time", "redeploy"):
            raise ValueError("unknown capacity use")
        if self.adoption_rule not in ("scheduled", "bounded_myopic"):
            raise ValueError("unknown adoption rule")
        if self.labor_demand_rule not in ("reference", "lagged_sales"):
            raise ValueError("unknown labor demand rule")
        if self.worker_shift_pattern not in ("smooth", "rotating"):
            raise ValueError("unknown worker shift pattern")
        if self.worker_shift_pattern == "rotating" and (
            self.pay_contract != "hourly_pay" or self.capacity_use != "take_time"
        ):
            raise ValueError("rotating shifts require hourly pay and take-time capacity use")
        nonnegative("labor sales buffer", self.labor_sales_buffer)
        if self.labor_sales_buffer < 1:
            raise ValueError("labor sales buffer must be at least one")
        proportion("adoption_step", self.adoption_step)
        if not self.adoption_step:
            raise ValueError("adoption step must be positive")
        if self.pricing_capacity_rule not in ("resource_aware", "optimistic"):
            raise ValueError("unknown pricing capacity rule")
        if self.investment_rule not in ("fixed", "sales_responsive"):
            raise ValueError("unknown investment rule")
        for name in (
            "price_pass_through",
            "price_adjustment_speed",
            "depreciation_rate",
            "worker_spending_propensity",
            "owner_spending_propensity",
            "worker_bonus_share",
            "worker_ownership_share",
            "investment_sales_share",
        ):
            proportion(name, getattr(self, name))
        for name in (
            "price_elasticity",
            "adoption_hurdle",
            "ai_fee_per_task_hour",
            "ai_service_capacity",
            "consumer_capital_capacity",
            "equipment_capacity",
            "autonomous_investment",
            "initial_worker_cash",
            "initial_owner_cash",
            "initial_firm_cash",
            "initial_lagged_worker_income",
            "initial_lagged_owner_income",
            "initial_lagged_nominal_gdp",
        ):
            nonnegative(name, getattr(self, name))


@dataclass(frozen=True)
class AdoptionShock:
    period: int
    firm: Consumer
    automation_fraction: float

    def __post_init__(self) -> None:
        if type(self.period) is not int or self.period < 0:
            raise ValueError("period must be a nonnegative integer")
        if self.firm not in CONSUMERS:
            raise ValueError("unknown consumer firm")
        proportion("automation_fraction", self.automation_fraction)


@dataclass(frozen=True)
class LaborPlan:
    headcount: int
    reference_required_hours: float
    contracted_hours: float
    contracted_wages: float
    labor_capacity: float
    planned_quantity: float


@dataclass(frozen=True)
class AdoptionFirmResult:
    firm_id: str
    automation_fraction: float
    price: float
    headcount: int
    reference_required_hours: float
    contracted_hours: float
    actual_hours: float
    contracted_wages: float
    wages_paid: float
    bonus_paid: float
    wage_arrears: float
    quantity_capacity: float
    quantity: float
    revenue: float
    ai_task_hours: float
    ai_fees: float
    ai_fees_paid: float
    value_added: float
    gross_surplus: float
    owner_dividend: float
    worker_dividend: float
    investment: float
    effective_hourly_compensation: float | None
    planned_quantity: float
    worker_contracted_hours: tuple[float, ...]
    worker_paid_wages: tuple[float, ...]
    on_duty_headcount: int


@dataclass(frozen=True)
class AdoptionDecision:
    firm_id: Consumer
    rule: str
    available_automation: float
    previous_automation: float
    candidate_automation: float
    chosen_automation: float
    forecast_consumption_budget: float
    predicted_current_surplus: float
    predicted_candidate_surplus: float
    predicted_current_quantity: float
    predicted_candidate_quantity: float
    predicted_current_price: float
    predicted_candidate_price: float
    reason: str


@dataclass(frozen=True)
class AdoptionPeriodResult:
    period: int
    firms: tuple[AdoptionFirmResult, ...]
    opening_balances: dict[str, float]
    closing_balances: dict[str, float]
    payments: tuple[Payment, ...]
    nominal_gdp: float
    real_gdp: float
    nominal_consumption: float
    real_consumption: float
    investment: float
    desired_investment: float
    wages: float
    wages_paid: float
    wage_arrears: float
    gross_surplus: float
    worker_consumption: float
    owner_consumption: float
    worker_real_consumption: float
    owner_real_consumption: float
    desired_consumption: float
    cash_financeable_consumption: float
    unspent_consumption_budget: float
    consumption_price_index: float | None
    ai_provider_revenue: float
    ai_provider_value_added: float
    equipment_producer_revenue: float
    equipment_producer_value_added: float
    owner_dividends: float
    worker_dividends: float
    worker_income: tuple[float, ...]
    worker_consumption_by_person: tuple[float, ...]
    worker_real_consumption_by_person: tuple[float, ...]
    worker_opening_cash: tuple[float, ...]
    worker_closing_cash: tuple[float, ...]
    opening_capital: Pair
    closing_capital: Pair
    ai_service_utilization: float
    adoption_decisions: tuple[AdoptionDecision, AdoptionDecision]
    stop_reason: str | None


@dataclass(frozen=True)
class AdoptionResult:
    parameters: AdoptionParameters
    shocks: tuple[AdoptionShock, ...]
    money_stock: float
    periods: tuple[AdoptionPeriodResult, ...]
    stop_reason: str | None


def labor_plan(
    automation: float, p: AdoptionParameters, *, lagged_quantity: float = 40.0
) -> LaborPlan:
    """Guaranteed paid hours differ from actual hours used when demand is weak.

    Take-time maintains reference output40 even at complete task automation.
    Redeployment retains contracted hours, subject to actual capital and AI.
    Protected salary pays30 even if hours fall to zero; that is income retention,
    not a claim that jobs have disappeared. Layoffs round headcount upward.
    """
    proportion("automation", automation)
    nonnegative("lagged quantity", lagged_quantity)
    reference = 5 * (1 - automation)
    if p.labor_demand_rule == "lagged_sales":
        target = lagged_quantity * p.labor_sales_buffer
        required = min(5.0, target * (1 - automation) / 8)
        headcount = (
            (max(1, ceil(required - 1e-10)) if required else 0)
            if p.pay_contract == "layoffs"
            else 5
        )
        hours = (
            float(headcount)
            if p.pay_contract == "layoffs" and p.capacity_use == "redeploy"
            else required
        )
        wages = 30.0 if p.pay_contract == "salary_protected" else 6 * hours
        capacity = 8 * hours / (1 - automation) if automation < 1 else target
        return LaborPlan(headcount, reference, hours, wages, capacity, target)
    headcount = (
        (max(1, ceil(reference - 1e-10)) if reference else 0) if p.pay_contract == "layoffs" else 5
    )
    hours = reference if p.capacity_use == "take_time" else float(headcount)
    wages = 30.0 if p.pay_contract == "salary_protected" else 6 * hours
    if p.capacity_use == "take_time":
        capacity = 40.0
    else:
        capacity = 8 * hours / (1 - automation) if automation < 1 else float("inf")
    return LaborPlan(headcount, reference, hours, wages, capacity, 40.0)


def worker_hour_allocation(
    plan: LaborPlan, period: int, p: AdoptionParameters
) -> tuple[float, ...]:
    """Allocate guaranteed hours across the original five-person firm roster.

    Rotation preserves total paid hours and production capacity. Whole shifts
    are filled first, with a fractional last shift allowed; cyclic starting
    positions share a constant workload equally over five rounds. This is not
    a rule that makes the whole firm open only in alternating rounds.
    """
    if p.worker_shift_pattern == "smooth":
        return tuple(
            plan.contracted_hours / plan.headcount if index < plan.headcount else 0.0
            for index in range(5)
        )
    hours = [0.0] * 5
    for index in range(5):
        hours[(period + index) % 5] = min(1.0, max(0.0, plan.contracted_hours - index))
    return tuple(hours)


def quote_price(
    previous: float,
    plan: LaborPlan,
    automation: float,
    capital: float,
    p: AdoptionParameters,
    *,
    normal_quantity: float | None = None,
) -> float:
    """Lagged partial adjustment of an additive .25 baseline markup rule.

    Normal unit labor cost uses the declared feasible output reference rather
    than realized sales. Demand below this reference can still produce a loss.
    """
    if normal_quantity is None:
        normal_quantity = min(plan.labor_capacity, capital)
    if not normal_quantity:
        return previous
    labor_cost = plan.contracted_wages / normal_quantity
    ai_cost = p.ai_fee_per_task_hour * automation / 8
    target = max(0.05, 1 - p.price_pass_through * (0.75 - labor_cost - ai_cost))
    return previous + p.price_adjustment_speed * (target - previous)


def quote_prices(
    previous: Pair,
    plans: tuple[LaborPlan, LaborPlan],
    automation: Pair,
    capital: Pair,
    p: AdoptionParameters,
) -> Pair:
    own_capacity = (
        min(plans[0].labor_capacity, capital[0]),
        min(plans[1].labor_capacity, capital[1]),
    )
    normal = own_capacity
    if p.pricing_capacity_rule == "resource_aware":
        needs = (automation[0] * own_capacity[0] / 8, automation[1] * own_capacity[1] / 8)
        quotas = _spend_with_capacity(p.ai_service_capacity, (1.0, 1.0), needs, 0.0)
        values = tuple(
            min(own_capacity[i], quotas[i] * 8 / automation[i])
            if automation[i]
            else own_capacity[i]
            for i in range(2)
        )
        normal = values[0], values[1]
    return (
        quote_price(previous[0], plans[0], automation[0], capital[0], p, normal_quantity=normal[0]),
        quote_price(previous[1], plans[1], automation[1], capital[1], p, normal_quantity=normal[1]),
    )


def _spend_with_capacity(budget: float, prices: Pair, capacities: Pair, elasticity: float) -> Pair:
    spending = [0.0, 0.0]
    remaining = budget
    active = {0, 1}
    for _ in range(2):
        if not active:
            break
        reference = min(prices[i] for i in active)
        weights = {i: (reference / prices[i]) ** elasticity for i in active}
        total = fsum(weights.values())
        if not total or remaining <= 1e-12:
            break
        used = 0.0
        for i in sorted(active):
            room = max(0.0, prices[i] * capacities[i] - spending[i])
            paid = min(remaining * weights[i] / total, room)
            spending[i] += paid
            used += paid
        remaining -= used
        active = {i for i in active if prices[i] * capacities[i] - spending[i] > 1e-10}
    return spending[0], spending[1]


def allocate_expenditure(
    budget: float,
    prices: Pair,
    capacities: Pair,
    elasticity: float,
    *,
    automation_fractions: Pair = (0.0, 0.0),
    ai_service_capacity: float | None = None,
) -> Pair:
    """Price-weighted expenditures; no firm-level optimality is asserted.

    First reallocate individual capacity shortages. If AI is scarce, ration
    AI-using orders proportionally to their task usage, then redirect freed
    spending to nonadopters' spare capacity. Nonadopters never lose production
    merely because another firm lacks AI. Shared AI quotas are a declared rule.
    """
    nonnegative("budget", budget)
    nonnegative("elasticity", elasticity)
    for price, capacity, automation in zip(prices, capacities, automation_fractions, strict=True):
        nonnegative("price", price)
        if not price:
            raise ValueError("prices must be positive")
        nonnegative("capacity", capacity)
        proportion("automation fraction", automation)
    if ai_service_capacity is not None:
        nonnegative("AI service capacity", ai_service_capacity)
    spending = _spend_with_capacity(budget, prices, capacities, elasticity)
    usage = fsum(automation_fractions[i] * spending[i] / prices[i] / 8 for i in range(2))
    if ai_service_capacity is None or usage <= ai_service_capacity:
        return spending
    ratio = ai_service_capacity / usage
    constrained = tuple(
        spending[i] * ratio if automation_fractions[i] else spending[i] for i in range(2)
    )
    spare = tuple(
        max(0.0, capacities[i] - constrained[i] / prices[i]) if not automation_fractions[i] else 0.0
        for i in range(2)
    )
    extra = _spend_with_capacity(
        max(0.0, budget - fsum(constrained)), prices, (spare[0], spare[1]), elasticity
    )
    return constrained[0] + extra[0], constrained[1] + extra[1]


def validated_adoption_schedule(
    shocks: Iterable[AdoptionShock], periods: int
) -> tuple[AdoptionShock, ...]:
    result: dict[tuple[int, str], AdoptionShock] = {}
    for shock in shocks:
        if not isinstance(shock, AdoptionShock) or shock.period >= periods:
            raise ValueError("shock must be an AdoptionShock within the horizon")
        key = shock.period, shock.firm
        if key in result:
            raise ValueError("duplicate firm shock in a period")
        result[key] = shock
    ordered = tuple(result[key] for key in sorted(result))
    previous = dict.fromkeys(CONSUMERS, 0.0)
    for shock in ordered:
        if shock.automation_fraction < previous[shock.firm]:
            raise ValueError("automation availability cannot move backwards")
        previous[shock.firm] = shock.automation_fraction
    return ordered


def simulate_adoption(
    parameters: AdoptionParameters | None = None, *, shocks: Iterable[AdoptionShock] = ()
) -> AdoptionResult:
    from .adoption_engine import run_adoption

    return run_adoption(parameters or AdoptionParameters(), shocks=shocks)

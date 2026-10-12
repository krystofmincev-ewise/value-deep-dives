"""Lagged spending with explicit payments, fixed wages and cash constraints."""

from collections.abc import Iterable
from dataclasses import dataclass, replace
from math import fsum, isclose
from typing import Literal

from .closure import nonnegative, proportion
from .ledger import CashLedger, Payment, PaymentLedger
from .production import SECTORS, ProductionAccounts, allocate_production, firm_ids
from .shocks import ActivePolicy, ParameterShock, validated_schedule


@dataclass(frozen=True)
class DynamicsParameters:
    periods: int = 12
    employed_workers: int = 10
    nominal_wage: float = 6.0
    worker_spending_propensity: float = 1.0
    owner_spending_propensity: float = 0.5
    autonomous_investment: float = 20.0
    initial_real_capital: float = 200.0
    depreciation_rate: float = 0.1
    output_per_capital: float = 1.0
    price: float = 1.0
    initial_worker_cash: float = 60.0
    initial_owner_cash: float = 40.0
    initial_firm_cash: float = 100.0
    initial_lagged_wages: float = 60.0
    initial_lagged_gross_dividends: float = 40.0
    initial_lagged_nominal_gdp: float = 100.0
    owner_equity_financing: bool = True
    owner_to_worker_transfer: float = 0.0
    worker_ownership_share: float = 0.0
    owner_autonomous_consumption: float = 0.0
    utilization_investment_sensitivity: float = 0.0
    target_utilization: float = 0.5
    investment_rule: Literal["fixed_utilization", "replacement_adjustment"] = "fixed_utilization"
    adjustment_speed: float = 0.1
    wage_allocation: Literal["current_value_added", "baseline_shares"] = "current_value_added"

    def __post_init__(self) -> None:
        if type(self.periods) is not int or self.periods < 1:
            raise ValueError("periods must be a positive integer")
        if type(self.employed_workers) is not int or not 0 <= self.employed_workers <= 10:
            raise ValueError("employed_workers must be an integer from zero to ten")
        for name in (
            "nominal_wage",
            "autonomous_investment",
            "initial_real_capital",
            "output_per_capital",
            "price",
            "initial_worker_cash",
            "initial_owner_cash",
            "initial_firm_cash",
            "initial_lagged_wages",
            "initial_lagged_gross_dividends",
            "initial_lagged_nominal_gdp",
            "owner_to_worker_transfer",
            "owner_autonomous_consumption",
            "utilization_investment_sensitivity",
        ):
            nonnegative(name, getattr(self, name))
        for name in (
            "worker_spending_propensity",
            "owner_spending_propensity",
            "depreciation_rate",
            "worker_ownership_share",
            "target_utilization",
            "adjustment_speed",
        ):
            proportion(name, getattr(self, name))
        if self.price == 0:
            raise ValueError("price must be positive")
        if type(self.owner_equity_financing) is not bool:
            raise ValueError("owner_equity_financing must be boolean")
        if self.investment_rule not in ("fixed_utilization", "replacement_adjustment"):
            raise ValueError("unknown investment_rule")
        if self.wage_allocation not in ("current_value_added", "baseline_shares"):
            raise ValueError("unknown wage_allocation")
        if self.investment_rule == "replacement_adjustment" and (
            self.output_per_capital == 0 or self.target_utilization == 0
        ):
            raise ValueError(
                "replacement_adjustment requires positive productivity and target utilization"
            )


@dataclass(frozen=True)
class FirmWageArrears:
    firm_id: str
    contracted_wages: float
    wages_paid: float
    arrears: float


@dataclass(frozen=True)
class PeriodResult:
    period: int
    opening_balances: dict[str, float]
    closing_balances: dict[str, float]
    production: ProductionAccounts
    desired_consumption: float
    cash_financeable_consumption: float
    desired_investment: float
    cash_financeable_investment: float
    equity_contributions: float
    transfer: float
    transfer_shortfall: float
    wages_paid: float
    wage_arrears: float
    owner_dividends: float
    worker_dividends: float
    gross_saving: float
    net_domestic_product: float
    opening_real_capital: float
    closing_real_capital: float
    real_depreciation: float
    capacity_utilization: float
    insolvency: bool
    payments: tuple[Payment, ...]
    active_policy: ActivePolicy
    firm_wage_arrears: tuple[FirmWageArrears, ...]


@dataclass(frozen=True)
class SimulationResult:
    parameters: DynamicsParameters
    money_stock: float
    periods: tuple[PeriodResult, ...]
    stopped_for_insolvency: bool
    shocks: tuple[ParameterShock, ...] = ()


def _consume(ledger: PaymentLedger, period: int, payer: str, amount: float) -> None:
    for number in (1, 2):
        ledger.transfer(
            period, payer, f"consumption_goods_{number}", amount / 2, "final_consumption"
        )


@dataclass(frozen=True)
class _SpendingPlan:
    transfer: float
    equity: float
    desired_investment: float
    investment_budgets: dict[str, float]
    desired_consumption: float
    worker_consumption: float
    owner_consumption: float

    @property
    def financeable_investment(self) -> float:
        return fsum(self.investment_budgets.values())

    @property
    def financeable_consumption(self) -> float:
        return self.worker_consumption + self.owner_consumption


@dataclass(frozen=True)
class _IncomePayments:
    wages: float
    owner_dividends: float
    worker_dividends: float
    firm_wage_arrears: tuple[FirmWageArrears, ...]


_BASELINE_LABOR_SHARES = {
    firm.firm_id: firm.value_added / 100 for firm in allocate_production(80, 20).firms
}


def _allocate_contracted_wages(
    production: ProductionAccounts, parameters: DynamicsParameters
) -> ProductionAccounts:
    """Optionally keep the baseline allocation of labor across the ten firms."""
    if parameters.wage_allocation == "current_value_added":
        return production
    firms = tuple(
        replace(
            firm,
            wage_bill=production.wages * _BASELINE_LABOR_SHARES[firm.firm_id],
            worker_equivalents=parameters.employed_workers * _BASELINE_LABOR_SHARES[firm.firm_id],
            gross_surplus=firm.value_added
            - production.wages * _BASELINE_LABOR_SHARES[firm.firm_id],
        )
        for firm in production.firms
    )
    return replace(production, firms=firms)


def _desired_investment(
    p: DynamicsParameters,
    capital: float,
    previous_utilization: float,
    previous_nominal_gdp: float,
) -> float:
    if p.investment_rule == "replacement_adjustment":
        target_nominal_capital = previous_nominal_gdp / (
            p.output_per_capital * p.target_utilization
        )
        # This equivalent form avoids cancelling large replacement/adjustment
        # terms when gamma == delta and demand becomes very small.
        desired = (
            p.adjustment_speed * target_nominal_capital
            + (p.depreciation_rate - p.adjustment_speed) * p.price * capital
        )
        return max(0.0, desired)
    utilization_response = (
        p.utilization_investment_sensitivity
        * (previous_utilization - p.target_utilization)
        * capital
        * p.price
    )
    return max(0.0, p.autonomous_investment + utilization_response)


def _plan_spending(
    ledger: PaymentLedger,
    period: int,
    p: DynamicsParameters,
    capital: float,
    previous_utilization: float,
    lag_worker_income: float,
    lag_owner_income: float,
    previous_nominal_gdp: float,
) -> _SpendingPlan:
    transfer = min(p.owner_to_worker_transfer, ledger.balance("owners"))
    ledger.transfer(period, "owners", "workers", transfer, "budget_balanced_transfer")
    desired_investment = _desired_investment(p, capital, previous_utilization, previous_nominal_gdp)
    equity = min(desired_investment, ledger.balance("owners")) if p.owner_equity_financing else 0.0
    for firm in firm_ids():
        ledger.transfer(period, "owners", firm, equity / 10, "equity_financing")
    investment_budgets = {
        firm: min(desired_investment / 10, ledger.balance(firm)) for firm in firm_ids()
    }
    desired_worker = p.worker_spending_propensity * (lag_worker_income + transfer)
    desired_owner = (
        p.owner_spending_propensity * max(0.0, lag_owner_income - transfer)
        + p.owner_autonomous_consumption
    )
    return _SpendingPlan(
        transfer,
        equity,
        desired_investment,
        investment_budgets,
        desired_worker + desired_owner,
        min(desired_worker, ledger.balance("workers")),
        min(desired_owner, ledger.balance("owners")),
    )


def _purchase_and_produce(
    ledger: PaymentLedger,
    period: int,
    p: DynamicsParameters,
    plan: _SpendingPlan,
    nominal_capacity: float,
) -> ProductionAccounts:
    investment = min(plan.financeable_investment, nominal_capacity)
    consumption = min(plan.financeable_consumption, max(0.0, nominal_capacity - investment))
    consumption_ratio = (
        consumption / plan.financeable_consumption if plan.financeable_consumption else 0.0
    )
    investment_ratio = (
        investment / plan.financeable_investment if plan.financeable_investment else 0.0
    )
    for firm, amount in plan.investment_budgets.items():
        ledger.transfer(
            period, firm, "capital_orders", amount * investment_ratio, "capital_purchase_funding"
        )
    _consume(ledger, period, "workers", plan.worker_consumption * consumption_ratio)
    _consume(ledger, period, "owners", plan.owner_consumption * consumption_ratio)
    for number in (1, 2):
        ledger.transfer(
            period, "capital_orders", f"capital_goods_{number}", investment / 2, "final_investment"
        )
    production = allocate_production(
        consumption,
        investment,
        wage_bill=p.employed_workers * p.nominal_wage,
        employed_workers=p.employed_workers,
        price=p.price,
        allow_losses=True,
    )
    return _allocate_contracted_wages(production, p)


def _settle_inputs_and_income(
    ledger: PaymentLedger,
    period: int,
    production: ProductionAccounts,
    worker_ownership_share: float,
) -> _IncomePayments:
    for sector in reversed(SECTORS):
        for sale in production.intermediate_sales:
            if sale.buyer.startswith(sector + "_"):
                ledger.transfer(
                    period, sale.buyer, sale.supplier, sale.nominal_value, "intermediate_input"
                )
    wages_paid = owner_dividends = worker_dividends = 0.0
    firm_arrears = []
    for firm in production.firms:
        paid = min(firm.wage_bill, ledger.balance(firm.firm_id))
        ledger.transfer(period, firm.firm_id, "workers", paid, "wages")
        wages_paid += paid
        if firm.wage_bill - paid > 1e-9:
            firm_arrears.append(
                FirmWageArrears(firm.firm_id, firm.wage_bill, paid, firm.wage_bill - paid)
            )
        dividend = min(max(0.0, firm.gross_surplus), ledger.balance(firm.firm_id))
        worker_dividend = dividend * worker_ownership_share
        ledger.transfer(
            period, firm.firm_id, "workers", worker_dividend, "worker_ownership_dividend"
        )
        ledger.transfer(
            period, firm.firm_id, "owners", dividend - worker_dividend, "owner_dividend"
        )
        worker_dividends += worker_dividend
        owner_dividends += dividend - worker_dividend
    return _IncomePayments(wages_paid, owner_dividends, worker_dividends, tuple(firm_arrears))


def simulate(
    parameters: DynamicsParameters | None = None,
    *,
    shocks: Iterable[ParameterShock] = (),
) -> SimulationResult:
    """Run an explicit payment convention; terminate on unpaid wages.

    Transfers and owner equity finance come first, then final purchases,
    downstream-to-upstream input bills, wages, and gross cash dividends.
    Capital orders use a zero-balance purchasing agent. Investment needs cash
    before production; physical shortages give investment first claim.
    There is no bank, overdraft, loan, interest or implicit deficit funding.
    Scheduled shocks change named parameters before spending in their period;
    inherited cash, lagged income, capital and utilization are never reset.
    """
    p = parameters if parameters is not None else DynamicsParameters()
    initial_parameters = p
    schedule = validated_schedule(shocks, p.periods)
    validation_parameters = p
    for shock in schedule:
        validation_parameters = shock.apply(validation_parameters)
    shocks_by_period = {shock.period: shock for shock in schedule}
    ledger = CashLedger(
        {
            "workers": p.initial_worker_cash,
            "owners": p.initial_owner_cash,
            "capital_orders": 0.0,
            **{firm: p.initial_firm_cash / 10 for firm in firm_ids()},
        }
    )
    lag_worker_income = (
        p.initial_lagged_wages + p.worker_ownership_share * p.initial_lagged_gross_dividends
    )
    lag_owner_income = (1 - p.worker_ownership_share) * p.initial_lagged_gross_dividends
    capital = p.initial_real_capital
    previous_utilization = p.target_utilization
    previous_nominal_gdp = p.initial_lagged_nominal_gdp
    results = []
    for period in range(p.periods):
        if period in shocks_by_period:
            p = shocks_by_period[period].apply(p)
        opening = ledger.balances
        first_payment = len(ledger.payments)
        plan = _plan_spending(
            ledger,
            period,
            p,
            capital,
            previous_utilization,
            lag_worker_income,
            lag_owner_income,
            previous_nominal_gdp,
        )
        capacity = p.price * p.output_per_capital * capital
        production = _purchase_and_produce(ledger, period, p, plan, capacity)
        income = _settle_inputs_and_income(ledger, period, production, p.worker_ownership_share)
        depreciation = p.depreciation_rate * capital
        closing_capital = capital - depreciation + production.investment / p.price
        wage_arrears = max(0.0, production.wages - income.wages)
        insolvency = wage_arrears > 1e-9
        closing = ledger.balances
        if not isclose(closing["capital_orders"], 0.0, abs_tol=1e-8):
            raise ArithmeticError("capital purchasing account did not clear")
        utilization = production.nominal_gdp / capacity if capacity else 0.0
        results.append(
            PeriodResult(
                period=period,
                opening_balances=opening,
                closing_balances=closing,
                production=production,
                desired_consumption=plan.desired_consumption,
                cash_financeable_consumption=plan.financeable_consumption,
                desired_investment=plan.desired_investment,
                cash_financeable_investment=plan.financeable_investment,
                equity_contributions=plan.equity,
                transfer=plan.transfer,
                transfer_shortfall=p.owner_to_worker_transfer - plan.transfer,
                wages_paid=income.wages,
                wage_arrears=wage_arrears,
                owner_dividends=income.owner_dividends,
                worker_dividends=income.worker_dividends,
                gross_saving=production.nominal_gdp - production.consumption,
                net_domestic_product=production.nominal_gdp - p.price * depreciation,
                opening_real_capital=capital,
                closing_real_capital=closing_capital,
                real_depreciation=depreciation,
                capacity_utilization=utilization,
                insolvency=insolvency,
                payments=ledger.payments[first_payment:],
                active_policy=ActivePolicy.from_parameters(p),
                firm_wage_arrears=income.firm_wage_arrears,
            )
        )
        capital = closing_capital
        lag_worker_income = income.wages + income.worker_dividends
        lag_owner_income = income.owner_dividends
        previous_utilization = utilization
        previous_nominal_gdp = production.nominal_gdp
        if insolvency:
            break
    return SimulationResult(
        initial_parameters, ledger.money_stock, tuple(results), results[-1].insolvency, schedule
    )

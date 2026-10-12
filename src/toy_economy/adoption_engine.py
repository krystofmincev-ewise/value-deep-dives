"""Small explicit payment phases for the separate adoption experiment."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass
from math import fsum, isclose

from .adoption import (
    CONSUMERS,
    WORKERS,
    AdoptionDecision,
    AdoptionFirmResult,
    AdoptionParameters,
    AdoptionPeriodResult,
    AdoptionResult,
    AdoptionShock,
    LaborPlan,
    Pair,
    allocate_expenditure,
    labor_plan,
    quote_prices,
    validated_adoption_schedule,
    worker_hour_allocation,
)
from .adoption_decisions import choose_adoption
from .ledger import CashLedger


@dataclass(frozen=True)
class _State:
    capital: Pair
    prices: Pair
    worker_income: tuple[float, ...]
    owner_income: float
    nominal_gdp: float
    quantities: Pair


@dataclass(frozen=True)
class _Purchases:
    desired_investment: float
    investments: Pair
    worker_budgets: tuple[float, ...]
    owner_budget: float
    desired_consumption: float
    quantities: Pair
    expenditures: Pair

    @property
    def worker_budget(self) -> float:
        return fsum(self.worker_budgets)

    @property
    def total_budget(self) -> float:
        return self.worker_budget + self.owner_budget


@dataclass(frozen=True)
class _Settlement:
    firms: tuple[AdoptionFirmResult, ...]
    worker_income: tuple[float, ...]
    owner_dividends: float
    worker_dividends: float


def _desired_investment(p: AdoptionParameters, previous_gdp: float) -> float:
    return (
        p.autonomous_investment
        if p.investment_rule == "fixed"
        else p.investment_sales_share * previous_gdp
    )


def _forecast_household_budget(ledger: CashLedger, p: AdoptionParameters, state: _State) -> float:
    equity = min(_desired_investment(p, state.nominal_gdp), ledger.balance("owners"))
    worker = fsum(
        min(p.worker_spending_propensity * income, ledger.balance(account))
        for account, income in zip(WORKERS, state.worker_income, strict=True)
    )
    owner = min(p.owner_spending_propensity * state.owner_income, ledger.balance("owners") - equity)
    return worker + owner


def _buy_equipment(
    ledger: CashLedger, period: int, p: AdoptionParameters, previous_gdp: float
) -> tuple[float, Pair]:
    desired = _desired_investment(p, previous_gdp)
    equity = min(desired, ledger.balance("owners"))
    for firm in CONSUMERS:
        ledger.transfer(period, "owners", firm, equity / 2, "equipment_equity_financing")
    budgets = tuple(min(desired / 2, ledger.balance(firm)) for firm in CONSUMERS)
    actual = min(fsum(budgets), p.equipment_capacity)
    purchases = tuple(actual * budget / fsum(budgets) if actual else 0.0 for budget in budgets)
    for i, firm in enumerate(CONSUMERS):
        ledger.transfer(period, firm, "equipment_producer", purchases[i], "final_investment")
    return desired, (purchases[0], purchases[1])


def _make_purchases(
    ledger: CashLedger,
    period: int,
    p: AdoptionParameters,
    state: _State,
    automation: Pair,
    prices: Pair,
    capacities: Pair,
) -> _Purchases:
    desired_investment, investments = _buy_equipment(ledger, period, p, state.nominal_gdp)
    worker_desired = tuple(p.worker_spending_propensity * income for income in state.worker_income)
    worker_budgets = tuple(
        min(worker_desired[i], ledger.balance(worker)) for i, worker in enumerate(WORKERS)
    )
    owner_desired = p.owner_spending_propensity * state.owner_income
    owner_budget = min(owner_desired, ledger.balance("owners"))
    budget = fsum(worker_budgets) + owner_budget
    spending = allocate_expenditure(
        budget,
        prices,
        capacities,
        p.price_elasticity,
        automation_fractions=automation,
        ai_service_capacity=p.ai_service_capacity,
    )
    households = (*zip(WORKERS, worker_budgets, strict=True), ("owners", owner_budget))
    for i, firm in enumerate(CONSUMERS):
        for household, household_budget in households:
            ledger.transfer(
                period,
                household,
                firm,
                spending[i] * household_budget / budget if budget else 0.0,
                "final_consumption",
            )
    return _Purchases(
        desired_investment,
        investments,
        worker_budgets,
        owner_budget,
        fsum(worker_desired) + owner_desired,
        (spending[0] / prices[0], spending[1] / prices[1]),
        spending,
    )


def _ownership_share(p: AdoptionParameters, period: int) -> float:
    return p.worker_ownership_share if period >= p.worker_ownership_start_period else 0.0


def _distribute(
    ledger: CashLedger, period: int, firm: str, dividend: float, share: float
) -> tuple[float, float]:
    worker = dividend * share
    owner = dividend - worker
    for account in WORKERS:
        ledger.transfer(period, firm, account, worker / 10, "worker_ownership_dividend")
    ledger.transfer(period, firm, "owners", owner, "owner_dividend")
    return worker, owner


def _pay_roster(
    ledger: CashLedger, period: int, firm: str, amounts: tuple[float, ...], purpose: str
) -> None:
    start = CONSUMERS.index(firm) * 5
    for account, amount in zip(WORKERS[start : start + 5], amounts, strict=True):
        ledger.transfer(period, firm, account, amount, purpose)


def _settle_consumer(
    ledger: CashLedger,
    period: int,
    p: AdoptionParameters,
    firm: str,
    automation: float,
    price: float,
    plan: LaborPlan,
    capacity: float,
    quantity: float,
    revenue: float,
    investment: float,
) -> AdoptionFirmResult:
    ai_hours = automation * quantity / 8
    fee = p.ai_fee_per_task_hour * ai_hours
    fee_paid = min(fee, ledger.balance(firm))
    ledger.transfer(period, firm, "ai_provider", fee_paid, "ai_service_intermediate")
    paid = min(plan.contracted_wages, ledger.balance(firm))
    worker_hours = worker_hour_allocation(plan, period, p)
    worker_wages = (
        tuple(paid / plan.headcount if index < plan.headcount else 0.0 for index in range(5))
        if p.pay_contract == "salary_protected" or p.worker_shift_pattern == "smooth"
        else tuple(
            paid * hours / plan.contracted_hours if plan.contracted_hours else 0.0
            for hours in worker_hours
        )
    )
    _pay_roster(ledger, period, firm, worker_wages, "base_wages")
    surplus = revenue - fee - plan.contracted_wages
    bonus = (
        min(p.worker_bonus_share * max(0.0, surplus - 10), ledger.balance(firm))
        if plan.headcount
        else 0.0
    )
    bonus_amounts = tuple(
        bonus / plan.headcount if index < plan.headcount else 0.0 for index in range(5)
    )
    _pay_roster(ledger, period, firm, bonus_amounts, "productivity_bonus")
    dividend = min(max(0.0, surplus - bonus), ledger.balance(firm))
    worker_dividend, owner_dividend = _distribute(
        ledger, period, firm, dividend, _ownership_share(p, period)
    )
    hours = quantity * (1 - automation) / 8
    return AdoptionFirmResult(
        firm,
        automation,
        price,
        plan.headcount,
        plan.reference_required_hours,
        plan.contracted_hours,
        hours,
        plan.contracted_wages,
        paid,
        bonus,
        plan.contracted_wages - paid,
        capacity,
        quantity,
        revenue,
        ai_hours,
        fee,
        fee_paid,
        revenue - fee,
        surplus - bonus,
        owner_dividend,
        worker_dividend,
        investment,
        (paid + bonus) / hours if hours else None,
        plan.planned_quantity,
        worker_hours,
        worker_wages,
        sum(hours > 1e-12 for hours in worker_hours),
    )


def _settle(
    ledger: CashLedger,
    period: int,
    p: AdoptionParameters,
    automation: Pair,
    prices: Pair,
    plans: tuple[LaborPlan, LaborPlan],
    capacities: Pair,
    purchases: _Purchases,
) -> _Settlement:
    first = len(ledger.payments)
    firms = tuple(
        _settle_consumer(
            ledger,
            period,
            p,
            firm,
            automation[i],
            prices[i],
            plans[i],
            capacities[i],
            purchases.quantities[i],
            purchases.expenditures[i],
            purchases.investments[i],
        )
        for i, firm in enumerate(CONSUMERS)
    )
    owner_dividends = fsum(result.owner_dividend for result in firms)
    worker_dividends = fsum(result.worker_dividend for result in firms)
    revenues = (
        ("ai_provider", fsum(result.ai_fees_paid for result in firms)),
        ("equipment_producer", fsum(purchases.investments)),
    )
    for account, revenue in revenues:
        dividend = min(revenue, ledger.balance(account))
        worker, owner = _distribute(ledger, period, account, dividend, _ownership_share(p, period))
        worker_dividends += worker
        owner_dividends += owner
    payments = ledger.payments[first:]
    incomes = tuple(
        fsum(payment.amount for payment in payments if payment.payee == worker)
        for worker in WORKERS
    )
    return _Settlement(firms, incomes, owner_dividends, worker_dividends)


def _record(
    ledger: CashLedger,
    period: int,
    p: AdoptionParameters,
    state: _State,
    opening: dict[str, float],
    first_payment: int,
    purchases: _Purchases,
    settlement: _Settlement,
    decisions: tuple[AdoptionDecision, AdoptionDecision],
) -> AdoptionPeriodResult:
    firms = settlement.firms
    consumption, real_consumption = fsum(purchases.expenditures), fsum(purchases.quantities)
    investment = fsum(purchases.investments)
    wages = fsum(result.contracted_wages + result.bonus_paid for result in firms)
    paid = fsum(result.wages_paid + result.bonus_paid for result in firms)
    fees = fsum(result.ai_fees for result in firms)
    next_capital = (
        (1 - p.depreciation_rate) * state.capital[0] + purchases.investments[0],
        (1 - p.depreciation_rate) * state.capital[1] + purchases.investments[1],
    )
    nominal_gdp = consumption + investment
    value_added = fsum(result.value_added for result in firms) + fees + investment
    if not isclose(value_added, nominal_gdp, abs_tol=1e-8):
        raise ArithmeticError("domestic value added does not reconcile")
    if any(result.wage_arrears > 1e-9 for result in firms):
        stop = "wage_arrears"
    elif any(result.ai_fees - result.ai_fees_paid > 1e-9 for result in firms):
        stop = "ai_invoice_arrears"
    else:
        stop = None
    budget = purchases.total_budget
    worker_share = purchases.worker_budget / budget if budget else 0.0
    closing = ledger.balances
    worker_consumption = tuple(
        consumption * b / budget if budget else 0.0 for b in purchases.worker_budgets
    )
    worker_real = tuple(
        real_consumption * b / budget if budget else 0.0 for b in purchases.worker_budgets
    )
    return AdoptionPeriodResult(
        period,
        firms,
        opening,
        closing,
        ledger.payments[first_payment:],
        nominal_gdp,
        real_consumption + investment,
        consumption,
        real_consumption,
        investment,
        purchases.desired_investment,
        wages,
        paid,
        max(0.0, wages - paid),
        nominal_gdp - wages,
        consumption * worker_share,
        consumption * (1 - worker_share),
        real_consumption * worker_share,
        real_consumption * (1 - worker_share),
        purchases.desired_consumption,
        budget,
        max(0.0, budget - consumption),
        consumption / real_consumption if real_consumption else None,
        fees,
        fees,
        investment,
        investment,
        settlement.owner_dividends,
        settlement.worker_dividends,
        settlement.worker_income,
        worker_consumption,
        worker_real,
        tuple(opening[worker] for worker in WORKERS),
        tuple(closing[worker] for worker in WORKERS),
        state.capital,
        next_capital,
        fsum(result.ai_task_hours for result in firms) / p.ai_service_capacity
        if p.ai_service_capacity
        else 0.0,
        decisions,
        stop,
    )


def run_adoption(p: AdoptionParameters, *, shocks: Iterable[AdoptionShock] = ()) -> AdoptionResult:
    schedule = validated_adoption_schedule(shocks, p.periods)
    ledger = CashLedger(
        {
            **{worker: p.initial_worker_cash / 10 for worker in WORKERS},
            "owners": p.initial_owner_cash,
            **{
                firm: p.initial_firm_cash / 4
                for firm in (*CONSUMERS, "ai_provider", "equipment_producer")
            },
        }
    )
    available = [0.0, 0.0]
    stages = (0.0, 0.0)
    state = _State(
        (p.consumer_capital_capacity, p.consumer_capital_capacity),
        (1.0, 1.0),
        (p.initial_lagged_worker_income / 10,) * 10,
        p.initial_lagged_owner_income,
        p.initial_lagged_nominal_gdp,
        (40.0, 40.0),
    )
    results = []
    for period in range(p.periods):
        for shock in schedule:
            if shock.period == period:
                available[CONSUMERS.index(shock.firm)] = shock.automation_fraction
        stages, decisions = choose_adoption(
            stages,
            (available[0], available[1]),
            state.prices,
            state.capital,
            _forecast_household_budget(ledger, p, state),
            p,
            lagged_quantities=state.quantities,
        )
        plans = (
            labor_plan(stages[0], p, lagged_quantity=state.quantities[0]),
            labor_plan(stages[1], p, lagged_quantity=state.quantities[1]),
        )
        prices = quote_prices(state.prices, plans, stages, state.capital, p)
        capacities = (
            min(plans[0].labor_capacity, state.capital[0]),
            min(plans[1].labor_capacity, state.capital[1]),
        )
        opening, first_payment = ledger.balances, len(ledger.payments)
        purchases = _make_purchases(ledger, period, p, state, stages, prices, capacities)
        settlement = _settle(ledger, period, p, stages, prices, plans, capacities, purchases)
        row = _record(
            ledger, period, p, state, opening, first_payment, purchases, settlement, decisions
        )
        results.append(row)
        state = _State(
            row.closing_capital,
            prices,
            settlement.worker_income,
            settlement.owner_dividends,
            row.nominal_gdp,
            (row.firms[0].quantity, row.firms[1].quantity),
        )
        if row.stop_reason:
            break
    return AdoptionResult(p, schedule, ledger.money_stock, tuple(results), results[-1].stop_reason)

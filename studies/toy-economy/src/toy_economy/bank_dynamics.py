"""Optional finite credit over the existing town, with explicit debt resolution."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field, replace
from math import fsum, isclose

from .bank import BankEvent, BankLedger, BankSnapshot, DebtService, LoanVintage
from .closure import nonnegative, proportion
from .dynamics import (
    DynamicsParameters,
    FirmWageArrears,
    PeriodResult,
    _IncomePayments,
    _plan_spending,
    _purchase_and_produce,
    _SpendingPlan,
)
from .ledger import Payment
from .production import SECTORS, ProductionAccounts, allocate_production, firm_ids
from .shocks import ActivePolicy, ParameterShock, validated_schedule


@dataclass(frozen=True)
class BankParameters:
    economy: DynamicsParameters = field(
        default_factory=lambda: DynamicsParameters(
            periods=40, initial_firm_cash=80.0, wage_allocation="baseline_shares"
        )
    )
    credit_enabled: bool = True
    initial_equity: float = 20.0
    rate_per_round: float = 0.01
    minimum_equity_to_loans: float = 0.1
    payroll_credit_limit_per_firm: float = 15.0
    household_credit_limit: float = 120.0
    credit_start_period: int = 5
    credit_end_period: int = 10
    expected_income_return_period: int | None = 10
    loan_term_rounds: int = 20
    household_consumption_floor: float = 0.0
    household_service_share: float = 0.2
    expected_worker_income_per_round: float = 60.0
    distribute_interest_profit: bool = True

    def __post_init__(self) -> None:
        for name in (
            "initial_equity",
            "rate_per_round",
            "payroll_credit_limit_per_firm",
            "household_credit_limit",
            "household_consumption_floor",
            "expected_worker_income_per_round",
        ):
            nonnegative(name, getattr(self, name))
        proportion("household_service_share", self.household_service_share)
        proportion("minimum_equity_to_loans", self.minimum_equity_to_loans)
        if not self.minimum_equity_to_loans:
            raise ValueError("a positive lending capital ratio is required")
        for name in ("credit_start_period", "credit_end_period"):
            value = getattr(self, name)
            if type(value) is not int or value < 0:
                raise ValueError(f"{name} must be a nonnegative integer")
        if self.credit_end_period < self.credit_start_period:
            raise ValueError("credit window is reversed")
        if type(self.loan_term_rounds) is not int or self.loan_term_rounds < 1:
            raise ValueError("loan_term_rounds must be a positive integer")
        if self.expected_income_return_period is not None and (
            type(self.expected_income_return_period) is not int
            or self.expected_income_return_period < 0
        ):
            raise ValueError("expected income return must be a nonnegative period or None")
        if (
            type(self.credit_enabled) is not bool
            or type(self.distribute_interest_profit) is not bool
        ):
            raise ValueError("credit and distribution switches must be boolean")


@dataclass(frozen=True)
class CreditDecision:
    period: int
    borrower: str
    purpose: str
    requested: float
    advanced: float
    refusal: str | None
    expected_income_per_round: float
    borrower_principal_limit: float
    bank_lending_headroom: float


@dataclass(frozen=True)
class BankPeriodResult:
    economy: PeriodResult
    opening_bank: BankSnapshot
    closing_bank: BankSnapshot
    loans: tuple[LoanVintage, ...]
    credit_decisions: tuple[CreditDecision, ...]
    debt_service: tuple[DebtService, ...]
    bank_events: tuple[BankEvent, ...]
    bank_profit_distribution: float
    worker_consumption: float
    owner_consumption: float


@dataclass(frozen=True)
class BankSimulationResult:
    parameters: BankParameters
    shocks: tuple[ParameterShock, ...]
    opening_bank: BankSnapshot
    periods: tuple[BankPeriodResult, ...]
    stop_reason: str | None


def _lend(
    ledger: BankLedger,
    period: int,
    borrower: str,
    requested: float,
    purpose: str,
    expected_income: float,
    borrower_limit: float,
    p: BankParameters,
) -> CreditDecision:
    s = ledger.snapshot
    headroom = max(0.0, s.equity / p.minimum_equity_to_loans - s.loans)
    reason = None
    advanced = 0.0
    if not p.credit_enabled:
        reason = "credit_disabled"
    elif not p.credit_start_period <= period <= p.credit_end_period:
        reason = "outside_credit_window"
    elif p.expected_income_return_period is None or expected_income <= 0:
        reason = "no_credible_future_income"
    elif s.equity <= 0:
        reason = "bank_capital_depleted"
    else:
        maturity = period + p.loan_term_rounds
        repayment_rounds = max(0, maturity - max(period + 1, p.expected_income_return_period) + 1)
        service_income = expected_income * repayment_rounds
        # Conservative simple-interest allowance on all principal until maturity.
        credible_principal = service_income / (1 + p.rate_per_round * p.loan_term_rounds)
        remaining_limit = max(0.0, min(borrower_limit, credible_principal) - ledger.debt(borrower))
        advanced = min(requested, remaining_limit, headroom)
        if advanced < requested - 1e-9:
            reason = "borrower_or_bank_limit"
        if advanced > 1e-9:
            ledger.originate(
                period,
                borrower,
                advanced,
                maturity_period=maturity,
                rate_per_round=p.rate_per_round,
                purpose=purpose,
            )
    return CreditDecision(
        period,
        borrower,
        purpose,
        requested,
        advanced,
        reason,
        expected_income,
        borrower_limit,
        headroom,
    )


def _support_consumption(
    ledger: BankLedger,
    period: int,
    p: BankParameters,
) -> CreditDecision | None:
    if (
        not p.household_consumption_floor
        or not p.credit_start_period <= period <= p.credit_end_period
    ):
        return None
    requested = max(0.0, p.household_consumption_floor - ledger.balance("workers"))
    if not requested:
        return None
    return _lend(
        ledger,
        period,
        "workers",
        requested,
        "consumption_bridge",
        p.household_service_share * p.expected_worker_income_per_round,
        p.household_credit_limit,
        p,
    )


def _settle_banked_income(
    ledger: BankLedger,
    period: int,
    production: ProductionAccounts,
    policy: DynamicsParameters,
    p: BankParameters,
) -> tuple[_IncomePayments, tuple[CreditDecision, ...], tuple[DebtService, ...]]:
    for sector in reversed(SECTORS):
        for sale in production.intermediate_sales:
            if sale.buyer.startswith(sector + "_"):
                ledger.transfer(
                    period, sale.buyer, sale.supplier, sale.nominal_value, "intermediate_input"
                )
    forecast = allocate_production(80, 20, wage_bill=60)
    expected_surplus = {firm.firm_id: max(0.0, firm.gross_surplus) for firm in forecast.firms}
    wages = owner_dividends = worker_dividends = 0.0
    arrears = []
    decisions = []
    services: list[DebtService] = []
    for firm in production.firms:
        shortfall = max(0.0, firm.wage_bill - ledger.balance(firm.firm_id))
        if shortfall > 1e-9:
            decisions.append(
                _lend(
                    ledger,
                    period,
                    firm.firm_id,
                    shortfall,
                    "payroll_bridge",
                    expected_surplus[firm.firm_id],
                    p.payroll_credit_limit_per_firm,
                    p,
                )
            )
        paid = min(firm.wage_bill, ledger.balance(firm.firm_id))
        ledger.transfer(period, firm.firm_id, "workers", paid, "wages")
        wages += paid
        if firm.wage_bill - paid > 1e-9:
            arrears.append(
                FirmWageArrears(firm.firm_id, firm.wage_bill, paid, firm.wage_bill - paid)
            )
        # Payroll advances are completely spent on wages. Only positive operating
        # surplus can service opening debt, so no new principal rolls old debt.
        services.extend(
            ledger.service_opening_debt(
                period,
                firm.firm_id,
                available_cash=min(ledger.balance(firm.firm_id), max(0.0, firm.gross_surplus)),
            )
        )
        service_paid = fsum(
            s.interest_paid + s.principal_paid for s in services if s.borrower == firm.firm_id
        )
        dividend = min(max(0.0, firm.gross_surplus - service_paid), ledger.balance(firm.firm_id))
        worker_dividend = dividend * policy.worker_ownership_share
        ledger.transfer(
            period, firm.firm_id, "workers", worker_dividend, "worker_ownership_dividend"
        )
        ledger.transfer(
            period, firm.firm_id, "owners", dividend - worker_dividend, "owner_dividend"
        )
        worker_dividends += worker_dividend
        owner_dividends += dividend - worker_dividend
    services.extend(
        ledger.service_opening_debt(
            period, "workers", available_cash=p.household_service_share * (wages + worker_dividends)
        )
    )
    return (
        _IncomePayments(wages, owner_dividends, worker_dividends, tuple(arrears)),
        tuple(decisions),
        tuple(services),
    )


@dataclass(frozen=True)
class _InheritedState:
    capital: float
    utilization: float
    nominal_gdp: float
    worker_income: float
    owner_income: float


def _bank_spending_plan(
    ledger: BankLedger,
    period: int,
    p: DynamicsParameters,
    bp: BankParameters,
    state: _InheritedState,
) -> tuple[_SpendingPlan, CreditDecision | None]:
    plan = _plan_spending(
        ledger,
        period,
        p,
        state.capital,
        state.utilization,
        state.worker_income,
        state.owner_income,
        state.nominal_gdp,
    )
    decision = _support_consumption(ledger, period, bp)
    if bp.household_consumption_floor and bp.credit_start_period <= period <= bp.credit_end_period:
        worker_desired = max(plan.worker_consumption, bp.household_consumption_floor)
        plan = replace(
            plan,
            desired_consumption=max(
                plan.desired_consumption, worker_desired + plan.owner_consumption
            ),
            worker_consumption=min(worker_desired, ledger.balance("workers")),
        )
    return plan, decision


def _economic_record(
    period: int,
    p: DynamicsParameters,
    state: _InheritedState,
    plan: _SpendingPlan,
    production: ProductionAccounts,
    income: _IncomePayments,
    opening: dict[str, float],
    closing: dict[str, float],
    payments: tuple[Payment, ...],
) -> PeriodResult:
    depreciation = p.depreciation_rate * state.capital
    capacity = p.price * p.output_per_capital * state.capital
    wage_arrears = max(0.0, production.wages - income.wages)
    if not isclose(closing["capital_orders"], 0.0, abs_tol=1e-8):
        raise ArithmeticError("capital purchasing account did not clear")
    return PeriodResult(
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
        opening_real_capital=state.capital,
        closing_real_capital=state.capital - depreciation + production.investment / p.price,
        real_depreciation=depreciation,
        capacity_utilization=production.nominal_gdp / capacity if capacity else 0.0,
        insolvency=wage_arrears > 1e-9,
        payments=payments,
        active_policy=ActivePolicy.from_parameters(p),
        firm_wage_arrears=income.firm_wage_arrears,
    )


def _consumption(payments: tuple[Payment, ...], household: str) -> float:
    return fsum(
        payment.amount
        for payment in payments
        if payment.payer == household and payment.purpose == "final_consumption"
    )


def _stop_reason(row: BankPeriodResult) -> str | None:
    if row.economy.wage_arrears > 1e-9:
        return "wage_arrears"
    if row.closing_bank.equity < -1e-9:
        return "bank_insolvent"
    if row.closing_bank.equity <= 1e-9:
        return "bank_capital_depleted"
    return None


def simulate_bank(
    parameters: BankParameters | None = None,
    *,
    shocks: Iterable[ParameterShock] = (),
) -> BankSimulationResult:
    """Separate capitalization reset, then the same purchases and production.

    Owners redeploy20 from their firms' original100 buffers into bank equity.
    Firms keep deposits80 and owners keep deposits40; bank capital is not free. Loans need
    an explicit repayment-income forecast; a false forecast is possible and is
    reported through defaults. No withdrawals, interbank market or insurance.
    """
    bp = parameters if parameters is not None else BankParameters()
    p = bp.economy
    schedule = validated_schedule(shocks, p.periods)
    validation = p
    for shock in schedule:
        validation = shock.apply(validation)
    by_period = {shock.period: shock for shock in schedule}
    balances = {
        "workers": p.initial_worker_cash,
        "owners": p.initial_owner_cash,
        "capital_orders": 0.0,
        **{firm: p.initial_firm_cash / 10 for firm in firm_ids()},
    }
    ledger = BankLedger(
        balances, reserves=fsum(balances.values()) + bp.initial_equity, equity=bp.initial_equity
    )
    opening_bank = ledger.snapshot
    state = _InheritedState(
        p.initial_real_capital,
        p.target_utilization,
        p.initial_lagged_nominal_gdp,
        p.initial_lagged_wages + p.worker_ownership_share * p.initial_lagged_gross_dividends,
        (1 - p.worker_ownership_share) * p.initial_lagged_gross_dividends,
    )
    results = []
    stop = None
    for period in range(p.periods):
        if period in by_period:
            p = by_period[period].apply(p)
        opening, bank_opening = ledger.balances, ledger.snapshot
        first_payment, first_event = len(ledger.payments), len(ledger.events)
        plan, household_decision = _bank_spending_plan(ledger, period, p, bp, state)
        capacity = p.price * p.output_per_capital * state.capital
        production = _purchase_and_produce(ledger, period, p, plan, capacity)
        income, firm_decisions, services = _settle_banked_income(ledger, period, production, p, bp)
        distribution = 0.0
        if bp.distribute_interest_profit:
            distribution = max(0.0, ledger.snapshot.equity - bp.initial_equity)
            if distribution:
                ledger.distribute_profit(period, "owners", distribution)
        payments = ledger.payments[first_payment:]
        row = _economic_record(
            period,
            p,
            state,
            plan,
            production,
            income,
            opening,
            ledger.balances,
            payments,
        )
        decisions = (() if household_decision is None else (household_decision,)) + firm_decisions
        results.append(
            BankPeriodResult(
                row,
                bank_opening,
                ledger.snapshot,
                ledger.loans,
                decisions,
                services,
                ledger.events[first_event:],
                distribution,
                _consumption(payments, "workers"),
                _consumption(payments, "owners"),
            )
        )
        state = _InheritedState(
            row.closing_real_capital,
            row.capacity_utilization,
            production.nominal_gdp,
            income.wages + income.worker_dividends,
            income.owner_dividends + distribution,
        )
        stop = _stop_reason(results[-1])
        if stop:
            break
    return BankSimulationResult(bp, schedule, opening_bank, tuple(results), stop)

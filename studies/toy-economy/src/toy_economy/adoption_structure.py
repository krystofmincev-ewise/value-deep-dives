"""A controlled, cash-funded entry/acquisition experiment, separate from adoption.

Customer budgets and posted prices are held fixed to isolate what was bought:
existing equity changes ownership; newly produced equipment is investment.
There is no strategic takeover valuation, entry optimization or credit here.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import fsum, isclose
from typing import Literal

from .adoption import CONSUMERS, WORKERS
from .closure import nonnegative, proportion
from .ledger import CashLedger, Payment

StructureMode = Literal[
    "control",
    "acquisition_no_synergy",
    "acquisition_then_automation",
    "automation_only",
    "funded_entry",
]


@dataclass(frozen=True)
class StructureParameters:
    mode: StructureMode = "control"
    periods: int = 20
    event_period: int = 5
    automation_period: int = 10
    acquisition_price: float = 20.0
    entry_equipment: float = 20.0
    automation_fraction: float = 0.4
    entry_price: float = 1.0
    price_elasticity: float = 2.0
    ai_fee_per_task_hour: float = 3.0
    ai_service_capacity: float = 10.0
    equipment_capacity: float = 40.0
    entry_depreciation_rate: float = 0.1

    def __post_init__(self) -> None:
        if self.mode not in (
            "control",
            "acquisition_no_synergy",
            "acquisition_then_automation",
            "automation_only",
            "funded_entry",
        ):
            raise ValueError("unknown structure mode")
        if type(self.periods) is not int or self.periods < 1:
            raise ValueError("periods must be a positive integer")
        for name in ("event_period", "automation_period"):
            value = getattr(self, name)
            if type(value) is not int or not 0 <= value < self.periods:
                raise ValueError(f"{name} must be within the horizon")
        if self.automation_period < self.event_period:
            raise ValueError("automation cannot precede the structure event")
        for name in (
            "acquisition_price",
            "entry_equipment",
            "entry_price",
            "price_elasticity",
            "ai_fee_per_task_hour",
            "ai_service_capacity",
            "equipment_capacity",
        ):
            nonnegative(name, getattr(self, name))
        if not self.entry_price or not self.entry_equipment:
            raise ValueError("entry price and equipment order must be positive")
        if self.equipment_capacity < 20:
            raise ValueError("equipment capacity must cover the matched baseline orders20")
        proportion("automation fraction", self.automation_fraction)
        proportion("depreciation rate", self.entry_depreciation_rate)


@dataclass(frozen=True)
class StructureEvent:
    kind: str
    status: str
    amount_paid: float
    recipient: str | None
    reason: str


@dataclass(frozen=True)
class StructureFirmAccount:
    firm_id: str
    consumption_quantity: float
    equipment_quantity: float
    service_task_hours: float
    operating_revenue: float
    intermediate_costs: float
    value_added: float
    contracted_wages: float
    wages_paid: float
    gross_surplus: float
    dividends_paid: float
    financial_dividends_received: float
    investment_paid: float
    actual_human_hours: float


@dataclass(frozen=True)
class StructurePeriod:
    period: int
    opening_balances: dict[str, float]
    closing_balances: dict[str, float]
    payments: tuple[Payment, ...]
    firms: tuple[StructureFirmAccount, ...]
    event: StructureEvent | None
    acquired_consumer_a: bool
    provider_equity_asset_at_purchase_cost: float
    automation_fraction_a: float
    opening_entry_capital: float
    closing_entry_capital: float
    entry_operational: bool
    nominal_gdp: float
    real_gdp: float
    nominal_consumption: float
    real_consumption: float
    investment: float
    capital_depreciation: float
    net_domestic_product: float
    net_investment: float
    incumbent_replacement: float
    desired_entry_replacement: float
    entry_replacement: float
    entry_setup_investment: float
    acquisition_payment_excluded_from_gdp: float
    worker_consumption: float
    owner_consumption: float
    owner_operating_income: float
    owner_asset_sale_receipts: float
    wages_paid: float
    wage_arrears: float
    gross_surplus: float
    actual_human_hours: float
    ai_task_usage: float
    unspent_household_budget: float
    stop_reason: str | None


@dataclass(frozen=True)
class StructureResult:
    parameters: StructureParameters
    money_stock: float
    periods: tuple[StructurePeriod, ...]
    stop_reason: str | None


@dataclass(frozen=True)
class _State:
    acquired: bool = False
    entry_capital: float = 0.0


@dataclass(frozen=True)
class _Orders:
    setup: float
    desired_replacement: float
    replacement: float
    event: StructureEvent | None
    state: _State


def _structure_orders(
    ledger: CashLedger,
    period: int,
    p: StructureParameters,
    state: _State,
) -> _Orders:
    # Original capital remains100 per incumbent: its known20 replacement flow
    # is financed exactly as in the baseline, before customer consumption.
    for firm in CONSUMERS:
        ledger.transfer(period, "owners", firm, 10, "incumbent_equipment_equity")
        ledger.transfer(period, firm, "equipment_producer", 10, "incumbent_replacement")
    event = None
    setup = 0.0
    acquired = state.acquired
    if period == p.event_period and p.mode.startswith("acquisition"):
        if p.acquisition_price <= ledger.balance("ai_provider"):
            ledger.transfer(
                period, "ai_provider", "owners", p.acquisition_price, "existing_equity_purchase"
            )
            acquired = True
            event = StructureEvent(
                "acquisition",
                "funded",
                p.acquisition_price,
                "owners",
                "Existing consumer_a equity; no produced output.",
            )
        else:
            event = StructureEvent(
                "acquisition",
                "refused",
                0,
                None,
                "Provider cash is insufficient; no borrowing or partial purchase.",
            )
    if period == p.event_period and p.mode == "funded_entry":
        cash = ledger.balance("ai_provider")
        if p.entry_equipment > cash:
            event = StructureEvent(
                "entry",
                "refused",
                0,
                None,
                "Provider cash is insufficient for the complete equipment order.",
            )
        elif p.entry_equipment > p.equipment_capacity - 20:
            event = StructureEvent(
                "entry",
                "refused",
                0,
                None,
                "Equipment capacity cannot deliver the complete new installation.",
            )
        else:
            setup = p.entry_equipment
            ledger.transfer(
                period, "ai_provider", "equipment_producer", setup, "entry_setup_equipment"
            )
            event = StructureEvent(
                "entry",
                "funded",
                setup,
                "equipment_producer",
                "New equipment delivered after current production; operational next round.",
            )
    desired = p.entry_depreciation_rate * state.entry_capital
    replacement = min(
        desired, ledger.balance("ai_provider"), max(0, p.equipment_capacity - 20 - setup)
    )
    ledger.transfer(period, "ai_provider", "equipment_producer", replacement, "entry_replacement")
    return _Orders(setup, desired, replacement, event, _State(acquired, state.entry_capital))


def _weighted_spending(
    budget: float,
    prices: tuple[float, ...],
    capacities: tuple[float, ...],
    elasticity: float,
) -> tuple[float, ...]:
    spending = [0.0] * len(prices)
    active = set(range(len(prices)))
    remaining = budget
    for _ in range(len(prices)):
        if not active or remaining <= 1e-12:
            break
        reference = min(prices[i] for i in active)
        weights = {i: (reference / prices[i]) ** elasticity for i in active}
        total = fsum(weights.values())
        used = 0.0
        for i in sorted(active):
            room = max(0, prices[i] * capacities[i] - spending[i])
            paid = min(remaining * weights[i] / total, room)
            spending[i] += paid
            used += paid
        remaining -= used
        active = {i for i in active if prices[i] * capacities[i] - spending[i] > 1e-10}
    return tuple(spending)


def _consumption_orders(
    ledger: CashLedger,
    period: int,
    p: StructureParameters,
    state: _State,
    automation: float,
) -> tuple[tuple[float, ...], tuple[float, ...], float, float]:
    firms = (*CONSUMERS, "ai_provider")
    prices = (1.0, 1.0, p.entry_price)
    # Protected pay and redeployment permit extra production at consumer_a.
    human_capacity = 40 / (1 - automation) if automation < 1 else float("inf")
    capacities = (min(100, human_capacity), 40.0, state.entry_capital)
    fractions = (automation, 0.0, 1.0)
    worker_budget = fsum(min(6, ledger.balance(worker)) for worker in WORKERS)
    owner_budget = min(20, ledger.balance("owners"))
    budget = worker_budget + owner_budget
    spending = _weighted_spending(budget, prices, capacities, p.price_elasticity)
    usage = fsum(fractions[i] * spending[i] / prices[i] / 8 for i in range(3))
    if usage > p.ai_service_capacity:
        ratio = p.ai_service_capacity / usage
        constrained = tuple(
            value * ratio if fractions[i] else value for i, value in enumerate(spending)
        )
        spare = tuple(
            max(0, capacities[i] - constrained[i] / prices[i]) if not fractions[i] else 0.0
            for i in range(3)
        )
        extra = _weighted_spending(
            max(0, budget - fsum(constrained)), prices, spare, p.price_elasticity
        )
        spending = tuple(constrained[i] + extra[i] for i in range(3))
    households = tuple((worker, min(6, ledger.balance(worker))) for worker in WORKERS) + (
        ("owners", owner_budget),
    )
    for i, firm in enumerate(firms):
        for household, amount in households:
            ledger.transfer(
                period,
                household,
                firm,
                spending[i] * amount / budget if budget else 0,
                "final_consumption",
            )
    return spending, tuple(spending[i] / prices[i] for i in range(3)), worker_budget, owner_budget


def _settle_incumbents(
    ledger: CashLedger,
    period: int,
    p: StructureParameters,
    acquired: bool,
    automation: float,
    spending: tuple[float, ...],
    quantities: tuple[float, ...],
) -> tuple[tuple[StructureFirmAccount, ...], float, float]:
    accounts = []
    fees_paid = 0.0
    subsidiary = 0.0
    for i, firm in enumerate(CONSUMERS):
        fraction = automation if i == 0 else 0.0
        service = quantities[i] * fraction / 8
        fee = p.ai_fee_per_task_hour * service
        paid_fee = min(fee, ledger.balance(firm))
        ledger.transfer(period, firm, "ai_provider", paid_fee, "external_ai_service_intermediate")
        fees_paid += paid_fee
        paid_wages = min(30, ledger.balance(firm))
        for worker in WORKERS[i * 5 : (i + 1) * 5]:
            ledger.transfer(period, firm, worker, paid_wages / 5, "protected_wages")
        surplus = spending[i] - fee - 30
        dividend = min(max(0, surplus), ledger.balance(firm))
        if acquired and i == 0:
            recipient, purpose = "ai_provider", "subsidiary_financial_dividend"
            subsidiary += dividend
        else:
            recipient, purpose = "owners", "owner_operating_dividend"
        ledger.transfer(period, firm, recipient, dividend, purpose)
        accounts.append(
            StructureFirmAccount(
                firm,
                quantities[i],
                0,
                0,
                spending[i],
                fee,
                spending[i] - fee,
                30,
                paid_wages,
                surplus,
                dividend,
                0,
                10,
                quantities[i] * (1 - fraction) / 8,
            )
        )
    return tuple(accounts), fees_paid, subsidiary


def _settle_suppliers(
    ledger: CashLedger,
    period: int,
    orders: _Orders,
    accounts: tuple[StructureFirmAccount, ...],
    spending: tuple[float, ...],
    quantities: tuple[float, ...],
    fees_paid: float,
    subsidiary: float,
) -> tuple[StructureFirmAccount, ...]:
    fees_owed = fsum(account.intermediate_costs for account in accounts)
    provider_operating = spending[2] + fees_owed
    provider_dividend = min(
        max(0, spending[2] + fees_paid + subsidiary - orders.replacement),
        ledger.balance("ai_provider"),
    )
    ledger.transfer(period, "ai_provider", "owners", provider_dividend, "owner_operating_dividend")
    investment = 20 + orders.replacement + orders.setup
    ledger.transfer(period, "equipment_producer", "owners", investment, "owner_operating_dividend")
    provider = StructureFirmAccount(
        "ai_provider",
        quantities[2],
        0,
        fsum(
            max(0.0, account.consumption_quantity / 8 - account.actual_human_hours)
            for account in accounts
        )
        + quantities[2] / 8,
        provider_operating,
        0,
        provider_operating,
        0,
        0,
        provider_operating,
        provider_dividend,
        subsidiary,
        orders.replacement + orders.setup,
        0,
    )
    equipment = StructureFirmAccount(
        "equipment_producer",
        0,
        investment,
        0,
        investment,
        0,
        investment,
        0,
        0,
        investment,
        investment,
        0,
        0,
        0,
    )
    return (*accounts, provider, equipment)


def _record_structure(
    ledger: CashLedger,
    period: int,
    p: StructureParameters,
    state: _State,
    orders: _Orders,
    opening: dict[str, float],
    first: int,
    automation: float,
    spending: tuple[float, ...],
    quantities: tuple[float, ...],
    worker_budget: float,
    owner_budget: float,
    accounts: tuple[StructureFirmAccount, ...],
) -> StructurePeriod:
    payments = ledger.payments[first:]
    consumption, real_consumption = fsum(spending), fsum(quantities)
    investment = 20 + orders.replacement + orders.setup
    gdp = consumption + investment
    value_added = fsum(account.value_added for account in accounts)
    if not isclose(gdp, value_added, abs_tol=1e-8):
        raise ArithmeticError("Structure experiment value added does not reconcile")
    wages = fsum(account.wages_paid for account in accounts)
    unpaid_ai = fsum(account.intermediate_costs for account in accounts) - fsum(
        payment.amount
        for payment in payments
        if payment.purpose == "external_ai_service_intermediate"
    )
    stop = (
        "wage_arrears" if 60 - wages > 1e-9 else "ai_invoice_arrears" if unpaid_ai > 1e-9 else None
    )
    acquisition = fsum(
        payment.amount for payment in payments if payment.purpose == "existing_equity_purchase"
    )
    operating = fsum(
        payment.amount
        for payment in payments
        if payment.payee == "owners" and payment.purpose == "owner_operating_dividend"
    )
    budget = worker_budget + owner_budget
    worker_share = worker_budget / budget if budget else 0
    return StructurePeriod(
        period,
        opening,
        ledger.balances,
        payments,
        accounts,
        orders.event,
        orders.state.acquired,
        p.acquisition_price if orders.state.acquired else 0.0,
        automation,
        state.entry_capital,
        (1 - p.entry_depreciation_rate) * state.entry_capital + orders.replacement + orders.setup,
        state.entry_capital > 0,
        gdp,
        real_consumption + investment,
        consumption,
        real_consumption,
        investment,
        20 + orders.desired_replacement,
        gdp - 20 - orders.desired_replacement,
        investment - 20 - orders.desired_replacement,
        20,
        orders.desired_replacement,
        orders.replacement,
        orders.setup,
        acquisition,
        consumption * worker_share,
        consumption * (1 - worker_share),
        operating,
        acquisition,
        wages,
        max(0, 60 - wages),
        gdp - 60,
        fsum(account.actual_human_hours for account in accounts),
        automation * quantities[0] / 8 + quantities[2] / 8,
        max(0, budget - consumption),
        stop,
    )


def simulate_structure(p: StructureParameters | None = None) -> StructureResult:
    p = p or StructureParameters()
    ledger = CashLedger(
        {
            **{worker: 6.0 for worker in WORKERS},
            "owners": 40.0,
            **{firm: 25.0 for firm in (*CONSUMERS, "ai_provider", "equipment_producer")},
        }
    )
    state = _State()
    rows = []
    for period in range(p.periods):
        opening, first = ledger.balances, len(ledger.payments)
        orders = _structure_orders(ledger, period, p, state)
        active = period >= p.automation_period and (
            p.mode == "automation_only"
            or (p.mode == "acquisition_then_automation" and orders.state.acquired)
        )
        automation = p.automation_fraction if active else 0.0
        spending, quantities, worker, owner = _consumption_orders(
            ledger, period, p, state, automation
        )
        accounts, fees, subsidiary = _settle_incumbents(
            ledger, period, p, orders.state.acquired, automation, spending, quantities
        )
        accounts = _settle_suppliers(
            ledger, period, orders, accounts, spending, quantities, fees, subsidiary
        )
        row = _record_structure(
            ledger,
            period,
            p,
            state,
            orders,
            opening,
            first,
            automation,
            spending,
            quantities,
            worker,
            owner,
            accounts,
        )
        rows.append(row)
        state = _State(orders.state.acquired, row.closing_entry_capital)
        if row.stop_reason:
            break
    return StructureResult(p, ledger.money_stock, tuple(rows), rows[-1].stop_reason)

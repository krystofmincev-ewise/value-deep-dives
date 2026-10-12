"""One closed-bank ledger, with explicit loan creation and zero-recovery forgiveness."""

from __future__ import annotations

from dataclasses import dataclass, replace
from math import fsum, isclose

from .closure import nonnegative
from .ledger import Payment


@dataclass(frozen=True)
class BankSnapshot:
    reserves: float
    loans: float
    deposits: float
    equity: float

    @property
    def balance_sheet_error(self) -> float:
        return self.reserves + self.loans - self.deposits - self.equity


@dataclass(frozen=True)
class LoanVintage:
    loan_id: int
    borrower: str
    purpose: str
    originated_period: int
    maturity_period: int
    original_principal: float
    outstanding_principal: float
    rate_per_round: float
    unpaid_interest: float = 0.0
    principal_repaid: float = 0.0
    interest_paid: float = 0.0
    principal_forgiven: float = 0.0
    interest_forgiven: float = 0.0
    last_accrual_period: int = -1
    status: str = "active"


@dataclass(frozen=True)
class DebtService:
    period: int
    loan_id: int
    borrower: str
    opening_principal: float
    interest_accrued: float
    interest_paid: float
    principal_paid: float
    principal_forgiven: float
    interest_forgiven: float
    default: bool


@dataclass(frozen=True)
class BankEvent:
    period: int
    kind: str
    account: str
    amount: float
    loan_id: int | None
    snapshot: BankSnapshot


class BankLedger:
    """All deposits are at one bank; reserves never leave it.

    Loan interest is cash-basis bank income. Unpaid simple interest is an explicit
    contractual memo, not a booked asset or new principal. At maturity, default
    means negotiated zero-recovery forgiveness of both principal and unpaid
    interest: the asset and borrower liability are removed together.
    """

    def __init__(
        self, starting_balances: dict[str, float], *, reserves: float, equity: float
    ) -> None:
        if not starting_balances or any(not name for name in starting_balances):
            raise ValueError("provide nonempty named accounts")
        for name, amount in starting_balances.items():
            nonnegative(name, amount)
        nonnegative("reserves", reserves)
        nonnegative("equity", equity)
        self._balances = dict(starting_balances)
        self._reserves = reserves
        self._equity = equity
        self._opening_equity = equity
        self._loans: dict[int, LoanVintage] = {}
        self._payments: list[Payment] = []
        self._events: list[BankEvent] = []
        self._new_credit_unspent: dict[tuple[int, str], float] = {}
        self._check()

    @property
    def balances(self) -> dict[str, float]:
        return dict(self._balances)

    @property
    def payments(self) -> tuple[Payment, ...]:
        return tuple(self._payments)

    @property
    def events(self) -> tuple[BankEvent, ...]:
        return tuple(self._events)

    @property
    def loans(self) -> tuple[LoanVintage, ...]:
        return tuple(self._loans.values())

    @property
    def snapshot(self) -> BankSnapshot:
        return BankSnapshot(
            self._reserves,
            fsum(loan.outstanding_principal for loan in self._loans.values()),
            fsum(self._balances.values()),
            self._equity,
        )

    def balance(self, account: str) -> float:
        return self._balances[account]

    def debt(self, borrower: str) -> float:
        return fsum(
            loan.outstanding_principal for loan in self._loans.values() if loan.borrower == borrower
        )

    def _check(self) -> None:
        s = self.snapshot
        if not isclose(s.reserves + s.loans, s.deposits + s.equity, abs_tol=1e-8, rel_tol=1e-12):
            raise ArithmeticError("bank balance sheet does not balance")
        if any(amount < -1e-9 for amount in self._balances.values()):
            raise ArithmeticError("negative deposit account")

    def _event(
        self, period: int, kind: str, account: str, amount: float, loan_id: int | None = None
    ) -> None:
        self._check()
        self._events.append(BankEvent(period, kind, account, amount, loan_id, self.snapshot))

    def _period(self, period: int) -> None:
        if type(period) is not int or period < 0:
            raise ValueError("period must be a nonnegative integer")
        if self._events and period < self._events[-1].period:
            raise ValueError("transactions cannot precede the last recorded event")

    def transfer(self, period: int, payer: str, payee: str, amount: float, purpose: str) -> None:
        self._period(period)
        nonnegative("payment", amount)
        if payer not in self._balances or payee not in self._balances:
            raise KeyError("both accounts must exist")
        if payer == payee:
            raise ValueError("payer and payee must differ")
        if amount > self._balances[payer] + 1e-9:
            raise ValueError(f"insufficient deposits in {payer}")
        amount = min(amount, self._balances[payer])
        if amount:
            self._balances[payer] -= amount
            key = (period, payer)
            self._new_credit_unspent[key] = max(
                0.0, self._new_credit_unspent.get(key, 0.0) - amount
            )
            self._balances[payee] += amount
            self._payments.append(Payment(period, payer, payee, amount, purpose))
            self._event(period, "transfer", payer, amount)

    def originate(
        self,
        period: int,
        borrower: str,
        amount: float,
        *,
        maturity_period: int,
        rate_per_round: float,
        purpose: str,
    ) -> LoanVintage:
        self._period(period)
        if type(maturity_period) is not int or maturity_period <= period:
            raise ValueError("maturity must follow origination")
        nonnegative("principal", amount)
        nonnegative("rate_per_round", rate_per_round)
        if not amount or not purpose:
            raise ValueError("loan needs positive principal and a purpose")
        if borrower not in self._balances:
            raise KeyError(borrower)
        loan = LoanVintage(
            len(self._loans) + 1,
            borrower,
            purpose,
            period,
            maturity_period,
            amount,
            amount,
            rate_per_round,
        )
        self._loans[loan.loan_id] = loan
        self._balances[borrower] += amount
        key = (period, borrower)
        self._new_credit_unspent[key] = self._new_credit_unspent.get(key, 0.0) + amount
        self._event(period, "origination", borrower, amount, loan.loan_id)
        return loan

    def repay_principal(self, period: int, loan_id: int, amount: float) -> None:
        self._period(period)
        nonnegative("principal repayment", amount)
        loan = self._loans[loan_id]
        if period <= loan.originated_period:
            raise ValueError("new principal cannot be repaid in its origination round")
        if amount > 0 and loan.rate_per_round > 0 and loan.last_accrual_period != period:
            raise ValueError("accrue current-round interest before repaying principal")
        eligible_cash = max(
            0.0,
            self.balance(loan.borrower)
            - self._new_credit_unspent.get((period, loan.borrower), 0.0),
        )
        if amount > min(loan.outstanding_principal, eligible_cash) + 1e-9:
            raise ValueError("principal repayment exceeds debt or deposits")
        amount = min(amount, loan.outstanding_principal, self.balance(loan.borrower))
        self._balances[loan.borrower] -= amount
        self._loans[loan_id] = replace(
            loan,
            outstanding_principal=loan.outstanding_principal - amount,
            principal_repaid=loan.principal_repaid + amount,
        )
        self._event(period, "principal_repayment", loan.borrower, amount, loan_id)

    def pay_interest(self, period: int, loan_id: int, amount: float) -> None:
        self._period(period)
        nonnegative("interest payment", amount)
        loan = self._loans[loan_id]
        eligible_cash = max(
            0.0,
            self.balance(loan.borrower)
            - self._new_credit_unspent.get((period, loan.borrower), 0.0),
        )
        if amount > min(loan.unpaid_interest, eligible_cash) + 1e-9:
            raise ValueError("interest payment exceeds obligation or deposits")
        amount = min(amount, loan.unpaid_interest, self.balance(loan.borrower))
        self._balances[loan.borrower] -= amount
        self._equity += amount
        self._loans[loan_id] = replace(
            loan,
            unpaid_interest=loan.unpaid_interest - amount,
            interest_paid=loan.interest_paid + amount,
        )
        self._event(period, "interest_payment", loan.borrower, amount, loan_id)

    def forgive(self, period: int, loan_id: int) -> None:
        """At maturity, forgive an active obligation while preserving deposits."""
        self._period(period)
        loan = self._loans[loan_id]
        if loan.status != "active" or (
            loan.outstanding_principal <= 1e-9 and loan.unpaid_interest <= 1e-9
        ):
            raise ValueError("only an active unpaid obligation can be forgiven")
        if period < loan.maturity_period:
            raise ValueError("forgiveness is permitted only at or after contractual maturity")
        if loan.rate_per_round > 0 and loan.last_accrual_period != period:
            raise ValueError("accrue current-round interest before forgiving an obligation")
        self._equity -= loan.outstanding_principal
        self._loans[loan_id] = replace(
            loan,
            outstanding_principal=0.0,
            unpaid_interest=0.0,
            principal_forgiven=loan.principal_forgiven + loan.outstanding_principal,
            interest_forgiven=loan.interest_forgiven + loan.unpaid_interest,
            status="forgiven",
        )
        self._event(
            period, "default_forgiveness", loan.borrower, loan.outstanding_principal, loan_id
        )

    def service_opening_debt(
        self, period: int, borrower: str, *, available_cash: float
    ) -> tuple[DebtService, ...]:
        """Accrue once on opening vintages; interest first, then early principal.

        The caller supplies cash remaining after wages and excludes unspent new
        credit. At contractual maturity the same budget applies: unpaid amounts
        trigger recorded zero-recovery forgiveness, rather than hidden rollover.
        Skipped rounds accrue simple interest through the actual service date
        and resolve then; the simulation engine services debt every round.
        """
        self._period(period)
        nonnegative("available_cash", available_cash)
        eligible_cash = max(
            0.0, self.balance(borrower) - self._new_credit_unspent.get((period, borrower), 0.0)
        )
        budget = min(available_cash, eligible_cash)
        records = []
        for original in tuple(self._loans.values()):
            if original.borrower != borrower or original.status != "active":
                continue
            if original.originated_period >= period:
                continue
            if original.last_accrual_period >= period:
                raise ValueError("debt already serviced this round")
            elapsed = period - max(original.originated_period, original.last_accrual_period)
            accrued = original.outstanding_principal * original.rate_per_round * elapsed
            self._loans[original.loan_id] = replace(
                original,
                unpaid_interest=original.unpaid_interest + accrued,
                last_accrual_period=period,
            )
            interest = min(budget, self._loans[original.loan_id].unpaid_interest)
            self.pay_interest(period, original.loan_id, interest)
            budget -= interest
            principal = min(budget, original.outstanding_principal)
            self.repay_principal(period, original.loan_id, principal)
            budget -= principal
            loan = self._loans[original.loan_id]
            default = period >= loan.maturity_period and (
                loan.outstanding_principal > 1e-9 or loan.unpaid_interest > 1e-9
            )
            forgiven_principal = loan.outstanding_principal if default else 0.0
            forgiven_interest = loan.unpaid_interest if default else 0.0
            if default:
                self.forgive(period, loan.loan_id)
            elif loan.outstanding_principal <= 1e-9 and loan.unpaid_interest <= 1e-9:
                self._loans[loan.loan_id] = replace(loan, status="repaid")
            records.append(
                DebtService(
                    period,
                    loan.loan_id,
                    borrower,
                    original.outstanding_principal,
                    accrued,
                    interest,
                    principal,
                    forgiven_principal,
                    forgiven_interest,
                    default,
                )
            )
        self._check()
        return tuple(records)

    def distribute_profit(self, period: int, recipient: str, amount: float) -> None:
        self._period(period)
        nonnegative("bank dividend", amount)
        if recipient not in self._balances:
            raise KeyError(recipient)
        if amount > max(0.0, self._equity - self._opening_equity) + 1e-9:
            raise ValueError("bank dividend exceeds earned profit above opening capital")
        self._equity -= amount
        self._balances[recipient] += amount
        self._event(period, "bank_profit_distribution", recipient, amount)

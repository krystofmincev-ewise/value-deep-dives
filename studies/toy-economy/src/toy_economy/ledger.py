"""An auditable, conserved-stock cash ledger. There is no credit issuer."""

from dataclasses import dataclass
from math import fsum, isclose
from typing import Protocol

from .closure import nonnegative


@dataclass(frozen=True)
class Payment:
    period: int
    payer: str
    payee: str
    amount: float
    purpose: str


class PaymentLedger(Protocol):
    """Payment surface shared by conserved cash and the separate bank experiment."""

    def balance(self, account: str) -> float: ...

    def transfer(
        self, period: int, payer: str, payee: str, amount: float, purpose: str
    ) -> None: ...


class CashLedger:
    """Existing money moves between named accounts; overdrafts are prohibited."""

    def __init__(self, starting_balances: dict[str, float]) -> None:
        if not starting_balances or any(not name for name in starting_balances):
            raise ValueError("provide nonempty named accounts")
        for name, amount in starting_balances.items():
            nonnegative(name, amount)
        self._balances = dict(starting_balances)
        self._payments: list[Payment] = []
        self._money_stock = fsum(starting_balances.values())

    @property
    def balances(self) -> dict[str, float]:
        return dict(self._balances)

    @property
    def payments(self) -> tuple[Payment, ...]:
        return tuple(self._payments)

    @property
    def money_stock(self) -> float:
        return self._money_stock

    def balance(self, account: str) -> float:
        return self._balances[account]

    def transfer(self, period: int, payer: str, payee: str, amount: float, purpose: str) -> None:
        nonnegative("payment", amount)
        if type(period) is not int or period < 0:
            raise ValueError("period must be a nonnegative integer")
        if payer not in self._balances or payee not in self._balances:
            raise KeyError("both accounts must exist")
        if payer == payee:
            raise ValueError("payer and payee must differ")
        if amount > self._balances[payer] + 1e-9:
            raise ValueError(f"insufficient cash in {payer}")
        amount = min(amount, self._balances[payer])
        if not amount:
            return
        self._balances[payer] -= amount
        self._balances[payee] += amount
        self._payments.append(Payment(period, payer, payee, amount, purpose))
        if not isclose(
            fsum(self._balances.values()), self._money_stock, rel_tol=1e-12, abs_tol=1e-8
        ):
            raise ArithmeticError("cash ledger created or destroyed money")

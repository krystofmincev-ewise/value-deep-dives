"""Validated, persistent policy changes for the existing cash-flow experiment."""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, fields, replace
from typing import TYPE_CHECKING, Literal

from .closure import nonnegative, proportion

if TYPE_CHECKING:
    from .dynamics import DynamicsParameters


@dataclass(frozen=True)
class ParameterShock:
    """Change only named fields at the start of one zero-indexed model period."""

    period: int
    employed_workers: int | None = None
    autonomous_investment: float | None = None
    owner_spending_propensity: float | None = None
    owner_equity_financing: bool | None = None
    price: float | None = None
    owner_to_worker_transfer: float | None = None
    utilization_investment_sensitivity: float | None = None
    investment_rule: Literal["fixed_utilization", "replacement_adjustment"] | None = None
    adjustment_speed: float | None = None
    wage_allocation: Literal["current_value_added", "baseline_shares"] | None = None
    worker_ownership_share: float | None = None

    def __post_init__(self) -> None:
        if type(self.period) is not int or self.period < 0:
            raise ValueError("shock period must be a nonnegative integer")
        if self.employed_workers is not None and (
            type(self.employed_workers) is not int or not 0 <= self.employed_workers <= 10
        ):
            raise ValueError("shock employed_workers must be an integer from zero to ten")
        if (
            self.owner_equity_financing is not None
            and type(self.owner_equity_financing) is not bool
        ):
            raise ValueError("shock owner_equity_financing must be boolean")
        for name in (
            "autonomous_investment",
            "price",
            "owner_to_worker_transfer",
            "utilization_investment_sensitivity",
        ):
            value = getattr(self, name)
            if value is not None:
                nonnegative(f"shock {name}", value)
        if self.price == 0:
            raise ValueError("shock price must be positive")
        if self.owner_spending_propensity is not None:
            proportion("shock owner_spending_propensity", self.owner_spending_propensity)
        if self.worker_ownership_share is not None:
            proportion("shock worker_ownership_share", self.worker_ownership_share)
        if self.adjustment_speed is not None:
            proportion("shock adjustment_speed", self.adjustment_speed)
        if self.investment_rule is not None and self.investment_rule not in (
            "fixed_utilization",
            "replacement_adjustment",
        ):
            raise ValueError("unknown shock investment_rule")
        if self.wage_allocation is not None and self.wage_allocation not in (
            "current_value_added",
            "baseline_shares",
        ):
            raise ValueError("unknown shock wage_allocation")
        if all(
            getattr(self, field.name) is None for field in fields(self) if field.name != "period"
        ):
            raise ValueError("a shock must change at least one named parameter")

    def apply(self, parameters: DynamicsParameters) -> DynamicsParameters:
        changes = {
            field.name: getattr(self, field.name)
            for field in fields(self)
            if field.name != "period" and getattr(self, field.name) is not None
        }
        return replace(parameters, **changes)


@dataclass(frozen=True)
class ActivePolicy:
    """Current policy inputs, without misleading copies of initial conditions."""

    employed_workers: int
    autonomous_investment: float
    owner_spending_propensity: float
    owner_equity_financing: bool
    price: float
    owner_to_worker_transfer: float
    utilization_investment_sensitivity: float
    investment_rule: Literal["fixed_utilization", "replacement_adjustment"]
    adjustment_speed: float
    wage_allocation: Literal["current_value_added", "baseline_shares"]
    worker_ownership_share: float

    @classmethod
    def from_parameters(cls, parameters: DynamicsParameters) -> ActivePolicy:
        return cls(**{field.name: getattr(parameters, field.name) for field in fields(cls)})


def validated_schedule(
    shocks: Iterable[ParameterShock], periods: int
) -> tuple[ParameterShock, ...]:
    """Canonicalize order; never silently merge multiple changes at one period."""
    if type(periods) is not int or periods < 1:
        raise ValueError("periods must be a positive integer")
    by_period: dict[int, ParameterShock] = {}
    for shock in shocks:
        if not isinstance(shock, ParameterShock):
            raise ValueError("schedule entries must be ParameterShock instances")
        if shock.period >= periods:
            raise ValueError("shock period must be inside the simulation horizon")
        if shock.period in by_period:
            raise ValueError("combine changes at the same period in one ParameterShock")
        by_period[shock.period] = shock
    return tuple(by_period[period] for period in sorted(by_period))

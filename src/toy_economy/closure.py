"""A transparent simultaneous-income closure, independent of cash timing."""

from dataclasses import dataclass
from math import isfinite
from typing import Literal


def nonnegative(name: str, value: float) -> None:
    """Reject NaN, infinity and negative numerical model inputs."""
    if not isfinite(value) or value < 0:
        raise ValueError(f"{name} must be finite and nonnegative")


def proportion(name: str, value: float) -> None:
    nonnegative(name, value)
    if value > 1:
        raise ValueError(f"{name} must be at most one")


@dataclass(frozen=True)
class ClosureParameters:
    employed_workers: int = 10
    nominal_wage: float = 6.0
    worker_spending_propensity: float = 1.0
    owner_spending_propensity: float = 0.5
    investment: float = 20.0
    price: float = 1.0
    real_capacity: float = 200.0
    owner_to_worker_transfer: float = 0.0

    def __post_init__(self) -> None:
        if type(self.employed_workers) is not int or not 0 <= self.employed_workers <= 10:
            raise ValueError("employed_workers must be an integer from zero to ten")
        for name in ("nominal_wage", "investment", "real_capacity", "owner_to_worker_transfer"):
            nonnegative(name, getattr(self, name))
        nonnegative("price", self.price)
        if self.price == 0:
            raise ValueError("price must be positive")
        proportion("worker_spending_propensity", self.worker_spending_propensity)
        proportion("owner_spending_propensity", self.owner_spending_propensity)


@dataclass(frozen=True)
class OutputAccounts:
    nominal_gdp: float
    real_gdp: float
    consumption: float
    investment: float
    wages: float
    gross_surplus: float
    worker_disposable_income: float
    owner_disposable_income: float
    worker_consumption: float
    owner_consumption: float
    saving: float
    planned_consumption: float
    unfilled_consumption: float
    unfilled_investment: float
    capacity_utilization: float


@dataclass(frozen=True)
class EquilibriumResult:
    status: Literal[
        "equilibrium",
        "capacity_rationed",
        "indeterminate",
        "no_stationary_equilibrium",
        "infeasible_income",
    ]
    unconstrained_nominal_gdp: float | None
    accounts: OutputAccounts | None
    explanation: str


def solve_equilibrium(parameters: ClosureParameters | None = None) -> EquilibriumResult:
    """Solve Y=C+I; capacity rationing gives investment first claim on output.

    An indeterminate result deliberately has no chosen GDP. Nonnegative owner
    disposable income is required: losses need a separate financing closure.
    """
    p = parameters if parameters is not None else ClosureParameters()
    wages = p.employed_workers * p.nominal_wage
    worker_income = wages + p.owner_to_worker_transfer
    nominal_capacity = p.price * p.real_capacity
    nonnegative("computed worker income", worker_income)
    nonnegative("computed nominal capacity", nominal_capacity)
    numerator = (
        p.worker_spending_propensity - p.owner_spending_propensity
    ) * worker_income + p.investment
    denominator = 1 - p.owner_spending_propensity
    if denominator == 0:
        if numerator == 0:
            if worker_income > nominal_capacity:
                return EquilibriumResult(
                    "infeasible_income",
                    None,
                    None,
                    "Capacity cannot cover wages and the owner-funded transfer.",
                )
            return EquilibriumResult(
                "indeterminate",
                None,
                None,
                "Income spending is an identity; feasible GDP requires another demand or production rule.",
            )
        return EquilibriumResult(
            "no_stationary_equilibrium",
            None,
            None,
            "The specified propensities and investment have no finite stationary income solution.",
        )
    desired = numerator / denominator
    if not isfinite(desired):
        raise ValueError("computed equilibrium exceeds finite numerical range")
    output = min(desired, nominal_capacity)
    if output < worker_income - 1e-10:
        return EquilibriumResult(
            "infeasible_income",
            desired,
            None,
            "Output cannot cover wages and the owner-funded transfer without negative owner income.",
        )
    output = max(0.0, output)
    owner_income = max(0.0, output - worker_income)
    planned_worker = p.worker_spending_propensity * worker_income
    planned_owner = p.owner_spending_propensity * owner_income
    planned_consumption = planned_worker + planned_owner
    investment = min(p.investment, output)
    consumption = max(0.0, output - investment)
    worker_consumption = (
        consumption * (planned_worker / planned_consumption) if planned_consumption else 0.0
    )
    owner_consumption = consumption - worker_consumption
    accounts = OutputAccounts(
        nominal_gdp=output,
        real_gdp=output / p.price,
        consumption=consumption,
        investment=investment,
        wages=wages,
        gross_surplus=output - wages,
        worker_disposable_income=worker_income,
        owner_disposable_income=owner_income,
        worker_consumption=worker_consumption,
        owner_consumption=owner_consumption,
        saving=output - consumption,
        planned_consumption=planned_consumption,
        unfilled_consumption=max(0.0, planned_consumption - consumption),
        unfilled_investment=p.investment - investment,
        capacity_utilization=output / nominal_capacity if nominal_capacity else 0.0,
    )
    constrained = desired > output + 1e-10
    return EquilibriumResult(
        "capacity_rationed" if constrained else "equilibrium",
        desired,
        accounts,
        "Fixed prices; investment is served first and consumption is rationed proportionally."
        if constrained
        else "Simultaneous income and spending; investment is assumed financeable.",
    )


def investment_for_target(target_nominal_gdp: float, parameters: ClosureParameters) -> float:
    """Minimum nonnegative autonomous investment for the *unconstrained* target.

    This arithmetic is neither financing nor a capacity expansion promise.
    """
    nonnegative("target_nominal_gdp", target_nominal_gdp)
    if parameters.owner_spending_propensity == 1:
        raise ValueError("owner propensity one does not identify a unique stationary GDP target")
    if target_nominal_gdp > parameters.price * parameters.real_capacity:
        raise ValueError("target GDP exceeds nominal capacity")
    worker_income = (
        parameters.employed_workers * parameters.nominal_wage + parameters.owner_to_worker_transfer
    )
    if target_nominal_gdp < worker_income:
        raise ValueError("target GDP cannot cover wages and transfer")
    return max(
        0.0,
        (1 - parameters.owner_spending_propensity) * target_nominal_gdp
        - (parameters.worker_spending_propensity - parameters.owner_spending_propensity)
        * worker_income,
    )

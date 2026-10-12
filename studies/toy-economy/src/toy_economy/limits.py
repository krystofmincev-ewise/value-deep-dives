"""Automated capital with diminishing returns: GDP and consumption maxima.

Physical allocation only: owners purchase all consumption and investment at
clearing prices. No household access, cash-payment or adoption game is solved.
"""

from dataclasses import dataclass
from math import isfinite, pow

from .closure import nonnegative, proportion


@dataclass(frozen=True)
class LimitParameters:
    productivity: float = 100 / (200**0.5)
    capital_exponent: float = 0.5
    depreciation: float = 0.1
    resource_ceiling: float | None = None

    def __post_init__(self) -> None:
        nonnegative("productivity", self.productivity)
        if self.productivity == 0:
            raise ValueError("productivity must be positive")
        if not isfinite(self.capital_exponent) or not 0 < self.capital_exponent < 1:
            raise ValueError("capital exponent must be strictly between zero and one")
        if not isfinite(self.depreciation) or not 0 < self.depreciation <= 1:
            raise ValueError("depreciation must be positive and at most one")
        if self.resource_ceiling is not None:
            nonnegative("resource ceiling", self.resource_ceiling)
            if self.resource_ceiling == 0:
                raise ValueError("resource ceiling must be positive")


@dataclass(frozen=True)
class StationaryAllocation:
    investment_share: float
    capital: float
    real_gdp: float
    real_consumption: float
    replacement_investment: float
    net_domestic_product: float
    resource_bound: bool


@dataclass(frozen=True)
class GrowthLimit:
    maximum_stationary_gdp: StationaryAllocation
    maximum_stationary_consumption: StationaryAllocation
    minimum_share_to_maximize_gdp: float


def production(capital: float, p: LimitParameters) -> float:
    nonnegative("capital", capital)
    output = p.productivity * pow(capital, p.capital_exponent)
    nonnegative("output", output)
    return min(output, p.resource_ceiling) if p.resource_ceiling is not None else output


def stationary_allocation(share: float, p: LimitParameters | None = None) -> StationaryAllocation:
    """Positive steady state of K'=(1-d)K+s*f(K), or zero when s=0.

    K=0 is also absorbing. This positive branch presumes a positive initial
    stock and convergence; it does not manufacture capital out of nothing.
    """
    p = p or LimitParameters()
    proportion("investment share", share)
    capital = (share * p.productivity / p.depreciation) ** (1 / (1 - p.capital_exponent))
    if p.resource_ceiling is not None:
        capital = min(capital, share * p.resource_ceiling / p.depreciation)
    output = production(capital, p)
    investment = p.depreciation * capital
    return StationaryAllocation(
        share,
        capital,
        output,
        output - investment,
        investment,
        output - investment,
        p.resource_ceiling is not None and output >= p.resource_ceiling - 1e-9,
    )


def growth_limits(p: LimitParameters | None = None) -> GrowthLimit:
    """Analytical global maxima over steady states with investment share in [0,1].

    They are conditional on fixed technology, depreciation and resource ceiling.
    They are not maxima over all technologies, arbitrary starting capital,
    transition paths, discounted welfare, or the real economy.
    """
    p = p or LimitParameters()
    minimum_share = 1.0
    golden_capital = (p.capital_exponent * p.productivity / p.depreciation) ** (
        1 / (1 - p.capital_exponent)
    )
    if p.resource_ceiling is not None:
        ceiling_capital = (p.resource_ceiling / p.productivity) ** (1 / p.capital_exponent)
        minimum_share = min(1.0, p.depreciation * ceiling_capital / p.resource_ceiling)
        golden_capital = min(golden_capital, ceiling_capital)
    golden_output = production(golden_capital, p)
    golden_share = p.depreciation * golden_capital / golden_output
    return GrowthLimit(
        stationary_allocation(minimum_share, p),
        stationary_allocation(golden_share, p),
        minimum_share,
    )


@dataclass(frozen=True)
class CapitalPeriod:
    period: int
    opening_capital: float
    real_gdp: float
    consumption: float
    investment: float
    depreciation: float
    closing_capital: float


def capital_path(
    share: float,
    parameters: LimitParameters | None = None,
    *,
    initial_capital: float = 200.0,
    periods: int = 500,
) -> tuple[CapitalPeriod, ...]:
    """Simulate physical capital; a zero initial stock stays zero."""
    p = parameters or LimitParameters()
    proportion("investment share", share)
    nonnegative("initial capital", initial_capital)
    if type(periods) is not int or not 1 <= periods <= 5000:
        raise ValueError("periods must be an integer from one to 5000")
    capital = initial_capital
    rows: list[CapitalPeriod] = []
    for t in range(periods):
        output = production(capital, p)
        investment = share * output
        depreciation = p.depreciation * capital
        closing = capital - depreciation + investment
        rows.append(
            CapitalPeriod(
                t, capital, output, output - investment, investment, depreciation, closing
            )
        )
        capital = closing
    return tuple(rows)

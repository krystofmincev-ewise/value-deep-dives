"""A fully automated AK counterexample, not an estimated growth forecast.

Owners demand and purchase all output, directing a fixed fraction into new
capital. A flexible uniform price clears the growing physical supply against
constant nominal expenditure. This is a real allocation with explicit assumed
market clearing; the separate cash model tests payment timing instead.
"""

from dataclasses import dataclass

from .closure import nonnegative, proportion


@dataclass(frozen=True)
class GrowthParameters:
    initial_capital: float = 200.0
    output_per_capital: float = 0.5
    investment_share: float = 0.3
    depreciation_rate: float = 0.1
    nominal_expenditure: float = 100.0
    periods: int = 21

    def __post_init__(self) -> None:
        for name in ("initial_capital", "output_per_capital", "nominal_expenditure"):
            nonnegative(name, getattr(self, name))
            if getattr(self, name) == 0:
                raise ValueError(f"{name} must be positive")
        proportion("investment_share", self.investment_share)
        proportion("depreciation_rate", self.depreciation_rate)
        if type(self.periods) is not int or not 1 <= self.periods <= 1000:
            raise ValueError("periods must be an integer between one and 1000")


@dataclass(frozen=True)
class GrowthPeriod:
    period: int
    real_capital: float
    real_gdp: float
    real_consumption: float
    real_investment: float
    real_depreciation: float
    real_net_domestic_product: float
    price: float
    nominal_gdp: float
    nominal_wages: float
    real_growth_rate: float


def automated_growth(parameters: GrowthParameters | None = None) -> tuple[GrowthPeriod, ...]:
    """Return a path under Y=aK and K'=(1-d)K+sY.

    Labor, government, trade and borrowing are absent. All capital belongs to
    owner households; they save by purchasing newly produced capital, rather
    than by accumulating idle money or buying existing shares. The technology
    assumes no diminishing returns or scarce complementary inputs.
    """
    p = parameters or GrowthParameters()
    capital = p.initial_capital
    growth_rate = p.investment_share * p.output_per_capital - p.depreciation_rate
    rows: list[GrowthPeriod] = []
    for period in range(p.periods):
        output = p.output_per_capital * capital
        if output <= 0:
            raise ValueError("A zero-output period has no positive market-clearing price")
        nonnegative("real output", output)
        investment = p.investment_share * output
        depreciation = p.depreciation_rate * capital
        rows.append(
            GrowthPeriod(
                period=period,
                real_capital=capital,
                real_gdp=output,
                real_consumption=output - investment,
                real_investment=investment,
                real_depreciation=depreciation,
                real_net_domestic_product=output - depreciation,
                price=p.nominal_expenditure / output,
                nominal_gdp=p.nominal_expenditure,
                nominal_wages=0.0,
                real_growth_rate=growth_rate,
            )
        )
        capital = capital - depreciation + investment
    return tuple(rows)

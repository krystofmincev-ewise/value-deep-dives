"""A five-sector input-output economy with two firms per sector.

Coefficients are monetary input shares at a common price index. Supplier rows,
buyer columns: A[i][j] is input i bought per unit of sector j gross output.
"""

from dataclasses import dataclass
from math import isclose

from .closure import nonnegative

SECTORS = (
    "raw_materials",
    "processing",
    "intermediates_services",
    "consumption_goods",
    "capital_goods",
)
INPUT_COEFFICIENTS = (
    (0.0, 0.40, 0.10, 0.00, 0.00),
    (0.0, 0.00, 0.20, 0.20, 0.20),
    (0.0, 0.00, 0.00, 0.30, 0.30),
    (0.0, 0.00, 0.00, 0.00, 0.00),
    (0.0, 0.00, 0.00, 0.00, 0.00),
)


@dataclass(frozen=True)
class IntermediateSale:
    supplier: str
    buyer: str
    nominal_value: float


@dataclass(frozen=True)
class FirmAccounts:
    firm_id: str
    sector: str
    gross_turnover: float
    real_gross_output: float
    intermediate_expenses: float
    value_added: float
    wage_bill: float
    worker_equivalents: float
    gross_surplus: float


@dataclass(frozen=True)
class ProductionAccounts:
    firms: tuple[FirmAccounts, ...]
    intermediate_sales: tuple[IntermediateSale, ...]
    gross_turnover: float
    intermediate_expenses: float
    nominal_gdp: float
    real_gdp: float
    consumption: float
    investment: float
    wages: float
    gross_surplus: float


def firm_ids() -> tuple[str, ...]:
    return tuple(f"{sector}_{number}" for sector in SECTORS for number in (1, 2))


def allocate_production(
    consumption: float,
    investment: float,
    *,
    wage_bill: float = 0.0,
    employed_workers: int = 10,
    price: float = 1.0,
    allow_losses: bool = False,
) -> ProductionAccounts:
    """Trace an acyclic Leontief chain and allocate each sector equally.

    Workers divide their time across firms in proportion to value added; these
    are worker-equivalents, not ten separate jobs at every firm. At zero output
    contracted wages are shared equally. Technology/capacity is exogenous.
    """
    for name, value in (
        ("consumption", consumption),
        ("investment", investment),
        ("wage_bill", wage_bill),
        ("price", price),
    ):
        nonnegative(name, value)
    if price == 0:
        raise ValueError("price must be positive")
    if type(employed_workers) is not int or not 0 <= employed_workers <= 10:
        raise ValueError("employed_workers must be an integer from zero to ten")
    if employed_workers == 0 and wage_bill > 0:
        raise ValueError("a positive wage bill requires employed workers")
    gdp = consumption + investment
    if not allow_losses and wage_bill > gdp + 1e-10:
        raise ValueError(
            "wages exceed aggregate value added; financing losses needs an explicit cash model"
        )
    outputs = [0.0, 0.0, 0.0, consumption, investment]
    for supplier in range(4, -1, -1):
        outputs[supplier] += sum(
            INPUT_COEFFICIENTS[supplier][buyer] * outputs[buyer] for buyer in range(supplier + 1, 5)
        )
    firms = []
    for sector_index, sector in enumerate(SECTORS):
        output = outputs[sector_index] / 2
        expenses = sum(row[sector_index] for row in INPUT_COEFFICIENTS) * output
        value_added = output - expenses
        weight = value_added / gdp if gdp else 0.1
        for number in (1, 2):
            wages = wage_bill * weight
            firms.append(
                FirmAccounts(
                    f"{sector}_{number}",
                    sector,
                    output,
                    output / price,
                    expenses,
                    value_added,
                    wages,
                    employed_workers * weight,
                    value_added - wages,
                )
            )
    sales = tuple(
        IntermediateSale(
            f"{SECTORS[supplier]}_{s}",
            f"{SECTORS[buyer]}_{b}",
            INPUT_COEFFICIENTS[supplier][buyer] * outputs[buyer] / 4,
        )
        for supplier in range(5)
        for buyer in range(5)
        if INPUT_COEFFICIENTS[supplier][buyer]
        for s in (1, 2)
        for b in (1, 2)
    )
    turnover = sum(firm.gross_turnover for firm in firms)
    intermediate = sum(firm.intermediate_expenses for firm in firms)
    if not isclose(turnover - intermediate, gdp, abs_tol=1e-9):
        raise ArithmeticError("input-output accounts do not reconcile")
    return ProductionAccounts(
        tuple(firms),
        sales,
        turnover,
        intermediate,
        gdp,
        gdp / price,
        consumption,
        investment,
        wage_bill,
        gdp - wage_bill,
    )

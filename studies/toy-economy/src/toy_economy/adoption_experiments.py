"""Matched adoption schedules and honest finite-horizon experiment summaries."""

from __future__ import annotations

from dataclasses import dataclass
from math import fsum
from random import Random
from statistics import mean

from .adoption import CONSUMERS, AdoptionResult, AdoptionShock, Consumer


@dataclass(frozen=True)
class RunSummary:
    recorded_periods: int
    requested_periods: int
    stop_reason: str | None
    last_recorded_period: int
    last_nominal_gdp: float
    last_real_gdp: float
    last_real_consumption: float
    last_worker_real_consumption: float
    last_owner_real_consumption: float
    last_wages_paid: float
    last_headcount: int
    last_contracted_hours: float
    last_actual_hours: float
    last_ai_revenue: float
    minimum_real_gdp: float
    maximum_real_gdp: float
    peak_real_gdp_period: int
    cumulative_real_gdp_through_stop: float
    cumulative_worker_real_consumption_through_stop: float
    maximum_money_error: float
    maximum_value_added_error: float


def ramp_schedule(
    *,
    start: int = 5,
    spacing: int = 5,
    stages: tuple[float, ...] = (0.2, 0.4),
    firms: tuple[Consumer, ...] = CONSUMERS,
) -> tuple[AdoptionShock, ...]:
    """Same task requirements; timing and adopting firms are explicit levers."""
    if type(start) is not int or start < 0 or type(spacing) is not int or spacing < 1:
        raise ValueError("start must be nonnegative and spacing a positive integer")
    if len(set(firms)) != len(firms):
        raise ValueError("duplicate adopting firm")
    if any(b < a for a, b in zip(stages, stages[1:], strict=False)):
        raise ValueError("adoption availability must not move backwards")
    return tuple(
        AdoptionShock(start + spacing * i, firm, stage)
        for i, stage in enumerate(stages)
        for firm in firms
    )


def random_availability(
    seed: int,
    *,
    periods: int = 80,
    start: int = 5,
    probability: float = 0.25,
    stages: tuple[float, ...] = (0.2, 0.4, 0.6, 0.8),
    firms: tuple[Consumer, ...] = CONSUMERS,
) -> tuple[AdoptionShock, ...]:
    """Pre-draw each firm's opportunities, independent of scenario decisions.

    The random object is availability timing, not an empirical probability of AI
    adoption. Firm channels use fixed integer seeds, independent of iteration
    order, implementation-dependent hash(), or a policy's number of decisions.
    """
    if type(seed) is not int or seed < 0:
        raise ValueError("seed must be a nonnegative integer")
    if type(periods) is not int or periods < 1 or not 0 <= start < periods:
        raise ValueError("start must be inside a positive horizon")
    if not 0 <= probability <= 1:
        raise ValueError("probability must be between zero and one")
    ramp_schedule(start=start, stages=stages, firms=firms)
    rows = []
    for channel, firm in enumerate(CONSUMERS):
        rng = Random(seed * 1_000_003 + 10_007 * (channel + 1))
        draws = tuple(rng.random() for _ in range(periods))
        if firm not in firms:
            continue
        stage_index = 0
        for period in range(start, periods):
            if stage_index < len(stages) and draws[period] < probability:
                rows.append(AdoptionShock(period, firm, stages[stage_index]))
                stage_index += 1
    return tuple(sorted(rows, key=lambda row: (row.period, row.firm)))


def summarize(result: AdoptionResult) -> RunSummary:
    rows = result.periods
    last = rows[-1]
    worker_real = [
        row.real_consumption * row.worker_consumption / row.nominal_consumption
        if row.nominal_consumption
        else 0.0
        for row in rows
    ]
    owner_real = last.real_consumption - worker_real[-1]
    peak = max(rows, key=lambda row: row.real_gdp)
    return RunSummary(
        len(rows),
        result.parameters.periods,
        result.stop_reason,
        last.period,
        last.nominal_gdp,
        last.real_gdp,
        last.real_consumption,
        worker_real[-1],
        owner_real,
        fsum(f.wages_paid + f.bonus_paid for f in last.firms),
        sum(f.headcount for f in last.firms),
        fsum(f.contracted_hours for f in last.firms),
        fsum(f.actual_hours for f in last.firms),
        last.ai_provider_revenue,
        min(row.real_gdp for row in rows),
        peak.real_gdp,
        peak.period,
        fsum(row.real_gdp for row in rows),
        fsum(worker_real),
        max(abs(fsum(row.closing_balances.values()) - result.money_stock) for row in rows),
        max(
            abs(
                row.nominal_gdp
                - fsum(f.value_added for f in row.firms)
                - row.ai_provider_revenue
                - row.equipment_producer_revenue
            )
            for row in rows
        ),
    )


def empirical_quantile(values: tuple[float, ...], probability: float) -> float:
    """Linear interpolation between ordered observations (inclusive endpoints)."""
    if not values or not 0 <= probability <= 1:
        raise ValueError("nonempty values and a probability in [0,1] required")
    ordered = sorted(values)
    position = (len(ordered) - 1) * probability
    lower = int(position)
    upper = min(lower + 1, len(ordered) - 1)
    return ordered[lower] + (position - lower) * (ordered[upper] - ordered[lower])


def distribution(values: tuple[float, ...]) -> dict[str, float] | None:
    if not values:
        return None
    return {
        "mean": mean(values),
        "p05": empirical_quantile(values, 0.05),
        "median": empirical_quantile(values, 0.5),
        "p95": empirical_quantile(values, 0.95),
        "min": min(values),
        "max": max(values),
    }

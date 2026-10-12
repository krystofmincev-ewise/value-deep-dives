"""Reproducible scheduled-shock paths, compact sensitivity and freeze sweeps."""

from collections.abc import Iterable
from dataclasses import asdict, dataclass, fields, replace
from math import fsum, log
from typing import Any

from .dynamics import DynamicsParameters, SimulationResult, simulate
from .shocks import ParameterShock

ShockCase = tuple[DynamicsParameters, tuple[ParameterShock, ...]]


def layoff_schedule(
    layoffs: int, spacing: int = 0, *, first_period: int = 5
) -> tuple[ParameterShock, ...]:
    """Zero spacing means abrupt; otherwise remove one job each spacing periods."""
    if type(layoffs) is not int or not 0 <= layoffs <= 10:
        raise ValueError("layoffs must be an integer from zero to ten")
    if type(spacing) is not int or spacing < 0:
        raise ValueError("spacing must be a nonnegative integer")
    if type(first_period) is not int or first_period < 0:
        raise ValueError("first_period must be a nonnegative integer")
    if not spacing or not layoffs:
        return (ParameterShock(first_period, employed_workers=10 - layoffs),)
    return tuple(
        ParameterShock(first_period + spacing * index, employed_workers=9 - index)
        for index in range(layoffs)
    )


def _combine_schedules(*schedules: Iterable[ParameterShock]) -> tuple[ParameterShock, ...]:
    """Explicitly combine orthogonal experiments, rejecting conflicting changes."""
    changes: dict[int, dict[str, Any]] = {}
    for schedule in schedules:
        for shock in schedule:
            updates = changes.setdefault(shock.period, {})
            for field in fields(shock):
                value = getattr(shock, field.name)
                if field.name != "period" and value is not None:
                    if field.name in updates and updates[field.name] != value:
                        raise ValueError("conflicting experimental changes at the same period")
                    updates[field.name] = value
    return tuple(ParameterShock(period, **changes[period]) for period in sorted(changes))


def investment_freeze_schedule(
    duration: int, *, first_period: int = 5
) -> tuple[ParameterShock, ...]:
    """Suspend the fixed-investment intercept, then restore its baseline twenty."""
    if type(duration) is not int or duration < 1:
        raise ValueError("freeze duration must be a positive integer")
    return (
        ParameterShock(first_period, autonomous_investment=0),
        ParameterShock(first_period + duration, autonomous_investment=20),
    )


def shock_cases() -> dict[str, ShockCase]:
    """Named paths used by the report; all have five initial baseline periods."""
    fixed = DynamicsParameters(periods=160)
    replacement = replace(fixed, investment_rule="replacement_adjustment", adjustment_speed=0.1)
    cases: dict[str, ShockCase] = {"baseline": (fixed, ())}
    for label, spacing in (("abrupt", 0), ("gradual_fast", 1), ("gradual_slow", 5)):
        schedule = layoff_schedule(10, spacing)
        suffix = (
            "abrupt_zero_jobs"
            if label == "abrupt"
            else f"gradual_zero_jobs_{label.removeprefix('gradual_')}"
        )
        cases[f"fixed_{suffix}"] = fixed, schedule
        cases[f"replacement_{suffix}"] = replacement, schedule
        finance_stop = _combine_schedules(
            schedule, (ParameterShock(5, owner_equity_financing=False),)
        )
        cases[f"financing_stop_{suffix}"] = replacement, finance_stop
        positive_endpoint = _combine_schedules(
            layoff_schedule(5, spacing), investment_freeze_schedule(17)
        )
        cases[f"freeze_17_{label}_five_jobs_no_firm_cash"] = (
            replace(fixed, initial_firm_cash=0),
            positive_endpoint,
        )
    for propensity in (0.2, 0.5, 0.7, 0.79, 0.8, 0.81, 0.9, 1.0):
        name = f"replacement_zero_jobs_owner_spending_{round(propensity * 100):03d}"
        cases[name] = (
            replacement,
            (ParameterShock(5, employed_workers=0, owner_spending_propensity=propensity),),
        )
    for gamma in (0.1, 0.35, 0.45, 0.6):
        cases[f"replacement_five_jobs_gamma_{round(gamma * 100):03d}"] = (
            replace(replacement, adjustment_speed=gamma),
            layoff_schedule(5),
        )
    for ownership in (0.3, 0.59, 0.6, 0.61, 0.8, 1.0):
        cases[f"zero_jobs_ownership_{round(ownership * 100):02d}"] = (
            replacement,
            (ParameterShock(5, employed_workers=0, worker_ownership_share=ownership),),
        )
    cases.update(
        {
            "financing_stop_ten_jobs": (fixed, (ParameterShock(5, owner_equity_financing=False),)),
            "freeze_5_recovery_current_wages": (fixed, investment_freeze_schedule(5)),
            "freeze_5_failure_fixed_wage_shares": (
                replace(fixed, wage_allocation="baseline_shares"),
                investment_freeze_schedule(5),
            ),
            "freeze_15_recovery_firm_cash_100": (fixed, investment_freeze_schedule(15)),
            "freeze_16_failure_firm_cash_100": (fixed, investment_freeze_schedule(16)),
            "freeze_17_late_failure_firm_cash_200": (
                replace(fixed, initial_firm_cash=200),
                investment_freeze_schedule(17),
            ),
            "replacement_half_price_at_5": (replacement, (ParameterShock(5, price=0.5),)),
        }
    )
    return cases


@dataclass(frozen=True)
class ShockSummary:
    case: str
    requested_periods: int
    completed_periods: int
    first_insolvency_period: int | None
    last_scheduled_shock_period: int | None
    all_scheduled_shocks_reached: bool
    terminal_employed_workers: int
    terminal_nominal_gdp: float
    terminal_real_gdp: float
    minimum_nominal_gdp: float
    terminal_investment: float
    first_cash_investment_shortfall_period: int | None
    first_zero_investment_period: int | None
    terminal_real_capital: float
    terminal_worker_consumption: float
    terminal_owner_consumption: float
    terminal_consumption: float
    cumulative_worker_consumption: float
    cumulative_total_consumption: float
    cumulative_nominal_gdp: float
    peak_wage_arrears: float
    terminal_firm_arrears: tuple[str, ...]
    terminal_owner_cash: float
    terminal_worker_cash: float
    terminal_firm_cash: float
    initial_money_stock: float
    maximum_closing_money_error: float


def summarize_shock_run(name: str, result: SimulationResult) -> ShockSummary:
    last = result.periods[-1]
    consumption = tuple(
        fsum(
            payment.amount
            for payment in period.payments
            if payment.payer == "workers" and payment.purpose == "final_consumption"
        )
        for period in result.periods
    )
    owner_consumption = fsum(
        payment.amount
        for payment in last.payments
        if payment.payer == "owners" and payment.purpose == "final_consumption"
    )
    shortfalls = tuple(
        row.period
        for row in result.periods
        if row.cash_financeable_investment + 1e-8 < row.desired_investment
    )
    zero_investment = tuple(row.period for row in result.periods if row.production.investment == 0)
    last_shock = result.shocks[-1].period if result.shocks else None
    return ShockSummary(
        case=name,
        requested_periods=result.parameters.periods,
        completed_periods=len(result.periods),
        first_insolvency_period=last.period if result.stopped_for_insolvency else None,
        last_scheduled_shock_period=last_shock,
        all_scheduled_shocks_reached=last_shock is None or last.period >= last_shock,
        terminal_employed_workers=last.active_policy.employed_workers,
        terminal_nominal_gdp=last.production.nominal_gdp,
        terminal_real_gdp=last.production.real_gdp,
        minimum_nominal_gdp=min(row.production.nominal_gdp for row in result.periods),
        terminal_investment=last.production.investment,
        first_cash_investment_shortfall_period=shortfalls[0] if shortfalls else None,
        first_zero_investment_period=zero_investment[0] if zero_investment else None,
        terminal_real_capital=last.closing_real_capital,
        terminal_worker_consumption=consumption[-1],
        terminal_owner_consumption=owner_consumption,
        terminal_consumption=last.production.consumption,
        cumulative_worker_consumption=fsum(consumption),
        cumulative_total_consumption=fsum(row.production.consumption for row in result.periods),
        cumulative_nominal_gdp=fsum(row.production.nominal_gdp for row in result.periods),
        peak_wage_arrears=max(row.wage_arrears for row in result.periods),
        terminal_firm_arrears=tuple(row.firm_id for row in last.firm_wage_arrears),
        terminal_owner_cash=last.closing_balances["owners"],
        terminal_worker_cash=last.closing_balances["workers"],
        terminal_firm_cash=fsum(
            value
            for account, value in last.closing_balances.items()
            if account not in ("workers", "owners", "capital_orders")
        ),
        initial_money_stock=result.money_stock,
        maximum_closing_money_error=max(
            abs(fsum(row.closing_balances.values()) - result.money_stock) for row in result.periods
        ),
    )


def _sensitivity_summaries() -> list[dict[str, Any]]:
    base = DynamicsParameters(periods=120, investment_rule="replacement_adjustment")
    records = []
    for layoffs in (0, 5, 10):
        for gamma in (0.05, 0.1, 0.2, 0.35, 0.45, 0.6):
            for firm_cash in (20, 50, 100, 200):
                for spacing in (0, 1, 5):
                    name = f"replacement_L{layoffs}_g{gamma:g}_cash{firm_cash}_spacing{spacing}"
                    parameters = replace(base, adjustment_speed=gamma, initial_firm_cash=firm_cash)
                    result = simulate(parameters, shocks=layoff_schedule(layoffs, spacing))
                    records.append(
                        {
                            "layoffs": layoffs,
                            "adjustment_speed": gamma,
                            "initial_firm_cash": firm_cash,
                            "spacing": spacing,
                            "summary": asdict(summarize_shock_run(name, result)),
                        }
                    )
    fixed = replace(base, investment_rule="fixed_utilization")
    for beta in (0, 0.1, 0.3, 0.6, 1):
        for spacing in (0, 1, 5):
            name = f"fixed_L10_beta{beta:g}_spacing{spacing}"
            result = simulate(
                replace(fixed, utilization_investment_sensitivity=beta),
                shocks=layoff_schedule(10, spacing),
            )
            records.append(
                {
                    "layoffs": 10,
                    "utilization_investment_sensitivity": beta,
                    "spacing": spacing,
                    "summary": asdict(summarize_shock_run(name, result)),
                }
            )
    return records


def _freeze_threshold_row(parameters: DynamicsParameters) -> dict[str, Any]:
    attempts = tuple(
        (duration, simulate(parameters, shocks=investment_freeze_schedule(duration)))
        for duration in range(1, 31)
    )
    successes = tuple(
        duration for duration, result in attempts if not result.stopped_for_insolvency
    )
    failures = tuple(
        (duration, result) for duration, result in attempts if result.stopped_for_insolvency
    )
    first_duration, first_result = failures[0]
    pre_shock_baseline = all(
        abs(row.production.nominal_gdp - 100) < 1e-8 for row in first_result.periods[:5]
    )
    return {
        "initial_firm_cash": parameters.initial_firm_cash,
        "initial_owner_cash": parameters.initial_owner_cash,
        "initial_worker_cash": parameters.initial_worker_cash,
        "initial_money_stock": first_result.money_stock,
        "pre_shock_gdp_100_verified": pre_shock_baseline,
        "largest_surviving_tested_duration": max(successes),
        "first_failing_duration": first_duration,
        "failure_boundary_monotone_in_tested_range": max(successes) < first_duration,
        "tested_durations": [1, 30],
        "periods": parameters.periods,
        "first_failure": asdict(
            summarize_shock_run(
                f"freeze_{first_duration}_firm_cash_{parameters.initial_firm_cash:g}_owner_cash_{parameters.initial_owner_cash:g}",
                first_result,
            )
        ),
    }


def freeze_thresholds() -> list[dict[str, Any]]:
    """Enumerate durations 1–30 with owner cash40 and varying aggregate money."""
    return [
        _freeze_threshold_row(DynamicsParameters(periods=160, initial_firm_cash=firm_cash))
        for firm_cash in (0, 5, 10, 20, 50, 100, 200)
    ]


def freeze_thresholds_fixed_money() -> list[dict[str, Any]]:
    """Keep inherited money200; move cash between firms and owners."""
    return [
        _freeze_threshold_row(
            DynamicsParameters(
                periods=160, initial_firm_cash=firm_cash, initial_owner_cash=140 - firm_cash
            )
        )
        for firm_cash in (0, 20, 50, 100)
    ]


def _compact_result(result: SimulationResult) -> dict[str, Any]:
    serialized = asdict(result)
    for period in serialized["periods"]:
        payments = period.pop("payments")
        for household in ("workers", "owners"):
            name = "worker_consumption" if household == "workers" else "owner_consumption"
            period[name] = fsum(
                payment["amount"]
                for payment in payments
                if payment["payer"] == household and payment["purpose"] == "final_consumption"
            )
        period["production"].pop("firms")
        period["production"].pop("intermediate_sales")
    return serialized


def build_shock_results() -> dict[str, Any]:
    """Return JSON-safe original assumptions, compact named paths, and sweeps."""
    simulations = {
        name: simulate(parameters, shocks=schedule)
        for name, (parameters, schedule) in shock_cases().items()
    }
    decay = []
    for owner_propensity in (0.2, 0.5, 0.7, 0.79, 0.8, 0.81, 0.9, 1.0):
        factor = owner_propensity + 0.2
        decay.append(
            {
                "owner_spending_propensity": owner_propensity,
                "unconstrained_multiplier": factor,
                "unconstrained_half_life_periods": log(0.5) / log(factor)
                if 0 < factor < 1
                else None,
            }
        )
    return {
        "schema_version": 1,
        "status": "uncalibrated_educational_experiment",
        "units": "invented currency and base-price output; zero-indexed model periods are not calendar years",
        "schedule_semantics": "start-of-period persistent parameter changes; inherited cash, capital, lagged income and lagged GDP are preserved",
        "insolvency_semantics": "stop at first unpaid contracted wage; zero payroll mechanically prevents wage-arrears failure, even if output tends to zero",
        "cumulative_semantics": "cumulative output and consumption cover completed periods through the stop, not the full requested horizon when insolvency occurs",
        "investment_rules": {
            "fixed_utilization": "max(0, I0 + beta*(u_previous-u_target)*K*p)",
            "replacement_adjustment": "max(0, delta*p*K + gamma*(Y_previous/(a*u_target)-p*K)); ignores I0 and beta",
        },
        "paths": {name: _compact_result(result) for name, result in simulations.items()},
        "summaries": {
            name: asdict(summarize_shock_run(name, result)) for name, result in simulations.items()
        },
        "sensitivity_summaries": _sensitivity_summaries(),
        "freeze_thresholds": freeze_thresholds(),
        "freeze_thresholds_fixed_money": freeze_thresholds_fixed_money(),
        "zero_jobs_replacement_gamma_01_unconstrained_decay": decay,
    }

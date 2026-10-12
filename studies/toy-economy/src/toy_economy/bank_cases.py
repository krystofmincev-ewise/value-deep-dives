"""Reproducible bank experiments and compact, JSON-safe teaching records."""

from dataclasses import asdict, replace
from math import fsum
from typing import Any

from .bank_dynamics import BankParameters, BankSimulationResult, simulate_bank
from .dynamics import DynamicsParameters
from .shock_cases import investment_freeze_schedule
from .shocks import ParameterShock

BankCase = tuple[BankParameters, tuple[ParameterShock, ...]]


def bank_cases() -> dict[str, BankCase]:
    firm = BankParameters()
    freeze = investment_freeze_schedule(5)
    household = replace(
        firm,
        economy=replace(firm.economy, periods=60, wage_allocation="current_value_added"),
        payroll_credit_limit_per_firm=0.0,
        household_consumption_floor=60.0,
        credit_end_period=7,
        expected_income_return_period=7,
    )
    gap = (ParameterShock(5, employed_workers=0), ParameterShock(7, employed_workers=10))
    permanent = (ParameterShock(5, employed_workers=0),)
    return {
        "baseline_no_credit": (replace(firm, credit_enabled=False), ()),
        "baseline_credit_unused": (firm, ()),
        "equipment_freeze_5_no_credit": (replace(firm, credit_enabled=False), freeze),
        "equipment_freeze_5_zero_interest": (replace(firm, rate_per_round=0.0), freeze),
        "equipment_freeze_5_one_percent": (firm, freeze),
        "equipment_freeze_10_finite_credit": (
            replace(firm, credit_end_period=15, expected_income_return_period=15),
            investment_freeze_schedule(10),
        ),
        "equipment_permanent_optimistic_forecast": (
            firm,
            (ParameterShock(5, autonomous_investment=0),),
        ),
        "worker_gap_2_no_credit": (replace(household, credit_enabled=False), gap),
        "worker_gap_2_zero_interest": (replace(household, rate_per_round=0.0), gap),
        "worker_gap_2_one_percent": (household, gap),
        "worker_gap_2_partial_bridge_limit_20": (
            replace(household, household_credit_limit=20.0),
            gap,
        ),
        "worker_income_restored_by_ownership": (
            household,
            (ParameterShock(5, employed_workers=0), ParameterShock(7, worker_ownership_share=0.6)),
        ),
        "worker_permanent_loss_prudent_refusal": (
            replace(household, expected_income_return_period=None),
            permanent,
        ),
        "worker_permanent_loss_forecast_error_limit_20": (
            replace(household, household_credit_limit=20.0),
            permanent,
        ),
        "worker_permanent_loss_forecast_error_limit_120": (household, permanent),
        "worker_gap_capacity_constraint": (
            replace(household, economy=replace(household.economy, output_per_capital=0.4)),
            gap,
        ),
        "worker_gap_capacity_constraint_no_credit": (
            replace(
                household,
                credit_enabled=False,
                economy=replace(household.economy, output_per_capital=0.4),
            ),
            gap,
        ),
    }


def summarize_bank_run(name: str, result: BankSimulationResult) -> dict[str, Any]:
    last = result.periods[-1]
    services = [service for row in result.periods for service in row.debt_service]
    decisions = [decision for row in result.periods for decision in row.credit_decisions]
    loans = last.loans
    advanced = fsum(loan.original_principal for loan in loans)
    repaid = fsum(loan.principal_repaid for loan in loans)
    forgiven = fsum(loan.principal_forgiven for loan in loans)
    unpaid_interest = fsum(loan.unpaid_interest for loan in loans)
    defaults = sum(service.default for service in services)
    if defaults:
        outcome = "default_with_forgiveness"
    elif result.stop_reason:
        outcome = (
            "stopped_with_unresolved_obligations"
            if last.closing_bank.loans
            else "stopped_without_credit"
        )
    elif last.closing_bank.loans > 1e-8 or unpaid_interest > 1e-8:
        outcome = "outstanding_at_horizon"
    elif advanced:
        outcome = "fully_repaid"
    elif any(decision.refusal for decision in decisions):
        outcome = "credit_refused"
    else:
        outcome = "credit_unused"
    debt_free = [
        row.economy.period
        for row in result.periods
        if advanced
        and any(loan.originated_period <= row.economy.period for loan in loans)
        and row.closing_bank.loans <= 1e-8
        and fsum(loan.unpaid_interest for loan in row.loans) <= 1e-8
    ]
    return {
        "name": name,
        "outcome": outcome,
        "stop_reason": result.stop_reason,
        "last_completed_period": last.economy.period,
        "requested_periods": result.parameters.economy.periods,
        "initial_reserves": result.opening_bank.reserves,
        "initial_deposits": result.opening_bank.deposits,
        "initial_bank_equity": result.opening_bank.equity,
        "initial_firm_deposits": result.parameters.economy.initial_firm_cash,
        "total_principal_advanced": advanced,
        "total_principal_repaid": repaid,
        "total_principal_forgiven": forgiven,
        "total_interest_paid": fsum(loan.interest_paid for loan in loans),
        "total_interest_forgiven": fsum(loan.interest_forgiven for loan in loans),
        "terminal_outstanding_principal": last.closing_bank.loans,
        "terminal_unpaid_interest": unpaid_interest,
        "terminal_total_debt_owed": last.closing_bank.loans + unpaid_interest,
        "default_count": defaults,
        "refusal_count": sum(decision.refusal is not None for decision in decisions),
        "first_debt_free_period": debt_free[0] if debt_free and not defaults else None,
        "minimum_bank_equity": min(row.closing_bank.equity for row in result.periods),
        "maximum_outstanding_principal": max(row.closing_bank.loans for row in result.periods),
        "minimum_gdp": min(row.economy.production.nominal_gdp for row in result.periods),
        "terminal_gdp": last.economy.production.nominal_gdp,
        "terminal_worker_consumption": last.worker_consumption,
        "terminal_owner_consumption": last.owner_consumption,
        "cumulative_worker_consumption_through_stop": fsum(
            row.worker_consumption for row in result.periods
        ),
        "cumulative_gdp_through_stop": fsum(
            row.economy.production.nominal_gdp for row in result.periods
        ),
        "total_bank_profit_distributed": fsum(
            row.bank_profit_distribution for row in result.periods
        ),
        "maximum_transaction_balance_sheet_error": max(
            abs(event.snapshot.balance_sheet_error)
            for row in result.periods
            for event in row.bank_events
        ),
        "bank_capital_depleted": last.closing_bank.equity <= 1e-9,
        "bank_insolvent": last.closing_bank.equity < -1e-9,
        "wage_arrears": last.economy.wage_arrears,
    }


def compact_bank_result(result: BankSimulationResult) -> dict[str, Any]:
    periods = []
    for row in result.periods:
        serialized = asdict(row.economy)
        serialized.pop("payments")
        serialized["production"].pop("intermediate_sales")
        # Keep firm rows: sector liquidity and payroll bridge amounts matter.
        serialized.update(
            {
                "opening_bank": asdict(row.opening_bank),
                "closing_bank": asdict(row.closing_bank),
                "loans": [asdict(loan) for loan in row.loans],
                "credit_decisions": [asdict(decision) for decision in row.credit_decisions],
                "debt_service": [asdict(service) for service in row.debt_service],
                "bank_profit_distribution": row.bank_profit_distribution,
                "worker_consumption": row.worker_consumption,
                "owner_consumption": row.owner_consumption,
                "unpaid_interest": fsum(loan.unpaid_interest for loan in row.loans),
                "total_debt_owed": row.closing_bank.loans
                + fsum(loan.unpaid_interest for loan in row.loans),
            }
        )
        periods.append(serialized)
    return {
        "parameters": asdict(result.parameters),
        "shocks": [asdict(shock) for shock in result.shocks],
        "opening_bank": asdict(result.opening_bank),
        "stop_reason": result.stop_reason,
        "periods": periods,
    }


def bank_sensitivity_summaries() -> list[dict[str, Any]]:
    rows = []
    base = BankParameters(
        economy=DynamicsParameters(
            periods=60, initial_firm_cash=80, wage_allocation="baseline_shares"
        )
    )
    for duration in (2, 3, 5, 7, 10, 15):
        for rate in (0.0, 0.01, 0.03):
            for credit_limit in (5.0, 15.0):
                p = replace(
                    base,
                    rate_per_round=rate,
                    payroll_credit_limit_per_firm=credit_limit,
                    credit_end_period=5 + duration,
                    expected_income_return_period=5 + duration,
                )
                result = simulate_bank(p, shocks=investment_freeze_schedule(duration))
                row = summarize_bank_run("equipment_freeze_sensitivity", result)
                row.update(
                    {
                        "duration": duration,
                        "rate_per_round": rate,
                        "payroll_limit_per_firm": credit_limit,
                    }
                )
                rows.append(row)
    for equity in (5.0, 10.0, 20.0, 40.0):
        p = replace(
            base,
            initial_equity=equity,
            economy=replace(base.economy, initial_firm_cash=100 - equity),
        )
        result = simulate_bank(p, shocks=investment_freeze_schedule(5))
        row = summarize_bank_run("equity_redistribution_fixed_reserves", result)
        row.update({"equity": equity, "rate_per_round": p.rate_per_round, "duration": 5})
        rows.append(row)
    household = bank_cases()["worker_gap_2_one_percent"][0]
    for gap in (1, 2, 3, 4):
        for rate in (0.0, 0.01, 0.03):
            for limit in (60.0, 120.0):
                p = replace(
                    household,
                    rate_per_round=rate,
                    household_credit_limit=limit,
                    credit_end_period=5 + gap,
                    expected_income_return_period=5 + gap,
                )
                schedule = (
                    ParameterShock(5, employed_workers=0),
                    ParameterShock(5 + gap, employed_workers=10),
                )
                row = summarize_bank_run(
                    "worker_gap_sensitivity", simulate_bank(p, shocks=schedule)
                )
                row.update({"gap_rounds": gap, "rate_per_round": rate, "household_limit": limit})
                rows.append(row)
    return rows


def build_bank_results() -> dict[str, Any]:
    runs = {name: simulate_bank(p, shocks=shocks) for name, (p, shocks) in bank_cases().items()}
    return {
        "schema_version": 1,
        "status": "optional_uncalibrated_bank_experiment",
        "units": "invented currency; zero-indexed model rounds, rates per round, not calendar APR",
        "opening_capitalization": "Separate reset: owners withdraw20 from firms original100 buffers and invest20 in bank equity; workers60+owners40+firms80 deposits=180; R200=D180+E20.",
        "bank_rules": {
            "balance_sheet": "R+L=D+E at every event; unpaid simple interest is a separate cash-basis contractual memo",
            "default": "At bullet maturity, service-budget shortfall causes negotiated zero-recovery legal forgiveness; principal asset and debtor liability disappear, deposits do not.",
            "service": "Wages before service; firm service from positive operating surplus before dividends; worker service at20% current received wages/dividends. Opening vintages only; unspent same-round advances cannot service debt.",
            "profit": "Only paid interest retained above opening capital is distributed to ultimate firm owners. Principal is never profit or GDP.",
            "lending": "Explicit temporary-income-return forecast, borrower principal cap and bank equity/outstanding-principal minimum10%; no credible future income means refusal.",
            "termination": "Stop at first unpaid wage, bank capital depletion(E=0), or insolvency(E<0). Remaining loans/memos are retained; no subsequent recovery simulated.",
        },
        "paths": {name: compact_bank_result(run) for name, run in runs.items()},
        "summaries": {name: summarize_bank_run(name, run) for name, run in runs.items()},
        "sensitivity_summaries": bank_sensitivity_summaries(),
        "teaching_selection": {
            "payroll_clean": {
                "path": "equipment_freeze_5_zero_interest",
                "periods": [4, 5, 7, 9, 10, 13, 25],
            },
            "payroll_interest": {
                "path": "equipment_freeze_5_one_percent",
                "periods": [7, 9, 10, 13],
            },
            "payroll_control": {"path": "equipment_freeze_5_no_credit", "periods": [4, 5, 6, 7]},
            "household_smoothing": {
                "path": "worker_gap_2_one_percent",
                "periods": [4, 5, 6, 7, 8, 17, 30],
            },
            "prudent_refusal": {
                "path": "worker_permanent_loss_prudent_refusal",
                "periods": [5, 6, 7, 26],
            },
            "capital_exhaustion": {
                "path": "worker_permanent_loss_forecast_error_limit_20",
                "periods": [6, 7, 25, 26],
            },
        },
    }

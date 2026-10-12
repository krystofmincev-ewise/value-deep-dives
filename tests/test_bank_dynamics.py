import json
import unittest
from dataclasses import asdict
from math import fsum

from toy_economy.bank_cases import bank_cases, compact_bank_result, summarize_bank_run
from toy_economy.bank_dynamics import BankParameters, simulate_bank
from toy_economy.dynamics import DynamicsParameters, simulate
from toy_economy.shock_cases import investment_freeze_schedule
from toy_economy.shocks import ParameterShock


class BankDynamicsTests(unittest.TestCase):
    def test_credit_disabled_exactly_reproduces_original_payment_paths(self) -> None:
        for allocation in ("current_value_added", "baseline_shares"):
            economy = DynamicsParameters(
                periods=25, initial_firm_cash=80, wage_allocation=allocation
            )
            p = BankParameters(economy=economy, credit_enabled=False)
            for shocks in (
                (),
                investment_freeze_schedule(5),
                (ParameterShock(5, employed_workers=0),),
            ):
                old = simulate(economy, shocks=shocks)
                bank = simulate_bank(p, shocks=shocks)
                self.assertEqual(old.periods, tuple(row.economy for row in bank.periods))
                self.assertEqual(bank.opening_bank.deposits, 180)
                self.assertEqual(bank.opening_bank.equity, 20)
                for row in bank.periods:
                    self.assertEqual(row.closing_bank.loans, 0)
                    self.assertAlmostEqual(row.closing_bank.deposits, 180)

    def test_temporary_payroll_bridge_repaid_before_dividends(self) -> None:
        p, shocks = bank_cases()["equipment_freeze_5_zero_interest"]
        result = simulate_bank(p, shocks=shocks)
        self.assertIsNone(result.stop_reason)
        self.assertEqual(result.periods[9].closing_bank.loans, 14)
        self.assertEqual(result.periods[10].closing_bank.loans, 10)
        self.assertEqual(result.periods[13].closing_bank.loans, 0)
        self.assertTrue(all(loan.status == "repaid" for loan in result.periods[-1].loans))
        self.assertTrue(all(row.economy.wage_arrears == 0 for row in result.periods))
        for row in result.periods:
            for loan in row.loans:
                if loan.borrower.startswith("capital_goods") and loan.outstanding_principal > 0:
                    self.assertFalse(
                        any(
                            payment.payer == loan.borrower and payment.purpose == "owner_dividend"
                            for payment in row.economy.payments
                        )
                    )

    def test_fair_interest_does_not_require_perpetual_new_borrowing(self) -> None:
        p, shocks = bank_cases()["equipment_freeze_5_one_percent"]
        result = simulate_bank(p, shocks=shocks)
        summary = summarize_bank_run("case", result)
        self.assertEqual(summary["outcome"], "fully_repaid")
        self.assertAlmostEqual(summary["total_interest_paid"], 0.42805818)
        self.assertAlmostEqual(
            summary["total_bank_profit_distributed"], summary["total_interest_paid"]
        )
        self.assertEqual(summary["first_debt_free_period"], 13)
        self.assertEqual(result.periods[-1].closing_bank.equity, 20)

    def test_permanent_firm_loss_is_extension_not_rescue(self) -> None:
        p, shocks = bank_cases()["equipment_permanent_optimistic_forecast"]
        result = simulate_bank(p, shocks=shocks)
        summary = summarize_bank_run("case", result)
        self.assertEqual(result.stop_reason, "wage_arrears")
        self.assertGreater(summary["terminal_total_debt_owed"], 0)
        self.assertEqual(summary["outcome"], "stopped_with_unresolved_obligations")
        self.assertEqual(summary["total_principal_repaid"], 0)
        self.assertEqual(summary["default_count"], 0)

    def test_household_bridge_smooths_then_repayment_reduces_consumption(self) -> None:
        p, shocks = bank_cases()["worker_gap_2_one_percent"]
        result = simulate_bank(p, shocks=shocks)
        self.assertEqual([row.worker_consumption for row in result.periods[5:8]], [60, 60, 60])
        self.assertAlmostEqual(result.periods[8].worker_consumption, 48)
        self.assertEqual(result.periods[6].closing_bank.loans, 60)
        self.assertEqual(sum(loan.original_principal for loan in result.periods[-1].loans), 120)
        for row in result.periods:
            paid = fsum(
                s.principal_paid + s.interest_paid
                for s in row.debt_service
                if s.borrower == "workers"
            )
            income = row.economy.wages_paid + row.economy.worker_dividends
            self.assertLessEqual(paid, 0.2 * income + 1e-8)
        self.assertEqual(result.periods[-1].closing_bank.loans, 0)
        self.assertIsNone(result.stop_reason)

    def test_restored_ownership_income_can_repay_without_jobs(self) -> None:
        p, shocks = bank_cases()["worker_income_restored_by_ownership"]
        result = simulate_bank(p, shocks=shocks)
        self.assertIsNone(result.stop_reason)
        self.assertTrue(all(row.economy.wages_paid == 0 for row in result.periods[5:]))
        self.assertGreater(result.periods[7].economy.worker_dividends, 0)
        self.assertEqual(result.periods[-1].closing_bank.loans, 0)
        self.assertTrue(all(loan.status == "repaid" for loan in result.periods[-1].loans))

    def test_prudent_bank_refuses_known_permanent_zero_income(self) -> None:
        p, shocks = bank_cases()["worker_permanent_loss_prudent_refusal"]
        result = simulate_bank(p, shocks=shocks)
        decisions = [decision for row in result.periods for decision in row.credit_decisions]
        self.assertTrue(decisions)
        self.assertTrue(
            all(d.advanced == 0 and d.refusal == "no_credible_future_income" for d in decisions)
        )
        self.assertEqual(result.periods[6].worker_consumption, 0)
        self.assertEqual(result.periods[-1].closing_bank.equity, 20)
        self.assertFalse(result.periods[-1].loans)

    def test_false_forecast_exhausts_capital_without_destroying_deposits(self) -> None:
        p, shocks = bank_cases()["worker_permanent_loss_forecast_error_limit_20"]
        result = simulate_bank(p, shocks=shocks)
        last = result.periods[-1]
        self.assertEqual(last.economy.period, 26)
        self.assertEqual(result.stop_reason, "bank_capital_depleted")
        self.assertEqual(last.closing_bank.equity, 0)
        self.assertEqual(last.closing_bank.loans, 0)
        self.assertEqual(last.closing_bank.deposits, 200)
        self.assertEqual(last.loans[0].principal_forgiven, 20)
        self.assertGreater(last.loans[0].interest_forgiven, 0)

    def test_larger_false_forecast_can_leave_negative_equity_and_unresolved_debt(self) -> None:
        p, shocks = bank_cases()["worker_permanent_loss_forecast_error_limit_120"]
        result = simulate_bank(p, shocks=shocks)
        last = result.periods[-1]
        self.assertEqual(result.stop_reason, "bank_insolvent")
        self.assertEqual(last.closing_bank.equity, -40)
        self.assertEqual(last.closing_bank.loans, 60)
        self.assertEqual(last.loans[-1].status, "active")
        self.assertEqual(len(result.periods), 27)

    def test_bank_money_changes_reconcile_every_period_and_event(self) -> None:
        for name, (p, shocks) in bank_cases().items():
            result = simulate_bank(p, shocks=shocks)
            for row in result.periods:
                loans = row.loans
                advanced = fsum(loan.original_principal for loan in loans)
                repaid = fsum(loan.principal_repaid for loan in loans)
                interest = fsum(loan.interest_paid for loan in loans)
                forgiven = fsum(loan.principal_forgiven for loan in loans)
                distributions = fsum(
                    x.bank_profit_distribution for x in result.periods[: row.economy.period + 1]
                )
                self.assertAlmostEqual(
                    row.closing_bank.deposits,
                    result.opening_bank.deposits + advanced - repaid - interest + distributions,
                    msg=name,
                )
                self.assertAlmostEqual(
                    row.closing_bank.equity,
                    p.initial_equity + interest - distributions - forgiven,
                    msg=name,
                )
                for event in row.bank_events:
                    self.assertAlmostEqual(event.snapshot.balance_sheet_error, 0, msg=name)
                    if event.kind == "origination":
                        self.assertGreaterEqual(
                            event.snapshot.equity + 1e-8,
                            p.minimum_equity_to_loans * event.snapshot.loans,
                        )
                self.assertAlmostEqual(
                    row.economy.production.nominal_gdp,
                    row.economy.production.consumption + row.economy.production.investment,
                )
                self.assertAlmostEqual(
                    row.economy.production.nominal_gdp,
                    row.economy.production.wages + row.economy.production.gross_surplus,
                )
                self.assertEqual(row.closing_bank.reserves, 200)

    def test_json_roundtrip_and_no_hidden_interest_in_principal(self) -> None:
        p, shocks = bank_cases()["equipment_freeze_5_one_percent"]
        result = simulate_bank(p, shocks=shocks)
        serialized = json.loads(json.dumps(compact_bank_result(result), allow_nan=False))
        row = serialized["periods"][10]
        self.assertAlmostEqual(row["closing_bank"]["loans"], 10.18)
        self.assertAlmostEqual(row["unpaid_interest"], 0.06)
        self.assertAlmostEqual(row["total_debt_owed"], 10.24)
        self.assertEqual(asdict(result.opening_bank), serialized["opening_bank"])

    def test_credit_can_fill_demand_but_cannot_exceed_physical_capacity(self) -> None:
        runs = []
        for name in ("worker_gap_capacity_constraint", "worker_gap_capacity_constraint_no_credit"):
            p, shocks = bank_cases()[name]
            runs.append(simulate_bank(p, shocks=shocks))
        credit, control = runs
        self.assertTrue(
            all(
                row.economy.production.nominal_gdp <= 80 + 1e-8
                for run in runs
                for row in run.periods
            )
        )
        self.assertEqual(credit.periods[7].economy.production.nominal_gdp, 80)
        self.assertEqual(control.periods[7].economy.production.nominal_gdp, 60)
        self.assertLess(
            credit.periods[6].worker_consumption, credit.parameters.household_consumption_floor
        )
        self.assertGreater(credit.periods[6].closing_bank.loans, 0)
        self.assertEqual(credit.periods[-1].closing_bank.loans, 0)

    def test_parameter_and_schedule_validation(self) -> None:
        for kwargs in (
            {"minimum_equity_to_loans": 0},
            {"loan_term_rounds": 0},
            {"credit_start_period": True},
            {"credit_end_period": 4},
            {"rate_per_round": -0.1},
            {"rate_per_round": float("nan")},
            {"household_service_share": 1.1},
            {"expected_income_return_period": -1},
        ):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                BankParameters(**kwargs)
        with self.assertRaises(ValueError):
            simulate_bank(
                shocks=(ParameterShock(5, employed_workers=0), ParameterShock(5, price=0.5))
            )

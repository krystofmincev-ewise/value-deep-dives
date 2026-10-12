import json
import unittest
from dataclasses import asdict, replace

from toy_economy.dynamics import DynamicsParameters, simulate
from toy_economy.shock_cases import (
    freeze_thresholds,
    freeze_thresholds_fixed_money,
    investment_freeze_schedule,
    layoff_schedule,
    shock_cases,
    summarize_shock_run,
)
from toy_economy.shocks import ParameterShock, validated_schedule


class ScheduledShockTests(unittest.TestCase):
    def test_empty_schedule_preserves_default_behavior(self) -> None:
        self.assertEqual(simulate(), simulate(shocks=()))
        for row in simulate().periods:
            self.assertAlmostEqual(row.production.nominal_gdp, 100)
            self.assertEqual(row.active_policy.employed_workers, 10)
            self.assertEqual(row.active_policy.price, 1)

    def test_period_zero_shock_matches_changed_initial_policy(self) -> None:
        base = DynamicsParameters(periods=4)
        scheduled = simulate(base, shocks=(ParameterShock(0, employed_workers=0),))
        immediate = simulate(replace(base, employed_workers=0))
        self.assertEqual(scheduled.periods, immediate.periods)
        self.assertEqual(scheduled.parameters.employed_workers, 10)
        self.assertEqual(scheduled.shocks[0].employed_workers, 0)

    def test_shock_is_start_of_period_and_persistent_without_resetting_state(self) -> None:
        result = simulate(
            DynamicsParameters(periods=10), shocks=(ParameterShock(5, employed_workers=0),)
        )
        self.assertEqual(result.periods[4].production.wages, 60)
        self.assertEqual(result.periods[5].production.wages, 0)
        self.assertEqual(result.periods[5].production.nominal_gdp, 100)
        self.assertEqual(result.periods[6].production.nominal_gdp, 70)
        for previous, current in zip(result.periods[:-1], result.periods[1:], strict=True):
            self.assertEqual(previous.closing_balances, current.opening_balances)
            self.assertEqual(previous.closing_real_capital, current.opening_real_capital)
        for row in result.periods[5:]:
            self.assertEqual(row.active_policy.employed_workers, 0)

    def test_sorting_and_independent_parameter_changes(self) -> None:
        shocks = (ParameterShock(7, price=0.5), ParameterShock(5, employed_workers=5))
        result = simulate(DynamicsParameters(periods=9), shocks=shocks)
        self.assertEqual(tuple(shock.period for shock in result.shocks), (5, 7))
        self.assertEqual(result.periods[7].active_policy.employed_workers, 5)
        self.assertEqual(result.periods[7].active_policy.price, 0.5)
        self.assertEqual(
            result.periods[7].production.real_gdp, result.periods[7].production.nominal_gdp * 2
        )

    def test_schedule_validation(self) -> None:
        for kwargs in (
            {"period": -1, "employed_workers": 0},
            {"period": True, "employed_workers": 0},
            {"period": 5},
            {"period": 5, "employed_workers": 11},
            {"period": 5, "price": 0},
            {"period": 5, "owner_equity_financing": 1},
            {"period": 5, "owner_spending_propensity": 1.1},
            {"period": 5, "worker_ownership_share": -0.1},
            {"period": 5, "adjustment_speed": float("nan")},
            {"period": 5, "autonomous_investment": -1},
            {"period": 5, "investment_rule": "unknown"},
            {"period": 5, "wage_allocation": "unknown"},
        ):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                ParameterShock(**kwargs)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            simulate(shocks=(ParameterShock(12, employed_workers=0),))
        with self.assertRaises(ValueError):
            simulate(shocks=(ParameterShock(5, employed_workers=0), ParameterShock(5, price=0.5)))
        with self.assertRaises(ValueError):
            validated_schedule(({"period": 5},), 12)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            simulate(
                DynamicsParameters(target_utilization=0),
                shocks=(ParameterShock(5, investment_rule="replacement_adjustment"),),
            )

    def test_replacement_rule_baseline_and_explicit_inherited_output(self) -> None:
        parameters = DynamicsParameters(investment_rule="replacement_adjustment")
        for row in simulate(parameters).periods:
            self.assertAlmostEqual(row.production.nominal_gdp, 100)
            self.assertAlmostEqual(row.desired_investment, 20)
        first = simulate(replace(parameters, initial_lagged_nominal_gdp=200)).periods[0]
        self.assertAlmostEqual(first.desired_investment, 40)

    def test_replacement_rule_removes_fixed_investment_floor(self) -> None:
        result = simulate(
            DynamicsParameters(periods=160),
            shocks=(
                ParameterShock(
                    5,
                    employed_workers=0,
                    investment_rule="replacement_adjustment",
                    autonomous_investment=999,
                    utilization_investment_sensitivity=999,
                ),
            ),
        )
        for period in range(6, 20):
            self.assertAlmostEqual(
                result.periods[period].production.nominal_gdp, 100 * 0.7 ** (period - 5)
            )
        self.assertAlmostEqual(result.periods[7].desired_investment, 14)
        self.assertAlmostEqual(
            result.periods[-1].production.nominal_gdp / (100 * 0.7**154), 1, places=12
        )
        self.assertFalse(result.stopped_for_insolvency)

    def test_owner_spending_threshold_is_cash_constrained(self) -> None:
        parameters = DynamicsParameters(periods=50, investment_rule="replacement_adjustment")
        for propensity in (0.8, 0.81, 1.0):
            result = simulate(
                parameters,
                shocks=(
                    ParameterShock(5, employed_workers=0, owner_spending_propensity=propensity),
                ),
            )
            for row in result.periods:
                self.assertAlmostEqual(row.production.nominal_gdp, 100)
        lower = simulate(
            parameters,
            shocks=(ParameterShock(5, employed_workers=0, owner_spending_propensity=0.5),),
        )
        self.assertLess(lower.periods[-1].production.nominal_gdp, 0.001)

    def test_sixty_percent_ownership_offsets_payroll_without_added_money(self) -> None:
        result = simulate(
            DynamicsParameters(periods=50, investment_rule="replacement_adjustment"),
            shocks=(ParameterShock(5, employed_workers=0, worker_ownership_share=0.6),),
        )
        self.assertEqual(result.money_stock, 200)
        for row in result.periods[6:]:
            self.assertAlmostEqual(row.production.nominal_gdp, 100)
            self.assertAlmostEqual(row.worker_dividends, 60)
            self.assertAlmostEqual(row.owner_dividends, 40)
            self.assertAlmostEqual(row.equity_contributions, 20)

    def test_every_payment_replays_across_combined_shocks(self) -> None:
        shocks = (
            ParameterShock(3, employed_workers=5),
            ParameterShock(5, owner_equity_financing=False),
            ParameterShock(8, price=0.5, owner_spending_propensity=0.8),
        )
        result = simulate(DynamicsParameters(periods=20), shocks=shocks)
        for row in result.periods:
            balances = dict(row.opening_balances)
            for payment in row.payments:
                self.assertGreaterEqual(balances[payment.payer] + 1e-9, payment.amount)
                balances[payment.payer] -= payment.amount
                balances[payment.payee] += payment.amount
                self.assertAlmostEqual(sum(balances.values()), result.money_stock)
            for account in balances:
                self.assertAlmostEqual(balances[account], row.closing_balances[account])
            self.assertAlmostEqual(
                row.production.nominal_gdp, row.production.wages + row.production.gross_surplus
            )
            self.assertAlmostEqual(
                row.production.nominal_gdp, row.production.consumption + row.production.investment
            )

    def test_sector_specific_wages_can_fail_despite_positive_aggregate_surplus(self) -> None:
        parameters = DynamicsParameters(periods=30, wage_allocation="baseline_shares")
        result = simulate(parameters, shocks=investment_freeze_schedule(5))
        self.assertTrue(result.stopped_for_insolvency)
        last = result.periods[-1]
        self.assertEqual(last.period, 8)
        self.assertAlmostEqual(last.production.nominal_gdp, 67.75)
        self.assertGreater(last.production.nominal_gdp, last.production.wages)
        self.assertEqual(
            tuple(arrears.firm_id for arrears in last.firm_wage_arrears),
            ("capital_goods_1", "capital_goods_2"),
        )
        self.assertAlmostEqual(sum(arrears.arrears for arrears in last.firm_wage_arrears), 4)
        self.assertAlmostEqual(last.wage_arrears, 4)
        self.assertFalse(summarize_shock_run("sector", result).all_scheduled_shocks_reached)

    def test_layoff_and_freeze_helpers_validate_inputs(self) -> None:
        self.assertEqual(
            tuple(shock.employed_workers for shock in layoff_schedule(5, 5)), (9, 8, 7, 6, 5)
        )
        self.assertEqual(
            tuple(shock.period for shock in layoff_schedule(5, 5)), (5, 10, 15, 20, 25)
        )
        for layoffs, spacing in ((11, 1), (1, -1), (True, 1)):
            with self.assertRaises(ValueError):
                layoff_schedule(layoffs, spacing)
        with self.assertRaises(ValueError):
            investment_freeze_schedule(0)

    def test_same_positive_employment_endpoint_has_speed_sensitive_freeze_failure(self) -> None:
        cases = shock_cases()
        for speed in ("abrupt", "gradual_fast", "gradual_slow"):
            parameters, schedule = cases[f"freeze_17_{speed}_five_jobs_no_firm_cash"]
            result = simulate(parameters, shocks=schedule)
            if speed == "gradual_slow":
                self.assertTrue(result.stopped_for_insolvency)
                self.assertEqual(result.periods[-1].period, 22)
                self.assertEqual(result.periods[-1].active_policy.employed_workers, 6)
                self.assertAlmostEqual(result.periods[-1].wage_arrears, 2.6456366, places=6)
            else:
                self.assertFalse(result.stopped_for_insolvency)
                self.assertEqual(result.periods[-1].active_policy.employed_workers, 5)
                self.assertAlmostEqual(result.periods[-1].production.nominal_gdp, 70)

    def test_discrete_freeze_boundary_and_late_recovery_failure(self) -> None:
        rows = freeze_thresholds()
        self.assertEqual(
            tuple(row["largest_surviving_tested_duration"] for row in rows),
            (11, 11, 12, 12, 13, 15, 16),
        )
        self.assertTrue(all(row["pre_shock_gdp_100_verified"] for row in rows))
        self.assertTrue(all(row["failure_boundary_monotone_in_tested_range"] for row in rows))
        cash_100 = rows[-2]["first_failure"]
        self.assertEqual(cash_100["first_insolvency_period"], 20)
        self.assertFalse(cash_100["all_scheduled_shocks_reached"])
        cash_200 = rows[-1]["first_failure"]
        self.assertEqual(cash_200["first_insolvency_period"], 23)
        self.assertTrue(cash_200["all_scheduled_shocks_reached"])

    def test_summary_is_deterministic_json_safe(self) -> None:
        parameters, shocks = shock_cases()["replacement_abrupt_zero_jobs"]
        result = simulate(parameters, shocks=shocks)
        serialized = json.dumps(
            asdict(summarize_shock_run("test", result)), allow_nan=False, sort_keys=True
        )
        self.assertEqual(
            serialized,
            json.dumps(
                asdict(summarize_shock_run("test", result)), allow_nan=False, sort_keys=True
            ),
        )
        self.assertLess(summarize_shock_run("test", result).maximum_closing_money_error, 1e-8)

    def test_freeze_boundaries_depend_on_distribution_with_same_money(self) -> None:
        rows = freeze_thresholds_fixed_money()
        self.assertTrue(all(row["initial_money_stock"] == 200 for row in rows))
        self.assertTrue(all(row["pre_shock_gdp_100_verified"] for row in rows))
        self.assertEqual(tuple(row["first_failing_duration"] for row in rows), (12, 13, 14, 16))
        self.assertEqual(
            tuple(row["first_failure"]["first_insolvency_period"] for row in rows),
            (17, 18, 19, 20),
        )


if __name__ == "__main__":
    unittest.main()

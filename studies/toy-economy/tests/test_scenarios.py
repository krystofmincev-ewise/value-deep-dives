"""The published controls and named experiments use the same economic engine."""

import unittest

from toy_economy.scenarios import build_results, explorer_grid


class ScenarioTests(unittest.TestCase):
    def test_all_explorer_records_preserve_accounts_or_report_limit(self) -> None:
        grid = explorer_grid()["rows"]
        self.assertEqual(len(grid), 3168)
        for key, result in grid.items():
            with self.subTest(key=key):
                a = result["accounts"]
                if a is None:
                    self.assertIn(
                        result["status"],
                        ("indeterminate", "infeasible_income", "no_stationary_equilibrium"),
                    )
                    continue
                self.assertAlmostEqual(a["nominal_gdp"], a["consumption"] + a["investment"])
                self.assertAlmostEqual(a["nominal_gdp"], a["wages"] + a["gross_surplus"])
                self.assertAlmostEqual(
                    a["consumption"], a["worker_consumption"] + a["owner_consumption"]
                )
                self.assertAlmostEqual(a["saving"], a["investment"])
                self.assertGreaterEqual(a["owner_disposable_income"], 0)
                self.assertLessEqual(a["worker_consumption"], a["worker_disposable_income"] + 1e-8)
                self.assertLessEqual(a["owner_consumption"], a["owner_disposable_income"] + 1e-8)

    def test_reported_financing_failure_also_requires_worn_capital(self) -> None:
        data = build_results()["dynamics"]
        failing = data["saving_not_recycled"]
        maintained = data["saving_not_recycled_no_depreciation"]
        self.assertTrue(failing["stopped_for_insolvency"])
        self.assertEqual(len(failing["periods"]), 18)
        self.assertFalse(maintained["stopped_for_insolvency"])
        self.assertAlmostEqual(maintained["periods"][-1]["production"]["nominal_gdp"], 60, places=3)

    def test_worker_saving_sensitivity_can_increase_surplus(self) -> None:
        data = build_results()["equilibrium"]
        baseline = data["worker_saving_baseline"]["result"]["accounts"]
        no_jobs = data["worker_saving_zero_jobs"]["result"]["accounts"]
        self.assertAlmostEqual(baseline["nominal_gdp"], 100)
        self.assertAlmostEqual(no_jobs["nominal_gdp"], 52)
        self.assertGreater(no_jobs["gross_surplus"], baseline["gross_surplus"])

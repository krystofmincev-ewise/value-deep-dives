"""Tests for the explicitly assumed fully automated growth counterexample."""

import unittest
from dataclasses import replace

from toy_economy.growth import GrowthParameters, automated_growth


class AutomatedGrowthTests(unittest.TestCase):
    def test_zero_labor_positive_consumption_and_compound_growth(self) -> None:
        rows = automated_growth()
        self.assertAlmostEqual(rows[-1].real_gdp, 100 * 1.05**20)
        self.assertGreater(rows[-1].real_consumption, rows[0].real_consumption)
        for row in rows:
            self.assertEqual(row.nominal_wages, 0)
            self.assertAlmostEqual(row.real_gdp, row.real_consumption + row.real_investment)
            self.assertAlmostEqual(row.price * row.real_gdp, row.nominal_gdp)
            self.assertAlmostEqual(
                row.real_net_domestic_product, row.real_gdp - row.real_depreciation
            )

    def test_replacement_investment_is_stationary(self) -> None:
        rows = automated_growth(GrowthParameters(investment_share=0.2))
        self.assertAlmostEqual(rows[-1].real_capital, 200)
        self.assertAlmostEqual(rows[-1].real_consumption, 80)

    def test_no_investment_depletes_capital(self) -> None:
        rows = automated_growth(GrowthParameters(investment_share=0))
        self.assertAlmostEqual(rows[-1].real_gdp, 100 * 0.9**20)
        self.assertLess(rows[-1].real_consumption, rows[0].real_consumption)

    def test_all_investment_can_grow_gdp_without_consumption(self) -> None:
        rows = automated_growth(GrowthParameters(investment_share=1))
        self.assertTrue(all(row.real_consumption == 0 for row in rows))
        self.assertGreater(rows[-1].real_gdp, rows[0].real_gdp)

    def test_inputs_are_finite_and_well_defined(self) -> None:
        for key, value in (
            ("initial_capital", 0),
            ("output_per_capital", float("nan")),
            ("investment_share", 1.1),
            ("depreciation_rate", -0.1),
            ("periods", True),
            ("nominal_expenditure", 0),
        ):
            with self.subTest(key=key), self.assertRaises(ValueError):
                automated_growth(replace(GrowthParameters(), **{key: value}))


if __name__ == "__main__":
    unittest.main()

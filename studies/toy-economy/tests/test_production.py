import unittest

from toy_economy.production import INPUT_COEFFICIENTS, SECTORS, allocate_production


class ProductionTests(unittest.TestCase):
    def test_ten_firms_two_in_every_sector(self) -> None:
        a = allocate_production(80, 20, wage_bill=60)
        self.assertEqual(len(a.firms), 10)
        for sector in SECTORS:
            self.assertEqual(sum(f.sector == sector for f in a.firms), 2)
        self.assertAlmostEqual(sum(f.worker_equivalents for f in a.firms), 10)

    def test_value_added_avoids_double_counting(self) -> None:
        a = allocate_production(80, 20, wage_bill=60)
        self.assertAlmostEqual(a.gross_turnover, 169.4)
        self.assertAlmostEqual(a.intermediate_expenses, 69.4)
        self.assertAlmostEqual(a.nominal_gdp, 100)
        self.assertAlmostEqual(sum(s.nominal_value for s in a.intermediate_sales), 69.4)
        self.assertAlmostEqual(sum(f.value_added for f in a.firms), a.nominal_gdp)
        self.assertAlmostEqual(sum(f.wage_bill for f in a.firms), 60)
        self.assertAlmostEqual(sum(f.gross_surplus for f in a.firms), 40)
        for firm in a.firms:
            self.assertAlmostEqual(
                firm.gross_turnover - firm.intermediate_expenses, firm.value_added
            )
            self.assertLessEqual(firm.wage_bill, firm.value_added)

    def test_leontief_input_requirements(self) -> None:
        a = allocate_production(80, 20)
        outputs = tuple(
            sum(f.gross_turnover for f in a.firms if f.sector == sector) for sector in SECTORS
        )
        final_demands = (0, 0, 0, 80, 20)
        for i, output in enumerate(outputs):
            self.assertAlmostEqual(
                output,
                final_demands[i] + sum(INPUT_COEFFICIENTS[i][j] * outputs[j] for j in range(5)),
            )

    def test_uniform_price_and_zero_output(self) -> None:
        a = allocate_production(80, 20, price=0.5)
        self.assertEqual(a.nominal_gdp, 100)
        self.assertEqual(a.real_gdp, 200)
        zero = allocate_production(0, 0, employed_workers=0)
        self.assertEqual(sum(f.gross_turnover for f in zero.firms), 0)

    def test_losses_need_explicit_permission(self) -> None:
        with self.assertRaises(ValueError):
            allocate_production(10, 0, wage_bill=60)
        a = allocate_production(10, 0, wage_bill=60, allow_losses=True)
        self.assertAlmostEqual(a.gross_surplus, -50)
        with self.assertRaises(ValueError):
            allocate_production(80, 20, wage_bill=1, employed_workers=0)


if __name__ == "__main__":
    unittest.main()

import unittest

from toy_economy.limits import LimitParameters, capital_path, growth_limits, stationary_allocation


class LimitsTests(unittest.TestCase):
    def test_global_gdp_and_consumption_maxima_differ(self) -> None:
        r = growth_limits()
        self.assertAlmostEqual(r.maximum_stationary_gdp.real_gdp, 500)
        self.assertAlmostEqual(r.maximum_stationary_gdp.real_consumption, 0)
        self.assertAlmostEqual(r.maximum_stationary_consumption.real_gdp, 250)
        self.assertAlmostEqual(r.maximum_stationary_consumption.real_consumption, 125)
        self.assertAlmostEqual(r.maximum_stationary_consumption.investment_share, 0.5)

    def test_analytical_maxima_dominate_dense_grid(self) -> None:
        for cap in (None, 200, 300):
            p = LimitParameters(resource_ceiling=cap)
            opt = growth_limits(p)
            for i in range(1001):
                row = stationary_allocation(i / 1000, p)
                self.assertLessEqual(row.real_gdp, opt.maximum_stationary_gdp.real_gdp + 1e-8)
                self.assertLessEqual(
                    row.real_consumption, opt.maximum_stationary_consumption.real_consumption + 1e-8
                )
                self.assertAlmostEqual(
                    row.real_gdp, row.real_consumption + row.replacement_investment
                )

    def test_resource_ceiling_creates_gdp_plateau(self) -> None:
        p = LimitParameters(resource_ceiling=300)
        opt = growth_limits(p)
        self.assertAlmostEqual(opt.minimum_share_to_maximize_gdp, 0.6)
        self.assertAlmostEqual(stationary_allocation(0.8, p).real_gdp, 300)
        self.assertLess(
            stationary_allocation(0.8, p).real_consumption,
            stationary_allocation(0.6, p).real_consumption,
        )

    def test_transitions_converge_to_analytical_stock(self) -> None:
        for cap in (None, 200, 300):
            for share in (0.1, 0.5, 0.8, 1):
                p = LimitParameters(resource_ceiling=cap)
                path = capital_path(share, p, periods=1000)
                target = stationary_allocation(share, p)
                self.assertAlmostEqual(path[-1].real_gdp, target.real_gdp, places=7)
                for row in path:
                    self.assertAlmostEqual(
                        row.closing_capital, row.opening_capital - row.depreciation + row.investment
                    )

    def test_zero_capital_is_not_spontaneously_created(self) -> None:
        path = capital_path(0.5, initial_capital=0)
        self.assertTrue(all(row.real_gdp == 0 for row in path))

    def test_domain_validation(self) -> None:
        for args in ({"capital_exponent": 1}, {"depreciation": 0}, {"resource_ceiling": 0}):
            with self.assertRaises(ValueError):
                LimitParameters(**args)

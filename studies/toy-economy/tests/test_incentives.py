import unittest
from dataclasses import replace

from toy_economy.incentives import (
    IncentiveParameters,
    adoption_allocation,
    annuity_factor,
    solve_incentives,
)


class IncentiveTests(unittest.TestCase):
    def test_private_gain_is_positive_while_collective_surplus_falls(self) -> None:
        r = solve_incentives()
        self.assertAlmostEqual(r.private_recurring_gain, 5)
        self.assertAlmostEqual(r.collective_recurring_surplus_change, -4)
        self.assertTrue(r.adoption_beats_retention)
        self.assertAlmostEqual(r.allocations[0].nominal_gdp, 100)
        self.assertAlmostEqual(r.allocations[-1].nominal_gdp, 0)

    def test_best_response_matches_every_counterfactual(self) -> None:
        p = IncentiveParameters()
        r = solve_incentives(p)
        for k in range(p.firms):
            before = adoption_allocation(k, p)
            after = adoption_allocation(k + 1, p)
            assert before.nonadopter_operating_surplus is not None
            assert after.adopter_operating_surplus is not None
            self.assertAlmostEqual(
                after.adopter_operating_surplus - before.nonadopter_operating_surplus,
                r.private_recurring_gain,
            )
            self.assertAlmostEqual(
                after.aggregate_gross_surplus - before.aggregate_gross_surplus,
                r.collective_recurring_surplus_change,
            )

    def test_one_firm_internalizes_all_sales_loss(self) -> None:
        r = solve_incentives(IncentiveParameters(firms=1))
        self.assertFalse(r.adoption_beats_retention)
        self.assertAlmostEqual(r.private_recurring_gain, r.collective_recurring_surplus_change)

    def test_higher_setup_cost_or_discount_rate_can_prevent_adoption(self) -> None:
        p = IncentiveParameters(setup_cost_per_wage_unit=5)
        self.assertTrue(solve_incentives(p).adoption_beats_retention)
        self.assertFalse(solve_incentives(replace(p, discount_rate=0.2)).adoption_beats_retention)
        self.assertFalse(
            solve_incentives(replace(p, setup_cost_per_wage_unit=10)).adoption_beats_retention
        )

    def test_fixed_investment_keeps_owner_surplus_and_output_floor(self) -> None:
        r = solve_incentives(IncentiveParameters(investment_share=0, autonomous_investment=20))
        self.assertAlmostEqual(r.allocations[-1].nominal_gdp, 40)
        self.assertAlmostEqual(r.collective_recurring_surplus_change, 0)

    def test_firm_count_does_not_invent_aggregate_scale(self) -> None:
        a = solve_incentives(IncentiveParameters(firms=10))
        b = solve_incentives(IncentiveParameters(firms=100))
        self.assertAlmostEqual(a.allocations[5].nominal_gdp, b.allocations[50].nominal_gdp)
        self.assertTrue(b.adoption_beats_retention)

    def test_accounts_and_loss_financing_flag(self) -> None:
        for row in solve_incentives().allocations:
            self.assertAlmostEqual(
                row.nominal_gdp, row.worker_consumption + row.owner_consumption + row.investment
            )
            self.assertAlmostEqual(row.nominal_gdp, row.wages + row.aggregate_gross_surplus)
        self.assertTrue(adoption_allocation(5, IncentiveParameters()).nonadopters_need_financing)
        self.assertFalse(adoption_allocation(4, IncentiveParameters()).nonadopters_need_financing)

    def test_validation_and_zero_rate_annuity(self) -> None:
        self.assertEqual(annuity_factor(0, 10), 10)
        for args in (
            {"firms": 0},
            {"investment_share": 0.5},
            {"discount_rate": -1},
            {"payoff_periods": 0},
        ):
            with self.assertRaises(ValueError):
                IncentiveParameters(**args)

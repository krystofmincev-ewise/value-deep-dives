"""Bounded private forecasts and an explicitly responsive rival payroll."""

import unittest
from dataclasses import replace

from toy_economy.adoption import (
    CONSUMERS,
    AdoptionParameters,
    AdoptionShock,
    labor_plan,
    simulate_adoption,
)
from toy_economy.adoption_decisions import choose_adoption


class AdoptionDecisionTests(unittest.TestCase):
    def test_usage_fee_can_make_protected_firm_refuse_adoption(self) -> None:
        p = AdoptionParameters(adoption_rule="bounded_myopic")
        chosen, decisions = choose_adoption((0, 0), (0.2, 0.2), (1, 1), (100, 100), 80, p)
        self.assertEqual(chosen, (0, 0))
        for decision in decisions:
            self.assertEqual(decision.predicted_current_surplus, 10)
            self.assertAlmostEqual(decision.predicted_candidate_surplus, 9.083149966338794)
            self.assertEqual(decision.reason, "predicted_surplus_not_higher")

    def test_free_ai_can_be_privately_attractive(self) -> None:
        p = AdoptionParameters(adoption_rule="bounded_myopic", ai_fee_per_task_hour=0)
        chosen, _ = choose_adoption((0, 0), (0.2, 0.2), (1, 1), (100, 100), 80, p)
        self.assertEqual(chosen, (0.2, 0.2))

    def test_hourly_payroll_saving_can_trigger_adoption(self) -> None:
        p = AdoptionParameters(
            adoption_rule="bounded_myopic", pay_contract="hourly_pay", capacity_use="take_time"
        )
        chosen, decisions = choose_adoption((0, 0), (0.2, 0.2), (1, 1), (100, 100), 80, p)
        self.assertEqual(chosen, (0.2, 0.2))
        self.assertAlmostEqual(decisions[0].predicted_candidate_surplus, 10.6)
        blocked, _ = choose_adoption(
            (0, 0), (0.2, 0.2), (1, 1), (100, 100), 80, replace(p, adoption_hurdle=1)
        )
        self.assertEqual(blocked, (0, 0))

    def test_choices_use_same_inherited_state_not_other_new_choice(self) -> None:
        p = AdoptionParameters(
            adoption_rule="bounded_myopic", pay_contract="hourly_pay", capacity_use="take_time"
        )
        both, decisions = choose_adoption((0, 0), (0.2, 0.2), (1, 1), (100, 100), 80, p)
        one, one_decisions = choose_adoption((0, 0), (0.2, 0), (1, 1), (100, 100), 80, p)
        self.assertEqual(both, (0.2, 0.2))
        self.assertEqual(one, (0.2, 0))
        self.assertEqual(decisions[0], one_decisions[0])
        self.assertEqual(
            decisions[0].predicted_candidate_surplus, decisions[1].predicted_candidate_surplus
        )

    def test_firm_swapping_preserves_forecasts(self) -> None:
        p = AdoptionParameters(
            adoption_rule="bounded_myopic", pay_contract="hourly_pay", capacity_use="take_time"
        )
        chosen, left = choose_adoption((0.2, 0), (0.6, 0.4), (0.94, 1), (80, 100), 70, p)
        reversed_chosen, right = choose_adoption((0, 0.2), (0.4, 0.6), (1, 0.94), (100, 80), 70, p)
        self.assertEqual(chosen, reversed_chosen[::-1])
        self.assertAlmostEqual(
            left[0].predicted_candidate_surplus, right[1].predicted_candidate_surplus
        )
        self.assertAlmostEqual(
            left[1].predicted_candidate_surplus, right[0].predicted_candidate_surplus
        )

    def test_available_stages_persist_and_one_step_per_round(self) -> None:
        p = AdoptionParameters(
            periods=4,
            adoption_rule="bounded_myopic",
            pay_contract="hourly_pay",
            capacity_use="take_time",
            ai_fee_per_task_hour=0,
            price_pass_through=0,
        )
        result = simulate_adoption(p, shocks=tuple(AdoptionShock(0, f, 0.6) for f in CONSUMERS))
        self.assertAlmostEqual(result.periods[0].firms[0].automation_fraction, 0.2)
        self.assertAlmostEqual(result.periods[1].firms[0].automation_fraction, 0.4)
        self.assertAlmostEqual(result.periods[2].firms[0].automation_fraction, 0.6)
        self.assertEqual(result.periods[3].adoption_decisions[0].reason, "no_new_available_stage")

    def test_private_gain_does_not_guarantee_aggregate_gain(self) -> None:
        p = AdoptionParameters(
            periods=60,
            adoption_rule="bounded_myopic",
            pay_contract="hourly_pay",
            capacity_use="take_time",
        )
        shocks = tuple(AdoptionShock(t, f, a) for t, a in ((5, 0.2), (10, 0.4)) for f in CONSUMERS)
        result = simulate_adoption(p, shocks=shocks)
        first = result.periods[5].adoption_decisions[0]
        self.assertGreater(first.predicted_candidate_surplus, first.predicted_current_surplus)
        self.assertAlmostEqual(result.periods[-1].nominal_gdp, 76)
        self.assertLess(result.periods[-1].firms[0].gross_surplus, 10)
        self.assertLess(result.periods[-1].worker_real_consumption, 60)

    def test_forecast_cash_budget_matches_real_current_budget(self) -> None:
        p = AdoptionParameters(
            periods=20,
            adoption_rule="bounded_myopic",
            owner_spending_propensity=1,
            initial_owner_cash=10,
            pay_contract="hourly_pay",
            capacity_use="take_time",
        )
        result = simulate_adoption(p, shocks=tuple(AdoptionShock(5, f, 0.4) for f in CONSUMERS))
        for row in result.periods:
            for decision in row.adoption_decisions:
                self.assertAlmostEqual(
                    decision.forecast_consumption_budget, row.cash_financeable_consumption
                )

    def test_lagged_sales_baseline_matches_reference(self) -> None:
        p = AdoptionParameters(periods=8)
        reference = simulate_adoption(p)
        responsive = simulate_adoption(replace(p, labor_demand_rule="lagged_sales"))
        for a, b in zip(reference.periods, responsive.periods, strict=True):
            self.assertEqual(a.nominal_gdp, b.nominal_gdp)
            self.assertEqual(a.worker_income, b.worker_income)
            self.assertEqual(a.closing_capital, b.closing_capital)

    def test_lagged_sales_rival_can_reduce_payroll(self) -> None:
        p = AdoptionParameters(periods=80, pay_contract="layoffs", capacity_use="take_time")
        shocks = tuple(
            AdoptionShock(5 + 5 * i, "consumer_a", a) for i, a in enumerate((0.2, 0.4, 0.6, 0.8, 1))
        )
        sticky = simulate_adoption(p, shocks=shocks)
        responsive = simulate_adoption(replace(p, labor_demand_rule="lagged_sales"), shocks=shocks)
        self.assertEqual(sticky.stop_reason, "wage_arrears")
        self.assertIsNone(responsive.stop_reason)
        self.assertLess(responsive.periods[-1].firms[1].contracted_wages, 30)
        self.assertEqual(responsive.periods[-1].firms[1].headcount, 2)
        # Survival is not a claim of higher consumption or output.
        self.assertLess(responsive.periods[-1].real_gdp, sticky.periods[-1].real_gdp)

    def test_responsive_labor_caps_original_five_worker_roster(self) -> None:
        p = AdoptionParameters(labor_demand_rule="lagged_sales", pay_contract="layoffs")
        plan = labor_plan(0.8, p, lagged_quantity=1e6)
        self.assertEqual(plan.headcount, 5)
        self.assertEqual(plan.contracted_hours, 5)
        self.assertEqual(plan.contracted_wages, 30)

    def test_zero_lagged_sales_has_no_restart_floor(self) -> None:
        p = AdoptionParameters(labor_demand_rule="lagged_sales", pay_contract="hourly_pay")
        for automation in (0, 0.4, 1):
            plan = labor_plan(automation, p, lagged_quantity=0)
            self.assertEqual(plan.labor_capacity, 0)
            self.assertEqual(plan.contracted_wages, 0)

    def test_irreversibility_and_invalid_choice_inputs(self) -> None:
        with self.assertRaises(ValueError):
            simulate_adoption(
                shocks=(AdoptionShock(1, "consumer_a", 0.4), AdoptionShock(2, "consumer_a", 0.2))
            )
        for kwargs in (
            {"adoption_step": 0},
            {"adoption_step": 1.1},
            {"adoption_hurdle": -1},
            {"labor_sales_buffer": 0.9},
            {"adoption_rule": "perfect_optimization"},
        ):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                AdoptionParameters(**kwargs)


if __name__ == "__main__":
    unittest.main()

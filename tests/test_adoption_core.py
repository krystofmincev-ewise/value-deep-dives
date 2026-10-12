"""Accounting, physical constraints and worker incidence in the four-firm town."""

import unittest
from dataclasses import replace
from math import fsum

from toy_economy.adoption import (
    CONSUMERS,
    WORKERS,
    AdoptionParameters,
    AdoptionShock,
    allocate_expenditure,
    labor_plan,
    quote_prices,
    simulate_adoption,
)


class AdoptionCoreTests(unittest.TestCase):
    def test_stationary_reference_and_individual_accounts(self) -> None:
        result = simulate_adoption(AdoptionParameters(periods=12))
        self.assertIsNone(result.stop_reason)
        for row in result.periods:
            self.assertEqual(row.nominal_gdp, 100)
            self.assertEqual(row.real_gdp, 100)
            self.assertEqual(row.wages, 60)
            self.assertEqual(row.gross_surplus, 40)
            self.assertEqual(row.worker_consumption, 60)
            self.assertEqual(row.owner_consumption, 20)
            self.assertEqual(row.worker_income, (6,) * 10)
            self.assertEqual(row.worker_closing_cash, (6,) * 10)
            self.assertEqual(row.closing_capital, (100, 100))
            self.assertAlmostEqual(fsum(row.closing_balances.values()), 200)
            self.assertNotIn("workers", row.closing_balances)

    def test_fee_is_domestic_intermediate_not_extra_gdp(self) -> None:
        p = AdoptionParameters(periods=8, ai_fee_per_task_hour=3)
        result = simulate_adoption(p, shocks=(AdoptionShock(0, "consumer_a", 0.4),))
        for row in result.periods:
            self.assertGreater(row.ai_provider_revenue, 0)
            self.assertAlmostEqual(row.nominal_gdp, row.nominal_consumption + row.investment)
            self.assertAlmostEqual(
                row.nominal_gdp,
                fsum(f.value_added for f in row.firms)
                + row.ai_provider_value_added
                + row.equipment_producer_value_added,
            )
            self.assertAlmostEqual(row.nominal_gdp, row.wages + row.gross_surplus)
            self.assertAlmostEqual(fsum(row.worker_income), row.wages_paid + row.worker_dividends)

    def test_hourly_and_layoff_income_incidence_differs(self) -> None:
        base = AdoptionParameters(periods=4, capacity_use="take_time")
        shocks = tuple(AdoptionShock(0, f, 0.4) for f in CONSUMERS)
        hourly = simulate_adoption(replace(base, pay_contract="hourly_pay"), shocks=shocks)
        layoffs = simulate_adoption(replace(base, pay_contract="layoffs"), shocks=shocks)
        self.assertEqual(hourly.periods[0].worker_income, (3.6,) * 10)
        self.assertEqual(layoffs.periods[0].worker_income, (6, 6, 6, 0, 0, 6, 6, 6, 0, 0))
        self.assertEqual(sum(f.headcount for f in hourly.periods[0].firms), 10)
        self.assertEqual(sum(f.headcount for f in layoffs.periods[0].firms), 6)
        self.assertAlmostEqual(hourly.periods[-1].nominal_gdp, layoffs.periods[-1].nominal_gdp)
        self.assertEqual(layoffs.periods[1].worker_consumption_by_person[3], 0)
        self.assertEqual(hourly.periods[1].worker_consumption_by_person[3], 3.6)

    def test_take_time_has_no_endpoint_capacity_jump(self) -> None:
        p = AdoptionParameters(capacity_use="take_time")
        self.assertEqual(labor_plan(0.999999, p).labor_capacity, 40)
        self.assertEqual(labor_plan(1, p).labor_capacity, 40)
        self.assertEqual(labor_plan(1, p).contracted_wages, 30)
        self.assertEqual(labor_plan(1, p).headcount, 5)
        p = replace(p, pay_contract="layoffs")
        self.assertEqual(labor_plan(1, p).headcount, 0)
        self.assertEqual(labor_plan(1, p).contracted_wages, 0)

    def test_tiny_positive_required_labor_has_a_payment_recipient(self) -> None:
        for rule in ("reference", "lagged_sales"):
            p = AdoptionParameters(
                periods=1, pay_contract="layoffs", capacity_use="take_time", labor_demand_rule=rule
            )
            row = simulate_adoption(
                p, shocks=tuple(AdoptionShock(0, firm, 1 - 1e-11) for firm in CONSUMERS)
            ).periods[0]
            self.assertEqual(tuple(firm.headcount for firm in row.firms), (1, 1))
            transferred = fsum(
                payment.amount for payment in row.payments if payment.purpose == "base_wages"
            )
            self.assertGreater(transferred, 0)
            self.assertAlmostEqual(transferred, row.wages_paid, delta=1e-20)

    def test_redeployment_uses_one_productivity_multiplier(self) -> None:
        p = AdoptionParameters()
        self.assertAlmostEqual(labor_plan(0.4, p).labor_capacity, 40 / 0.6)
        result = simulate_adoption(
            replace(p, periods=1), shocks=tuple(AdoptionShock(0, f, 0.4) for f in CONSUMERS)
        )
        for firm in result.periods[0].firms:
            self.assertAlmostEqual(firm.actual_hours, firm.quantity * 0.6 / 8)
            self.assertLessEqual(firm.actual_hours, firm.contracted_hours + 1e-10)

    def test_ai_scarcity_never_rations_nonadopter(self) -> None:
        spending = allocate_expenditure(
            80, (1, 1), (100, 100), 2, automation_fractions=(0.8, 0), ai_service_capacity=0
        )
        self.assertEqual(spending, (0, 80))
        spending = allocate_expenditure(
            80, (1, 1), (100, 40), 2, automation_fractions=(0.8, 0), ai_service_capacity=0.1
        )
        self.assertAlmostEqual(spending[0], 1)
        self.assertAlmostEqual(spending[1], 40)

    def test_physical_capacity_and_spending_reallocation(self) -> None:
        self.assertEqual(allocate_expenditure(80, (1, 1), (10, 100), 2), (10, 70))
        self.assertEqual(allocate_expenditure(80, (1, 1), (10, 20), 2), (10, 20))
        self.assertEqual(allocate_expenditure(80, (1, 1), (0, 0), 2), (0, 0))

    def test_extreme_elasticity_is_numerically_bounded(self) -> None:
        spending = allocate_expenditure(80, (0.05, 1), (2000, 2000), 1000)
        self.assertEqual(spending, (80, 0))

    def test_resource_aware_price_uses_shared_ai_feasibility(self) -> None:
        p = AdoptionParameters(ai_fee_per_task_hour=0)
        plans = (labor_plan(1, p), labor_plan(1, p))
        aware = quote_prices((1, 1), plans, (1, 1), (100, 100), p)
        optimistic = quote_prices(
            (1, 1), plans, (1, 1), (100, 100), replace(p, pricing_capacity_rule="optimistic")
        )
        self.assertEqual(aware, (1, 1))
        self.assertAlmostEqual(optimistic[0], 0.64)

    def test_capital_deliveries_follow_actual_purchases(self) -> None:
        p = AdoptionParameters(
            periods=10,
            pay_contract="hourly_pay",
            capacity_use="take_time",
            ai_fee_per_task_hour=1,
            equipment_capacity=1,
            owner_spending_propensity=1,
            worker_spending_propensity=0.5,
            initial_owner_cash=0,
            initial_firm_cash=100,
        )
        result = simulate_adoption(p, shocks=(AdoptionShock(0, "consumer_a", 0.5),))
        unequal = False
        for row in result.periods:
            for i, firm in enumerate(row.firms):
                delivered = fsum(
                    payment.amount
                    for payment in row.payments
                    if payment.payer == firm.firm_id and payment.purpose == "final_investment"
                )
                self.assertAlmostEqual(firm.investment, delivered)
                self.assertAlmostEqual(
                    row.closing_capital[i], 0.9 * row.opening_capital[i] + delivered
                )
            unequal |= abs(row.firms[0].investment - row.firms[1].investment) > 1e-6
        self.assertTrue(unequal)

    def test_broad_ownership_activation_preserves_matched_start(self) -> None:
        p = AdoptionParameters(
            periods=8, worker_ownership_share=0.6, worker_ownership_start_period=5
        )
        result = simulate_adoption(p)
        control = simulate_adoption(replace(p, worker_ownership_share=0))
        self.assertEqual(result.periods[:5], control.periods[:5])
        self.assertAlmostEqual(result.periods[5].worker_dividends, 24)
        self.assertAlmostEqual(fsum(result.periods[5].worker_income), 84)
        self.assertAlmostEqual(result.periods[5].owner_dividends, 16)

    def test_no_bonus_to_empty_roster(self) -> None:
        p = AdoptionParameters(periods=3, pay_contract="layoffs", worker_bonus_share=0.5)
        result = simulate_adoption(p, shocks=tuple(AdoptionShock(0, f, 1) for f in CONSUMERS))
        for row in result.periods:
            self.assertEqual(row.worker_income, (0,) * 10)
            self.assertEqual(fsum(f.bonus_paid for f in row.firms), 0)
            self.assertFalse(
                any(payment.purpose == "productivity_bonus" for payment in row.payments)
            )

    def test_employed_bonus_enters_next_spending(self) -> None:
        p = AdoptionParameters(
            periods=3,
            pay_contract="hourly_pay",
            capacity_use="take_time",
            ai_fee_per_task_hour=0,
            price_pass_through=0,
            worker_bonus_share=0.5,
        )
        result = simulate_adoption(p, shocks=tuple(AdoptionShock(0, f, 0.4) for f in CONSUMERS))
        first, second = result.periods[:2]
        self.assertGreater(fsum(f.bonus_paid for f in first.firms), 0)
        self.assertAlmostEqual(second.worker_consumption, fsum(first.worker_income))

    def test_sales_responsive_matches_baseline_and_removes_fixed_floor(self) -> None:
        p = AdoptionParameters(periods=12, investment_rule="sales_responsive")
        self.assertEqual(simulate_adoption(p).periods[-1].nominal_gdp, 100)
        p = replace(p, pay_contract="layoffs")
        result = simulate_adoption(p, shocks=tuple(AdoptionShock(1, f, 1) for f in CONSUMERS))
        for before, after in zip(result.periods, result.periods[1:], strict=False):
            self.assertAlmostEqual(after.desired_investment, 0.2 * before.nominal_gdp)
        self.assertLess(result.periods[-1].investment, 1)

    def test_cash_income_and_consumption_reconcile_person_by_person(self) -> None:
        p = AdoptionParameters(
            periods=20,
            pay_contract="layoffs",
            worker_ownership_share=0.3,
            worker_ownership_start_period=5,
            worker_bonus_share=0.5,
        )
        result = simulate_adoption(p, shocks=tuple(AdoptionShock(5, f, 0.4) for f in CONSUMERS))
        for row in result.periods:
            for i, worker in enumerate(WORKERS):
                receipts = fsum(
                    payment.amount for payment in row.payments if payment.payee == worker
                )
                spent = fsum(payment.amount for payment in row.payments if payment.payer == worker)
                self.assertAlmostEqual(receipts, row.worker_income[i])
                self.assertAlmostEqual(spent, row.worker_consumption_by_person[i])
                self.assertAlmostEqual(
                    row.worker_opening_cash[i] + receipts - spent, row.worker_closing_cash[i]
                )
            self.assertAlmostEqual(
                fsum(row.worker_real_consumption_by_person), row.worker_real_consumption
            )

    def test_failure_reports_contracts_and_paid_wages_separately(self) -> None:
        p = AdoptionParameters(
            periods=3,
            initial_worker_cash=0,
            initial_owner_cash=0,
            initial_firm_cash=0,
            autonomous_investment=0,
        )
        row = simulate_adoption(p).periods[-1]
        self.assertEqual(row.wages, 60)
        self.assertEqual(row.wages_paid, 0)
        self.assertEqual(row.wage_arrears, 60)
        self.assertEqual(row.stop_reason, "wage_arrears")

    def test_invalid_parameters_and_schedules(self) -> None:
        for kwargs in (
            {"periods": 0},
            {"ai_service_capacity": -1},
            {"price_elasticity": float("nan")},
            {"worker_ownership_share": 1.1},
            {"worker_ownership_start_period": -1},
        ):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                AdoptionParameters(**kwargs)
        with self.assertRaises(ValueError):
            simulate_adoption(
                AdoptionParameters(periods=1), shocks=(AdoptionShock(1, "consumer_a", 0.2),)
            )
        with self.assertRaises(ValueError):
            simulate_adoption(
                shocks=(AdoptionShock(0, "consumer_a", 0.2), AdoptionShock(0, "consumer_a", 0.4))
            )
        with self.assertRaises(ValueError):
            allocate_expenditure(1, (0, 1), (1, 1), 2)


if __name__ == "__main__":
    unittest.main()

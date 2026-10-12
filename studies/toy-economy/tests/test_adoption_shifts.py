"""Rotating duty changes personal income timing, not total technology or hours."""

import unittest
from dataclasses import replace
from math import fsum

from toy_economy.adoption import (
    CONSUMERS,
    AdoptionParameters,
    AdoptionShock,
    labor_plan,
    simulate_adoption,
    worker_hour_allocation,
)


class AdoptionShiftTests(unittest.TestCase):
    def test_integer_duty_roster_rotates_equally(self) -> None:
        p = AdoptionParameters(
            pay_contract="hourly_pay", capacity_use="take_time", worker_shift_pattern="rotating"
        )
        plan = labor_plan(0.4, p)
        schedules = tuple(worker_hour_allocation(plan, t, p) for t in range(5))
        self.assertEqual(schedules[0], (1, 1, 1, 0, 0))
        self.assertEqual(schedules[1], (0, 1, 1, 1, 0))
        for index in range(5):
            self.assertEqual(fsum(hours[index] for hours in schedules), 3)

    def test_fractional_last_shift_preserves_total_hours(self) -> None:
        p = AdoptionParameters(
            pay_contract="hourly_pay", capacity_use="take_time", worker_shift_pattern="rotating"
        )
        plan = labor_plan(0.5, p)
        schedules = tuple(worker_hour_allocation(plan, t, p) for t in range(5))
        self.assertEqual(schedules[0], (1, 1, 0.5, 0, 0))
        for hours in schedules:
            self.assertEqual(fsum(hours), 2.5)
            self.assertTrue(all(0 <= h <= 1 for h in hours))
        for index in range(5):
            self.assertEqual(fsum(hours[index] for hours in schedules), 2.5)

    def test_aggregate_paths_match_smooth_hours(self) -> None:
        p = AdoptionParameters(periods=50, pay_contract="hourly_pay", capacity_use="take_time")
        shocks = tuple(
            AdoptionShock(t, f, a) for t, a in ((5, 0.2), (10, 0.4), (20, 0.5)) for f in CONSUMERS
        )
        smooth = simulate_adoption(p, shocks=shocks)
        rotate = simulate_adoption(replace(p, worker_shift_pattern="rotating"), shocks=shocks)
        self.assertEqual(len(smooth.periods), len(rotate.periods))
        self.assertEqual(smooth.stop_reason, rotate.stop_reason)
        for a, b in zip(smooth.periods, rotate.periods, strict=True):
            for field in (
                "nominal_gdp",
                "real_gdp",
                "wages_paid",
                "investment",
                "worker_consumption",
                "worker_real_consumption",
                "ai_provider_revenue",
            ):
                self.assertAlmostEqual(getattr(a, field), getattr(b, field))
            self.assertAlmostEqual(fsum(a.worker_income), fsum(b.worker_income))
            self.assertAlmostEqual(fsum(b.closing_balances.values()), 200)
        self.assertGreater(
            max(rotate.periods[15].worker_income) - min(rotate.periods[15].worker_income), 0
        )
        self.assertEqual(
            max(smooth.periods[15].worker_income) - min(smooth.periods[15].worker_income), 0
        )

    def test_personal_wage_payments_follow_recorded_duty(self) -> None:
        p = AdoptionParameters(
            periods=8,
            pay_contract="hourly_pay",
            capacity_use="take_time",
            worker_shift_pattern="rotating",
        )
        result = simulate_adoption(p, shocks=tuple(AdoptionShock(0, f, 0.5) for f in CONSUMERS))
        for row in result.periods:
            for firm in row.firms:
                self.assertEqual(firm.headcount, 5)
                self.assertEqual(firm.on_duty_headcount, 3)
                self.assertEqual(fsum(firm.worker_contracted_hours), 2.5)
                self.assertEqual(fsum(firm.worker_paid_wages), 15)
                for hours, wages in zip(
                    firm.worker_contracted_hours, firm.worker_paid_wages, strict=True
                ):
                    self.assertAlmostEqual(wages, 6 * hours)

    def test_shift_pattern_does_not_change_myopic_forecast(self) -> None:
        p = AdoptionParameters(
            periods=15,
            pay_contract="hourly_pay",
            capacity_use="take_time",
            adoption_rule="bounded_myopic",
        )
        shocks = tuple(AdoptionShock(5, f, 0.4) for f in CONSUMERS)
        smooth = simulate_adoption(p, shocks=shocks)
        rotate = simulate_adoption(replace(p, worker_shift_pattern="rotating"), shocks=shocks)
        for a, b in zip(smooth.periods, rotate.periods, strict=True):
            for da, db in zip(a.adoption_decisions, b.adoption_decisions, strict=True):
                self.assertAlmostEqual(da.chosen_automation, db.chosen_automation)
                self.assertAlmostEqual(
                    da.predicted_candidate_surplus, db.predicted_candidate_surplus
                )

    def test_full_automation_has_no_paid_duty_hours(self) -> None:
        p = AdoptionParameters(
            periods=2,
            pay_contract="hourly_pay",
            capacity_use="take_time",
            worker_shift_pattern="rotating",
        )
        row = simulate_adoption(p, shocks=tuple(AdoptionShock(0, f, 1) for f in CONSUMERS)).periods[
            0
        ]
        for firm in row.firms:
            self.assertEqual(firm.worker_contracted_hours, (0,) * 5)
            self.assertEqual(firm.worker_paid_wages, (0,) * 5)
            self.assertEqual(firm.headcount, 5)
            self.assertEqual(firm.on_duty_headcount, 0)

    def test_invalid_rotation_contracts_are_rejected(self) -> None:
        for kwargs in (
            {"pay_contract": "layoffs", "capacity_use": "take_time"},
            {"pay_contract": "salary_protected", "capacity_use": "take_time"},
            {"pay_contract": "hourly_pay", "capacity_use": "redeploy"},
        ):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                AdoptionParameters(worker_shift_pattern="rotating", **kwargs)


if __name__ == "__main__":
    unittest.main()

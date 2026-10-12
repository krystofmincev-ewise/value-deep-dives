"""Seed pairing and censoring matter more than a particular plotted number."""

import unittest

from toy_economy.adoption import AdoptionParameters, simulate_adoption
from toy_economy.adoption_experiments import (
    distribution,
    empirical_quantile,
    ramp_schedule,
    random_availability,
    summarize,
)


class ExperimentTests(unittest.TestCase):
    def test_random_channels_survive_removing_other_firm(self) -> None:
        both = random_availability(732)
        one = random_availability(732, firms=("consumer_a",))
        self.assertEqual(one, tuple(row for row in both if row.firm == "consumer_a"))
        self.assertEqual(both, random_availability(732))
        self.assertNotEqual(both, random_availability(733))

    def test_probability_endpoints(self) -> None:
        self.assertEqual(random_availability(1, probability=0), ())
        certain = random_availability(1, probability=1, firms=("consumer_a",))
        self.assertEqual([row.period for row in certain], [5, 6, 7, 8])

    def test_summary_keeps_requested_horizon(self) -> None:
        result = simulate_adoption(AdoptionParameters(periods=12))
        summary = summarize(result)
        self.assertEqual(summary.recorded_periods, 12)
        self.assertEqual(summary.requested_periods, 12)
        self.assertAlmostEqual(summary.last_real_gdp, 100)
        self.assertAlmostEqual(summary.maximum_value_added_error, 0)
        self.assertAlmostEqual(summary.last_worker_real_consumption, 60)

    def test_empty_distribution_is_not_zero(self) -> None:
        self.assertIsNone(distribution(()))
        self.assertEqual(empirical_quantile((0, 10), 0.5), 5)
        self.assertEqual(empirical_quantile((7,), 0.95), 7)

    def test_invalid_schedules_fail(self) -> None:
        for stages in ((0.4, 0.2), (-0.2,), (1.2,)):
            with self.assertRaises(ValueError):
                ramp_schedule(stages=stages)
        with self.assertRaises(ValueError):
            random_availability(1, probability=1.1)

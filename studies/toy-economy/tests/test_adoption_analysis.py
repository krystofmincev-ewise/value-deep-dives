import unittest

from toy_economy.adoption_analysis import SeedOutcome, bounded_maximum, compare_paired


class PairedTests(unittest.TestCase):
    def test_matches_by_seed_and_does_not_impute_after_stop(self) -> None:
        a = (SeedOutcome(0, False, 110, 80), SeedOutcome(1, True, 999, 999))
        b = (SeedOutcome(1, False, 100, 60), SeedOutcome(0, False, 100, 60))
        result = compare_paired(a, b)
        self.assertEqual(result.both_completed, 1)
        self.assertEqual(result.treatment_only_stopped, 1)
        self.assertEqual(result.cumulative_real_gdp_difference["mean"], 10)
        self.assertEqual(result.cumulative_worker_real_consumption_difference["median"], 20)

    def test_rejects_unpaired_and_duplicate_seeds(self) -> None:
        row = SeedOutcome(0, False, 100, 60)
        with self.assertRaises(ValueError):
            compare_paired((row,), ())
        with self.assertRaises(ValueError):
            compare_paired((row, row), (row, row))

    def test_no_survivors_is_missing_not_zero(self) -> None:
        row = SeedOutcome(0, True, 12, 3)
        result = compare_paired((row,), (row,))
        self.assertEqual(result.both_stopped, 1)
        self.assertIsNone(result.cumulative_real_gdp_difference)
        self.assertIsNone(result.fraction_common_runs_with_higher_cumulative_worker_consumption)
        self.assertEqual(bounded_maximum(((999, True), (12, False))), (12, 1))

"""The grid analyzer must preserve flat peaks and stopped-run boundaries."""

import unittest
from dataclasses import replace

from scripts.run_adoption_frontier import (
    FrontierPoint,
    describe,
    finite_maximum,
    local_peaks,
    static_physical_upper_bound,
)
from toy_economy.adoption import AdoptionParameters, simulate_adoption


class FrontierTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.baseline = describe(simulate_adoption(AdoptionParameters(periods=1)), 0)

    def point(self, index: int, value: float, completed: bool = True) -> FrontierPoint:
        return replace(
            self.baseline,
            automation=index / 100,
            final_real_gdp=value,
            completed=completed,
        )

    def test_flat_peak_keeps_whole_plateau_and_all_maximizers(self) -> None:
        points = tuple(self.point(i, value) for i, value in enumerate((1, 2, 3, 3, 2, 1)))
        peaks = local_peaks(points, "final_real_gdp")
        self.assertEqual(len(peaks), 1)
        self.assertEqual((peaks[0].automation_start, peaks[0].automation_end), (0.02, 0.03))
        self.assertEqual(peaks[0].boundary, "two_sided")
        maximum = finite_maximum(points, "final_real_gdp")
        assert maximum is not None
        self.assertEqual(maximum["grid_indices"], [2, 3])

    def test_failure_breaks_neighborhood_and_cannot_win_endpoint_ranking(self) -> None:
        points = (
            self.point(0, 2),
            self.point(1, 1),
            self.point(2, 999, completed=False),
            self.point(3, 3),
            self.point(4, 2),
        )
        peaks = local_peaks(points, "final_real_gdp")
        self.assertEqual(
            [(peak.first_grid_index, peak.boundary) for peak in peaks],
            [(0, "grid_edge"), (3, "survival_edge")],
        )
        maximum = finite_maximum(points, "final_real_gdp")
        assert maximum is not None
        self.assertEqual(maximum["value"], 3)
        self.assertIsNone(
            finite_maximum(
                tuple(replace(point, completed=False) for point in points), "final_real_gdp"
            )
        )

    def test_static_envelope_has_balanced_inputs_then_capital_plateau(self) -> None:
        scarce = static_physical_upper_bound(AdoptionParameters(ai_service_capacity=10))
        self.assertEqual(scarce["maximum_consumer_quantity"], 160)
        self.assertEqual(scarce["maximizing_task_share_interval"], [0.5, 0.5])
        self.assertEqual(scarce["potential_real_gdp_if_equipment_delivered"], 180)
        ample = static_physical_upper_bound(AdoptionParameters(ai_service_capacity=25))
        self.assertEqual(ample["maximum_consumer_quantity"], 200)
        self.assertEqual(ample["maximizing_task_share_interval"], [0.6, 1.0])
        self.assertEqual(ample["potential_real_gdp_if_equipment_delivered"], 220)
        self.assertLess(80 / (1 - 0.59), 200)
        for share in (0.6, 0.8, 1.0):
            human_quantity = 80 / (1 - share) if share < 1 else float("inf")
            self.assertGreaterEqual(min(human_quantity, 200 / share), 200)


if __name__ == "__main__":
    unittest.main()

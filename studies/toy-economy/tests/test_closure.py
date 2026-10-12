import json
import unittest
from dataclasses import asdict, replace

from toy_economy.closure import ClosureParameters, investment_for_target, solve_equilibrium


class ClosureTests(unittest.TestCase):
    def test_baseline_and_identities(self) -> None:
        result = solve_equilibrium()
        self.assertEqual(result.status, "equilibrium")
        a = result.accounts
        assert a is not None
        self.assertEqual((a.nominal_gdp, a.consumption, a.investment), (100, 80, 20))
        self.assertEqual(a.wages, 60)
        self.assertEqual(a.gross_surplus, 40)
        self.assertEqual(a.nominal_gdp, a.wages + a.gross_surplus)
        self.assertEqual(a.saving, a.investment)

    def test_layoffs_and_investment_replacement(self) -> None:
        for layoffs, expected in ((0, 100), (1, 94), (3, 82), (5, 70), (10, 40)):
            with self.subTest(layoffs=layoffs):
                p = ClosureParameters(employed_workers=10 - layoffs)
                result = solve_equilibrium(p)
                assert result.accounts is not None
                self.assertEqual(result.accounts.nominal_gdp, expected)
                investment = investment_for_target(100, p)
                self.assertEqual(investment, 20 + 3 * layoffs)
                replacement = solve_equilibrium(replace(p, investment=investment))
                assert replacement.accounts is not None
                self.assertEqual(replacement.accounts.nominal_gdp, 100)

    def test_full_spending_does_not_select_a_gdp(self) -> None:
        for employment in (0, 10):
            p = ClosureParameters(
                employed_workers=employment, owner_spending_propensity=1, investment=0
            )
            result = solve_equilibrium(p)
            self.assertEqual(result.status, "indeterminate")
            self.assertIsNone(result.accounts)
            self.assertIsNone(result.unconstrained_nominal_gdp)

    def test_full_spending_with_positive_investment_not_stationary(self) -> None:
        result = solve_equilibrium(ClosureParameters(owner_spending_propensity=1))
        self.assertEqual(result.status, "no_stationary_equilibrium")
        tiny = solve_equilibrium(ClosureParameters(owner_spending_propensity=1, investment=1e-12))
        self.assertEqual(tiny.status, "no_stationary_equilibrium")
        with self.assertRaises(ValueError):
            investment_for_target(100, ClosureParameters(owner_spending_propensity=1))

    def test_computed_overflow_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            solve_equilibrium(ClosureParameters(nominal_wage=1e308))
        with self.assertRaises(ValueError):
            solve_equilibrium(ClosureParameters(price=1e308, real_capacity=1e308))

    def test_owner_propensity_one_with_offsetting_worker_saving(self) -> None:
        p = ClosureParameters(
            worker_spending_propensity=0.5, owner_spending_propensity=1, investment=30
        )
        self.assertEqual(solve_equilibrium(p).status, "indeterminate")

    def test_prices_change_real_output_and_capacity_is_separate(self) -> None:
        baseline = solve_equilibrium().accounts
        cheaper = solve_equilibrium(ClosureParameters(price=0.5)).accounts
        faster = solve_equilibrium(ClosureParameters(real_capacity=1000)).accounts
        assert baseline is not None and cheaper is not None and faster is not None
        self.assertEqual(cheaper.nominal_gdp, baseline.nominal_gdp)
        self.assertEqual(cheaper.real_gdp, 2 * baseline.real_gdp)
        self.assertEqual(faster.nominal_gdp, baseline.nominal_gdp)

    def test_capacity_rationing_respects_accounts(self) -> None:
        result = solve_equilibrium(ClosureParameters(real_capacity=80))
        self.assertEqual(result.status, "capacity_rationed")
        a = result.accounts
        assert a is not None
        self.assertEqual((a.nominal_gdp, a.consumption, a.investment), (80, 60, 20))
        self.assertEqual(a.unfilled_consumption, 10)
        self.assertEqual(a.worker_consumption + a.owner_consumption, a.consumption)
        self.assertEqual(a.saving, a.investment)
        self.assertEqual(a.capacity_utilization, 1)

    def test_capacity_can_ration_investment(self) -> None:
        p = ClosureParameters(employed_workers=0, investment=100, real_capacity=50)
        a = solve_equilibrium(p).accounts
        assert a is not None
        self.assertEqual((a.nominal_gdp, a.consumption, a.investment), (50, 0, 50))
        self.assertEqual(a.unfilled_investment, 50)

    def test_loss_and_unfunded_transfers_are_explicit(self) -> None:
        for p in (
            ClosureParameters(real_capacity=50),
            ClosureParameters(worker_spending_propensity=0, investment=0),
            ClosureParameters(owner_to_worker_transfer=100, real_capacity=100),
        ):
            result = solve_equilibrium(p)
            self.assertEqual(result.status, "infeasible_income")
            self.assertIsNone(result.accounts)

    def test_budget_balanced_transfer_can_restore_demand(self) -> None:
        p = ClosureParameters(employed_workers=0, owner_to_worker_transfer=60)
        a = solve_equilibrium(p).accounts
        assert a is not None
        self.assertEqual(a.nominal_gdp, 100)
        self.assertEqual(a.worker_disposable_income + a.owner_disposable_income, 100)
        self.assertEqual(a.wages, 0)

    def test_zero_output_is_feasible_without_wages(self) -> None:
        a = solve_equilibrium(
            ClosureParameters(employed_workers=0, investment=0, real_capacity=0)
        ).accounts
        assert a is not None
        self.assertEqual(a.nominal_gdp, 0)
        self.assertEqual(a.capacity_utilization, 0)

    def test_validation(self) -> None:
        for kwargs in (
            {"employed_workers": -1},
            {"employed_workers": 11},
            {"employed_workers": True},
            {"price": 0},
            {"investment": -1},
            {"real_capacity": float("nan")},
            {"nominal_wage": float("inf")},
            {"owner_spending_propensity": 1.1},
        ):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                ClosureParameters(**kwargs)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            investment_for_target(300, ClosureParameters())
        with self.assertRaises(ValueError):
            investment_for_target(50, ClosureParameters())

    def test_deterministic_json(self) -> None:
        first = json.dumps(asdict(solve_equilibrium()), allow_nan=False, sort_keys=True)
        self.assertEqual(
            first, json.dumps(asdict(solve_equilibrium()), allow_nan=False, sort_keys=True)
        )

    def test_economic_identities_across_parameter_grid(self) -> None:
        for employment in (0, 1, 5, 10):
            for co in (0.0, 0.25, 0.75):
                for investment in (0.0, 20.0, 100.0):
                    a = solve_equilibrium(
                        ClosureParameters(
                            employed_workers=employment,
                            owner_spending_propensity=co,
                            investment=investment,
                        )
                    ).accounts
                    if a is not None:
                        self.assertAlmostEqual(a.nominal_gdp, a.consumption + a.investment)
                        self.assertAlmostEqual(a.nominal_gdp, a.wages + a.gross_surplus)
                        self.assertAlmostEqual(a.saving, a.investment)
                        self.assertGreaterEqual(a.owner_disposable_income, 0)


if __name__ == "__main__":
    unittest.main()

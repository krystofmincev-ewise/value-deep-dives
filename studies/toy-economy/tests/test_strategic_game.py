import unittest
from dataclasses import replace
from itertools import product

from toy_economy.incentives import IncentiveParameters
from toy_economy.strategic_game import (
    ACTIONS,
    ChoicePayoffs,
    StrategyCounts,
    best_response,
    choice_payoffs,
    counts_for_actions,
    enumerate_pure_nash,
    game_terms,
    simulate_best_responses,
    strategy_allocation,
)


class StrategicGameTests(unittest.TestCase):
    def test_late_automation_beats_retention_but_loses_to_exit(self) -> None:
        p = IncentiveParameters()
        payoffs = choice_payoffs(StrategyCounts(0, 9, 0), p)
        self.assertGreater(payoffs.robot, payoffs.human)
        self.assertLess(payoffs.robot, payoffs.exit)
        self.assertEqual(best_response(payoffs, "human"), "exit")

    def test_default_has_no_pure_equilibrium(self) -> None:
        self.assertEqual(enumerate_pure_nash(), ())

    def test_count_enumeration_matches_labeled_unilateral_deviations(self) -> None:
        p = IncentiveParameters(firms=3, setup_cost_per_wage_unit=0)
        found = {equilibrium.allocation.counts for equilibrium in enumerate_pure_nash(p)}
        brute_force: set[StrategyCounts] = set()
        for actions in product(ACTIONS, repeat=p.firms):
            allocation = strategy_allocation(counts_for_actions(actions), p)
            is_nash = True
            for index, current in enumerate(actions):
                current_payoff = getattr(allocation, current + "_payoff")
                assert current_payoff is not None
                for alternative in ACTIONS:
                    changed = actions[:index] + (alternative,) + actions[index + 1 :]
                    revised = strategy_allocation(counts_for_actions(changed), p)
                    payoff = getattr(revised, alternative + "_payoff")
                    assert payoff is not None
                    if payoff > current_payoff + 1e-9:
                        is_nash = False
            if is_nash:
                brute_force.add(allocation.counts)
        self.assertEqual(found, brute_force)
        self.assertEqual(found, {StrategyCounts(0, r, 3 - r) for r in range(2, 4)})

    def test_entry_recalculates_demand_and_concentration(self) -> None:
        p = IncentiveParameters()
        payoffs = choice_payoffs(StrategyCounts(1, 0, 8), p)
        self.assertAlmostEqual(payoffs.human, 4)
        self.assertAlmostEqual(payoffs.robot, 5 - game_terms(p).robot_hurdle_per_period)

    def test_all_exit_has_unserved_floor_and_unilateral_entry(self) -> None:
        p = IncentiveParameters(investment_share=0, autonomous_investment=20)
        allocation = strategy_allocation(StrategyCounts(0, 0, 10), p)
        self.assertEqual(allocation.nominal_gdp, 0)
        self.assertEqual(allocation.unserved_demand, 40)
        payoffs = choice_payoffs(StrategyCounts(0, 0, 9), p)
        self.assertAlmostEqual(payoffs.robot, 40 - game_terms(p).robot_hurdle_per_period)
        self.assertGreater(payoffs.robot, 0)

    def test_ties_retain_status_quo(self) -> None:
        tied = ChoicePayoffs(0, 0, 0)
        for action in ACTIONS:
            self.assertEqual(best_response(tied, action), action)
        self.assertEqual(best_response(ChoicePayoffs(2, 2), "exit"), "human")

    def test_simultaneous_cycle_is_detected_and_fixed_point_verified(self) -> None:
        p = IncentiveParameters()
        result = simulate_best_responses(p, mode="simultaneous")
        self.assertEqual(result.status, "cycle")
        self.assertEqual(result.cycle_length, 3)
        assert result.cycle_start is not None
        self.assertEqual(result.states[result.cycle_start].actions, result.states[-1].actions)
        self.assertTrue(all(state.maximum_deviation_gain > 0 for state in result.states))
        expensive = replace(p, setup_cost_per_wage_unit=10)
        fixed = simulate_best_responses(expensive)
        self.assertEqual(fixed.status, "fixed_point")
        self.assertEqual(fixed.states[-1].maximum_deviation_gain, 0)

    def test_normalization_does_not_change_all_human_aggregate_scale(self) -> None:
        for firms in (10, 100):
            p = IncentiveParameters(firms=firms)
            row = strategy_allocation(StrategyCounts(firms, 0, 0), p)
            self.assertAlmostEqual(row.nominal_gdp, 100)
            self.assertAlmostEqual(row.wages, 60)
            self.assertEqual(enumerate_pure_nash(p), ())

    def test_asynchronous_cycle_uses_labeled_profiles_at_sweep_boundaries(self) -> None:
        result = simulate_best_responses(mode="asynchronous")
        self.assertEqual(result.status, "cycle")
        self.assertEqual(result.cycle_start, 1)
        self.assertEqual(result.cycle_length, 19)
        self.assertEqual(result.states[1].actions, result.states[-1].actions)
        self.assertEqual(result.states[1].allocation.counts, StrategyCounts(0, 9, 1))
        limited = simulate_best_responses(max_rounds=1)
        self.assertEqual(limited.status, "iteration_limit")

    def test_positive_floor_can_support_profitable_all_robot_equilibrium(self) -> None:
        p = IncentiveParameters(investment_share=0, autonomous_investment=20)
        all_robots = StrategyCounts(0, 10, 0)
        row = strategy_allocation(all_robots, p)
        self.assertEqual(row.nominal_gdp, 40)
        assert row.robot_payoff is not None
        self.assertGreater(row.robot_payoff, 0)
        equilibria = enumerate_pure_nash(p)
        self.assertIn(all_robots, {equilibrium.allocation.counts for equilibrium in equilibria})

    def test_invalid_profiles_and_aggregate_losses_are_rejected(self) -> None:
        with self.assertRaises(ValueError):
            strategy_allocation(StrategyCounts(1, 0, 0))
        with self.assertRaises(ValueError):
            choice_payoffs(StrategyCounts(1, 0, 0))
        with self.assertRaises(ValueError):
            game_terms(IncentiveParameters(worker_propensity=0.5, investment_share=0))
        with self.assertRaises(ValueError):
            simulate_best_responses(initial=("human",))
        with self.assertRaises(ValueError):
            StrategyCounts(-1, 0, 11)


if __name__ == "__main__":
    unittest.main()

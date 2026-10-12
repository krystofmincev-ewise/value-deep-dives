import json
import unittest
from dataclasses import asdict, replace

from toy_economy.dynamics import DynamicsParameters, simulate
from toy_economy.ledger import CashLedger


class LedgerTests(unittest.TestCase):
    def test_payments_conserve_money_and_exposed_data_is_a_copy(self) -> None:
        ledger = CashLedger({"worker": 60, "firm": 40})
        ledger.transfer(0, "worker", "firm", 20, "consumption")
        self.assertEqual(ledger.balances, {"worker": 40, "firm": 60})
        self.assertEqual(ledger.money_stock, 100)
        balances = ledger.balances
        balances["worker"] = 10000
        self.assertEqual(ledger.balance("worker"), 40)

    def test_no_overdraft_negative_payment_or_unregistered_account(self) -> None:
        ledger = CashLedger({"a": 1, "b": 0})
        for amount in (-1, 2, float("nan"), float("inf")):
            with self.assertRaises(ValueError):
                ledger.transfer(0, "a", "b", amount, "invalid")
        with self.assertRaises(KeyError):
            ledger.transfer(0, "a", "c", 0, "invalid")
        with self.assertRaises(ValueError):
            ledger.transfer(0, "a", "a", 1, "invalid")
        with self.assertRaises(ValueError):
            CashLedger({"a": -1})


class DynamicsTests(unittest.TestCase):
    def test_stationary_baseline_has_explicit_replacement_and_financing(self) -> None:
        result = simulate()
        self.assertFalse(result.stopped_for_insolvency)
        for period in result.periods:
            self.assertAlmostEqual(period.production.nominal_gdp, 100)
            self.assertAlmostEqual(period.production.investment, 20)
            self.assertAlmostEqual(period.equity_contributions, 20)
            self.assertAlmostEqual(period.real_depreciation, 20)
            self.assertAlmostEqual(period.net_domestic_product, 80)
            self.assertAlmostEqual(period.closing_real_capital, 200)
            self.assertAlmostEqual(period.closing_balances["owners"], 40)

    def test_every_cash_payment_replays_without_overdraft(self) -> None:
        configurations = (
            DynamicsParameters(),
            DynamicsParameters(employed_workers=0),
            DynamicsParameters(employed_workers=5, owner_to_worker_transfer=30),
            DynamicsParameters(employed_workers=0, worker_ownership_share=0.5),
            DynamicsParameters(owner_equity_financing=False),
        )
        for parameters in configurations:
            result = simulate(parameters)
            for period in result.periods:
                balances = dict(period.opening_balances)
                for payment in period.payments:
                    self.assertGreaterEqual(balances[payment.payer] + 1e-9, payment.amount)
                    balances[payment.payer] -= payment.amount
                    balances[payment.payee] += payment.amount
                    self.assertAlmostEqual(sum(balances.values()), result.money_stock)
                for account, closing in period.closing_balances.items():
                    self.assertAlmostEqual(balances[account], closing)
                    self.assertGreaterEqual(closing, 0)
                self.assertAlmostEqual(period.closing_balances["capital_orders"], 0)
                a = period.production
                self.assertAlmostEqual(a.nominal_gdp, a.consumption + a.investment)
                self.assertAlmostEqual(a.nominal_gdp, a.wages + a.gross_surplus)
                self.assertAlmostEqual(a.nominal_gdp, a.gross_turnover - a.intermediate_expenses)
                self.assertAlmostEqual(period.gross_saving, a.investment)
                self.assertAlmostEqual(
                    period.closing_real_capital,
                    period.opening_real_capital
                    - period.real_depreciation
                    + a.investment / parameters.price,
                )

    def test_all_layoffs_have_a_finite_inherited_worker_cash_buffer(self) -> None:
        result = simulate(DynamicsParameters(employed_workers=0, periods=20))
        self.assertAlmostEqual(result.periods[0].production.nominal_gdp, 100)
        self.assertAlmostEqual(result.periods[0].closing_balances["workers"], 0)
        self.assertAlmostEqual(result.periods[1].production.nominal_gdp, 70)
        self.assertAlmostEqual(result.periods[2].production.nominal_gdp, 55)
        self.assertAlmostEqual(result.periods[-1].production.nominal_gdp, 40, places=3)
        self.assertAlmostEqual(result.periods[-1].closing_balances["owners"], 100)
        self.assertEqual(result.money_stock, 200)

    def test_lagged_income_cannot_be_spent_without_cash(self) -> None:
        first = simulate(DynamicsParameters(employed_workers=0, initial_worker_cash=0)).periods[0]
        self.assertEqual(first.production.nominal_gdp, 40)
        self.assertEqual(first.desired_consumption, 80)
        self.assertEqual(first.cash_financeable_consumption, 20)

    def test_owner_savings_must_finance_investment_or_reserves_run_down(self) -> None:
        result = simulate(DynamicsParameters(owner_equity_financing=False))
        for period in result.periods[:5]:
            self.assertAlmostEqual(period.production.investment, 20)
            self.assertEqual(period.equity_contributions, 0)
        self.assertAlmostEqual(result.periods[4].closing_balances["owners"], 140)
        self.assertAlmostEqual(result.periods[5].production.investment, 0)
        self.assertEqual(result.periods[5].desired_investment, 20)
        self.assertAlmostEqual(result.periods[5].production.nominal_gdp, 80)

    def test_unpaid_wages_stop_instead_of_implicitly_creating_credit(self) -> None:
        p = DynamicsParameters(
            initial_worker_cash=0,
            initial_owner_cash=0,
            initial_firm_cash=0,
            initial_lagged_wages=0,
            initial_lagged_gross_dividends=0,
        )
        result = simulate(p)
        self.assertTrue(result.stopped_for_insolvency)
        self.assertEqual(len(result.periods), 1)
        first = result.periods[0]
        self.assertEqual(first.production.wages, 60)
        self.assertEqual(first.wages_paid, 0)
        self.assertEqual(first.wage_arrears, 60)
        self.assertEqual(first.production.gross_surplus, -60)
        self.assertEqual(sum(first.closing_balances.values()), 0)

    def test_budget_balanced_transfer_reports_financing_limit(self) -> None:
        result = simulate(
            DynamicsParameters(employed_workers=0, owner_to_worker_transfer=60, periods=24)
        )
        self.assertEqual(result.periods[0].transfer, 40)
        self.assertEqual(result.periods[0].transfer_shortfall, 20)
        self.assertAlmostEqual(result.periods[-1].production.nominal_gdp, 100, places=4)
        self.assertAlmostEqual(result.periods[-1].transfer, 60)

    def test_broad_ownership_changes_lagged_spending(self) -> None:
        result = simulate(
            DynamicsParameters(employed_workers=0, worker_ownership_share=0.5, periods=24)
        )
        self.assertAlmostEqual(result.periods[-1].production.nominal_gdp, 80, places=1)
        self.assertAlmostEqual(
            result.periods[-1].worker_dividends, result.periods[-1].owner_dividends
        )

    def test_autonomous_owner_consumption_is_recirculation_not_a_finite_buffer(self) -> None:
        result = simulate(
            DynamicsParameters(employed_workers=0, owner_autonomous_consumption=10, periods=24)
        )
        self.assertAlmostEqual(result.periods[-1].production.nominal_gdp, 60, places=4)
        self.assertGreater(result.periods[-1].closing_balances["owners"], 40)

    def test_full_spending_with_maintained_capital_can_sustain_output(self) -> None:
        result = simulate(
            DynamicsParameters(
                employed_workers=0,
                owner_spending_propensity=1,
                autonomous_investment=0,
                depreciation_rate=0,
            )
        )
        for period in result.periods:
            self.assertAlmostEqual(period.production.nominal_gdp, 100)

    def test_lower_utilization_reduces_accelerator_investment(self) -> None:
        result = simulate(
            DynamicsParameters(employed_workers=0, utilization_investment_sensitivity=0.5)
        )
        self.assertEqual(result.periods[0].desired_investment, 20)
        self.assertEqual(result.periods[1].desired_investment, 20)
        self.assertLess(result.periods[2].desired_investment, 20)

    def test_physical_capacity_limits_nominal_production(self) -> None:
        first = simulate(DynamicsParameters(employed_workers=0, initial_real_capital=30)).periods[0]
        self.assertEqual(first.production.nominal_gdp, 30)
        self.assertEqual(first.production.investment, 20)
        self.assertEqual(first.production.consumption, 10)
        self.assertEqual(first.capacity_utilization, 1)

    def test_determinism_and_validation(self) -> None:
        p = DynamicsParameters(periods=2)
        self.assertEqual(
            json.dumps(asdict(simulate(p)), sort_keys=True, allow_nan=False),
            json.dumps(asdict(simulate(p)), sort_keys=True, allow_nan=False),
        )
        for field, value in (
            ("periods", 0),
            ("employed_workers", 11),
            ("initial_worker_cash", -1),
            ("depreciation_rate", 1.1),
            ("price", 0),
            ("owner_autonomous_consumption", float("nan")),
        ):
            with self.subTest(field=field), self.assertRaises(ValueError):
                replace(p, **{field: value})


if __name__ == "__main__":
    unittest.main()

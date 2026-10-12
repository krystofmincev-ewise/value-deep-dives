"""Produced assets, existing equity and protected payroll in matched cash towns."""

import unittest
from dataclasses import replace
from math import fsum

from toy_economy.adoption_structure import StructureParameters, simulate_structure


class AdoptionStructureTests(unittest.TestCase):
    def test_matched_stationary_control(self) -> None:
        result = simulate_structure()
        self.assertEqual(result.money_stock, 200)
        self.assertIsNone(result.stop_reason)
        for row in result.periods:
            self.assertEqual(row.nominal_gdp, 100)
            self.assertEqual(row.real_consumption, 80)
            self.assertEqual(row.investment, 20)
            self.assertEqual(row.actual_human_hours, 10)
            self.assertEqual(row.wages_paid, 60)
            self.assertEqual(row.owner_operating_income, 40)
            self.assertEqual(row.closing_balances["owners"], 40)

    def test_no_synergy_acquisition_has_exact_production_control(self) -> None:
        control = simulate_structure()
        bought = simulate_structure(StructureParameters(mode="acquisition_no_synergy"))
        for a, b in zip(control.periods, bought.periods, strict=True):
            for field in (
                "nominal_gdp",
                "real_gdp",
                "nominal_consumption",
                "real_consumption",
                "investment",
                "wages_paid",
                "gross_surplus",
                "actual_human_hours",
                "owner_operating_income",
                "worker_consumption",
                "owner_consumption",
            ):
                self.assertEqual(getattr(a, field), getattr(b, field))
            for af, bf in zip(a.firms, b.firms, strict=True):
                for field in ("operating_revenue", "value_added", "gross_surplus", "wages_paid"):
                    self.assertEqual(getattr(af, field), getattr(bf, field))
        event = bought.periods[5]
        self.assertEqual(event.acquisition_payment_excluded_from_gdp, 20)
        self.assertEqual(event.owner_asset_sale_receipts, 20)
        self.assertEqual(event.owner_operating_income, 40)
        self.assertEqual(event.provider_equity_asset_at_purchase_cost, 20)
        self.assertEqual(event.closing_balances["owners"], 60)
        self.assertEqual(event.closing_balances["ai_provider"], 5)

    def test_acquisition_routes_subsidiary_dividends_without_extra_va(self) -> None:
        row = simulate_structure(StructureParameters(mode="acquisition_no_synergy")).periods[6]
        provider = next(f for f in row.firms if f.firm_id == "ai_provider")
        self.assertEqual(provider.value_added, 0)
        self.assertEqual(provider.financial_dividends_received, 10)
        self.assertEqual(provider.dividends_paid, 10)
        self.assertTrue(
            any(
                p.purpose == "subsidiary_financial_dividend" and p.payee == "ai_provider"
                for p in row.payments
            )
        )

    def test_automation_and_purchase_are_separate_interventions(self) -> None:
        bought = simulate_structure(StructureParameters(mode="acquisition_then_automation"))
        technology = simulate_structure(StructureParameters(mode="automation_only"))
        self.assertEqual(bought.periods[9].actual_human_hours, 10)
        self.assertEqual(bought.periods[10].actual_human_hours, 8)
        for a, b in zip(bought.periods, technology.periods, strict=True):
            self.assertEqual(a.nominal_gdp, b.nominal_gdp)
            self.assertEqual(a.actual_human_hours, b.actual_human_hours)
            self.assertEqual(a.automation_fraction_a, b.automation_fraction_a)
        row = bought.periods[10]
        provider = next(f for f in row.firms if f.firm_id == "ai_provider")
        self.assertEqual(provider.operating_revenue, 6)
        self.assertEqual(provider.value_added, 6)
        self.assertEqual(provider.financial_dividends_received, 4)
        self.assertEqual(provider.dividends_paid, 10)
        self.assertEqual(row.nominal_gdp, 100)

    def test_entry_buys_new_equipment_and_opens_next_round(self) -> None:
        result = simulate_structure(StructureParameters(mode="funded_entry"))
        event, next_round = result.periods[5:7]
        self.assertEqual(event.entry_setup_investment, 20)
        self.assertEqual(event.investment, 40)
        self.assertEqual(event.nominal_gdp, 120)
        self.assertEqual(event.real_consumption, 80)
        self.assertEqual(event.owner_operating_income, 60)
        self.assertFalse(event.entry_operational)
        self.assertEqual(event.closing_entry_capital, 20)
        self.assertTrue(next_round.entry_operational)
        self.assertAlmostEqual(next_round.firms[0].consumption_quantity, 30)
        self.assertAlmostEqual(next_round.firms[1].consumption_quantity, 30)
        self.assertEqual(next_round.firms[2].consumption_quantity, 20)
        self.assertEqual(next_round.nominal_gdp, 102)
        self.assertEqual(next_round.entry_replacement, 2)
        self.assertEqual(next_round.investment, 22)
        self.assertEqual(next_round.capital_depreciation, 22)
        self.assertEqual(next_round.net_domestic_product, 80)
        self.assertEqual(next_round.net_investment, 0)
        self.assertAlmostEqual(next_round.actual_human_hours, 7.5)

    def test_entry_and_equity_purchase_can_end_with_same_cash_but_different_gdp(self) -> None:
        entry = simulate_structure(StructureParameters(mode="funded_entry")).periods[5]
        buy = simulate_structure(StructureParameters(mode="acquisition_no_synergy")).periods[5]
        self.assertEqual(entry.closing_balances, buy.closing_balances)
        self.assertEqual(entry.nominal_gdp - buy.nominal_gdp, 20)
        self.assertEqual(entry.closing_entry_capital, 20)
        self.assertEqual(buy.closing_entry_capital, 0)

    def test_provider_uses_ai_physically_without_paying_itself(self) -> None:
        row = simulate_structure(StructureParameters(mode="funded_entry")).periods[6]
        self.assertEqual(row.ai_task_usage, 2.5)
        self.assertEqual(row.firms[2].service_task_hours, 2.5)
        self.assertFalse(any(p.payer == p.payee for p in row.payments))
        self.assertEqual(row.firms[2].value_added, 20)
        self.assertEqual(row.firms[2].dividends_paid, 18)
        self.assertEqual(row.owner_operating_income, 40)
        self.assertEqual(row.gross_surplus, 42)

    def test_each_period_reconciles_capital_va_payments_and_money(self) -> None:
        for mode in (
            "control",
            "funded_entry",
            "acquisition_no_synergy",
            "acquisition_then_automation",
            "automation_only",
        ):
            result = simulate_structure(StructureParameters(mode=mode))
            for row in result.periods:
                replay = dict(row.opening_balances)
                for payment in row.payments:
                    self.assertGreaterEqual(replay[payment.payer] + 1e-9, payment.amount)
                    replay[payment.payer] -= payment.amount
                    replay[payment.payee] += payment.amount
                for account, balance in replay.items():
                    self.assertAlmostEqual(balance, row.closing_balances[account])
                self.assertAlmostEqual(fsum(row.closing_balances.values()), 200)
                self.assertAlmostEqual(row.nominal_gdp, fsum(f.value_added for f in row.firms))
                self.assertAlmostEqual(
                    row.nominal_gdp, 60 + fsum(f.gross_surplus for f in row.firms)
                )
                self.assertAlmostEqual(
                    row.closing_entry_capital,
                    0.9 * row.opening_entry_capital
                    + row.entry_replacement
                    + row.entry_setup_investment,
                )
                self.assertLessEqual(row.ai_task_usage, 10 + 1e-10)
                self.assertLessEqual(row.investment, 40)

    def test_insufficient_cash_refuses_acquisition_without_partial_transfer(self) -> None:
        row = simulate_structure(
            StructureParameters(mode="acquisition_then_automation", acquisition_price=26)
        ).periods[-1]
        self.assertFalse(row.acquired_consumer_a)
        self.assertEqual(row.automation_fraction_a, 0)
        result = simulate_structure(
            StructureParameters(mode="acquisition_no_synergy", acquisition_price=26)
        )
        self.assertEqual(result.periods[5].event.status, "refused")
        self.assertEqual(result.periods[5].acquisition_payment_excluded_from_gdp, 0)
        self.assertEqual(result.periods[5].nominal_gdp, 100)

    def test_entry_refusal_preserves_cash_and_production(self) -> None:
        for kwargs in ({"entry_equipment": 26}, {"entry_equipment": 21}):
            result = simulate_structure(StructureParameters(mode="funded_entry", **kwargs))
            row = result.periods[5]
            self.assertEqual(row.event.status, "refused")
            self.assertEqual(row.closing_entry_capital, 0)
            self.assertEqual(row.entry_setup_investment, 0)
            self.assertEqual(row.nominal_gdp, 100)
            self.assertEqual(row.closing_balances["ai_provider"], 25)

    def test_unproductive_entry_cannot_print_replacement_money(self) -> None:
        result = simulate_structure(StructureParameters(mode="funded_entry", ai_service_capacity=0))
        self.assertLess(result.periods[-1].closing_entry_capital, 20)
        self.assertEqual(result.periods[-1].entry_replacement, 0)
        self.assertGreater(result.periods[-1].desired_entry_replacement, 0)
        self.assertEqual(result.periods[-1].firms[2].consumption_quantity, 0)
        self.assertEqual(result.periods[-1].real_consumption, 80)
        self.assertIsNone(result.stop_reason)

    def test_protected_incumbent_payroll_failure_is_explicit(self) -> None:
        p = StructureParameters(mode="funded_entry", periods=50, entry_price=1.1)
        result = simulate_structure(p)
        self.assertEqual(result.stop_reason, "wage_arrears")
        self.assertEqual(result.periods[-1].period, 31)
        self.assertAlmostEqual(result.periods[-1].wage_arrears, 2)
        self.assertAlmostEqual(result.periods[-1].actual_human_hours, 7.25)
        self.assertEqual(len(result.periods), 32)

    def test_scarce_ai_rations_users_and_reassigns_to_nonuser(self) -> None:
        p = StructureParameters(
            mode="automation_only", automation_fraction=1, ai_service_capacity=0
        )
        row = simulate_structure(p).periods[-1]
        self.assertEqual(row.firms[0].consumption_quantity, 0)
        self.assertEqual(row.firms[1].consumption_quantity, 40)
        self.assertEqual(row.ai_task_usage, 0)
        self.assertEqual(row.stop_reason, "wage_arrears")

    def test_input_validation(self) -> None:
        for kwargs in (
            {"periods": 0},
            {"event_period": 20},
            {"automation_period": 4},
            {"acquisition_price": -1},
            {"entry_price": 0},
            {"entry_equipment": 0},
            {"equipment_capacity": 19},
            {"entry_depreciation_rate": 1.1},
            {"ai_service_capacity": float("nan")},
        ):
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                StructureParameters(**kwargs)
        p = StructureParameters(mode="funded_entry")
        self.assertIsNone(simulate_structure(replace(p, entry_price=0.7)).stop_reason)


if __name__ == "__main__":
    unittest.main()

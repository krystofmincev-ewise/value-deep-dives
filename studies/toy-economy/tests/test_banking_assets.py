"""Verify the exported explorer and teaching figures against recorded accounts."""

import json
import re
import unittest
from math import fsum
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class BankingAssetsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.saved = json.loads((ROOT / "outputs/banking/results.json").read_text())
        html = (ROOT / "site/banking.html").read_text()
        match = re.search(
            r'<script id="bank-data" type="application/json">(.*?)</script>', html, re.S
        )
        assert match is not None
        cls.display = json.loads(match[1])["cases"]

    def test_explorer_retains_every_path_and_its_actual_stop(self) -> None:
        self.assertEqual(set(self.display), set(self.saved["paths"]))
        for name, display in self.display.items():
            with self.subTest(case=name):
                source = self.saved["paths"][name]
                self.assertEqual(display["summary"], self.saved["summaries"][name])
                self.assertEqual(len(display["rows"]), len(source["periods"]))
                self.assertEqual(
                    display["rows"][-1]["period"], display["summary"]["last_completed_period"]
                )

    def test_displayed_money_flow_reconciles_and_matches_the_model(self) -> None:
        for name, display in self.display.items():
            for shown, source in zip(
                display["rows"], self.saved["paths"][name]["periods"], strict=True
            ):
                with self.subTest(case=name, period=shown["period"]):
                    self.assertEqual(shown["gdp"], source["production"]["nominal_gdp"])
                    self.assertAlmostEqual(
                        shown["gdp"],
                        shown["worker_consumption"]
                        + shown["owner_consumption"]
                        + shown["investment"],
                    )
                    self.assertAlmostEqual(
                        shown["deposits"],
                        shown["opening_deposits"]
                        + shown["new_credit"]
                        - shown["principal_repaid"]
                        - shown["interest_paid"]
                        + shown["bank_dividend"],
                    )
                    self.assertAlmostEqual(
                        shown["principal"],
                        source["opening_bank"]["loans"]
                        + shown["new_credit"]
                        - shown["principal_repaid"]
                        - shown["forgiven"],
                    )
                    self.assertAlmostEqual(
                        shown["equity"],
                        source["opening_bank"]["equity"]
                        + shown["interest_paid"]
                        - shown["bank_dividend"]
                        - shown["forgiven"],
                    )
                    self.assertAlmostEqual(
                        shown["total_debt"], shown["principal"] + shown["unpaid_interest"]
                    )
                    self.assertAlmostEqual(
                        shown["deposits"], fsum(shown["closing_balances"].values())
                    )

    def test_household_final_partial_payment_has_a_later_consumption_effect(self) -> None:
        rows = self.display["worker_gap_2_one_percent"]["rows"]
        self.assertEqual(rows[17]["principal"], 0)
        self.assertGreater(rows[18]["worker_consumption"], 48)
        self.assertLess(rows[18]["worker_consumption"], 60)
        self.assertAlmostEqual(rows[19]["worker_consumption"], 60)
        svg = (ROOT / "outputs/teaching/16-bank-households.svg").read_text()
        manifest = (ROOT / "outputs/teaching/manifest.json").read_text()
        self.assertIn("round 19", manifest)
        self.assertIn("60 for goods", svg)

    def test_optional_appendix_follows_the_prior_conclusion(self) -> None:
        article = (ROOT / "articles/03-when-the-economy-breaks.md").read_text()
        self.assertIn('id="one-last-experiment-give-the-town-a-bank"', article)
        self.assertLess(
            article.index("the old car is still outside your house"),
            article.index("## One last experiment"),
        )
        self.assertIn("../site/banking.html", article)


if __name__ == "__main__":
    unittest.main()

"""Prevent stale exports or illustrated claims drifting from audited model records."""

import hashlib
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class AdoptionAssetsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = ROOT / "outputs/adoption/results.json"
        cls.saved = json.loads(cls.source.read_text())
        cls.manifest = json.loads((ROOT / "outputs/adoption/figures/manifest.json").read_text())

    def test_saved_run_provenance_matches_executed_sources(self) -> None:
        for name, digest in self.saved["source_sha256"].items():
            with self.subTest(source=name):
                self.assertEqual(hashlib.sha256((ROOT / name).read_bytes()).hexdigest(), digest)

    def test_explorer_contains_exact_saved_paths_including_stops(self) -> None:
        html = (ROOT / "site/adoption.html").read_text()
        match = re.search(
            r'<script type="application/json" id="adoption-data">(.*?)</script>', html, re.S
        )
        self.assertIsNotNone(match)
        assert match is not None
        self.assertEqual(json.loads(match[1]), self.saved["cases"])

    def test_illustration_provenance_and_both_reading_editions(self) -> None:
        editions = [
            (ROOT / f"site/04-ai-arrives-one-shop-at-a-time{suffix}.html").read_text()
            for suffix in ("", "-animated")
        ]
        for record in self.manifest:
            with self.subTest(figure=record["id"]):
                source = ROOT / record["source_results"]
                self.assertEqual(
                    hashlib.sha256(source.read_bytes()).hexdigest(), record["source_sha256"]
                )
                svg = (ROOT / f"outputs/adoption/figures/{record['id']}.svg").read_text()
                self.assertIn("<title", svg)
                self.assertIn("<desc", svg)
                self.assertGreater(len(record["steps"]), 0)
                for edition in editions:
                    self.assertIn(f'id="figure-{record["id"]}"', edition)

    def test_zero_job_picture_retains_distribution_and_real_output(self) -> None:
        picture = next(r for r in self.manifest if r["id"] == "08-zero-jobs-sharing")
        for shown in picture["displayed_values"]["outcomes"]:
            row = self.saved["cases"][shown["case"]]["periods"][-1]
            self.assertEqual(shown["headcount"], 0)
            self.assertEqual(shown["worker_baskets"], row["worker_real_consumption"])
            self.assertEqual(shown["owner_baskets"], row["owner_real_consumption"])
            self.assertAlmostEqual(
                shown["worker_baskets"] + shown["owner_baskets"] + shown["investment"],
                shown["real_gdp"],
            )

    def test_uncertainty_picture_keeps_failure_counts_and_survivor_scope(self) -> None:
        picture = next(r for r in self.manifest if r["id"] == "09-timing-uncertainty")
        for shown in picture["displayed_values"]["distributions"]:
            policy = self.saved["timing_uncertainty"][shown["case"]]
            self.assertEqual(shown["completed"] + shown["stopped"], shown["samples"])
            self.assertEqual(shown["stopped"], policy["stopped"])
            self.assertEqual(shown["cumulative_real_gdp"], policy["cumulative_real_gdp"])

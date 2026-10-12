"""Check the published reading assets, including their static fallback contract."""

import json
import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SVG_NS = "{http://www.w3.org/2000/svg}"


class TeachingAssetsTests(unittest.TestCase):
    def test_each_diagram_has_both_formats_and_matching_reading_steps(self) -> None:
        records = json.loads((ROOT / "outputs/teaching/manifest.json").read_text())
        self.assertEqual(len(records), 17)
        self.assertEqual(len({record["id"] for record in records}), 17)
        for record in records:
            with self.subTest(diagram=record["id"]):
                base = ROOT / "outputs/teaching" / record["id"]
                svg = ET.fromstring(base.with_suffix(".svg").read_text())
                self.assertTrue(base.with_suffix(".png").read_bytes().startswith(b"\x89PNG"))
                stages = [g for g in svg.iter(SVG_NS + "g") if g.get("class") == "teaching-stage"]
                self.assertEqual(
                    [g.get("data-step") for g in stages],
                    [str(n + 1) for n in range(len(record["steps"]))],
                )
                self.assertTrue(svg.find(SVG_NS + "title").text)
                self.assertTrue(svg.find(SVG_NS + "desc").text)
                for token in svg.iter(SVG_NS + "circle"):
                    points = [
                        token.attrib["data-from"],
                        *token.get("data-via", "").split(";"),
                        token.attrib["data-to"],
                    ]
                    for point in filter(None, points):
                        x, y = map(float, point.split(","))
                        self.assertTrue(0 <= x <= 560 and 0 <= y <= record["height"])

    def test_both_editions_share_identical_complete_diagrams(self) -> None:
        static = (ROOT / "site/03-when-the-economy-breaks.html").read_text()
        animated = (ROOT / "site/03-when-the-economy-breaks-animated.html").read_text()
        svg = r"<svg\b.*?</svg>"
        self.assertEqual(re.findall(svg, static, re.S), re.findall(svg, animated, re.S))
        self.assertEqual(len(re.findall(svg, static, re.S)), 17)
        self.assertNotIn('src="teaching.js"', static)
        self.assertIn('src="teaching.js"', animated)
        self.assertEqual(len(re.findall(r'class="motion-controls"[^>]* hidden ', animated)), 17)
        self.assertNotIn("is-muted", animated)

    def test_manuscript_links_are_intact(self) -> None:
        article = ROOT / "articles/03-when-the-economy-breaks.md"
        links = re.findall(r"\]\(([^)]+)\)", article.read_text())
        for link in links:
            with self.subTest(link=link):
                self.assertFalse(re.search(r"\s", link), "Whitespace indicates a damaged URL")
                if not link.startswith("https://"):
                    self.assertTrue((article.parent / link).resolve().exists())


if __name__ == "__main__":
    unittest.main()

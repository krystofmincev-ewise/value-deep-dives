# Combined paper — independent readability review

Date: 12 October 2026  
Reviewer: independent Codex subagent `combined_readability_review`  
Scope: cold read for a non-specialist adolescent reader, story continuity, diagram/text agreement and misleading simplification. This is not a rerun or numerical audit of the engines, nor a Substack/browser layout review.

## Reviewed snapshot

| Manuscript | SHA-256 |
| --- | --- |
| `articles/05-who-buys-what-ai-makes.md` | `6b356b161fc544754ae90eff64627c505f1e3155687f426d56092ee563dd5d49` |
| `articles/05-appendix.md` | `bbebf2697608eb19ff8a495485eb187268da9b7aa015f18ada189f5e1da50d19` |

Read both complete manuscripts, the preceding illustrated and gradual-adoption articles, and inspected all 17 PNG figures used by the combined paper. Read the combined figure manifest. The parent added the public-repository link and changed the draft footer during review; the hashes above identify the latest text read. Public repository availability is outside this review.

## Verdict

The story is coherent and substantially meets the requested accessible teaching style. The car returns at the end, the town budget remains a useful anchor, and resets between experiments are explicit. The distinction between model assumptions and forecasts remains visible rather than being buried in the appendix. The war analogy has the necessary qualification. No fatal narrative or conceptual defect found. Two modest diagram-reading issues should be clarified before publication; two smaller fixes are worthwhile. A final snapshot check is required after changes.

## Findings, ranked

### 1. P2 — Label the AI invoice diagram's GDP as current-price spending

Location: section 4, caption for `outputs/adoption/figures/06-ai-fee.png`.

The figure says GDP 100 after a protected-pay automation scenario. The reader has just been taught to focus on real output; the caption currently never says that the figure follows coins rather than baskets. It also introduces “combined value added” without explaining it in the main paper. That combination risks the reader thinking the earlier production gain disappeared, or mistaking the 66.4 for profit.

Suggested replacement caption: “This picture follows coins, not basket quantities, in the protected-pay version. Shops receive 80 and pay about 13.6 to the AI supplier, leaving 66.4 to cover wages and shop profit. The supplier passes its income to owners. Together with 20 of equipment purchases, current-price GDP is still 100; the AI bill is already inside that total.” Ideally label the diagram itself “Current-price GDP 100,” but a clear adjacent caption is sufficient without revising the earlier paper's shared asset.

### 2. P2 — State that the zero-jobs bars omit equipment

Location: section 8, caption for `outputs/adoption/figures/08-zero-jobs-sharing.png`.

The graph's subtitles give real GDP 48.6 and 129.1, but its bars represent household baskets, which total 28.6 and 109.1. The arithmetic is correct once the reader remembers the extra 20 of equipment, but that distinction is absent beside this graph. This is exactly the kind of hidden numerical bookkeeping that can lose the intended reader.

Add a sentence: “The bars show household baskets only; add 20 of equipment in each version to get the GDP number above it.” Keep the existing note that dividend rights are an explicit gift, not an automatic AI outcome.

### 3. P3 — Correct the reading direction

Location: section 5 caption for `outputs/teaching/08-shrinking.png`.

“Start at the left” contradicts the vertical diagram. Replace with “Start at the top.”

### 4. P3 — Explain the extra layoffs row in the three-version comparison

Location: section 2 caption for `outputs/adoption/figures/04-worker-baskets.png`.

The prose describes three versions but the graph contains a fourth treatment row, “Layoffs,” alongside the baseline. Section 1 introduces this possibility, so it is recoverable, but the caption should connect it explicitly.

Add: “The layoffs row is another way of cutting the same total paid time: some people lose all their pay instead of everybody losing part.” This adds a meaningful distribution lesson without another section or new figures.

## Keep as written

- Keep the warning that private profit forecasts at 20% and later results at 40% are different moments. It prevents an otherwise tempting overclaim.
- Keep the temporary-gap versus permanent-income-loss distinction in the banking section, including the explicit exclusion of investment loans.
- Keep the gifted ownership rights visible in section 8. Moving that assumption exclusively to the appendix would materially mislead.
- Keep “survival is not sustainability” and the observed late payroll failure. This is an unusually useful lesson and is simple to understand.
- Keep the explanation that rebuilding does not establish that war raises total GDP. The analogy is appropriately narrow.
- Keep the separate-experiment markers. The visual town can be continuous without suggesting the code is one integrated model.

## Limits of this review

No real 15-year-old reader testing was conducted; accessibility is an editorial judgment. All source images are clear at their native resolution, but this review does not establish their legibility after Substack resizing, email rendering, or on a phone. Public publication should preserve captions and check the final Substack preview. No changes to manuscripts, source figures, or model code were made by this reviewer.


## Final revised-snapshot check — 12 October 2026

Re-read the revised main paper and appendix. All four findings above are resolved:

1. The AI-invoice caption explicitly follows coins, explains what remains after the supplier payment, and labels GDP as current-price GDP; it explains why cheaper baskets permit more purchases with the same coins.
2. The zero-jobs caption explicitly separates household-basket bars from the additional 20 of equipment included in GDP.
3. The contraction diagram now says “Start at the top.”
4. The contract comparison now explains why layoffs and shared shorter paid hours can produce the same total wage cut but different individual experiences.

The additional economics-review changes preserve accessibility: the original owners' continuing equipment-finance obligation is stated next to the dividend gift; the long-run replacement calculation explicitly assumes finance; and the closing market condition is limited to the invented town. The appendix links both independent reviews and the public repository. No new substantive readability or misleading-simplification blockers found.

**Final editorial verdict: passes this review's scope for publication.** This applies to the following source snapshots with their existing figures and captions. It does not certify public-link availability, Substack's rendered layout, email/mobile image resizing, or the economic code independently. Link normalization in the publication export is acceptable if it preserves destinations and all explanatory captions; substantive wording changes require a new snapshot check.

| Final manuscript | SHA-256 |
| --- | --- |
| `articles/05-who-buys-what-ai-makes.md` | `c83b66e7fc3c1ba5e9ea93799c42114abd9d601894e4524c25c3a209ddcb0dab` |
| `articles/05-appendix.md` | `bf4a7813167f43bb30277ef8fa6c3e88611e9ab16811eef3d8b88fb035aa14fe` |

---
type: research_memo
company: Snap Inc.
ticker: SNAP
status: draft
as_of: 2026-08-21
source_cutoff_at: 2026-08-21T16:15:00+02:00
scope: independent-valuation-publication-review
---

# Snap independent valuation and publication review

## Conclusion

**Analytical dossier: pass. Public prospective registration: pending.** Three independent review tracks examined the final coverage-cycle analysis for valuation arithmetic and capital structure, evidence and source quality, and public-repository safety and lifecycle consistency. Confidence-gap, regional-economics, Gemini/recommender, and licensed-workforce work corrected the advertising-price and Universal User Model records, bounded additional inputs, and informed probability weights. The bear, base, bull, probability-weighted, and six-month values reconstruct without a central arithmetic error. The final findings described below were resolved before release.

This pass means the research can be preserved as a clearly labeled draft under `companies/snap/`. It does not turn the record into a registered forecast: the reference price and matching benchmark observation still require reproducible official-close provenance, followed by a formal identifier and human approval.

### Final same-day reconciliation

- The completed Gemini Deep Research report was recovered and audited as a source-discovery aid; retained claims were rechecked at their underlying publishers.
- The 19.2% Universal User Model figure was corrected to aggregate long-form view-time sum; the same table reports only 0.28% more view time per user and 0.04% more application-open daily users.
- Current Snap semantic-ID research and licensed aggregate workforce comparisons support a competent-fast-follower technical case, while the scale gap and latest attrition/hiring signal constrain frontier-parity confidence.
- Recommendation progress is now an explicit, non-additive sensitivity: approximately $31 million / $240 million / $428 million of next-four-quarter advertising revenue and $0.01 / $0.23 / $0.64 of sum-of-the-parts value in bear/base/bull.
- The landing page and thesis now expose two-minute, ten-minute, operating-mechanism, risk-review, and full-audit paths into the same evidence set.

## Review scope and disposition

| Area | Finding | Disposition |
| --- | --- | --- |
| Scenario arithmetic | Quarterly revenue, adjusted EBITDA, FCF, three valuation methods, scenario weights, and six-month values needed independent reconstruction | Passed; principal displayed results are also asserted by the [deterministic verifier](../valuation/verify-2026-08-21.mjs) |
| Cash-flow metric pairing | Enterprise value had been paired with levered issuer FCF in one reverse-expectations line | Corrected to equity value / FCF |
| Leases and debt | The draft did not display its operating-lease exclusion and used debt carrying value without enough convention detail | Added the $691 million lease line, lease-excluded bridges and sensitivity, and carrying-value versus principal disclosure |
| Dilution | A rounded 3% equity-value shortcut overstated the illustrative dilution transfer | Recomputed from the disclosed 54.5 million incremental-share proxy |
| Capital bridge | Cash not retained and six-month capital assumptions were insufficiently explicit | Labeled as scenario assumptions, explained the bear case, and added sensitivity/provenance language |
| Licensed evidence | A workforce memo reproduced exact licensed-local-only aggregates | Removed all licensed figures from tracked files; the public memo now contains source metadata, a rights boundary, public facts, and original qualitative analysis only |
| Personal financial data | Drafts disclosed exact position size, cost basis, and inferable portfolio value | Reduced public disclosure to `long`; sizing and cost basis are omitted |
| Source provenance | Filing dates and source-log structure were inconsistent in several places | Corrected the filing date, repaired the central table, and clarified that module-specific citations retain specialist provenance |
| Record lifecycle | Same-cycle working files could be mistaken for parallel theses or valuations | Exposed one canonical report, valuation, forecast, and decision; Git history retains working-draft evolution |
| Repository layout | Research filenames were inconsistent and top-level navigation was stale | Standardized dated research filenames and kept all company-specific work inside the self-contained SNAP folder |

## Recalculation checks

| Check | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Next-four-quarter revenue | $6.831bn | $7.483bn | $8.050bn |
| Adjusted EBITDA | $1.074bn | $1.676bn | $2.143bn |
| Revenue-multiple value/share | $2.676 | $8.340 | $14.130 |
| Sum-of-the-parts value/share | $2.505 | $7.808 | $14.293 |
| Levered-equity DCF value/share | $2.244 | $7.072 | $14.223 |
| Adopted 12-month target | $2.50 | $7.75 | $14.25 |
| Six-month checkpoint | $3.704 | $6.733 | $10.806 |

The same-day [confidence-gap evidence pass](2026-08-21-confidence-gap-estimates.md) changed only the probabilities after recovering Snap's reported second-quarter advertising price. At the updated 25% / 55% / 20% probabilities, the unchanged adopted targets produce a **$7.7375** probability-weighted value, displayed as **$7.74**. The six-month checkpoints weight to **$6.790**, displayed as **$6.79**. The scenario-method recalculations above remain unchanged.

## Public-data boundary

No exact licensed workforce dataset values, source copies, account details, authentication artifacts, position amount, cost basis, share count, or inferable portfolio value are intended to be present in the tracked dossier. The [public workforce memo](2026-08-20-workforce.md) records the research boundary and qualitative conclusions without redistributing the licensed aggregates.

## Remaining publication gates

- Replace the dynamic $5.21 reference with a reproducible official SNAP close and freeze the matching QQQ benchmark observation and evaluation rule.
- Assign a formal forecast identifier only after the observations are immutable and human review is complete.
- Register the record in the prospective ledger only then; until that point, expected benchmark-relative return remains intentionally unset.

## Verification commands

```text
node companies/snap/valuation/verify-2026-08-21.mjs
npm run research:records -- validate-identity companies/snap/identity.md --json
npm run research:records -- validate-company-ledger track-record/forecast-ledger.csv --json
npm test
npm run research:validate
git diff --check
```

The merge that preserves this package is therefore a draft-research merge, not a prospective forecast publication.

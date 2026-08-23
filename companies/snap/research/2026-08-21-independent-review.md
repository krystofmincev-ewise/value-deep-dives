---
type: independent_review
company: Snap Inc.
ticker: SNAP
coverage_cycle_id: SNAP-2026-W34-01
status: draft
review_status: stale
reviewed_at: null
reviewer_independence: not_recorded
reviewed_final_report_hash: null
reviewed_valuation_hash: null
reviewed_decision_hash: null
reviewed_contract_hash: null
reviewed_model_hash: null
reviewed_verifier_hash: null
as_of: 2026-08-22
source_cutoff_at: 2026-08-22T23:57:00+02:00
scope: independent-valuation-publication-review
---

# Snap independent valuation and publication review

## Conclusion

**Historical review disposition: superseded; refresh required. Public prospective registration: pending.** Three independent review tracks examined the coverage-cycle analysis for valuation arithmetic and capital structure, evidence and source quality, and public-repository safety and lifecycle consistency. Confidence-gap, regional-economics, Gemini/recommender, and licensed-workforce work corrected the advertising-price and Universal User Model records and bounded additional inputs. That review covered the original deterministic six-month paths and the first twelve-month distribution model. The later joint-horizon extension is deterministically verified but was not independently reviewed, so this memo no longer supplies a current pass.

On 23 August, a method-hardening pass retired the unsupported 30% / 50% / 20% company-scenario weighting and added a deterministic 100,000-draw distribution model. Its separate verifier asserts the model contract, legal-state frequencies, cross-method values, quantiles, mean, and downside metrics. The Snap fact cutoff remains 22 August; this was a method review, not a new company-evidence pass.

The research remains preserved as a clearly labeled draft under `companies/snap/`. Before readiness or published status, a fresh review must bind the current horizon contract, model, verifier, report, valuation, and decision. A separate return forecast would additionally need an explicit convergence model, reproducible official-close and benchmark provenance, a formal identifier, and human approval.

### Final same-day reconciliation

- The completed Gemini Deep Research report was recovered and audited as a source-discovery aid; retained claims were rechecked at their underlying publishers.
- The 19.2% Universal User Model figure was corrected to aggregate long-form view-time sum; the same table reports only 0.28% more view time per user and 0.04% more application-open daily users.
- Current Snap semantic-ID research and licensed aggregate workforce comparisons support a competent-fast-follower technical case, while the scale gap and latest attrition/hiring signal constrain frontier-parity confidence.
- Recommendation progress is now an explicit, non-additive sensitivity: approximately $31 million / $240 million / $428 million of next-four-quarter advertising revenue and $0.01 / $0.23 / $0.64 of sum-of-the-parts value in bear/base/bull.
- The quarterly path now exposes total and advertising Q4/Q1 seasonality, the Q2 2025 pricing/Ramadan/de minimis comparison problem, World Cup and exact Easter/holiday timing, election-spend materiality, and Q3 advertising / Other Revenue and event-capitalization sensitivities. Those findings retain the operating anchors and preserve wide downside dispersion.
- The landing page and thesis now expose two-minute, ten-minute, operating-mechanism, risk-review, and full-audit paths into the same evidence set.

## Review scope and disposition

| Area | Finding | Disposition |
| --- | --- | --- |
| Valuation arithmetic | Quarterly revenue, adjusted EBITDA, FCF, three valuation methods, the original twelve-month stochastic distribution, and deterministic six-month paths needed independent reconstruction | Historical pass for that artifact set; the current joint verifier now proves arithmetic and contract parity, but its six-month distribution and transition layer still require fresh independent review |
| Cash-flow metric pairing | Enterprise value had been paired with levered issuer FCF in one reverse-expectations line | Corrected to equity value / FCF |
| Leases and debt | The draft did not display its operating-lease exclusion and used debt carrying value without enough convention detail | Added the $691 million lease line, lease-excluded bridges and sensitivity, and carrying-value versus principal disclosure |
| Dilution | A rounded 3% equity-value shortcut overstated the illustrative dilution transfer | Recomputed from the disclosed 54.5 million incremental-share proxy |
| Capital bridge | Cash not retained and six-month capital assumptions were insufficiently explicit | Labeled as scenario assumptions, explained the bear case, and added sensitivity/provenance language |
| Seasonality and event bases | Ordinary Q4/Q1 seasonality was implicit, while advertising-specific transitions, World Cup, election, Easter/holiday timing, Q2 2025 pricing/Ramadan/de minimis factors, and Q3 mix effects were not fully visible | Added sourced normalization tables and a deterministic verifier; retained forecast dollars, preserved downside dispersion, quantified Q3 event-capitalization sensitivity, and tightened clean-evidence falsifiers |
| Licensed evidence | A workforce memo reproduced exact licensed-local-only aggregates | Removed all licensed figures from tracked files; the public memo now contains source metadata, a rights boundary, public facts, and original qualitative analysis only |
| Personal financial data | Drafts disclosed exact position size, cost basis, and inferable portfolio value | Exact fills, size, and inferable portfolio value remain excluded; only the explicitly authorized rounded, unverified $4.70 history appears in the non-analytical addendum |
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
| Per-path method median | $2.505 | $7.808 | $14.223 |
| Six-month checkpoint | $3.704 | $6.733 | $10.806 |

The [confidence-gap evidence pass](2026-08-21-confidence-gap-estimates.md) recovered Snap's reported second-quarter advertising price, and the seasonality audit then tested its comparison base. Because Q2 2025 included a temporary Ads Manager pricing problem, Ramadan timing, and de minimis effects, Q2 2026 compounded price is roughly flat over two years and the current quarter included World Cup demand. Snap did not size any of those effects, so no add-back was invented. A hypothetical 1%–3% nonrecurring World Cup share of Q3 advertising would reduce the central revenue-multiple value by approximately $0.02–$0.05 per share and the central sum-of-the-parts value by approximately $0.01–$0.04, but it is not deducted absent issuer quantification. The subsequent [distribution-first model](2026-08-23-distribution-first-valuation.md) converts that uncertainty into continuous driver marginals and dependent tail draws. It produces a six-month **$3.81 P10, $6.77 P50, $10.64 P90, and $7.09 mean**, linked at 0.81 fair-value correlation to the unchanged twelve-month **$2.86 / $7.90 / $13.78 and $8.23 mean**. The path-method and $3.704 / $6.733 / $10.806 six-month recalculations above remain deterministic cross-checks rather than distribution outputs.

## Public-data boundary

No exact licensed workforce dataset values, source copies, account details, authentication artifacts, exact fill, position amount, share count, or inferable portfolio value are intended to be present in the tracked dossier. The user-authorized rounded $4.70 recollection is confined to the non-analytical [position-history addendum](../disclosures/2026-08-21-user-reported-position-history.md). The [public workforce memo](2026-08-20-workforce.md) records the research boundary and qualitative conclusions without redistributing the licensed aggregates.

## Remaining publication gates

- For any future return forecast, define market convergence, replace the dynamic $5.21 reference with a reproducible official SNAP close, and freeze the matching QQQ benchmark observation and evaluation rule.
- Assign a formal forecast identifier only after the observations are immutable and human review is complete.
- Register the record in the prospective ledger only then; until that point, expected benchmark-relative return remains intentionally unset.

## Verification commands

```text
node companies/snap/valuation/verify-2026-08-21.mjs
node companies/snap/valuation/verify-2026-08-21-distribution.mjs
node companies/snap/valuation/verify-2026-08-21-confidence-gaps.mjs
node companies/snap/valuation/verify-2026-08-21-regional-economics.mjs
node companies/snap/valuation/verify-2026-08-21-recommender-upside.mjs
node companies/snap/valuation/verify-2026-08-21-seasonality.mjs
npm run research:records -- validate-identity companies/snap/identity.md --json
npm run research:records -- validate-company-ledger track-record/forecast-ledger.csv --json
npm test
node --test scripts/snap-distribution.test.mjs
npm run research:validate
git diff --check
```

The merge that preserves this package is therefore a draft-research merge, not a prospective forecast publication.

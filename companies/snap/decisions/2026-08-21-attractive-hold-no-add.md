---
type: decision
decision_id: "2026-002"
company: Snap Inc.
ticker: SNAP
coverage_cycle_id: SNAP-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
identity_path: companies/snap/identity.md
identity_hash: sha256:d09ac6123bc50705e9193b94196e0d56445228609ac1309221ed92a940447157
security_id: snap-class-a-common
listing_id: nyse-snap
research_stance: attractive
action: hold
decided_at: 2026-08-21T16:15:00+02:00
research_cutoff: 2026-08-21T16:15:00+02:00
price_kind: public_reference
price: 5.21
price_at: 2026-08-20T20:59:05Z
price_source: integrated_public_market_data_feed
position_disclosure: long
thesis_path: companies/snap/thesis/2026-08-21-reunderwritten-thesis.md
valuation_path: companies/snap/valuation/2026-08-21-reunderwritten-valuation.md
benchmark: QQQ_adjusted_close_total_return_same_session_rule
target_horizon: 2027-08-20
expected_return_pct: 48.5
expected_excess_return_pct: null
action_hurdle_pct: 8.0
review_by: 2026-11-15
supersedes: "2026-001"
---

# SNAP — attractive research stance; hold / no add before third-quarter proof

> Draft research decision, not a trade instruction or personalized investment advice. No trade was placed. Full terms and formulas are in the [plain-English glossary](../GLOSSARY.md).

## Decision

The revised research stance is **attractive**. The exact scenario-weighted value before display rounding is $7.7375 versus a $5.21 reference, an expected return of approximately 48.5%; the displayed value is $7.74. The same-day [confidence-gap evidence pass](../research/2026-08-21-confidence-gap-estimates.md) moved five probability points from bear to base after Snap's Form 10-Q showed second-quarter advertising price per impression up approximately 10%; it did not change any scenario value.

The 8% action hurdle in the metadata is an **illustrative absolute-return hurdle**, not a forecast for the Nasdaq-100 exchange-traded fund benchmark (**QQQ**). Expected benchmark excess return is left blank because this record does not forecast QQQ. QQQ remains named so eventual performance can be measured against the same-session benchmark return.

### Hurdle and evidence gate

The 48.5% probability-weighted absolute return clears illustrative 8%, 15%, and 25% one-year hurdles, but that sensitivity is not a benchmark-relative forecast. The `attractive` label is therefore an absolute expected-value research stance; it must not be described as having passed a QQQ excess-return hurdle while `expected_excess_return_pct` remains null.

The draft evidence gate passes verified identity, public financial statements, capital structure, three-method valuation arithmetic, dilution treatment, counter-thesis, and observable review triggers. It fails the **formal publication gate** until the $5.21 reference and QQQ starting value have reproducible official-close records and the prospective chronology controls are completed. That failure blocks registration, not preservation of this visibly labeled draft.

The action for the disclosed existing position remains **hold / no add before the third-quarter proof point**. The reason is evidence and risk control, not weak expected value. Position size, cost basis, taxes, liquidity, and other holdings are intentionally omitted, so this public record does not make a personalized sizing recommendation.

## Scenario distribution

> `Probability-weighted value = Σ(scenario probability × scenario value)`
> `Portfolio impact ≈ position weight × security drawdown`

| Scenario | Probability | Value per share | Return from $5.21 |
| --- | ---: | ---: | ---: |
| Bear | 25% | $2.50 | -52% |
| Base | 55% | $7.75 | +49% |
| Bull | 20% | $14.25 | +174% |
| **Probability-weighted** | **100%** | **$7.74** | **+48.5%** using the unrounded $7.7375 value |

## Why the stance changed

- Snap's recent adjusted-profit guidance has repeatedly beaten the top of its initial range.
- Second-quarter revenue grew 19% while total adjusted costs grew 4% and gross margin reached 58%.
- The second-quarter Form 10-Q reports average advertising price per impression up approximately 10%, the first clear company-wide yield-repair quarter in the recent series.
- Current production research, public open-source systems, and licensed aggregate workforce evidence make a technically competent fast-follower outcome more likely than either technical failure or Meta-like parity; the estimated recommendation contribution is already embedded in the forecast.
- The direct-revenue business is now large enough to change total company growth.
- Meta Platforms and Reddit confirm that Snap's 1.68 times revenue multiple is an extreme discount; the base requires only approximately 2.05 times after triangulation.
- Australia appears small in direct company-level dollars, while the larger United States and European tails can be reserved rather than assumed as certain.

## Why the action is not “add”

- The third-quarter cost improvement is already public. A beat now requires advertising/revenue execution, not merely layoffs appearing in expense.
- Advertising effective price has improved for one quarter, but the implied impression volume was roughly flat/slightly negative and persistence after World Cup spending is unproved.
- The public shares have no vote.
- Headline free cash flow still does not cleanly cover stock-based compensation and dilution.
- An existing long already participates in upside; adding before the proof point increases exposure to the unresolved evidence gaps.

## Review trigger

Review immediately after third-quarter 2026 results and no later than 15 November 2026. Upgrade the action only if advertising growth, effective price, high-value users, gross margin, free cash flow per diluted share, and share count improve together. Reduce confidence immediately for a structural product remedy, unbounded Specs spending, or advertising growth below 8% with double-digit impression growth.

## Evidence

- [Main thesis and industry explainer](../thesis/2026-08-21-reunderwritten-thesis.md)
- [Valuation](../valuation/2026-08-21-reunderwritten-valuation.md)
- [Four-quarter forecast](../research/2026-08-21-quarterly-forecast.md)
- [Advertising and recommendation-system revalidation](../research/2026-08-21-ads-pricing-recommenders-revalidation.md)
- [Open-source recommendation systems, current team evidence, and quantified upside](../research/2026-08-21-open-source-recommender-gap.md)
- [Confidence-gap estimates](../research/2026-08-21-confidence-gap-estimates.md)
- [Regional advertising economics](../research/2026-08-21-regional-ad-economics.md)
- [Regulation and cost revalidation](../research/2026-08-21-regulation-costs-revalidation.md)
- [Meta Platforms and Reddit relative valuations](../research/2026-08-21-meta-reddit-relative-valuation.md)

The long-position disclosure is user-provided and not broker-verified; sizing and purchase details are intentionally omitted. OpenAI Codex agents and several narrowly scoped Gemini Deep Research runs assisted. Their output was treated as analyst aid, not evidence; retained claims were checked at the underlying source.

The $5.21 price is an integrated public-feed observation timestamped after the regular New York Stock Exchange session close. This record therefore remains a draft and must use a reproducible official regular-session close before prospective ledger registration.

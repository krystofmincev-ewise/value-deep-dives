---
type: valuation
company: Snap Inc.
ticker: SNAP
coverage_cycle_id: SNAP-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
valuation_contract_path: 2026-W34-valuation-contract.json
valuation_quantity: fair_value_per_share
valuation_display_semantics: distribution_percentiles
identity_path: companies/snap/identity.md
identity_hash: sha256:d09ac6123bc50705e9193b94196e0d56445228609ac1309221ed92a940447157
security_id: snap-class-a-common
listing_id: nyse-snap
status: draft
as_of: 2026-08-22
published_at: null
source_cutoff_at: 2026-08-22T23:57:00+02:00
currency: USD
reference_price: 5.21
reference_price_at: 2026-08-20T20:59:05Z
reference_price_source: integrated_public_market_data_feed
target_bear: null
target_base: null
target_bull: null
primary_distribution_p10: 2.86
primary_distribution_p50: 7.90
primary_distribution_p90: 13.78
primary_distribution_mean: 8.23
target_horizon: 2027-08-20
target_status: active
review_by: 2026-11-15
supersedes: null
distribution_method: structured_elicitation_monte_carlo_v2_joint_horizons
distribution_calibration_status: uncalibrated_shadow
distribution_seed: 20260821
distribution_sample_count: 100000
method_reviewed_at: 2026-08-23
---

# Snap valuation — 2026-W34

> Draft valuation, not a registered forecast or personalized investment advice. This is the single canonical valuation for coverage cycle `SNAP-2026-W34-01`; all evidence gathered during the cycle is incorporated here.

> **Current-opportunity frame:** every return begins from the $5.21 public reference. No personal entry price or earlier purchase rationale enters the model.

> **Reader key:** Enterprise value (**EV**), free cash flow (**FCF**), stock-based compensation (**SBC**), adjusted earnings before interest, taxes, depreciation, and amortization (**adjusted EBITDA**), sum of the parts (**SOTP**), and discounted cash flow (**DCF**) are written out at first use. The [glossary and formula guide](../GLOSSARY.md) explains every recurring term.

## Answer first

The [valuation-horizon contract](2026-W34-valuation-contract.json) is the exact
machine-readable record of the modeled quantity, both horizon outputs, model and
verifier paths, and transition diagnostics.

| Fair-value horizon | P10 | P50 / median | P90 | Mean | Probability below $5.21 |
| --- | ---: | ---: | ---: | ---: | ---: |
| **Six months — 20 February 2027** | **$3.81** | **$6.77** | **$10.64** | **$7.09** | **28.5%** |
| **Twelve months — 20 August 2027** | **$2.86** | **$7.90** | **$13.78** | **$8.23** | **28.6%** |

The six- and twelve-month values come from the same 100,000 linked draws, not two unrelated scenario tables. The twelve-month model estimates a **16.0% probability of fair-value impairment of at least 30%** and an **8.2% probability of impairment of at least 50%**; the corresponding six-month figures are **9.0%** and **4.1%**. Bottom-decile expected value is **$2.79 at six months** and **$2.06 at twelve months**. These are model-implied frequencies, not historically calibrated frequencies or market-price return forecasts.

The current value does not require giving Snap Meta's multiple. It comes from four central inputs:

- much stronger near-term cost leverage;
- conservative recent adjusted-profit guidance;
- a real direct-revenue engine that can keep total growth above advertising growth;
- relative valuation evidence showing that a 2.0–2.5 times revenue multiple would still leave Snap at a large discount to Meta and Reddit.

The evidence-gap pass found that Snap's Form 10-Q reports second-quarter average advertising price per impression up approximately 10%. Advertising revenue grew 9.3%, implying roughly flat/slightly negative impressions after rounding. The comparison-base audit prevents that observation from narrowing the downside distribution: Q2 2025 price fell 10% and included a temporary Ads Manager pricing problem, Ramadan timing, and de minimis effects, so the two-year index is roughly flat, while Q2 2026 also benefited from World Cup demand. Snap did not size those effects, so the model makes no fabricated add-back.

The model remains skeptical of 20%–30% base-case advertising growth. The base uses **13.5% advertising growth** and now requires the observed price repair to persist while impression delivery resumes, not Meta-like monetization.

Read this in layers: [operating anchor paths](#revised-operating-anchor-paths) → [three valuation methods](#method-1-target-date-revenue-multiple) → [distribution-first valuation](#distribution-first-valuation) → [reverse expectations](#reverse-expectations) → [sensitivities](#sensitivities). The [canonical report](../thesis/2026-W34-final-report.md) supplies the story; this document supplies the arithmetic.

## Core formulas

```text
Fully diluted equity value = share price × fully diluted shares

Net debt = debt - cash - marketable securities

Enterprise value = fully diluted equity value + net debt

Target value per share =
    (target revenue × enterprise-value-to-revenue multiple - target net debt)
    / target diluted shares

Six-month simulated value in each draw =
    (checkpoint revenue × checkpoint EV/revenue multiple
      - checkpoint net debt) / checkpoint diluted shares

Twelve-month simulated value in each draw =
    median(revenue-multiple value, SOTP value, levered-DCF value)

Distribution mean = Σ simulated values / number of draws

P10 / P50 / P90 = the 10th / 50th / 90th percentiles of simulated value
```

## Current capitalization

| Item | Value | Source / explanation |
| --- | ---: | --- |
| Reference share price | $5.21 | 20 August 2026 public market-data observation; [Google Finance cross-check](https://www.google.com/finance/quote/SNAP:NYSE) |
| Basic shares outstanding | 1.682 billion | Second-quarter 2026 [Form 10-Q](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000052/snap-20260630.htm) |
| Shares underlying awards | 0.199 billion | Second-quarter issuer supplemental disclosure |
| **Fully diluted share proxy** | **1.881 billion** | Basic shares plus underlying awards |
| Cash and marketable securities | $2.660 billion | Second-quarter Form 10-Q |
| Debt | $3.535 billion | Second-quarter net carrying value; contractual principal was approximately $3.468 billion at 2025 year-end before the $47 million August 2026 maturity payment |
| **Net debt, excluding operating leases** | **$0.875 billion** | Carrying-value debt less cash and marketable securities; the August maturity payment reduces debt and cash together and is approximately net-debt neutral |
| Operating-lease liabilities | $0.691 billion | Current plus non-current second-quarter liabilities; lease payments are already reflected in operating costs and cash flow |
| Fully diluted equity value | $9.800 billion | $5.21 × 1.881 billion |
| **Enterprise value, excluding operating leases** | **$10.675 billion** | Equity value plus lease-excluded net debt |
| Enterprise value including operating leases, diagnostic only | $11.366 billion | Not used in the model because cash flow and peer multiples are not lease-adjusted |
| Trailing revenue | $6.351 billion | Third quarter 2025 through second quarter 2026 |
| Enterprise value / trailing revenue | 1.68 times excluding leases; 1.79 times including them mechanically | The 1.68-times convention is used consistently in the target and peer bridges |
| Fully diluted equity / headline trailing FCF | 13.9 times | $9.800 billion / $0.706 billion |

The provider's $8.67 billion market capitalization uses a basic-share convention. A valuation that compares that number with future per-share outcomes while ignoring 199 million underlying awards understates the economic equity base.

## Owner-economics correction

Trailing headline FCF was $706 million, but trailing SBC was $1.031 billion and the fully diluted proxy rose 3% year over year despite buybacks. Fully subtracting SBC from FCF is too punitive because grant-date expense and current economic dilution are not identical. Ignoring it is too generous.

A useful middle check uses the exact year-over-year increase in the fully diluted proxy, from 1.8264 billion to 1.8809 billion shares:

```text
Market-value dilution proxy = 54.5 million incremental shares × $5.21
                            = approximately $284 million

Illustrative owner cash = $706 million headline FCF - $284 million dilution proxy
                        = approximately $422 million

Illustrative owner-cash multiple = $9.80 billion / $422 million
                                 = approximately 23.2 times
```

This is why Snap can be cheap on revenue but not obviously cheap on clean current owner earnings.

## Revised operating anchor paths

The detailed quarter-by-quarter build is in the [canonical four-quarter forecast](../research/2026-W34-quarterly-forecast.md).

Parenthetical growth below compares forecast Q3 2026–Q2 2027 with reported Q3 2025–Q2 2026. It is not sequential quarterly growth.

| Third quarter 2026 through second quarter 2027 | Downside anchor | Central anchor | Upside anchor |
| --- | ---: | ---: | ---: |
| Advertising revenue | $5.545 billion (+4.1%) | $6.048 billion (+13.5%) | $6.422 billion (+20.5%) |
| Other Revenue | $1.286 billion (+25.7%) | $1.435 billion (+40.3%) | $1.628 billion (+59.1%) |
| **Total revenue** | **$6.831 billion (+7.6%)** | **$7.483 billion (+17.8%)** | **$8.050 billion (+26.8%)** |
| Adjusted EBITDA | $1.074 billion | $1.676 billion | $2.143 billion |
| Adjusted EBITDA margin | 15.7% | 22.4% | 26.6% |
| Headline FCF | $0.650 billion | $1.100 billion | $1.500 billion |
| Target net debt, excluding operating leases | $0.850 billion | $0.450 billion | $0.000 billion |
| Target diluted shares | 1.980 billion | 1.920 billion | 1.880 billion |

These three paths are interpretable operating anchors, not exhaustive probability buckets. The stochastic model interpolates continuous marginal distributions around them and separately samples dependency and legal-tail states. The revenue and FCF rows are **after** the explicit regulatory and legal allowances shown later in this document. The target net-debt figures exclude operating leases, begin with that after-allowance FCF, and then apply a separate conservative assumption for repurchases, financing effects, movements in financial assets, and other cash not retained.

### What supports the base case

The base uses $7.483 billion of revenue, $1.676 billion of adjusted EBITDA, and $1.10 billion of FCF. The profit path is supported by:

- revenue rose 19% while the adjusted cost structure rose 4% in the second quarter;
- gross margin reached 58%;
- infrastructure cost per daily user has stayed broadly stable since 2024;
- official full-time employees fell 12.2% sequentially;
- more than $500 million of annualized savings should be more fully visible beginning in the third quarter;
- recent adjusted-profit guidance has repeatedly left meaningful cushion.

The model does not add $500 million directly to FCF. Legal, safety, infrastructure, cash interest, post-restructuring transition or contractor substitution, and Specs can absorb part of it. Most announced restructuring cash had already been paid by 30 June 2026 and is not deducted again.

## Method 1: target-date revenue multiple

This method capitalizes the latest twelve months of revenue expected to be known at the August 2027 target date.

| Revenue-multiple bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Target-date trailing revenue | $6.831 billion | $7.483 billion | $8.050 billion |
| Enterprise value / revenue | 0.90 times | 2.20 times | 3.30 times |
| Implied enterprise value | $6.148 billion | $16.463 billion | $26.565 billion |
| Less target net debt, excluding operating leases | $0.850 billion | $0.450 billion | $0.000 billion |
| Implied equity value | $5.298 billion | $16.013 billion | $26.565 billion |
| Target diluted shares | 1.980 billion | 1.920 billion | 1.880 billion |
| **Value per share** | **$2.68** | **$8.34** | **$14.13** |

The base 2.20 times multiple is a rerating from today's 1.68 times, but it is still approximately 64% below Meta's current 6.11 times and approximately 78% below Reddit's current 10.19 times. It requires double-digit growth, visible cost leverage, and no major share-count or legal surprise. It does not require competitive parity.

This is a scenario judgment, not the output of a peer regression or a reliable historical-band rule. Snap's changing profitability, direct-revenue mix, debt, and dilution make a single historical multiple misleading. The values are therefore deliberately tested at 0.90, 2.20, and 3.30 times; the sensitivity section shows how much the answer changes if that judgment is wrong.

The bull 3.30 times multiple remains approximately 46% below Meta and 68% below Reddit. It requires clear advertising-price repair, high-value-user stabilization, durable direct revenue, contained dilution, and bounded Specs/legal spending.

## Method 2: sum of the parts

Other Revenue deserves a separate multiple because it grows faster and includes recurring subscriptions. It does not deserve a software-as-a-service multiple because subscriber churn, geography, plan mix, partnership revenue, and gross margin are not disclosed. Current country-level subscription prices and the regional contribution model improve the allocation range but do not reveal subscriber geography or plan mix, so they do not change this multiple.

| Sum-of-the-parts bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Advertising revenue | $5.545 billion | $6.048 billion | $6.422 billion |
| Advertising revenue multiple | 0.70 times | 1.80 times | 2.80 times |
| Other Revenue | $1.286 billion | $1.435 billion | $1.628 billion |
| Other Revenue multiple | 1.50 times | 3.00 times | 5.00 times |
| Net Specs option value | $0 | $0.25 billion | $0.75 billion |
| Less net debt, excluding operating leases | $0.850 billion | $0.450 billion | $0.000 billion |
| **Value per share** | **$2.51** | **$7.81** | **$14.29** |

No hardware profit is modeled. The Specs line is an option value after expected negative carry, not a reimbursement of more than $3 billion of historical spending.

## Method 3: discounted cash flow

Because Snap's FCF is after cash interest, this is a levered-equity DCF. It discounts FCF per diluted share and does not subtract net debt again.

```text
Present value of annual FCF per share =
    FCF per share in year t / (1 + cost of equity)^t

Terminal value per share =
    final-year FCF per share × (1 + terminal per-share growth)
    / (cost of equity - terminal per-share growth)

Terminal per-share growth =
    (1 + terminal company growth) / (1 + net dilution) - 1
```

| DCF assumption | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Year-one revenue / FCF | $6.831 billion / $0.650 billion | $7.483 billion / $1.100 billion | $8.050 billion / $1.500 billion |
| Five-year revenue path after year one | 4%, 3%, 2%, 2% | 14%, 12%, 10%, 8% | 20%, 18%, 15%, 12% |
| FCF margin by year five | 9.5% | 16.5% | 20.0% |
| Net annual dilution after year one | 3% | 1% | 0% |
| Cost of equity | 14% | 13% | 12% |
| Terminal company growth | 2.0% | 2.5% | 3.0% |
| Terminal per-share growth after dilution | -1.0% | 1.5% | 3.0% |
| Present value of years one through five | $1.13 | $2.59 | $4.08 |
| Present value of terminal value | $1.11 | $4.48 | $10.14 |
| **DCF value per share** | **$2.24** | **$7.07** | **$14.22** |

For reproducibility, the model linearly interpolates FCF margin from the year-one value to the displayed year-five value. Revenue growth and net dilution then follow the paths above.

<details>
<summary><strong>Open the five-year bear, base, and bull DCF schedules</strong></summary>


| Bear annual schedule | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Revenue, billions | 6.831 | 7.104 | 7.317 | 7.464 | 7.613 |
| FCF margin | 9.52% | 9.51% | 9.51% | 9.50% | 9.50% |
| Diluted shares, billions | 1.980 | 2.039 | 2.101 | 2.164 | 2.229 |
| FCF per share | $0.33 | $0.33 | $0.33 | $0.33 | $0.32 |

| Base annual schedule | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Revenue, billions | 7.483 | 8.531 | 9.554 | 10.510 | 11.351 |
| FCF margin | 14.70% | 15.15% | 15.60% | 16.05% | 16.50% |
| Diluted shares, billions | 1.920 | 1.939 | 1.959 | 1.978 | 1.998 |
| FCF per share | $0.57 | $0.67 | $0.76 | $0.85 | $0.94 |

| Bull annual schedule | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Revenue, billions | 8.050 | 9.660 | 11.399 | 13.109 | 14.682 |
| FCF margin | 18.63% | 18.98% | 19.32% | 19.66% | 20.00% |
| Diluted shares, billions | 1.880 | 1.880 | 1.880 | 1.880 | 1.880 |
| FCF per share | $0.80 | $0.98 | $1.17 | $1.37 | $1.56 |

</details>

The terminal value represents approximately 50%, 63%, and 71% of the three values. The DCF is therefore a cross-check, not a precision instrument.

## Deterministic anchor cross-check

| Operating anchor | Revenue-multiple method | Sum-of-the-parts method | Discounted-cash-flow method | Median cross-check |
| --- | ---: | ---: | ---: | ---: |
| Downside | $2.68 | $2.51 | $2.24 | **$2.51** |
| Central | $8.34 | $7.81 | $7.07 | **$7.81** |
| Upside | $14.13 | $14.29 | $14.22 | **$14.22** |

These are deterministic cross-checks, not the P10, P50, and P90 distribution outputs. The stochastic engine uses the same three valuation methods on every draw and takes their per-draw median so that shared fundamentals are not mistaken for three independent estimates. The central legal and regulatory allowances are already inside revenue and FCF and are not deducted again.

## Distribution-first valuation

The old 30% / 50% / 20% scenario weights were structured analyst judgment, but they had no empirical reference class and the three scenario points were not exhaustive conditional means. Multiplying those weights by rounded bear/base/bull values created a precise-looking expected value without a defensible probability-estimation process. That calculation is retired.

The replacement is a transparent, deterministic-seed Monte Carlo model. It elicits five-point marginal curves—minimum, P10, P50, P90, and maximum—for the material operating and valuation drivers; applies explicit common-factor dependence so adverse operating, capital, and multiple outcomes can cluster; and samples four mutually exclusive legal states. Each draw now contains a linked six-month checkpoint and twelve-month target state. It does **not** probability-weight the displayed P10/P50/P90 values.

| Method / triangulation | Mean | P10 | P50 | P90 | Probability below $5.21 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Revenue multiple | $8.37 | $2.85 | $8.23 | $13.83 | 27.5% |
| Sum of the parts | $8.19 | $2.81 | $7.79 | $13.81 | 29.3% |
| Levered DCF | $7.14 | $2.65 | $6.41 | $12.51 | 37.3% |
| **Per-draw median triangulation** | **$8.23** | **$2.86** | **$7.90** | **$13.78** | **28.6%** |

The output remains **uncalibrated structured elicitation** and therefore runs in shadow-model status. Its improvement is transparency, dependency handling, and full-distribution risk reporting—not a claim that 28.6% is an observed historical frequency. The complete contract, marginals, tail map, diagnostics, and limitations are in the [distribution-first valuation memo](../research/2026-08-23-distribution-first-valuation.md).

### Seasonality and one-off events—not extra upside

The distribution uses the quarter-specific schedule rather than applying one annual growth rate to every quarter. The central path retains Snap's normal fourth-quarter advertising peak and first-quarter reversal. Same-quarter year-over-year growth removes ordinary recurring seasonality, not one-offs. The model assigns zero explicit value to the November 2026 United States election; political-archive normalization changes 2024–2025 annual growth by only about 0.5–0.6 percentage point. It also assigns zero explicit holiday-calendar uplift even though Thanksgiving falls one day earlier in 2026.

Management said third-quarter guidance already reflected expected World Cup normalization, so the model adds no uplift beyond that guide. However, 19 tournament days remain inside Q3 and therefore inside next-four-quarter revenue. If 1% / 2% / 3% of central Q3 advertising were event-linked and nonrecurring, the central revenue-multiple value would fall by approximately $0.02 / $0.03 / $0.05 per share and the central sum-of-the-parts value by approximately $0.01 / $0.03 / $0.04. No deduction is made because Snap did not quantify the effect; disclosure above 3% is a model-recalculation trigger.

Easter shifts from 5 April 2026 in Q2 to 28 March 2027 in Q1, and Q1 2027 laps a $20 million–$25 million geopolitical headwind. Those alter quarterly interpretation rather than the four-quarter total. Second-quarter 2027 is still measured against the reported World Cup-aided denominator. See the [seasonality and event bridge](../research/2026-W34-quarterly-forecast.md#seasonality-and-event-normalization) and [`verify-2026-08-21-seasonality.mjs`](verify-2026-08-21-seasonality.mjs).

### Recommendation-upside sensitivity—not an add-on

The recommendation-system follow-up decomposes the existing next-four-quarter advertising forecasts rather than raising them. In the downside/central/upside anchors, an estimated $31 million / $240 million / $428 million of forecast advertising revenue depends on continued recommendation, measurement, creative-understanding, and lower-funnel progress. Applying each anchor's existing advertising multiple and diluted share count produces a narrow sum-of-the-parts contribution of approximately **$0.01 / $0.23 / $0.64 per share**.

The former $0.24 hand-weighted diagnostic is retired. Recommendation progress is already embedded in the sampled advertising-revenue and valuation-multiple drivers and is not an add-on to $8.23. A visible technical failure could reduce value by more because it could weaken both the advertising path and multiple; strong production progress should first update those marginals rather than be added mechanically. See the [technical memo](../research/2026-08-21-open-source-recommender-gap.md#8-how-much-recommendation-upside-remains) and [`verify-2026-08-21-recommender-upside.mjs`](verify-2026-08-21-recommender-upside.mjs).

## Linked six-month distribution and checkpoint

By approximately 20 February 2027, investors should have the third- and fourth-quarter results. The base and bull checkpoint multiples use a **larger proof discount** than the twelve-month model because less evidence will be available. The checkpoint bear multiple is higher than the twelve-month bear multiple because there is less time for a distressed deterioration path to compound.

| Six-month bridge | Downside path | Central path | Upside path |
| --- | ---: | ---: | ---: |
| Latest likely trailing revenue | $6.676 billion | $6.928 billion | $7.163 billion |
| Enterprise value / revenue | 1.20 times | 1.95 times | 2.90 times |
| Net debt, excluding operating leases | $0.825 billion | $0.650 billion | $0.350 billion |
| Diluted shares | 1.940 billion | 1.910 billion | 1.890 billion |
| **Value per share** | **$3.70** | **$6.73** | **$10.81** |

These deterministic paths remain arithmetic cross-checks. Their revenue, multiple, net-debt, and share-count assumptions supply the central three anchors of four six-month driver marginals, with explicit minimum and maximum endpoints beyond them. The joint model treats the revenue and net-debt anchors as containing half of the displayed twelve-month legal allowances, first reverses those assumed embedded amounts, and then applies the shared sampled legal branch exactly once. Because mixed draws do not keep every driver inside one bundled path, the resulting value quantiles are close to—but not exactly—the three deterministic values.

| Six-month distribution output | Value per share | Fair-value change from $5.21 | Meaning |
| --- | ---: | ---: | --- |
| P10 | **$3.81** | -27% | 10% of modeled values are lower |
| P50 / median | **$6.77** | +30% | Half of modeled values are lower and half higher |
| P90 | **$10.64** | +104% | 10% of modeled values are higher |
| **Mean** | **$7.09** | **+36%** | Average across all 100,000 linked draws |

The link is explicit rather than a straight-line interpolation from $5.21. Six-month revenue rank is correlated **0.85** with the weighted twelve-month advertising/Other-Revenue state, the valuation-multiple rank **0.80**, and capital/share-count rank **0.90**. The same legal branch continues across both horizons, with 50% of its modeled cash and trailing-revenue effect recognized by six months. Separate checkpoint shocks allow third- and fourth-quarter evidence to differ from the final twelve-month state. These transition coefficients are analyst judgments, not measured serial correlations.

The resulting six-/twelve-month fair-value correlation is **0.81**, and twelve-month value exceeds its linked six-month value in **63.4%** of draws. Sorting paths by their six-month value gives the following forward bridge:

| Six-month value band | Twelve-month mean | Twelve-month median | Probability twelve-month value is below $5.21 |
| --- | ---: | ---: | ---: |
| Bottom quartile — at or below $4.96 | $4.04 | $3.59 | 74.8% |
| Lower-middle quartile — $4.96 to $6.77 | $6.83 | $6.63 | 30.3% |
| Upper-middle quartile — $6.77 to $8.99 | $9.15 | $9.19 | 8.7% |
| Top quartile — above $8.99 | $12.89 | $12.54 | 0.7% |

This is a linked fair-value path, not a forecast that the quoted market price must equal fair value at either date. The checkpoint net-debt and share-count marginals remain structured estimates rather than an award-by-award or cash-use schedule, and neither horizon is registered as a market-price target.

## Meta and Reddit relative anchors

The [peer valuation memo](../research/2026-08-21-meta-reddit-relative-valuation.md) uses fully diluted equity values, net cash or debt, and trailing financials.

| Company | Current enterprise value / trailing revenue | Latest revenue growth | Trailing operating margin | Twelve-month valuation reference |
| --- | ---: | ---: | ---: | ---: |
| Meta Platforms | 6.11 times | 28% | 38.1% | $605 versus $545.83 reference |
| Reddit | 10.19 times | 61% | 28.2% | $176 versus $150.31 reference |
| Snap | 1.68 times | 19% | -5.1% | **$8.23 mean / $7.90 median versus $5.21 reference** |

Meta is not obviously cheap after adjusting for approximately $130–$145 billion of planned 2026 capital expenditure and massive infrastructure commitments. Reddit is growing much faster but its 10 times revenue multiple is fragile. The comparison nevertheless matters: Snap can remain heavily discounted and still produce strong equity upside.

## Regulation and litigation reserve

The [jurisdiction-by-jurisdiction revalidation](../research/2026-08-21-regulation-costs-revalidation.md) estimated a central hand-weighted value reserve of approximately $180–$260 million, or $0.09–$0.14 per diluted share, after overlap controls. The distribution model replaces that aggregation with explicit, exhaustive legal states while preserving the memo as an evidence input.

The deterministic anchor paths book the exposure exactly once through path-specific revenue and cash-flow inputs:

| Regulatory and legal bridge | Downside anchor | Central anchor | Upside anchor |
| --- | ---: | ---: | ---: |
| Revenue before incremental regulatory drag | $6.906 billion | $7.528 billion | $8.070 billion |
| Less incremental regulatory revenue drag | ($75 million) | ($45 million) | ($20 million) |
| **Revenue used in every valuation method** | **$6.831 billion** | **$7.483 billion** | **$8.050 billion** |
| FCF before incremental legal and compliance cash | $950 million | $1.250 billion | $1.550 billion |
| Less compliance operating expense inside adjusted operating expense and adjusted EBITDA | ($25 million) | ($25 million) | ($15 million) |
| Less settlement, fine, and court-remedy cash below adjusted EBITDA | ($275 million) | ($125 million) | ($35 million) |
| **Total incremental legal and compliance cash effect** | **($300 million)** | **($150 million)** | **($50 million)** |
| **FCF used in the DCF and capital bridge** | **$650 million** | **$1.100 billion** | **$1.500 billion** |

Across the 100,000 draws, the explicit legal-state simulation averages approximately **$177 million of incremental cash effect** and **$45 million of incremental revenue drag**. Capitalizing the latter at the regulation memo's 1.6-times diagnostic multiple produces an approximately **$248 million** combined check, inside the specialist memo's central range. The state frequencies are manageable 60%, material 30%, severe 8%, and extreme 2%; those are exhaustive state weights, not weights attached to the three narrative valuation paths.

Each anchor's target net-debt bridge begins with its after-allowance FCF. The stochastic engine instead begins from pre-legal marginals, subtracts exactly one sampled legal state, and derives net debt from that after-state FCF; it does not subtract the anchor allowance again. Compliance operating expense reduces adjusted EBITDA and FCF; settlements, fines, and court-remedy cash are deducted below adjusted EBITDA. The separate cash-not-retained input covers repurchases, financing effects, financial assets, and other uses. The owner-economics dilution check is unrelated to regulation.

No separate $0.09–$0.14 per-share amount is subtracted after these operating inputs. The approximately $600 million–$1.2 billion discontinuous adverse tail is represented in the severe and extreme legal states and can coincide with weak operating and multiple draws. Correlations among those risks are structured judgment, not observed calibration. A structural product injunction can still produce a value below the reported P10.

## Reverse expectations

The current lease-excluded enterprise value of $10.675 billion equals:

- approximately 1.68 times current trailing revenue;
- approximately 10.4 times trailing adjusted EBITDA;
- approximately 13.9 times headline FCF at the equity level, which is the correct pairing because the issuer's FCF is after cash interest;
- approximately 23.2 times the illustrative owner-cash measure at the equity level.

The market is not pricing literal failure. It is pricing weak durability and governance. At the base target, the implied enterprise value is only a little above 2 times revenue and roughly 9 times target adjusted EBITDA. The base therefore depends more on achieving the operating forecast than on an extravagant terminal multiple.

## Sensitivities

At $7.483 billion of base target revenue and 1.92 billion target shares:

- every 0.25 turn of enterprise-value-to-revenue multiple changes value by approximately **$0.97 per share**;
- every $100 million of revenue changes value by approximately **$0.11 per share** at a 2.20 times multiple;
- every $250 million of net debt changes value by approximately **$0.13 per share**;
- a 2% increase in target shares reduces the base revenue-multiple value by approximately **$0.16 per share**.
- removing a 3% World Cup-linked share of base Q3 advertising reduces the base revenue-multiple value by approximately **$0.05 per share** and the base sum-of-the-parts value by approximately **$0.04 per share**.

Mechanically subtracting the current $691 million operating-lease liability from target equity value would reduce scenario values by approximately $0.35–$0.37 per share. That is a diagnostic, not an alternative target: applying it without also adjusting rent-bearing cash flows and peer multiples would double count part of the lease burden.

The multiple and persistence of advertising price repair matter more than small forecast changes.

The dependency assumption also matters. Holding all marginals fixed and reducing the common-factor loading from 1.00 to zero raises P10 from approximately **$2.86 to $3.28** and reduces the modeled probability below $5.21 from **28.5% to 26.4%** in the 50,000-draw stress. Raising the loading to 1.15 lowers P10 to **$2.75** and raises that probability to **29.2%**. This is why the model reports dependency stress rather than pretending the inputs are independent.

## What must happen for the $7.90 median to be reasonable

- third-quarter revenue modestly exceeds the high end of guidance;
- adjusted profit beats guidance for operating reasons, not a one-time accounting item;
- advertising grows in the low-to-mid teens over the next four quarters;
- the Q3 total-revenue result includes a credible advertising / Other Revenue split rather than hiding a weak auction behind direct revenue;
- eCPM stops falling materially and shows non-World-Cup-dependent persistence in Q4 2026 or Q1 2027;
- Q1 2027 reported advertising growth remains at least approximately 12% despite its easier geopolitical and Easter comparison, and Q2 2027 withstands World Cup/Easter normalization;
- Other Revenue remains above 30% growth without hidden margin deterioration;
- adjusted gross margin approaches 60%;
- legal and safety expense stays inside the modeled reserve;
- target diluted shares remain near 1.92 billion;
- Specs spending stays inside the announced operating envelope.

## What would make the model too optimistic

- advertising growth remains below 8% while impressions continue growing in the teens;
- the reported second-quarter approximately 10% advertising-price improvement reverses while impression growth resumes without enough demand;
- disclosed World Cup-related demand exceeds 3% of Q2 or Q3 advertising revenue without a corresponding Year-one normalization, or political/advocacy spend exceeds 1% of quarterly advertising revenue;
- sequential advertising materially misses the recent approximately +12% Q2-to-Q3 / +13% Q3-to-Q4 pattern or resets by materially more than approximately 16% in Q1 without an explained mix shift;
- North American daily users fall below 90 million;
- direct revenue decelerates sharply or its artificial-intelligence partnership is temporary;
- adjusted gross margin falls below 55%;
- annualized savings are rebuilt through contractors, hiring, legal work, or Specs;
- diluted shares move toward or above 1.98 billion;
- a U.S. product-design injunction touches Streaks or the close-friend graph;
- the European Union imposes an unusually large fine or intrusive remedy;
- the United Kingdom restriction causes more lasting cohort damage than the modeled four-to-five-month impact.

## Valuation conclusion

At $5.21, Snap looks **undervalued on this distributional valuation**, but it remains a high-variance, low-governance security. The $8.23 mean and $7.90 median are attractive because the business does not need Meta-like monetization or a Meta-like multiple. It needs continued direct-revenue growth, cost discipline, and proof that the second-quarter advertising-price repair can persist while impression delivery resumes. The 28.6% modeled probability below the reference price prevents the central estimate from being mistaken for a low-risk outcome.

That supports an attractive absolute expected-value assessment. The formal QQQ-relative research stance remains insufficient evidence because the valuation does not forecast QQQ. Neither conclusion makes a concentrated position low risk; public sizing context is intentionally omitted.

## Target lifecycle and publication status

- **Analytical release status:** linked model verified and suitable for repository preservation as a clearly labeled draft; fresh independent review pending.
- **Prospective scorecard status:** unregistered; this fair-value distribution is not a target-price forecast and cannot be resolved by market price alone.
- **Horizons:** linked fair-value checkpoints at 20 February 2027 and 20 August 2027.
- **Evaluation rule:** not applicable to this analytical fair-value distribution. A separately frozen market-convergence or return forecast would need its own observable resolution rule.
- **Review:** immediately after third-quarter 2026 results and no later than 15 November 2026.
- **Scorecard-registration blockers for any future return forecast:** define the market-convergence quantity, replace the dynamic $5.21 quote with a reproducible official-close record, freeze the matching benchmark observation and rule, assign a formal identifier, and obtain explicit prospective-registration approval before writing an immutable ledger record.

## Sources and verification

- [Central source log](../sources.md)
- [Financials and capital structure](../research/2026-08-20-financials-capital-structure.md)
- [Four-quarter forecast and capital bridge](../research/2026-W34-quarterly-forecast.md)
- [Advertising-price and recommendation-system revalidation](../research/2026-08-21-ads-pricing-recommenders-revalidation.md)
- [Meta and Reddit peer valuation](../research/2026-08-21-meta-reddit-relative-valuation.md)
- [Regulation and cost revalidation](../research/2026-08-21-regulation-costs-revalidation.md)
- [Confidence-gap estimates](../research/2026-08-21-confidence-gap-estimates.md)
- [Regional advertising contribution model](../research/2026-08-21-regional-ad-economics.md)
- [Open-source recommender and quantified-upside review](../research/2026-08-21-open-source-recommender-gap.md)
- [Independent valuation and publication review](../research/2026-08-21-independent-review.md)
- [Distribution-first valuation method and results](../research/2026-08-23-distribution-first-valuation.md)
- [Stochastic valuation engine](model-2026-W34-distribution.mjs)
- [Distribution-output verifier](verify-2026-08-21-distribution.mjs)
- [Deterministic valuation verifier](verify-2026-08-21.mjs)
- [Confidence-gap verifier](verify-2026-08-21-confidence-gaps.mjs)
- [Regional-economics verifier](verify-2026-08-21-regional-economics.mjs)
- [Recommendation-upside verifier](verify-2026-08-21-recommender-upside.mjs)
- [Seasonality and event-normalization verifier](verify-2026-08-21-seasonality.mjs)

The displayed capitalization, revenue-multiple, sum-of-the-parts, discounted-cash-flow, sensitivity, quarterly-seasonality, comparison-base, and event-normalization calculations were independently recomputed through 22 August. The deterministic verifiers assert the anchor and seasonality calculations. The distribution verifier asserts both horizon outputs, their declared linkage and ordered transition bands, the unchanged twelve-month results, state frequencies, risk metrics, method cross-checks, and parity with the machine-readable horizon contract. The earlier independent review predates the joint-horizon extension and is stale; a fresh independent pass is required before readiness. The official-close provenance gap separately prevents prospective publication.

Return to the [canonical investment report](../thesis/2026-W34-final-report.md), inspect the [four-quarter forecast](../research/2026-W34-quarterly-forecast.md), or review the [portfolio action](../decisions/2026-W34-decision.md#portfolio-action).

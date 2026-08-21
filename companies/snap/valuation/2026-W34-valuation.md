---
type: valuation
company: Snap Inc.
ticker: SNAP
coverage_cycle_id: SNAP-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
identity_path: companies/snap/identity.md
identity_hash: sha256:d09ac6123bc50705e9193b94196e0d56445228609ac1309221ed92a940447157
security_id: snap-class-a-common
listing_id: nyse-snap
status: draft
as_of: 2026-08-21
published_at: null
source_cutoff_at: 2026-08-21T16:15:00+02:00
currency: USD
reference_price: 5.21
reference_price_at: 2026-08-20T20:59:05Z
reference_price_source: integrated_public_market_data_feed
target_bear: 2.50
target_base: 7.75
target_bull: 14.25
target_horizon: 2027-08-20
target_status: active
review_by: 2026-11-15
supersedes: null
---

# Snap valuation — 2026-W34

> Draft valuation, not a registered forecast or personalized investment advice. This is the single canonical valuation for coverage cycle `SNAP-2026-W34-01`; all evidence gathered during the cycle is incorporated here.

> **Current-opportunity frame:** every return begins from the $5.21 public reference. No personal entry price or earlier purchase rationale enters the model.

> **Reader key:** Enterprise value (**EV**), free cash flow (**FCF**), stock-based compensation (**SBC**), adjusted earnings before interest, taxes, depreciation, and amortization (**adjusted EBITDA**), sum of the parts (**SOTP**), and discounted cash flow (**DCF**) are written out at first use. The [glossary and formula guide](../GLOSSARY.md) explains every recurring term.

## Answer first

| Scenario | Twelve-month value per share | Return from $5.21 | Probability | Six-month checkpoint |
| --- | ---: | ---: | ---: | ---: |
| Bear | **$2.50** | -52% | 30% | $3.70 |
| Base | **$7.75** | +49% | 50% | $6.73 |
| Bull | **$14.25** | +174% | 20% | $10.81 |
| **Probability-weighted** | **$7.48** | **+43%** | 100% | **$6.64** |

The current value does not require giving Snap Meta's multiple. It comes from four central inputs:

- much stronger near-term cost leverage;
- conservative recent adjusted-profit guidance;
- a real direct-revenue engine that can keep total growth above advertising growth;
- relative valuation evidence showing that a 2.0–2.5 times revenue multiple would still leave Snap at a large discount to Meta and Reddit.

The evidence-gap pass found that Snap's Form 10-Q reports second-quarter average advertising price per impression up approximately 10%. Advertising revenue grew 9.3%, implying roughly flat/slightly negative impressions after rounding. The comparison-base audit prevents that observation from reducing bear probability: Q2 2025 price fell 10% and included a temporary Ads Manager pricing problem, so the two-year index is roughly flat, while Q2 2026 also benefited from World Cup demand.

The model remains skeptical of 20%–30% base-case advertising growth. The base uses **13.5% advertising growth** and now requires the observed price repair to persist while impression delivery resumes, not Meta-like monetization.

## Core formulas

```text
Fully diluted equity value = share price × fully diluted shares

Net debt = debt - cash - marketable securities

Enterprise value = fully diluted equity value + net debt

Target value per share =
    (target revenue × enterprise-value-to-revenue multiple - target net debt)
    / target diluted shares

Probability-weighted value =
    Σ (scenario probability × scenario value per share)
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

## Revised operating scenarios

The detailed quarter-by-quarter build is in the [21 August forecast](../research/2026-W34-quarterly-forecast.md).

| Third quarter 2026 through second quarter 2027 | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Advertising revenue | $5.545 billion (+4.1%) | $6.048 billion (+13.5%) | $6.422 billion (+20.5%) |
| Other Revenue | $1.286 billion (+25.7%) | $1.435 billion (+40.3%) | $1.628 billion (+59.1%) |
| **Total revenue** | **$6.831 billion (+7.6%)** | **$7.483 billion (+17.8%)** | **$8.050 billion (+26.8%)** |
| Adjusted EBITDA | $1.074 billion | $1.676 billion | $2.143 billion |
| Adjusted EBITDA margin | 15.7% | 22.4% | 26.6% |
| Headline FCF | $0.650 billion | $1.100 billion | $1.500 billion |
| Target net debt, excluding operating leases | $0.850 billion | $0.450 billion | $0.000 billion |
| Target diluted shares | 1.980 billion | 1.920 billion | 1.880 billion |

The revenue and FCF rows are **after** the explicit regulatory and legal allowances shown later in this document. The target net-debt figures exclude operating leases, begin with that after-allowance FCF, and then apply a separate conservative assumption for repurchases, financing effects, movements in financial assets, and other cash not retained.

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

The terminal value represents approximately 50%, 63%, and 71% of the three values. The DCF is therefore a cross-check, not a precision instrument.

## How the final scenario values are selected

| Scenario | Revenue-multiple method | Sum-of-the-parts method | Discounted-cash-flow method | Adopted target |
| --- | ---: | ---: | ---: | ---: |
| Bear | $2.68 | $2.51 | $2.24 | **$2.50** |
| Base | $8.34 | $7.81 | $7.07 | **$7.75** |
| Bull | $14.13 | $14.29 | $14.22 | **$14.25** |

The adopted values are rounded judgments inside the cross-check range. The base is below the revenue-multiple result because cash-flow quality, dilution, and method uncertainty still matter; the central legal and regulatory allowances are already inside revenue and FCF and are not deducted again here. The bear is not set at the DCF low because a growing direct-revenue business and improving gross margin retain value even if the multiple stays distressed.

## Probability weighting

```text
Probability-weighted value =
    30% × $2.50 + 50% × $7.75 + 20% × $14.25
    = $7.475, displayed as $7.48 per share
```

The 30% bear weight remains substantial. Snap is founder-controlled, the public shares have no vote, the advertising-price observation is not clean across the comparison base, high-value users are shrinking, and legal outcomes have a fat tail. The 20% bull weight reflects real product, direct-revenue, and cost evidence rather than merely multiple optimism; it is constrained because second-quarter impressions were roughly flat and World Cup spending helped demand.

These probabilities are analyst judgment, not a calibrated reference-class frequency. The completed evidence and comparison-base pass supports 30% bear, 50% base, and 20% bull. Since expected value is highly sensitive to both probabilities and multiples, $7.48 should be read as a decision aid, not false precision.

### Seasonality and one-off events—not extra upside

The probability distribution uses the quarter-specific schedule rather than applying one annual growth rate to every quarter. The base retains Snap's normal fourth-quarter advertising peak and first-quarter reversal. It assigns zero explicit value to the November 2026 United States election, adds no World Cup uplift to the third quarter because management said guidance already reflected normalization, and measures second-quarter 2027 against the reported World Cup-aided denominator. Easter shifts from Q2 2026 to Q1 2027, and Q1 2027 laps a $20 million–$25 million geopolitical headwind; those alter quarterly interpretation, not the four-quarter total. See the [seasonality and event bridge](../research/2026-W34-quarterly-forecast.md#seasonality-and-event-normalization) and [`verify-2026-08-21-seasonality.mjs`](verify-2026-08-21-seasonality.mjs).

### Recommendation-upside sensitivity—not an add-on

The recommendation-system follow-up decomposes the existing next-four-quarter advertising forecasts rather than raising them. In the bear/base/bull cases, an estimated $31 million / $240 million / $428 million of forecast advertising revenue depends on continued recommendation, measurement, creative-understanding, and lower-funnel progress. Applying the scenario's existing advertising multiple and diluted share count produces a narrow sum-of-the-parts contribution of approximately **$0.01 / $0.23 / $0.64 per share**, or about **$0.24 probability-weighted**.

That $0.24 is already inside $7.48. It is a “no further improvement” sensitivity, not a new target increment. A visible technical failure could reduce value by more because it could also weaken the advertising multiple and cash-flow path; strong production progress should first increase confidence in the existing base/bull forecasts rather than be added mechanically. See the [technical memo](../research/2026-08-21-open-source-recommender-gap.md#8-how-much-recommendation-upside-remains) and [`verify-2026-08-21-recommender-upside.mjs`](verify-2026-08-21-recommender-upside.mjs).

## Six-month checkpoint

By approximately 20 February 2027, investors should have the third- and fourth-quarter results. The base and bull checkpoint multiples use a **larger proof discount** than the twelve-month model because less evidence will be available. The checkpoint bear multiple is higher than the twelve-month bear multiple because there is less time for a distressed deterioration path to compound.

| Six-month bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Latest likely trailing revenue | $6.676 billion | $6.928 billion | $7.163 billion |
| Enterprise value / revenue | 1.20 times | 1.95 times | 2.90 times |
| Net debt, excluding operating leases | $0.825 billion | $0.650 billion | $0.350 billion |
| Diluted shares | 1.940 billion | 1.910 billion | 1.890 billion |
| **Value per share** | **$3.70** | **$6.73** | **$10.81** |

Using the 30% / 50% / 20% probabilities produces a probability-weighted six-month checkpoint of **$6.64**, approximately 27% above $5.21. The checkpoint net-debt and share-count rows are standalone scenario assumptions rather than a forecasted half-year award-by-award or cash-use schedule. It is illustrative and not a registered six-month target.

## Meta and Reddit relative anchors

The [peer valuation memo](../research/2026-08-21-meta-reddit-relative-valuation.md) uses fully diluted equity values, net cash or debt, and trailing financials.

| Company | Current enterprise value / trailing revenue | Latest revenue growth | Trailing operating margin | Quick probability-weighted twelve-month value |
| --- | ---: | ---: | ---: | ---: |
| Meta Platforms | 6.11 times | 28% | 38.1% | $605 versus $545.83 reference |
| Reddit | 10.19 times | 61% | 28.2% | $176 versus $150.31 reference |
| Snap | 1.68 times | 19% | -5.1% | **$7.48 versus $5.21 reference** in the current valuation |

Meta is not obviously cheap after adjusting for approximately $130–$145 billion of planned 2026 capital expenditure and massive infrastructure commitments. Reddit is growing much faster but its 10 times revenue multiple is fragile. The comparison nevertheless matters: Snap can remain heavily discounted and still produce strong equity upside.

## Regulation and litigation reserve

The [jurisdiction-by-jurisdiction revalidation](../research/2026-08-21-regulation-costs-revalidation.md) estimates a central probability-weighted value reserve of approximately $180–$260 million, or $0.09–$0.14 per diluted share, after overlap controls.

The operating model books the central exposure exactly once through scenario-specific revenue and cash-flow inputs:

| Regulatory and legal bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Revenue before incremental regulatory drag | $6.906 billion | $7.528 billion | $8.070 billion |
| Less incremental regulatory revenue drag | ($75 million) | ($45 million) | ($20 million) |
| **Revenue used in every valuation method** | **$6.831 billion** | **$7.483 billion** | **$8.050 billion** |
| FCF before incremental legal and compliance cash | $950 million | $1.250 billion | $1.550 billion |
| Less compliance operating expense inside adjusted operating expense and adjusted EBITDA | ($25 million) | ($25 million) | ($15 million) |
| Less settlement, fine, and court-remedy cash below adjusted EBITDA | ($275 million) | ($125 million) | ($35 million) |
| **Total incremental legal and compliance cash effect** | **($300 million)** | **($150 million)** | **($50 million)** |
| **FCF used in the DCF and capital bridge** | **$650 million** | **$1.100 billion** | **$1.500 billion** |

At the 30% / 50% / 20% scenario weights, cash allowances average $175 million and revenue drag averages $49 million. Capitalizing the latter at the regulation memo's 1.6-times diagnostic multiple produces $78.4 million, for a combined check of approximately $253.4 million. This sits inside the specialist memo's central range.

The target net-debt bridge begins with this after-allowance FCF. Compliance operating expense reduces adjusted EBITDA and FCF; settlements, fines, and court-remedy cash are deducted below adjusted EBITDA. Its separate cash-not-retained residual covers repurchases, financing effects, financial assets, and other uses—not legal cash already deducted above. The owner-economics dilution check is unrelated to regulation.

No separate $0.09–$0.14 per-share amount is subtracted after these operating inputs. The approximately $600 million–$1.2 billion discontinuous adverse tail affects the scenario narrative and multiple only to the extent it is **beyond** the central allowances. The 30% bear case is not a one-for-one mapping of the specialist memo's severe regulatory probability; it also contains advertising, user, cost, governance, and dilution failures. Correlations among those risks are judgmental. A structural product injunction could still produce a value below $2.50.

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

Mechanically subtracting the current $691 million operating-lease liability from target equity value would reduce scenario values by approximately $0.35–$0.37 per share. That is a diagnostic, not an alternative target: applying it without also adjusting rent-bearing cash flows and peer multiples would double count part of the lease burden.

The multiple and persistence of advertising price repair matter more than small forecast changes.

## What must happen for $7.75 to be reasonable

- third-quarter revenue modestly exceeds the high end of guidance;
- adjusted profit beats guidance for operating reasons, not a one-time accounting item;
- advertising grows in the low-to-mid teens over the next four quarters;
- the Q3 total-revenue result includes a credible advertising / Other Revenue split rather than hiding a weak auction behind direct revenue;
- eCPM stops falling materially and shows non-World-Cup-dependent persistence in Q4 2026 or Q1 2027;
- Other Revenue remains above 30% growth without hidden margin deterioration;
- adjusted gross margin approaches 60%;
- legal and safety expense stays inside the modeled reserve;
- target diluted shares remain near 1.92 billion;
- Specs spending stays inside the announced operating envelope.

## What would make the model too optimistic

- advertising growth remains below 8% while impressions continue growing in the teens;
- the reported second-quarter approximately 10% advertising-price improvement reverses while impression growth resumes without enough demand;
- North American daily users fall below 90 million;
- direct revenue decelerates sharply or its artificial-intelligence partnership is temporary;
- adjusted gross margin falls below 55%;
- annualized savings are rebuilt through contractors, hiring, legal work, or Specs;
- diluted shares move toward or above 1.98 billion;
- a U.S. product-design injunction touches Streaks or the close-friend graph;
- the European Union imposes an unusually large fine or intrusive remedy;
- the United Kingdom restriction causes more lasting cohort damage than the modeled four-to-five-month impact.

## Valuation conclusion

At $5.21, Snap now looks **undervalued on a probability-weighted basis**, but it remains a high-variance, low-governance security. The expected value is attractive because the business does not need Meta-like monetization or a Meta-like multiple. It needs continued direct-revenue growth, cost discipline, and proof that the second-quarter advertising-price repair can persist while impression delivery resumes.

That supports an attractive absolute expected-value assessment. The formal QQQ-relative research stance remains insufficient evidence because the valuation does not forecast QQQ. Neither conclusion makes a concentrated position low risk; public sizing context is intentionally omitted.

## Target lifecycle and publication status

- **Analytical release status:** complete, internally reviewed, and ready for repository publication as a clearly labeled draft.
- **Prospective scorecard status:** unregistered; `published_at` and a prospective forecast identifier remain unset.
- **Horizon:** 20 August 2027.
- **Evaluation rule if later registered:** Snap's unadjusted regular-session close on 20 August 2027, or the immediately preceding New York Stock Exchange session.
- **Review:** immediately after third-quarter 2026 results and no later than 15 November 2026.
- **Scorecard-registration blockers:** replace the dynamic $5.21 quote with a reproducible official-close record, freeze the matching benchmark observation and rule, assign the formal identifier, and obtain explicit prospective-registration approval before writing the immutable ledger record.

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
- [Deterministic valuation verifier](verify-2026-08-21.mjs)
- [Confidence-gap verifier](verify-2026-08-21-confidence-gaps.mjs)
- [Regional-economics verifier](verify-2026-08-21-regional-economics.mjs)
- [Recommendation-upside verifier](verify-2026-08-21-recommender-upside.mjs)

The displayed capitalization, revenue-multiple, sum-of-the-parts, discounted-cash-flow, scenario-weighting, sensitivity, and six-month calculations were independently recomputed during the 21 August review. The deterministic verifier asserts the principal displayed results. The official-close provenance gap prevents prospective publication, not arithmetic review of this draft.

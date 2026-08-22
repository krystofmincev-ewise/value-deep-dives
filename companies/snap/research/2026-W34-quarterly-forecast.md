---
type: research_memo
company: Snap Inc.
ticker: SNAP
status: draft
as_of: 2026-08-22
source_cutoff_at: 2026-08-22T23:57:00+02:00
scope: coverage-cycle-four-quarter-operating-forecast
tags: [forecast, advertising, direct-revenue, profitability, guidance]
---

# Snap four-quarter operating forecast — 2026-W34

> Draft analyst model, not company guidance, a registered forecast, or personalized investment advice. This is the single canonical operating forecast for coverage cycle `SNAP-2026-W34-01`.

> **Reader key:** Adjusted earnings before interest, taxes, depreciation, and amortization (**adjusted EBITDA**); free cash flow (**FCF**); daily active users (**DAU**); stock-based compensation (**SBC**); and effective cost per thousand advertising impressions (**eCPM**) are written out at their first use. See the [plain-English glossary](../GLOSSARY.md).

## Answer first

| Forecast question | Base answer |
| --- | --- |
| Third quarter of 2026 | **$1.760 billion revenue; $390 million adjusted EBITDA; advertising +12%** |
| Next four quarters | **$7.483 billion revenue; $1.676 billion adjusted EBITDA; $1.10 billion headline FCF** |
| Central advertising assumption | Impressions resume growing while ad price stops falling; Snap does **not** approach Meta-like monetization |
| Most important falsifier | Advertising below 8% while impressions grow by double digits, or a total-revenue beat driven mainly by Other Revenue |

The forecast tells a simple story: **subscriptions and cost cuts buy Snap time, but the valuation only works if the advertising auction stops destroying price as inventory grows.** Q2 offered one encouraging observation, not proof. It lapped a weak comparison and benefited from World Cup demand, so the model preserves a wide downside path.

Read the [quarterly anchor paths](#quarterly-anchor-paths) for the outputs, the [seasonality bridge](#seasonality-and-event-normalization) for the comparison-base audit, the [profit bridge](#why-the-profit-forecast-rises-faster-than-revenue) for cost leverage, and the [evidence checklist](#quarterly-evidence-checklist) for what would change the forecast.

## Forecast rationale

The model gives greatest weight to four observations:

1. Snap's adjusted-profit guidance has beaten the top of its initial range by approximately 15%–35% in each of the last four guided quarters. Revenue guidance was much tighter; the median revenue beat versus the initial midpoint was only approximately 1.3% across the last five guided quarters.
2. Revenue rose 19% year over year in the second quarter of 2026 while the total adjusted cost structure rose only 4%. Adjusted gross margin reached 58%, up seven percentage points.
3. The April restructuring targets more than $500 million of annualized cost reduction, with the cleaner run rate beginning in the third quarter. It is a run-rate statement, not $500 million of immediate FCF.
4. Other Revenue grew 85% in the second quarter and now represents nearly 20% of revenue. Advertising remains the valuation-defining engine, but total company growth no longer has to equal advertising growth.

The model does not assume that Snap's advertisements become as valuable as Meta's. The base advertising case only requires eCPM to stop falling.

## Formulas

```text
Total revenue = advertising revenue + Other Revenue

Year-over-year growth = current-period value / prior-year value - 1

Adjusted EBITDA margin = adjusted EBITDA / total revenue

Advertising revenue growth ≈
    (1 + impression growth) × (1 + eCPM growth) - 1
```

## Starting point

Dollar figures are millions of United States dollars unless stated otherwise.

| Reported quarter | Total revenue | Advertising revenue | Other Revenue | Adjusted EBITDA | FCF | DAU |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Third quarter of 2025 | 1,507 | 1,317 | 190 | 182 | 93 | 477 million |
| Fourth quarter of 2025 | 1,716 | 1,484 | 232 | 358 | 206 | 474 million |
| First quarter of 2026 | 1,529 | 1,244 | 285 | 233 | 286 | 483 million |
| Second quarter of 2026 | 1,599 | 1,283 | 316 | 250 | 121 | 493 million |
| **Trailing twelve months** | **6,351** | **5,328** | **1,023** | **1,023** | **706** | — |

Sources: Snap's [third-quarter 2025 letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440825000063/q32025investorletter.htm), [fourth-quarter 2025 letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000011/snapincq42025investorlet.htm), [first-quarter 2026 letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000024/snapincq12026investorlet.htm), and [second-quarter 2026 prepared remarks](https://s25.q4cdn.com/442043304/files/doc_financials/2026/q2/Q2-2026-Prepared-Remarks.pdf).

## Seasonality and event normalization

Snap's [2025 Form 10-K](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000013/snap-20251231.htm) says advertising demand has historically been strongest in the fourth quarter; engagement can soften during summer and strengthen in December. The forecast therefore does not extrapolate second-quarter revenue sequentially. Its year-over-year growth rates compare like quarters, while its dollar schedule preserves the recurring fourth-quarter peak and first-quarter reversal.

| Sequential transition | Recent reported total revenue | Base total revenue | Recent reported advertising | Base advertising | Interpretation |
| --- | ---: | ---: | ---: | ---: | --- |
| Second quarter to third quarter | +12.0% in 2025 | +10.1% in 2026 | +12.2% in 2025 | +15.0% in 2026 | Total revenue is below the recent comparison; advertising is above it and therefore needs the disclosed segment split to validate the forecast. |
| Third quarter to fourth quarter | +13.4% in 2024; +13.9% in 2025 | +15.9% in 2026 | +12.7% in 2025 | +14.7% in 2026 | Seasonal peak plus continued Other Revenue growth; both forecast steps are modestly above the recent advertising-seasonality prior. |
| Fourth quarter to first quarter | -12.5% in 2025; -10.9% in 2026 | -11.6% in 2027 | -16.2% in 2026 | -16.2% in 2027 | The modeled post-holiday advertising reset matches the latest observed cycle. |
| First quarter to second quarter | -1.3% in 2025; +4.6% in 2026 | +4.3% in 2027 | +3.1% in 2026 | +3.2% in 2027 | The total and advertising paths both preserve the latest spring recovery. |

This is a two-cycle total-revenue and one-complete-cycle advertising reasonableness check, not a statistical seasonal adjustment. Like-quarter growth reduces ordinary recurring seasonality; it does not remove one-off events or changes in product mix.

### Event and comparison-base treatment

| Period | Evidence | Base-case treatment |
| --- | --- | --- |
| Second quarter of 2025 comparison | eCPM fell 10%. Snap also attributed pressure to a temporary Ads Manager change that caused some campaigns to clear at substantially reduced prices, Ramadan timing, and de minimis changes; it did not size the three effects. | Do not invent an add-back or treat Q2 2026's approximately 10% price increase as a clean structural step-up. The two-year price index is roughly `0.90 × 1.10 = 0.99`, which supports retaining wide downside dispersion. |
| Second quarter of 2026 | Snap said World Cup-related advertiser spending contributed to growth. | Retain the reported result; do not invent a company-absent dollar allocation. |
| Third quarter of 2026 | The tournament ran through 19 July, but management said its third-quarter guide reflected expected normalization of World Cup spending and a harder comparison. | Anchor to management's post-event guide and add **no separate World Cup uplift**. Because 19 tournament days fell in Q3, quarter-wide eCPM is not a clean post-event test; August–September, Q4, or Q1 evidence is cleaner. |
| Fourth quarter of 2026 | Normal holiday demand is historically strongest. The United States general election is 3 November 2026. Snap's official political-ad archive shows approximately $27.7 million of 2024 United States / United States dollar spend versus $3.7 million in 2025 and $2.7 million through the 21 August archive cutoff; the archive includes advocacy, so these are not pure election-revenue figures. Thanksgiving falls on 26 November 2026 versus 27 November 2025, creating one additional calendar day before Christmas. | Preserve normal fourth-quarter seasonality; assign **zero explicit election or holiday-calendar uplift** in the base. A 2024-like versus 2025 archive difference would be only about $0.03 per share at the diagnostic multiple, and Snap has not quantified a one-day holiday-timing effect. |
| First quarter of 2027 | Post-holiday advertising normally falls sequentially. The comparison also laps a disclosed $20 million–$25 million Q1 2026 Middle East headwind, while Easter shifts from 5 April 2026 in Q2 to 28 March 2027 in Q1. | Model an 11.6% total-revenue decline from Q4. Treat reported +14% advertising growth as only about 11.7%–12.2% on a prior-year-headwind-normalized basis, before Easter timing. |
| Second quarter of 2027 | The comparison laps the World Cup-aided second quarter of 2026; Easter moves out of Q2 because it occurred in Q1 2027. | Keep the reported denominator. Base advertising growth of 14% is therefore a demanding reported-growth test. Treat Easter as a Q1/Q2 timing reallocation, not four-quarter growth. |

The Q2 2025 comparison factors come from Snap's [investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440825000047/q22025investorletterex99.htm). World Cup timing comes from [FIFA's official schedule](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-world-cup-26-match-schedule-revealed); the election date comes from the [Federal Election Commission](https://www.fec.gov/documents/5910/2026pdates.pdf), and spend history comes from Snap's [Political Ads Library](https://www.snap.com/political-ads). The [United States Code](https://uscode.house.gov/view.xhtml?req=granuleid%3AUSC-prelim-title5-section6103&num=0&edition=prelim) fixes Thanksgiving on the fourth Thursday of November, and the United States Conference of Catholic Bishops' official [2026](https://www.usccb.org/resources/2026cal.pdf) and [2027](https://www.usccb.org/resources/2027cal.pdf) calendars verify the Easter dates. Snap's [prepared remarks](https://s25.q4cdn.com/442043304/files/doc_financials/2026/q2/Q2-2026-Prepared-Remarks.pdf) identify the second-quarter World Cup benefit, the [earnings Q&A](https://s25.q4cdn.com/442043304/files/doc_financials/2026/q2/Q2-2026-Earnings-Call-Q-A-Transcript_Final.pdf) identifies the normalization already inside third-quarter guidance, and the [Q1 2026 investor letter](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000024/snapincq12026investorlet.htm) sizes the Middle East headwind.

The political archive is not a revenue ledger, so subtracting its United States / United States dollar spend from reported revenue is only a diagnostic upper-bound normalization. It shows the election-cycle comparison distortion is small rather than zero:

| Annual growth comparison | Reported | After subtracting the archive-spend proxy from both years | Difference |
| --- | ---: | ---: | ---: |
| 2024 total revenue | 16.4% | 15.9% | -0.5 percentage point |
| 2024 advertising revenue | 11.3% | 10.7% | -0.6 percentage point |
| 2025 total revenue | 10.6% | 11.1% | +0.5 percentage point |
| 2025 advertising revenue | 5.8% | 6.3% | +0.5 percentage point |

The calculation uses reported revenue of $4.606 billion / $5.361 billion / $5.931 billion and advertising revenue of $4.408 billion / $4.904 billion / $5.186 billion in 2023 / 2024 / 2025, then subtracts the archive's $3.19 million / $27.69 million / $3.70 million proxy. Because the archive includes advocacy and may not equal recognized revenue, these adjusted rates are deliberately not used as forecast inputs.

Because Snap did not size the World Cup benefit, the useful exercise is a denominator sensitivity—not a fabricated point estimate:

| Assumed World Cup share of reported Q2 2026 advertising revenue | Implied normalized Q2 2026 advertising revenue | Growth required to reach the $1.463 billion Q2 2027 base |
| ---: | ---: | ---: |
| 0% | $1.283 billion | 14.1% |
| 1% | $1.270 billion | 15.2% |
| 2% | $1.257 billion | 16.4% |
| 3% | $1.244 billion | 17.6% |

The central forecast uses the reported 14.1% comparison. The higher figures only show that, if some second-quarter 2026 demand was temporary, the underlying improvement required in 2027 is larger. A 1% / 2% / 3% World Cup share would reduce a like-for-like 14% Q2 2027 revenue forecast by approximately $15 million / $29 million / $44 million, or roughly $0.02 / $0.03 / $0.05 per share at a 2.2-times diagnostic revenue multiple and 1.92 billion shares. These are sensitivities, not forecast credits or deductions. The quarterly targets stay unchanged; the comparison-base weakness instead preserves downside dispersion in the distribution model.

Q3 needs a separate capitalization check because 19 tournament days fall inside the next-four-quarter valuation period. Management's guidance already reflected expected sequential normalization, but the quarter can still contain event-linked dollars. Holding every other base input fixed:

| Assumed World Cup share of Q3 2026 base advertising | Event-normalized next-four-quarter revenue | Base revenue-multiple value reduction | Base sum-of-the-parts value reduction |
| ---: | ---: | ---: | ---: |
| 0% | $7.483 billion | $0.00 per share | $0.00 per share |
| 1% | $7.468 billion | $0.02 per share | $0.01 per share |
| 2% | $7.454 billion | $0.03 per share | $0.03 per share |
| 3% | $7.439 billion | $0.05 per share | $0.04 per share |

This does not warrant a mechanical deduction: Snap did not size the event, and the distribution already retains a wide lower tail for weak comparisons and event uncertainty. It does define a recalculation trigger. If Snap later discloses that World Cup demand exceeded 3% of Q2 or Q3 advertising revenue, normalize the affected year-one revenue and rerun every valuation method rather than capitalizing it as recurring.

## Why the third-quarter forecast is above formal guidance

Snap guides third-quarter 2026 revenue to $1.70–$1.74 billion and adjusted EBITDA to $300–$350 million. The base case uses **$1.76 billion of revenue and $390 million of adjusted EBITDA**.

That is not a mechanical repetition of the historical beat:

- the revenue forecast is only 1.1% above the high end;
- the adjusted-profit forecast is 11.4% above the high end, less than the recent 15%–35% range;
- the restructuring benefit is already partly reflected in management's guide;
- a result can beat formal guidance and still miss the market's updated expectations.

The [five-quarter guide history and pre-announcement audit](2026-08-21-meta-reddit-relative-valuation.md#appendix-does-snap-habitually-guide-low-and-beat) contains the complete guide-to-actual record. The [cost-efficiency memo](2026-08-21-guidance-cost-efficiency.md) explains the four most recent adjusted-profit beats.

## Quarterly anchor paths

All parenthetical growth rates in the next two tables are **year over year**. Sequential changes are shown separately in the seasonality bridge and the Q3 mix sensitivity. The three paths are unweighted, interpretable operating anchors; the [distribution model](../valuation/2026-W34-valuation.md#distribution-first-valuation) samples continuous driver curves around them.

| Quarter and metric | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| **Third quarter of 2026 advertising** | 1,409 (+7%) | 1,475 (+12%) | 1,528 (+16%) |
| Third quarter Other Revenue | 291 (+53%) | 285 (+50%) | 302 (+59%) |
| **Third quarter total revenue** | **1,700 (+13%)** | **1,760 (+17%)** | **1,830 (+21%)** |
| Third quarter adjusted EBITDA | 310 | 390 | 435 |
| **Fourth quarter of 2026 advertising** | 1,558 (+5%) | 1,692 (+14%) | 1,811 (+22%) |
| Fourth quarter Other Revenue | 290 (+25%) | 348 (+50%) | 394 (+70%) |
| **Fourth quarter total revenue** | **1,848 (+8%)** | **2,040 (+19%)** | **2,205 (+28%)** |
| Fourth quarter adjusted EBITDA | 370 | 530 | 684 |
| **First quarter of 2027 advertising** | 1,269 (+2%) | 1,418 (+14%) | 1,518 (+22%) |
| First quarter Other Revenue | 342 (+20%) | 385 (+35%) | 442 (+55%) |
| **First quarter total revenue** | **1,611 (+5%)** | **1,803 (+18%)** | **1,960 (+28%)** |
| First quarter adjusted EBITDA | 193 | 361 | 490 |
| **Second quarter of 2027 advertising** | 1,309 (+2%) | 1,463 (+14%) | 1,565 (+22%) |
| Second quarter Other Revenue | 363 (+15%) | 417 (+32%) | 490 (+55%) |
| **Second quarter total revenue** | **1,672 (+5%)** | **1,880 (+18%)** | **2,055 (+29%)** |
| Second quarter adjusted EBITDA | 201 | 395 | 534 |

The bear third-quarter Other Revenue assumption is slightly above the base value because the bear is not “every line is lower.” It assumes direct revenue remains strong enough to meet the low end of total guidance while advertising demand disappoints. This makes the scenario economically coherent and prevents Other Revenue from becoming a residual plug.

### Q3 segment-mix sensitivity

The base $285 million Other Revenue forecast is up 50% year over year but down 9.8% sequentially from Q2. Snap has not disclosed subscription seasonality or an identified partnership roll-off that proves that decline. Holding total Q3 revenue at $1.760 billion but keeping Other Revenue flat sequentially changes what a total-revenue result would prove:

| Base item | Published mix | Flat-sequential Other sensitivity |
| --- | ---: | ---: |
| Q3 Other Revenue | $285 million; +50.0% year over year; -9.8% sequential | $316 million; +66.3% year over year; 0% sequential |
| Q3 advertising | $1.475 billion; +12.0% year over year; +15.0% sequential | $1.444 billion; +9.6% year over year; +12.6% sequential |
| Next-four-quarter advertising growth | 13.5% | 12.9% |
| Next-four-quarter Other Revenue growth | 40.3% | 43.3% |
| Next-four-quarter total revenue | $7.483 billion | unchanged |

The sum-of-the-parts effect is only about $0.02 per share because Other Revenue carries a higher multiple. The analytical implication is larger: a Q3 total-revenue beat does not validate 12% advertising growth unless Snap discloses or permits a credible segment split.

## Next-four-quarter totals

Parenthetical growth in this table compares forecast Q3 2026–Q2 2027 with reported Q3 2025–Q2 2026. It is a next-four-quarter-versus-prior-four-quarter comparison, not sequential quarterly growth.

| Third quarter 2026 through second quarter 2027 | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Advertising revenue | 5,545 (+4.1%) | 6,048 (+13.5%) | 6,422 (+20.5%) |
| Other Revenue | 1,286 (+25.7%) | 1,435 (+40.3%) | 1,628 (+59.1%) |
| **Total revenue** | **6,831 (+7.6%)** | **7,483 (+17.8%)** | **8,050 (+26.8%)** |
| Adjusted EBITDA | 1,074 | 1,676 | 2,143 |
| Adjusted EBITDA margin | 15.7% | 22.4% | 26.6% |
| Headline FCF | 650 | 1,100 | 1,500 |
| Headline FCF margin | 9.5% | 14.7% | 18.6% |
| Target-date fully diluted share proxy | 1.98 billion | 1.92 billion | 1.88 billion |

### Regulation is inside these numbers—not a second deduction

The revenue and headline FCF lines already include rounded, scenario-specific allowances for the next 12 months. These are analyst inputs, not predictions of a particular accounting charge.

| Regulatory and legal bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Revenue before incremental regulatory drag | $6.906 billion | $7.528 billion | $8.070 billion |
| Less incremental regulatory revenue drag | ($75 million) | ($45 million) | ($20 million) |
| **Reported revenue forecast above** | **$6.831 billion** | **$7.483 billion** | **$8.050 billion** |
| Headline FCF before incremental legal and compliance cash | $950 million | $1.250 billion | $1.550 billion |
| Less compliance operating expense already inside adjusted operating expense | ($25 million) | ($25 million) | ($15 million) |
| Less settlement, fine, and court-remedy cash below adjusted EBITDA | ($275 million) | ($125 million) | ($35 million) |
| **Total incremental legal and compliance cash effect** | **($300 million)** | **($150 million)** | **($50 million)** |
| **Headline FCF forecast above** | **$650 million** | **$1.100 billion** | **$1.500 billion** |

The valuation's exhaustive legal-state simulation averages approximately $177 million of incremental cash effect and $45 million of incremental revenue drag. Capitalizing the latter at the regulation memo's 1.6-times diagnostic multiple produces an approximately $248 million combined check, inside the specialist memo's $180 million–$260 million central range. The much larger injunction or settlement tail sits in the severe and extreme legal states, not in another cash subtraction.

## What each advertising case requires

The [advertising-price and recommendation-system revalidation](2026-08-21-ads-pricing-recommenders-revalidation.md) finds that the technical stack is credible and second-quarter price repair is reported, but persistence and simultaneous volume growth remain unproven.

| Advertising case | Approximate impression growth | Implied eCPM change | Required story |
| --- | ---: | ---: | --- |
| Bear | 12%–13% | approximately -8% | Inventory continues to grow faster than advertiser demand. |
| Base | approximately 13.5% | approximately flat | Better measurement and lower-funnel products stop price dilution. |
| Bull | approximately 14% | approximately +6% | Advertisers deepen budgets and Snap grows both supply and price. |

The base does **not** require Meta-like pricing. It requires the repeated high-single- to low-double-digit eCPM declines to stop. The bull requires clear price repair. Sustained advertising growth of 30% would require a much larger change in price and is not modeled.

### Recommendation-engine contribution already embedded

The [technical follow-up](2026-08-21-open-source-recommender-gap.md#8-how-much-recommendation-upside-remains) now makes the implicit model contribution explicit. Against approximately $5.328 billion of trailing advertising revenue, the existing bear/base/bull forecasts embed approximately **$31 million / $240 million / $428 million** from continued recommendation, measurement, creative-understanding, and lower-funnel improvement. That is an estimated **0.6% / 4.1% / 7.1%** lift over scenario paths that assume 3.5% / 9.0% / 12.5% underlying growth without further model progress.

This is an analyst decomposition, not company-reported attribution. It does not add revenue to the forecasts above. The base therefore already assumes meaningful improvement; treating new recommendation research as separate upside would double-count it. The transparent arithmetic is checked by [`verify-2026-08-21-recommender-upside.mjs`](../valuation/verify-2026-08-21-recommender-upside.mjs).

## Why the profit forecast rises faster than revenue

The base case adds approximately $1.13 billion of revenue to the trailing starting point and approximately $653 million of adjusted EBITDA. The approximately 58% incremental conversion is plausible because:

- adjusted gross margin is already 58%;
- personnel savings become more fully visible from the third quarter;
- revenue per full-time employee improved sharply after the restructuring;
- infrastructure cost per daily user has stayed around the low-to-mid $0.80s per quarter;
- management is holding planned Specs spending inside the current operating outlook.

It is not guaranteed because infrastructure investment, legal and safety expense, launch support, and customer acquisition can rebuild costs.

### Annual cost bridge

The following bridge makes the operating-cost assumptions visible. It is an analyst scenario, not company guidance. Dollar amounts are billions.

| Next-four-quarter adjusted cost bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Revenue | 6.831 | 7.483 | 8.050 |
| Adjusted gross margin | 57.0% | 60.0% | 62.5% |
| Adjusted cost of revenue | (2.937) | (2.993) | (3.019) |
| of which: infrastructure | (1.750) | (1.800) | (1.900) |
| of which: other adjusted cost of revenue | (1.187) | (1.193) | (1.119) |
| **Adjusted gross profit** | **3.894** | **4.490** | **5.031** |
| Adjusted operating expense | (2.820) | (2.814) | (2.888) |
| of which: incremental compliance operating expense | (0.025) | (0.025) | (0.015) |
| **Adjusted EBITDA** | **1.074** | **1.676** | **2.143** |

The base assumes that infrastructure rises despite lower personnel expense because Snap continues funding recommendation models and artificial-intelligence workloads. The bull spends more absolute dollars on infrastructure and operating expense than the base but earns better gross and incremental margins. The bear holds operating expense near the current annual guide while weaker revenue prevents leverage.

Management's cost guide does not make a 60% full-year gross margin automatic. At $6.8 billion of 2026 revenue, $1.675 billion of infrastructure cost, and other cost of revenue equal to 16.5% of revenue, implied gross margin is approximately 58.9%. Holding those cost inputs fixed, revenue would need to reach approximately $7.13 billion for 60%. The model's $6.928 billion 2026 base therefore implies roughly 59% for the full year; 60% is a quarterly or 2027 objective unless cost performance beats the midpoint.

## Why headline FCF is lower than adjusted EBITDA

The model does not apply a fixed conversion percentage. Headline FCF remains sensitive to:

- cash interest on the 6.875% senior notes;
- working-capital timing;
- the small remaining restructuring payments, with most restructuring cash already paid by 30 June 2026;
- capital expenditure;
- legal settlements and compliance costs, including the explicit scenario allowances above;
- cash taxes as profitability improves.

SBC is added back in operating cash flow. Therefore even $1.10 billion of base-case headline FCF is not automatically $1.10 billion available to a long-term owner. The target share count separately captures expected net dilution after awards and repurchases.

### Annual cash-flow bridge

This bridge is rounded and scenario-based. It makes the modeled legal cash explicit, but it does not pretend that working-capital timing can be forecast precisely one year ahead. Dollar amounts are billions.

| Adjusted EBITDA to headline FCF | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Adjusted EBITDA | 1.074 | 1.676 | 2.143 |
| Cash interest | (0.150) | (0.150) | (0.150) |
| Cash taxes | (0.010) | (0.040) | (0.080) |
| Capital expenditure | (0.200) | (0.220) | (0.250) |
| Net working capital and other operating cash items | 0.211 | (0.041) | (0.128) |
| Incremental settlement, fine, and court-remedy cash allowance | (0.275) | (0.125) | (0.035) |
| **Headline FCF** | **0.650** | **1.100** | **1.500** |

Capital expenditure is kept near Snap's recent approximately $195 million–$219 million annual range rather than assuming a post-restructuring collapse. The working-capital-and-other line is the least certain input. It includes timing and the remaining cash conversion between adjusted profit and FCF; it should not be mistaken for a reported company line item. The cash allowance here excludes compliance operating expense already inside adjusted operating expense and adjusted EBITDA. Together, the two rows equal the total legal and compliance cash effect in the regulatory bridge, and neither is deducted again in target net debt.

## Capital and share bridge

| United States dollars in billions except shares | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Opening net debt, excluding operating leases | 0.875 | 0.875 | 0.875 |
| Next-four-quarter headline FCF | 0.650 | 1.100 | 1.500 |
| Net-debt reduction | (0.025) | (0.425) | (0.875) |
| **Explicit cash-use residual assumption: repurchases / financing / financial assets / other uses** | **0.625** | **0.675** | **0.625** |
| **Ending net debt, excluding operating leases** | **0.850** | **0.450** | **0.000** |
| Opening fully diluted share proxy | 1.881 billion | 1.881 billion | 1.881 billion |
| Net new dilution after awards and repurchases | 0.099 billion | 0.039 billion | approximately zero |
| **Ending fully diluted share proxy** | **1.980 billion** | **1.920 billion** | **1.880 billion** |

The residual is an explicit scenario assumption, not a reported line or a forecast produced by an award-by-award treasury schedule. Snap used more cash for first-half repurchases than it generated in first-half FCF, and awards still increased. The row can include repurchases, financing effects, movements in financial assets, and cash that is otherwise not retained. It **excludes** the incremental legal and compliance cash allowances because headline FCF already includes them. The model does not credit every dollar of FCF as balance-sheet improvement and then separately credit buybacks.

The bear deliberately assumes that almost all FCF is consumed while the share count still rises: repurchases fail to offset awards, and cash leaves the simplified net-debt perimeter through other uses. That is conservative and uncertain, not a claim about one identified use. If any scenario retains $250 million more or less cash than shown, its revenue-multiple value changes by approximately $0.13 per share at 1.92 billion shares; the [valuation sensitivity](../valuation/2026-W34-valuation.md#sensitivities) keeps this residual visible rather than hiding it inside the multiple.

The target share counts are net scenario outcomes rather than a mechanical award-by-award schedule. Snap does not disclose future grant volume, vesting, forfeitures, repurchase price, or repurchase dollars. The bear assumes continuing net dilution, the base assumes repurchases offset most awards, and the bull assumes awards and repurchases approximately balance. Share-count sensitivity is therefore as important as the cash bridge.

## Quarterly evidence checklist

| Reporting point | Base forecast | Evidence that raises the next forecast | Evidence that lowers it |
| --- | --- | --- | --- |
| Third quarter of 2026 | $1.76 billion revenue; $390 million adjusted EBITDA | Advertising-led revenue above $1.76 billion, adjusted EBITDA above $400 million, eCPM near flat or positive | Revenue only meets the low end, adjusted EBITDA below $350 million, or another infrastructure-guide increase |
| Fourth quarter of 2026 | $2.04 billion revenue; $530 million adjusted EBITDA | Advertising growth above 15%, exact paid-user progress, high-value users stabilize | Advertising remains single digit, direct revenue decelerates without explanation, or savings are reinvested without return |
| First quarter of 2027 | $1.80 billion revenue; $361 million adjusted EBITDA | North American DAU stabilizes and FCF per diluted share rises | North American DAU below 90 million, gross margin below 55%, or dilution accelerates |
| Second quarter of 2027 | $1.88 billion revenue; $395 million adjusted EBITDA | Two quarters of positive eCPM and contained share count | More impressions still coincide with falling price, or legal/product remedies impair acquisition |

### Normalization falsifiers

- Treat Q4 2026 or Q1 2027—not Q2 plus quarter-wide Q3—as the clean price-and-volume durability test unless Snap discloses August–September detail.
- Recompute Year-one revenue and valuation if disclosed World Cup-related demand exceeds 3% of Q2 or Q3 advertising revenue.
- Reject the election-immateriality assumption if political and advocacy spending exceeds 1% of quarterly advertising revenue.
- Lower the quarterly revenue path or multiple if sequential advertising materially misses the recent approximately +12% Q2-to-Q3 / +13% Q3-to-Q4 pattern, or if the Q1 post-holiday reset is materially worse than approximately -16% without an explained mix change.
- Interpret Q1 2027 advertising growth below approximately 12% as weaker than the headline suggests because it laps the geopolitical headwind and gains Easter timing; interpret Q2 2027 only after considering the World Cup-aided and Easter-shifted comparison.

## What the model does not know

- Snap does not disclose subscription churn, subscriber geography, plan mix, or a clean subscription gross margin.
- Snap does not disclose how much Other Revenue comes from its artificial-intelligence platform partnership.
- Snap disclosed that second-quarter 2026 average advertising price per impression rose approximately 10%. Combined with 9.3% advertising-revenue growth, this implies roughly flat to slightly negative impressions after allowing for rounding; the exact impression change and regional split were not disclosed.
- Snap does not publish advertising revenue or contribution profit by region or product surface.
- The model has no separate Specs profit-and-loss statement.
- Legal outcomes have discontinuous tails that cannot be represented by a smooth revenue curve.
- Formal guidance is not the same as point-in-time market consensus. A guide beat can still disappoint investors.

## Conclusion

The revised forecast's highest-confidence change is **better near-term adjusted profit**. Its most important positive revenue assumption is merely that advertising price dilution stops. The model becomes wrong if eCPM keeps falling materially, high-value users continue shrinking without faster monetization, direct revenue rolls over, or savings are recycled into dilution, litigation, or unbounded hardware spending.

Return to the [canonical investment report](../thesis/2026-W34-final-report.md), continue to the [valuation](../valuation/2026-W34-valuation.md), or review the [portfolio action](../decisions/2026-W34-decision.md#portfolio-action).

---
type: forecast_methodology
company: Wix.com Ltd.
ticker: WIX
coverage_cycle_id: WIX-2026-W35-01
status: draft
as_of: 2026-08-31
source_cutoff_at: 2026-08-31T23:59:59+02:00
scope: forecast-base-rates-calibration-and-scoreability
---

# Wix forecast base rates and calibration

## Answer first

The forecast can be made more useful now, but it cannot honestly be called fully calibrated. Four changes improve it:

1. Replace one bundled AI regime with four causal questions: core Wix health, Base44 adoption, Base44 economics and outside-agent attachment.
2. Publish near-term operating estimates that can be resolved and scored, rather than waiting to learn only from a target-date valuation.
3. Anchor the most observable inputs to Wix's own guidance history, current consensus, public-software valuation buckets and a market cost of capital.
4. Publish numerical-stability, sensitivity and assumption-ambiguity diagnostics, while keeping target-date fair value separate from market-price convergence.

Only Wix's consolidated-revenue forecast-error history provides even a small empirical calibration sample. The other additions are external anchors, accounting constraints or structured judgment. That distinction is a feature: it makes clear which apparent precision has earned evidence and which still represents an analyst's view.

## 1. Wix's own forecast record

The cleanest available reference class is the difference between Wix's initial annual revenue guidance and the reported result.

| Forecast year | Initial revenue midpoint | Actual revenue | Actual versus midpoint |
| --- | ---: | ---: | ---: |
| 2023 | $1.5225bn | $1.5617bn | +2.58% |
| 2024 | $1.7450bn | $1.7607bn | +0.90% |
| 2025 | $1.9850bn | $1.9930bn | +0.40% |

The mean error is +1.29%, the sample standard deviation is 1.14% and the root-mean-square error is 1.59%. Three years are not enough to identify a reliable distribution shape or tail probabilities. All three outcomes were also beats, while the 2026 outlook has already been reduced after a restructuring. The model therefore uses the historical dispersion as one input to interval width without mechanically adding the historical +1.29% mean beat.

Bookings offer two further, less mature observations: 2024 actual bookings beat the initial midpoint by 1.96%, and 2025 beat by 1.34%. Adjusted free cash flow is not a clean calibration set. Its initial-guidance errors fell from +56.8% in 2023 to +26.9% in 2024 and +0.9% in 2025 while Wix's margin structure and adjustment perimeter changed materially.

Sources: [2022 results and initial 2023 outlook](https://www.sec.gov/Archives/edgar/data/1576789/000157678923000007/fourthquarterandfy2022resu.htm), [2023 results and initial 2024 outlook](https://www.sec.gov/Archives/edgar/data/1576789/000157678924000007/fourthquarterandfullyear20.htm), [2024 results and initial 2025 outlook](https://www.sec.gov/Archives/edgar/data/1576789/000162828025006216/fourthquarterandfullyear20.htm), and [2025 results](https://www.sec.gov/Archives/edgar/data/1576789/000162828026014406/fourthquarterandfullyear20.htm).

## 2. Current-year reconciliation

Wix reported $1.104 billion of first-half 2026 revenue. Second-quarter revenue was $563.1 million, bookings were $569.1 million and total annual recurring revenue was $1.963 billion. Management's revised full-year language calls for low-to-mid-teens revenue growth, low-teens bookings growth and a high-teens adjusted free-cash-flow margin. The June restructuring reduced the expected 2026 revenue and bookings by about $25 million and $50 million respectively, while management expects about $70 million of 2026 savings and $150 million annualized.

Applying 11%, 13% and 15% growth to 2025 revenue gives $2.212 billion, $2.252 billion and $2.292 billion. Public consensus is close to the midpoint at approximately $2.26 billion for 2026 and $2.51 billion for 2027. A deliberately wider $2.20 billion / $2.26 billion / $2.32 billion 10th-percentile, median and 90th-percentile interval allows for both the small historical guidance-error sample and the unusual restructuring year.

The annual forecast also reconciles to the quarters. Management's low-double-digit third-quarter indication implies approximately $556–566 million. At the full-year midpoint, fourth-quarter revenue would then need to be roughly $582–592 million, or around 11–13% year over year. This is a deterministic consistency check, not another independent signal.

Sources: [Q1 2026 results](https://www.sec.gov/Archives/edgar/data/1576789/000162828026034370/firstquarter2026results.htm), [June restructuring update](https://www.sec.gov/Archives/edgar/data/1576789/000162828026041382/wix-6xkxjunereorganization.htm), [Q2 2026 results](https://www.sec.gov/Archives/edgar/data/1576789/000162828026052108/secondquarter2026results.htm), and [StockAnalysis consensus derived from S&P Global Market Intelligence](https://stockanalysis.com/stocks/wix/forecast/).

## 3. Outside anchors

SEG's 2026 public-cloud sample contains 108 companies. It reports median trailing revenue growth of about 12%, median gross margin of 73.5%, median earnings-before-interest-tax-depreciation-and-amortization margin of 9.1%, median cash-flow-from-operations margin of 22.7% and a median enterprise-value-to-revenue multiple of 5.3 times. More useful than the overall multiple is the growth-bucket comparison:

| Trailing revenue growth | Median enterprise value / revenue |
| --- | ---: |
| 10% or less | 2.4x |
| 10–20% | 5.8x |
| 20–30% | 12.7x |
| Above 30% | 8.5x |

The non-monotonic top bucket and the gap between public revenue and this model's annual recurring revenue are warnings against copying these numbers into Wix. They nevertheless show that the core multiple range is conservative for a durable low-growth software asset, while the much higher Base44 range requires sustained growth. SEG recasts history when constituents change, so this is a present cross-sectional anchor rather than a point-in-time backtest.

Damodaran's January 2026 tables report a 10.66% weighted average cost of capital for Internet software and 9.34% for system/application software. Wix's 11% central rate is therefore an externally anchored judgment after allowing for Israel, execution and AI-competition risk; it is not a security-specific observed rate.

Sources: [SEG 2026 Annual SaaS Report](https://sandhill.com/wp-content/uploads/2026/03/SEG-Research-2026-Annual-SaaS-Report.pdf), [Damodaran industry cost of capital](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/wacc.html), [industry historical growth](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histgr.html), and [industry price-to-sales and enterprise-value-to-sales data](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/psdata.htm).

## 4. The causal forecast tree

The model's old erosion/defense/platform regime combined too many beliefs. It made downside frequency depend heavily on one label and obscured why the business reached a value. The replacement asks four questions separately.

| Causal node | Adverse / weak | Central | Upside | Evidence quality |
| --- | ---: | ---: | ---: | --- |
| Core Wix health | 26% | 52% | 22% | Medium |
| Base44 retained-production adoption | 29% | 51% | 20% | Low to medium |
| Base44 fully loaded economics | 35% | 49% | 16% | Low |
| Outside-agent attachment or disintermediation | 32% | 51% | 17% | Low |

The probabilities aggregate same-evidence structured judgments. They are not independent observations or historical frequencies. Dependencies are explicit rather than accidental: agent attachment influences Base44 distribution and the core acquisition funnel; retained adoption influences unit economics; and core Wix supplies Base44 with capital, brand and distribution. Each node owns one causal question, with linked effects on the relevant operating driver and valuation multiple rather than one master label selecting the whole company outcome.

Plainly stated: the model can now produce a weak core with a useful Base44, a strong core with poor Base44 economics, or an outside-agent platform success without pretending that every other input is automatically bullish. Those mixed states are the main benefit of the redesign.

## 5. What is calibrated and what is not

| Layer | Status | What that means |
| --- | --- | --- |
| Consolidated 2026 revenue interval | Partially empirically informed | Wix has three comparable initial-guidance errors; too few for robust tails |
| Current revenue, bookings and cash-flow center | Anchored | Filings, management guidance, quarterly reconciliation and consensus constrain the center |
| Core/Base44 multiples and discount rate | Cross-sectionally anchored | Public-software growth buckets and market cost of capital bound judgment; they do not predict Wix's eventual multiple |
| Capital bridge | Accounting-constrained | Shares, debt, cash and contingent claims obey one sources-and-uses identity |
| AI, Base44 and agent probabilities | Structured judgment | No historical population answers the 2026–27 strategic question |
| Target-date market convergence | Sensitivity only | Fair value and the price investors will assign on a particular date are different variables |

The correct description is therefore:

> The forecast uses empirically informed revenue-error dispersion, current management and consensus anchors, public-software valuation base rates and accounting consistency constraints. Structural AI probabilities and market-convergence assumptions remain judgmental and are disclosed separately.

This is better than an unanchored shadow forecast because it creates more resolvable forecasts, tighter accounting discipline and clearer sensitivity ownership. It is not a claim that 100,000 simulations turn four uncertain strategic judgments into observed frequencies.

## 6. Robustness results

The rebuilt distribution has a twelve-month $67.74 / $127.74 / $195.10 P10/median/P90 range and a $129.99 mean. Fair value is below the $87.62 reference in 20.0% of draws. The model generates all 81 combinations of the four three-state nodes rather than forcing them into one bundled narrative.

Three alternative same-evidence probability sets produce $126.89–$128.40 twelve-month medians and 19.9–20.2% below-reference frequencies. This is sensitivity evidence, not independent or empirical validation. Deliberately skeptical and favorable weights widen the median to $109.66–$146.12 and the below-reference frequency to 32.4–11.8%.

Common-random-number one-at-a-time stresses show where the valuation is most exposed:

| Input change | Adverse median | Base median | Favorable median |
| --- | ---: | ---: | ---: |
| Core ARR multiple ±0.5x | $107.25 | $127.74 | $148.39 |
| Base44 ARR multiple ±2x | $117.62 | $127.74 | $138.33 |
| Diluted shares ±2m | $122.51 | $127.74 | $133.44 |
| Base44 post-GP owner-cost load ±10 points | $124.33 | $127.74 | $131.43 |
| Base44 growth ±20 points | $122.63 | $127.74 | $133.12 |
| Net claims ±$100m | $125.60 | $127.74 | $129.87 |
| Core growth ±2 points | $125.52 | $127.74 | $130.04 |

Holding marginal probabilities fixed, independent nodes produce a $73.75 P10 and 5.4% frequency of fair value at least 30% below reference, while stronger plausible dependence produces $61.89 and 9.8%; the base construction is $67.74 and 7.5%. Ten 50,000-draw seeds produce medians of $127.49–$128.33 and below-reference frequencies of 19.5–20.2%. Numerical sampling noise is therefore much smaller than probability, dependence and multiple uncertainty. The joint four-node state explains 81.4% of modeled value variance and within-state factors 18.6%; individual-node shares are not additive because the nodes are dependent.

## 7. Prospective scoring

The [operating-forecast contract](../valuation/2026-W35-operating-forecast-contract.json) freezes eight estimates before the relevant results: FY2026 revenue, bookings, raw free cash flow, total annual recurring revenue, Base44 annual recurring revenue and fourth-quarter Base44 gross margin, plus Q2 2027 total and Base44 annual recurring revenue. Each estimate has an official-source resolution rule, an unresolvable rule and a numerical baseline with provenance. The scalar baselines are scored as degenerate intervals—equivalent to absolute error—so the comparison uses the same weighted-interval-score framework as the distributions.

All resolvable intervals use the same 80% interval weighted interval score. The score rewards a narrow interval when the outcome lands inside it and penalizes misses beyond the 10th or 90th percentile more heavily. It does not let an undisclosed Base44 metric become an after-the-fact success or failure: the contract marks it unresolvable under the frozen rule.

This prospective record can later answer three questions the present dossier cannot: whether the intervals cover at the promised rate, whether estimates are systematically high or low, and whether the causal model beats simple guidance, consensus or prior-period baselines.

---
type: valuation
company: Wix.com Ltd.
ticker: WIX
coverage_cycle_id: WIX-2026-W35-01
coverage_cycle_path: ../coverage-cycles/2026-W35-01-initial/README.md
valuation_contract_path: 2026-W35-valuation-contract.json
valuation_quantity: fair_value_per_share
valuation_display_semantics: distribution_percentiles
identity_path: companies/wix/identity.md
identity_hash: sha256:ad9bea438347400bb39ed0a0e83976dff09cf42bb864bcd4c3803ad053440e65
security_id: wix-ordinary-shares
listing_id: nasdaq-wix
status: draft
as_of: 2026-08-31
published_at: null
source_cutoff_at: 2026-08-31T23:59:59+02:00
currency: USD
reference_price: 87.62
reference_price_at: 2026-08-29T00:15:00Z
reference_price_source: StockAnalysis_historical_data_S&P_Global_Market_Intelligence
target_bear: null
target_base: null
target_bull: null
primary_distribution_p10: 67.74
primary_distribution_p50: 127.74
primary_distribution_p90: 195.10
primary_distribution_mean: 129.99
target_horizon: 2027-08-30
target_status: active
review_by: 2026-11-15
supersedes: null
distribution_method: wix_causal_sotp_capital_path_v5
distribution_calibration_status: structured_elicitation_shadow_cross_sectionally_anchored
distribution_seed: 20260830
distribution_sample_count: 100000
method_reviewed_at: 2026-08-31
research_status: draft
---

# Wix valuation at $87.62

## Answer first

Wix is roughly fairly valued on a conservative owner-cash DCF, but cheap if Base44 has meaningful standalone value. The revised six-month SOTP distribution has a $116.60 median and $117.36 mean; twelve months has a $127.74 median and $129.99 mean. Method disagreement is the central fact: SOTP is the formal quantity because it explicitly separates Base44, while the owner-cash DCF and multiple are non-voting cross-checks.

The 27-item video evidence set—nine Wix, six Base44, six Lovable and six Replit—strengthens the mechanism for a managed-backend/platform option, but still supplies no auditable Base44 D90/D180 retention or production-use cohort. The Q2 2026 filing does supply a useful economic anchor: Base44 expects roughly 60% non-GAAP gross margin in the second half, up from near zero. Management also says it will reinvest the savings into marketing. Version 5 models Base44 gross margin, its full post-gross-profit owner-cost load and future-award economics separately, then allows core health, adoption, economics and outside-agent attachment to vary independently but dependently.

| Fair-value horizon | P10 | P50 / median | P90 | Mean | Probability below $87.62 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 28 Feb 2027 | $64.02 | $116.60 | $170.93 | $117.36 | 24.3% |
| 30 Aug 2027 | $67.74 | $127.74 | $195.10 | $129.99 | 20.0% |

This is an externally anchored structured-elicitation target-date fair-value distribution, not a forecast that the share price converges by either date. Wix's three-year revenue-guidance errors inform one separate near-term operating interval; reported scale/capitalization, public-software base rates and sector cost of capital constrain fair-value inputs. The four strategic probabilities are still judgments rather than historically estimated frequencies. The twelve-month mean is 48.4% above the reference price and the median 45.8% above it, but the model also assigns a 7.5% frequency of fair value at least 30% below the reference and a 2.6% frequency of fair value at least 50% below it. Those are fair-value frequencies, not realized-return probabilities. The figures place $87.62 in a **starter-buy valuation zone** for a diversified investor whose risk limits can absorb the modeled downside. That is an absolute-value interpretation, not a formal benchmark-relative action or a full-position recommendation.

## Capitalization at the reference price

| Denominator | Shares m | Equity value | Face net debt | Enterprise value |
| --- | ---: | ---: | ---: | ---: |
| Latest explicit basic count, 11 May | 41.850 | $3.67bn | $0.689bn | $4.36bn |
| Q2 non-GAAP diluted | 49.271 | $4.32bn | $0.689bn | $5.01bn |
| Normalized pre-contingent model denominator | 45.989 | $4.03bn | $0.689bn plus contingent claim | about $4.81bn |

The widely displayed $4.88 billion market capitalization embeds a stale approximately 55.6 million share count. It should not be used with post-tender per-share values.

## Three methods

### 1. Sum of the parts

The SOTP separates core recurring ARR, transaction revenue and Base44. It subtracts face net debt and the last-audited Base44 contingent consideration through a combined claims bridge. It does not apply a SaaS multiple to transaction revenue.

| Narrative scenario | Core ex-Base44 recurring ARR | Core multiple | Transaction revenue / multiple | Base44 ARR / multiple | Net claims | Diluted shares | Value/share |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Bear | $1.75bn | 1.5x | $0.30bn / 0.75x | $0.16bn / 3x | $0.80bn | 46.5m | **$54** |
| Base | $1.92bn | 2.4x | $0.34bn / 1.0x | $0.24bn / 7x | $0.78bn | 46.0m | **$127** |
| Bull | $2.05bn | 3.5x | $0.38bn / 1.4x | $0.35bn / 13x | $0.70bn | 46.0m before convertible/warrant dilution | **$245** |

The base SOTP assigns Base44 $1.68 billion—well below Lovable's $13.3 billion and below a direct 26.6x application to Base44. At 10x/20x/26.6x a $150 million Base44 ARR reference would be worth $1.5/$3.0/$4.0 billion. None is used as audited fact: $150 million is public interview framing, Base44's reporting boundary is not clean and private marks embed different rights and growth expectations.

### 2. Owner-FCFF multiple

Management's $420 million adjusted 2026 FCF guide is not owner cash. Raw FCF is after cash interest but before debt principal flows, so treating it as complete FCFE would silently assume perpetual refinancing of the September 2030 convertible. The model instead adds normalized after-tax interest to form owner **free cash flow to the firm (FCFF)**, values enterprise cash flow and applies one net-debt/contingent-claim bridge in every method.

| Narrative scenario | Normalized owner FCFF | EV/owner FCFF | Net claims | Shares before convertible/warrant dilution | Value/share |
| --- | ---: | ---: | ---: | ---: | ---: |
| Bear | $210m | 14x | $0.80bn | 46.5m | **$46** |
| Base | $315m | 20x | $0.78bn | 46.0m | **$120** |
| Bull | $405m | 25x | $0.70bn | 46.0m | **$205** |

The base owner-cash bridge is explicit rather than treating $285 million as a plug:

| Base 2027 owner-FCFE bridge | USD m |
| --- | ---: |
| 2026 raw-FCF placeholder midpoint | 350 |
| Incremental 2027 savings retained after reinvestment | +40 |
| Revenue/mix and operating leverage | +35 |
| Higher normalized cash tax, retention payments and working-capital reserve | (30) |
| 2027 raw FCFE before dilution economics | **395** |
| Cash-equivalent cost to neutralize recurring post-horizon SBC dilution | (110) |
| **Normalized owner FCFE** | **285** |
| Add normalized after-tax interest | +30 |
| **Normalized owner FCFF** | **315** |

The bear/bull FCFE bridges are $300m less $120m = $180m and $500m less $125m = $375m; adding $30m normalized after-tax interest gives $210m/$405m FCFF. These are judgments, not reported guidance. The explicit horizon denominator starts with 41.850m basic shares and adds all 3.339m unvested RSU/PSUs plus a 0.8m option/ESPP buffer. It is then held flat: the executable model separately draws a roughly $90–130m future-award economic charge around $110m, so issuing those same future vintages into the denominator would count them twice.

### 3. Owner-cash DCF

The five-year DCF is intentionally strict. It begins from owner FCFF after dilution economics and normalized interest, discounts at WACC and subtracts net debt/contingent claims once. It does not add a separate Base44 terminal option.

| Narrative scenario | Starting owner FCFF | Five-year growth/margin path | WACC | Terminal growth | Value/share |
| --- | ---: | --- | ---: | ---: | ---: |
| Bear | $210m | about 3% | 12.5% | 1.8% | **$28** |
| Base | $315m | high single digits, fading | 11.0% | 2.7% | **$92** |
| Bull | $405m | low-to-mid teens, fading | 9.8% | 3.4% | **$215** |

The 11.0% base WACC is now cross-checked directly to [Damodaran's January 2026 sector dataset](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/wacc.html): U.S. Software (Internet) was 10.66% and Software (System & Application) 9.34%. His [country-risk table](https://pages.stern.nyu.edu/adamodar/New_Home_Page/datafile/ctryprem.html) assigned Israel a 1.36% default spread and 2.07% country-risk premium. Wix receives an AI/execution/country overlay versus scaled application software, while its large liquid portfolio and 0% convertible lower near-term financing cost. Bear/bull WACC remains 12.5%/9.8%. This is cross-sectionally anchored judgment, not a security-specific observed rate.

The direct floating-rate sensitivity is smaller than the valuation sensitivity. A 100-basis-point SOFR move changes annual pre-tax interest on the $500m facility by $5m, or roughly $0.09 per normalized share after a 15% tax assumption. Rates and Israeli-shekel strength matter more through multiples, refinancing flexibility and the local expense base. The $1.15bn 0% convertible matures in September 2030, so leverage is a capital-allocation constraint rather than a twelve-month liquidity cliff.

The base DCF is close to market. That is why the recommendation cannot rest on “8–10x free cash flow.” For Wix to be materially undervalued, the owner-cash base must improve, Base44 must deserve separate value, or both.

## Distribution construction

The old model placed every simulation into one bundled erosion, defense or platform-win regime. Those buckets barely overlapped, so much of the reported downside probability simply repeated the chosen erosion weight. Version 5 instead asks four separate causal questions in each of 100,000 draws:

| Causal question | Adverse / weak | Central | Upside | Conditional twelve-month medians | Share of variance explained alone |
| --- | ---: | ---: | ---: | --- | ---: |
| Core Wix health | 26% | 52% | 22% | $79.96 / $129.01 / $173.55 | 44.3% |
| Base44 retained-production adoption | 29% | 51% | 20% | $94.89 / $129.69 / $182.26 | 38.5% |
| Base44 fully loaded economics | 35% | 49% | 16% | $115.99 / $130.57 / $147.49 | 4.8% |
| Outside-agent attachment/disintermediation | 32% | 51% | 17% | $98.07 / $133.33 / $172.82 | 26.0% |

The nodes are dependent: outside-agent success helps Base44 distribution and the core funnel, while better retained adoption modestly improves economics. “Core health” means execution resilience before the incremental outside-agent funnel effect; correlation represents common platform readiness, while the agent node supplies the separate direct effect. They remain separable enough to generate all 81 combinations. A strong core can coexist with weak Base44 economics; Base44 can break out while the core weakens. The joint node state explains 81.4% of twelve-month value variance in this construction and draw-level execution/market noise explains 18.6%. The individual variance shares above are not additive because the nodes are correlated.

The formal method is SOTP because Base44 is a separately modeled, high-growth option whose present owner-cash contribution is intentionally small. Owner-FCFF DCF and the cash multiple are non-voting cross-checks. A single starting capital state is carried through both horizons: target claims equal starting claims less the portion of cumulative levered owner FCFE retained as cash or debt paydown plus an earnout remeasurement tied to the same simulated Base44 ARR path. Capital not retained is excluded from target-date company value and assumed paid out or deployed at fair value through distributions, repurchases or M&A, with no incremental value credited. The 45.989m starting denominator already includes current unvested awards; future award vintages are charged in owner FCFF, so they are not also issued in the horizon share count.

Warrants use the treasury-stock method above $104.73. The base warrant count is approximately 0.817m; the contract reserves as many as 1.083m shares for adjustment/make-whole provisions, which the model does not separately issue. The formal right tail uses a conservative if-converted convention above the $210.49 note strike and omits capped-call benefit through $267.89. About 1.1% of six-month and 5.8% of twelve-month formal draws exceed the strike; 0.2% of twelve-month draws exceed the cap. This is a disclosed simplification, not a prediction of holder conversion before 2030.

## Prospective operating scorecard

The model now freezes operating estimates that can be checked before the fair-value horizon. The three consolidated FY2026 estimates use filings, guidance, quarterly reconciliation and—for revenue—the small 2023–2025 guidance-error sample. The remaining intervals come from the causal simulation.

| Period / metric | P10 | Median | P90 | Evidence status |
| --- | ---: | ---: | ---: | --- |
| FY2026 revenue | $2.20bn | $2.26bn | $2.32bn | partially informed by three Wix guidance errors; anchored to revised guidance and consensus |
| FY2026 bookings | $2.25bn | $2.33bn | $2.40bn | guidance and quarter-reconciliation anchor |
| FY2026 raw FCF | $315m | $350m | $385m | cash-flow bridge; no stable historical error distribution |
| FY2026 total ARR | $1.972bn | $2.051bn | $2.110bn | period-end checkpoint; core/Base44 compound from their June/May measurement dates |
| FY2026 Base44 ARR | $155m | $191m | $224m | period-end checkpoint; unresolvable if Wix does not disclose a dated figure |
| Q4 2026 Base44 non-GAAP gross margin | 48.1% | 58.3% | 69.0% | causal-model checkpoint; management's 60% H2 target is only a proxy baseline |
| Q2 2027 total ARR | $1.983bn | $2.145bn | $2.274bn | period-end checkpoint; core/Base44 compound from their June/May measurement dates |
| Q2 2027 Base44 ARR | $159m | $235m | $314m | period-end checkpoint; unresolvable if undisclosed |

Each resolvable estimate will receive an 80% interval weighted interval score and will be compared with frozen naïve, guidance or consensus baselines. This cannot retroactively calibrate today's strategic probabilities. It creates the evidence needed to measure sharpness, bias and coverage in later cycles. Exact resolution and unresolvable rules are in the [operating-forecast contract](2026-W35-operating-forecast-contract.json).

The same causal states and capital path drive both fair-value horizons, producing 0.971 cross-horizon correlation. Mean net claims fall from about $762m at six months to $739m at twelve; they rise in 11.2% of paths when the ARR-linked earnout remeasurement exceeds retained levered owner cash. The share denominator remains flat by construction under the non-double-counting treatment above.

## Robustness and assumption risk

Three alternative probability sets based on the same evidence produce twelve-month medians of **$126.89–$128.40**, with 19.9–20.2% frequencies below $87.62. Their agreement is sensitivity evidence, not independent or empirical validation. Deliberately skeptical and favorable weights widen the median to **$109.66–$146.12** and the below-reference frequency to **32.4–11.8%**.

Common-random-number stresses isolate one input at a time:

| Input stress | Adverse median | Base median | Favorable median |
| --- | ---: | ---: | ---: |
| Core ARR multiple ±0.5x | $107.25 | $127.74 | $148.39 |
| Base44 ARR multiple ±2x | $117.62 | $127.74 | $138.33 |
| Diluted shares ±2m | $122.51 | $127.74 | $133.44 |
| Base44 post-GP owner-cost load ±10 points | $124.33 | $127.74 | $131.43 |
| Base44 growth ±20 points | $122.63 | $127.74 | $133.12 |
| Net claims ±$100m | $125.60 | $127.74 | $129.87 |
| Core growth ±2 points | $125.52 | $127.74 | $130.04 |

Dependency strength changes the tails more than the median. With the same marginal probabilities, independent nodes produce a **$73.75 P10** and 5.4% frequency of fair value at least 30% below reference; stronger plausible dependence produces **$61.89** and 9.8%, versus $67.74 and 7.5% in the base construction. Ten separate 50,000-draw runs produce medians of $127.49–$128.33 and below-reference frequencies of 19.5–20.2%. Sampling noise is therefore small relative to model-form and probability uncertainty. The diagnostic is reproducible in [the forecast-diagnostics script](diagnose-2026-W35-forecast.mjs).

## Deterministic reconciliation

At twelve months, the method medians are approximately $77.53 for DCF, $105.78 for the diagnostic owner-FCFF multiple and $127.74 for the formal SOTP. The $50.21 gap between DCF and SOTP is not averaged away. It is the investment question: SOTP recognizes separable Base44/platform value; DCF demands that more of that option already appear in normalized owner cash. The $129.99 formal mean slightly exceeds the median because favorable Base44 and outside-agent combinations create a right tail.

| Twelve-month method distribution | P10 | Median | P90 | Fair value below $87.62 |
| --- | ---: | ---: | ---: | ---: |
| Formal SOTP | $67.74 | $127.74 | $195.10 | 20.0% |
| Owner-FCFF multiple | $65.24 | $105.78 | $144.33 | 28.4% |
| Owner-FCFF DCF | $43.27 | $77.53 | $114.57 | 64.1% |

These are three views of the same simulated operating paths, not independent forecasts and not candidates for arbitrary averaging. The DCF distribution's 64.1% frequency below reference quantifies how much the attractive formal result relies on separable Base44/platform value rather than owner cash already visible within twelve months.

The bear tail is not “Wix goes to zero.” It assumes the core installed base decays slowly but new cohorts weaken, Base44 multiple/growth compress and owner FCFF falls toward the low-$200 millions. Values below the $67.74 twelve-month P10 are possible if cash flow and competitive position fail together; the bottom-decile conditional mean is $51.16.

## Market-convergence sensitivity

Fair value and the price investors assign on 30 August 2027 are different quantities. Rather than silently treating them as equal, the following bridge asks what happens if the market closes only part of the gap between $87.62 and the $127.74 median fair value:

| Share of fair-value gap closed | Illustrative target-date price | Absolute return from $87.62 |
| ---: | ---: | ---: |
| 25% | $97.65 | 11.4% |
| 50% | $107.68 | 22.9% |
| 75% | $117.71 | 34.3% |
| 100% | $127.74 | 45.8% |

No probability is assigned to those rows, and no QQQ return is forecast. The table is a decision sensitivity, not a new expected-return model.

## Sensitivities that matter most

1. **Owner FCFF.** Every $50 million of durable owner FCFF is worth about $22 per share at 20x and 46 million shares.
2. **Base44.** Every 5x turn on $200 million ARR is roughly $21 per share.
3. **Core recurring multiple.** Every 0.5x on roughly $1.9 billion ARR is about $21 per share.
4. **Dilution.** Moving from 41.85 million basic to 49.27 million diluted cuts a fixed equity value by 15%.
5. **Net debt/claims.** Every $100 million changes every enterprise-value method by about $2.17 per normalized diluted share.
6. **Structural probabilities.** The skeptical/favorable probability boundaries move the twelve-month median to $109.66/$146.12; the elicited causal weights remain the model's largest non-audited judgment after valuation multiples.

## Market comparison: do not mix units

At the corrected basic enterprise value, Wix trades near 1.9x the $2.25 billion base 2026 revenue estimate. On Q2 diluted equity value it trades around 10.3x management's adjusted FCF guide, but materially more than 10.3x owner FCF.

Lovable's 26.6x reported June run-rate and Replit's earlier 20x run-rate mark show how much private markets pay for growth. They do not prove Wix should trade at those levels. Applying Lovable's multiple to all Wix revenue would ignore maturity, mix and margins; applying it to Base44 is a bull sensitivity only.

Senvest's public investor letter provides a useful outside cross-check: it assigns roughly $1.65–1.95 billion to Base44 and describes the implied core as approximately 6x consensus 2026 P/FCF. The Base44 value is close to this model's $1.68 billion base SOTP component, but the core multiple is optically cheaper than our framework because consensus/adjusted FCF does not fully charge recurring dilution, restructuring/acquisition cash, net debt and contingent claims. The agreement on Base44 option value should not be mistaken for agreement on owner earnings.

Senvest's Q2 report subsequently raised its opinion of Base44 to approximately $2.5bn and remained bullish after the Partner/profitability reset. Its 13F position nevertheless fell from 3.755m shares at 31 March to 2.919m at 30 June, a 22.3% reduction. A 13F cannot distinguish tender participation, open-market sales or motive, and its scope differs from Senvest's 13G. The combination is useful precisely because it prevents a simplistic “the smart holder knows” inference.

Public analyst targets after Q2 span roughly $45–$135, with recent examples including JPMorgan at $62, Citi at $72, Wedbush at $80, Benchmark at $110 and B. Riley at $135. Morningstar's public Q2 summary called the shares fairly valued after the relief rally. These are not comparable valuation contracts and the underlying reports are generally unavailable here; their dispersion is an expectations check, not an input. The model's strict DCF near $92 is closer to the cautious outside camp, while its SOTP/right tail is more bullish than most published targets.

## Reverse DCF: what $87.62 already assumes

Using 45.989m normalized pre-contingent shares and the $780m central claims bridge produces about $4.03bn of equity value and $4.81bn of enterprise value. At an 11.0% WACC, 2.7% terminal growth and the base high-single-digit fade, the price implies approximately **$302m of starting owner FCFF**. The base estimate is $315m.

| Starting owner FCFF | Value/share under the base DCF path |
| ---: | ---: |
| $250m | $69.52 |
| $275m | $78.17 |
| $300m | $86.82 |
| $315m | $92.01 |
| $350m | $104.11 |
| $400m | $121.41 |

With only a flat-ish 3% growth path, the same price requires roughly $382m. At 12.5% WACC it requires about $359m; at 9.8%, about $257m. The market therefore is not pricing Wix's disappearance. It is pricing something close to $300m of owner cash plus durable improvement, while giving limited credit to a private-market-style Base44 outcome.

The 50% rally also contains a market-flow component outside this fair-value model. Reported short interest fell from 9.232 million shares at 30 June to 5.777 million at 14 August. That is consistent with covering amplifying the recovery, though it cannot identify causation or the share of the move. Because this contract models fair value rather than a target-date trading price, no short-flow variable was inserted into the distribution.

## Valuation/action bands

| Price | Prospective interpretation from current evidence |
| ---: | --- |
| Below $65 | Strong prospective buy/add zone if no structural falsifier has fired; near the stressed/downside neighborhood |
| $65–$95 | Starter-buy valuation zone; existing holders should test concentration before adding. $87.62 lies here |
| $95–$130 | Hold; new capital increasingly requires Base44 and owner-cash execution |
| $130–$170 | Trim unless owner FCF, Base44 ARR/margin and core cohorts have upgraded |
| Above $170 | Reduce materially absent a new evidence cycle supporting strong platform economics |

These are valuation bands, not personalized position-size instructions. Portfolio concentration, taxes, correlations and loss limits can change the appropriate action, but they do not change Wix's fair value.

## Verification

Exact fair-value outputs are frozen in [the valuation contract](2026-W35-valuation-contract.json); scoreable operating estimates are frozen in [the operating-forecast contract](2026-W35-operating-forecast-contract.json). The fair-value and recurring-revenue intervals are reproduced by [the model](model-2026-W35-distribution.mjs); the filing-, guidance- and accounting-anchored revenue, bookings and cash-flow intervals are frozen and checked directly by [the verifier](verify-2026-W35-distribution.mjs). Run it from the repository root.

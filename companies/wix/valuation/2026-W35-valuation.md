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
as_of: 2026-08-30
published_at: null
source_cutoff_at: 2026-08-30T17:31:30+02:00
currency: USD
reference_price: 87.62
reference_price_at: 2026-08-29T00:15:00Z
reference_price_source: StockAnalysis_historical_data_S&P_Global_Market_Intelligence
target_bear: null
target_base: null
target_bull: null
primary_distribution_p10: 62.68
primary_distribution_p50: 130.27
primary_distribution_p90: 205.57
primary_distribution_mean: 132.52
target_horizon: 2027-08-30
target_status: active
review_by: 2026-11-15
supersedes: null
distribution_method: wix_joint_sotp_capital_path_v4
distribution_calibration_status: uncalibrated_shadow
distribution_seed: 20260830
distribution_sample_count: 100000
method_reviewed_at: 2026-08-30
research_status: draft
---

# Wix valuation at $87.62

## Answer first

Wix is roughly fairly valued on a conservative owner-cash DCF, but cheap if Base44 has meaningful standalone value. The revised six-month SOTP distribution has a $119.16 median and $119.81 mean; twelve months has a $130.27 median and $132.52 mean. Method disagreement is the central fact: SOTP is the formal quantity because it explicitly separates Base44, while the owner-cash DCF and multiple are non-voting cross-checks.

The 27-item video evidence set—nine Wix, six Base44, six Lovable and six Replit—strengthens the mechanism for a managed-backend/platform option, but still supplies no auditable Base44 D90/D180 retention or production-use cohort. The Q2 2026 filing does supply a useful economic anchor: Base44 expects roughly 60% non-GAAP gross margin in the second half, up from near zero. Management also says it will reinvest the savings into marketing. Version 4 therefore models Base44 gross margin, its full post-gross-profit owner-cost load and future-award economics separately instead of embedding them in one owner-cash plug.

| Fair-value horizon | P10 | P50 / median | P90 | Mean | Probability below $87.62 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 28 Feb 2027 | $61.12 | $119.16 | $178.23 | $119.81 | 21.2% |
| 30 Aug 2027 | $62.68 | $130.27 | $205.57 | $132.52 | 19.5% |

This is an uncalibrated target-date fair-value distribution, not a forecast that the share price converges by either date. Reported scale/capitalization and sector cost of capital are anchored; the structural weights are not historically estimable. The twelve-month mean is 51.2% above the reference price and the median 48.7% above it, but the model also assigns a 9.4% frequency of fair value at least 30% below the reference and a 2.7% frequency of at least 50% impairment under the elicited weights. Those are fair-value frequencies, not realized-return probabilities. As an illustrative valuation translation for an investor with no WIX exposure, that supports a **starter-buy zone**, not a formal benchmark-relative action or a full position. For the user-reported existing roughly 4% holding—alongside a separately reported roughly 8% SNAP holding—the formal action is **hold / no routine add** because action depends on concentration as well as fair value.

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

Each of 100,000 deterministic draws selects one shared structural regime—AI erosion (20%), defense (58%) or platform win (22%)—and then draws **separate** AI-capability, core-execution, Base44-product-market-fit, unit-economics and market-risk factors. Factor-specific checkpoint shocks are correlated across six and twelve months. The regime deliberately bundles structural adoption, growth and valuation-multiple centroids; it does not choose Base44 unit economics, WACC or every draw-level shock. WACC is centered independently near 11%; idiosyncratic AI/execution risk principally enters growth, owner cash and SOTP multiples.

The formal method is SOTP because Base44 is a separately modeled, high-growth option whose present owner-cash contribution is intentionally small. Owner-FCFF DCF and the cash multiple are non-voting cross-checks. A single starting capital state is carried through both horizons: target claims equal starting claims less the portion of cumulative levered owner FCFE retained as cash or debt paydown plus an earnout remeasurement tied to the same simulated Base44 ARR path. Capital not retained is excluded from target-date company value and assumed paid out or deployed at fair value through distributions, repurchases or M&A, with no incremental value credited. The 45.989m starting denominator already includes current unvested awards; future award vintages are charged in owner FCFF, so they are not also issued in the horizon share count.

Warrants use the treasury-stock method above $104.73. The base warrant count is approximately 0.817m; the contract reserves as many as 1.083m shares for adjustment/make-whole provisions, which the model does not separately issue. The formal right tail uses a conservative if-converted convention above the $210.49 note strike and omits capped-call benefit through $267.89. Only 0.7% of six-month and 8.2% of twelve-month formal draws exceed the strike; 0.04% of twelve-month draws exceed the cap. This is a disclosed simplification, not a prediction of holder conversion before 2030.

| Twelve-month conditional regime | Weight | Median value | Core ARR | Base44 ARR | Base44 GM | All post-GP owner-cost load | Core owner FCFF | Base44 owner contribution | Total owner FCFF |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI erosion | 20% | $62.78 | $1.795bn | $172m | 60% | 78% | $213m | $23m | $237m |
| Defense | 58% | $129.29 | $1.931bn | $232m | 60% | 78% | $279m | $31m | $310m |
| Platform win | 22% | $202.48 | $1.985bn | $293m | 60% | 78% | $306m | $39m | $345m |

Those are conditional model means for the business drivers and conditional medians for value, not deterministic scenario columns. “All post-GP owner-cost load” includes sales and marketing, product/R&D, security/support, G&A, tax, capex/capitalized software, retention and future-award economics—not only acquisition marketing. This fixes the false implication that every unspent gross-profit dollar reaches owners. The public data still cannot identify that load, so 78% is a transparent analyst estimate, not audited unit economics.

The regime weights are explicit judgments, not observed base rates. The high 0.979 cross-horizon correlation results because the same structural regime, independent shared factors and starting capital state drive both horizons. It is not a confidence score. Mean net claims fall from about $754m at six months to $730m at twelve; they rise in 5.7% of paths when the ARR-linked earnout remeasurement exceeds retained levered owner cash. The share denominator remains flat by construction under the non-double-counting treatment above.

A reproducible weight stress moves ten probability points from platform win to erosion, leaving defense unchanged (30% / 58% / 12% versus 20% / 58% / 22%). With the same seed and 100,000 draws, the twelve-month median falls from **$130.27 to $121.27**, the mean from **$132.52 to $118.62**, and frequency below $87.62 rises from **19.5% to 28.7%**. The six-month median falls from $119.16 to $111.35 and its below-reference frequency rises from 21.2% to 30.7%. A separate 25% erosion / 65% defense / 10% platform case produces a $123.39 median and $120.44 mean. Moving the Base44 post-gross-profit owner-cost load 15 percentage points lower or higher moves the formal twelve-month median to $136.53 or $124.36, respectively; the option value therefore responds to unit economics rather than merely changing a non-voting cash cross-check. This is why position size depends on retention and owner-cash proof rather than the headline expected value.

## Deterministic reconciliation

At twelve months, the method medians are approximately $80.51 for DCF, $109.25 for the diagnostic owner-FCFF multiple and $130.27 for the formal SOTP. The $49.76 gap between DCF and SOTP is not averaged away. It is the investment question: SOTP recognizes separable Base44/platform value; DCF demands that more of that option already appear in normalized owner cash. The $132.52 formal mean slightly exceeds the median because a platform-win state gives Base44 and core MCP distribution right-tail value.

The bear tail is not “Wix goes to zero.” It assumes the core installed base decays slowly but new cohorts weaken, Base44 multiple/growth compress and owner FCFF falls toward the low-$200 millions. Values below the $62.68 twelve-month P10 are possible if cash flow and competitive position fail together; the bottom-decile conditional mean is $49.40.

## Sensitivities that matter most

1. **Owner FCFF.** Every $50 million of durable owner FCFF is worth about $22 per share at 20x and 46 million shares.
2. **Base44.** Every 5x turn on $200 million ARR is roughly $21 per share.
3. **Core recurring multiple.** Every 0.5x on roughly $1.9 billion ARR is about $21 per share.
4. **Dilution.** Moving from 41.85 million basic to 49.27 million diluted cuts a fixed equity value by 15%.
5. **Net debt/claims.** Every $100 million changes every enterprise-value method by about $2.17 per normalized diluted share.
6. **Regime weights.** Moving ten probability points from platform win to erosion lowers the twelve-month mean by $13.90 and median by $9.00; these elicited weights remain the model's largest non-audited judgment.

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

The 50% rally also contains a market-flow component outside this fair-value model. Reported short interest fell from 9.232 million shares at 30 June to 5.777 million at 14 August. That is consistent with covering amplifying the recovery, though it cannot identify causation or the share of the move. Because this contract models fair value rather than a target-date trading price, no short-flow variable was inserted into the distribution. Practically, it means less unspent squeeze asymmetry and a higher burden on Q3 operating proof for the next leg.

## Valuation/action bands

| Price | Prospective interpretation from current evidence |
| ---: | --- |
| Below $65 | Strong prospective buy/add zone if no structural falsifier has fired; near the stressed/downside neighborhood |
| $65–$95 | Starter-buy zone for zero exposure; hold/no routine add for the user-reported existing ~4% WIX position. $87.62 lies here |
| $95–$130 | Hold; new capital increasingly requires Base44 and owner-cash execution |
| $130–$170 | Trim unless owner FCF, Base44 ARR/margin and core cohorts have upgraded |
| Above $170 | Reduce materially absent a new evidence cycle supporting platform-win economics |

These are valuation bands, not personalized position-size instructions. The user reported roughly 4% WIX and 8% SNAP, but the complete portfolio, taxes, correlations and loss budget are outside the record. Those disclosed weights change the action translation, not Wix's fair value.

## Verification

Exact outputs are frozen in [the valuation contract](2026-W35-valuation-contract.json) and reproduced by [the model](model-2026-W35-distribution.mjs). Run [the verifier](verify-2026-W35-distribution.mjs) from the repository root.

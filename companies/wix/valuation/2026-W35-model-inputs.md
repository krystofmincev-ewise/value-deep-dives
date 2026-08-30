---
type: valuation_model_inputs
company: Wix.com Ltd.
ticker: WIX
coverage_cycle_id: WIX-2026-W35-01
as_of: 2026-08-30
reference_price: 87.62
model_path: model-2026-W35-distribution.mjs
calibration_status: uncalibrated_shadow
---

# Wix model-input ledger

## Purpose

This ledger distinguishes what Wix reported, what can be anchored to an outside cross-section, what is derived mechanically and what remains analyst judgment. A 100,000-draw Monte Carlo run does not make those judgmental inputs empirically calibrated. It only propagates them consistently.

## Evidence classes

| Input | Model use | Central value / range | Evidence class | Why it is or is not calibrated |
| --- | --- | --- | --- | --- |
| Reference price | comparison only | $87.62 | reported market observation | StockAnalysis historical close, credited to S&P Global Market Intelligence and cross-checked separately |
| Core recurring ARR before Base44 | SOTP starting scale | $1.813bn | derived from reported data | $1.963bn total ARR less the public $150m Base44 run-rate framing; the reporting boundary is imperfect |
| Base44 ARR | SOTP starting scale | $0.150bn | management/interview framing | Not audited, not a clean recurring-revenue disclosure and therefore given a wide growth/multiple range |
| Transaction revenue | SOTP starting scale | $0.300bn | derived run-rate anchor | Approximately Q2 transaction revenue annualized; modeled separately to avoid applying a SaaS multiple |
| Total liquid investments | debt bridge | $960.8m | reported | Cash, deposits and marketable securities at 30 June 2026 |
| Face debt | debt bridge | $1.650bn | reported | $1.15bn 0% convertible due September 2030 plus approximately $500m floating bank facility |
| Base44 contingent claim | claims bridge | about $90m | last audited / Level 3 | $89.5m at December 2025; revenue-linked and therefore uncertain |
| Net claims | all enterprise-to-equity bridges | $0.78bn starting central; $0.68–0.88bn starting draw | reported plus uncertainty | Roughly $689m face net debt plus about $90m contingent consideration; ending claims use an explicit sources-and-uses identity: starting claims less retained owner cash/debt paydown plus ARR-linked earnout remeasurement |
| Pre-contingent diluted shares | per-share bridge | 45.989m central | derived from reported securities | 41.850m explicit basic plus 3.339m unvested RSU/PSUs and a 0.8m option/ESPP buffer; held flat because future award vintages are charged in owner FCFF rather than also issued in the denominator. The capitalization function separately applies treasury-stock dilution to 0.817m initial warrants above $104.73; the legal reserve can reach 1.083m after adjustment/make-whole capacity |
| Current normalized owner FCFF | DCF/multiple interpolation anchor | $270m | structured analyst estimate | $350m 2026 raw-FCF placeholder less $110m economic charge for future award vintages plus $30m normalized after-tax interest; consolidated/H2-dependent and not a reported metric |
| Target core raw FCFE before future awards | owner-cash bridge | approximately $359m defense centroid; $250–460m bounds | structured analyst estimate | Operating growth/unit economics drive levered cash before future award economics; not reported guidance |
| Future-award economic charge | owner-cash bridge and denominator convention | $110m center; $90–130m | structured analyst estimate | Charged explicitly in owner cash because the horizon denominator already includes current unvested awards; avoids counting future vintages as both cash-free and newly issued shares |
| Twelve-month core owner FCFF | cash cross-check | about $213m / $279m / $306m conditional means | structured analyst estimate | Determined from core growth and an independent unit-economics factor; explicitly excludes the separately modeled Base44 contribution |
| Base44 post-GP owner-cost load | cash cross-check and voting Base44 SOTP multiple | 78% central, 55–96% bounds | structured analyst estimate | Includes S&M, product/R&D, security/support, G&A, tax, capex/capitalized software, retention and future-award economics; no audited Base44 cost stack exists. A ±15-point shift moves the formal twelve-month median to $136.53/$124.36 |
| Balance-sheet retention of cumulative FCFE | ending claims bridge | 32% center; 12–55% bounds | structured analyst estimate | Retained levered owner cash reduces claims; residual capital is excluded from target-date company value and assumed paid out or deployed at fair value, with no incremental value credited |
| Earnout participation in incremental Base44 ARR | ending claims bridge | 38% center; 18–58% bounds | structured analyst estimate | Approximates revenue-linked claim remeasurement from the same Base44 path; the detailed contract and maximum payout are not public, so this is a bounded sensitivity rather than a replication of legal terms |
| Formal valuation method | distribution output | SOTP | analytical specification | Separates core, Base44 and transaction economics; Base44 unit economics affect its voting multiple; owner-FCFF DCF and cash multiple are non-voting cross-checks rather than extra votes on the same cash anchor |
| WACC | DCF cross-check | 11.0% center; 9.5–12.5% draw | cross-sectionally anchored judgment | Damodaran January 2026 WACC is 10.66% for U.S. Software (Internet) and 9.34% for Software (System & Application); market/country risk is drawn independently rather than chosen by the AI regime |
| Terminal growth | DCF | 1.8% / 2.7% / 3.4% | judgment | Bounded below nominal long-run growth in the bear and below WACC in every draw |
| AI structural regimes | SOTP adoption/growth/multiple paths | 20% erosion / 58% defense / 22% platform win | structured elicitation | No historical population estimates the joint effect of 2026–27 coding agents, Base44 integration and Wix installed-base defense; the regime deliberately bundles structural adoption, growth and multiple centroids but does not choose WACC or Base44 cost load |
| Independent business factors | growth, unit economics and multiples | AI capability, core execution, Base44 PMF, unit economics, market risk | structured elicitation | Prevents the regime from mechanically choosing unit economics, WACC and every draw-level shock; it does not make the regime fully orthogonal to growth/multiples, and correlations remain analyst judgments |
| Six-/twelve-month linkage | joint paths | shared regime/factors; factor-specific 0.62 shock correlation; one capital state | structured elicitation | Preserves state continuity but is not estimated from a historical Wix/AI sample |

## Cost-of-capital cross-check

Damodaran's January 2026 U.S. sector table reports a 10.66% WACC for Internet software and 9.34% for System & Application software. His January 2026 country-risk table reports a 1.36% Israel default spread and 2.07% country risk premium. These figures make an 11.0% Wix base WACC defensible without claiming that every component can be observed precisely. The executable cross-check draws 9.5–12.5% from a separate market/country factor; AI execution is already reflected in cash flows and SOTP paths rather than being charged again through a regime-selected discount rate.

The bank facility is floating-rate. A 100-basis-point SOFR move changes annual pre-tax interest on $500m by only $5m, or roughly $0.09 per normalized share after a 15% tax assumption. Rates matter much more through valuation multiples and refinancing flexibility than through the next twelve months of direct interest expense. The $1.15bn convertible has a 0% coupon and does not mature until September 2030, so the twelve-month case is a leverage/capital-allocation risk, not an immediate solvency case.

## Reverse DCF at $87.62

Using 45.989m shares and the $780m central claims bridge produces approximately $4.030bn of equity value and $4.810bn of enterprise value. Holding the model's five-year base growth/margin fade, 11.0% WACC and 2.7% terminal growth constant, the current price implies approximately **$302m of starting owner FCFF**.

| Starting owner FCFF | Implied value/share under the base DCF path |
| ---: | ---: |
| $250m | $69.52 |
| $275m | $78.17 |
| $300m | $86.82 |
| $315m | $92.01 |
| $350m | $104.11 |
| $400m | $121.41 |

The same market enterprise value requires about $359m of starting owner FCFF at a 12.5% WACC, or $257m at 9.8%. With only a flat-ish 3% growth path and 11% WACC it requires about $382m. Therefore the market is not assuming Wix disappears; it is assuming either owner cash around $300m plus durable high-single-digit improvement, or materially higher cash generation with weak growth. Base44's option value is not required to justify the current price, but it is required for much of the upside beyond the strict $92 base DCF.

## What public AI benchmarks can and cannot change

Artificial Analysis's August 2026 Coding Agent Index v1.4 uses 326 tasks across DeepSWE, Terminal-Bench 2.1 and SWE-Atlas-QnA, with three attempts per task and task-normalized pass@1. This is relevant evidence that agent capability and cost can be measured on coding trajectories. It is not a direct Wix churn coefficient: the benchmark does not measure domain migration, SEO continuity, payments, business records, regulatory configuration, support exceptions or whether a nontechnical owner maintains the resulting business for a year.

Open-weight progress from DeepSeek, Kimi, Qwen and Nemotron reduces Wix's long-run model-supplier dependency and makes an agent-agnostic MCP/headless layer more credible. The same progress also reduces the cost of entrants reproducing the creation interface. The model therefore maps capability evidence into the three structural regimes and their drivers, not into an invented one-for-one revenue elasticity.

The dedicated [AI capability and cost-curve memo](../research/2026-08-30-ai-capability-cost-curve.md) adds four quantitative priors. They discipline the regime narratives but do not estimate the mixture weights:

| Quantity | Current anchor | Six-month analyst prior | Twelve-month analyst prior | Model implication |
| --- | --- | --- | --- | --- |
| Strict verified success in interactive code-producing sessions | 29–34% in Anthropic's study | 35–45% | 40–55% | creation pressure rises; verified production still trails partial progress |
| Unassisted low-complexity SMB operational change | no representative public base rate | 10–25% | 15–35% | supports a material erosion tail, not a mass-migration base case |
| Fixed-capability API step cost | current market | down 20–40% | down 35–65% | Base44 and competitors both gain; model supply is not the moat |
| Base44 inference COGS per comparable completed feature | undisclosed | down 20–45% | down 35–65% | supports 60% gross margin if retries/credits do not absorb the gain |

Artificial Analysis's like-for-like leaders score 63–68 overall but only 37–55% on repository Q&A. Anthropic's roughly 400,000-session study finds 29–34% strict verified success and 88–89% at least partial success. METR's high-messiness time horizon remains much shorter than its clean-task result. Those gaps justify retaining all three structural regimes rather than extrapolating a launch benchmark into deterministic Wix churn.

The revised cash engine explicitly models Base44 gross margin separately from **all** post-gross-profit owner costs. Across regimes, mean gross margin is near the reported 60% H2 target, while about 78% of gross profit is consumed by S&M, product/R&D, security/support, G&A, tax, capex/capitalized software, retention and future-award economics. Twelve-month mean Base44 owner contribution is therefore only about $23m in erosion, $31m in defense and $39m in platform win; corresponding total owner FCFF is about $237m/$310m/$345m. The SOTP right tail comes from separable platform value, not from pretending the option is already distributable cash.

## Calibration limits and prospective learning

The formal distribution remains `uncalibrated_shadow`. It is cross-sectionally anchored for WACC, capitalization and reported operating scale, but its regime frequencies are an elicitation. It can be updated prospectively against observable releases; empirical calibration is unavailable until enough dated forecasts have been scored:

1. Creative ARR excluding Base44 and paid-subscription cohort retention.
2. Partner bookings after the reorganization.
3. Base44 D30/D90/D180 paid retention, production deployment persistence and contribution margin after inference/runtime/credits.
4. Raw owner cash, normalized cash tax and net share issuance.
5. MCP/headless creation, management actions, conversion and attach through third-party agents.

Until those observations exist, narrower probability bands would create false precision rather than information advantage.

### Customer reviews and agentic-readiness update

The 30 August live review audit does not change the numerical priors. Wix's thousands of G2/Capterra reviews validate managed-bundle value and recurring price/support/customization problems, while Lovable's stronger AI-native sentiment validates creation-layer pressure. Base44 and Replit reviews replicate context-loss, credit-burning retry and support failure modes. None supplies a defined paid-user sampling frame, revenue weighting, retention denominator, refund rate or support-cost linkage. Review evidence is therefore capped at narrative/watchlist use and cannot become a churn or margin coefficient.

First-party documentation also shows that Wix, Webflow, Base44, Lovable, Replit and WordPress now expose external MCP surfaces, while GoDaddy and Squarespace expose agent-usable APIs to different degrees. This strengthens both sides of the existing regime design: third-party agents can commoditize creation, and structured platforms can remain the operating substrate. Because connector availability is now competitive parity rather than a Wix-exclusive advantage, it does not increase the platform-win weight without adoption and cohort economics.

Prospective parameter gates:

1. Change Base44's 60% gross-margin anchor only after two comparable reported quarters differ by at least five percentage points.
2. Change the 78% post-gross-profit owner-cost center only after support, refunds, customer success, S&M, product/R&D and related costs can be reconstructed and differ by at least 10% of gross profit for two quarters. Do not count inference retries in both gross margin and post-gross-profit costs.
3. Change Base44 growth/regime weights when defined D180 paid or production-active retention differs by at least ten points across two cohorts with a meaningful disclosed denominator.
4. Move probability materially toward platform win only after at least 10,000 agent-originated paid sites/apps disclose D180 retention and business-solution attachment within five points of native Wix cohorts without more than 10% higher support cost.

The dedicated [customer-review and agentic-platform audit](../research/2026-08-30-customer-reviews-agentic-friendliness.md) contains the source-by-source record and selection limits.

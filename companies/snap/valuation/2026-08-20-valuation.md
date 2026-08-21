---
type: valuation
company: Snap Inc.
ticker: SNAP
identity_path: companies/snap/identity.md
identity_hash: sha256:d09ac6123bc50705e9193b94196e0d56445228609ac1309221ed92a940447157
security_id: snap-class-a-common
listing_id: nyse-snap
status: draft
as_of: 2026-08-20
published_at: null
source_cutoff_at: 2026-08-20T23:30:00+02:00
currency: USD
reference_price: 5.21
reference_price_at: 2026-08-20T20:59:05Z
reference_price_source: integrated_public_market_data_feed
target_bear: 2.29
target_base: 5.96
target_bull: 9.85
target_horizon: 2027-08-20
target_status: superseded
review_by: 2026-11-15
supersedes: null
---

# Snap valuation — 20 August 2026

> **Superseded draft:** read the [21 August re-underwritten valuation](2026-08-21-reunderwritten-valuation.md). This file remains as an audit trail of the earlier assumptions.

> Draft valuation. It is not yet a published or registered forecast record.

> **Reader key:** Finance and valuation shorthand is expanded at first substantive use. The full [glossary and formula guide](../GLOSSARY.md) provides definitions and derivations.

> **Core formulas**
> `Net debt = debt - cash - marketable securities`
> `Enterprise value (EV) = fully diluted equity value + net debt`
> `Target value/share = (target revenue × EV/revenue multiple - net debt) / diluted shares`
> `Probability-weighted value = Σ(scenario probability × scenario value)`

## Summary

| Scenario | 12-month value/share | Return from $5.21 | Probability | Key operating case | Primary method |
| --- | ---: | ---: | ---: | --- | --- |
| Bear | **$2.29** | -56% | 30% | Total revenue +5%; ads +4%; cost and high-value-user pressure; multiple stays distressed | 0.80x target-date last-twelve-month (LTM) EV/revenue |
| Base | **$5.96** | +14% | 55% | Total revenue +15%; ads +12%; direct revenue +32%; visible cost leverage, continued dilution | 1.65x target-date LTM EV/revenue |
| Bull | **$9.85** | +89% | 15% | Ads +19% with yield repair; direct revenue +53%; high-value users stabilize; risk premium falls | 2.40x target-date LTM EV/revenue |
| **Probability-weighted** | **$5.44** | **+4%** | 100% | — | Scenario expected value |

The valuation conclusion is less bullish than the base case. A reasonable operating outcome supports about $6, but the left tail and low joint probability of all bull-case improvements reduce the probability-weighted 12-month value to **$5.44**. This is close to the market and below a normal equity hurdle. The result supports a `neutral` research stance at $5.21, not a large-margin-of-safety claim.

For the shorter horizon requested, the corresponding illustrative **six-month values are $2.62 / $5.53 / $8.38**, with a probability-weighted value of **$5.08**. The [checkpoint bridge](../research/2026-08-20-quarterly-forecast.md#six-month-checkpoint-bridge) uses the latest likely reported LTM revenue, explicit multiples, net debt, and shares. Six months is enough to observe Q3 and probably Q4 execution, but not enough to prove subscription retention, durable ad-auction repair, or consumer Specs economics.

Reference price: **$5.21** at 20:59:05 UTC on 20 August 2026 from the integrated public market-data feed; [Google Finance](https://www.google.com/finance/quote/SNAP:NYSE) is the public corroboration page. The provider's displayed market cap uses a basic-share convention; the analysis uses Snap's own fully diluted proxy.

## Capitalization and enterprise-value bridge

| Item | Value | As of / source |
| --- | ---: | --- |
| Basic common shares outstanding | 1.682bn | Q2 2026 [Form 10-Q](https://www.sec.gov/Archives/edgar/data/1564408/000156440826000052/snap-20260630.htm) |
| Shares underlying awards | 0.199bn | Q2 2026 issuer supplemental disclosure |
| **Fully diluted proxy** | **1.881bn** | Basic plus underlying awards; not the loss-period Generally Accepted Accounting Principles (GAAP) earnings-per-share (EPS) denominator |
| Cash and marketable securities | $2.660bn | Q2 2026 Form 10-Q |
| Debt | $3.535bn | Net carrying value, Q2 2026 Form 10-Q |
| Net debt, excluding leases | $0.875bn | Calculation |
| Lease liabilities | $0.691bn | Q2 2026 Form 10-Q |
| Fully diluted equity value | $9.800bn | $5.21 × 1.8809bn |
| **Enterprise value, excluding leases** | **$10.675bn** | Equity value plus net debt |
| EV / trailing-twelve-month (TTM) revenue | 1.68x | $10.675bn / $6.351bn |
| Fully diluted equity / TTM free cash flow (FCF) | 13.9x | $9.800bn / $0.706bn |

The market-data provider's $8.67 billion market cap and other low equity-value figures are basic-share conventions. Fully diluted equity value is higher because awards add to the economic share base, and enterprise value is higher because debt exceeds cash and securities. Mixing a basic-share market cap with fully diluted per-share upside materially overstates cheapness.

## Historical base and owner economics

Trailing Q2 2026 revenue was $6.351 billion, adjusted earnings before interest, taxes, depreciation, and amortization (adjusted EBITDA) $1.023 billion, operating cash flow $919 million, headline FCF $706 million, and stock-based compensation (SBC) $1.031 billion. Snap has produced eight consecutive quarters of positive headline FCF, but TTM SBC equaled 146% of FCF. Awards underlying shares increased 38% year over year and the fully diluted proxy rose 3%, even after first-half (H1) repurchases of $601 million exceeded H1 FCF of $407 million.

The model therefore:

- values on a future fully diluted denominator of 1.90–1.98 billion shares;
- does not add buybacks to value as if they were distributable cash;
- treats Specs as negative-carry optionality until orders and unit economics exist;
- uses FCF as a cross-check rather than as clean owner earnings;
- excludes lease liabilities from the primary EV bridge but shows them above.

## Four-quarter operating scenarios

The detailed model is in the [quarterly forecast](../research/2026-08-20-quarterly-forecast.md).

| Driver, Q3 2026–Q2 2027 | Bear | Base | Bull | Evidence / rationale |
| --- | ---: | ---: | ---: | --- |
| Advertising revenue | $5.515bn (+3.5%) | $5.954bn (+11.7%) | $6.316bn (+18.5%) | Better ad stack is real; auction yield remains the bottleneck |
| Other Revenue | $1.160bn (+13.4%) | $1.346bn (+31.6%) | $1.566bn (+53.1%) | >25m paid and >$1bn run rate, but no churn/margin disclosure and partner revenue is included |
| **Total revenue** | **$6.675bn (+5.1%)** | **$7.300bn (+14.9%)** | **$7.882bn (+24.1%)** | Total can outgrow ads because direct revenue is ~20% of the latest quarter |
| Adj. EBITDA | $0.910bn | $1.385bn | $1.750bn | Restructuring helps; infrastructure, legal, and Specs constrain flow-through |
| Headline FCF | $0.500bn | $0.840bn | $1.140bn | Lower than a mechanical 75% EBITDA conversion assumption |
| Q2 2027 net debt, latest reported at target | $0.800bn | $0.550bn | $0.200bn | Buybacks and commitments limit deleveraging |
| Q2 2027 diluted shares, latest reported at target | 1.98bn | 1.93bn | 1.90bn | Awards and buybacks are modeled together |

## Primary valuation: target-date trailing enterprise-value multiple

The primary method capitalizes Q3 2026–Q2 2027 revenue at a scenario-specific EV/revenue multiple, subtracts Q2 2027 net debt, and divides by the Q2 2027 diluted-share proxy—the latest likely reported balance sheet at the August target date. Because the price target is 20 August 2027, this four-quarter period is the latest target-date **trailing** revenue, not target-date next-twelve-month (NTM) revenue. The base 1.65x is therefore compared with today's 1.68x trailing multiple on the same basis.

> Value/share = (target-date LTM revenue × EV/revenue multiple − latest-reported net debt) / latest-reported diluted shares

| Bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Target-date LTM revenue | $6.675bn | $7.300bn | $7.882bn |
| EV/revenue | 0.80x | 1.65x | 2.40x |
| Implied EV | $5.340bn | $12.045bn | $18.917bn |
| Less net debt | $0.800bn | $0.550bn | $0.200bn |
| Equity value | $4.540bn | $11.495bn | $18.717bn |
| Diluted shares | 1.98bn | 1.93bn | 1.90bn |
| **Value/share** | **$2.29** | **$5.96** | **$9.85** |

The bear multiple reflects a still-growing but structurally subscale ad marketplace with weak owner economics. The base multiple is close to Snap's current 1.68x trailing EV/revenue and assumes proof of growth without a full governance/SBC rerating. The bull multiple requires positive ad yield, broad advertiser spend, high-value-user stabilization, direct-revenue durability, and credible Specs/legal containment. Multiple expansion is therefore correlated with the operating wins; it is not an independent catalyst.

The [capital-allocation bridge](../research/2026-08-20-quarterly-forecast.md#capital-allocation-and-dilution-bridge) starts from $0.875bn net debt and 1.881bn diluted shares. It shows the cash not retained after FCF and the net new dilution needed to reach each target; neither FCF nor repurchases receive a second valuation credit.

## Relative valuation

At the cutoff, a crude equity-value/annualized-Q2-revenue comparison was approximately 1.36x for Snap using the provider's basic-share market cap, versus 2.8x Pinterest, 5.8x Meta, and 9.4x Reddit. Snap's fully diluted/net-debt-aware EV comparison is about 1.67x annualized Q2 revenue. The peer figures use their public market caps and closest reported Q2 revenue and are scale indicators, not a formal comparable-company table.

The discount is large but economically explicable:

- Meta ad revenue grew 27% in Q2 versus Snap at 9%, with far higher margins and auction liquidity.
- Reddit ads grew 64% from a smaller base; Pinterest total revenue grew 18%.
- Snap's highest-value regions are losing daily active users (DAU), it remains GAAP loss-making on a trailing basis, and SBC exceeds FCF.
- Class A holders have no vote and cannot force a sale, a Specs cap, or governance reform.

The relative case therefore supports “cheap if execution persists,” not “must converge to Meta.” Assigning Snap Meta's multiple would capitalize the very advantages Snap has not yet demonstrated.

## Sum-of-the-parts cross-check

The direct-revenue business deserves separate attention but not a software-as-a-service (SaaS) multiple. It includes subscriptions, storage, premium tiers, and an artificial-intelligence (AI) platform partnership; churn, plan mix, gross margin, and subscriber geography are undisclosed.

| Target-date LTM SOTP | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Advertising revenue multiple | 0.70x | 1.40x | 2.00x |
| Other Revenue multiple | 1.20x | 2.50x | 4.00x |
| Specs value | $0 | $0.30bn | $0.50bn net option value* |
| Implied value/share | ~$2.25 | ~$5.94 | ~$10.10 |

\*No operating hardware profit is modeled. The modest net option value is monotonic across cases and remains far below cumulative spending. The SOTP is a segment-multiple decomposition, not independent proof, because it reuses the same revenue, net debt, shares, and risk-premium judgments as the primary method.

## Equity discounted-cash-flow cross-check

Because Snap's reported FCF is after cash interest, the discounted-cash-flow (DCF) cross-check discounts levered equity FCF per diluted share and does not subtract net debt a second time. Year-one shares equal the primary valuation's target shares; years two through five assume 3% / 2% / 1% annual net new dilution in bear / base / bull. That dilution is incremental to the awards already included in the opening 1.881bn proxy.

| Scenario / year | Revenue | FCF margin | FCF | Diluted shares | FCF/share | PV of FCF/share |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Bear Y1 | $6.675bn | 7.49% | $0.500bn | 1.980bn | $0.253 | $0.222 |
| Bear Y2 | 6.942 | 7.60% | 0.528 | 2.039 | 0.259 | 0.199 |
| Bear Y3 | 7.150 | 7.80% | 0.558 | 2.101 | 0.266 | 0.179 |
| Bear Y4 | 7.293 | 7.90% | 0.576 | 2.164 | 0.266 | 0.158 |
| Bear Y5 | 7.439 | 8.00% | 0.595 | 2.229 | 0.267 | 0.139 |
| Base Y1 | $7.300bn | 11.51% | $0.840bn | 1.930bn | $0.435 | $0.385 |
| Base Y2 | 8.249 | 12.00% | 0.990 | 1.969 | 0.503 | 0.394 |
| Base Y3 | 9.156 | 12.50% | 1.145 | 2.008 | 0.570 | 0.395 |
| Base Y4 | 9.981 | 13.00% | 1.297 | 2.048 | 0.634 | 0.389 |
| Base Y5 | 10.679 | 13.50% | 1.442 | 2.089 | 0.690 | 0.375 |
| Bull Y1 | $7.882bn | 14.46% | $1.140bn | 1.900bn | $0.600 | $0.536 |
| Bull Y2 | 9.458 | 15.10% | 1.428 | 1.919 | 0.744 | 0.593 |
| Bull Y3 | 10.972 | 15.70% | 1.723 | 1.938 | 0.889 | 0.633 |
| Bull Y4 | 12.288 | 16.30% | 2.003 | 1.958 | 1.023 | 0.650 |
| Bull Y5 | 13.517 | 17.00% | 2.298 | 1.977 | 1.162 | 0.660 |

| DCF bridge | Bear | Base | Bull |
| --- | ---: | ---: | ---: |
| Cost of equity | 14% | 13% | 12% |
| Terminal growth | 2.0% | 2.5% | 3.0% |
| PV of years 1–5 FCF/share | $0.90 | $1.94 | $3.07 |
| PV of terminal value/share | $1.18 | $3.66 | $7.55 |
| **Present value/share** | **$2.08** | **$5.59** | **$10.62** |

The DCF confirms the broad range and shows why a high-quality FCF assumption matters more than headline revenue alone. It should not be read with false precision: terminal value is 57% / 65% / 71% of scenario value, and Snap's cash flow contains working-capital timing, buybacks used to absorb SBC, and cloud infrastructure expensed above FCF.

## Reverse expectations

Using $9.80 billion of fully diluted equity value, $6.351 billion starting revenue, a 13% cost of equity, 2.5% terminal growth, year-end discounting, and constant revenue growth and FCF margin for five years, the company-level levered-equity DCF approximately requires:

| Durable headline FCF margin | Implied five-year revenue compound annual growth rate (CAGR) |
| ---: | ---: |
| 6% | 28.2% |
| 8% | 20.1% |
| 10% | 14.2% |
| 12% | 9.4% |
| 15% | 3.8% |

This table assumes no incremental future dilution; it values the whole company against today's fully diluted equity value. Applying 2% annual net new dilution from year one and reducing terminal per-share growth by the same dilution raises the required CAGR to 19.9% at a 10% margin and 14.9% at a 12% margin. This is the cleanest statement of the debate: the stock is cheap only relative to the durable margin and dilution one believes are achievable.

## Sensitivities

At the $7.30 billion base revenue forecast and 1.93 billion shares, every 0.25x change in EV/revenue changes value by roughly **$0.95 per share**. Every $250 million of additional net debt changes value by approximately **$0.13 per share**. A 2% increase in the target share count reduces value by about **$0.12 per share** near the base case. Multiple and durable FCF margin dominate the model.

## Failure cases and limitations

- A product-design verdict, reserve, or remedy can produce nonlinear value below the modeled bear case.
- The model has no age-by-revenue, regional contribution-margin, subscription churn, or Specs segment data.
- Peer multiples are not standardized for cash, debt, GAAP profitability, or user definitions.
- The acquisition value of Snap's users is not a floor because Class A is non-voting and an outside buyer cannot force a sale.
- The probabilities are analyst judgments. Using the preliminary financial module's more optimistic 30%/50%/20% weighting and scenario values produces about $5.94; the adversarial review produces about $4.54. The integrated $5.44 sits between them because the evidence supports real improvement but not a strong expected-value edge.

## Target lifecycle

- **Target horizon:** 20 August 2027.
- **Six-month checkpoint:** approximately 20 February 2027, after Q4 2026 reporting if the calendar is comparable.
- **Next review:** no later than 15 November 2026, or immediately after Q3 results.
- **Upgrade conditions:** at least two quarters of ad growth ≥15% with effective cost per thousand impressions (eCPM) near-flat/positive, North America DAU stable at ≥92 million, exact subscriber progress with retention/margin evidence, Q2 2027 fully diluted shares ≤1.91 billion, no infrastructure or legal overrun, and bounded Specs funding.
- **Downgrade conditions:** ad growth <8% with double-digit impressions, North America DAU <90 million, Other Revenue <30% without subscriber progress, gross margin <55% after another infrastructure increase, Q2 2027 fully diluted shares >1.96 billion, or a structural legal/product remedy.

## Sources

See the [financial module](../research/2026-08-20-financials-capital-structure.md), [advertising/AI module](../research/2026-08-20-ads-ai-competition.md), [market/peers module](../research/2026-08-20-market-peers.md), [product/users/regulation module](../research/2026-08-20-product-users-regulation.md), [adversarial review](../research/2026-08-20-adversarial-review.md), and [source log](../sources.md).

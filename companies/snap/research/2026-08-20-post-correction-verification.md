---
type: research_memo
company: Snap Inc.
ticker: SNAP
status: draft
as_of: 2026-08-21
source_cutoff_at: 2026-08-20T23:30:00+02:00
scope: post-correction-model-verification
---

# Snap post-correction model verification

> Historical verification of the corrected 20 August 2026 thesis, valuation, forecast, and decision record. The [21 August re-underwritten valuation](../valuation/2026-08-21-reunderwritten-valuation.md) is the current draft model. Neither package is a published prospective scorecard. Financial shorthand is defined in the [glossary](../GLOSSARY.md).

## Result

**20 August core model: pass. Formal publication provenance: intentionally open.** An independent agent rechecked the corrected arithmetic and labels; the lead agent then resolved the remaining convention issues it identified. That package's publication blocker is market-observation provenance: the $5.21 SNAP and $710.93 Invesco QQQ exchange-traded fund (QQQ) references need reproducible official/adjusted-close records, a forecast identifier, a public commit, and human review before prospective-ledger registration.

> **Verification formulas**
> `Probability-weighted value = Σ(scenario probability × scenario value)`
> `Expected return = probability-weighted value / reference price - 1`

## Recalculation checks

Metric shorthand: adjusted earnings before interest, taxes, depreciation, and amortization (adjusted EBITDA); free cash flow (FCF); last twelve months (LTM).

| Check | Verified result |
| --- | ---: |
| Next-four-quarter revenue, bear / base / bull | $6.675bn / $7.300bn / $7.882bn |
| Primary value/share | $2.2929 / $5.9560 / $9.8509 |
| Displayed target range | $2.29 / $5.96 / $9.85 |
| Probability-weighted 12-month value | $5.44 |
| Expected return from $5.21 | 4.4% |
| Six-month value/share | $2.6233 / $5.5277 / $8.3811 |
| Probability-weighted six-month value | $5.08 |
| Segment-multiple decomposition | $2.25 / $5.94 / $10.10 |
| Scheduled levered-equity discounted cash flow (DCF) | $2.08 / $5.59 / $10.62 |
| Reverse-DCF required compound annual growth rate (CAGR) at 6% / 8% / 10% / 12% / 15% margin, no future dilution | 28.2% / 20.1% / 14.2% / 9.4% / 3.8% |
| Reverse-DCF required CAGR at 10% / 12% margin with 2% dilution from year one | 19.9% / 14.9% |

Quarterly components, growth rates, adjusted-EBITDA/FCF margins, the Q2 2027 cash/share bridge, scenario returns, and portfolio effects also recalculate. The four-quarter period is consistently labeled target-date LTM; Q2 2027 net debt and shares are explicitly the latest likely reported balance sheet at the August target.

## Corrected coherence checks

- Q3 Other Revenue is monotonic across bear/base/bull and is not a plug.
- Specs net option value is monotonic across scenarios and no operating hardware profit is modeled.
- The cash residual excludes restructuring payments already captured in operating cash flow.
- The scheduled DCF counts only net new dilution beyond the opening award overhang.
- The downgrade trigger is time-indexed to Q2 2027 shares above 1.96bn, so the 1.93bn base case does not falsify itself.
- Six-month values have an explicit LTM revenue, multiple, net-debt, and share bridge and remain illustrative rather than a formal target.
- Thesis, valuation, and decision records agree on targets, probabilities, position disclosure, horizon, identity hash, and draft status.

## Provenance boundary

The [integrated audit](2026-08-20-integrated-audit.md) is a pre-correction audit trail and intentionally preserves the issues and old figures it found. Corrected 20 August values are those in this verification, the [20 August valuation](../valuation/2026-08-20-valuation.md), and the [20 August thesis](../thesis/2026-08-20-initial-thesis.md); the [21 August re-underwrite](../valuation/2026-08-21-reunderwritten-valuation.md) supersedes them for the current draft view. No draft may enter the performance ledger until reproducible official market observations replace the dynamic public quote references.

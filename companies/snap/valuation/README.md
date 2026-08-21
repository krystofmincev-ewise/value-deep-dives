# Snap valuation history

The current working valuation is the [21 August 2026 re-underwrite](2026-08-21-reunderwritten-valuation.md). It produces a 12-month bear/base/bull range of **$2.50 / $7.75 / $14.25** and a probability-weighted value of **$7.74** from a $5.21 public reference. Its six-month checkpoint range is **$3.70 / $6.73 / $10.81**, weighted to **$6.79**. A same-day [confidence-gap evidence pass](../research/2026-08-21-confidence-gap-estimates.md) shifted five probability points from bear to base without changing the scenario values.

The [20 August 2026 draft valuation](2026-08-20-valuation.md) produced **$2.29 / $5.96 / $9.85** and a probability-weighted **$5.44**. It remains as a superseded draft audit trail. Neither snapshot is registered in the prospective ledger pending formal price-record and publication controls.

Run `node companies/snap/valuation/verify-2026-08-21.mjs` from the repository root to recompute the current capitalization, quarterly totals, three valuation methods, scenario weighting, and six-month checkpoint with deterministic assertions. Run `node companies/snap/valuation/verify-2026-08-21-confidence-gaps.mjs` to verify the advertising, subscription, Specs, legal, and updated-probability calculations in the evidence pass. Run `node companies/snap/valuation/verify-2026-08-21-regional-economics.mjs` to reconcile the regional contribution model, 2,673-case sensitivity grid, and bridge back to Q2 GAAP operating loss. Run `node companies/snap/valuation/verify-2026-08-21-recommender-upside.mjs` to check the no-further-improvement advertising bridge and embedded per-share sensitivity.

Formal snapshots belong in this folder as `YYYY-MM-DD-valuation.md`. Once published, a snapshot is not overwritten after material new information. A later valuation links to the prior file, explains what changed, and marks the prior target `superseded`, `reached`, `expired`, or `invalidated` as appropriate.

The first snapshot should include:

- source cutoff, reference price, timestamp, source, and currency;
- diluted share count, cash, debt, leases, and enterprise-value reconciliation;
- bull, base, and bear operating scenarios;
- explicit stock-based compensation and dilution treatment;
- discounted cash flow (DCF) or cash-flow value plus a multiple-based cross-check;
- target horizon, review date, sensitivities, and falsifiers;
- scenario values per share and, if used, probabilities.

Use the [valuation template](../../../templates/valuation.md) and the repository [valuation framework](../../../methodology/VALUATION_FRAMEWORK.md).

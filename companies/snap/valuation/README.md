# Snap valuation

The single canonical valuation for coverage cycle `SNAP-2026-W34-01` is [2026-W34](2026-W34-valuation.md). Its deterministic 100,000-draw model produces a twelve-month **P10 / P50 / P90 of $2.86 / $7.90 / $13.78** and a **mean of $8.23** from a $5.21 public reference. The modeled probability below the reference is 28.6%. The six-month downside/central/upside checkpoints of **$3.70 / $6.73 / $10.81** remain unweighted narrative paths because price convergence at six months is not modeled.

This valuation is not registered in the prospective ledger pending formal price-record and publication controls. The 22 August seasonality/event audit retained the scenario values and probabilities after adding advertising-specific sequential checks and explicit comparison-base sensitivities.

Run `node companies/snap/valuation/verify-2026-08-21-distribution.mjs` from the repository root to assert the distribution contract, deterministic output, legal-state frequencies, method cross-checks, and downside metrics. Run `node companies/snap/valuation/verify-2026-08-21.mjs` to recompute current capitalization, unweighted operating paths, three valuation methods, and six-month checkpoints. Run `node companies/snap/valuation/verify-2026-08-21-confidence-gaps.mjs` to verify the advertising, subscription, Specs, legal, and regional confidence-gap calculations. Run `node companies/snap/valuation/verify-2026-08-21-regional-economics.mjs` to reconcile the regional contribution model, 2,673-case sensitivity grid, and bridge back to Q2 GAAP operating loss. Run `node companies/snap/valuation/verify-2026-08-21-recommender-upside.mjs` to check the no-further-improvement advertising bridge and embedded per-share sensitivity. Run `node companies/snap/valuation/verify-2026-08-21-seasonality.mjs` to check total and advertising sequential transitions, the Q2 denominator and Q3 capitalization World Cup sensitivities, political-spend comparison normalization, exact Easter/holiday timing, and the Q3 segment-mix sensitivity.

Each coverage cycle exposes one canonical valuation named `YYYY-Www-valuation.md`. It evolves in place while the cycle is an active draft. Once finalized, it is immutable; the next revaluation belongs to a new ISO-week coverage cycle and may compare only against that prior final valuation.

The first snapshot should include:

- source cutoff, reference price, timestamp, source, and currency;
- diluted share count, cash, debt, leases, and enterprise-value reconciliation;
- unweighted downside, central, and upside operating anchors plus explicit stochastic marginals;
- explicit stock-based compensation and dilution treatment;
- discounted cash flow (DCF) or cash-flow value plus a multiple-based cross-check;
- target horizon, review date, sensitivities, and falsifiers;
- distribution quantiles, mean, downside frequencies, dependency stress, and calibration status.

Use the [valuation template](../../../templates/valuation.md) and the repository [valuation framework](../../../methodology/VALUATION_FRAMEWORK.md).

# Probability and security-reaction discipline

## Build the probability from a reference class

1. Define the target exactly before selecting examples.
2. Select the historical universe using information and identifiers available at each cutoff.
3. Preserve failures, cancellations, acquisitions, delistings, missing outcomes, and abstentions.
4. State the base rate, sample size, period, sector/phase/regime, censoring horizon, and exclusions.
5. Group related evidence by causal channel. Apply one adjustment per independent evidence group unless dependence is explicitly modeled.
6. Record upward, downward, and neutral evidence and an uncertainty range around the point probability.

Do not train or backtest on current registry status, later filings, revised macro observations, future index membership, post-event publications/news, or price reactions.

## Separate the probability tree

Typical nodes are:

```text
event occurs in window
        ↓
observable result satisfies factual rule
        ↓
regulatory / customer / operating consequence
        ↓
cash-flow or asset-value consequence
        ↓
security meets the return threshold
```

Estimate only the node represented by each recorded probability. State conditional probabilities rather than compressing the tree into an unexplained conviction score.

## Convert scenarios into a reaction model

For positive, ambiguous, and negative results record:

- event probability;
- conditional change to revenue, margin, cash need, asset NPV, or terminal assumptions;
- conditional dilution or financing;
- valuation before and after the event;
- plausible immediate and horizon returns;
- confounders and an “already priced” case.

`event_probability_pct` and `target_probability_pct` need not be equal. The stock can fail the target after a correct event result, or meet it after an incorrect result.

## Market comparators

- Options-implied move: account for straddle definition, expiry, volatility risk premium, spreads, skew, dividends, and timestamp.
- Prediction market: verify contract resolution, fees, liquidity, participant restrictions, and whether price is executable.
- Consensus: freeze provider and timestamp; distinguish mean/median, GAAP/adjusted, stale contributors, and estimate range.
- Historical reaction: use point-in-time event membership, first tradable bar, identical windows, corporate actions, benchmark model, and robust inference.

Treat comparators as evidence, not truth.

## Abstain

Keep the forecast draft or state `insufficient_evidence` when identity, schedule, outcome rule, reference class, price source, benchmark, or evaluation path cannot be resolved. Abstention coverage is itself an evaluation metric.

# Decision and valuation contract

## Separate three judgments

1. **Business outcome:** What operating path is most likely?
2. **Value:** What is the security worth under explicit scenarios and capital structure?
3. **Action:** Does expected benchmark-relative return clear a predeclared hurdle for this portfolio and horizon?

Do not make confidence in one stand in for the others.

## Predeclare thresholds

Record before assigning a label:

- horizon and benchmark;
- entry/add excess-return hurdle;
- hold/watch band;
- acceptable bear-case drawdown or permanent-loss limit;
- minimum evidence gate and maximum unresolved critical inputs;
- liquidity, dilution, financing, and survival constraints;
- position context, switching cost, tax, and concentration factors when supplied.

Do not invent a universal 15% or 20% hurdle. If the user supplies none, show how conclusions change across illustrative hurdles.

## Research stance

- `attractive`: expected excess return clears the research hurdle, downside is survivable, and the evidence gate passes.
- `neutral`: value is near the reference price or the edge is too small for uncertainty.
- `unattractive`: expected excess return is negative, downside dominates, or a thesis falsifier occurred.
- `insufficient_evidence`: identity, facts, financing, valuation, or market-expectation inputs are too incomplete to classify.

## Portfolio action mapping

| Research state | No position | Existing long | Existing short |
| --- | --- | --- | --- |
| Attractive long | Buy or watch if constraints fail | Add or hold | Reduce or exit short |
| Neutral | Watch/pass | Hold or reduce concentration | Hold or reduce concentration |
| Unattractive long | Pass; short only after a separate borrow/downside case | Reduce or exit | Add/hold short only if risk rules pass |
| Insufficient evidence | Pass/watch | Explicit temporary hold or reduce risk | Explicit temporary hold or reduce risk |

`hold` is portfolio-context dependent. For a person with no position, its closest research equivalent is usually `watch`, not buy.

## Method selection

| Economics | Primary methods | Required checks |
| --- | --- | --- |
| Mature cash generator | FCFF/FCFE DCF, earnings or FCF multiple | Normalized reinvestment, terminal value, capital allocation |
| SaaS/internet | Reverse DCF, unit economics, EV/revenue or EV/gross profit cross-check | SBC, dilution, retention, incremental margin, cloud commitments |
| Semiconductor/cyclical | Mid-cycle DCF/earnings, asset/capacity lens | Inventory, utilization, cycle peak/trough, capex and customer concentration |
| Bank | Excess return/residual income, P/TBV and ROTCE | Capital requirements, credit losses, deposit franchise, AOCI |
| Insurer | P/B or P/TBV, normalized earnings, embedded value where appropriate | Reserve quality, catastrophe load, capital and reinsurance |
| Commodity producer | NAV and scenario cash flow across price deck | Reserves, decline, basis, hedges, sustaining capex, liabilities |
| Utility/infrastructure | Rate-base or contracted cash-flow model | Allowed returns, capex funding, regulatory lag, decommissioning |
| Consumer/retail | DCF, normalized earnings, store/unit economics | Inventory, markdowns, lease liabilities, cyclicality, channel mix |
| Pre-revenue biopharma | Asset-level probability-adjusted NPV plus net cash | Trial/approval probabilities, spend, partner economics, dilution |
| Conglomerate | SOTP plus consolidated DCF | Corporate costs, taxes, minority interests, trapped cash |

## Scenario mathematics

- Tie bear/base/bull cases to coherent operating narratives.
- State probabilities only when the reference class and adjustments can be defended.
- Calculate expected value as an author calculation, never as a substitute for the full distribution.
- Reconcile enterprise value to diluted equity value with cash restrictions, debt, leases, pensions, minority interest, preferreds, options, RSUs, convertibles, and partner claims.
- Show sensitivity to the variables that dominate value.
- Use an independent cross-check with different failure modes.
- Fail closed when a material input is absent; label illustrative values explicitly.

## Quantity and horizon contract

Write the machine-readable valuation-horizon contract before copying summary
numbers into prose. For every modeled horizon record the exact quantity, date,
method, calibration state, mean, median, material quantiles, loss probabilities,
and lower-tail expected shortfall. Use a separate unweighted table for
deterministic scenario narratives. Scenario labels and percentile labels must
never share one column heading because they answer different questions.

A twelve-month fair-value distribution alone says nothing complete about the
six-month distribution. When an interim checkpoint affects the decision, choose
one of these contracts:

- `joint`: the same draw carries shared operating, valuation, capital, dilution,
  and tail states through both dates; disclose the transition mechanism,
  cross-horizon dependence, conditional later outcomes, and linkage stress;
- `independent`: each horizon is separately modeled and no claim is made that an
  earlier state leads to a later state; or
- `single`: only one horizon is a valuation output and other dates are clearly
  qualitative monitoring triggers without valuation numbers.

Reconcile embedded risk allowances at every date before adding a shared legal,
regulatory, financing, or survival branch. Do not count the same expected loss
inside revenue, cash, the multiple, and the branch.

Contract schema v1 supports at most two formal horizons, ordered earliest to
latest. Its dependence and transition fields describe that pair. A third
horizon requires a reviewed schema extension with explicit pairwise transitions;
an overall correlation is not an adequate substitute.

## Publication gate

- [ ] Identity, cutoff, price, currency, horizon, and benchmark are exact.
- [ ] Historical base and adjustments are reproducible.
- [ ] No enterprise/equity, period, unit, or share-count mismatch remains.
- [ ] Bear case includes financing and permanent-loss paths.
- [ ] Market expectations and variant perception are evidence-backed.
- [ ] Strongest counter-thesis could change the decision if true.
- [ ] Stance and action are separate and thresholds are visible.
- [ ] Valuation and decision link to source records and the immutable prior version.
- [ ] Every displayed modeled horizon has a complete, verified output contract.
- [ ] Multi-horizon outputs are joint or explicitly independent, with no implied transition left undefined.
- [ ] Narrative scenarios and distribution percentiles are presented separately.
- [ ] The current review snapshot still matches the model, horizon contract, report, valuation, and decision.

# Event-driven research

Event-driven research asks two different questions:

1. What observable event outcome will occur?
2. What will the security do under a predeclared price and benchmark rule?

A correct event forecast can lose money when the result was priced in, the reaction was delayed, another disclosure dominated, or the security mapping was wrong. A profitable trade can result from a wrong thesis. Record and score the two questions separately.

## Eligible events

Examples include earnings, guidance, clinical-trial readouts, regulatory decisions, product or customer announcements, legal decisions, policy changes, financing, capital allocation, M&A, commodity or rate decisions, and scheduled operating data.

Require a public-information path to an observable outcome. Do not build a forecast from material non-public information, rumors presented as facts, private communications, or data whose research use is not permitted.

## Pre-registration record

First add every event considered under a strategy or screen to [`track-record/event-candidate-ledger.csv`](../track-record/event-candidate-ledger.csv), including abstentions, ineligible cases, and deferrals with reasons. Freeze each declared cohort in one commit before its event windows; rows cannot later change or disappear. A registered forecast records the candidate ID and links back to that first-appearance commit, and every registered candidate must map to exactly one event-ledger row. Run `npm run research:records -- summarize-event-candidates track-record/event-candidate-ledger.csv`. This establishes coverage only for the declared cohort, not proof that an external or discretionary screen omitted nothing. A forecast ledger containing only selected bets cannot establish coverage or strategy skill.

Use [`templates/event-forecast.md`](../templates/event-forecast.md). Before the information cutoff passes, freeze:

- company and security identity;
- event type, expected window, timezone, and market session;
- the source for the event timing and how uncertainty in timing is handled;
- a binary event-outcome rule that a third party could resolve;
- the treatment of a missed deadline (`event_zero` only for an explicit occurs-by-deadline rule, otherwise `unresolvable`) and the canonical official URL checked after that deadline;
- probability of that event outcome and a named, versioned event baseline with its probability and sample size;
- a separate directional return threshold, return basis, entry rule, measurement window, benchmark, probability, and named target baseline;
- a versioned evaluation specification, trading-session count, market session, and price-adjustment rule;
- reference price, timestamp, currency, adjustment convention, and source;
- market-implied comparator when one is legitimately available;
- scenario returns, conditional reasoning, confounders, falsifiers, and no-trade conditions;
- source cutoff, publication timestamp, position disclosure, and public commit.
- committed source records for both baselines and a SHA-256 fact/source snapshot whose known times do not exceed the cutoff.

Use one forecast per independently resolvable proposition. Do not hide several conditions inside “the readout will be good.” For a trial, define the population, endpoint, analysis set, timepoint, statistical rule, and disclosed source. For earnings, define the metric, accounting basis, period, and consensus snapshot.

## Probability discipline

Start with a documented reference class. Adjust for evidence in distinct groups so correlated signals are not counted repeatedly. Give the strongest evidence that would move the probability down as much attention as confirming evidence.

Keep these quantities separate:

- `event_probability_pct`: probability that the predeclared factual event rule resolves to 1;
- `target_probability_pct`: probability that the security meets the return rule;
- conditional price reactions under positive, negative, and ambiguous event outcomes;
- expected excess return after weighting scenarios, before any private portfolio constraints.

Options-implied moves and prediction-market prices can be comparators, but they are not automatically physical probabilities. Adjust or qualify them for volatility risk premium, spreads, liquidity, contract wording, and stale timestamps. Analyst consensus is also not a market probability.

## Information timing and leakage

- Record `source_cutoff_at` with timezone, not only a date.
- Record when the issuer or regulator actually published the result and whether it was during, before, or after the market session.
- Use the next genuinely tradable observation under the predeclared rule. Never enter at a close that preceded an after-hours announcement.
- Preserve delisted, acquired, suspended, and failed companies in the universe.
- Use point-in-time estimates, filing versions, trial registry versions, index membership, and corporate actions.
- Freeze feature definitions, thresholds, peers, and scoring windows before inspecting outcomes.
- Treat changes to event timing as new evidence; update prospectively and preserve the original record.

## Event-specific minimums

### Clinical and regulatory

Invoke `$biopharma-evidence-research`. Audit protocol versions, endpoint hierarchy, analysis population, multiplicity, power, missing data, safety, prior class evidence, sponsor incentives, regulatory precedent, commercial value, cash runway, partner economics, and dilution. A met endpoint is not the same as approval or value creation.

### Earnings and guidance

Freeze the exact consensus source and timestamp; reconcile GAAP and adjusted definitions; identify the metrics that historically explained reactions; separate the reported quarter, forward guidance, and narrative change; and record the options-implied move only from a licensed, timestamped source.

### AI, semiconductors, and software

Resolve benchmark ownership and methodology, shipment versus sell-through, capacity and lead times, customer concentration, export restrictions, revenue recognition, cloud commitments, and whether a product announcement can affect the forecast horizon.

### Energy and policy

Resolve the decision-making authority, release calendar, measurement unit, revisions, weather or commodity confounders, hedges, basis differentials, and asset-specific exposure. A commodity move is not a company return without an exposure bridge.

### Financials and consumer

For financials, separate rate, credit, liquidity, capital, and regulatory channels. For consumer or fashion, separate traffic, units, price, markdowns, returns, inventory, channel mix, wholesale timing, and foreign exchange.

## Outcome resolution

After the event, create an immutable outcome record from [`templates/event-outcome.md`](../templates/event-outcome.md). Resolve the exact original rules before reading the narrative implication. Record proposition-level statuses, release status, the frozen resolution deadline, a validated event-outcome source record, source timestamps, adjusted prices, benchmark values, separate frozen security and benchmark adjustment rules, end-session number, corporate actions, confounders, and missing observations. A missed or late release can resolve the event proposition to zero only under the frozen `event_zero` policy and after the official source is checked; otherwise it is unresolvable. Its release-anchored security-reaction proposition remains pending or unresolvable. For a resolved security target, commit a hashed market-observation bundle plus hashed normalized market-data captures and resolve eligible sessions from the already-published, hashed exchange-calendar snapshot. Forecast publication itself must prove that the calendar covers the prior close when required and the full return window after the latest permitted release. The linkage audit checks both market source records, requires their checksums to equal the committed capture hashes, and recomputes the target label from the frozen return metric, direction, threshold, and canonical observations. One proposition may resolve while the other remains pending or unresolvable.

Use the event ledger's frozen probabilities for proper scoring:

- Binary Brier score: `(p - y)^2`, with `p` in `[0,1]` and outcome `y` equal to `0` or `1`.
- Report event-outcome and security-outcome scores separately.
- Show counts and calibration buckets; do not claim skill from a small sample.
- Compare against simple base-rate, constant-probability, and market-implied baselines when available.
- Report all registered forecasts, including passes, missed events, and invalidated theses.

`npm run research:records -- score-events track-record/event-forecast-ledger.csv` performs dependency-free validation, local-origin/ancestry/committed-file linkage checks, fact-cutoff checks, deterministic security-label resolution, baseline comparisons, and scoring once rows exist. [`event-v1`](event-evaluation-specs/event-v1.md) is currently a candidate draft: no formal event forecast may be published against it until concrete lawful price providers and a versioned verified exchange calendar are configured and the specification is published in an earlier public commit. After publication, changes require a new immutable version rather than an edit in place. The local audit still cannot independently prove when a remote host first received a Git object; use a provider-observed release or signed checkpoint when stronger chronology is required.

## Strategy promotion gate

Do not call an event workflow a strategy until it has:

- a frozen eligible universe and event taxonomy;
- reproducible point-in-time inputs;
- predeclared entry, exit, benchmark, cost, liquidity, and corporate-action rules;
- enough prospective or strictly out-of-sample observations for uncertainty estimates;
- calibration and economic-value results versus naive baselines;
- robustness across time, sectors, and event subtypes;
- a documented failure analysis and a shadow or paper phase.

Research and scoring do not authorize trading or brokerage access.

# Event-type playbooks

## Earnings and guidance

- Freeze issuer schedule, reporting period, consensus provider/timestamp, GAAP versus adjusted definitions, and key operating metrics.
- Split reported quarter, forward guide, balance-sheet/cash change, and narrative/estimate revision.
- Reconcile prior guidance and company-definition changes.
- Use licensed options data only when timestamp and contract mechanics are preserved.
- Confounders: simultaneous financing, restructuring, M&A, accounting change, peer/macro news, and after-hours liquidity.

## Clinical trial and regulatory

- Invoke `$biopharma-evidence-research`.
- Resolve candidate/target/indication/line/modality, sponsor/partner economics, NCT/protocol version, endpoint hierarchy, population, analysis set, multiplicity, timepoint, power, missing data, and safety.
- Build historical features from registry versions or AACT snapshots available at cutoff; never today's row.
- Separate endpoint success, phase transition, approval, launch, commercial value, and stock reaction.
- Right-censor unresolved assets and embargo related sponsor/asset/indication events.

## Product, benchmark, or customer contract

- Define availability, shipment, acceptance, usage, recognized revenue, and materiality separately.
- Verify customer identity, duration, minimums, termination, margin, capex, concentration, and whether the announcement is new.
- For benchmarks, freeze system configuration, model, dataset, precision, batch, rules, and submission status.
- Confounders: channel inventory, supplier constraints, prior rumors, non-binding agreements, and revenue timing.

## Financing and capital allocation

- Define instrument, amount, price, fees, maturity, covenants, conversion/dilution, use of proceeds, approval conditions, and closing window.
- Bridge to survival, per-share value, credit risk, and future optionality.
- For buybacks/dividends, distinguish authorization, capacity, execution, and offsetting SBC issuance.

## Legal, policy, and regulatory rules

- Identify the decision-making body, statutory authority, procedural stage, appeal, effective date, scope, geography, and exact products/entities affected.
- Use primary orders, dockets, regulations, and official publication timestamps.
- Confounders: implementation delay, grandfathering, remedies, stays, jurisdiction, and market-wide exposure.

## M&A

- Separate rumor, proposal, signed agreement, shareholder/regulatory approval, financing, and close.
- Model consideration, collars, spreads, break fees, financing, antitrust/remedies, votes, taxes, competing bids, timing, and standalone value.
- Do not treat an unlicensed rumor feed as fact.

## Commodity, energy, and macro releases

- Freeze agency calendar, series, unit, geography, seasonal adjustment, revision policy, survey period, and vintage.
- Map commodity/rate surprise to company-specific volumes, basis, hedges, costs, debt, demand, and valuation.
- Use ALFRED or equivalent vintages when historical macro releases are revised.

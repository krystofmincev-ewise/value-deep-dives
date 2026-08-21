# Valuation framework

Target prices are scenario outputs, not precise truths. Their value comes from transparent assumptions and consistent follow-up.

## Minimum inputs

Every formal valuation snapshot should state:

- source cutoff and valuation date;
- share-price reference, timestamp, and source;
- reporting and valuation currency;
- basic and diluted share counts, including expected dilution;
- cash, debt, leases, and other material claims;
- current enterprise value and equity value reconciled explicitly;
- target horizon and next review date;
- bull, base, and bear operating assumptions;
- valuation method and sensitivities;
- scenario values per share and optional probabilities.

## Multiple discipline

Price-to-sales compares equity value with revenue. EV/sales compares enterprise value with revenue. They are not interchangeable: two companies at the same price-to-sales ratio can have very different leverage and cash balances.

When using multiples:

1. Match enterprise metrics to enterprise value and equity metrics to equity value.
2. Define forward or trailing periods precisely.
3. Explain why the peer group, historical range, or terminal multiple is relevant.
4. Adjust for dilution, stock-based compensation, and capital intensity where material.
5. Show how the terminal enterprise value becomes an equity value and per-share target.

## Scenario design

Bull, base, and bear cases should differ through coherent operating narratives—not arbitrary multiple changes. Depending on the business, scenarios may include:

- users, customers, volume, price, or monetization;
- revenue growth and gross margin;
- operating expense and incremental margin;
- stock-based compensation and dilution;
- reinvestment, working capital, and capital expenditure;
- taxes, net cash or debt, and financing needs;
- terminal growth or exit multiple.

Scenario probabilities are optional. If used, they must sum to 100% and should reflect uncertainty rather than manufacture a preferred answer.

## Methods

Use the method that fits the business and explain its limitations:

- discounted cash flow;
- revenue, EBITDA, earnings, or free-cash-flow multiples;
- sum of the parts;
- unit-economics or cohort model;
- liquidation, replacement, or asset value;
- probability-weighted event or survival analysis.

Cross-check with at least one independent lens when practical.

## Target lifecycle

Each coverage cycle has one canonical valuation. It evolves in place while the cycle is an active draft. Once finalized or prospectively registered it is immutable; a new valuation belongs to a new ISO-week coverage cycle, links to the prior finalized valuation, and explains the cross-cycle change.

Each target has a status:

- `active`: within its horizon and still supported;
- `reached`: the evaluation rule has been met;
- `expired`: the target date passed;
- `invalidated`: a stated falsifier occurred;
- `superseded`: replaced by a new published valuation.

A target without a horizon is incomplete. A past-due `review_by` date should be treated as stale until reviewed.

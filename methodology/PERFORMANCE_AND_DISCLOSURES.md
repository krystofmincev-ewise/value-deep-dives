# Performance and disclosure policy

## Prospective start

The prospective record begins on 17 August 2026. Earlier examples—including Wix, Snap, Amplitude, and IREN—are retrospective motivation and are excluded from formal scorecard statistics.

There are two append-only prospective indexes: [`forecast-ledger.csv`](../track-record/forecast-ledger.csv) for company theses and [`event-forecast-ledger.csv`](../track-record/event-forecast-ledger.csv) for binary event and security-reaction forecasts. A thesis that contains a catalyst belongs in the company ledger; only a separately preregistered, independently resolvable event enters the event ledger. Never count one record twice in an aggregate.

Ordinary Git history helps establish chronology but is not cryptographic proof. Public commit links, releases, or signed tags published before catalysts provide stronger provenance. The event scorer verifies locally available committed content and commit timestamps; it cannot prove when a remote host first received a deliberately backdated Git commit.

## Formal forecast requirements

A forecast enters the scorecard only when it has:

- a stable ID, verified identity path/hash/security/listing IDs, and published thesis path;
- a publication timestamp and public commit;
- a security, reference price, price source, and currency;
- base target, horizon, and evaluation rule;
- declared broad-market and, when useful, sector benchmark;
- a position disclosure;
- status and eventual outcome date.

The ledger must include misses, invalidated theses, and closed or passed formal calls—not only winners.

Event forecasts additionally require a prospectively committed declared-cohort candidate, the identity hash and stable security/listing IDs, schedule-known and event-window timestamps, named event and target baselines, two proposition probabilities and statuses, an already-published evaluation specification with a hashed calendar snapshot, and independently committed outcome and market-observation records. Use `npm run research:records -- score-events track-record/event-forecast-ledger.csv` to enforce that contract.

## Returns and outcomes

Keep these concepts separate:

- **Idea return:** return from the stated public reference price under the predeclared rule.
- **Personal trade return:** return from actual fills, only when voluntarily and sufficiently disclosed.
- **Excess return:** idea return minus the declared benchmark over the same period.
- **Thesis outcome:** whether the predicted business developments occurred.

Unless otherwise specified in the forecast, score at 1, 3, 6, and 12 months and at the thesis horizon. Define treatment of splits, dividends, delistings, acquisitions, and missing prices before calculating aggregate results. Costs and taxes must be stated or explicitly excluded.

Do not select a measurement window after seeing the price path. Revisions apply prospectively and never change how an earlier forecast was originally defined.

## Position disclosures

Formal company memos use one of:

- `long`
- `short`
- `no_position`
- `not_disclosed`

The disclosure is dated. Positions can change without notice. Preserve prior disclosures in dated records. A reference price must never be presented as a personal fill unless it is one.

## Aggregate reporting

Until the record is large enough, the scorecard should say “insufficient observations.” The event ledger supports deterministic Brier and baseline comparisons; the company ledger does not yet have a reproducible adjusted-price adapter or automated return scorer, so company performance remains uncalculated. Later reviews may report hit rate, calibration by confidence bucket, absolute and benchmark-relative returns, and recurring research errors. Portfolio-level returns or drawdowns should appear only when a complete, consistently weighted portfolio rule exists.

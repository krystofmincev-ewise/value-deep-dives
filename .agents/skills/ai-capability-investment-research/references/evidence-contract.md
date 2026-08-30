# AI capability evidence contract

Use this contract for a formal company memo or valuation-input update.

## Source record

| Field | Required content |
| --- | --- |
| Source | Publisher, title, canonical URL |
| Time | Publication date, access date, information cutoff |
| Access | Public or signed-in; retrieval surface; rights class |
| Artifact | Exact model, agent harness, weights/API version, benchmark and version |
| Evaluation | Task count, attempts, pass metric, verifier, contamination/reward-hacking controls |
| Economics | Token-price date, cache assumptions, tokens, retries, wall time, hardware when relevant |
| Claim class | Capability, reliability, economics, availability, or infrastructure |
| Verification | Primary, independently reproduced, triangulated, or unchecked |

## Company transmission record

For every valuation-relevant claim record:

1. workflow layer affected;
2. direction and plausible timing;
3. observable company KPI;
4. measured evidence and units;
5. derivation or judgment adjustment;
6. model variable changed, if any;
7. competing explanation;
8. falsifier and next measurement date.

Do not translate a benchmark percentage directly into revenue loss. A useful bridge normally includes adoption, successful deployment, migration friction, retained business state, price, churn and margin.

## Minimum benchmark cautions

- Compare pass@1 with pass@1 and preserve the number of attempts.
- Treat harness changes as product changes, not noise.
- Record benchmark-version changes before drawing a time series.
- Distinguish list API cost from cost per successful end-to-end outcome.
- Show whether tool use, web access, human intervention or hidden scaffolding was allowed.
- Record known contamination, defective-task and reward-hacking controls.
- Treat a vendor's own benchmark as directional until independently checked.

## Calibration labels

- `empirically_calibrated`: repeated prospective predictions against a relevant reference class pass documented coverage/scoring tests.
- `cross_sectionally_anchored`: inputs use current peer/benchmark distributions but lack prospective validation.
- `structured_elicitation`: ranges and dependencies are explicit judgments informed by evidence.
- `uncalibrated_shadow`: model is retained for learning and sensitivity, not claimed frequency accuracy.

Use the strongest accurate label. A large simulation sample changes numerical stability, not calibration status.

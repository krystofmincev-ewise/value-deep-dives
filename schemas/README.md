# Research record schemas

These JSON Schemas describe the flat YAML front matter used by machine-checked research records:

- [`company-identity.schema.json`](company-identity.schema.json)
- [`coverage-cycle.schema.json`](coverage-cycle.schema.json)
- [`company-ledger.schema.json`](company-ledger.schema.json)
- [`event-forecast.schema.json`](event-forecast.schema.json)
- [`event-outcome.schema.json`](event-outcome.schema.json)
- [`event-ledger.schema.json`](event-ledger.schema.json)
- [`event-candidate-ledger.schema.json`](event-candidate-ledger.schema.json)
- [`source-record.schema.json`](source-record.schema.json)
- [`fact-record.schema.json`](fact-record.schema.json)
- [`fact-snapshot.schema.json`](fact-snapshot.schema.json)
- [`evaluation-spec.schema.json`](evaluation-spec.schema.json)
- [`exchange-calendar-snapshot.schema.json`](exchange-calendar-snapshot.schema.json)
- [`market-observation-bundle.schema.json`](market-observation-bundle.schema.json)
- [`market-data-capture.schema.json`](market-data-capture.schema.json)

Run `npm run research:company -- validate` for cross-file coverage-cycle validation: canonical artifact cardinality and paths, cycle/security alignment, cutoff consistency, navigation, cross-cycle-only supersession, prior-cycle status, and finalized artifact/review hashes.

Run `npm run research:records -- validate-identity <path>`, `validate-event <path>`, `validate-outcome <path>`, `validate-evaluation-spec <path>`, `validate-source <path>`, `validate-fact <path>`, `validate-fact-snapshot <path>`, `validate-calendar-snapshot <path>`, `validate-market-observations <path>`, `validate-market-capture <path>`, or `validate-company-ledger <path>` for dependency-free record validation. Run `score-events track-record/event-forecast-ledger.csv` for ledger validation, candidate/forecast/outcome ancestry checks, source/fact cutoff checks, calendar-session selection, committed market-observation/capture reconciliation, deterministic target resolution, and scoring. The validators enforce publication gates and cross-field rules that JSON Schema alone cannot express.

Schemas document the tracked contract; they do not make an external source trustworthy. Continue to apply the data policy, source hierarchy, rights rules, and claim verification requirements.

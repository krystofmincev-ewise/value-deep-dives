# Research capability architecture

As of 2026-08-20, this repository has a provenance-aware acquisition layer but not yet a complete investment-decision system. This architecture defines how additional tools and skills should fit together without allowing an LLM to become the source of facts or arithmetic.

## Design principles

1. Keep one canonical fact layer. Attach every material number to its source, period, units, filing or dataset version, and information-availability timestamp.
2. Keep deterministic work deterministic. Use code for identifiers, arithmetic, date rules, schema validation, event scoring, and portfolio mechanics.
3. Use agents for semantic work. Use them to plan retrieval, map disclosures to claims, compare explanations, identify missing evidence, and argue the strongest opposing case.
4. Separate research stance from portfolio action. A company can be attractive without being a buy for a particular portfolio, and an existing holding can be a hold when a new position would only merit watching.
5. Freeze prospective records before outcomes. A published thesis or event forecast is immutable; later evidence creates a linked update or outcome record.
6. Add a provider only when it closes a named evidence gap. Every provider must preserve access, rights, timestamp, and retrieval metadata.

## Canonical entities

| Entity | Canonical home | Purpose |
| --- | --- | --- |
| Company and security identity | `companies/<ticker>/identity.md` | Resolve legal entity, listing, currency, fiscal calendar, CIK/LEI, aliases, and source coverage before joining data. |
| Company landing page | `companies/<ticker>/README.md` | Preserve one durable URL for the current view and the chronological coverage-cycle index. |
| Coverage cycle | `companies/<ticker>/coverage-cycles/<YYYY-Www>-<NN>-<kind>/README.md` | Define the scope, cutoff, single canonical report, predecessor, and outputs for each initial or repeat valuation round. |
| Source and claim | Coverage-cycle or study source log | Connect a claim or model input to an original source, access state, rights class, retrieval method, and verification state. |
| Final company report | One `YYYY-Www-final-report.md` referenced by the applicable cycle manifest | Integrate the thesis, variant view, valuation summary, stance, falsifiers, uncertainty, and horizon; evolve in place until the cycle is finalized. |
| Valuation | One canonical valuation referenced by the applicable cycle manifest | Reconcile operating cases, capital structure, scenario values, and sensitivities; compare only to prior finalized cycles. |
| Decision | One canonical decision referenced by the applicable cycle manifest | Map the research view and portfolio context to buy/add/reduce/exit/watch/pass. |
| Event forecast | Dated event forecast plus event ledger | Pre-register an observable event outcome and a separate security-return outcome. |
| Outcome | Dated event outcome or retrospective | Resolve the original rule without rewriting it, then attribute insight, market exposure, timing, and luck. |
| Dataset or experiment | Manifest plus experiment record | Preserve cutoff, licence, transformations, leakage controls, runtime, and negative results. |

## Processing layers

```text
official source / licensed visible source
                    ↓
       deterministic retrieval adapter
                    ↓
  identity + timestamp + rights normalization
                    ↓
      claim and financial fact records
                    ↓
 sector analysis + adversarial interpretation
                    ↓
 valuation / event probabilities / falsifiers
                    ↓
      recommendation and decision record
                    ↓
    prospective scoring and retrospective
```

An analyst agent may propose a calculation or classification, but publication requires the underlying inputs and deterministic calculation to be inspectable. Independent bull and bear agents should receive the same frozen fact set; they should not retrieve different facts and then mistake source divergence for analytical disagreement.

## Recommendation contract

Use two outputs rather than one overloaded label:

- **Research stance:** `attractive`, `neutral`, `unattractive`, or `insufficient_evidence`.
- **Portfolio action:** `buy`, `add`, `hold`, `reduce`, `exit`, `watch`, or `pass`.

An optional absolute-value assessment may describe modeled security return separately. It does not satisfy a benchmark-relative stance contract: if a named benchmark has no expected return, expected excess return is unknown and the formal research stance is `insufficient_evidence`.

Predeclare the horizon, benchmark, required excess-return hurdle, acceptable downside or permanent-loss case, and minimum evidence gate. Do not infer a universal threshold. A defensible mapping is:

| Research state | No current position | Existing position |
| --- | --- | --- |
| Expected excess return clears the hurdle; downside and evidence gates pass | Buy | Add or hold, depending on concentration and switching costs |
| Positive value but below the entry/add hurdle | Watch | Hold |
| Expected excess return is non-positive or a material falsifier occurred | Pass | Reduce or exit |
| Core inputs or identity are unresolved | Insufficient evidence | Hold only as an explicit temporary decision, otherwise reduce risk |

Position size, taxes, liquidity, constraints, and actual fills may remain private. If they are omitted, say so. A research stance is not personalized investment advice.

## Capability roadmap

### Implemented foundation

- SEC submissions and Company Facts retrieval with caching and rate controls.
- Europe PMC, arXiv, and ClinicalTrials.gov evidence retrieval with licence-aware capture.
- Authenticated browser workflows for Gemini, Revelio, YouTube, FT discovery, and focused archive retrieval.
- Canonical coverage-cycle report, valuation, decision, monitoring-note, source, experiment, and retrospective templates.
- Flat identity, source, fact, event-forecast, event-outcome, evaluation-spec, and ledger schemas with dependency-free validators.
- Repository-native company, event, and forecast-evaluation skills with sector playbooks and explicit fail-closed gates.
- Independent event/security Brier scoring, frozen-baseline comparison, per-proposition resolution, and committed-record linkage auditing.
- Transparent structured-elicitation valuation distributions with deterministic
  sampling, declared dependencies and tail branches, method cross-checks, and
  company-specific verification hooks.

### Build first

- Promote the draft event evaluation specification through a reviewed public commit before accepting the first formal event record.
- Add deterministic company-ledger return scoring; the current event scorer covers only binary event and security propositions.
- Add a representative end-to-end company fixture and evaluator suite for evidence coverage, arithmetic, cutoff compliance, and contradictions.
- Deterministic statement normalization, capital-structure reconciliation, valuation arithmetic, and citation checks.
- Reproducible adjusted prices, benchmarks, corporate actions, and scorecard calculations.

### Add when demanded by an active company

- EdgarTools for whole-filing sections, ownership forms, 8-K events, and standardized statements behind the existing SEC policy layer.
- Arelle for ESEF and other Inline XBRL jurisdictions.
- Official sector data adapters such as EIA, FERC, FDIC/FFIEC, FDA, EMA, and public benchmark datasets.
- Event-study validation against an independent statistical implementation.

### Defer until the record is large enough

- Conformal prediction, learned probability models, portfolio optimization, and automated strategy selection.
- Live execution, brokerage connections, or autonomous trading. These are outside the repository's research scope unless explicitly authorized in a separate task.

## Release gate for a new capability

- [ ] The evidence gap and expected research decision are named.
- [ ] The official or licensed source is preferred over a scraper.
- [ ] Identity, cutoff time, units, access, rights, and canonical URL survive retrieval.
- [ ] Secrets and authenticated state never enter tracked files or logs.
- [ ] Failure modes fail visibly; a provider fallback is never silent.
- [ ] Deterministic behavior has tests and representative fixtures.
- [ ] Agent output has an evaluator for citations, arithmetic, dates, and unsupported claims.
- [ ] Prospective rules cannot be changed after the outcome is observed.

---
type: research_harness_audit
title: "Post-Snap research and valuation audit"
as_of: 2026-08-21
baseline_commit: f5fe247ca69cf5052d8541a421ea7b86bbd62405
scope: [evidence-acquisition, valuation-calibration, lifecycle, agent-harness]
status: complete
---

# Post-Snap research and valuation audit — 2026-W34

## Answer first

The Snap dossier is suitable for a full human analytical review. Its filings, operating history, advertising and recommendation-system work, regional estimates, scenario arithmetic, capital bridge, counter-thesis, and source log are materially stronger than the initial evidence set. The canonical investment report remains a **draft, not a prospectively registered forecast**, because its reference price and benchmark still need reproducible official-close records and the user has not approved registration.

Three independent review tasks examined the completed work from different angles: evidence acquisition and source coverage; valuation methodology and calibration; and the repository's skills, tools, agents, lifecycle, and validation harness. They made no repository edits. This document consolidates their findings, records the immediate corrections made after review, and separates current-report limitations from future harness work.

The most important interpretive distinction is:

- Snap's **absolute expected-value assessment is attractive** at the draft $5.21 reference price.
- The formal **QQQ-relative research stance is insufficient evidence** because the dossier does not forecast QQQ and therefore cannot calculate expected benchmark excess return.
- The disclosed existing-position action remains **hold / no add before the third-quarter proof point**.

This distinction changes no bear, base, bull, or probability-weighted value. It makes the decision contract honest.

## What is already strong

| Area | What the dossier now does well | Principal record |
| --- | --- | --- |
| Identity and capital structure | Resolves legal entity, security, share classes, awards, cash, debt, leases, and diluted equity value | [Identity](../companies/snap/identity.md), [financials](../companies/snap/research/2026-08-20-financials-capital-structure.md) |
| Advertising yield | Recovers the Form 10-Q's approximately 10% second-quarter price-per-impression increase and reconciles it with 9.3% advertising growth | [Confidence gaps](../companies/snap/research/2026-08-21-confidence-gap-estimates.md) |
| Regional economics | Uses country prices and an explicit cost allocation to bound North America, Europe, and Rest-of-World contribution without presenting estimates as reported profit | [Regional economics](../companies/snap/research/2026-08-21-regional-ad-economics.md) |
| Recommendation systems | Separates reproducible architecture from proprietary data, auction liquidity, measurement, distribution, and execution; quantifies improvement already embedded in the valuation | [Open-source recommender gap](../companies/snap/research/2026-08-21-open-source-recommender-gap.md) |
| Workforce | Uses licensed aggregate data as a directional capacity check, preserves redistribution limits, and avoids treating modeled classifications as payroll | [Workforce](../companies/snap/research/2026-08-20-workforce.md) |
| Operating model | Exposes quarterly revenue, advertising, direct revenue, cost, cash, regulatory, net-debt, and dilution assumptions | [Operating forecast](../companies/snap/research/2026-W34-quarterly-forecast.md) |
| Valuation | Reconciles three methods, enterprise to equity value, scenario dilution, regulatory allowances, and sensitivities | [Valuation](../companies/snap/valuation/2026-W34-valuation.md) |
| Adversarial discipline | States the strongest bear case, explicit falsifiers, discontinuous legal tails, and why a value below the modeled bear remains possible | [Final report](../companies/snap/thesis/2026-W34-final-report.md), [adversarial review](../companies/snap/research/2026-08-20-adversarial-review.md) |
| Provenance and rights | Records source type, access, rights, retrieval route, use, verification, and capture state; keeps restricted Gemini and Revelio material local | [Source log](../companies/snap/sources.md) |
| Reader access | Provides one canonical report with two-, ten-, and twenty-five-minute paths, question-based navigation, a glossary, and specialist drill-downs | [Snap landing page](../companies/snap/README.md) |

## Immediate findings and disposition

| Finding | Why it mattered | Disposition |
| --- | --- | --- |
| The operating forecast still said Q2 price/impression data were not disclosed | Contradicted the Form 10-Q and the confidence-gap memo | Corrected: approximately +10% price is reported; roughly flat/slightly negative impressions are an inference; exact volume and regional splits remain unknown |
| The final report still asked management for Q2 effective-price growth | Preserved a resolved question | Corrected: the open question is now persistence and exact global/regional impression change |
| The research plan used an early-morning cutoff while the cycle used 16:15 CEST | Made the dossier's information boundary ambiguous | Corrected to the canonical cycle cutoff |
| The valuation compared the final base with a same-cycle working base | Violated the one-final-report lifecycle and invited readers to grade obsolete drafts | Removed; the section now explains the evidence supporting the current base |
| `attractive` was used as a formal stance despite null expected excess return versus QQQ | Conflicted with the repository's benchmark-relative decision contract | Corrected: `research_stance: insufficient_evidence`; separate `absolute_value_assessment: attractive` |
| The cycle manifest described canonical paths only in prose | Made future machine validation harder | Added first-class report, valuation, decision, and forecast paths |
| Methodology implied every canonical artifact must physically sit inside the cycle folder, while Snap used stable subfolders | Created two competing layout authorities | Corrected: the cycle manifest logically owns the artifacts and its validated paths are authoritative |

## Remaining evidence limitations in the Snap conclusion

These limitations are disclosed and should be actively challenged during human review. They do not have equal importance.

| Unresolved input | Current evidence | What remains missing | Likely consequence if wrong |
| --- | --- | --- | --- |
| Subscription churn and cohorts | Company-selected retention uplift, country prices, consumer-subscription base rates | Gross adds, cancellations, cohort retention, plan and geography mix, partnership share of Other Revenue | Direct-revenue duration and multiple could be materially overstated |
| High-value-user durability | Regional DAU/ARPU history, age cross-sections, product-use evidence | Longitudinal age and geography cohorts; monetization by cohort | North America and Europe may weaken before global DAU reveals the problem |
| Regional contribution profit | Q2-reconciled yield/cost allocation and 2,673-case sensitivity grid | Company-reported regional cloud, moderation, support, content, payment, and sales costs | Regional signs/order are more reliable than the precise Rest-of-World margin |
| Advertising-yield persistence | Approximately +10% Q2 price, lower-funnel issuer metrics, agency and vendor benchmarks | Q3 price and impressions, regional price/volume, advertiser cohort spend retention, larger-budget incremental returns | The base advertising path fails if price repair reverses as volume returns |
| Specs economics | Price, deposit, launch scope, cumulative research spending, spending estimate and breakeven thresholds | Orders, conversion, bill of materials, manufacturing commitments, returns, gross margin, support and outside capital | Capital consumption could exceed the modeled envelope and impair the multiple |
| Legal remedies and insurance | Known proceedings, jurisdictional cases, selected settlement terms and central allowances | Confidential bellwether terms, scalable settlement framework, final coverage rulings, product-remedy scope | A structural remedy can produce value below the $2.50 modeled bear |
| Point-in-time expectations | Guidance history, reverse valuation and current peer multiples | Lawful frozen consensus distribution, revisions, options-implied comparator and expected QQQ return | The report can estimate value but cannot fully prove variant perception or benchmark-relative attractiveness |

## Valuation and calibration limitations

### Scenario probabilities are judgments

The 25% bear / 55% base / 20% bull weights are explicitly analyst judgments, not frequencies learned from a defensible reference class. The Q2 advertising-price disclosure justifies moving weight from bear to base directionally, but it does not calibrate the exact five-point shift. During review, treat $7.74 as a structured decision aid and inspect the full distribution and sensitivities instead of accepting its displayed precision.

### The legal and product tail is not a fourth modeled state

The $2.50 bear includes distress, dilution, weak advertising, and substantial legal/cost pressure. The report nevertheless acknowledges that an intrusive product remedy, uninsured settlement cycle, or unbounded hardware commitment can produce a value below $2.50. That discontinuous tail is disclosed but is not assigned a separate probability/value state. A reviewer who believes this tail is more than low-single-digit should reduce expected value or add a fourth scenario.

### The three methods are cross-checks, not independent experiments

Revenue multiple, sum of the parts, and discounted cash flow share revenue, margin, dilution, net-debt, and terminal assumptions. Agreement among them is useful arithmetic reconciliation, but it is not three independent confirmations. Peer multiples are anchors, not a growth/margin/dilution regression, and the adopted targets remain analyst judgments inside their cross-check ranges.

### Correlated evidence can look stronger than it is

Reported advertising revenue, issuer lower-funnel metrics, advertiser growth, vendor incrementality studies, price repair, and recommendation improvements overlap causally. Workforce scale, production-paper authorship, and shipped models also overlap. The report narratively controls some double-counting, but the repository lacks a machine-readable evidence-dependency graph.

### No frozen company fact-and-claim snapshot yet exists

The source log is strong, but Snap does not yet instantiate a schema-backed file that binds each material claim and model input to a frozen fact, source ID, known-at time, transformation, and report location. The deterministic verifiers reproduce arithmetic from hard-coded values; they do not yet prove source-to-fact-to-model-to-report parity.

## Harness audit

### Correct lifecycle, incomplete enforcement

The repository now has the right human contract:

1. One canonical report, valuation, and decision per active coverage cycle.
2. Those files evolve in place while the cycle is a draft.
3. Same-cycle working drafts remain only in Git history and are never reader-facing comparison records.
4. Finalized or prospectively registered cycles are immutable.
5. A material revaluation starts a new ISO-week cycle and compares only with a prior finalized cycle.

The remaining risk is that this policy is convention rather than a fully executable state machine. Existing validation does not yet reject two reports for one cycle, a same-cycle `supersedes` link, a landing page pointing to an obsolete draft, or mutation of a finalized artifact.

### Highest-priority missing controls

| Priority | Capability | Acceptance test |
| --- | --- | --- |
| P0 | Coverage-cycle schema and validator | Fails duplicate report/valuation/decision records, missing paths, mismatched cycle IDs, same-cycle supersession, obsolete navigation, and mutation of finalized hashes |
| P0 | Frozen fact and claim layer | Every material model input carries source ID, period, units, known-at time, transformation, rights class, verification status, and report/valuation destinations |
| P0 | Source-to-model-to-report parity | A changed input causes verifier failure until the model output, valuation table, report summary, and decision record agree |
| P0 | Reproducible price and benchmark snapshot | Official close, QQQ close, timestamps, adjustment rule, and hashes are frozen before prospective registration |
| P1 | End-to-end dossier release command | Runs identity, cutoff, provenance, links, arithmetic, canonical-cardinality, contradiction, public-safety, and publication-state checks together |
| P1 | Independent-review binding | Review records exact fact, model, report, valuation, and decision hashes so a later edit invalidates the approval |
| P1 | Browser research receipts | Gemini, Revelio, YouTube, and similar jobs retain local-only prompt/filter/cutoff/route/completion receipts and fail visibly on sign-out or user-interface drift |
| P1 | Evidence-dependency representation | Flags correlated claims so one mechanism is not counted as several independent confirmations |
| P1 | Reference-class probability worksheet | Requires a named base rate, adjustment logic, range, and calibration caveat before publishing scenario probabilities |
| P2 | Retrospective-to-regression loop | Every escaped factual, arithmetic, lifecycle, or provenance defect becomes a fixture or rule after review |
| P2 | Company scorecard and calibration history | Tracks target returns, benchmark returns, scenario coverage, thesis outcomes, and confidence calibration without rewriting old records |

### Tool and source routing

The current routing is broadly correct and should be preserved:

```text
official API / filing / regulator / issuer source
                      ↓
reproducible CLI or provider connector where available
                      ↓
authenticated Chrome for signed-in Gemini, Revelio, YouTube,
FT discovery, SemiAnalysis, and other rights-permitted services
                      ↓
public Browser or web search for discovery and corroboration
                      ↓
Computer Use only for visible UI the other surfaces cannot operate
                      ↓
local-only capture when rights require it
                      ↓
verified source record → fact/claim → model → report
```

New integrations should be added only for a named gap. The Snap work did not reveal a need for another generic research skill: existing Gemini, Revelio, YouTube, FT-discovery, Chrome, Computer Use, and company-research workflows were sufficient. The missing value was reconciliation and validation. Installing another broad connector would add tool sprawl unless it provides a lawful point-in-time consensus archive, official market-data snapshot, structured legal docket, or repeatable aggregate alternative-data export.

## Recommended order before the next company

1. Implement the coverage-cycle schema and canonical-cardinality validator.
2. Add one representative Snap fact/claim fixture and source-to-model-to-report parity test.
3. Add official security/benchmark close capture and freeze rules.
4. Bind independent review to hashes and expose one end-to-end release command.
5. Turn the Q2-price contradiction and formal-stance contradiction into semantic validation fixtures.
6. Add a reference-class probability worksheet and explicit discontinuous-tail check.
7. Add durable local-only browser receipts and resumable failure states.
8. After the first outcome, publish a retrospective and convert its escaped defects into regression tests.

## Strongest counterarguments to this roadmap

- A full fact graph and state machine can slow exploratory research. The answer is to require them at publication, not at every scratch-note stage.
- More validators can create false confidence. They prove consistency and provenance, not that operating assumptions are correct; human adversarial review remains essential.
- Reference classes may be too heterogeneous for a company like Snap. In that case probabilities should remain broad judgment ranges and the report should emphasize scenario sensitivities rather than manufacture precision.
- Alternative data can be expensive, modeled, stale, and difficult to redistribute. It should be used only when it changes a named valuation input and its limitations survive into the report.
- A fourth tail state may imply more knowledge than exists. The minimum requirement is to disclose that the three-state expected value truncates the tail and show how conclusions change under reviewer-supplied tail assumptions.

## How to evaluate the Snap work

Read the [company landing page](../companies/snap/README.md) first, then the [canonical report](../companies/snap/thesis/2026-W34-final-report.md). Challenge the operating assumptions in the [forecast](../companies/snap/research/2026-W34-quarterly-forecast.md), the valuation and sensitivities in the [valuation](../companies/snap/valuation/2026-W34-valuation.md), and the stance/action distinction in the [decision](../companies/snap/decisions/2026-W34-decision.md). Use the [independent review](../companies/snap/research/2026-08-21-independent-review.md) and [source log](../companies/snap/sources.md) to audit arithmetic, provenance, and disclosed gaps. The company landing page then routes each disputed assumption to its specialist memo.

The central questions for a human reviewer are:

1. Is 13.5% next-four-quarter advertising growth reasonable after one quarter of price repair and roughly flat impressions?
2. Is 40.3% Other Revenue growth too aggressive without subscriber cohorts and partnership mix?
3. Does the base convert too much of reported savings into adjusted profit and FCF?
4. Are 1.92 billion target diluted shares and $0.45 billion target net debt plausible given awards and buybacks?
5. Are the 2.05-times adopted base revenue multiple and terminal assumptions appropriate for Snap's governance, dilution, and legal risk?
6. Should the below-bear legal/product tail receive a separate modeled probability?
7. Do the 25% / 55% / 20% weights reflect your beliefs, or only the analyst's narrative?
8. Is the estimated 3%–7% two-to-three-year recommendation uplift versus no further improvement credible—and is the $0.25 probability-weighted contribution already embedded correctly?
9. Are the regional economics useful as signs and bounds, or too assumption-sensitive to influence confidence?
10. Does hold/no-add fit the private position's loss budget even if absolute expected value is attractive?

Agreement with the $7.74 expected value is not required to judge the work successful. The standard is whether a reviewer can identify the assumptions, replace them, reproduce the arithmetic, trace the evidence, and see exactly why the conclusion changes.

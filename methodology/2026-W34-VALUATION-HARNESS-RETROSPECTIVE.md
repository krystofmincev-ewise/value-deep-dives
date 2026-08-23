---
type: research_harness_retrospective
title: "Valuation harness retrospective: linked horizons and review freshness"
as_of: 2026-08-23
baseline_commit: aa7fd525c2a4fa065dcf80fc5700e95ae6ffae52
scope: [agent-rules, skills, valuation, horizons, review, schemas, validators, tests]
status: complete
---

# Valuation harness retrospective — 2026-W34

## Outcome

The linked SNAP valuation is now protected by a machine-readable horizon
contract and three reconciliation layers:

1. the executable model must agree with the contract;
2. the coverage-cycle validator must reconcile the contract with the canonical
   report, valuation, and decision; and
3. any positive review claim must bind the reviewed artifacts, contract, model,
   verifier, and review hashes.

The earlier independent SNAP review predates the joint-horizon extension. It is
therefore marked `stale`, not silently treated as current. The model remains a
verified draft; a fresh independent review is required before readiness or
publication.

## Scope reviewed

The audit covered:

- `AGENTS.md`, all nine repository-local skills, their OpenAI interfaces, and
  the valuation/probability references used by the company, event, biopharma,
  and forecast-evaluation workflows;
- the research standards, investment process, valuation framework, capability
  architecture, prior post-SNAP audit, publication rules, and sector playbooks;
- every company-cycle, report, valuation, decision, review, research-plan,
  retrospective, source, fact, and event template relevant to valuation work;
- the coverage-cycle and research validators, schema inventory, test fixtures,
  package release gate, and SNAP model/verifier tests; and
- the Git sequence from the initial SNAP dossier through scenario-weight
  removal, distributional valuation, lifecycle enforcement, and the linked
  six-/twelve-month correction.

Provider routing, authentication, source rights, and public-data controls were
also checked for conflicts. They were not the cause of this valuation escape and
remain appropriately separated from model judgment.

## What went wrong

### 1. A correct probability fix created a horizon regression

Before commit `34db16a`, the report displayed hand-weighted six- and
twelve-month scenario values. That probability method was not defensible: the
three paths were neither exhaustive conditional-mean buckets nor estimated from
a reference class.

Commit `34db16a` correctly retired those weights and built a full twelve-month
distribution. It then preserved the old four-column layout by changing the
headers to `Downside / P10`, `Central / P50`, and `Upside / P90`. The six-month
row still contained the old deterministic scenario values and put `Not modeled`
under `Mean`.

This was two errors at once:

- deterministic narratives were relabeled as percentiles without being derived
  from a distribution; and
- a row presented inside a distribution table was incomplete.

The arithmetic tests passed because they still reconstructed the old scenario
anchors. No test asked whether the table's statistical meaning was true.

### 2. Fair value was confused with market-price convergence

The report explained the missing six-month output by saying the model did not
estimate six-month price convergence. But the twelve-month output was a
fair-value distribution, not a target-date market-price distribution. A model
can estimate fair value at six months without claiming the market price will
converge to it.

The harness already said these quantities were different, but it did not force
the analyst to declare the quantity once and carry it through every horizon.

### 3. A later endpoint was treated as if it contained the earlier path

A twelve-month marginal distribution does not determine a six-month marginal
distribution or the transition between them. The original fix modeled only the
endpoint while the decision still relied on the six-month checkpoint.

The corrected model now carries shared operating, valuation, capital, dilution,
and legal states through both dates, adds checkpoint-specific shocks, reports
0.81 fair-value correlation, shows conditional twelve-month outcomes by
six-month band, and stresses linkage strength. Those are assumptions, not
observed transition frequencies, but they make the connection explicit.

### 4. The validator checked lifecycle metadata, not valuation meaning

The coverage-cycle validator was strong on cardinality, paths, IDs, cutoffs,
links, supersession, and finalized hashes. It could not answer:

- What quantity is modeled?
- Which horizons are modeled?
- Is every horizon complete?
- Are the numbers scenarios, percentiles, or conditional bucket means?
- Are multiple horizons joint or independent?
- Do the model, valuation, report, and decision show the same outputs?

That gap allowed all repository tests to pass while the headline table was
conceptually inconsistent.

### 5. Review freshness existed only at finalization

Finalized cycles already froze report, valuation, decision, and review hashes.
SNAP remained an active draft, so a material model change could be made after an
independent review without automatically invalidating the review claim.

The review memo was then edited to mention later model results. Updating an old
approval is not the same as independently reviewing the changed artifact set.
The shared `method_reviewed_at: 2026-08-23` date also could not establish which
model version had been reviewed.

### 6. The same unsupported weighting survived in peer diagnostics

The Meta and Reddit comparison memo continued to calculate hand-weighted point
values from uncalibrated scenario weights and then infer fairly-valued or
neutral/attractive conclusions. The memo disclosed that the estimates were
uncalibrated, but the arithmetic still invited an expected-value interpretation.

Those peer cases are now unweighted ranges with central narratives. They may
anchor relative multiples, but they no longer claim a distribution mean or
stance.

## Why the existing rules were insufficient

The prose was directionally good. It already prohibited weighting P10/P50/P90,
required full-distribution summaries, distinguished fair value from price and
return, and warned against double-counting risks. The failure came from missing
composition rules:

- no per-horizon completeness requirement;
- no required multi-horizon relationship type;
- no canonical machine-readable output record;
- no semantic guard against mixed scenario/percentile headings;
- no model-to-contract-to-document parity check; and
- no draft-stage review-freshness state.

The lesson is not to add more broad research prose. The lesson is to turn the
few critical invariants into one reusable contract and executable checks.

## Controls implemented

| Failure class | Preventive control | Executable evidence |
| --- | --- | --- |
| Quantity conflation | `valuation_quantity` is declared once; fair value per share, intrinsic value per share, and target-date market price are distinct contract enums, while security-return quantities remain in prospective forecast records | Contract validator and canonical alignment checks |
| Incomplete modeled horizon | Every distribution horizon requires P10, P50, P90, mean, reference/downside probabilities, and bottom-decile expected value | JSON schema, custom validator, negative fixture |
| Narrative points relabeled as percentiles | Canonical table headers cannot combine bear/base/bull or downside/central/upside with P10/P50/P90 | Semantic table validator and regression fixture |
| `Not modeled` inside a distribution table | Distribution tables reject an unmodeled output row | Semantic table validator and regression fixture |
| Undefined multi-horizon path | More than one horizon must be `joint` or explicitly `independent`; joint models require linkage, correlation, transition bands, and sensitivity | Contract validator and negative fixture |
| Risk counted twice across dates | Rules require per-horizon reconciliation of embedded allowances before shared tail branches | Agent rule, skill, valuation framework, and SNAP verifier assertions |
| Model/document drift | SNAP verifier compares executable results with the JSON contract; repository validator compares contract with report, valuation, and decision metadata and links | Distribution verifier plus company validator |
| Stale review presented as current | `review_status` is explicit; the review record itself must identify an independent reviewer and repeat the exact report, valuation, decision, contract, model, and verifier hashes; readiness language is rejected otherwise | Coverage-cycle and independent-review schemas, hash/parity checks, and passing-plus-mutation regression fixture |
| Unsupported peer expected values | Meta and Reddit weights and expected-value conclusions removed; ranges remain unweighted | Corrected peer memo |

## Rule placement

The prevention is deliberately layered:

- `AGENTS.md` contains only repository-wide invariants that must always apply.
- `$company-investment-research` explains the workflow and routes analysts to
  the detailed valuation reference.
- `decision-and-valuation.md` and `VALUATION_FRAMEWORK.md` contain the joint
  horizon, quantity, overlap, and publication details.
- templates make the correct separation the default layout.
- schemas and validators enforce the parts that can be deterministic.
- company verifiers prove exact model/output parity.

No new overlapping research skill or plugin was added. The failure was not a
missing source connector; it was a missing valuation contract and release gate.

## What remains intentionally unresolved

This hardening proves consistency, not truth. It does not establish that SNAP's
elicited marginals, legal-state weights, rank correlations, or transition
coefficients are empirically calibrated. It also does not yet provide:

- a full source-to-fact-to-model claim graph for every material input;
- a lawful reproducible official-close and QQQ benchmark snapshot for a
  prospectively scored return forecast;
- an empirical multi-company reference class for valuation distributions;
- a pairwise-transition schema for three or more formal horizons—schema v1
  fails closed at two rather than assigning one ambiguous aggregate
  dependence; or
- a current independent review of the joint-horizon SNAP model.

Those gaps must remain visible. Validators should never be described as proof
that the economic assumptions are correct.

## Acceptance standard for the next company

A future dossier fails the release gate if any of the following is true:

1. a numeric horizon lacks a complete contract;
2. scenario narratives and percentile labels share a table heading;
3. multiple horizons lack an explicit joint or independent relationship;
4. a joint model lacks transition and linkage sensitivity diagnostics;
5. model outputs, the contract, valuation, report, or decision disagree;
6. a shared tail risk is layered onto an anchor without overlap reconciliation;
7. the current artifact set differs from the passed review snapshot; or
8. readiness or publication is claimed while review status is not `passed`.

The standard remains auditable judgment: a reviewer must be able to identify the
quantity, replace the assumptions, reproduce each horizon, trace the transition,
and see exactly why the decision changes.

# Harness options for research and publication

Reviewed **2026-10-18**. Decision: improve the repository's existing evidence and editorial workflow first. Adapt Harness²'s controlled comparisons and evidence-backed lessons; do not add its runtime as a dependency now. Promptfoo remains a possible evaluation runner once repeated comparisons justify it.

This is a source and implementation review, not a live performance experiment. No external package was installed, no model API was called, and no project files or private research were uploaded. No claim of improved reader outcomes follows from this review.

## The problem to solve

The desired result is an article that teaches a reader something consequential, supports its distinctive argument with deep research, and remains easy to follow. The success measure is an accepted article with fewer substantial human corrections. A longer prompt, more reviewers, or a higher automated score is not that outcome.

The inspected baseline is repository commit `6585ef75a310c3b6587ab00e69d5cba58c83122a`. Its Node package declares `>=22` and has no third-party dependencies. Neither Harness² nor Promptfoo is declared. Existing [research validation](../scripts/research-validate.mjs), [coverage-cycle verification](../scripts/lib/company-cycle.mjs), [research standards](RESEARCH_STANDARDS.md), and [publishing guidance](SUBSTACK_PUBLISHING.md) already cover substantial mechanical and evidence duties. The [valuation retrospective](2026-W34-VALUATION-HARNESS-RETROSPECTIVE.md) documents why passing arithmetic checks did not establish that a table's statistical meaning was correct.

That distinction should govern the next improvement: mechanical checks catch specified errors; a source-aware reviewer assesses whether the argument is true, useful, complete, and understandable. Neither substitutes for the other.

## Options and decision

| Option | Useful contribution | Burden or remaining uncertainty | Decision |
|---|---|---|---|
| Existing Node checks plus a bounded, evidence-grounded editorial comparison | Preserves the current model, tools, source policy, review hashes, and deterministic calculations. Can compare article structures using the same evidence and reader question. | Requires good examples and judgment. A checklist alone cannot establish insight, compelling prose, or reader value. | **Adopt first.** Improve the inputs and acceptance evidence around the current workflow. |
| Promptfoo | Declarative assertions and repeatable comparison/reporting around an agent or prepared outputs. | Adds package/configuration maintenance and provider routing if model grading is used. Does not supply a trustworthy editorial rubric or new research. | **Defer installation.** Revisit when manually repeating the same evaluation matrix becomes the bottleneck. |
| Harness² runtime | Executes alternative harnesses, composes changes from behavioral contrasts, and retains conditional lessons. | Benchmark-oriented runtime, substantial repeated execution, integration work for this workflow, and unsafe-for-this-project defaults discussed below. No demonstrated transfer to these articles. | **Do not adopt wholesale.** Retain selected experimental ideas. |

### What Harness² actually establishes

The paper evaluates harness refinement on professional-work, legal, and office/web/code benchmarks with fixed executor models. Its contrasts help diagnose behavior but do not prove correctness or transfer to a new task. Shared model biases and extra inference cost remain acknowledged limitations. It contains no evaluation of this publication's reader value, investment insight, or the current session-selected model and workflow. Treat benchmark gains as motivation to test a method, not a forecast of better articles. [Paper, version 1](https://arxiv.org/html/2610.14224v1)

The reviewed upstream revision is [`1cfe254e8d25b15f37048c3730134686abe60335`](https://github.com/google-research/harness2/commit/1cfe254e8d25b15f37048c3730134686abe60335), dated 2026-10-14; its package declares version `0.1.0`, Python `>=3.12,<3.14`, and Apache-2.0. Benchmark runners and datasets retain their own terms. No source code was copied into this repository. [Package manifest](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/pyproject.toml), [license](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/LICENSE), [third-party notices](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/third_party/README.md)

Three implementation details matter more than the headline benchmark scores:

1. **The final selector cannot choose the original reference output.** `selection_pool` includes only composed finals; its baseline argument is deliberately unused. Composition can preserve a harness, but that does not preserve an earlier article as a selectable deliverable. Our comparisons must allow the original to win, a tie, or no acceptable candidate. [Selection implementation](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/harness2/core/selection.py#L86)
2. **One refinement step is multiple task executions.** The core schedules `4k` rollouts and `3k` improvement stages, before additional reflection, selection where applicable, or separate judging. At `k=1`, four full research executions could repeat expensive source discovery. For an editorial change, freeze the evidence pack and compare only the disputed writing stage. That cost reduction is our proposed adaptation, not a measured result. [Recursion implementation](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/harness2/core/recursion.py#L15)
3. **A retained lesson needs a situation, lesson, and supporting evidence.** The library rejects an entry without those fields and organizes experience by domain. This is useful: retain a narrow finding such as “this opening hid the payoff until after the valuation apparatus,” with its before/after evidence. Do not turn every preference into a global rule. [Library implementation](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/harness2/core/library.py)

### Operational and security boundaries

Harness²'s documented benchmark route expects Linux, Python, Node, cloud-model configuration, and benchmark-specific tools. WorkBuddy requires Docker. Its Codex executor uses a configured Responses endpoint; the supplied Vertex bridge is separate infrastructure, not evidence that the current desktop subscription and authenticated browser research will work unchanged. [Setup guide](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/docs/SETUP.md)

The Codex command explicitly bypasses approvals, sandboxing, and hook trust. These are source-verified defaults, not a finding that the repository is malicious. They make direct execution against a personal research checkout inappropriate without an independently designed isolation boundary. The source review is sufficient to reject that deployment for now; a benchmark installation would not resolve the editorial question. [Executor implementation](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/harness2/substrate/codex.py#L150)

Upstream also reports that a validation rollout retrieved its public grading rubric. Network access is unrestricted unless the operator constrains it. A shuffled task seed does not fix model sampling, and failed evaluations remain unscored. Any future benchmark comparison therefore needs protected answer material, recorded access restrictions, complete attempted-task denominators, and separate infrastructure failures. [Experiment guide](https://github.com/google-research/harness2/blob/1cfe254e8d25b15f37048c3730134686abe60335/docs/EXPERIMENTS.md)

For this project, safety and source rights remain outside the optimizer's authority. Candidate edits may improve a task brief, research question, explanation, or review prompt. They may not weaken data policy, change authentication or publication permissions, modify a valuation to satisfy a judge, or rewrite the acceptance criteria after seeing results. Full task trajectories can contain restricted source material and private context; reusable lessons must be sanitized original analysis.

### Where Promptfoo could help later

The reviewed Promptfoo revision is [`ea8b3d073a63769f7be243ac3c3460f72881a930`](https://github.com/promptfoo/promptfoo/commit/ea8b3d073a63769f7be243ac3c3460f72881a930), dated 2026-10-17. Its manifest declares `0.124.1`, MIT, and Node `>=22.22.0`; the repository's broader `>=22` declaration does not establish that runtime compatibility. [Manifest](https://github.com/promptfoo/promptfoo/blob/ea8b3d073a63769f7be243ac3c3460f72881a930/package.json), [license](https://github.com/promptfoo/promptfoo/blob/ea8b3d073a63769f7be243ac3c3460f72881a930/LICENSE)

Its assertions can combine deterministic checks with model-assisted judgments. A test-level aggregate threshold can allow an individual failure to be outweighed, so factual, privacy, and numerical failures should remain independent hard failures. Prose quality can be compared separately. Merely wrapping our current checks would not improve them. [Assertions documentation](https://www.promptfoo.dev/docs/configuration/expected-outputs/)

Default usage telemetry is enabled; the official setting `PROMPTFOO_DISABLE_TELEMETRY=1` disables it. Model-based judgments still send their configured inputs to the selected provider. A future pilot would need pinned dependencies, local ignored results, inspected data routing, and an explicit call budget. No hosted sharing or provider migration is needed to conduct the proposed manual comparison. [Telemetry documentation](https://www.promptfoo.dev/docs/configuration/telemetry/), [model-graded metrics](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/)

## The smallest useful experiment

This proposed protocol can use the current agent workflow; it does not require a new framework or continuous automatic loop.

1. Select one actual article failure and state the reader consequence. Example: a reader can repeat the valuation number but cannot explain the mechanism that makes it plausible. Preserve the existing draft, source cutoff, model outputs, and human feedback locally.
2. Choose one intervention at the earliest failed stage. If the distinctive insight lacks evidence, research the missing question. If evidence exists but the article obscures it, change the argument or explanation. Do not rewrite a whole article to repair one unsupported claim.
3. Compare the baseline and one candidate using the same reader brief, evidence set, model/effort, and available tools. When research changes, record that separately so better evidence is not mislabeled as a better prose prompt.
4. Run numerical and provenance checks first. Then review complete outputs in anonymized order, requiring passage-level reasons for preference. Compare clarity, causal reasoning, distinctive supported insight, treatment of the strongest objection, and coverage of questions that change the conclusion. Exhaustiveness means covering those questions; word count is not its proxy.
5. Keep the baseline if the candidate does not clearly improve the target defect without regressions. Stop when remaining changes are matters of taste or repeated rewrites do not produce new evidence. The human's acceptance remains the outcome; agent preference is supporting evidence.
6. Store a compact result: observed defect, candidate change, fixed inputs, output hashes, passage-level comparison, known tradeoffs, elapsed time, substantial corrections required, and decision. Retain a lesson only with a concrete applicability condition. Test a promising lesson on the next materially different article before treating it as a general improvement.

No finite writing evaluation proves novel investment insight. A reviewer should trace the supposedly new conclusion through its source evidence, original calculation or comparison, causal mechanism, and consequence for the reader. If that chain is absent, the remedy is research or a narrower claim.

## Adoption boundary and reconsideration

Adopt the bounded comparison and conditional lesson format in existing project guidance. Keep deterministic finance verification authoritative for its defined contracts, and use source-aware judgment for interpretation and writing. Do not add a permanent reviewer council, automatic rewrite loop, numerical “engagement” target, or new runtime in response to one failed article.

Revisit Promptfoo when there is a stable set of representative owned examples and an actual need to repeat comparisons. Revisit Harness² only if controlled manual changes plateau, runtime integration becomes the demonstrated constraint, and a small isolated trial can test transfer without changing model choice, permissions, source rights, or provider-spend boundaries. Until then, the missing proof is improvement on our work, not another framework's benchmark result.

## Source and verification record

All external sources below were accessed on **2026-10-18** through public web retrieval or the unauthenticated GitHub API/raw-file endpoint. No account data was accessed. Full external source copies were not saved in the repository; capture consists of citations and this original analysis. Code behavior is verified by inspection at the pinned revision, not by execution.

| Source / publisher | Publication or version date | Evidence / access / rights | Intended use and verification |
|---|---|---|---|
| [Harness² paper v1](https://arxiv.org/html/2610.14224v1), authors via arXiv | 2026-10-09 | Research preprint; public; CC BY 4.0 shown on paper | Scope and limitations inspected; results not independently reproduced. |
| [Harness² repository](https://github.com/google-research/harness2/tree/1cfe254e8d25b15f37048c3730134686abe60335), Google Research | Reviewed revision 2026-10-14 | Source/docs; public; Apache-2.0, third-party terms separate | Manifest/license, setup/experiment docs, selection, recursion, library and executor source inspected. Exact files linked beside claims. |
| [Promptfoo repository](https://github.com/promptfoo/promptfoo/tree/ea8b3d073a63769f7be243ac3c3460f72881a930), Promptfoo | Reviewed revision 2026-10-17 | Source; public; MIT | Manifest/version/runtime requirement and license inspected. No installation or vulnerability audit. |
| [Promptfoo assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/), Promptfoo | Living documentation; accessed 2026-10-18 | Provider documentation; public; link-only | Assertion types and aggregate-threshold semantics checked against official docs. |
| [Promptfoo telemetry](https://www.promptfoo.dev/docs/configuration/telemetry/), Promptfoo | Page shows updated 2026-10-17 | Provider documentation; public; link-only | Default collection and documented disable setting checked. |
| [Promptfoo model grading](https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/), Promptfoo | Living documentation; accessed 2026-10-18 | Provider documentation; public; link-only | Provider-backed judging confirmed; no live provider behavior tested. |

AI assistance: Codex, session-selected model and effort unchanged, 2026-10-18; task was source inspection and options synthesis. Exact model identifier was not exposed to this review. Primary-source statements were checked at the cited documents and revisions; recommendations are author judgments. The subsequent bounded editorial pilot is documented in the [audit record](2026-10-18-HARNESS-AUDIT.md); neither external runtime was executed. Confidence is high in the inspected implementation facts and medium in the preferred adoption path pending article-level evidence.

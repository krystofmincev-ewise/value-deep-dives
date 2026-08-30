---
name: ai-capability-investment-research
description: "Translate current AI-model, coding-agent, inference-cost, and compute-supply evidence into auditable investment implications for software, internet, cloud, and semiconductor companies. Use when a thesis depends on how quickly AI capability or cost may change over the next 6–24 months; do not use benchmark scores as direct revenue forecasts."
---

# AI capability investment research

Build a dated capability-and-cost evidence pack, then map it to the specific economic layer exposed by the company. The output should help an investment model without pretending that novel AI outcomes have a calibrated historical base rate.

## Define the investment transmission first

Name the company, horizon, threatened or enabled workflow, and observable financial variable. Decompose the workflow into creation, deployment, integration, security/compliance, migration, maintenance, support, and ongoing business operation. State which layers improving models can plausibly replace, complement, or leave unchanged.

Do not begin from “models are improving, therefore revenue falls.” Record the causal chain and the evidence that would break it.

## Build a point-in-time evidence pack

Prefer, in order:

1. official model system cards, technical reports, papers, repositories, API documentation, and dated pricing;
2. reproducible independent evaluations with task-level methodology;
3. official infrastructure disclosures, MLPerf or documented public benchmark APIs;
4. targeted SemiAnalysis or other licensed analysis through the authorized signed-in browser; and
5. expert interviews as qualitative evidence.

For dynamic benchmark pages, record the access date, benchmark/version, agent harness, model variant, reasoning setting, task count, attempts, pass metric, cost basis, execution time, and known contamination or reward-hacking controls. A model name without the harness and evaluation version is not a comparable observation.

Use the signed-in Chrome workflow for subscription articles and YouTube. Use documented public APIs for structured benchmark data when available. Do not scrape paid pages, export browser state, bulk-download videos, or commit licensed prose/tables.

Read [the evidence contract](references/evidence-contract.md) when producing a formal memo or valuation input set.

## Separate four claims

For each important source, distinguish:

- **capability:** success on a defined task under a defined harness;
- **reliability:** repeat success, recovery from errors, and long-horizon completion;
- **economics:** tokens, latency, retries, hosting, support, and price per successful outcome; and
- **availability:** whether the weights/API/product can actually be used at the required scale, licence, geography, privacy, and control level.

Self-reported benchmark gains can support direction but not an absolute production-success probability. Open weights can reduce vendor rent without making serving, evaluation, security, or product integration free.

## Translate evidence into model inputs

Map evidence only to variables it can support, such as:

- probability that the creation layer commoditizes;
- end-to-end production completion conditional on the number and dependence of critical steps;
- inference cost per successful task after retries rather than list price per token;
- gross-margin range for an AI-native product;
- migration friction and installed-base decay;
- incremental engineering/support productivity; or
- vendor concentration and multi-model routing leverage.

Label each input `measured`, `derived`, `cross-sectional`, or `elicited`. Preserve the measured observation separately from the valuation adjustment. When no relevant reference class exists, use bounded sensitivities and keep the model `uncalibrated_shadow` or `structured_elicitation`; Monte Carlo repetition does not create calibration.

## Challenge the mapping

Test at least these failure modes:

- benchmark contamination, task selection, version drift, harness effects, and pass@k/pass@1 confusion;
- successful code generation that fails deployment, security, maintenance, or business acceptance;
- cheaper tokens offset by longer trajectories, parallel agents, retries, or greater usage;
- a model supplier vertically integrating into the application layer;
- falling model cost helping the incumbent as much as the disruptor; and
- capability diffusion that commoditizes the challenger rather than the incumbent.

## Return

Produce a compact source table, dated capability frontier, cost/reliability ranges, company-layer map, bull/bear implications, valuation-input recommendations, rejected inputs, falsifiers, and next measurement dates. Cite underlying sources close to claims and update the company source log with access, rights, retrieval and verification metadata.

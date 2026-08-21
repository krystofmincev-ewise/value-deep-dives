---
type: experiment
title: Snap ad-ranking feasibility
status: scoped
as_of: 2026-08-17
related_companies: [SNAP, META]
data_cutoff: null
runtime: not_selected
tags: [ad-tech, ranking, recommendation-systems, machine-learning]
---

# Ad-ranking feasibility

> **Reader key:** This experiment is scoped, not yet implemented. Advertising and model terminology is defined in the [Snap glossary](../../GLOSSARY.md).

## Investment question

Which parts of a modern advertising recommendation and ranking system can a smaller platform reproduce with competent engineering, and which advantages depend on proprietary scale, data, auction liquidity, measurement, distribution, or organization?

This experiment is connected to the Snap thesis, but its result will be one piece of evidence—not a standalone investment conclusion.

## Technical hypothesis

A small, reproducible ranking pipeline may demonstrate the mechanics and marginal value of candidate generation, representation learning, ranking, calibration, and feedback. It cannot reproduce the conditions under which Meta or Snap operates without comparable users, advertisers, conversions, creative inventory, auctions, privacy constraints, and production feedback loops.

## Status

Scoped only. A 21 August 2026 [open-source recommender review](../../research/2026-08-21-open-source-recommender-gap.md) identified suitable public datasets and a more decision-relevant design, but no data have been downloaded and no result has been generated. Dataset version, license, split, metrics, compute budget, and acceptance criteria must still be pre-registered before implementation.

## Candidate public datasets

The primary candidate is the [Tencent Advertising Algorithm Challenge 2025](https://arxiv.org/abs/2604.04976), which publishes de-identified multimodal user/ad sequences, conversion tasks, an evaluation protocol, and [baseline code](https://github.com/TencentAdvertisingAlgorithmCompetition/baseline_2025). It is the closest public analogue to the advertising question, but it is still a bounded historical sample rather than a live auction.

The secondary candidates are Kuaishou's [KuaiRand](https://arxiv.org/abs/2208.08696), which includes randomly exposed interactions useful for selection-bias tests, and [KuaiRec](https://arxiv.org/abs/2202.10842), which provides relatively complete user-item observations. They are better suited to content recommendation and counterfactual-bias tests than purchase-auction economics.

No dataset should be selected until its current license, hosting terms, schema, size, and redistribution boundary have been recorded in a manifest.

## Proposed experiment shape

1. Pre-register one primary dataset, a fixed chronological train/validation/test split, and untouched holdout.
2. Compare a popularity baseline, a two-tower retrieval model, a standard multi-task or sequence ranker, and one available semantic-ID or generative model.
3. Train each model on fixed fractions of the available interactions to estimate a quality-versus-data curve.
4. Remove or delay conversion labels and measure the change in ranking and calibration.
5. Hold out users, items, and advertisements to test cold start with and without public language/vision content embeddings.
6. Give models the same inference-latency and training-compute budget; include a distilled or quantized variant where feasible.
7. Evaluate ranking quality, calibration, diversity, data efficiency, latency, and robustness separately.
8. Repeat across fixed seeds, publish uncertainty, retain negative results, and translate only mechanism-level findings to the thesis.

### Metrics to pre-register

- retrieval Recall@K and NDCG@K;
- ranking log loss and area under the receiver-operating-characteristic curve, where the task supports them;
- expected calibration error and reliability plots;
- cold-start and delayed-label degradation relative to the full-signal case;
- quality at fixed training tokens, accelerator time, model size, and serving latency;
- diversity/coverage and performance under distribution shift.

Offline lift will not be presented as revenue lift. Small changes in AUC or NDCG can matter at industrial scale, but the experiment has no valid conversion from an offline metric to Snap revenue.

## Pre-registered decision tests

The implementation should be designed to reject as well as support the investment mechanism.

- **Support for open-source leverage:** a public pretrained content representation or modern sequence/generative model preserves a meaningful portion of full-data quality when interactions are sparse, especially in cold start, without violating the fixed latency budget.
- **Support for the data-moat countercase:** performance deteriorates steeply with fewer or delayed proprietary labels, and architectural complexity cannot recover the loss within the fixed compute budget.
- **Mixed result:** public models improve retrieval or content cold start while calibrated conversion prediction remains label-limited. This is the current underwriting base case.

## What could inform the thesis

- How rapidly ranking quality improves with additional interaction data
- Which gains come from modeling versus simply increasing data coverage
- Sensitivity to delayed, missing, or privacy-restricted conversion signals
- Cold-start performance for new users, advertisers, and creative
- Compute, serving, and latency tradeoffs visible at prototype scale

## What this cannot establish

- Snap's access to data or internal model quality
- Meta's proprietary architecture or actual advantage
- Real-world advertiser return on ad spend or incrementality
- Auction density, bid optimization, budget pacing, fraud, brand safety, or measurement quality at production scale
- Organizational ability to recruit, ship, iterate, and integrate the full advertising stack
- A causal link from an offline metric to Snap's revenue, margin, moat, or target price

## Reproducibility gate

Before implementation, add:

- exact runtime and locked dependencies;
- dataset manifest, license, cutoff, build/download instructions, and checksum where useful;
- fixed train/validation/test rules and random seeds;
- predeclared baselines, metrics, and acceptance criteria;
- commands for training, evaluation, and tests;
- a results log that retains negative outcomes.

Use the root [experiment template](../../../../templates/experiment-readme.md) if this scope becomes an implementation. Follow the [data policy](../../../../DATA_POLICY.md).

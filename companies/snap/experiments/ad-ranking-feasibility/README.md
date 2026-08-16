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

## Investment question

Which parts of a modern advertising recommendation and ranking system can a smaller platform reproduce with competent engineering, and which advantages depend on proprietary scale, data, auction liquidity, measurement, distribution, or organization?

This experiment is connected to the Snap thesis, but its result will be one piece of evidence—not a standalone investment conclusion.

## Technical hypothesis

A small, reproducible ranking pipeline may demonstrate the mechanics and marginal value of candidate generation, representation learning, ranking, calibration, and feedback. It cannot reproduce the conditions under which Meta or Snap operates without comparable users, advertisers, conversions, creative inventory, auctions, privacy constraints, and production feedback loops.

## Status

Scoped only. No dataset, implementation, metrics, or results have been selected. Any eventual study will pre-register its dataset split, baselines, metrics, and acceptance criteria before results are evaluated.

## Proposed experiment shape

1. Select a legally redistributable public dataset or construct a documented synthetic environment.
2. Define a simple popularity or heuristic baseline.
3. Add candidate retrieval and a learned ranking model.
4. Evaluate held-out ranking quality, calibration, cold-start behavior, data-efficiency, latency, and robustness.
5. Stress reduced signal, delayed conversions, distribution shift, and sparse advertiser demand.
6. Translate only mechanism-level findings back to the investment thesis.

Metrics will depend on the selected data and must be declared in advance. Offline lift will not be presented as revenue lift.

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

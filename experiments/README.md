# Cross-company experiments

This folder is for software or empirical work that genuinely supports multiple company or discovery studies. Company-specific experiments stay with the relevant dossier—for example, Snap's [ad-ranking feasibility study](../companies/snap/experiments/ad-ranking-feasibility/README.md).

Each implementation should be self-contained and include:

- the investment question and related research links;
- exact install, run, test, and reproduction commands;
- locked dependencies and runtime version;
- data provenance, license, cutoff, manifest, and seeds;
- baselines, metrics, and acceptance criteria chosen before evaluation;
- results, negative results, and limitations;
- a restrained statement of what the result changes in the investment thesis.

Do not introduce a root monorepo toolchain until several experiments truly share infrastructure. Use the [experiment template](../templates/experiment-readme.md).

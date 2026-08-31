#!/usr/bin/env node

import { runModel } from "./model-2026-W35-distribution.mjs";

const seed = 20260830;
const sampleCount = 100000;

const elicitationSets = {
  elicitation_a: {
    coreHealth: { weak: 0.25, stable: 0.55, strong: 0.2 },
    base44Adoption: { weak: 0.3, progress: 0.5, breakout: 0.2 },
    base44Economics: { weak: 0.3, adequate: 0.5, strong: 0.2 },
    agentAttachment: { adverse: 0.35, neutral: 0.5, platform: 0.15 },
  },
  elicitation_b: {
    coreHealth: { weak: 0.28, stable: 0.52, strong: 0.2 },
    base44Adoption: { weak: 0.25, progress: 0.53, breakout: 0.22 },
    base44Economics: { weak: 0.39, adequate: 0.48, strong: 0.13 },
    agentAttachment: { adverse: 0.32, neutral: 0.5, platform: 0.18 },
  },
  elicitation_c: {
    coreHealth: { weak: 0.25, stable: 0.5, strong: 0.25 },
    base44Adoption: { weak: 0.32, progress: 0.5, breakout: 0.18 },
    base44Economics: { weak: 0.35, adequate: 0.5, strong: 0.15 },
    agentAttachment: { adverse: 0.3, neutral: 0.52, platform: 0.18 },
  },
};

const boundaryCases = {
  skeptical_boundary: {
    coreHealth: { weak: 0.4, stable: 0.45, strong: 0.15 },
    base44Adoption: { weak: 0.4, progress: 0.45, breakout: 0.15 },
    base44Economics: { weak: 0.45, adequate: 0.45, strong: 0.1 },
    agentAttachment: { adverse: 0.42, neutral: 0.45, platform: 0.13 },
  },
  favorable_boundary: {
    coreHealth: { weak: 0.18, stable: 0.52, strong: 0.3 },
    base44Adoption: { weak: 0.2, progress: 0.5, breakout: 0.3 },
    base44Economics: { weak: 0.25, adequate: 0.5, strong: 0.25 },
    agentAttachment: { adverse: 0.22, neutral: 0.5, platform: 0.28 },
  },
};

const dependencyCases = {
  independent_nodes: {
    adoptionAgentLoading: 0,
    adoptionFrontierLoading: 0,
    coreAgentLoading: 0,
    coreFrontierLoading: 0,
    economicsAdoptionLoading: 0,
    economicsFrontierLoading: 0,
  },
  stronger_plausible_dependence: {
    adoptionAgentLoading: 0.65,
    adoptionFrontierLoading: 0.15,
    coreAgentLoading: 0.5,
    coreFrontierLoading: -0.2,
    economicsAdoptionLoading: 0.4,
    economicsFrontierLoading: 0.2,
  },
};

const tornadoDefinitions = {
  core_growth_200bps: { field: "coreGrowth", magnitude: 0.02 },
  core_multiple_0_5x: { field: "coreMultiple", magnitude: 0.5 },
  base44_growth_20pts: { field: "base44Growth", magnitude: 0.2 },
  base44_multiple_2x: { field: "base44Multiple", magnitude: 2 },
  base44_cost_load_10pts: { field: "base44CostLoad", magnitude: 0.1 },
  net_claims_100m: { field: "netClaims", magnitude: 0.1 },
  diluted_shares_2m: { field: "dilutedShares", magnitude: 2 },
};

function compact(output) {
  return {
    p10: output.twelveMonth.p10,
    p50: output.twelveMonth.p50,
    p90: output.twelveMonth.p90,
    mean: output.twelveMonth.mean,
    probability_below_reference: output.twelveMonth.probability_below_reference,
    probability_loss_30_pct: output.twelveMonth.probability_loss_30_pct,
  };
}

const baseOutput = runModel({ seed, sampleCount });
const base = compact(baseOutput);

const ambiguity = Object.fromEntries(
  Object.entries(elicitationSets).map(([label, causalProbabilities]) => [
    label,
    compact(runModel({ seed, sampleCount, causalProbabilities })),
  ]),
);

const probabilityBoundaries = Object.fromEntries(
  Object.entries(boundaryCases).map(([label, causalProbabilities]) => [
    label,
    compact(runModel({ seed, sampleCount, causalProbabilities })),
  ]),
);

const dependencyBoundaries = Object.fromEntries(
  Object.entries(dependencyCases).map(([label, dependencyLoadings]) => [
    label,
    compact(runModel({ seed, sampleCount, dependencyLoadings })),
  ]),
);

const tornado = Object.fromEntries(
  Object.entries(tornadoDefinitions).map(([label, { field, magnitude }]) => {
    const lower = compact(runModel({ seed, sampleCount, stresses: { [field]: -magnitude } }));
    const upper = compact(runModel({ seed, sampleCount, stresses: { [field]: magnitude } }));
    return [
      label,
      {
        lower_input_p50: lower.p50,
        upper_input_p50: upper.p50,
        lower_input_delta: lower.p50 - base.p50,
        upper_input_delta: upper.p50 - base.p50,
      },
    ];
  }),
);

const numericalSeeds = Array.from({ length: 10 }, (_, index) => 20260821 + index).map(
  (numericalSeed) => ({
    seed: numericalSeed,
    ...compact(runModel({ seed: numericalSeed, sampleCount: 50000 })),
  }),
);
const numericalStability = {
  sample_count_per_seed: 50000,
  seed_count: numericalSeeds.length,
  p50_min: Math.min(...numericalSeeds.map((result) => result.p50)),
  p50_max: Math.max(...numericalSeeds.map((result) => result.p50)),
  probability_below_reference_min: Math.min(
    ...numericalSeeds.map((result) => result.probability_below_reference),
  ),
  probability_below_reference_max: Math.max(
    ...numericalSeeds.map((result) => result.probability_below_reference),
  ),
  runs: numericalSeeds,
};

console.log(
  JSON.stringify(
    {
      semantics: {
        tornado: "common-random-number one-at-a-time stresses around the default model",
        ambiguity: "three alternative same-evidence causal-probability sets; structural ambiguity, not sampling error or independent validation",
        probability_boundaries: "deliberately skeptical and favorable probability stresses; sensitivity cases, not forecasts",
        dependency_boundaries: "independent-node and stronger-plausible-dependence stresses with unchanged marginals; sensitivity cases, not forecasts",
        numerical_stability: "Monte Carlo sampling stability only; does not validate the assumptions",
      },
      seed,
      sampleCount,
      base,
      ambiguity,
      probabilityBoundaries,
      dependencyBoundaries,
      tornado,
      numericalStability,
      varianceAttribution: baseOutput.diagnostics.variance_attribution,
    },
    null,
    2,
  ),
);

import assert from "node:assert/strict";
import test from "node:test";

import {
  computeBase44OwnerContribution,
  computeEndingNetClaims,
  enterpriseValuePerShare,
  runModel,
} from "../companies/wix/valuation/model-2026-W35-distribution.mjs";

function assertOrderedSummary(summary) {
  for (const value of Object.values(summary)) assert.ok(Number.isFinite(value));
  assert.ok(summary.p10 <= summary.p50);
  assert.ok(summary.p50 <= summary.p90);
}

function defaultProbabilities() {
  return {
    coreHealth: { weak: 0.26, stable: 0.52, strong: 0.22 },
    base44Adoption: { weak: 0.29, progress: 0.51, breakout: 0.2 },
    base44Economics: { weak: 0.35, adequate: 0.49, strong: 0.16 },
    agentAttachment: { adverse: 0.32, neutral: 0.51, platform: 0.17 },
  };
}

test("Wix v5 joint valuation is deterministic, finite, and fair-value only", () => {
  const first = runModel({ seed: 20260830, sampleCount: 5000 });
  const second = runModel({ seed: 20260830, sampleCount: 5000 });

  assert.deepEqual(first, second);
  assert.equal(first.valuationQuantity, "fair_value_per_share_at_target_date");
  assert.match(first.probabilitySemantics, /not realized security-return probability/);
  for (const horizon of [first.sixMonth, first.twelveMonth]) {
    assertOrderedSummary(horizon);
  }
  assert.ok(first.relationship.value_correlation > 0.7);
  assert.ok(first.relationship.value_correlation < 1);
});

test("declared node probabilities are realized and dependencies retain their intended order", () => {
  const output = runModel({ seed: 20260830, sampleCount: 50000 });
  for (const [node, probabilities] of Object.entries(output.causalModel.declaredProbabilities)) {
    assert.ok(Math.abs(Object.values(probabilities).reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
    const counts = output.causalModel.nodeCounts[node];
    assert.equal(Object.values(counts).reduce((sum, value) => sum + value, 0), 50000);
    for (const [state, probability] of Object.entries(probabilities)) {
      assert.ok(Math.abs(counts[state] / 50000 - probability) < 0.01);
    }
  }

  const dependencies = output.causalModel.observedOrdinalDependencies;
  assert.ok(dependencies.adoption_agent > dependencies.core_agent);
  assert.ok(dependencies.core_agent > 0.15);
  assert.ok(dependencies.adoption_economics > 0.12);
  assert.ok(dependencies.frontier_core < 0);
  assert.ok(dependencies.frontier_adoption > 0);
  assert.ok(dependencies.frontier_economics > 0);
});

test("the causal construction creates mixed paths instead of rebundling one regime", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const jointStates = output.causalModel.jointStateCounts;
  assert.ok(Object.keys(jointStates).length >= 75);
  assert.ok(
    Object.entries(jointStates).some(
      ([key, count]) => key.startsWith("weak|breakout|") && count > 0,
    ),
  );
  assert.ok(
    Object.entries(jointStates).some(
      ([key, count]) => key.startsWith("strong|weak|") && count > 0,
    ),
  );

  const conditional = output.diagnostics.twelve_month_by_causal_node;
  assert.ok(conditional.coreHealth.weak.summary.mean < conditional.coreHealth.stable.summary.mean);
  assert.ok(conditional.coreHealth.stable.summary.mean < conditional.coreHealth.strong.summary.mean);
  assert.ok(conditional.base44Adoption.weak.summary.mean < conditional.base44Adoption.progress.summary.mean);
  assert.ok(conditional.base44Adoption.progress.summary.mean < conditional.base44Adoption.breakout.summary.mean);
});

test("operating checkpoints expose ordered four, six, ten, and twelve-month distributions", () => {
  const output = runModel({ seed: 20260830, sampleCount: 10000 });
  const checkpoints = output.operatingForecasts;
  assert.match(checkpoints.semantics, /not additional fair-value horizons/);
  const expectedMonths = { fourMonth: 4, sixMonth: 6, tenMonth: 10, twelveMonth: 12 };
  for (const [name, months] of Object.entries(expectedMonths)) {
    const checkpoint = checkpoints[name];
    assert.equal(checkpoint.months_from_reference, months);
    for (const metric of [
      "core_arr_bn",
      "base44_arr_bn",
      "total_arr_bn",
      "base44_gross_margin",
      "owner_fcff_usd_m",
      "net_claims_usd_bn",
    ]) {
      assertOrderedSummary(checkpoint[metric]);
    }
    assert.ok(
      Math.abs(
        checkpoint.total_arr_bn.mean -
          checkpoint.core_arr_bn.mean -
          checkpoint.base44_arr_bn.mean,
      ) < 1e-10,
    );
  }
  assert.ok(checkpoints.tenMonth.total_arr_bn.p50 > checkpoints.fourMonth.total_arr_bn.p50);
});

test("fully loaded Base44 economics remain distinct from gross margin", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const economics = output.diagnostics.twelve_month_by_causal_node.base44Economics;

  assert.ok(economics.weak.mean_drivers.base44GrossMargin < economics.adequate.mean_drivers.base44GrossMargin);
  assert.ok(economics.adequate.mean_drivers.base44GrossMargin < economics.strong.mean_drivers.base44GrossMargin);
  assert.ok(
    economics.weak.mean_drivers.base44PostGrossProfitOwnerCostLoad >
      economics.adequate.mean_drivers.base44PostGrossProfitOwnerCostLoad,
  );
  assert.ok(
    economics.adequate.mean_drivers.base44PostGrossProfitOwnerCostLoad >
      economics.strong.mean_drivers.base44PostGrossProfitOwnerCostLoad,
  );
  assert.ok(
    economics.weak.mean_drivers.targetBase44Contribution <
      economics.adequate.mean_drivers.targetBase44Contribution,
  );
  assert.ok(
    economics.adequate.mean_drivers.targetBase44Contribution <
      economics.strong.mean_drivers.targetBase44Contribution,
  );
  for (const state of Object.values(economics)) {
    assert.ok(Math.abs(state.mean_drivers.base44ContributionIdentityError) < 1e-10);
    assert.ok(Math.abs(state.mean_drivers.capitalIdentityError) < 1e-10);
  }
});

test("the joint model carries one coherent capital path across horizons", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const capital = output.relationship.capital_path_diagnostics;

  assert.equal(capital.probability_later_diluted_shares_gte_earlier, 1);
  assert.equal(capital.mean_twelve_month_diluted_shares, capital.mean_six_month_diluted_shares);
  assert.ok(capital.mean_twelve_month_net_claims < capital.mean_six_month_net_claims);
  assert.ok(capital.probability_later_net_claims_above_earlier < 0.15);
});

test("SOTP remains the formal method and cash methods are non-voting cross-checks", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const methods = output.diagnostics.method_medians;

  assert.equal(output.formalMethod, "sum_of_parts");
  assert.equal(output.sixMonth.p50, methods.six_month.sotp);
  assert.equal(output.twelveMonth.p50, methods.twelve_month.sotp);
  assert.ok(methods.twelve_month.sotp > methods.twelve_month.dcf);
  const distributions = output.diagnostics.method_distributions.twelve_month;
  for (const method of ["sotp", "ownerFcffMultiple", "dcf"]) {
    assertOrderedSummary(distributions[method]);
    assert.ok(distributions[method].probability_below_reference >= 0);
    assert.ok(distributions[method].probability_below_reference <= 1);
  }
  assert.ok(
    distributions.dcf.probability_below_reference >
      distributions.sotp.probability_below_reference,
  );
});

test("joint and per-node variance partitions reconcile exactly", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const attribution = output.diagnostics.variance_attribution;
  const joint = attribution.joint_state;

  assert.ok(Math.abs(joint.identity_error) < 1e-8);
  assert.ok(Math.abs(joint.between_group_share + joint.within_group_share - 1) < 1e-12);
  assert.ok(joint.between_group_share > 0.5);
  assert.ok(joint.between_group_share < 1);
  for (const decomposition of Object.values(attribution.by_node)) {
    assert.ok(Math.abs(decomposition.identity_error) < 1e-8);
    assert.ok(
      Math.abs(decomposition.between_group_share + decomposition.within_group_share - 1) <
        1e-12,
    );
  }
});

test("common-random-number tornado stresses move value in the expected direction", () => {
  const options = { seed: 20260830, sampleCount: 12000 };
  const base = runModel(options).twelveMonth.p50;
  const cases = [
    ["core growth", { coreGrowth: 0.02 }, 1],
    ["core multiple", { coreMultiple: 0.5 }, 1],
    ["Base44 growth", { base44Growth: 0.2 }, 1],
    ["Base44 multiple", { base44Multiple: 2 }, 1],
    ["Base44 cost load", { base44CostLoad: 0.1 }, -1],
    ["net claims", { netClaims: 0.1 }, -1],
    ["diluted shares", { dilutedShares: 2 }, -1],
  ];
  for (const [label, stresses, direction] of cases) {
    const stressed = runModel({ ...options, stresses }).twelveMonth.p50;
    assert.ok(direction * (stressed - base) > 0.2, `${label} stress should move value`);
  }
});

test("causal-probability overrides support a common-random-number ambiguity envelope", () => {
  const options = { seed: 20260830, sampleCount: 15000 };
  const base = runModel(options);
  const skeptical = runModel({
    ...options,
    causalProbabilities: {
      coreHealth: { weak: 0.4, stable: 0.45, strong: 0.15 },
      base44Adoption: { weak: 0.4, progress: 0.45, breakout: 0.15 },
      base44Economics: { weak: 0.45, adequate: 0.45, strong: 0.1 },
      agentAttachment: { adverse: 0.42, neutral: 0.45, platform: 0.13 },
    },
  });
  assert.ok(skeptical.twelveMonth.p50 < base.twelveMonth.p50);
  assert.ok(
    skeptical.twelveMonth.probability_below_reference >
      base.twelveMonth.probability_below_reference,
  );
});

test("dependency loadings are exposed and materially stress the valuation tails", () => {
  const options = { seed: 20260830, sampleCount: 20000 };
  const current = runModel(options);
  const independent = runModel({
    ...options,
    dependencyLoadings: {
      adoptionAgentLoading: 0,
      adoptionFrontierLoading: 0,
      coreAgentLoading: 0,
      coreFrontierLoading: 0,
      economicsAdoptionLoading: 0,
      economicsFrontierLoading: 0,
    },
  });
  const stronger = runModel({
    ...options,
    dependencyLoadings: {
      adoptionAgentLoading: 0.65,
      adoptionFrontierLoading: 0.15,
      coreAgentLoading: 0.5,
      coreFrontierLoading: -0.2,
      economicsAdoptionLoading: 0.4,
      economicsFrontierLoading: 0.2,
    },
  });
  assert.equal(current.causalModel.dependencyLoadings.adoptionAgentLoading, 0.42);
  assert.ok(independent.twelveMonth.p10 > current.twelveMonth.p10);
  assert.ok(stronger.twelveMonth.p10 < current.twelveMonth.p10);
  assert.ok(
    stronger.twelveMonth.probability_loss_30_pct >
      independent.twelveMonth.probability_loss_30_pct,
  );
});

test("model rejects malformed counts, stresses, and causal probabilities", () => {
  assert.throws(() => runModel({ sampleCount: 0 }), /integer of at least 10/);
  assert.throws(() => runModel({ sampleCount: 10.5 }), /integer of at least 10/);
  assert.throws(() => runModel({ sampleCount: 10, stresses: { mystery: 1 } }), /Unknown stress/);
  assert.throws(
    () => runModel({ sampleCount: 10, stresses: { coreGrowth: 0.06 } }),
    /stresses.coreGrowth/,
  );
  assert.throws(
    () => runModel({ sampleCount: 10, dependencyLoadings: { mystery: 0.2 } }),
    /Unknown dependency/,
  );
  assert.throws(
    () => runModel({ sampleCount: 10, dependencyLoadings: { adoptionAgentLoading: 0.9 } }),
    /dependencyLoadings.adoptionAgentLoading/,
  );

  const missingNode = defaultProbabilities();
  delete missingNode.agentAttachment;
  assert.throws(
    () => runModel({ sampleCount: 10, causalProbabilities: missingNode }),
    /must contain exactly/,
  );
  const missingState = defaultProbabilities();
  delete missingState.coreHealth.strong;
  assert.throws(
    () => runModel({ sampleCount: 10, causalProbabilities: missingState }),
    /must contain exactly/,
  );
  const badSum = defaultProbabilities();
  badSum.base44Adoption.progress = 0.5;
  assert.throws(
    () => runModel({ sampleCount: 10, causalProbabilities: badSum }),
    /must sum to one/,
  );
  const zeroState = defaultProbabilities();
  zeroState.base44Economics = { weak: 0.51, adequate: 0.49, strong: 0 };
  assert.throws(
    () => runModel({ sampleCount: 10, causalProbabilities: zeroState }),
    /finite and positive/,
  );
});

test("pure Base44 and capital bridges reconcile independent expected values", () => {
  assert.equal(
    computeBase44OwnerContribution({
      arrBn: 0.2,
      grossMargin: 0.6,
      postGrossProfitOwnerCostLoad: 0.75,
    }),
    30,
  );
  const bridge = computeEndingNetClaims({
    startingNetClaims: 0.78,
    cumulativeOwnerFcfe: 300,
    balanceSheetRetentionRate: 0.4,
    incrementalBase44ArrMillions: 100,
    earnoutParticipation: 0.3,
  });
  assert.deepEqual(bridge, {
    retainedCashOrDebtPaydown: 120,
    earnoutIncrease: 30,
    endingNetClaims: 0.6900000000000001,
  });
});

test("capitalization convention is finite across warrant and note thresholds", () => {
  for (const enterpriseValue of [5000, 7000, 12000, 16000]) {
    assert.ok(Number.isFinite(enterpriseValuePerShare(enterpriseValue, 780, 45.989)));
    assert.ok(enterpriseValuePerShare(enterpriseValue, 780, 45.989) > 0);
  }
});

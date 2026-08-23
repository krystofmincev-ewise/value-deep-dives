import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  dependencyLoadings,
  horizonLinkages,
  interpolateMarginal,
  legalStates,
  marginalCurves,
  modelContract,
  printableSummary,
  runDistributionModel,
  sixMonthEmbeddedLegalAllowances,
  sixMonthMarginalCurves,
} from "./model-2026-W34-distribution.mjs";

const publishedHorizonContract = JSON.parse(
  readFileSync(new URL("./2026-W34-valuation-contract.json", import.meta.url), "utf8"),
);

function assertClose(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

assert.equal(
  modelContract.modelVersion,
  "structured_elicitation_monte_carlo_v2_joint_horizons",
);
assert.equal(publishedHorizonContract.type, "valuation_horizon_contract");
assert.equal(publishedHorizonContract.schema_version, 1);
assert.equal(publishedHorizonContract.coverage_cycle_id, "SNAP-2026-W34-01");
assert.equal(publishedHorizonContract.valuation_quantity, modelContract.valuationQuantity);
assert.equal(publishedHorizonContract.display_semantics, modelContract.displaySemantics);
assert.equal(publishedHorizonContract.model.version, modelContract.modelVersion);
assert.equal(publishedHorizonContract.model.method, modelContract.modelMethod);
assert.equal(
  publishedHorizonContract.model.calibration_status,
  modelContract.calibrationStatus,
);
assert.equal(
  publishedHorizonContract.model.code_path,
  "model-2026-W34-distribution.mjs",
);
assert.equal(
  publishedHorizonContract.model.verifier_path,
  "verify-2026-08-21-distribution.mjs",
);
assert.equal(modelContract.asOf, "2026-08-22");
assert.equal(modelContract.sourceCutoffAt, "2026-08-22T23:57:00+02:00");
assert.equal(modelContract.referencePrice, 5.21);
assert.equal(modelContract.sixMonthHorizon, "2027-02-20");
assert.equal(modelContract.targetHorizon, "2027-08-20");
assert.equal(modelContract.sampleCount, 100_000);

for (const [horizon, curves] of Object.entries({
  twelveMonth: marginalCurves,
  sixMonth: sixMonthMarginalCurves,
})) {
  for (const [name, curve] of Object.entries(curves)) {
    const label = `${horizon}.${name}`;
    assert.equal(
      curve.length,
      5,
      `${label} must have five probability anchors`,
    );
    assert.ok(
      curve.every(Number.isFinite),
      `${label} must contain finite numbers`,
    );
    assert.ok(
      curve.every((value, index) => index === 0 || value >= curve[index - 1]),
      `${label} must be in numeric percentile order`,
    );
    assertClose(
      interpolateMarginal(curve, 0.10),
      curve[1],
      1e-12,
      `${label} P10`,
    );
    assertClose(
      interpolateMarginal(curve, 0.50),
      curve[2],
      1e-12,
      `${label} P50`,
    );
    assertClose(
      interpolateMarginal(curve, 0.90),
      curve[3],
      1e-12,
      `${label} P90`,
    );
  }
}

for (const [name, loading] of Object.entries(dependencyLoadings)) {
  assert.ok(loading >= 0 && loading < 1, `${name} must be in [0, 1)`);
}

for (const [name, linkage] of Object.entries(horizonLinkages)) {
  assert.ok(linkage >= 0 && linkage <= 1, `${name} must be in [0, 1]`);
}

assertClose(
  sixMonthMarginalCurves.trailingRevenueBeforeRegulatoryDrag[1] -
    sixMonthEmbeddedLegalAllowances.revenueDrag.downside,
  6.676,
  1e-12,
  "six-month downside revenue anchor after embedded legal drag",
);
assertClose(
  sixMonthMarginalCurves.trailingRevenueBeforeRegulatoryDrag[2] -
    sixMonthEmbeddedLegalAllowances.revenueDrag.central,
  6.928,
  1e-12,
  "six-month central revenue anchor after embedded legal drag",
);
assertClose(
  sixMonthMarginalCurves.trailingRevenueBeforeRegulatoryDrag[3] -
    sixMonthEmbeddedLegalAllowances.revenueDrag.upside,
  7.163,
  1e-12,
  "six-month upside revenue anchor after embedded legal drag",
);
assertClose(
  sixMonthMarginalCurves.netDebtBeforeIncrementalLegalCash[1] +
    sixMonthEmbeddedLegalAllowances.cashEffect.upside,
  0.350,
  1e-12,
  "six-month upside net-debt anchor after embedded legal cash",
);
assertClose(
  sixMonthMarginalCurves.netDebtBeforeIncrementalLegalCash[2] +
    sixMonthEmbeddedLegalAllowances.cashEffect.central,
  0.650,
  1e-12,
  "six-month central net-debt anchor after embedded legal cash",
);
assertClose(
  sixMonthMarginalCurves.netDebtBeforeIncrementalLegalCash[3] +
    sixMonthEmbeddedLegalAllowances.cashEffect.downside,
  0.825,
  1e-12,
  "six-month downside net-debt anchor after embedded legal cash",
);

assertClose(
  legalStates.reduce((total, state) => total + state.probability, 0),
  1,
  1e-12,
  "legal-state probabilities",
);

const result = runDistributionModel();
const value = result.methods.triangulated;
const sixMonthValue = result.sixMonth.value;
const contractSixMonth = publishedHorizonContract.horizons.find(
  ({ id }) => id === "six_month",
);
const contractTwelveMonth = publishedHorizonContract.horizons.find(
  ({ id }) => id === "twelve_month",
);

assert.ok(contractSixMonth, "published contract must include six_month");
assert.ok(contractTwelveMonth, "published contract must include twelve_month");
assert.equal(
  publishedHorizonContract.horizon_relationship.kind,
  modelContract.horizonRelationship,
);
assert.equal(
  publishedHorizonContract.horizon_relationship.value_correlation_method,
  modelContract.horizonValueCorrelationMethod,
);
assert.equal(
  publishedHorizonContract.horizon_relationship.linkage_method,
  modelContract.horizonLinkageMethod,
);
assert.equal(publishedHorizonContract.primary_horizon, modelContract.targetHorizon);
assert.equal(contractSixMonth.date, modelContract.sixMonthHorizon);
assert.equal(contractTwelveMonth.date, modelContract.targetHorizon);
assert.equal(publishedHorizonContract.reference_price, modelContract.referencePrice);
assert.equal(publishedHorizonContract.reference_price_at, modelContract.referencePriceAt);
assert.equal(
  publishedHorizonContract.reference_price_source,
  modelContract.referencePriceSource,
);
assert.equal(publishedHorizonContract.currency, modelContract.currency);
assert.equal(publishedHorizonContract.as_of, modelContract.asOf);
assert.equal(publishedHorizonContract.source_cutoff_at, modelContract.sourceCutoffAt);
assert.equal(publishedHorizonContract.model.seed, modelContract.seed);
assert.equal(publishedHorizonContract.model.sample_count, modelContract.sampleCount);

// These assertions freeze the exact published model version. Changing a
// marginal, dependency, legal branch, seed, sample count, or valuation formula
// requires an explicit review of every canonical output that cites the model.
assertClose(value.mean, 8.2264, 0.0001, "triangulated mean value");
assertClose(value.p10, 2.8555, 0.0001, "triangulated P10");
assertClose(value.p50, 7.9022, 0.0001, "triangulated P50");
assertClose(value.p90, 13.7826, 0.0001, "triangulated P90");
assertClose(
  value.probabilityBelowReference,
  0.2859,
  0.0001,
  "probability below reference",
);
assertClose(
  value.probabilityLossThirtyPercent,
  0.1595,
  0.0001,
  "probability of at least 30% loss",
);
assertClose(
  value.probabilityLossFiftyPercent,
  0.0818,
  0.0001,
  "probability of at least 50% loss",
);
assertClose(
  value.probabilityAboveEightPercentHurdle,
  0.6803,
  0.0001,
  "probability fair value exceeds reference by at least 8%",
);
assertClose(
  value.expectedShortfallTenPercent,
  2.0625,
  0.0001,
  "bottom-decile expected value",
);

for (const [label, summary, contract] of [
  ["six-month", sixMonthValue, contractSixMonth],
  ["twelve-month", value, contractTwelveMonth],
]) {
  for (const [contractField, resultField] of [
    ["mean", "mean"],
    ["p10", "p10"],
    ["p50", "p50"],
    ["p90", "p90"],
    ["probability_below_reference", "probabilityBelowReference"],
    ["probability_loss_30_pct", "probabilityLossThirtyPercent"],
    ["probability_loss_50_pct", "probabilityLossFiftyPercent"],
    ["bottom_decile_mean", "expectedShortfallTenPercent"],
  ]) {
    assertClose(
      contract[contractField],
      summary[resultField],
      0.0001,
      `${label} contract parity for ${contractField}`,
    );
  }
}

assertClose(sixMonthValue.mean, 7.0869, 0.0001, "six-month mean value");
assertClose(sixMonthValue.p10, 3.8061, 0.0001, "six-month P10");
assertClose(sixMonthValue.p25, 4.9587, 0.0001, "six-month P25");
assertClose(sixMonthValue.p50, 6.7652, 0.0001, "six-month P50");
assertClose(sixMonthValue.p75, 8.9874, 0.0001, "six-month P75");
assertClose(sixMonthValue.p90, 10.6404, 0.0001, "six-month P90");
assertClose(
  sixMonthValue.probabilityBelowReference,
  0.2850,
  0.0001,
  "six-month probability below reference",
);
assertClose(
  sixMonthValue.probabilityLossThirtyPercent,
  0.0896,
  0.0001,
  "six-month probability of at least 30% loss",
);
assertClose(
  sixMonthValue.probabilityLossFiftyPercent,
  0.0409,
  0.0001,
  "six-month probability of at least 50% loss",
);
assertClose(
  sixMonthValue.expectedShortfallTenPercent,
  2.7883,
  0.0001,
  "six-month bottom-decile expected value",
);
assertClose(
  result.horizonLink.valueCorrelation,
  0.8110,
  0.0001,
  "six-/twelve-month value correlation",
);
assertClose(
  result.horizonLink.probabilityTwelveMonthAboveSixMonth,
  0.6337,
  0.0001,
  "probability twelve-month value exceeds six-month value",
);
assertClose(
  publishedHorizonContract.horizon_relationship.value_correlation,
  result.horizonLink.valueCorrelation,
  0.0001,
  "contract parity for horizon value correlation",
);
assertClose(
  publishedHorizonContract.horizon_relationship
    .probability_later_above_earlier,
  result.horizonLink.probabilityTwelveMonthAboveSixMonth,
  0.0001,
  "contract parity for later-above-earlier probability",
);

assertClose(result.diagnostics.revenue.p50, 7.4803, 0.0001, "median revenue");
assertClose(result.diagnostics.fcf.p50, 1.1096, 0.0001, "median FCF");
assertClose(
  result.diagnostics.revenueMultiple.p50,
  2.2039,
  0.0001,
  "median revenue multiple",
);

for (const state of legalStates) {
  assertClose(
    result.legalStateFrequencies[state.name],
    state.probability,
    0.003,
    `${state.name} simulated frequency`,
  );
}

assert.ok(
  result.legalStateValueSummaries.extreme.mean <
    result.legalStateValueSummaries.manageable.mean,
  "extreme legal state must reduce mean value",
);
assert.ok(
  result.methods.dcf.p50 < result.methods.multiple.p50,
  "DCF must retain its more conservative median cross-check",
);
assert.ok(
  result.horizonTransitions.bottomQuartile.mean <
    result.horizonTransitions.lowerMiddleQuartile.mean &&
    result.horizonTransitions.lowerMiddleQuartile.mean <
      result.horizonTransitions.upperMiddleQuartile.mean &&
    result.horizonTransitions.upperMiddleQuartile.mean <
      result.horizonTransitions.topQuartile.mean,
  "six-month value bands must lead to ordered twelve-month conditional means",
);

const expectedTransitions = {
  bottomQuartile: { mean: 4.0353, p50: 3.5875, belowReference: 0.7477 },
  lowerMiddleQuartile: { mean: 6.8296, p50: 6.6268, belowReference: 0.3025 },
  upperMiddleQuartile: { mean: 9.1485, p50: 9.1935, belowReference: 0.0865 },
  topQuartile: { mean: 12.8923, p50: 12.5369, belowReference: 0.0069 },
};

for (const [name, expected] of Object.entries(expectedTransitions)) {
  const transition = result.horizonTransitions[name];
  assertClose(transition.sampleShare, 0.25, 1e-12, `${name} sample share`);
  assertClose(transition.mean, expected.mean, 0.0001, `${name} mean`);
  assertClose(transition.p50, expected.p50, 0.0001, `${name} median`);
  assertClose(
    transition.probabilityBelowReference,
    expected.belowReference,
    0.0001,
    `${name} probability below reference`,
  );
}

for (const band of publishedHorizonContract.horizon_relationship.transition_bands) {
  const transitionKey = band.label.replace(/_([a-z])/g, (_match, letter) =>
    letter.toUpperCase(),
  );
  const transition = result.horizonTransitions[transitionKey];
  assert.ok(transition, `contract transition band ${band.label} must map to model output`);
  assertClose(
    transition.sampleShare,
    band.earlier_band_sample_probability,
    0.0001,
    `${band.label} contract sample probability`,
  );
  assertClose(transition.mean, band.later_mean, 0.0001, `${band.label} contract mean`);
  assertClose(transition.p50, band.later_median, 0.0001, `${band.label} contract median`);
  assertClose(
    transition.probabilityBelowReference,
    band.later_probability_below_reference,
    0.0001,
    `${band.label} contract downside probability`,
  );
}

console.table(
  Object.fromEntries(
    Object.entries(result.methods).map(([name, summary]) => [
      name,
      {
        mean: summary.mean.toFixed(2),
        p10: summary.p10.toFixed(2),
        p50: summary.p50.toFixed(2),
        p90: summary.p90.toFixed(2),
        below_reference_pct: (summary.probabilityBelowReference * 100).toFixed(1),
      },
    ]),
  ),
);
console.log(JSON.stringify(printableSummary(result).legalStateFrequencies));
console.table({
  sixMonth: {
    mean: sixMonthValue.mean.toFixed(2),
    p10: sixMonthValue.p10.toFixed(2),
    p50: sixMonthValue.p50.toFixed(2),
    p90: sixMonthValue.p90.toFixed(2),
  },
  twelveMonth: {
    mean: value.mean.toFixed(2),
    p10: value.p10.toFixed(2),
    p50: value.p50.toFixed(2),
    p90: value.p90.toFixed(2),
  },
});
console.log("SNAP 2026-W34 distribution verification: PASS");

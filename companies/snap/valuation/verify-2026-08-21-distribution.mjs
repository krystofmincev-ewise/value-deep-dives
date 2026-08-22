import assert from "node:assert/strict";

import {
  dependencyLoadings,
  interpolateMarginal,
  legalStates,
  marginalCurves,
  modelContract,
  printableSummary,
  runDistributionModel,
} from "./model-2026-W34-distribution.mjs";

function assertClose(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

assert.equal(modelContract.asOf, "2026-08-22");
assert.equal(modelContract.sourceCutoffAt, "2026-08-22T23:57:00+02:00");
assert.equal(modelContract.referencePrice, 5.21);
assert.equal(modelContract.targetHorizon, "2027-08-20");
assert.equal(modelContract.sampleCount, 100_000);

for (const [name, curve] of Object.entries(marginalCurves)) {
  assert.equal(curve.length, 5, `${name} must have five probability anchors`);
  assert.ok(curve.every(Number.isFinite), `${name} must contain finite numbers`);
  assert.ok(
    curve.every((value, index) => index === 0 || value >= curve[index - 1]),
    `${name} must be in numeric percentile order`,
  );
  assertClose(interpolateMarginal(curve, 0.10), curve[1], 1e-12, `${name} P10`);
  assertClose(interpolateMarginal(curve, 0.50), curve[2], 1e-12, `${name} P50`);
  assertClose(interpolateMarginal(curve, 0.90), curve[3], 1e-12, `${name} P90`);
}

for (const [name, loading] of Object.entries(dependencyLoadings)) {
  assert.ok(loading >= 0 && loading < 1, `${name} must be in [0, 1)`);
}

assertClose(
  legalStates.reduce((total, state) => total + state.probability, 0),
  1,
  1e-12,
  "legal-state probabilities",
);

const result = runDistributionModel();
const value = result.methods.triangulated;

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
console.log("SNAP 2026-W34 distribution verification: PASS");

import assert from "node:assert/strict";
import test from "node:test";

import {
  interpolateMarginal,
  legalStates,
  marginalCurves,
  runDistributionModel,
  sixMonthMarginalCurves,
} from "../companies/snap/valuation/model-2026-W34-distribution.mjs";

test("SNAP marginal curves preserve declared P10/P50/P90 anchors", () => {
  for (const curves of [marginalCurves, sixMonthMarginalCurves]) {
    for (const curve of Object.values(curves)) {
      assert.ok(
        curve.every((value, index) => index === 0 || value >= curve[index - 1]),
        `marginal curve must be in numeric percentile order: ${curve.join(", ")}`,
      );
      assert.ok(Math.abs(interpolateMarginal(curve, 0.10) - curve[1]) < 1e-12);
      assert.ok(Math.abs(interpolateMarginal(curve, 0.50) - curve[2]) < 1e-12);
      assert.ok(Math.abs(interpolateMarginal(curve, 0.90) - curve[3]) < 1e-12);
    }
  }
  assert.ok(
    Math.abs(
      legalStates.reduce((total, state) => total + state.probability, 0) - 1,
    ) < 1e-12,
  );
});

test("SNAP stochastic valuation is deterministic and preserves downside", () => {
  const first = runDistributionModel({ seed: 42, sampleCount: 20_000 });
  const second = runDistributionModel({ seed: 42, sampleCount: 20_000 });

  assert.deepEqual(first.methods.triangulated, second.methods.triangulated);
  assert.ok(first.methods.triangulated.p10 < first.contract.referencePrice);
  assert.ok(first.methods.triangulated.p50 > first.contract.referencePrice);
  assert.ok(first.methods.triangulated.p90 > first.methods.triangulated.p50);
  assert.ok(first.methods.triangulated.probabilityBelowReference > 0.20);
  assert.ok(first.methods.triangulated.probabilityLossFiftyPercent > 0.05);
  assert.deepEqual(first.sixMonth.value, second.sixMonth.value);
  assert.ok(first.sixMonth.value.p10 < first.contract.referencePrice);
  assert.ok(first.sixMonth.value.p50 > first.contract.referencePrice);
  assert.ok(first.sixMonth.value.p90 > first.sixMonth.value.p50);
  assert.ok(first.horizonLink.valueCorrelation > 0.70);
  assert.ok(first.horizonLink.valueCorrelation < 0.90);
  assert.ok(
    first.horizonTransitions.bottomQuartile.mean <
      first.horizonTransitions.lowerMiddleQuartile.mean,
  );
  assert.ok(
    first.horizonTransitions.lowerMiddleQuartile.mean <
      first.horizonTransitions.upperMiddleQuartile.mean,
  );
  assert.ok(
    first.horizonTransitions.upperMiddleQuartile.mean <
      first.horizonTransitions.topQuartile.mean,
  );
});

test("dependency stress changes tails without reversing the central conclusion", () => {
  const independent = runDistributionModel({
    seed: 77,
    sampleCount: 20_000,
    loadingMultiplier: 0,
  });
  const correlated = runDistributionModel({
    seed: 77,
    sampleCount: 20_000,
    loadingMultiplier: 1.15,
  });

  assert.ok(
    correlated.methods.triangulated.p10 < independent.methods.triangulated.p10,
  );
  assert.ok(
    correlated.methods.triangulated.p90 > independent.methods.triangulated.p90,
  );
  assert.ok(correlated.methods.triangulated.p50 > 7);
  assert.ok(independent.methods.triangulated.p50 > 7);
});

test("horizon-linkage stress changes path continuity without changing the twelve-month distribution", () => {
  const weakLink = runDistributionModel({
    seed: 91,
    sampleCount: 20_000,
    horizonLinkageMultiplier: 0.50,
  });
  const strongLink = runDistributionModel({
    seed: 91,
    sampleCount: 20_000,
    horizonLinkageMultiplier: 1.15,
  });

  assert.deepEqual(
    weakLink.methods.triangulated,
    strongLink.methods.triangulated,
  );
  assert.ok(
    strongLink.horizonLink.valueCorrelation >
      weakLink.horizonLink.valueCorrelation,
  );
  assert.ok(
    strongLink.horizonTransitions.bottomQuartile.mean <
      weakLink.horizonTransitions.bottomQuartile.mean,
  );
  assert.ok(
    strongLink.horizonTransitions.topQuartile.mean >
      weakLink.horizonTransitions.topQuartile.mean,
  );
});

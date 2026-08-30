import assert from "node:assert/strict";
import test from "node:test";

import {
  computeBase44OwnerContribution,
  computeEndingNetClaims,
  enterpriseValuePerShare,
  runModel,
} from "../companies/wix/valuation/model-2026-W35-distribution.mjs";

test("Wix joint valuation is deterministic and finite", () => {
  const first = runModel({ seed: 20260830, sampleCount: 10000 });
  const second = runModel({ seed: 20260830, sampleCount: 10000 });

  assert.deepEqual(first, second);
  for (const horizon of [first.sixMonth, first.twelveMonth]) {
    for (const value of Object.values(horizon)) assert.ok(Number.isFinite(value));
    assert.ok(horizon.p10 <= horizon.p50);
    assert.ok(horizon.p50 <= horizon.p90);
  }
  assert.ok(first.relationship.value_correlation > 0.8);
  assert.ok(first.relationship.value_correlation < 1);
});

test("Wix owner cash decomposes Base44 gross margin from all post-GP owner costs", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const regimes = output.diagnostics.twelve_month_by_regime;

  assert.ok(regimes.erosion.mean_drivers.ownerFcff < regimes.defend.mean_drivers.ownerFcff);
  assert.ok(regimes.defend.mean_drivers.ownerFcff < regimes.platform_win.mean_drivers.ownerFcff);
  assert.ok(regimes.defend.mean_drivers.base44GrossMargin > 0.57);
  assert.ok(regimes.defend.mean_drivers.base44GrossMargin < 0.63);
  assert.ok(regimes.defend.mean_drivers.base44PostGrossProfitOwnerCostLoad > 0.74);
  assert.ok(regimes.defend.mean_drivers.base44PostGrossProfitOwnerCostLoad < 0.82);
  for (const regime of Object.values(regimes)) {
    assert.ok(Math.abs(regime.mean_drivers.base44ContributionIdentityError) < 1e-10);
    assert.ok(Math.abs(regime.mean_drivers.capitalIdentityError) < 1e-10);
  }
});

test("shifting structural weight from platform win to erosion worsens the distribution", () => {
  const base = runModel({ seed: 20260830, sampleCount: 20000 });
  const stress = runModel({
    seed: 20260830,
    sampleCount: 20000,
    regimeWeights: { erosion: 0.3, defend: 0.58, platformWin: 0.12 },
  });

  assert.ok(stress.twelveMonth.p50 < base.twelveMonth.p50);
  assert.ok(
    stress.twelveMonth.probability_below_reference >
      base.twelveMonth.probability_below_reference,
  );
});

test("the joint model carries one coherent capital path across horizons", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const capital = output.relationship.capital_path_diagnostics;

  assert.equal(capital.probability_later_diluted_shares_gte_earlier, 1);
  assert.equal(capital.mean_twelve_month_diluted_shares, capital.mean_six_month_diluted_shares);
  assert.ok(capital.mean_twelve_month_net_claims < capital.mean_six_month_net_claims);
  assert.ok(capital.probability_later_net_claims_above_earlier < 0.1);
});

test("SOTP is the formal method and cash methods remain non-voting cross-checks", () => {
  const output = runModel({ seed: 20260830, sampleCount: 20000 });
  const methods = output.diagnostics.method_medians;

  assert.equal(output.formalMethod, "sum_of_parts");
  assert.equal(output.sixMonth.p50, methods.six_month.sotp);
  assert.equal(output.twelveMonth.p50, methods.twelve_month.sotp);
  assert.ok(methods.six_month.sotp > methods.six_month.dcf);
  assert.ok(methods.twelve_month.sotp > methods.twelve_month.dcf);
});

test("model rejects malformed sample counts and regime weights", () => {
  assert.throws(() => runModel({ sampleCount: 0 }), /integer of at least 10/);
  assert.throws(() => runModel({ sampleCount: 10.5 }), /integer of at least 10/);
  assert.throws(
    () => runModel({ sampleCount: 10, regimeWeights: { erosion: 0.2, defend: 0.8 } }),
    /contain exactly/,
  );
  assert.throws(
    () =>
      runModel({
        sampleCount: 10,
        regimeWeights: { erosion: 0, defend: 0.8, platformWin: 0.2 },
      }),
    /finite, positive/,
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

test("formal SOTP responds materially to Base44 unit economics", () => {
  const lowCost = runModel({
    seed: 20260830,
    sampleCount: 20000,
    base44CostLoadShift: -0.15,
  });
  const highCost = runModel({
    seed: 20260830,
    sampleCount: 20000,
    base44CostLoadShift: 0.15,
  });

  assert.ok(lowCost.twelveMonth.p50 > highCost.twelveMonth.p50 + 5);
  assert.ok(lowCost.twelveMonth.mean > highCost.twelveMonth.mean + 5);
});

test("capitalization convention is finite across warrant and note thresholds", () => {
  for (const enterpriseValue of [5000, 7000, 12000, 16000]) {
    assert.ok(Number.isFinite(enterpriseValuePerShare(enterpriseValue, 780, 45.989)));
    assert.ok(enterpriseValuePerShare(enterpriseValue, 780, 45.989) > 0);
  }
});

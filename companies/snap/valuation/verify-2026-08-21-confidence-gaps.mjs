import assert from "node:assert/strict";

function close(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

const q2AdvertisingRevenue = { current: 1_282_522, prior: 1_173_548 };
const q2AdvertisingPriceGrowth = 0.10;
const q2PriorYearAdvertisingPriceGrowth = -0.10;
const q2AdvertisingRevenueGrowth =
  q2AdvertisingRevenue.current / q2AdvertisingRevenue.prior - 1;
const q2ImpressionGrowth =
  (1 + q2AdvertisingRevenueGrowth) / (1 + q2AdvertisingPriceGrowth) - 1;

close(q2AdvertisingRevenueGrowth, 0.0928586, 0.000_000_1, "Q2 ad revenue growth");
close(q2ImpressionGrowth, -0.0064922, 0.000_000_1, "Q2 implied impression growth");
close(
  (1 + q2PriorYearAdvertisingPriceGrowth) *
    (1 + q2AdvertisingPriceGrowth),
  0.99,
  0.000_001,
  "two-year Q2 advertising-price index",
);

const regionalInputs = {
  northAmerica: { arpu: 10.26, revenue: 942.9 },
  europe: { arpu: 3.62, revenue: 353.8 },
  restOfWorld: { arpu: 1.00, revenue: 302.3 },
};

const dailyActiveUsers = 493;
const infrastructure = { low: 1_650, midpoint: 1_675, high: 1_700 };

function regionalProxy({ arpu, revenue }, annualInfrastructure, otherCostRate) {
  const quarterlyInfrastructurePerUser = annualInfrastructure / 4 / dailyActiveUsers;
  const margin = 1 - otherCostRate - quarterlyInfrastructurePerUser / arpu;
  return { margin, profit: revenue * margin };
}

const expectedRegional = {
  northAmerica: { low: 0.74598, midpoint: 0.75221, high: 0.75845 },
  europe: { low: 0.59186, midpoint: 0.60036, high: 0.60886 },
  restOfWorld: { low: -0.03207, midpoint: -0.01439, high: 0.00329 },
};

for (const [region, inputs] of Object.entries(regionalInputs)) {
  const low = regionalProxy(inputs, infrastructure.high, 0.17);
  const midpoint = regionalProxy(inputs, infrastructure.midpoint, 0.165);
  const high = regionalProxy(inputs, infrastructure.low, 0.16);
  close(low.margin, expectedRegional[region].low, 0.000_01, `${region} low margin`);
  close(
    midpoint.margin,
    expectedRegional[region].midpoint,
    0.000_01,
    `${region} midpoint margin`,
  );
  close(high.margin, expectedRegional[region].high, 0.000_01, `${region} high margin`);
}

const subscriptionOpening = 24;
const subscriptionNetAdds = 10;
const churnSensitivities = [0.20, 0.40, 0.60];
const grossAdds = churnSensitivities.map(
  (churn) => subscriptionNetAdds + subscriptionOpening * churn,
);
assert.deepEqual(grossAdds, [14.8, 19.6, 24.4]);

const baseOtherRevenue = 1.435;
const baseDilutedShares = 1.92;
close(baseOtherRevenue / baseDilutedShares, 0.7474, 0.000_1, "Other Revenue 1x sensitivity");
close(0.008 / baseDilutedShares, 0.00417, 0.000_01, "Breathitt per-share amount");

const specsPrice = 2_195;
function specsBreakevenUnits(fixedCashSpend, grossMargin) {
  return fixedCashSpend / (specsPrice * grossMargin);
}
close(specsBreakevenUnits(250_000_000, 0.20), 569_476, 1, "Specs $250m/20%");
close(specsBreakevenUnits(250_000_000, 0.40), 284_738, 1, "Specs $250m/40%");
close(specsBreakevenUnits(500_000_000, 0.20), 1_138_952, 1, "Specs $500m/20%");
close(specsBreakevenUnits(500_000_000, 0.40), 569_476, 1, "Specs $500m/40%");

const probabilities = { bear: 0.30, base: 0.50, bull: 0.20 };
const targets = { bear: 2.50, base: 7.75, bull: 14.25 };
const legalCashAllowances = { bear: 300, base: 150, bull: 50 };
const regulatoryRevenueDrags = { bear: 75, base: 45, bull: 20 };
const checkpoints = {
  bear: (6.676 * 1.20 - 0.825) / 1.940,
  base: (6.928 * 1.95 - 0.650) / 1.910,
  bull: (7.163 * 2.90 - 0.350) / 1.890,
};

const weightedTarget = Object.keys(probabilities).reduce(
  (total, scenario) => total + probabilities[scenario] * targets[scenario],
  0,
);
const weightedCheckpoint = Object.keys(probabilities).reduce(
  (total, scenario) => total + probabilities[scenario] * checkpoints[scenario],
  0,
);
const weightedLegalCash = Object.keys(probabilities).reduce(
  (total, scenario) => total + probabilities[scenario] * legalCashAllowances[scenario],
  0,
);
const weightedRegulatoryRevenueDrag = Object.keys(probabilities).reduce(
  (total, scenario) => total + probabilities[scenario] * regulatoryRevenueDrags[scenario],
  0,
);

close(weightedTarget, 7.475, 0.000_001, "audited weighted target");
close(weightedCheckpoint, 6.6388, 0.000_1, "audited weighted checkpoint");
close(weightedTarget / 5.21 - 1, 0.4347, 0.000_1, "audited expected return");
close(weightedLegalCash, 175, 0.000_001, "weighted legal cash allowance");
close(weightedRegulatoryRevenueDrag, 49, 0.000_001, "weighted revenue drag");
close(
  weightedLegalCash + weightedRegulatoryRevenueDrag * 1.6,
  253.4,
  0.000_001,
  "updated regulation value check",
);

console.table({
  q2AdvertisingRevenueGrowth,
  q2ImpressionGrowth,
  weightedTarget,
  weightedCheckpoint,
  weightedLegalCash,
  weightedRegulatoryRevenueDrag,
});
console.log("SNAP confidence-gap verification: PASS");

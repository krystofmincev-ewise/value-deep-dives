import assert from "node:assert/strict";

const referencePrice = 5.21;
const current = {
  dilutedShares: 1.881,
  cashAndSecurities: 2.660,
  debtCarryingValue: 3.535,
  operatingLeases: 0.691,
  trailingRevenue: 6.351,
  headlineFcf: 0.706,
};

const scenarios = {
  bear: {
    probability: 0.30,
    advertising: [1.409, 1.558, 1.269, 1.309],
    other: [0.291, 0.290, 0.342, 0.363],
    adjustedEbitda: [0.310, 0.370, 0.193, 0.201],
    fcf: 0.650,
    netDebt: 0.850,
    dilutedShares: 1.980,
    revenueMultiple: 0.90,
    advertisingMultiple: 0.70,
    otherMultiple: 1.50,
    specsValue: 0,
    revenueGrowthAfterYearOne: [0.04, 0.03, 0.02, 0.02],
    yearFiveFcfMargin: 0.095,
    annualDilution: 0.03,
    costOfEquity: 0.14,
    terminalCompanyGrowth: 0.02,
    adoptedTarget: 2.50,
    checkpointRevenue: 6.676,
    checkpointMultiple: 1.20,
    checkpointNetDebt: 0.825,
    checkpointShares: 1.940,
  },
  base: {
    probability: 0.50,
    advertising: [1.475, 1.692, 1.418, 1.463],
    other: [0.285, 0.348, 0.385, 0.417],
    adjustedEbitda: [0.390, 0.530, 0.361, 0.395],
    fcf: 1.100,
    netDebt: 0.450,
    dilutedShares: 1.920,
    revenueMultiple: 2.20,
    advertisingMultiple: 1.80,
    otherMultiple: 3.00,
    specsValue: 0.250,
    revenueGrowthAfterYearOne: [0.14, 0.12, 0.10, 0.08],
    yearFiveFcfMargin: 0.165,
    annualDilution: 0.01,
    costOfEquity: 0.13,
    terminalCompanyGrowth: 0.025,
    adoptedTarget: 7.75,
    checkpointRevenue: 6.928,
    checkpointMultiple: 1.95,
    checkpointNetDebt: 0.650,
    checkpointShares: 1.910,
  },
  bull: {
    probability: 0.20,
    advertising: [1.528, 1.811, 1.518, 1.565],
    other: [0.302, 0.394, 0.442, 0.490],
    adjustedEbitda: [0.435, 0.684, 0.490, 0.534],
    fcf: 1.500,
    netDebt: 0,
    dilutedShares: 1.880,
    revenueMultiple: 3.30,
    advertisingMultiple: 2.80,
    otherMultiple: 5.00,
    specsValue: 0.750,
    revenueGrowthAfterYearOne: [0.20, 0.18, 0.15, 0.12],
    yearFiveFcfMargin: 0.20,
    annualDilution: 0,
    costOfEquity: 0.12,
    terminalCompanyGrowth: 0.03,
    adoptedTarget: 14.25,
    checkpointRevenue: 7.163,
    checkpointMultiple: 2.90,
    checkpointNetDebt: 0.350,
    checkpointShares: 1.890,
  },
};

const expectedDisplay = {
  bear: { revenue: 6.831, ebitda: 1.074, multiple: 2.68, sotp: 2.51, dcf: 2.24, checkpoint: 3.70 },
  base: { revenue: 7.483, ebitda: 1.676, multiple: 8.34, sotp: 7.81, dcf: 7.07, checkpoint: 6.73 },
  bull: { revenue: 8.050, ebitda: 2.143, multiple: 14.13, sotp: 14.29, dcf: 14.22, checkpoint: 10.81 },
};

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function assertClose(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

function discountedCashFlow(scenario, yearOneRevenue) {
  const yearOneMargin = scenario.fcf / yearOneRevenue;
  let revenue = yearOneRevenue;
  let shares = scenario.dilutedShares;
  let presentValue = 0;
  let finalFcfPerShare = 0;

  for (let year = 1; year <= 5; year += 1) {
    if (year > 1) {
      revenue *= 1 + scenario.revenueGrowthAfterYearOne[year - 2];
      shares *= 1 + scenario.annualDilution;
    }
    const progress = (year - 1) / 4;
    const margin = yearOneMargin + (scenario.yearFiveFcfMargin - yearOneMargin) * progress;
    finalFcfPerShare = revenue * margin / shares;
    presentValue += finalFcfPerShare / (1 + scenario.costOfEquity) ** year;
  }

  const terminalPerShareGrowth =
    (1 + scenario.terminalCompanyGrowth) / (1 + scenario.annualDilution) - 1;
  const terminalValue =
    finalFcfPerShare * (1 + terminalPerShareGrowth) /
    (scenario.costOfEquity - terminalPerShareGrowth);

  return presentValue + terminalValue / (1 + scenario.costOfEquity) ** 5;
}

const netDebt = current.debtCarryingValue - current.cashAndSecurities;
const equityValue = referencePrice * current.dilutedShares;
const enterpriseValue = equityValue + netDebt;

assertClose(netDebt, 0.875, 0.000_001, "current net debt");
assertClose(equityValue, 9.800, 0.001, "current diluted equity value");
assertClose(enterpriseValue, 10.675, 0.001, "current lease-excluded enterprise value");
assertClose(enterpriseValue / current.trailingRevenue, 1.68, 0.002, "current EV/revenue");
assertClose(
  (enterpriseValue + current.operatingLeases) / current.trailingRevenue,
  1.79,
  0.002,
  "diagnostic lease-included EV/revenue",
);
assertClose(equityValue / current.headlineFcf, 13.9, 0.02, "equity/headline FCF");

const results = {};

for (const [name, scenario] of Object.entries(scenarios)) {
  const advertisingRevenue = sum(scenario.advertising);
  const otherRevenue = sum(scenario.other);
  const revenue = advertisingRevenue + otherRevenue;
  const ebitda = sum(scenario.adjustedEbitda);
  const multipleValue =
    (revenue * scenario.revenueMultiple - scenario.netDebt) / scenario.dilutedShares;
  const sotpValue =
    (advertisingRevenue * scenario.advertisingMultiple +
      otherRevenue * scenario.otherMultiple +
      scenario.specsValue -
      scenario.netDebt) /
    scenario.dilutedShares;
  const dcfValue = discountedCashFlow(scenario, revenue);
  const checkpointValue =
    (scenario.checkpointRevenue * scenario.checkpointMultiple - scenario.checkpointNetDebt) /
    scenario.checkpointShares;

  assertClose(revenue, expectedDisplay[name].revenue, 0.000_001, `${name} revenue`);
  assertClose(ebitda, expectedDisplay[name].ebitda, 0.000_001, `${name} adjusted EBITDA`);
  assertClose(multipleValue, expectedDisplay[name].multiple, 0.006, `${name} multiple value`);
  assertClose(sotpValue, expectedDisplay[name].sotp, 0.006, `${name} SOTP value`);
  assertClose(dcfValue, expectedDisplay[name].dcf, 0.006, `${name} DCF value`);
  assertClose(checkpointValue, expectedDisplay[name].checkpoint, 0.006, `${name} checkpoint value`);

  results[name] = {
    revenue,
    ebitda,
    multipleValue,
    sotpValue,
    dcfValue,
    adoptedTarget: scenario.adoptedTarget,
    checkpointValue,
  };
}

assertClose(sum(Object.values(scenarios).map(({ probability }) => probability)), 1, 0, "probabilities");

const weightedTarget = sum(
  Object.entries(scenarios).map(([name, scenario]) => scenario.probability * results[name].adoptedTarget),
);
const weightedCheckpoint = sum(
  Object.entries(scenarios).map(([name, scenario]) => scenario.probability * results[name].checkpointValue),
);

assertClose(weightedTarget, 7.475, 0.000_001, "probability-weighted target");
assertClose(weightedCheckpoint, 6.6388, 0.000_1, "probability-weighted checkpoint");
assertClose(weightedTarget / referencePrice - 1, 0.4347, 0.0001, "expected target return");

console.table(
  Object.fromEntries(
    Object.entries(results).map(([name, result]) => [
      name,
      Object.fromEntries(
        Object.entries(result).map(([key, value]) => [key, Number(value.toFixed(3))]),
      ),
    ]),
  ),
);
console.log(`Weighted target: $${weightedTarget.toFixed(3)}`);
console.log(`Weighted six-month checkpoint: $${weightedCheckpoint.toFixed(3)}`);
console.log("SNAP 2026-08-21 valuation verification: PASS");

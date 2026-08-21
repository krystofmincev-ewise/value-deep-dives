import assert from "node:assert/strict";

function close(actual, expected, tolerance, label) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`,
  );
}

const regions = ["northAmerica", "europe", "restOfWorld"];

// Q2 2026 reported inputs, in millions of dollars or millions of DAUs.
const reported = {
  revenue: {
    northAmerica: 942.9,
    europe: 353.8,
    restOfWorld: 302.3,
  },
  dau: {
    northAmerica: 92,
    europe: 98,
    restOfWorld: 303,
  },
  totalRevenue: 1_598.993,
  advertisingRevenue: 1_282.522,
  otherRevenue: 316.471,
  costOfRevenue: 667.883,
  salesAndMarketing: 298.399,
  salesAndMarketingSbc: 47.342,
  salesAndMarketingDepreciation: 7.711,
  researchAndDevelopment: 542.094,
  generalAndAdministrative: 261.338,
  operatingLoss: 170.721,
};

const regionalRevenueTotal = Object.values(reported.revenue).reduce(
  (total, value) => total + value,
  0,
);
const regionalDauTotal = Object.values(reported.dau).reduce(
  (total, value) => total + value,
  0,
);
const cashLikeSalesAndMarketing =
  reported.salesAndMarketing -
  reported.salesAndMarketingSbc -
  reported.salesAndMarketingDepreciation;

close(regionalRevenueTotal, reported.totalRevenue, 0.1, "regional revenue total");
close(regionalDauTotal, 493, 0.000_001, "regional DAU total");
close(
  reported.totalRevenue -
    reported.costOfRevenue -
    reported.salesAndMarketing -
    reported.researchAndDevelopment -
    reported.generalAndAdministrative,
  -reported.operatingLoss,
  0.001,
  "GAAP operating loss reconciliation",
);

function modelRegionalEconomics({
  otherRevenueShares,
  relativeAdPrice,
  userLoadWeight,
  otherCostOfRevenueRate,
  directlyAttributableCashSalesShare,
}) {
  close(
    Object.values(otherRevenueShares).reduce((total, value) => total + value, 0),
    1,
    0.000_001,
    "Other Revenue shares",
  );

  const advertisingRevenue = Object.fromEntries(
    regions.map((region) => [
      region,
      reported.revenue[region] -
        reported.otherRevenue * otherRevenueShares[region],
    ]),
  );
  close(
    Object.values(advertisingRevenue).reduce((total, value) => total + value, 0),
    reported.advertisingRevenue,
    0.1,
    "regional advertising revenue",
  );

  const monetizedImpressionUnits = Object.fromEntries(
    regions.map((region) => [
      region,
      advertisingRevenue[region] / relativeAdPrice[region],
    ]),
  );
  const monetizedImpressionUnitsTotal = Object.values(
    monetizedImpressionUnits,
  ).reduce((total, value) => total + value, 0);

  const otherCostOfRevenue =
    otherCostOfRevenueRate * reported.totalRevenue;
  const infrastructureCost = reported.costOfRevenue - otherCostOfRevenue;
  assert.ok(infrastructureCost > 0, "implied infrastructure cost must be positive");

  const directlyAttributableCashSalesAndMarketing =
    cashLikeSalesAndMarketing * directlyAttributableCashSalesShare;

  const output = {};
  for (const region of regions) {
    const dauShare = reported.dau[region] / regionalDauTotal;
    const monetizedImpressionShare =
      monetizedImpressionUnits[region] / monetizedImpressionUnitsTotal;
    const infrastructureShare =
      userLoadWeight * dauShare +
      (1 - userLoadWeight) * monetizedImpressionShare;
    const allocatedInfrastructure = infrastructureCost * infrastructureShare;
    const allocatedOtherCostOfRevenue =
      otherCostOfRevenue * (reported.revenue[region] / reported.totalRevenue);
    const grossContribution =
      reported.revenue[region] -
      allocatedInfrastructure -
      allocatedOtherCostOfRevenue;
    const allocatedDirectCashSalesAndMarketing =
      directlyAttributableCashSalesAndMarketing *
      (advertisingRevenue[region] / reported.advertisingRevenue);
    const contributionAfterDirectCashSales =
      grossContribution - allocatedDirectCashSalesAndMarketing;
    const allocatedAllGaapSalesAndMarketing =
      reported.salesAndMarketing *
      (advertisingRevenue[region] / reported.advertisingRevenue);

    output[region] = {
      advertisingRevenue: advertisingRevenue[region],
      dauShare,
      monetizedImpressionShare,
      infrastructureShare,
      allocatedInfrastructure,
      allocatedOtherCostOfRevenue,
      grossContribution,
      grossContributionMargin: grossContribution / reported.revenue[region],
      allocatedDirectCashSalesAndMarketing,
      contributionAfterDirectCashSales,
      contributionAfterDirectCashSalesMargin:
        contributionAfterDirectCashSales / reported.revenue[region],
      contributionAfterAllGaapSalesAndMarketing:
        grossContribution - allocatedAllGaapSalesAndMarketing,
      contributionAfterAllGaapSalesAndMarketingMargin:
        (grossContribution - allocatedAllGaapSalesAndMarketing) /
        reported.revenue[region],
    };
  }

  close(
    regions.reduce(
      (total, region) => total + output[region].allocatedInfrastructure,
      0,
    ),
    infrastructureCost,
    0.000_001,
    "allocated infrastructure",
  );
  close(
    regions.reduce(
      (total, region) => total + output[region].grossContribution,
      0,
    ),
    reported.totalRevenue - reported.costOfRevenue,
    0.1,
    "reported gross profit",
  );

  return {
    output,
    otherCostOfRevenue,
    infrastructureCost,
    directlyAttributableCashSalesAndMarketing,
  };
}

const baseAssumptions = {
  // Subscription geography is not disclosed. The base case puts 45% of Other
  // Revenue in North America, 25% in Europe and 30% in Rest of World.
  otherRevenueShares: {
    northAmerica: 0.45,
    europe: 0.25,
    restOfWorld: 0.30,
  },
  // Advertiser-facing country evidence supports a broad 45%-75% Europe/NA
  // and 15%-40% RoW/NA yield range. These are base indices, not reported CPMs.
  relativeAdPrice: {
    northAmerica: 1,
    europe: 0.60,
    restOfWorld: 0.25,
  },
  // Infrastructure is allocated 60% by DAU and 40% by inferred monetized
  // impressions. This avoids both pure-user and pure-revenue extremes.
  userLoadWeight: 0.60,
  otherCostOfRevenueRate: 0.165,
  // S&M contains sales, marketing, partnerships and customer service. Allocate
  // 75% of the cash-like amount to regions and retain 25% as central.
  directlyAttributableCashSalesShare: 0.75,
};

const base = modelRegionalEconomics(baseAssumptions);

const expectedBase = {
  northAmerica: {
    impressionShare: 0.38343,
    infrastructureShare: 0.26534,
    grossMargin: 0.72130,
    directContributionMargin: 0.60049,
    allGaapSalesContributionMargin: 0.52377,
  },
  europe: {
    impressionShare: 0.21928,
    infrastructureShare: 0.20698,
    grossMargin: 0.59862,
    directContributionMargin: 0.48814,
    allGaapSalesContributionMargin: 0.41799,
  },
  restOfWorld: {
    impressionShare: 0.39729,
    infrastructureShare: 0.52768,
    grossMargin: 0.12971,
    directContributionMargin: 0.03210,
    allGaapSalesContributionMargin: -0.02988,
  },
};

for (const region of regions) {
  close(
    base.output[region].monetizedImpressionShare,
    expectedBase[region].impressionShare,
    0.000_01,
    `${region} base monetized-impression share`,
  );
  close(
    base.output[region].infrastructureShare,
    expectedBase[region].infrastructureShare,
    0.000_01,
    `${region} base infrastructure share`,
  );
  close(
    base.output[region].grossContributionMargin,
    expectedBase[region].grossMargin,
    0.000_01,
    `${region} base gross margin`,
  );
  close(
    base.output[region].contributionAfterDirectCashSalesMargin,
    expectedBase[region].directContributionMargin,
    0.000_01,
    `${region} base direct contribution margin`,
  );
  close(
    base.output[region].contributionAfterAllGaapSalesAndMarketingMargin,
    expectedBase[region].allGaapSalesContributionMargin,
    0.000_01,
    `${region} base contribution after all GAAP S&M`,
  );
}

// A mechanical sensitivity grid, not a probability distribution. Report the
// middle 80% to avoid presenting implausible corner combinations as a forecast.
const sensitivity = Object.fromEntries(
  regions.map((region) => [
    region,
    { grossContributionMargin: [], directContributionMargin: [] },
  ]),
);

for (const northAmericaOtherShare of [0.40, 0.45, 0.50, 0.55]) {
  for (const europeOtherShare of [0.20, 0.25, 0.30]) {
    const restOfWorldOtherShare =
      1 - northAmericaOtherShare - europeOtherShare;
    if (restOfWorldOtherShare < 0.15 || restOfWorldOtherShare > 0.40) continue;

    for (const europePriceIndex of [0.45, 0.60, 0.75]) {
      for (const restOfWorldPriceIndex of [0.15, 0.25, 0.40]) {
        for (const userLoadWeight of [0.40, 0.60, 0.80]) {
          for (const otherCostOfRevenueRate of [0.16, 0.165, 0.17]) {
            for (const directlyAttributableCashSalesShare of [0.65, 0.75, 0.85]) {
              const scenario = modelRegionalEconomics({
                otherRevenueShares: {
                  northAmerica: northAmericaOtherShare,
                  europe: europeOtherShare,
                  restOfWorld: restOfWorldOtherShare,
                },
                relativeAdPrice: {
                  northAmerica: 1,
                  europe: europePriceIndex,
                  restOfWorld: restOfWorldPriceIndex,
                },
                userLoadWeight,
                otherCostOfRevenueRate,
                directlyAttributableCashSalesShare,
              });

              for (const region of regions) {
                sensitivity[region].grossContributionMargin.push(
                  scenario.output[region].grossContributionMargin,
                );
                sensitivity[region].directContributionMargin.push(
                  scenario.output[region]
                    .contributionAfterDirectCashSalesMargin,
                );
              }
            }
          }
        }
      }
    }
  }
}

function quantile(values, probability) {
  const sorted = values.toSorted((left, right) => left - right);
  return sorted[Math.floor((sorted.length - 1) * probability)];
}

const expectedSensitivity = {
  northAmerica: { grossP10: 0.69716, grossP90: 0.74315, directP10: 0.57249, directP90: 0.63205 },
  europe: { grossP10: 0.56137, grossP90: 0.62625, directP10: 0.44616, directP90: 0.52134 },
  restOfWorld: { grossP10: 0.04248, grossP90: 0.24220, directP10: -0.06197, directP90: 0.14026 },
};

const summary = {};
for (const region of regions) {
  summary[region] = {
    baseGrossMargin: base.output[region].grossContributionMargin,
    grossP10: quantile(sensitivity[region].grossContributionMargin, 0.10),
    grossP90: quantile(sensitivity[region].grossContributionMargin, 0.90),
    baseDirectContributionMargin:
      base.output[region].contributionAfterDirectCashSalesMargin,
    directP10: quantile(sensitivity[region].directContributionMargin, 0.10),
    directP90: quantile(sensitivity[region].directContributionMargin, 0.90),
    allGaapSalesContributionMargin:
      base.output[region].contributionAfterAllGaapSalesAndMarketingMargin,
  };

  for (const [metric, expected] of Object.entries(expectedSensitivity[region])) {
    close(summary[region][metric], expected, 0.000_01, `${region} ${metric}`);
  }
}

const centralGaapSalesAndMarketing =
  reported.salesAndMarketing - base.directlyAttributableCashSalesAndMarketing;
close(
  regions.reduce(
    (total, region) =>
      total + base.output[region].contributionAfterDirectCashSales,
    0,
  ) -
    centralGaapSalesAndMarketing -
    reported.researchAndDevelopment -
    reported.generalAndAdministrative,
  -reported.operatingLoss,
  0.1,
  "regional-to-company operating-loss reconciliation",
);

console.table(summary);
console.log({
  modeledQ2InfrastructureResidualCost: base.infrastructureCost,
  otherCostOfRevenue: base.otherCostOfRevenue,
  cashLikeSalesAndMarketing,
  directlyAttributableCashSalesAndMarketing:
    base.directlyAttributableCashSalesAndMarketing,
  sensitivityScenarioCount:
    sensitivity.northAmerica.grossContributionMargin.length,
});
console.log("SNAP regional-economics verification: PASS");

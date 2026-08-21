import assert from "node:assert/strict";

const trailingAdvertisingRevenue = 5.328;

const scenarios = {
  bear: {
    weight: 0.25,
    forecastAdvertisingRevenue: 5.545,
    growthWithoutFurtherRecommenderProgress: 0.035,
    advertisingRevenueMultiple: 0.7,
    dilutedShares: 1.98,
  },
  base: {
    weight: 0.55,
    forecastAdvertisingRevenue: 6.048,
    growthWithoutFurtherRecommenderProgress: 0.09,
    advertisingRevenueMultiple: 1.8,
    dilutedShares: 1.92,
  },
  bull: {
    weight: 0.20,
    forecastAdvertisingRevenue: 6.422,
    growthWithoutFurtherRecommenderProgress: 0.125,
    advertisingRevenueMultiple: 2.8,
    dilutedShares: 1.88,
  },
};

const rows = Object.entries(scenarios).map(([scenario, values]) => {
  const revenueWithoutFurtherRecommenderProgress =
    trailingAdvertisingRevenue *
    (1 + values.growthWithoutFurtherRecommenderProgress);
  const embeddedRevenue =
    values.forecastAdvertisingRevenue -
    revenueWithoutFurtherRecommenderProgress;
  const embeddedLift =
    values.forecastAdvertisingRevenue /
      revenueWithoutFurtherRecommenderProgress -
    1;
  const valuePerShare =
    (embeddedRevenue * values.advertisingRevenueMultiple) /
    values.dilutedShares;

  return {
    scenario,
    forecast_growth_pct:
      (values.forecastAdvertisingRevenue / trailingAdvertisingRevenue - 1) * 100,
    no_further_progress_growth_pct:
      values.growthWithoutFurtherRecommenderProgress * 100,
    embedded_lift_pct: embeddedLift * 100,
    embedded_revenue_usd_m: embeddedRevenue * 1_000,
    embedded_sotp_value_per_share: valuePerShare,
    weighted_value_per_share: valuePerShare * values.weight,
  };
});

const probabilityWeightedValuePerShare = rows.reduce(
  (sum, row) => sum + row.weighted_value_per_share,
  0,
);

assert.equal(
  Object.values(scenarios).reduce((sum, scenario) => sum + scenario.weight, 0),
  1,
);
assert.ok(Math.abs(rows[0].embedded_revenue_usd_m - 30.52) < 0.01);
assert.ok(Math.abs(rows[1].embedded_revenue_usd_m - 240.48) < 0.01);
assert.ok(Math.abs(rows[2].embedded_revenue_usd_m - 428.0) < 0.01);
assert.ok(Math.abs(rows[1].embedded_sotp_value_per_share - 0.2255) < 0.001);
assert.ok(Math.abs(probabilityWeightedValuePerShare - 0.2542) < 0.001);

console.table(
  rows.map((row) => ({
    scenario: row.scenario,
    forecast_growth_pct: row.forecast_growth_pct.toFixed(2),
    no_further_progress_growth_pct:
      row.no_further_progress_growth_pct.toFixed(2),
    embedded_lift_pct: row.embedded_lift_pct.toFixed(2),
    embedded_revenue_usd_m: row.embedded_revenue_usd_m.toFixed(2),
    embedded_sotp_value_per_share:
      row.embedded_sotp_value_per_share.toFixed(3),
  })),
);
console.log(
  `Probability-weighted embedded SOTP value per share: $${probabilityWeightedValuePerShare.toFixed(3)}`,
);

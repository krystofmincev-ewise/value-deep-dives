import assert from "node:assert/strict";

const historicalRevenue = {
  q3_2024: 1.373,
  q4_2024: 1.557,
  q1_2025: 1.363,
  q2_2025: 1.345,
  q3_2025: 1.507,
  q4_2025: 1.716,
  q1_2026: 1.529,
  q2_2026: 1.599,
};

const baseRevenue = {
  q2_2026: 1.599,
  q3_2026: 1.760,
  q4_2026: 2.040,
  q1_2027: 1.803,
  q2_2027: 1.880,
};

const historicalAdvertising = {
  q2_2025: 1.1735,
  q3_2025: 1.317,
  q4_2025: 1.484,
  q1_2026: 1.244,
  q2_2026: 1.2825,
};

const baseAdvertising = {
  q2_2026: 1.2825,
  q3_2026: 1.475,
  q4_2026: 1.692,
  q1_2027: 1.418,
  q2_2027: 1.463,
};

const change = (current, prior) => current / prior - 1;

const transitions = {
  reported_q2_to_q3_2025: change(
    historicalRevenue.q3_2025,
    historicalRevenue.q2_2025,
  ),
  reported_q3_to_q4_2024: change(
    historicalRevenue.q4_2024,
    historicalRevenue.q3_2024,
  ),
  reported_q3_to_q4_2025: change(
    historicalRevenue.q4_2025,
    historicalRevenue.q3_2025,
  ),
  reported_q4_to_q1_2025: change(
    historicalRevenue.q1_2025,
    historicalRevenue.q4_2024,
  ),
  reported_q4_to_q1_2026: change(
    historicalRevenue.q1_2026,
    historicalRevenue.q4_2025,
  ),
  reported_q1_to_q2_2025: change(
    historicalRevenue.q2_2025,
    historicalRevenue.q1_2025,
  ),
  reported_q1_to_q2_2026: change(
    historicalRevenue.q2_2026,
    historicalRevenue.q1_2026,
  ),
  base_q2_to_q3_2026: change(baseRevenue.q3_2026, baseRevenue.q2_2026),
  base_q3_to_q4_2026: change(baseRevenue.q4_2026, baseRevenue.q3_2026),
  base_q4_to_q1_2027: change(baseRevenue.q1_2027, baseRevenue.q4_2026),
  base_q1_to_q2_2027: change(baseRevenue.q2_2027, baseRevenue.q1_2027),
  reported_ads_q2_to_q3_2025: change(
    historicalAdvertising.q3_2025,
    historicalAdvertising.q2_2025,
  ),
  reported_ads_q3_to_q4_2025: change(
    historicalAdvertising.q4_2025,
    historicalAdvertising.q3_2025,
  ),
  reported_ads_q4_to_q1_2026: change(
    historicalAdvertising.q1_2026,
    historicalAdvertising.q4_2025,
  ),
  reported_ads_q1_to_q2_2026: change(
    historicalAdvertising.q2_2026,
    historicalAdvertising.q1_2026,
  ),
  base_ads_q2_to_q3_2026: change(
    baseAdvertising.q3_2026,
    baseAdvertising.q2_2026,
  ),
  base_ads_q3_to_q4_2026: change(
    baseAdvertising.q4_2026,
    baseAdvertising.q3_2026,
  ),
  base_ads_q4_to_q1_2027: change(
    baseAdvertising.q1_2027,
    baseAdvertising.q4_2026,
  ),
  base_ads_q1_to_q2_2027: change(
    baseAdvertising.q2_2027,
    baseAdvertising.q1_2027,
  ),
};

assert.ok(Math.abs(transitions.reported_q2_to_q3_2025 - 0.12045) < 0.0001);
assert.ok(Math.abs(transitions.reported_q3_to_q4_2024 - 0.13401) < 0.0001);
assert.ok(Math.abs(transitions.reported_q3_to_q4_2025 - 0.13869) < 0.0001);
assert.ok(Math.abs(transitions.reported_q4_to_q1_2025 + 0.12460) < 0.0001);
assert.ok(Math.abs(transitions.reported_q4_to_q1_2026 + 0.10900) < 0.0001);
assert.ok(Math.abs(transitions.reported_q1_to_q2_2025 + 0.01321) < 0.0001);
assert.ok(Math.abs(transitions.reported_q1_to_q2_2026 - 0.04578) < 0.0001);
assert.ok(Math.abs(transitions.base_q2_to_q3_2026 - 0.10069) < 0.0001);
assert.ok(Math.abs(transitions.base_q3_to_q4_2026 - 0.15909) < 0.0001);
assert.ok(Math.abs(transitions.base_q4_to_q1_2027 + 0.11618) < 0.0001);
assert.ok(Math.abs(transitions.base_q1_to_q2_2027 - 0.04271) < 0.0001);
assert.ok(Math.abs(transitions.reported_ads_q2_to_q3_2025 - 0.12228) < 0.0001);
assert.ok(Math.abs(transitions.reported_ads_q3_to_q4_2025 - 0.12680) < 0.0001);
assert.ok(Math.abs(transitions.reported_ads_q4_to_q1_2026 + 0.16173) < 0.0001);
assert.ok(Math.abs(transitions.reported_ads_q1_to_q2_2026 - 0.03095) < 0.0001);
assert.ok(Math.abs(transitions.base_ads_q2_to_q3_2026 - 0.15010) < 0.0001);
assert.ok(Math.abs(transitions.base_ads_q3_to_q4_2026 - 0.14712) < 0.0001);
assert.ok(Math.abs(transitions.base_ads_q4_to_q1_2027 + 0.16194) < 0.0001);
assert.ok(Math.abs(transitions.base_ads_q1_to_q2_2027 - 0.03173) < 0.0001);

const reportedQ2Advertising = 1.2825;
const baseQ2_2027Advertising = 1.463;
const diagnosticRevenueMultiple = 2.2;
const baseDilutedShares = 1.92;
const worldCupSensitivity = [0, 0.01, 0.02, 0.03].map((assumedShare) => {
  const normalizedQ2_2026Advertising =
    reportedQ2Advertising * (1 - assumedShare);
  const likeForLikeRevenueReduction =
    reportedQ2Advertising * assumedShare * 1.14;
  return {
    assumedShare,
    normalizedQ2_2026Advertising,
    growthToBaseQ2_2027:
      baseQ2_2027Advertising / normalizedQ2_2026Advertising - 1,
    likeForLikeRevenueReduction,
    valuePerShare:
      (likeForLikeRevenueReduction * diagnosticRevenueMultiple) /
      baseDilutedShares,
  };
});

assert.ok(
  Math.abs(worldCupSensitivity[0].growthToBaseQ2_2027 - 0.14074) < 0.0001,
);
assert.ok(
  Math.abs(worldCupSensitivity[1].growthToBaseQ2_2027 - 0.15226) < 0.0001,
);
assert.ok(
  Math.abs(worldCupSensitivity[2].growthToBaseQ2_2027 - 0.16403) < 0.0001,
);
assert.ok(
  Math.abs(worldCupSensitivity[3].growthToBaseQ2_2027 - 0.17603) < 0.0001,
);
assert.ok(Math.abs(worldCupSensitivity[1].valuePerShare - 0.01675) < 0.0001);
assert.ok(Math.abs(worldCupSensitivity[2].valuePerShare - 0.03351) < 0.0001);
assert.ok(Math.abs(worldCupSensitivity[3].valuePerShare - 0.05026) < 0.0001);

const twoYearQ2PriceIndex = 0.90 * 1.10;
assert.ok(Math.abs(twoYearQ2PriceIndex - 0.99) < 0.00001);

const politicalArchiveUsdBillions = {
  y2024: 0.027686019,
  y2025: 0.003703268,
  y2026ThroughCutoff: 0.002697994,
};
const electionHighCaseDifference =
  politicalArchiveUsdBillions.y2024 - politicalArchiveUsdBillions.y2025;
const electionValuePerShare =
  (electionHighCaseDifference * diagnosticRevenueMultiple) /
  baseDilutedShares;
assert.ok(Math.abs(electionValuePerShare - 0.02748) < 0.00001);

const annualRevenue = {
  total: { y2023: 4.606, y2024: 5.361, y2025: 5.931 },
  advertising: { y2023: 4.408, y2024: 4.904, y2025: 5.186 },
};
const politicalArchiveProxy = {
  y2023: 0.003194148,
  y2024: politicalArchiveUsdBillions.y2024,
  y2025: politicalArchiveUsdBillions.y2025,
};
const politicalNormalizedGrowth = (series, currentYear, priorYear) =>
  (series[currentYear] - politicalArchiveProxy[currentYear]) /
    (series[priorYear] - politicalArchiveProxy[priorYear]) -
  1;

const electionComparisonBase = {
  total2024Reported: change(annualRevenue.total.y2024, annualRevenue.total.y2023),
  total2024Normalized: politicalNormalizedGrowth(
    annualRevenue.total,
    "y2024",
    "y2023",
  ),
  total2025Reported: change(annualRevenue.total.y2025, annualRevenue.total.y2024),
  total2025Normalized: politicalNormalizedGrowth(
    annualRevenue.total,
    "y2025",
    "y2024",
  ),
  advertising2024Reported: change(
    annualRevenue.advertising.y2024,
    annualRevenue.advertising.y2023,
  ),
  advertising2024Normalized: politicalNormalizedGrowth(
    annualRevenue.advertising,
    "y2024",
    "y2023",
  ),
  advertising2025Reported: change(
    annualRevenue.advertising.y2025,
    annualRevenue.advertising.y2024,
  ),
  advertising2025Normalized: politicalNormalizedGrowth(
    annualRevenue.advertising,
    "y2025",
    "y2024",
  ),
};

assert.ok(Math.abs(electionComparisonBase.total2024Reported - 0.16392) < 0.0001);
assert.ok(Math.abs(electionComparisonBase.total2024Normalized - 0.15871) < 0.0001);
assert.ok(Math.abs(electionComparisonBase.total2025Reported - 0.10632) < 0.0001);
assert.ok(Math.abs(electionComparisonBase.total2025Normalized - 0.11137) < 0.0001);
assert.ok(Math.abs(electionComparisonBase.advertising2024Reported - 0.11252) < 0.0001);
assert.ok(Math.abs(electionComparisonBase.advertising2024Normalized - 0.10704) < 0.0001);
assert.ok(Math.abs(electionComparisonBase.advertising2025Reported - 0.05750) < 0.0001);
assert.ok(Math.abs(electionComparisonBase.advertising2025Normalized - 0.06275) < 0.0001);

const calendarTiming = {
  thanksgiving2025: "2025-11-27",
  thanksgiving2026: "2026-11-26",
  christmas2025: "2025-12-25",
  christmas2026: "2026-12-25",
  easter2026: "2026-04-05",
  easter2027: "2027-03-28",
};
const daysBetween = (later, earlier) =>
  (Date.parse(`${later}T00:00:00Z`) - Date.parse(`${earlier}T00:00:00Z`)) /
  86_400_000;
assert.equal(
  daysBetween(calendarTiming.christmas2026, calendarTiming.thanksgiving2026) -
    daysBetween(calendarTiming.christmas2025, calendarTiming.thanksgiving2025),
  1,
);
assert.equal(new Date(`${calendarTiming.easter2026}T00:00:00Z`).getUTCMonth(), 3);
assert.equal(new Date(`${calendarTiming.easter2027}T00:00:00Z`).getUTCMonth(), 2);

const q1_2026Advertising = 1.244;
const q1_2027BaseAdvertising = 1.418;
const normalizedQ1Growth = [0.020, 0.025].map(
  (headwind) => q1_2027BaseAdvertising / (q1_2026Advertising + headwind) - 1,
);
assert.ok(Math.abs(normalizedQ1Growth[0] - 0.12184) < 0.0001);
assert.ok(Math.abs(normalizedQ1Growth[1] - 0.11742) < 0.0001);

const q3MixSensitivity = {
  publishedAdvertising: 1.475,
  publishedOther: 0.285,
  flatSequentialOther: 0.316,
  reportedQ3_2025Advertising: 1.317,
  reportedQ3_2025Other: 0.190,
  reportedTrailingAdvertising: 5.328,
  reportedTrailingOther: 1.023,
  publishedNextFourQuarterAdvertising: 6.048,
  publishedNextFourQuarterOther: 1.435,
};
q3MixSensitivity.flatSequentialAdvertising =
  q3MixSensitivity.publishedAdvertising +
  q3MixSensitivity.publishedOther -
  q3MixSensitivity.flatSequentialOther;
q3MixSensitivity.adjustedNextFourQuarterAdvertising =
  q3MixSensitivity.publishedNextFourQuarterAdvertising -
  (q3MixSensitivity.publishedAdvertising -
    q3MixSensitivity.flatSequentialAdvertising);
q3MixSensitivity.adjustedNextFourQuarterOther =
  q3MixSensitivity.publishedNextFourQuarterOther +
  (q3MixSensitivity.flatSequentialOther - q3MixSensitivity.publishedOther);

assert.ok(Math.abs(q3MixSensitivity.flatSequentialAdvertising - 1.444) < 0.00001);
assert.ok(
  Math.abs(
    change(
      q3MixSensitivity.flatSequentialAdvertising,
      q3MixSensitivity.reportedQ3_2025Advertising,
    ) - 0.09643,
  ) < 0.0001,
);

const q3WorldCupCapitalization = [0, 0.01, 0.02, 0.03].map(
  (assumedShare) => {
    const eventRevenue = baseAdvertising.q3_2026 * assumedShare;
    return {
      assumedShare,
      eventNormalizedNextFourQuarterRevenue: 7.483 - eventRevenue,
      revenueMultipleValueReduction:
        (eventRevenue * diagnosticRevenueMultiple) / baseDilutedShares,
      sotpValueReduction: (eventRevenue * 1.8) / baseDilutedShares,
    };
  },
);

assert.ok(
  Math.abs(
    q3WorldCupCapitalization[1].eventNormalizedNextFourQuarterRevenue - 7.46825,
  ) < 0.00001,
);
assert.ok(
  Math.abs(q3WorldCupCapitalization[3].revenueMultipleValueReduction - 0.05070) <
    0.0001,
);
assert.ok(
  Math.abs(q3WorldCupCapitalization[3].sotpValueReduction - 0.04148) < 0.0001,
);
assert.ok(
  Math.abs(
    change(
      q3MixSensitivity.adjustedNextFourQuarterAdvertising,
      q3MixSensitivity.reportedTrailingAdvertising,
    ) - 0.12932,
  ) < 0.0001,
);
assert.ok(
  Math.abs(
    change(
      q3MixSensitivity.adjustedNextFourQuarterOther,
      q3MixSensitivity.reportedTrailingOther,
    ) - 0.43304,
  ) < 0.0001,
);

console.table(
  Object.entries(transitions).map(([transition, value]) => ({
    transition,
    sequential_change_pct: (value * 100).toFixed(2),
  })),
);
console.table(
  q3WorldCupCapitalization.map((row) => ({
    assumed_q3_world_cup_share_pct: (row.assumedShare * 100).toFixed(0),
    event_normalized_next_four_quarter_revenue_usd_b:
      row.eventNormalizedNextFourQuarterRevenue.toFixed(3),
    revenue_multiple_value_reduction_per_share:
      row.revenueMultipleValueReduction.toFixed(3),
    sotp_value_reduction_per_share: row.sotpValueReduction.toFixed(3),
  })),
);
console.table(
  worldCupSensitivity.map((row) => ({
    assumed_world_cup_share_pct: (row.assumedShare * 100).toFixed(0),
    normalized_q2_2026_ad_revenue_usd_b:
      row.normalizedQ2_2026Advertising.toFixed(3),
    growth_to_q2_2027_base_pct: (row.growthToBaseQ2_2027 * 100).toFixed(2),
    like_for_like_revenue_reduction_usd_m:
      (row.likeForLikeRevenueReduction * 1_000).toFixed(1),
    diagnostic_value_per_share: row.valuePerShare.toFixed(3),
  })),
);
console.log(
  `A 2024-like versus 2025 political-archive difference is approximately $${electionValuePerShare.toFixed(3)} per share at the diagnostic multiple.`,
);
console.log(
  `Flat-sequential Q3 Other implies $${q3MixSensitivity.flatSequentialAdvertising.toFixed(3)}bn advertising, ${(change(q3MixSensitivity.flatSequentialAdvertising, q3MixSensitivity.reportedQ3_2025Advertising) * 100).toFixed(2)}% YoY.`,
);
console.log("SNAP seasonality and event normalization verification: PASS");

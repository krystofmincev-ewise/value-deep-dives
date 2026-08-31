#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { validateOperatingForecastContract } from "../../../scripts/lib/operating-forecast.mjs";
import { runModel } from "./model-2026-W35-distribution.mjs";

const directory = dirname(fileURLToPath(import.meta.url));
const contract = JSON.parse(
  await readFile(resolve(directory, "2026-W35-valuation-contract.json"), "utf8"),
);
const operatingContract = JSON.parse(
  await readFile(resolve(directory, "2026-W35-operating-forecast-contract.json"), "utf8"),
);
const output = runModel({
  seed: contract.model.seed,
  sampleCount: contract.model.sample_count,
});

function assertClose(actual, expected, label, tolerance = 0.0001) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label} does not reconcile: ${actual} vs ${expected}`);
  }
}

if (output.referencePrice !== contract.reference_price) {
  throw new Error("Reference price does not reconcile.");
}
if (output.formalMethod !== "sum_of_parts") {
  throw new Error("Formal method must remain sum_of_parts.");
}
if (output.calibrationStatus !== contract.model.calibration_status) {
  throw new Error("Calibration status does not reconcile.");
}
if (contract.model.version !== "wix_causal_sotp_capital_path_v5") {
  throw new Error("Unexpected Wix model version.");
}

const pairs = [
  [contract.horizons[0], output.sixMonth, "six_month"],
  [contract.horizons[1], output.twelveMonth, "twelve_month"],
];
const fields = [
  "p10",
  "p50",
  "p90",
  "mean",
  "probability_below_reference",
  "probability_loss_30_pct",
  "probability_loss_50_pct",
  "bottom_decile_mean",
];

for (const [record, calculated, label] of pairs) {
  for (const field of fields) {
    assertClose(calculated[field], record[field], `${label}.${field}`);
  }
}

assertClose(
  output.relationship.value_correlation,
  contract.horizon_relationship.value_correlation,
  "horizon correlation",
);
assertClose(
  output.relationship.probability_later_above_earlier,
  contract.horizon_relationship.probability_later_above_earlier,
  "later-above-earlier probability",
);

for (const [index, band] of contract.horizon_relationship.transition_bands.entries()) {
  const calculated = output.relationship.transition_bands[index];
  for (const field of [
    "earlier_band_sample_probability",
    "later_mean",
    "later_median",
    "later_probability_below_reference",
  ]) {
    assertClose(calculated[field], band[field], `transition_bands[${index}].${field}`);
  }
}

const diagnosticsExpected = {
  twelveMonthDcfMedian: 77.529,
  twelveMonthOwnerFcffMultipleMedian: 105.7821,
  twelveMonthSotpMedian: 127.7393,
  twelveMonthAboveConversionStrike: 0.05817,
  twelveMonthAboveCappedCallCap: 0.00211,
  twelveMonthMeanNetClaims: 0.739038,
  jointStateVarianceShare: 0.813731,
  coreHealthVarianceShare: 0.443421,
  base44AdoptionVarianceShare: 0.384839,
};
const diagnosticsCalculated = {
  twelveMonthDcfMedian: output.diagnostics.method_medians.twelve_month.dcf,
  twelveMonthOwnerFcffMultipleMedian:
    output.diagnostics.method_medians.twelve_month.ownerFcffMultiple,
  twelveMonthSotpMedian: output.diagnostics.method_medians.twelve_month.sotp,
  twelveMonthAboveConversionStrike:
    output.diagnostics.capitalization_convention
      .twelve_month_probability_formal_value_above_conversion_strike,
  twelveMonthAboveCappedCallCap:
    output.diagnostics.capitalization_convention
      .twelve_month_probability_formal_value_above_capped_call_cap,
  twelveMonthMeanNetClaims:
    output.relationship.capital_path_diagnostics.mean_twelve_month_net_claims,
  jointStateVarianceShare:
    output.diagnostics.variance_attribution.joint_state.between_group_share,
  coreHealthVarianceShare:
    output.diagnostics.variance_attribution.by_node.coreHealth.between_group_share,
  base44AdoptionVarianceShare:
    output.diagnostics.variance_attribution.by_node.base44Adoption.between_group_share,
};
for (const [field, expected] of Object.entries(diagnosticsExpected)) {
  assertClose(diagnosticsCalculated[field], expected, `diagnostic.${field}`);
}

const operatingErrors = validateOperatingForecastContract(operatingContract);
if (operatingErrors.length > 0) {
  throw new Error(`Operating forecast contract failed validation: ${operatingErrors.join(" ")}`);
}
if (operatingContract.model.version !== contract.model.version) {
  throw new Error("Operating and valuation contracts must use the same model version.");
}
if (
  operatingContract.model.seed !== contract.model.seed ||
  operatingContract.model.sample_count !== contract.model.sample_count
) {
  throw new Error("Operating and valuation contracts must use the same seed and sample count.");
}

const operatingForecasts = Object.fromEntries(
  operatingContract.forecasts.map((forecast) => [forecast.id, forecast]),
);
const operatingChecks = [
  ["fy2026_total_arr", output.operatingForecasts.fourMonth.total_arr_bn],
  ["fy2026_base44_arr", output.operatingForecasts.fourMonth.base44_arr_bn],
  ["q4_2026_base44_gross_margin", output.operatingForecasts.fourMonth.base44_gross_margin],
  ["q2_2027_total_arr", output.operatingForecasts.tenMonth.total_arr_bn],
  ["q2_2027_base44_arr", output.operatingForecasts.tenMonth.base44_arr_bn],
];
for (const [identifier, calculated] of operatingChecks) {
  const record = operatingForecasts[identifier];
  if (!record) throw new Error(`Missing operating forecast ${identifier}.`);
  for (const field of ["p10", "p50", "p90"]) {
    assertClose(calculated[field], record[field], `${identifier}.${field}`);
  }
}

const anchoredOperatingExpected = {
  fy2026_revenue: [2.2, 2.26, 2.32],
  fy2026_bookings: [2.25, 2.33, 2.4],
  fy2026_raw_free_cash_flow: [315, 350, 385],
};
for (const [identifier, expected] of Object.entries(anchoredOperatingExpected)) {
  const record = operatingForecasts[identifier];
  if (!record) throw new Error(`Missing anchored operating forecast ${identifier}.`);
  ["p10", "p50", "p90"].forEach((field, index) => {
    assertClose(record[field], expected[index], `${identifier}.${field}`);
  });
}

const focusedStressOptions = { seed: contract.model.seed, sampleCount: 20000 };
const focusedStressBase = runModel(focusedStressOptions).twelveMonth.p50;
const focusedStresses = [
  [{ coreMultiple: 0.5 }, 1, "core multiple"],
  [{ base44Multiple: 2 }, 1, "Base44 multiple"],
  [{ base44CostLoad: 0.1 }, -1, "Base44 owner-cost load"],
  [{ dilutedShares: 2 }, -1, "diluted shares"],
];
for (const [stresses, direction, label] of focusedStresses) {
  const stressed = runModel({ ...focusedStressOptions, stresses }).twelveMonth.p50;
  if (direction * (stressed - focusedStressBase) <= 0) {
    throw new Error(`${label} stress moved in the wrong direction.`);
  }
}

console.log("PASS: Wix v5 valuation model, horizon contract, and operating forecasts reconcile.");

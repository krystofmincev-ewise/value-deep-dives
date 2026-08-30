#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { runModel } from "./model-2026-W35-distribution.mjs";

const directory = dirname(fileURLToPath(import.meta.url));
const contract = JSON.parse(
  await readFile(resolve(directory, "2026-W35-valuation-contract.json"), "utf8"),
);
const output = runModel({
  seed: contract.model.seed,
  sampleCount: contract.model.sample_count,
});

if (output.referencePrice !== contract.reference_price) {
  throw new Error("Reference price does not reconcile.");
}
if (output.formalMethod !== "sum_of_parts") {
  throw new Error("Formal method must remain sum_of_parts.");
}
if (output.calibrationStatus !== contract.model.calibration_status) {
  throw new Error("Calibration status does not reconcile.");
}
if (contract.model.version !== "wix_joint_sotp_capital_path_v4") {
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
    if (Math.abs(record[field] - calculated[field]) > 0.0001) {
      throw new Error(`${label}.${field} does not reconcile: ${record[field]} vs ${calculated[field]}`);
    }
  }
}

if (
  Math.abs(
    contract.horizon_relationship.value_correlation - output.relationship.value_correlation,
  ) > 0.0001
) {
  throw new Error("Horizon correlation does not reconcile.");
}
if (
  Math.abs(
    contract.horizon_relationship.probability_later_above_earlier -
      output.relationship.probability_later_above_earlier,
  ) > 0.0001
) {
  throw new Error("Later-above-earlier probability does not reconcile.");
}

for (const [index, band] of contract.horizon_relationship.transition_bands.entries()) {
  const calculated = output.relationship.transition_bands[index];
  for (const field of [
    "earlier_band_sample_probability",
    "later_mean",
    "later_median",
    "later_probability_below_reference",
  ]) {
    if (Math.abs(band[field] - calculated[field]) > 0.0001) {
      throw new Error(`transition_bands[${index}].${field} does not reconcile.`);
    }
  }
}

const diagnosticsExpected = {
  twelveMonthDcfMedian: 80.5148,
  twelveMonthOwnerFcffMultipleMedian: 109.2519,
  twelveMonthSotpMedian: 130.2736,
  twelveMonthAboveConversionStrike: 0.08188,
  twelveMonthAboveCappedCallCap: 0.00037,
  twelveMonthMeanNetClaims: 0.730048,
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
};
for (const [field, expected] of Object.entries(diagnosticsExpected)) {
  if (Math.abs(diagnosticsCalculated[field] - expected) > 0.0001) {
    throw new Error(`Diagnostic ${field} does not reconcile.`);
  }
}

const sensitivityCases = [
  {
    label: "platform_to_erosion_10pt",
    options: { regimeWeights: { erosion: 0.3, defend: 0.58, platformWin: 0.12 } },
    expected: { p50: 121.2735, mean: 118.6185, probability_below_reference: 0.28662 },
  },
  {
    label: "platform_weight_10pct",
    options: { regimeWeights: { erosion: 0.25, defend: 0.65, platformWin: 0.1 } },
    expected: { p50: 123.3881, mean: 120.4401, probability_below_reference: 0.24186 },
  },
  {
    label: "base44_cost_load_low",
    options: { base44CostLoadShift: -0.15 },
    expected: { p50: 136.526, mean: 138.6582, probability_below_reference: 0.17922 },
  },
  {
    label: "base44_cost_load_high",
    options: { base44CostLoadShift: 0.15 },
    expected: { p50: 124.3602, mean: 126.6534, probability_below_reference: 0.2103 },
  },
];
for (const sensitivity of sensitivityCases) {
  const calculated = runModel({
    seed: contract.model.seed,
    sampleCount: contract.model.sample_count,
    ...sensitivity.options,
  }).twelveMonth;
  for (const [field, expected] of Object.entries(sensitivity.expected)) {
    if (Math.abs(calculated[field] - expected) > 0.0001) {
      throw new Error(`${sensitivity.label}.${field} does not reconcile.`);
    }
  }
}

console.log("PASS: Wix valuation model and horizon contract reconcile.");

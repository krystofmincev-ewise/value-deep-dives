import assert from "node:assert/strict";
import test from "node:test";

import {
  validateOperatingForecastContract,
  scoreOperatingForecastResult,
  weightedIntervalScore,
} from "./lib/operating-forecast.mjs";

function validForecast(overrides = {}) {
  return {
    id: "fy2026_revenue",
    metric: "revenue",
    segment: "consolidated",
    period_end: "2026-12-31",
    resolution_deadline: "2027-03-31",
    unit: "USD_billions",
    source_class: "partially_empirical",
    calibration_status: "three_year_guidance_error_dispersion_plus_current_anchors",
    p10: 2.2,
    p50: 2.26,
    p90: 2.32,
    baselines: { prior_year_actual: 1.993 },
    baseline_provenance: { prior_year_actual: "Official prior-year filing." },
    baseline_known_at: "2026-08-31T23:59:59+02:00",
    baseline_source_ids: { prior_year_actual: ["WIX-FY2025"] },
    scoring_method: "weighted_interval_score_alpha_0_2",
    resolution_source_ids: ["WIX-FY2026-RESULTS"],
    resolution_rule: "Use reported consolidated revenue.",
    unresolvable_rule: "Mark unresolvable if no audited annual result is filed.",
    ...overrides,
  };
}

function validContract(forecasts) {
  return {
    type: "operating_forecast_contract",
    schema_version: 1,
    coverage_cycle_id: "WIX-2026-W35-01",
    status: "frozen",
    as_of: "2026-08-31",
    source_cutoff_at: "2026-08-31T23:59:59+02:00",
    model: {
      version: "test_v1",
      seed: 1,
      sample_count: 100,
      code_path: "model.mjs",
      verifier_path: "verify.mjs",
    },
    calibration_layers: { revenue: "partially empirical" },
    baseline_scoring_method: "degenerate_interval_weighted_interval_score_equivalent_to_absolute_error",
    resolution_policy: "Do not mutate a frozen contract; record outcomes in a separate linked resolution record.",
    forecasts,
    independence_note: "Prospectively frozen.",
  };
}

test("weighted interval score rewards a centered realization", () => {
  const centered = weightedIntervalScore({ p10: 80, p50: 100, p90: 120, actual: 100 });
  const tail = weightedIntervalScore({ p10: 80, p50: 100, p90: 120, actual: 70 });
  assert.equal(centered.absolute_error, 0);
  assert.ok(Math.abs(centered.weighted_interval_score - 8 / 3) < 1e-12);
  assert.ok(Math.abs(tail.weighted_interval_score - 58 / 3) < 1e-12);
  assert.ok(tail.weighted_interval_score > centered.weighted_interval_score);
});

test("operating forecast contract validator enforces ordered intervals and unique ids", () => {
  const contract = validContract([
    validForecast(),
    validForecast({ p10: 2.4, id: "fy2026_revenue" }),
  ]);
  const errors = validateOperatingForecastContract(contract);
  assert.ok(errors.some((error) => error.includes("must be unique")));
  assert.ok(errors.some((error) => error.includes("p10 <= p50 <= p90")));
});

test("valid operating forecast contract passes focused validation", () => {
  const contract = validContract([validForecast()]);
  assert.deepEqual(validateOperatingForecastContract(contract), []);
});

test("operating forecast scorer compares the interval with frozen point baselines", () => {
  const forecast = validForecast({ p10: 2.2, p50: 2.26, p90: 2.32 });
  const result = scoreOperatingForecastResult(forecast, 2.3);
  assert.equal(result.forecast_id, "fy2026_revenue");
  assert.ok(result.forecast.weighted_interval_score < result.baselines.prior_year_actual);
  assert.ok(Math.abs(result.baselines.prior_year_actual - Math.abs(2.3 - 1.993)) < 1e-12);
});

import assert from "node:assert/strict";
import test from "node:test";

import { validateValuationHorizonContract } from "./lib/valuation-horizon.mjs";

// Four equally weighted synthetic outcomes make every conditional statistic
// inspectable. These are mathematical fixtures, not valuation assumptions.
function contractFromPairs(pairs) {
  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const fraction = (values, predicate) => values.filter(predicate).length / values.length;
  const percentile = (ordered, probability) => {
    const position = (ordered.length - 1) * probability;
    const lower = Math.floor(position);
    return ordered[lower] + (ordered[Math.ceil(position)] - ordered[lower]) * (position - lower);
  };
  const earlier = pairs.map(([value]) => value);
  const later = pairs.map(([, value]) => value);
  const earlierMean = mean(earlier);
  const laterMean = mean(later);
  const covariance = mean(pairs.map(([left, right]) => (left - earlierMean) * (right - laterMean)));
  const variance = (values) => mean(values.map((value) => (value - mean(values)) ** 2));
  return {
    type: "valuation_horizon_contract",
    schema_version: 1,
    coverage_cycle_id: "EXM-2026-W34-01",
    valuation_quantity: "fair_value_per_share",
    currency: "USD",
    as_of: "2026-08-22",
    source_cutoff_at: "2026-08-22T20:00:00Z",
    reference_price: 10,
    reference_price_at: "2026-08-20T20:00:00Z",
    reference_price_source: "synthetic_test_fixture",
    primary_horizon: "2027-08-20",
    display_semantics: "distribution_percentiles",
    model: {
      version: "synthetic-joint-fixture",
      method: "four_equally_weighted_draws_linear_quantiles",
      calibration_status: "synthetic_test_fixture",
      seed: 1,
      sample_count: pairs.length,
      code_path: "model.mjs",
      verifier_path: "verify.mjs",
    },
    horizons: [earlier, later].map((values, index) => {
      const ordered = [...values].sort((left, right) => left - right);
      return {
        id: index === 0 ? "six_month" : "twelve_month",
        date: index === 0 ? "2027-02-20" : "2027-08-20",
        months_from_reference: index === 0 ? 6 : 12,
        output_kind: "distribution",
        p10: percentile(ordered, 0.1),
        p50: percentile(ordered, 0.5),
        p90: percentile(ordered, 0.9),
        mean: mean(values),
        probability_below_reference: fraction(values, (value) => value < 10),
        probability_loss_30_pct: fraction(values, (value) => value <= 7),
        probability_loss_50_pct: fraction(values, (value) => value <= 5),
        bottom_decile_mean: ordered[0],
      };
    }),
    horizon_relationship: {
      kind: "joint",
      linkage_method: "Explicit equal-weight pairs; each earlier-state band contains one draw.",
      value_correlation_method: "pearson",
      value_correlation: covariance / Math.sqrt(variance(earlier) * variance(later)),
      probability_later_above_earlier: fraction(pairs, ([left, right]) => right > left),
      transition_bands: pairs.map(([, value], index) => ({
        label: `earlier_quartile_${index + 1}`,
        earlier_band_upper_probability: (index + 1) / pairs.length,
        earlier_band_sample_probability: 1 / pairs.length,
        later_mean: value,
        later_median: value,
        later_probability_below_reference: value < 10 ? 1 : 0,
      })),
      sensitivity_note: "Permuting the later values changes dependence while leaving both marginal distributions unchanged.",
    },
  };
}

function reversedContract() {
  return contractFromPairs([[2, 18], [6, 14], [14, 6], [18, 2]]);
}

test("joint valuation contract accepts valid negative dependence without forcing persistence", () => {
  const record = reversedContract();
  assert.equal(record.horizon_relationship.value_correlation, -1);
  assert.equal(record.horizon_relationship.probability_later_above_earlier, 0.5);
  assert.deepEqual(record.horizon_relationship.transition_bands.map((band) => band.later_mean), [18, 14, 6, 2]);
  assert.deepEqual(record.horizon_relationship.transition_bands.map((band) => band.later_probability_below_reference), [0, 0, 1, 1]);
  assert.deepEqual(validateValuationHorizonContract(record), []);
});

test("joint valuation contract accepts non-monotonic conditional outcomes", () => {
  const record = contractFromPairs([[2, 6], [6, 18], [14, 2], [18, 14]]);
  assert.deepEqual(validateValuationHorizonContract(record), []);
});

test("reversed joint models still require complete valid statistics and ordered probability bands", () => {
  const cases = [
    [(record) => { record.horizon_relationship.value_correlation = -1.01; }, /value_correlation in \[-1, 1\]/],
    [(record) => { record.horizon_relationship.value_correlation = 1.01; }, /value_correlation in \[-1, 1\]/],
    [(record) => { record.horizon_relationship.probability_later_above_earlier = 1.1; }, /requires probability_later_above_earlier/],
    [(record) => { record.horizon_relationship.transition_bands[0].later_mean = -1; }, /later means must be finite and non-negative/],
    [(record) => { record.horizon_relationship.transition_bands[0].later_median = -1; }, /later medians must be finite and non-negative/],
    [(record) => { record.horizon_relationship.transition_bands[0].later_mean = Infinity; }, /later means must be finite and non-negative/],
    [(record) => { delete record.horizon_relationship.transition_bands[0].later_median; }, /later medians must be finite and non-negative/],
    [(record) => { record.horizon_relationship.transition_bands[0].later_probability_below_reference = -0.1; }, /downside probabilities must be in \[0, 1\]/],
    [(record) => { record.horizon_relationship.transition_bands[0].earlier_band_upper_probability = 0.5; }, /strictly increasing earlier_band_upper_probability/],
    [(record) => { record.horizon_relationship.transition_bands.at(-1).earlier_band_upper_probability = 0.99; }, /ending at 1/],
    [(record) => { record.horizon_relationship.transition_bands[0].earlier_band_sample_probability = 0.2; }, /sample probabilities must be positive and sum to 1/],
    [(record) => { record.horizons[0].p10 = 19; }, /P10 <= P50 <= P90/],
    [(record) => { delete record.horizon_relationship.sensitivity_note; }, /linkage sensitivity note/],
  ];
  for (const [mutate, expected] of cases) {
    const record = reversedContract();
    mutate(record);
    assert.match(validateValuationHorizonContract(record).join("\n"), expected);
  }
});

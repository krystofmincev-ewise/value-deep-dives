function tableCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableDivider(line) {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

export function valuationTableSemanticErrors(markdown) {
  const errors = [];
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const scenarioLabel = /\b(?:bear|base|bull|downside|central|upside)\b/i;
  const percentileLabel = /\b(?:p10|p25|p50|p75|p90|percentile)\b/i;

  for (let index = 0; index < lines.length - 1; index += 1) {
    if (!lines[index].includes("|") || !isTableDivider(lines[index + 1])) continue;
    const headers = tableCells(lines[index]);
    if (headers.some((cell) => scenarioLabel.test(cell) && percentileLabel.test(cell))) {
      errors.push(
        "Table headings must not combine narrative scenarios with distribution percentiles.",
      );
    }
    const distributionTable = headers.some((cell) => percentileLabel.test(cell));
    if (!distributionTable) continue;
    for (let row = index + 2; row < lines.length && lines[row].includes("|"); row += 1) {
      if (
        tableCells(lines[row]).some((cell) =>
          /^not model(?:ed|led)$/i.test(cell.replace(/[*_`]/g, "").replace(/[.!]$/, "").trim()),
        )
      ) {
        errors.push(
          "A distribution table must not contain a modeled horizon with an unmodeled output.",
        );
      }
    }
  }

  return [...new Set(errors)];
}

export function validateValuationHorizonContract(record) {
  const errors = [];
  const add = (message) => errors.push(message);
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const probability = (value) => finite(value) && value >= 0 && value <= 1;
  const isoDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  };
  const timestamp = (value) =>
    typeof value === "string" && value.includes("T") && Number.isFinite(Date.parse(value));

  if (record?.type !== "valuation_horizon_contract") add("type must be valuation_horizon_contract.");
  if (record?.schema_version !== 1) add("schema_version must be 1.");
  if (typeof record?.coverage_cycle_id !== "string" || !record.coverage_cycle_id) {
    add("coverage_cycle_id is required.");
  }
  if (
    !new Set([
      "fair_value_per_share",
      "intrinsic_value_per_share",
      "target_date_market_price",
    ]).has(record?.valuation_quantity)
  ) {
    add("valuation_quantity is invalid.");
  }
  if (!/^[A-Z]{3}$/.test(String(record?.currency ?? ""))) add("currency must be ISO 4217.");
  if (!isoDate(record?.as_of)) add("as_of must be an ISO-8601 date.");
  if (!timestamp(record?.source_cutoff_at)) {
    add("source_cutoff_at must be a timestamp.");
  }
  if (!finite(record?.reference_price) || record.reference_price <= 0) {
    add("reference_price must be positive.");
  }
  if (
    typeof record?.reference_price_source !== "string" ||
    !record.reference_price_source.trim()
  ) {
    add("reference_price_source is required.");
  }
  if (!timestamp(record?.reference_price_at)) {
    add("reference_price_at must be a timestamp.");
  } else if (
    timestamp(record?.source_cutoff_at) &&
    Date.parse(record.reference_price_at) > Date.parse(record.source_cutoff_at)
  ) {
    add("reference_price_at must not be later than source_cutoff_at.");
  }
  if (!isoDate(record?.primary_horizon)) {
    add("primary_horizon must be an ISO-8601 date.");
  }
  if (record?.display_semantics !== "distribution_percentiles") {
    add("The current horizon contract requires distribution_percentiles display semantics.");
  }

  const model = record?.model;
  if (!model || typeof model !== "object" || Array.isArray(model)) add("model is required.");
  else {
    for (const field of ["version", "method", "calibration_status", "code_path", "verifier_path"]) {
      if (typeof model[field] !== "string" || !model[field].trim()) add(`model.${field} is required.`);
    }
    if (!Number.isInteger(model.seed)) add("model.seed must be an integer.");
    if (!Number.isInteger(model.sample_count) || model.sample_count < 1) {
      add("model.sample_count must be a positive integer.");
    }
  }

  const horizons = record?.horizons;
  if (!Array.isArray(horizons) || horizons.length === 0) {
    add("horizons must contain at least one output.");
  } else if (horizons.length > 2) {
    add("Horizon-contract schema version 1 supports at most two modeled horizons.");
  } else {
    const identifiers = new Set();
    const dates = new Set();
    let previousDate = null;
    let previousMonths = null;
    for (const [index, horizon] of horizons.entries()) {
      const label = `horizons[${index}]`;
      if (typeof horizon?.id !== "string" || !horizon.id) add(`${label}.id is required.`);
      else if (identifiers.has(horizon.id)) add(`Duplicate horizon id: ${horizon.id}.`);
      else identifiers.add(horizon.id);
      if (!isoDate(horizon?.date)) add(`${label}.date must be an ISO-8601 date.`);
      else if (dates.has(horizon.date)) add(`Duplicate horizon date: ${horizon.date}.`);
      else {
        dates.add(horizon.date);
        if (previousDate !== null && horizon.date <= previousDate) {
          add("Horizons must be ordered from earliest to latest date.");
        }
        previousDate = horizon.date;
      }
      if (!finite(horizon?.months_from_reference) || horizon.months_from_reference <= 0) {
        add(`${label}.months_from_reference must be positive.`);
      } else {
        if (
          previousMonths !== null &&
          horizon.months_from_reference <= previousMonths
        ) {
          add("Horizon months_from_reference values must be strictly increasing.");
        }
        previousMonths = horizon.months_from_reference;
      }
      if (horizon?.output_kind !== "distribution") {
        add(`${label}.output_kind must be distribution.`);
      }
      for (const field of ["p10", "p50", "p90", "mean", "bottom_decile_mean"]) {
        if (!finite(horizon?.[field]) || horizon[field] < 0) {
          add(`${label}.${field} must be non-negative.`);
        }
      }
      for (const field of [
        "probability_below_reference",
        "probability_loss_30_pct",
        "probability_loss_50_pct",
      ]) {
        if (!probability(horizon?.[field])) add(`${label}.${field} must be in [0, 1].`);
      }
      if (finite(horizon?.p10) && finite(horizon?.p50) && finite(horizon?.p90)) {
        if (!(horizon.p10 <= horizon.p50 && horizon.p50 <= horizon.p90)) {
          add(`${label} quantiles must satisfy P10 <= P50 <= P90.`);
        }
      }
      if (finite(horizon?.bottom_decile_mean) && finite(horizon?.p10)) {
        if (horizon.bottom_decile_mean > horizon.p10) {
          add(`${label} bottom-decile expected value must not exceed P10.`);
        }
      }
      if (
        probability(horizon?.probability_loss_30_pct) &&
        probability(horizon?.probability_loss_50_pct) &&
        horizon.probability_loss_50_pct > horizon.probability_loss_30_pct
      ) {
        add(`${label} 50% loss probability must not exceed 30% loss probability.`);
      }
      if (
        probability(horizon?.probability_loss_30_pct) &&
        probability(horizon?.probability_below_reference) &&
        horizon.probability_loss_30_pct > horizon.probability_below_reference
      ) {
        add(`${label} 30% loss probability must not exceed probability below reference.`);
      }
      if (
        finite(horizon?.p10) &&
        horizon.p10 > record.reference_price &&
        probability(horizon?.probability_below_reference) &&
        horizon.probability_below_reference > 0.101
      ) {
        add(`${label} probability below reference conflicts with P10.`);
      }
      if (
        finite(horizon?.p90) &&
        horizon.p90 < record.reference_price &&
        probability(horizon?.probability_below_reference) &&
        horizon.probability_below_reference < 0.899
      ) {
        add(`${label} probability below reference conflicts with P90.`);
      }
    }
    if (!dates.has(record?.primary_horizon)) add("primary_horizon must match a horizon date.");
  }

  const relationship = record?.horizon_relationship;
  if (!relationship || typeof relationship !== "object" || Array.isArray(relationship)) {
    add("horizon_relationship is required.");
  } else if (!new Set(["single", "joint", "independent"]).has(relationship.kind)) {
    add("horizon_relationship.kind is invalid.");
  } else if (Array.isArray(horizons)) {
    if (horizons.length === 1 && relationship.kind !== "single") {
      add("A one-horizon contract must use a single relationship.");
    }
    if (horizons.length > 1 && relationship.kind === "single") {
      add("A multi-horizon contract must be joint or explicitly independent.");
    }
    if (relationship.kind === "single") {
      for (const field of [
        "linkage_method",
        "value_correlation_method",
        "value_correlation",
        "probability_later_above_earlier",
        "sensitivity_note",
      ]) {
        if (relationship[field] !== null) add(`A single relationship requires ${field}: null.`);
      }
      if (
        !Array.isArray(relationship.transition_bands) ||
        relationship.transition_bands.length > 0
      ) {
        add("A single relationship requires an empty transition_bands array.");
      }
    }
    if (relationship.kind === "independent") {
      for (const field of [
        "linkage_method",
        "value_correlation_method",
        "value_correlation",
        "probability_later_above_earlier",
      ]) {
        if (relationship[field] !== null) add(`An independent relationship requires ${field}: null.`);
      }
      if (
        !Array.isArray(relationship.transition_bands) ||
        relationship.transition_bands.length > 0
      ) {
        add("An independent relationship requires an empty transition_bands array.");
      }
      if (
        typeof relationship.sensitivity_note !== "string" ||
        !relationship.sensitivity_note.trim()
      ) {
        add("An independent relationship requires a note explaining why no transition is inferred.");
      }
    }
    if (relationship.kind === "joint") {
      if (typeof relationship.linkage_method !== "string" || !relationship.linkage_method.trim()) {
        add("A joint relationship requires linkage_method.");
      }
      if (
        !new Set(["pearson", "spearman", "kendall"]).has(
          relationship.value_correlation_method,
        )
      ) {
        add("A joint relationship requires a declared value_correlation_method.");
      }
      if (
        !finite(relationship.value_correlation) ||
        Math.abs(relationship.value_correlation) > 1
      ) {
        add("A joint relationship requires value_correlation in [-1, 1].");
      }
      if (!probability(relationship.probability_later_above_earlier)) {
        add("A joint relationship requires probability_later_above_earlier.");
      }
      if (
        !Array.isArray(relationship.transition_bands) ||
        relationship.transition_bands.length < 2
      ) {
        add("A joint relationship requires at least two transition bands.");
      } else {
        const means = relationship.transition_bands.map((band) => band?.later_mean);
        const medians = relationship.transition_bands.map((band) => band?.later_median);
        const downsideProbabilities = relationship.transition_bands.map(
          (band) => band?.later_probability_below_reference,
        );
        const upperProbabilities = relationship.transition_bands.map(
          (band) => band?.earlier_band_upper_probability,
        );
        const sampleProbabilities = relationship.transition_bands.map(
          (band) => band?.earlier_band_sample_probability,
        );
        const bandLabels = relationship.transition_bands.map((band) => band?.label);
        if (
          bandLabels.some((label) => typeof label !== "string" || !label.trim()) ||
          new Set(bandLabels).size !== bandLabels.length
        ) {
          add("Transition bands require unique non-empty labels.");
        }
        if (means.some((value) => !finite(value))) {
          add("Transition-band later means must be finite.");
        }
        else if (means.some((value, index) => index > 0 && value < means[index - 1])) {
          add("Transition-band later means must be ordered by the earlier state.");
        }
        if (medians.some((value) => !finite(value))) {
          add("Transition-band later medians must be finite.");
        } else if (
          medians.some((value, index) => index > 0 && value < medians[index - 1])
        ) {
          add("Transition-band later medians must be ordered by the earlier state.");
        }
        if (downsideProbabilities.some((value) => !probability(value))) {
          add("Transition-band downside probabilities must be in [0, 1].");
        } else if (
          downsideProbabilities.some(
            (value, index) => index > 0 && value > downsideProbabilities[index - 1],
          )
        ) {
          add("Transition-band downside probabilities must decline with the earlier state.");
        }
        if (
          upperProbabilities.some((value) => !finite(value) || value <= 0 || value > 1) ||
          upperProbabilities.some(
            (value, index) => index > 0 && value <= upperProbabilities[index - 1],
          ) ||
          upperProbabilities.at(-1) !== 1
        ) {
          add(
            "Transition bands require strictly increasing earlier_band_upper_probability values ending at 1.",
          );
        }
        if (
          sampleProbabilities.some((value) => !finite(value) || value <= 0 || value > 1) ||
          Math.abs(sampleProbabilities.reduce((sum, value) => sum + value, 0) - 1) > 1e-6
        ) {
          add("Transition-band sample probabilities must be positive and sum to 1.");
        }
        for (const [index, band] of relationship.transition_bands.entries()) {
          if (!finite(band?.later_median) || !probability(band?.later_probability_below_reference)) {
            add(`transition_bands[${index}] must contain a median and downside probability.`);
          }
        }
      }
      if (
        typeof relationship.sensitivity_note !== "string" ||
        !relationship.sensitivity_note.trim()
      ) {
        add("A joint relationship requires a linkage sensitivity note.");
      }
    }
  }

  return errors;
}

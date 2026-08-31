function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`));
}

export function validateOperatingForecastContract(contract) {
  const errors = [];
  const add = (message) => errors.push(message);

  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    return ["Contract must be an object."];
  }
  if (contract.type !== "operating_forecast_contract") add("type must be operating_forecast_contract.");
  if (contract.schema_version !== 1) add("schema_version must be 1.");
  if (typeof contract.coverage_cycle_id !== "string" || !/^[A-Z0-9.-]+-\d{4}-W\d{2}-\d{2}$/.test(contract.coverage_cycle_id)) {
    add("coverage_cycle_id must identify a company coverage cycle.");
  }
  if (!new Set(["prospective_shadow_draft", "frozen"]).has(contract.status)) {
    add("status is invalid.");
  }
  if (!validDate(contract.as_of)) add("as_of must be a valid date.");
  if (typeof contract.source_cutoff_at !== "string" || !Number.isFinite(Date.parse(contract.source_cutoff_at))) {
    add("source_cutoff_at must be a valid date-time.");
  }
  if (!contract.model || typeof contract.model !== "object" || Array.isArray(contract.model)) {
    add("model must be an object.");
  } else {
    if (typeof contract.model.version !== "string" || contract.model.version.trim() === "") add("model.version must be non-empty.");
    if (!Number.isInteger(contract.model.seed)) add("model.seed must be an integer.");
    if (!Number.isInteger(contract.model.sample_count) || contract.model.sample_count < 10) add("model.sample_count must be an integer of at least 10.");
    for (const field of ["code_path", "verifier_path"]) {
      if (typeof contract.model[field] !== "string" || contract.model[field].trim() === "") add(`model.${field} must be non-empty.`);
    }
  }
  if (!contract.calibration_layers || typeof contract.calibration_layers !== "object" || Array.isArray(contract.calibration_layers) || Object.keys(contract.calibration_layers).length === 0) {
    add("calibration_layers must be a non-empty object.");
  }
  if (contract.baseline_scoring_method !== "degenerate_interval_weighted_interval_score_equivalent_to_absolute_error") {
    add("baseline_scoring_method is invalid.");
  }
  if (typeof contract.resolution_policy !== "string" || contract.resolution_policy.trim() === "") {
    add("resolution_policy must be non-empty.");
  }
  if (typeof contract.independence_note !== "string" || contract.independence_note.trim() === "") {
    add("independence_note must be non-empty.");
  }
  if (!Array.isArray(contract.forecasts) || contract.forecasts.length === 0) {
    add("forecasts must be a non-empty array.");
    return errors;
  }

  const identifiers = new Set();
  for (const [index, forecast] of contract.forecasts.entries()) {
    const label = `forecasts[${index}]`;
    if (!forecast || typeof forecast !== "object" || Array.isArray(forecast)) {
      add(`${label} must be an object.`);
      continue;
    }
    if (typeof forecast.id !== "string" || !/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(forecast.id)) {
      add(`${label}.id must use snake_case.`);
    } else if (identifiers.has(forecast.id)) {
      add(`${label}.id must be unique.`);
    } else {
      identifiers.add(forecast.id);
    }
    if (!validDate(forecast.period_end)) add(`${label}.period_end must be a valid date.`);
    if (!validDate(forecast.resolution_deadline)) add(`${label}.resolution_deadline must be a valid date.`);
    if (
      validDate(forecast.period_end) &&
      validDate(forecast.resolution_deadline) &&
      forecast.resolution_deadline < forecast.period_end
    ) {
      add(`${label}.resolution_deadline must not precede period_end.`);
    }
    for (const field of ["p10", "p50", "p90"]) {
      if (!finiteNumber(forecast[field])) add(`${label}.${field} must be finite.`);
    }
    if (
      ["p10", "p50", "p90"].every((field) => finiteNumber(forecast[field])) &&
      !(forecast.p10 <= forecast.p50 && forecast.p50 <= forecast.p90)
    ) {
      add(`${label} must satisfy p10 <= p50 <= p90.`);
    }
    if (forecast.scoring_method !== "weighted_interval_score_alpha_0_2") {
      add(`${label}.scoring_method must be weighted_interval_score_alpha_0_2.`);
    }
    if (!new Set(["partially_empirical", "anchored", "model_generated"]).has(forecast.source_class)) {
      add(`${label}.source_class is invalid.`);
    }
    if (!forecast.baselines || typeof forecast.baselines !== "object" || Array.isArray(forecast.baselines)) {
      add(`${label}.baselines must be an object.`);
    } else if (
      Object.keys(forecast.baselines).length === 0 ||
      Object.values(forecast.baselines).some((value) => !finiteNumber(value))
    ) {
      add(`${label}.baselines must contain only finite numerical baselines.`);
    }
    if (!forecast.baseline_provenance || typeof forecast.baseline_provenance !== "object" || Array.isArray(forecast.baseline_provenance)) {
      add(`${label}.baseline_provenance must be an object.`);
    } else if (forecast.baselines && typeof forecast.baselines === "object") {
      const baselineKeys = Object.keys(forecast.baselines).sort();
      const provenanceKeys = Object.keys(forecast.baseline_provenance).sort();
      if (
        baselineKeys.length !== provenanceKeys.length ||
        baselineKeys.some((key, keyIndex) => key !== provenanceKeys[keyIndex]) ||
        Object.values(forecast.baseline_provenance).some(
          (value) => typeof value !== "string" || value.trim() === "",
        )
      ) {
        add(`${label}.baseline_provenance must match the baseline keys with non-empty descriptions.`);
      }
    }
    if (typeof forecast.baseline_known_at !== "string" || !Number.isFinite(Date.parse(forecast.baseline_known_at))) {
      add(`${label}.baseline_known_at must be a valid date-time.`);
    }
    if (!forecast.baseline_source_ids || typeof forecast.baseline_source_ids !== "object" || Array.isArray(forecast.baseline_source_ids)) {
      add(`${label}.baseline_source_ids must be an object.`);
    } else if (forecast.baselines && typeof forecast.baselines === "object") {
      const baselineKeys = Object.keys(forecast.baselines).sort();
      const sourceKeys = Object.keys(forecast.baseline_source_ids).sort();
      if (
        baselineKeys.length !== sourceKeys.length ||
        baselineKeys.some((key, keyIndex) => key !== sourceKeys[keyIndex]) ||
        Object.values(forecast.baseline_source_ids).some(
          (ids) => !Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string" || id.trim() === ""),
        )
      ) {
        add(`${label}.baseline_source_ids must match baseline keys with non-empty source-ID arrays.`);
      }
    }
    if (
      !Array.isArray(forecast.resolution_source_ids) ||
      forecast.resolution_source_ids.length === 0 ||
      forecast.resolution_source_ids.some((value) => typeof value !== "string" || value.trim() === "")
    ) {
      add(`${label}.resolution_source_ids must be non-empty.`);
    }
    for (const field of ["metric", "segment", "unit", "calibration_status", "resolution_rule", "unresolvable_rule"]) {
      if (typeof forecast[field] !== "string" || forecast[field].trim() === "") {
        add(`${label}.${field} must be non-empty.`);
      }
    }
  }
  return errors;
}

export function weightedIntervalScore({ p10, p50, p90, actual }) {
  for (const [field, value] of Object.entries({ p10, p50, p90, actual })) {
    if (!finiteNumber(value)) throw new Error(`${field} must be finite`);
  }
  if (!(p10 <= p50 && p50 <= p90)) throw new Error("Forecast must satisfy p10 <= p50 <= p90");

  const alpha = 0.2;
  const absoluteError = Math.abs(actual - p50);
  const belowPenalty = actual < p10 ? (2 / alpha) * (p10 - actual) : 0;
  const abovePenalty = actual > p90 ? (2 / alpha) * (actual - p90) : 0;
  const intervalScore = p90 - p10 + belowPenalty + abovePenalty;
  const score = (0.5 * absoluteError + (alpha / 2) * intervalScore) / 1.5;
  return {
    absolute_error: absoluteError,
    interval_score_80: intervalScore,
    weighted_interval_score: score,
  };
}

export function scoreOperatingForecastResult(forecast, actual) {
  if (!forecast || typeof forecast !== "object" || Array.isArray(forecast)) {
    throw new Error("forecast must be an object");
  }
  const forecastScore = weightedIntervalScore({
    p10: forecast.p10,
    p50: forecast.p50,
    p90: forecast.p90,
    actual,
  });
  const baselineScores = Object.fromEntries(
    Object.entries(forecast.baselines ?? {}).map(([label, value]) => [
      label,
      weightedIntervalScore({ p10: value, p50: value, p90: value, actual })
        .weighted_interval_score,
    ]),
  );
  return {
    forecast_id: forecast.id,
    actual,
    forecast: forecastScore,
    baselines: baselineScores,
  };
}

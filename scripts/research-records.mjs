#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const eventTypes = new Set([
  "earnings",
  "clinical_trial",
  "regulatory",
  "product",
  "customer_contract",
  "legal",
  "policy",
  "capital_allocation",
  "financing",
  "m_and_a",
  "commodity",
  "macro",
  "other",
]);
const eventStatuses = new Set(["draft", "published", "superseded", "withdrawn"]);
const eventLedgerStatuses = new Set([
  "active",
  "partially_resolved",
  "resolved",
  "invalidated",
  "superseded",
  "unresolvable",
]);
const outcomeStatuses = new Set(["pending", "resolved", "unresolvable"]);
const outcomeRecordStatuses = new Set(["draft", "partial", "resolved", "unresolvable"]);
const releaseStatuses = new Set(["released", "no_release", "unknown"]);
const deadlineMissResolutions = new Set(["event_zero", "unresolvable"]);
const eventDirections = new Set(["up", "down", "absolute"]);
const returnBases = new Set(["decision_holding_period", "event_reaction"]);
const entryObservationRules = new Set(["reference_price", "last_close_before_release"]);
const returnMetrics = new Set(["security_total_return", "benchmark_relative_return"]);
const marketSessions = new Set(["pre_market", "regular", "after_hours", "unknown"]);
const priceAdjustmentRules = new Set([
  "unadjusted",
  "split_adjusted",
  "split_adjusted_with_dividends",
]);
const disclosures = new Set(["long", "short", "no_position", "not_disclosed"]);
const identityStatuses = new Set(["draft", "verified", "superseded"]);
const sourceRights = new Set(["public", "licensed-local-only", "link-only", "unknown"]);
const sourceAccessStates = new Set(["public", "signed-in", "local-authorized"]);
const sourceCaptureStates = new Set(["none", "local-note", "local-source-copy", "committed-derived"]);
const sourceVerificationStates = new Set(["unchecked", "checked_against_source", "triangulated"]);
const sourceEvidenceTypes = new Set([
  "primary_filing",
  "primary_regulatory",
  "company_ir",
  "official_statistics",
  "academic",
  "industry",
  "expert",
  "market_data",
  "alternative_data",
  "secondary",
  "other",
]);
const securityTypes = new Set([
  "common_stock",
  "adr",
  "depositary_receipt",
  "unit",
  "fund",
  "other",
]);
const eventLedgerHeaders = [
  "id",
  "candidate_id",
  "candidate_ledger_commit_url",
  "published_at",
  "source_cutoff_at",
  "ticker",
  "identity_path",
  "identity_hash",
  "security_id",
  "listing_id",
  "event_type",
  "schedule_known_at",
  "event_window_start",
  "event_window_end",
  "no_release_check_url",
  "deadline_miss_resolution",
  "event_baseline_id",
  "event_baseline_source_path",
  "event_baseline_probability_pct",
  "event_baseline_sample_size",
  "target_baseline_id",
  "target_baseline_source_path",
  "target_baseline_probability_pct",
  "method_version",
  "fact_snapshot_path",
  "fact_snapshot_hash",
  "event_probability_pct",
  "evaluation_spec_id",
  "market_session",
  "security_return_rule",
  "return_basis",
  "entry_observation_rule",
  "return_metric",
  "target_direction",
  "target_return_threshold_pct",
  "target_return_window_sessions",
  "target_probability_pct",
  "reference_price",
  "reference_price_at",
  "reference_price_source",
  "price_adjustment_rule",
  "benchmark",
  "benchmark_price_source",
  "benchmark_price_adjustment_rule",
  "event_outcome_status",
  "event_outcome",
  "target_outcome_status",
  "target_outcome",
  "outcome_at",
  "forecast_path",
  "outcome_path",
  "commit_url",
  "outcome_commit_url",
  "status_reason",
  "status",
];
const eventCandidateDecisions = new Set(["registered", "abstained", "ineligible", "deferred"]);
const companyLedgerStatuses = new Set(["active", "superseded", "closed", "invalidated"]);
const companyLedgerHeaders = [
  "id", "published_at", "source_cutoff_at", "ticker", "identity_path", "identity_hash",
  "security_id", "listing_id", "thesis_path", "commit_url", "currency", "reference_price",
  "reference_price_at", "price_source", "target_bear", "target_base", "target_bull", "target_horizon",
  "evaluation_rule", "benchmark", "sector_benchmark", "position_disclosure", "status",
  "outcome_date",
];
const eventCandidateHeaders = [
  "candidate_id",
  "cohort_id",
  "identified_at",
  "source_cutoff_at",
  "ticker",
  "identity_path",
  "security_id",
  "listing_id",
  "event_type",
  "event_window_start",
  "event_window_end",
  "eligibility_rule_id",
  "decision",
  "decision_at",
  "reason",
  "forecast_id",
];

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");

function printHelp() {
  console.log(`Research record validation and scoring

Usage:
  node scripts/research-records.mjs validate-event <path> [--json]
  node scripts/research-records.mjs validate-identity <path> [--json]
  node scripts/research-records.mjs validate-outcome <path> [--json]
  node scripts/research-records.mjs validate-evaluation-spec <path> [--json]
  node scripts/research-records.mjs validate-source <path> [--json]
  node scripts/research-records.mjs validate-fact <path> [--json]
  node scripts/research-records.mjs validate-fact-snapshot <path> [--json]
  node scripts/research-records.mjs validate-calendar-snapshot <path> [--json]
  node scripts/research-records.mjs validate-market-observations <path> [--json]
  node scripts/research-records.mjs validate-market-capture <path> [--json]
  node scripts/research-records.mjs validate-company-ledger <path> [--json]
  node scripts/research-records.mjs score-events <ledger.csv> [--json]
  node scripts/research-records.mjs summarize-event-candidates <ledger.csv> [--json]

The validator reads flat YAML front matter without external dependencies. Event scoring
resolves event and security propositions independently and reports their Brier scores separately.`);
}

function parseArguments(argumentsList) {
  const positionals = [];
  let json = false;

  for (const argument of argumentsList) {
    if (argument === "--json") json = true;
    else if (argument.startsWith("--")) throw new Error(`Unknown option: ${argument}`);
    else positionals.push(argument);
  }

  return { positionals, json };
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "null" || value === "~") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "[]") return [];
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value)) return Number(value);
  if ((value.startsWith("[") && value !== "[]") || value.startsWith("{")) {
    throw new Error("Nested collections are not supported in flat front matter");
  }

  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Invalid quoted front-matter value: ${value}`);
    }
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }

  return value;
}

export function parseFlatFrontMatter(markdown) {
  const normalized = markdown.replaceAll("\r\n", "\n");
  if (!normalized.startsWith("---\n")) throw new Error("File must start with YAML front matter.");

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("YAML front matter is missing its closing delimiter.");

  const record = {};
  const lines = normalized.slice(4, end).split("\n");
  for (const [index, line] of lines.entries()) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!match) {
      throw new Error(
        `Front matter must contain only flat key/value fields; invalid line ${index + 2}: ${line}`,
      );
    }
    const [, key, rawValue] = match;
    if (Object.hasOwn(record, key)) throw new Error(`Duplicate front-matter field: ${key}`);
    record[key] = parseScalar(rawValue);
  }

  return record;
}

function diagnostics(kind, path) {
  return { kind, path, valid: true, errors: [], warnings: [] };
}

function addError(result, message) {
  result.errors.push(message);
  result.valid = false;
}

function requireFields(record, fields, result) {
  for (const field of fields) {
    const value = record[field];
    if (value === undefined || value === null || value === "") {
      addError(result, `Missing required field: ${field}`);
    }
  }
}

function validateEnum(record, field, allowed, result) {
  if (record[field] !== undefined && !allowed.has(record[field])) {
    addError(result, `${field} must be one of: ${[...allowed].join(", ")}`);
  }
}

function validatePattern(record, field, pattern, description, result) {
  const value = record[field];
  if (value !== undefined && value !== null && !pattern.test(String(value))) {
    addError(result, `${field} must ${description}`);
  }
}

function validateString(record, field, result) {
  const value = record[field];
  if (value !== undefined && value !== null && (typeof value !== "string" || value.length === 0)) {
    addError(result, `${field} must be a non-empty string`);
  }
}

function validatePublicHttpUrl(record, field, result) {
  const value = record[field];
  if (value === undefined || value === null) return;
  try {
    const parsed = new URL(value);
    if (!new Set(["http:", "https:"]).has(parsed.protocol)) {
      addError(result, `${field} must use HTTP or HTTPS`);
    }
    if (parsed.username || parsed.password) addError(result, `${field} must not contain credentials`);
    const sensitiveNames = /^(?:access_?token|api_?key|auth|authorization|awsaccesskeyid|bearer|client_?secret|credential|credentials|id_?token|jwt|key|password|private_?key|refresh_?token|secret|session|session_?id|sig|signature|token|x-amz-.+|x-goog-.+)$/i;
    for (const name of parsed.searchParams.keys()) {
      if (sensitiveNames.test(name)) addError(result, `${field} must not contain sensitive query parameters`);
    }
  } catch {
    addError(result, `${field} must be a valid HTTP(S) URL`);
  }
}

function canonicalCommitUrl(url, label) {
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    throw new Error(`${label} must identify a public HTTPS commit`);
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(`${label} must be a canonical public HTTPS commit URL without credentials, query, or fragment`);
  }
  const match = parsed.pathname.match(/^\/(.+)\/commit\/([0-9a-f]{40}|[0-9a-f]{64})$/i);
  if (!match) throw new Error(`${label} must identify a public HTTPS commit`);
  return { parsed, repositoryPath: match[1], commitHash: match[2] };
}

function rejectUnknownFields(record, allowedFields, result) {
  const allowed = new Set(allowedFields);
  for (const field of Object.keys(record)) {
    if (!allowed.has(field)) addError(result, `Unknown field: ${field}`);
  }
}

function validateDate(record, field, result) {
  const value = record[field];
  if (value === undefined || value === null) return;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    addError(result, `${field} must be an ISO 8601 date (YYYY-MM-DD)`);
    return;
  }
  const [, year, month, day] = match;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    addError(result, `${field} is not a real calendar date`);
  }
}

function validateTimestamp(record, field, result) {
  const value = record[field];
  if (value === undefined || value === null) return;
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(String(value)) || !Number.isFinite(Date.parse(value))) {
    addError(result, `${field} must be an ISO 8601 timestamp with an explicit timezone`);
  }
}

function validateFiscalYearEnd(record, field, result) {
  const value = record[field];
  if (value === undefined || value === null) return;
  const match = String(value).match(/^(\d{2})-(\d{2})$/);
  if (!match) {
    addError(result, `${field} must match MM-DD`);
    return;
  }
  const month = Number(match[1]);
  const day = Number(match[2]);
  const parsed = new Date(Date.UTC(2000, month - 1, day));
  if (parsed.getUTCMonth() + 1 !== month || parsed.getUTCDate() !== day) {
    addError(result, `${field} is not a real month and day`);
  }
}

function validateNumber(record, field, { minimum, maximum, integer = false, exclusive = false }, result) {
  const value = record[field];
  if (value === undefined || value === null) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    addError(result, `${field} must be numeric`);
    return;
  }
  if (integer && !Number.isInteger(value)) addError(result, `${field} must be an integer`);
  if (minimum !== undefined && (exclusive ? value <= minimum : value < minimum)) {
    addError(result, `${field} must be ${exclusive ? "greater than" : "at least"} ${minimum}`);
  }
  if (maximum !== undefined && value > maximum) addError(result, `${field} must be at most ${maximum}`);
}

function compareTimestamps(record, earlierField, laterField, result, message) {
  const earlier = record[earlierField];
  const later = record[laterField];
  if (earlier === undefined || earlier === null || later === undefined || later === null) return;
  const earlierTime = Date.parse(earlier);
  const laterTime = Date.parse(later);
  if (Number.isFinite(earlierTime) && Number.isFinite(laterTime) && earlierTime > laterTime) {
    addError(result, message);
  }
}

export function validateEventRecord(record, path = "<memory>") {
  const result = diagnostics("event_forecast", path);
  rejectUnknownFields(
    record,
    [
      "type", "forecast_id", "candidate_id", "candidate_ledger_commit_url", "company", "ticker",
      "identity_path", "identity_hash", "security_id", "listing_id", "status", "as_of",
      "published_at", "source_cutoff_at", "event_baseline_id", "event_baseline_source_path",
      "event_baseline_probability_pct", "event_baseline_sample_size", "target_baseline_id",
      "target_baseline_source_path", "target_baseline_probability_pct", "method_version",
      "fact_snapshot_hash", "fact_snapshot_path", "event_type", "schedule_source",
      "schedule_known_at", "event_window_start", "event_window_end", "no_release_check_url",
      "market_session", "event_outcome_rule", "deadline_miss_resolution", "event_probability_pct",
      "evaluation_spec_id", "security_return_rule", "return_basis", "entry_observation_rule",
      "return_metric", "target_direction", "target_return_threshold_pct",
      "target_return_window_sessions", "target_probability_pct", "currency", "reference_price",
      "reference_price_at", "reference_price_source", "price_adjustment_rule", "benchmark",
      "benchmark_price_source", "benchmark_price_adjustment_rule", "position_disclosure",
      "review_by", "supersedes",
    ],
    result,
  );
  requireFields(
    record,
    [
      "type",
      "forecast_id",
      "company",
      "ticker",
      "identity_path",
      "identity_hash",
      "security_id",
      "listing_id",
      "status",
      "as_of",
      "source_cutoff_at",
      "event_baseline_id",
      "event_baseline_source_path",
      "target_baseline_id",
      "target_baseline_source_path",
      "method_version",
      "event_type",
      "schedule_source",
      "schedule_known_at",
      "event_window_start",
      "event_window_end",
      "no_release_check_url",
      "market_session",
      "event_outcome_rule",
      "deadline_miss_resolution",
      "evaluation_spec_id",
      "security_return_rule",
      "return_basis",
      "entry_observation_rule",
      "return_metric",
      "target_direction",
      "currency",
      "benchmark_price_adjustment_rule",
      "position_disclosure",
    ],
    result,
  );

  if (record.type !== undefined && record.type !== "event_forecast") {
    addError(result, "type must equal event_forecast");
  }
  validatePattern(record, "forecast_id", /^\d{4}-E\d{3,}$/, "match YYYY-E001", result);
  validatePattern(record, "candidate_id", /^\d{4}-C\d{3,}$/, "match YYYY-C001", result);
  validatePattern(record, "ticker", /^[A-Z0-9.-]+$/, "use an uppercase market symbol", result);
  validatePattern(record, "identity_hash", /^sha256:[a-f0-9]{64}$/, "be a lowercase SHA-256 digest", result);
  validatePattern(record, "currency", /^[A-Z]{3}$/, "use an ISO 4217 code", result);
  validateEnum(record, "status", eventStatuses, result);
  validateEnum(record, "event_type", eventTypes, result);
  validateEnum(record, "deadline_miss_resolution", deadlineMissResolutions, result);
  validateEnum(record, "target_direction", eventDirections, result);
  validateEnum(record, "return_basis", returnBases, result);
  validateEnum(record, "entry_observation_rule", entryObservationRules, result);
  validateEnum(record, "return_metric", returnMetrics, result);
  const expectedEntryRule =
    record.return_basis === "decision_holding_period"
      ? "reference_price"
      : record.return_basis === "event_reaction"
        ? "last_close_before_release"
        : null;
  if (expectedEntryRule && record.entry_observation_rule !== expectedEntryRule) {
    addError(
      result,
      `${record.return_basis} requires entry_observation_rule ${expectedEntryRule}`,
    );
  }
  validateEnum(record, "market_session", marketSessions, result);
  validateEnum(record, "price_adjustment_rule", priceAdjustmentRules, result);
  validateEnum(record, "benchmark_price_adjustment_rule", priceAdjustmentRules, result);
  validateEnum(record, "position_disclosure", disclosures, result);
  validatePattern(record, "evaluation_spec_id", /^event-v[1-9]\d*$/, "match event-v1", result);
  validatePattern(record, "event_baseline_id", /^S-\d{3,}$/, "match S-001", result);
  validatePattern(record, "target_baseline_id", /^S-\d{3,}$/, "match S-001", result);
  validatePattern(record, "method_version", /^[A-Za-z0-9._-]+$/, "use a stable version identifier", result);
  validatePattern(record, "fact_snapshot_hash", /^sha256:[a-f0-9]{64}$/, "be a lowercase SHA-256 digest", result);
  validatePublicHttpUrl(record, "schedule_source", result);
  validatePublicHttpUrl(record, "no_release_check_url", result);
  if (record.candidate_ledger_commit_url !== undefined && record.candidate_ledger_commit_url !== null) {
    try {
      canonicalCommitUrl(record.candidate_ledger_commit_url, "candidate_ledger_commit_url");
    } catch (error) {
      addError(result, error.message);
    }
  }
  validateDate(record, "as_of", result);
  validateDate(record, "review_by", result);
  for (const field of [
    "published_at",
    "source_cutoff_at",
    "schedule_known_at",
    "event_window_start",
    "event_window_end",
    "reference_price_at",
  ]) {
    validateTimestamp(record, field, result);
  }
  validateNumber(record, "event_probability_pct", { minimum: 0, maximum: 100 }, result);
  validateNumber(record, "event_baseline_probability_pct", { minimum: 0, maximum: 100 }, result);
  validateNumber(record, "event_baseline_sample_size", { minimum: 1, integer: true }, result);
  validateNumber(record, "target_baseline_probability_pct", { minimum: 0, maximum: 100 }, result);
  validateNumber(record, "target_probability_pct", { minimum: 0, maximum: 100 }, result);
  validateNumber(record, "target_return_threshold_pct", { minimum: 0, exclusive: true }, result);
  validateNumber(
    record,
    "target_return_window_sessions",
    { minimum: 1, integer: true },
    result,
  );
  validateNumber(record, "reference_price", { minimum: 0, exclusive: true }, result);

  compareTimestamps(
    record,
    "event_window_start",
    "event_window_end",
    result,
    "event_window_start must not be after event_window_end",
  );
  compareTimestamps(
    record,
    "schedule_known_at",
    "source_cutoff_at",
    result,
    "schedule_known_at must not be after source_cutoff_at",
  );
  compareTimestamps(
    record,
    "source_cutoff_at",
    "published_at",
    result,
    "source_cutoff_at must not be after published_at",
  );
  compareTimestamps(
    record,
    "published_at",
    "event_window_start",
    result,
    "published_at must not be after event_window_start",
  );
  if (
    record.published_at &&
    record.event_window_start &&
    Date.parse(record.published_at) >= Date.parse(record.event_window_start)
  ) {
    addError(result, "published_at must strictly precede event_window_start");
  }
  compareTimestamps(
    record,
    "reference_price_at",
    "published_at",
    result,
    "reference_price_at must not be after published_at",
  );

  if (["published", "superseded", "withdrawn"].includes(record.status)) {
    requireFields(
      record,
      [
        "published_at",
        "candidate_id",
        "candidate_ledger_commit_url",
        "event_baseline_probability_pct",
        "event_baseline_sample_size",
        "target_baseline_probability_pct",
        "fact_snapshot_path",
        "fact_snapshot_hash",
        "event_probability_pct",
        "target_return_threshold_pct",
        "target_return_window_sessions",
        "target_probability_pct",
        "reference_price",
        "reference_price_at",
        "reference_price_source",
        "price_adjustment_rule",
        "benchmark",
        "benchmark_price_source",
        "benchmark_price_adjustment_rule",
      ],
      result,
    );
  }

  if (record.status === "draft") {
    const incomplete = [
      "event_baseline_probability_pct",
      "event_baseline_sample_size",
      "target_baseline_probability_pct",
      "event_probability_pct",
      "target_probability_pct",
      "reference_price",
      "benchmark",
      "fact_snapshot_path",
      "fact_snapshot_hash",
    ].filter((field) => record[field] === null || record[field] === undefined || record[field] === "");
    if (incomplete.length > 0) {
      result.warnings.push(`Draft is not publishable; incomplete fields: ${incomplete.join(", ")}`);
    }
  }

  return result;
}

export function validateIdentityRecord(record, path = "<memory>") {
  const result = diagnostics("company_identity", path);
  requireFields(
    record,
    [
      "type",
      "company",
      "ticker",
      "exchange",
      "issuer_id",
      "security_id",
      "listing_id",
      "status",
      "as_of",
      "known_at",
      "valid_from",
      "domicile",
      "reporting_currency",
      "primary_security_type",
    ],
    result,
  );
  if (record.type !== undefined && record.type !== "company_identity") {
    addError(result, "type must equal company_identity");
  }
  validatePattern(record, "ticker", /^[A-Z0-9.-]+$/, "use an uppercase market symbol", result);
  validatePattern(record, "domicile", /^[A-Z]{2}$/, "use an ISO 3166-1 alpha-2 code", result);
  validatePattern(record, "reporting_currency", /^[A-Z]{3}$/, "use an ISO 4217 code", result);
  validateFiscalYearEnd(record, "fiscal_year_end", result);
  validatePattern(record, "cik", /^\d{10}$/, "contain exactly 10 digits", result);
  validatePattern(record, "lei", /^[A-Z0-9]{20}$/, "contain exactly 20 uppercase characters", result);
  validateEnum(record, "status", identityStatuses, result);
  validateEnum(record, "primary_security_type", securityTypes, result);
  validateDate(record, "as_of", result);
  validateTimestamp(record, "known_at", result);
  validateDate(record, "valid_from", result);
  validateDate(record, "valid_to", result);
  compareTimestamps(
    record,
    "valid_from",
    "valid_to",
    result,
    "valid_from must not be after valid_to",
  );

  if (record.status === "verified" && !record.cik && !record.lei) {
    result.warnings.push("Verified identity has neither a CIK nor an LEI; document the official identifier source.");
  }
  return result;
}

export function validateOutcomeRecord(record, path = "<memory>") {
  const result = diagnostics("event_outcome", path);
  rejectUnknownFields(
    record,
    [
      "type", "forecast_id", "company", "ticker", "status", "as_of", "outcome_at",
      "release_status", "resolution_deadline_at", "actual_release_at", "resolution_reason",
      "original_forecast", "evaluation_spec_id",
      "event_outcome_status", "event_outcome", "event_outcome_source_id",
      "event_outcome_source_path", "target_outcome_status", "target_outcome",
      "security_start_price", "security_start_at", "security_end_price", "security_end_at",
      "security_end_session_number", "security_price_source", "benchmark_start_value",
      "security_price_adjustment_rule",
      "benchmark_end_value", "benchmark_price_source", "benchmark_price_adjustment_rule",
      "market_observation_path", "market_observation_hash", "position_disclosure",
    ],
    result,
  );
  requireFields(
    record,
    [
      "type",
      "forecast_id",
      "company",
      "ticker",
      "status",
      "as_of",
      "outcome_at",
      "release_status",
      "resolution_deadline_at",
      "resolution_reason",
      "original_forecast",
      "evaluation_spec_id",
      "event_outcome_status",
      "target_outcome_status",
      "position_disclosure",
    ],
    result,
  );
  if (record.type !== undefined && record.type !== "event_outcome") {
    addError(result, "type must equal event_outcome");
  }
  validatePattern(record, "forecast_id", /^\d{4}-E\d{3,}$/, "match YYYY-E001", result);
  validatePattern(record, "ticker", /^[A-Z0-9.-]+$/, "use an uppercase market symbol", result);
  validatePattern(record, "evaluation_spec_id", /^event-v[1-9]\d*$/, "match event-v1", result);
  validatePattern(record, "event_outcome_source_id", /^S-\d{3,}$/, "match S-001", result);
  validatePattern(record, "market_observation_hash", /^sha256:[a-f0-9]{64}$/, "be a lowercase SHA-256 digest", result);
  for (const field of [
    "company", "resolution_reason", "original_forecast", "event_outcome_source_path",
    "security_price_source", "benchmark_price_source",
  ]) validateString(record, field, result);
  validateEnum(record, "status", outcomeRecordStatuses, result);
  validateEnum(record, "release_status", releaseStatuses, result);
  validateEnum(record, "event_outcome_status", outcomeStatuses, result);
  validateEnum(record, "target_outcome_status", outcomeStatuses, result);
  validateEnum(record, "position_disclosure", disclosures, result);
  validateEnum(record, "security_price_adjustment_rule", priceAdjustmentRules, result);
  validateEnum(record, "benchmark_price_adjustment_rule", priceAdjustmentRules, result);
  validateDate(record, "as_of", result);
  for (const field of [
    "outcome_at",
    "resolution_deadline_at",
    "actual_release_at",
    "security_start_at",
    "security_end_at",
  ]) validateTimestamp(record, field, result);
  validateNumber(record, "security_end_session_number", { minimum: 1, integer: true }, result);
  for (const field of ["security_start_price", "security_end_price", "benchmark_start_value", "benchmark_end_value"]) {
    validateNumber(record, field, { minimum: 0, exclusive: true }, result);
  }
  compareTimestamps(
    record,
    "actual_release_at",
    "outcome_at",
    result,
    "actual_release_at must not be after outcome_at",
  );
  compareTimestamps(
    record,
    "security_start_at",
    "security_end_at",
    result,
    "security_start_at must not be after security_end_at",
  );

  for (const prefix of ["event", "target"]) {
    const statusField = `${prefix}_outcome_status`;
    const outcomeField = `${prefix}_outcome`;
    if (record[statusField] === "resolved") {
      if (record[outcomeField] !== 0 && record[outcomeField] !== 1) {
        addError(result, `${outcomeField} must be 0 or 1 when ${statusField} is resolved`);
      }
    } else if (record[outcomeField] !== null && record[outcomeField] !== undefined) {
      addError(result, `${outcomeField} must be null unless ${statusField} is resolved`);
    }
  }
  if (record.event_outcome_status === "resolved" && !record.event_outcome_source_id) {
    addError(result, "event_outcome_source_id is required when event_outcome_status is resolved");
  }
  if (record.event_outcome_status === "resolved" && !record.event_outcome_source_path) {
    addError(result, "event_outcome_source_path is required when event_outcome_status is resolved");
  }
  if (record.release_status === "released" && !record.actual_release_at) {
    addError(result, "actual_release_at is required when release_status is released");
  }
  if (
    record.release_status === "released" &&
    (!record.event_outcome_source_id || !record.event_outcome_source_path)
  ) {
    addError(result, "release_status released requires a committed release source");
  }
  if (record.release_status !== "released" && record.actual_release_at) {
    addError(result, "actual_release_at must be null unless release_status is released");
  }
  if (record.release_status === "no_release") {
    compareTimestamps(
      record,
      "resolution_deadline_at",
      "outcome_at",
      result,
      "resolution_deadline_at must not be after outcome_at for no_release",
    );
    if (!record.event_outcome_source_id || !record.event_outcome_source_path) {
      addError(result, "release_status no_release requires a committed event outcome source");
    }
    if (record.event_outcome_status === "pending") {
      addError(result, "release_status no_release requires the event proposition to be adjudicated");
    }
    if (record.event_outcome_status === "resolved" && record.event_outcome !== 0) {
      addError(result, "release_status no_release cannot resolve to a positive event outcome");
    }
    if (record.target_outcome_status === "resolved") {
      addError(result, "release_status no_release cannot resolve an event-reaction security outcome");
    }
  }
  if (record.target_outcome_status === "resolved" && record.release_status !== "released") {
    addError(result, "a resolved security outcome requires release_status released");
  }
  if (record.target_outcome_status === "resolved") {
    requireFields(
      record,
      [
        "security_start_price",
        "security_start_at",
        "security_end_price",
        "security_end_at",
        "security_end_session_number",
        "security_price_source",
        "security_price_adjustment_rule",
        "benchmark_start_value",
        "benchmark_end_value",
        "benchmark_price_source",
        "benchmark_price_adjustment_rule",
        "market_observation_path",
        "market_observation_hash",
      ],
      result,
    );
  }
  const resolvedCount = [record.event_outcome_status, record.target_outcome_status].filter(
    (value) => value === "resolved",
  ).length;
  if (record.status === "resolved" && resolvedCount !== 2) {
    addError(result, "status resolved requires both propositions to be resolved");
  }
  const nonPendingCount = [record.event_outcome_status, record.target_outcome_status].filter(
    (value) => value !== "pending",
  ).length;
  if (record.status === "draft" && nonPendingCount > 0) {
    addError(result, "status draft requires both proposition statuses to be pending");
  }
  if (
    record.status === "partial" &&
    (nonPendingCount === 0 ||
      resolvedCount === 2 ||
      (record.event_outcome_status === "unresolvable" &&
        record.target_outcome_status === "unresolvable"))
  ) {
    addError(
      result,
      "status partial requires at least one adjudicated proposition without both resolving or both being unresolvable",
    );
  }
  if (
    record.status === "unresolvable" &&
    !(record.event_outcome_status === "unresolvable" &&
      record.target_outcome_status === "unresolvable")
  ) {
    addError(result, "status unresolvable requires both propositions to be unresolvable");
  }
  return result;
}

const evaluationSpecStatuses = new Set(["draft", "published", "superseded"]);

export function validateEvaluationSpecRecord(record, path = "<memory>") {
  const result = diagnostics("evaluation_spec", path);
  rejectUnknownFields(
    record,
    [
      "type", "evaluation_spec_id", "status", "created_at", "published_at",
      "price_provider_id", "benchmark_price_provider_id", "exchange_calendar_id",
      "exchange_calendar_version", "calendar_source_id", "calendar_source_path",
      "calendar_verification_fixture", "calendar_fixture_hash",
      "price_provider_rule",
      "benchmark_price_provider_rule", "market_timezone_rule", "exchange_calendar_rule",
      "entry_observation_rule", "exit_observation_rule", "price_adjustment_rule",
      "benchmark_price_adjustment_rule",
      "corporate_action_rule", "halt_rule", "delisting_rule", "missing_price_rule",
      "cost_rule", "borrow_rule",
    ],
    result,
  );
  requireFields(
    record,
    [
      "type",
      "evaluation_spec_id",
      "status",
      "created_at",
      "price_provider_rule",
      "benchmark_price_provider_rule",
      "market_timezone_rule",
      "exchange_calendar_rule",
      "entry_observation_rule",
      "exit_observation_rule",
      "price_adjustment_rule",
      "benchmark_price_adjustment_rule",
      "corporate_action_rule",
      "halt_rule",
      "delisting_rule",
      "missing_price_rule",
      "cost_rule",
      "borrow_rule",
    ],
    result,
  );
  if (record.type !== undefined && record.type !== "event_evaluation_spec") {
    addError(result, "type must equal event_evaluation_spec");
  }
  validatePattern(record, "evaluation_spec_id", /^event-v[1-9]\d*$/, "match event-v1", result);
  for (const field of [
    "price_provider_id",
    "benchmark_price_provider_id",
    "exchange_calendar_id",
    "exchange_calendar_version",
  ]) {
    validatePattern(
      record,
      field,
      /^[a-z0-9][a-z0-9._-]*$/,
      "use a stable lowercase identifier",
      result,
    );
  }
  validatePattern(record, "calendar_source_id", /^S-\d{3,}$/, "match S-001", result);
  validateEnum(record, "status", evaluationSpecStatuses, result);
  validateTimestamp(record, "created_at", result);
  validateTimestamp(record, "published_at", result);
  validateEnum(record, "price_adjustment_rule", priceAdjustmentRules, result);
  validateEnum(record, "benchmark_price_adjustment_rule", priceAdjustmentRules, result);
  for (const field of [
    "calendar_source_path", "calendar_verification_fixture", "price_provider_rule", "benchmark_price_provider_rule",
    "market_timezone_rule", "exchange_calendar_rule", "entry_observation_rule",
    "exit_observation_rule", "corporate_action_rule", "halt_rule", "delisting_rule",
    "missing_price_rule", "cost_rule", "borrow_rule",
  ]) validateString(record, field, result);
  validatePattern(record, "calendar_fixture_hash", /^sha256:[a-f0-9]{64}$/, "be a lowercase SHA-256 digest", result);
  if (["published", "superseded"].includes(record.status)) {
    requireFields(
      record,
      [
        "published_at",
        "price_provider_id",
        "benchmark_price_provider_id",
        "exchange_calendar_id",
        "exchange_calendar_version",
        "calendar_source_id",
        "calendar_source_path",
        "calendar_verification_fixture",
        "calendar_fixture_hash",
        "benchmark_price_adjustment_rule",
      ],
      result,
    );
  }
  if (record.status === "draft" && record.published_at) {
    addError(result, "a draft evaluation specification cannot have published_at");
  }
  return result;
}

export function validateSourceRecord(record, path = "<memory>") {
  const result = diagnostics("source_record", path);
  rejectUnknownFields(
    record,
    [
      "type", "id", "canonical_url", "publisher", "title", "published_at", "first_public_at",
      "retrieved_at", "effective_at", "provider_version", "checksum", "evidence_type",
      "intended_use", "rights", "access_state", "retrieval", "verification", "capture",
      "supersedes_source_id",
    ],
    result,
  );
  requireFields(
    record,
    [
      "type",
      "id",
      "canonical_url",
      "publisher",
      "title",
      "first_public_at",
      "retrieved_at",
      "evidence_type",
      "intended_use",
      "rights",
      "access_state",
      "retrieval",
      "verification",
      "capture",
    ],
    result,
  );
  if (record.type !== undefined && record.type !== "source_record") {
    addError(result, "type must equal source_record");
  }
  validatePattern(record, "id", /^S-\d{3,}$/, "match S-001", result);
  validatePublicHttpUrl(record, "canonical_url", result);
  for (const field of ["publisher", "title", "intended_use", "retrieval"]) {
    validateString(record, field, result);
  }
  validatePattern(record, "checksum", /^[A-Za-z0-9:_-]+$/, "use a versioned digest", result);
  validatePattern(record, "supersedes_source_id", /^S-\d{3,}$/, "match S-001", result);
  validateEnum(record, "evidence_type", sourceEvidenceTypes, result);
  validateEnum(record, "rights", sourceRights, result);
  validateEnum(record, "access_state", sourceAccessStates, result);
  validateEnum(record, "verification", sourceVerificationStates, result);
  validateEnum(record, "capture", sourceCaptureStates, result);
  for (const field of ["published_at", "first_public_at", "retrieved_at", "effective_at"]) {
    validateTimestamp(record, field, result);
  }
  compareTimestamps(
    record,
    "published_at",
    "first_public_at",
    result,
    "published_at must not be after first_public_at",
  );
  compareTimestamps(
    record,
    "first_public_at",
    "retrieved_at",
    result,
    "first_public_at must not be after retrieved_at",
  );
  return result;
}

export function validateFactRecord(record, path = "<memory>") {
  const result = diagnostics("fact_record", path);
  rejectUnknownFields(
    record,
    [
      "type", "id", "subject_id", "metric", "value", "unit", "currency", "period_start",
      "period_end", "valid_from", "valid_to", "known_from", "known_to", "source_id",
      "derivation", "restatement_of",
    ],
    result,
  );
  requireFields(
    record,
    ["type", "id", "subject_id", "metric", "value", "unit", "valid_from", "known_from", "source_id"],
    result,
  );
  if (record.type !== undefined && record.type !== "fact_record") {
    addError(result, "type must equal fact_record");
  }
  if (
    record.value !== undefined &&
    record.value !== null &&
    (!["number", "string", "boolean"].includes(typeof record.value) ||
      (typeof record.value === "number" && !Number.isFinite(record.value)) ||
      (typeof record.value === "string" && record.value.length === 0))
  ) {
    addError(result, "value must be a finite number, non-empty string, or boolean");
  }
  validatePattern(record, "id", /^F-\d{3,}$/, "match F-001", result);
  validatePattern(record, "source_id", /^S-\d{3,}$/, "match S-001", result);
  validatePattern(record, "restatement_of", /^F-\d{3,}$/, "match F-001", result);
  validatePattern(record, "currency", /^[A-Z]{3}$/, "use an ISO 4217 code", result);
  for (const field of ["subject_id", "metric", "unit", "derivation"]) {
    validateString(record, field, result);
  }
  validateDate(record, "period_start", result);
  validateDate(record, "period_end", result);
  for (const field of ["valid_from", "valid_to", "known_from", "known_to"]) {
    validateTimestamp(record, field, result);
  }
  compareTimestamps(
    record,
    "period_start",
    "period_end",
    result,
    "period_start must not be after period_end",
  );
  compareTimestamps(record, "valid_from", "valid_to", result, "valid_from must not be after valid_to");
  compareTimestamps(record, "known_from", "known_to", result, "known_from must not be after known_to");
  return result;
}

export function validateFactSnapshotRecord(record, path = "<memory>") {
  const result = diagnostics("fact_snapshot", path);
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    addError(result, "fact snapshot must be a JSON object");
    return result;
  }
  requireFields(record, ["type", "snapshot_id", "created_at", "source_cutoff_at", "records"], result);
  if (record.type !== undefined && record.type !== "fact_snapshot") {
    addError(result, "type must equal fact_snapshot");
  }
  validatePattern(record, "snapshot_id", /^FS-\d{3,}$/, "match FS-001", result);
  validateTimestamp(record, "created_at", result);
  validateTimestamp(record, "source_cutoff_at", result);
  compareTimestamps(
    record,
    "created_at",
    "source_cutoff_at",
    result,
    "created_at must not be after source_cutoff_at",
  );
  if (!Array.isArray(record.records) || record.records.length === 0) {
    addError(result, "records must be a non-empty array");
  } else {
    for (const [index, item] of record.records.entries()) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        addError(result, `records[${index}] must be an object`);
        continue;
      }
      for (const field of ["fact_path", "source_path"]) {
        if (typeof item[field] !== "string" || item[field].length === 0) {
          addError(result, `records[${index}].${field} must be a non-empty string`);
        }
      }
      for (const field of Object.keys(item)) {
        if (!["fact_path", "source_path"].includes(field)) {
          addError(result, `records[${index}] contains unknown field: ${field}`);
        }
      }
    }
  }
  for (const field of Object.keys(record)) {
    if (!["type", "snapshot_id", "created_at", "source_cutoff_at", "records"].includes(field)) {
      addError(result, `Unknown fact-snapshot field: ${field}`);
    }
  }
  return result;
}

function rejectUnknownObjectFields(record, allowedFields, result, label) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    addError(result, `${label} must be an object`);
    return false;
  }
  for (const field of Object.keys(record)) {
    if (!allowedFields.includes(field)) addError(result, `${label} contains unknown field: ${field}`);
  }
  return true;
}

export function validateCalendarSnapshotRecord(record, path = "<memory>") {
  const result = diagnostics("exchange_calendar_snapshot", path);
  if (!rejectUnknownObjectFields(
    record,
    ["type", "schema_version", "provider_id", "provider_version", "generated_at", "coverage_start", "coverage_end", "calendars"],
    result,
    "calendar snapshot",
  )) return result;
  requireFields(
    record,
    ["type", "schema_version", "provider_id", "provider_version", "generated_at", "coverage_start", "coverage_end", "calendars"],
    result,
  );
  if (record.type !== "exchange_calendar_snapshot") addError(result, "type must equal exchange_calendar_snapshot");
  if (record.schema_version !== 1) addError(result, "schema_version must equal 1");
  for (const field of ["provider_id", "provider_version"]) validateString(record, field, result);
  validateTimestamp(record, "generated_at", result);
  validateDate(record, "coverage_start", result);
  validateDate(record, "coverage_end", result);
  compareTimestamps(record, "coverage_start", "coverage_end", result, "coverage_start must not be after coverage_end");
  if (!record.calendars || typeof record.calendars !== "object" || Array.isArray(record.calendars)) {
    addError(result, "calendars must be a non-empty object");
    return result;
  }
  const calendarEntries = Object.entries(record.calendars);
  if (calendarEntries.length === 0) addError(result, "calendars must be a non-empty object");
  for (const [calendarId, calendar] of calendarEntries) {
    const label = `calendars.${calendarId}`;
    if (!rejectUnknownObjectFields(calendar, ["timezone", "exchange_aliases", "sessions"], result, label)) continue;
    if (typeof calendar.timezone !== "string" || calendar.timezone.length === 0) {
      addError(result, `${label}.timezone must be a non-empty string`);
    }
    if (!Array.isArray(calendar.exchange_aliases) || calendar.exchange_aliases.length === 0 ||
      calendar.exchange_aliases.some((value) => typeof value !== "string" || value.length === 0)) {
      addError(result, `${label}.exchange_aliases must be a non-empty string array`);
    }
    if (!Array.isArray(calendar.sessions) || calendar.sessions.length === 0) {
      addError(result, `${label}.sessions must be a non-empty array`);
      continue;
    }
    let previousDate = null;
    let previousClose = null;
    for (const [index, session] of calendar.sessions.entries()) {
      const sessionLabel = `${label}.sessions[${index}]`;
      if (!rejectUnknownObjectFields(session, ["session_date", "open_at", "close_at"], result, sessionLabel)) continue;
      const synthetic = {
        session_date: session.session_date,
        open_at: session.open_at,
        close_at: session.close_at,
      };
      requireFields(synthetic, ["session_date", "open_at", "close_at"], result);
      validateDate(synthetic, "session_date", result);
      validateTimestamp(synthetic, "open_at", result);
      validateTimestamp(synthetic, "close_at", result);
      if (Date.parse(session.open_at) >= Date.parse(session.close_at)) {
        addError(result, `${sessionLabel}.open_at must precede close_at`);
      }
      if (previousDate && session.session_date <= previousDate) {
        addError(result, `${label}.sessions must be strictly sorted by unique session_date`);
      }
      if (previousClose && Date.parse(session.open_at) <= Date.parse(previousClose)) {
        addError(result, `${label}.sessions must not overlap`);
      }
      if (session.session_date < record.coverage_start || session.session_date > record.coverage_end) {
        addError(result, `${sessionLabel}.session_date is outside snapshot coverage`);
      }
      previousDate = session.session_date;
      previousClose = session.close_at;
    }
  }
  return result;
}

function validateObservationSide(side, label, result) {
  if (!rejectUnknownObjectFields(
    side,
    ["security_id", "benchmark_id", "provider_id", "provider_version", "adjustment_rule", "source_id", "source_path", "capture_path", "capture_hash", "start", "end"],
    result,
    label,
  )) return;
  const idField = label === "security" ? "security_id" : "benchmark_id";
  for (const field of [idField, "provider_id", "provider_version", "source_id", "source_path", "capture_path", "capture_hash"]) {
    if (typeof side[field] !== "string" || side[field].length === 0) addError(result, `${label}.${field} must be a non-empty string`);
  }
  if (!/^S-\d{3,}$/.test(String(side.source_id))) addError(result, `${label}.source_id must match S-001`);
  if (!/^sha256:[a-f0-9]{64}$/.test(String(side.capture_hash))) {
    addError(result, `${label}.capture_hash must be a full lowercase SHA-256 digest`);
  }
  if (!priceAdjustmentRules.has(side.adjustment_rule)) {
    addError(result, `${label}.adjustment_rule is invalid`);
  }
  for (const pointName of ["start", "end"]) {
    const point = side[pointName];
    const pointLabel = `${label}.${pointName}`;
    if (!rejectUnknownObjectFields(point, ["observed_at", "value", "kind"], result, pointLabel)) continue;
    if (typeof point.value !== "number" || !Number.isFinite(point.value) || point.value <= 0) {
      addError(result, `${pointLabel}.value must be a positive finite number`);
    }
    const synthetic = { observed_at: point.observed_at };
    validateTimestamp(synthetic, "observed_at", result);
    if (!["reference_snapshot", "official_close"].includes(point.kind)) {
      addError(result, `${pointLabel}.kind must be reference_snapshot or official_close`);
    }
  }
}

export function validateMarketObservationBundleRecord(record, path = "<memory>") {
  const result = diagnostics("event_market_observations", path);
  if (!rejectUnknownObjectFields(
    record,
    ["type", "schema_version", "forecast_id", "captured_at", "security", "benchmark"],
    result,
    "market observation bundle",
  )) return result;
  requireFields(record, ["type", "schema_version", "forecast_id", "captured_at", "security", "benchmark"], result);
  if (record.type !== "event_market_observations") addError(result, "type must equal event_market_observations");
  if (record.schema_version !== 1) addError(result, "schema_version must equal 1");
  validatePattern(record, "forecast_id", /^\d{4}-E\d{3,}$/, "match YYYY-E001", result);
  validateTimestamp(record, "captured_at", result);
  validateObservationSide(record.security, "security", result);
  validateObservationSide(record.benchmark, "benchmark", result);
  for (const side of [record.security, record.benchmark]) {
    if (!side?.start || !side?.end) continue;
    if (Date.parse(side.start.observed_at) > Date.parse(side.end.observed_at)) {
      addError(result, "market observation start must not be after end");
    }
    if (Date.parse(side.end.observed_at) > Date.parse(record.captured_at)) {
      addError(result, "market observations must not postdate captured_at");
    }
  }
  return result;
}

export function validateMarketDataCaptureRecord(record, path = "<memory>") {
  const result = diagnostics("market_data_capture", path);
  if (!rejectUnknownObjectFields(
    record,
    ["type", "schema_version", "source_id", "provider_id", "provider_version", "retrieved_at", "instrument_id", "adjustment_rule", "observations"],
    result,
    "market data capture",
  )) return result;
  requireFields(
    record,
    ["type", "schema_version", "source_id", "provider_id", "provider_version", "retrieved_at", "instrument_id", "adjustment_rule", "observations"],
    result,
  );
  if (record.type !== "market_data_capture") addError(result, "type must equal market_data_capture");
  if (record.schema_version !== 1) addError(result, "schema_version must equal 1");
  validatePattern(record, "source_id", /^S-\d{3,}$/, "match S-001", result);
  for (const field of ["provider_id", "provider_version", "instrument_id"]) validateString(record, field, result);
  validateTimestamp(record, "retrieved_at", result);
  if (!priceAdjustmentRules.has(record.adjustment_rule)) addError(result, "adjustment_rule is invalid");
  if (!Array.isArray(record.observations) || record.observations.length < 2) {
    addError(result, "observations must contain at least two records");
    return result;
  }
  let previousTimestamp = null;
  for (const [index, observation] of record.observations.entries()) {
    const label = `observations[${index}]`;
    if (!rejectUnknownObjectFields(observation, ["observed_at", "value", "kind"], result, label)) continue;
    requireFields(observation, ["observed_at", "value", "kind"], result);
    validateTimestamp(observation, "observed_at", result);
    if (typeof observation.value !== "number" || !Number.isFinite(observation.value) || observation.value <= 0) {
      addError(result, `${label}.value must be a positive finite number`);
    }
    if (!["reference_snapshot", "official_close"].includes(observation.kind)) {
      addError(result, `${label}.kind must be reference_snapshot or official_close`);
    }
    if (previousTimestamp && Date.parse(observation.observed_at) <= Date.parse(previousTimestamp)) {
      addError(result, "observations must be strictly sorted by unique observed_at");
    }
    previousTimestamp = observation.observed_at;
  }
  return result;
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") field += character;
  }

  if (quoted) throw new Error("CSV contains an unterminated quoted field.");
  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function parseProbability(value, label) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`${label} must be between 0 and 100`);
  }
  return parsed / 100;
}

function parseOutcome(value, label) {
  if (value !== "0" && value !== "1") throw new Error(`${label} must be 0 or 1`);
  return Number(value);
}

function summarizeScores(items) {
  if (items.length === 0) {
    return {
      n: 0,
      brierScore: null,
      baselineBrierScore: null,
      brierSkillScore: null,
      accuracyAt50: null,
      calibration: [],
    };
  }
  const brierScore = items.reduce((sum, item) => sum + (item.probability - item.outcome) ** 2, 0) / items.length;
  const baselineBrierScore =
    items.reduce((sum, item) => sum + (item.baselineProbability - item.outcome) ** 2, 0) /
    items.length;
  const accuracy = items.filter((item) => Number(item.probability >= 0.5) === item.outcome).length / items.length;
  const calibration = [];
  for (let lowerPct = 0; lowerPct < 100; lowerPct += 20) {
    const upperPct = lowerPct + 20;
    const bucket = items.filter((item) =>
      upperPct === 100
        ? item.probability * 100 >= lowerPct && item.probability * 100 <= upperPct
        : item.probability * 100 >= lowerPct && item.probability * 100 < upperPct,
    );
    if (bucket.length === 0) continue;
    calibration.push({
      range: `${lowerPct}-${upperPct}`,
      n: bucket.length,
      meanProbability: bucket.reduce((sum, item) => sum + item.probability, 0) / bucket.length,
      outcomeRate: bucket.reduce((sum, item) => sum + item.outcome, 0) / bucket.length,
    });
  }
  return {
    n: items.length,
    brierScore,
    baselineBrierScore,
    brierSkillScore: baselineBrierScore === 0 ? null : 1 - brierScore / baselineBrierScore,
    accuracyAt50: accuracy,
    calibration,
  };
}

function addGroupedItem(groupMap, key, kind, item) {
  const group = groupMap.get(key) ?? { events: [], targets: [] };
  group[kind].push(item);
  groupMap.set(key, group);
}

function validateLedgerTimestamp(record, field) {
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(record[field]) || !Number.isFinite(Date.parse(record[field]))) {
    throw new Error(`${record.id} ${field} must be an ISO timestamp with timezone`);
  }
}

export function scoreEventLedger(text, path = "<memory>") {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error("Event ledger is empty.");
  const headers = rows[0];
  if (
    headers.length !== eventLedgerHeaders.length ||
    headers.some((header, index) => header !== eventLedgerHeaders[index])
  ) {
    throw new Error(`Event ledger header must exactly match: ${eventLedgerHeaders.join(",")}`);
  }

  const records = rows.slice(1).map((values, rowIndex) => {
    if (values.length !== headers.length) {
      throw new Error(`CSV row ${rowIndex + 2} has ${values.length} fields; expected ${headers.length}`);
    }
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
  const seen = new Set();
  const eventItems = [];
  const targetItems = [];
  const byType = new Map();
  const byEvaluationSpec = new Map();
  const statusCounts = Object.fromEntries([...eventLedgerStatuses].map((status) => [status, 0]));

  for (const [index, record] of records.entries()) {
    const rowNumber = index + 2;
    const requiredValues = eventLedgerHeaders.filter(
      (header) =>
        ![
          "event_outcome",
          "target_outcome",
          "outcome_at",
          "outcome_path",
          "outcome_commit_url",
          "status_reason",
        ].includes(header),
    );
    for (const field of requiredValues) {
      if (record[field] === "") throw new Error(`CSV row ${rowNumber} is missing ${field}`);
    }
    if (!/^\d{4}-E\d{3,}$/.test(record.id)) throw new Error(`${record.id || `row ${rowNumber}`} has an invalid id`);
    if (!/^\d{4}-C\d{3,}$/.test(record.candidate_id)) throw new Error(`${record.id} has an invalid candidate_id`);
    canonicalCommitUrl(record.candidate_ledger_commit_url, `${record.id} candidate_ledger_commit_url`);
    if (seen.has(record.id)) throw new Error(`Duplicate event forecast id: ${record.id}`);
    seen.add(record.id);
    if (!/^[A-Z0-9.-]+$/.test(record.ticker)) throw new Error(`${record.id} has an invalid ticker`);
    const noReleaseUrlDiagnostics = diagnostics("event_ledger_url", path);
    validatePublicHttpUrl(record, "no_release_check_url", noReleaseUrlDiagnostics);
    if (!noReleaseUrlDiagnostics.valid) {
      throw new Error(`${record.id} ${noReleaseUrlDiagnostics.errors.join("; ")}`);
    }
    if (!eventTypes.has(record.event_type)) throw new Error(`${record.id} has an invalid event_type`);
    if (!deadlineMissResolutions.has(record.deadline_miss_resolution)) {
      throw new Error(`${record.id} has an invalid deadline_miss_resolution`);
    }
    if (!/^S-\d{3,}$/.test(record.event_baseline_id)) {
      throw new Error(`${record.id} has an invalid event_baseline_id`);
    }
    if (!/^S-\d{3,}$/.test(record.target_baseline_id)) {
      throw new Error(`${record.id} has an invalid target_baseline_id`);
    }
    if (!eventLedgerStatuses.has(record.status)) throw new Error(`${record.id} has an invalid status`);
    statusCounts[record.status] += 1;
    if (!/^sha256:[a-f0-9]{64}$/.test(record.identity_hash)) {
      throw new Error(`${record.id} has an invalid identity_hash`);
    }
    if (!/^event-v[1-9]\d*$/.test(record.evaluation_spec_id)) {
      throw new Error(`${record.id} has an invalid evaluation_spec_id`);
    }
    if (!marketSessions.has(record.market_session)) throw new Error(`${record.id} has an invalid market_session`);
    if (!eventDirections.has(record.target_direction)) throw new Error(`${record.id} has an invalid target_direction`);
    if (!returnBases.has(record.return_basis)) throw new Error(`${record.id} has an invalid return_basis`);
    if (!entryObservationRules.has(record.entry_observation_rule)) {
      throw new Error(`${record.id} has an invalid entry_observation_rule`);
    }
    if (!returnMetrics.has(record.return_metric)) throw new Error(`${record.id} has an invalid return_metric`);
    const expectedEntryRule =
      record.return_basis === "decision_holding_period"
        ? "reference_price"
        : "last_close_before_release";
    if (record.entry_observation_rule !== expectedEntryRule) {
      throw new Error(`${record.id} ${record.return_basis} requires entry_observation_rule ${expectedEntryRule}`);
    }
    if (!priceAdjustmentRules.has(record.price_adjustment_rule)) {
      throw new Error(`${record.id} has an invalid price_adjustment_rule`);
    }
    if (!priceAdjustmentRules.has(record.benchmark_price_adjustment_rule)) {
      throw new Error(`${record.id} has an invalid benchmark_price_adjustment_rule`);
    }
    if (!/^[A-Za-z0-9._-]+$/.test(record.method_version)) {
      throw new Error(`${record.id} has an invalid method_version`);
    }
    if (!/^sha256:[a-f0-9]{64}$/.test(record.fact_snapshot_hash)) {
      throw new Error(`${record.id} has an invalid fact_snapshot_hash`);
    }
    for (const field of [
      "published_at",
      "source_cutoff_at",
      "schedule_known_at",
      "event_window_start",
      "event_window_end",
      "reference_price_at",
    ]) {
      validateLedgerTimestamp(record, field);
    }
    if (Date.parse(record.source_cutoff_at) > Date.parse(record.published_at)) {
      throw new Error(`${record.id} source_cutoff_at is after published_at`);
    }
    if (Date.parse(record.schedule_known_at) > Date.parse(record.source_cutoff_at)) {
      throw new Error(`${record.id} schedule_known_at is after source_cutoff_at`);
    }
    if (Date.parse(record.published_at) >= Date.parse(record.event_window_start)) {
      throw new Error(`${record.id} published_at must strictly precede event_window_start`);
    }
    if (Date.parse(record.event_window_start) > Date.parse(record.event_window_end)) {
      throw new Error(`${record.id} event_window_start is after event_window_end`);
    }
    if (Date.parse(record.reference_price_at) > Date.parse(record.published_at)) {
      throw new Error(`${record.id} reference_price_at is after published_at`);
    }
    const eventProbability = parseProbability(
      record.event_probability_pct,
      `${record.id} event_probability_pct`,
    );
    const targetProbability = parseProbability(
      record.target_probability_pct,
      `${record.id} target_probability_pct`,
    );
    const eventBaselineProbability = parseProbability(
      record.event_baseline_probability_pct,
      `${record.id} event_baseline_probability_pct`,
    );
    const targetBaselineProbability = parseProbability(
      record.target_baseline_probability_pct,
      `${record.id} target_baseline_probability_pct`,
    );
    const baselineSampleSize = Number(record.event_baseline_sample_size);
    if (!Number.isInteger(baselineSampleSize) || baselineSampleSize < 1) {
      throw new Error(`${record.id} event_baseline_sample_size must be a positive integer`);
    }
    const threshold = Number(record.target_return_threshold_pct);
    if (!Number.isFinite(threshold) || threshold <= 0) {
      throw new Error(`${record.id} target_return_threshold_pct must be greater than 0`);
    }
    const sessions = Number(record.target_return_window_sessions);
    if (!Number.isInteger(sessions) || sessions < 1) {
      throw new Error(`${record.id} target_return_window_sessions must be a positive integer`);
    }
    const referencePrice = Number(record.reference_price);
    if (!Number.isFinite(referencePrice) || referencePrice <= 0) {
      throw new Error(`${record.id} reference_price must be greater than 0`);
    }
    canonicalCommitUrl(record.commit_url, `${record.id} commit_url`);
    if (!outcomeStatuses.has(record.event_outcome_status)) {
      throw new Error(`${record.id} has an invalid event_outcome_status`);
    }
    if (!outcomeStatuses.has(record.target_outcome_status)) {
      throw new Error(`${record.id} has an invalid target_outcome_status`);
    }

    const resolvedPropositions = [record.event_outcome_status, record.target_outcome_status].filter(
      (status) => status === "resolved",
    ).length;
    const nonPendingPropositions = [record.event_outcome_status, record.target_outcome_status].filter(
      (status) => status !== "pending",
    ).length;
    if (record.status === "active" && nonPendingPropositions !== 0) {
      throw new Error(`${record.id} active status requires both proposition statuses to be pending`);
    }
    if (
      record.status === "partially_resolved" &&
      (nonPendingPropositions === 0 ||
        resolvedPropositions === 2 ||
        (record.event_outcome_status === "unresolvable" &&
          record.target_outcome_status === "unresolvable"))
    ) {
      throw new Error(
        `${record.id} partially_resolved status requires at least one adjudicated proposition without both resolving or both being unresolvable`,
      );
    }
    if (record.status === "resolved" && resolvedPropositions !== 2) {
      throw new Error(`${record.id} resolved status requires both propositions to be resolved`);
    }
    if (
      record.status === "unresolvable" &&
      !(record.event_outcome_status === "unresolvable" && record.target_outcome_status === "unresolvable")
    ) {
      throw new Error(`${record.id} unresolvable status requires both propositions to be unresolvable`);
    }
    if (["invalidated", "superseded", "unresolvable"].includes(record.status) && !record.status_reason) {
      throw new Error(`${record.id} ${record.status} status requires status_reason`);
    }
    if (nonPendingPropositions > 0) {
      if (!record.outcome_at) throw new Error(`${record.id} has an outcome status but outcome_at is missing`);
      if (!record.outcome_path) throw new Error(`${record.id} has an outcome status but outcome_path is missing`);
      canonicalCommitUrl(record.outcome_commit_url, `${record.id} outcome_commit_url`);
      validateLedgerTimestamp(record, "outcome_at");
      if (Date.parse(record.outcome_at) < Date.parse(record.published_at)) {
        throw new Error(`${record.id} outcome_at is before published_at`);
      }
    }

    const propositionDefinitions = [
      {
        kind: "events",
        status: record.event_outcome_status,
        outcomeField: "event_outcome",
        probability: eventProbability,
        baselineProbability: eventBaselineProbability,
        destination: eventItems,
      },
      {
        kind: "targets",
        status: record.target_outcome_status,
        outcomeField: "target_outcome",
        probability: targetProbability,
        baselineProbability: targetBaselineProbability,
        destination: targetItems,
      },
    ];
    for (const proposition of propositionDefinitions) {
      if (proposition.status !== "resolved") {
        if (record[proposition.outcomeField] !== "") {
          throw new Error(
            `${record.id} ${proposition.outcomeField} must be empty unless its proposition is resolved`,
          );
        }
        continue;
      }
      const item = {
        probability: proposition.probability,
        baselineProbability: proposition.baselineProbability,
        outcome: parseOutcome(record[proposition.outcomeField], `${record.id} ${proposition.outcomeField}`),
      };
      proposition.destination.push(item);
      addGroupedItem(byType, record.event_type, proposition.kind, item);
      addGroupedItem(byEvaluationSpec, record.evaluation_spec_id, proposition.kind, item);
    }
  }

  const warnings = [];
  if (eventItems.length < 30) {
    warnings.push("Insufficient resolved event observations for strong calibration conclusions (n < 30).");
  }
  if (targetItems.length < 30) {
    warnings.push("Insufficient resolved security observations for strong calibration conclusions (n < 30).");
  }
  return {
    path,
    totalRows: records.length,
    resolvedRows: records.filter(
      (record) =>
        record.event_outcome_status === "resolved" || record.target_outcome_status === "resolved",
    ).length,
    fullyResolvedRows: records.filter((record) => record.status === "resolved").length,
    statusCounts,
    propositionStatusCounts: {
      event: Object.fromEntries(
        [...outcomeStatuses].map((status) => [
          status,
          records.filter((record) => record.event_outcome_status === status).length,
        ]),
      ),
      security: Object.fromEntries(
        [...outcomeStatuses].map((status) => [
          status,
          records.filter((record) => record.target_outcome_status === status).length,
        ]),
      ),
    },
    statusReasons: records
      .filter((record) => record.status_reason)
      .map((record) => ({ id: record.id, status: record.status, reason: record.status_reason })),
    eventOutcome: summarizeScores(eventItems),
    securityOutcome: summarizeScores(targetItems),
    byEventType: Object.fromEntries(
      [...byType.entries()].map(([type, values]) => [
        type,
        {
          eventOutcome: summarizeScores(values.events),
          securityOutcome: summarizeScores(values.targets),
        },
      ]),
    ),
    byEvaluationSpec: Object.fromEntries(
      [...byEvaluationSpec.entries()].map(([specification, values]) => [
        specification,
        {
          eventOutcome: summarizeScores(values.events),
          securityOutcome: summarizeScores(values.targets),
        },
      ]),
    ),
    warnings,
  };
}

export function validateCompanyLedger(text, path = "<memory>") {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error("Company forecast ledger is empty.");
  const headers = rows[0];
  if (
    headers.length !== companyLedgerHeaders.length ||
    headers.some((header, index) => header !== companyLedgerHeaders[index])
  ) {
    throw new Error(`Company forecast ledger header must exactly match: ${companyLedgerHeaders.join(",")}`);
  }
  const seen = new Set();
  const records = rows.slice(1).map((values, index) => {
    if (values.length !== headers.length) {
      throw new Error(`CSV row ${index + 2} has ${values.length} fields; expected ${headers.length}`);
    }
    const record = Object.fromEntries(headers.map((header, fieldIndex) => [header, values[fieldIndex]]));
    for (const field of companyLedgerHeaders.filter((field) => !["sector_benchmark", "outcome_date"].includes(field))) {
      if (!record[field]) throw new Error(`CSV row ${index + 2} is missing ${field}`);
    }
    if (!/^\d{4}-T\d{3,}$/.test(record.id)) {
      throw new Error(`${record.id || `row ${index + 2}`} company forecast id must match YYYY-T001`);
    }
    if (seen.has(record.id)) throw new Error(`Duplicate company forecast id: ${record.id}`);
    seen.add(record.id);
    if (!/^[A-Z0-9.-]+$/.test(record.ticker)) throw new Error(`${record.id} has an invalid ticker`);
    if (!/^sha256:[a-f0-9]{64}$/.test(record.identity_hash)) throw new Error(`${record.id} has an invalid identity_hash`);
    if (!/^[A-Z]{3}$/.test(record.currency)) throw new Error(`${record.id} has an invalid currency`);
    if (!disclosures.has(record.position_disclosure)) throw new Error(`${record.id} has an invalid position_disclosure`);
    if (!companyLedgerStatuses.has(record.status)) throw new Error(`${record.id} has an invalid status`);
    canonicalCommitUrl(record.commit_url, `${record.id} commit_url`);
    for (const field of ["published_at", "source_cutoff_at", "reference_price_at"]) validateLedgerTimestamp(record, field);
    if (Date.parse(record.source_cutoff_at) > Date.parse(record.published_at)) {
      throw new Error(`${record.id} source_cutoff_at is after published_at`);
    }
    if (Date.parse(record.reference_price_at) > Date.parse(record.published_at)) {
      throw new Error(`${record.id} reference_price_at is after published_at`);
    }
    for (const field of ["reference_price", "target_bear", "target_base", "target_bull"]) {
      const value = Number(record[field]);
      if (!Number.isFinite(value) || value <= 0) throw new Error(`${record.id} ${field} must be greater than 0`);
    }
    if (!(Number(record.target_bear) <= Number(record.target_base) && Number(record.target_base) <= Number(record.target_bull))) {
      throw new Error(`${record.id} targets must satisfy bear <= base <= bull`);
    }
    {
      const dateResult = diagnostics("company_ledger", path);
      validateDate(record, "target_horizon", dateResult);
      if (record.outcome_date) validateDate(record, "outcome_date", dateResult);
      if (!dateResult.valid) throw new Error(`${record.id} ${dateResult.errors.join("; ")}`);
      if (Date.parse(`${record.target_horizon}T23:59:59Z`) < Date.parse(record.published_at)) {
        throw new Error(`${record.id} target_horizon is before published_at`);
      }
    }
    return record;
  });
  return { path, totalRows: records.length, statusCounts: Object.fromEntries([...companyLedgerStatuses].map((status) => [status, records.filter((record) => record.status === status).length])) };
}

export function auditCompanyLedgerLinks(text, root = repositoryRoot) {
  const validation = validateCompanyLedger(text);
  if (validation.totalRows === 0) return { validatedRows: 0, repositoryRoot: root };
  const rows = parseCsv(text);
  const headers = rows[0];
  const records = rows.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]])),
  );
  for (const record of records) {
    const commitHash = requireCommitUrlForOrigin(root, record.commit_url, `${record.id} commit_url`);
    const thesisContent = committedFile(root, commitHash, record.thesis_path, `${record.id} thesis_path`);
    const thesis = parseFlatFrontMatter(thesisContent);
    if (thesis.type !== "company_thesis" || thesis.research_status !== "published") {
      throw new Error(`${record.id} committed thesis is not a published company_thesis`);
    }
    const mappings = [
      ["id", "forecast_id"],
      ["published_at", "published_at"],
      ["source_cutoff_at", "source_cutoff_at"],
      ["ticker", "ticker"],
      ["identity_path", "identity_path"],
      ["identity_hash", "identity_hash"],
      ["security_id", "security_id"],
      ["listing_id", "listing_id"],
      ["currency", "currency"],
      ["reference_price", "reference_price"],
      ["reference_price_at", "reference_price_at"],
      ["price_source", "reference_price_source"],
      ["target_bear", "target_bear"],
      ["target_base", "target_base"],
      ["target_bull", "target_bull"],
      ["target_horizon", "target_horizon"],
      ["evaluation_rule", "evaluation_rule"],
      ["benchmark", "benchmark"],
      ["sector_benchmark", "sector_benchmark"],
      ["position_disclosure", "position_disclosure"],
    ];
    for (const [ledgerField, thesisField] of mappings) {
      if (record[ledgerField] !== csvScalar(thesis[thesisField])) {
        throw new Error(`${record.id} ${ledgerField} differs from committed thesis ${thesisField}`);
      }
    }
    const identityContent = committedFile(root, commitHash, record.identity_path, `${record.id} identity_path`);
    const identityDigest = `sha256:${createHash("sha256").update(identityContent).digest("hex")}`;
    if (identityDigest !== record.identity_hash) throw new Error(`${record.id} identity_hash differs from committed bytes`);
    const identity = parseFlatFrontMatter(identityContent);
    const identityValidation = validateIdentityRecord(identity, record.identity_path);
    if (!identityValidation.valid || identity.status !== "verified") {
      throw new Error(`${record.id} committed identity is not verified`);
    }
    for (const field of ["ticker", "security_id", "listing_id"]) {
      if (record[field] !== csvScalar(identity[field])) {
        throw new Error(`${record.id} ${field} differs from committed identity`);
      }
    }
    const commitTimestamp = gitOutput(
      ["show", "-s", "--format=%cI", commitHash],
      root,
      `${record.id} thesis commit timestamp`,
    ).trim();
    const publicationDelay = Date.parse(commitTimestamp) - Date.parse(record.published_at);
    if (!Number.isFinite(publicationDelay) || publicationDelay < 0 || publicationDelay > 10 * 60 * 1000) {
      throw new Error(`${record.id} published_at must be no more than 10 minutes before its commit timestamp`);
    }
  }
  return { validatedRows: records.length, repositoryRoot: root };
}

export function summarizeEventCandidates(text, path = "<memory>") {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error("Event candidate ledger is empty.");
  const headers = rows[0];
  if (
    headers.length !== eventCandidateHeaders.length ||
    headers.some((header, index) => header !== eventCandidateHeaders[index])
  ) {
    throw new Error(`Event candidate ledger header must exactly match: ${eventCandidateHeaders.join(",")}`);
  }
  const records = rows.slice(1).map((values, index) => {
    if (values.length !== headers.length) {
      throw new Error(`CSV row ${index + 2} has ${values.length} fields; expected ${headers.length}`);
    }
    return Object.fromEntries(headers.map((header, fieldIndex) => [header, values[fieldIndex]]));
  });
  const seen = new Set();
  const registeredForecasts = new Set();
  const decisionCounts = Object.fromEntries([...eventCandidateDecisions].map((decision) => [decision, 0]));
  for (const [index, record] of records.entries()) {
    const rowNumber = index + 2;
    for (const field of eventCandidateHeaders.filter((field) => field !== "forecast_id")) {
      if (!record[field]) throw new Error(`CSV row ${rowNumber} is missing ${field}`);
    }
    if (!/^\d{4}-C\d{3,}$/.test(record.candidate_id)) {
      throw new Error(`${record.candidate_id || `row ${rowNumber}`} has an invalid candidate_id`);
    }
    if (!/^[A-Za-z0-9._-]+$/.test(record.cohort_id)) {
      throw new Error(`${record.candidate_id} has an invalid cohort_id`);
    }
    if (seen.has(record.candidate_id)) throw new Error(`Duplicate event candidate id: ${record.candidate_id}`);
    seen.add(record.candidate_id);
    if (!eventTypes.has(record.event_type)) throw new Error(`${record.candidate_id} has an invalid event_type`);
    if (!eventCandidateDecisions.has(record.decision)) {
      throw new Error(`${record.candidate_id} has an invalid decision`);
    }
    decisionCounts[record.decision] += 1;
    for (const field of [
      "identified_at",
      "source_cutoff_at",
      "event_window_start",
      "event_window_end",
      "decision_at",
    ]) validateLedgerTimestamp({ ...record, id: record.candidate_id }, field);
    if (Date.parse(record.identified_at) > Date.parse(record.decision_at)) {
      throw new Error(`${record.candidate_id} identified_at is after decision_at`);
    }
    if (Date.parse(record.source_cutoff_at) > Date.parse(record.decision_at)) {
      throw new Error(`${record.candidate_id} source_cutoff_at is after decision_at`);
    }
    if (Date.parse(record.decision_at) > Date.parse(record.event_window_start)) {
      throw new Error(`${record.candidate_id} decision_at is after event_window_start`);
    }
    if (Date.parse(record.event_window_start) > Date.parse(record.event_window_end)) {
      throw new Error(`${record.candidate_id} event_window_start is after event_window_end`);
    }
    if (record.decision === "registered") {
      if (!/^\d{4}-E\d{3,}$/.test(record.forecast_id)) {
        throw new Error(`${record.candidate_id} registered decision requires a forecast_id`);
      }
      if (registeredForecasts.has(record.forecast_id)) {
        throw new Error(`Duplicate registered forecast_id: ${record.forecast_id}`);
      }
      registeredForecasts.add(record.forecast_id);
    } else if (record.forecast_id) {
      throw new Error(`${record.candidate_id} non-registered decision must not have a forecast_id`);
    }
  }
  return {
    path,
    totalCandidates: records.length,
    decisionCounts,
    registrationRate:
      records.length === 0 ? null : decisionCounts.registered / records.length,
    registrationRateEligibleDecided:
      decisionCounts.registered + decisionCounts.abstained === 0
        ? null
        : decisionCounts.registered / (decisionCounts.registered + decisionCounts.abstained),
    decisionClosureRate:
      records.length === 0 ? null : (records.length - decisionCounts.deferred) / records.length,
    cohortCounts: Object.fromEntries(
      [...new Set(records.map((record) => record.cohort_id))].map((cohortId) => [
        cohortId,
        records.filter((record) => record.cohort_id === cohortId).length,
      ]),
    ),
    warnings: records.length === 0 ? ["No declared event candidates have been prospectively recorded."] : [],
    reasons: records.map((record) => ({
      candidateId: record.candidate_id,
      decision: record.decision,
      reason: record.reason,
    })),
  };
}

function parsedCandidateRows(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error("Event candidate ledger is empty.");
  const headers = rows[0];
  if (
    headers.length !== eventCandidateHeaders.length ||
    headers.some((header, index) => header !== eventCandidateHeaders[index])
  ) {
    throw new Error(`Event candidate ledger header must exactly match: ${eventCandidateHeaders.join(",")}`);
  }
  return rows.slice(1).map((values, index) => {
    if (values.length !== headers.length) {
      throw new Error(`CSV row ${index + 2} has ${values.length} fields; expected ${headers.length}`);
    }
    return Object.fromEntries(headers.map((header, fieldIndex) => [header, values[fieldIndex]]));
  });
}

function trackedLedgerPath(root, path, label) {
  const resolvedPath = isAbsolute(path) ? resolve(path) : resolve(root, path);
  const relativePath = relative(root, resolvedPath);
  if (relativePath === "" || relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error(`${label} must be inside the repository root`);
  }
  return { resolvedPath, relativePath };
}

function fileAtCommitOrNull(root, commitHash, relativePath) {
  const result = spawnSync("git", ["show", `${commitHash}:${relativePath}`], {
    cwd: root,
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout : null;
}

function publicCommitUrl(root, commitHash) {
  const origin = normalizedRemoteRepository(
    gitOutput(["remote", "get-url", "origin"], root, "candidate ledger origin").trim(),
  );
  return `https://${origin.host}/${origin.path}/commit/${commitHash}`;
}

export function auditEventCandidateLedgerHistory(text, path, root = repositoryRoot) {
  const summary = summarizeEventCandidates(text, path);
  const currentRecords = parsedCandidateRows(text);
  if (currentRecords.length === 0) return { ...summary, validatedCandidates: 0, firstAppearance: {} };
  const { relativePath } = trackedLedgerPath(root, path, "event candidate ledger");
  const history = gitOutput(
    ["log", "--reverse", "--format=%H", "--", relativePath],
    root,
    "event candidate ledger history",
  ).trim().split("\n").filter(Boolean);
  if (history.length === 0) throw new Error("Event candidate ledger has rows but no committed history");

  const firstAppearance = new Map();
  const frozenRows = new Map();
  const allSeen = new Set();
  for (const commitHash of history) {
    const content = fileAtCommitOrNull(root, commitHash, relativePath);
    const records = content === null ? [] : parsedCandidateRows(content);
    const byId = new Map(records.map((record) => [record.candidate_id, record]));
    for (const [candidateId, frozen] of frozenRows) {
      const current = byId.get(candidateId);
      if (!current) throw new Error(`${candidateId} was deleted after prospective registration`);
      if (JSON.stringify(current) !== JSON.stringify(frozen)) {
        throw new Error(`${candidateId} changed after prospective registration`);
      }
    }
    for (const record of records) {
      allSeen.add(record.candidate_id);
      if (!firstAppearance.has(record.candidate_id)) {
        firstAppearance.set(record.candidate_id, commitHash);
        frozenRows.set(record.candidate_id, record);
      }
    }
  }
  const currentIds = new Set(currentRecords.map((record) => record.candidate_id));
  for (const candidateId of allSeen) {
    if (!currentIds.has(candidateId)) throw new Error(`${candidateId} is missing from the current candidate ledger`);
  }
  for (const record of currentRecords) {
    const commitHash = firstAppearance.get(record.candidate_id);
    if (!commitHash) throw new Error(`${record.candidate_id} has no first-appearance commit`);
    if (JSON.stringify(record) !== JSON.stringify(frozenRows.get(record.candidate_id))) {
      throw new Error(`${record.candidate_id} current row differs from its first committed version`);
    }
    const commitAt = gitOutput(
      ["show", "-s", "--format=%cI", commitHash],
      root,
      `${record.candidate_id} candidate commit timestamp`,
    ).trim();
    const publicationDelay = Date.parse(commitAt) - Date.parse(record.decision_at);
    if (!Number.isFinite(publicationDelay) || publicationDelay < 0 || publicationDelay > 10 * 60 * 1000) {
      throw new Error(`${record.candidate_id} decision_at must be no more than 10 minutes before first commit`);
    }
    if (Date.parse(commitAt) >= Date.parse(record.event_window_start)) {
      throw new Error(`${record.candidate_id} first commit must precede event_window_start`);
    }
  }
  for (const cohortId of new Set(currentRecords.map((record) => record.cohort_id))) {
    const commits = new Set(
      currentRecords
        .filter((record) => record.cohort_id === cohortId)
        .map((record) => firstAppearance.get(record.candidate_id)),
    );
    if (commits.size !== 1) throw new Error(`Cohort ${cohortId} was not frozen in one prospective commit`);
  }
  return {
    ...summary,
    validatedCandidates: currentRecords.length,
    firstAppearance: Object.fromEntries(
      currentRecords.map((record) => [record.candidate_id, publicCommitUrl(root, firstAppearance.get(record.candidate_id))]),
    ),
  };
}

function resolveTrackedPath(root, candidate, label) {
  if (!candidate || isAbsolute(candidate)) throw new Error(`${label} must be a repository-relative path`);
  const resolvedPath = resolve(root, candidate);
  const relativePath = relative(root, resolvedPath);
  if (relativePath === "" || relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error(`${label} escapes the repository root`);
  }
  return { resolvedPath, relativePath };
}

function commitHashFromUrl(url, label) {
  return canonicalCommitUrl(url, label).commitHash;
}

function gitOutput(argumentsList, root, label) {
  const result = spawnSync("git", argumentsList, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${label}: ${(result.stderr || result.stdout || "git command failed").trim()}`);
  }
  return result.stdout;
}

function committedFile(root, commitHash, path, label) {
  const { relativePath } = resolveTrackedPath(root, path, label);
  return gitOutput(["show", `${commitHash}:${relativePath}`], root, label);
}

export function auditedCommittedSource(root, commitHash, path, expectedId, cutoffAt, label) {
  const content = committedFile(root, commitHash, path, label);
  const source = parseFlatFrontMatter(content);
  const validation = validateSourceRecord(source, path);
  if (!validation.valid) throw new Error(`${label} is invalid: ${validation.errors.join("; ")}`);
  if (source.id !== expectedId) throw new Error(`${label} ID differs from ${expectedId}`);
  if (Date.parse(source.first_public_at) > Date.parse(cutoffAt)) {
    throw new Error(`${label} first_public_at is after the applicable cutoff`);
  }
  const commitAt = gitOutput(
    ["show", "-s", "--format=%cI", commitHash],
    root,
    `${label} containing commit timestamp`,
  ).trim();
  if (Date.parse(source.retrieved_at) > Date.parse(commitAt)) {
    throw new Error(`${label} retrieved_at is after the commit that contains it`);
  }
  if (source.verification === "unchecked") {
    throw new Error(`${label} must be checked against its canonical source`);
  }
  return source;
}

function auditFactSnapshot(root, commitHash, forecast) {
  const content = committedFile(
    root,
    commitHash,
    forecast.fact_snapshot_path,
    `${forecast.forecast_id} fact_snapshot_path`,
  );
  const digest = `sha256:${createHash("sha256").update(content).digest("hex")}`;
  if (digest !== forecast.fact_snapshot_hash) {
    throw new Error(`${forecast.forecast_id} fact_snapshot_hash does not match committed bytes`);
  }
  let snapshot;
  try {
    snapshot = JSON.parse(content);
  } catch {
    throw new Error(`${forecast.forecast_id} fact snapshot is not valid JSON`);
  }
  const validation = validateFactSnapshotRecord(snapshot, forecast.fact_snapshot_path);
  if (!validation.valid) {
    throw new Error(`${forecast.forecast_id} fact snapshot is invalid: ${validation.errors.join("; ")}`);
  }
  if (snapshot.source_cutoff_at !== forecast.source_cutoff_at) {
    throw new Error(`${forecast.forecast_id} fact snapshot cutoff differs from the forecast cutoff`);
  }
  const seenFactIds = new Set();
  for (const [index, item] of snapshot.records.entries()) {
    const factContent = committedFile(
      root,
      commitHash,
      item.fact_path,
      `${forecast.forecast_id} fact snapshot record ${index + 1}`,
    );
    const fact = parseFlatFrontMatter(factContent);
    const factValidation = validateFactRecord(fact, item.fact_path);
    if (!factValidation.valid) {
      throw new Error(`${forecast.forecast_id} fact ${fact.id || index + 1} is invalid: ${factValidation.errors.join("; ")}`);
    }
    if (seenFactIds.has(fact.id)) throw new Error(`${forecast.forecast_id} fact snapshot repeats ${fact.id}`);
    seenFactIds.add(fact.id);
    if (Date.parse(fact.known_from) > Date.parse(forecast.source_cutoff_at)) {
      throw new Error(`${forecast.forecast_id} fact ${fact.id} was not known by source_cutoff_at`);
    }
    auditedCommittedSource(
      root,
      commitHash,
      item.source_path,
      fact.source_id,
      forecast.source_cutoff_at,
      `${forecast.forecast_id} source for ${fact.id}`,
    );
  }
  return snapshot;
}

function parseCommittedJson(root, commitHash, path, expectedHash, label) {
  const content = committedFile(root, commitHash, path, label);
  const digest = `sha256:${createHash("sha256").update(content).digest("hex")}`;
  if (digest !== expectedHash) throw new Error(`${label} hash does not match committed bytes`);
  try {
    return { content, record: JSON.parse(content) };
  } catch {
    throw new Error(`${label} is not valid JSON`);
  }
}

function auditedCalendarSnapshot(root, commitHash, specification, label) {
  const { record } = parseCommittedJson(
    root,
    commitHash,
    specification.calendar_verification_fixture,
    specification.calendar_fixture_hash,
    label,
  );
  const validation = validateCalendarSnapshotRecord(record, specification.calendar_verification_fixture);
  if (!validation.valid) throw new Error(`${label} is invalid: ${validation.errors.join("; ")}`);
  if (record.provider_id !== specification.exchange_calendar_id) {
    throw new Error(`${label} provider_id differs from exchange_calendar_id`);
  }
  if (record.provider_version !== specification.exchange_calendar_version) {
    throw new Error(`${label} provider_version differs from exchange_calendar_version`);
  }
  if (Date.parse(record.generated_at) > Date.parse(specification.published_at)) {
    throw new Error(`${label} was generated after the evaluation specification was published`);
  }
  return record;
}

function calendarForIdentity(snapshot, identity, label) {
  const matches = Object.entries(snapshot.calendars).filter(([, calendar]) =>
    calendar.exchange_aliases.some(
      (alias) => String(alias).toUpperCase() === String(identity.exchange).toUpperCase(),
    ),
  );
  if (matches.length !== 1) {
    throw new Error(`${label} must map identity exchange ${identity.exchange} to exactly one calendar`);
  }
  return { calendarId: matches[0][0], calendar: matches[0][1] };
}

export function validateForecastCalendarCoverage(snapshot, identity, forecast, earliestReleaseAt, label) {
  const { calendar } = calendarForIdentity(snapshot, identity, label);
  const sessions = calendar.sessions;
  const priorClose = sessions.findLast(
    (session) => Date.parse(session.close_at) < Date.parse(earliestReleaseAt),
  );
  if (!priorClose) throw new Error(`${label} lacks a session close before the forecast commit`);
  const worstCaseFirstIndex = sessions.findIndex(
    (session) => Date.parse(session.open_at) > Date.parse(forecast.event_window_end),
  );
  if (worstCaseFirstIndex < 0) throw new Error(`${label} lacks a session after event_window_end`);
  if (!sessions[worstCaseFirstIndex + forecast.target_return_window_sessions - 1]) {
    throw new Error(`${label} does not cover the frozen return window after event_window_end`);
  }
}

function auditedMarketSource(root, commitHash, side, outcome, label) {
  const source = auditedCommittedSource(
    root,
    commitHash,
    side.source_path,
    side.source_id,
    outcome.outcome_at,
    label,
  );
  if (source.evidence_type !== "market_data") throw new Error(`${label} must have evidence_type market_data`);
  if (!source.provider_version || source.provider_version !== side.provider_version) {
    throw new Error(`${label} provider version differs from the observation bundle`);
  }
  if (source.checksum !== side.capture_hash) {
    throw new Error(`${label} checksum must equal the committed normalized capture hash`);
  }
  if (source.capture !== "committed-derived") {
    throw new Error(`${label} must use a lawful committed-derived normalized capture`);
  }
  if (source.rights !== "public" || source.access_state !== "public") {
    throw new Error(`${label} committed capture requires public, redistributable source rights`);
  }
  if (source.verification === "unchecked") throw new Error(`${label} must be checked against its source`);
  if (Date.parse(source.retrieved_at) < Date.parse(side.end.observed_at)) {
    throw new Error(`${label} was retrieved before the end observation existed`);
  }
  if (Date.parse(source.retrieved_at) > Date.parse(outcome.outcome_at)) {
    throw new Error(`${label} was retrieved after outcome_at`);
  }
  const { record: capture } = parseCommittedJson(
    root,
    commitHash,
    side.capture_path,
    side.capture_hash,
    `${label} capture`,
  );
  const captureValidation = validateMarketDataCaptureRecord(capture, side.capture_path);
  if (!captureValidation.valid) {
    throw new Error(`${label} capture is invalid: ${captureValidation.errors.join("; ")}`);
  }
  const expectedInstrumentId = side.security_id ?? side.benchmark_id;
  for (const [field, expected] of [
    ["source_id", side.source_id],
    ["provider_id", side.provider_id],
    ["provider_version", side.provider_version],
    ["instrument_id", expectedInstrumentId],
    ["adjustment_rule", side.adjustment_rule],
    ["retrieved_at", source.retrieved_at],
  ]) {
    if (capture[field] !== expected) throw new Error(`${label} capture ${field} differs from its frozen metadata`);
  }
  for (const pointName of ["start", "end"]) {
    const point = side[pointName];
    const match = capture.observations.find(
      (observation) => observation.observed_at === point.observed_at,
    );
    if (!match || match.value !== point.value || match.kind !== point.kind) {
      throw new Error(`${label} ${pointName} observation is absent from the committed capture`);
    }
  }
  return { source, capture };
}

function auditMarketObservationBundle(
  root,
  outcomeCommit,
  calendarSnapshot,
  identity,
  forecast,
  outcome,
) {
  const label = `${forecast.forecast_id} market observation bundle`;
  const { record: bundle } = parseCommittedJson(
    root,
    outcomeCommit,
    outcome.market_observation_path,
    outcome.market_observation_hash,
    label,
  );
  const validation = validateMarketObservationBundleRecord(bundle, outcome.market_observation_path);
  if (!validation.valid) throw new Error(`${label} is invalid: ${validation.errors.join("; ")}`);
  if (bundle.forecast_id !== forecast.forecast_id) throw new Error(`${label} forecast_id differs from the forecast`);
  if (Date.parse(bundle.captured_at) > Date.parse(outcome.outcome_at)) {
    throw new Error(`${label} was captured after outcome_at`);
  }
  if (bundle.security.security_id !== forecast.security_id) throw new Error(`${label} security_id differs from the forecast`);
  if (bundle.benchmark.benchmark_id !== forecast.benchmark) throw new Error(`${label} benchmark_id differs from the forecast`);
  if (bundle.security.provider_id !== forecast.reference_price_source) {
    throw new Error(`${label} security provider differs from the frozen provider`);
  }
  if (bundle.benchmark.provider_id !== forecast.benchmark_price_source) {
    throw new Error(`${label} benchmark provider differs from the frozen provider`);
  }
  if (bundle.security.adjustment_rule !== forecast.price_adjustment_rule) {
    throw new Error(`${label} adjustment rule differs from the frozen rule`);
  }
  if (bundle.benchmark.adjustment_rule !== forecast.benchmark_price_adjustment_rule) {
    throw new Error(`${label} benchmark adjustment rule differs from the frozen rule`);
  }

  const { calendar } = calendarForIdentity(calendarSnapshot, identity, label);
  const sessions = calendar.sessions;
  const releaseTime = Date.parse(outcome.actual_release_at);
  const sessionOneIndex = sessions.findIndex((session) => Date.parse(session.open_at) > releaseTime);
  if (sessionOneIndex < 0) throw new Error(`${label} calendar has no eligible session after the release`);
  const endSession = sessions[sessionOneIndex + forecast.target_return_window_sessions - 1];
  if (!endSession) throw new Error(`${label} calendar does not cover the frozen return window`);
  for (const [sideName, side] of [["security", bundle.security], ["benchmark", bundle.benchmark]]) {
    if (side.end.kind !== "official_close" || side.end.observed_at !== endSession.close_at) {
      throw new Error(`${label} ${sideName} end must be the official close of frozen session ${forecast.target_return_window_sessions}`);
    }
  }

  if (forecast.return_basis === "event_reaction") {
    const previousSessions = sessions.filter((session) => Date.parse(session.close_at) < releaseTime);
    const startSession = previousSessions.at(-1);
    if (!startSession) throw new Error(`${label} calendar has no official close before the release`);
    for (const [sideName, side] of [["security", bundle.security], ["benchmark", bundle.benchmark]]) {
      if (side.start.kind !== "official_close" || side.start.observed_at !== startSession.close_at) {
        throw new Error(`${label} ${sideName} start must be the last official close before release`);
      }
    }
  } else {
    if (
      bundle.security.start.kind !== "reference_snapshot" ||
      bundle.security.start.value !== forecast.reference_price ||
      bundle.security.start.observed_at !== forecast.reference_price_at
    ) {
      throw new Error(`${label} security start differs from the frozen reference snapshot`);
    }
    if (
      bundle.benchmark.start.kind !== "reference_snapshot" ||
      bundle.benchmark.start.observed_at !== forecast.reference_price_at
    ) {
      throw new Error(`${label} benchmark start must use the frozen reference timestamp`);
    }
  }

  const projections = [
    [outcome.security_start_price, bundle.security.start.value, "security_start_price"],
    [outcome.security_start_at, bundle.security.start.observed_at, "security_start_at"],
    [outcome.security_end_price, bundle.security.end.value, "security_end_price"],
    [outcome.security_end_at, bundle.security.end.observed_at, "security_end_at"],
    [outcome.security_price_source, bundle.security.provider_id, "security_price_source"],
    [outcome.benchmark_start_value, bundle.benchmark.start.value, "benchmark_start_value"],
    [outcome.benchmark_end_value, bundle.benchmark.end.value, "benchmark_end_value"],
    [outcome.benchmark_price_source, bundle.benchmark.provider_id, "benchmark_price_source"],
    [outcome.benchmark_price_adjustment_rule, bundle.benchmark.adjustment_rule, "benchmark_price_adjustment_rule"],
  ];
  for (const [projected, canonical, field] of projections) {
    if (projected !== canonical) throw new Error(`${label} ${field} differs from committed observations`);
  }
  auditedMarketSource(root, outcomeCommit, bundle.security, outcome, `${label} security source`);
  auditedMarketSource(root, outcomeCommit, bundle.benchmark, outcome, `${label} benchmark source`);
  return bundle;
}

function normalizedRemoteRepository(remote) {
  const scpMatch = remote.match(/^git@([^:]+):(.+)$/);
  if (scpMatch) {
    return { host: scpMatch[1].toLowerCase(), path: scpMatch[2].replace(/\.git$/, "") };
  }
  const parsed = new URL(remote);
  return {
    host: parsed.host.toLowerCase(),
    path: parsed.pathname.replace(/^\//, "").replace(/\.git$/, "").replace(/\/$/, ""),
  };
}

function requireCommitUrlForOrigin(root, url, label) {
  const canonical = canonicalCommitUrl(url, label);
  const commitHash = canonical.commitHash;
  const origin = gitOutput(["remote", "get-url", "origin"], root, `${label} origin`).trim();
  let expected;
  let actual;
  try {
    expected = normalizedRemoteRepository(origin);
    const parsed = canonical.parsed;
    const marker = "/commit/";
    const markerIndex = parsed.pathname.indexOf(marker);
    actual = {
      host: parsed.host.toLowerCase(),
      path: parsed.pathname.slice(1, markerIndex).replace(/\.git$/, "").replace(/\/$/, ""),
    };
  } catch {
    throw new Error(`${label} cannot be reconciled with the configured origin`);
  }
  if (expected.host !== actual.host || expected.path !== actual.path) {
    throw new Error(`${label} does not match the configured public origin`);
  }
  return commitHash;
}

export function calculateTargetResolution(forecast, outcome) {
  if (outcome.target_outcome_status !== "resolved") return null;
  if (Date.parse(outcome.actual_release_at) > Date.parse(forecast.event_window_end)) {
    throw new Error(`${forecast.forecast_id} target outcome cannot resolve from a release after the frozen deadline`);
  }
  if (outcome.security_price_source !== forecast.reference_price_source) {
    throw new Error(`${forecast.forecast_id} outcome security price source differs from the frozen provider`);
  }
  if (outcome.security_price_adjustment_rule !== forecast.price_adjustment_rule) {
    throw new Error(`${forecast.forecast_id} outcome adjustment rule differs from the frozen rule`);
  }
  if (outcome.benchmark_price_source !== forecast.benchmark_price_source) {
    throw new Error(`${forecast.forecast_id} outcome benchmark price source differs from the frozen provider`);
  }
  if (outcome.benchmark_price_adjustment_rule !== forecast.benchmark_price_adjustment_rule) {
    throw new Error(`${forecast.forecast_id} outcome benchmark adjustment rule differs from the frozen rule`);
  }
  if (outcome.security_end_session_number !== forecast.target_return_window_sessions) {
    throw new Error(`${forecast.forecast_id} outcome session number differs from the frozen window`);
  }
  if (forecast.return_basis === "decision_holding_period") {
    if (outcome.security_start_price !== forecast.reference_price) {
      throw new Error(`${forecast.forecast_id} decision-holding-period start price differs from reference_price`);
    }
    if (outcome.security_start_at !== forecast.reference_price_at) {
      throw new Error(`${forecast.forecast_id} decision-holding-period start timestamp differs from reference_price_at`);
    }
  } else if (Date.parse(outcome.security_start_at) >= Date.parse(outcome.actual_release_at)) {
    throw new Error(`${forecast.forecast_id} event-reaction start must precede the complete release`);
  }
  if (Date.parse(outcome.security_end_at) < Date.parse(outcome.actual_release_at)) {
    throw new Error(`${forecast.forecast_id} security end observation precedes the complete release`);
  }

  const securityReturnPct = 100 * (outcome.security_end_price / outcome.security_start_price - 1);
  const benchmarkReturnPct = 100 * (outcome.benchmark_end_value / outcome.benchmark_start_value - 1);
  const measuredReturnPct =
    forecast.return_metric === "benchmark_relative_return"
      ? securityReturnPct - benchmarkReturnPct
      : securityReturnPct;
  const threshold = forecast.target_return_threshold_pct;
  const expectedOutcome =
    forecast.target_direction === "up"
      ? Number(measuredReturnPct >= threshold)
      : forecast.target_direction === "down"
        ? Number(measuredReturnPct <= -threshold)
        : Number(Math.abs(measuredReturnPct) >= threshold);
  if (outcome.target_outcome !== expectedOutcome) {
    throw new Error(
      `${forecast.forecast_id} target_outcome disagrees with deterministic return arithmetic`,
    );
  }
  return { securityReturnPct, benchmarkReturnPct, measuredReturnPct, expectedOutcome };
}

export function calculateEventResolution(forecast, outcome, source) {
  if (outcome.resolution_deadline_at !== forecast.event_window_end) {
    throw new Error(`${forecast.forecast_id} outcome resolution deadline differs from the frozen event window end`);
  }
  if (outcome.release_status === "released") {
    if (!outcome.actual_release_at) throw new Error(`${forecast.forecast_id} released event lacks actual_release_at`);
    if (Date.parse(source.first_public_at) !== Date.parse(outcome.actual_release_at)) {
      throw new Error(`${forecast.forecast_id} event outcome source time differs from actual_release_at`);
    }
    if (Date.parse(outcome.actual_release_at) > Date.parse(forecast.event_window_end)) {
      if (
        forecast.deadline_miss_resolution === "event_zero" &&
        !(outcome.event_outcome_status === "resolved" && outcome.event_outcome === 0)
      ) {
        throw new Error(`${forecast.forecast_id} late release must resolve the missed-deadline event proposition to zero`);
      }
      if (
        forecast.deadline_miss_resolution === "unresolvable" &&
        !(outcome.event_outcome_status === "unresolvable" && outcome.event_outcome == null)
      ) {
        throw new Error(`${forecast.forecast_id} late release must remain unresolvable under the frozen policy`);
      }
      return { releaseStatus: "late_release", outcome: outcome.event_outcome };
    }
    if (outcome.event_outcome_status === "pending") return null;
    return { releaseStatus: "released", outcome: outcome.event_outcome };
  }
  if (outcome.event_outcome_status === "pending") return null;
  if (outcome.release_status !== "no_release") {
    throw new Error(`${forecast.forecast_id} adjudicated event requires released or no_release status`);
  }
  if (outcome.actual_release_at) throw new Error(`${forecast.forecast_id} no-release outcome cannot have actual_release_at`);
  if (Date.parse(outcome.outcome_at) <= Date.parse(forecast.event_window_end)) {
    throw new Error(`${forecast.forecast_id} no-release outcome must be adjudicated strictly after the frozen deadline`);
  }
  if (source.canonical_url !== forecast.no_release_check_url) {
    throw new Error(`${forecast.forecast_id} no-release evidence URL differs from the frozen check URL`);
  }
  if (Date.parse(source.retrieved_at) <= Date.parse(forecast.event_window_end)) {
    throw new Error(`${forecast.forecast_id} no-release evidence must be retrieved strictly after the frozen deadline`);
  }
  if (Date.parse(source.retrieved_at) > Date.parse(outcome.outcome_at)) {
    throw new Error(`${forecast.forecast_id} no-release evidence was retrieved after outcome_at`);
  }
  if (
    forecast.deadline_miss_resolution === "event_zero" &&
    !(outcome.event_outcome_status === "resolved" && outcome.event_outcome === 0)
  ) {
    throw new Error(`${forecast.forecast_id} missed deadline must resolve the event proposition to zero`);
  }
  if (
    forecast.deadline_miss_resolution === "unresolvable" &&
    !(outcome.event_outcome_status === "unresolvable" && outcome.event_outcome == null)
  ) {
    throw new Error(`${forecast.forecast_id} missed deadline must remain unresolvable under the frozen policy`);
  }
  return { releaseStatus: "no_release", outcome: outcome.event_outcome };
}

function csvScalar(value) {
  return value === undefined || value === null ? "" : String(value);
}

function requireFrozenMatch(row, record, rowField, recordField = rowField) {
  if (row[rowField] !== csvScalar(record[recordField])) {
    throw new Error(
      `${row.id} ${rowField} differs between the ledger and frozen ${recordField}`,
    );
  }
}

export async function auditEventLedgerLinks(text, root = repositoryRoot) {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error("Event ledger is empty.");
  const headers = rows[0];
  if (
    headers.length !== eventLedgerHeaders.length ||
    headers.some((header, index) => header !== eventLedgerHeaders[index])
  ) {
    throw new Error(`Event ledger header must exactly match: ${eventLedgerHeaders.join(",")}`);
  }
  const records = rows.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]])),
  );

  const candidateLedgerPath = resolve(root, "track-record/event-candidate-ledger.csv");
  const candidateLedgerText = await readFile(candidateLedgerPath, "utf8");
  const candidateSummary = summarizeEventCandidates(candidateLedgerText, candidateLedgerPath);
  const candidateHistoryAudit = candidateSummary.totalCandidates === 0
    ? { ...candidateSummary, validatedCandidates: 0, firstAppearance: {} }
    : auditEventCandidateLedgerHistory(candidateLedgerText, candidateLedgerPath, root);
  const candidateRecords = parsedCandidateRows(candidateLedgerText);
  const forecastIds = new Set(records.map((record) => record.id));
  for (const candidate of candidateRecords.filter((record) => record.decision === "registered")) {
    if (!forecastIds.has(candidate.forecast_id)) {
      throw new Error(
        `${candidate.candidate_id} registers ${candidate.forecast_id}, which is absent from the event ledger`,
      );
    }
  }

  for (const row of records) {
    const forecastCommit = requireCommitUrlForOrigin(root, row.commit_url, `${row.id} commit_url`);
    const forecastContent = committedFile(root, forecastCommit, row.forecast_path, `${row.id} forecast_path`);
    const forecast = parseFlatFrontMatter(forecastContent);
    const forecastValidation = validateEventRecord(forecast, row.forecast_path);
    if (!forecastValidation.valid) {
      throw new Error(`${row.id} frozen forecast is invalid: ${forecastValidation.errors.join("; ")}`);
    }
    if (forecast.status === "draft") throw new Error(`${row.id} frozen forecast is still a draft`);

    requireFrozenMatch(row, forecast, "id", "forecast_id");
    for (const field of [
      "candidate_id",
      "candidate_ledger_commit_url",
      "published_at",
      "source_cutoff_at",
      "ticker",
      "identity_path",
      "identity_hash",
      "security_id",
      "listing_id",
      "event_type",
      "schedule_known_at",
      "event_window_start",
      "event_window_end",
      "no_release_check_url",
      "deadline_miss_resolution",
      "event_baseline_id",
      "event_baseline_source_path",
      "event_baseline_probability_pct",
      "event_baseline_sample_size",
      "target_baseline_id",
      "target_baseline_source_path",
      "target_baseline_probability_pct",
      "method_version",
      "fact_snapshot_path",
      "fact_snapshot_hash",
      "event_probability_pct",
      "evaluation_spec_id",
      "market_session",
      "security_return_rule",
      "return_basis",
      "entry_observation_rule",
      "return_metric",
      "target_direction",
      "target_return_threshold_pct",
      "target_return_window_sessions",
      "target_probability_pct",
      "reference_price",
      "reference_price_at",
      "reference_price_source",
      "price_adjustment_rule",
      "benchmark",
      "benchmark_price_source",
      "benchmark_price_adjustment_rule",
    ]) requireFrozenMatch(row, forecast, field);

    const candidateCommit = requireCommitUrlForOrigin(
      root,
      forecast.candidate_ledger_commit_url,
      `${row.id} candidate_ledger_commit_url`,
    );
    if (candidateHistoryAudit.firstAppearance[forecast.candidate_id] !== forecast.candidate_ledger_commit_url) {
      throw new Error(`${row.id} candidate_ledger_commit_url is not the audited first-appearance commit`);
    }
    const candidateAncestry = spawnSync(
      "git",
      ["merge-base", "--is-ancestor", candidateCommit, forecastCommit],
      { cwd: root, encoding: "utf8" },
    );
    if (candidateAncestry.status !== 0 || candidateCommit === forecastCommit) {
      throw new Error(`${row.id} candidate commit must be a strict ancestor of the forecast commit`);
    }
    const candidateLedgerPath = "track-record/event-candidate-ledger.csv";
    const candidateContent = committedFile(
      root,
      candidateCommit,
      candidateLedgerPath,
      `${row.id} candidate ledger`,
    );
    summarizeEventCandidates(candidateContent, candidateLedgerPath);
    const candidate = parsedCandidateRows(candidateContent).find(
      (record) => record.candidate_id === forecast.candidate_id,
    );
    if (!candidate) throw new Error(`${row.id} candidate is absent from its referenced commit`);
    const candidateParent = spawnSync("git", ["rev-parse", `${candidateCommit}^`], {
      cwd: root,
      encoding: "utf8",
    });
    if (candidateParent.status === 0) {
      const priorCandidateContent = fileAtCommitOrNull(
        root,
        candidateParent.stdout.trim(),
        candidateLedgerPath,
      );
      if (
        priorCandidateContent &&
        parsedCandidateRows(priorCandidateContent).some(
          (record) => record.candidate_id === forecast.candidate_id,
        )
      ) {
        throw new Error(`${row.id} candidate_ledger_commit_url is not the first appearance commit`);
      }
    }
    if (candidate.decision !== "registered" || candidate.forecast_id !== forecast.forecast_id) {
      throw new Error(`${row.id} candidate does not register this forecast`);
    }
    for (const field of [
      "ticker", "identity_path", "security_id", "listing_id", "event_type",
      "event_window_start", "event_window_end",
    ]) {
      if (candidate[field] !== csvScalar(forecast[field])) {
        throw new Error(`${row.id} ${field} differs between candidate and forecast`);
      }
    }
    if (Date.parse(candidate.source_cutoff_at) > Date.parse(forecast.source_cutoff_at)) {
      throw new Error(`${row.id} candidate cutoff is after the forecast cutoff`);
    }
    const candidateCommitTimestamp = gitOutput(
      ["show", "-s", "--format=%cI", candidateCommit],
      root,
      `${row.id} candidate commit timestamp`,
    ).trim();
    const candidatePublicationDelay = Date.parse(candidateCommitTimestamp) - Date.parse(candidate.decision_at);
    if (
      !Number.isFinite(candidatePublicationDelay) ||
      candidatePublicationDelay < 0 ||
      candidatePublicationDelay > 10 * 60 * 1000
    ) {
      throw new Error(`${row.id} candidate decision_at must be no more than 10 minutes before its commit`);
    }
    if (Date.parse(candidateCommitTimestamp) >= Date.parse(forecast.event_window_start)) {
      throw new Error(`${row.id} candidate commit did not precede the event window`);
    }

    auditedCommittedSource(
      root,
      forecastCommit,
      forecast.event_baseline_source_path,
      forecast.event_baseline_id,
      forecast.source_cutoff_at,
      `${row.id} event baseline source`,
    );
    auditedCommittedSource(
      root,
      forecastCommit,
      forecast.target_baseline_source_path,
      forecast.target_baseline_id,
      forecast.source_cutoff_at,
      `${row.id} target baseline source`,
    );
    auditFactSnapshot(root, forecastCommit, forecast);

    const identityContent = committedFile(
      root,
      forecastCommit,
      row.identity_path,
      `${row.id} identity_path`,
    );
    const identityDigest = `sha256:${createHash("sha256").update(identityContent).digest("hex")}`;
    if (identityDigest !== row.identity_hash) throw new Error(`${row.id} identity_hash does not match the committed identity file`);
    const identity = parseFlatFrontMatter(identityContent);
    const identityValidation = validateIdentityRecord(identity, row.identity_path);
    if (!identityValidation.valid) {
      throw new Error(`${row.id} frozen identity is invalid: ${identityValidation.errors.join("; ")}`);
    }
    if (identity.status !== "verified") throw new Error(`${row.id} identity is not verified`);
    for (const field of ["ticker", "security_id", "listing_id"]) requireFrozenMatch(row, identity, field);

    const specificationPath = `methodology/event-evaluation-specs/${row.evaluation_spec_id}.md`;
    const specificationContent = committedFile(
      root,
      forecastCommit,
      specificationPath,
      `${row.id} evaluation specification`,
    );
    const specification = parseFlatFrontMatter(specificationContent);
    const specificationValidation = validateEvaluationSpecRecord(specification, specificationPath);
    if (!specificationValidation.valid) {
      throw new Error(
        `${row.id} evaluation specification is invalid: ${specificationValidation.errors.join("; ")}`,
      );
    }
    if (specification.status !== "published") {
      throw new Error(`${row.id} evaluation specification was not published in the forecast commit`);
    }
    const forecastParent = gitOutput(
      ["rev-parse", `${forecastCommit}^`],
      root,
      `${row.id} forecast parent`,
    ).trim();
    const priorSpecificationContent = committedFile(
      root,
      forecastParent,
      specificationPath,
      `${row.id} prior evaluation specification`,
    );
    if (priorSpecificationContent !== specificationContent) {
      throw new Error(`${row.id} evaluation specification was not frozen in an earlier commit`);
    }
    const specificationCommitHash = gitOutput(
      ["log", "-1", "--format=%H", forecastParent, "--", specificationPath],
      root,
      `${row.id} evaluation specification publication commit`,
    ).trim();
    if (!specificationCommitHash) {
      throw new Error(`${row.id} evaluation specification has no publication commit`);
    }
    const publishedSpecificationContent = committedFile(
      root,
      specificationCommitHash,
      specificationPath,
      `${row.id} published evaluation specification`,
    );
    if (publishedSpecificationContent !== specificationContent) {
      throw new Error(`${row.id} evaluation specification changed after its publication commit`);
    }
    const commitTimestamp = gitOutput(
      ["show", "-s", "--format=%cI", forecastCommit],
      root,
      `${row.id} forecast commit timestamp`,
    ).trim();
    const calendarSnapshot = auditedCalendarSnapshot(
      root,
      specificationCommitHash,
      specification,
      `${row.id} calendar verification fixture`,
    );
    const calendarSource = auditedCommittedSource(
      root,
      specificationCommitHash,
      specification.calendar_source_path,
      specification.calendar_source_id,
      specification.published_at,
      `${row.id} calendar source`,
    );
    if (calendarSource.rights !== "public" || calendarSource.access_state !== "public") {
      throw new Error(`${row.id} calendar source must have public, redistributable rights`);
    }
    if (calendarSource.capture !== "committed-derived") {
      throw new Error(`${row.id} calendar source must document the committed derived fixture`);
    }
    if (calendarSource.provider_version !== specification.exchange_calendar_version) {
      throw new Error(`${row.id} calendar source provider version differs from the evaluation specification`);
    }
    if (calendarSource.checksum !== specification.calendar_fixture_hash) {
      throw new Error(`${row.id} calendar source checksum differs from the committed fixture hash`);
    }
    if (Date.parse(calendarSource.retrieved_at) > Date.parse(specification.published_at)) {
      throw new Error(`${row.id} calendar source was retrieved after the evaluation specification was published`);
    }
    validateForecastCalendarCoverage(
      calendarSnapshot,
      identity,
      forecast,
      commitTimestamp,
      `${row.id} calendar verification fixture`,
    );
    const specificationCommitTimestamp = gitOutput(
      ["show", "-s", "--format=%cI", specificationCommitHash],
      root,
      `${row.id} evaluation specification commit timestamp`,
    ).trim();
    const specificationPublicationDelay =
      Date.parse(specificationCommitTimestamp) - Date.parse(specification.published_at);
    if (
      !Number.isFinite(specificationPublicationDelay) ||
      specificationPublicationDelay < 0 ||
      specificationPublicationDelay > 10 * 60 * 1000
    ) {
      throw new Error(
        `${row.id} evaluation specification published_at must be no more than 10 minutes before its commit`,
      );
    }
    if (specification.price_adjustment_rule !== row.price_adjustment_rule) {
      throw new Error(`${row.id} price_adjustment_rule differs from its evaluation specification`);
    }
    if (specification.price_provider_id !== row.reference_price_source) {
      throw new Error(`${row.id} reference price provider differs from its evaluation specification`);
    }
    if (specification.benchmark_price_provider_id !== row.benchmark_price_source) {
      throw new Error(`${row.id} benchmark provider differs from its evaluation specification`);
    }
    if (specification.benchmark_price_adjustment_rule !== row.benchmark_price_adjustment_rule) {
      throw new Error(`${row.id} benchmark adjustment rule differs from its evaluation specification`);
    }

    const publicationDelay = Date.parse(commitTimestamp) - Date.parse(row.published_at);
    if (!Number.isFinite(publicationDelay) || publicationDelay < 0 || publicationDelay > 10 * 60 * 1000) {
      throw new Error(`${row.id} published_at must be no more than 10 minutes before its commit timestamp`);
    }
    if (Date.parse(commitTimestamp) >= Date.parse(row.event_window_start)) {
      throw new Error(`${row.id} forecast commit timestamp must strictly precede event_window_start`);
    }

    const hasOutcome = row.event_outcome_status !== "pending" || row.target_outcome_status !== "pending";
    if (!hasOutcome) continue;
    const outcomeCommit = requireCommitUrlForOrigin(
      root,
      row.outcome_commit_url,
      `${row.id} outcome_commit_url`,
    );
    const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", forecastCommit, outcomeCommit], {
      cwd: root,
      encoding: "utf8",
    });
    if (ancestry.status !== 0 || outcomeCommit === forecastCommit) {
      throw new Error(`${row.id} outcome commit must be a later descendant of the forecast commit`);
    }
    const outcomeContent = committedFile(root, outcomeCommit, row.outcome_path, `${row.id} outcome_path`);
    const outcome = parseFlatFrontMatter(outcomeContent);
    const outcomeValidation = validateOutcomeRecord(outcome, row.outcome_path);
    if (!outcomeValidation.valid) {
      throw new Error(`${row.id} outcome record is invalid: ${outcomeValidation.errors.join("; ")}`);
    }
    requireFrozenMatch(row, outcome, "id", "forecast_id");
    requireFrozenMatch(row, outcome, "ticker");
    requireFrozenMatch(row, outcome, "evaluation_spec_id");
    requireFrozenMatch(row, outcome, "event_outcome_status");
    requireFrozenMatch(row, outcome, "event_outcome");
    requireFrozenMatch(row, outcome, "target_outcome_status");
    requireFrozenMatch(row, outcome, "target_outcome");
    requireFrozenMatch(row, outcome, "outcome_at");
    if (outcome.resolution_deadline_at !== forecast.event_window_end) {
      throw new Error(`${row.id} outcome resolution deadline differs from the frozen event window end`);
    }
    const expectedOutcomeStatus =
      row.status === "partially_resolved"
        ? "partial"
        : ["resolved", "unresolvable"].includes(row.status)
          ? row.status
          : null;
    if (expectedOutcomeStatus && outcome.status !== expectedOutcomeStatus) {
      throw new Error(`${row.id} outcome record status disagrees with ledger status`);
    }
    const outcomeCommitTimestamp = gitOutput(
      ["show", "-s", "--format=%cI", outcomeCommit],
      root,
      `${row.id} outcome commit timestamp`,
    ).trim();
    if (Date.parse(outcomeCommitTimestamp) < Date.parse(row.outcome_at)) {
      throw new Error(`${row.id} outcome commit timestamp is before outcome_at`);
    }
    if (outcome.actual_release_at && Date.parse(outcome.actual_release_at) <= Date.parse(commitTimestamp)) {
      throw new Error(`${row.id} complete public release did not postdate the forecast commit`);
    }
    let eventOutcomeSource = null;
    if (outcome.release_status === "released" || outcome.event_outcome_status !== "pending") {
      eventOutcomeSource = auditedCommittedSource(
        root,
        outcomeCommit,
        outcome.event_outcome_source_path,
        outcome.event_outcome_source_id,
        outcome.outcome_at,
        `${row.id} event outcome source`,
      );
      if (Date.parse(eventOutcomeSource.retrieved_at) > Date.parse(outcome.outcome_at)) {
        throw new Error(`${row.id} event outcome source was retrieved after outcome_at`);
      }
      calculateEventResolution(forecast, outcome, eventOutcomeSource);
    }
    if (outcome.target_outcome_status === "resolved") {
      auditMarketObservationBundle(
        root,
        outcomeCommit,
        calendarSnapshot,
        identity,
        forecast,
        outcome,
      );
    }
    calculateTargetResolution(forecast, outcome);
    if (resolveTrackedPath(root, outcome.original_forecast, `${row.id} original_forecast`).relativePath !==
      resolveTrackedPath(root, row.forecast_path, `${row.id} forecast_path`).relativePath) {
      throw new Error(`${row.id} outcome record links a different original forecast`);
    }
  }

  return { validatedRows: records.length, repositoryRoot: root };
}

function printValidation(result) {
  console.log(`${result.valid ? "Valid" : "Invalid"}: ${result.path}`);
  for (const error of result.errors) console.log(`ERROR: ${error}`);
  for (const warning of result.warnings) console.log(`WARNING: ${warning}`);
}

function formatScore(value) {
  return value === null ? "insufficient observations" : value.toFixed(4);
}

function printScores(result) {
  console.log(`Event ledger: ${result.path}`);
  console.log(
    `Rows: ${result.totalRows} | Any resolved: ${result.resolvedRows} | Fully resolved: ${result.fullyResolvedRows}`,
  );
  console.log(`Event-outcome Brier score: ${formatScore(result.eventOutcome.brierScore)}`);
  console.log(`Security-outcome Brier score: ${formatScore(result.securityOutcome.brierScore)}`);
  for (const warning of result.warnings) console.log(`WARNING: ${warning}`);
}

export async function main(argumentsList = process.argv.slice(2)) {
  const { positionals, json } = parseArguments(argumentsList);
  const [command, path] = positionals;
  if (!command || command === "help") {
    printHelp();
    return;
  }
  if (!path || positionals.length !== 2) throw new Error("Expected one input path. Use --help for usage.");

  const content = await readFile(path, "utf8");
  if (command === "score-events") {
    const result = scoreEventLedger(content, path);
    result.linkAudit = await auditEventLedgerLinks(content);
    if (json) console.log(JSON.stringify(result, null, 2));
    else printScores(result);
    return;
  }
  if (command === "summarize-event-candidates") {
    const summary = summarizeEventCandidates(content, path);
    const result = summary.totalCandidates === 0
      ? { ...summary, validatedCandidates: 0, firstAppearance: {} }
      : auditEventCandidateLedgerHistory(content, path);
    if (json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`Event candidates: ${result.path}`);
      console.log(`Total: ${result.totalCandidates} | Registered: ${result.decisionCounts.registered}`);
    }
    return;
  }

  if (command === "validate-company-ledger") {
    const result = validateCompanyLedger(content, path);
    result.linkAudit = auditCompanyLedgerLinks(content);
    if (json) console.log(JSON.stringify(result, null, 2));
    else console.log(`Company forecasts: ${result.totalRows}`);
    return;
  }

  if (["validate-fact-snapshot", "validate-calendar-snapshot", "validate-market-observations", "validate-market-capture"].includes(command)) {
    const parsed = JSON.parse(content);
    const result = command === "validate-fact-snapshot"
      ? validateFactSnapshotRecord(parsed, path)
      : command === "validate-calendar-snapshot"
        ? validateCalendarSnapshotRecord(parsed, path)
        : command === "validate-market-observations"
          ? validateMarketObservationBundleRecord(parsed, path)
          : validateMarketDataCaptureRecord(parsed, path);
    if (json) console.log(JSON.stringify(result, null, 2));
    else printValidation(result);
    if (!result.valid) process.exitCode = 1;
    return;
  }

  const record = parseFlatFrontMatter(content);
  let result;
  if (command === "validate-event") result = validateEventRecord(record, path);
  else if (command === "validate-identity") result = validateIdentityRecord(record, path);
  else if (command === "validate-outcome") result = validateOutcomeRecord(record, path);
  else if (command === "validate-evaluation-spec") {
    result = validateEvaluationSpecRecord(record, path);
  }
  else if (command === "validate-source") result = validateSourceRecord(record, path);
  else if (command === "validate-fact") result = validateFactRecord(record, path);
  else throw new Error(`Unknown command: ${command}`);

  if (json) console.log(JSON.stringify(result, null, 2));
  else printValidation(result);
  if (!result.valid) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}

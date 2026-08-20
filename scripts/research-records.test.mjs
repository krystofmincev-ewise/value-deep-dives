import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

import {
  auditedCommittedSource,
  auditCompanyLedgerLinks,
  auditEventLedgerLinks,
  calculateEventResolution,
  calculateTargetResolution,
  parseFlatFrontMatter,
  scoreEventLedger,
  summarizeEventCandidates,
  validateCalendarSnapshotRecord,
  validateCompanyLedger,
  validateEvaluationSpecRecord,
  validateEventRecord,
  validateFactRecord,
  validateForecastCalendarCoverage,
  validateIdentityRecord,
  validateMarketDataCaptureRecord,
  validateMarketObservationBundleRecord,
  validateOutcomeRecord,
  validateSourceRecord,
} from "./research-records.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = join(scriptDirectory, "research-records.mjs");
const identityHash = `sha256:${"a".repeat(64)}`;
const factSnapshotHash = `sha256:${"c".repeat(64)}`;

const publishedEvent = `---
type: event_forecast
forecast_id: "2026-E001"
candidate_id: "2026-C001"
candidate_ledger_commit_url: "https://github.com/example/repo/commit/${"c".repeat(40)}"
company: "Example Corp"
ticker: "EXM"
identity_path: "companies/exm/identity.md"
identity_hash: "${identityHash}"
security_id: "sec-exm-common"
listing_id: "nasdaq-exm"
status: published
as_of: "2026-08-20"
published_at: "2026-08-20T10:00:00+02:00"
source_cutoff_at: "2026-08-20T09:00:00+02:00"
event_baseline_id: "S-010"
event_baseline_source_path: "companies/exm/sources/S-010.md"
event_baseline_probability_pct: 50
event_baseline_sample_size: 120
target_baseline_id: "S-011"
target_baseline_source_path: "companies/exm/sources/S-011.md"
target_baseline_probability_pct: 20
method_version: manual-v1
fact_snapshot_hash: "${factSnapshotHash}"
fact_snapshot_path: "companies/exm/fact-snapshot.json"
event_type: earnings
schedule_source: "https://example.com/ir"
schedule_known_at: "2026-08-19T10:00:00+02:00"
event_window_start: "2026-08-21T22:00:00+02:00"
event_window_end: "2026-08-21T23:00:00+02:00"
no_release_check_url: "https://example.com/ir/events"
market_session: after_hours
event_outcome_rule: "Revenue exceeds frozen consensus"
deadline_miss_resolution: unresolvable
event_probability_pct: 65
evaluation_spec_id: event-v1
security_return_rule: "Split-adjusted total return is at least 10%"
return_basis: decision_holding_period
entry_observation_rule: reference_price
return_metric: security_total_return
target_direction: up
target_return_threshold_pct: 10
target_return_window_sessions: 5
target_probability_pct: 40
currency: USD
reference_price: 12.5
reference_price_at: "2026-08-20T09:30:00+02:00"
reference_price_source: "test_prices_v1"
price_adjustment_rule: split_adjusted_with_dividends
benchmark: "SPY"
benchmark_price_source: "test_prices_v1"
benchmark_price_adjustment_rule: split_adjusted_with_dividends
position_disclosure: no_position
review_by: "2026-08-28"
supersedes: null
---

# Example
`;

const identityMarkdown = `---
type: company_identity
company: "Example Corp"
ticker: "EXM"
exchange: "NASDAQ"
issuer_id: "issuer-example-corp"
security_id: "sec-exm-common"
listing_id: "nasdaq-exm"
status: verified
as_of: "2026-08-20"
known_at: "2026-08-20T10:00:00+02:00"
valid_from: "2026-01-01"
valid_to: null
domicile: "US"
reporting_currency: "USD"
fiscal_year_end: "12-31"
cik: "0000123456"
lei: null
primary_security_type: common_stock
---

# Identity
`;

const ledgerHeaders = [
  "id", "candidate_id", "candidate_ledger_commit_url", "published_at", "source_cutoff_at", "ticker", "identity_path", "identity_hash",
  "security_id", "listing_id", "event_type", "schedule_known_at", "event_window_start",
  "event_window_end", "no_release_check_url", "deadline_miss_resolution", "event_baseline_id", "event_baseline_source_path",
  "event_baseline_probability_pct", "event_baseline_sample_size", "target_baseline_id",
  "target_baseline_source_path", "target_baseline_probability_pct", "method_version",
  "fact_snapshot_path", "fact_snapshot_hash", "event_probability_pct", "evaluation_spec_id",
  "market_session", "security_return_rule", "return_basis", "entry_observation_rule",
  "return_metric", "target_direction", "target_return_threshold_pct", "target_return_window_sessions",
  "target_probability_pct", "reference_price", "reference_price_at", "reference_price_source",
  "price_adjustment_rule", "benchmark", "benchmark_price_source", "benchmark_price_adjustment_rule",
  "event_outcome_status",
  "event_outcome", "target_outcome_status", "target_outcome", "outcome_at", "forecast_path",
  "outcome_path", "commit_url", "outcome_commit_url", "status_reason", "status",
];

const baseRow = {
  id: "2026-E001",
  candidate_id: "2026-C001",
  candidate_ledger_commit_url: `https://github.com/example/repo/commit/${"c".repeat(40)}`,
  published_at: "2026-08-20T10:00:00Z",
  source_cutoff_at: "2026-08-20T09:00:00Z",
  ticker: "EXM",
  identity_path: "companies/exm/identity.md",
  identity_hash: identityHash,
  security_id: "sec-exm-common",
  listing_id: "nasdaq-exm",
  event_type: "earnings",
  schedule_known_at: "2026-08-19T10:00:00Z",
  event_window_start: "2026-08-21T22:00:00Z",
  event_window_end: "2026-08-21T23:00:00Z",
  no_release_check_url: "https://example.com/ir/events",
  deadline_miss_resolution: "unresolvable",
  event_baseline_id: "S-001",
  event_baseline_source_path: "companies/exm/sources/S-001.md",
  event_baseline_probability_pct: "50",
  event_baseline_sample_size: "100",
  target_baseline_id: "S-002",
  target_baseline_source_path: "companies/exm/sources/S-002.md",
  target_baseline_probability_pct: "50",
  method_version: "manual-v1",
  fact_snapshot_path: "companies/exm/fact-snapshot.json",
  fact_snapshot_hash: factSnapshotHash,
  event_probability_pct: "80",
  evaluation_spec_id: "event-v1",
  market_session: "after_hours",
  security_return_rule: "Total return is at least 10%",
  return_basis: "decision_holding_period",
  entry_observation_rule: "reference_price",
  return_metric: "security_total_return",
  target_direction: "up",
  target_return_threshold_pct: "10",
  target_return_window_sessions: "5",
  target_probability_pct: "60",
  reference_price: "12.5",
  reference_price_at: "2026-08-20T09:30:00Z",
  reference_price_source: "Exchange",
  price_adjustment_rule: "split_adjusted_with_dividends",
  benchmark: "SPY",
  benchmark_price_source: "Exchange",
  benchmark_price_adjustment_rule: "split_adjusted_with_dividends",
  event_outcome_status: "resolved",
  event_outcome: "1",
  target_outcome_status: "resolved",
  target_outcome: "1",
  outcome_at: "2026-08-28T21:00:00Z",
  forecast_path: "companies/exm/event.md",
  outcome_path: "companies/exm/event-outcome.md",
  commit_url: `https://github.com/example/repo/commit/${"a".repeat(40)}`,
  outcome_commit_url: `https://github.com/example/repo/commit/${"b".repeat(40)}`,
  status_reason: "",
  status: "resolved",
};

function makeLedger(rows) {
  return `${ledgerHeaders.join(",")}\n${rows
    .map((row) => ledgerHeaders.map((header) => row[header] ?? "").join(","))
    .join("\n")}\n`;
}

test("event front matter validates publication gates and timestamp ordering", () => {
  const record = parseFlatFrontMatter(publishedEvent);
  assert.equal(validateEventRecord(record).valid, true);

  record.source_cutoff_at = "2026-08-22T09:00:00+02:00";
  const invalid = validateEventRecord(record);
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join("\n"), /source_cutoff_at must not be after published_at/);

  const incompatible = parseFlatFrontMatter(publishedEvent);
  incompatible.return_basis = "event_reaction";
  assert.match(
    validateEventRecord(incompatible).errors.join("\n"),
    /event_reaction requires entry_observation_rule last_close_before_release/,
  );
  const boundaryPublication = parseFlatFrontMatter(publishedEvent);
  boundaryPublication.published_at = boundaryPublication.event_window_start;
  assert.match(
    validateEventRecord(boundaryPublication).errors.join("\n"),
    /published_at must strictly precede event_window_start/,
  );
  const secretSchedule = parseFlatFrontMatter(publishedEvent);
  secretSchedule.schedule_source = "https://example.com/events?client_secret=SECRET";
  assert.match(
    validateEventRecord(secretSchedule).errors.join("\n"),
    /schedule_source must not contain sensitive query parameters/,
  );
});

test("terminal forecast states retain all original publication fields", () => {
  const record = parseFlatFrontMatter(publishedEvent);
  record.status = "superseded";
  record.published_at = null;
  record.event_probability_pct = null;
  const result = validateEventRecord(record);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /Missing required field: published_at/);
  assert.match(result.errors.join("\n"), /Missing required field: event_probability_pct/);
});

test("verified identity validates IDs, calendar values, and validity intervals", () => {
  const identity = parseFlatFrontMatter(identityMarkdown);
  assert.equal(validateIdentityRecord(identity).valid, true);

  identity.fiscal_year_end = "99-99";
  identity.valid_to = "2025-12-31";
  const invalid = validateIdentityRecord(identity);
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join("\n"), /not a real month and day/);
  assert.match(invalid.errors.join("\n"), /valid_from must not be after valid_to/);
});

test("outcome records resolve event and security propositions independently", () => {
  const outcome = parseFlatFrontMatter(`---
type: event_outcome
forecast_id: "2026-E001"
company: "Example Corp"
ticker: "EXM"
status: partial
as_of: "2026-08-28"
outcome_at: "2026-08-28T21:00:00Z"
release_status: released
resolution_deadline_at: "2026-08-21T23:00:00Z"
actual_release_at: "2026-08-21T20:00:00Z"
resolution_reason: "The primary source reported the event; the price observation was unavailable"
original_forecast: "companies/exm/event.md"
evaluation_spec_id: event-v1
event_outcome_status: resolved
event_outcome: 1
event_outcome_source_id: "S-012"
event_outcome_source_path: "companies/exm/sources/S-012.md"
target_outcome_status: unresolvable
target_outcome: null
security_start_price: null
security_start_at: null
security_end_price: null
security_end_at: null
security_price_source: null
benchmark_start_value: null
benchmark_end_value: null
benchmark_price_source: null
position_disclosure: no_position
---
`);
  assert.equal(validateOutcomeRecord(outcome).valid, true);
  const earlyReleasedOutcome = {
    ...outcome,
    outcome_at: "2026-08-21T21:00:00Z",
    resolution_deadline_at: "2026-08-21T23:00:00Z",
  };
  assert.equal(validateOutcomeRecord(earlyReleasedOutcome).valid, true);
  const targetOnlyWithoutReleaseSource = {
    ...outcome,
    status: "partial",
    event_outcome_status: "pending",
    event_outcome: null,
    event_outcome_source_id: null,
    event_outcome_source_path: null,
  };
  assert.match(
    validateOutcomeRecord(targetOnlyWithoutReleaseSource).errors.join("\n"),
    /release_status released requires a committed release source/,
  );
  outcome.event_outcome = null;
  const invalid = validateOutcomeRecord(outcome);
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join("\n"), /event_outcome must be 0 or 1/);
  outcome.event_outcome = 1;
  outcome.status = "draft";
  assert.match(validateOutcomeRecord(outcome).errors.join("\n"), /status draft requires both/);
});

test("missed releases resolve only under the frozen deadline policy", () => {
  const forecast = parseFlatFrontMatter(publishedEvent);
  forecast.deadline_miss_resolution = "event_zero";
  const outcome = {
    type: "event_outcome",
    forecast_id: "2026-E001",
    company: "Example Corp",
    ticker: "EXM",
    status: "partial",
    as_of: "2026-08-22",
    outcome_at: "2026-08-22T00:00:00Z",
    release_status: "no_release",
    resolution_deadline_at: forecast.event_window_end,
    actual_release_at: null,
    resolution_reason: "The frozen deadline elapsed without a release",
    original_forecast: "companies/exm/event.md",
    evaluation_spec_id: "event-v1",
    event_outcome_status: "resolved",
    event_outcome: 0,
    event_outcome_source_id: "S-020",
    event_outcome_source_path: "companies/exm/sources/S-020.md",
    target_outcome_status: "unresolvable",
    target_outcome: null,
    position_disclosure: "no_position",
  };
  assert.equal(validateOutcomeRecord(outcome).valid, true);
  const source = {
    canonical_url: forecast.no_release_check_url,
    retrieved_at: "2026-08-21T23:30:00+02:00",
  };
  assert.equal(calculateEventResolution(forecast, outcome, source).outcome, 0);
  assert.throws(
    () => calculateEventResolution({ ...forecast, deadline_miss_resolution: "unresolvable" }, outcome, source),
    /must remain unresolvable/,
  );
  assert.match(
    validateOutcomeRecord({ ...outcome, target_outcome_status: "resolved", target_outcome: 0 }).errors.join("\n"),
    /no_release cannot resolve an event-reaction security outcome/,
  );

  const lateRelease = {
    ...outcome,
    release_status: "released",
    actual_release_at: "2026-08-22T00:30:00+02:00",
  };
  const lateSource = { first_public_at: lateRelease.actual_release_at };
  assert.equal(calculateEventResolution(forecast, lateRelease, lateSource).outcome, 0);
  assert.throws(
    () => calculateEventResolution(forecast, { ...lateRelease, event_outcome: 1 }, lateSource),
    /late release must resolve the missed-deadline event proposition to zero/,
  );
  assert.throws(
    () => calculateEventResolution(
      { ...forecast, deadline_miss_resolution: "unresolvable" },
      lateRelease,
      lateSource,
    ),
    /late release must remain unresolvable/,
  );
  assert.throws(
    () => calculateEventResolution(
      forecast,
      { ...outcome, outcome_at: forecast.event_window_end },
      source,
    ),
    /strictly after the frozen deadline/,
  );
  assert.throws(
    () => calculateEventResolution(
      forecast,
      outcome,
      { ...source, retrieved_at: forecast.event_window_end },
    ),
    /retrieved strictly after the frozen deadline|retrieved must be strictly after the frozen deadline/,
  );
});

test("draft evaluation specifications validate but cannot masquerade as published", () => {
  const specification = parseFlatFrontMatter(`---
type: event_evaluation_spec
evaluation_spec_id: event-v1
status: draft
created_at: "2026-08-20T00:00:00Z"
published_at: null
price_provider_id: null
benchmark_price_provider_id: null
exchange_calendar_id: null
exchange_calendar_version: null
calendar_source_id: null
calendar_source_path: null
calendar_verification_fixture: null
calendar_fixture_hash: null
price_provider_rule: "Frozen provider"
benchmark_price_provider_rule: "Frozen provider"
market_timezone_rule: "Primary listing"
exchange_calendar_rule: "Official calendar"
entry_observation_rule: "Frozen rule"
exit_observation_rule: "Frozen rule"
price_adjustment_rule: split_adjusted_with_dividends
benchmark_price_adjustment_rule: split_adjusted_with_dividends
corporate_action_rule: "Frozen rule"
halt_rule: "Frozen rule"
delisting_rule: "Frozen rule"
missing_price_rule: "Frozen rule"
cost_rule: "Excluded"
borrow_rule: "Excluded"
---
`);
  assert.equal(validateEvaluationSpecRecord(specification).valid, true);
  specification.published_at = "2026-08-20T01:00:00Z";
  assert.equal(validateEvaluationSpecRecord(specification).valid, false);
});

test("source and fact records enforce bitemporal ordering and provenance fields", () => {
  const source = parseFlatFrontMatter(`---
type: source_record
id: "S-001"
canonical_url: "https://example.com/filing"
publisher: "Example regulator"
title: "Example filing"
published_at: "2026-08-20T08:00:00Z"
first_public_at: "2026-08-20T08:01:00Z"
retrieved_at: "2026-08-20T09:00:00Z"
effective_at: null
provider_version: "v1"
checksum: "sha256:abc"
evidence_type: primary_filing
intended_use: "Revenue fact F-001"
rights: public
access_state: public
retrieval: "Official API"
verification: checked_against_source
capture: committed-derived
supersedes_source_id: null
---
`);
  assert.equal(validateSourceRecord(source).valid, true);
  source.retrieved_at = "2026-08-19T09:00:00Z";
  assert.match(validateSourceRecord(source).errors.join("\n"), /first_public_at must not be after retrieved_at/);
  source.retrieved_at = "2026-08-20T09:00:00Z";
  source.canonical_url = "https://user:secret@example.com/private?token=abc";
  source.publisher = 123;
  const unsafeSource = validateSourceRecord(source);
  assert.match(unsafeSource.errors.join("\n"), /must not contain credentials/);
  assert.match(unsafeSource.errors.join("\n"), /sensitive query parameters/);
  assert.match(unsafeSource.errors.join("\n"), /publisher must be a non-empty string/);
  for (const parameter of [
    "X-Amz-Credential", "X-Amz-Security-Token", "X-Goog-Signature", "AWSAccessKeyId",
    "client_secret", "sessionid", "credential",
  ]) {
    source.canonical_url = `https://example.com/private?${parameter}=SECRET`;
    assert.match(validateSourceRecord(source).errors.join("\n"), /sensitive query parameters/);
  }

  const fact = parseFlatFrontMatter(`---
type: fact_record
id: "F-001"
subject_id: "issuer-example-corp"
metric: "revenue"
value: 100
unit: "USD millions"
currency: USD
period_start: "2026-01-01"
period_end: "2026-03-31"
valid_from: "2026-01-01T00:00:00Z"
valid_to: null
known_from: "2026-04-30T12:00:00Z"
known_to: null
source_id: "S-001"
derivation: null
restatement_of: null
---
`);
  assert.equal(validateFactRecord(fact).valid, true);
  fact.value = [];
  assert.match(validateFactRecord(fact).errors.join("\n"), /value must be a finite number/);
  fact.value = 100;
  fact.period_end = "2025-12-31";
  assert.match(validateFactRecord(fact).errors.join("\n"), /period_start must not be after period_end/);

  assert.equal(parseFlatFrontMatter("---\nvalue: 1e3\n---\n").value, 1000);
  assert.throws(() => parseFlatFrontMatter("---\nvalue: [1]\n---\n"), /Nested collections/);
  assert.throws(() => parseFlatFrontMatter('---\nvalue: {"x":1}\n---\n'), /Nested collections/);
});

test("company ledger validates chronology, valuation order, and canonical commit URLs", () => {
  const header = "id,published_at,source_cutoff_at,ticker,identity_path,identity_hash,security_id,listing_id,thesis_path,commit_url,currency,reference_price,reference_price_at,price_source,target_bear,target_base,target_bull,target_horizon,evaluation_rule,benchmark,sector_benchmark,position_disclosure,status,outcome_date";
  const commitUrl = `https://github.com/example/repo/commit/${"a".repeat(40)}`;
  const row = [
    "2026-T001", "2026-08-20T10:00:00Z", "2026-08-20T09:00:00Z", "EXM",
    "companies/exm/identity.md", identityHash, "sec-exm-common", "nasdaq-exm",
    "companies/exm/thesis.md", commitUrl, "USD", "10", "2026-08-20T09:30:00Z", "test_prices_v1", "8", "12", "18",
    "2027-08-20", "Evaluate at horizon close", "SPY", "QQQ", "no_position", "active", "",
  ].join(",");
  assert.equal(validateCompanyLedger(`${header}\n${row}\n`).totalRows, 1);
  assert.throws(
    () => validateCompanyLedger(`${header}\n${row.replace(commitUrl, `${commitUrl}?token=SECRET`)}\n`),
    /canonical public HTTPS commit URL/,
  );
  assert.throws(
    () => validateCompanyLedger(`${header}\n${row.replace(",8,12,18,", ",14,12,18,")}\n`),
    /bear <= base <= bull/,
  );
  assert.throws(
    () => validateCompanyLedger(`${header}\n${row.replace("2026-T001", "2026-001")}\n`),
    /must match YYYY-T001/,
  );
});

test("all record schemas parse and the ledger schema matches the canonical CSV header", async () => {
  const schemaDirectory = join(scriptDirectory, "..", "schemas");
  for (const name of [
    "company-identity",
    "company-ledger",
    "event-forecast",
    "event-outcome",
    "event-ledger",
    "event-candidate-ledger",
    "evaluation-spec",
    "source-record",
    "fact-record",
    "fact-snapshot",
    "exchange-calendar-snapshot",
    "market-data-capture",
    "market-observation-bundle",
  ]) {
    JSON.parse(await readFile(join(schemaDirectory, `${name}.schema.json`), "utf8"));
  }
  const ledgerSchema = JSON.parse(
    await readFile(join(schemaDirectory, "event-ledger.schema.json"), "utf8"),
  );
  assert.deepEqual(Object.keys(ledgerSchema.properties).sort(), [...ledgerHeaders].sort());
  const eventSchema = JSON.parse(
    await readFile(join(schemaDirectory, "event-forecast.schema.json"), "utf8"),
  );
  const sourceSchema = JSON.parse(
    await readFile(join(schemaDirectory, "source-record.schema.json"), "utf8"),
  );
  for (const contract of [eventSchema.properties.schedule_source, eventSchema.properties.no_release_check_url, sourceSchema.properties.canonical_url]) {
    assert.equal(contract.format, "uri");
    assert.equal(new RegExp(contract.pattern).test("https://user:secret@example.com/private"), false);
  }
  for (const [schemaName, ledgerName] of [
    ["event-candidate-ledger", "event-candidate-ledger.csv"],
    ["company-ledger", "forecast-ledger.csv"],
  ]) {
    const schema = JSON.parse(await readFile(join(schemaDirectory, `${schemaName}.schema.json`), "utf8"));
    const header = (await readFile(join(schemaDirectory, "..", "track-record", ledgerName), "utf8"))
      .split("\n", 1)[0]
      .split(",");
    assert.deepEqual(Object.keys(schema.properties).sort(), header.sort());
  }
});

test("committed sources cannot claim retrieval after their containing commit", async () => {
  const repository = await mkdtemp(join(tmpdir(), "value-deep-dives-source-audit-"));
  await mkdir(join(repository, "sources"), { recursive: true });
  const source = `---
type: source_record
id: "S-001"
canonical_url: "https://example.com/source"
publisher: "Example"
title: "Chronology test"
published_at: "2026-08-18T00:00:00Z"
first_public_at: "2026-08-18T00:00:00Z"
retrieved_at: "2026-08-20T00:00:00Z"
effective_at: null
provider_version: "v1"
checksum: "sha256:abc"
evidence_type: official_statistics
intended_use: "Test source chronology"
rights: public
access_state: public
retrieval: "Official API"
verification: checked_against_source
capture: committed-derived
supersedes_source_id: null
---
`;
  await writeFile(join(repository, "sources", "S-001.md"), source);
  const environment = {
    ...process.env,
    GIT_AUTHOR_DATE: "2026-08-19T00:00:00Z",
    GIT_COMMITTER_DATE: "2026-08-19T00:00:00Z",
  };
  for (const argumentsList of [
    ["init"],
    ["config", "user.email", "test@example.com"],
    ["config", "user.name", "Test"],
    ["add", "."],
    ["-c", "commit.gpgsign=false", "commit", "-m", "Commit source before claimed retrieval"],
  ]) {
    const result = spawnSync("git", argumentsList, { cwd: repository, encoding: "utf8", env: environment });
    assert.equal(result.status, 0, result.stderr);
  }
  const commitHash = spawnSync("git", ["rev-parse", "HEAD"], { cwd: repository, encoding: "utf8" }).stdout.trim();
  assert.throws(
    () => auditedCommittedSource(
      repository,
      commitHash,
      "sources/S-001.md",
      "S-001",
      "2026-08-21T00:00:00Z",
      "chronology source",
    ),
    /retrieved_at is after the commit that contains it/,
  );
});

test("calendar snapshots and market bundles reject invented session labels", () => {
  const calendar = {
    type: "exchange_calendar_snapshot",
    schema_version: 1,
    provider_id: "test_calendar",
    provider_version: "v1",
    generated_at: "2026-08-01T00:00:00Z",
    coverage_start: "2026-08-20",
    coverage_end: "2026-08-21",
    calendars: {
      XNAS: {
        timezone: "America/New_York",
        exchange_aliases: ["NASDAQ"],
        sessions: [
          { session_date: "2026-08-20", open_at: "2026-08-20T13:30:00Z", close_at: "2026-08-20T20:00:00Z" },
          { session_date: "2026-08-21", open_at: "2026-08-21T13:30:00Z", close_at: "2026-08-21T20:00:00Z" },
        ],
      },
    },
  };
  assert.equal(validateCalendarSnapshotRecord(calendar).valid, true);
  assert.throws(
    () => validateForecastCalendarCoverage(
      calendar,
      { exchange: "NASDAQ" },
      {
        return_basis: "decision_holding_period",
        event_window_end: "2026-08-20T12:00:00Z",
        target_return_window_sessions: 1,
      },
      "2026-08-19T12:00:00Z",
      "truncated calendar",
    ),
    /lacks a session close before the forecast commit/,
  );
  const reversed = structuredClone(calendar);
  reversed.calendars.XNAS.sessions.reverse();
  assert.match(validateCalendarSnapshotRecord(reversed).errors.join("\n"), /strictly sorted/);

  const bundle = {
    type: "event_market_observations",
    schema_version: 1,
    forecast_id: "2026-E001",
    captured_at: "2026-08-21T21:00:00Z",
    security: {
      security_id: "sec-exm-common", provider_id: "test_prices", provider_version: "v1",
      adjustment_rule: "split_adjusted_with_dividends", source_id: "S-001", source_path: "sources/S-001.md",
      capture_path: "captures/S-001.json", capture_hash: `sha256:${"a".repeat(64)}`,
      start: { observed_at: "2026-08-20T20:00:00Z", value: 10, kind: "official_close" },
      end: { observed_at: "2026-08-21T20:00:00Z", value: 11, kind: "official_close" },
    },
    benchmark: {
      benchmark_id: "SPY", provider_id: "test_prices", provider_version: "v1",
      adjustment_rule: "split_adjusted_with_dividends",
      source_id: "S-002", source_path: "sources/S-002.md",
      capture_path: "captures/S-002.json", capture_hash: `sha256:${"b".repeat(64)}`,
      start: { observed_at: "2026-08-20T20:00:00Z", value: 100, kind: "official_close" },
      end: { observed_at: "2026-08-21T20:00:00Z", value: 101, kind: "official_close" },
    },
  };
  assert.equal(validateMarketObservationBundleRecord(bundle).valid, true);
  assert.equal(validateMarketDataCaptureRecord({
    type: "market_data_capture",
    schema_version: 1,
    source_id: "S-001",
    provider_id: "test_prices",
    provider_version: "v1",
    retrieved_at: "2026-08-21T21:00:00Z",
    instrument_id: "sec-exm-common",
    adjustment_rule: "split_adjusted_with_dividends",
    observations: [bundle.security.start, bundle.security.end],
  }).valid, true);
  bundle.security.end.observed_at = "2026-08-21T22:00:00Z";
  assert.match(validateMarketObservationBundleRecord(bundle).errors.join("\n"), /must not postdate captured_at/);
});

test("event ledger scores independently resolved propositions against frozen baselines", () => {
  const partial = {
    ...baseRow,
    id: "2026-E002",
    ticker: "ABC",
    security_id: "sec-abc-common",
    listing_id: "nasdaq-abc",
    event_type: "clinical_trial",
    event_baseline_probability_pct: "40",
    event_probability_pct: "30",
    target_probability_pct: "70",
    event_outcome: "0",
    target_outcome_status: "unresolvable",
    target_outcome: "",
    status: "partially_resolved",
  };
  const active = {
    ...baseRow,
    id: "2026-E003",
    ticker: "XYZ",
    security_id: "sec-xyz-common",
    listing_id: "nyse-xyz",
    event_type: "policy",
    event_probability_pct: "50",
    target_probability_pct: "40",
    event_outcome_status: "pending",
    event_outcome: "",
    target_outcome_status: "pending",
    target_outcome: "",
    outcome_at: "",
    outcome_path: "",
    outcome_commit_url: "",
    status: "active",
  };
  const result = scoreEventLedger(makeLedger([baseRow, partial, active]));
  assert.equal(result.resolvedRows, 2);
  assert.equal(result.fullyResolvedRows, 1);
  assert.equal(result.eventOutcome.n, 2);
  assert.equal(result.securityOutcome.n, 1);
  assert.ok(Math.abs(result.eventOutcome.brierScore - 0.065) < 1e-12);
  assert.ok(Math.abs(result.eventOutcome.baselineBrierScore - 0.205) < 1e-12);
  assert.ok(Math.abs(result.securityOutcome.brierScore - 0.16) < 1e-12);
  assert.match(result.warnings.join("\n"), /event observations/);
});

test("ledger rejects leakage through late publication, reference prices, or outcomes", () => {
  assert.throws(
    () => scoreEventLedger(makeLedger([{ ...baseRow, published_at: "2026-08-22T10:00:00Z" }])),
    /published_at must strictly precede event_window_start/,
  );
  assert.throws(
    () => scoreEventLedger(makeLedger([{ ...baseRow, published_at: baseRow.event_window_start }])),
    /published_at must strictly precede event_window_start/,
  );
  assert.throws(
    () => scoreEventLedger(makeLedger([{ ...baseRow, reference_price_at: "2026-08-20T11:00:00Z" }])),
    /reference_price_at is after published_at/,
  );
  assert.throws(
    () => scoreEventLedger(makeLedger([{ ...baseRow, outcome_at: "2026-08-20T09:00:00Z" }])),
    /outcome_at is before published_at/,
  );
  assert.throws(
    () => scoreEventLedger(makeLedger([{ ...baseRow, commit_url: `${baseRow.commit_url}?token=SECRET` }])),
    /canonical public HTTPS commit URL/,
  );
});

test("exact 60 percent forecasts enter the 60-80 calibration bucket", () => {
  const result = scoreEventLedger(makeLedger([{ ...baseRow, event_probability_pct: "60" }]));
  assert.equal(result.eventOutcome.calibration[0].range, "60-80");
});

test("event candidate ledger preserves abstentions and reports registration coverage", () => {
  const candidates = `candidate_id,cohort_id,identified_at,source_cutoff_at,ticker,identity_path,security_id,listing_id,event_type,event_window_start,event_window_end,eligibility_rule_id,decision,decision_at,reason,forecast_id
2026-C001,earnings-2026w34,2026-08-20T08:00:00Z,2026-08-20T09:00:00Z,EXM,companies/exm/identity.md,sec-exm-common,nasdaq-exm,earnings,2026-08-21T22:00:00Z,2026-08-21T23:00:00Z,earnings-v1,registered,2026-08-20T10:00:00Z,Meets all eligibility gates,2026-E001
2026-C002,earnings-2026w34,2026-08-20T08:00:00Z,2026-08-20T09:00:00Z,ABC,companies/abc/identity.md,sec-abc-common,nasdaq-abc,earnings,2026-08-21T22:00:00Z,2026-08-21T23:00:00Z,earnings-v1,abstained,2026-08-20T10:00:00Z,No lawful point-in-time price source,
`;
  const result = summarizeEventCandidates(candidates);
  assert.equal(result.totalCandidates, 2);
  assert.equal(result.decisionCounts.registered, 1);
  assert.equal(result.decisionCounts.abstained, 1);
  assert.equal(result.registrationRate, 0.5);
  assert.equal(result.registrationRateEligibleDecided, 0.5);
  assert.equal(result.decisionClosureRate, 1);
  assert.throws(
    () => summarizeEventCandidates(`${candidates.trim()}\n2026-C003,earnings-2026w35,2026-08-20T08:00:00Z,2026-08-20T09:00:00Z,XYZ,companies/xyz/identity.md,sec-xyz-common,nasdaq-xyz,earnings,2026-08-22T22:00:00Z,2026-08-22T23:00:00Z,earnings-v1,registered,2026-08-20T10:00:00Z,Duplicate forecast link,2026-E001\n`),
    /Duplicate registered forecast_id/,
  );
});

test("target resolution is recomputed from frozen price and return rules", () => {
  const forecast = parseFlatFrontMatter(publishedEvent);
  const outcome = {
    target_outcome_status: "resolved",
    target_outcome: 1,
    actual_release_at: "2026-08-21T20:00:00+02:00",
    security_start_price: 12.5,
    security_start_at: "2026-08-20T09:30:00+02:00",
    security_end_price: 14,
    security_end_at: "2026-08-28T21:00:00+02:00",
    security_end_session_number: 5,
    security_price_source: "test_prices_v1",
    security_price_adjustment_rule: "split_adjusted_with_dividends",
    benchmark_start_value: 100,
    benchmark_end_value: 101,
    benchmark_price_source: "test_prices_v1",
    benchmark_price_adjustment_rule: "split_adjusted_with_dividends",
  };
  assert.equal(calculateTargetResolution(forecast, outcome).expectedOutcome, 1);
  assert.throws(
    () => calculateTargetResolution(forecast, { ...outcome, target_outcome: 0 }),
    /disagrees with deterministic return arithmetic/,
  );
  assert.throws(
    () => calculateTargetResolution(forecast, { ...outcome, security_price_source: "later_provider" }),
    /differs from the frozen provider/,
  );
  assert.throws(
    () => calculateTargetResolution(forecast, { ...outcome, actual_release_at: "2026-08-22T00:00:00+02:00" }),
    /cannot resolve from a release after the frozen deadline/,
  );
});

test("ledger link audit reconciles the committed forecast, identity, and published spec", async () => {
  const repository = await mkdtemp(join(tmpdir(), "value-deep-dives-audit-"));
  await mkdir(join(repository, "companies", "exm"), { recursive: true });
  await mkdir(join(repository, "methodology", "event-evaluation-specs"), { recursive: true });

  const now = Date.now();
  const day = 86_400_000;
  const specificationPublishedAt = new Date(now - 12 * day).toISOString();
  const specificationCommitAt = new Date(now - 12 * day + 5_000).toISOString();
  const publishedAt = new Date(now - 10 * day).toISOString();
  const forecastCommitAt = new Date(now - 10 * day + 5_000).toISOString();
  const sourceCutoffAt = new Date(now - 10 * day - 60_000).toISOString();
  const candidateDecisionAt = new Date(now - 10 * day - 30_000).toISOString();
  const candidateCommitAt = new Date(now - 10 * day - 25_000).toISOString();
  const scheduleKnownAt = new Date(now - 11 * day).toISOString();
  const referencePriceAt = new Date(now - 10 * day - 30_000).toISOString();
  const eventWindowStart = new Date(now - 9 * day).toISOString();
  const eventWindowEnd = new Date(now - 9 * day + 3_600_000).toISOString();
  const actualReleaseAt = new Date(now - 9 * day + 3_000_000).toISOString();
  const postReleaseSessions = Array.from({ length: 6 }, (_, index) => {
    const openAt = new Date(Date.parse(actualReleaseAt) + 12 * 3_600_000 + index * day);
    const closeAt = new Date(openAt.getTime() + 6.5 * 3_600_000);
    return {
      session_date: openAt.toISOString().slice(0, 10),
      open_at: openAt.toISOString(),
      close_at: closeAt.toISOString(),
    };
  });
  const precedingOpenAt = new Date(Date.parse(forecastCommitAt) - 12 * 3_600_000);
  const precedingCloseAt = new Date(precedingOpenAt.getTime() + 6.5 * 3_600_000);
  const calendarSessions = [
    {
      session_date: precedingOpenAt.toISOString().slice(0, 10),
      open_at: precedingOpenAt.toISOString(),
      close_at: precedingCloseAt.toISOString(),
    },
    ...postReleaseSessions,
  ];
  const securityEndAt = postReleaseSessions[4].close_at;
  const outcomeAt = new Date(Date.parse(securityEndAt) + 3_600_000).toISOString();
  const outcomeCommitAt = new Date(Date.parse(outcomeAt) + 5_000).toISOString();
  const committedIdentityHash = `sha256:${createHash("sha256").update(identityMarkdown).digest("hex")}`;
  const sourceFirstPublicAt = new Date(now - 11 * day).toISOString();
  const sourceRecord = (id, title) => `---
type: source_record
id: "${id}"
canonical_url: "https://example.com/${id}"
publisher: "Example official source"
title: "${title}"
published_at: "${sourceFirstPublicAt}"
first_public_at: "${sourceFirstPublicAt}"
retrieved_at: "${sourceCutoffAt}"
effective_at: null
provider_version: "v1"
checksum: "sha256:abc"
evidence_type: official_statistics
intended_use: "Frozen baseline or fact"
rights: public
access_state: public
retrieval: "Official API"
verification: checked_against_source
capture: committed-derived
supersedes_source_id: null
---
`;
  const fact = `---
type: fact_record
id: "F-001"
subject_id: "issuer-example-corp"
metric: "revenue"
value: 100
unit: "USD millions"
currency: USD
period_start: "2026-01-01"
period_end: "2026-03-31"
valid_from: "2026-01-01T00:00:00Z"
valid_to: null
known_from: "${sourceFirstPublicAt}"
known_to: null
source_id: "S-010"
derivation: null
restatement_of: null
---
`;
  const factSnapshot = `${JSON.stringify(
    {
      type: "fact_snapshot",
      snapshot_id: "FS-001",
      created_at: sourceCutoffAt,
      source_cutoff_at: sourceCutoffAt,
      records: [
        {
          fact_path: "companies/exm/facts/F-001.md",
          source_path: "companies/exm/sources/S-010.md",
        },
      ],
    },
    null,
    2,
  )}\n`;
  const committedFactSnapshotHash = `sha256:${createHash("sha256").update(factSnapshot).digest("hex")}`;
  let forecast = publishedEvent
    .replace(identityHash, committedIdentityHash)
    .replace(factSnapshotHash, committedFactSnapshotHash)
    .replace("2026-08-20T10:00:00+02:00", publishedAt)
    .replace("2026-08-20T09:00:00+02:00", sourceCutoffAt)
    .replace("2026-08-19T10:00:00+02:00", scheduleKnownAt)
    .replace("2026-08-21T22:00:00+02:00", eventWindowStart)
    .replace("2026-08-21T23:00:00+02:00", eventWindowEnd)
    .replace("2026-08-20T09:30:00+02:00", referencePriceAt);
  const calendarFixture = `${JSON.stringify(
    {
      type: "exchange_calendar_snapshot",
      schema_version: 1,
      provider_id: "test_calendar",
      provider_version: "v1",
      generated_at: new Date(Date.parse(specificationPublishedAt) - day).toISOString(),
      coverage_start: new Date(Date.parse(actualReleaseAt) - day).toISOString().slice(0, 10),
      coverage_end: new Date(Date.parse(calendarSessions.at(-1).session_date) + day).toISOString().slice(0, 10),
      calendars: {
        XNAS: {
          timezone: "America/New_York",
          exchange_aliases: ["NASDAQ"],
          sessions: calendarSessions,
        },
      },
    },
    null,
    2,
  )}\n`;
  const calendarFixtureHash = `sha256:${createHash("sha256").update(calendarFixture).digest("hex")}`;
  const calendarSourceFirstPublicAt = new Date(Date.parse(specificationPublishedAt) - 2 * day).toISOString();
  const calendarSourceRetrievedAt = new Date(Date.parse(specificationPublishedAt) - 60_000).toISOString();
  const calendarSource = `---
type: source_record
id: "S-009"
canonical_url: "https://example.com/test-calendar-v1"
publisher: "Example calendar provider"
title: "Versioned exchange calendar fixture"
published_at: "${calendarSourceFirstPublicAt}"
first_public_at: "${calendarSourceFirstPublicAt}"
retrieved_at: "${calendarSourceRetrievedAt}"
effective_at: null
provider_version: "v1"
checksum: "${calendarFixtureHash}"
evidence_type: official_statistics
intended_use: "Freeze the event-v1 exchange sessions"
rights: public
access_state: public
retrieval: "Versioned public fixture"
verification: checked_against_source
capture: committed-derived
supersedes_source_id: null
---
`;
  const specification = `---
type: event_evaluation_spec
evaluation_spec_id: event-v1
status: published
created_at: "${new Date(Date.parse(specificationPublishedAt) - day).toISOString()}"
published_at: "${specificationPublishedAt}"
price_provider_id: "test_prices_v1"
benchmark_price_provider_id: "test_prices_v1"
exchange_calendar_id: "test_calendar"
exchange_calendar_version: "v1"
calendar_source_id: "S-009"
calendar_source_path: "methodology/event-evaluation-specs/calendar-source.md"
calendar_verification_fixture: "fixtures/calendar.json"
calendar_fixture_hash: "${calendarFixtureHash}"
price_provider_rule: "Frozen provider"
benchmark_price_provider_rule: "Frozen provider"
market_timezone_rule: "Primary listing"
exchange_calendar_rule: "Official calendar"
entry_observation_rule: "Frozen rule"
exit_observation_rule: "Frozen rule"
price_adjustment_rule: split_adjusted_with_dividends
benchmark_price_adjustment_rule: split_adjusted_with_dividends
corporate_action_rule: "Frozen rule"
halt_rule: "Frozen rule"
delisting_rule: "Frozen rule"
missing_price_rule: "Frozen rule"
cost_rule: "Excluded"
borrow_rule: "Excluded"
---
`;
  await writeFile(join(repository, "companies", "exm", "identity.md"), identityMarkdown);
  await mkdir(join(repository, "fixtures"), { recursive: true });
  await writeFile(join(repository, "fixtures", "calendar.json"), calendarFixture);
  await writeFile(
    join(repository, "methodology", "event-evaluation-specs", "calendar-source.md"),
    calendarSource,
  );
  await writeFile(
    join(repository, "methodology", "event-evaluation-specs", "event-v1.md"),
    specification,
  );

  const specificationCommitEnvironment = {
    ...process.env,
    GIT_AUTHOR_DATE: specificationCommitAt,
    GIT_COMMITTER_DATE: specificationCommitAt,
  };
  for (const argumentsList of [
    ["init"],
    ["config", "user.email", "test@example.com"],
    ["config", "user.name", "Test"],
    ["remote", "add", "origin", "https://github.com/example/repo.git"],
    ["add", "."],
    ["-c", "commit.gpgsign=false", "commit", "-m", "Publish evaluation specification"],
  ]) {
    const result = spawnSync("git", argumentsList, {
      cwd: repository,
      encoding: "utf8",
      env: specificationCommitEnvironment,
    });
    assert.equal(result.status, 0, result.stderr);
  }
  await mkdir(join(repository, "track-record"), { recursive: true });
  const candidateLedger = `candidate_id,cohort_id,identified_at,source_cutoff_at,ticker,identity_path,security_id,listing_id,event_type,event_window_start,event_window_end,eligibility_rule_id,decision,decision_at,reason,forecast_id
2026-C001,earnings-test,${new Date(Date.parse(sourceCutoffAt) - 60_000).toISOString()},${sourceCutoffAt},EXM,companies/exm/identity.md,sec-exm-common,nasdaq-exm,earnings,${eventWindowStart},${eventWindowEnd},earnings-v1,registered,${candidateDecisionAt},Meets all prospective gates,2026-E001
`;
  await writeFile(join(repository, "track-record", "event-candidate-ledger.csv"), candidateLedger);
  for (const argumentsList of [
    ["add", "."],
    ["-c", "commit.gpgsign=false", "commit", "-m", "Freeze event candidate cohort"],
  ]) {
    const result = spawnSync("git", argumentsList, {
      cwd: repository,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: candidateCommitAt,
        GIT_COMMITTER_DATE: candidateCommitAt,
      },
    });
    assert.equal(result.status, 0, result.stderr);
  }
  const candidateCommitHash = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repository,
    encoding: "utf8",
  }).stdout.trim();
  await assert.rejects(
    auditEventLedgerLinks(makeLedger([]), repository),
    /registers 2026-E001, which is absent from the event ledger/,
  );
  forecast = forecast.replace(
    `https://github.com/example/repo/commit/${"c".repeat(40)}`,
    `https://github.com/example/repo/commit/${candidateCommitHash}`,
  );
  await mkdir(join(repository, "companies", "exm", "sources"), { recursive: true });
  await mkdir(join(repository, "companies", "exm", "facts"), { recursive: true });
  await writeFile(join(repository, "companies", "exm", "sources", "S-010.md"), sourceRecord("S-010", "Event baseline"));
  await writeFile(join(repository, "companies", "exm", "sources", "S-011.md"), sourceRecord("S-011", "Target baseline"));
  await writeFile(join(repository, "companies", "exm", "facts", "F-001.md"), fact);
  await writeFile(join(repository, "companies", "exm", "fact-snapshot.json"), factSnapshot);
  await writeFile(join(repository, "companies", "exm", "event.md"), forecast);
  for (const argumentsList of [
    ["add", "."],
    ["-c", "commit.gpgsign=false", "commit", "-m", "Publish forecast"],
  ]) {
    const result = spawnSync("git", argumentsList, {
      cwd: repository,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: forecastCommitAt,
        GIT_COMMITTER_DATE: forecastCommitAt,
      },
    });
    assert.equal(result.status, 0, result.stderr);
  }
  const commitHash = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repository,
    encoding: "utf8",
  }).stdout.trim();
  const ledger = makeLedger([
    {
      ...baseRow,
      candidate_ledger_commit_url: `https://github.com/example/repo/commit/${candidateCommitHash}`,
      published_at: publishedAt,
      source_cutoff_at: sourceCutoffAt,
      identity_hash: committedIdentityHash,
      schedule_known_at: scheduleKnownAt,
      event_window_start: eventWindowStart,
      event_window_end: eventWindowEnd,
      event_baseline_id: "S-010",
      event_baseline_source_path: "companies/exm/sources/S-010.md",
      event_baseline_probability_pct: "50",
      event_baseline_sample_size: "120",
      target_baseline_id: "S-011",
      target_baseline_source_path: "companies/exm/sources/S-011.md",
      target_baseline_probability_pct: "20",
      fact_snapshot_path: "companies/exm/fact-snapshot.json",
      fact_snapshot_hash: committedFactSnapshotHash,
      event_probability_pct: "65",
      security_return_rule: "Split-adjusted total return is at least 10%",
      target_probability_pct: "40",
      reference_price_at: referencePriceAt,
      reference_price_source: "test_prices_v1",
      benchmark_price_source: "test_prices_v1",
      event_outcome_status: "pending",
      event_outcome: "",
      target_outcome_status: "pending",
      target_outcome: "",
      outcome_at: "",
      outcome_path: "",
      commit_url: `https://github.com/example/repo/commit/${commitHash}`,
      outcome_commit_url: "",
      status: "active",
    },
  ]);

  scoreEventLedger(ledger);
  const audit = await auditEventLedgerLinks(ledger, repository);
  assert.equal(audit.validatedRows, 1);

  const marketCapture = (sourceId, instrumentId, startValue, endValue) => `${JSON.stringify(
    {
      type: "market_data_capture",
      schema_version: 1,
      source_id: sourceId,
      provider_id: "test_prices_v1",
      provider_version: "v1",
      retrieved_at: outcomeAt,
      instrument_id: instrumentId,
      adjustment_rule: "split_adjusted_with_dividends",
      observations: [
        { observed_at: referencePriceAt, value: startValue, kind: "reference_snapshot" },
        { observed_at: securityEndAt, value: endValue, kind: "official_close" },
      ],
    },
    null,
    2,
  )}\n`;
  const securityCapture = marketCapture("S-013", "sec-exm-common", 12.5, 14);
  const benchmarkCapture = marketCapture("S-014", "SPY", 100, 101);
  const securityCaptureHash = `sha256:${createHash("sha256").update(securityCapture).digest("hex")}`;
  const benchmarkCaptureHash = `sha256:${createHash("sha256").update(benchmarkCapture).digest("hex")}`;
  const marketObservationBundle = `${JSON.stringify(
    {
      type: "event_market_observations",
      schema_version: 1,
      forecast_id: "2026-E001",
      captured_at: outcomeAt,
      security: {
        security_id: "sec-exm-common",
        provider_id: "test_prices_v1",
        provider_version: "v1",
        adjustment_rule: "split_adjusted_with_dividends",
        source_id: "S-013",
        source_path: "companies/exm/sources/S-013.md",
        capture_path: "companies/exm/captures/S-013.json",
        capture_hash: securityCaptureHash,
        start: { observed_at: referencePriceAt, value: 12.5, kind: "reference_snapshot" },
        end: { observed_at: securityEndAt, value: 14, kind: "official_close" },
      },
      benchmark: {
        benchmark_id: "SPY",
        provider_id: "test_prices_v1",
        provider_version: "v1",
        adjustment_rule: "split_adjusted_with_dividends",
        source_id: "S-014",
        source_path: "companies/exm/sources/S-014.md",
        capture_path: "companies/exm/captures/S-014.json",
        capture_hash: benchmarkCaptureHash,
        start: { observed_at: referencePriceAt, value: 100, kind: "reference_snapshot" },
        end: { observed_at: securityEndAt, value: 101, kind: "official_close" },
      },
    },
    null,
    2,
  )}\n`;
  const marketObservationHash = `sha256:${createHash("sha256").update(marketObservationBundle).digest("hex")}`;
  const outcome = `---
type: event_outcome
forecast_id: "2026-E001"
company: "Example Corp"
ticker: "EXM"
status: resolved
as_of: "2026-08-20"
outcome_at: "${outcomeAt}"
release_status: released
resolution_deadline_at: "${eventWindowEnd}"
actual_release_at: "${actualReleaseAt}"
resolution_reason: "The event source and fifth-session adjusted observations were available"
original_forecast: "companies/exm/event.md"
evaluation_spec_id: event-v1
event_outcome_status: resolved
event_outcome: 1
event_outcome_source_id: "S-012"
event_outcome_source_path: "companies/exm/sources/S-012.md"
target_outcome_status: resolved
target_outcome: 1
security_start_price: 12.5
security_start_at: "${referencePriceAt}"
security_end_price: 14
security_end_at: "${securityEndAt}"
security_end_session_number: 5
security_price_source: "test_prices_v1"
security_price_adjustment_rule: split_adjusted_with_dividends
benchmark_start_value: 100
benchmark_end_value: 101
benchmark_price_source: "test_prices_v1"
benchmark_price_adjustment_rule: split_adjusted_with_dividends
market_observation_path: "companies/exm/market-observations.json"
market_observation_hash: "${marketObservationHash}"
position_disclosure: no_position
---
`;
  const outcomeSource = `---
type: source_record
id: "S-012"
canonical_url: "https://example.com/S-012"
publisher: "Example issuer"
title: "Event result"
published_at: "${actualReleaseAt}"
first_public_at: "${actualReleaseAt}"
retrieved_at: "${outcomeAt}"
effective_at: null
provider_version: "v1"
checksum: "sha256:def"
evidence_type: company_ir
intended_use: "Resolve event forecast 2026-E001"
rights: public
access_state: public
retrieval: "Issuer website"
verification: checked_against_source
capture: committed-derived
supersedes_source_id: null
---
`;
  const marketSource = (id, title, captureHash) => `---
type: source_record
id: "${id}"
canonical_url: "https://example.com/${id}"
publisher: "Example exchange data provider"
title: "${title}"
published_at: "${securityEndAt}"
first_public_at: "${securityEndAt}"
retrieved_at: "${outcomeAt}"
effective_at: null
provider_version: "v1"
checksum: "${captureHash}"
evidence_type: market_data
intended_use: "Resolve security forecast 2026-E001"
rights: public
access_state: public
retrieval: "Versioned test fixture"
verification: checked_against_source
capture: committed-derived
supersedes_source_id: null
---
`;
  await writeFile(join(repository, "companies", "exm", "sources", "S-012.md"), outcomeSource);
  await writeFile(join(repository, "companies", "exm", "sources", "S-013.md"), marketSource("S-013", "Security prices", securityCaptureHash));
  await writeFile(join(repository, "companies", "exm", "sources", "S-014.md"), marketSource("S-014", "Benchmark prices", benchmarkCaptureHash));
  await mkdir(join(repository, "companies", "exm", "captures"), { recursive: true });
  await writeFile(join(repository, "companies", "exm", "captures", "S-013.json"), securityCapture);
  await writeFile(join(repository, "companies", "exm", "captures", "S-014.json"), benchmarkCapture);
  await writeFile(join(repository, "companies", "exm", "market-observations.json"), marketObservationBundle);
  await writeFile(join(repository, "companies", "exm", "event-outcome.md"), outcome);
  for (const argumentsList of [
    ["add", "."],
    ["-c", "commit.gpgsign=false", "commit", "-m", "Resolve forecast"],
  ]) {
    const result = spawnSync("git", argumentsList, {
      cwd: repository,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: outcomeCommitAt,
        GIT_COMMITTER_DATE: outcomeCommitAt,
      },
    });
    assert.equal(result.status, 0, result.stderr);
  }
  const outcomeCommitHash = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repository,
    encoding: "utf8",
  }).stdout.trim();
  const resolvedLedger = makeLedger([
    {
      ...baseRow,
      candidate_ledger_commit_url: `https://github.com/example/repo/commit/${candidateCommitHash}`,
      published_at: publishedAt,
      source_cutoff_at: sourceCutoffAt,
      identity_hash: committedIdentityHash,
      schedule_known_at: scheduleKnownAt,
      event_window_start: eventWindowStart,
      event_window_end: eventWindowEnd,
      event_baseline_id: "S-010",
      event_baseline_source_path: "companies/exm/sources/S-010.md",
      event_baseline_probability_pct: "50",
      event_baseline_sample_size: "120",
      target_baseline_id: "S-011",
      target_baseline_source_path: "companies/exm/sources/S-011.md",
      target_baseline_probability_pct: "20",
      fact_snapshot_path: "companies/exm/fact-snapshot.json",
      fact_snapshot_hash: committedFactSnapshotHash,
      event_probability_pct: "65",
      security_return_rule: "Split-adjusted total return is at least 10%",
      target_probability_pct: "40",
      reference_price_at: referencePriceAt,
      reference_price_source: "test_prices_v1",
      benchmark_price_source: "test_prices_v1",
      outcome_at: outcomeAt,
      commit_url: `https://github.com/example/repo/commit/${commitHash}`,
      outcome_commit_url: `https://github.com/example/repo/commit/${outcomeCommitHash}`,
      status: "resolved",
    },
  ]);
  scoreEventLedger(resolvedLedger);
  assert.equal((await auditEventLedgerLinks(resolvedLedger, repository)).validatedRows, 1);

  const implausibleEndAt = new Date(Date.parse(actualReleaseAt) + 25_000).toISOString();
  const implausibleBundle = marketObservationBundle.replaceAll(securityEndAt, implausibleEndAt);
  const implausibleHash = `sha256:${createHash("sha256").update(implausibleBundle).digest("hex")}`;
  const implausibleOutcome = outcome
    .replace(`security_end_at: "${securityEndAt}"`, `security_end_at: "${implausibleEndAt}"`)
    .replace(marketObservationHash, implausibleHash);
  await writeFile(join(repository, "companies", "exm", "market-observations.json"), implausibleBundle);
  await writeFile(join(repository, "companies", "exm", "event-outcome.md"), implausibleOutcome);
  const invalidOutcomeCommitAt = new Date(Date.parse(outcomeCommitAt) + 10_000).toISOString();
  for (const argumentsList of [
    ["add", "."],
    ["-c", "commit.gpgsign=false", "commit", "-m", "Attempt invalid session label"],
  ]) {
    const result = spawnSync("git", argumentsList, {
      cwd: repository,
      encoding: "utf8",
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: invalidOutcomeCommitAt,
        GIT_COMMITTER_DATE: invalidOutcomeCommitAt,
      },
    });
    assert.equal(result.status, 0, result.stderr);
  }
  const invalidOutcomeCommitHash = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repository,
    encoding: "utf8",
  }).stdout.trim();
  const invalidSessionLedger = makeLedger([
    {
      ...baseRow,
      candidate_ledger_commit_url: `https://github.com/example/repo/commit/${candidateCommitHash}`,
      published_at: publishedAt,
      source_cutoff_at: sourceCutoffAt,
      identity_hash: committedIdentityHash,
      schedule_known_at: scheduleKnownAt,
      event_window_start: eventWindowStart,
      event_window_end: eventWindowEnd,
      event_baseline_id: "S-010",
      event_baseline_source_path: "companies/exm/sources/S-010.md",
      event_baseline_probability_pct: "50",
      event_baseline_sample_size: "120",
      target_baseline_id: "S-011",
      target_baseline_source_path: "companies/exm/sources/S-011.md",
      target_baseline_probability_pct: "20",
      fact_snapshot_path: "companies/exm/fact-snapshot.json",
      fact_snapshot_hash: committedFactSnapshotHash,
      event_probability_pct: "65",
      security_return_rule: "Split-adjusted total return is at least 10%",
      target_probability_pct: "40",
      reference_price_at: referencePriceAt,
      reference_price_source: "test_prices_v1",
      benchmark_price_source: "test_prices_v1",
      outcome_at: outcomeAt,
      commit_url: `https://github.com/example/repo/commit/${commitHash}`,
      outcome_commit_url: `https://github.com/example/repo/commit/${invalidOutcomeCommitHash}`,
      status: "resolved",
    },
  ]);
  await assert.rejects(
    () => auditEventLedgerLinks(invalidSessionLedger, repository),
    /end must be the official close of frozen session 5/,
  );
  await writeFile(
    join(repository, "track-record", "event-candidate-ledger.csv"),
    candidateLedger.replace("Meets all prospective gates", "Backfilled favorable reason"),
  );
  await assert.rejects(
    () => auditEventLedgerLinks(resolvedLedger, repository),
    /current row differs from its first committed version/,
  );
  await writeFile(join(repository, "track-record", "event-candidate-ledger.csv"), candidateLedger);

  const companyPublishedAt = new Date(Date.parse(invalidOutcomeCommitAt) + 10_000).toISOString();
  const companyCommitAt = new Date(Date.parse(companyPublishedAt) + 5_000).toISOString();
  const thesis = `---
type: company_thesis
forecast_id: "2026-T001"
research_status: published
published_at: "${companyPublishedAt}"
source_cutoff_at: "${sourceCutoffAt}"
ticker: "EXM"
identity_path: "companies/exm/identity.md"
identity_hash: "${committedIdentityHash}"
security_id: "sec-exm-common"
listing_id: "nasdaq-exm"
currency: USD
reference_price: 12.5
reference_price_at: "${referencePriceAt}"
reference_price_source: test_prices_v1
target_bear: 8
target_base: 14
target_bull: 20
target_horizon: "2027-08-20"
evaluation_rule: "Evaluate at horizon close"
benchmark: SPY
sector_benchmark: null
position_disclosure: no_position
---

# Example thesis
`;
  await writeFile(join(repository, "companies", "exm", "thesis.md"), thesis);
  for (const argumentsList of [
    ["add", "."],
    ["-c", "commit.gpgsign=false", "commit", "-m", "Publish company thesis"],
  ]) {
    const result = spawnSync("git", argumentsList, {
      cwd: repository,
      encoding: "utf8",
      env: { ...process.env, GIT_AUTHOR_DATE: companyCommitAt, GIT_COMMITTER_DATE: companyCommitAt },
    });
    assert.equal(result.status, 0, result.stderr);
  }
  const companyCommitHash = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repository,
    encoding: "utf8",
  }).stdout.trim();
  const companyHeader = "id,published_at,source_cutoff_at,ticker,identity_path,identity_hash,security_id,listing_id,thesis_path,commit_url,currency,reference_price,reference_price_at,price_source,target_bear,target_base,target_bull,target_horizon,evaluation_rule,benchmark,sector_benchmark,position_disclosure,status,outcome_date";
  const companyRow = [
    "2026-T001", companyPublishedAt, sourceCutoffAt, "EXM", "companies/exm/identity.md",
    committedIdentityHash, "sec-exm-common", "nasdaq-exm", "companies/exm/thesis.md",
    `https://github.com/example/repo/commit/${companyCommitHash}`, "USD", "12.5",
    referencePriceAt, "test_prices_v1", "8", "14", "20", "2027-08-20", "Evaluate at horizon close",
    "SPY", "", "no_position", "active", "",
  ].join(",");
  const companyLedger = `${companyHeader}\n${companyRow}\n`;
  assert.equal(auditCompanyLedgerLinks(companyLedger, repository).validatedRows, 1);
  assert.throws(
    () => auditCompanyLedgerLinks(companyLedger.replace("github.com/example/repo", "localhost/example/repo"), repository),
    /does not match the configured public origin/,
  );
  assert.throws(
    () => auditCompanyLedgerLinks(companyLedger.replace("Evaluate at horizon close", "Evaluate on any favorable date"), repository),
    /evaluation_rule differs from committed thesis/,
  );
});

test("CLI emits JSON and rejects an event published after its window starts", async () => {
  const directory = await mkdtemp(join(tmpdir(), "value-deep-dives-records-"));
  const validPath = join(directory, "valid.md");
  const invalidPath = join(directory, "invalid.md");
  await writeFile(validPath, publishedEvent);
  await writeFile(
    invalidPath,
    publishedEvent.replace(
      'published_at: "2026-08-20T10:00:00+02:00"',
      'published_at: "2026-08-22T10:00:00+02:00"',
    ),
  );

  const valid = spawnSync(process.execPath, [cliPath, "validate-event", validPath, "--json"], {
    encoding: "utf8",
  });
  assert.equal(valid.status, 0, valid.stderr);
  assert.equal(JSON.parse(valid.stdout).valid, true);

  const invalid = spawnSync(process.execPath, [cliPath, "validate-event", invalidPath, "--json"], {
    encoding: "utf8",
  });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stdout, /published_at must not be after event_window_start/);
});

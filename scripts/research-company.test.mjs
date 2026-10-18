import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test, { after } from "node:test";

import {
  parseDocumentFrontMatter,
  validateCoverageCycles,
  validateValuationHorizonContract,
  valuationTableSemanticErrors,
} from "./lib/company-cycle.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const fixtureRoots = [];
after(async () => {
  for (const root of fixtureRoots) await rm(root, { recursive: true, force: true });
});
const modelSource = "export const model = true;\n";
const verifierSource = "export const verified = true;\n";

function sha256(text) {
  return `sha256:${createHash("sha256").update(text).digest("hex")}`;
}

const manifest = `---
type: company_coverage_cycle
coverage_cycle_id: EXM-2026-W34-01
company: Example Corp
ticker: EXM
cycle_number: 1
cycle_kind: initial
iso_week: 2026-W34
status: active
research_status: draft
started_at: 2026-08-20
as_of: 2026-08-22
source_cutoff_at: 2026-08-22T20:00:00Z
prior_cycle_path: null
supersedes: []
final_report_path: ../../thesis/2026-W34-final-report.md
valuation_path: ../../valuation/2026-W34-valuation.md
decision_path: ../../decisions/2026-W34-decision.md
valuation_contract_path: ../../valuation/2026-W34-valuation-contract.json
forecast_path: null
review_status: not_requested
tags: [internet, advertising]
---

# Example cycle

- [Report](../../thesis/2026-W34-final-report.md)
- [Valuation](../../valuation/2026-W34-valuation.md)
- [Decision](../../decisions/2026-W34-decision.md)
- [Valuation contract](../../valuation/2026-W34-valuation-contract.json)
`;

const report = `---
type: company_thesis
company: Example Corp
ticker: EXM
coverage_cycle_id: EXM-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
valuation_contract_path: ../valuation/2026-W34-valuation-contract.json
valuation_quantity: fair_value_per_share
valuation_display_semantics: distribution_percentiles
identity_path: companies/exm/identity.md
identity_hash: sha256:${"a".repeat(64)}
security_id: exm-common
listing_id: nasdaq-exm
research_status: draft
as_of: 2026-08-22
source_cutoff_at: 2026-08-22T20:00:00Z
currency: USD
reference_price: 10
reference_price_at: 2026-08-20T20:00:00Z
reference_price_source: public_market_data_source
target_bear: null
target_base: null
target_bull: null
primary_distribution_p10: 6
primary_distribution_p50: 12
primary_distribution_p90: 18
primary_distribution_mean: 12.5
target_horizon: 2027-08-20
distribution_method: example-v1
distribution_calibration_status: uncalibrated_shadow
distribution_seed: 1
distribution_sample_count: 100000
supersedes: null
tags: [internet, advertising]
---

# Report

[Valuation](../valuation/2026-W34-valuation.md)
[Valuation contract](../valuation/2026-W34-valuation-contract.json)
`;

const valuation = `---
type: valuation
company: Example Corp
ticker: EXM
coverage_cycle_id: EXM-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
valuation_contract_path: 2026-W34-valuation-contract.json
valuation_quantity: fair_value_per_share
valuation_display_semantics: distribution_percentiles
identity_path: companies/exm/identity.md
identity_hash: sha256:${"a".repeat(64)}
security_id: exm-common
listing_id: nasdaq-exm
status: draft
as_of: 2026-08-22
source_cutoff_at: 2026-08-22T20:00:00Z
currency: USD
reference_price: 10
reference_price_at: 2026-08-20T20:00:00Z
reference_price_source: public_market_data_source
target_bear: null
target_base: null
target_bull: null
primary_distribution_p10: 6
primary_distribution_p50: 12
primary_distribution_p90: 18
primary_distribution_mean: 12.5
target_horizon: 2027-08-20
distribution_method: example-v1
distribution_calibration_status: uncalibrated_shadow
distribution_seed: 1
distribution_sample_count: 100000
supersedes: null
---

# Valuation

[Valuation contract](2026-W34-valuation-contract.json)
`;

const decision = `---
type: decision
company: Example Corp
ticker: EXM
coverage_cycle_id: EXM-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
valuation_contract_path: ../valuation/2026-W34-valuation-contract.json
valuation_quantity: fair_value_per_share
valuation_display_semantics: distribution_percentiles
identity_path: companies/exm/identity.md
identity_hash: sha256:${"a".repeat(64)}
security_id: exm-common
listing_id: nasdaq-exm
research_cutoff: 2026-08-22T20:00:00Z
price: 10
price_at: 2026-08-20T20:00:00Z
price_source: public_market_data_source
target_horizon: 2027-08-20
thesis_path: companies/exm/thesis/2026-W34-final-report.md
valuation_path: companies/exm/valuation/2026-W34-valuation.md
supersedes: null
---

# Decision

[Valuation contract](../valuation/2026-W34-valuation-contract.json)
`;

const landing = `# Example Corp

- [Report](thesis/2026-W34-final-report.md)
- [Valuation](valuation/2026-W34-valuation.md)
- [Decision](decisions/2026-W34-decision.md)
- [Valuation contract](valuation/2026-W34-valuation-contract.json)
`;

const valuationContract = JSON.stringify(
  {
    type: "valuation_horizon_contract",
    schema_version: 1,
    coverage_cycle_id: "EXM-2026-W34-01",
    valuation_quantity: "fair_value_per_share",
    currency: "USD",
    as_of: "2026-08-22",
    source_cutoff_at: "2026-08-22T20:00:00Z",
    reference_price: 10,
    reference_price_at: "2026-08-20T20:00:00Z",
    reference_price_source: "public_market_data_source",
    primary_horizon: "2027-08-20",
    display_semantics: "distribution_percentiles",
    model: {
      version: "example-v1",
      method: "structured_elicitation",
      calibration_status: "uncalibrated_shadow",
      seed: 1,
      sample_count: 100000,
      code_path: "model.mjs",
      verifier_path: "verify.mjs",
    },
    horizons: [
      {
        id: "twelve_month",
        date: "2027-08-20",
        months_from_reference: 12,
        output_kind: "distribution",
        p10: 6,
        p50: 12,
        p90: 18,
        mean: 12.5,
        probability_below_reference: 0.35,
        probability_loss_30_pct: 0.15,
        probability_loss_50_pct: 0.05,
        bottom_decile_mean: 4.5,
      },
    ],
    horizon_relationship: {
      kind: "single",
      linkage_method: null,
      value_correlation_method: null,
      value_correlation: null,
      probability_later_above_earlier: null,
      transition_bands: [],
      sensitivity_note: null,
    },
  },
  null,
  2,
);

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "value-deep-dives-company-"));
  fixtureRoots.push(root);
  const company = join(root, "companies", "exm");
  const cycle = join(company, "coverage-cycles", "2026-W34-01-initial");
  for (const directory of [cycle, join(company, "thesis"), join(company, "valuation"), join(company, "decisions")]) {
    await mkdir(directory, { recursive: true });
  }
  await writeFile(join(cycle, "README.md"), manifest);
  await writeFile(join(company, "README.md"), landing);
  await writeFile(join(company, "thesis", "2026-W34-final-report.md"), report);
  await writeFile(join(company, "valuation", "2026-W34-valuation.md"), valuation);
  await writeFile(join(company, "valuation", "2026-W34-valuation-contract.json"), valuationContract);
  await writeFile(join(company, "valuation", "model.mjs"), modelSource);
  await writeFile(join(company, "valuation", "verify.mjs"), verifierSource);
  await writeFile(join(company, "decisions", "2026-W34-decision.md"), decision);
  return { root, company, cycle };
}

test("document front matter accepts simple arrays used by company records", () => {
  assert.deepEqual(parseDocumentFrontMatter(report).tags, ["internet", "advertising"]);
});

test("valuation table semantics keep narratives, percentiles, and completeness separate", () => {
  const mixed = `| Horizon | Downside / P10 | Central / P50 | Upside / P90 | Mean |
| --- | ---: | ---: | ---: | ---: |
| Six months | 4 | 7 | 11 | **Not modelled** |
`;
  const messages = valuationTableSemanticErrors(mixed).join("\n");
  assert.match(messages, /must not combine narrative scenarios/i);
  assert.match(messages, /must not contain.*unmodeled output/i);
  assert.deepEqual(
    valuationTableSemanticErrors(`| Horizon | P10 | P50 | P90 | Mean |
| --- | ---: | ---: | ---: | ---: |
| Six months | 4 | 7 | 11 | 7.5 |
`),
    [],
  );
});

test("valuation horizon contract rejects incomplete and undefined multi-horizon models", () => {
  const record = JSON.parse(valuationContract);
  record.horizons[0].mean = null;
  record.horizons[0].p10 = 11;
  record.horizons.push({
    ...record.horizons[0],
    id: "eighteen_month",
    date: "2028-02-20",
    months_from_reference: 18,
    mean: 14,
  });
  record.primary_horizon = "2028-02-20";
  const messages = validateValuationHorizonContract(record).join("\n");
  assert.match(messages, /horizons\[0\]\.mean must be non-negative/i);
  assert.match(messages, /probability below reference conflicts with P10/i);
  assert.match(messages, /multi-horizon contract must be joint or explicitly independent/i);
});

test("joint horizon contract rejects ambiguous dependence and malformed transition bands", async () => {
  const contractPath = join(
    repositoryRoot,
    "companies",
    "snap",
    "valuation",
    "2026-W34-valuation-contract.json",
  );
  const record = JSON.parse(await readFile(contractPath, "utf8"));
  record.horizon_relationship.value_correlation_method = null;
  record.horizon_relationship.transition_bands[1].earlier_band_upper_probability = 0.25;
  record.horizon_relationship.transition_bands[0].earlier_band_sample_probability = 0.30;
  const messages = validateValuationHorizonContract(record).join("\n");
  assert.match(messages, /declared value_correlation_method/i);
  assert.match(messages, /strictly increasing earlier_band_upper_probability/i);
  assert.match(messages, /sample probabilities must be positive and sum to 1/i);
});

test("historical SNAP and WIX coverage cycles remain compatible", async () => {
  for (const ticker of ["snap", "wix"]) {
    const result = await validateCoverageCycles(repositoryRoot, `companies/${ticker}`);
    assert.equal(result.valid, true, JSON.stringify(result.findings, null, 2));
    assert.ok(result.cycles.some(({ cycleId }) => cycleId.startsWith(`${ticker.toUpperCase()}-`)));
  }
});

test("coverage-cycle validation accepts one aligned canonical trio", async () => {
  const { root } = await fixture();
  const result = await validateCoverageCycles(root);
  assert.equal(result.valid, true, JSON.stringify(result.findings, null, 2));
});

test("coverage-cycle validation rejects a second same-cycle report", async () => {
  const { root, company } = await fixture();
  await writeFile(join(company, "thesis", "working-copy.md"), report.replace("# Report", "# Working copy"));
  const result = await validateCoverageCycles(root);
  assert.equal(result.valid, false);
  assert.match(result.findings.map(({ message }) => message).join("\n"), /exactly one report.*found 2/i);
});

test("coverage-cycle validation rejects same-cycle supersession and stale navigation", async () => {
  const { root, company } = await fixture();
  await writeFile(
    join(company, "decisions", "2026-W34-decision.md"),
    decision.replace("supersedes: null", "supersedes: ../thesis/2026-W34-final-report.md"),
  );
  await writeFile(
    join(company, "README.md"),
    `${landing}\n- [Obsolete draft](thesis/2026-08-20-initial-thesis.md)\n`,
  );
  const result = await validateCoverageCycles(root);
  assert.equal(result.valid, false);
  const messages = result.findings.map(({ message }) => message).join("\n");
  assert.match(messages, /must not supersede.*same coverage cycle/i);
  assert.match(messages, /Broken local link: thesis\/2026-08-20-initial-thesis.md/);
});

test("coverage-cycle validation rejects cutoff drift", async () => {
  const { root, company } = await fixture();
  await writeFile(
    join(company, "valuation", "2026-W34-valuation.md"),
    valuation.replace("2026-08-22T20:00:00Z", "2026-08-22T21:00:00Z"),
  );
  const result = await validateCoverageCycles(root);
  assert.equal(result.valid, false);
  assert.match(result.findings.map(({ message }) => message).join("\n"), /source cutoff must agree/i);
});

test("coverage-cycle validation rejects contract drift and premature release-ready claims", async () => {
  const { root, company, cycle } = await fixture();
  await writeFile(
    join(company, "valuation", "2026-W34-valuation.md"),
    valuation.replace("primary_distribution_p50: 12", "primary_distribution_p50: 13"),
  );
  const manifestPath = join(cycle, "README.md");
  await writeFile(
    manifestPath,
    `${await readFile(manifestPath, "utf8")}\nDraft, release-ready.\n`,
  );
  const result = await validateCoverageCycles(root);
  assert.equal(result.valid, false);
  const messages = result.findings.map(({ message }) => message).join("\n");
  assert.match(messages, /primary_distribution_p50 must equal the valuation contract value 12/i);
  assert.match(messages, /must not be described as release-ready/i);
});

test("finalized cycles require and verify artifact and review hashes", async () => {
  const { root, cycle } = await fixture();
  const manifestPath = join(cycle, "README.md");
  const text = await readFile(manifestPath, "utf8");
  await writeFile(
    manifestPath,
    text
      .replace("status: active", "status: complete")
      .replace("research_status: draft", "research_status: published")
      .replace("review_status: not_requested", "review_status: passed")
      .replace("tags: [internet, advertising]", `finalized_at: 2026-08-23T10:00:00Z
reviewed_at: 2026-08-23T09:00:00Z
final_report_hash: sha256:${"f".repeat(64)}
valuation_hash: sha256:${"f".repeat(64)}
decision_hash: sha256:${"f".repeat(64)}
valuation_contract_hash: sha256:${"f".repeat(64)}
model_hash: sha256:${"f".repeat(64)}
verifier_hash: sha256:${"f".repeat(64)}
review_path: ../../review.md
review_hash: sha256:${"f".repeat(64)}
tags: [internet, advertising]`),
  );
  const result = await validateCoverageCycles(root);
  assert.equal(result.valid, false);
  const messages = result.findings.map(({ message }) => message).join("\n");
  assert.match(messages, /final_report_hash.*hashes to/i);
  assert.match(messages, /review_path must reference an existing file/i);
});

async function passedFixture() {
  const { root, company, cycle } = await fixture();
  const publishedReport = report.replace("research_status: draft", "research_status: published");
  const publishedValuation = valuation.replace("status: draft", "status: published");
  await writeFile(join(company, "thesis", "2026-W34-final-report.md"), publishedReport);
  await writeFile(join(company, "valuation", "2026-W34-valuation.md"), publishedValuation);

  const reviewedAt = "2026-08-23T09:00:00Z";
  const artifactHashes = {
    final_report_hash: sha256(publishedReport),
    valuation_hash: sha256(publishedValuation),
    decision_hash: sha256(decision),
    valuation_contract_hash: sha256(valuationContract),
    model_hash: sha256(modelSource),
    verifier_hash: sha256(verifierSource),
  };
  const review = `---
type: independent_review
company: Example Corp
ticker: EXM
coverage_cycle_id: EXM-2026-W34-01
review_status: passed
reviewed_at: ${reviewedAt}
reviewer_independence: independent_agent
reviewed_final_report_hash: ${artifactHashes.final_report_hash}
reviewed_valuation_hash: ${artifactHashes.valuation_hash}
reviewed_decision_hash: ${artifactHashes.decision_hash}
reviewed_contract_hash: ${artifactHashes.valuation_contract_hash}
reviewed_model_hash: ${artifactHashes.model_hash}
reviewed_verifier_hash: ${artifactHashes.verifier_hash}
---

# Independent review

The exact snapshot passed adversarial review.
`;
  await writeFile(join(company, "review.md"), review);

  const manifestPath = join(cycle, "README.md");
  const manifestText = await readFile(manifestPath, "utf8");
  const finalizedManifest = manifestText
    .replace("status: active", "status: complete")
    .replace("research_status: draft", "research_status: published")
    .replace("review_status: not_requested", "review_status: passed")
    .replace("tags: [internet, advertising]", `finalized_at: 2026-08-23T10:00:00Z
reviewed_at: ${reviewedAt}
final_report_hash: ${artifactHashes.final_report_hash}
valuation_hash: ${artifactHashes.valuation_hash}
decision_hash: ${artifactHashes.decision_hash}
valuation_contract_hash: ${artifactHashes.valuation_contract_hash}
model_hash: ${artifactHashes.model_hash}
verifier_hash: ${artifactHashes.verifier_hash}
review_path: ../../review.md
review_hash: ${sha256(review)}
tags: [internet, advertising]`);
  await writeFile(manifestPath, finalizedManifest);

  return { root, company, cycle };
}

test("a passed independent review binds the exact canonical and executable snapshot", async () => {
  const { root, company } = await passedFixture();
  const result = await validateCoverageCycles(root);
  assert.equal(result.valid, true, JSON.stringify(result.findings, null, 2));
  assert.ok(result.findings.some(({ check }) => check === "coverage-cycle-review-legacy"));

  await writeFile(join(company, "valuation", "model.mjs"), `${modelSource}// material edit\n`);
  const changed = await validateCoverageCycles(root);
  assert.equal(changed.valid, false);
  assert.match(
    changed.findings.map(({ message }) => message).join("\n"),
    /model_hash.*hashes to/i,
  );
});

async function dependencyFixture() {
  const context = await passedFixture();
  const { company, cycle } = context;
  const inputs = '{"completion_capex":28}\n';
  const evidence = "# Evidence\nThe completion cost is an analyst assumption.\n";
  await writeFile(join(company, "valuation", "model-inputs.json"), inputs);
  await writeFile(join(company, "sources.md"), evidence);
  context.artifactPath = join(cycle, "review-artifacts.json");
  context.artifacts = {
    type: "review_artifact_manifest",
    schema_version: 1,
    coverage_cycle_id: "EXM-2026-W34-01",
    source_cutoff_at: "2026-08-22T20:00:00Z",
    artifacts: [
      { path: "../../valuation/model-inputs.json", role: "model_input", sha256: sha256(inputs) },
      { path: "companies/exm/sources.md", role: "evidence", sha256: sha256(evidence) },
    ],
  };
  await bindDependencySnapshot(context);
  return context;
}

async function bindDependencySnapshot({ company, cycle, artifactPath, artifacts }) {
  const content = `${JSON.stringify(artifacts, null, 2)}\n`;
  await writeFile(artifactPath, content);
  const reviewPath = join(company, "review.md");
  const reviewText = (await readFile(reviewPath, "utf8"))
    .replace(/^reviewed_artifact_manifest_hash:.*\n/m, "")
    .replace("review_status: passed", `review_status: passed\nreviewed_artifact_manifest_hash: ${sha256(content)}`);
  await writeFile(reviewPath, reviewText);
  const cyclePath = join(cycle, "README.md");
  const cycleText = (await readFile(cyclePath, "utf8"))
    .replace(/^review_(?:contract_version|artifact_manifest_path|artifact_manifest_hash):.*\n/gm, "")
    .replace("review_status: passed", `review_status: passed\nreview_contract_version: 2\nreview_artifact_manifest_path: review-artifacts.json\nreview_artifact_manifest_hash: ${sha256(content)}`)
    .replace(/^review_hash:.*$/m, `review_hash: ${sha256(reviewText)}`);
  await writeFile(cyclePath, cycleText);
}

test("v2 is required at passed review, while unfinished v2 drafts can await their snapshot", async () => {
  for (const build of [fixture, passedFixture]) {
    const { root, cycle } = await build();
    const cyclePath = join(cycle, "README.md");
    await writeFile(cyclePath, (await readFile(cyclePath, "utf8")).replace("cycle_number: 1", "cycle_number: 1\nreview_contract_version: 2"));
    const result = await validateCoverageCycles(root);
    assert.equal(result.valid, build === fixture, JSON.stringify(result.findings, null, 2));
    if (build === passedFixture) assert.match(JSON.stringify(result.findings), /Missing required field: review_artifact_manifest_path/);
  }
});

test("v2 detects changed external inputs and evidence while canonical files remain identical", async () => {
  for (const file of ["valuation/model-inputs.json", "sources.md"]) {
    const { root, company } = await dependencyFixture();
    const fresh = await validateCoverageCycles(root);
    assert.equal(fresh.valid, true, JSON.stringify(fresh.findings, null, 2));
    assert.ok(!fresh.findings.some(({ check }) => check === "coverage-cycle-review-legacy"));
    const path = join(company, file);
    await writeFile(path, `${await readFile(path, "utf8")}Material revision.\n`);
    const changed = await validateCoverageCycles(root);
    assert.equal(changed.valid, false);
    assert.match(JSON.stringify(changed.findings), /changed after review/);
  }
});

test("editing a dependency manifest requires a fresh reviewer binding as well as an owner hash", async () => {
  const context = await dependencyFixture();
  context.artifacts.artifacts.push({ path: "../../valuation/model.mjs", role: "model_dependency", sha256: sha256(modelSource) });
  const updated = `${JSON.stringify(context.artifacts, null, 2)}\n`;
  await writeFile(context.artifactPath, updated);
  let result = await validateCoverageCycles(context.root);
  assert.equal(result.valid, false);
  assert.match(JSON.stringify(result.findings), /review_artifact_manifest_hash does not match/);
  const cyclePath = join(context.cycle, "README.md");
  await writeFile(cyclePath, (await readFile(cyclePath, "utf8")).replace(/^review_artifact_manifest_hash:.*$/m, `review_artifact_manifest_hash: ${sha256(updated)}`));
  result = await validateCoverageCycles(context.root);
  assert.equal(result.valid, false);
  assert.match(JSON.stringify(result.findings), /reviewed_artifact_manifest_hash must match/);
});

test("artifact manifests reject missing files, unknown roles, duplicate aliases, and cutoff drift", async () => {
  const mutations = [
    ["missing file", (record) => { record.artifacts[0].path = "missing.json"; }, /must reference a file/],
    ["unknown role", (record) => { record.artifacts[0].role = "data"; }, /supported role/],
    ["duplicate alias", (record) => { record.artifacts.push({ ...record.artifacts[0], path: "companies/exm/valuation/model-inputs.json" }); }, /duplicates another artifact/],
    ["cutoff", (record) => { record.source_cutoff_at = "2026-08-23T20:00:00Z"; }, /source_cutoff_at must match/],
    ["cycle", (record) => { record.coverage_cycle_id = "OTHER-2026-W34-01"; }, /coverage_cycle_id must match/],
    ["unknown field", (record) => { record.artifacts[0].digest = record.artifacts[0].sha256; }, /no unknown fields/],
  ];
  for (const [name, mutate, expected] of mutations) {
    const context = await dependencyFixture();
    mutate(context.artifacts);
    await bindDependencySnapshot(context);
    const result = await validateCoverageCycles(context.root);
    assert.equal(result.valid, false, name);
    assert.match(JSON.stringify(result.findings), expected, name);
  }
});

test("artifact manifests reject traversal and symlink escapes without reading outside the company", async () => {
  for (const path of ["../../../../outside.json", "../../valuation/escape.json", "../../.local/private.json"]) {
    const context = await dependencyFixture();
    await writeFile(join(context.root, "outside.json"), "outside\n");
    await symlink(join(context.root, "outside.json"), join(context.company, "valuation", "escape.json"));
    context.artifacts.artifacts[0] = { path, role: "model_input", sha256: sha256("outside\n") };
    await bindDependencySnapshot(context);
    const result = await validateCoverageCycles(context.root);
    assert.equal(result.valid, false);
    assert.match(JSON.stringify(result.findings), /escaping symlinks/);
  }
});

test("a manifest path itself cannot escape through a symlink", async () => {
  const context = await dependencyFixture();
  const content = await readFile(context.artifactPath);
  await rm(context.artifactPath);
  const outside = join(context.root, "outside-manifest.json");
  await writeFile(outside, content);
  await symlink(outside, context.artifactPath);
  const result = await validateCoverageCycles(context.root);
  assert.equal(result.valid, false);
  assert.match(JSON.stringify(result.findings), /review_artifact_manifest_path must reference/);
});

test("artifact manifests reject existing authentication and private files even with matching hashes", async () => {
  for (const privatePath of [".auth/cookies.json", "private/note.md", "valuation/storage-state.json", "valuation/capture.har"]) {
    const context = await dependencyFixture();
    const file = join(context.company, privatePath);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, "synthetic fixture only\n");
    context.artifacts.artifacts[0] = {
      path: `companies/exm/${privatePath}`, role: "model_input", sha256: sha256("synthetic fixture only\n"),
    };
    await bindDependencySnapshot(context);
    const result = await validateCoverageCycles(context.root);
    assert.equal(result.valid, false, privatePath);
    assert.match(JSON.stringify(result.findings), /local\/private paths/);
  }
});

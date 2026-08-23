import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { parseDocumentFrontMatter, validateCoverageCycles } from "./lib/company-cycle.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));

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
forecast_path: null
tags: [internet, advertising]
---

# Example cycle

- [Report](../../thesis/2026-W34-final-report.md)
- [Valuation](../../valuation/2026-W34-valuation.md)
- [Decision](../../decisions/2026-W34-decision.md)
`;

const report = `---
type: company_thesis
company: Example Corp
ticker: EXM
coverage_cycle_id: EXM-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
identity_path: companies/exm/identity.md
identity_hash: sha256:${"a".repeat(64)}
security_id: exm-common
listing_id: nasdaq-exm
research_status: draft
source_cutoff_at: 2026-08-22T20:00:00Z
supersedes: null
tags: [internet, advertising]
---

# Report

[Valuation](../valuation/2026-W34-valuation.md)
`;

const valuation = `---
type: valuation
company: Example Corp
ticker: EXM
coverage_cycle_id: EXM-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
identity_path: companies/exm/identity.md
identity_hash: sha256:${"a".repeat(64)}
security_id: exm-common
listing_id: nasdaq-exm
status: draft
source_cutoff_at: 2026-08-22T20:00:00Z
supersedes: null
---

# Valuation
`;

const decision = `---
type: decision
company: Example Corp
ticker: EXM
coverage_cycle_id: EXM-2026-W34-01
coverage_cycle_path: ../coverage-cycles/2026-W34-01-initial/README.md
identity_path: companies/exm/identity.md
identity_hash: sha256:${"a".repeat(64)}
security_id: exm-common
listing_id: nasdaq-exm
research_cutoff: 2026-08-22T20:00:00Z
thesis_path: companies/exm/thesis/2026-W34-final-report.md
valuation_path: companies/exm/valuation/2026-W34-valuation.md
supersedes: null
---

# Decision
`;

const landing = `# Example Corp

- [Report](thesis/2026-W34-final-report.md)
- [Valuation](valuation/2026-W34-valuation.md)
- [Decision](decisions/2026-W34-decision.md)
`;

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "value-deep-dives-company-"));
  const company = join(root, "companies", "exm");
  const cycle = join(company, "coverage-cycles", "2026-W34-01-initial");
  for (const directory of [cycle, join(company, "thesis"), join(company, "valuation"), join(company, "decisions")]) {
    await mkdir(directory, { recursive: true });
  }
  await writeFile(join(cycle, "README.md"), manifest);
  await writeFile(join(company, "README.md"), landing);
  await writeFile(join(company, "thesis", "2026-W34-final-report.md"), report);
  await writeFile(join(company, "valuation", "2026-W34-valuation.md"), valuation);
  await writeFile(join(company, "decisions", "2026-W34-decision.md"), decision);
  return { root, company, cycle };
}

test("document front matter accepts simple arrays used by company records", () => {
  assert.deepEqual(parseDocumentFrontMatter(report).tags, ["internet", "advertising"]);
});

test("current repository coverage cycles pass the canonical contract", async () => {
  const result = await validateCoverageCycles(repositoryRoot);
  assert.equal(result.valid, true, JSON.stringify(result.findings, null, 2));
  assert.equal(result.cycleCount, 1);
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

test("finalized cycles require and verify artifact and review hashes", async () => {
  const { root, cycle } = await fixture();
  const manifestPath = join(cycle, "README.md");
  const text = await readFile(manifestPath, "utf8");
  await writeFile(
    manifestPath,
    text
      .replace("status: active", "status: complete")
      .replace("research_status: draft", "research_status: published")
      .replace("tags: [internet, advertising]", `finalized_at: 2026-08-23T10:00:00Z
final_report_hash: sha256:${"f".repeat(64)}
valuation_hash: sha256:${"f".repeat(64)}
decision_hash: sha256:${"f".repeat(64)}
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

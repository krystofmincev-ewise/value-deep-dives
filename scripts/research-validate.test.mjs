import assert from "node:assert/strict";
import { test } from "node:test";
import { cp, mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  findForbiddenBillingMarkers,
  parseSkillFrontMatter,
  validateRepository,
} from "./research-validate.mjs";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));

test("skill front matter parsing preserves quoted descriptions", () => {
  const parsed = parseSkillFrontMatter(`---
name: example-skill
description: "Use this skill for a bounded example workflow."
---

# Example
`);

  assert.deepEqual(parsed, {
    name: "example-skill",
    description: "Use this skill for a bounded example workflow.",
  });
});

test("billing marker detection rejects separately credentialed API routes", () => {
  const findings = findForbiddenBillingMarkers([
    { path: "safe.mjs", text: "fetch('https://clinicaltrials.gov/api/v2/studies')" },
    { path: "billed.mjs", text: "const key = process.env.GEMINI_API_KEY" },
  ]);

  assert.deepEqual(findings, [{ path: "billed.mjs", marker: "GEMINI_API_KEY" }]);
});

test("repository validator checks every skill, schema, route, and billing boundary", async (context) => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "value-deep-dives-validation-"));
  context.after(() => rm(fixtureRoot, { recursive: true, force: true }));
  // Exercise the current harness with named historical dossiers. Concurrent draft
  // company directories belong to release validation, not this unit-test fixture.
  const fixturePaths = [
    ".agents", ".gitignore", "AGENTS.md", "DATA_POLICY.md", "package.json",
    "methodology", "schemas", "scripts", "templates", "track-record",
    "companies/snap", "companies/wix",
  ];
  for (const path of fixturePaths) {
    await cp(join(repositoryRoot, path), join(fixtureRoot, path), { recursive: true });
  }
  const expectedSkills = (await readdir(join(fixtureRoot, ".agents", "skills"), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const expectedSchemas = (await readdir(join(fixtureRoot, "schemas"))).filter((name) => name.endsWith(".json"));
  const report = await validateRepository(fixtureRoot);

  assert.equal(report.valid, true, JSON.stringify(report.findings, null, 2));
  assert.ok(expectedSkills.includes("company-investment-research"));
  assert.equal(report.counts.skills, expectedSkills.length);
  assert.equal(report.counts.schemas, expectedSchemas.length);
  assert.equal(report.counts.coverageCycles, 2);
  assert.ok(report.counts.runtimeScripts >= 7);
  assert.equal(report.findings.filter(({ level }) => level === "error").length, 0);
  assert.ok(report.findings.some(({ check }) => check === "authenticated-session"));

  await rm(join(fixtureRoot, ".agents", "skills", "company-investment-research", "SKILL.md"));
  const broken = await validateRepository(fixtureRoot);
  assert.equal(broken.valid, false);
  assert.ok(broken.findings.some(({ level, check, message }) => level === "error" && check === "skill" && message === "Missing SKILL.md."));
});

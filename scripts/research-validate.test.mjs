import assert from "node:assert/strict";
import { test } from "node:test";
import { dirname } from "node:path";
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

test("repository validator checks every skill, schema, route, and billing boundary", async () => {
  const report = await validateRepository(repositoryRoot);

  assert.equal(report.valid, true, JSON.stringify(report.findings, null, 2));
  assert.equal(report.counts.skills, 9);
  assert.ok(report.counts.schemas >= 13);
  assert.ok(report.counts.runtimeScripts >= 7);
  assert.equal(report.findings.filter(({ level }) => level === "error").length, 0);
  assert.ok(report.findings.some(({ check }) => check === "authenticated-session"));
});

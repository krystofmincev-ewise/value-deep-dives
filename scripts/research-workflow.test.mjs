import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = join(scriptDirectory, "research-workflow.mjs");

function runCli(argumentsList) {
  return spawnSync(process.execPath, [cliPath, ...argumentsList], { encoding: "utf8" });
}

test("Gemini workflow stays on the signed-in subscription UI", () => {
  const result = runCli(["gemini", "--prompt", "Research Snap advertising", "--json"]);

  assert.equal(result.status, 0);
  const workflow = JSON.parse(result.stdout);
  assert.equal(workflow.skill, "$gemini-deep-research");
  assert.equal(workflow.launch.kind, "claim-verified-tab");
  assert.equal(workflow.launch.openSupported, false);
  assert.match(workflow.access.billing, /Existing Gemini subscription/);
  assert.ok(workflow.uiContract.actions.some(({ id }) => id === "activate_pro_if_needed"));
  assert.ok(workflow.uiContract.actions.some(({ id }) => id === "start_research"));
  const proAction = workflow.uiContract.actions.find(({ id }) => id === "activate_pro_if_needed");
  assert.match(proAction.sequence[1].locator.name, /Pro Advanced reasoning/);
});

test("Gemini plan-only workflow stops before Start research", () => {
  const result = runCli([
    "gemini",
    "--prompt",
    "Research Snap advertising",
    "--plan-only",
    "--json",
  ]);

  assert.equal(result.status, 0);
  const workflow = JSON.parse(result.stdout);
  assert.equal(workflow.mode, "plan_only");
  assert.ok(!workflow.uiContract.actions.some(({ id }) => id === "start_research"));
});

test("Gemini refuses generic Chrome launching", () => {
  const result = runCli([
    "gemini",
    "--prompt",
    "Research Snap advertising",
    "--open",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /signed-in subscription tab/);
});

test("Revelio workflow renders reproducible aggregate filters", () => {
  const result = runCli([
    "revelio",
    "--company",
    "Snap Inc",
    "--question",
    "Is engineering hiring accelerating?",
    "--peers",
    "Meta,Pinterest,Meta",
    "--functions",
    "Engineering",
    "--date-from",
    "2025-01-01",
    "--date-to",
    "2026-06-30",
    "--json",
  ]);

  assert.equal(result.status, 0);
  const workflow = JSON.parse(result.stdout);
  assert.deepEqual(workflow.inputs.peers, ["Meta", "Pinterest"]);
  assert.match(workflow.inputs.renderedPrompt, /aggregate company-level data only/);
  assert.match(workflow.inputs.renderedPrompt, /new hires, hiring rate, workforce growth/);
  assert.match(workflow.inputs.renderedPrompt, /2025-01-01 to 2026-06-30/);
  assert.match(workflow.analysisPlan.comparisonDesign.peers, /absolute and percentage/);
  assert.ok(workflow.analysisPlan.alternativeExplanations.length >= 3);
  assert.equal(workflow.launch.url, "https://dashboard.reveliolabs.com/");
  assert.match(workflow.access.billing, /Existing authorized Revelio access/);
  const revelioCheckpoint = workflow.uiContract.checkpoints.find(
    ({ id }) => id === "signed_in_ai_chat",
  );
  assert.deepEqual(
    revelioCheckpoint.required.map(({ role }) => role),
    ["textbox", "button"],
  );
  assert.equal(revelioCheckpoint.optional[0].role, "heading");
});

test("YouTube workflow encodes search and records transcript selectors", () => {
  const result = runCli([
    "youtube",
    "--query",
    "Snap Evan Spiegel interview",
    "--channels",
    "20VC,Sequoia",
    "--max-videos",
    "4",
    "--json",
  ]);

  assert.equal(result.status, 0);
  const workflow = JSON.parse(result.stdout);
  assert.equal(
    new URL(workflow.launch.url).searchParams.get("search_query"),
    "Snap Evan Spiegel interview 20VC Sequoia",
  );
  assert.equal(workflow.inputs.maximumVideos, 4);
  assert.equal(
    workflow.uiContract.transcript.segments[0].selector,
    "transcript-segment-view-model",
  );
  assert.match(workflow.selectionPlan.postFilters.channels, /exact uploader-channel match/);
  assert.match(workflow.access.billing, /Existing YouTube Premium session/);
  assert.ok(workflow.selectionPlan.expectedEvidenceFields.includes("timestamp"));
  assert.ok(workflow.uiContract.actions.some(({ id }) => id === "open_transcript"));
});

test("YouTube plan-only workflow never opens Chrome or requests UI actions", () => {
  const result = runCli([
    "youtube",
    "--query",
    "Snap Evan Spiegel interview",
    "--plan-only",
    "--json",
  ]);

  assert.equal(result.status, 0);
  const workflow = JSON.parse(result.stdout);
  assert.equal(workflow.mode, "plan_only");
  assert.equal(workflow.launch.opened, false);
  assert.deepEqual(workflow.uiContract.actions, []);
  assert.ok(workflow.selectionPlan.rubric.length >= 4);
  assert.ok(workflow.selectionPlan.expectedEvidenceFields.includes("verificationStatus"));
});

test("workflow limits and dates fail closed", () => {
  const excessiveVideos = runCli([
    "youtube",
    "--query",
    "Snap interview",
    "--max-videos",
    "11",
  ]);
  const reversedDates = runCli([
    "revelio",
    "--company",
    "Snap",
    "--question",
    "Hiring trend?",
    "--date-from",
    "2026-02-01",
    "--date-to",
    "2026-01-01",
  ]);
  const invalidDate = runCli([
    "youtube",
    "--query",
    "Snap interview",
    "--date-from",
    "2026-02-30",
  ]);

  assert.equal(excessiveVideos.status, 1);
  assert.match(excessiveVideos.stderr, /at most 10/);
  assert.equal(reversedDates.status, 1);
  assert.match(reversedDates.stderr, /must not be later/);
  assert.equal(invalidDate.status, 1);
  assert.match(invalidDate.stderr, /valid calendar date/);
});

test("service-specific and plan-only options reject unsafe ambiguity", () => {
  const wrongOption = runCli([
    "gemini",
    "--prompt",
    "Research Snap",
    "--max-videos",
    "3",
  ]);
  const planAndOpen = runCli([
    "youtube",
    "--query",
    "Snap interview",
    "--plan-only",
    "--open",
  ]);

  assert.equal(wrongOption.status, 1);
  assert.match(wrongOption.stderr, /not supported for gemini/);
  assert.equal(planAndOpen.status, 1);
  assert.match(planAndOpen.stderr, /does not open Chrome/);
});

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = join(scriptDirectory, "research-browser.mjs");

function runCli(argumentsList) {
  return spawnSync(process.execPath, [cliPath, ...argumentsList], {
    encoding: "utf8",
  });
}

test("browser route inventory covers the requested research services", () => {
  const result = runCli(["list", "--json"]);

  assert.equal(result.status, 0);
  const routeIds = JSON.parse(result.stdout).map(({ id }) => id);
  assert.deepEqual(routeIds, [
    "gemini",
    "revelio",
    "youtube",
    "finance",
    "ft",
    "semianalysis",
    "sec",
    "ir",
  ]);
});

test("dry-run opens no browser and safely encodes a YouTube query", () => {
  const result = runCli([
    "open",
    "youtube",
    "--query",
    "Evan Spiegel 20VC & Snap",
    "--dry-run",
    "--json",
  ]);

  assert.equal(result.status, 0);
  const [route] = JSON.parse(result.stdout);
  assert.equal(route.id, "youtube");
  assert.equal(
    new URL(route.url).searchParams.get("search_query"),
    "Evan Spiegel 20VC & Snap",
  );
});

test("company workspace produces one URL per research route", () => {
  const result = runCli([
    "workspace",
    "--company",
    "Snap Inc",
    "--ticker",
    "SNAP",
    "--json",
  ]);

  assert.equal(result.status, 0);
  const routes = JSON.parse(result.stdout);
  assert.equal(routes.length, 8);
  assert.ok(routes.every(({ url }) => URL.canParse(url)));
  assert.ok(routes.every(({ query }) => query === "Snap Inc SNAP"));
  assert.match(routes.find(({ id }) => id === "sec").url, /\/edgar\/search\/#\/q=/);
});

test("company workspace can preview only the requested sources", () => {
  const result = runCli([
    "workspace",
    "--company",
    "Snap Inc",
    "--sources",
    "youtube,revelio,sec,youtube",
    "--json",
  ]);

  assert.equal(result.status, 0);
  assert.deepEqual(
    JSON.parse(result.stdout).map(({ id }) => id),
    ["youtube", "revelio", "sec"],
  );
});

test("company workspace rejects unknown source filters", () => {
  const result = runCli([
    "workspace",
    "--company",
    "Snap Inc",
    "--sources",
    "youtube,unknown",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown workspace source: unknown/);
});

test("workspace opening requires an explicit least-access source list", () => {
  const result = runCli(["workspace", "--company", "Snap Inc", "--open"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--open requires an explicit --sources list/);
});

test("Gemini launching is delegated to the account-safe skill", () => {
  const result = runCli(["open", "gemini"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /\$gemini-deep-research/);
});

test("company workspace requires an explicit company", () => {
  const result = runCli(["workspace", "--dry-run"]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--company is required/);
});

test("value-bearing browser options reject missing values", () => {
  const missingQuery = runCli(["open", "youtube", "--query", "--dry-run"]);
  const missingTicker = runCli([
    "workspace",
    "--company",
    "Snap Inc",
    "--ticker",
    "--dry-run",
  ]);

  assert.equal(missingQuery.status, 1);
  assert.match(missingQuery.stderr, /--query requires a value/);
  assert.equal(missingTicker.status, 1);
  assert.match(missingTicker.stderr, /--ticker requires a value/);
});

test("authenticated UI routes hand off to repository-local skills", () => {
  const result = runCli(["list", "--json"]);

  assert.equal(result.status, 0);
  const routes = JSON.parse(result.stdout);
  assert.match(routes.find(({ id }) => id === "gemini").next, /\$gemini-deep-research/);
  assert.match(routes.find(({ id }) => id === "revelio").next, /\$revelio-workforce-research/);
  assert.match(routes.find(({ id }) => id === "youtube").next, /\$youtube-interview-research/);
  assert.match(routes.find(({ id }) => id === "ft").next, /\$ft-source-discovery/);
});

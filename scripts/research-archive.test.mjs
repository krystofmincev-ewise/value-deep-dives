import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildArchiveLookupUrl,
  normalizeArchiveOrigin,
  normalizeSourceUrl,
} from "./research-archive.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = join(scriptDirectory, "research-archive.mjs");

function runCli(argumentsList) {
  return spawnSync(process.execPath, [cliPath, ...argumentsList], {
    encoding: "utf8",
  });
}

test("archive route matches the Archive News extension and removes fragments", () => {
  const source = "https://www.ft.com/content/example?segment=1#comments";

  assert.equal(
    buildArchiveLookupUrl(source),
    "https://archive.ph/https://www.ft.com/content/example?segment=1",
  );
});

test("archive aliases are explicit and limited to extension-supported origins", () => {
  assert.equal(normalizeArchiveOrigin("archive.is"), "https://archive.is");
  assert.throws(() => normalizeArchiveOrigin("example.com"), /Unsupported archive origin/);
});

test("existing archive URLs are not wrapped again", () => {
  assert.equal(
    buildArchiveLookupUrl("https://archive.ph/abcde#ignored"),
    "https://archive.ph/abcde",
  );
});

test("source URL validation rejects non-web and credential-bearing URLs", () => {
  assert.throws(() => normalizeSourceUrl("file:///tmp/source"), /absolute HTTP\(S\)/);
  assert.throws(
    () => normalizeSourceUrl("https://user:secret@example.com/article"),
    /containing credentials/,
  );
});

test("route command emits machine-readable handoff data", () => {
  const result = runCli([
    "route",
    "https://www.ft.com/content/example?segment=1#comments",
    "--json",
  ]);

  assert.equal(result.status, 0);
  const handoff = JSON.parse(result.stdout);
  assert.equal(handoff.sourceUrl, "https://www.ft.com/content/example?segment=1");
  assert.equal(
    handoff.archiveUrl,
    "https://archive.ph/https://www.ft.com/content/example?segment=1",
  );
  assert.equal(handoff.mode, "direct");
  assert.equal(handoff.opened, false);
});

test("direct and extension dry runs expose the intended Chrome URL", () => {
  const source = "https://www.ft.com/content/example";
  const direct = runCli(["open", source, "--dry-run", "--json"]);
  const extension = runCli(["open-extension", source, "--dry-run", "--json"]);

  assert.equal(direct.status, 0);
  assert.equal(extension.status, 0);
  assert.equal(JSON.parse(direct.stdout).openUrl, `https://archive.ph/${source}`);
  assert.equal(JSON.parse(extension.stdout).openUrl, source);
  assert.equal(JSON.parse(extension.stdout).mode, "extension");
});

test("CLI rejects ambiguous and malformed inputs", () => {
  const missingOrigin = runCli([
    "route",
    "https://www.ft.com/content/example",
    "--origin",
  ]);
  const extraUrl = runCli([
    "route",
    "https://www.ft.com/content/one",
    "https://www.ft.com/content/two",
  ]);
  const unknownOption = runCli([
    "route",
    "https://www.ft.com/content/example",
    "--profile",
    "private",
  ]);
  const extensionOrigin = runCli([
    "open-extension",
    "https://www.ft.com/content/example",
    "--origin",
    "archive.is",
    "--dry-run",
  ]);

  assert.equal(missingOrigin.status, 1);
  assert.match(missingOrigin.stderr, /--origin requires a value/);
  assert.equal(extraUrl.status, 1);
  assert.match(extraUrl.stderr, /exactly one source URL/);
  assert.equal(unknownOption.status, 1);
  assert.match(unknownOption.stderr, /Unknown option/);
  assert.equal(extensionOrigin.status, 1);
  assert.match(extensionOrigin.stderr, /cannot control the Archive News extension/);
});

#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const defaultArchiveOrigin = "https://archive.ph";
const supportedArchiveOrigins = new Set([
  "https://archive.ph",
  "https://archive.is",
  "https://archive.li",
]);
const archiveHostnames = new Set([
  "archive.is",
  "archive.li",
  "archive.md",
  "archive.ph",
  "archive.today",
  "archive.vn",
]);

function printHelp() {
  console.log(`Archive.ph research handoff

Usage:
  node scripts/research-archive.mjs route <url> [--origin archive.ph] [--json]
  node scripts/research-archive.mjs open <url> [--origin archive.ph] [--dry-run] [--json]
  node scripts/research-archive.mjs open-extension <url> [--origin archive.ph] [--dry-run] [--json]

Commands:
  route           Print the archive lookup URL without opening Chrome.
  open            Open the archive lookup URL directly in Chrome (recommended).
  open-extension  Open the publisher URL and let the installed Archive News extension redirect it.

The CLI never reads Chrome profiles, cookies, credentials, or extension storage. It opens
one ordinary URL; use $archive-ph-research to inspect the resulting tab and capture focused notes.`);
}

function parseOptions(argumentsList) {
  const positionals = [];
  const options = new Map();
  const booleanOptions = new Set(["dry-run", "help", "json"]);
  const valueOptions = new Set(["origin"]);

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (!argument.startsWith("--")) {
      positionals.push(argument);
      continue;
    }

    const name = argument.slice(2);
    if (booleanOptions.has(name)) {
      options.set(name, true);
      continue;
    }

    if (!valueOptions.has(name)) {
      throw new Error(`Unknown option: --${name}`);
    }

    const next = argumentsList[index + 1];
    if (!next || next.startsWith("--")) {
      throw new Error(`--${name} requires a value.`);
    }

    options.set(name, next);
    index += 1;
  }

  return { positionals, options };
}

export function normalizeSourceUrl(value) {
  let parsed;

  try {
    parsed = new URL(String(value));
  } catch {
    throw new Error(`Expected an absolute HTTP(S) source URL, received: ${value}`);
  }

  if (!new Set(["http:", "https:"]).has(parsed.protocol)) {
    throw new Error(`Expected an absolute HTTP(S) source URL, received: ${value}`);
  }

  if (parsed.username || parsed.password) {
    throw new Error("Source URLs containing credentials are not allowed.");
  }

  parsed.hash = "";
  return parsed.toString();
}

export function normalizeArchiveOrigin(value = defaultArchiveOrigin) {
  const candidate = String(value).trim();
  const withProtocol = candidate.includes("://") ? candidate : `https://${candidate}`;
  let parsed;

  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error(`Unsupported archive origin: ${value}`);
  }

  const origin = parsed.origin;
  if (
    !supportedArchiveOrigins.has(origin) ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash ||
    parsed.username ||
    parsed.password
  ) {
    throw new Error(
      `Unsupported archive origin: ${value}. Choose archive.ph, archive.is, or archive.li.`,
    );
  }

  return origin;
}

export function buildArchiveLookupUrl(value, archiveOrigin = defaultArchiveOrigin) {
  const sourceUrl = normalizeSourceUrl(value);
  const parsedSource = new URL(sourceUrl);

  if (archiveHostnames.has(parsedSource.hostname.toLowerCase())) {
    return sourceUrl;
  }

  return `${normalizeArchiveOrigin(archiveOrigin)}/${sourceUrl}`;
}

function openChrome(url) {
  if (process.platform !== "darwin") {
    throw new Error("Automatic Chrome opening is currently supported on macOS. Use --dry-run elsewhere.");
  }

  const result = spawnSync("open", ["-a", "Google Chrome", url], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Chrome launcher exited with status ${result.status}.`);
}

function describeHandoff(command, value, archiveOrigin) {
  const sourceUrl = normalizeSourceUrl(value);
  const archiveUrl = buildArchiveLookupUrl(sourceUrl, archiveOrigin);
  const mode = command === "open-extension" ? "extension" : "direct";

  return {
    sourceUrl,
    archiveUrl,
    openUrl: mode === "extension" ? sourceUrl : archiveUrl,
    mode,
    next:
      mode === "extension"
        ? "Claim the redirected archive.ph tab in Chrome and verify that it matches sourceUrl."
        : "Claim the opened archive.ph tab in Chrome and verify that it matches sourceUrl.",
  };
}

function printHandoff(handoff, opened) {
  console.log(`${opened ? "Opened" : "Archive"}: ${handoff.openUrl}`);
  console.log(`Source: ${handoff.sourceUrl}`);
  console.log(`Expected archive: ${handoff.archiveUrl}`);
  console.log(`Mode: ${handoff.mode}`);
  console.log(`Next: ${handoff.next}`);
}

function main() {
  const { positionals, options } = parseOptions(process.argv.slice(2));
  const [command, value, ...extraPositionals] = positionals;

  if (!command || command === "help" || options.has("help")) {
    printHelp();
    return;
  }

  if (!new Set(["route", "open", "open-extension"]).has(command)) {
    throw new Error(`Unknown archive command: ${command}. Use --help for details.`);
  }

  if (!value || extraPositionals.length > 0) {
    throw new Error(`${command} requires exactly one source URL.`);
  }

  if (command === "open-extension" && options.has("origin")) {
    throw new Error(
      "--origin cannot control the Archive News extension. Use open for an explicit archive origin.",
    );
  }

  const handoff = describeHandoff(command, value, options.get("origin"));
  const shouldOpen = command !== "route" && !options.has("dry-run");
  if (shouldOpen) openChrome(handoff.openUrl);

  if (options.has("json")) {
    console.log(JSON.stringify({ ...handoff, opened: shouldOpen }, null, 2));
  } else if (command === "route") {
    console.log(handoff.archiveUrl);
  } else {
    printHandoff(handoff, shouldOpen);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

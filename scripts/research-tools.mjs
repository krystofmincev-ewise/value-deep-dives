#!/usr/bin/env node

import { constants as fsConstants } from "node:fs";
import {
  access,
  chmod,
  mkdir,
  open,
  readFile,
  readdir,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(scriptDirectory);
const secCacheDirectory = join(repositoryRoot, ".local", "cache", "sec");
const sixHoursInMilliseconds = 6 * 60 * 60 * 1000;
const secRateStatePath = join(secCacheDirectory, "last-request.txt");
const secRateLockPath = join(secCacheDirectory, "request.lock");
const minimumSecIntervalMilliseconds = 125;
const requestTimeoutMilliseconds = 30_000;
const localStateDirectories = [
  join(repositoryRoot, ".local"),
  join(repositoryRoot, ".local", "cache"),
  join(repositoryRoot, ".local", "cache", "biomed"),
  join(repositoryRoot, ".local", "cache", "sec"),
  join(repositoryRoot, ".local", "captures"),
  join(repositoryRoot, ".local", "captures", "archive-ph"),
  join(repositoryRoot, ".local", "captures", "biomed"),
  join(repositoryRoot, ".local", "captures", "gemini"),
  join(repositoryRoot, ".local", "captures", "youtube"),
  join(repositoryRoot, ".local", "captures", "revelio"),
  join(repositoryRoot, ".local", "downloads"),
  join(repositoryRoot, ".local", "logs"),
];

function printHelp() {
  console.log(`Research tools

Usage:
  node scripts/research-tools.mjs status [--json]
  node scripts/research-tools.mjs init [--json]
  node scripts/research-browser.mjs list [--json]
  node scripts/research-browser.mjs open <source> [--query "..."] [--dry-run]
  node scripts/research-browser.mjs workspace --company "..." [--ticker SNAP] [--dry-run]
  node scripts/research-workflow.mjs gemini --prompt "..." [--plan-only] [--json]
  node scripts/research-workflow.mjs revelio --company "..." --question "..." [--json]
  node scripts/research-workflow.mjs youtube --query "..." [--max-videos 3] [--json]
  node scripts/research-archive.mjs open <url> [--dry-run] [--json]
  node scripts/research-archive.mjs open-extension <url> [--dry-run] [--json]
  node scripts/research-biomed.mjs landscape --query "..." [--limit 10] [--json]
  node scripts/research-biomed.mjs preprints search --query "..." [--json]
  node scripts/research-biomed.mjs literature search --query "..." [--open-access] [--json]
  node scripts/research-biomed.mjs trials search --query "..." [--json]
  node scripts/research-tools.mjs sec filings <ticker> [--forms 10-K,10-Q,8-K] [--limit 20] [--json]
  node scripts/research-tools.mjs sec facts <ticker> --concept <XBRL concept> [--unit USD] [--limit 20] [--json]

Required for SEC commands:
  SEC_USER_AGENT="Project Name monitored-contact@example.com"

Authenticated workflow commands emit semantic Chrome recipes; they never read browser state.
The CLI never prints credential values. SEC responses are cached under .local/cache/sec/.`);
}

function parseOptions(argumentsList) {
  const positionals = [];
  const options = new Map();
  const booleanOptions = new Set(["help", "json"]);
  const valueOptions = new Set(["concept", "forms", "limit", "unit"]);

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

export function parsePositiveInteger(value, fallback) {
  if (value === undefined) return fallback;

  const normalized = String(value);
  if (!/^[1-9]\d*$/.test(normalized)) {
    throw new Error(`Expected a positive integer, received: ${value}`);
  }

  return Number(normalized);
}

async function pathExists(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function commandExists(command) {
  const searchPath = process.env.PATH ?? "";
  const directories = searchPath.split(":").filter(Boolean);

  for (const directory of directories) {
    try {
      await access(join(directory, command), fsConstants.X_OK);
      return true;
    } catch {
      // Continue through PATH without executing the candidate.
    }
  }

  return false;
}

async function getCapabilityStatus() {
  const commands = ["codex", "git", "gh", "jq"];
  const commandStatus = Object.fromEntries(
    await Promise.all(commands.map(async (command) => [command, await commandExists(command)])),
  );
  const gitignore = await readFile(join(repositoryRoot, ".gitignore"), "utf8").catch(() => "");
  const localStateIgnored = gitignore
    .split(/\r?\n/)
    .map((line) => line.trim())
    .some((line) => line === "/.local/" || line === ".local/");
  const skillsDirectory = join(repositoryRoot, ".agents", "skills");
  const repositorySkills = await readdir(skillsDirectory, { withFileTypes: true })
    .then((entries) =>
      entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort(),
    )
    .catch(() => []);
  const skillStatus = Object.fromEntries(
    await Promise.all(
      repositorySkills.map(async (skill) => [
        skill,
        await pathExists(join(repositoryRoot, ".agents", "skills", skill, "SKILL.md")),
      ]),
    ),
  );

  return {
    runtime: {
      node: process.version,
      platform: process.platform,
    },
    commands: commandStatus,
    applications: {
      chrome: await pathExists("/Applications/Google Chrome.app"),
    },
    configuration: {
      SEC_USER_AGENT: Boolean(process.env.SEC_USER_AGENT),
    },
    repository: {
      agents: await pathExists(join(repositoryRoot, "AGENTS.md")),
      toolingRunbook: await pathExists(
        join(repositoryRoot, "methodology", "RESEARCH_TOOLING.md"),
      ),
      localStateIgnored,
      localStateInitialized: await Promise.all(
        localStateDirectories.map((path) => pathExists(path)),
      ).then((results) => results.every(Boolean)),
      skills: skillStatus,
    },
  };
}

function printCapabilityStatus(status) {
  console.log("Research capability check\n");
  console.log(`Node: ${status.runtime.node}`);
  console.log(`Chrome installed: ${status.applications.chrome ? "yes" : "no"}`);
  console.log("");
  console.log("Commands:");
  for (const [name, available] of Object.entries(status.commands)) {
    console.log(`  ${name.padEnd(10)} ${available ? "available" : "not installed"}`);
  }
  console.log("");
  console.log("Configuration (presence only; values are never printed):");
  for (const [name, configured] of Object.entries(status.configuration)) {
    console.log(`  ${name.padEnd(20)} ${configured ? "configured" : "not configured"}`);
  }
  console.log("");
  console.log(
    "Authenticated research is performed through the user-authorized Chrome integration; this check never inspects account state.",
  );
  console.log("");
  console.log(
    `Local research state: ${status.repository.localStateInitialized ? "initialized" : "not initialized (run npm run research:init)"}`,
  );
  console.log("");
  console.log("Repository skills:");
  for (const [name, available] of Object.entries(status.repository.skills)) {
    console.log(`  ${name.padEnd(30)} ${available ? "available" : "missing"}`);
  }
}

async function initializeLocalState() {
  for (const path of localStateDirectories) {
    await mkdir(path, { recursive: true, mode: 0o700 });
    await chmod(path, 0o700);
  }

  const localReadme = join(repositoryRoot, ".local", "README.md");
  if (await pathExists(localReadme)) await chmod(localReadme, 0o600);

  return {
    root: join(repositoryRoot, ".local"),
    directories: localStateDirectories.length,
    mode: "0700",
  };
}

function requireSecUserAgent() {
  const userAgent = process.env.SEC_USER_AGENT?.trim();

  if (!userAgent) {
    throw new Error(
      "SEC_USER_AGENT is required. Set it to a truthful project name and monitored contact address.",
    );
  }

  return userAgent;
}

function sanitizeCacheKey(value) {
  return value.replaceAll(/[^a-zA-Z0-9._-]/g, "_");
}

async function readFreshCache(path, maximumAgeMilliseconds) {
  try {
    const metadata = await stat(path);
    if (Date.now() - metadata.mtimeMs > maximumAgeMilliseconds) return null;
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function writeJsonAtomically(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value)}\n`, { mode: 0o600 });
  await rename(temporaryPath, path);
}

async function acquireSecRateLock() {
  await mkdir(secCacheDirectory, { recursive: true });

  for (let attempt = 0; attempt < 200; attempt += 1) {
    try {
      const handle = await open(secRateLockPath, "wx", 0o600);
      return handle;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;

      const lockAge = await stat(secRateLockPath)
        .then((metadata) => Date.now() - metadata.mtimeMs)
        .catch(() => 0);
      if (lockAge > requestTimeoutMilliseconds * 2) {
        await unlink(secRateLockPath).catch(() => {});
      } else {
        await delay(25);
      }
    }
  }

  throw new Error("Timed out waiting for the SEC request-rate lock.");
}

async function waitForSecRateSlot() {
  const handle = await acquireSecRateLock();
  try {
    const lastRequest = Number(await readFile(secRateStatePath, "utf8").catch(() => "0"));
    const waitMilliseconds = Math.max(
      0,
      minimumSecIntervalMilliseconds - (Date.now() - lastRequest),
    );
    if (waitMilliseconds > 0) await delay(waitMilliseconds);
    await writeFile(secRateStatePath, String(Date.now()), { mode: 0o600 });
  } finally {
    await handle.close();
    await unlink(secRateLockPath).catch(() => {});
  }
}

export function getRetryDelayMilliseconds(response, attempt) {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.min(30_000, Math.max(0, seconds * 1000));

    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.min(30_000, Math.max(0, date - Date.now()));
  }

  return 500 * 2 ** attempt;
}

async function fetchSecJson(url, cacheKey, userAgent) {
  const cachePath = join(secCacheDirectory, `${sanitizeCacheKey(cacheKey)}.json`);
  const cached = await readFreshCache(cachePath, sixHoursInMilliseconds);
  if (cached !== null) return cached;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await waitForSecRateSlot();
    let response;
    try {
      response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": userAgent,
        },
        signal: AbortSignal.timeout(requestTimeoutMilliseconds),
      });
    } catch (error) {
      if (attempt === 2) {
        throw new Error(`SEC request failed after 3 attempts: ${url}`, { cause: error });
      }
      await delay(500 * 2 ** attempt);
      continue;
    }

    if (response.ok) {
      const value = await response.json();
      await writeJsonAtomically(cachePath, value);
      return value;
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`SEC request failed with HTTP ${response.status}: ${url}`);
    }

    if (attempt < 2) await delay(getRetryDelayMilliseconds(response, attempt));
  }

  throw new Error(`SEC request failed after 3 attempts: ${url}`);
}

async function resolveCompany(ticker, userAgent) {
  const normalizedTicker = ticker.trim().toUpperCase();
  const mapping = await fetchSecJson(
    "https://www.sec.gov/files/company_tickers_exchange.json",
    "company_tickers_exchange",
    userAgent,
  );

  const tickerIndex = mapping.fields.indexOf("ticker");
  const cikIndex = mapping.fields.indexOf("cik");
  const nameIndex = mapping.fields.indexOf("name");
  const exchangeIndex = mapping.fields.indexOf("exchange");
  const row = mapping.data.find((candidate) => candidate[tickerIndex] === normalizedTicker);

  if (!row) throw new Error(`Ticker not found in the SEC mapping: ${normalizedTicker}`);

  return {
    ticker: normalizedTicker,
    cik: String(row[cikIndex]).padStart(10, "0"),
    name: row[nameIndex],
    exchange: row[exchangeIndex],
  };
}

function getRecentFilings(submissions) {
  const recent = submissions.filings?.recent;
  if (!recent) return [];

  return recent.accessionNumber.map((accessionNumber, index) => ({
    accessionNumber,
    filingDate: recent.filingDate[index],
    reportDate: recent.reportDate[index],
    form: recent.form[index],
    primaryDocument: recent.primaryDocument[index],
  }));
}

export function getFilingUrl(cik, filing) {
  const numericCik = String(Number.parseInt(cik, 10));
  const accessionWithoutDashes = filing.accessionNumber.replaceAll("-", "");
  return `https://www.sec.gov/Archives/edgar/data/${numericCik}/${accessionWithoutDashes}/${filing.primaryDocument}`;
}

export function getFilingIndexUrl(cik, accessionNumber) {
  const numericCik = String(Number.parseInt(cik, 10));
  const accessionWithoutDashes = accessionNumber.replaceAll("-", "");
  return `https://www.sec.gov/Archives/edgar/data/${numericCik}/${accessionWithoutDashes}/${accessionNumber}-index.html`;
}

async function listFilings(ticker, options) {
  const forms = String(options.get("forms") ?? "10-K,10-Q,8-K")
    .split(",")
    .map((form) => form.trim().toUpperCase())
    .filter(Boolean);
  const limit = parsePositiveInteger(options.get("limit"), 20);
  const userAgent = requireSecUserAgent();
  const company = await resolveCompany(ticker, userAgent);
  const source = `https://data.sec.gov/submissions/CIK${company.cik}.json`;
  const submissions = await fetchSecJson(
    source,
    `submissions_${company.cik}`,
    userAgent,
  );
  const filings = getRecentFilings(submissions)
    .filter((filing) => forms.includes(filing.form.toUpperCase()))
    .slice(0, limit)
    .map((filing) => ({ ...filing, url: getFilingUrl(company.cik, filing) }));

  return { company, forms, retrievedAt: new Date().toISOString(), source, filings };
}

export function flattenConceptFacts(companyFacts, concept, unit) {
  const namespaceEntries = Object.entries(companyFacts.facts ?? {});

  for (const [namespace, concepts] of namespaceEntries) {
    const fact = concepts[concept];
    if (!fact) continue;

    const availableUnits = Object.keys(fact.units ?? {});
    const selectedUnit = unit ?? availableUnits[0];
    const values = fact.units?.[selectedUnit];

    if (!values) {
      throw new Error(
        `Concept ${concept} exists, but unit ${selectedUnit} does not. Available: ${availableUnits.join(", ")}`,
      );
    }

    return {
      namespace,
      label: fact.label,
      description: fact.description,
      unit: selectedUnit,
      values,
    };
  }

  const suggestions = namespaceEntries
    .flatMap(([, concepts]) => Object.keys(concepts))
    .filter((candidate) => candidate.toLowerCase().includes(concept.toLowerCase().slice(0, 12)))
    .slice(0, 10);
  const suffix = suggestions.length > 0 ? ` Similar concepts: ${suggestions.join(", ")}` : "";
  throw new Error(`XBRL concept not found: ${concept}.${suffix}`);
}

async function listFacts(ticker, options) {
  const concept = options.get("concept");
  if (typeof concept !== "string" || concept.trim() === "") {
    throw new Error("--concept is required for SEC facts.");
  }

  const userAgent = requireSecUserAgent();
  const company = await resolveCompany(ticker, userAgent);
  const source = `https://data.sec.gov/api/xbrl/companyfacts/CIK${company.cik}.json`;
  const companyFacts = await fetchSecJson(
    source,
    `companyfacts_${company.cik}`,
    userAgent,
  );
  const flattened = flattenConceptFacts(companyFacts, concept, options.get("unit"));
  const limit = parsePositiveInteger(options.get("limit"), 20);
  const values = flattened.values
    .toSorted((left, right) => String(right.filed).localeCompare(String(left.filed)))
    .slice(0, limit)
    .map((fact) => ({
      ...fact,
      filingUrl: fact.accn ? getFilingIndexUrl(company.cik, fact.accn) : null,
    }));

  return {
    company,
    concept,
    namespace: flattened.namespace,
    label: flattened.label,
    description: flattened.description,
    unit: flattened.unit,
    retrievedAt: new Date().toISOString(),
    source,
    values,
  };
}

function printFilings(result) {
  console.log(`# ${result.company.name} (${result.company.ticker}) — SEC filings\n`);
  console.log(`CIK: ${result.company.cik} | Exchange: ${result.company.exchange}`);
  console.log(`Retrieved: ${result.retrievedAt} | Source: ${result.source}`);
  console.log(`Forms: ${result.forms.join(", ")}\n`);
  console.log("| Filed | Report date | Form | Accession | Filing |");
  console.log("| --- | --- | --- | --- | --- |");
  for (const filing of result.filings) {
    console.log(
      `| ${filing.filingDate} | ${filing.reportDate || "—"} | ${filing.form} | ${filing.accessionNumber} | [Open](${filing.url}) |`,
    );
  }
}

function printFacts(result) {
  console.log(`# ${result.company.name} (${result.company.ticker}) — ${result.label}\n`);
  console.log(`Concept: ${result.namespace}:${result.concept} | Unit: ${result.unit}`);
  console.log(`Retrieved: ${result.retrievedAt} | Source: ${result.source}`);
  console.log(`${result.description}\n`);
  console.log("| Filed | Period end | Fiscal period | Form | Value | Accession |");
  console.log("| --- | --- | --- | --- | ---: | --- |");
  for (const fact of result.values) {
    const accession = fact.filingUrl ? `[${fact.accn}](${fact.filingUrl})` : "—";
    console.log(
      `| ${fact.filed ?? "—"} | ${fact.end ?? "—"} | ${fact.fp ?? "—"} | ${fact.form ?? "—"} | ${fact.val ?? "—"} | ${accession} |`,
    );
  }
}

async function main() {
  const { positionals, options } = parseOptions(process.argv.slice(2));
  const [command, subcommand, ticker] = positionals;

  if (!command || command === "help" || options.has("help")) {
    printHelp();
    return;
  }

  if (command === "status") {
    if (positionals.length !== 1) throw new Error("The status command accepts no positional values.");
    const unsupported = [...options.keys()].filter((name) => !["help", "json"].includes(name));
    if (unsupported.length > 0) throw new Error(`--${unsupported[0]} is not supported for status.`);
    const status = await getCapabilityStatus();
    if (options.has("json")) console.log(JSON.stringify(status, null, 2));
    else printCapabilityStatus(status);
    return;
  }

  if (command === "init") {
    if (positionals.length !== 1) throw new Error("The init command accepts no positional values.");
    const unsupported = [...options.keys()].filter((name) => !["help", "json"].includes(name));
    if (unsupported.length > 0) throw new Error(`--${unsupported[0]} is not supported for init.`);
    const result = await initializeLocalState();
    if (options.has("json")) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`Initialized ${result.directories} local research directories under ${result.root}`);
      console.log(`Directory permissions: ${result.mode}`);
    }
    return;
  }

  if (command !== "sec" || !subcommand || !ticker || positionals.length !== 3) {
    throw new Error("Expected `sec filings <ticker>` or `sec facts <ticker>`. Use --help for details.");
  }

  if (subcommand === "filings") {
    const unsupported = [...options.keys()].filter(
      (name) => !["forms", "help", "json", "limit"].includes(name),
    );
    if (unsupported.length > 0) {
      throw new Error(`--${unsupported[0]} is not supported for SEC filings.`);
    }
    const result = await listFilings(ticker, options);
    if (options.has("json")) console.log(JSON.stringify(result, null, 2));
    else printFilings(result);
    return;
  }

  if (subcommand === "facts") {
    const unsupported = [...options.keys()].filter(
      (name) => !["concept", "help", "json", "limit", "unit"].includes(name),
    );
    if (unsupported.length > 0) {
      throw new Error(`--${unsupported[0]} is not supported for SEC facts.`);
    }
    const result = await listFacts(ticker, options);
    if (options.has("json")) console.log(JSON.stringify(result, null, 2));
    else printFacts(result);
    return;
  }

  throw new Error(`Unknown SEC command: ${subcommand}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}

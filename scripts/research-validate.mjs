#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { validateCoverageCycles } from "./lib/company-cycle.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultRepositoryRoot = dirname(scriptDirectory);
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const requiredFiles = [
  "AGENTS.md",
  "DATA_POLICY.md",
  "methodology/RESEARCH_STANDARDS.md",
  "methodology/RESEARCH_TOOLING.md",
  "methodology/INVESTMENT_PROCESS.md",
  "methodology/EVENT_DRIVEN_RESEARCH.md",
  "methodology/PERFORMANCE_AND_DISCLOSURES.md",
  "methodology/VALUATION_FRAMEWORK.md",
  "track-record/forecast-ledger.csv",
  "track-record/event-candidate-ledger.csv",
  "track-record/event-forecast-ledger.csv",
];
const requiredScripts = {
  "research:archive": "scripts/research-archive.mjs",
  "research:biomed": "scripts/research-biomed.mjs",
  "research:browser": "scripts/research-browser.mjs",
  "research:check": "scripts/research-tools.mjs",
  "research:company": "scripts/research-company.mjs",
  "research:gemini": "scripts/research-workflow.mjs",
  "research:init": "scripts/research-tools.mjs",
  "research:records": "scripts/research-records.mjs",
  "research:revelio": "scripts/research-workflow.mjs",
  "research:sec": "scripts/research-tools.mjs",
  "research:validate": "scripts/research-validate.mjs",
  "research:youtube": "scripts/research-workflow.mjs",
};
const forbiddenRuntimeMarkers = [
  ["api", "openai", "com"].join("."),
  ["generativelanguage", "googleapis", "com"].join("."),
  ["youtube", "googleapis", "com"].join("."),
  ["OPENAI", "API", "KEY"].join("_"),
  ["GEMINI", "API", "KEY"].join("_"),
  ["YOUTUBE", "API", "KEY"].join("_"),
  ["REVELIO", "API", "KEY"].join("_"),
  ["ALPACA", "API", "KEY"].join("_"),
];

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function issue(level, check, message, path = null) {
  return { level, check, message, path };
}

function parseYamlScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
  return trimmed;
}

export function parseSkillFrontMatter(text) {
  const normalized = text.replaceAll("\r\n", "\n");
  if (!normalized.startsWith("---\n")) return null;
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const values = {};
  for (const line of normalized.slice(4, end).split("\n")) {
    const match = line.match(/^([a-z_]+):\s*(.+)$/);
    if (match) values[match[1]] = parseYamlScalar(match[2]);
  }
  return values;
}

function parseOpenAiInterface(text) {
  const values = {};
  let insideInterface = false;
  for (const line of text.replaceAll("\r\n", "\n").split("\n")) {
    if (line === "interface:") {
      insideInterface = true;
      continue;
    }
    if (!insideInterface || line.trim() === "" || line.trim().startsWith("#")) continue;
    const match = line.match(/^  ([a-z_]+):\s*(.+)$/);
    if (!match) return null;
    values[match[1]] = parseYamlScalar(match[2]);
  }
  return insideInterface ? values : null;
}

function referencedSkillResources(text) {
  return [
    ...new Set(
      [...text.matchAll(/\breferences\/[a-zA-Z0-9._/-]+/g)].map((match) =>
        match[0].replace(/[),.;:]+$/g, ""),
      ),
    ),
  ];
}

export function findForbiddenBillingMarkers(entries) {
  const findings = [];
  for (const { path, text } of entries) {
    for (const marker of forbiddenRuntimeMarkers) {
      if (text.toLowerCase().includes(marker.toLowerCase())) findings.push({ path, marker });
    }
  }
  return findings;
}

async function validateSkill(repositoryRoot, skillName) {
  const findings = [];
  const skillDirectory = join(repositoryRoot, ".agents", "skills", skillName);
  const skillPath = join(skillDirectory, "SKILL.md");
  const interfacePath = join(skillDirectory, "agents", "openai.yaml");
  const skillText = await readFile(skillPath, "utf8").catch(() => null);
  const relativeSkillPath = relative(repositoryRoot, skillPath);

  if (!skillText) {
    findings.push(issue("error", "skill", "Missing SKILL.md.", relativeSkillPath));
    return findings;
  }

  const frontMatter = parseSkillFrontMatter(skillText);
  if (!frontMatter) {
    findings.push(issue("error", "skill", "Missing or malformed YAML front matter.", relativeSkillPath));
  } else {
    if (frontMatter.name !== skillName) {
      findings.push(
        issue("error", "skill", `Front-matter name must equal directory name ${skillName}.`, relativeSkillPath),
      );
    }
    if (!skillNamePattern.test(frontMatter.name ?? "") || (frontMatter.name?.length ?? 0) > 64) {
      findings.push(issue("error", "skill", "Skill name is not a valid kebab-case name.", relativeSkillPath));
    }
    if (
      typeof frontMatter.description !== "string" ||
      frontMatter.description.length < 20 ||
      frontMatter.description.length > 1024 ||
      /[<>]/.test(frontMatter.description)
    ) {
      findings.push(issue("error", "skill", "Skill description is missing or invalid.", relativeSkillPath));
    }
  }

  if (skillText.split(/\r?\n/).length > 500) {
    findings.push(issue("error", "skill", "SKILL.md exceeds 500 lines.", relativeSkillPath));
  }

  for (const resource of referencedSkillResources(skillText)) {
    if (!(await pathExists(join(skillDirectory, resource)))) {
      findings.push(issue("error", "skill-reference", `Missing referenced resource ${resource}.`, relativeSkillPath));
    }
  }

  const interfaceText = await readFile(interfacePath, "utf8").catch(() => null);
  const relativeInterfacePath = relative(repositoryRoot, interfacePath);
  if (!interfaceText) {
    findings.push(issue("error", "skill-interface", "Missing agents/openai.yaml.", relativeInterfacePath));
  } else {
    const parsed = parseOpenAiInterface(interfaceText);
    const expectedKeys = ["default_prompt", "display_name", "short_description"];
    if (!parsed || Object.keys(parsed).sort().join(",") !== expectedKeys.join(",")) {
      findings.push(
        issue("error", "skill-interface", `Interface must contain only ${expectedKeys.join(", ")}.`, relativeInterfacePath),
      );
    } else {
      if (!String(parsed.default_prompt).includes(`$${skillName}`)) {
        findings.push(
          issue("error", "skill-interface", "Default prompt must invoke the skill by name.", relativeInterfacePath),
        );
      }
      if (
        typeof parsed.short_description !== "string" ||
        parsed.short_description.length < 20 ||
        parsed.short_description.length > 64
      ) {
        findings.push(
          issue("error", "skill-interface", "Short description must be 20-64 characters.", relativeInterfacePath),
        );
      }
    }
  }
  return findings;
}

async function validateJsonContracts(repositoryRoot) {
  const findings = [];
  const schemaDirectory = join(repositoryRoot, "schemas");
  const templateDirectory = join(repositoryRoot, "templates");
  const schemaFiles = (await readdir(schemaDirectory)).filter((name) => name.endsWith(".json")).sort();
  const templateFiles = (await readdir(templateDirectory)).filter((name) => name.endsWith(".json")).sort();

  for (const [directory, names, kind] of [
    [schemaDirectory, schemaFiles, "schema"],
    [templateDirectory, templateFiles, "template"],
  ]) {
    for (const name of names) {
      const path = join(directory, name);
      const relativePath = relative(repositoryRoot, path);
      let parsed;
      try {
        parsed = JSON.parse(await readFile(path, "utf8"));
      } catch (error) {
        findings.push(issue("error", kind, `Invalid JSON: ${error.message}`, relativePath));
        continue;
      }
      if (kind === "schema") {
        if (parsed.$schema !== "https://json-schema.org/draft/2020-12/schema") {
          findings.push(issue("error", kind, "Schema must declare JSON Schema draft 2020-12.", relativePath));
        }
        if (parsed.type !== "object" || typeof parsed.title !== "string") {
          findings.push(issue("error", kind, "Schema must describe a titled object.", relativePath));
        }
      }
    }
  }
  return { findings, schemaCount: schemaFiles.length, jsonTemplateCount: templateFiles.length };
}

export async function validateRepository(repositoryRoot = defaultRepositoryRoot) {
  const findings = [];
  for (const requiredPath of requiredFiles) {
    if (!(await pathExists(join(repositoryRoot, requiredPath)))) {
      findings.push(issue("error", "required-file", "Required research contract is missing.", requiredPath));
    }
  }

  const packagePath = join(repositoryRoot, "package.json");
  let packageJson = null;
  try {
    packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  } catch (error) {
    findings.push(issue("error", "package", `Cannot parse package.json: ${error.message}`, "package.json"));
  }

  if (packageJson) {
    for (const [scriptName, scriptPath] of Object.entries(requiredScripts)) {
      const command = packageJson.scripts?.[scriptName];
      if (typeof command !== "string" || !command.includes(scriptPath)) {
        findings.push(issue("error", "package-script", `Missing or misrouted ${scriptName}.`, "package.json"));
      }
      if (!(await pathExists(join(repositoryRoot, scriptPath)))) {
        findings.push(issue("error", "package-script", `Command target ${scriptPath} is missing.`, "package.json"));
      }
    }
  }

  const skillsDirectory = join(repositoryRoot, ".agents", "skills");
  const skillNames = (await readdir(skillsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (skillNames.length === 0) findings.push(issue("error", "skills", "No repository skills found."));
  for (const skillName of skillNames) findings.push(...(await validateSkill(repositoryRoot, skillName)));

  const jsonContracts = await validateJsonContracts(repositoryRoot);
  findings.push(...jsonContracts.findings);

  const coverageCycles = await validateCoverageCycles(repositoryRoot);
  findings.push(...coverageCycles.findings);

  const gitignore = await readFile(join(repositoryRoot, ".gitignore"), "utf8").catch(() => "");
  if (!gitignore.split(/\r?\n/).some((line) => [".local/", "/.local/"].includes(line.trim()))) {
    findings.push(issue("error", "local-state", ".local/ must be ignored.", ".gitignore"));
  }

  const scripts = (await readdir(join(repositoryRoot, "scripts")))
    .filter((name) => extname(name) === ".mjs" && !name.endsWith(".test.mjs") && name !== "research-validate.mjs")
    .sort();
  const runtimeEntries = await Promise.all(
    scripts.map(async (name) => ({
      path: `scripts/${name}`,
      text: await readFile(join(repositoryRoot, "scripts", name), "utf8"),
    })),
  );
  if (packageJson) runtimeEntries.push({ path: "package.json", text: JSON.stringify(packageJson.scripts ?? {}) });
  for (const marker of findForbiddenBillingMarkers(runtimeEntries)) {
    findings.push(
      issue(
        "error",
        "billing-route",
        `Separately billable or credentialed runtime marker is not permitted: ${marker.marker}.`,
        marker.path,
      ),
    );
  }

  const workflowText = await readFile(join(repositoryRoot, "scripts", "research-workflow.mjs"), "utf8");
  for (const requiredPhrase of [
    "Existing Gemini subscription",
    "Signed-in Gemini Chrome UI",
    "Authenticated Chrome / Revelio Labs",
    "Authenticated Chrome / YouTube",
  ]) {
    if (!workflowText.includes(requiredPhrase)) {
      findings.push(
        issue("error", "subscription-route", `Missing subscription routing declaration: ${requiredPhrase}.`, "scripts/research-workflow.mjs"),
      );
    }
  }

  const eventSpecText = await readFile(
    join(repositoryRoot, "methodology", "event-evaluation-specs", "event-v1.md"),
    "utf8",
  ).catch(() => "");
  if (/^status:\s*draft\s*$/m.test(eventSpecText)) {
    findings.push(
      issue(
        "warning",
        "event-provider",
        "event-v1 is intentionally draft; formal event publication remains blocked until lawful calendar and market-data providers are frozen.",
        "methodology/event-evaluation-specs/event-v1.md",
      ),
    );
  }
  if (!process.env.SEC_USER_AGENT) {
    findings.push(
      issue(
        "warning",
        "configuration",
        "SEC_USER_AGENT is not configured; live SEC retrieval will fail closed until the user supplies a truthful project/contact value.",
      ),
    );
  }
  findings.push(
    issue(
      "warning",
      "authenticated-session",
      "Static validation cannot prove Chrome sign-in or subscription entitlement; check the visible Gemini, YouTube, Revelio, FT, and SemiAnalysis controls at runtime.",
    ),
  );

  return {
    valid: !findings.some(({ level }) => level === "error"),
    repositoryRoot,
    counts: {
      skills: skillNames.length,
      schemas: jsonContracts.schemaCount,
      jsonTemplates: jsonContracts.jsonTemplateCount,
      coverageCycles: coverageCycles.cycleCount,
      runtimeScripts: scripts.length + 1,
    },
    findings,
  };
}

function printReport(report) {
  console.log("Research repository validation\n");
  console.log(`Skills: ${report.counts.skills}`);
  console.log(`Schemas: ${report.counts.schemas}`);
  console.log(`JSON templates: ${report.counts.jsonTemplates}`);
  console.log(`Coverage cycles: ${report.counts.coverageCycles}`);
  console.log(`Runtime scripts: ${report.counts.runtimeScripts}`);
  console.log("");
  const errors = report.findings.filter(({ level }) => level === "error");
  const warnings = report.findings.filter(({ level }) => level === "warning");
  console.log(`Static result: ${errors.length === 0 ? "PASS" : "FAIL"} (${errors.length} errors, ${warnings.length} warnings)`);
  for (const finding of report.findings) {
    console.log(`  ${finding.level.toUpperCase()} [${finding.check}]${finding.path ? ` ${finding.path}:` : ":"} ${finding.message}`);
  }
}

async function runTests(repositoryRoot, jsonMode) {
  const testFiles = (await readdir(join(repositoryRoot, "scripts")))
    .filter((name) => name.endsWith(".test.mjs"))
    .sort()
    .map((name) => join(repositoryRoot, "scripts", name));
  const result = spawnSync(process.execPath, ["--test", ...testFiles], {
    cwd: repositoryRoot,
    encoding: "utf8",
    stdio: jsonMode ? "pipe" : "inherit",
  });
  const output = jsonMode ? `${result.stdout ?? ""}\n${result.stderr ?? ""}` : "";
  const countMatch = output.match(/(?:^|\n)ℹ tests (\d+)/);
  return {
    valid: result.status === 0,
    exitCode: result.status,
    count: countMatch ? Number(countMatch[1]) : null,
  };
}

async function main() {
  const argumentsList = process.argv.slice(2);
  const allowed = new Set(["--json", "--static-only"]);
  const unknown = argumentsList.filter((argument) => !allowed.has(argument));
  if (unknown.length > 0) throw new Error(`Unknown option: ${unknown[0]}`);
  const jsonMode = argumentsList.includes("--json");
  const staticOnly = argumentsList.includes("--static-only");
  const report = await validateRepository();

  if (!jsonMode) printReport(report);
  let tests = null;
  if (report.valid && !staticOnly) tests = await runTests(defaultRepositoryRoot, jsonMode);
  const valid = report.valid && (tests?.valid ?? true);

  if (jsonMode) console.log(JSON.stringify({ ...report, tests, valid }, null, 2));
  else if (tests) console.log(`\nTest result: ${tests.valid ? "PASS" : "FAIL"}`);
  if (!valid) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}

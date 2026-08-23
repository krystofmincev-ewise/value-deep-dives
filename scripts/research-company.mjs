#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { validateCoverageCycles } from "./lib/company-cycle.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");

function printHelp() {
  console.log(`Company coverage-cycle validation

Usage:
  node scripts/research-company.mjs validate [company directory or manifest] [--json]

With no target, validate every coverage cycle under companies/.`);
}

function printReport(report) {
  console.log(`Company coverage cycles: ${report.cycleCount}`);
  console.log(`Result: ${report.valid ? "PASS" : "FAIL"}`);
  for (const cycle of report.cycles) console.log(`  ${cycle.valid ? "PASS" : "FAIL"} ${cycle.cycleId ?? cycle.manifestPath}`);
  for (const item of report.findings) {
    console.log(`  ${item.level.toUpperCase()} [${item.check}]${item.path ? ` ${item.path}:` : ":"} ${item.message}`);
  }
}

export async function main(argumentsList = process.argv.slice(2)) {
  const json = argumentsList.includes("--json");
  const positionals = argumentsList.filter((argument) => argument !== "--json");
  if (positionals.some((argument) => argument.startsWith("--"))) {
    throw new Error(`Unknown option: ${positionals.find((argument) => argument.startsWith("--"))}`);
  }
  const [command, target] = positionals;
  if (!command || command === "help") {
    printHelp();
    return;
  }
  if (command !== "validate" || positionals.length > 2) {
    throw new Error("Expected: validate [company directory or manifest]");
  }
  const report = await validateCoverageCycles(repositoryRoot, target ?? null);
  if (json) console.log(JSON.stringify(report, null, 2));
  else printReport(report);
  if (!report.valid) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}

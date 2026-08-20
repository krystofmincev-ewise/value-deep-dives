#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { getArxivPreprint, searchArxivPreprints } from "./lib/arxiv-client.mjs";
import {
  buildEvidenceLandscape,
  fetchOpenAccessFullText,
  getLiteratureRecord,
  getTrialStudy,
  parsePositiveInteger,
  searchLiterature,
  searchTrials,
  sourceInventory,
} from "./lib/biomed-client.mjs";

function printHelp() {
  console.log(`Biomedical evidence research

Usage:
  node scripts/research-biomed.mjs sources [--json]
  node scripts/research-biomed.mjs landscape --query "..." [--limit 10] [--json] [--refresh]
  node scripts/research-biomed.mjs preprints search --query "..." [--limit 20] [--json] [--refresh]
  node scripts/research-biomed.mjs preprints get <ARXIV_ID> [--json] [--refresh]
  node scripts/research-biomed.mjs literature search --query "..." [--limit 20] [--open-access] [--json] [--refresh]
  node scripts/research-biomed.mjs literature get <PMCID|PMID|DOI> [--json] [--refresh]
  node scripts/research-biomed.mjs literature fetch <PMCID> [--allow-noncommercial] [--json] [--refresh]
  node scripts/research-biomed.mjs trials search --query "..." [--limit 20] [--json] [--refresh]
  node scripts/research-biomed.mjs trials get <NCT_ID> [--json] [--refresh]

Examples:
  npm run research:biomed -- landscape --query "intismeran melanoma"
  npm run research:biomed -- preprints search --query '"protein language model" drug discovery' --json
  npm run research:biomed -- preprints get 2501.12948 --json
  npm run research:biomed -- literature search --query "V940 pembrolizumab" --open-access --json
  npm run research:biomed -- trials get NCT05933577 --json

Full text is saved only under the ignored .local/captures/biomed/ directory. Retrieval is blocked
unless Europe PMC marks the article open access and provides a machine-readable reuse licence.
Non-commercial licences require an explicit --allow-noncommercial flag and a qualifying use.`);
}

function parseOptions(argumentsList) {
  const positionals = [];
  const options = new Map();

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (!argument.startsWith("--")) {
      positionals.push(argument);
      continue;
    }

    const name = argument.slice(2);
    const next = argumentsList[index + 1];
    if (next && !next.startsWith("--")) {
      options.set(name, next);
      index += 1;
    } else {
      options.set(name, true);
    }
  }

  return { positionals, options };
}

function getStringOption(options, name, { required = false } = {}) {
  if (!options.has(name)) {
    if (required) throw new Error(`--${name} is required.`);
    return undefined;
  }
  const value = options.get(name);
  if (typeof value !== "string" || value.trim() === "") throw new Error(`--${name} requires a value.`);
  return value.trim();
}

function rejectUnknownOptions(options, allowed) {
  const unknown = [...options.keys()].filter((name) => !allowed.includes(name));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown option${unknown.length === 1 ? "" : "s"}: ${unknown.map((name) => `--${name}`).join(", ")}`,
    );
  }
}

function printSources(sources) {
  for (const source of sources) {
    console.log(`${source.id} — ${source.kind} (${source.status})`);
    console.log(`  ${source.role}`);
    console.log(`  Access: ${source.access}`);
    console.log(`  Rights: ${source.rights}`);
    console.log(`  ${source.url}`);
  }
}

function printLiterature(envelope) {
  console.log(`Europe PMC: ${envelope.returned} of ${envelope.total} results for “${envelope.query}”`);
  for (const [index, record] of envelope.records.entries()) {
    const identifier =
      record.identifiers.pmcid ??
      record.identifiers.pmid ??
      record.identifiers.doi ??
      "no identifier";
    const access = record.openAccess.isOpenAccess
      ? `OA, ${record.openAccess.license ?? "licence unknown"}`
      : "metadata/abstract only";
    console.log(`${index + 1}. ${record.title}`);
    console.log(`   ${record.publicationDate ?? "date unknown"} · ${identifier} · ${access}`);
    if (record.links.europePmc) console.log(`   ${record.links.europePmc}`);
  }
}

function printPreprints(envelope) {
  console.log(`arXiv: ${envelope.returned} of ${envelope.total} results for “${envelope.query}”`);
  for (const [index, record] of envelope.records.entries()) {
    const publicationLink = record.identifiers.doi ?? record.journalReference;
    const reviewStatus = publicationLink ? "publication link unverified" : "peer review not established";
    console.log(`${index + 1}. ${record.title}`);
    console.log(
      `   ${record.submittedAt ?? "date unknown"} · arXiv:${record.identifiers.arxiv} · preprint · ${record.availabilityStatus} · ${reviewStatus}`,
    );
    console.log(`   ${record.links.abstract}`);
  }
}

function printTrials(envelope) {
  console.log(`ClinicalTrials.gov: ${envelope.returned} of ${envelope.total} results for “${envelope.query}”`);
  console.log(`Data timestamp: ${envelope.source.dataTimestamp ?? "unknown"}`);
  for (const [index, record] of envelope.records.entries()) {
    const phases = record.phases.length > 0 ? record.phases.join("/") : "phase not stated";
    console.log(`${index + 1}. ${record.nctId} — ${record.title}`);
    console.log(
      `   ${record.status ?? "status unknown"} · ${phases} · results ${record.hasResults ? "posted" : "not posted"}`,
    );
    console.log(`   ${record.links.clinicalTrialsGov}`);
  }
}

function printLandscape(landscape) {
  console.log(`# Biomedical evidence landscape: ${landscape.query}\n`);
  printLiterature(landscape.literature);
  console.log("");
  printPreprints(landscape.preprints);
  console.log("");
  printTrials(landscape.trials);
  console.log("\nNext evidence layers:");
  for (const next of landscape.nextEvidenceLayers) console.log(`- ${next}`);
}

function printCapture(manifest) {
  console.log(`Saved ${manifest.title}`);
  console.log(`Licence: ${manifest.rights} (${manifest.rightsClass})`);
  console.log(`XML: ${manifest.files.fullTextXml}`);
  console.log(`Manifest: ${manifest.files.manifest}`);
}

function printResult(result, json, printer) {
  if (json) console.log(JSON.stringify(result, null, 2));
  else printer(result);
}

export async function main(argumentsList = process.argv.slice(2)) {
  const { positionals, options } = parseOptions(argumentsList);
  const [area, command, identifier] = positionals;

  if (!area || area === "help" || options.has("help")) {
    rejectUnknownOptions(options, ["help"]);
    printHelp();
    return;
  }

  const wantsJson = options.has("json");
  const refresh = options.has("refresh");

  if (area === "sources") {
    rejectUnknownOptions(options, ["json"]);
    if (positionals.length !== 1) throw new Error("The sources command accepts no positional arguments.");
    printResult(sourceInventory, wantsJson, printSources);
    return;
  }

  if (area === "landscape") {
    rejectUnknownOptions(options, ["query", "limit", "json", "refresh"]);
    if (positionals.length !== 1) throw new Error("The landscape command accepts no positional arguments.");
    const query = getStringOption(options, "query", { required: true });
    const limit = parsePositiveInteger(getStringOption(options, "limit"), 10);
    const landscape = await buildEvidenceLandscape(query, {
      literatureLimit: limit,
      trialLimit: limit,
      refresh,
    });
    printResult(landscape, wantsJson, printLandscape);
    return;
  }

  if (area === "literature" && command === "search") {
    rejectUnknownOptions(options, ["query", "limit", "open-access", "json", "refresh"]);
    if (positionals.length !== 2) throw new Error("Literature search accepts no positional query; use --query.");
    const query = getStringOption(options, "query", { required: true });
    const limit = parsePositiveInteger(getStringOption(options, "limit"), 20);
    const result = await searchLiterature(query, { limit, openAccessOnly: options.has("open-access"), refresh });
    printResult(result, wantsJson, printLiterature);
    return;
  }

  if (area === "preprints" && command === "search") {
    rejectUnknownOptions(options, ["query", "limit", "json", "refresh"]);
    if (positionals.length !== 2) throw new Error("Preprint search accepts no positional query; use --query.");
    const query = getStringOption(options, "query", { required: true });
    const limit = parsePositiveInteger(getStringOption(options, "limit"), 20);
    const result = await searchArxivPreprints(query, { limit, refresh });
    printResult(result, wantsJson, printPreprints);
    return;
  }

  if (area === "preprints" && command === "get") {
    rejectUnknownOptions(options, ["json", "refresh"]);
    if (!identifier || positionals.length !== 3) {
      throw new Error("Preprint get requires exactly one arXiv identifier.");
    }
    const result = await getArxivPreprint(identifier, { refresh });
    printResult(result, wantsJson, printPreprints);
    return;
  }

  if (area === "literature" && command === "get") {
    rejectUnknownOptions(options, ["json", "refresh"]);
    if (!identifier || positionals.length !== 3) {
      throw new Error("Literature get requires exactly one PMCID, PMID, or DOI.");
    }
    const result = await getLiteratureRecord(identifier, { refresh });
    printResult(result, wantsJson, printLiterature);
    return;
  }

  if (area === "literature" && command === "fetch") {
    rejectUnknownOptions(options, ["allow-noncommercial", "json", "refresh"]);
    if (!identifier || positionals.length !== 3) throw new Error("Literature fetch requires exactly one PMCID.");
    const result = await fetchOpenAccessFullText(identifier, {
      allowNoncommercial: options.has("allow-noncommercial"),
      refresh,
    });
    printResult(result, wantsJson, printCapture);
    return;
  }

  if (area === "trials" && command === "search") {
    rejectUnknownOptions(options, ["query", "limit", "json", "refresh"]);
    if (positionals.length !== 2) throw new Error("Trial search accepts no positional query; use --query.");
    const query = getStringOption(options, "query", { required: true });
    const limit = parsePositiveInteger(getStringOption(options, "limit"), 20);
    const result = await searchTrials(query, { limit, refresh });
    printResult(result, wantsJson, printTrials);
    return;
  }

  if (area === "trials" && command === "get") {
    rejectUnknownOptions(options, ["json", "refresh"]);
    if (!identifier || positionals.length !== 3) throw new Error("Trial get requires exactly one NCT identifier.");
    const result = await getTrialStudy(identifier, { refresh });
    printResult(result, wantsJson, printTrials);
    return;
  }

  throw new Error(`Unknown biomedical command: ${positionals.join(" ")}. Use --help for details.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

import { createHash } from "node:crypto";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";

import {
  validateValuationHorizonContract,
  valuationTableSemanticErrors,
} from "./valuation-horizon.mjs";
import { validateOperatingForecastContract } from "./operating-forecast.mjs";

export {
  validateValuationHorizonContract,
  valuationTableSemanticErrors,
} from "./valuation-horizon.mjs";

const canonicalTypes = {
  report: new Set(["company_report", "company_thesis"]),
  valuation: new Set(["valuation"]),
  decision: new Set(["decision"]),
};

const canonicalFields = {
  report: "final_report_path",
  valuation: "valuation_path",
  decision: "decision_path",
};

const reviewStatuses = new Set(["not_requested", "pending", "passed", "failed", "stale"]);

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "null" || value === "~") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value)) return Number(value);
  if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    const body = value.slice(1, -1).trim();
    if (!body) return [];
    return body.split(",").map((item) => parseScalar(item));
  }
  if (value.startsWith("{") || value.startsWith("[")) {
    throw new Error("Nested front-matter collections are not supported");
  }
  return value;
}

export function parseDocumentFrontMatter(markdown) {
  const normalized = markdown.replaceAll("\r\n", "\n");
  if (!normalized.startsWith("---\n")) throw new Error("File must start with YAML front matter.");
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("YAML front matter is missing its closing delimiter.");

  const record = {};
  for (const [index, line] of normalized.slice(4, end).split("\n").entries()) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!match) throw new Error(`Invalid flat front matter on line ${index + 2}: ${line}`);
    const [, key, rawValue] = match;
    if (Object.hasOwn(record, key)) throw new Error(`Duplicate front-matter field: ${key}`);
    record[key] = parseScalar(rawValue);
  }
  return record;
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function filesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesRecursively(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path === "" || (!path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path));
}

function displayPath(repositoryRoot, path) {
  return relative(repositoryRoot, path).split(sep).join("/");
}

function finding(level, check, message, path = null) {
  return { level, check, message, path };
}

function declaredPath(repositoryRoot, documentPath, value) {
  if (typeof value !== "string" || !value.trim()) return null;
  if (isAbsolute(value)) return resolve(value);
  if (value.startsWith("companies/")) return resolve(repositoryRoot, value);
  return resolve(dirname(documentPath), value);
}

function sha256(text) {
  return `sha256:${createHash("sha256").update(text).digest("hex")}`;
}

function markdownTargets(markdown, documentPath, repositoryRoot) {
  const targets = [];
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim();
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    target = target.split(/\s+["']/)[0];
    if (!target || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const withoutFragment = target.split("#", 1)[0];
    if (!withoutFragment) continue;
    let decoded;
    try {
      decoded = decodeURIComponent(withoutFragment);
    } catch {
      decoded = withoutFragment;
    }
    const resolved = decoded.startsWith("/")
      ? resolve(repositoryRoot, decoded.slice(1))
      : resolve(dirname(documentPath), decoded);
    targets.push({ raw: target, resolved });
  }
  return targets;
}

function required(record, fields, add) {
  for (const field of fields) {
    if (record[field] === undefined || record[field] === null || record[field] === "") {
      add("coverage-cycle-contract", `Missing required field: ${field}`);
    }
  }
}

async function readRecord(path, repositoryRoot, findings, check = "front-matter") {
  const text = await readFile(path, "utf8").catch(() => null);
  if (text === null) {
    findings.push(finding("error", check, "Cannot read file.", displayPath(repositoryRoot, path)));
    return null;
  }
  try {
    return { path, text, record: parseDocumentFrontMatter(text) };
  } catch (error) {
    findings.push(finding("error", check, error.message, displayPath(repositoryRoot, path)));
    return null;
  }
}

async function readJsonRecord(path, repositoryRoot, findings, check) {
  const text = await readFile(path, "utf8").catch(() => null);
  if (text === null) {
    findings.push(finding("error", check, "Cannot read file.", displayPath(repositoryRoot, path)));
    return null;
  }
  try {
    return { path, text, record: JSON.parse(text) };
  } catch (error) {
    findings.push(
      finding("error", check, `Invalid JSON: ${error.message}`, displayPath(repositoryRoot, path)),
    );
    return null;
  }
}

async function canonicalRecords(companyRoot, cycleId, repositoryRoot, findings) {
  const records = [];
  for (const path of await filesRecursively(companyRoot)) {
    if (extname(path) !== ".md") continue;
    const text = await readFile(path, "utf8");
    if (!text.startsWith("---\n") || !text.includes("coverage_cycle_id:")) continue;
    try {
      const record = parseDocumentFrontMatter(text);
      if (record.coverage_cycle_id === cycleId) records.push({ path, text, record });
    } catch (error) {
      findings.push(
        finding("error", "front-matter", error.message, displayPath(repositoryRoot, path)),
      );
    }
  }
  return records;
}

async function validateHashField(record, field, targetPath, repositoryRoot, findings, manifestPath) {
  const expected = record[field];
  if (!expected) return;
  const content = await readFile(targetPath, "utf8").catch(() => null);
  if (content === null) {
    findings.push(
      finding(
        "error",
        "coverage-cycle-hash",
        `${field} cannot be verified because ${displayPath(repositoryRoot, targetPath)} is unreadable.`,
        displayPath(repositoryRoot, manifestPath),
      ),
    );
    return;
  }
  const actual = sha256(content);
  if (expected !== actual) {
    findings.push(
      finding(
        "error",
        "coverage-cycle-hash",
        `${field} is ${expected}, but ${displayPath(repositoryRoot, targetPath)} hashes to ${actual}.`,
        displayPath(repositoryRoot, manifestPath),
      ),
    );
  }
}

async function validateManifest(repositoryRoot, manifestPath) {
  const findings = [];
  const manifest = await readRecord(manifestPath, repositoryRoot, findings, "coverage-cycle-manifest");
  if (!manifest) return { valid: false, manifestPath, cycleId: null, findings };

  const record = manifest.record;
  const companyRoot = resolve(dirname(manifestPath), "../..");
  const add = (check, message, level = "error") => {
    findings.push(finding(level, check, message, displayPath(repositoryRoot, manifestPath)));
  };

  required(
    record,
    [
      "type",
      "coverage_cycle_id",
      "company",
      "ticker",
      "cycle_number",
      "cycle_kind",
      "iso_week",
      "status",
      "research_status",
      "started_at",
      "as_of",
      "final_report_path",
      "valuation_path",
      "decision_path",
      "valuation_contract_path",
      "review_status",
    ],
    add,
  );

  if (record.type !== "company_coverage_cycle") {
    add("coverage-cycle-contract", "type must be company_coverage_cycle.");
  }
  if (!/^\d{4}-W\d{2}$/.test(String(record.iso_week ?? ""))) {
    add("coverage-cycle-contract", "iso_week must use YYYY-Www.");
  }
  if (!Number.isInteger(record.cycle_number) || record.cycle_number < 1) {
    add("coverage-cycle-contract", "cycle_number must be a positive integer.");
  }
  if (!new Set(["active", "complete", "superseded", "withdrawn"]).has(record.status)) {
    add("coverage-cycle-contract", "status must be active, complete, superseded, or withdrawn.");
  }
  if (!new Set(["researching", "draft", "published", "superseded", "withdrawn"]).has(record.research_status)) {
    add(
      "coverage-cycle-contract",
      "research_status must be researching, draft, published, superseded, or withdrawn.",
    );
  }
  if (!reviewStatuses.has(record.review_status)) {
    add(
      "coverage-cycle-review",
      "review_status must be not_requested, pending, passed, failed, or stale.",
    );
  }

  const paddedCycle = Number.isInteger(record.cycle_number)
    ? String(record.cycle_number).padStart(2, "0")
    : null;
  const expectedCycleId = paddedCycle ? `${record.ticker}-${record.iso_week}-${paddedCycle}` : null;
  if (expectedCycleId && record.coverage_cycle_id !== expectedCycleId) {
    add("coverage-cycle-contract", `coverage_cycle_id must equal ${expectedCycleId}.`);
  }
  const expectedDirectory = paddedCycle
    ? `${record.iso_week}-${paddedCycle}-${record.cycle_kind}`
    : null;
  if (expectedDirectory && basename(dirname(manifestPath)) !== expectedDirectory) {
    add("coverage-cycle-contract", `Manifest directory must be named ${expectedDirectory}.`);
  }
  if (record.source_cutoff_at !== null && record.source_cutoff_at !== undefined) {
    if (!Number.isFinite(Date.parse(record.source_cutoff_at))) {
      add("coverage-cycle-cutoff", "source_cutoff_at must be null or an ISO-8601 timestamp.");
    }
  }

  const canonical = {};
  for (const [kind, field] of Object.entries(canonicalFields)) {
    const target = declaredPath(repositoryRoot, manifestPath, record[field]);
    canonical[kind] = target;
    if (!target) continue;
    if (!inside(companyRoot, target)) {
      add("coverage-cycle-path", `${field} must stay inside ${displayPath(repositoryRoot, companyRoot)}.`);
      continue;
    }
    if (!(await pathExists(target))) {
      add("coverage-cycle-path", `${field} does not exist: ${displayPath(repositoryRoot, target)}.`);
      continue;
    }
    if (!(await stat(target)).isFile()) add("coverage-cycle-path", `${field} must reference a file.`);
  }
  const valuationContractPath = declaredPath(
    repositoryRoot,
    manifestPath,
    record.valuation_contract_path,
  );
  canonical.contract = valuationContractPath;
  if (!valuationContractPath) {
    add("valuation-horizon-contract", "valuation_contract_path is required.");
  } else if (!inside(companyRoot, valuationContractPath)) {
    add(
      "valuation-horizon-contract",
      `valuation_contract_path must stay inside ${displayPath(repositoryRoot, companyRoot)}.`,
    );
  } else if (!(await pathExists(valuationContractPath))) {
    add(
      "valuation-horizon-contract",
      `valuation_contract_path does not exist: ${displayPath(repositoryRoot, valuationContractPath)}.`,
    );
  } else if (extname(valuationContractPath) !== ".json") {
    add("valuation-horizon-contract", "valuation_contract_path must reference JSON.");
  }

  const declaredForecastPath = record.forecast_path
    ? declaredPath(repositoryRoot, manifestPath, record.forecast_path)
    : null;
  canonical.forecast = declaredForecastPath;
  let forecastContractPath = null;
  if (declaredForecastPath) {
    if (!inside(companyRoot, declaredForecastPath)) {
      add("coverage-cycle-path", "forecast_path must stay inside the company root.");
    } else if (!(await pathExists(declaredForecastPath))) {
      add(
        "coverage-cycle-path",
        `forecast_path does not exist: ${displayPath(repositoryRoot, declaredForecastPath)}.`,
      );
    } else if (extname(declaredForecastPath) === ".json") {
      forecastContractPath = declaredForecastPath;
      const forecastContract = await readJsonRecord(
        forecastContractPath,
        repositoryRoot,
        findings,
        "operating-forecast-contract",
      );
      if (forecastContract) {
        for (const message of validateOperatingForecastContract(forecastContract.record)) {
          findings.push(
            finding(
              "error",
              "operating-forecast-contract",
              message,
              displayPath(repositoryRoot, forecastContractPath),
            ),
          );
        }
        if (forecastContract.record.coverage_cycle_id !== record.coverage_cycle_id) {
          add("operating-forecast-contract", "The operating forecast coverage_cycle_id must match the cycle manifest.");
        }
        if (forecastContract.record.source_cutoff_at !== record.source_cutoff_at) {
          add("operating-forecast-contract", "The operating forecast source cutoff must match the cycle manifest.");
        }
        if (forecastContract.record.as_of !== record.as_of) {
          add("operating-forecast-contract", "The operating forecast as_of date must match the cycle manifest.");
        }
      }
    }
  }

  if (canonical.report && basename(canonical.report) !== `${record.iso_week}-final-report.md`) {
    add("coverage-cycle-path", `final_report_path must end in ${record.iso_week}-final-report.md.`);
  }
  if (canonical.valuation && basename(canonical.valuation) !== `${record.iso_week}-valuation.md`) {
    add("coverage-cycle-path", `valuation_path must end in ${record.iso_week}-valuation.md.`);
  }
  if (canonical.decision && basename(canonical.decision) !== `${record.iso_week}-decision.md`) {
    add("coverage-cycle-path", `decision_path must end in ${record.iso_week}-decision.md.`);
  }

  const records = await canonicalRecords(
    companyRoot,
    record.coverage_cycle_id,
    repositoryRoot,
    findings,
  );
  const canonicalDocuments = {};
  for (const [kind, types] of Object.entries(canonicalTypes)) {
    const matches = records.filter(({ record: candidate }) => types.has(candidate.type));
    if (matches.length !== 1) {
      add(
        "coverage-cycle-cardinality",
        `Expected exactly one ${kind} for ${record.coverage_cycle_id}; found ${matches.length}.`,
      );
      continue;
    }
    canonicalDocuments[kind] = matches[0];
    if (canonical[kind] && resolve(matches[0].path) !== resolve(canonical[kind])) {
      add(
        "coverage-cycle-cardinality",
        `${canonicalFields[kind]} does not identify the only ${kind} for this cycle.`,
      );
    }
  }

  const matchingFields = [
    "coverage_cycle_id",
    "company",
    "ticker",
    "identity_path",
    "identity_hash",
    "security_id",
    "listing_id",
  ];
  const commonDocumentFields = [
    "coverage_cycle_id",
    "company",
    "ticker",
    "coverage_cycle_path",
    "identity_path",
    "identity_hash",
    "security_id",
    "listing_id",
    "valuation_contract_path",
    "valuation_quantity",
    "valuation_display_semantics",
  ];
  for (const [kind, document] of Object.entries(canonicalDocuments)) {
    const kindFields = kind === "decision"
      ? ["research_cutoff", "thesis_path", "valuation_path"]
      : kind === "report"
        ? ["research_status", "source_cutoff_at", "supersedes"]
        : ["status", "source_cutoff_at", "supersedes"];
    for (const field of [...commonDocumentFields, ...kindFields]) {
      if (
        document.record[field] === undefined ||
        document.record[field] === null && field !== "supersedes" ||
        document.record[field] === ""
      ) {
        findings.push(
          finding(
            "error",
            "coverage-cycle-contract",
            `${kind} is missing required field: ${field}.`,
            displayPath(repositoryRoot, document.path),
          ),
        );
      }
    }
  }
  for (const field of matchingFields) {
    const values = Object.values(canonicalDocuments)
      .map(({ record: document }) => document[field])
      .filter((value) => value !== undefined);
    if (field === "company" || field === "ticker" || field === "coverage_cycle_id") values.push(record[field]);
    if (new Set(values.map(String)).size > 1) {
      add("coverage-cycle-alignment", `${field} must agree across the manifest, report, valuation, and decision.`);
    }
  }

  const cutoffs = Object.entries(canonicalDocuments)
    .map(([kind, { record: document }]) =>
      kind === "decision" ? document.research_cutoff : document.source_cutoff_at,
    )
    .filter((value) => value !== undefined && value !== null);
  if (record.source_cutoff_at !== null && record.source_cutoff_at !== undefined) {
    cutoffs.push(record.source_cutoff_at);
  }
  if (new Set(cutoffs).size > 1) {
    add("coverage-cycle-cutoff", "The source cutoff must agree across all canonical cycle artifacts.");
  }

  const expectedDocumentStatus = record.research_status === "published"
    ? "published"
    : ["superseded", "withdrawn"].includes(record.research_status)
      ? record.research_status
      : "draft";
  if (
    canonicalDocuments.report &&
    canonicalDocuments.report.record.research_status !== expectedDocumentStatus
  ) {
    add(
      "coverage-cycle-state",
      `Report research_status must be ${expectedDocumentStatus} while the cycle is ${record.research_status}.`,
    );
  }
  if (
    canonicalDocuments.valuation &&
    canonicalDocuments.valuation.record.status !== expectedDocumentStatus
  ) {
    add(
      "coverage-cycle-state",
      `Valuation status must be ${expectedDocumentStatus} while the cycle is ${record.research_status}.`,
    );
  }

  if (canonicalDocuments.decision) {
    for (const [field, kind] of [["thesis_path", "report"], ["valuation_path", "valuation"]]) {
      const target = declaredPath(
        repositoryRoot,
        canonicalDocuments.decision.path,
        canonicalDocuments.decision.record[field],
      );
      if (!target || !canonical[kind] || resolve(target) !== resolve(canonical[kind])) {
        findings.push(
          finding(
            "error",
            "coverage-cycle-linkage",
            `Decision ${field} must resolve to the canonical ${kind}.`,
            displayPath(repositoryRoot, canonicalDocuments.decision.path),
          ),
        );
      }
    }
  }

  for (const [kind, document] of Object.entries(canonicalDocuments)) {
    const pathBack = declaredPath(repositoryRoot, document.path, document.record.coverage_cycle_path);
    if (!pathBack || resolve(pathBack) !== resolve(manifestPath)) {
      findings.push(
        finding(
          "error",
          "coverage-cycle-linkage",
          `${kind} coverage_cycle_path must resolve back to the manifest.`,
          displayPath(repositoryRoot, document.path),
        ),
      );
    }
    const contractBack = declaredPath(
      repositoryRoot,
      document.path,
      document.record.valuation_contract_path,
    );
    if (
      !contractBack ||
      !valuationContractPath ||
      resolve(contractBack) !== resolve(valuationContractPath)
    ) {
      findings.push(
        finding(
          "error",
          "valuation-horizon-linkage",
          `${kind} valuation_contract_path must resolve to the cycle's canonical contract.`,
          displayPath(repositoryRoot, document.path),
        ),
      );
    }
    for (const message of valuationTableSemanticErrors(document.text)) {
      findings.push(
        finding(
          "error",
          "valuation-display-semantics",
          message,
          displayPath(repositoryRoot, document.path),
        ),
      );
    }
    const supersedes = document.record.supersedes;
    if (supersedes !== null && supersedes !== undefined && supersedes !== "") {
      const priorPath = declaredPath(repositoryRoot, document.path, supersedes);
      if (!priorPath || !(await pathExists(priorPath))) {
        findings.push(
          finding(
            "error",
            "coverage-cycle-supersession",
            `${kind} supersedes must be null or reference an existing prior-cycle artifact.`,
            displayPath(repositoryRoot, document.path),
          ),
        );
      } else {
        const prior = await readRecord(priorPath, repositoryRoot, findings);
        if (prior?.record.coverage_cycle_id === record.coverage_cycle_id) {
          findings.push(
            finding(
              "error",
              "coverage-cycle-supersession",
              `${kind} must not supersede an artifact from the same coverage cycle.`,
              displayPath(repositoryRoot, document.path),
            ),
          );
        }
      }
    }
  }

  let valuationContract = null;
  let contractModelPath = null;
  let contractVerifierPath = null;
  if (
    valuationContractPath &&
    inside(companyRoot, valuationContractPath) &&
    (await pathExists(valuationContractPath))
  ) {
    valuationContract = await readJsonRecord(
      valuationContractPath,
      repositoryRoot,
      findings,
      "valuation-horizon-contract",
    );
    if (valuationContract) {
      for (const message of validateValuationHorizonContract(valuationContract.record)) {
        findings.push(
          finding(
            "error",
            "valuation-horizon-contract",
            message,
            displayPath(repositoryRoot, valuationContractPath),
          ),
        );
      }

      const contract = valuationContract.record;
      if (contract.coverage_cycle_id !== record.coverage_cycle_id) {
        add(
          "valuation-horizon-alignment",
          "The valuation contract coverage_cycle_id must match the cycle manifest.",
        );
      }
      if (contract.source_cutoff_at !== record.source_cutoff_at) {
        add(
          "valuation-horizon-alignment",
          "The valuation contract source cutoff must match the canonical cycle cutoff.",
        );
      }
      if (contract.as_of !== record.as_of) {
        add(
          "valuation-horizon-alignment",
          "The valuation contract as_of date must match the coverage-cycle manifest.",
        );
      }

      contractModelPath = declaredPath(
        repositoryRoot,
        valuationContractPath,
        contract.model?.code_path,
      );
      contractVerifierPath = declaredPath(
        repositoryRoot,
        valuationContractPath,
        contract.model?.verifier_path,
      );
      for (const [kind, target] of [
        ["model", contractModelPath],
        ["verifier", contractVerifierPath],
      ]) {
        const validTarget =
          target &&
          inside(companyRoot, target) &&
          (await pathExists(target)) &&
          (await stat(target)).isFile();
        if (!validTarget) {
          findings.push(
            finding(
              "error",
              "valuation-horizon-model",
              `The valuation contract ${kind} path must reference an existing file inside the company root.`,
              displayPath(repositoryRoot, valuationContractPath),
            ),
          );
        }
      }

      const primary = Array.isArray(contract.horizons)
        ? contract.horizons.find(({ date }) => date === contract.primary_horizon)
        : null;
      const rounded = (value, digits) =>
        typeof value === "number" ? Number(value.toFixed(digits)) : value;
      for (const kind of ["report", "valuation"]) {
        const document = canonicalDocuments[kind];
        if (!document || !primary) continue;
        const expected = {
          valuation_quantity: contract.valuation_quantity,
          valuation_display_semantics: contract.display_semantics,
          as_of: contract.as_of,
          currency: contract.currency,
          reference_price: contract.reference_price,
          reference_price_at: contract.reference_price_at,
          reference_price_source: contract.reference_price_source,
          target_bear: null,
          target_base: null,
          target_bull: null,
          primary_distribution_p10: rounded(primary.p10, 2),
          primary_distribution_p50: rounded(primary.p50, 2),
          primary_distribution_p90: rounded(primary.p90, 2),
          primary_distribution_mean: rounded(primary.mean, 2),
          target_horizon: contract.primary_horizon,
          distribution_method: contract.model?.version,
          distribution_calibration_status: contract.model?.calibration_status,
          distribution_seed: contract.model?.seed,
          distribution_sample_count: contract.model?.sample_count,
        };
        for (const [field, value] of Object.entries(expected)) {
          if (document.record[field] !== value) {
            findings.push(
              finding(
                "error",
                "valuation-horizon-alignment",
                `${kind} ${field} must equal the valuation contract value ${value}.`,
                displayPath(repositoryRoot, document.path),
              ),
            );
          }
        }
      }

      const decisionDocument = canonicalDocuments.decision;
      if (decisionDocument) {
        const expectedDecision = {
          valuation_quantity: contract.valuation_quantity,
          valuation_display_semantics: contract.display_semantics,
          price: contract.reference_price,
          price_at: contract.reference_price_at,
          price_source: contract.reference_price_source,
          target_horizon: contract.primary_horizon,
        };
        for (const [field, value] of Object.entries(expectedDecision)) {
          if (decisionDocument.record[field] !== value) {
            findings.push(
              finding(
                "error",
                "valuation-horizon-alignment",
                `decision ${field} must equal the valuation contract value ${value}.`,
                displayPath(repositoryRoot, decisionDocument.path),
              ),
            );
          }
        }
        if (
          primary &&
          decisionDocument.record.modeled_mean_fair_value_upside_pct !== undefined
        ) {
          const expectedUpside = rounded(
            (primary.mean / contract.reference_price - 1) * 100,
            1,
          );
          if (decisionDocument.record.modeled_mean_fair_value_upside_pct !== expectedUpside) {
            findings.push(
              finding(
                "error",
                "valuation-horizon-alignment",
                `decision modeled_mean_fair_value_upside_pct must equal ${expectedUpside}.`,
                displayPath(repositoryRoot, decisionDocument.path),
              ),
            );
          }
        }
      }

      for (const [kind, document] of Object.entries(canonicalDocuments)) {
        const linked = new Set(
          markdownTargets(document.text, document.path, repositoryRoot).map(({ resolved }) =>
            resolve(resolved),
          ),
        );
        if (!linked.has(resolve(valuationContractPath))) {
          findings.push(
            finding(
              "error",
              "valuation-horizon-linkage",
              `${kind} must link the canonical valuation-horizon contract in its body.`,
              displayPath(repositoryRoot, document.path),
            ),
          );
        }
      }
    }
  }

  const manifestTargets = new Set(markdownTargets(manifest.text, manifestPath, repositoryRoot).map(({ resolved }) => resolve(resolved)));
  for (const [kind, target] of Object.entries(canonical)) {
    if (target && !manifestTargets.has(resolve(target))) {
      add("coverage-cycle-navigation", `Manifest must link its canonical ${kind}.`);
    }
  }

  const landingPath = resolve(companyRoot, "README.md");
  const landingText = await readFile(landingPath, "utf8").catch(() => null);
  if (landingText === null) {
    add("coverage-cycle-navigation", "Company landing page README.md is missing.");
  } else {
    const landingTargets = new Set(
      markdownTargets(landingText, landingPath, repositoryRoot).map(({ resolved }) => resolve(resolved)),
    );
    for (const [kind, target] of Object.entries(canonical)) {
      if (target && !landingTargets.has(resolve(target))) {
        findings.push(
          finding(
            "error",
            "coverage-cycle-navigation",
            `Company landing page must link its canonical ${kind}.`,
            displayPath(repositoryRoot, landingPath),
          ),
        );
      }
    }
  }

  const publicDocuments = [manifest, ...Object.values(canonicalDocuments)];
  if (landingText !== null) publicDocuments.push({ path: landingPath, text: landingText });
  for (const document of publicDocuments) {
    for (const target of markdownTargets(document.text, document.path, repositoryRoot)) {
      if (!inside(repositoryRoot, target.resolved) || !(await pathExists(target.resolved))) {
        findings.push(
          finding(
            "error",
            "coverage-cycle-navigation",
            `Broken local link: ${target.raw}`,
            displayPath(repositoryRoot, document.path),
          ),
        );
      }
    }
  }

  if (record.review_status !== "passed") {
    for (const document of publicDocuments) {
      const positiveReadinessClaim =
        /\banalytical dossier:\s*pass\b/i.test(document.text) ||
        /^\s*draft,\s*release[- ]ready[.!]?\s*$/im.test(document.text) ||
        /\|\s*(?:draft,\s*)?release[- ]ready\s*\|/i.test(document.text) ||
        /\b(?:is|are|status(?:\s+is|:))\s+(?:complete and\s+)?release[- ]ready\b/i.test(
          document.text,
        );
      if (positiveReadinessClaim) {
        findings.push(
          finding(
            "error",
            "coverage-cycle-review",
            "A cycle without a passed current review must not be described as release-ready or passed.",
            displayPath(repositoryRoot, document.path),
          ),
        );
      }
    }
  }

  const finalized = record.status === "complete" || record.research_status === "published";
  if (finalized) {
    if (record.review_status !== "passed") {
      add("coverage-cycle-finalization", "A finalized cycle requires review_status: passed.");
    }
    required(
      record,
      [
        "finalized_at",
        "final_report_hash",
        "valuation_hash",
        "decision_hash",
        "valuation_contract_hash",
        "review_path",
        "review_hash",
        "reviewed_at",
        "model_hash",
        "verifier_hash",
      ],
      add,
    );
    if (forecastContractPath) required(record, ["forecast_hash"], add);
  }
  if (record.finalized_at && !Number.isFinite(Date.parse(record.finalized_at))) {
    add("coverage-cycle-finalization", "finalized_at must be an ISO-8601 timestamp.");
  }
  if (canonical.report) {
    await validateHashField(record, "final_report_hash", canonical.report, repositoryRoot, findings, manifestPath);
  }
  if (canonical.valuation) {
    await validateHashField(record, "valuation_hash", canonical.valuation, repositoryRoot, findings, manifestPath);
  }
  if (canonical.decision) {
    await validateHashField(record, "decision_hash", canonical.decision, repositoryRoot, findings, manifestPath);
  }
  if (canonical.contract) {
    await validateHashField(
      record,
      "valuation_contract_hash",
      canonical.contract,
      repositoryRoot,
      findings,
      manifestPath,
    );
  }
  if (forecastContractPath) {
    await validateHashField(
      record,
      "forecast_hash",
      forecastContractPath,
      repositoryRoot,
      findings,
      manifestPath,
    );
  }
  if (record.reviewed_at && !Number.isFinite(Date.parse(record.reviewed_at))) {
    add("coverage-cycle-review", "reviewed_at must be an ISO-8601 timestamp.");
  }
  let reviewDocument = null;
  if (record.review_path) {
    const reviewPath = declaredPath(repositoryRoot, manifestPath, record.review_path);
    if (!reviewPath || !inside(companyRoot, reviewPath) || !(await pathExists(reviewPath))) {
      add("coverage-cycle-finalization", "review_path must reference an existing file inside the company root.");
    } else {
      reviewDocument = await readRecord(
        reviewPath,
        repositoryRoot,
        findings,
        "independent-review",
      );
      await validateHashField(record, "review_hash", reviewPath, repositoryRoot, findings, manifestPath);
    }
  }
  if (reviewDocument) {
    const review = reviewDocument.record;
    const reviewPath = displayPath(repositoryRoot, reviewDocument.path);
    const reviewAdd = (message) => {
      findings.push(finding("error", "coverage-cycle-review", message, reviewPath));
    };
    if (review.type !== "independent_review") {
      reviewAdd("A review_path record must have type: independent_review.");
    }
    for (const field of ["coverage_cycle_id", "company", "ticker"]) {
      if (review[field] !== record[field]) {
        reviewAdd(`${field} must match the coverage-cycle manifest.`);
      }
    }
    if (
      record.review_status !== "not_requested" &&
      review.review_status !== record.review_status
    ) {
      reviewAdd("The review record status must match the coverage-cycle manifest.");
    }
  }
  if (record.review_status === "passed") {
    required(
      record,
      [
        "reviewed_at",
        "final_report_hash",
        "valuation_hash",
        "decision_hash",
        "valuation_contract_hash",
        "review_path",
        "review_hash",
        "model_hash",
        "verifier_hash",
      ],
      add,
    );
    if (forecastContractPath) required(record, ["forecast_hash"], add);
    if (reviewDocument) {
      const review = reviewDocument.record;
      const reviewPath = displayPath(repositoryRoot, reviewDocument.path);
      const reviewAdd = (message) => {
        findings.push(finding("error", "coverage-cycle-review", message, reviewPath));
      };
      if (review.reviewed_at !== record.reviewed_at) {
        reviewAdd("The review record reviewed_at must match the coverage-cycle manifest.");
      }
      if (!new Set(["human", "independent_agent"]).has(review.reviewer_independence)) {
        reviewAdd(
          "A passed independent review must identify a human or independent-agent reviewer; a same-session self-check is not independent.",
        );
      }
      const reviewHashFields = {
        reviewed_final_report_hash: "final_report_hash",
        reviewed_valuation_hash: "valuation_hash",
        reviewed_decision_hash: "decision_hash",
        reviewed_contract_hash: "valuation_contract_hash",
        reviewed_model_hash: "model_hash",
        reviewed_verifier_hash: "verifier_hash",
      };
      if (forecastContractPath) reviewHashFields.reviewed_forecast_hash = "forecast_hash";
      for (const [reviewField, manifestField] of Object.entries(reviewHashFields)) {
        if (!review[reviewField] || review[reviewField] !== record[manifestField]) {
          reviewAdd(`${reviewField} must match manifest ${manifestField}.`);
        }
      }
    }
    if (contractModelPath) {
      await validateHashField(
        record,
        "model_hash",
        contractModelPath,
        repositoryRoot,
        findings,
        manifestPath,
      );
    }
    if (contractVerifierPath) {
      await validateHashField(
        record,
        "verifier_hash",
        contractVerifierPath,
        repositoryRoot,
        findings,
        manifestPath,
      );
    }
  }

  if (record.prior_cycle_path) {
    const priorPath = declaredPath(repositoryRoot, manifestPath, record.prior_cycle_path);
    const prior = priorPath && (await pathExists(priorPath))
      ? await readRecord(priorPath, repositoryRoot, findings)
      : null;
    if (!prior) add("coverage-cycle-prior", "prior_cycle_path must reference an existing prior manifest.");
    else {
      if (prior.record.coverage_cycle_id === record.coverage_cycle_id) {
        add("coverage-cycle-prior", "prior_cycle_path must reference a different coverage cycle.");
      }
      if (prior.record.status !== "complete" && prior.record.research_status !== "published") {
        add("coverage-cycle-prior", "A prior cycle must be finalized before a later cycle compares with it.");
      }
    }
  }

  return {
    valid: !findings.some(({ level }) => level === "error"),
    manifestPath: displayPath(repositoryRoot, manifestPath),
    cycleId: record.coverage_cycle_id ?? null,
    findings,
  };
}

async function discoverManifests(repositoryRoot, target = null) {
  const resolvedTarget = target ? resolve(repositoryRoot, target) : resolve(repositoryRoot, "companies");
  if (!(await pathExists(resolvedTarget))) throw new Error(`Coverage-cycle target does not exist: ${target ?? "companies"}`);
  const targetStat = await stat(resolvedTarget);
  if (targetStat.isFile()) return [resolvedTarget];
  return (await filesRecursively(resolvedTarget))
    .filter((path) => basename(path) === "README.md" && path.includes(`${sep}coverage-cycles${sep}`))
    .sort();
}

export async function validateCoverageCycles(repositoryRoot, target = null) {
  const manifests = await discoverManifests(repositoryRoot, target);
  const cycles = [];
  for (const manifestPath of manifests) cycles.push(await validateManifest(repositoryRoot, manifestPath));
  const findings = cycles.flatMap(({ findings: cycleFindings }) => cycleFindings);
  if (manifests.length === 0) {
    findings.push(finding("warning", "coverage-cycle", "No coverage-cycle manifests found."));
  }
  return {
    valid: !findings.some(({ level }) => level === "error"),
    repositoryRoot,
    cycleCount: cycles.length,
    cycles: cycles.map(({ findings: _findings, ...cycle }) => cycle),
    findings,
  };
}

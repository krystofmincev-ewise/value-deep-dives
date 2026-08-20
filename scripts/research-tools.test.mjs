import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  flattenConceptFacts,
  getFilingIndexUrl,
  getFilingUrl,
  getRetryDelayMilliseconds,
  parsePositiveInteger,
} from "./research-tools.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = join(scriptDirectory, "research-tools.mjs");

function runCli(argumentsList, environment = {}) {
  return spawnSync(process.execPath, [cliPath, ...argumentsList], {
    encoding: "utf8",
    env: { ...process.env, ...environment },
  });
}

test("help documents the supported commands", () => {
  const result = runCli(["--help"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /sec filings <ticker>/);
  assert.match(result.stdout, /sec facts <ticker>/);
  assert.match(result.stdout, /research-tools\.mjs init/);
  assert.match(result.stdout, /research-browser\.mjs workspace/);
  assert.match(result.stdout, /research-workflow\.mjs gemini/);
  assert.match(result.stdout, /research-workflow\.mjs revelio/);
  assert.match(result.stdout, /research-workflow\.mjs youtube/);
  assert.match(result.stdout, /research-archive\.mjs open/);
  assert.match(result.stdout, /research-biomed\.mjs landscape/);
  assert.match(result.stdout, /research-biomed\.mjs preprints search/);
});

test("status reports only configuration presence, never values", () => {
  const secretValues = {
    SEC_USER_AGENT: "private-sec-contact",
  };
  const result = runCli(["status", "--json"], secretValues);

  assert.equal(result.status, 0);
  const status = JSON.parse(result.stdout);
  assert.deepEqual(status.configuration, {
    SEC_USER_AGENT: true,
  });
  assert.deepEqual(status.repository.skills, {
    "gemini-deep-research": true,
    "archive-ph-research": true,
    "biopharma-evidence-research": true,
    "company-investment-research": true,
    "event-driven-investment-research": true,
    "forecast-evaluation": true,
    "ft-source-discovery": true,
    "youtube-interview-research": true,
    "revelio-workforce-research": true,
  });

  for (const value of Object.values(secretValues)) {
    assert.doesNotMatch(result.stdout, new RegExp(value));
  }
});

test("SEC limits reject partially numeric values", () => {
  const result = runCli(["sec", "filings", "SNAP", "--limit", "20junk"], {
    SEC_USER_AGENT: "Value Deep Dives test@example.com",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Expected a positive integer/);
});

test("SEC commands reject unknown, irrelevant, and extra arguments", () => {
  const unknown = runCli(["sec", "filings", "SNAP", "--unknown", "value"]);
  const irrelevant = runCli(["sec", "filings", "SNAP", "--concept", "Revenue"]);
  const extra = runCli(["sec", "facts", "SNAP", "EXTRA", "--concept", "Revenue"]);

  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unknown option/);
  assert.equal(irrelevant.status, 1);
  assert.match(irrelevant.stderr, /not supported for SEC filings/);
  assert.equal(extra.status, 1);
  assert.match(extra.stderr, /Expected `sec filings/);
});

test("SEC access fails closed without a declared user agent", () => {
  const result = runCli(["sec", "filings", "SNAP"], { SEC_USER_AGENT: "" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /SEC_USER_AGENT is required/);
});

test("SEC filing URLs preserve canonical accession structure", () => {
  assert.equal(
    getFilingUrl("0001564408", {
      accessionNumber: "0001564408-26-000010",
      primaryDocument: "snap-20251231.htm",
    }),
    "https://www.sec.gov/Archives/edgar/data/1564408/000156440826000010/snap-20251231.htm",
  );
  assert.equal(
    getFilingIndexUrl("0001564408", "0001564408-26-000010"),
    "https://www.sec.gov/Archives/edgar/data/1564408/000156440826000010/0001564408-26-000010-index.html",
  );
});

test("XBRL concept extraction returns namespace, unit, and values", () => {
  const result = flattenConceptFacts(
    {
      facts: {
        "us-gaap": {
          Revenues: {
            label: "Revenue",
            description: "Revenue description",
            units: { USD: [{ filed: "2026-02-04", val: 5 }] },
          },
        },
      },
    },
    "Revenues",
    "USD",
  );

  assert.equal(result.namespace, "us-gaap");
  assert.equal(result.unit, "USD");
  assert.deepEqual(result.values, [{ filed: "2026-02-04", val: 5 }]);
});

test("SEC Retry-After and numeric limits are bounded and strict", () => {
  const response = { headers: new Headers({ "retry-after": "120" }) };

  assert.equal(getRetryDelayMilliseconds(response, 0), 30_000);
  assert.equal(parsePositiveInteger("20", 1), 20);
  assert.throws(() => parsePositiveInteger("20junk", 1), /Expected a positive integer/);
});

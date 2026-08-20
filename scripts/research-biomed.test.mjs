import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  classifyLicense,
  normalizeLiteratureRecord,
  normalizeTrialStudy,
} from "./lib/biomed-client.mjs";
import {
  buildArxivSearchQuery,
  normalizeArxivIdentifier,
  parseArxivFeed,
} from "./lib/arxiv-client.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = join(scriptDirectory, "research-biomed.mjs");

function runCli(argumentsList) {
  return spawnSync(process.execPath, [cliPath, ...argumentsList], { encoding: "utf8" });
}

test("help documents preprint, literature, full-text, trial, and landscape workflows", () => {
  const result = runCli(["--help"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /landscape --query/);
  assert.match(result.stdout, /preprints search --query/);
  assert.match(result.stdout, /preprints get <ARXIV_ID>/);
  assert.match(result.stdout, /literature fetch <PMCID>/);
  assert.match(result.stdout, /trials get <NCT_ID>/);
  assert.match(result.stdout, /--allow-noncommercial/);
});

test("source inventory distinguishes implemented, complementary, and optional surfaces", () => {
  const result = runCli(["sources", "--json"]);

  assert.equal(result.status, 0);
  const sources = JSON.parse(result.stdout);
  assert.equal(sources.find(({ id }) => id === "europe-pmc").status, "implemented");
  assert.equal(sources.find(({ id }) => id === "arxiv").status, "implemented");
  assert.match(sources.find(({ id }) => id === "open-targets").kind, /MCP/);
  assert.match(sources.find(({ id }) => id === "scispace").status, /not installed/);
});

test("arXiv query construction treats adjacent terms as AND and preserves explicit OR", () => {
  assert.equal(
    buildArxivSearchQuery('"protein language model" OR biotech'),
    'all:"protein language model" OR all:"biotech"',
  );
  assert.equal(buildArxivSearchQuery("intismeran melanoma"), 'all:"intismeran" AND all:"melanoma"');
  assert.throws(() => buildArxivSearchQuery("melanoma OR"), /cannot end with a Boolean operator/);
});

test("arXiv identifiers accept current, versioned, legacy, and canonical URL forms", () => {
  assert.equal(normalizeArxivIdentifier("arXiv:2501.12948v2"), "2501.12948v2");
  assert.equal(normalizeArxivIdentifier("https://arxiv.org/abs/hep-ex/0307015"), "hep-ex/0307015");
  assert.throws(() => normalizeArxivIdentifier("not-an-arxiv-id"), /must look like/);
});

test("arXiv Atom parsing preserves provenance and labels the record as an unverified preprint", () => {
  const envelope = parseArxivFeed(`<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:arxiv="http://arxiv.org/schemas/atom">
      <updated>2026-08-20T00:00:00Z</updated>
      <opensearch:totalResults>1</opensearch:totalResults>
      <entry>
        <id>http://arxiv.org/abs/2501.12948v2</id>
        <updated>2025-02-10T00:00:00Z</updated>
        <published>2025-01-22T00:00:00Z</published>
        <title>Protein &amp; molecule models</title>
        <summary>A methods preprint.</summary>
        <author><name>Ada Example</name><arxiv:affiliation>Example Lab</arxiv:affiliation></author>
        <category term="cs.LG" scheme="http://arxiv.org/schemas/atom"/>
        <category term="q-bio.BM" scheme="http://arxiv.org/schemas/atom"/>
        <arxiv:primary_category term="q-bio.BM" scheme="http://arxiv.org/schemas/atom"/>
        <arxiv:comment>Accepted at ExampleConf</arxiv:comment>
        <arxiv:journal_ref>Example Journal 1 (2026)</arxiv:journal_ref>
        <arxiv:doi>10.1000/example</arxiv:doi>
        <link href="http://arxiv.org/abs/2501.12948v2" rel="alternate" type="text/html"/>
        <link title="pdf" href="http://arxiv.org/pdf/2501.12948v2" rel="related" type="application/pdf"/>
      </entry>
    </feed>`, { query: "protein molecule", apiQuery: 'all:"protein" AND all:"molecule"' });

  assert.equal(envelope.total, 1);
  assert.equal(envelope.source.feedUpdatedAt, "2026-08-20T00:00:00Z");
  assert.equal(envelope.records[0].identifiers.arxivBase, "2501.12948");
  assert.equal(envelope.records[0].identifiers.version, 2);
  assert.equal(envelope.records[0].title, "Protein & molecule models");
  assert.deepEqual(envelope.records[0].categories, ["cs.LG", "q-bio.BM"]);
  assert.equal(envelope.records[0].primaryCategory, "q-bio.BM");
  assert.equal(envelope.records[0].availabilityStatus, "active");
  assert.equal(envelope.records[0].evidenceState, "preprint");
  assert.equal(envelope.records[0].peerReview.verified, false);
  assert.equal(envelope.records[0].peerReview.status, "linked-publication-not-verified");
  assert.equal(envelope.records[0].links.abstract, "https://arxiv.org/abs/2501.12948v2");
});

test("CLI rejects missing queries, excessive limits, and unknown options before network access", () => {
  const missing = runCli(["literature", "search"]);
  const excessive = runCli(["trials", "search", "--query", "melanoma", "--limit", "101"]);
  const unknown = runCli(["sources", "--secret"]);

  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /--query is required/);
  assert.equal(excessive.status, 1);
  assert.match(excessive.stderr, /Maximum supported value is 100/);
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unknown option: --secret/);
});

test("literature normalization keeps identifiers, provenance links, abstract, and licence", () => {
  const record = normalizeLiteratureRecord({
    id: "12345678",
    source: "MED",
    pmid: "12345678",
    pmcid: "PMC1234567",
    doi: "10.1000/example",
    title: "Example randomized study",
    authorString: "Doe J, Roe R.",
    firstPublicationDate: "2026-01-02",
    abstractText: "Structured abstract.",
    isOpenAccess: "Y",
    license: "CC BY",
    hasPDF: "Y",
    fullTextUrlList: {
      fullTextUrl: [
        { availabilityCode: "OA", documentStyle: "html", site: "Europe_PMC", url: "https://example.test/oa" },
        { availabilityCode: "S", documentStyle: "doi", site: "DOI", url: "https://example.test/paywalled" },
      ],
    },
  });

  assert.deepEqual(record.identifiers, { pmid: "12345678", pmcid: "PMC1234567", doi: "10.1000/example" });
  assert.equal(record.abstract, "Structured abstract.");
  assert.equal(record.openAccess.licenseClass, "commercial-reuse-allowed");
  assert.deepEqual(record.openAccess.urls.map(({ url }) => url), ["https://example.test/oa"]);
  assert.equal(record.links.pubmed, "https://pubmed.ncbi.nlm.nih.gov/12345678/");
});

test("licence classifier is conservative for investment-research reuse", () => {
  assert.equal(classifyLicense("CC0"), "commercial-reuse-allowed");
  assert.equal(classifyLicense("CC BY-SA"), "commercial-reuse-allowed");
  assert.equal(classifyLicense("CC BY-NC"), "noncommercial-only");
  assert.equal(classifyLicense("publisher-specific"), "unknown");
  assert.equal(classifyLicense(undefined), "unknown");
});

test("trial normalization captures design and outcomes without contact details", () => {
  const record = normalizeTrialStudy({
    hasResults: true,
    protocolSection: {
      identificationModule: { nctId: "NCT01234567", briefTitle: "Example trial" },
      statusModule: { overallStatus: "COMPLETED", statusVerifiedDate: "2026-01" },
      designModule: {
        studyType: "INTERVENTIONAL",
        phases: ["PHASE3"],
        designInfo: { allocation: "RANDOMIZED", maskingInfo: { masking: "QUADRUPLE" } },
      },
      armsInterventionsModule: { interventions: [{ type: "DRUG", name: "Examplemab" }] },
      outcomesModule: { primaryOutcomes: [{ measure: "Overall survival", timeFrame: "5 years" }] },
      contactsLocationsModule: { centralContacts: [{ name: "Private contact", email: "contact@example.test" }] },
    },
  });

  assert.equal(record.nctId, "NCT01234567");
  assert.deepEqual(record.phases, ["PHASE3"]);
  assert.equal(record.design.allocation, "RANDOMIZED");
  assert.equal(record.primaryOutcomes[0].measure, "Overall survival");
  assert.equal(record.hasResults, true);
  assert.doesNotMatch(JSON.stringify(record), /contact@example\.test/);
});

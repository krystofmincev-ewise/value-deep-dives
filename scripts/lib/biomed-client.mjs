import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { searchArxivPreprints } from "./arxiv-client.mjs";

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(dirname(moduleDirectory));
const cacheDirectory = join(repositoryRoot, ".local", "cache", "biomed");
const captureDirectory = join(repositoryRoot, ".local", "captures", "biomed");
const cacheLifetimeMilliseconds = 6 * 60 * 60 * 1000;
const requestTimeoutMilliseconds = 30_000;
const europePmcBaseUrl = "https://www.ebi.ac.uk/europepmc/webservices/rest";
const clinicalTrialsBaseUrl = "https://clinicaltrials.gov/api/v2";
const userAgent = "value-deep-dives-biomed/0.1 (public investment research)";

export const sourceInventory = [
  {
    id: "arxiv",
    kind: "API",
    role: "AI/ML, computational biology, bioinformatics, and methods preprints",
    access: "Public; no API key; one request every three seconds",
    status: "implemented",
    url: "https://info.arxiv.org/help/api/",
    rights: "Descriptive metadata is CC0. E-print copyright and reuse depend on the article-level licence.",
  },
  {
    id: "europe-pmc",
    kind: "API",
    role: "Primary literature discovery and licensed open-access full text",
    access: "Public; no API key",
    status: "implemented",
    url: "https://europepmc.org/RestfulWebService",
    rights:
      "Metadata and abstracts are discovery material. Fetch full text only from the open-access subset and obey each article's licence.",
  },
  {
    id: "clinicaltrials-gov",
    kind: "API",
    role: "US and multinational trial protocols, endpoints, status, results, and references",
    access: "Public; no API key",
    status: "implemented",
    url: "https://clinicaltrials.gov/data-about-studies/learn-about-api",
    rights: "Public registry data; preserve the API data timestamp and source link.",
  },
  {
    id: "open-targets",
    kind: "MCP + GraphQL API",
    role: "Target-disease evidence, genetics, tractability, safety, mechanisms, and known drugs",
    access: "Public; hosted MCP is experimental",
    status: "recommended complement",
    url: "https://mcp.platform.opentargets.org/mcp",
    rights: "Open Targets data is open; cite the underlying evidence sources surfaced by the platform.",
  },
  {
    id: "ncbi-edirect",
    kind: "Official CLI",
    role: "Advanced PubMed, PMC, Gene, Protein, and citation-graph queries",
    access: "Public; NCBI usage limits apply",
    status: "recommended complement",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK179288/",
    rights: "PubMed records are not blanket-licensed full text; use PMC-approved retrieval services for reusable content.",
  },
  {
    id: "unpaywall-crossref",
    kind: "APIs",
    role: "DOI resolution and lawful open-access location discovery outside biomedicine",
    access: "Public; a monitored email is required for Unpaywall and recommended for Crossref",
    status: "next extension",
    url: "https://unpaywall.org/api/v2",
    rights: "A free-to-read link is not a blanket redistribution licence; retain the location and licence metadata.",
  },
  {
    id: "chemistry-regulatory",
    kind: "APIs",
    role: "ChEMBL, PubChem, OpenFDA, Drugs@FDA, labels, adverse-event signals, and approvals",
    access: "Mostly public; source-specific limits apply",
    status: "next extension",
    url: "https://open.fda.gov/apis/drug/",
    rights: "Regulatory data is public; adverse-event reports are signals, not causal evidence.",
  },
  {
    id: "scispace",
    kind: "Optional Codex plugin / licensed UI",
    role: "Interactive literature review and user-authorized PDF analysis",
    access: "Requires the SciSpace plugin or the user's signed-in browser session",
    status: "optional; not installed in this workspace",
    url: "https://scispace.com/",
    rights: "Use only content the user may lawfully access; never treat the UI as paywall-circumvention infrastructure.",
  },
];

function requireNonEmpty(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

export function parsePositiveInteger(value, fallback, maximum = 100) {
  if (value === undefined) return fallback;
  const normalized = String(value);
  if (!/^[1-9]\d*$/.test(normalized)) {
    throw new Error(`Expected a positive integer, received: ${value}`);
  }
  const parsed = Number(normalized);
  if (parsed > maximum) throw new Error(`Maximum supported value is ${maximum}, received: ${value}`);
  return parsed;
}

function cachePathFor(url, responseFormat) {
  const digest = createHash("sha256").update(url).digest("hex");
  return join(cacheDirectory, `${digest}.${responseFormat}.json`);
}

async function readFreshCache(path) {
  try {
    const metadata = await stat(path);
    if (Date.now() - metadata.mtimeMs > cacheLifetimeMilliseconds) return null;
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function writeJsonAtomically(path, value) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporaryPath = `${path}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporaryPath, path);
}

async function request(url, { responseFormat = "json", refresh = false } = {}) {
  const path = cachePathFor(url, responseFormat);
  if (!refresh) {
    const cached = await readFreshCache(path);
    if (cached) return cached.body;
  }

  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: responseFormat === "json" ? "application/json" : "application/xml",
          "user-agent": userAgent,
        },
        signal: AbortSignal.timeout(requestTimeoutMilliseconds),
      });

      if (response.status === 429 || response.status >= 500) {
        throw new Error(`Temporary upstream response ${response.status}`);
      }
      if (!response.ok) {
        const message = (await response.text()).replaceAll(/\s+/g, " ").slice(0, 300);
        const error = new Error(
          `Upstream response ${response.status}: ${message || response.statusText}`,
        );
        error.retryable = false;
        throw error;
      }

      const body = responseFormat === "json" ? await response.json() : await response.text();
      await writeJsonAtomically(path, { fetchedAt: new Date().toISOString(), url, body });
      return body;
    } catch (error) {
      if (error.retryable === false) throw error;
      lastError = error;
      if (attempt < 2) await delay(500 * 2 ** attempt);
    }
  }

  throw new Error(`Request failed after retries: ${lastError.message}`);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function europePmcSearchUrl(query, limit) {
  const url = new URL(`${europePmcBaseUrl}/search`);
  url.search = new URLSearchParams({ query, format: "json", resultType: "core", pageSize: String(limit) });
  return url;
}

function normalizePublicationDate(record) {
  return (
    record.firstPublicationDate ??
    record.electronicPublicationDate ??
    record.journalInfo?.printPublicationDate ??
    record.pubYear ??
    null
  );
}

function normalizeOpenAccess(record) {
  const urls = asArray(record.fullTextUrlList?.fullTextUrl)
    .filter(({ availabilityCode }) => availabilityCode === "OA")
    .map(({ documentStyle, site, url }) => ({ documentStyle, site, url }));
  return {
    isOpenAccess: record.isOpenAccess === "Y",
    license: record.license ?? null,
    licenseClass: classifyLicense(record.license),
    hasPdf: record.hasPDF === "Y",
    urls,
  };
}

export function normalizeLiteratureRecord(record) {
  const pmid = record.pmid ?? (record.source === "MED" ? record.id : null);
  const pmcid = record.pmcid ?? null;
  return {
    identifiers: { pmid, pmcid, doi: record.doi ?? null },
    title: record.title ?? null,
    authors: record.authorString ?? null,
    journal: record.journalInfo?.journal?.title ?? null,
    publicationDate: normalizePublicationDate(record),
    publicationTypes: asArray(record.pubTypeList?.pubType),
    abstract: record.abstractText ?? null,
    citedByCount: record.citedByCount ?? null,
    openAccess: normalizeOpenAccess(record),
    links: {
      europePmc: pmcid ? `https://europepmc.org/articles/${pmcid}` : pmid ? `https://europepmc.org/article/MED/${pmid}` : null,
      pubmed: pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : null,
      doi: record.doi ? `https://doi.org/${record.doi}` : null,
    },
  };
}

function literatureEnvelope(response, query, openAccessOnly) {
  const records = asArray(response.resultList?.result).map(normalizeLiteratureRecord);
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      name: "Europe PMC",
      publisher: "EMBL-EBI / Europe PMC Funders' Group",
      apiVersion: response.version ?? null,
      url: "https://europepmc.org/RestfulWebService",
      access: "public",
      rights: "metadata-and-abstract-discovery; article-level licence controls full-text reuse",
    },
    query,
    filters: { openAccessOnly },
    total: response.hitCount ?? records.length,
    returned: records.length,
    records,
  };
}

export async function searchLiterature(query, { limit = 20, openAccessOnly = false, refresh = false } = {}) {
  const normalizedQuery = requireNonEmpty(query, "Literature query");
  const effectiveQuery = openAccessOnly ? `(${normalizedQuery}) AND OPEN_ACCESS:Y` : normalizedQuery;
  const response = await request(europePmcSearchUrl(effectiveQuery, limit).toString(), { refresh });
  return literatureEnvelope(response, normalizedQuery, openAccessOnly);
}

function quoteEuropePmcValue(value) {
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function literatureIdentifierQuery(identifier) {
  if (/^PMC\d+$/i.test(identifier)) return `PMCID:${identifier.toUpperCase()}`;
  if (/^\d+$/.test(identifier)) return `EXT_ID:${identifier} AND SRC:MED`;
  if (/^10\.\S+\/\S+$/i.test(identifier)) return `DOI:${quoteEuropePmcValue(identifier)}`;
  throw new Error("Paper identifier must be a PMCID, PMID, or DOI.");
}

function identifierMatches(record, identifier) {
  const normalized = identifier.toLowerCase();
  return [record.identifiers.pmcid, record.identifiers.pmid, record.identifiers.doi]
    .filter(Boolean)
    .some((value) => value.toLowerCase() === normalized);
}

export async function getLiteratureRecord(identifier, { refresh = false } = {}) {
  const normalizedIdentifier = requireNonEmpty(identifier, "Paper identifier");
  const response = await request(
    europePmcSearchUrl(literatureIdentifierQuery(normalizedIdentifier), 5).toString(),
    { refresh },
  );
  const envelope = literatureEnvelope(response, normalizedIdentifier, false);
  const record = envelope.records.find((candidate) => identifierMatches(candidate, normalizedIdentifier));
  if (!record) throw new Error(`No exact Europe PMC record found for ${normalizedIdentifier}.`);
  return { ...envelope, total: 1, returned: 1, records: [record] };
}

export function classifyLicense(license) {
  if (!license) return "unknown";
  const normalized = license.toLowerCase().replaceAll("_", " ").replaceAll(/\s+/g, " ").trim();
  if (normalized.includes("public domain") || normalized === "cc0" || normalized.startsWith("cc 0")) {
    return "commercial-reuse-allowed";
  }
  if (normalized.includes("nc") || normalized.includes("non-commercial") || normalized.includes("noncommercial")) {
    return "noncommercial-only";
  }
  if (normalized.startsWith("cc by")) return "commercial-reuse-allowed";
  return "unknown";
}

export async function fetchOpenAccessFullText(pmcid, { allowNoncommercial = false, refresh = false } = {}) {
  const normalizedPmcid = requireNonEmpty(pmcid, "PMCID").toUpperCase();
  if (!/^PMC\d+$/.test(normalizedPmcid)) throw new Error("Full-text retrieval requires a PMCID such as PMC3258128.");

  const metadata = await getLiteratureRecord(normalizedPmcid, { refresh });
  const record = metadata.records[0];
  if (!record.openAccess.isOpenAccess) {
    throw new Error(
      `${normalizedPmcid} is not in Europe PMC's open-access subset; only metadata and lawful access links are available.`,
    );
  }

  const licenseClass = record.openAccess.licenseClass;
  if (licenseClass === "unknown") {
    throw new Error(`${normalizedPmcid} has no machine-readable reuse licence; full-text automation is blocked.`);
  }
  if (licenseClass === "noncommercial-only" && !allowNoncommercial) {
    throw new Error(
      `${normalizedPmcid} is ${record.openAccess.license}; pass --allow-noncommercial only when the intended use qualifies.`,
    );
  }

  const sourceUrl = `${europePmcBaseUrl}/${normalizedPmcid}/fullTextXML`;
  const xml = await request(sourceUrl, { responseFormat: "xml", refresh });
  const articleDirectory = join(captureDirectory, normalizedPmcid);
  const xmlPath = join(articleDirectory, `${normalizedPmcid}.xml`);
  const manifestPath = join(articleDirectory, "manifest.json");
  await mkdir(articleDirectory, { recursive: true, mode: 0o700 });
  await writeFile(xmlPath, xml, { mode: 0o600 });

  const manifest = {
    title: record.title,
    publisher: "Europe PMC",
    publicationDate: record.publicationDate,
    accessDate: new Date().toISOString(),
    canonicalUrl: record.links.europePmc,
    apiUrl: sourceUrl,
    evidenceType: "peer-reviewed or indexed biomedical publication",
    access: "public open-access API",
    rights: record.openAccess.license,
    rightsClass: licenseClass,
    retrieval: "Europe PMC REST API",
    intendedUse: "local evidence review; assign the claim supported before promotion",
    verification: "not yet independently reviewed",
    capture: "local source copy",
    sha256: createHash("sha256").update(xml).digest("hex"),
    bytes: Buffer.byteLength(xml),
    files: { fullTextXml: xmlPath, manifest: manifestPath },
    notes: "Keep local-only unless redistribution under the recorded article licence is separately reviewed and necessary.",
  };
  await writeJsonAtomically(manifestPath, manifest);
  return manifest;
}

function clinicalTrialsSearchUrl(query, limit) {
  const url = new URL(`${clinicalTrialsBaseUrl}/studies`);
  url.search = new URLSearchParams({
    "query.term": query,
    pageSize: String(limit),
    countTotal: "true",
    format: "json",
  });
  return url;
}

function normalizeIntervention(intervention) {
  return {
    type: intervention.type ?? null,
    name: intervention.name ?? null,
    description: intervention.description ?? null,
    otherNames: asArray(intervention.otherNames),
    armGroupLabels: asArray(intervention.armGroupLabels),
  };
}

export function normalizeTrialStudy(study, { detailed = false } = {}) {
  const protocol = study.protocolSection ?? {};
  const identification = protocol.identificationModule ?? {};
  const status = protocol.statusModule ?? {};
  const sponsor = protocol.sponsorCollaboratorsModule ?? {};
  const design = protocol.designModule ?? {};
  const conditions = protocol.conditionsModule ?? {};
  const arms = protocol.armsInterventionsModule ?? {};
  const outcomes = protocol.outcomesModule ?? {};
  const eligibility = protocol.eligibilityModule ?? {};
  const description = protocol.descriptionModule ?? {};
  const references = protocol.referencesModule ?? {};
  const nctId = identification.nctId ?? null;

  const normalized = {
    nctId,
    title: identification.briefTitle ?? null,
    officialTitle: identification.officialTitle ?? null,
    organization: identification.organization ?? null,
    sponsor: sponsor.leadSponsor ?? null,
    collaborators: asArray(sponsor.collaborators),
    status: status.overallStatus ?? null,
    statusVerifiedDate: status.statusVerifiedDate ?? null,
    studyType: design.studyType ?? null,
    phases: asArray(design.phases),
    enrollment: design.enrollmentInfo ?? null,
    design: {
      allocation: design.designInfo?.allocation ?? null,
      interventionModel: design.designInfo?.interventionModel ?? null,
      primaryPurpose: design.designInfo?.primaryPurpose ?? null,
      masking: design.designInfo?.maskingInfo?.masking ?? null,
      whoMasked: asArray(design.designInfo?.maskingInfo?.whoMasked),
    },
    conditions: asArray(conditions.conditions),
    interventions: asArray(arms.interventions).map(normalizeIntervention),
    primaryOutcomes: asArray(outcomes.primaryOutcomes),
    secondaryOutcomes: asArray(outcomes.secondaryOutcomes),
    dates: {
      start: status.startDateStruct ?? null,
      primaryCompletion: status.primaryCompletionDateStruct ?? null,
      completion: status.completionDateStruct ?? null,
      firstPosted: status.studyFirstPostDateStruct ?? null,
      resultsFirstPosted: status.resultsFirstPostDateStruct ?? null,
      lastUpdatePosted: status.lastUpdatePostDateStruct ?? null,
    },
    hasResults: Boolean(study.hasResults),
    links: { clinicalTrialsGov: nctId ? `https://clinicaltrials.gov/study/${nctId}` : null },
  };

  if (!detailed) return normalized;
  return {
    ...normalized,
    summary: description.briefSummary ?? null,
    detailedDescription: description.detailedDescription ?? null,
    arms: asArray(arms.armGroups),
    otherOutcomes: asArray(outcomes.otherOutcomes),
    eligibility: {
      sex: eligibility.sex ?? null,
      minimumAge: eligibility.minimumAge ?? null,
      maximumAge: eligibility.maximumAge ?? null,
      healthyVolunteers: eligibility.healthyVolunteers ?? null,
      criteria: eligibility.eligibilityCriteria ?? null,
    },
    references: {
      publications: asArray(references.references),
      seeAlsoLinks: asArray(references.seeAlsoLinks),
    },
    results: study.resultsSection ?? null,
    annotations: study.annotationSection ?? null,
  };
}

async function getClinicalTrialsVersion(refresh) {
  return request(`${clinicalTrialsBaseUrl}/version`, { refresh });
}

function trialsEnvelope(response, version, query, detailed) {
  const records = asArray(response.studies).map((study) => normalizeTrialStudy(study, { detailed }));
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      name: "ClinicalTrials.gov",
      publisher: "U.S. National Library of Medicine",
      apiVersion: version.apiVersion ?? null,
      dataTimestamp: version.dataTimestamp ?? null,
      url: "https://clinicaltrials.gov/data-about-studies/learn-about-api",
      access: "public",
      rights: "public registry data; sponsor-submitted fields require independent verification",
    },
    query,
    total: response.totalCount ?? records.length,
    returned: records.length,
    records,
  };
}

export async function searchTrials(query, { limit = 20, refresh = false } = {}) {
  const normalizedQuery = requireNonEmpty(query, "Trial query");
  const [response, version] = await Promise.all([
    request(clinicalTrialsSearchUrl(normalizedQuery, limit).toString(), { refresh }),
    getClinicalTrialsVersion(refresh),
  ]);
  return trialsEnvelope(response, version, normalizedQuery, false);
}

export async function getTrialStudy(nctId, { refresh = false } = {}) {
  const normalizedNctId = requireNonEmpty(nctId, "NCT ID").toUpperCase();
  if (!/^NCT\d{8}$/.test(normalizedNctId)) throw new Error("Trial identifier must look like NCT01234567.");
  const [study, version] = await Promise.all([
    request(`${clinicalTrialsBaseUrl}/studies/${normalizedNctId}`, { refresh }),
    getClinicalTrialsVersion(refresh),
  ]);
  return trialsEnvelope({ studies: [study], totalCount: 1 }, version, normalizedNctId, true);
}

export async function buildEvidenceLandscape(
  query,
  { literatureLimit = 10, preprintLimit = 10, trialLimit = 10, refresh = false } = {},
) {
  const normalizedQuery = requireNonEmpty(query, "Landscape query");
  const [literature, preprints, trials] = await Promise.all([
    searchLiterature(normalizedQuery, { limit: literatureLimit, refresh }),
    searchArxivPreprints(normalizedQuery, { limit: preprintLimit, refresh }),
    searchTrials(normalizedQuery, { limit: trialLimit, refresh }),
  ]);
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    query: normalizedQuery,
    literature,
    preprints,
    trials,
    nextEvidenceLayers: [
      "Resolve drug, disease, and target identifiers through the official Open Targets MCP.",
      "Inspect the prespecified trial endpoint, comparator, analysis population, multiplicity, and posted protocol changes.",
      "Cross-check regulatory reviews, labels, safety signals, and the sponsor's original disclosure.",
      "Record claim-level citations and separate biological, clinical, regulatory, and commercial probabilities.",
    ],
  };
}

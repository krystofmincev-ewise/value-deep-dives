import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(dirname(moduleDirectory));
const cacheDirectory = join(repositoryRoot, ".local", "cache", "biomed");
const cacheLifetimeMilliseconds = 24 * 60 * 60 * 1000;
const requestTimeoutMilliseconds = 30_000;
const retryDelayMilliseconds = 3_000;
const arxivApiUrl = "https://export.arxiv.org/api/query";
const userAgent = "value-deep-dives-biomed/0.2 (public investment research)";

function requireNonEmpty(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
}

function cachePathFor(url) {
  const digest = createHash("sha256").update(url).digest("hex");
  return join(cacheDirectory, `${digest}.atom.json`);
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

async function requestArxiv(url, { refresh = false } = {}) {
  const path = cachePathFor(url);
  if (!refresh) {
    const cached = await readFreshCache(path);
    if (cached) return cached.body;
  }

  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/atom+xml", "user-agent": userAgent },
        signal: AbortSignal.timeout(requestTimeoutMilliseconds),
      });

      if (response.status === 429 || response.status >= 500) {
        throw new Error(`Temporary arXiv response ${response.status}`);
      }
      if (!response.ok) {
        const message = (await response.text()).replaceAll(/\s+/g, " ").slice(0, 300);
        const error = new Error(`arXiv response ${response.status}: ${message || response.statusText}`);
        error.retryable = false;
        throw error;
      }

      const body = await response.text();
      await writeJsonAtomically(path, { fetchedAt: new Date().toISOString(), url, body });
      return body;
    } catch (error) {
      if (error.retryable === false) throw error;
      lastError = error;
      if (attempt < 2) await delay(retryDelayMilliseconds);
    }
  }

  throw new Error(`arXiv request failed after retries: ${lastError.message}`);
}

function decodeXmlEntities(value) {
  return value
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, hexadecimal) => String.fromCodePoint(Number.parseInt(hexadecimal, 16)))
    .replaceAll(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function normalizeXmlText(value) {
  if (value === null) return null;
  const withoutCdata = value.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1");
  return decodeXmlEntities(withoutCdata).replaceAll(/\s+/g, " ").trim() || null;
}

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function elementText(xml, qualifiedName) {
  const tag = escapeRegularExpression(qualifiedName);
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? normalizeXmlText(match[1]) : null;
}

function elementBlocks(xml, qualifiedName) {
  const tag = escapeRegularExpression(qualifiedName);
  return [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${tag}>`, "gi"))].map(
    ([block]) => block,
  );
}

function openingElements(xml, qualifiedName) {
  const tag = escapeRegularExpression(qualifiedName);
  return [...xml.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, "gi"))].map(([, attributes]) => attributes);
}

function attributesFromXml(value) {
  const attributes = {};
  for (const match of value.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/g)) {
    attributes[match[1]] = decodeXmlEntities(match[3]);
  }
  return attributes;
}

function secureArxivUrl(value) {
  return value?.replace(/^http:\/\/(?:export\.)?arxiv\.org/i, "https://arxiv.org") ?? null;
}

function identifierFromAbstractUrl(value) {
  if (!value) return null;
  const match = value.match(/\/abs\/(.+?)(?:[?#]|$)/i);
  return match ? decodeURIComponent(match[1]) : null;
}

function splitArxivVersion(identifier) {
  const match = identifier?.match(/^(.*?)(?:v(\d+))?$/i);
  return {
    baseIdentifier: match?.[1] ?? identifier ?? null,
    version: match?.[2] ? Number(match[2]) : null,
  };
}

export function normalizeArxivIdentifier(identifier) {
  let normalized = requireNonEmpty(identifier, "arXiv identifier")
    .replace(/^arxiv:\s*/i, "")
    .replace(/^https?:\/\/(?:export\.)?arxiv\.org\/(?:abs|pdf)\//i, "")
    .replace(/\.pdf$/i, "")
    .replace(/[?#].*$/, "");
  normalized = decodeURIComponent(normalized);

  const modern = /^\d{4}\.\d{4,5}(?:v\d+)?$/i;
  const legacy = /^[a-z][a-z0-9.-]*\/\d{7}(?:v\d+)?$/i;
  if (!modern.test(normalized) && !legacy.test(normalized)) {
    throw new Error("arXiv identifier must look like 2401.01234, 2401.01234v2, or hep-ex/0307015.");
  }
  return normalized;
}

function normalizeArxivEntry(entry) {
  const links = openingElements(entry, "link").map(attributesFromXml);
  const alternateLink = links.find(({ rel, type }) => rel === "alternate" || type === "text/html");
  const pdfLink = links.find(({ title, type }) => title === "pdf" || type === "application/pdf");
  const doiLink = links.find(({ title }) => title === "doi");
  const rawIdentifier =
    identifierFromAbstractUrl(alternateLink?.href) ?? identifierFromAbstractUrl(elementText(entry, "id"));
  if (!rawIdentifier || rawIdentifier.includes("api/errors")) return null;

  const { baseIdentifier, version } = splitArxivVersion(rawIdentifier);
  const authors = elementBlocks(entry, "author").map((author) => ({
    name: elementText(author, "name"),
    affiliation: elementText(author, "arxiv:affiliation"),
  }));
  const categories = openingElements(entry, "category")
    .map(attributesFromXml)
    .map(({ term }) => term)
    .filter(Boolean);
  const primaryCategory = openingElements(entry, "arxiv:primary_category")
    .map(attributesFromXml)[0]?.term ?? null;
  const doi = elementText(entry, "arxiv:doi") ?? doiLink?.href?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "") ?? null;
  const journalReference = elementText(entry, "arxiv:journal_ref");
  const comments = elementText(entry, "arxiv:comment");
  const availabilityStatus = /removed by arxiv/i.test(comments ?? "")
    ? "removed"
    : /withdrawn/i.test(comments ?? "")
      ? "withdrawn"
      : "active";

  return {
    identifiers: { arxiv: rawIdentifier, arxivBase: baseIdentifier, version, doi },
    title: elementText(entry, "title"),
    authors,
    abstract: elementText(entry, "summary"),
    submittedAt: elementText(entry, "published"),
    updatedAt: elementText(entry, "updated"),
    categories,
    primaryCategory,
    comments,
    availabilityStatus,
    journalReference,
    license: elementText(entry, "arxiv:license"),
    evidenceState: "preprint",
    peerReview: {
      verified: false,
      status: doi || journalReference ? "linked-publication-not-verified" : "not-established-by-arxiv",
    },
    links: {
      abstract: secureArxivUrl(alternateLink?.href) ?? `https://arxiv.org/abs/${rawIdentifier}`,
      pdf: secureArxivUrl(pdfLink?.href),
      doi: doi ? `https://doi.org/${doi}` : null,
    },
  };
}

export function parseArxivFeed(xml, { query, apiQuery = null } = {}) {
  const entries = elementBlocks(xml, "entry");
  const records = entries.map(normalizeArxivEntry).filter(Boolean);
  const errors = entries
    .filter((entry) => elementText(entry, "id")?.includes("/api/errors"))
    .map((entry) => elementText(entry, "summary"))
    .filter(Boolean);
  const totalText = elementText(xml, "opensearch:totalResults");
  const total = totalText === null ? null : Number(totalText);

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      name: "arXiv",
      publisher: "Cornell University",
      apiVersion: "legacy Atom API",
      feedUpdatedAt: elementText(xml, "updated"),
      url: "https://info.arxiv.org/help/api/",
      access: "public",
      rights: "descriptive metadata is CC0; each e-print retains its article-level copyright and licence",
    },
    query,
    apiQuery,
    total: Number.isFinite(total) ? total : records.length,
    returned: records.length,
    records,
    ...(errors.length > 0 ? { errors } : {}),
  };
}

export function buildArxivSearchQuery(query) {
  const normalized = requireNonEmpty(query, "Preprint query");
  const tokens = normalized.match(/"(?:[^"\\]|\\.)*"|\b(?:ANDNOT|AND|OR)\b|\S+/g) ?? [];
  const result = [];
  let previousWasTerm = false;

  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (["AND", "OR", "ANDNOT"].includes(upper)) {
      if (!previousWasTerm) throw new Error(`Invalid arXiv query operator placement near ${token}.`);
      result.push(upper);
      previousWasTerm = false;
      continue;
    }

    if (previousWasTerm) result.push("AND");
    const phrase = token.replace(/^"|"$/g, "").replaceAll(/\\"/g, '"').trim();
    if (!phrase) continue;
    result.push(`all:"${phrase.replaceAll('"', " ")}"`);
    previousWasTerm = true;
  }

  if (!previousWasTerm) throw new Error("Preprint query cannot end with a Boolean operator.");
  return result.join(" ");
}

function arxivSearchUrl({ searchQuery, identifier, limit }) {
  const url = new URL(arxivApiUrl);
  const parameters = identifier
    ? { id_list: identifier, max_results: "1" }
    : {
        search_query: searchQuery,
        start: "0",
        max_results: String(limit),
        sortBy: "relevance",
        sortOrder: "descending",
      };
  url.search = new URLSearchParams(parameters);
  return url;
}

export async function searchArxivPreprints(query, { limit = 20, refresh = false } = {}) {
  const normalizedQuery = requireNonEmpty(query, "Preprint query");
  const apiQuery = buildArxivSearchQuery(normalizedQuery);
  const url = arxivSearchUrl({ searchQuery: apiQuery, limit });
  const xml = await requestArxiv(url.toString(), { refresh });
  return parseArxivFeed(xml, { query: normalizedQuery, apiQuery });
}

export async function getArxivPreprint(identifier, { refresh = false } = {}) {
  const normalizedIdentifier = normalizeArxivIdentifier(identifier);
  const url = arxivSearchUrl({ identifier: normalizedIdentifier });
  const xml = await requestArxiv(url.toString(), { refresh });
  const envelope = parseArxivFeed(xml, { query: normalizedIdentifier });
  const requested = splitArxivVersion(normalizedIdentifier);
  const exact = envelope.records.find(({ identifiers }) => {
    if (requested.version !== null) {
      return identifiers.arxiv.toLowerCase() === normalizedIdentifier.toLowerCase();
    }
    return identifiers.arxivBase.toLowerCase() === requested.baseIdentifier.toLowerCase();
  });
  if (!exact) {
    const detail = envelope.errors?.[0] ? `: ${envelope.errors[0]}` : "";
    throw new Error(`No exact arXiv record found for ${normalizedIdentifier}${detail}.`);
  }
  return { ...envelope, total: 1, returned: 1, records: [exact] };
}

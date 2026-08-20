#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const routes = {
  gemini: {
    name: "Gemini Deep Research",
    access: "Authenticated Chrome",
    purpose: "Run a sourced second-opinion research report.",
    url: () => "https://gemini.google.com/app",
    next: "In Codex, invoke $gemini-deep-research with one brief; it will drive the plan → review → start → collect workflow in Chrome.",
  },
  revelio: {
    name: "Revelio Labs",
    access: "Authenticated Chrome",
    purpose: "Research company-level hiring, departures, functions, tenure, skills, and geography.",
    url: () => "https://dashboard.reveliolabs.com/",
    next: "In Codex, invoke $revelio-workforce-research for a focused aggregate company query; record filters and as-of date.",
  },
  youtube: {
    name: "YouTube",
    access: "Authenticated Chrome (Premium session when available)",
    purpose: "Find executive interviews and inspect visible transcripts.",
    url: ({ query }) => withQuery("https://www.youtube.com/results", "search_query", query),
    next: "In Codex, invoke $youtube-interview-research to inspect visible transcripts, verify passages against playback, and cite timestamps.",
  },
  finance: {
    name: "Google Finance",
    access: "Chrome",
    purpose: "Cross-check a company page, price, peers, and related news.",
    url: ({ query }) => withQuery("https://www.google.com/finance/", "q", query),
    next: "Record the displayed as-of time and corroborate any price used for formal scoring.",
  },
  ft: {
    name: "Financial Times",
    access: "Authenticated Chrome",
    purpose: "Navigate and discover targeted articles through the user's direct subscription.",
    url: ({ query }) => withQuery("https://www.ft.com/search", "q", query),
    next: "In Codex, invoke $ft-source-discovery to capture search-result metadata and canonical URLs without opening article bodies.",
  },
  semianalysis: {
    name: "SemiAnalysis",
    access: "Authenticated Chrome",
    purpose: "Find targeted semiconductor and infrastructure research.",
    url: ({ query }) => withQuery("https://semianalysis.com/", "s", query),
    next: "Open the canonical article and log only the claims used, provenance, and original analysis.",
  },
  sec: {
    name: "SEC EDGAR",
    access: "Public Chrome / in-app Browser",
    purpose: "Inspect filings, exhibits, and issuer filing history.",
    url: ({ query }) => withHashQuery("https://www.sec.gov/edgar/search/", "q", query),
    next: "Open the filing and exhibits; use accession numbers and SEC URLs as canonical references.",
  },
  ir: {
    name: "Company investor relations",
    access: "Public Chrome / in-app Browser",
    purpose: "Find the issuer's official releases, decks, events, and webcasts.",
    url: ({ query }) => googleSearch(`${query || "company"} investor relations`),
    next: "Select the issuer-owned domain and prefer the EDGAR copy when the material was filed as an exhibit.",
  },
};

const workspaceRouteIds = [
  "gemini",
  "revelio",
  "youtube",
  "finance",
  "ft",
  "semianalysis",
  "sec",
  "ir",
];

function printHelp() {
  console.log(`Browser research workspace

Usage:
  node scripts/research-browser.mjs list [--json]
  node scripts/research-browser.mjs guide <source>
  node scripts/research-browser.mjs open <source> [--query "..."] [--dry-run]
  node scripts/research-browser.mjs workspace --company "..." [--ticker SNAP] [--sources youtube,revelio,sec] [--open] [--json]

Sources:
  ${Object.keys(routes).join(", ")}

The workspace command previews URLs by default; pass --open to launch the selected sources. This CLI asks macOS to open ordinary URLs in Chrome. Chrome may choose its default or last-active profile. The CLI never reads or copies browser authentication.`);
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

function withQuery(base, name, value) {
  const url = new URL(base);
  if (value) url.searchParams.set(name, value);
  return url.toString();
}

function withHashQuery(base, name, value) {
  const url = new URL(base);
  if (value) url.hash = `/${new URLSearchParams({ [name]: value }).toString()}`;
  return url.toString();
}

function googleSearch(query) {
  return withQuery("https://www.google.com/search", "q", query);
}

function getRoute(source) {
  const route = routes[source];
  if (!route) {
    throw new Error(`Unknown source: ${source}. Choose one of: ${Object.keys(routes).join(", ")}`);
  }
  return route;
}

function getOptionalStringOption(options, name) {
  if (!options.has(name)) return undefined;
  const value = options.get(name);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`--${name} requires a value.`);
  }
  return value.trim();
}

function describeRoute(id, route, query = "") {
  return {
    id,
    name: route.name,
    access: route.access,
    purpose: route.purpose,
    query: query || null,
    url: route.url({ query }),
    next: route.next,
  };
}

function printRoutes(items) {
  for (const item of items) {
    console.log(`${item.id.padEnd(14)} ${item.name}`);
    console.log(`${"".padEnd(14)} ${item.access} — ${item.purpose}`);
  }
}

function printGuide(item) {
  console.log(`# ${item.name}\n`);
  console.log(`Access: ${item.access}`);
  console.log(`Purpose: ${item.purpose}`);
  console.log(`Open: ${item.url}`);
  console.log(`Next: ${item.next}`);
}

function openChrome(urls) {
  if (process.platform !== "darwin") {
    throw new Error("Automatic Chrome opening is currently supported on macOS. Use --dry-run elsewhere.");
  }

  const result = spawnSync("open", ["-a", "Google Chrome", ...urls], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Chrome launcher exited with status ${result.status}.`);
}

function buildWorkspace(options) {
  const company = options.get("company");
  if (typeof company !== "string" || company.trim() === "") {
    throw new Error("--company is required for a browser workspace.");
  }

  const ticker = getOptionalStringOption(options, "ticker");
  const companyQuery = ticker ? `${company.trim()} ${ticker.toUpperCase()}` : company.trim();
  const requestedSources = getOptionalStringOption(options, "sources");
  const sourceIds = requestedSources
    ? requestedSources
        .split(",")
        .map((source) => source.trim())
        .filter(Boolean)
    : workspaceRouteIds;

  if (sourceIds.length === 0) throw new Error("--sources must contain at least one source.");

  const unknownSources = sourceIds.filter((source) => !workspaceRouteIds.includes(source));
  if (unknownSources.length > 0) {
    throw new Error(
      `Unknown workspace source${unknownSources.length === 1 ? "" : "s"}: ${unknownSources.join(", ")}. Choose from: ${workspaceRouteIds.join(", ")}`,
    );
  }

  return [...new Set(sourceIds)].map((id) => describeRoute(id, routes[id], companyQuery));
}

function printOpenResult(items) {
  for (const item of items) {
    console.log(`${item.id}: ${item.url}`);
    if (item.query) console.log(`  Query: ${item.query}`);
    console.log(`  ${item.next}`);
  }
}

function main() {
  const { positionals, options } = parseOptions(process.argv.slice(2));
  const [command, source] = positionals;

  if (!command || command === "help" || options.has("help")) {
    printHelp();
    return;
  }

  if (command === "list") {
    const items = Object.entries(routes).map(([id, route]) => describeRoute(id, route));
    if (options.has("json")) console.log(JSON.stringify(items, null, 2));
    else printRoutes(items);
    return;
  }

  if (command === "guide") {
    if (!source) throw new Error("A source is required. Use `list` to see the available sources.");
    printGuide(describeRoute(source, getRoute(source), getOptionalStringOption(options, "query")));
    return;
  }

  let items;
  if (command === "open") {
    if (!source) throw new Error("A source is required. Use `list` to see the available sources.");
    items = [describeRoute(source, getRoute(source), getOptionalStringOption(options, "query"))];
  } else if (command === "workspace") {
    if (options.has("open") && !options.has("sources")) {
      throw new Error("Workspace --open requires an explicit --sources list.");
    }
    items = buildWorkspace(options);
  } else {
    throw new Error(`Unknown browser command: ${command}. Use --help for details.`);
  }

  const shouldOpen =
    !options.has("dry-run") && (command === "open" || (command === "workspace" && options.has("open")));
  if (shouldOpen && items.some(({ id }) => id === "gemini")) {
    throw new Error("Open Gemini through $gemini-deep-research so the intended signed-in account is verified first.");
  }
  if (shouldOpen) openChrome(items.map((item) => item.url));

  if (options.has("json")) console.log(JSON.stringify(items, null, 2));
  else printOpenResult(items);
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}

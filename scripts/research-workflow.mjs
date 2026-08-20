#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const uiContractObservedOn = "2026-08-20";
const booleanOptions = new Set(["help", "json", "open", "plan-only"]);
const valueOptions = new Set([
  "channels",
  "company",
  "date-from",
  "date-to",
  "functions",
  "geographies",
  "max-videos",
  "peers",
  "prompt",
  "query",
  "question",
]);
const commonOptions = new Set(["help", "json", "open", "plan-only"]);
const serviceOptions = {
  gemini: new Set(["prompt"]),
  revelio: new Set([
    "company",
    "date-from",
    "date-to",
    "functions",
    "geographies",
    "peers",
    "question",
  ]),
  youtube: new Set(["channels", "date-from", "date-to", "max-videos", "query"]),
};

function role(roleName, name, extra = {}) {
  return { surface: "playwright", method: "getByRole", role: roleName, name, ...extra };
}

function css(selector, extra = {}) {
  return { surface: "playwright", method: "locator", selector, ...extra };
}

function printHelp() {
  console.log(`Authenticated research workflow specifications

Usage:
  node scripts/research-workflow.mjs gemini --prompt "..." [--plan-only] [--json]
  node scripts/research-workflow.mjs revelio --company "..." --question "..." [filters] [--open] [--json]
  node scripts/research-workflow.mjs youtube --query "..." [--max-videos 3] [--open] [--json]

Revelio filters:
  --peers "Meta,Pinterest" --functions "Engineering,Sales"
  --geographies "US,Europe" --date-from YYYY-MM-DD --date-to YYYY-MM-DD

YouTube filters:
  --channels "20VC,Sequoia" --date-from YYYY-MM-DD --date-to YYYY-MM-DD

These commands validate inputs and emit the reviewed semantic Chrome recipe used by the
matching repository skill. They never inspect browser profiles, cookies, credentials, or
hidden endpoints. Gemini always uses the signed-in subscription UI; --open is intentionally
unsupported because the skill must first claim and verify the intended account tab.`);
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

function validateServiceOptions(service, options) {
  const allowed = new Set([...commonOptions, ...serviceOptions[service]]);
  const unsupported = [...options.keys()].filter((name) => !allowed.has(name));
  if (unsupported.length > 0) {
    throw new Error(`--${unsupported[0]} is not supported for ${service}.`);
  }
}

function getRequiredString(options, name) {
  const value = options.get(name);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`--${name} is required.`);
  }
  return value.trim();
}

function getOptionalString(options, name) {
  if (!options.has(name)) return null;
  const value = options.get(name);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`--${name} requires a value.`);
  }
  return value.trim();
}

function parseList(options, name) {
  const value = getOptionalString(options, name);
  if (!value) return [];
  const items = [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
  if (items.length === 0) throw new Error(`--${name} must contain at least one value.`);
  if (items.length > 20) throw new Error(`--${name} supports at most 20 values.`);
  return items;
}

function parsePositiveInteger(options, name, fallback, maximum) {
  if (!options.has(name)) return fallback;
  const value = String(options.get(name));
  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error(`--${name} must be a positive integer.`);
  }
  const parsed = Number(value);
  if (parsed > maximum) throw new Error(`--${name} must be at most ${maximum}.`);
  return parsed;
}

function parseDate(options, name) {
  const value = getOptionalString(options, name);
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`--${name} must use YYYY-MM-DD.`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`--${name} is not a valid calendar date.`);
  }
  return value;
}

function parseDateRange(options) {
  const from = parseDate(options, "date-from");
  const to = parseDate(options, "date-to");
  if (from && to && from > to) {
    throw new Error("--date-from must not be later than --date-to.");
  }
  return { from, to };
}

function withQuery(base, name, value) {
  const url = new URL(base);
  url.searchParams.set(name, value);
  return url.toString();
}

function baseWorkflow(service, skill, mode, inputs, launch, captureDirectory) {
  return {
    schemaVersion: 1,
    service,
    skill,
    mode,
    inputs,
    launch: { ...launch, opened: false },
    capture: { directory: captureDirectory, tracked: false },
    uiContract: {
      observedOn: uiContractObservedOn,
      locatorPolicy: "Use fresh DOM state and semantic role/name locators; never replay coordinates.",
    },
  };
}

export function buildGeminiWorkflow(options) {
  const prompt = getRequiredString(options, "prompt");
  const mode = options.has("plan-only") ? "plan_only" : "full";
  const workflow = baseWorkflow(
    "gemini",
    "$gemini-deep-research",
    mode,
    { prompt },
    {
      kind: "claim-verified-tab",
      urlHint: "https://gemini.google.com/",
      openSupported: false,
      reason: "Preserve the user-selected signed-in Gemini subscription context.",
    },
    ".local/captures/gemini",
  );

  workflow.uiContract.checkpoints = [
    {
      id: "signed_in_context",
      required: [role("textbox", "Enter a prompt for Gemini")],
    },
    {
      id: "pro_active",
      required: [
        role("button", "Open mode picker, currently Pro", { match: "case-insensitive" }),
      ],
    },
    { id: "deep_research_active", required: [role("button", "Deselect Deep Research")] },
    {
      id: "plan_ready",
      required: [role("button", "Start research", { selection: "last", enabled: true })],
    },
  ];
  workflow.uiContract.actions = [
    {
      id: "activate_pro_if_needed",
      skipWhenPresent: role("button", "Open mode picker, currently Pro", {
        match: "case-insensitive",
      }),
      sequence: [
        {
          action: "click",
          locator: role("button", "Open mode picker, currently", {
            match: "starts-with case-insensitive",
          }),
        },
        {
          action: "click",
          locator: role("menuitem", "Pro Advanced reasoning", {
            match: "contains case-insensitive",
          }),
        },
      ],
    },
    {
      id: "activate_deep_research_if_needed",
      skipWhenPresent: role("button", "Deselect Deep Research"),
      sequence: [
        { action: "click", locator: role("button", "Upload & tools") },
        { action: "click", locator: role("button", "More tools") },
        { action: "click", locator: role("menuitemcheckbox", "Deep Research") },
      ],
    },
    {
      id: "submit_prompt_once",
      sequence: [
        {
          action: "fill",
          locator: role("textbox", "Enter a prompt for Gemini"),
          valueFrom: "inputs.prompt",
        },
        { action: "click", locator: role("button", "Send message") },
      ],
    },
    {
      id: "review_plan",
      action: "read",
      target: "complete newest visible plan",
      optionalRevision: {
        maximum: 1,
        locator: role("button", "Edit the research plan", {
          selection: "last",
          enabled: true,
        }),
      },
    },
    ...(mode === "full"
      ? [
          {
            id: "start_research",
            action: "click",
            locator: role("button", "Start research", {
              selection: "last",
              enabled: true,
            }),
          },
        ]
      : []),
  ];
  workflow.uiContract.blockers = ["sign-in", "CAPTCHA", "quota", "Deep Research unavailable"];
  workflow.uiContract.completion =
    mode === "plan_only"
      ? "Enabled Start research control and complete visible plan"
      : "Research progress controls absent and newest response contains report text plus cited links";
  workflow.access = {
    route: "Signed-in Gemini Chrome UI",
    billing: "Existing Gemini subscription; do not use the Gemini API or separately billed Deep Research API.",
  };
  return workflow;
}

function renderRevelioPrompt(inputs) {
  const lines = [`Company: ${inputs.company}`, `Research question: ${inputs.question}`];
  if (inputs.peers.length > 0) lines.push(`Peers: ${inputs.peers.join(", ")}`);
  if (inputs.functions.length > 0) lines.push(`Functions: ${inputs.functions.join(", ")}`);
  if (inputs.geographies.length > 0) lines.push(`Geographies: ${inputs.geographies.join(", ")}`);
  if (inputs.dateRange.from || inputs.dateRange.to) {
    lines.push(
      `Date range: ${inputs.dateRange.from ?? "earliest available"} to ${inputs.dateRange.to ?? "latest available"}`,
    );
  }
  lines.push(
    "Distinguish new hires, hiring rate, workforce growth, and net talent flows instead of treating them as interchangeable. Compare both absolute and percentage changes where available.",
    "Use aggregate company-level data only. State metric definitions, exact filters, units, as-of date, and whether each value is exact, rounded, chart-estimated, or model-inferred.",
  );
  return lines.join("\n");
}

export function buildRevelioWorkflow(options) {
  const inputs = {
    company: getRequiredString(options, "company"),
    question: getRequiredString(options, "question"),
    peers: parseList(options, "peers"),
    functions: parseList(options, "functions"),
    geographies: parseList(options, "geographies"),
    dateRange: parseDateRange(options),
  };
  const mode = options.has("plan-only") ? "plan_only" : "full";
  const workflow = baseWorkflow(
    "revelio",
    "$revelio-workforce-research",
    mode,
    { ...inputs, renderedPrompt: renderRevelioPrompt(inputs) },
    { kind: "open-or-claim", url: "https://dashboard.reveliolabs.com/", openSupported: true },
    ".local/captures/revelio",
  );

  workflow.uiContract.checkpoints = [
    {
      id: "signed_in_ai_chat",
      required: [
        role("textbox", "Ask about the workforce"),
        role("button", "Send"),
      ],
      optional: [role("heading", "AI Chat")],
    },
  ];
  workflow.uiContract.actions =
    mode === "plan_only"
      ? []
      : [
          {
            id: "submit_question_once",
            sequence: [
              {
                action: "fill",
                locator: role("textbox", "Ask about the workforce"),
                valueFrom: "inputs.renderedPrompt",
              },
              { action: "verify", locator: role("button", "Send", { enabled: true }) },
              { action: "click", locator: role("button", "Send", { enabled: true }) },
            ],
          },
        ];
  workflow.uiContract.navigation = {
    companyAnalytics: role("link", "Company", { href: "/company/compositions" }),
  };
  workflow.analysisPlan = {
    metricDefinitionsToResolve: [
      "new hires during the period",
      "hiring rate when the product provides it",
      "function-level workforce growth",
      "gross departures and net talent flow",
    ],
    comparisonDesign: {
      time: "Compare the requested period with the immediately preceding comparable period when available.",
      peers:
        inputs.peers.length > 0
          ? "Use the same definitions and dates for every named peer; report absolute and percentage change."
          : "No peer comparison requested; do not introduce peers without recording the choice.",
    },
    expectedDirection:
      "Not prespecified by the caller; report supporting and contradicting movement separately and label this limitation.",
    alternativeExplanations: [
      "company-wide hiring cycle rather than function-specific strategy",
      "seasonality or comparison-period effects",
      "role reclassification, coverage changes, or model-estimation error",
    ],
    expectedOutputFields: [
      "metric",
      "definition",
      "company",
      "peer",
      "period",
      "value",
      "unit",
      "changeAbsolute",
      "changePercent",
      "asOfDate",
      "precision",
      "limitation",
    ],
  };
  workflow.uiContract.blockers = ["sign-in", "product unavailable", "entitlement required"];
  workflow.uiContract.completion =
    mode === "plan_only"
      ? "Return rendered prompt, filters, metrics, and comparison design without opening Chrome"
      : "Visible response contains aggregate findings and the applied filter/as-of context";
  workflow.access = {
    route: "Authenticated Chrome / Revelio Labs",
    billing:
      "Existing authorized Revelio access only; do not purchase an export or activate a separately billed API.",
  };
  return workflow;
}

export function buildYouTubeWorkflow(options) {
  const query = getRequiredString(options, "query");
  const channels = parseList(options, "channels");
  const inputs = {
    query,
    channels,
    dateRange: parseDateRange(options),
    maximumVideos: parsePositiveInteger(options, "max-videos", 3, 10),
  };
  const mode = options.has("plan-only") ? "plan_only" : "full";
  const searchQuery = [query, ...channels].join(" ");
  const workflow = baseWorkflow(
    "youtube",
    "$youtube-interview-research",
    mode,
    { ...inputs, searchQuery },
    {
      kind: "open-or-claim",
      url: withQuery("https://www.youtube.com/results", "search_query", searchQuery),
      openSupported: true,
    },
    ".local/captures/youtube",
  );

  workflow.uiContract.checkpoints = [
    {
      id: "signed_in_search",
      required: [role("link", "YouTube Premium Home"), role("combobox", "Search")],
    },
    {
      id: "video_page",
      required: [role("heading", "{video title}", { level: 1 }), role("slider", "Seek slider")],
    },
  ];
  workflow.uiContract.searchResults = {
    cards: css("ytd-video-renderer"),
    titleLink: css("a#video-title"),
    channel: css("#channel-name a"),
    metadata: css("#metadata-line span"),
    duration: css("ytd-thumbnail-overlay-time-status-renderer #text"),
  };
  workflow.selectionPlan = {
    rubric: [
      "Prefer first-hand, full-length interviews over clips, reactions, or compilations.",
      "Prefer the executive, company, or original event channel and retain the canonical watch URL.",
      "Require a visible transcript for transcript-based evidence; otherwise record the limitation.",
      "Rank topical relevance before recency, then use recency and duration as tie-breakers.",
    ],
    postFilters: {
      channels:
        channels.length > 0
          ? "Require a case-insensitive exact uploader-channel match to one requested channel; the query token alone is not proof."
          : "No channel restriction requested.",
      dateRange:
        inputs.dateRange.from || inputs.dateRange.to
          ? "Verify the publication date falls inside inputs.dateRange; open the candidate when relative search metadata is insufficient."
          : "No publication-date restriction requested.",
      maximumVideos: inputs.maximumVideos,
    },
    expectedEvidenceFields: [
      "title",
      "channel",
      "publishedDate",
      "duration",
      "videoUrl",
      "selectionReason",
      "timestamp",
      "speaker",
      "paraphrase",
      "claimType",
      "verificationStatus",
      "corroborationNeeded",
    ],
  };
  workflow.uiContract.actions =
    mode === "plan_only"
      ? []
      : [
          {
            id: "select_interviews",
            action: "read-and-rank",
            locator: css("ytd-video-renderer"),
            maximumFrom: "inputs.maximumVideos",
            postFiltersFrom: ["inputs.channels", "inputs.dateRange"],
          },
          {
            id: "open_transcript",
            sequence: [
              {
                action: "click-if-absent",
                locator: role("button", "...more"),
                absent: role("button", "Show transcript"),
              },
              { action: "click", locator: role("button", "Show transcript") },
              { action: "verify", locator: role("tab", "Transcript", { selected: true }) },
            ],
          },
        ];
  workflow.uiContract.transcript = {
    segments: [css("transcript-segment-view-model"), css("ytd-transcript-segment-renderer")],
    timestamp: css(".ytwTranscriptSegmentViewModelTimestamp"),
    text: css('[role="text"]'),
    playback: role("slider", "Seek slider"),
  };
  workflow.uiContract.blockers = ["sign-in", "transcript unavailable", "video unavailable"];
  workflow.uiContract.completion =
    mode === "plan_only"
      ? "Return encoded search URL, selection rubric, and expected evidence table"
      : "Selected videos have focused timestamped notes verified against visible playback";
  workflow.access = {
    route: "Authenticated Chrome / YouTube",
    billing:
      "Existing YouTube Premium session only; do not use a separately credentialed YouTube Data API or buy content.",
  };
  return workflow;
}

function openChrome(url) {
  if (process.platform !== "darwin") {
    throw new Error("Automatic Chrome opening is currently supported on macOS. Omit --open elsewhere.");
  }
  const result = spawnSync("open", ["-a", "Google Chrome", url], { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Chrome launcher exited with status ${result.status}.`);
}

function printWorkflow(workflow) {
  console.log(`${workflow.service}: ${workflow.mode}`);
  console.log(`Skill: ${workflow.skill}`);
  if (workflow.launch.url) console.log(`Open: ${workflow.launch.url}`);
  else console.log(`Open: claim a verified ${workflow.service} tab`);
  console.log(`UI contract observed: ${workflow.uiContract.observedOn}`);
  console.log("Use --json for the complete input and semantic-control recipe.");
}

function main() {
  const { positionals, options } = parseOptions(process.argv.slice(2));
  const [service, ...extraPositionals] = positionals;

  if (!service || service === "help" || options.has("help")) {
    printHelp();
    return;
  }
  if (!Object.hasOwn(serviceOptions, service)) {
    throw new Error(`Unknown workflow: ${service}. Choose gemini, revelio, or youtube.`);
  }
  if (extraPositionals.length > 0) {
    throw new Error(`${service} accepts options only; unexpected positional arguments were provided.`);
  }
  validateServiceOptions(service, options);

  if (options.has("open") && options.has("plan-only")) {
    throw new Error("--plan-only does not open Chrome; remove --open.");
  }
  if (service === "gemini" && options.has("open")) {
    throw new Error(
      "Gemini must claim and verify the intended signed-in subscription tab through $gemini-deep-research; --open is not supported.",
    );
  }

  const builders = {
    gemini: buildGeminiWorkflow,
    revelio: buildRevelioWorkflow,
    youtube: buildYouTubeWorkflow,
  };
  const workflow = builders[service](options);

  if (options.has("open")) {
    openChrome(workflow.launch.url);
    workflow.launch.opened = true;
  }

  if (options.has("json")) console.log(JSON.stringify(workflow, null, 2));
  else printWorkflow(workflow);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

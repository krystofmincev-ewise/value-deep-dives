#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const deckPath = path.resolve(argument("deck", ""));
if (!deckPath || !fs.existsSync(deckPath)) {
  console.error("Usage: validate-short.mjs --deck <deck-directory>");
  process.exit(2);
}

const htmlPath = path.join(deckPath, "index.html");
const appPath = path.join(deckPath, "app.js");
const cssPath = path.join(deckPath, "styles.css");
const missing = [htmlPath, appPath, cssPath].filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(2);
}

const html = fs.readFileSync(htmlPath, "utf8");
const app = fs.readFileSync(appPath, "utf8");
const errors = [];
const warnings = [];

const sceneKeys = [...html.matchAll(/data-scene="([^"]+)"/g)].map((match) => match[1]);
const duplicateScenes = sceneKeys.filter((key, index) => sceneKeys.indexOf(key) !== index);
if (duplicateScenes.length) errors.push(`Duplicate scene keys: ${[...new Set(duplicateScenes)].join(", ")}`);

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) errors.push(`Duplicate DOM ids: ${[...new Set(duplicateIds)].join(", ")}`);

const noteKeys = [...app.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)].map((match) => match[1]);
for (const key of sceneKeys) {
  if (!noteKeys.includes(key)) errors.push(`Scene ${key} has no speaker-note entry`);
}

const cutBlock = app.match(/const cuts\s*=\s*\{([\s\S]*?)\n\};/);
if (!cutBlock) {
  errors.push("Could not find const cuts in app.js");
} else {
  for (const match of cutBlock[1].matchAll(/(\w+):\s*\[([^\]]*)\]/g)) {
    const cutName = match[1];
    const keys = [...match[2].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
    if (!keys.length) warnings.push(`Cut ${cutName} is empty`);
    for (const key of keys) if (!sceneKeys.includes(key)) errors.push(`Cut ${cutName} references missing scene ${key}`);
  }
}

for (const key of sceneKeys) {
  const start = html.indexOf(`data-scene="${key}"`);
  const end = html.indexOf("</section>", start);
  const section = html.slice(start, end);
  if (!/data-duration="[1-9]\d*"/.test(section)) errors.push(`Scene ${key} has no positive duration`);
  if (!/aria-labelledby="[^"]+"/.test(section)) errors.push(`Scene ${key} has no aria-labelledby`);
  if (!/class="[^"]*(source|disclaimer)[^"]*"/.test(section)) warnings.push(`Scene ${key} has no visible source or disclaimer`);
}

const cssVersion = html.match(/styles\.css\?v=([^"']+)/)?.[1];
const appVersion = html.match(/app\.js\?v=([^"']+)/)?.[1];
if (!cssVersion || !appVersion) warnings.push("CSS or JS cache version is missing");
else if (cssVersion !== appVersion) errors.push(`Cache versions differ: CSS ${cssVersion}, JS ${appVersion}`);

if (!/Just my opinion, not investment advice\./.test(html)) warnings.push("Exact investment disclaimer not found");
if (!/record/.test(app) || !/autoplay/.test(app)) warnings.push("Record or autoplay query handling not detected");

const report = {
  deck: deckPath,
  scenes: sceneKeys.length,
  version: cssVersion ?? null,
  errors,
  warnings,
};
console.log(JSON.stringify(report, null, 2));
process.exit(errors.length ? 1 : 0);

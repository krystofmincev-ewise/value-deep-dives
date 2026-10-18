#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const maximumScannedBytes = 5 * 1024 * 1024;
const maximumHistoryCommits = 1000;
const excludedSegments = new Set([
  ".local", "private", "downloads", ".auth", ".gemini", ".ssh",
  "browser-profile", "browser-profiles", "chrome-profile", "chrome-profiles",
  "local storage", "session storage", "indexeddb", "user data",
  ".playwright-cli", ".playwright-mcp", "test-results", "playwright-report",
]);
const inspectableModes = new Set(["100644", "100755", "120000"]);
const consumerEmailDomains = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "hotmail.com",
  "outlook.com", "live.com", "msn.com", "icloud.com", "me.com", "mac.com",
  "proton.me", "protonmail.com", "pm.me", "hey.com", "aol.com", "gmx.com",
  "gmx.net", "mail.com", "fastmail.com", "tutanota.com", "tuta.com",
]);
const sensitiveUrlKeys = new Set([
  "token", "accesstoken", "refreshtoken", "idtoken", "authtoken", "auth",
  "authorization", "apikey", "signature", "sig", "jwt", "session",
  "sessionid", "sessiontoken", "keypairid", "xamzsignature", "xamzcredential",
  "xamzsecuritytoken", "xgoogsignature", "xgoogcredential", "googleaccessid",
]);
const knownTokenPatterns = [
  /\bgh[pousr]_[A-Za-z0-9]{36,255}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,255}\b/,
  /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/,
  /\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\bAIza[A-Za-z0-9_-]{35}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
];

function git(repositoryRoot, args, input) {
  const result = spawnSync("git", ["--no-pager", ...args], {
    cwd: repositoryRoot,
    input,
    encoding: null,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"],
  });
  // Git errors can quote paths, refs, or content. Never forward their output.
  if (result.error || result.status !== 0) throw new Error("Git snapshot inspection failed.");
  return result.stdout;
}

function forbiddenPath(filename) {
  const normalized = filename.replaceAll("\\", "/").toLowerCase();
  const parts = normalized.split("/");
  if (parts.some((part) => excludedSegments.has(part))) return true;
  if (/(?:^|\/)\.codex\/(?:local|sessions)(?:\/|$)/.test(normalized)) return true;
  if (/(?:^|\/)\.config\/gcloud(?:\/|$)/.test(normalized)) return true;
  const basename = parts.at(-1);
  if (basename === ".env.example") return false;
  if (basename === "application_default_credentials.json" || /^id_(?:rsa|dsa|ecdsa(?:_sk)?|ed25519(?:_sk)?)$/.test(basename)) return true;
  return /^(?:\.env(?:\..*)?|\.envrc|auth\.json|credentials(?:\..*)?|oauth_credentials.*|client_secret.*|cookies?(?:\..*)?|storage[-_]?state.*|login data|web data|rollout-.*\.jsonl|session-.*\.jsonl|trace\.(?:zip|json))$/.test(basename)
    || /\.(?:har|pem|key|p12|pfx|jks|keystore)$/.test(basename);
}

function parseIndex(buffer) {
  return buffer.toString("utf8").split("\0").filter(Boolean).map((record) => {
    const match = /^(\d{6}) ([a-f0-9]+) ([0-3])\t([\s\S]+)$/.exec(record);
    if (!match) throw new Error("Git index metadata could not be parsed.");
    return { mode: match[1], oid: match[2], stage: Number(match[3]), filename: match[4] };
  });
}

function parseTree(buffer) {
  return buffer.toString("utf8").split("\0").filter(Boolean).map((record) => {
    const match = /^(\d{6}) (?:blob|commit) ([a-f0-9]+)\t([\s\S]+)$/.exec(record);
    if (!match) throw new Error("Git tree metadata could not be parsed.");
    return { mode: match[1], oid: match[2], stage: 0, filename: match[3] };
  });
}

function snapshotEntries(repositoryRoot, mode, ref) {
  if (mode === "staged") {
    return { entries: parseIndex(git(repositoryRoot, ["ls-files", "--stage", "-z"])), revisions: [] };
  }
  if (typeof ref !== "string" || !ref || ref.includes("\0")) {
    throw new Error("A valid Git reference is required.");
  }
  const resolved = git(repositoryRoot, ["rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`])
    .toString("ascii").trim();
  if (!/^[a-f0-9]{40,64}$/.test(resolved)) throw new Error("Git reference resolution failed.");
  const revisions = mode === "history"
    ? git(repositoryRoot, ["rev-list", `--max-count=${maximumHistoryCommits + 1}`, resolved])
      .toString("ascii").trim().split("\n").filter(Boolean)
    : [resolved];
  if (revisions.length > maximumHistoryCommits) {
    throw new Error("History exceeds the 1000-commit inspection limit; no complete scan was produced.");
  }
  const unique = new Map();
  for (const revision of revisions) {
    for (const entry of parseTree(git(repositoryRoot, ["ls-tree", "-r", "-z", revision]))) {
      unique.set(`${entry.mode}\0${entry.oid}\0${entry.filename}`, entry);
    }
  }
  return { entries: [...unique.values()], revisions };
}

function isReservedEmailDomain(domain) {
  return /^(?:example\.(?:com|net|org)|.*\.(?:example|invalid|test))$/.test(domain);
}

function commitMetadataFindings(repositoryRoot, revision) {
  // Lowercase placeholders read original author/committer emails without mailmap rewriting.
  // No commit message, author name, or email value is retained in the returned findings.
  const fields = git(repositoryRoot, ["show", "-s", "--format=%ae%x00%ce", revision])
    .toString("utf8").trimEnd().split("\0");
  if (fields.length !== 2) throw new Error("Git commit metadata could not be parsed.");
  return fields.flatMap((email, index) => {
    const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
    if (isReservedEmailDomain(domain) || domain === "users.noreply.github.com" || domain === "noreply.github.com") return [];
    return [{ filename: `<commit-metadata:${revision}>`,
      rule: index === 0 ? "commit-author-email-manual-review" : "commit-committer-email-manual-review",
      line: null, severity: "warning" }];
  });
}

function hasSensitiveUrl(value, depth = 0) {
  let url;
  try {
    url = new URL(value.replaceAll("&amp;", "&"));
  } catch {
    return false;
  }
  if (url.username || url.password) return true;
  const params = [...url.searchParams, ...new URLSearchParams(url.hash.replace(/^#\??/, ""))];
  for (const [key, param] of params) {
    if (sensitiveUrlKeys.has(key.toLowerCase().replaceAll(/[-_]/g, ""))) return true;
    if (depth < 2 && /^https?:\/\//i.test(param) && hasSensitiveUrl(param, depth + 1)) return true;
  }
  return false;
}

function hasPersonalPath(line) {
  // A /home/ route within a public URL is not a machine-local filesystem path.
  const unixPaths = line.matchAll(/(?:^|[\s("'`\[=])(?:file:\/\/)?\/(?:Users|home)\/([^/\s<>"'`]+)/g);
  const windowsPaths = line.matchAll(/(?:^|[\s("'`\[=])[A-Za-z]:[\\/]Users[\\/]([^\\/\s<>"'`]+)/gi);
  const placeholders = new Set(["user", "username", "example", "runner", "node", "root", "shared", "public"]);
  return [...unixPaths, ...windowsPaths].some((match) =>
    !placeholders.has(match[1].toLowerCase()) && !match[1].startsWith("$"));
}

function textFindings(text) {
  const findings = [];
  for (const [index, line] of text.split(/\r\n|\n|\r/).entries()) {
    const rules = new Map();
    if (/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/.test(line)) {
      rules.set("private-key", "error");
    }
    if (knownTokenPatterns.some((pattern) => pattern.test(line))) rules.set("known-token", "error");
    if (hasPersonalPath(line)) rules.set("personal-machine-path", "error");
    for (const email of line.matchAll(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((?:[A-Z0-9-]+\.)+[A-Z]{2,})/gi)) {
      const domain = email[1].toLowerCase();
      if (isReservedEmailDomain(domain)) continue;
      rules.set(consumerEmailDomains.has(domain) ? "personal-email" : "email-manual-review",
        consumerEmailDomains.has(domain) ? "error" : "warning");
    }
    const urls = line.matchAll(/https?:\/\/[^\s<>"'`]+/gi);
    if ([...urls].some((match) => hasSensitiveUrl(match[0]))) rules.set("authenticated-url", "error");
    for (const [rule, severity] of rules) findings.push({ rule, line: index + 1, severity });
  }
  return findings;
}

/** Inspect Git objects only. This function never opens a working-tree file or follows a symlink. */
export function scanPublicRepository({ repositoryRoot = process.cwd(), mode = "staged", ref } = {}) {
  if (!new Set(["staged", "ref", "history"]).has(mode)) throw new Error("Unsupported scan mode.");
  const { entries, revisions } = snapshotEntries(repositoryRoot, mode, ref);
  const findings = [];
  const counts = { entries: entries.length, commits: revisions.length, commitMetadataReviewEntries: 0,
    text: 0, binary: 0, oversized: 0, symlinks: 0,
    submodules: 0, excluded: 0, unmerged: 0, errors: 0, warnings: 0, manualReviewEntries: 0 };
  for (const revision of revisions) {
    const metadataFindings = commitMetadataFindings(repositoryRoot, revision);
    if (metadataFindings.length) counts.commitMetadataReviewEntries += 1;
    findings.push(...metadataFindings);
  }
  const blobResults = new Map();
  for (const entry of entries) {
    const ownFindings = [];
    const add = (rule, severity = "error", line = null) => ownFindings.push({ rule, line, severity });
    // Use the same high-confidence classifiers as blob text. Generic institutional
    // mailbox warnings are not enough to redact ordinary public package paths.
    const filenameFindings = textFindings(entry.filename).filter((finding) => finding.severity === "error");
    const sensitiveFilename = filenameFindings.length > 0;
    const reportedFilename = sensitiveFilename
      ? `[redacted-filename:${createHash("sha256").update(entry.filename).digest("hex").slice(0, 20)}]`
      : entry.filename;
    if (sensitiveFilename) {
      counts.excluded += 1;
      for (const finding of filenameFindings) add(`${finding.rule}-in-filename`);
    } else if (forbiddenPath(entry.filename)) {
      counts.excluded += 1;
      add("private-or-auth-path");
    } else if (entry.stage !== 0) {
      counts.unmerged += 1;
      add("unmerged-index");
    } else if (entry.mode === "160000") {
      counts.submodules += 1;
      add("submodule-manual-review", "warning");
    } else if (!inspectableModes.has(entry.mode)) {
      add("unsupported-git-mode");
    } else {
      if (entry.mode === "120000") {
        counts.symlinks += 1;
        add("symlink-manual-review", "warning");
      }
      let blob = blobResults.get(entry.oid);
      if (!blob) {
        const size = Number(git(repositoryRoot, ["cat-file", "-s", entry.oid]).toString("ascii").trim());
        if (!Number.isSafeInteger(size) || size < 0) throw new Error("Git blob size could not be verified.");
        if (size > maximumScannedBytes) {
          blob = { kind: "oversized", findings: [{ rule: "oversized-manual-review", line: null, severity: "warning" }] };
        } else {
          const content = git(repositoryRoot, ["cat-file", "blob", entry.oid]);
          let text;
          try {
            if (content.includes(0) || content.subarray(0, 5).toString("ascii") === "%PDF-") {
              throw new Error("binary");
            }
            text = new TextDecoder("utf-8", { fatal: true }).decode(content);
            if (/[\x00-\x08\x0e-\x1f]/.test(text)) throw new Error("binary");
          } catch {
            text = null;
          }
          blob = text === null
            ? { kind: "binary", findings: [{ rule: "binary-manual-review", line: null, severity: "warning" }] }
            : { kind: "text", findings: textFindings(text) };
        }
        // Cache only classifications and redacted findings, never full source contents.
        blobResults.set(entry.oid, blob);
      }
      counts[blob.kind] += 1;
      ownFindings.push(...blob.findings);
    }
    if (ownFindings.some((finding) => finding.severity === "warning")) counts.manualReviewEntries += 1;
    findings.push(...ownFindings.map((finding) => ({ filename: reportedFilename, ...finding })));
  }
  // History may find the same rule at the same line in several versions of a filename.
  const uniqueFindings = [...new Map(findings.map((finding) => [JSON.stringify(finding), finding])).values()];
  uniqueFindings.sort((a, b) => a.filename.localeCompare(b.filename) || (a.line ?? 0) - (b.line ?? 0)
    || a.rule.localeCompare(b.rule));
  counts.errors = uniqueFindings.filter((finding) => finding.severity === "error").length;
  counts.warnings = uniqueFindings.filter((finding) => finding.severity === "warning").length;
  return {
    mode,
    status: counts.errors ? "blocked" : counts.warnings ? "manual_review_required" : "passed",
    manualReviewRequired: counts.warnings > 0,
    counts,
    findings: uniqueFindings,
  };
}

function printHelp() {
  console.log(`Public-repository privacy checks

Usage:
  node scripts/research-public.mjs --staged [--json]
  node scripts/research-public.mjs --ref <ref> [--json]
  node scripts/research-public.mjs --history <ref> [--json]

--staged checks the complete Git index, including unchanged tracked files.
--ref checks one committed tree. --history checks all reachable commit trees,
up to 1000 commits, deduplicating identical filename/blob versions.
Both also warn about non-example, non-GitHub-noreply author/committer emails,
without printing addresses. --staged cannot verify a future commit's identity;
use a GitHub noreply commit address for public work.
Excluded private/auth paths are rejected before reading their blobs. Symlinks
are never followed. Binary and >5 MiB files need manual review; oversized blobs
are not read. Warnings preserve files and do not block the CLI.

Exit codes: 0 = no detected blocking finding; 1 = blocked; 2 = incomplete/error.
Findings contain filename, rule, line and severity only. Credential-bearing
filenames use stable redacted identifiers. No source excerpts.
This narrow check cannot certify privacy, source rights, or publication quality.`);
}

function main(args) {
  if (args.length === 1 && args[0] === "--help") return printHelp();
  let mode;
  let ref;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json" && !json) { json = true; continue; }
    if (new Set(["--staged", "--ref", "--history"]).has(arg) && !mode) {
      mode = arg.slice(2);
      if (mode !== "staged") {
        ref = args[++index];
        if (!ref || ref.startsWith("--")) throw new Error("A Git reference value is required.");
      }
      continue;
    }
    throw new Error("Invalid options; use exactly one scan mode and optional --json.");
  }
  if (!mode) throw new Error("A scan mode is required; use --help.");
  const result = scanPublicRepository({ mode, ref });
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`Public checks: ${result.status}`);
    console.log(`Text entries checked: ${result.counts.text}; manual-review entries: ${result.counts.manualReviewEntries}; commit metadata needing review: ${result.counts.commitMetadataReviewEntries}; excluded: ${result.counts.excluded}.`);
    for (const finding of result.findings) console.log(JSON.stringify(finding));
    console.log("No excerpts are printed. Manual source-rights and privacy review remains required.");
  }
  process.exitCode = result.status === "blocked" ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (error) {
    // Only fixed, authored error messages can reach here; subprocess stderr is discarded.
    console.error(error instanceof Error ? error.message : "Public checks did not complete.");
    process.exitCode = 2;
  }
}

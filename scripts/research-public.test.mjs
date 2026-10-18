import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { scanPublicRepository } from "./research-public.mjs";

const cli = join(dirname(fileURLToPath(import.meta.url)), "research-public.mjs");
const syntheticToken = "ghp_" + "T".repeat(36);

function git(cwd, args, input) {
  const result = spawnSync("git", args, { cwd, input, encoding: "utf8" });
  assert.equal(result.status, 0, "Fixture Git command must succeed.");
  return result.stdout.trim();
}

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "research-public-test-"));
  const repositoryRoot = join(root, "repo");
  await mkdir(repositoryRoot);
  t.after(() => rm(root, { recursive: true, force: true }));
  git(repositoryRoot, ["init", "-q"]);
  git(repositoryRoot, ["config", "user.name", "Fixture"]);
  git(repositoryRoot, ["config", "user.email", "fixture" + "@" + "example.invalid"]);
  git(repositoryRoot, ["config", "commit.gpgsign", "false"]);
  git(repositoryRoot, ["config", "core.hooksPath", join(root, "no-hooks")]);
  return { root, repositoryRoot };
}

async function stage(repositoryRoot, filename, content) {
  const path = join(repositoryRoot, filename);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
  git(repositoryRoot, ["add", "--", filename]);
}

test("staged scan reads the complete index snapshot, not the working tree", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "draft.md", `before\n${syntheticToken}\n`);
  await writeFile(join(repositoryRoot, "draft.md"), "clean working copy\n");
  const result = scanPublicRepository({ repositoryRoot, mode: "staged" });
  assert.equal(result.status, "blocked");
  assert.deepEqual(result.findings, [{ filename: "draft.md", rule: "known-token", line: 2, severity: "error" }]);
  assert.equal(JSON.stringify(result).includes(syntheticToken), false);

  git(repositoryRoot, ["add", "--", "draft.md"]);
  await writeFile(join(repositoryRoot, "draft.md"), syntheticToken);
  assert.equal(scanPublicRepository({ repositoryRoot }).status, "passed");
});

test("force-added private paths are rejected without even requesting their blob", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, ".gitignore", ".local/\n");
  const path = join(repositoryRoot, ".local", "capture.md");
  await mkdir(dirname(path));
  await writeFile(path, syntheticToken);
  git(repositoryRoot, ["add", "-f", "--", ".local/capture.md"]);
  const oid = git(repositoryRoot, ["rev-parse", ":.local/capture.md"]);
  // Remove the fixture's loose object: any attempt to inspect its size or contents would fail.
  const objectPath = git(repositoryRoot, ["rev-parse", "--git-path", `objects/${oid.slice(0, 2)}/${oid.slice(2)}`]);
  await rm(resolve(repositoryRoot, objectPath));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "blocked");
  assert.equal(result.counts.excluded, 1);
  assert.deepEqual(result.findings, [{ filename: ".local/capture.md", rule: "private-or-auth-path", line: null, severity: "error" }]);
});

test("auth/browser filenames are blocked and an environment example remains inspectable", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const names = ["private/notes.md", "auth.json", "cookies.json", "storageState.json",
    "capture.har", "key.pem", "browser-profile/preferences", ".env.production"];
  for (const name of names) await stage(repositoryRoot, name, "synthetic fixture\n");
  await stage(repositoryRoot, ".env.example", "SOURCE_NAME=example\n");
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.counts.excluded, names.length);
  assert.equal(result.counts.text, 1);
  assert.equal(result.findings.every((finding) => finding.rule === "private-or-auth-path"), true);
});

test("force-added generated browser captures are rejected before blob access", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const names = [".playwright-cli/capture.png", ".playwright-mcp/page.json",
    "test-results/run/capture.png", "playwright-report/index.html"];
  await stage(repositoryRoot, ".gitignore", names.map((name) => name.split("/")[0] + "/").join("\n"));
  for (const name of names) {
    await mkdir(dirname(join(repositoryRoot, name)), { recursive: true });
    await writeFile(join(repositoryRoot, name), "same synthetic capture fixture");
    git(repositoryRoot, ["add", "-f", "--", name]);
  }
  const oid = git(repositoryRoot, ["rev-parse", `:${names[0]}`]);
  const objectPath = git(repositoryRoot, ["rev-parse", "--git-path", `objects/${oid.slice(0, 2)}/${oid.slice(2)}`]);
  await rm(resolve(repositoryRoot, objectPath));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "blocked");
  assert.equal(result.counts.excluded, names.length);
  assert.equal(result.findings.every((finding) => finding.rule === "private-or-auth-path"), true);
});

test("recognized SSH and cloud credential paths are rejected before blob access", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const names = [".ssh/id_rsa", ".config/gcloud/application_default_credentials.json",
    "export/application_default_credentials.json", "export/id_ed25519"];
  for (const name of names) await stage(repositoryRoot, name, "same synthetic credential fixture");
  const oid = git(repositoryRoot, ["rev-parse", `:${names[0]}`]);
  const objectPath = git(repositoryRoot, ["rev-parse", "--git-path", `objects/${oid.slice(0, 2)}/${oid.slice(2)}`]);
  await rm(resolve(repositoryRoot, objectPath));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.counts.excluded, names.length);
  assert.equal(result.findings.every((finding) => finding.rule === "private-or-auth-path"), true);
});

test("credential-bearing filenames are blocked, redacted consistently and never read", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const filename = syntheticToken + ".md";
  await stage(repositoryRoot, filename, "synthetic filename fixture");
  const oid = git(repositoryRoot, ["rev-parse", `:${filename}`]);
  const objectPath = git(repositoryRoot, ["rev-parse", "--git-path", `objects/${oid.slice(0, 2)}/${oid.slice(2)}`]);
  await rm(resolve(repositoryRoot, objectPath));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "blocked");
  assert.equal(result.counts.excluded, 1);
  assert.equal(result.findings[0].rule, "known-token-in-filename");
  assert.match(result.findings[0].filename, /^\[redacted-filename:[a-f0-9]{20}\]$/);
  assert.equal(JSON.stringify(result).includes(syntheticToken), false);
  assert.deepEqual(scanPublicRepository({ repositoryRoot }).findings, result.findings);
  for (const args of [["--staged"], ["--staged", "--json"]]) {
    const output = spawnSync(process.execPath, [cli, ...args], { cwd: repositoryRoot, encoding: "utf8" });
    assert.equal(output.status, 1);
    assert.equal((output.stdout + output.stderr).includes(syntheticToken), false);
    assert.equal(output.stdout.includes(result.findings[0].filename), true);
  }
});

test("other high-confidence private filename findings are redacted before blob access", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const mailbox = "synthetic-person" + "@" + "gmail.com";
  const filenames = [mailbox, "-----BEGIN " + "PRIVATE KEY-----",
    "capture " + "/" + "home/alice/report.md"];
  for (const filename of filenames) await stage(repositoryRoot, filename, "same synthetic private filename fixture");
  await stage(repositoryRoot, "package/fixture" + "@" + "issuer.com", "public package fixture\n");
  const oid = git(repositoryRoot, ["rev-parse", `:${filenames[0]}`]);
  const objectPath = git(repositoryRoot, ["rev-parse", "--git-path", `objects/${oid.slice(0, 2)}/${oid.slice(2)}`]);
  await rm(resolve(repositoryRoot, objectPath));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.counts.excluded, filenames.length);
  assert.equal(result.counts.text, 1);
  assert.deepEqual(result.findings.map((finding) => finding.rule).sort(),
    ["personal-email-in-filename", "personal-machine-path-in-filename", "private-key-in-filename"]);
  for (const finding of result.findings) assert.match(finding.filename, /^\[redacted-filename:[a-f0-9]{20}\]$/);
  for (const filename of filenames) assert.equal(JSON.stringify(result).includes(filename), false);
  assert.equal(JSON.stringify(result).includes(mailbox), false);
});

test("deleted index files are absent while their committed and historical objects remain checkable", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "old.md", syntheticToken);
  git(repositoryRoot, ["commit", "-qm", "Fixture baseline"]);
  git(repositoryRoot, ["rm", "-q", "--", "old.md"]);
  assert.equal(scanPublicRepository({ repositoryRoot }).status, "passed");
  assert.equal(scanPublicRepository({ repositoryRoot, mode: "ref", ref: "HEAD" }).status, "blocked");
  await stage(repositoryRoot, "current.md", "public analysis\n");
  git(repositoryRoot, ["commit", "-qm", "Fixture replacement"]);
  assert.equal(scanPublicRepository({ repositoryRoot, mode: "ref", ref: "HEAD" }).status, "passed");
  const history = scanPublicRepository({ repositoryRoot, mode: "history", ref: "HEAD" });
  assert.equal(history.status, "blocked");
  assert.equal(history.counts.commits, 2);
  assert.equal(history.findings[0].filename, "old.md");
  assert.equal(JSON.stringify(history).includes(syntheticToken), false);
});

test("commit identity checks accept reserved examples and GitHub noreply addresses", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "public.md", "safe fixture\n");
  git(repositoryRoot, ["commit", "-qm", "Reserved identity fixture"]);
  git(repositoryRoot, ["config", "user.email", "123+fixture" + "@" + "users.noreply.github.com"]);
  git(repositoryRoot, ["commit", "--allow-empty", "-qm", "Noreply fixture",
    "--author", "Fixture <" + "fixture" + "@" + "noreply.github.com>"]);
  const current = scanPublicRepository({ repositoryRoot, mode: "ref", ref: "HEAD" });
  assert.equal(current.counts.commits, 1);
  assert.equal(current.status, "passed");
  const history = scanPublicRepository({ repositoryRoot, mode: "history", ref: "HEAD" });
  assert.equal(history.counts.commits, 2);
  assert.equal(history.counts.commitMetadataReviewEntries, 0);
  assert.equal(history.status, "passed");
});

test("commit author and committer addresses produce redacted warnings only for scanned revisions", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const author = "synthetic-author" + "@" + "gmail.com";
  const committer = "synthetic-committer" + "@" + "issuer.com";
  await stage(repositoryRoot, "public.md", "safe fixture\n");
  git(repositoryRoot, ["config", "user.email", committer]);
  git(repositoryRoot, ["commit", "-qm", "Ordinary identity fixture", "--author", `Fixture <${author}>`]);
  const revision = git(repositoryRoot, ["rev-parse", "HEAD"]);
  const current = scanPublicRepository({ repositoryRoot, mode: "ref", ref: "HEAD" });
  assert.equal(current.status, "manual_review_required");
  assert.equal(current.counts.errors, 0);
  assert.equal(current.counts.commitMetadataReviewEntries, 1);
  assert.deepEqual(current.findings, ["author", "committer"].map((role) => ({
    filename: `<commit-metadata:${revision}>`, rule: `commit-${role}-email-manual-review`,
    line: null, severity: "warning",
  })));
  const staged = scanPublicRepository({ repositoryRoot });
  assert.equal(staged.status, "passed");
  assert.equal(staged.counts.commits, 0);
  for (const args of [["--ref", "HEAD"], ["--ref", "HEAD", "--json"]]) {
    const output = spawnSync(process.execPath, [cli, ...args], { cwd: repositoryRoot, encoding: "utf8" });
    assert.equal(output.status, 0);
    for (const email of [author, committer]) assert.equal((output.stdout + output.stderr).includes(email), false);
  }
  git(repositoryRoot, ["config", "user.email", "fixture" + "@" + "example.com"]);
  git(repositoryRoot, ["commit", "--allow-empty", "-qm", "Reserved identity fixture"]);
  assert.equal(scanPublicRepository({ repositoryRoot, mode: "ref", ref: "HEAD" }).status, "passed");
  const history = scanPublicRepository({ repositoryRoot, mode: "history", ref: "HEAD" });
  assert.equal(history.counts.commits, 2);
  assert.deepEqual(history.findings, current.findings);
  for (const email of [author, committer]) assert.equal(JSON.stringify(history).includes(email), false);
});

test("private keys, personal paths and personal mailboxes yield only redacted findings", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const key = "-----BEGIN " + "PRIVATE KEY-----";
  const machinePath = "/" + "Users" + "/synthetic-person/research";
  const windowsPath = "C:" + "\\Users\\" + "synthetic-person\\research";
  const mailbox = "synthetic-person" + "@" + "gmail.com";
  const content = [key, machinePath, windowsPath, mailbox, syntheticToken].join("\n");
  await stage(repositoryRoot, "notes.md", content);
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.counts.errors, 5);
  for (const finding of result.findings) {
    assert.deepEqual(Object.keys(finding).sort(), ["filename", "line", "rule", "severity"]);
  }
  const serialized = JSON.stringify(result);
  for (const secret of [key, machinePath, windowsPath, mailbox, syntheticToken]) {
    assert.equal(serialized.includes(secret), false);
  }
});

test("non-example institutional mailboxes require review without being called personal", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "contacts.md", ["ir" + "@" + "issuer.com", "person" + "@" + "example.com"].join("\n"));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "manual_review_required");
  assert.equal(result.counts.errors, 0);
  assert.deepEqual(result.findings, [{ filename: "contacts.md", rule: "email-manual-review", line: 1, severity: "warning" }]);
});

test("public home routes are distinct from standalone local paths and file URLs", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const publicUrls = [
    "https://example.org/news/home/20261018123456/article",
    "https://developers.webflow.com/home/changelog",
    "https://example.org/Users/public-profile",
  ];
  await stage(repositoryRoot, "sources.md", publicUrls.join("\n"));
  assert.equal(scanPublicRepository({ repositoryRoot }).status, "passed");
  const localPath = "/" + "home" + "/alice/project";
  const fileUrl = "file://" + "/" + "Users" + "/alice/project";
  await stage(repositoryRoot, "sources.md", [...publicUrls, localPath, fileUrl].join("\n"));
  const result = scanPublicRepository({ repositoryRoot });
  assert.deepEqual(result.findings.map((finding) => finding.line), [4, 5]);
  assert.equal(result.findings.every((finding) => finding.rule === "personal-machine-path"), true);
});

test("signed, credential-bearing, encoded and nested URLs are blocked without echoing values", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const urls = [
    "https://" + "synthetic:password@" + "example.com/article",
    "https://example.com/article?" + "X-Amz-Signature=" + "synthetic-signature",
    "https://example.com/article?" + "%61ccess%5ftoken=" + "synthetic-access",
    "https://example.com/article#" + "access_token=" + "synthetic-fragment",
    "https://example.com/redirect?next=" + encodeURIComponent("https://example.org/?" + "token=" + "synthetic-nested"),
  ];
  await stage(repositoryRoot, "urls.md", [...urls, "https://example.com/article?section=2"].join("\n"));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.counts.errors, urls.length);
  assert.equal(result.findings.every((finding) => finding.rule === "authenticated-url"), true);
  for (const url of urls) assert.equal(JSON.stringify(result).includes(url), false);
});

test("binary and oversized files explicitly need manual review and stay unchanged", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const binary = Buffer.from([0x89, 0x50, 0, 0xff]);
  await stage(repositoryRoot, "chart.bin", binary);
  await stage(repositoryRoot, "large.json", Buffer.alloc(5 * 1024 * 1024 + 1, 0x61));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "manual_review_required");
  assert.equal(result.counts.binary, 1);
  assert.equal(result.counts.oversized, 1);
  assert.equal(result.counts.text, 0);
  assert.equal(result.counts.manualReviewEntries, 2);
  assert.deepEqual(await readFile(join(repositoryRoot, "chart.bin")), binary);
  assert.equal((await readFile(join(repositoryRoot, "large.json"))).length, 5 * 1024 * 1024 + 1);
});

test("a symlink is never followed, but its Git-stored target is checked", async (t) => {
  const { repositoryRoot, root } = await fixture(t);
  await writeFile(join(root, "outside.txt"), syntheticToken);
  await symlink("../outside.txt", join(repositoryRoot, "reference"));
  git(repositoryRoot, ["add", "--", "reference"]);
  let result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "manual_review_required");
  assert.equal(result.counts.symlinks, 1);
  assert.equal(result.findings.some((finding) => finding.rule === "known-token"), false);

  await rm(join(repositoryRoot, "reference"));
  await symlink("/" + "Users" + "/synthetic-person/private.txt", join(repositoryRoot, "reference"));
  git(repositoryRoot, ["add", "--", "reference"]);
  result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "blocked");
  assert.equal(result.findings.some((finding) => finding.rule === "personal-machine-path"), true);
});

test("ASCII PDFs and invalid UTF-8 are not claimed to be reviewed text", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "document.pdf", "%PDF-1.4\n% synthetic PDF fixture\n");
  await stage(repositoryRoot, "bytes.bin", Buffer.from([0xff, 0xfe, 0x41]));
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.counts.binary, 2);
  assert.equal(result.counts.text, 0);
  assert.equal(result.status, "manual_review_required");
});

test("submodule contents are not traversed or declared scanned", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "README.md", "fixture\n");
  git(repositoryRoot, ["commit", "-qm", "Fixture commit"]);
  const oid = git(repositoryRoot, ["rev-parse", "HEAD"]);
  git(repositoryRoot, ["update-index", "--add", "--cacheinfo", "160000", oid, "external"]);
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.counts.submodules, 1);
  assert.equal(result.status, "manual_review_required");
  assert.equal(result.findings[0].rule, "submodule-manual-review");
});

test("untracked files and ignored working material are never inspected", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "public.md", "safe\n");
  await writeFile(join(repositoryRoot, "untracked.md"), syntheticToken);
  await mkdir(join(repositoryRoot, ".local"));
  await writeFile(join(repositoryRoot, ".local", "private.md"), syntheticToken);
  const result = scanPublicRepository({ repositoryRoot });
  assert.equal(result.status, "passed");
  assert.equal(result.counts.entries, 1);
});

test("CLI failure and filename output cannot expose content or inject terminal controls", async (t) => {
  const { repositoryRoot } = await fixture(t);
  const filename = "odd\nname.md";
  await stage(repositoryRoot, filename, syntheticToken);
  const result = spawnSync(process.execPath, [cli, "--staged", "--json"], { cwd: repositoryRoot, encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).findings[0].filename, filename);
  assert.equal(result.stdout.includes(syntheticToken), false);
  assert.equal(result.stderr, "");
  const textResult = spawnSync(process.execPath, [cli, "--staged"], { cwd: repositoryRoot, encoding: "utf8" });
  assert.equal(textResult.stdout.includes(filename), false);
  assert.equal(textResult.stdout.includes("odd\\nname.md"), true);
  assert.equal(textResult.stdout.includes(syntheticToken), false);
  const invalid = spawnSync(process.execPath, [cli, "--ref", `unknown-${syntheticToken}`], { cwd: repositoryRoot, encoding: "utf8" });
  assert.equal(invalid.status, 2);
  assert.equal(invalid.stderr.includes(syntheticToken), false);
  assert.equal(invalid.stdout, "");
});

test("CLI warns rather than passing off binary content as inspected", async (t) => {
  const { repositoryRoot } = await fixture(t);
  await stage(repositoryRoot, "chart.bin", Buffer.from([0]));
  const result = spawnSync(process.execPath, [cli, "--staged", "--json"], { cwd: repositoryRoot, encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.equal(JSON.parse(result.stdout).status, "manual_review_required");
});

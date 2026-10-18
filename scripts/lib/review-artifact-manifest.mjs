import { createHash } from "node:crypto";
import { readFile, realpath, stat } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

const roles = new Set(["model_input", "evidence", "model_dependency", "generated_output"]);
const hashPattern = /^sha256:[a-f0-9]{64}$/;

function isPrivatePath(path) {
  return path.split(/[\\/]/).some((part) =>
    [".local", ".auth", ".codex", ".playwright-cli", ".playwright-mcp", "private", "downloads"].includes(part) ||
    /^\.env(?:\.|$)/.test(part) ||
    /^(?:cookies\.(?:json|txt)|storage-state.*\.json|storageState.*\.json|credentials\..*|client_secret.*\.json|oauth_credentials.*\.json)$/i.test(part) ||
    /\.(?:pem|key|p12|pfx|har)$/i.test(part)
  );
}

function inside(parent, candidate) {
  const path = relative(parent, candidate);
  return path !== "" && path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function resolveDeclaredPath(repositoryRoot, fromPath, path) {
  if (typeof path !== "string" || !path.trim() || isAbsolute(path) || path.includes("\\")) return null;
  if (isPrivatePath(path)) return null;
  return path.startsWith("companies/") ? resolve(repositoryRoot, path) : resolve(dirname(fromPath), path);
}

async function checkedFile(companyRoot, path) {
  if (!path || !inside(companyRoot, path)) return null;
  try {
    const [resolvedRoot, resolvedPath] = await Promise.all([realpath(companyRoot), realpath(path)]);
    if (!inside(resolvedRoot, resolvedPath) || isPrivatePath(relative(resolvedRoot, resolvedPath)) || !(await stat(resolvedPath)).isFile()) return null;
    return resolvedPath;
  } catch {
    return null;
  }
}

function onlyFields(record, expected) {
  return Object.keys(record).every((field) => expected.includes(field));
}

// This verifies the declared snapshot, not whether the author listed every dependency
// or whether any assumption is economically justified. It never executes model code.
export async function validateReviewArtifactManifest({ repositoryRoot, companyRoot, cyclePath, cycle }) {
  const findings = [];
  const displayPath = (path) => relative(repositoryRoot, path).split(sep).join("/");
  const add = (message, path = cyclePath) => findings.push({
    level: "error", check: "review-artifact-manifest", message, path: displayPath(path),
  });
  const declared = resolveDeclaredPath(repositoryRoot, cyclePath, cycle.review_artifact_manifest_path);
  const manifestPath = await checkedFile(companyRoot, declared);
  if (!manifestPath || !declared.endsWith(".json")) {
    add("review_artifact_manifest_path must reference an existing JSON file inside the company root; local/private paths and escaping symlinks are forbidden.");
    return findings;
  }
  const content = await readFile(manifestPath);
  const actualHash = `sha256:${createHash("sha256").update(content).digest("hex")}`;
  if (cycle.review_artifact_manifest_hash && cycle.review_artifact_manifest_hash !== actualHash) {
    add("review_artifact_manifest_hash does not match the artifact manifest; the review snapshot is stale.");
  }
  let manifest;
  try {
    manifest = JSON.parse(content.toString("utf8"));
  } catch {
    add("The review artifact manifest must contain valid JSON.", declared);
    return findings;
  }
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    add("The review artifact manifest must be an object.", declared);
    return findings;
  }
  if (!onlyFields(manifest, ["type", "schema_version", "coverage_cycle_id", "source_cutoff_at", "artifacts"])) {
    add("The review artifact manifest contains unknown fields.", declared);
  }
  if (manifest.type !== "review_artifact_manifest" || manifest.schema_version !== 1) {
    add("The review artifact manifest requires type: review_artifact_manifest and schema_version: 1.", declared);
  }
  for (const field of ["coverage_cycle_id", "source_cutoff_at"]) {
    if (!manifest[field] || manifest[field] !== cycle[field]) add(`${field} must match the coverage-cycle manifest.`, declared);
  }
  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) {
    add("The review artifact manifest requires a non-empty artifacts array.", declared);
    return findings;
  }
  const seenPaths = new Set();
  const seenRoles = new Set();
  for (const [index, artifact] of manifest.artifacts.entries()) {
    const label = `artifacts[${index}]`;
    if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) {
      add(`${label} must be an object.`, declared);
      continue;
    }
    if (!onlyFields(artifact, ["path", "role", "sha256"]) || !roles.has(artifact.role) || !hashPattern.test(artifact.sha256)) {
      add(`${label} requires path, a supported role, and a sha256 digest, with no unknown fields.`, declared);
    }
    const target = resolveDeclaredPath(repositoryRoot, declared, artifact.path);
    const checked = await checkedFile(companyRoot, target);
    if (!checked || checked === manifestPath) {
      add(`${label}.path must reference a file inside the company root, excluding the manifest itself, local/private paths, and escaping symlinks.`, declared);
      continue;
    }
    if (seenPaths.has(checked)) {
      add(`${label}.path duplicates another artifact, including aliases or symlinks.`, declared);
      continue;
    }
    seenPaths.add(checked);
    seenRoles.add(artifact.role);
    const hash = `sha256:${createHash("sha256").update(await readFile(checked)).digest("hex")}`;
    if (artifact.sha256 !== hash) add(`${label} ${artifact.path} changed after review; its SHA-256 does not match.`, declared);
  }
  for (const role of ["model_input", "evidence"]) {
    if (!seenRoles.has(role)) add(`The review artifact manifest must bind at least one ${role} file.`, declared);
  }
  return findings;
}

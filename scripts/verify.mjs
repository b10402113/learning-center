#!/usr/bin/env node
// verify.mjs — the verification script for the learning path.
//
// Runs deterministic FORMAT checks only (frontmatter, IDs, DAG consistency,
// link/reference resolution, digest hash, section presence). It never judges
// prose quality or content semantics — that is deliberately out of scope.
//
// Usage:
//   node scripts/verify.mjs --node <subject>/<node-id>   # per-node gate (/nodes step 8)
//   node scripts/verify.mjs --subject <subject>          # whole-subject lint (AGENTS.md)
//   node scripts/verify.mjs --subject <subject> --json   # machine-readable report
//
// Exit 0 = no failures, 1 = at least one failure.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "./generate-data.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEARN_ROOT = join(REPO_ROOT, "learn");
const SOURCES_ROOT = join(REPO_ROOT, "sources");

const ALLOWED_STATUS = new Set([
  "draft",
  "probed",
  "confirmed",
  "nodes-written",
  "content-written",
  "edges-written",
]);

const NODE_FM = ["id", "title", "subject", "tier", "order", "status", "goal", "sources", "steps", "created", "updated"];
const STEP_FM = ["id", "title", "subject", "sources", "created", "updated"];
const EDGE_FM = ["title", "type", "from", "to", "nodes", "created", "updated"];

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

class Report {
  constructor() {
    this.failures = [];
    this.flags = [];
  }
  fail(file, line, checkId, message) {
    this.failures.push({ file: file ?? "", line: line ?? 0, checkId, message });
  }
  flag(file, checkId, message) {
    this.flags.push({ file: file ?? "", checkId, message });
  }
  get hasFailures() {
    return this.failures.length > 0;
  }
}

// --- file scanning ---------------------------------------------------------

function readFiles(dir, exts = [".md", ".mdx"]) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && exts.some((e) => entry.name.endsWith(e))) {
      out.push({ path: join(dir, entry.name), name: entry.name });
    }
  }
  return out;
}

function scanSubjectDir(subject) {
  const sub = join(LEARN_ROOT, subject);
  const nodesDir = join(sub, "nodes");
  const edgesDir = join(sub, "edges");
  const digestsDir = join(sub, "digests");

  const nodes = readFiles(nodesDir, [".mdx", ".md"]).map((f) => ({
    ...f,
    id: f.name.replace(/\.(mdx|md)$/, ""),
  }));

  const steps = [];
  if (existsSync(nodesDir)) {
    for (const nodeEntry of readdirSync(nodesDir, { withFileTypes: true })) {
      if (!nodeEntry.isDirectory()) continue;
      for (const f of readFiles(join(nodesDir, nodeEntry.name))) {
        steps.push({
          path: f.path,
          name: f.name,
          nodeId: nodeEntry.name,
          id: f.name.replace(/\.(mdx|md)$/, ""),
        });
      }
    }
  }

  const edges = readFiles(edgesDir).map((f) => ({ ...f, name: f.name }));
  const digests = readFiles(digestsDir, [".md"]);

  return { sub, nodes, steps, edges, digests };
}

function readSubjectDoc(subject, file) {
  const p = join(LEARN_ROOT, subject, file);
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

function parse(path) {
  return parseFrontmatter(readFileSync(path, "utf8"));
}

// --- link extraction -------------------------------------------------------

function extractLinks(text, subject) {
  const links = [];
  const re = new RegExp(`\\[\\[\\s*(learn\\/${subject.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\/[^\\]|]+)`, "g");
  let m;
  while ((m = re.exec(text)) !== null) {
    links.push(m[1].trim());
  }
  return [...new Set(links)];
}

function extractSourceLinks(text) {
  const links = [];
  const re = /\[\[\s*(sources\/[^\]]+?)\s*\]\]/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    links.push(m[1].trim());
  }
  return [...new Set(links)];
}

function findHeadingSection(body, token) {
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^##\\s+(?:${esc}\\s*$|.+?[(（]${esc}[)）]\\s*$)`, "m");
  const m = body.match(re);
  if (!m) return null;
  const rest = body.slice(m.index + m[0].length);
  const next = rest.match(/^##\s/m);
  return next ? rest.slice(0, next.index) : rest;
}

// --- digest helpers --------------------------------------------------------

function buildDigestIndex(subject) {
  const digests = scanSubjectDir(subject).digests;
  const hashToDigest = new Map();
  const allLocators = new Set();
  const totalLines = { value: 0 };
  for (const d of digests) {
    const { data, body } = parseFrontmatter(readFileSync(d.path, "utf8"));
    if (data.source_hash) hashToDigest.set(data.source_hash, d.name);
    if (typeof data.source_lines === "number") totalLines.value += data.source_lines;
    const re = /Locator:\s*`?\[\[\s*sources\/[^\]]*?#([^\]]+)\s*\]\]`?/g;
    let m;
    while ((m = re.exec(body)) !== null) allLocators.add(m[1].trim());
  }
  return { digests, hashToDigest, allLocators, totalLines };
}

function sourceFilesFor(subject) {
  const dir = join(SOURCES_ROOT, subject);
  if (!existsSync(dir)) return [];
  const out = [];
  function walk(d, rel) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const full = join(d, e.name);
      const name = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        walk(full, name);
      } else if (e.isFile()) {
        out.push({ name, hash: sha256(readFileSync(full)) });
      }
    }
  }
  walk(dir, "");
  return out;
}

function baselineNodeCount(totalLines) {
  return Math.max(3, Math.min(30, Math.round(totalLines / 1100)));
}

// --- checks ----------------------------------------------------------------

function checkFrontmatter(report, path, fm, required) {
  const rel = path.replace(REPO_ROOT + "/", "");
  const line = 1;
  for (const key of required) {
    if (fm[key] === undefined || fm[key] === null || fm[key] === "") {
      report.fail(rel, line, "fm-required", `missing required frontmatter key: ${key}`);
    }
  }
  if (fm.status !== undefined && !ALLOWED_STATUS.has(String(fm.status))) {
    report.fail(rel, line, "fm-status", `invalid status: ${fm.status}`);
  }
}

function checkIdFilename(report, path, id, expectedId) {
  if (id !== expectedId) {
    report.fail(
      path.replace(REPO_ROOT + "/", ""),
      1,
      "id-filename",
      `frontmatter id "${id}" does not match filename "${expectedId}"`,
    );
  }
}

function checkDag(report, path, nodeId, fm, stepFiles, stepIdsByNode) {
  const rel = path.replace(REPO_ROOT + "/", "");
  const dag = Array.isArray(fm.steps) ? fm.steps : [];
  const seenOrders = new Set();
  for (const s of dag) {
    const id = s?.id;
    if (!id) {
      report.fail(rel, 1, "dag-step-exists", "steps entry missing id");
      continue;
    }
    if (!stepFiles.has(id)) {
      report.fail(rel, 1, "dag-step-exists", `step "${id}" has no step file under nodes/${nodeId}/`);
    }
    const order = Number(s?.order) || 0;
    if (order && seenOrders.has(order)) {
      report.fail(rel, 1, "dag-order-deps", `duplicate order ${order} for step "${id}"`);
    }
    seenOrders.add(order);
    for (const dep of Array.isArray(s?.deps) ? s.deps : []) {
      if (!stepFiles.has(dep)) {
        report.fail(rel, 1, "dag-order-deps", `step "${id}" depends on "${dep}" which is not a step of this node`);
      }
    }
  }
  for (const [stepId, stepNode] of stepIdsByNode) {
    if (stepNode === nodeId && !dag.some((s) => s?.id === stepId)) {
      report.fail(rel, 1, "dag-orphan-step", `step file "${stepId}" has no entry in this node's steps DAG`);
    }
  }
}

function checkReferences(report, path, text, subject, nodeIds, stepKeys) {
  const rel = path.replace(REPO_ROOT + "/", "");
  const links = extractLinks(text, subject);
  for (const target of links) {
    const parts = target.split("/");
    // learn/<subject>/<kind>/...
    if (parts[0] !== "learn" || parts[1] !== subject) continue;
    const kind = parts[2];
    if (kind === "nodes") {
      const nodeId = parts[3];
      if (parts.length === 4) {
        if (!nodeIds.has(nodeId)) {
          report.fail(rel, 0, "link-node", `node link to missing node "${nodeId}"`);
        }
      } else if (parts.length === 5) {
        const stepKey = `${nodeId}/${parts[4]}`;
        if (!stepKeys.has(stepKey)) {
          report.fail(rel, 0, "link-step", `step link to missing step "${stepKey}"`);
        }
      }
    }
  }
}

function checkSourceLinks(report, path, text, subject, sourceNames) {
  const rel = path.replace(REPO_ROOT + "/", "");
  for (const link of extractSourceLinks(text)) {
    // sources/<subject>/<file>[#locator]
    const rest = link.replace(/^sources\//, "");
    const hashIdx = rest.indexOf("#");
    const filePart = hashIdx === -1 ? rest : rest.slice(0, hashIdx);
    const locator = hashIdx === -1 ? "" : rest.slice(hashIdx + 1);
    const parts = filePart.split("/");
    const srcSubject = parts[0];
    const fileName = parts.slice(1).join("/");
    if (srcSubject !== subject) {
      report.fail(rel, 0, "src-path", `source link subject "${srcSubject}" does not match "${subject}"`);
    } else if (!sourceNames.has(fileName) && !sourceNames.has(fileName + ".md")) {
      report.fail(rel, 0, "src-path", `source file "${fileName}" not found under sources/${subject}/`);
    } else if (locator) {
      checkLocator(report, rel, locator);
    }
  }
}

let digestLocatorsCache = null;
function checkLocator(report, rel, locator) {
  if (!digestLocatorsCache) {
    digestLocatorsCache = new Set();
    for (const subjectDir of readdirSync(LEARN_ROOT, { withFileTypes: true })) {
      if (!subjectDir.isDirectory()) continue;
      const idx = buildDigestIndex(subjectDir.name);
      for (const l of idx.allLocators) digestLocatorsCache.add(l);
    }
  }
  let found = false;
  for (const l of digestLocatorsCache) {
    if (l.includes(locator) || locator.includes(l)) {
      found = true;
      break;
    }
  }
  if (!found) {
    report.fail(rel, 0, "src-locator", `source locator "#${locator}" not found in any digest`);
  }
}

// --- scope runners ---------------------------------------------------------

function runNodeChecks(report, subject, nodeId, scan, digestIdx, sourceNames, nodeIds, stepKeys) {
  const nodeFile = scan.nodes.find((n) => n.id === nodeId);
  if (!nodeFile) {
    report.fail("", 0, "dag-step-exists", `node "${nodeId}" not found under nodes/`);
    return;
  }

  const stepFiles = new Set();
  const stepIdsByNode = new Map();
  for (const s of scan.steps) {
    stepFiles.add(s.id);
    stepIdsByNode.set(s.id, s.nodeId);
  }

  const { data: nodeFm, body: nodeBody } = parse(nodeFile.path);
  checkFrontmatter(report, nodeFile.path, nodeFm, NODE_FM);
  checkIdFilename(report, nodeFile.path, nodeFm.id, nodeFile.id);
  checkDag(report, nodeFile.path, nodeId, nodeFm, stepFiles, stepIdsByNode);
  checkReferences(report, nodeFile.path, nodeBody, subject, nodeIds, stepKeys);
  checkSourceLinks(report, nodeFile.path, nodeBody, subject, sourceNames);

  const nodeSteps = scan.steps.filter((s) => s.nodeId === nodeId);
  for (const step of nodeSteps) {
    const { data: fm, body } = parse(step.path);
    checkFrontmatter(report, step.path, fm, STEP_FM);
    checkIdFilename(report, step.path, fm.id, step.id);
    checkReferences(report, step.path, body, subject, nodeIds, stepKeys);
    checkSourceLinks(report, step.path, body, subject, sourceNames);
  }

  checkDigestHash(report, subject, sourceNames, digestIdx);
}

function runSubjectChecks(report, subject, scan, digestIdx, sourceNames, nodeIds, stepKeys) {
  for (const node of scan.nodes) {
    const { data: fm, body } = parse(node.path);
    checkFrontmatter(report, node.path, fm, NODE_FM);
    checkIdFilename(report, node.path, fm.id, node.id);
    checkReferences(report, node.path, body, subject, nodeIds, stepKeys);
    checkSourceLinks(report, node.path, body, subject, sourceNames);
  }

  const stepFiles = new Set();
  const stepIdsByNode = new Map();
  for (const s of scan.steps) {
    stepFiles.add(s.id);
    stepIdsByNode.set(s.id, s.nodeId);
  }

  for (const step of scan.steps) {
    const { data: fm, body } = parse(step.path);
    checkFrontmatter(report, step.path, fm, STEP_FM);
    checkIdFilename(report, step.path, fm.id, step.id);
    checkReferences(report, step.path, body, subject, nodeIds, stepKeys);
    checkSourceLinks(report, step.path, body, subject, sourceNames);
  }

  for (const node of scan.nodes) {
    const { data: fm } = parse(node.path);
    checkDag(report, node.path, node.id, fm, stepFiles, stepIdsByNode);
  }

  for (const edge of scan.edges) {
    const { data: fm, body } = parse(edge.path);
    checkFrontmatter(report, edge.path, fm, EDGE_FM);
    if (Array.isArray(fm.nodes)) {
      for (const n of fm.nodes) {
        const id = String(n).split("/").pop();
        if (!nodeIds.has(id)) {
          report.fail(edge.path.replace(REPO_ROOT + "/", ""), 1, "lint-edge-refs", `edge nodes reference missing node "${id}"`);
        }
      }
    }
    checkReferences(report, edge.path, body, subject, nodeIds, stepKeys);
  }

  checkOrphans(report, subject, scan, nodeIds, stepKeys);
  checkNodeCount(report, subject, scan, digestIdx);
  checkDigestHash(report, subject, sourceNames, digestIdx);
}

function checkDigestHash(report, subject, sourceNames, digestIdx) {
  const rel = `learn/${subject}/digests/`;
  for (const src of sourceFilesFor(subject)) {
    if (!digestIdx.hashToDigest.has(src.hash)) {
      report.fail(rel, 0, "digest-hash", `no digest matches source file "${src.name}" (hash mismatch or missing digest)`);
    }
  }
  for (const [hash, digestName] of digestIdx.hashToDigest) {
    const matches = sourceFilesFor(subject).some((s) => s.hash === hash);
    if (!matches) {
      report.fail(`${rel}${digestName}`, 0, "digest-hash", `digest source_hash matches no source file`);
    }
  }
}

function checkNodeCount(report, subject, scan, digestIdx) {
  const target = baselineNodeCount(digestIdx.totalLines.value);
  const actual = scan.nodes.length;
  if (target > 0) {
    const dev = (actual - target) / target;
    if (Math.abs(dev) > 0.4) {
      report.flag(`learn/${subject}`, "lint-node-count", `node count ${actual} deviates ${(dev * 100).toFixed(0)}% from baseline ${target} (±40%)`);
    }
  }
}

function checkOrphans(report, subject, scan, nodeIds, stepKeys) {
  const allLinks = new Set();
  const collect = (text) => {
    for (const l of extractLinks(text, subject)) {
      const parts = l.split("/");
      if (parts[0] === "learn" && parts[1] === subject) {
        if (parts[2] === "nodes") {
          if (parts.length === 4) allLinks.add(parts[3]);
          else if (parts.length === 5) allLinks.add(`${parts[3]}/${parts[4]}`);
        }
      }
    }
  };
  for (const f of [...scan.nodes, ...scan.steps, ...scan.edges]) {
    collect(readFileSync(f.path, "utf8"));
  }
  const roadmap = readSubjectDoc(subject, "ROADMAP.md");
  collect(roadmap);
  const mastery = readSubjectDoc(subject, "mastery.md");
  collect(mastery);

  for (const n of scan.nodes) {
    if (!allLinks.has(n.id)) report.flag(`learn/${subject}/nodes/${n.name}`, "lint-orphan", "node is not referenced by any link");
  }
  for (const s of scan.steps) {
    if (!allLinks.has(`${s.nodeId}/${s.id}`)) report.flag(`learn/${subject}/nodes/${s.nodeId}/${s.name}`, "lint-orphan", "step is not referenced by any link");
  }
}

// --- main ------------------------------------------------------------------

function usage() {
  console.error("usage: node scripts/verify.mjs (--node <subject>/<node-id> | --subject <subject>) [--json]");
}

function main(argv) {
  const args = argv.slice(2);
  let nodeTarget = null;
  let subject = null;
  let json = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--node" && i + 1 < args.length) {
      const val = args[++i];
      const slash = val.indexOf("/");
      if (slash === -1) {
        usage();
        process.exit(2);
      }
      subject = val.slice(0, slash);
      nodeTarget = val.slice(slash + 1);
    } else if (args[i] === "--subject" && i + 1 < args.length) {
      subject = args[++i];
    } else if (args[i] === "--json") {
      json = true;
    }
  }

  if (!subject) {
    usage();
    process.exit(2);
  }
  if (!existsSync(join(LEARN_ROOT, subject))) {
    console.error(`unknown subject: ${subject}`);
    process.exit(2);
  }

  const scan = scanSubjectDir(subject);
  const digestIdx = buildDigestIndex(subject);
  const sourceNames = new Set(sourceFilesFor(subject).map((s) => s.name));
  const nodeIds = new Set(scan.nodes.map((n) => n.id));
  const stepKeys = new Set(scan.steps.map((s) => `${s.nodeId}/${s.id}`));

  const report = new Report();
  digestLocatorsCache = null;

  if (nodeTarget) {
    runNodeChecks(report, subject, nodeTarget, scan, digestIdx, sourceNames, nodeIds, stepKeys);
  } else {
    runSubjectChecks(report, subject, scan, digestIdx, sourceNames, nodeIds, stepKeys);
  }

  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          subject,
          ...(nodeTarget ? { node: nodeTarget } : {}),
          failures: report.failures,
          flags: report.flags,
          pass: !report.hasFailures,
        },
        null,
        2,
      ) + "\n",
    );
    process.exit(report.hasFailures ? 1 : 0);
  }

  const files = new Set(report.failures.map((f) => f.file).filter(Boolean));
  const flagFiles = new Set(report.flags.map((f) => f.file).filter(Boolean));
  console.log(
    `SUMMARY: ${scan.nodes.length} node(s), ${scan.steps.length} step(s), ${scan.edges.length} edge(s) checked; ${report.failures.length} failure(s) in ${files.size} file(s), ${report.flags.length} flag(s) in ${flagFiles.size} file(s); exit ${report.hasFailures ? 1 : 0}`,
  );

  if (report.failures.length > 0) {
    console.log("\nFAILURES:");
    for (const f of report.failures) {
      const loc = f.file ? `${f.file}${f.line ? `:${f.line}` : ""}` : "<root>";
      console.log(`  [${f.checkId}] ${loc} — ${f.message}`);
    }
  }
  if (report.flags.length > 0) {
    console.log("\nFLAGS:");
    for (const f of report.flags) {
      const loc = f.file ? `${f.file}` : "<root>";
      console.log(`  [${f.checkId}] ${loc} — ${f.message}`);
    }
  }
  console.log(report.hasFailures ? "\n✗ FAILED" : "\n✓ PASS");
  process.exit(report.hasFailures ? 1 : 0);
}

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === fileURLToPath(import.meta.url)) {
  main(process.argv);
}

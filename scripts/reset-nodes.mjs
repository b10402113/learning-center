#!/usr/bin/env node
/**
 * reset-nodes.mjs — Reset nodes to the state /nodes leaves behind.
 *
 * Usage:
 *   node scripts/reset-nodes.mjs --subject <subject> --all
 *   node scripts/reset-nodes.mjs --subject <subject> --tier <n>
 *   node scripts/reset-nodes.mjs --subject <subject> --node <slug> [--node <slug> ...]
 *
 * Add --dry-run to preview. The node container's steps array, purposes, sources,
 * and lesson are kept; status returns to `confirmed` and every article becomes a
 * bare H1 skeleton. Generated figures under <step>-assets/ are removed, along with
 * the node's intermediate pipeline artifacts under learn/<subject>/output/
 * (material bundles, job files, prepare state, and article-agent run folders).
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  humanizeRecordPath,
  humanizeWorkDir,
  jobFiles,
  jobsDir,
  materialsDir,
  outputDir,
  prepareFile,
  readJson,
} from "../src/article-agent-bridge.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function nodeLinks(roadmapBody) {
  const links = [];
  for (const match of roadmapBody.matchAll(/(?<!!)\[[^\]]*\]\((nodes\/[^)\s]+?\.md)\)/g)) {
    links.push(match[1].replace(/^nodes\//, "").replace(/\.md$/, ""));
  }
  return links;
}

export function tierNodeIds(roadmapText, tier) {
  const parts = roadmapText.split(/^### /m).slice(1);
  for (const part of parts) {
    const heading = part.split("\n", 1)[0];
    const match = heading.match(/^Tier\s+(\d+)\b/i);
    if (match && Number(match[1]) === Number(tier)) return nodeLinks(part);
  }
  return null;
}

function readRoadmap(root, subject) {
  const path = join(root, "learn", subject, "ROADMAP.md");
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

export function resolveNodeIds({ root = REPO_ROOT, subject, all = false, tier = null, nodes = [] }) {
  const nodesDir = join(root, "learn", subject, "nodes");
  if (!existsSync(nodesDir)) throw new Error(`missing node directory: learn/${subject}/nodes`);
  if (!existsSync(join(root, "learn", subject, "ROADMAP.md"))) {
    throw new Error(`missing roadmap: learn/${subject}/ROADMAP.md`);
  }

  if (nodes.length > 0) return [...new Set(nodes)];

  if (tier !== null) {
    const roadmap = readRoadmap(root, subject);
    const ids = tierNodeIds(roadmap, tier);
    if (ids === null) throw new Error(`ROADMAP.md has no "### Tier ${tier}" section`);
    if (ids.length === 0) throw new Error(`Tier ${tier} has no node links`);
    return [...new Set(ids)];
  }

  if (all) {
    return readdirSync(nodesDir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.replace(/\.md$/, ""))
      .sort();
  }

  throw new Error("choose a scope: --all, --tier <n>, or --node <slug>");
}

function setFrontmatterFields(text, fields) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error("missing YAML frontmatter");
  let block = match[1];
  for (const [key, value] of Object.entries(fields)) {
    const line = new RegExp(`^${key}:.*$`, "m");
    if (line.test(block)) block = block.replace(line, `${key}: ${value}`);
    else block += `\n${key}: ${value}`;
  }
  return `---\n${block}\n---${text.slice(match[0].length)}`;
}

function emptyRemoved() {
  return {
    removedMaterials: 0,
    removedJobs: 0,
    removedPlanFiles: 0,
    removedRuns: 0,
    removedCandidates: 0,
    removedHumanized: 0,
    removedHumanizeWork: 0,
  };
}

/** Removes the pre-`<node>/<step>/` flat artifacts: `<subject>-<node>-<step>.*`. */
function removeLegacyFlat({ root, subject, id, dryRun, removed }) {
  const jobs = jobsDir(root, subject);
  if (existsSync(jobs)) {
    for (const name of readdirSync(jobs)) {
      if (!name.startsWith(`${subject}-${id}-`) && !name.startsWith(`${subject}-${id}.`)) continue;
      if (!dryRun) rmSync(join(jobs, name), { recursive: true, force: true });
      if (name.endsWith(".plan.json")) removed.removedPlanFiles += 1;
      else removed.removedJobs += 1;
    }
  }
  const materials = materialsDir(root, subject);
  if (existsSync(materials)) {
    for (const name of readdirSync(materials)) {
      if (!name.startsWith(`${subject}-${id}-`)) continue;
      if (!dryRun) rmSync(join(materials, name), { force: true });
      removed.removedMaterials += 1;
    }
  }
}

function cleanNodeOutput({ root, subject, id, stepEntries, dryRun }) {
  const removed = emptyRemoved();
  const runDirs = new Set();
  for (const entry of stepEntries) {
    const files = jobFiles(root, { subject, node: id, step: entry.id });
    const result = readJson(files.result);
    if (typeof result?.outputDir === "string") runDirs.add(resolve(result.outputDir));
    for (const [key, path] of [
      ["material", files.material],
      ["original", files.original],
      ["plan", files.plan],
      ["legacyPlan", files.legacyPlan],
      ["protected", files.protected],
      ["blocks", files.blocks],
      ["request", files.request],
      ["result", files.result],
    ]) {
      if (!existsSync(path)) continue;
      if (!dryRun) rmSync(path, { force: true });
      if (key === "material") removed.removedMaterials += 1;
      else if (key === "plan" || key === "legacyPlan") removed.removedPlanFiles += 1;
      else removed.removedJobs += 1;
    }

    const record = humanizeRecordPath(root, { subject, node: id, step: entry.id });
    if (existsSync(record)) {
      if (!dryRun) rmSync(record, { force: true });
      removed.removedHumanized += 1;
    }
    const workDir = humanizeWorkDir(root, { subject, node: id, step: entry.id });
    if (existsSync(workDir)) {
      if (!dryRun) rmSync(workDir, { recursive: true, force: true });
      removed.removedHumanizeWork += 1;
    }
  }
  const prepare = prepareFile(root, subject, id);
  if (existsSync(prepare)) {
    if (!dryRun) rmSync(prepare, { force: true });
    removed.removedJobs += 1;
  }
  const outRoot = resolve(outputDir(root, subject));
  for (const dir of runDirs) {
    const rel = relative(outRoot, dir);
    if (!rel || rel.startsWith("..") || isAbsolute(rel)) continue;
    if (!existsSync(dir)) continue;
    if (!dryRun) rmSync(dir, { recursive: true, force: true });
    removed.removedRuns += 1;
  }
  const candidatesDir = join(outRoot, "quiz-candidates", id);
  if (existsSync(candidatesDir)) {
    removed.removedCandidates = readdirSync(candidatesDir).length;
    if (!dryRun) rmSync(candidatesDir, { recursive: true, force: true });
  }
  removeLegacyFlat({ root, subject, id, dryRun, removed });
  if (!dryRun) {
    for (const dir of [join(jobsDir(root, subject), id), join(materialsDir(root, subject), id)]) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  return removed;
}

export function resetNodes({ root = REPO_ROOT, subject, all = false, tier = null, nodes = [], dryRun = false, today }) {
  const nodeIds = resolveNodeIds({ root, subject, all, tier, nodes });
  const nodesDir = join(root, "learn", subject, "nodes");
  const updated = today || new Date().toISOString().slice(0, 10);
  const results = [];

  const plans = nodeIds.map((id) => {
    const containerPath = join(nodesDir, `${id}.md`);
    if (!existsSync(containerPath)) throw new Error(`missing node container: learn/${subject}/nodes/${id}.md`);
    const parsed = matter(readFileSync(containerPath, "utf8"));
    const stepEntries = Array.isArray(parsed.data.steps) ? parsed.data.steps : [];
    if (parsed.data.status !== "draft" && stepEntries.length === 0) {
      throw new Error(`node "${id}" is ${parsed.data.status} but has no steps`);
    }
    return { id, containerPath, parsed, stepEntries };
  });

  for (const plan of plans) {
    const { id, containerPath, parsed, stepEntries } = plan;
    const status = String(parsed.data.status);
    if (status === "draft" || stepEntries.length === 0) {
      results.push({
        id,
        status,
        skipped: "draft",
        removedArticles: 0,
        removedAssets: 0,
        removedOrphans: 0,
        ...emptyRemoved(),
      });
      continue;
    }

    const nodeDir = join(nodesDir, id);
    const expected = new Set(stepEntries.map((entry) => `${entry.id}.md`));
    const assetDirs = new Set(stepEntries.map((entry) => `${entry.id}-assets`));
    let removedArticles = 0;
    let removedAssets = 0;
    let removedOrphans = 0;

    if (existsSync(nodeDir)) {
      for (const entry of readdirSync(nodeDir, { withFileTypes: true })) {
        if (entry.isDirectory() && assetDirs.has(entry.name)) removedAssets += 1;
        else if (entry.isFile() && expected.has(entry.name)) removedArticles += 1;
        else removedOrphans += 1;
      }
    }

    const output = cleanNodeOutput({ root, subject, id, stepEntries, dryRun });

    if (!dryRun) {
      rmSync(nodeDir, { recursive: true, force: true });
      mkdirSync(nodeDir, { recursive: true });
      for (const entry of stepEntries) {
        writeFileSync(join(nodeDir, `${entry.id}.md`), `# ${entry.title}\n`);
      }

      const container = readFileSync(containerPath, "utf8");
      writeFileSync(containerPath, setFrontmatterFields(container, { status: "confirmed", updated }));
    }

    results.push({ id, status, skipped: null, removedArticles, removedAssets, removedOrphans, ...output });
  }

  return { subject, dryRun, nodes: results };
}

function usage() {
  console.error(
    "usage: node scripts/reset-nodes.mjs --subject <subject> (--all | --tier <n> | --node <slug> [--node <slug> ...]) [--dry-run] [--root <dir>]",
  );
}

function main(argv) {
  const args = argv.slice(2);
  let subject = null;
  let root = REPO_ROOT;
  let all = false;
  let tier = null;
  let dryRun = false;
  const nodes = [];

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--subject" && index + 1 < args.length) subject = args[++index];
    else if (args[index] === "--node" && index + 1 < args.length) nodes.push(args[++index]);
    else if (args[index] === "--tier" && index + 1 < args.length) tier = args[++index];
    else if (args[index] === "--root" && index + 1 < args.length) root = resolve(args[++index]);
    else if (args[index] === "--all") all = true;
    else if (args[index] === "--dry-run") dryRun = true;
    else if (!args[index].startsWith("--") && !subject) subject = args[index];
  }

  if (!subject) {
    usage();
    process.exit(2);
  }

  try {
    const result = resetNodes({ root, subject, all, tier, nodes, dryRun });
    for (const node of result.nodes) {
      const prefix = result.dryRun ? "[DRY RUN] " : "";
      if (node.skipped === "draft") {
        console.log(`${prefix}${node.id}: skipped (draft, no steps)`);
        continue;
      }
      console.log(
        `${prefix}${node.id}: ${node.status} → confirmed; removed ${node.removedArticles} article(s), ` +
          `${node.removedAssets} asset folder(s), ${node.removedOrphans} other entr${node.removedOrphans === 1 ? "y" : "ies"}; ` +
          `${node.removedMaterials} material(s), ${node.removedJobs} job file(s), ${node.removedPlanFiles} plan file(s), ` +
          `${node.removedRuns} article-run folder(s), ${node.removedCandidates} quiz candidate(s), ` +
          `${node.removedHumanized} humanize record(s), ${node.removedHumanizeWork} humanize workspace(s); ` +
          "kept node container",
      );
    }
    console.log(`${result.dryRun ? "[DRY RUN] " : ""}Reset ${result.nodes.length} node(s) in ${result.subject}.`);
  } catch (error) {
    console.error(error.message);
    process.exit(2);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv);

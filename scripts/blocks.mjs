#!/usr/bin/env node
/**
 * blocks.mjs — Recompute coverage, report coverage, and report drift.
 *
 * Usage:
 *   node scripts/blocks.mjs apply  --subject <subject> [--root <dir>] [--json]
 *   node scripts/blocks.mjs report --subject <subject> [--root <dir>] [--json]
 *   node scripts/blocks.mjs check  --subject <subject> [--root <dir>] [--json]
 *
 * `apply` reads audit files from learn/<subject>/output/blocks/*.audit.json plus
 * the node step entries, writes learn/<subject>/blocks/coverage.json, and never
 * edits step prose or block bodies.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  BLOCK_SLUG,
  asDateString,
  blocksDir,
  computeCoverage,
  coveragePath,
  detectDrift,
  loadBlocks,
} from "../src/blocks.mjs";

function usage() {
  console.error("usage: node scripts/blocks.mjs (apply|report|check) --subject <subject> [--root <dir>] [--json]");
}

function parseArgs(argv) {
  const options = { mode: "report", subject: null, root: process.cwd(), json: false };
  const modes = new Set(["apply", "report", "check"]);
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--subject" && index + 1 < argv.length) {
      options.subject = argv[++index];
    } else if (value === "--root" && index + 1 < argv.length) {
      options.root = resolve(argv[++index]);
    } else if (value === "--json") {
      options.json = true;
    } else if (modes.has(value)) {
      options.mode = value;
    } else if (!value.startsWith("--") && !options.subject) {
      options.subject = value;
    }
  }
  return options;
}

function readNodeFiles(root, subject) {
  const dir = join(root, "learn", subject, "nodes");
  if (!existsSync(dir)) return new Map();
  const nodes = new Map();
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const parsed = matter(readFileSync(join(dir, entry.name), "utf8"));
    const id = entry.name.replace(/\.md$/, "");
    const steps = new Map();
    for (const step of Array.isArray(parsed.data.steps) ? parsed.data.steps : []) {
      if (step && step.id) steps.set(step.id, step);
    }
    nodes.set(id, { id, status: parsed.data.status, updated: asDateString(parsed.data.updated), steps });
  }
  return nodes;
}

function readAudits(root, subject) {
  const dir = join(root, "learn", subject, "output", "blocks");
  if (!existsSync(dir)) return [];
  const audits = [];
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith(".audit.json")) continue;
    try {
      const parsed = JSON.parse(readFileSync(join(dir, name), "utf8"));
      if (parsed && typeof parsed === "object" && parsed.node) audits.push(parsed);
    } catch {
      // A malformed audit is ignored; `check` and verify report the drift.
    }
  }
  return audits;
}

function buildAliasMap(blocks) {
  const aliases = new Map();
  for (const block of blocks) {
    for (const raw of Array.isArray(block.data?.aliases) ? block.data.aliases : []) {
      if (typeof raw === "string" && raw.trim()) aliases.set(raw.trim(), block.id);
    }
  }
  return aliases;
}

function canonicalBlockId(aliases, id) {
  return aliases.get(id) ?? id;
}

function slugForBlock(block) {
  const slug = typeof block.data?.slug === "string" ? block.data.slug.trim() : "";
  return slug || block.id;
}

function today() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function dedupeConcepts(concepts) {
  const seen = new Set();
  const out = [];
  for (const concept of concepts) {
    if (!concept || !BLOCK_SLUG.test(concept.slug)) continue;
    if (seen.has(concept.slug)) continue;
    seen.add(concept.slug);
    out.push(concept);
  }
  return out;
}

function conceptFromStepBlock(block) {
  return {
    slug: slugForBlock(block),
    label: typeof block.data?.label === "string" ? block.data.label : block.id,
    sources: Array.isArray(block.data?.sources) ? block.data.sources : [],
    block: block.id,
    note: "",
  };
}

function buildCoverage(root, subject) {
  const { blocks } = loadBlocks(root, subject);
  const blockById = new Map(blocks.map((block) => [block.id, block]));
  const aliases = buildAliasMap(blocks);
  const nodes = readNodeFiles(root, subject);
  const audits = readAudits(root, subject);
  const steps = {};

  for (const audit of audits) {
    const node = nodes.get(audit.node);
    if (!node || node.status !== "written") continue;
    for (const [stepId, payload] of Object.entries(audit.steps ?? {})) {
      const step = node.steps.get(stepId);
      if (!step) continue;
      const article = join(root, "learn", subject, "nodes", audit.node, `${stepId}.md`);
      if (!existsSync(article)) continue;
      const concepts = [];
      for (const candidate of Array.isArray(payload?.concepts) ? payload.concepts : []) {
        if (!candidate || typeof candidate.slug !== "string") continue;
        const slug = candidate.slug.trim();
        if (!BLOCK_SLUG.test(slug)) continue;
        let block = null;
        const matchBlock = candidate.match?.block;
        if (typeof matchBlock === "string" && matchBlock.trim()) {
          block = canonicalBlockId(aliases, matchBlock.trim());
        } else if (["new", "reuse", "merge"].includes(candidate.match?.kind) && blockById.has(slug)) {
          block = slug;
        }
        if (block && !blockById.has(block)) block = null;
        concepts.push({
          slug,
          label: typeof candidate.label === "string" ? candidate.label : slug,
          sources: Array.isArray(candidate.sources) ? candidate.sources : [],
          block,
          note: typeof candidate.note === "string" ? candidate.note : "",
        });
      }
      steps[`${audit.node}/${stepId}`] = { concepts: dedupeConcepts(concepts) };
    }
  }

  for (const [nodeId, node] of nodes) {
    if (node.status !== "written") continue;
    for (const [stepId, step] of node.steps) {
      const key = `${nodeId}/${stepId}`;
      const linked = Array.isArray(step.blocks) ? step.blocks : [];
      const existing = steps[key]?.concepts ?? [];
      const represented = new Set(existing.filter((concept) => concept.block).map((concept) => concept.block));
      const extra = [];
      for (const raw of linked) {
        const id = typeof raw === "string" ? raw.trim() : "";
        if (!id) continue;
        const canonical = canonicalBlockId(aliases, id);
        const block = blockById.get(canonical);
        if (!block || represented.has(canonical)) continue;
        represented.add(canonical);
        extra.push(conceptFromStepBlock(block));
      }
      if (existing.length > 0 || extra.length > 0) {
        steps[key] = { concepts: dedupeConcepts([...existing, ...extra]) };
      }
    }
  }

  return { subject, generatedAt: today(), steps: sortObject(steps) };
}

function sortObject(object) {
  return Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
}

function coverageFile(root, subject) {
  const path = coveragePath(root, subject);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

function stepRecords(nodes) {
  const records = [];
  for (const [nodeId, node] of nodes) {
    for (const [stepId, step] of node.steps) {
      records.push({
        key: `${nodeId}/${stepId}`,
        blocks: Array.isArray(step.blocks) ? step.blocks : [],
        sources: Array.isArray(step.sources) ? step.sources : [],
        updated: node.updated,
      });
    }
  }
  return records.sort((a, b) => a.key.localeCompare(b.key));
}

function apply(root, subject) {
  const coverage = buildCoverage(root, subject);
  const dir = blocksDir(root, subject);
  if (!existsSync(dir)) return { subject, written: false, coverage };
  writeFileSync(coveragePath(root, subject), `${JSON.stringify(coverage, null, 2)}\n`);
  return { subject, written: true, coverage };
}

function report(root, subject) {
  const coverage = coverageFile(root, subject);
  if (!coverage) {
    return { subject, coverage: null, error: `no coverage.json at learn/${subject}/blocks/coverage.json` };
  }
  return { subject, coverage, stats: computeCoverage(coverage) };
}

function check(root, subject) {
  const { blocks } = loadBlocks(root, subject);
  const coverage = coverageFile(root, subject);
  const nodes = readNodeFiles(root, subject);
  const steps = stepRecords(nodes);
  const drifts = detectDrift({ blocks, steps, coverage });
  return { subject, drifts };
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function printReport(result) {
  if (result.error) {
    console.log(result.error);
    return;
  }
  const stats = result.stats;
  console.log(`Subject: ${result.subject}`);
  console.log(`Step coverage: ${formatPercent(stats.stepCoverage)} (${stats.coveredPairs}/${stats.pairs})`);
  console.log(
    `Course coverage: ${formatPercent(stats.courseCoverage)} (${stats.coveredConcepts}/${stats.concepts})`,
  );
  console.log(`Blocks: ${stats.blockCount} current / ${stats.projectedBlocks} projected`);
  console.log(`Reuse factor: ${stats.reuseFactor.toFixed(2)}`);
  if (stats.uncovered.length === 0) {
    console.log("Uncovered concepts: none");
  } else {
    console.log(`Uncovered concepts (${stats.uncovered.length}):`);
    for (const concept of stats.uncovered) console.log(`  - ${concept.label} (${concept.slug})`);
  }
}

function printDrifts(result) {
  if (result.drifts.length === 0) {
    console.log(`No drift for ${result.subject}.`);
    return;
  }
  console.log(`Drift for ${result.subject}: ${result.drifts.length}`);
  for (const drift of result.drifts) console.log(`  [${drift.kind}] ${drift.message}`);
}

function main(argv) {
  const options = parseArgs(argv.slice(2));
  if (!options.subject) {
    usage();
    process.exit(2);
  }
  if (!existsSync(join(options.root, "learn", options.subject))) {
    console.error(`unknown subject: ${options.subject}`);
    process.exit(2);
  }

  if (options.mode === "apply") {
    const result = apply(options.root, options.subject);
    if (options.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      console.log(
        result.written
          ? `Wrote coverage for ${result.subject}: ${Object.keys(result.coverage.steps).length} step(s).`
          : `No blocks directory for ${options.subject}; nothing written.`,
      );
    }
    return;
  }

  if (options.mode === "check") {
    const result = check(options.root, options.subject);
    if (options.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else printDrifts(result);
    return;
  }

  const result = report(options.root, options.subject);
  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  printReport(result);
}

export { apply, buildCoverage, check, report };

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === resolve(fileURLToPath(import.meta.url))) {
  main(process.argv);
}

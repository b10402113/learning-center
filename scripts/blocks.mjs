#!/usr/bin/env node
/**
 * blocks.mjs — Recompute coverage, report coverage, and report drift.
 *
 * Usage:
 *   node scripts/blocks.mjs audit  --subject <subject> [--node <id>] [--step <node>/<step>] [--check] [--json]
 *   node scripts/blocks.mjs apply  --subject <subject> [--root <dir>] [--json]
 *   node scripts/blocks.mjs report --subject <subject> [--root <dir>] [--json]
 *   node scripts/blocks.mjs check  --subject <subject> [--root <dir>] [--json]
 *   node scripts/blocks.mjs merge  --subject <subject> --from <old-id> --into <canonical-id> [--dry-run]
 *
 * `audit` prints the manifest of written steps with an article body plus the
 * existing blocks the block-agent must dedupe against; with `--check` it
 * validates the audit files the agent wrote.
 *
 * `apply` reads audit files from learn/<subject>/output/blocks/*.audit.json plus
 * the node step entries, writes learn/<subject>/blocks/coverage.json, and never
 * edits step prose or block bodies. `merge` carries one draft block's id into
 * another's aliases and rewrites every reference.
 */

import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  BLOCK_SLUG,
  asDateString,
  auditConcepts,
  blocksDir,
  aliasMap,
  computeCoverage,
  coveragePath,
  detectDrift,
  loadBlocks,
  validateAudit,
} from "../src/blocks.mjs";

function usage() {
  console.error(
    "usage: node scripts/blocks.mjs (audit|apply|report|check|merge) --subject <subject> [--root <dir>] [--json]",
  );
}

function parseArgs(argv) {
  const options = {
    mode: "report",
    subject: null,
    root: process.cwd(),
    json: false,
    node: null,
    step: null,
    check: false,
    from: null,
    into: null,
    dryRun: false,
  };
  const modes = new Set(["audit", "apply", "report", "check", "merge"]);
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--subject" && index + 1 < argv.length) {
      options.subject = argv[++index];
    } else if (value === "--root" && index + 1 < argv.length) {
      options.root = resolve(argv[++index]);
    } else if (value === "--node" && index + 1 < argv.length) {
      options.node = argv[++index];
    } else if (value === "--step" && index + 1 < argv.length) {
      options.step = argv[++index];
    } else if (value === "--from" && index + 1 < argv.length) {
      options.from = argv[++index];
    } else if (value === "--into" && index + 1 < argv.length) {
      options.into = argv[++index];
    } else if (value === "--json") {
      options.json = true;
    } else if (value === "--check") {
      options.check = true;
    } else if (value === "--dry-run") {
      options.dryRun = true;
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
    const parsed = matter(readFileSync(join(dir, entry.name), "utf8"), {});
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

function articleHasBody(path) {
  if (!existsSync(path)) return false;
  try {
    const { content } = matter(readFileSync(path, "utf8"), {});
    return content.replace(/^\s*#\s+[^\n]*\n?/, "").trim().length > 0;
  } catch {
    return false;
  }
}

function parseStepFilter(step) {
  return typeof step === "string" && step.includes("/") ? step.split("/", 2) : [null, step];
}

function auditManifest(root, subject, { node = null, step = null } = {}) {
  const nodes = readNodeFiles(root, subject);
  const { blocks } = loadBlocks(root, subject);
  const [stepNode, stepId] = parseStepFilter(step);
  const targetNode = node ?? stepNode;
  const manifestNodes = [];
  const skipped = [];

  for (const [nodeId, entry] of [...nodes].sort(([a], [b]) => a.localeCompare(b))) {
    if (targetNode && nodeId !== targetNode) continue;
    if (entry.status !== "written") {
      skipped.push({ node: nodeId, step: null, reason: `node status is ${entry.status ?? "missing"}` });
      continue;
    }
    const steps = [];
    for (const [id, data] of [...entry.steps].sort(([a], [b]) => a.localeCompare(b))) {
      if (stepId && id !== stepId) continue;
      const article = join(root, "learn", subject, "nodes", nodeId, `${id}.md`);
      if (!articleHasBody(article)) {
        skipped.push({ node: nodeId, step: id, reason: "article-missing-or-empty" });
        continue;
      }
      steps.push({
        id,
        article: `learn/${subject}/nodes/${nodeId}/${id}.md`,
        title: typeof data.title === "string" ? data.title : "",
        purpose: typeof data.purpose === "string" ? data.purpose : "",
        sources: Array.isArray(data.sources) ? data.sources : [],
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
      });
    }
    if (steps.length > 0) {
      manifestNodes.push({
        node: nodeId,
        status: entry.status,
        audit: `learn/${subject}/output/blocks/${nodeId}.audit.json`,
        steps,
      });
    }
  }

  return {
    subject,
    generatedAt: today(),
    nodes: manifestNodes,
    blocks: blocks.map((block) => ({
      id: block.id,
      file: block.file,
      label: typeof block.data?.label === "string" ? block.data.label : block.id,
      type: block.data?.type ?? null,
      status: block.data?.status ?? null,
      aliases: Array.isArray(block.data?.aliases) ? block.data.aliases : [],
      summary: typeof block.data?.summary === "string" ? block.data.summary : "",
    })),
    skipped,
  };
}

function auditCheck(root, subject, { node = null, step = null } = {}) {
  const manifest = auditManifest(root, subject, { node, step });
  const eligible = new Set(
    manifest.nodes.flatMap((entry) => entry.steps.map((item) => `${entry.node}/${item.id}`)),
  );
  const nodes = readNodeFiles(root, subject);
  const { blocks } = loadBlocks(root, subject);
  const [stepNode, stepId] = parseStepFilter(step);
  const files = readAudits(root, subject)
    .filter((audit) => !node || audit.node === node)
    .filter((audit) => !stepNode || audit.node === stepNode)
    .map((audit) => {
      if (!stepId) return audit;
      const steps = Object.fromEntries(
        Object.entries(audit.steps ?? {}).filter(([id]) => id === stepId),
      );
      return { ...audit, steps };
    });
  const failures = [];
  const warnings = [];
  const seenNodes = new Set(files.map((audit) => audit.node));
  for (const entry of manifest.nodes) {
    if (seenNodes.has(entry.node)) continue;
    failures.push({
      file: entry.audit,
      checkId: "audit-missing",
      message: `node "${entry.node}" has written steps but no audit file`,
    });
  }

  for (const audit of files) {
    const result = validateAudit(audit, { subject, nodes, blocks, eligibleSteps: eligible });
    const file = `learn/${subject}/output/blocks/${audit.node}.audit.json`;
    for (const failure of result.failures) failures.push({ file, ...failure });
    for (const warning of result.warnings) warnings.push({ file, ...warning });
  }

  return { subject, manifest, audits: files.length, failures, warnings };
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
  const aliases = aliasMap(blocks);
  const nodes = readNodeFiles(root, subject);
  const audits = readAudits(root, subject);
  const steps = {};

  for (const audit of audits) {
    const node = nodes.get(audit.node);
    if (!node || node.status !== "written") continue;
    for (const candidate of auditConcepts(audit)) {
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
      const concept = {
        slug,
        label: typeof candidate.label === "string" ? candidate.label : slug,
        sources: Array.isArray(candidate.sources) ? candidate.sources : [],
        block,
        note: typeof candidate.note === "string" ? candidate.note : "",
      };
      for (const stepId of candidate.steps ?? []) {
        const step = node.steps.get(stepId);
        if (!step) continue;
        const article = join(root, "learn", subject, "nodes", audit.node, `${stepId}.md`);
        if (!existsSync(article)) continue;
        const key = `${audit.node}/${stepId}`;
        const entry = steps[key] ?? { concepts: [] };
        entry.concepts.push(concept);
        steps[key] = entry;
      }
    }
  }

  for (const [key, entry] of Object.entries(steps)) {
    const deduped = dedupeConcepts(entry.concepts);
    const overflow = deduped.length > 6;
    const next = { ...entry, concepts: overflow ? deduped.slice(0, 6) : deduped };
    if (!next.note && deduped.find((concept) => concept.note)?.note) {
      next.note = deduped.find((concept) => concept.note).note;
    }
    if (overflow) {
      next.overflow = true;
      next.overflowCount = deduped.length;
    }
    steps[key] = next;
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
        const previous = steps[key] ?? { concepts: [] };
        const combined = dedupeConcepts([...existing, ...extra]);
        const overflow = previous.overflow || combined.length > 6;
        const next = { ...previous, concepts: overflow ? combined.slice(0, 6) : combined };
        if (overflow) {
          next.overflow = true;
          next.overflowCount = Math.max(previous.overflowCount ?? 0, combined.length);
        }
        steps[key] = next;
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

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value).trim()).filter(Boolean))];
}

function mergeReferences(list, { from, into, selfId }) {
  const out = [];
  const seen = new Set();
  for (const raw of Array.isArray(list) ? list : []) {
    const id = typeof raw === "string" ? raw.trim() : "";
    if (!id) continue;
    const next = id === from ? into : id;
    if (!next || next === selfId || seen.has(next)) continue;
    seen.add(next);
    out.push(next);
  }
  return out;
}

function rewriteInlineLinks(body, from, into) {
  return String(body ?? "").replace(/\[\[([^\]|#]+)(#[^\]|]*)?(\|[^\]]+)?\]\]/g, (match, id, anchor = "", label = "") => {
    return id.trim() === from ? `[[${into}${anchor}${label}]]` : match;
  });
}

function rewriteNodeBlocks(root, subject, from, into, dryRun = false) {
  const dir = join(root, "learn", subject, "nodes");
  const changes = [];
  if (!existsSync(dir)) return changes;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const path = join(dir, entry.name);
    const parsed = matter(readFileSync(path, "utf8"), {});
    let changed = false;
    for (const step of Array.isArray(parsed.data.steps) ? parsed.data.steps : []) {
      if (!Array.isArray(step?.blocks)) continue;
      const next = mergeReferences(step.blocks, { from, into, selfId: null });
      if (JSON.stringify(next) !== JSON.stringify(step.blocks)) {
        step.blocks = next;
        changed = true;
      }
    }
    if (!changed) continue;
    changes.push(`learn/${subject}/nodes/${entry.name}`);
    if (!dryRun) writeFileSync(path, matter.stringify(parsed.content, parsed.data));
  }
  return changes;
}

function merge(root, subject, { from, into, dryRun = false } = {}) {
  if (!from || !into) return { subject, merged: false, error: "--from and --into are required" };
  if (!BLOCK_SLUG.test(from) || !BLOCK_SLUG.test(into)) {
    return { subject, merged: false, error: "--from and --into must be kebab-case block ids" };
  }
  if (from === into) return { subject, merged: false, error: "--from and --into must differ" };

  const { blocks } = loadBlocks(root, subject);
  const oldBlock = blocks.find((block) => block.id === from);
  const canonical = blocks.find((block) => block.id === into);
  if (!oldBlock) return { subject, merged: false, error: `block "${from}" does not exist` };
  if (!canonical) return { subject, merged: false, error: `block "${into}" does not exist` };
  if (oldBlock.data?.status !== "draft" || canonical.data?.status !== "draft") {
    return {
      subject,
      merged: false,
      error: "merge only happens between draft blocks; edit a reviewed block with --rewrite instead",
    };
  }

  const changed = [];
  const aliases = new Set([
    ...(Array.isArray(canonical.data?.aliases) ? canonical.data.aliases : []),
    ...(Array.isArray(oldBlock.data?.aliases) ? oldBlock.data.aliases : []),
    from,
  ]);
  aliases.delete(into);
  const canonicalData = {
    ...canonical.data,
    aliases: [...aliases],
    sources: uniqueStrings([
      ...(Array.isArray(canonical.data?.sources) ? canonical.data.sources : []),
      ...(Array.isArray(oldBlock.data?.sources) ? oldBlock.data.sources : []),
    ]),
    prerequisites: mergeReferences(
      [
        ...(Array.isArray(canonical.data?.prerequisites) ? canonical.data.prerequisites : []),
        ...(Array.isArray(oldBlock.data?.prerequisites) ? oldBlock.data.prerequisites : []),
      ],
      { from, into, selfId: into },
    ),
    related: mergeReferences(
      [
        ...(Array.isArray(canonical.data?.related) ? canonical.data.related : []),
        ...(Array.isArray(oldBlock.data?.related) ? oldBlock.data.related : []),
      ],
      { from, into, selfId: into },
    ),
    updated: today(),
  };

  const writes = [];
  for (const block of blocks) {
    if (block.id === from) continue;
    if (block.id === into) {
      writes.push({
        path: block.path,
        file: block.file,
        body: rewriteInlineLinks(block.body, from, into),
        data: canonicalData,
      });
      changed.push({ file: block.file, reason: "canonical block gains aliases and relations" });
      continue;
    }
    const data = { ...block.data };
    let touched = false;
    const body = rewriteInlineLinks(block.body, from, into);
    if (body !== block.body) touched = true;
    for (const key of ["prerequisites", "related"]) {
      const next = mergeReferences(data[key], { from, into, selfId: block.id });
      if (JSON.stringify(next) !== JSON.stringify(Array.isArray(data[key]) ? data[key] : [])) {
        data[key] = next;
        touched = true;
      }
    }
    if (!touched) continue;
    writes.push({ path: block.path, file: block.file, body, data });
    changed.push({ file: block.file, reason: `reference "${from}" becomes "${into}"` });
  }

  const nodeChanges = rewriteNodeBlocks(root, subject, from, into, dryRun);
  for (const file of nodeChanges) changed.push({ file, reason: `step blocks "${from}" becomes "${into}"` });

  if (!dryRun) {
    for (const write of writes) {
      writeFileSync(write.path, matter.stringify(write.body, write.data));
    }
    unlinkSync(oldBlock.path);
    apply(root, subject);
  }

  return {
    subject,
    merged: true,
    dryRun,
    from,
    into,
    changes: changed,
    deleted: dryRun ? [] : [oldBlock.file],
  };
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

  if (options.mode === "audit") {
    const result = options.check
      ? auditCheck(options.root, options.subject, { node: options.node, step: options.step })
      : auditManifest(options.root, options.subject, { node: options.node, step: options.step });
    if (options.json || !options.check) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      console.log(`Audits for ${result.subject}: ${result.audits} file(s)`);
      for (const warning of result.warnings) {
        console.log(`  [warn ${warning.checkId}] ${warning.file} — ${warning.message}`);
      }
      for (const failure of result.failures) {
        console.log(`  [fail ${failure.checkId}] ${failure.file} — ${failure.message}`);
      }
      if (result.failures.length === 0) console.log("  No audit failures.");
    }
    if (result.failures?.length > 0) process.exitCode = 1;
    return;
  }

  if (options.mode === "merge") {
    const result = merge(options.root, options.subject, {
      from: options.from,
      into: options.into,
      dryRun: options.dryRun,
    });
    if (options.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else if (!result.merged) {
      console.error(result.error);
    } else {
      console.log(
        `${result.dryRun ? "Would merge" : "Merged"} ${result.from} into ${result.into}` +
          ` (${result.changes.length} change(s))`,
      );
      for (const change of result.changes) console.log(`  ${change.file} — ${change.reason}`);
      for (const file of result.deleted) console.log(`  ${file} — removed`);
    }
    if (!result.merged) process.exitCode = 1;
    return;
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

export { apply, auditCheck, auditManifest, buildCoverage, check, merge, report };

const mainUrl = process.argv[1] ? resolve(process.argv[1]) : null;
if (mainUrl === resolve(fileURLToPath(import.meta.url))) {
  main(process.argv);
}

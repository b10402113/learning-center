#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  hasArticleBody,
  markNodeWritten,
  normalizeArticleText,
  readNode,
  selectSteps,
} from "../src/article.mjs";
import {
  humanizeRecordPath,
  jobFiles,
  prepareFile,
  readJson,
  restoreCode,
} from "../src/article-agent-bridge.mjs";
import { runChecks } from "./verify.mjs";
import { setStepTitle } from "./set-step-title.mjs";

function stepAssetsDir(root, { subject, node, step }) {
  return join(root, "learn", subject, "nodes", node, `${step}-assets`);
}

function clearStepImages(root, ids) {
  const dir = stepAssetsDir(root, ids);
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (/^image-\d+\.webp$/i.test(name)) rmSync(join(dir, name), { force: true });
  }
}

export async function publishArticles({ root, subject, node: nodeId, step = null, force = false }) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const prepared = new Set(readJson(prepareFile(root, subject, nodeId))?.steps ?? []);
  const results = [];
  for (const entry of entries) {
    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
    const target = join(root, "learn", subject, "nodes", nodeId, `${entry.id}.md`);
    const shown = relative(root, target);
    if (!force && !prepared.has(entry.id)) {
      results.push({ id: entry.id, title: entry.title ?? entry.id, status: "not-prepared", path: shown });
      continue;
    }
    const result = readJson(files.result);
    if (!result || result.status !== "completed") {
      results.push({
        id: entry.id,
        title: entry.title ?? entry.id,
        status: "failed",
        path: shown,
        error: result?.error ?? "no completed article-agent run",
      });
      continue;
    }
    const article = existsSync(result.article) ? readFileSync(result.article, "utf8") : "";
    if (!article.trim()) {
      results.push({ id: entry.id, title: entry.title ?? entry.id, status: "failed", path: shown, error: "run produced no article" });
      continue;
    }
    const blocks = readJson(files.blocks) ?? [];
    const body = normalizeArticleText(restoreCode(article, blocks), entry.title ?? null);
    if (!hasArticleBody(body)) {
      results.push({ id: entry.id, title: entry.title ?? entry.id, status: "failed", path: shown, error: "article has no body" });
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, body);
    if (!entry.title) {
      const title = body.split("\n").find((line) => line.trim() !== "")?.replace(/^#\s+/, "").trim();
      if (title) setStepTitle({ root, subject, node: nodeId, step: entry.id, title });
    }
    // A forced rewrite invalidates the figures and humanize record from the
    // previous run. Clear them only after the new article is safely written, so
    // a failed publish leaves the old state intact.
    if (force) {
      clearStepImages(root, { subject, node: nodeId, step: entry.id });
      rmSync(humanizeRecordPath(root, { subject, node: nodeId, step: entry.id }), { force: true });
    }
    results.push({ id: entry.id, title: entry.title ?? entry.id, status: "published", path: shown });
  }

  markNodeWritten(node, subject, nodeId, root);
  const verify = runChecks({ root, subject, node: nodeId });
  return {
    mode: "publish",
    subject,
    node: nodeId,
    steps: results,
    verify: { pass: verify.pass, failures: verify.failures },
  };
}

const usage = `Usage:
  node scripts/publish-article.mjs --subject <s> --node <n> [--step <id>] [--force] [--root <dir>]

Copies each completed marker-only article-agent run back into learn/, restores
protected code blocks, keeps the <!--image:N--> markers, normalizes the H1,
marks the node written, and runs verify. With --force, a successful write also
removes the step's stale image-N files (the markers are rendered later) and its
humanize record.`;

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      force: { type: "boolean", default: false },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(usage);
    return;
  }
  for (const key of ["subject", "node"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }
  const report = await publishArticles({
    root: resolve(values.root || process.cwd()),
    subject: values.subject,
    node: values.node,
    step: values.step || null,
    force: values.force,
  });
  console.log(JSON.stringify(report, null, 2));
  if (!report.verify.pass) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.message ?? error);
    process.exitCode = 1;
  });
}

#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
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
  jobFiles,
  prepareFile,
  readJson,
  restoreCode,
} from "../src/article-agent-bridge.mjs";
import { runChecks } from "./verify.mjs";

export function publishArticles({ root, subject, node: nodeId, step = null, force = false }) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const prepared = new Set(readJson(prepareFile(root, subject, nodeId))?.steps ?? []);
  const results = entries.map((entry) => {
    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
    const target = join(root, "learn", subject, "nodes", nodeId, `${entry.id}.md`);
    const shown = relative(root, target);
    if (!force && !prepared.has(entry.id)) {
      return { id: entry.id, title: entry.title, status: "not-prepared", path: shown };
    }
    const result = readJson(files.result);
    if (!result || result.status !== "completed") {
      return {
        id: entry.id,
        title: entry.title,
        status: "failed",
        path: shown,
        error: result?.error ?? "no completed article-agent run",
      };
    }
    const article = existsSync(result.article) ? readFileSync(result.article, "utf8") : "";
    if (!article.trim()) {
      return { id: entry.id, title: entry.title, status: "failed", path: shown, error: "run produced no article" };
    }
    const blocks = readJson(files.blocks) ?? [];
    const body = normalizeArticleText(restoreCode(article, blocks), entry.title);
    if (!hasArticleBody(body)) {
      return { id: entry.id, title: entry.title, status: "failed", path: shown, error: "article has no body" };
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, body);
    return { id: entry.id, title: entry.title, status: "published", path: shown };
  });

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

Copies each completed article-agent run back into learn/, restores protected code
blocks, normalizes the H1, marks the node written, and runs verify.`;

function main() {
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
  const report = publishArticles({
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
  main();
}

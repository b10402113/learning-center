#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import { readNode } from "../src/article.mjs";
import {
  articleAgentRoot,
  buildBrief,
  jobFiles,
  outputDir,
  protectCode,
  readJson,
  writeJson,
} from "../src/article-agent-bridge.mjs";
import { loadEnv } from "../src/llm.mjs";

const usage = `Usage:
  node scripts/run-article-agent.mjs --subject <s> --node <n> --step <id> [--root <dir>]

Wraps one article-agent rewrite for a single step. It protects the code blocks,
writes the request into article-agent/output/jobs/, runs article-agent's CLI,
and records the result. The caller writes the original article first.`;

const PARTIAL = /partial files: (.+)$/m;

function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(usage);
    return;
  }
  for (const key of ["subject", "node", "step"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }

  const root = resolve(values.root || process.cwd());
  loadEnv(root);
  const node = readNode(root, values.subject, values.node);
  const entry = node.steps.find((step) => step && step.id === values.step);
  if (!entry) throw new Error(`step "${values.step}" is not in node ${values.node}`);

  const files = jobFiles(root, { subject: values.subject, node: values.node, step: entry.id });
  mkdirSync(files.dir, { recursive: true });
  if (!existsSync(files.original)) {
    throw new Error(`original article not found: ${relative(root, files.original)}`);
  }

  const original = readFileSync(files.original, "utf8");
  const { text, blocks } = protectCode(original);
  writeFileSync(files.protected, text);
  writeJson(files.blocks, blocks);
  const index = node.steps.findIndex((step) => step && step.id === entry.id);
  writeJson(files.request, {
    articleFile: files.protected,
    brief: buildBrief(entry, {
      hasCode: blocks.length > 0,
      nodeTitle: node.title,
      index: index + 1,
      total: node.steps.length,
      previous: node.steps[index - 1]?.title ?? null,
      next: node.steps[index + 1]?.title ?? null,
    }),
    outputRoot: outputDir(root, values.subject),
  });

  const agentRoot = articleAgentRoot(root);
  let stdout = "";
  let stderr = "";
  try {
    stdout = execFileSync(process.execPath, ["src/cli.mjs", relative(agentRoot, files.request)], {
      cwd: agentRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
  } catch (error) {
    stdout = error.stdout?.toString?.() ?? "";
    stderr = error.stderr?.toString?.() ?? error.message;
  }

  const verdict = describeRun(stdout, stderr);
  writeJson(files.result, verdict);
  console.log(JSON.stringify(verdict, null, 2));
  if (verdict.status !== "completed") process.exitCode = 1;
}

function describeRun(stdout, stderr) {
  let outputDir = null;
  try {
    const parsed = JSON.parse(stdout);
    if (parsed?.manifest) outputDir = parsed.manifest.replace(/\/manifest\.json$/, "");
  } catch {}
  if (!outputDir) outputDir = stderr.match(PARTIAL)?.[1]?.trim() ?? null;
  if (!outputDir) {
    return { status: "failed", outputDir: null, error: { message: stderr.trim() || "no run produced" } };
  }
  const manifest = readJson(join(outputDir, "manifest.json")) ?? {};
  return {
    status: manifest.status ?? "failed",
    outputDir,
    article: join(outputDir, "article.md"),
    images: (manifest.images ?? []).map((image) => join(outputDir, "assets", image.filename)),
    textModel: manifest.textModel ?? null,
    textRequests: manifest.textRequests ?? 0,
    error: manifest.error ?? (stderr.trim() ? { message: stderr.trim() } : null),
  };
}

main();

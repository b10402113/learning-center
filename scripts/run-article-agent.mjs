#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import { readNode } from "../src/article.mjs";
import {
  articleAgentRoot,
  buildRequest,
  jobFiles,
  protectCode,
  readJson,
  readStepPlan,
  writeJson,
} from "../src/article-agent-bridge.mjs";
import { loadEnv } from "../src/llm.mjs";

const usage = `Usage:
  node scripts/run-article-agent.mjs --subject <s> --node <n> --step <id> [--markers-only] [--no-images] [--root <dir>]

Wraps one article-agent rewrite for a single step. It protects the code blocks,
reads the publisher's image plan, writes the request into
article-agent/output/jobs/, runs article-agent's CLI, and records the result.
The caller writes the original article and (unless --no-images) the plan first.
--markers-only requires a plan and stops after the rewrite leaves <!--image:N-->
markers, so no image model is called.`;

const PARTIAL = /partial files: (.+)$/m;

function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      "no-images": { type: "boolean", default: false },
      "markers-only": { type: "boolean", default: false },
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

  const markersOnly = values["markers-only"];
  if (markersOnly && !existsSync(files.plan)) {
    throw new Error("--markers-only requires an image plan");
  }
  const original = readFileSync(files.original, "utf8");
  const plan =
    values["no-images"] && !markersOnly
      ? null
      : readStepPlan(root, { subject: values.subject, node: values.node, step: entry.id }, original);
  const { text, blocks } = protectCode(original);
  writeFileSync(files.protected, text);
  writeJson(files.blocks, blocks);
  writeJson(
    files.request,
    buildRequest(root, {
      subject: values.subject,
      files,
      entry,
      plan,
      hasCode: blocks.length > 0,
      markersOnly,
    }),
  );

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
    imageRequests: manifest.imageRequests ?? 0,
    markersOnly: manifest.markersOnly ?? false,
    error: manifest.error ?? (stderr.trim() ? { message: stderr.trim() } : null),
  };
}

try {
  main();
} catch (error) {
  console.error(error?.message ?? error);
  process.exitCode = 1;
}

#!/usr/bin/env node
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { runPolish } from "../src/polish-article.mjs";

const usage = `Usage:
  node scripts/polish-article.mjs run --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>] [--root <dir>]

run  polishes every eligible step of one node, skips steps whose record still
     matches the article hash unless --force is given, validates each result
     against the structural backup, retries a failed validation once, then
     writes the article back and records its sha256. A changed article drops its
     <step>.quiz.json so the quiz can be regenerated.`;

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      force: { type: "boolean", default: false },
      "max-parallel": { type: "string" },
      instruction: { type: "string" },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  const mode = positionals[0];
  if (values.help || mode !== "run") {
    console.log(usage);
    if (!values.help) process.exitCode = 2;
    return;
  }
  for (const key of ["subject", "node"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }

  const report = await runPolish({
    root: resolve(values.root || process.cwd()),
    subject: values.subject,
    node: values.node,
    step: values.step || null,
    force: values.force,
    maxParallel: Number(values["max-parallel"] ?? 3),
    instruction: values.instruction ?? null,
  });

  console.log(JSON.stringify(report, null, 2));
  if (report.failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exitCode = 1;
});

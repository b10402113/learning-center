#!/usr/bin/env node
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { runPolish, runPolishDraft } from "../src/polish-article.mjs";

const usage = `Usage:
  node scripts/polish-article.mjs run   --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>] [--root <dir>]
  node scripts/polish-article.mjs draft --subject <s> --node <n> --step <id> [--instruction <text>] [--copy] [--root <dir>]

run    polishes every eligible step of one node, skips steps whose record still
       matches the article hash unless --force is given, validates each result
       against the structural backup, retries a failed validation once, then
       writes the article and the image plan's heading/prompt back and records
       the article sha256. A changed article drops its <step>.quiz.json so the
       quiz can be regenerated.

draft  polishes one step's unpublished original article and its image plan in
       the publisher job folder, keeping every anchor verbatim. /article runs it
       between the publisher's original and the markers-only wrapper.

--copy (draft only) skips the text model: it validates the plan, copies
       original.md to polish.md unchanged, and reports status "copied". /batch-nodes
       -skip-polish uses it so the publisher's first draft is the article.`;

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
      copy: { type: "boolean", default: false },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  const mode = positionals[0];
  if (values.help || !["run", "draft"].includes(mode)) {
    console.log(usage);
    if (!values.help) process.exitCode = 2;
    return;
  }
  for (const key of ["subject", "node"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }
  if (mode === "draft" && !values.step) {
    throw new Error(`--step is required for draft\n\n${usage}`);
  }
  if (mode === "run" && values.copy) {
    throw new Error(`--copy only applies to draft\n\n${usage}`);
  }

  const root = resolve(values.root || process.cwd());
  const report =
    mode === "draft"
      ? await runPolishDraft({
          root,
          subject: values.subject,
          node: values.node,
          step: values.step,
          instruction: values.instruction ?? null,
          copy: values.copy,
        })
      : await runPolish({
          root,
          subject: values.subject,
          node: values.node,
          step: values.step || null,
          force: values.force,
          maxParallel: Number(values["max-parallel"] ?? 3),
          instruction: values.instruction ?? null,
        });

  console.log(JSON.stringify(report, null, 2));
  const failed = mode === "draft" ? report.status === "failed" : report.failed.length > 0;
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exitCode = 1;
});

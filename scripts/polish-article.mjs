#!/usr/bin/env node
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { runPolish, runPolishDraft, runPolishNode } from "../src/polish-article.mjs";

const usage = `Usage:
  node scripts/polish-article.mjs node  --subject <s> --node <n> [--step <id> ...] [--copy] [--force] [--instruction <text>] [--max-chars <n>] [--root <dir>]
  node scripts/polish-article.mjs run   --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>] [--instruction <text>] [--root <dir>]
  node scripts/polish-article.mjs draft --subject <s> --node <n> --step <id> [--instruction <text>] [--copy] [--root <dir>]

node   polishes a whole node in one model call: every prepared step shares its
       terminology, drops repeated explanations and hands off to the next step.
       Only steps with an original.md but no polish.md are edited unless --force
       is given; already published neighbours are read-only context. When the
       payload is too large it splits in halves at step boundaries and polishes
       each batch on its own. A step whose reply fails validation is rescued with
       a single-step polish (up to two attempts), then copied through unchanged.
       It writes each step's polish.md and image plan and copies the H1 back into
       the node. A changed article drops its <step>.quiz.json.

       --copy skips the text model: every prepared step's original.md is copied
       to polish.md unchanged and the plan stays as written. /batch-nodes
       -skip-polish uses it so the publisher's first draft is the article.
       --max-chars caps the payload (default 180000, or POLISH_NODE_MAX_CHARS).
       --context-off leaves the neighbouring head/tail excerpts out.

run    polishes every published step of one node, one call per step, skips steps
       whose record still matches the article hash unless --force is given,
       validates each result against the structural backup, retries a failed
       validation once, then writes the article and the image plan's heading/prompt
       back and records the article sha256. A changed article drops its
       <step>.quiz.json so the quiz can be regenerated.

draft  legacy repair: polishes one step's unpublished original article and its
       image plan in the publisher job folder, keeping every anchor verbatim.

--copy (node and draft) skips the text model: it validates the plan, copies
       original.md to polish.md unchanged, and reports status "copied".`;

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string", multiple: true },
      force: { type: "boolean", default: false },
      "max-parallel": { type: "string" },
      "max-chars": { type: "string" },
      instruction: { type: "string" },
      copy: { type: "boolean", default: false },
      "context-off": { type: "boolean", default: false },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  const mode = positionals[0];
  if (values.help || !["node", "run", "draft"].includes(mode)) {
    console.log(usage);
    if (!values.help) process.exitCode = 2;
    return;
  }
  for (const key of ["subject", "node"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }
  if (mode === "draft" && !(values.step ?? []).length) {
    throw new Error(`--step is required for draft\n\n${usage}`);
  }
  if (mode === "run" && values.copy) {
    throw new Error(`--copy only applies to node and draft\n\n${usage}`);
  }

  const root = resolve(values.root || process.cwd());
  const report =
    mode === "node"
      ? await runPolishNode({
          root,
          subject: values.subject,
          node: values.node,
          steps: values.step ?? null,
          force: values.force,
          copy: values.copy,
          instruction: values.instruction ?? null,
          maxChars: values["max-chars"] ?? null,
          context: !values["context-off"],
        })
      : mode === "draft"
        ? await runPolishDraft({
            root,
            subject: values.subject,
            node: values.node,
            step: values.step[0],
            instruction: values.instruction ?? null,
            copy: values.copy,
          })
        : await runPolish({
            root,
            subject: values.subject,
            node: values.node,
            step: (values.step ?? [])[0] ?? null,
            force: values.force,
            maxParallel: Number(values["max-parallel"] ?? 3),
            instruction: values.instruction ?? null,
          });

  console.log(JSON.stringify(report, null, 2));
  const failed = mode === "draft" ? report.status === "failed" : (report.failed ?? []).length > 0;
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exitCode = 1;
});

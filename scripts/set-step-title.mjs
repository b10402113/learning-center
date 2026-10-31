#!/usr/bin/env node
/**
 * set-step-title.mjs — Write a published step title back into its node plan.
 *
 * The publisher chooses the title while writing the article. This script copies
 * the H1 from the original (or an explicit --title) into the node's steps entry
 * and updates the matching ## Steps label, so verify can keep both in sync.
 *
 * Usage:
 *   node scripts/set-step-title.mjs --subject <s> --node <n> --step <id> --from <article.md> [--root <dir>]
 *   node scripts/set-step-title.mjs --subject <s> --node <n> --step <id> --title "<title>" [--root <dir>]
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function yamlQuote(value) {
  return JSON.stringify(String(value));
}

function unquote(value) {
  const text = String(value).trim();
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      return JSON.parse(text);
    } catch {
      return text.slice(1, -1);
    }
  }
  if (text.startsWith("'") && text.endsWith("'")) return text.slice(1, -1).replace(/''/g, "'");
  return text;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readTitleFrom(file) {
  if (!existsSync(file)) throw new Error(`article not found: ${file}`);
  const line = readFileSync(file, "utf8")
    .split("\n")
    .find((item) => item.trim() !== "");
  const match = line?.match(/^#\s+(.+?)\s*$/);
  if (!match) throw new Error(`article has no H1 title: ${file}`);
  return match[1].trim();
}

function applyStepTitle(text, stepId, title) {
  const lines = text.split("\n");
  const fmStart = lines.findIndex((line) => line.trim() === "---");
  const fmEnd = lines.findIndex((line, index) => index > fmStart && line.trim() === "---");
  if (fmStart === -1 || fmEnd === -1) throw new Error("node has no YAML frontmatter");

  const stepsIndex = lines.findIndex(
    (line, index) => index > fmStart && index < fmEnd && /^steps:\s*$/.test(line),
  );
  if (stepsIndex === -1) throw new Error("node frontmatter has no steps: array");

  let start = -1;
  for (let index = stepsIndex + 1; index < fmEnd; index += 1) {
    const match = lines[index].match(/^(\s*)-\s+id:\s*(.+?)\s*$/);
    if (match && unquote(match[2]) === stepId) {
      start = index;
      break;
    }
  }
  if (start === -1) throw new Error(`step "${stepId}" is not in the node's steps array`);

  const indent = lines[start].match(/^(\s*)/)[1];
  const childIndent = `${indent}  `;
  let end = fmEnd;
  for (let index = start + 1; index < fmEnd; index += 1) {
    if (/^\S/.test(lines[index])) {
      end = index;
      break;
    }
    const sibling = lines[index].match(/^(\s*)-\s+id:/);
    if (sibling && sibling[1] === indent) {
      end = index;
      break;
    }
  }

  const updatedIndex = lines.findIndex(
    (line, index) => index > fmStart && index < fmEnd && /^updated:/.test(line),
  );
  if (updatedIndex !== -1) {
    lines[updatedIndex] = `updated: ${new Date().toISOString().slice(0, 10)}`;
  }

  const titlePattern = new RegExp(`^${escapeRegExp(childIndent)}title:`);
  const titleIndex = lines.findIndex(
    (line, index) => index > start && index < end && titlePattern.test(line),
  );
  const titleLine = `${childIndent}title: ${yamlQuote(title)}`;
  if (titleIndex === -1) lines.splice(start + 1, 0, titleLine);
  else lines[titleIndex] = titleLine;

  const link = new RegExp(
    `^(\\s*(?:\\d+\\.|[-*])\\s+\\[)([^\\]]*)(\\]\\([^)]*${escapeRegExp(stepId)}\\.md\\))`,
  );
  let labelled = false;
  const next = lines
    .map((line) => {
      const match = line.match(link);
      if (!match) return line;
      labelled = true;
      return `${match[1]}${title}${match[3]}`;
    })
    .join("\n");
  if (!labelled) throw new Error(`no ## Steps link found for step "${stepId}"`);
  return next;
}

export function setStepTitle({ root = REPO_ROOT, subject, node, step, title, from }) {
  const nodeFile = join(root, "learn", subject, "nodes", `${node}.md`);
  if (!existsSync(nodeFile)) throw new Error(`node not found: learn/${subject}/nodes/${node}.md`);
  const resolvedTitle = title ?? (from ? readTitleFrom(from) : "");
  if (!resolvedTitle.trim()) throw new Error("pass --title or --from <article>");
  const before = readFileSync(nodeFile, "utf8");
  const after = applyStepTitle(before, step, resolvedTitle.trim());
  if (after !== before) writeFileSync(nodeFile, after);
  return { status: after === before ? "unchanged" : "updated", node: nodeFile, step, title: resolvedTitle.trim() };
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      title: { type: "string" },
      from: { type: "string" },
      root: { type: "string" },
    },
  });
  for (const key of ["subject", "node", "step"]) {
    if (!values[key]) throw new Error(`--${key} is required`);
  }
  const result = setStepTitle({
    root: resolve(values.root || process.cwd()),
    subject: values.subject,
    node: values.node,
    step: values.step,
    title: values.title,
    from: values.from,
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.message ?? error);
    process.exitCode = 1;
  });
}

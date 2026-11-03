#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { hasArticleBody, readNode, selectSteps } from "../src/article.mjs";
import { jobFiles, normalizeStepPlan } from "../src/article-agent-bridge.mjs";
import { runChecks } from "./verify.mjs";

const MARKER = /^[ \t]*<!--\s*image:(\d+)\s*-->[ \t]*$/gm;
const IMAGE_LINE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const IMAGE_LINE_ONLY = /^[ \t]*!\[[^\]]*\]\([^)\s]+(?:\s+["'][^"']*["'])?\)[ \t]*$/;
const CAPTION = /^[ \t]*\*[^*\n]+\*[ \t]*$/;
const LINK = /(?<!!)\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g;
const WIKI_LINK = /\[\[[^\]]+\]\]/g;
const PROVENANCE = /^<!--\s*(?:source:\s*sources\/\S+\s*|derived\s*)-->$/;
const QUIZ_FENCE = /^[ \t]*(`{3,}|~{3,})[ \t]*quiz[ \t]*$/i;

export function parseMarkerSequence(markdown) {
  return [...String(markdown).matchAll(MARKER)].map((match) => Number(match[1]));
}

export function imageLines(markdown) {
  return [...String(markdown).matchAll(IMAGE_LINE)].map((match) => ({
    alt: match[1],
    target: match[2].trim(),
  }));
}

function imageCaptions(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const captions = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (!IMAGE_LINE_ONLY.test(lines[index])) continue;
    let cursor = index + 1;
    while (cursor < lines.length && lines[cursor].trim() === "") cursor += 1;
    if (cursor < lines.length && CAPTION.test(lines[cursor])) captions.push(lines[cursor].trim());
  }
  return captions;
}

function linkTargets(markdown) {
  const text = String(markdown);
  return [
    ...[...text.matchAll(LINK)].map(
      (match) => `${match[1]}|${match[2].trim()}|${match[3] ?? ""}`,
    ),
    ...[...text.matchAll(WIKI_LINK)].map((match) => match[0]),
  ];
}

function fencedBlocks(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    const open = lines[index].match(/^[ \t]*(`{3,}|~{3,})/);
    if (!open) continue;
    const marker = open[1][0];
    const width = open[1].length;
    const closing = new RegExp(`^[ \\t]*\\${marker}{${width},}[ \\t]*$`);
    let end = index + 1;
    while (end < lines.length && !closing.test(lines[end])) end += 1;
    blocks.push(lines.slice(index, Math.min(end + 1, lines.length)).join("\n"));
    index = end;
  }
  return blocks;
}

function provenanceLines(markdown) {
  return String(markdown)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => PROVENANCE.test(line));
}

function quizBlocks(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(QUIZ_FENCE);
    if (!match) continue;
    const marker = match[1][0];
    const width = match[1].length;
    const closing = new RegExp(`^[ \\t]*\\${marker}{${width},}[ \\t]*$`);
    let end = index + 1;
    while (end < lines.length && !closing.test(lines[end])) end += 1;
    blocks.push(lines.slice(index, Math.min(end + 1, lines.length)).join("\n"));
    index = end;
  }
  return blocks;
}

function firstLine(markdown) {
  return String(markdown).replace(/\r\n/g, "\n").split("\n").find((line) => line.trim() !== "") ?? "";
}

function equalList(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function validateHumanizedArticle({ original, next }) {
  if (!String(next).trim()) throw new Error("humanized article is empty");
  const originalHeading = firstLine(original);
  const nextHeading = firstLine(next);
  if (!/^#\s+/.test(originalHeading)) throw new Error("original article has no H1");
  if (originalHeading !== nextHeading) throw new Error("humanize changed the H1");
  if (!equalList(provenanceLines(original), provenanceLines(next))) {
    throw new Error("humanize changed a provenance comment");
  }
  if (!equalList(parseMarkerSequence(original), parseMarkerSequence(next))) {
    throw new Error("humanize changed the image markers");
  }
  const originalImages = imageLines(original);
  const nextImages = imageLines(next);
  if (
    originalImages.length !== nextImages.length ||
    originalImages.some(
      (image, index) =>
        image.alt !== nextImages[index].alt || image.target !== nextImages[index].target,
    )
  ) {
    throw new Error("humanize changed an existing image line");
  }
  if (!equalList(imageCaptions(original), imageCaptions(next))) {
    throw new Error("humanize changed an image caption");
  }
  if (!equalList(quizBlocks(original), quizBlocks(next))) {
    throw new Error("humanize changed a quiz block");
  }
  if (!equalList(fencedBlocks(original), fencedBlocks(next))) {
    throw new Error("humanize changed a fenced code block");
  }
  if (!equalList(linkTargets(original), linkTargets(next))) {
    throw new Error("humanize changed a relative or source link");
  }
}

function stepImageLines(article, step) {
  return imageLines(article).filter((image) => image.target.includes(`/${step}-assets/`));
}

function expectedPlanLength(article, step) {
  const markers = parseMarkerSequence(article).length;
  return markers > 0 ? markers : stepImageLines(article, step).length;
}

function structuralKeys(item) {
  return Object.keys(item)
    .filter((key) => key !== "heading" && key !== "prompt")
    .sort();
}

export function validateHumanizedPlan({ original, next, article, step }) {
  if (!Array.isArray(original)) throw new Error("original plan must be a JSON array");
  if (!Array.isArray(next)) throw new Error("humanized plan must be a JSON array");
  const normalized = normalizeStepPlan(next);
  if (original.length !== normalized.length) {
    throw new Error("humanize changed the number of plan items");
  }
  const expectedLength = expectedPlanLength(article, step);
  if (expectedLength > 0 && normalized.length !== expectedLength) {
    throw new Error("humanize changed the number of plan items");
  }
  for (let index = 0; index < normalized.length; index += 1) {
    const before = original[index];
    const after = next[index];
    if (!before || typeof before !== "object" || Array.isArray(before)) {
      throw new Error(`original plan item ${index + 1} must be an object`);
    }
    if (!after || typeof after !== "object" || Array.isArray(after)) {
      throw new Error(`humanized plan item ${index + 1} must be an object`);
    }
    const beforeKeys = structuralKeys(before);
    const afterKeys = structuralKeys(after);
    if (!equalList(beforeKeys, afterKeys)) {
      throw new Error(`humanize changed the keys of plan item ${index + 1}`);
    }
    for (const key of beforeKeys) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        throw new Error(`humanize changed the ${key} of plan item ${index + 1}`);
      }
    }
    if (after.heading !== undefined && typeof after.heading !== "string") {
      throw new Error(`plan item ${index + 1} needs a string heading`);
    }
    if (String(before.heading ?? "").trim() && !String(after.heading ?? "").trim()) {
      throw new Error(`plan item ${index + 1} needs a non-empty heading`);
    }
    if (typeof after.prompt !== "string" || !after.prompt.trim()) {
      throw new Error(`plan item ${index + 1} needs a non-empty prompt`);
    }
  }
}

function parsePlan(text, label) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
  if (!Array.isArray(raw)) throw new Error(`${label} must be a JSON array`);
  return raw;
}

export function prepareHumanize({ root, subject, node: nodeId, step = null }) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const steps = [];
  const skipped = [];
  const failed = [];

  for (const entry of entries) {
    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
    const articlePath = join(root, "learn", subject, "nodes", nodeId, `${entry.id}.md`);
    const articleShown = relative(root, articlePath);
    const current = existsSync(articlePath) ? readFileSync(articlePath, "utf8") : "";
    if (!hasArticleBody(current)) {
      skipped.push({ id: entry.id, title: entry.title, status: "skipped-no-article", path: articleShown });
      continue;
    }

    if (!existsSync(files.plan)) {
      skipped.push({
        id: entry.id,
        title: entry.title,
        status: "skipped-no-plan",
        path: relative(root, files.plan),
      });
      continue;
    }

    const planText = readFileSync(files.plan, "utf8");
    let planRaw;
    try {
      planRaw = parsePlan(planText, "image plan");
      normalizeStepPlan(planRaw);
    } catch (error) {
      failed.push({
        id: entry.id,
        title: entry.title,
        status: "failed",
        error: error.message,
      });
      continue;
    }

    const markers = parseMarkerSequence(current);
    if (markers.length === 0 && stepImageLines(current, entry.id).length === 0) {
      skipped.push({
        id: entry.id,
        title: entry.title,
        status: "skipped-not-published",
        path: articleShown,
      });
      continue;
    }

    mkdirSync(files.dir, { recursive: true });
    writeFileSync(files.humanized, current);
    writeFileSync(files.humanizedPlan, planText);
    steps.push({
      id: entry.id,
      title: entry.title ?? null,
      status: "ready",
      article: articleShown,
      plan: relative(root, files.plan),
      humanized: relative(root, files.humanized),
      humanizedPlan: relative(root, files.humanizedPlan),
    });
  }

  return {
    mode: "prepare",
    subject,
    node: nodeId,
    nodeTitle: node.title,
    steps,
    skipped,
    failed,
  };
}

export function applyHumanize({ root, subject, node: nodeId, step, summary = null }) {
  const node = readNode(root, subject, nodeId);
  const entry = node.steps.find((candidate) => candidate && candidate.id === step);
  if (!entry) throw new Error(`step "${step}" is not in node ${nodeId}`);
  const files = jobFiles(root, { subject, node: nodeId, step });

  if (!existsSync(files.humanized)) {
    throw new Error(`humanized article is missing: ${relative(root, files.humanized)}`);
  }
  if (!existsSync(files.humanizedPlan)) {
    throw new Error(`humanized plan is missing: ${relative(root, files.humanizedPlan)}`);
  }

  const articlePath = join(root, "learn", subject, "nodes", nodeId, `${step}.md`);
  if (!existsSync(articlePath)) throw new Error(`article is missing: ${relative(root, articlePath)}`);
  if (!existsSync(files.plan)) throw new Error(`image plan is missing: ${relative(root, files.plan)}`);

  const originalArticle = readFileSync(articlePath, "utf8");
  const nextArticle = readFileSync(files.humanized, "utf8");
  const originalPlanText = readFileSync(files.plan, "utf8");
  const nextPlanText = readFileSync(files.humanizedPlan, "utf8");

  validateHumanizedArticle({ original: originalArticle, next: nextArticle });

  const originalPlan = parsePlan(originalPlanText, "original plan");
  const nextPlan = parsePlan(nextPlanText, "humanized plan");
  validateHumanizedPlan({ original: originalPlan, next: nextPlan, article: originalArticle, step });

  const writtenPlan = JSON.stringify(nextPlan, null, 2) + "\n";
  const summaryText = String(summary ?? "").trim();
  mkdirSync(dirname(articlePath), { recursive: true });
  mkdirSync(dirname(files.plan), { recursive: true });
  writeFileSync(articlePath, nextArticle);
  writeFileSync(files.plan, writtenPlan);

  return {
    mode: "apply",
    subject,
    node: nodeId,
    step,
    status: "humanized",
    changed: originalArticle !== nextArticle || originalPlanText !== writtenPlan,
    summary: summaryText,
    article: relative(root, articlePath),
    plan: relative(root, files.plan),
    humanized: relative(root, files.humanized),
    humanizedPlan: relative(root, files.humanizedPlan),
  };
}

const usage = `Usage:
  node scripts/humanize-article.mjs prepare --subject <s> --node <n> [--step <id>] [--root <dir>]
  node scripts/humanize-article.mjs apply   --subject <s> --node <n> --step <id> [--summary <text>] [--root <dir>]

prepare  copies each eligible step's article to output/<node>/<step>/humanized.md
         and its plan to output/<node>/<step>/humanized.plan.json. It skips
         steps without an article, a plan, or a marker / image line.
apply    validates the copies against the official article and plan, then
         writes both back only when every protected part is unchanged. A failed
         validation leaves the official files untouched and keeps the copies
         for repair.`;

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      summary: { type: "string" },
      root: { type: "string" },
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  const mode = positionals[0];
  if (!mode || values.help || mode === "help") {
    console.log(usage);
    return;
  }
  if (!["prepare", "apply"].includes(mode)) throw new Error(`unknown mode: ${mode}\n\n${usage}`);
  for (const key of ["subject", "node"]) {
    if (!values[key]) throw new Error(`--${key} is required\n\n${usage}`);
  }
  if (mode === "apply" && !values.step) throw new Error(`--step is required\n\n${usage}`);

  const root = resolve(values.root || process.cwd());
  if (mode === "prepare") {
    console.log(
      JSON.stringify(
        prepareHumanize({
          root,
          subject: values.subject,
          node: values.node,
          step: values.step || null,
        }),
        null,
        2,
      ),
    );
    return;
  }

  const report = applyHumanize({
    root,
    subject: values.subject,
    node: values.node,
    step: values.step,
    summary: values.summary ?? null,
  });
  const verify = runChecks({ root, subject: values.subject, node: values.node });
  report.verify = { pass: verify.pass, failures: verify.failures };
  console.log(JSON.stringify(report, null, 2));
  if (!verify.pass) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.message ?? error);
    process.exitCode = 1;
  });
}

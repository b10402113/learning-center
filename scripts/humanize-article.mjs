#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { hasArticleBody, readNode, selectSteps } from "../src/article.mjs";
import {
  humanizeRecordPath,
  humanizeWorkDir,
  jobFiles,
  normalizeStepPlan,
  protectCode,
  readJson,
} from "../src/article-agent-bridge.mjs";
import { runChecks } from "./verify.mjs";

const MARKER = /^[ \t]*<!--\s*image:(\d+)\s*-->[ \t]*$/gm;
const IMAGE_LINE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const IMAGE_LINE_ONLY = /^[ \t]*!\[[^\]]*\]\([^)\s]+(?:\s+["'][^"']*["'])?\)[ \t]*$/;
const CAPTION = /^[ \t]*\*[^*\n]+\*[ \t]*$/;
const LINK = /(?<!!)\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const WIKI_LINK = /\[\[[^\]]+\]\]/g;
const PROVENANCE = /^<!--\s*(?:source:\s*sources\/\S+\s*|derived\s*)-->$/;
const QUIZ_FENCE = /^[ \t]*(`{3,}|~{3,})[ \t]*quiz[ \t]*$/i;

export function sha256(text) {
  return createHash("sha256").update(String(text)).digest("hex");
}

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
    ...[...text.matchAll(LINK)].map((match) => `${match[1]}|${match[2].trim()}`),
    ...[...text.matchAll(WIKI_LINK)].map((match) => match[0]),
  ];
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
  const originalCode = protectCode(original).blocks;
  const nextCode = protectCode(next).blocks;
  if (!equalList(originalCode, nextCode)) throw new Error("humanize changed a fenced code block");
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
  if (!equalList(linkTargets(original), linkTargets(next))) {
    throw new Error("humanize changed a relative or source link");
  }
}

export function validateHumanizedPlan({ original, next }) {
  const originalRaw = Array.isArray(original) ? original : null;
  const nextRaw = Array.isArray(next) ? next : null;
  if (!originalRaw) throw new Error("original plan must be a JSON array");
  if (!nextRaw) throw new Error("humanized plan must be a JSON array");
  const normalizedOriginal = normalizeStepPlan(originalRaw);
  const normalizedNext = normalizeStepPlan(nextRaw);
  if (normalizedOriginal.length !== normalizedNext.length) {
    throw new Error("humanize changed the number of plan items");
  }
  for (let index = 0; index < normalizedNext.length; index += 1) {
    const expected = normalizedOriginal[index];
    const actual = normalizedNext[index];
    const expectedIndex = originalRaw[index]?.index ?? index + 1;
    const actualIndex = nextRaw[index]?.index ?? index + 1;
    if (Number(expectedIndex) !== Number(actualIndex)) {
      throw new Error(`humanize changed the index of plan item ${index + 1}`);
    }
    if (expected.anchor !== actual.anchor) {
      throw new Error(`humanize changed the anchor of plan item ${index + 1}`);
    }
    if (!actual.heading) throw new Error(`plan item ${index + 1} needs a non-empty heading`);
    if (!actual.prompt) throw new Error(`plan item ${index + 1} needs a non-empty prompt`);
  }
}

export function prepareHumanize({ root, subject, node: nodeId, step = null, force = false }) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const steps = [];
  const skipped = [];
  const failed = [];

  for (const entry of entries) {
    const articlePath = join(root, "learn", subject, "nodes", nodeId, `${entry.id}.md`);
    const articleShown = relative(root, articlePath);
    const article = existsSync(articlePath) ? readFileSync(articlePath, "utf8") : "";
    if (!hasArticleBody(article)) {
      skipped.push({ id: entry.id, title: entry.title, status: "skipped-no-article", path: articleShown });
      continue;
    }

    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
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
      planRaw = JSON.parse(planText);
      if (!Array.isArray(planRaw)) throw new Error("plan must be a JSON array");
    } catch (error) {
      failed.push({
        id: entry.id,
        title: entry.title,
        status: "failed",
        error: `invalid image plan: ${error.message}`,
      });
      continue;
    }

    const markers = parseMarkerSequence(article);
    const hasStepImage = imageLines(article).some((image) =>
      image.target.includes(`/${entry.id}-assets/`),
    );
    if (markers.length === 0 && !hasStepImage) {
      skipped.push({
        id: entry.id,
        title: entry.title,
        status: "skipped-not-published",
        path: articleShown,
      });
      continue;
    }

    const record = readJson(humanizeRecordPath(root, { subject, node: nodeId, step: entry.id }));
    if (
      record &&
      !force &&
      record.article_sha256 === sha256(article) &&
      record.plan_sha256 === sha256(planText)
    ) {
      skipped.push({
        id: entry.id,
        title: entry.title,
        status: "skipped-record",
        path: articleShown,
      });
      continue;
    }

    const workDir = humanizeWorkDir(root, { subject, node: nodeId, step: entry.id });
    rmSync(workDir, { recursive: true, force: true });
    mkdirSync(workDir, { recursive: true });
    const workArticle = join(workDir, "article.md");
    const workPlan = join(workDir, "plan.json");
    copyFileSync(articlePath, workArticle);
    copyFileSync(articlePath, join(workDir, "original-article.md"));
    writeFileSync(workPlan, planText);
    writeFileSync(join(workDir, "original-plan.json"), planText);
    steps.push({
      id: entry.id,
      title: entry.title,
      status: "ready",
      article: articleShown,
      plan: relative(root, files.plan),
      workArticle: relative(root, workArticle),
      workPlan: relative(root, workPlan),
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
  const workDir = humanizeWorkDir(root, { subject, node: nodeId, step });
  const originalArticlePath = join(workDir, "original-article.md");
  const originalPlanPath = join(workDir, "original-plan.json");
  const nextArticlePath = join(workDir, "article.md");
  const nextPlanPath = join(workDir, "plan.json");
  for (const file of [originalArticlePath, originalPlanPath, nextArticlePath, nextPlanPath]) {
    if (!existsSync(file)) throw new Error(`humanize workspace is incomplete: ${relative(root, file)}`);
  }

  const originalArticle = readFileSync(originalArticlePath, "utf8");
  const nextArticle = readFileSync(nextArticlePath, "utf8");
  const originalPlanText = readFileSync(originalPlanPath, "utf8");
  const nextPlanText = readFileSync(nextPlanPath, "utf8");

  validateHumanizedArticle({ original: originalArticle, next: nextArticle });

  let originalPlan;
  let nextPlan;
  try {
    originalPlan = JSON.parse(originalPlanText);
  } catch (error) {
    throw new Error(`original plan is not valid JSON: ${error.message}`);
  }
  try {
    nextPlan = JSON.parse(nextPlanText);
  } catch (error) {
    throw new Error(`humanized plan is not valid JSON: ${error.message}`);
  }
  validateHumanizedPlan({ original: originalPlan, next: nextPlan });

  const summaryFile = join(workDir, "summary.txt");
  const summaryText = String(
    summary ?? (existsSync(summaryFile) ? readFileSync(summaryFile, "utf8") : ""),
  ).trim();
  const changed =
    originalArticle !== nextArticle || JSON.stringify(originalPlan) !== JSON.stringify(nextPlan);

  const articlePath = join(root, "learn", subject, "nodes", nodeId, `${step}.md`);
  const planPath = jobFiles(root, { subject, node: nodeId, step }).plan;
  const writtenPlan = JSON.stringify(nextPlan, null, 2) + "\n";
  mkdirSync(dirname(articlePath), { recursive: true });
  mkdirSync(dirname(planPath), { recursive: true });
  writeFileSync(articlePath, nextArticle);
  writeFileSync(planPath, writtenPlan);

  const record = {
    humanized_at: new Date().toISOString(),
    article_sha256: sha256(nextArticle),
    plan_sha256: sha256(writtenPlan),
    changed,
    summary: summaryText,
  };
  const recordPath = humanizeRecordPath(root, { subject, node: nodeId, step });
  mkdirSync(dirname(recordPath), { recursive: true });
  writeFileSync(recordPath, JSON.stringify(record, null, 2) + "\n");
  rmSync(workDir, { recursive: true, force: true });

  return {
    mode: "apply",
    subject,
    node: nodeId,
    step,
    status: "humanized",
    changed,
    summary: summaryText,
    article: relative(root, articlePath),
    plan: relative(root, planPath),
    record: relative(root, recordPath),
  };
}

const usage = `Usage:
  node scripts/humanize-article.mjs prepare --subject <s> --node <n> [--step <id>] [--force] [--root <dir>]
  node scripts/humanize-article.mjs apply   --subject <s> --node <n> --step <id> [--summary <text>] [--root <dir>]

prepare  copies each eligible step's article and image plan into
         learn/<subject>/output/humanize/<node>/<step>/, skips steps without an
         article, a plan, a marker or image line, and skips steps whose record
         still matches both file hashes unless --force is given.
apply    validates the workspace against the backups, writes the article and
         plan back, records their sha256 values, and removes the workspace. A
         failed validation leaves the official files untouched and keeps the
         workspace for inspection.`;

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      subject: { type: "string" },
      node: { type: "string" },
      step: { type: "string" },
      summary: { type: "string" },
      force: { type: "boolean", default: false },
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
          force: values.force,
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

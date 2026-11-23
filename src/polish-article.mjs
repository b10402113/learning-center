import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { hasArticleBody, readNode, selectSteps } from "./article.mjs";
import {
  jobFiles,
  normalizeStepPlan,
  polishedRecordPath,
  readJson,
  readStepPlan,
} from "./article-agent-bridge.mjs";
import { polishArticle } from "./polish.mjs";
import { resolveTextModel } from "./llm.mjs";
import { setStepTitle } from "../scripts/set-step-title.mjs";

const MARKER = /^[ \t]*<!--\s*image:(\d+)\s*-->[ \t]*$/gm;
const IMAGE_LINE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const IMAGE_LINE_ONLY = /^[ \t]*!\[[^\]]*\]\([^)\s]+(?:\s+["'][^"']*["'])?\)[ \t]*$/;
const CAPTION = /^[ \t]*\*[^*\n]+\*[ \t]*$/;
const LINK = /(?<!!)\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const WIKI_LINK = /\[\[[^\]]+\]\]/g;
// Source paths often contain spaces (e.g. "The Agentic Coding Handbook.2.part.txt"),
// so the path must accept any character, not just \S.
const PROVENANCE = /^<!--\s*(?:source:\s*sources\/.+\s*|derived\s*)-->$/;
const QUIZ_FENCE = /^[ \t]*(`{3,}|~{3,})[ \t]*quiz[ \t]*$/i;
const CODE_FENCE = /^[ \t]*(`{3,}|~{3,})/;
const MARKER_LINE = /^[ \t]*<!--\s*image:\d+\s*-->[ \t]*$/;
const INLINE = /`[^`\n]+`|(?<!!)\[[^\]]*\]\([^)\s]+(?:\s+["'][^"']*["'])?\)|\[\[[^\]]+\]\]/g;
const TOKEN_PREFIX = "{{POLISH_KEEP_";
const TOKEN = (index) => `${TOKEN_PREFIX}${index}}}`;
const TOKEN_LEFTOVER = new RegExp(`${TOKEN_PREFIX.replace(/[{}]/g, "\\$&")}\\d+\\}\\}`);
const ANCHOR_PREFIX = "{{POLISH_ANCHOR_";
const ANCHOR_TOKEN = (index) => `${ANCHOR_PREFIX}${index}}}`;

const PROTECT_NOTE =
  "文中出現 {{POLISH_KEEP_N}} 或 {{POLISH_ANCHOR_N}} 這種標記時，原樣保留在原本位置，不要改寫、刪除、複製或移動。";

export function sha256(text) {
  return createHash("sha256").update(String(text)).digest("hex");
}

function fenceEnd(lines, start, width, marker) {
  const closing = new RegExp(`^[ \\t]*\\${marker}{${width},}[ \\t]*$`);
  let end = start + 1;
  while (end < lines.length && !closing.test(lines[end])) end += 1;
  return Math.min(end, lines.length - 1);
}

/**
 * Replace every structure that must survive polish verbatim with a token.
 * Returns the protected text and a restore function. Blocks are matched first
 * (line level), then inline code and links inside the remaining prose.
 */
export function protectArticle(markdown) {
  const original = String(markdown).replace(/\r\n/g, "\n");
  const lines = original.split("\n");
  const tokens = [];
  const token = (text) => {
    const index = tokens.length;
    tokens.push(text);
    return TOKEN(index);
  };

  const out = [];
  let index = 0;
  let sawFirstNonEmpty = false;
  let previousWasImage = false;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!sawFirstNonEmpty && trimmed !== "") {
      sawFirstNonEmpty = true;
      if (/^#\s+/.test(trimmed)) {
        out.push(token(line));
        index += 1;
        continue;
      }
    }

    const quiz = line.match(QUIZ_FENCE);
    if (quiz) {
      const end = fenceEnd(lines, index, quiz[1].length, quiz[1][0]);
      out.push(token(lines.slice(index, end + 1).join("\n")));
      index = end + 1;
      previousWasImage = false;
      continue;
    }

    if (trimmed.startsWith("$$")) {
      let end = index;
      if (!(trimmed.length > 2 && trimmed.endsWith("$$"))) {
        end = index + 1;
        while (end < lines.length && !lines[end].trim().endsWith("$$")) end += 1;
        end = Math.min(end, lines.length - 1);
      }
      out.push(token(lines.slice(index, end + 1).join("\n")));
      index = end + 1;
      previousWasImage = false;
      continue;
    }

    const fence = line.match(CODE_FENCE);
    if (fence) {
      const end = fenceEnd(lines, index, fence[1].length, fence[1][0]);
      out.push(token(lines.slice(index, end + 1).join("\n")));
      index = end + 1;
      previousWasImage = false;
      continue;
    }

    if (PROVENANCE.test(trimmed) || MARKER_LINE.test(line) || IMAGE_LINE_ONLY.test(line)) {
      out.push(token(line));
      previousWasImage = IMAGE_LINE_ONLY.test(line);
      index += 1;
      continue;
    }

    if (trimmed === "") {
      out.push(line);
      index += 1;
      continue;
    }

    if (previousWasImage && CAPTION.test(line)) {
      out.push(token(line));
      previousWasImage = false;
      index += 1;
      continue;
    }

    previousWasImage = false;
    out.push(line.replace(INLINE, (match) => token(match)));
    index += 1;
  }

  const protectedText = out.join("\n");
  const restore = (text) => {
    let restored = String(text);
    for (let i = 0; i < tokens.length; i += 1) {
      restored = restored.split(TOKEN(i)).join(tokens[i]);
    }
    return restored;
  };
  return { text: protectedText, restore, tokens };
}

/**
 * Legacy plans may still carry an `anchor`. Replace each one that exists in the
 * article with a token so a polish run can rewrite the surrounding prose without
 * breaking it. New plans have no anchors: their image positions are the
 * `<!--image:N-->` markers, which protectArticle already preserves.
 */
export function protectAnchors(markdown, plan) {
  let out = String(markdown).replace(/\r\n/g, "\n");
  const tokens = [];
  let cursor = 0;
  for (const item of plan ?? []) {
    const anchor = String(item?.anchor ?? "");
    if (!anchor) continue;
    const found = out.indexOf(anchor, cursor);
    if (found === -1) continue;
    const token = ANCHOR_TOKEN(tokens.length);
    tokens.push(anchor);
    out = `${out.slice(0, found)}${token}${out.slice(found + anchor.length)}`;
    cursor = found + token.length;
  }
  const restore = (text) => {
    let restored = String(text);
    for (let i = 0; i < tokens.length; i += 1) {
      restored = restored.split(ANCHOR_TOKEN(i)).join(tokens[i]);
    }
    return restored;
  };
  return { text: out, tokens, restore };
}

function anchorTokensIntact(text, tokens) {
  for (let i = 0; i < tokens.length; i += 1) {
    const token = ANCHOR_TOKEN(i).replace(/[{}]/g, "\\$&");
    const count = (String(text).match(new RegExp(token, "g")) ?? []).length;
    if (count !== 1) throw new Error("polish changed an image plan anchor");
  }
}

function markerSequence(markdown) {
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
    const end = fenceEnd(lines, index, match[1].length, match[1][0]);
    blocks.push(lines.slice(index, end + 1).join("\n"));
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

function mathBlocks(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed.startsWith("$$")) continue;
    let end = index;
    if (!(trimmed.length > 2 && trimmed.endsWith("$$"))) {
      end = index + 1;
      while (end < lines.length && !lines[end].trim().endsWith("$$")) end += 1;
      end = Math.min(end, lines.length - 1);
    }
    blocks.push(lines.slice(index, end + 1).join("\n"));
    index = end;
  }
  return blocks;
}

function codeBlocks(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  for (let index = 0; index < lines.length; index += 1) {
    const quiz = lines[index].match(QUIZ_FENCE);
    if (quiz) {
      index = fenceEnd(lines, index, quiz[1].length, quiz[1][0]);
      continue;
    }
    const match = lines[index].match(CODE_FENCE);
    if (!match) continue;
    const end = fenceEnd(lines, index, match[1].length, match[1][0]);
    blocks.push(lines.slice(index, end + 1).join("\n"));
    index = end;
  }
  return blocks;
}

export function validatePolishedArticle({ original, next }) {
  if (!String(next).trim()) throw new Error("polished article is empty");
  if (TOKEN_LEFTOVER.test(String(next))) throw new Error("polished article left a protection token behind");
  const originalHeading = firstLine(original);
  const nextHeading = firstLine(next);
  if (!/^#\s+/.test(originalHeading)) throw new Error("original article has no H1");
  if (originalHeading !== nextHeading) throw new Error("polish changed the H1");
  if (!equalList(provenanceLines(original), provenanceLines(next))) {
    throw new Error("polish changed a provenance comment");
  }
  if (!equalList(codeBlocks(original), codeBlocks(next))) {
    throw new Error("polish changed a fenced code block");
  }
  if (!equalList(mathBlocks(original), mathBlocks(next))) {
    throw new Error("polish changed a formula block");
  }
  if (!equalList(quizBlocks(original), quizBlocks(next))) {
    throw new Error("polish changed a quiz block");
  }
  if (!equalList(markerSequence(original), markerSequence(next))) {
    throw new Error("polish changed the image markers");
  }
  const originalImages = imageLines(original);
  const nextImages = imageLines(next);
  if (
    originalImages.length !== nextImages.length ||
    originalImages.some((image, index) => image.alt !== nextImages[index].alt || image.target !== nextImages[index].target)
  ) {
    throw new Error("polish changed an existing image line");
  }
  if (!equalList(imageCaptions(original), imageCaptions(next))) {
    throw new Error("polish changed an image caption");
  }
  if (!equalList(linkTargets(original), linkTargets(next))) {
    throw new Error("polish changed a relative or source link");
  }
}

export function planIsEligible(article) {
  return markerSequence(article).length > 0 || imageLines(article).length > 0;
}

function withTrailingNewline(original, text) {
  const body = String(text).replace(/\s+$/, "");
  return /\n$/.test(original) || original === "" ? `${body}\n` : body;
}

async function polishProse({ article, plan, instruction, fetchImpl, root }) {
  const anchors = protectAnchors(article, plan);
  const { text, restore } = protectArticle(anchors.text);
  const combined = [PROTECT_NOTE, instruction?.trim()].filter(Boolean).join("\n\n");
  const injected = fetchImpl ? { fetch: fetchImpl } : {};

  let lastError = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    let result;
    try {
      result = await polishArticle(
        { articleText: text, instruction: combined, save: false },
        root,
        injected,
      );
    } catch (error) {
      return { error: error?.message ?? "polish request failed" };
    }
    try {
      anchorTokensIntact(result.text, anchors.tokens);
      const next = withTrailingNewline(article, anchors.restore(restore(result.text)));
      validatePolishedArticle({ original: article, next });
      return { next, attempts: attempt };
    } catch (error) {
      lastError = error;
    }
  }
  return { error: lastError?.message ?? "polish failed" };
}

export function applyPlanRewrite(text, plan) {
  let parsed;
  try {
    parsed = JSON.parse(String(text).trim());
  } catch {
    throw new Error("polished image plan is not valid JSON");
  }
  if (!Array.isArray(parsed) || parsed.length !== plan.length) {
    throw new Error("polish changed the image plan length");
  }
  return plan.map((item, index) => {
    const next = parsed[index];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      throw new Error(`polished image plan item ${index + 1} is not an object`);
    }
    const heading = String(next.heading ?? "").trim();
    const prompt = String(next.prompt ?? "").trim();
    if (!heading) throw new Error(`polished image plan item ${index + 1} has an empty heading`);
    if (!prompt) throw new Error(`polished image plan item ${index + 1} has an empty prompt`);
    return { index: item.index, heading, anchor: item.anchor, prompt };
  });
}

async function polishPlan({ plan, title, instruction, fetchImpl, root }) {
  const input = plan.map(({ heading, prompt }) => ({ heading, prompt }));
  const context = [title ? `文章標題：${title}` : "", instruction?.trim()].filter(Boolean).join("\n\n");
  const injected = fetchImpl ? { fetch: fetchImpl } : {};

  let lastError = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = await polishArticle(
        {
          articleText: JSON.stringify(input, null, 2),
          promptFile: "prompts/polish-plan.txt",
          instruction: context || undefined,
          save: false,
        },
        root,
        injected,
      );
      return { plan: applyPlanRewrite(result.text, plan), attempts: attempt };
    } catch (error) {
      lastError = error;
    }
  }
  return { error: lastError?.message ?? "plan polish failed" };
}

function planForDisk(plan) {
  return plan.map(({ heading, anchor, prompt }) => ({ heading, anchor, prompt }));
}

function readPolishedPlan(root, { subject, node, step }) {
  const files = jobFiles(root, { subject, node, step });
  const raw = readJson(files.plan);
  if (raw == null) return null;
  try {
    const plan = normalizeStepPlan(raw);
    return plan;
  } catch {
    return null;
  }
}

function copyDraftAsIs({ files, entry, article, plan, shownPolish, shownPlan, error }) {
  writeFileSync(files.polish, article);
  return {
    id: entry.id,
    title: entry.title,
    status: "copied",
    changed: false,
    fallback: true,
    error,
    article: shownPolish,
    plan: shownPlan,
    anchors: plan.length,
  };
}

async function polishOne({ root, subject, node, entry, force, instruction, fetchImpl }) {
  const articlePath = join(root, "learn", subject, "nodes", node, `${entry.id}.md`);
  const shown = relative(root, articlePath);
  if (!existsSync(articlePath)) {
    return { id: entry.id, title: entry.title, status: "skipped-no-article", path: shown };
  }
  const article = readFileSync(articlePath, "utf8");
  if (!hasArticleBody(article)) {
    return { id: entry.id, title: entry.title, status: "skipped-no-article", path: shown };
  }

  const files = jobFiles(root, { subject, node, step: entry.id });
  if (!existsSync(files.plan)) {
    return { id: entry.id, title: entry.title, status: "skipped-no-plan", path: relative(root, files.plan) };
  }
  if (!planIsEligible(article)) {
    return { id: entry.id, title: entry.title, status: "skipped-not-published", path: shown };
  }

  const recordPath = polishedRecordPath(root, { subject, node, step: entry.id });
  const record = readJson(recordPath);
  if (!force && record && record.article_sha256 === sha256(article)) {
    return { id: entry.id, title: entry.title, status: "skipped-record", path: shown };
  }

  const plan = readPolishedPlan(root, { subject, node, step: entry.id });
  const prose = await polishProse({ article, plan: plan ?? [], instruction, fetchImpl, root });
  if (prose.error) {
    return { id: entry.id, title: entry.title, status: "failed", path: shown, error: prose.error };
  }

  let nextPlan = plan;
  let planChanged = false;
  if (plan) {
    const rewritten = await polishPlan({
      plan,
      title: firstLine(prose.next),
      instruction,
      fetchImpl,
      root,
    });
    if (rewritten.error) {
      return { id: entry.id, title: entry.title, status: "failed", path: shown, error: rewritten.error };
    }
    nextPlan = rewritten.plan;
    planChanged = JSON.stringify(nextPlan) !== JSON.stringify(plan);
  }

  const changed = prose.next !== article || planChanged;
  writeFileSync(articlePath, prose.next);
  if (nextPlan && planChanged) {
    writeFileSync(files.plan, `${JSON.stringify(planForDisk(nextPlan), null, 2)}\n`);
  }
  const written = {
    polished_at: new Date().toISOString(),
    article_sha256: sha256(prose.next),
    changed,
    model: process.env.TEXT_MODEL || process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini",
  };
  mkdirSync(dirname(recordPath), { recursive: true });
  writeFileSync(recordPath, JSON.stringify(written, null, 2) + "\n");
  const quizPath = join(root, "learn", subject, "nodes", node, `${entry.id}.quiz.json`);
  if (changed && existsSync(quizPath)) rmSync(quizPath, { force: true });
  return {
    id: entry.id,
    title: entry.title,
    status: "polished",
    changed,
    planChanged,
    attempts: prose.attempts,
    path: shown,
    plan: relative(root, files.plan),
    record: relative(root, recordPath),
  };
}

export async function runPolishDraft({
  root,
  subject,
  node: nodeId,
  step,
  instruction = null,
  copy = false,
  fetchImpl = null,
}) {
  const node = readNode(root, subject, nodeId);
  const entry = (node.steps ?? []).find((item) => item?.id === step);
  if (!entry) throw new Error(`step "${step}" is not in node ${nodeId}`);

  const files = jobFiles(root, { subject, node: nodeId, step });
  const shownOriginal = relative(root, files.original);
  const shownPolish = relative(root, files.polish);
  const shownPlan = relative(root, files.plan);
  if (!existsSync(files.original)) {
    return { id: entry.id, title: entry.title, status: "skipped-no-original", path: shownOriginal };
  }
  const article = readFileSync(files.original, "utf8");
  if (!hasArticleBody(article)) {
    return { id: entry.id, title: entry.title, status: "skipped-no-original", path: shownOriginal };
  }
  if (!existsSync(files.plan)) {
    return { id: entry.id, title: entry.title, status: "skipped-no-plan", path: shownPlan };
  }

  let plan;
  try {
    plan = readStepPlan(root, { subject, node: nodeId, step }, article);
  } catch (error) {
    return {
      id: entry.id,
      title: entry.title,
      status: "failed",
      path: shownPlan,
      error: error?.message ?? "invalid image plan",
    };
  }

  if (copy) {
    writeFileSync(files.polish, article);
    return {
      id: entry.id,
      title: entry.title,
      status: "copied",
      changed: false,
      article: shownPolish,
      plan: shownPlan,
      anchors: plan.length,
    };
  }

  const prose = await polishProse({ article, plan, instruction, fetchImpl, root });
  if (prose.error) {
    return copyDraftAsIs({
      files,
      entry,
      article,
      plan,
      shownPolish,
      shownPlan,
      error: prose.error,
    });
  }
  const rewritten = await polishPlan({
    plan,
    title: firstLine(prose.next),
    instruction,
    fetchImpl,
    root,
  });
  if (rewritten.error) {
    return copyDraftAsIs({
      files,
      entry,
      article,
      plan,
      shownPolish,
      shownPlan,
      error: rewritten.error,
    });
  }

  writeFileSync(files.polish, prose.next);
  writeFileSync(files.plan, `${JSON.stringify(planForDisk(rewritten.plan), null, 2)}\n`);
  return {
    id: entry.id,
    title: entry.title,
    status: "polished",
    changed: prose.next !== article || JSON.stringify(rewritten.plan) !== JSON.stringify(plan),
    attempts: prose.attempts,
    article: shownPolish,
    plan: shownPlan,
    anchors: rewritten.plan.length,
  };
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const width = Math.max(1, Math.min(Number(limit) || 1, items.length || 1));
  await Promise.all(
    Array.from({ length: width }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await fn(items[index]);
      }
    }),
  );
  return results;
}

const NODE_PLAN_OPEN = /^<<<PLAN:[ \t]*(.+?)[ \t]*>>>$/;
const NODE_PLAN_CLOSE = /^<<<END-PLAN>>>$/;
const NODE_STEP_OPEN = /^<<<STEP:[ \t]*(.+?)[ \t]*>>>$/;
const NODE_STEP_CLOSE = /^<<<END-STEP>>>$/;
const CONTEXT_CHARS = 900;
const NODE_CONTEXT_ALLOWANCE = 4000;

export const DEFAULT_NODE_MAX_CHARS = 180000;

function nodeLimit(maxChars) {
  const value = Number(maxChars ?? process.env.POLISH_NODE_MAX_CHARS);
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_NODE_MAX_CHARS;
  return value;
}

function takeAfterHeading(text, limit) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  let index = 0;
  while (index < lines.length && lines[index].trim() === "") index += 1;
  if (index < lines.length && /^#\s+/.test(lines[index])) index += 1;
  return lines.slice(index).join("\n").trim().slice(0, limit);
}

function takeTail(text, limit) {
  const body = String(text).replace(/\r\n/g, "\n").trim();
  return body.length <= limit ? body : body.slice(body.length - limit);
}

/**
 * Split the editable steps into batches that fit the character ceiling. Splits
 * at step boundaries only and in halves, so 4 steps over the limit become 1,2
 * and 3,4. A single oversized step stays in its own batch: the step is never
 * cut in half, because a half article cannot be validated.
 */
export function splitNodeBatches(items, maxChars, baseChars = 0) {
  const limit = nodeLimit(maxChars);
  const total = items.reduce((sum, item) => sum + item.chars, baseChars);
  if (items.length <= 1 || total <= limit) return [items];
  const middle = Math.ceil(items.length / 2);
  return [
    ...splitNodeBatches(items.slice(0, middle), limit, baseChars),
    ...splitNodeBatches(items.slice(middle), limit, baseChars),
  ];
}

/** Read one PLAN or STEP block list out of the model reply. */
export function parseNodeReply(text) {
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  const plans = new Map();
  const steps = new Map();
  const duplicates = [];
  const unterminated = [];

  for (let index = 0; index < lines.length; index += 1) {
    const plan = lines[index].match(NODE_PLAN_OPEN);
    const step = lines[index].match(NODE_STEP_OPEN);
    if (!plan && !step) continue;
    const target = plan ? plans : steps;
    const close = plan ? NODE_PLAN_CLOSE : NODE_STEP_CLOSE;
    const id = (plan ?? step)[1];
    let end = index + 1;
    while (end < lines.length && !close.test(lines[end])) end += 1;
    if (end >= lines.length) {
      unterminated.push(id);
      break;
    }
    if (target.has(id)) duplicates.push(id);
    else target.set(id, lines.slice(index + 1, end).join("\n").trim());
    index = end;
  }

  return { plans, steps, duplicates: [...new Set(duplicates)], unterminated };
}

function nodeManifest(node, editable, contexts) {
  return {
    nodeTitle: node.title ?? null,
    goal: node.goal ?? null,
    steps: (node.steps ?? []).map((entry, position) => ({
      order: position + 1,
      id: entry.id,
      title: entry.title ?? null,
      purpose: entry.purpose ?? null,
      editable: editable.includes(entry.id),
      ...(contexts[entry.id] ? { context: contexts[entry.id] } : {}),
    })),
  };
}

/**
 * Compose the user message for one batch: the node manifest, then one PLAN and
 * one STEP block per editable step, in teaching order.
 */
export function buildNodePayload({ node, editableEntries, plans, protectedTexts, contexts = {} }) {
  const editable = editableEntries.map((entry) => entry.id);
  const blocks = [`<<<NODE>>>`, JSON.stringify(nodeManifest(node, editable, contexts), null, 2), `<<<END-NODE>>>`];
  for (const entry of editableEntries) {
    blocks.push(`<<<PLAN: ${entry.id}>>>`);
    blocks.push(JSON.stringify(plans[entry.id].map(({ heading, prompt }) => ({ heading, prompt })), null, 2));
    blocks.push(`<<<END-PLAN>>>`);
    blocks.push(`<<<STEP: ${entry.id}>>>`);
    blocks.push(protectedTexts[entry.id]);
    blocks.push(`<<<END-STEP>>>`);
  }
  return blocks.join("\n\n");
}

function neighbourContexts({ root, subject, node, editableEntries, allEntries }) {
  const order = allEntries.map((entry) => entry.id);
  const contexts = {};
  const read = (id) => {
    const file = join(root, "learn", subject, "nodes", node, `${id}.md`);
    if (!existsSync(file)) return null;
    const article = readFileSync(file, "utf8");
    if (!hasArticleBody(article)) return null;
    return { head: takeAfterHeading(article, CONTEXT_CHARS), tail: takeTail(article, CONTEXT_CHARS) };
  };
  const first = order.indexOf(editableEntries[0].id);
  const last = order.indexOf(editableEntries[editableEntries.length - 1].id);
  const before = order[first - 1];
  const after = order[last + 1];
  for (const id of [before, after]) {
    if (!id) continue;
    const excerpt = read(id);
    if (excerpt) contexts[id] = excerpt;
  }
  return contexts;
}

function planFromDisk(root, { subject, node, step }) {
  const raw = readJson(jobFiles(root, { subject, node, step }).plan);
  if (raw == null) return null;
  return normalizeStepPlan(raw);
}

function writeTitle({ root, subject, node, step }) {
  const files = jobFiles(root, { subject, node, step });
  try {
    const result = setStepTitle({ root, subject, node, step, from: files.polish });
    return { status: result.status, title: result.title };
  } catch (error) {
    return { status: "failed", error: error?.message ?? String(error) };
  }
}

function copyOriginal({ files, article, plan }) {
  writeFileSync(files.polish, article);
  return { plan, changed: false };
}

/**
 * Node-level polish: one model call for the whole node, so the steps can share
 * terminology, drop repeated explanations and hand off to each other.
 *
 * Only the steps this run prepared are editable. Published neighbours appear in
 * the manifest (and their head/tail excerpts as context) but are never written.
 * A step whose batch response fails validation is rescued with a single-step
 * polish; if that also fails the original is copied through unchanged.
 */
export async function runPolishNode({
  root,
  subject,
  node: nodeId,
  steps = null,
  force = false,
  copy = false,
  instruction = null,
  fetchImpl = null,
  maxChars = null,
  context = true,
  log = () => {},
}) {
  const node = readNode(root, subject, nodeId);
  const allEntries = node.steps ?? [];
  const wanted = steps && steps.length > 0 ? new Set(steps) : null;
  const editableEntries = [];
  const skipped = [];
  const failed = [];

  for (const entry of allEntries) {
    if (wanted && !wanted.has(entry.id)) continue;
    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
    const shownOriginal = relative(root, files.original);
    if (!existsSync(files.original) || !hasArticleBody(readFileSync(files.original, "utf8"))) {
      skipped.push({ id: entry.id, title: entry.title, status: "skipped-no-original", path: shownOriginal });
      continue;
    }
    if (!existsSync(files.plan)) {
      skipped.push({ id: entry.id, title: entry.title, status: "skipped-no-plan", path: relative(root, files.plan) });
      continue;
    }
    if (!force && existsSync(files.polish)) {
      skipped.push({ id: entry.id, title: entry.title, status: "skipped-existing", path: relative(root, files.polish) });
      continue;
    }
    let plan;
    try {
      plan = planFromDisk(root, { subject, node: nodeId, step: entry.id });
      if (!plan) throw new Error("image plan is empty");
    } catch (error) {
      failed.push({ id: entry.id, title: entry.title, status: "failed", error: error?.message ?? String(error) });
      continue;
    }
    editableEntries.push({ ...entry, plan });
  }

  const report = {
    mode: "node",
    subject,
    node: nodeId,
    nodeTitle: node.title ?? null,
    model: resolveTextModel(),
    batches: 0,
    steps: [],
    skipped,
    failed,
  };

  if (wanted) {
    for (const id of wanted) {
      if (!allEntries.some((entry) => entry.id === id)) {
        failed.push({ id, status: "failed", error: `step "${id}" is not in node ${nodeId}` });
      }
    }
  }
  if (editableEntries.length === 0) return report;

  if (copy) {
    for (const entry of editableEntries) {
      const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
      const article = readFileSync(files.original, "utf8");
      writeFileSync(files.polish, article);
      const title = writeTitle({ root, subject, node: nodeId, step: entry.id });
      report.steps.push({
        id: entry.id,
        title: entry.title,
        status: "copied",
        copy: true,
        changed: false,
        article: relative(root, files.polish),
        plan: relative(root, files.plan),
        ...(title.status === "failed" ? { titleError: title.error } : { title: title.title }),
      });
    }
    return report;
  }

  const protectedTexts = {};
  const plans = {};
  const restores = {};
  const anchorSets = {};
  for (const entry of editableEntries) {
    const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
    const article = readFileSync(files.original, "utf8");
    const anchors = protectAnchors(article, entry.plan);
    const protectedArticle = protectArticle(anchors.text);
    protectedTexts[entry.id] = protectedArticle.text;
    restores[entry.id] = (text) => protectedArticle.restore(anchors.restore(text));
    anchorSets[entry.id] = anchors;
    plans[entry.id] = entry.plan;
  }

  const batches = splitNodeBatches(
    editableEntries.map((entry) => ({ id: entry.id, chars: protectedTexts[entry.id].length + JSON.stringify(plans[entry.id]).length })),
    maxChars,
    NODE_CONTEXT_ALLOWANCE,
  ).map((batch) => batch.map((item) => editableEntries.find((entry) => entry.id === item.id)));
  report.batches = batches.length;

  const promptFile = "prompts/polish-node.txt";
  const injected = fetchImpl ? { fetch: fetchImpl } : {};
  const extra = [PROTECT_NOTE, instruction?.trim()].filter(Boolean).join("\n\n");

  for (const batch of batches) {
    const contexts = context
      ? neighbourContexts({ root, subject, node: nodeId, editableEntries: batch, allEntries })
      : {};
    const payload = buildNodePayload({
      node,
      editableEntries: batch,
      plans,
      protectedTexts,
      contexts,
    });
    log(`polish node ${nodeId}: ${batch.length} step(s), ${payload.length} chars`);

    let reply = null;
    let batchError = null;
    try {
      const result = await polishArticle(
        { articleText: payload, promptFile, instruction: extra, save: false },
        root,
        injected,
      );
      reply = parseNodeReply(result.text);
    } catch (error) {
      batchError = error?.message ?? "polish request failed";
    }

    for (const entry of batch) {
      const files = jobFiles(root, { subject, node: nodeId, step: entry.id });
      const article = readFileSync(files.original, "utf8");
      let next = null;
      let attempts = 1;
      let rescued = false;
      let error = batchError;

      const rawStep = reply?.steps.get(entry.id);
      if (!batchError && rawStep) {
        try {
          if (reply.unterminated.includes(entry.id)) throw new Error("reply block is not terminated");
          anchorTokensIntact(rawStep, anchorSets[entry.id].tokens);
          next = withTrailingNewline(article, restores[entry.id](rawStep));
          validatePolishedArticle({ original: article, next });
        } catch (failure) {
          next = null;
          error = failure?.message ?? "polished article failed validation";
        }
      } else if (!batchError) {
        error = "the model did not return this step";
      }

      if (!next) {
        const rescue = await polishProse({ article, plan: entry.plan, instruction, fetchImpl, root });
        attempts += rescue.attempts ?? 2;
        if (rescue.error) {
          error = rescue.error;
        } else {
          next = rescue.next;
          rescued = true;
        }
      }

      if (!next) {
        copyOriginal({ files, article, plan: entry.plan });
        const title = writeTitle({ root, subject, node: nodeId, step: entry.id });
        report.steps.push({
          id: entry.id,
          title: entry.title,
          status: "copied",
          fallback: true,
          changed: false,
          attempts,
          error,
          article: relative(root, files.polish),
          plan: relative(root, files.plan),
          ...(title.status === "failed" ? { titleError: title.error } : { title: title.title }),
        });
        continue;
      }

      let planChanged = false;
      let planError = null;
      const rawPlan = reply?.plans.get(entry.id);
      if (rawPlan) {
        try {
          const rewritten = applyPlanRewrite(rawPlan, entry.plan);
          planChanged = JSON.stringify(rewritten) !== JSON.stringify(entry.plan);
          if (planChanged) writeFileSync(files.plan, `${JSON.stringify(planForDisk(rewritten), null, 2)}\n`);
        } catch (failure) {
          planError = failure?.message ?? "image plan rewrite failed";
        }
      }

      writeFileSync(files.polish, next);
      if (next !== article) rmSync(join(root, "learn", subject, "nodes", nodeId, `${entry.id}.quiz.json`), { force: true });
      const title = writeTitle({ root, subject, node: nodeId, step: entry.id });
      report.steps.push({
        id: entry.id,
        title: entry.title,
        status: "polished",
        changed: next !== article,
        planChanged,
        attempts,
        ...(rescued ? { rescued: true } : {}),
        article: relative(root, files.polish),
        plan: relative(root, files.plan),
        ...(planError ? { planError } : {}),
        ...(error ? { error } : {}),
        ...(title.status === "failed" ? { titleError: title.error } : { title: title.title }),
      });
    }
  }

  return report;
}

export async function runPolish({
  root,
  subject,
  node: nodeId,
  step = null,
  force = false,
  maxParallel = 3,
  instruction = null,
  fetchImpl = null,
}) {
  const node = readNode(root, subject, nodeId);
  const entries = selectSteps(node, step);
  const results = await mapLimit(entries, maxParallel, (entry) =>
    polishOne({ root, subject, node: nodeId, entry, force, instruction, fetchImpl }),
  );

  const steps = results.filter((result) => result.status === "polished");
  const skipped = results.filter((result) => String(result.status).startsWith("skipped-"));
  const failed = results.filter((result) => result.status === "failed");

  return {
    mode: "run",
    subject,
    node: nodeId,
    nodeTitle: node.title,
    steps,
    skipped,
    failed,
  };
}

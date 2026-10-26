import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
  applyHumanize,
  prepareHumanize,
  sha256,
  validateHumanizedArticle,
} from "./humanize-article.mjs";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function read(root, relative) {
  return readFileSync(join(root, relative), "utf8");
}

const ARTICLE = `# Step One

Plain opening paragraph.

<!--image:1-->

## Why it matters

A second paragraph.

<!-- derived -->
\`\`\`js
const answer = 42;
\`\`\`

\`\`\`quiz
{ "question": "Two plus two?", "options": ["3", "4"], "answer": 1 }
\`\`\`
`;

const PLAN = [
  {
    index: 1,
    heading: "Plain heading",
    anchor: "Plain opening paragraph.",
    prompt: "draw the plain opening",
  },
];

function fixture(t, { article = ARTICLE, plan = PLAN, body = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "humanize-article-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: written
goal: "Explain one thing."
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/notes.txt#L1-L10]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
`,
  );
  write(root, "learn/test/nodes/n1/s1.md", body ? article : "# Step One\n");
  if (plan) write(root, "learn/test/output/image-plans/n1/s1.json", JSON.stringify(plan, null, 2) + "\n");
  return root;
}

function workspace(root, file = "article.md") {
  return join(root, "learn/test/output/humanize/n1/s1", file);
}

test("prepare creates a workspace and apply writes the article, plan, and record", (t) => {
  const root = fixture(t);
  const prepared = prepareHumanize({ root, subject: "test", node: "n1" });
  assert.equal(prepared.steps.length, 1);
  assert.equal(prepared.steps[0].status, "ready");
  assert.equal(existsSync(workspace(root)), true);
  assert.equal(existsSync(workspace(root, "plan.json")), true);
  assert.equal(existsSync(workspace(root, "original-article.md")), true);

  write(
    root,
    "learn/test/output/humanize/n1/s1/article.md",
    ARTICLE.replace("Plain opening paragraph.", "A reader-first opening paragraph."),
  );
  write(
    root,
    "learn/test/output/humanize/n1/s1/plan.json",
    JSON.stringify([{ ...PLAN[0], heading: "What this means", prompt: "draw the meaning" }], null, 2),
  );
  write(root, "learn/test/output/humanize/n1/s1/summary.txt", "Removed three filler sentences.\n");

  const report = applyHumanize({ root, subject: "test", node: "n1", step: "s1" });
  assert.equal(report.status, "humanized");
  assert.equal(report.changed, true);
  assert.equal(report.summary, "Removed three filler sentences.");
  assert.match(read(root, "learn/test/nodes/n1/s1.md"), /A reader-first opening paragraph\./);
  assert.match(read(root, "learn/test/output/image-plans/n1/s1.json"), /draw the meaning/);
  assert.match(read(root, "learn/test/output/image-plans/n1/s1.json"), /"anchor": "Plain opening paragraph\."/);

  const record = JSON.parse(read(root, "learn/test/output/humanized/n1/s1.json"));
  assert.equal(record.article_sha256, sha256(read(root, "learn/test/nodes/n1/s1.md")));
  assert.equal(record.plan_sha256, sha256(read(root, "learn/test/output/image-plans/n1/s1.json")));
  assert.equal(record.changed, true);
  assert.equal(record.summary, "Removed three filler sentences.");
  assert.equal(existsSync(join(root, "learn/test/output/humanize/n1/s1")), false);
});

test("prepare skips a step whose record still matches both hashes", (t) => {
  const root = fixture(t);
  prepareHumanize({ root, subject: "test", node: "n1" });
  applyHumanize({ root, subject: "test", node: "n1", step: "s1", summary: "done" });

  const prepared = prepareHumanize({ root, subject: "test", node: "n1" });
  assert.equal(prepared.steps.length, 0);
  assert.equal(prepared.skipped[0].status, "skipped-record");
});

test("a manually edited file with a stale hash is prepared again, and --force ignores the record", (t) => {
  const root = fixture(t);
  prepareHumanize({ root, subject: "test", node: "n1" });
  applyHumanize({ root, subject: "test", node: "n1", step: "s1", summary: "done" });

  write(root, "learn/test/nodes/n1/s1.md", `${read(root, "learn/test/nodes/n1/s1.md")}\nManual note.\n`);
  const stale = prepareHumanize({ root, subject: "test", node: "n1" });
  assert.equal(stale.steps[0].status, "ready");

  const forced = prepareHumanize({ root, subject: "test", node: "n1", force: true });
  assert.equal(forced.steps[0].status, "ready");
});

test("a changed marker fails validation and leaves the official files untouched", (t) => {
  const root = fixture(t);
  const beforeArticle = read(root, "learn/test/nodes/n1/s1.md");
  const beforePlan = read(root, "learn/test/output/image-plans/n1/s1.json");
  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/humanize/n1/s1/article.md",
    ARTICLE.replace("<!--image:1-->", "<!--image:2-->"),
  );

  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /changed the image markers/,
  );
  assert.equal(read(root, "learn/test/nodes/n1/s1.md"), beforeArticle);
  assert.equal(read(root, "learn/test/output/image-plans/n1/s1.json"), beforePlan);
  assert.equal(existsSync(join(root, "learn/test/output/humanized/n1/s1.json")), false);
  assert.equal(existsSync(join(root, "learn/test/output/humanize/n1/s1/article.md")), true);
});

test("a changed code block or quiz block fails validation", (t) => {
  const root = fixture(t);
  prepareHumanize({ root, subject: "test", node: "n1" });
  write(root, "learn/test/output/humanize/n1/s1/article.md", ARTICLE.replace("42", "43"));
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /fenced code block/,
  );

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(root, "learn/test/output/humanize/n1/s1/article.md", ARTICLE.replace('"4"', '"five"'));
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /quiz block/,
  );
});

test("a changed plan anchor fails validation", (t) => {
  const root = fixture(t);
  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/humanize/n1/s1/plan.json",
    JSON.stringify([{ ...PLAN[0], anchor: "A different sentence." }], null, 2),
  );
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /changed the anchor/,
  );
});

test("validateHumanizedArticle keeps the H1 and existing image lines", () => {
  assert.throws(
    () => validateHumanizedArticle({ original: ARTICLE, next: ARTICLE.replace("# Step One", "# Step 1") }),
    /H1/,
  );
  const withImage = ARTICLE.replace("<!--image:1-->", "![第 1 段配圖](./s1-assets/image-1.webp)");
  assert.throws(
    () =>
      validateHumanizedArticle({
        original: withImage,
        next: withImage.replace("第 1 段", "第 2 段"),
      }),
    /image line/,
  );
  const withCaption = ARTICLE.replace(
    "<!--image:1-->",
    "![第 1 段配圖](./s1-assets/image-1.webp)\n*AI 生成示意圖*",
  );
  assert.throws(
    () =>
      validateHumanizedArticle({
        original: withCaption,
        next: withCaption.replace("*AI 生成示意圖*", "*AI 畫的圖*"),
      }),
    /image caption/,
  );
  const withLinks = ARTICLE.replace(
    "A second paragraph.",
    "A second paragraph with [a relative link](./other.md) and [[sources/test/notes.txt#L1-L2]].",
  );
  assert.throws(
    () =>
      validateHumanizedArticle({
        original: withLinks,
        next: withLinks.replace("./other.md", "./moved.md"),
      }),
    /link/,
  );
});

test("prepare skips steps without a plan, without a marker, or without an article body", (t) => {
  const noPlan = fixture(t, { plan: null });
  const preparedNoPlan = prepareHumanize({ root: noPlan, subject: "test", node: "n1" });
  assert.equal(preparedNoPlan.skipped[0].status, "skipped-no-plan");

  const noMarker = fixture(t, { article: "# Step One\n\nJust prose.\n" });
  const preparedNoMarker = prepareHumanize({ root: noMarker, subject: "test", node: "n1" });
  assert.equal(preparedNoMarker.skipped[0].status, "skipped-not-published");

  const noBody = fixture(t, { body: false });
  const preparedNoBody = prepareHumanize({ root: noBody, subject: "test", node: "n1" });
  assert.equal(preparedNoBody.skipped[0].status, "skipped-no-article");
});

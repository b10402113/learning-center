import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
  applyHumanize,
  prepareHumanize,
  validateHumanizedArticle,
  validateHumanizedPlan,
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

![示意圖](./s1-assets/image-2.webp)

*AI 生成示意圖*

<!-- derived -->
\`\`\`js
const answer = 42;
\`\`\`

\`\`\`quiz
{ "question": "Two plus two?", "options": ["3", "4"], "answer": 1 }
\`\`\`

See [the node](../n1.md) and [[sources/test/notes.txt#L1-L10]].
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
  if (plan) {
    write(root, "learn/test/nodes/n1/s1.plan.json", JSON.stringify(plan, null, 2) + "\n");
  }
  return root;
}

function work(root, file = "humanized.md") {
  return join(root, "learn/test/output/n1/s1", file);
}

test("prepare copies the article and plan into the step folder", (t) => {
  const root = fixture(t);
  const prepared = prepareHumanize({ root, subject: "test", node: "n1" });

  assert.equal(prepared.steps.length, 1);
  assert.equal(prepared.steps[0].status, "ready");
  assert.equal(read(root, "learn/test/output/n1/s1/humanized.md"), ARTICLE);
  assert.deepEqual(
    JSON.parse(read(root, "learn/test/output/n1/s1/humanized.plan.json")),
    PLAN,
  );
  assert.equal(existsSync(join(root, "learn/test/output/humanize")), false);
  assert.equal(existsSync(join(root, "learn/test/output/humanized")), false);
});

test("prepare skips a step without an article, a plan or a marker", (t) => {
  const noArticle = fixture(t, { body: false });
  const noArticleReport = prepareHumanize({ root: noArticle, subject: "test", node: "n1" });
  assert.equal(noArticleReport.skipped[0].status, "skipped-no-article");

  const noPlan = fixture(t, { plan: null });
  const noPlanReport = prepareHumanize({ root: noPlan, subject: "test", node: "n1" });
  assert.equal(noPlanReport.skipped[0].status, "skipped-no-plan");

  const notPublished = fixture(t, {
    article: ARTICLE.replace("<!--image:1-->", "").replace(
      "![示意圖](./s1-assets/image-2.webp)",
      "",
    ),
  });
  const notPublishedReport = prepareHumanize({
    root: notPublished,
    subject: "test",
    node: "n1",
  });
  assert.equal(notPublishedReport.skipped[0].status, "skipped-not-published");
  assert.equal(existsSync(work(notPublished)), false);
});

test("apply copies humanized.md back and keeps both article files identical", (t) => {
  const root = fixture(t);
  prepareHumanize({ root, subject: "test", node: "n1" });

  write(
    root,
    "learn/test/output/n1/s1/humanized.md",
    ARTICLE.replace("Plain opening paragraph.", "A reader-first opening paragraph."),
  );
  write(
    root,
    "learn/test/output/n1/s1/humanized.plan.json",
    JSON.stringify(
      [{ ...PLAN[0], heading: "What this means", prompt: "draw the meaning" }],
      null,
      2,
    ) + "\n",
  );

  const report = applyHumanize({ root, subject: "test", node: "n1", step: "s1", summary: "done" });
  assert.equal(report.status, "humanized");
  assert.equal(report.changed, true);

  const article = read(root, "learn/test/nodes/n1/s1.md");
  assert.match(article, /A reader-first opening paragraph\./);
  assert.equal(read(root, "learn/test/output/n1/s1/humanized.md"), article);

  const plan = JSON.parse(read(root, "learn/test/nodes/n1/s1.plan.json"));
  assert.equal(plan[0].heading, "What this means");
  assert.equal(plan[0].prompt, "draw the meaning");
  assert.equal(plan[0].anchor, PLAN[0].anchor);
  assert.deepEqual(
    plan,
    JSON.parse(read(root, "learn/test/output/n1/s1/humanized.plan.json")),
  );

  assert.equal(existsSync(join(root, "learn/test/output/humanized")), false);
  assert.equal(existsSync(join(root, "learn/test/output/humanize")), false);
});

test("a protected article change leaves both official files untouched", (t) => {
  const root = fixture(t);
  const beforeArticle = read(root, "learn/test/nodes/n1/s1.md");
  const beforePlan = read(root, "learn/test/nodes/n1/s1.plan.json");
  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/n1/s1/humanized.md",
    ARTICLE.replace("<!--image:1-->", "<!--image:2-->"),
  );

  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /changed the image markers/,
  );
  assert.equal(read(root, "learn/test/nodes/n1/s1.md"), beforeArticle);
  assert.equal(read(root, "learn/test/nodes/n1/s1.plan.json"), beforePlan);
  assert.equal(existsSync(work(root)), true);
});

test("changed code, quiz, image caption or links fail validation", (t) => {
  const root = fixture(t);
  prepareHumanize({ root, subject: "test", node: "n1" });

  write(root, "learn/test/output/n1/s1/humanized.md", ARTICLE.replace("42", "43"));
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /fenced code block/,
  );

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(root, "learn/test/output/n1/s1/humanized.md", ARTICLE.replace('"4"', '"five"'));
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /quiz block/,
  );

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(root, "learn/test/output/n1/s1/humanized.md", ARTICLE.replace("*AI 生成示意圖*", "*New caption*"));
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /image caption/,
  );

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/n1/s1/humanized.md",
    ARTICLE.replace("[the node](../n1.md)", "[the node](../other.md)"),
  );
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /link/,
  );
});

test("a changed plan anchor, length, key or empty prompt fails validation", (t) => {
  const root = fixture(t);
  const beforePlan = read(root, "learn/test/nodes/n1/s1.plan.json");
  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/n1/s1/humanized.plan.json",
    JSON.stringify([{ ...PLAN[0], anchor: "A different sentence." }], null, 2),
  );
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /anchor/,
  );
  assert.equal(read(root, "learn/test/nodes/n1/s1.plan.json"), beforePlan);

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/n1/s1/humanized.plan.json",
    JSON.stringify([PLAN[0], { ...PLAN[0], index: 2 }], null, 2),
  );
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /number of plan items/,
  );

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/n1/s1/humanized.plan.json",
    JSON.stringify([{ ...PLAN[0], style: "photo" }], null, 2),
  );
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /keys of plan item/,
  );

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/n1/s1/humanized.plan.json",
    JSON.stringify([{ ...PLAN[0], prompt: "  " }], null, 2),
  );
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /non-empty prompt/,
  );

  prepareHumanize({ root, subject: "test", node: "n1" });
  write(
    root,
    "learn/test/output/n1/s1/humanized.plan.json",
    JSON.stringify([{ ...PLAN[0], prompt: 42 }], null, 2),
  );
  assert.throws(
    () => applyHumanize({ root, subject: "test", node: "n1", step: "s1" }),
    /non-empty prompt/,
  );
});

test("humanize refuses to change a display formula", () => {
  const article = `# Step One

Opening.

$$
P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B)}
$$
`;
  assert.doesNotThrow(() =>
    validateHumanizedArticle({
      original: article,
      next: article.replace("Opening.", "A different opening."),
    }),
  );
  assert.throws(
    () => validateHumanizedArticle({ original: article, next: article.replace("P(A", "P(B") }),
    /formula block/,
  );
});

test("validators accept only prose and heading/prompt changes", () => {
  assert.doesNotThrow(() =>
    validateHumanizedArticle({
      original: ARTICLE,
      next: ARTICLE.replace("A second paragraph.", "A better second paragraph."),
    }),
  );
  assert.doesNotThrow(() =>
    validateHumanizedPlan({
      article: ARTICLE,
      step: "s1",
      original: PLAN,
      next: [{ ...PLAN[0], heading: "New heading", prompt: "new prompt" }],
    }),
  );
  assert.throws(() =>
    validateHumanizedPlan({
      article: ARTICLE,
      step: "s1",
      original: PLAN,
      next: [{ ...PLAN[0], anchor: "Another sentence." }],
    }),
    /anchor/,
  );
});

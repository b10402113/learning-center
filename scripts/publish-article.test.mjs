import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { publishArticles } from "./publish-article.mjs";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function publishFixture(t, { runArticle = "# Step One\n\nNew body.\n" } = {}) {
  const root = mkdtempSync(join(tmpdir(), "publish-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "learn/test/nodes/n1.md", `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Do one thing."
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
`);
  write(
    root,
    "learn/test/nodes/n1/s1.md",
    "# Step One\n\nOld body.\n\n![第 1 段配圖](./s1-assets/image-1.webp)\n*AI 生成示意圖*\n",
  );
  write(root, "learn/test/nodes/n1/s1-assets/image-1.webp", "old-image");
  write(root, "learn/test/nodes/n1/s1.quiz.json", JSON.stringify({ "quiz-generated": true, questions: [] }));
  write(root, "learn/test/output/n1/prepare.json", JSON.stringify({ steps: ["s1"] }));
  write(root, "learn/test/output/polished/n1/s1.json", JSON.stringify({ polished_at: "2026-10-26" }));
  const polishFile = join(root, "learn/test/output/n1/s1/polish.md");
  write(root, "learn/test/output/n1/s1/polish.md", runArticle);
  write(
    root,
    "learn/test/output/n1/s1/result.json",
    JSON.stringify({ status: "completed", mode: "direct", article: polishFile, images: [] }),
  );
  write(root, "learn/test/output/n1/s1/compose.json", JSON.stringify({ model: "test-model", composed_at: "2026-10-26T00:00:00.000Z" }));
  write(root, "learn/test/output/n1/s1/blocks.json", "[]");
  write(root, "learn/test/output/n1/s1/humanized.md", "# Step One\n\nOld body.\n");
  write(root, "learn/test/output/n1/s1/humanized.plan.json", "[]\n");
  return root;
}

const markerArticle = "# Step One\n\nNew body.\n\n<!--image:1-->\n";

test("a forced publish writes markers, then clears stale figures and the polish record", async (t) => {
  const root = publishFixture(t, { runArticle: markerArticle });
  const report = await publishArticles({ root, subject: "test", node: "n1", force: true });
  assert.equal(report.steps[0].status, "published");
  const body = readFileSync(join(root, "learn/test/nodes/n1/s1.md"), "utf8");
  assert.match(body, /<!--image:1-->/);
  assert.doesNotMatch(body, /\*AI 生成示意圖\*/);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), false);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1.quiz.json")), false);
  assert.equal(existsSync(join(root, "learn/test/output/polished/n1/s1.json")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/humanized.md")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/humanized.plan.json")), false);
});

test("a plain publish keeps the existing figures and the polish record", async (t) => {
  const root = publishFixture(t, { runArticle: markerArticle });
  const report = await publishArticles({ root, subject: "test", node: "n1" });
  assert.equal(report.steps[0].status, "published");
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), true);
  assert.equal(existsSync(join(root, "learn/test/output/polished/n1/s1.json")), true);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/humanized.md")), true);
});

test("publish stamps the compose model as the step author", async (t) => {
  const root = publishFixture(t, { runArticle: markerArticle });
  await publishArticles({ root, subject: "test", node: "n1" });
  const node = readFileSync(join(root, "learn/test/nodes/n1.md"), "utf8");
  assert.match(node, /^    author: "test-model"$/m);
});

test("publish falls back to the configured text model without a compose record", async (t) => {
  const root = publishFixture(t, { runArticle: markerArticle });
  rmSync(join(root, "learn/test/output/n1/s1/compose.json"), { force: true });
  const previous = process.env.TEXT_MODEL;
  process.env.TEXT_MODEL = "fallback-model";
  t.after(() => {
    if (previous === undefined) delete process.env.TEXT_MODEL;
    else process.env.TEXT_MODEL = previous;
  });
  await publishArticles({ root, subject: "test", node: "n1" });
  const node = readFileSync(join(root, "learn/test/nodes/n1.md"), "utf8");
  assert.match(node, /^    author: "fallback-model"$/m);
});

test("a failed forced publish leaves the figures and record intact", async (t) => {
  const root = publishFixture(t, { runArticle: "# Step One\n" });
  const report = await publishArticles({ root, subject: "test", node: "n1", force: true });
  assert.equal(report.steps[0].status, "failed");
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), true);
  assert.equal(existsSync(join(root, "learn/test/output/polished/n1/s1.json")), true);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/humanized.md")), true);
  assert.match(readFileSync(join(root, "learn/test/nodes/n1/s1.md"), "utf8"), /image-1\.webp/);
});

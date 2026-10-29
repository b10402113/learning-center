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
  write(root, "learn/test/output/jobs/n1/prepare.json", JSON.stringify({ steps: ["s1"] }));
  write(root, "learn/test/output/humanized/n1/s1.json", JSON.stringify({ humanized_at: "2026-10-26" }));
  const runFile = join(root, "learn/test/output/run/article.md");
  write(root, "learn/test/output/run/article.md", runArticle);
  write(
    root,
    "learn/test/output/jobs/n1/s1/s1.result.json",
    JSON.stringify({ status: "completed", article: runFile, images: [] }),
  );
  write(root, "learn/test/output/jobs/n1/s1/s1.blocks.json", "[]");
  return root;
}

const markerArticle = "# Step One\n\nNew body.\n\n<!--image:1-->\n";

test("a forced publish writes markers, then clears stale figures and the humanize record", async (t) => {
  const root = publishFixture(t, { runArticle: markerArticle });
  const report = await publishArticles({ root, subject: "test", node: "n1", force: true });
  assert.equal(report.steps[0].status, "published");
  const body = readFileSync(join(root, "learn/test/nodes/n1/s1.md"), "utf8");
  assert.match(body, /<!--image:1-->/);
  assert.doesNotMatch(body, /\*AI 生成示意圖\*/);
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), false);
  assert.equal(existsSync(join(root, "learn/test/output/humanized/n1/s1.json")), false);
});

test("a plain publish keeps the existing figures and the humanize record", async (t) => {
  const root = publishFixture(t, { runArticle: markerArticle });
  const report = await publishArticles({ root, subject: "test", node: "n1" });
  assert.equal(report.steps[0].status, "published");
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), true);
  assert.equal(existsSync(join(root, "learn/test/output/humanized/n1/s1.json")), true);
});

test("a failed forced publish leaves the figures and record intact", async (t) => {
  const root = publishFixture(t, { runArticle: "# Step One\n" });
  const report = await publishArticles({ root, subject: "test", node: "n1", force: true });
  assert.equal(report.steps[0].status, "failed");
  assert.equal(existsSync(join(root, "learn/test/nodes/n1/s1-assets/image-1.webp")), true);
  assert.equal(existsSync(join(root, "learn/test/output/humanized/n1/s1.json")), true);
  assert.match(readFileSync(join(root, "learn/test/nodes/n1/s1.md"), "utf8"), /image-1\.webp/);
});

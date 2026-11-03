import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";

const SCRIPT = resolve("scripts/run-article-agent.mjs");

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function nodeFixture(t, prefix) {
  const root = mkdtempSync(join(tmpdir(), prefix));
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
status: confirmed
goal: "Explain one thing."
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "First step."
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
  return root;
}

test("translate mode keeps a Traditional Chinese original and inserts the markers", (t) => {
  const root = nodeFixture(t, "article-agent-translate-");
  write(
    root,
    "learn/test/output/n1/s1/original.md",
    `# 步驟一

這是第一段。它會被保留。

<!-- source: sources/test/notes.txt#L1-L1 -->
\`\`\`js
const answer = 42;
\`\`\`

## 小節

這是第二段，會有配圖。
`,
  );
  write(
    root,
    "learn/test/nodes/n1/s1.plan.json",
    JSON.stringify([{ heading: "小節", anchor: "這是第二段，會有配圖。", prompt: "畫一個流程圖" }]),
  );

  const result = spawnSync(
    process.execPath,
    [SCRIPT, "--subject", "test", "--node", "n1", "--step", "s1", "--mode", "translate", "--markers-only", "--root", root],
    {
      encoding: "utf8",
      env: { ...process.env, TEXT_API_KEY: "", OPENAI_API_KEY: "" },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const verdict = JSON.parse(result.stdout);
  assert.equal(verdict.status, "completed");
  assert.equal(verdict.textRequests, 0);
  assert.match(verdict.article, /translated\.md$/);
  const article = readFileSync(verdict.article, "utf8");
  assert.match(article, /<!--code:1-->/);
  assert.match(article, /<!--image:1-->/);
  assert.match(article, /這是第二段，會有配圖。/);
});

test("markers-only fails before the agent runs when the publisher wrote no plan", (t) => {
  const root = nodeFixture(t, "article-agent-wrapper-");
  write(root, "learn/test/output/n1/s1/polish.md", "# Step One\n\nPolish body.\n");

  const result = spawnSync(
    process.execPath,
    [SCRIPT, "--subject", "test", "--node", "n1", "--step", "s1", "--markers-only", "--root", root],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--markers-only requires an image plan/);
});

test("direct mode reads polish.md and writes only the run metadata", (t) => {
  const root = nodeFixture(t, "article-agent-direct-");
  write(root, "learn/test/output/n1/s1/original.md", "# Step One\n\nOriginal body.\n");
  write(
    root,
    "learn/test/output/n1/s1/polish.md",
    `# Step One

The polished paragraph stays exactly as written.

## Detail

This paragraph carries the figure.

<!--image:1-->
`,
  );
  write(
    root,
    "learn/test/nodes/n1/s1.plan.json",
    JSON.stringify([{ heading: "Detail", prompt: "A flow" }]),
  );

  const result = spawnSync(
    process.execPath,
    [SCRIPT, "--subject", "test", "--node", "n1", "--step", "s1", "--mode", "direct", "--markers-only", "--root", root],
    { encoding: "utf8", env: { ...process.env, TEXT_API_KEY: "", OPENAI_API_KEY: "" } },
  );
  assert.equal(result.status, 0, result.stderr);
  const verdict = JSON.parse(result.stdout);
  assert.equal(verdict.status, "completed");
  assert.equal(verdict.textRequests, 0);
  assert.equal(verdict.textModel, null);
  assert.match(verdict.article, /polish\.md$/);
  assert.match(readFileSync(verdict.article, "utf8"), /The polished paragraph stays exactly as written\./);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/article.md")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/protected.md")), false);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/blocks.json")), true);
  assert.equal(existsSync(join(root, "learn/test/output/n1/s1/result.json")), true);
});

test("direct mode rejects a polish file without pre-placed markers", (t) => {
  const root = nodeFixture(t, "article-agent-no-markers-");
  write(
    root,
    "learn/test/output/n1/s1/polish.md",
    "# Step One\n\nThis paragraph carries the figure.\n",
  );
  write(
    root,
    "learn/test/nodes/n1/s1.plan.json",
    JSON.stringify([{ heading: "Detail", anchor: "This paragraph carries the figure.", prompt: "A flow" }]),
  );

  const result = spawnSync(
    process.execPath,
    [SCRIPT, "--subject", "test", "--node", "n1", "--step", "s1", "--mode", "direct", "--markers-only", "--root", root],
    { encoding: "utf8", env: { ...process.env, TEXT_API_KEY: "", OPENAI_API_KEY: "" } },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /no <!--image:N--> markers/);
});

test("direct mode rejects a marker and plan mismatch", (t) => {
  const root = nodeFixture(t, "article-agent-hand-markers-");
  write(
    root,
    "learn/test/output/n1/s1/polish.md",
    `# Step One

This paragraph carries the figure.

<!--image:1-->
`,
  );
  write(
    root,
    "learn/test/nodes/n1/s1.plan.json",
    JSON.stringify([
      { heading: "Detail", prompt: "A flow" },
      { heading: "Another", prompt: "Another flow" },
    ]),
  );

  const mismatch = spawnSync(
    process.execPath,
    [SCRIPT, "--subject", "test", "--node", "n1", "--step", "s1", "--mode", "direct", "--markers-only", "--root", root],
    { encoding: "utf8", env: { ...process.env, TEXT_API_KEY: "", OPENAI_API_KEY: "" } },
  );
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /markers .* plan expects/);
});

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";

const SCRIPT = resolve("scripts/run-article-agent.mjs");

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

test("translate mode keeps a Traditional Chinese original and inserts the markers", (t) => {
  const root = mkdtempSync(join(tmpdir(), "article-agent-translate-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "learn/test/nodes/n1.md", `---
id: n1
title: "節點一"
subject: test
tier: 1
order: 1
status: confirmed
goal: "測試。"
prerequisites: []
steps:
  - id: s1
    title: "步驟一"
    purpose: "First step."
    sources:
      - "[[sources/test/notes.txt#L1-L10]]"
created: 2026-10-22
updated: 2026-10-22
---

# 節點一

## Lesson

測試。

## Steps

1. [步驟一](n1/s1.md)
`);
  write(
    root,
    "learn/test/output/jobs/n1/s1/s1.original.md",
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
    "learn/test/output/image-plans/n1/s1.json",
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
  const article = readFileSync(verdict.article, "utf8");
  assert.match(article, /<!--code:1-->/);
  assert.match(article, /<!--image:1-->/);
  assert.match(article, /這是第二段，會有配圖。/);
});

test("markers-only fails before the agent runs when the publisher wrote no plan", (t) => {
  const root = mkdtempSync(join(tmpdir(), "article-agent-wrapper-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "learn/test/nodes/n1.md", `---
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
`);
  write(root, "learn/test/output/jobs/n1/s1/s1.original.md", "# Step One\n\nOriginal body.\n");

  const result = spawnSync(
    process.execPath,
    [SCRIPT, "--subject", "test", "--node", "n1", "--step", "s1", "--markers-only", "--root", root],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--markers-only requires an image plan/);
});

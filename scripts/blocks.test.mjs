import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "blocks.mjs");

function write(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function read(root, relative) {
  return readFileSync(join(root, relative), "utf8");
}

function fixture(t, { status = "written", blocks = [], source = "notes.txt" } = {}) {
  const root = mkdtempSync(join(tmpdir(), "blocks-cli-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const blockLines = blocks.length
    ? `    blocks:\n${blocks.map((id) => `      - ${id}`).join("\n")}\n`
    : "";
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: ${status}
goal: "Do one thing."
digests: []
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
    sources:
      - "[[sources/test/${source}#L1-L10]]"
${blockLines}created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
`,
  );
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\nBody.\n");
  return root;
}

function blockFile(root, { id = "tool-calling", label = "Tool Calling", updated = "2026-01-01", sources = ["notes.txt"] } = {}) {
  const sourceLines = sources.map((source) => `  - "[[sources/test/${source}#L1-L10]]"`).join("\n");
  write(
    root,
    `learn/test/blocks/${id}.md`,
    `---
id: ${id}
title: "${label}（工具呼叫）"
label: "${label}"
subject: test
type: concept
status: draft
summary: "一句話解釋。"
aliases: []
prerequisites: []
related: []
sources:
${sourceLines}
created: 2026-01-01
updated: ${updated}
---

# ${label}

## 定義

Text.

## 為什麼重要

Text.

## 如何運作

Text.

## 例子

Text.

## 邊界與常見誤解

Text.

## 進階

Text.
`,
  );
}

function audit(root, concepts) {
  write(
    root,
    "learn/test/output/blocks/n1.audit.json",
    JSON.stringify({ node: "n1", steps: { s1: { concepts } } }, null, 2),
  );
}

function run(root, mode) {
  const result = spawnSync(process.execPath, [SCRIPT, mode, "--subject", "test", "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

test("apply builds coverage from a confirmed audit", (t) => {
  const root = fixture(t, { blocks: ["tool-calling"] });
  blockFile(root);
  audit(root, [
    {
      slug: "tool-calling",
      label: "Tool Calling",
      sources: ["[[sources/test/notes.txt#L1-L10]]"],
      match: { kind: "new" },
      note: "",
    },
  ]);

  const result = run(root, "apply");
  assert.equal(result.written, true);
  const coverage = JSON.parse(read(root, "learn/test/blocks/coverage.json"));
  assert.equal(coverage.subject, "test");
  assert.deepEqual(coverage.steps["n1/s1"].concepts, [
    {
      slug: "tool-calling",
      label: "Tool Calling",
      sources: ["[[sources/test/notes.txt#L1-L10]]"],
      block: "tool-calling",
      note: "",
    },
  ]);
});

test("apply keeps a fuzzy candidate uncovered", (t) => {
  const root = fixture(t);
  blockFile(root);
  audit(root, [
    {
      slug: "grounded-generation",
      label: "Grounded Generation",
      sources: ["[[sources/test/notes.txt#L1-L10]]"],
      match: { kind: "fuzzy" },
      note: "",
    },
  ]);

  run(root, "apply");
  const coverage = JSON.parse(read(root, "learn/test/blocks/coverage.json"));
  assert.equal(coverage.steps["n1/s1"].concepts[0].block, null);
});

test("apply derives coverage from step blocks when there is no audit", (t) => {
  const root = fixture(t, { blocks: ["tool-calling"] });
  blockFile(root);

  run(root, "apply");
  const coverage = JSON.parse(read(root, "learn/test/blocks/coverage.json"));
  assert.equal(coverage.steps["n1/s1"].concepts[0].slug, "tool-calling");
  assert.equal(coverage.steps["n1/s1"].concepts[0].block, "tool-calling");
  assert.equal(coverage.steps["n1/s1"].concepts[0].label, "Tool Calling");
});

test("apply skips nodes that are not written", (t) => {
  const root = fixture(t, { status: "confirmed", blocks: ["tool-calling"] });
  blockFile(root);

  run(root, "apply");
  const coverage = JSON.parse(read(root, "learn/test/blocks/coverage.json"));
  assert.deepEqual(coverage.steps, {});
});

test("report prints the coverage numbers", (t) => {
  const root = fixture(t, { blocks: ["tool-calling"] });
  blockFile(root);
  run(root, "apply");

  const result = run(root, "report");
  assert.equal(result.stats.stepCoverage, 1);
  assert.equal(result.stats.courseCoverage, 1);
  assert.equal(result.stats.blockCount, 1);
  assert.equal(result.stats.projectedBlocks, 1);
  assert.equal(result.stats.reuseFactor, 1);
  assert.deepEqual(result.stats.uncovered, []);
});

test("report counts an uncovered concept", (t) => {
  const root = fixture(t);
  blockFile(root);
  audit(root, [
    {
      slug: "tool-calling",
      label: "Tool Calling",
      sources: ["[[sources/test/notes.txt#L1-L10]]"],
      match: { kind: "new" },
      note: "",
    },
    {
      slug: "grounded-generation",
      label: "Grounded Generation",
      sources: ["[[sources/test/notes.txt#L1-L10]]"],
      match: { kind: "fuzzy" },
      note: "",
    },
  ]);
  run(root, "apply");

  const result = run(root, "report");
  assert.equal(result.stats.stepCoverage, 0.5);
  assert.equal(result.stats.courseCoverage, 0.5);
  assert.deepEqual(result.stats.uncovered.map((concept) => concept.slug), ["grounded-generation"]);
});

test("check reports drift", (t) => {
  const root = fixture(t, { blocks: ["tool-calling"], source: "notes.txt" });
  blockFile(root, { updated: "2026-01-01", sources: ["other.txt"] });
  run(root, "apply");

  const result = run(root, "check");
  const kinds = result.drifts.map((drift) => drift.kind);
  assert.ok(kinds.includes("stale-step"));
  assert.ok(kinds.includes("source-not-referenced"));
});

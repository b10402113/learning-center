import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

function blockFile(
  root,
  {
    id = "tool-calling",
    label = "Tool Calling",
    updated = "2026-01-01",
    sources = ["notes.txt"],
    status = "draft",
    type = "concept",
    aliases = [],
    prerequisites = [],
    related = [],
  } = {},
) {
  const sourceLines = sources.map((source) => `  - "[[sources/test/${source}#L1-L10]]"`).join("\n");
  const yamlList = (key, values) =>
    values.length ? `${key}:\n${values.map((value) => `  - ${value}`).join("\n")}` : `${key}: []`;
  const sectionList = {
    concept: ["定義", "為什麼重要", "如何運作", "例子", "邊界與常見誤解", "進階"],
    procedure: ["問題", "前置條件", "步驟", "例子", "失敗模式", "進階"],
    principle: ["主張", "為什麼成立", "適用範圍", "反例", "進階"],
    contrast: ["A 是什麼", "B 是什麼", "關鍵差異", "何時用哪個", "進階"],
  }[type];
  write(
    root,
    `learn/test/blocks/${id}.md`,
    `---
id: ${id}
title: "${label}（工具呼叫）"
label: "${label}"
subject: test
type: ${type}
status: ${status}
summary: "一句話解釋。"
${yamlList("aliases", aliases)}
${yamlList("prerequisites", prerequisites)}
${yamlList("related", related)}
sources:
${sourceLines}
created: 2026-01-01
updated: ${updated}
---

# ${label}

${sectionList.map((section) => `## ${section}\n\nText.`).join("\n\n")}
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

function runArgs(root, args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd: root, encoding: "utf8" });
}

test("audit prints a manifest of written steps with a body", (t) => {
  const root = fixture(t);
  blockFile(root);

  const result = runArgs(root, ["audit", "--subject", "test", "--json"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const manifest = JSON.parse(result.stdout);
  assert.equal(manifest.nodes.length, 1);
  assert.equal(manifest.nodes[0].node, "n1");
  assert.deepEqual(
    manifest.nodes[0].steps.map((step) => step.id),
    ["s1"],
  );
  assert.equal(manifest.nodes[0].steps[0].article, "learn/test/nodes/n1/s1.md");
  assert.equal(manifest.blocks[0].id, "tool-calling");
  assert.deepEqual(manifest.skipped, []);
});

test("audit skips an article without a body", (t) => {
  const root = fixture(t);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n");

  const manifest = JSON.parse(runArgs(root, ["audit", "--subject", "test", "--json"]).stdout);
  assert.deepEqual(manifest.nodes, []);
  assert.ok(manifest.skipped.some((entry) => entry.reason === "article-missing-or-empty"));
});

test("audit --check validates the audit files", (t) => {
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
    { slug: "agent", label: "Agent", sources: ["[[sources/test/notes.txt#L1-L10]]"], match: { kind: "new" } },
    { slug: "loop", label: "Loop", sources: ["[[sources/test/notes.txt#L1-L10]]"], match: { kind: "new" } },
  ]);

  const clean = runArgs(root, ["audit", "--subject", "test", "--check", "--json"]);
  assert.equal(clean.status, 0, clean.stderr || clean.stdout);
  assert.deepEqual(JSON.parse(clean.stdout).failures, []);

  write(
    root,
    "learn/test/output/blocks/n1.audit.json",
    JSON.stringify({ node: "n1", steps: { s1: { concepts: [{ slug: "Bad Slug", label: "how to" }] } } }),
  );
  const bad = runArgs(root, ["audit", "--subject", "test", "--check", "--json"]);
  assert.equal(bad.status, 1);
  assert.ok(JSON.parse(bad.stdout).failures.length > 0);
});

test("merge is a dry run until applied and rewrites every reference", (t) => {
  const root = fixture(t, { blocks: ["old-block", "other-block"] });
  blockFile(root, { id: "old-block", label: "Old Block", sources: ["notes.txt"], related: ["other-block"] });
  blockFile(root, { id: "canonical-block", label: "Canonical Block", sources: ["other.txt"] });
  blockFile(root, { id: "other-block", label: "Other Block", related: ["old-block"] });
  write(
    root,
    "learn/test/blocks/canonical-block.md",
    read(root, "learn/test/blocks/canonical-block.md").replace(
      "## 進階\n\nText.",
      "## 進階\n\nSee [[old-block]].",
    ),
  );
  write(
    root,
    "learn/test/blocks/other-block.md",
    read(root, "learn/test/blocks/other-block.md").replace(
      "## 進階\n\nText.",
      "## 進階\n\nSee [[old-block|Old Block]].",
    ),
  );

  const preview = runArgs(root, [
    "merge",
    "--subject",
    "test",
    "--from",
    "old-block",
    "--into",
    "canonical-block",
    "--dry-run",
    "--json",
  ]);
  assert.equal(preview.status, 0, preview.stderr || preview.stdout);
  assert.equal(JSON.parse(preview.stdout).dryRun, true);
  assert.ok(existsSync(join(root, "learn/test/blocks/old-block.md")));

  const result = runArgs(root, [
    "merge",
    "--subject",
    "test",
    "--from",
    "old-block",
    "--into",
    "canonical-block",
    "--json",
  ]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(!existsSync(join(root, "learn/test/blocks/old-block.md")));

  const canonical = read(root, "learn/test/blocks/canonical-block.md");
  assert.match(canonical, /aliases:\n  - old-block/);
  assert.match(canonical, /related:\n  - other-block/);
  assert.match(canonical, /\[\[canonical-block\]\]/);
  assert.match(canonical, /sources\/test\/notes\.txt/);
  assert.match(canonical, /sources\/test\/other\.txt/);

  const other = read(root, "learn/test/blocks/other-block.md");
  assert.match(other, /related:\n  - canonical-block/);
  assert.match(other, /\[\[canonical-block\|Old Block\]\]/);
  assert.doesNotMatch(other, /\[\[old-block/);

  const node = read(root, "learn/test/nodes/n1.md");
  assert.match(node, /blocks:\n      - canonical-block\n      - other-block/);

  const coverage = JSON.parse(read(root, "learn/test/blocks/coverage.json"));
  const blocks = coverage.steps["n1/s1"].concepts.map((concept) => concept.block);
  assert.deepEqual(blocks, ["canonical-block", "other-block"]);
});

test("apply keeps a short step note and caps overflow at six concepts", (t) => {
  const root = fixture(t);
  blockFile(root);
  const many = Array.from({ length: 7 }, (_, index) => ({
    slug: `concept-${index}`,
    label: `Concept ${index}`,
    sources: ["[[sources/test/notes.txt#L1-L10]]"],
    match: { kind: "new" },
    note: "",
  }));
  audit(root, many.slice(0, 2));
  const shortPath = join(root, "learn/test/output/blocks/n1.audit.json");
  writeFileSync(
    shortPath,
    JSON.stringify({ node: "n1", steps: { s1: { concepts: many.slice(0, 2), note: "很短的一步。" } } }),
  );

  run(root, "apply");
  let coverage = JSON.parse(read(root, "learn/test/blocks/coverage.json"));
  assert.equal(coverage.steps["n1/s1"].note, "很短的一步。");
  assert.equal(coverage.steps["n1/s1"].concepts.length, 2);

  writeFileSync(shortPath, JSON.stringify({ node: "n1", steps: { s1: { concepts: many } } }));
  run(root, "apply");
  coverage = JSON.parse(read(root, "learn/test/blocks/coverage.json"));
  assert.equal(coverage.steps["n1/s1"].concepts.length, 6);
  assert.equal(coverage.steps["n1/s1"].overflow, true);
  assert.equal(coverage.steps["n1/s1"].overflowCount, 7);
});

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { resetNodes } from "./reset-nodes.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "reset-nodes.mjs");

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "reset-nodes-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "learn/demo/nodes/alpha"), { recursive: true });
  mkdirSync(join(root, "learn/demo/nodes/beta"), { recursive: true });
  mkdirSync(join(root, "learn/demo/digests"), { recursive: true });
  writeFileSync(
    join(root, "learn/demo/ROADMAP.md"),
    `---
subject: demo
status: confirmed
created: 2026-10-22
---

# ROADMAP — demo

### Tier 1 — Basics

1. **[Alpha](nodes/alpha.md)**

### Tier 2 — Depth

2. **[Beta](nodes/beta.md)**
`,
  );
  writeFileSync(join(root, "learn/demo/MEMORY.md"), "# MEMORY\n\nKeep me.\n");
  writeFileSync(
    join(root, "learn/demo/nodes/alpha.md"),
    `---
id: alpha
title: "Alpha"
subject: demo
tier: 1
order: 1
status: written
goal: "Understand alpha."
prerequisites: []
steps:
  - id: one
    title: "First step"
    purpose: "Explain the first thing."
    sources:
      - "[[sources/demo/a.txt#L1-L5]]"
  - id: two
    title: "Second step"
    purpose: "Explain the second thing."
    sources:
      - "[[sources/demo/a.txt#L6-L9]]"
created: 2026-10-22
updated: 2026-10-22
---

# Alpha

## Lesson

Alpha lesson.

## Steps

1. [First step](alpha/one.md)
2. [Second step](alpha/two.md)
`,
  );
  writeFileSync(join(root, "learn/demo/nodes/alpha/one.md"), "# First step\n\nGenerated body.\n");
  writeFileSync(join(root, "learn/demo/nodes/alpha/two.md"), "# Second step\n\nGenerated body.\n");
  mkdirSync(join(root, "learn/demo/nodes/alpha/one-assets"), { recursive: true });
  writeFileSync(join(root, "learn/demo/nodes/alpha/one-assets/image-1.webp"), "image");
  mkdirSync(join(root, "learn/demo/output/quiz-candidates/alpha"), { recursive: true });
  writeFileSync(join(root, "learn/demo/output/quiz-candidates/alpha/one.json"), "{}\n");
  writeFileSync(join(root, "learn/demo/output/quiz-candidates/alpha/two.json"), "{}\n");
  mkdirSync(join(root, "learn/demo/output/image-plans/alpha"), { recursive: true });
  writeFileSync(join(root, "learn/demo/output/image-plans/alpha/one.json"), "[]\n");
  writeFileSync(join(root, "learn/demo/output/image-plans/alpha/two.json"), "[]\n");
  mkdirSync(join(root, "learn/demo/output/jobs"), { recursive: true });
  writeFileSync(join(root, "learn/demo/output/jobs/demo-alpha-one.plan.json"), "[]\n");
  writeFileSync(join(root, "learn/demo/output/jobs/demo-alpha-two.plan.json"), "[]\n");
  writeFileSync(join(root, "learn/demo/nodes/alpha/orphan.md"), "# Orphan\n");
  writeFileSync(
    join(root, "learn/demo/nodes/beta.md"),
    `---
id: beta
title: "Beta"
subject: demo
tier: 2
order: 2
status: draft
goal: "Plan beta."
prerequisites: []
steps: []
created: 2026-10-22
updated: 2026-10-22
---

# Beta

## Lesson

Beta lesson.
`,
  );
  writeFileSync(join(root, "learn/demo/digests/a.md"), "# digest\n");
  return root;
}

test("reset keeps the node container, restores skeletons, and clears generated content", (t) => {
  const root = fixture(t);
  const result = resetNodes({ root, subject: "demo", nodes: ["alpha"], today: "2026-10-24" });

  assert.equal(result.nodes[0].removedArticles, 2);
  assert.equal(result.nodes[0].removedAssets, 1);
  assert.equal(result.nodes[0].removedOrphans, 1);
  assert.equal(result.nodes[0].removedCandidates, 2);
  assert.equal(result.nodes[0].removedPlanFiles, 4);

  const container = readFileSync(join(root, "learn/demo/nodes/alpha.md"), "utf8");
  assert.match(container, /^status: confirmed$/m);
  assert.match(container, /^updated: '?2026-10-24'?$/m);
  assert.match(container, /steps:/);
  assert.match(container, /Explain the first thing\./);
  assert.match(container, /## Steps/);

  assert.equal(readFileSync(join(root, "learn/demo/nodes/alpha/one.md"), "utf8"), "# First step\n");
  assert.equal(readFileSync(join(root, "learn/demo/nodes/alpha/two.md"), "utf8"), "# Second step\n");
  assert.equal(existsSync(join(root, "learn/demo/nodes/alpha/one-assets")), false);
  assert.equal(existsSync(join(root, "learn/demo/nodes/alpha/orphan.md")), false);
  assert.equal(existsSync(join(root, "learn/demo/output/quiz-candidates/alpha")), false);
  assert.equal(existsSync(join(root, "learn/demo/output/image-plans/alpha/one.json")), false);
  assert.equal(existsSync(join(root, "learn/demo/output/image-plans/alpha/two.json")), false);
  assert.equal(existsSync(join(root, "learn/demo/output/jobs/demo-alpha-one.plan.json")), false);
  assert.equal(existsSync(join(root, "learn/demo/output/jobs/demo-alpha-two.plan.json")), false);
  assert.equal(readFileSync(join(root, "learn/demo/digests/a.md"), "utf8"), "# digest\n");
  assert.equal(readFileSync(join(root, "learn/demo/MEMORY.md"), "utf8"), "# MEMORY\n\nKeep me.\n");
});

test("dry run reports the plan without touching files", (t) => {
  const root = fixture(t);
  const before = readFileSync(join(root, "learn/demo/nodes/alpha.md"), "utf8");
  const result = resetNodes({ root, subject: "demo", nodes: ["alpha"], dryRun: true });

  assert.equal(result.dryRun, true);
  assert.equal(result.nodes[0].removedArticles, 2);
  assert.match(readFileSync(join(root, "learn/demo/nodes/alpha.md"), "utf8"), /^status: written$/m);
  assert.equal(readFileSync(join(root, "learn/demo/nodes/alpha.md"), "utf8"), before);
  assert.equal(readFileSync(join(root, "learn/demo/nodes/alpha/one.md"), "utf8"), "# First step\n\nGenerated body.\n");
  assert.equal(existsSync(join(root, "learn/demo/nodes/alpha/one-assets/image-1.webp")), true);
  assert.equal(existsSync(join(root, "learn/demo/output/quiz-candidates/alpha/one.json")), true);
  assert.equal(existsSync(join(root, "learn/demo/output/image-plans/alpha/one.json")), true);
  assert.equal(existsSync(join(root, "learn/demo/output/jobs/demo-alpha-one.plan.json")), true);
});

test("tier scope resolves only the nodes under that roadmap heading", (t) => {
  const root = fixture(t);
  const result = resetNodes({ root, subject: "demo", tier: "2" });

  assert.deepEqual(result.nodes.map((node) => node.id), ["beta"]);
  assert.equal(result.nodes[0].skipped, "draft");
  assert.equal(readFileSync(join(root, "learn/demo/nodes/alpha/one.md"), "utf8"), "# First step\n\nGenerated body.\n");
});

test("draft nodes are skipped with a reason", (t) => {
  const root = fixture(t);
  const result = resetNodes({ root, subject: "demo", nodes: ["beta"] });
  assert.equal(result.nodes[0].skipped, "draft");
  assert.match(readFileSync(join(root, "learn/demo/nodes/beta.md"), "utf8"), /^status: draft$/m);
});

test("a missing node container fails before any node is touched", (t) => {
  const root = fixture(t);
  assert.throws(
    () => resetNodes({ root, subject: "demo", nodes: ["alpha", "missing"] }),
    /missing node container: learn\/demo\/nodes\/missing\.md/,
  );
  assert.equal(readFileSync(join(root, "learn/demo/nodes/alpha/one.md"), "utf8"), "# First step\n\nGenerated body.\n");
});

test("the CLI resets a subject with --all", (t) => {
  const root = fixture(t);
  const run = spawnSync(process.execPath, [SCRIPT, "--subject", "demo", "--all", "--root", root], { encoding: "utf8" });

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /alpha: written → confirmed/);
  assert.match(run.stdout, /beta: skipped \(draft, no steps\)/);
  assert.match(readFileSync(join(root, "learn/demo/nodes/alpha/one.md"), "utf8"), /^# First step\n$/);
});

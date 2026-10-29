import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";

const CLI = resolve("src/article-cli.mjs");

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "article-cli-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "sources/test/notes.txt", `${Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n")}\n`);
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
  - id: s2
    title: "Step Two"
    purpose: "Second step."
    sources:
      - "[[sources/test/notes.txt#L11-L20]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One

## Lesson

A short lesson.

## Steps

1. [Step One](n1/s1.md)
2. [Step Two](n1/s2.md)
`);
  write(root, "learn/test/nodes/n1/s1.md", "# Step One\n\nExisting body.\n");
  write(root, "learn/test/nodes/n1/s2.md", "# Step Two\n");
  return root;
}

test("prepare asks publishers for markers only and reports skipped steps without image state", (t) => {
  const root = fixture(t);
  const report = JSON.parse(
    execFileSync(
      process.execPath,
      [CLI, "prepare", "--subject", "test", "--node", "n1", "--root", root],
      { encoding: "utf8" },
    ),
  );
  assert.equal(report.steps.length, 1);
  const [step] = report.steps;
  assert.equal(step.id, "s2");
  assert.equal(report.nodeFile, join(root, "learn/test/nodes/n1.md"));
  assert.match(step.command, /--markers-only/);
  assert.match(step.plan, /learn\/test\/output\/image-plans\/n1\/s2\.json$/);
  assert.deepEqual(report.skipped, [
    {
      id: "s1",
      title: "Step One",
      purpose: "First step.",
      status: "skipped",
      path: "learn/test/nodes/n1/s1.md",
      article: join(root, "learn/test/nodes/n1/s1.md"),
    },
  ]);
});

test("render accepts --step and --max-parallel and skips a step with no plan", (t) => {
  const root = fixture(t);
  const run = spawnSync(
    process.execPath,
    [
      CLI,
      "render",
      "--subject",
      "test",
      "--node",
      "n1",
      "--step",
      "s1",
      "--max-parallel",
      "3",
      "--root",
      root,
    ],
    { encoding: "utf8" },
  );
  const report = JSON.parse(run.stdout);
  assert.equal(report.mode, "render");
  assert.equal(report.steps.length, 1);
  assert.equal(report.steps[0].id, "s1");
  assert.equal(report.steps[0].status, "no-plan");
});

test("prepare --force clears the step's shared and legacy plans", (t) => {
  const root = fixture(t);
  write(root, "learn/test/output/jobs/n1/s1/s1.plan.json", "[]");
  write(root, "learn/test/output/image-plans/n1/s1.json", "[]");
  execFileSync(
    process.execPath,
    [CLI, "prepare", "--subject", "test", "--node", "n1", "--step", "s1", "--force", "--root", root],
    { encoding: "utf8" },
  );
  assert.equal(existsSync(join(root, "learn/test/output/jobs/n1/s1/s1.plan.json")), false);
  assert.equal(existsSync(join(root, "learn/test/output/image-plans/n1/s1.json")), false);
});

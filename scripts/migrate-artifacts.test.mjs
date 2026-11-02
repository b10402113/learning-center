import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { migrateArtifacts } from "./migrate-artifacts.mjs";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "migrate-artifacts-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(
    root,
    "learn/demo/nodes/n1.md",
    `---
id: n1
title: "Node One"
subject: demo
tier: 1
order: 1
status: written
goal: "Explain one thing."
prerequisites: []
steps:
  - id: s1
    purpose: "First step."
    sources:
      - "[[sources/demo/a.txt#L1-L5]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One
`,
  );
  write(root, "learn/demo/output/image-plans/n1/s1.json", "[]\n");
  write(root, "learn/demo/output/image-plans/n1/removed-step.json", "[]\n");
  write(root, "learn/demo/output/jobs/n1/prepare.json", "{}\n");
  write(root, "learn/demo/output/materials/n1/s1.json", "{}\n");
  return root;
}

test("dry run reports the move and touches nothing", (t) => {
  const root = fixture(t);
  const report = migrateArtifacts({ root });
  assert.equal(report.apply, false);
  assert.equal(report.subjects.length, 1);
  assert.equal(report.subjects[0].moved, 1);
  assert.equal(report.subjects[0].stale, 1);
  assert.equal(report.subjects[0].outputRemoved, false);
  assert.equal(existsSync(join(root, "learn/demo/output/image-plans/n1/s1.json")), true);
  assert.equal(existsSync(join(root, "learn/demo/nodes/n1/s1.plan.json")), false);
  assert.equal(existsSync(join(root, "learn/demo/nodes/n1/removed-step.plan.json")), false);
});

test("apply moves the plan beside the node and removes the rest of output", (t) => {
  const root = fixture(t);
  const report = migrateArtifacts({ root, apply: true });
  assert.equal(report.subjects[0].moved, 1);
  assert.equal(report.subjects[0].stale, 1);
  assert.equal(report.subjects[0].outputRemoved, true);
  assert.equal(
    readFileSync(join(root, "learn/demo/nodes/n1/s1.plan.json"), "utf8"),
    "[]\n",
  );
  assert.equal(existsSync(join(root, "learn/demo/output")), false);
});

test("a plan that already exists at the target blocks the migration", (t) => {
  const root = fixture(t);
  write(root, "learn/demo/nodes/n1/s1.plan.json", "[]\n");
  const report = migrateArtifacts({ root, apply: true });
  assert.equal(report.subjects[0].moved, 0);
  assert.equal(report.subjects[0].collisions.length, 1);
  assert.equal(report.subjects[0].outputRemoved, false);
  assert.equal(existsSync(join(root, "learn/demo/output/image-plans/n1/s1.json")), true);
});

test("a plan for a node without a container aborts before any move", (t) => {
  const root = fixture(t);
  write(root, "learn/demo/output/image-plans/ghost/s9.json", "[]\n");
  assert.throws(() => migrateArtifacts({ root, apply: true }), /node not found/);
  assert.equal(existsSync(join(root, "learn/demo/output/image-plans/n1/s1.json")), true);
  assert.equal(existsSync(join(root, "learn/demo/nodes/n1/s1.plan.json")), false);
});

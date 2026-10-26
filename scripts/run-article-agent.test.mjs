import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";

const SCRIPT = resolve("scripts/run-article-agent.mjs");

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

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
  write(root, "learn/test/output/jobs/test-n1-s1.original.md", "# Step One\n\nOriginal body.\n");

  const result = spawnSync(
    process.execPath,
    [SCRIPT, "--subject", "test", "--node", "n1", "--step", "s1", "--markers-only", "--root", root],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--markers-only requires an image plan/);
});

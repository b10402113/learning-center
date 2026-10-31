import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { setStepTitle } from "./set-step-title.mjs";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "set-step-title.mjs");

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "set-step-title-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "learn/demo/nodes/alpha"), { recursive: true });
  writeFileSync(
    join(root, "learn/demo/nodes/alpha.md"),
    `---
id: alpha
title: "Alpha"
subject: demo
tier: 1
order: 1
status: confirmed
goal: "Understand alpha."
prerequisites: []
steps:
  - id: one
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

1. [one](alpha/one.md)
2. [Second step](alpha/two.md)
`,
  );
  writeFileSync(join(root, "article.md"), "# First step\n\nBody.\n");
  return root;
}

test("writes the H1 title into the step entry and the ## Steps label", (t) => {
  const root = fixture(t);
  const result = setStepTitle({
    root,
    subject: "demo",
    node: "alpha",
    step: "one",
    from: join(root, "article.md"),
  });

  assert.equal(result.status, "updated");
  assert.equal(result.title, "First step");
  const node = readFileSync(join(root, "learn/demo/nodes/alpha.md"), "utf8");
  assert.match(node, /^  - id: one\n    title: "First step"\n    purpose:/m);
  assert.match(node, /^1\. \[First step\]\(alpha\/one\.md\)$/m);
  assert.match(node, /^2\. \[Second step\]\(alpha\/two\.md\)$/m);
  assert.ok(!/^updated: 2026-10-22$/m.test(node));
});

test("replaces an existing title without duplicating it", (t) => {
  const root = fixture(t);
  setStepTitle({ root, subject: "demo", node: "alpha", step: "two", title: "Renamed" });
  setStepTitle({ root, subject: "demo", node: "alpha", step: "two", title: "Renamed again" });

  const node = readFileSync(join(root, "learn/demo/nodes/alpha.md"), "utf8");
  assert.equal((node.match(/^    title:/gm) || []).length, 1);
  assert.match(node, /^    title: "Renamed again"$/m);
  assert.match(node, /^2\. \[Renamed again\]\(alpha\/two\.md\)$/m);
});

test("rejects an unknown step", (t) => {
  const root = fixture(t);
  assert.throws(
    () => setStepTitle({ root, subject: "demo", node: "alpha", step: "missing", title: "Nope" }),
    /not in the node's steps array/,
  );
});

test("the CLI reports updated JSON", (t) => {
  const root = fixture(t);
  const run = spawnSync(
    process.execPath,
    [SCRIPT, "--root", root, "--subject", "demo", "--node", "alpha", "--step", "one", "--title", "CLI title"],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /"status": "updated"/);
});

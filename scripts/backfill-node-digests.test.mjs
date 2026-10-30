import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), "backfill-node-digests.mjs");

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "backfill-digests-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));

  write(root, "sources/test/notes.txt", "line one\nline two\n");
  write(
    root,
    "learn/test/digests/notes.md",
    `---
source: sources/test/notes.txt
source_type: text
source_lines: 2
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Notes.
`,
  );
  write(
    root,
    "learn/test/nodes/n1.md",
    `---
id: n1
title: "Node: One"
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
      - "[[sources/test/notes.txt#L1-L2]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node One
`,
  );
  return root;
}

function run(root, args = []) {
  return spawnSync(process.execPath, [SCRIPT, "--subject", "test", ...args], { cwd: root, encoding: "utf8" });
}

function write(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function read(root, relative) {
  return readFileSync(join(root, relative), "utf8");
}

test("a dry run reports the derived list without writing", (t) => {
  const root = fixture(t);
  const before = read(root, "learn/test/nodes/n1.md");
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\+ n1: notes\.md/);
  assert.equal(read(root, "learn/test/nodes/n1.md"), before);
});

test("--write adds the digests and preserves frontmatter formatting", (t) => {
  const root = fixture(t);
  const result = run(root, ["--write"]);
  assert.equal(result.status, 0, result.stderr);
  const text = read(root, "learn/test/nodes/n1.md");
  assert.match(text, /^digests:\n  - notes\.md$/m);
  assert.match(text, /^title: "Node: One"$/m);
  assert.match(text, /^updated: 2026-10-22$/m);
});

test("a step-less node keeps its declared digests", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/nodes/planned.md",
    `---
id: planned
title: "Planned"
subject: test
tier: 1
order: 2
status: draft
goal: "Plan it."
digests:
  - notes.md
prerequisites: []
steps: []
created: 2026-10-22
updated: 2026-10-22
---

# Planned
`,
  );
  const result = run(root, ["--write"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(read(root, "learn/test/nodes/planned.md"), /^digests:\n  - notes\.md$/m);
  assert.match(result.stdout, /= planned: 1 digest/);
});

test("--skip-unused marks an unclaimed digest skipped with its reason", (t) => {
  const root = fixture(t);
  write(
    root,
    "learn/test/digests/spare.md",
    `---
source: sources/test/spare.txt
source_type: text
source_lines: 2
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Spare.
`,
  );
  write(root, "sources/test/spare.txt", "line one\nline two\n");
  const result = run(root, ["--write", "--skip-unused", "--reason", "Not taught."]);
  assert.equal(result.status, 0, result.stderr);
  const text = read(root, "learn/test/digests/spare.md");
  assert.match(text, /^status: skipped$/m);
  assert.match(text, /^skip_reason: "Not taught\."$/m);
  assert.doesNotMatch(text, /^absorbed_at:/m);
});

test("--skip-unused requires a reason", (t) => {
  const root = fixture(t);
  const result = run(root, ["--write", "--skip-unused"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--reason/);
});

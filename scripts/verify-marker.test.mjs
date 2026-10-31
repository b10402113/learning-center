import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { runChecks } from "./verify.mjs";

function write(root, relative, content) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

test("an article with markers but no image lines passes verify", (t) => {
  const root = mkdtempSync(join(tmpdir(), "verify-marker-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  write(root, "sources/test/notes.txt", `${Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n")}\n`);
  write(root, "learn/test/digests/notes.md", `---
source: sources/test/notes.txt
source_type: text
source_lines: 20
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- Notes for the fixture.

# L2 detail

- \`#L1-L10\` — first half
- \`#L11-L20\` — second half
`);
  write(root, "learn/test/ROADMAP.md", `---
subject: test
status: confirmed
created: 2026-10-22
---

# Test

## Nodes

### Tier 1 — Basics

1. **[Node One](nodes/n1.md)**
`);
  write(root, "learn/test/nodes/n1.md", `---
id: n1
title: "Node One"
subject: test
tier: 1
order: 1
status: confirmed
goal: "Do one thing."
digests:
  - notes.md
prerequisites: []
steps:
  - id: s1
    title: "Step One"
    purpose: "Explain one thing."
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
  write(
    root,
    "learn/test/nodes/n1/s1.md",
    "# Step One\n\nOpening line.\n\n<!--image:1-->\n\nClosing line.\n\n<!--image:2-->\n",
  );

  const result = runChecks({ root, subject: "test" });
  assert.equal(result.pass, true, JSON.stringify(result.failures, null, 2));
});

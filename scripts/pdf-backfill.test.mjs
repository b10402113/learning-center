import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { backfillPdfs } from "./pdf-backfill.mjs";
import { runChecks } from "./verify.mjs";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "pdf-backfill-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "sources", "demo", "20261022"), { recursive: true });
  return root;
}

function fakePdftotext(root) {
  const path = join(root, "fake-pdftotext");
  writeFileSync(path, "#!/bin/sh\nprintf 'extracted line\\n' > \"$2\"\n", { mode: 0o755 });
  return path;
}

function write(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

test("existing .txt files are not overwritten", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/notes.pdf", "%PDF-1.4\n");
  write(root, "sources/demo/20261022/notes.txt", "keep me\n");
  const result = backfillPdfs({ root, subject: "demo", pdftotext: fakePdftotext(root) });
  assert.equal(result.extracted.length, 0);
  assert.equal(result.skipped.length, 1);
  assert.equal(readFileSync(join(root, "sources/demo/20261022/notes.txt"), "utf8"), "keep me\n");
});

test("missing .txt files are extracted", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/notes.pdf", "%PDF-1.4\n");
  const result = backfillPdfs({ root, subject: "demo", pdftotext: fakePdftotext(root) });
  assert.equal(result.extracted.length, 1);
  assert.equal(readFileSync(join(root, "sources/demo/20261022/notes.txt"), "utf8"), "extracted line\n");
});

test("running backfill twice does not re-extract", (t) => {
  const root = fixture(t);
  const binary = fakePdftotext(root);
  write(root, "sources/demo/20261022/notes.pdf", "%PDF-1.4\n");
  backfillPdfs({ root, subject: "demo", pdftotext: binary });
  write(root, "sources/demo/20261022/notes.txt", "sentinel\n");
  const second = backfillPdfs({ root, subject: "demo", pdftotext: binary });
  assert.equal(second.extracted.length, 0);
  assert.equal(second.skipped.length, 1);
  assert.equal(readFileSync(join(root, "sources/demo/20261022/notes.txt"), "utf8"), "sentinel\n");
});

test("dry run only reports candidates", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/notes.pdf", "%PDF-1.4\n");
  const result = backfillPdfs({ root, subject: "demo", pdftotext: fakePdftotext(root), dryRun: true });
  assert.equal(result.wouldExtract.length, 1);
  assert.equal(result.extracted.length, 0);
  assert.equal(existsSync(join(root, "sources/demo/20261022/notes.txt")), false);
});

test("failed extraction leaves no partial .txt", (t) => {
  const root = fixture(t);
  const binary = join(root, "fail-pdftotext");
  writeFileSync(binary, "#!/bin/sh\nexit 3\n", { mode: 0o755 });
  write(root, "sources/demo/20261022/notes.pdf", "%PDF-1.4\n");
  const result = backfillPdfs({ root, subject: "demo", pdftotext: binary });
  assert.equal(result.failed.length, 1);
  assert.equal(existsSync(join(root, "sources/demo/20261022/notes.txt")), false);
});

test("a real PDF becomes text", (t) => {
  const probe = spawnSync("pdftotext", ["-v"]);
  if (probe.error) t.skip("pdftotext is not installed");
  const root = fixture(t);
  copyFileSync(join(FIXTURES, "sample.pdf"), join(root, "sources/demo/20261022/paper.pdf"));
  const result = backfillPdfs({ root, subject: "demo" });
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  const text = readFileSync(join(root, "sources/demo/20261022/paper.txt"), "utf8");
  assert.match(text, /Harness engineering line one/);
});

test("PDF becomes .txt, gets a digest, and passes verify", (t) => {
  const probe = spawnSync("pdftotext", ["-v"]);
  if (probe.error) t.skip("pdftotext is not installed");
  const root = fixture(t);
  copyFileSync(join(FIXTURES, "sample.pdf"), join(root, "sources/demo/20261022/paper.pdf"));
  assert.equal(backfillPdfs({ root, subject: "demo" }).failed.length, 0);

  const text = readFileSync(join(root, "sources/demo/20261022/paper.txt"), "utf8");
  const lines = (text.match(/\n/g) || []).length;
  write(
    root,
    "learn/demo/digests/paper.md",
    `---
source: sources/demo/20261022/paper.txt
source_type: text
source_lines: ${lines}
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- A two-line sample.

# L2 detail

- \`#L1-L${lines}\` — the whole sample.
`,
  );
  write(
    root,
    "learn/demo/ROADMAP.md",
    `---
subject: demo
status: confirmed
created: 2026-10-22
---

# Demo

## Nodes

### Tier 1 — Basics

1. **[Paper](nodes/paper.md)**
`,
  );
  write(
    root,
    "learn/demo/nodes/paper.md",
    `---
id: paper
title: "Paper"
subject: demo
tier: 1
order: 1
status: confirmed
goal: "Read the sample."
digests:
  - paper.md
steps:
  - id: sample
    title: "Sample"
    purpose: "Read the extracted text."
    sources:
      - "[[sources/demo/20261022/paper.txt#L1-L2]]"
created: 2026-10-22
updated: 2026-10-22
---

# Paper

## Lesson

A sample node.

## Steps

1. [Sample](paper/sample.md)
`,
  );
  write(root, "learn/demo/nodes/paper/sample.md", "# Sample\n\nThe extracted text.\n");

  const result = runChecks({ root, subject: "demo" });
  assert.equal(result.pass, true, JSON.stringify(result.failures, null, 2));
});

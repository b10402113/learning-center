import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import {
  LONG_SOURCE_LINES,
  applySplit,
  isLongSource,
  planChunks,
  planSource,
  planSources,
  renderTable,
  sourceStats,
  splitLines,
} from "./split-sources.mjs";

function write(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return path;
}

function read(root, relative) {
  return readFileSync(join(root, relative), "utf8");
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "split-sources-fixture-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

function padTo(lines, target, prefix) {
  while (lines.length < target) {
    const number = lines.length + 1;
    lines.push(`${prefix} line ${number}`);
    if (number % 10 === 0 && lines.length < target) lines.push("");
  }
}

function twoChapters() {
  const lines = ["Chapter 1. First"];
  padTo(lines, 2000, "chapter one");
  lines.push("Chapter 2. Second");
  padTo(lines, 4200, "chapter two");
  return lines;
}

test("isLongSource uses the 3000 line and 250 KB thresholds", () => {
  assert.equal(isLongSource({ lines: LONG_SOURCE_LINES, bytes: 1 }), false);
  assert.equal(isLongSource({ lines: LONG_SOURCE_LINES + 1, bytes: 1 }), true);
  assert.equal(isLongSource({ lines: 1, bytes: 250 * 1024 + 1 }), true);
});

test("splitLines counts a trailing newline without adding an empty line", () => {
  assert.deepEqual(splitLines("a\nb\n"), ["a", "b"]);
  assert.deepEqual(splitLines("a\nb"), ["a", "b"]);
  assert.deepEqual(splitLines("a\r\nb\r\n"), ["a", "b"]);
});

test("a short source is not planned for splitting", (t) => {
  const root = fixture(t);
  write(root, "sources/test/short.txt", "one\ntwo\n");
  const plan = planSource({ root, path: join(root, "sources/test/short.txt") });
  assert.equal(plan.long, false);
  assert.deepEqual(plan.parts, []);
});

test("chunks tile the original and respect chapter boundaries", () => {
  const text = `${twoChapters().join("\n")}\n`;
  const { lines, parts } = planChunks(text);
  assert.equal(parts[0].start, 1);
  assert.equal(parts.at(-1).end, lines.length);
  assert.equal(parts.reduce((sum, part) => sum + part.lines, 0), lines.length);
  for (let index = 1; index < parts.length; index += 1) {
    assert.equal(parts[index].start, parts[index - 1].end + 1);
  }
  assert.equal(parts[0].end, 2000);
  assert.equal(parts[1].start, 2001);
  assert.ok(parts.every((part) => part.lines >= 200));
  assert.ok(parts.every((part) => part.lines <= 2000));
});

test("a document with no headings splits at paragraph boundaries", () => {
  const lines = [];
  for (let index = 0; index < 3600; index += 1) {
    lines.push(`plain line ${index + 1}`);
    if ((index + 1) % 10 === 0) lines.push("");
  }
  const { parts } = planChunks(`${lines.join("\n")}\n`);
  assert.ok(parts.length >= 2);
  assert.ok(parts.every((part) => part.lines >= 200 && part.lines <= 2000));
});

test("an oversized section splits without leaving a tiny tail", () => {
  const lines = ["Chapter 1. Long"];
  for (let index = 0; index < 4300; index += 1) {
    lines.push(`body ${index + 1}`);
    if ((index + 1) % 12 === 0) lines.push("");
  }
  const { parts } = planChunks(`${lines.join("\n")}\n`);
  assert.ok(parts.length >= 3);
  assert.ok(parts.every((part) => part.lines >= 200 && part.lines <= 2000));
});

test("explicit boundaries are used verbatim", () => {
  const text = `${Array.from({ length: 400 }, (_, index) => `line ${index + 1}`).join("\n")}\n`;
  const { parts } = planChunks(text, { boundaries: [1, 101, 301] });
  assert.deepEqual(
    parts.map((part) => [part.start, part.end, part.lines]),
    [
      [1, 100, 100],
      [101, 300, 200],
      [301, 400, 100],
    ],
  );
});

test("apply writes parts and a manifest, then deletes the original text", (t) => {
  const root = fixture(t);
  const source = `${twoChapters().join("\n")}\n`;
  write(root, "sources/test/book.txt", source);
  write(root, "sources/test/book.pdf", "%PDF-1.4\n");
  const result = applySplit({ root, subject: "test" });

  assert.equal(result.failed.length, 0);
  assert.equal(result.written.length, 1);
  assert.equal(existsSync(join(root, "sources/test/book.txt")), false);
  assert.equal(existsSync(join(root, "sources/test/book.pdf")), true);

  const manifest = JSON.parse(read(root, "sources/test/book.parts.json"));
  assert.equal(manifest.text, "sources/test/book.txt");
  assert.equal(manifest.total_lines, sourceStats(source).lines);
  assert.equal(manifest.parts.length, 3);
  assert.equal(manifest.parts[0].file, "book.1.part.txt");

  let covered = 0;
  for (const part of manifest.parts) {
    const content = read(root, `sources/test/${part.file}`);
    assert.equal(sourceStats(content).lines, part.lines);
    assert.equal(part.end - part.start + 1, part.lines);
    covered += part.lines;
  }
  assert.equal(covered, manifest.total_lines);
  assert.equal(manifest.parts[0].start, 1);
  assert.equal(manifest.parts.at(-1).end, manifest.total_lines);
});

test("apply refuses to overwrite an existing part and keeps the original", (t) => {
  const root = fixture(t);
  write(root, "sources/test/book.txt", `${twoChapters().join("\n")}\n`);
  write(root, "sources/test/book.1.part.txt", "already here\n");

  const result = applySplit({ root, subject: "test" });
  assert.equal(result.failed.length, 1);
  assert.equal(existsSync(join(root, "sources/test/book.txt")), true);
  assert.equal(read(root, "sources/test/book.1.part.txt"), "already here\n");
});

test("rerunning apply after success is a no-op", (t) => {
  const root = fixture(t);
  write(root, "sources/test/book.txt", `${twoChapters().join("\n")}\n`);
  applySplit({ root, subject: "test" });
  const manifest = read(root, "sources/test/book.parts.json");
  const part = read(root, "sources/test/book.1.part.txt");

  const result = applySplit({ root, subject: "test" });
  assert.equal(result.written.length, 0);
  assert.equal(result.failed.length, 0);
  assert.equal(read(root, "sources/test/book.parts.json"), manifest);
  assert.equal(read(root, "sources/test/book.1.part.txt"), part);
});

test("planSources reports every long source under the subject", (t) => {
  const root = fixture(t);
  write(root, "sources/test/book.txt", `${twoChapters().join("\n")}\n`);
  write(root, "sources/test/short.txt", "short\n");
  const plans = planSources({ root, subject: "test" });
  assert.equal(plans.length, 2);
  assert.equal(plans.filter((plan) => plan.long).length, 1);
});


test("a small chapter merges into the next chapter", () => {
  const lines = ["# PREFACE"];
  padTo(lines, 101, "preface");
  lines.push("Chapter 1. Big");
  padTo(lines, 902, "chapter one");
  lines.push("Chapter 2. Small");
  padTo(lines, 1003, "chapter two");
  lines.push("Chapter 3. Big");
  padTo(lines, 1804, "chapter three");

  const { parts } = planChunks(`${lines.join("\n")}\n`);
  assert.deepEqual(
    parts.map((part) => [part.start, part.end]),
    [
      [1, 902],
      [903, 1804],
    ],
  );
});

test("the dry-run table includes the first line of each chunk", (t) => {
  const root = fixture(t);
  write(root, "sources/test/book.txt", `${twoChapters().join("\n")}\n`);
  const table = renderTable(planSources({ root, subject: "test" }));
  assert.match(table, /first line/);
  assert.match(table, /Chapter 1\. First/);
  assert.match(table, /Chapter 2\. Second/);
});

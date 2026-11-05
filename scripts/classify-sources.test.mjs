import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { applyClassification, defaultRole, planClassification } from "./classify-sources.mjs";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "classify-sources-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "sources", "demo", "20261022"), { recursive: true });
  return root;
}

function write(root, relative, content = "") {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

test("default roles follow the source type", () => {
  assert.equal(defaultRole("lesson.srt"), "raw");
  assert.equal(defaultRole("lesson.vtt"), "raw");
  assert.equal(defaultRole("book.pdf"), "raw");
  assert.equal(defaultRole("book.parts.json"), "raw");
  assert.equal(defaultRole("book.txt"), "course");
  assert.equal(defaultRole("repo/src/index.ts"), "supplement");
  assert.equal(defaultRole("screenshot.png"), "supplement");
  assert.equal(defaultRole("resources"), "supplement");
});

test("dry run plans moves and leaves files in place", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/lesson.srt", "srt");
  write(root, "sources/demo/20261022/lesson.txt", "text");
  write(root, "sources/demo/20261022/book.pdf", "pdf");
  write(root, "sources/demo/20261022/resources/repo/index.ts", "code");
  const plan = planClassification({ root, subject: "demo" });
  assert.equal(plan.moves.length, 4);
  assert.equal(existsSync(join(root, "sources/demo/20261022/course/lesson.txt")), false);
  assert.equal(existsSync(join(root, "sources/demo/20261022/lesson.txt")), true);
});

test("apply moves files and directories into role folders", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/lesson.srt", "srt");
  write(root, "sources/demo/20261022/lesson.txt", "text");
  write(root, "sources/demo/20261022/lesson.parts.json", "{}");
  write(root, "sources/demo/20261022/resources/repo/index.ts", "code");
  const result = applyClassification({ root, subject: "demo" });
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  assert.equal(readFileSync(join(root, "sources/demo/20261022/raw/lesson.srt"), "utf8"), "srt");
  assert.equal(readFileSync(join(root, "sources/demo/20261022/course/lesson.txt"), "utf8"), "text");
  assert.equal(readFileSync(join(root, "sources/demo/20261022/raw/lesson.parts.json"), "utf8"), "{}");
  assert.equal(readFileSync(join(root, "sources/demo/20261022/supplement/resources/repo/index.ts"), "utf8"), "code");
});

test("a map overrides the default and moves text out of raw", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/raw/lesson.txt", "text");
  write(root, "sources/demo/20261022/lesson.srt", "srt");
  const result = applyClassification({
    root,
    subject: "demo",
    map: { "lesson.txt": "supplement", "lesson.srt": "raw" },
  });
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  assert.equal(readFileSync(join(root, "sources/demo/20261022/supplement/lesson.txt"), "utf8"), "text");
  assert.equal(readFileSync(join(root, "sources/demo/20261022/raw/lesson.srt"), "utf8"), "srt");
});

test("a collision is reported and nothing is overwritten", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/lesson.txt", "new");
  write(root, "sources/demo/20261022/course/lesson.txt", "old");
  const result = applyClassification({ root, subject: "demo" });
  assert.equal(result.failed.length, 1);
  assert.equal(readFileSync(join(root, "sources/demo/20261022/course/lesson.txt"), "utf8"), "old");
  assert.equal(readFileSync(join(root, "sources/demo/20261022/lesson.txt"), "utf8"), "new");
});

test("already classified folders are left alone", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/course/lesson.txt", "text");
  write(root, "sources/demo/20261022/raw/lesson.srt", "srt");
  const plan = planClassification({ root, subject: "demo" });
  assert.equal(plan.moves.length, 0);
});

test("a moved parts manifest records each part's role", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/book.1.part.txt", "chapter one\n");
  write(root, "sources/demo/20261022/book.2.part.txt", "appendix\n");
  write(
    root,
    "sources/demo/20261022/book.parts.json",
    JSON.stringify({ text: "sources/demo/20261022/book.txt", total_lines: 2, parts: [
      { part: 1, file: "book.1.part.txt", start: 1, end: 1, lines: 1 },
      { part: 2, file: "book.2.part.txt", start: 2, end: 2, lines: 1 },
    ] }),
  );
  const result = applyClassification({
    root,
    subject: "demo",
    map: { "book.1.part.txt": "course", "book.2.part.txt": "supplement", "book.parts.json": "raw" },
  });
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  const manifest = JSON.parse(readFileSync(join(root, "sources/demo/20261022/raw/book.parts.json"), "utf8"));
  assert.deepEqual(manifest.parts.map((part) => part.role), ["course", "supplement"]);
});

test("a manifest already in raw still learns its part roles", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/course/book.1.part.txt", "chapter\n");
  write(root, "sources/demo/20261022/supplement/book.2.part.txt", "appendix\n");
  write(
    root,
    "sources/demo/20261022/raw/book.parts.json",
    JSON.stringify({ text: "sources/demo/20261022/book.txt", total_lines: 2, parts: [
      { part: 1, file: "book.1.part.txt", start: 1, end: 1, lines: 1 },
      { part: 2, file: "book.2.part.txt", start: 2, end: 2, lines: 1 },
    ] }),
  );
  const result = applyClassification({ root, subject: "demo" });
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  const manifest = JSON.parse(readFileSync(join(root, "sources/demo/20261022/raw/book.parts.json"), "utf8"));
  assert.deepEqual(manifest.parts.map((part) => part.role), ["course", "supplement"]);
});

test("a directory that contains raw originals is split by file role", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/resources/book.pdf", "%PDF-1.4\n");
  write(root, "sources/demo/20261022/resources/notes.txt", "text\n");
  const result = applyClassification({ root, subject: "demo" });
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  assert.equal(readFileSync(join(root, "sources/demo/20261022/raw/resources/book.pdf"), "utf8"), "%PDF-1.4\n");
  assert.equal(readFileSync(join(root, "sources/demo/20261022/course/resources/notes.txt"), "utf8"), "text\n");
});

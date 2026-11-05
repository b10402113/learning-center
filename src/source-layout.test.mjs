import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  classifiedTextFor,
  courseCharacterCount,
  courseTextFiles,
  countCharacters,
  nodeBaseline,
  parseSourceRole,
} from "./source-layout.mjs";

test("role is read from the dated folder's child", () => {
  assert.equal(parseSourceRole("sources/demo/20261022/course/ch1.txt"), "course");
  assert.equal(parseSourceRole("sources/demo/20261022/supplement/repo/src/a.ts"), "supplement");
  assert.equal(parseSourceRole("sources/demo/20261022/raw/lesson.srt"), "raw");
  assert.equal(parseSourceRole("sources/demo/20261022/ch1.txt"), null);
  assert.equal(parseSourceRole("sources/demo/course/20261022/ch1.txt"), null);
});

test("characters ignore whitespace and count CJK code points once", () => {
  assert.equal(countCharacters(" a b\nc "), 3);
  assert.equal(countCharacters("課文"), 2);
  assert.equal(countCharacters("𠀀"), 1);
});

test("node baseline clamps to three and thirty", () => {
  assert.equal(nodeBaseline(0), 3);
  assert.equal(nodeBaseline(30000), 3);
  assert.equal(nodeBaseline(150000), 5);
  assert.equal(nodeBaseline(3000000), 30);
});

test("course text files are only .txt under course folders", (t) => {
  const root = mkdtempSync(join(tmpdir(), "source-layout-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const base = join(root, "sources", "demo", "20261022");
  mkdirSync(join(base, "course"), { recursive: true });
  mkdirSync(join(base, "supplement"), { recursive: true });
  mkdirSync(join(base, "raw"), { recursive: true });
  writeFileSync(join(base, "course", "ch1.txt"), "課文一");
  writeFileSync(join(base, "course", "ch1.1.part.txt"), "課文二");
  writeFileSync(join(base, "course", "notes.md"), "筆記");
  writeFileSync(join(base, "course", "lesson.srt"), "1\n00:00 --> 00:01\nhi\n");
  writeFileSync(join(base, "supplement", "extra.txt"), "補充");
  writeFileSync(join(base, "raw", "book.pdf"), "%PDF-1.4\n");

  const files = courseTextFiles(root, "demo").map((file) => file.split("/").at(-1)).sort();
  assert.deepEqual(files, ["ch1.1.part.txt", "ch1.txt", "notes.md"]);
  assert.equal(courseCharacterCount(root, "demo"), 8);
});

test("classifiedTextFor finds a text under course or supplement", (t) => {
  const root = mkdtempSync(join(tmpdir(), "source-layout-text-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const base = join(root, "sources", "demo", "20261022");
  mkdirSync(join(base, "raw"), { recursive: true });
  mkdirSync(join(base, "course"), { recursive: true });
  writeFileSync(join(base, "raw", "lesson.srt"), "1\n00:00 --> 00:01\nhi\n");
  writeFileSync(join(base, "course", "lesson.txt"), "hi\n");
  assert.equal(classifiedTextFor(join(base, "raw", "lesson.srt")), join(base, "course", "lesson.txt"));
});

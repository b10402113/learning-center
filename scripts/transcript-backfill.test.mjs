import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { backfillTranscripts, cuesToText } from "./transcript-backfill.mjs";

const SRT = `1
00:00:01,000 --> 00:00:03,000
Welcome to the course.

2
00:00:03,500 --> 00:00:06,000
Today we build an agent.

3
00:00:06,500 --> 00:00:09,000
It has tools and memory.
`;

const VTT = `WEBVTT

NOTE this note is not spoken

00:00:01.000 --> 00:00:03.000
Welcome to the course.

00:00:03.500 --> 00:00:06.000
Today we build an agent.
`;

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "transcript-backfill-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "sources", "demo", "20261022"), { recursive: true });
  return root;
}

function write(root, relative, content) {
  const path = join(root, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

test("cues become paragraphs without timestamps", () => {
  const text = cuesToText(SRT);
  assert.doesNotMatch(text, /-->/);
  assert.doesNotMatch(text, /00:00/);
  assert.match(text, /Welcome to the course\./);
  assert.match(text, /Today we build an agent\./);
  assert.doesNotMatch(text, /^\d+$/m);
});

test("vtt notes and headers are dropped", () => {
  const text = cuesToText(VTT);
  assert.doesNotMatch(text, /WEBVTT/);
  assert.doesNotMatch(text, /this note is not spoken/);
  assert.match(text, /Today we build an agent\./);
});

test("srt and vtt are written beside the subtitle", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/lesson.srt", SRT);
  write(root, "sources/demo/20261022/slides.vtt", VTT);
  const result = backfillTranscripts({ root, subject: "demo" });
  assert.equal(result.failed.length, 0, JSON.stringify(result.failed));
  assert.equal(result.written.length, 2);
  assert.match(readFileSync(join(root, "sources/demo/20261022/lesson.txt"), "utf8"), /Welcome/);
  assert.match(readFileSync(join(root, "sources/demo/20261022/slides.txt"), "utf8"), /agent/);
});

test("an existing transcript is not overwritten", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/lesson.srt", SRT);
  write(root, "sources/demo/20261022/lesson.txt", "keep me\n");
  const result = backfillTranscripts({ root, subject: "demo" });
  assert.equal(result.written.length, 0);
  assert.equal(result.skipped.length, 1);
  assert.equal(readFileSync(join(root, "sources/demo/20261022/lesson.txt"), "utf8"), "keep me\n");
});

test("a classified transcript under course is reused", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/raw/lesson.srt", SRT);
  write(root, "sources/demo/20261022/course/lesson.txt", "already classified\n");
  const result = backfillTranscripts({ root, subject: "demo" });
  assert.equal(result.written.length, 0);
  assert.equal(result.skipped.length, 1);
  assert.equal(existsSync(join(root, "sources/demo/20261022/raw/lesson.txt")), false);
});

test("dry run writes nothing", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/lesson.srt", SRT);
  const result = backfillTranscripts({ root, subject: "demo", dryRun: true });
  assert.equal(result.wouldWrite.length, 1);
  assert.equal(result.written.length, 0);
  assert.equal(existsSync(join(root, "sources/demo/20261022/lesson.txt")), false);
});

test("a classified part file is reused instead of writing a raw transcript", (t) => {
  const root = fixture(t);
  write(root, "sources/demo/20261022/raw/lesson.srt", SRT);
  write(root, "sources/demo/20261022/course/lesson.1.part.txt", "already split\n");
  const result = backfillTranscripts({ root, subject: "demo" });
  assert.equal(result.written.length, 0);
  assert.equal(result.skipped.length, 1);
  assert.equal(existsSync(join(root, "sources/demo/20261022/raw/lesson.txt")), false);
});

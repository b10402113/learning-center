import assert from "node:assert/strict";
import test from "node:test";
import { sortSubjects } from "./sort.mjs";

const subjects = [
  { id: "b", title: "Bravo", nodes: 3, steps: 9, updated: "2026-10-20" },
  { id: "a", title: "Alpha", nodes: 5, steps: 4, updated: "2026-10-27" },
  { id: "c", title: "Charlie", nodes: 3, steps: 12, updated: "2026-10-24" },
];

test("default keeps the generated order and does not mutate input", () => {
  const before = subjects.map((s) => s.id);
  assert.deepEqual(
    sortSubjects(subjects, "default").map((s) => s.id),
    ["b", "a", "c"]
  );
  assert.deepEqual(
    subjects.map((s) => s.id),
    before
  );
});

test("title sorts alphabetically", () => {
  assert.deepEqual(
    sortSubjects(subjects, "title").map((s) => s.id),
    ["a", "b", "c"]
  );
});

test("node and step sorts are descending with a title tie-break", () => {
  assert.deepEqual(
    sortSubjects(subjects, "nodes").map((s) => s.id),
    ["a", "b", "c"]
  );
  assert.deepEqual(
    sortSubjects(subjects, "steps").map((s) => s.id),
    ["c", "b", "a"]
  );
});

test("updated sorts newest first, with missing dates last", () => {
  assert.deepEqual(
    sortSubjects(subjects, "updated").map((s) => s.id),
    ["a", "c", "b"]
  );
  assert.deepEqual(
    sortSubjects(
      [{ id: "x", title: "X" }, { id: "y", title: "Y", updated: "2026-01-01" }],
      "updated"
    ).map((s) => s.id),
    ["y", "x"]
  );
});

test("unknown sort ids fall back to the generated order", () => {
  assert.deepEqual(
    sortSubjects(subjects, "nope").map((s) => s.id),
    ["b", "a", "c"]
  );
});

test("missing counts and titles do not throw", () => {
  assert.deepEqual(
    sortSubjects([{ id: "x" }, { id: "y", nodes: 1 }], "nodes").map(
      (s) => s.id
    ),
    ["y", "x"]
  );
});

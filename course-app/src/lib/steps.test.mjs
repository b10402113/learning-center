import assert from "node:assert/strict";
import test from "node:test";
import { stepNeighbors } from "./steps.mjs";

const STEPS = [{ id: "one" }, { id: "two" }, { id: "three" }];

test("first step has no previous and the correct next", () => {
  assert.deepEqual(stepNeighbors(STEPS, "one"), {
    previous: null,
    next: { id: "two" },
  });
});

test("middle step has both neighbors", () => {
  assert.deepEqual(stepNeighbors(STEPS, "two"), {
    previous: { id: "one" },
    next: { id: "three" },
  });
});

test("last step has no next", () => {
  assert.deepEqual(stepNeighbors(STEPS, "three"), {
    previous: { id: "two" },
    next: null,
  });
});

test("unknown step has no neighbors", () => {
  assert.deepEqual(stepNeighbors(STEPS, "missing"), {
    previous: null,
    next: null,
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  blockIndex,
  blockTypeFill,
  blockTypeInk,
  blockTypeLabel,
  blockTypeMark,
  railBlocks,
} from "./blocks.mjs";

const course = {
  blocks: [
    { id: "agent", title: "Agent", summary: "A", type: "concept" },
    {
      id: "tool",
      title: "Tool",
      summary: "T",
      type: "concept",
    },
    {
      id: "loop",
      title: "Loop",
      summary: "L",
      type: "procedure",
      prerequisites: ["agent"],
    },
  ],
};

test("indexes blocks by id", () => {
  assert.equal(blockIndex(course).get("tool").title, "Tool");
  assert.equal(blockIndex({}).size, 0);
});

test("labels the four block types and falls back to the raw type", () => {
  assert.equal(blockTypeLabel("concept"), "概念");
  assert.equal(blockTypeLabel("procedure"), "流程");
  assert.equal(blockTypeLabel("principle"), "原則");
  assert.equal(blockTypeLabel("contrast"), "對比");
  assert.equal(blockTypeLabel("custom"), "custom");
  assert.equal(blockTypeLabel(null), "概念");
});

test("gives every type a mark, a fill, and a legible ink", () => {
  for (const type of ["concept", "procedure", "principle", "contrast"]) {
    assert.ok(blockTypeMark(type));
    assert.match(blockTypeFill(type), /var\(--color-/);
    assert.match(blockTypeInk(type), /var\(--color-/);
  }
  assert.equal(blockTypeMark("custom"), "●");
  assert.equal(blockTypeFill("custom"), "var(--color-surface)");
  assert.equal(blockTypeInk("contrast"), "var(--color-paper)");
});

test("adds a prerequisite that the step does not cover and marks it", () => {
  const step = {
    blocks: [{ ...course.blocks[1], prerequisites: ["agent"] }],
  };
  assert.deepEqual(
    railBlocks(course, step).map((block) => ({
      id: block.id,
      prerequisite: block.prerequisite,
    })),
    [
      { id: "tool", prerequisite: false },
      { id: "agent", prerequisite: true },
    ]
  );
});

test("does not repeat a block and respects the rail limit", () => {
  const step = {
    blocks: [
      { ...course.blocks[1], prerequisites: ["agent", "loop"] },
      { ...course.blocks[0] },
    ],
  };
  assert.deepEqual(
    railBlocks(course, step).map((block) => block.id),
    ["tool", "agent", "loop"]
  );
  assert.deepEqual(
    railBlocks(course, step, 2).map((block) => block.id),
    ["tool", "agent"]
  );
});

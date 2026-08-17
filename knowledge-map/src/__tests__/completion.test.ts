import { describe, expect, it } from "vitest";
import {
  isStepComplete,
  nodeCompletion,
  type CompletionInput,
} from "../lib/completion";

function input(
  seeded: string[] = [],
  manual: string[] = [],
  cleared: string[] = [],
): CompletionInput {
  return {
    seeded: new Set(seeded),
    manual: new Set(manual),
    cleared: new Set(cleared),
  };
}

describe("isStepComplete", () => {
  it("is false when nothing marks the step", () => {
    expect(isStepComplete("p1/s1", input())).toBe(false);
  });

  it("is true for a step in the generate-time seed set", () => {
    expect(isStepComplete("p1/s1", input(["p1/s1"]))).toBe(true);
  });

  it("is true for a step the learner manually marked complete", () => {
    expect(isStepComplete("p1/s1", input([], ["p1/s1"]))).toBe(true);
  });

  it("is true when the step is both seeded and manually marked", () => {
    expect(isStepComplete("p1/s1", input(["p1/s1"], ["p1/s1"]))).toBe(true);
  });

  it("clears a seeded step when the learner manually cleared it", () => {
    expect(isStepComplete("p1/s1", input(["p1/s1"], [], ["p1/s1"]))).toBe(false);
  });

  it("manual marking wins over a cleared seed", () => {
    expect(isStepComplete("p1/s1", input(["p1/s1"], ["p1/s1"], ["p1/s1"]))).toBe(true);
  });

  it("ignores other steps' seeds, manual marks, and clears", () => {
    expect(isStepComplete("p1/s2", input(["p1/s1"], ["p1/s1"], ["p1/s1"]))).toBe(false);
  });
});

describe("nodeCompletion", () => {
  it("is true when every step in the DAG is complete", () => {
    expect(nodeCompletion(["p1/s1", "p1/s2"], input(["p1/s1"], ["p1/s2"]))).toBe(true);
  });

  it("is false when any single step is incomplete", () => {
    expect(nodeCompletion(["p1/s1", "p1/s2"], input(["p1/s1"]))).toBe(false);
    expect(nodeCompletion(["p1/s1", "p1/s2"], input(["p1/s2"]))).toBe(false);
  });

  it("is false when a seeded step was manually cleared", () => {
    expect(
      nodeCompletion(["p1/s1", "p1/s2"], input(["p1/s1", "p1/s2"], [], ["p1/s1"])),
    ).toBe(false);
  });

  it("is never complete for a node with no steps (legacy unsupported)", () => {
    expect(nodeCompletion([], input(["p1/s1"]))).toBe(false);
  });

  it("element ids no longer participate in node completion", () => {
    // A node-qualified step id is required; an element id ("n1") in the manual
    // set can never satisfy a step of this node.
    expect(nodeCompletion(["p1/s1"], input([], ["n1", "p1"]))).toBe(false);
  });

  it("treats step ids by their node-qualified address", () => {
    expect(nodeCompletion(["p1/s1"], input(["p2/s1"]))).toBe(false);
  });
});
import { describe, expect, it } from "vitest";
import {
  isStepComplete,
  nodeCompletion,
  stepsOfNode,
  toggleStep,
  type CompletionInput,
} from "../lib/completion";
import type { Step } from "../lib/types";

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

describe("toggleStep", () => {
  it("marks an uncompleted step complete (manual wins over nothing)", () => {
    expect(toggleStep("p1/s1", input())).toEqual({ steps: ["p1/s1"], cleared: [] });
  });

  it("un-marks a manually marked step", () => {
    expect(toggleStep("p1/s1", input([], ["p1/s1"]))).toEqual({ steps: [], cleared: [] });
  });

  it("clears a seeded step instead of leaving it stuck complete", () => {
    expect(toggleStep("p1/s1", input(["p1/s1"]))).toEqual({ steps: [], cleared: ["p1/s1"] });
  });

  it("re-marks a cleared seeded step (manual beats the clear)", () => {
    const first = toggleStep("p1/s1", input(["p1/s1"]));
    const second = toggleStep(
      "p1/s1",
      input(["p1/s1"], [...first.steps], [...first.cleared]),
    );
    expect(second).toEqual({ steps: ["p1/s1"], cleared: [] });
  });

  it("leaves other steps' state untouched", () => {
    expect(toggleStep("p1/s2", input(["p1/s1"]))).toEqual({
      steps: ["p1/s2"],
      cleared: [],
    });
  });
});

describe("stepsOfNode", () => {
  const steps: Record<string, Step> = {
    "p1/b": { id: "p1/b", stepId: "b", nodeId: "p1", title: "B", order: 2, deps: [], teaches: [], sources: [] },
    "p2/a": { id: "p2/a", stepId: "a", nodeId: "p2", title: "A", order: 1, deps: [], teaches: [], sources: [] },
    "p1/a": { id: "p1/a", stepId: "a", nodeId: "p1", title: "A", order: 1, deps: [], teaches: [], sources: [] },
  };

  it("returns a node's steps in reading order", () => {
    expect(stepsOfNode(steps, "p1").map((s) => s.id)).toEqual(["p1/a", "p1/b"]);
  });

  it("returns [] for a node with no steps", () => {
    expect(stepsOfNode(steps, "p3")).toEqual([]);
  });
});

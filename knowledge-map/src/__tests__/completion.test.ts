import { describe, expect, it } from "vitest";
import { isNodeComplete, nodeItems } from "../lib/completion";

function node(id: string, taughtElementIds: string[] = []): { id: string; taughtElementIds: string[] } {
  return { id, taughtElementIds };
}

describe("nodeItems", () => {
  it("returns taught elements in taughtElementIds order followed by the main item", () => {
    expect(nodeItems(node("p1", ["n1", "n2", "n3"]))).toEqual([
      { kind: "element", id: "n1" },
      { kind: "element", id: "n2" },
      { kind: "element", id: "n3" },
      { kind: "main", id: "p1" },
    ]);
  });

  it("returns only the main item for a node with no elements", () => {
    expect(nodeItems(node("p1"))).toEqual([{ kind: "main", id: "p1" }]);
  });
});

describe("isNodeComplete", () => {
  it("is true when every checklist item is in the manual completion set", () => {
    const n = node("p1", ["n1", "n2"]);
    expect(isNodeComplete(n, new Set(["n1", "n2", "p1"]))).toBe(true);
  });

  it("is false when any element is missing from the completion set", () => {
    const n = node("p1", ["n1", "n2"]);
    expect(isNodeComplete(n, new Set(["n1", "p1"]))).toBe(false);
  });

  it("is false when the main item is unchecked", () => {
    const n = node("p1", ["n1", "n2"]);
    expect(isNodeComplete(n, new Set(["n1", "n2"]))).toBe(false);
  });

  it("is false when nothing is completed", () => {
    expect(isNodeComplete(node("p1", ["n1"]), new Set())).toBe(false);
  });

  it("requires only the main item for a node with no elements", () => {
    expect(isNodeComplete(node("p1"), new Set())).toBe(false);
    expect(isNodeComplete(node("p1"), new Set(["p1"]))).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { emptySubjectProgress, parseProgress, type ProgressRecord } from "../lib/progress";
import { tierIsUnlocked } from "../lib/selectors";
import type { PathNode, PathStatus, SubjectGraph } from "../lib/types";

function path(id: string, tier: number, status: PathStatus = "draft"): PathNode {
  return {
    id,
    title: id.toUpperCase(),
    tier,
    order: Number(id.slice(1)),
    duration: "",
    goal: "",
    status,
    taughtNodeIds: [],
    relatedNodeIds: [],
    contentHtml: "",
    fullArticleHtml: "",
    sources: [],
  };
}

function makeGraph(): SubjectGraph {
  return {
    subject: "fixture",
    tiers: [
      { tier: 1, title: "T1", pathIds: ["p1", "p2"] },
      { tier: 2, title: "T2", pathIds: ["p3"] },
      { tier: 3, title: "T3", pathIds: ["p4"] },
    ],
    paths: [path("p1", 1, "content-written"), path("p2", 1), path("p3", 2), path("p4", 3)],
    nodes: {
      n1: { id: "n1", title: "N1", tier: 1, order: 1, taughtBy: ["p1"], sources: [], bodyHtml: "", connections: [] },
      n2: { id: "n2", title: "N2", tier: 1, order: 2, taughtBy: [], sources: [], bodyHtml: "", connections: [] },
      n3: { id: "n3", title: "N3", tier: 2, order: 1, taughtBy: ["p3"], sources: [], bodyHtml: "", connections: [] },
    },
    edges: [],
  };
}

describe("parseProgress", () => {
  it("migrates a legacy array-per-subject shape into paths with empty nodes and tiers", () => {
    const raw = JSON.stringify({ fixture: ["p1", "p2"], other: [] });
    const record = parseProgress(raw);
    expect(record.fixture).toEqual({ paths: ["p1", "p2"], nodes: [], tiers: [] });
    expect(record.other).toEqual({ paths: [], nodes: [], tiers: [] });
  });

  it("preserves completed paths when upgrading old data", () => {
    const raw = JSON.stringify({ fixture: ["p1", "p2"] });
    expect(parseProgress(raw).fixture.paths).toEqual(["p1", "p2"]);
  });

  it("round-trips the three-level shape through parseProgress", () => {
    const record: ProgressRecord = {
      fixture: { paths: ["p1"], nodes: ["n1", "n2"], tiers: ["1"] },
    };
    expect(parseProgress(JSON.stringify(record))).toEqual(record);
  });

  it("filters non-string values out of arrays", () => {
    const raw = JSON.stringify({ fixture: ["p1", 42, null, true] });
    expect(parseProgress(raw).fixture.paths).toEqual(["p1"]);
  });

  it("drops subjects whose value is neither an array nor an object", () => {
    const raw = JSON.stringify({ fixture: 42, other: "nope" });
    expect(parseProgress(raw)).toEqual({});
  });

  it("returns {} for malformed or non-object input", () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress("not json")).toEqual({});
    expect(parseProgress('[1,2,3]')).toEqual({});
    expect(parseProgress("{}")).toEqual({});
  });

  it("emptySubjectProgress is safe to spread and starts empty", () => {
    expect(emptySubjectProgress()).toEqual({ paths: [], nodes: [], tiers: [] });
  });
});

describe("tierIsUnlocked", () => {
  it("always unlocks tier 1, the entrance floor", () => {
    const progress = emptySubjectProgress();
    expect(tierIsUnlocked(makeGraph(), 1, progress)).toBe(true);
    expect(tierIsUnlocked(makeGraph(), 0, progress)).toBe(true);
  });

  it("locks a higher tier until the previous tier's boss is beaten", () => {
    const graph = makeGraph();
    const charted = { paths: ["p2"], nodes: [], tiers: [] };
    expect(tierIsUnlocked(graph, 2, charted)).toBe(false);
    expect(tierIsUnlocked(graph, 2, { ...charted, tiers: ["1"] })).toBe(true);
  });

  it("counts auto-written paths as charted without a manual mark", () => {
    const graph = makeGraph();
    // p1 is content-written (auto-charted), p2 is draft — so p2 must be manual
    expect(tierIsUnlocked(graph, 2, { paths: [], nodes: [], tiers: ["1"] })).toBe(false);
    expect(tierIsUnlocked(graph, 2, { paths: ["p2"], nodes: [], tiers: ["1"] })).toBe(true);
  });

  it("requires the previous tier's paths to all be charted before unlocking", () => {
    const graph = makeGraph();
    // p1 is auto-charted; p2 (draft) is missing
    expect(tierIsUnlocked(graph, 2, { paths: ["p1"], nodes: [], tiers: ["1"] })).toBe(false);
  });

  it("respects a pathsThreshold below 1", () => {
    const graph: SubjectGraph = {
      ...makeGraph(),
      tiers: [
        { tier: 1, title: "T1", pathIds: ["p1", "p2", "p3", "p4"] },
        { tier: 2, title: "T2", pathIds: ["p5"] },
      ],
      paths: [path("p1", 1), path("p2", 1), path("p3", 1), path("p4", 1), path("p5", 2)],
    };
    const partial = { paths: ["p1", "p2", "p3"], nodes: [], tiers: ["1"] };
    expect(tierIsUnlocked(graph, 2, partial)).toBe(false);
    expect(tierIsUnlocked(graph, 2, partial, { pathsThreshold: 0.5 })).toBe(true);
  });

  it("does not enforce node coverage by default", () => {
    const graph = makeGraph();
    const base = { paths: ["p2"], nodes: [], tiers: ["1"] };
    expect(tierIsUnlocked(graph, 2, base)).toBe(true);
  });

  it("enforces node coverage when nodesThreshold is set", () => {
    const graph = makeGraph();
    const base = { paths: ["p2"], nodes: [], tiers: ["1"] };
    expect(tierIsUnlocked(graph, 2, base, { nodesThreshold: 1 })).toBe(false);
    expect(
      tierIsUnlocked(graph, 2, { ...base, nodes: ["n1", "n2"] }, { nodesThreshold: 1 }),
    ).toBe(true);
  });

  it("respects a nodesThreshold below 1", () => {
    const graph = makeGraph();
    const base = { paths: ["p2"], nodes: ["n1"], tiers: ["1"] };
    expect(tierIsUnlocked(graph, 2, base, { nodesThreshold: 0.5 })).toBe(true);
    expect(tierIsUnlocked(graph, 2, base, { nodesThreshold: 0.6 })).toBe(false);
  });

  it("unlocks tier 3 only after tier 2 is unlocked (cascade)", () => {
    const graph = makeGraph();
    const full = { paths: ["p1", "p2", "p3"], nodes: [], tiers: ["2"] };
    expect(tierIsUnlocked(graph, 3, full)).toBe(false);
    expect(tierIsUnlocked(graph, 3, { ...full, tiers: ["1", "2"] })).toBe(true);
  });

  it("returns false when the previous tier does not exist in the graph", () => {
    const graph = makeGraph();
    const progress = { paths: ["p2"], nodes: [], tiers: ["1"] };
    expect(tierIsUnlocked(graph, 99, progress)).toBe(false);
  });
});

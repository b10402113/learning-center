import { describe, expect, it } from "vitest";
import { emptySubjectProgress, parseProgress, type ProgressRecord } from "../lib/progress";

describe("parseProgress", () => {
  it("round-trips the new elements-only shape", () => {
    const record: ProgressRecord = { fixture: { elements: ["n1", "n2"] } };
    expect(parseProgress(JSON.stringify(record))).toEqual(record);
  });

  it("migrates legacy pre-rename data (paths/nodes/tiers) by taking node completions as elements", () => {
    const raw = JSON.stringify({
      fixture: { paths: ["p1", "p2"], nodes: ["n1", "n2"], tiers: ["1", "2"] },
      other: { paths: ["p3"], nodes: [], tiers: [] },
    });
    const record = parseProgress(raw);
    expect(record.fixture).toEqual({ elements: ["n1", "n2"] });
    expect(record.other).toEqual({ elements: [] });
  });

  it("migrates a transitional three-column object by preferring the elements field", () => {
    const raw = JSON.stringify({
      fixture: { nodes: ["p1"], elements: ["n3"], tiers: ["1"] },
    });
    expect(parseProgress(raw).fixture).toEqual({ elements: ["n3"] });
  });

  it("preserves element completions when upgrading old data", () => {
    const raw = JSON.stringify({
      fixture: { paths: ["p1"], nodes: ["n1", "n2"], tiers: ["1"] },
    });
    expect(parseProgress(raw).fixture.elements).toEqual(["n1", "n2"]);
  });

  it("does not turn old path or tier marks into element completions", () => {
    const raw = JSON.stringify({
      fixture: { paths: ["p1"], nodes: [], tiers: ["1", "2"] },
    });
    expect(parseProgress(raw).fixture).toEqual({ elements: [] });
  });

  it("migrates a legacy bare-array subject (path ids) into empty elements", () => {
    const raw = JSON.stringify({ fixture: ["p1", "p2"] });
    expect(parseProgress(raw).fixture).toEqual({ elements: [] });
  });

  it("filters non-string values out of the elements array", () => {
    const raw = JSON.stringify({ fixture: { elements: ["n1", 42, null, true] } });
    expect(parseProgress(raw).fixture.elements).toEqual(["n1"]);
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
    expect(emptySubjectProgress()).toEqual({ elements: [] });
  });
});

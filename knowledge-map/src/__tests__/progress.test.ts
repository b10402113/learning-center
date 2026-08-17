import { describe, expect, it } from "vitest";
import { emptySubjectProgress, parseProgress, type ProgressRecord } from "../lib/progress";

describe("parseProgress", () => {
  it("round-trips the current steps/cleared shape", () => {
    const record: ProgressRecord = {
      fixture: { steps: ["p1/s1", "p2/s2"], cleared: ["p1/s3"] },
    };
    expect(parseProgress(JSON.stringify(record))).toEqual(record);
  });

  it("defaults missing cleared to empty on the current shape", () => {
    const raw = JSON.stringify({ fixture: { steps: ["p1/s1"] } });
    expect(parseProgress(raw).fixture).toEqual({ steps: ["p1/s1"], cleared: [] });
  });

  it("migrates legacy element completions by keeping only node-qualified step ids", () => {
    const raw = JSON.stringify({
      fixture: { elements: ["p1/s1", "n1", "p2"] },
      other: { nodes: ["p1/s2", "goal-hierarchy"] },
    });
    const record = parseProgress(raw);
    // Legacy element/node ids drop away (ADR-0005); step ids survive.
    expect(record.fixture).toEqual({ steps: ["p1/s1"], cleared: [] });
    expect(record.other).toEqual({ steps: ["p1/s2"], cleared: [] });
  });

  it("drops a legacy subject whose completions are all element/node ids", () => {
    const raw = JSON.stringify({
      fixture: { elements: ["n1", "n2"] },
    });
    expect(parseProgress(raw).fixture).toEqual({ steps: [], cleared: [] });
  });

  it("migrates a transitional three-column object by preferring the elements field", () => {
    const raw = JSON.stringify({
      fixture: { nodes: ["p1"], elements: ["p1/s3"], tiers: ["1"] },
    });
    expect(parseProgress(raw).fixture).toEqual({ steps: ["p1/s3"], cleared: [] });
  });

  it("migrates a legacy bare-array subject (path ids) into empty step progress", () => {
    const raw = JSON.stringify({ fixture: ["p1", "p2"] });
    expect(parseProgress(raw).fixture).toEqual({ steps: [], cleared: [] });
  });

  it("filters non-string values out of steps and cleared", () => {
    const raw = JSON.stringify({
      fixture: { steps: ["p1/s1", 42, null, true], cleared: ["p1/s2", 7] },
    });
    expect(parseProgress(raw).fixture).toEqual({
      steps: ["p1/s1"],
      cleared: ["p1/s2"],
    });
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
    expect(emptySubjectProgress()).toEqual({ steps: [], cleared: [] });
  });
});

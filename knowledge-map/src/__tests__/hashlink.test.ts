import { describe, expect, it } from "vitest";
import { buildElementHash, buildHash, parseHash } from "../lib/hashlink";

describe("parseHash — map route", () => {
  it("parses subject + node from a hash deep-link", () => {
    expect(parseHash("#s=ai-agents-in-action&p=what-is-an-agent")).toEqual({
      kind: "map",
      subject: "ai-agents-in-action",
      nodeId: "what-is-an-agent",
    });
  });

  it("accepts a hash with or without the leading #", () => {
    expect(parseHash("s=ai-agents-in-action&p=what-is-an-agent")).toEqual({
      kind: "map",
      subject: "ai-agents-in-action",
      nodeId: "what-is-an-agent",
    });
  });

  it("parses a subject-only hash with no node", () => {
    expect(parseHash("#s=ai-agents-in-action")).toEqual({
      kind: "map",
      subject: "ai-agents-in-action",
      nodeId: null,
    });
  });

  it("parses a node-only hash with no subject", () => {
    expect(parseHash("#p=what-is-an-agent")).toEqual({
      kind: "map",
      subject: null,
      nodeId: "what-is-an-agent",
    });
  });

  it("returns an empty map route for an empty hash", () => {
    expect(parseHash("")).toEqual({ kind: "map", subject: null, nodeId: null });
    expect(parseHash("#")).toEqual({ kind: "map", subject: null, nodeId: null });
  });
});

describe("parseHash — element route", () => {
  it("parses the path-style element deep-link", () => {
    expect(parseHash("#/elements/muscle-ladder/goal-hierarchy")).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
    });
  });

  it("accepts the element route without a leading slash", () => {
    expect(parseHash("#elements/muscle-ladder/goal-hierarchy")).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
    });
  });

  it("falls back to the map route when the slug is missing", () => {
    expect(parseHash("#/elements/muscle-ladder")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
    expect(parseHash("#/elements/")).toEqual({ kind: "map", subject: null, nodeId: null });
  });

  it("decodes URL-encoded subject and slug characters", () => {
    expect(parseHash("#/elements/a%20b/slug%26x")).toEqual({
      kind: "element",
      subject: "a b",
      elementId: "slug&x",
    });
  });

  it("falls back to the map route on malformed percent-encoding instead of throwing", () => {
    expect(parseHash("#/elements/%E0%A4%A/foo")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
    expect(parseHash("#/elements/%ZZ/foo")).toEqual({ kind: "map", subject: null, nodeId: null });
  });
});

describe("buildHash", () => {
  it("builds the canonical #s=<subject>&p=<node-id> deep-link", () => {
    expect(buildHash("ai-agents-in-action", "what-is-an-agent")).toBe(
      "#s=ai-agents-in-action&p=what-is-an-agent",
    );
  });

  it("omits p when nothing is selected so a subject-only view stays shareable", () => {
    expect(buildHash("ai-agents-in-action", null)).toBe("#s=ai-agents-in-action");
  });

  it("round-trips through parseHash for both selected and unselected states", () => {
    expect(parseHash(buildHash("ai-agents-in-action", "what-is-an-agent"))).toEqual({
      kind: "map",
      subject: "ai-agents-in-action",
      nodeId: "what-is-an-agent",
    });
    expect(parseHash(buildHash("ai-agents-in-action", null))).toEqual({
      kind: "map",
      subject: "ai-agents-in-action",
      nodeId: null,
    });
  });

  it("URL-encodes characters that cannot live in a hash verbatim", () => {
    const hash = buildHash("a b", "p&x");
    expect(hash).toBe("#s=a+b&p=p%26x");
    expect(parseHash(hash)).toEqual({ kind: "map", subject: "a b", nodeId: "p&x" });
  });
});

describe("buildElementHash", () => {
  it("builds the canonical #/elements/<subject>/<slug> deep-link", () => {
    expect(buildElementHash("muscle-ladder", "goal-hierarchy")).toBe(
      "#/elements/muscle-ladder/goal-hierarchy",
    );
  });

  it("round-trips through parseHash", () => {
    expect(parseHash(buildElementHash("muscle-ladder", "goal-hierarchy"))).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
    });
  });

  it("URL-encodes characters that cannot live in a path verbatim", () => {
    const hash = buildElementHash("a b", "slug&x");
    expect(hash).toBe("#/elements/a%20b/slug%26x");
    expect(parseHash(hash)).toEqual({
      kind: "element",
      subject: "a b",
      elementId: "slug&x",
    });
  });
});

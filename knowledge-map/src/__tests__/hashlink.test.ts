import { describe, expect, it } from "vitest";
import { buildHash, parseHash } from "../lib/hashlink";

describe("parseHash", () => {
  it("parses subject + node from a hash deep-link", () => {
    expect(parseHash("#s=ai-agents-in-action&p=what-is-an-agent")).toEqual({
      subject: "ai-agents-in-action",
      nodeId: "what-is-an-agent",
    });
  });

  it("accepts a hash with or without the leading #", () => {
    expect(parseHash("s=ai-agents-in-action&p=what-is-an-agent")).toEqual({
      subject: "ai-agents-in-action",
      nodeId: "what-is-an-agent",
    });
  });

  it("parses a subject-only hash with no node", () => {
    expect(parseHash("#s=ai-agents-in-action")).toEqual({
      subject: "ai-agents-in-action",
      nodeId: null,
    });
  });

  it("parses a node-only hash with no subject", () => {
    expect(parseHash("#p=what-is-an-agent")).toEqual({
      subject: null,
      nodeId: "what-is-an-agent",
    });
  });

  it("returns nulls for an empty hash", () => {
    expect(parseHash("")).toEqual({ subject: null, nodeId: null });
    expect(parseHash("#")).toEqual({ subject: null, nodeId: null });
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
      subject: "ai-agents-in-action",
      nodeId: "what-is-an-agent",
    });
    expect(parseHash(buildHash("ai-agents-in-action", null))).toEqual({
      subject: "ai-agents-in-action",
      nodeId: null,
    });
  });

  it("URL-encodes characters that cannot live in a hash verbatim", () => {
    const hash = buildHash("a b", "p&x");
    expect(hash).toBe("#s=a+b&p=p%26x");
    expect(parseHash(hash)).toEqual({ subject: "a b", nodeId: "p&x" });
  });
});

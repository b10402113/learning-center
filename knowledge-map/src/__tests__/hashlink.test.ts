import { describe, expect, it } from "vitest";
import {
  buildElementHash,
  buildHash,
  buildNodeHash,
  buildStepHash,
  parseHash,
  resolveElementSource,
} from "../lib/hashlink";

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

describe("parseHash — node route", () => {
  it("parses the path-style lesson deep-link", () => {
    expect(parseHash("#/nodes/muscle-ladder/lifting-technique")).toEqual({
      kind: "node",
      subject: "muscle-ladder",
      nodeId: "lifting-technique",
    });
  });

  it("accepts the node route without a leading slash", () => {
    expect(parseHash("#nodes/muscle-ladder/lifting-technique")).toEqual({
      kind: "node",
      subject: "muscle-ladder",
      nodeId: "lifting-technique",
    });
  });

  it("falls back to the map route when the slug is missing", () => {
    expect(parseHash("#/nodes/muscle-ladder")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
    expect(parseHash("#/nodes/")).toEqual({ kind: "map", subject: null, nodeId: null });
  });

  it("decodes URL-encoded subject and slug characters", () => {
    expect(parseHash("#/nodes/a%20b/slug%26x")).toEqual({
      kind: "node",
      subject: "a b",
      nodeId: "slug&x",
    });
  });

  it("falls back to the map route on malformed percent-encoding instead of throwing", () => {
    expect(parseHash("#/nodes/%E0%A4%A/foo")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
    expect(parseHash("#/nodes/%ZZ/foo")).toEqual({ kind: "map", subject: null, nodeId: null });
  });
});

describe("parseHash — element route", () => {
  it("parses the path-style element deep-link with no origin", () => {
    expect(parseHash("#/elements/muscle-ladder/goal-hierarchy")).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
      from: null,
    });
  });

  it("accepts the element route without a leading slash", () => {
    expect(parseHash("#elements/muscle-ladder/goal-hierarchy")).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
      from: null,
    });
  });

  it("parses a ?from origin onto the element route", () => {
    expect(
      parseHash("#/elements/muscle-ladder/goal-hierarchy?from=muscle-ladder-and-handrails"),
    ).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
      from: "muscle-ladder-and-handrails",
    });
  });

  it("decodes a URL-encoded ?from origin", () => {
    expect(parseHash("#/elements/muscle-ladder/goal-hierarchy?from=a%20b")).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
      from: "a b",
    });
  });

  it("ignores an empty ?from and reports no origin", () => {
    expect(parseHash("#/elements/muscle-ladder/goal-hierarchy?from=")).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
      from: null,
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
      from: null,
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

describe("parseHash — step route", () => {
  it("parses the path-style step deep-link", () => {
    expect(parseHash("#/steps/muscle-ladder/lifting-technique/grip-variants")).toEqual({
      kind: "step",
      subject: "muscle-ladder",
      nodeId: "lifting-technique",
      stepId: "grip-variants",
    });
  });

  it("accepts the step route without a leading slash", () => {
    expect(parseHash("#steps/muscle-ladder/lifting-technique/grip-variants")).toEqual({
      kind: "step",
      subject: "muscle-ladder",
      nodeId: "lifting-technique",
      stepId: "grip-variants",
    });
  });

  it("falls back to the map route when any segment is missing", () => {
    expect(parseHash("#/steps/muscle-ladder/lifting-technique")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
    expect(parseHash("#/steps/muscle-ladder")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
    expect(parseHash("#/steps/")).toEqual({ kind: "map", subject: null, nodeId: null });
    expect(parseHash("#/steps")).toEqual({ kind: "map", subject: null, nodeId: null });
  });

  it("decodes URL-encoded subject, node, and step characters", () => {
    expect(parseHash("#/steps/a%20b/slug%26x/step%2Fy")).toEqual({
      kind: "step",
      subject: "a b",
      nodeId: "slug&x",
      stepId: "step/y",
    });
  });

  it("falls back to the map route on malformed percent-encoding instead of throwing", () => {
    expect(parseHash("#/steps/%E0%A4%A/foo/bar")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
    expect(parseHash("#/steps/foo/%ZZ/bar")).toEqual({
      kind: "map",
      subject: null,
      nodeId: null,
    });
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

describe("buildNodeHash", () => {
  it("builds the canonical #/nodes/<subject>/<slug> deep-link", () => {
    expect(buildNodeHash("muscle-ladder", "lifting-technique")).toBe(
      "#/nodes/muscle-ladder/lifting-technique",
    );
  });

  it("round-trips through parseHash", () => {
    expect(parseHash(buildNodeHash("muscle-ladder", "lifting-technique"))).toEqual({
      kind: "node",
      subject: "muscle-ladder",
      nodeId: "lifting-technique",
    });
  });

  it("URL-encodes characters that cannot live in a path verbatim", () => {
    const hash = buildNodeHash("a b", "slug&x");
    expect(hash).toBe("#/nodes/a%20b/slug%26x");
    expect(parseHash(hash)).toEqual({
      kind: "node",
      subject: "a b",
      nodeId: "slug&x",
    });
  });
});

describe("buildStepHash", () => {
  it("builds the canonical #/steps/<subject>/<node>/<step> deep-link", () => {
    expect(buildStepHash("muscle-ladder", "lifting-technique", "grip-variants")).toBe(
      "#/steps/muscle-ladder/lifting-technique/grip-variants",
    );
  });

  it("round-trips through parseHash", () => {
    expect(parseHash(buildStepHash("muscle-ladder", "lifting-technique", "grip-variants"))).toEqual({
      kind: "step",
      subject: "muscle-ladder",
      nodeId: "lifting-technique",
      stepId: "grip-variants",
    });
  });

  it("URL-encodes characters that cannot live in a path verbatim", () => {
    const hash = buildStepHash("a b", "slug&x", "step/y");
    expect(hash).toBe("#/steps/a%20b/slug%26x/step%2Fy");
    expect(parseHash(hash)).toEqual({
      kind: "step",
      subject: "a b",
      nodeId: "slug&x",
      stepId: "step/y",
    });
  });
});

describe("buildElementHash", () => {
  it("builds the canonical #/elements/<subject>/<slug> deep-link without an origin", () => {
    expect(buildElementHash("muscle-ladder", "goal-hierarchy")).toBe(
      "#/elements/muscle-ladder/goal-hierarchy",
    );
  });

  it("appends a ?from origin when one is given", () => {
    expect(buildElementHash("muscle-ladder", "goal-hierarchy", "muscle-ladder-and-handrails")).toBe(
      "#/elements/muscle-ladder/goal-hierarchy?from=muscle-ladder-and-handrails",
    );
  });

  it("omits the query when from is null or empty", () => {
    expect(buildElementHash("muscle-ladder", "goal-hierarchy", null)).toBe(
      "#/elements/muscle-ladder/goal-hierarchy",
    );
    expect(buildElementHash("muscle-ladder", "goal-hierarchy", "")).toBe(
      "#/elements/muscle-ladder/goal-hierarchy",
    );
  });

  it("round-trips through parseHash with and without an origin", () => {
    expect(parseHash(buildElementHash("muscle-ladder", "goal-hierarchy"))).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
      from: null,
    });
    expect(
      parseHash(buildElementHash("muscle-ladder", "goal-hierarchy", "muscle-ladder-and-handrails")),
    ).toEqual({
      kind: "element",
      subject: "muscle-ladder",
      elementId: "goal-hierarchy",
      from: "muscle-ladder-and-handrails",
    });
  });

  it("URL-encodes characters that cannot live in a path verbatim", () => {
    const hash = buildElementHash("a b", "slug&x");
    expect(hash).toBe("#/elements/a%20b/slug%26x");
    expect(parseHash(hash)).toEqual({
      kind: "element",
      subject: "a b",
      elementId: "slug&x",
      from: null,
    });
  });

  it("URL-encodes a from origin with special characters and round-trips", () => {
    const hash = buildElementHash("a b", "slug&x", "node y&z");
    expect(hash).toBe("#/elements/a%20b/slug%26x?from=node%20y%26z");
    expect(parseHash(hash)).toEqual({
      kind: "element",
      subject: "a b",
      elementId: "slug&x",
      from: "node y&z",
    });
  });
});

describe("resolveElementSource", () => {
  const knownNodes = new Set(["muscle-ladder-and-handrails", "lifting-technique"]);
  const knownSteps = new Set([
    "muscle-ladder-and-handrails/muscle-rosettes",
    "muscle-ladder-and-handrails/barbell-bracing",
    "lifting-technique/grip-variants",
  ]);

  it("prefers the explicit from origin when it names a real node", () => {
    expect(
      resolveElementSource(
        "muscle-ladder-and-handrails",
        ["lifting-technique/grip-variants"],
        knownSteps,
        knownNodes,
      ),
    ).toBe("muscle-ladder-and-handrails");
  });

  it("falls back to the first teaching step's node when from is absent", () => {
    expect(
      resolveElementSource(
        null,
        ["muscle-ladder-and-handrails/muscle-rosettes", "lifting-technique/grip-variants"],
        knownSteps,
        knownNodes,
      ),
    ).toBe("muscle-ladder-and-handrails");
  });

  it("falls back to the first teaching step's node when from names a missing node", () => {
    expect(
      resolveElementSource(
        "ghost-node",
        ["lifting-technique/grip-variants", "muscle-ladder-and-handrails/muscle-rosettes"],
        knownSteps,
        knownNodes,
      ),
    ).toBe("lifting-technique");
  });

  it("skips teaching steps that do not resolve to a known step", () => {
    expect(
      resolveElementSource(
        null,
        ["ghost-node/ghost-step", "muscle-ladder-and-handrails/barbell-bracing"],
        knownSteps,
        knownNodes,
      ),
    ).toBe("muscle-ladder-and-handrails");
  });

  it("returns null when no teaching step's node exists", () => {
    expect(resolveElementSource(null, ["ghost-a/step-a", "ghost-b/step-b"], knownSteps, knownNodes)).toBeNull();
    expect(resolveElementSource("ghost-node", [], knownSteps, knownNodes)).toBeNull();
  });
});

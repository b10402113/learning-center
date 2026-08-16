import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildSubjectGraph,
  parseFrontmatter,
  scanSubject,
} from "../../../scripts/generate-data.mjs";

const ROADMAP = `---
subject: fixture-subject
status: draft
created: 2026-08-09
---

# ROADMAP — fixture-subject

## Goal

Test fixture subject.

## Nodes

### Tier 1 — 基礎

1. **[[learn/fixture-subject/nodes/p1|P One]]** — 10–15 minutes
   - Goal: first lesson
   - Sources:
     - [[sources/fixture-subject/book.pdf#Intro]]

2. **[[learn/fixture-subject/nodes/p2|P Two]]** — 10–15 minutes
   - Goal: second lesson

### Tier 2 — 進階

3. **[[learn/fixture-subject/nodes/p3|P Three]]** — 10–15 minutes
   - Goal: third lesson
`;

const P1 = `---
id: p1
title: "P One"
subject: fixture-subject
tier: 1
order: 1
duration: 10-15 minutes
status: content-written
goal: First lesson goal.
sources:
  - "[[sources/fixture-subject/book.pdf#Intro]]"
elements:
  - fixture-subject/n1
prerequisites:
  - learn/fixture-subject/elements/n3
  - learn/fixture-subject/nodes/p2
created: 2026-08-09
updated: 2026-08-09
---

# P One

## Learning goal
First lesson goal.

## Elements
- [[learn/fixture-subject/elements/n1|N One]] — 教 n1

## Lesson
### 開場

Lorem **ipsum** dolor sit amet.

## Sources
- [[sources/fixture-subject/book.pdf#Intro]]
`;

const P2 = `---
id: p2
title: "P Two"
subject: fixture-subject
tier: 1
order: 2
duration: 10-15 minutes
status: draft
goal: Second lesson goal.
sources: []
elements: []
created: 2026-08-09
updated: 2026-08-09
---

# P Two

## Learning goal
Second.

## Elements
<!-- /nodes fills this list -->

## Lesson
<!-- /nodes writes the article -->

## Sources
`;

const P3 = `---
id: p3
title: "P Three"
subject: fixture-subject
tier: 2
order: 3
duration: 10-15 minutes
status: content-written
goal: Third lesson goal.
sources:
  - "[[sources/fixture-subject/book.pdf#Intro]]"
elements:
  - fixture-subject/n2
  - fixture-subject/n1
created: 2026-08-09
updated: 2026-08-09
---

# P Three

## Learning goal
Third.
`;

const N1 = `---
id: n1
title: N One
subject: fixture-subject
tier: 1
order: 1
nodes:
  - fixture-subject/p1
sources:
  - "[[sources/fixture-subject/book.pdf#Intro]]"
created: 2026-08-09
updated: 2026-08-09
---

# N One

## The idea
First idea.

## Prerequisites
- [[learn/fixture-subject/elements/n2|N Two]] — helpful first

## Connections
- [[learn/fixture-subject/elements/n2|N Two]] — links to n2
- [[learn/fixture-subject/elements/n3|N Three]] — links to n3

## Deep dive
- [[sources/fixture-subject/book.pdf#Intro]]
`;

const N2 = `---
id: n2
title: N Two
subject: fixture-subject
tier: 2
order: 2
nodes:
  - fixture-subject/p3
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# N Two

## Problem Statement
Second idea.

## Connections
- [[learn/fixture-subject/elements/n1|N One]] — backlink to n1
`;

const N3 = `---
id: n3
title: N Three
subject: fixture-subject
tier: 1
order: 3
nodes: []
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# N Three

## The idea
Third idea.

## Connections
- [[learn/fixture-subject/elements/n1|N One]] — links back
`;

const NV = `---
id: nv
title: N Video
subject: fixture-subject
tier: 1
order: 4
type: video
videoUrl: "https://www.youtube.com/embed/abc123"
nodes: []
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# N Video

## The idea
Watch this.
`;

const NQ = `---
id: nq
title: N Question
subject: fixture-subject
tier: 1
order: 5
type: question
questions:
  - question: "Which loop decides when to stop?"
    options:
      - "SPAL"
      - "Task loop"
      - "Meta loop"
    answer: 1
nodes: []
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# N Question

## The idea
Answer this.
`;

const EDGE = `---
title: N One to N Two
type: extends
from: fixture-subject/n1
to: fixture-subject/n2
nodes:
  - fixture-subject/p1
created: 2026-08-09
updated: 2026-08-09
---

# The relationship
N One extends into N Two.

## Why it matters
Because.

## When each applies
Depends.

## Interleave
Compare them.
`;

const STEP_NODE = `---
id: s1
title: "Step Node"
subject: fixture-subject
tier: 1
order: 1
duration: 10-15 minutes
status: content-written
goal: Step lesson goal.
sources:
  - "[[sources/fixture-subject/book.pdf#Intro]]"
steps:
  - id: warmup
    order: 1
  - id: teach
    order: 2
    deps:
      - warmup
  - id: apply
    order: 3
    deps:
      - warmup
      - teach
created: 2026-08-09
updated: 2026-08-09
---

# Step Node

## Learning goal
Step lesson goal.

## Lesson
Main lesson here.

## Sources
- [[sources/fixture-subject/book.pdf#Intro]]
`;

const STEP_WARMUP = `---
id: warmup
title: "Warmup"
subject: fixture-subject
teaches:
  - fixture-subject/n1
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# Warmup
Warm up concept.
`;

const STEP_TEACH = `---
id: teach
title: "Teach"
subject: fixture-subject
teaches:
  - fixture-subject/n1
  - fixture-subject/n2
sources:
  - "[[sources/fixture-subject/book.pdf#Intro]]"
created: 2026-08-09
updated: 2026-08-09
---

# Teach
Teach concept.
`;

const STEP_APPLY = `---
id: apply
title: "Apply"
subject: fixture-subject
teaches:
  - fixture-subject/n3
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# Apply
Apply concept.
`;

const FILES = {
  "nodes/p1.mdx": P1,
  "nodes/p2.mdx": P2,
  "nodes/p3.mdx": P3,
  "elements/n1.mdx": N1,
  "elements/n2.mdx": N2,
  "elements/n3.mdx": N3,
  "elements/nv.mdx": NV,
  "elements/nq.mdx": NQ,
  "edges/e1.mdx": EDGE,
};

function build() {
  return buildSubjectGraph({
    subject: "fixture-subject",
    roadmap: ROADMAP,
    nodeFiles: {
      "nodes/p1.mdx": FILES["nodes/p1.mdx"],
      "nodes/p2.mdx": FILES["nodes/p2.mdx"],
      "nodes/p3.mdx": FILES["nodes/p3.mdx"],
    },
    elementFiles: {
      "elements/n1.mdx": FILES["elements/n1.mdx"],
      "elements/n2.mdx": FILES["elements/n2.mdx"],
      "elements/n3.mdx": FILES["elements/n3.mdx"],
      "elements/nv.mdx": FILES["elements/nv.mdx"],
      "elements/nq.mdx": FILES["elements/nq.mdx"],
    },
    edgeFiles: { "edges/e1.mdx": FILES["edges/e1.mdx"] },
  });
}

function buildStepDag() {
  return buildSubjectGraph({
    subject: "fixture-subject",
    roadmap: ROADMAP,
    nodeFiles: { "nodes/s1.mdx": STEP_NODE },
    elementFiles: {
      "elements/n1.mdx": FILES["elements/n1.mdx"],
      "elements/n2.mdx": FILES["elements/n2.mdx"],
      "elements/n3.mdx": FILES["elements/n3.mdx"],
    },
    edgeFiles: {},
    stepFiles: {
      "nodes/s1/warmup.mdx": STEP_WARMUP,
      "nodes/s1/teach.mdx": STEP_TEACH,
      "nodes/s1/apply.mdx": STEP_APPLY,
    },
  });
}

describe("parseFrontmatter", () => {
  it("parses scalar, quoted, and list fields", () => {
    const { data, body } = parseFrontmatter(P1);
    expect(data.id).toBe("p1");
    expect(data.title).toBe("P One");
    expect(data.tier).toBe(1);
    expect(data.order).toBe(1);
    expect(data.status).toBe("content-written");
    expect(data.elements).toEqual(["fixture-subject/n1"]);
    expect((data.sources as string[])[0]).toBe("[[sources/fixture-subject/book.pdf#Intro]]");
    expect(body).toContain("# P One");
  });

  it("parses an empty list as []", () => {
    const { data } = parseFrontmatter(P2);
    expect(data.elements).toEqual([]);
    expect(data.sources).toEqual([]);
  });

  it("parses element type, videoUrl, and the structured questions block", () => {
    const { data: video } = parseFrontmatter(NV);
    expect(video.type).toBe("video");
    expect(video.videoUrl).toBe("https://www.youtube.com/embed/abc123");

    const { data: question } = parseFrontmatter(NQ);
    expect(question.type).toBe("question");
    expect(question.questions).toEqual([
      {
        question: "Which loop decides when to stop?",
        options: ["SPAL", "Task loop", "Meta loop"],
        answer: 1,
      },
    ]);
  });

  it("parses node prerequisites as a flat id list", () => {
    const { data } = parseFrontmatter(P1);
    expect(data.prerequisites).toEqual([
      "learn/fixture-subject/elements/n3",
      "learn/fixture-subject/nodes/p2",
    ]);
  });
});

describe("buildSubjectGraph", () => {
  it("parses nodes with tier, order, status, sources, and taught elements", () => {
    const g = build();
    expect(g.subject).toBe("fixture-subject");
    const p1 = g.nodes.find((n) => n.id === "p1")!;
    expect(p1).toMatchObject({
      id: "p1",
      title: "P One",
      tier: 1,
      order: 1,
      duration: "10-15 minutes",
      goal: "First lesson goal.",
      status: "content-written",
    });
    expect(p1.sources).toEqual(["[[sources/fixture-subject/book.pdf#Intro]]"]);
    expect(p1.taughtElementIds).toEqual(["n1"]);
  });

  it("emits only structural data — no rendered content HTML", () => {
    const g = build();
    for (const n of g.nodes) {
      expect(n).not.toHaveProperty("contentHtml");
      expect(n).not.toHaveProperty("fullArticleHtml");
      expect(n).not.toHaveProperty("prepareHtml");
      expect(n).not.toHaveProperty("hasPrepare");
    }
    for (const el of Object.values(g.elements)) {
      expect(el).not.toHaveProperty("bodyHtml");
    }
  });

  it("treats a skeleton node as empty taught elements", () => {
    const g = build();
    const p2 = g.nodes.find((n) => n.id === "p2")!;
    expect(p2.status).toBe("draft");
    expect(p2.taughtElementIds).toEqual([]);
    expect(p2.relatedElementIds).toEqual([]);
  });

  it("builds tiers from ROADMAP headings in ascending order with nodeIds", () => {
    const g = build();
    expect(g.tiers).toEqual([
      { tier: 1, title: "基礎", nodeIds: ["p1", "p2"] },
      { tier: 2, title: "進階", nodeIds: ["p3"] },
    ]);
  });

  it("derives spine edges along global (tier, order) including the tier boundary", () => {
    const g = build();
    const spine = g.edges.filter((e) => e.kind === "spine");
    expect(spine.map((e) => [e.from, e.to])).toEqual([
      ["p1", "p2"],
      ["p2", "p3"],
    ]);
  });

  it("derives shared-concept edges for nodes teaching the same element, deduped and oriented by global order", () => {
    const g = build();
    const shared = g.edges.filter((e) => e.kind === "shared-concept");
    // p1 and p3 both teach n1; p1 comes earlier in global order
    expect(shared).toContainEqual({ from: "p1", to: "p3", kind: "shared-concept" });
    expect(shared.filter((e) => e.from === "p3" && e.to === "p1")).toHaveLength(0);
  });

  it("maps explicit element edges to node-level edges via teaching nodes, with label", () => {
    const g = build();
    const explicit = g.edges.filter((e) => e.kind === "explicit");
    // n1 (taught by p1, p3) -> n2 (taught by p3) yields p1->p3; p3->p3 is self and dropped
    expect(explicit).toContainEqual({
      from: "p1",
      to: "p3",
      kind: "explicit",
      label: "N One to N Two",
    });
  });

  it("derives relatedElementIds from element Connections in both directions", () => {
    const g = build();
    const p1 = g.nodes.find((n) => n.id === "p1")!;
    // p1 teaches n1; n1 links out to n2,n3; n2,n3 link back to n1
    expect(p1.relatedElementIds.sort()).toEqual(["n2", "n3"]);
    const p3 = g.nodes.find((n) => n.id === "p3")!;
    // p3 teaches n2,n1; related = n3 only (n2 and n1 are already taught)
    expect(p3.relatedElementIds).toEqual(["n3"]);
  });

  it("records an element map with connections and sources", () => {
    const g = build();
    const n1 = g.elements.n1;
    expect(n1.title).toBe("N One");
    expect(n1.connections).toEqual(["n2", "n3"]);
    expect(n1.taughtByNodes).toEqual(["p1"]);
    expect(n1.sources).toEqual(["[[sources/fixture-subject/book.pdf#Intro]]"]);
  });

  it("defaults an element without a type to article and omits conditional fields", () => {
    const g = build();
    const n1 = g.elements.n1;
    expect(n1.type).toBe("article");
    expect("videoUrl" in n1).toBe(false);
    expect("questions" in n1).toBe(false);
  });

  it("emits videoUrl for a video element and omits questions", () => {
    const g = build();
    const nv = g.elements.nv;
    expect(nv.type).toBe("video");
    expect(nv.videoUrl).toBe("https://www.youtube.com/embed/abc123");
    expect("questions" in nv).toBe(false);
  });

  it("emits structured questions for a question element and omits videoUrl", () => {
    const g = build();
    const nq = g.elements.nq;
    expect(nq.type).toBe("question");
    expect(nq.questions).toEqual([
      {
        question: "Which loop decides when to stop?",
        options: ["SPAL", "Task loop", "Meta loop"],
        answer: 1,
      },
    ]);
    expect("videoUrl" in nq).toBe(false);
  });

  it("derives element prerequisiteIds from the element Prerequisites section links", () => {
    const g = build();
    // n1's Prerequisites section links to n2; n3 has no Prerequisites section
    expect(g.elements.n1.prerequisiteIds).toEqual(["n2"]);
    expect(g.elements.n3.prerequisiteIds).toEqual([]);
  });

  it("reads element prerequisite links from localized Prerequisites headings", () => {
    const g = buildSubjectGraph({
      subject: "fixture-subject",
      roadmap: ROADMAP,
      nodeFiles: {},
      elementFiles: {
        "elements/zh.mdx": `---
id: zh
title: ZH
---
## 我需要先知道什麼？
- [[learn/fixture-subject/elements/n1|N One]]
`,
      },
      edgeFiles: {},
    });
    expect(g.elements.zh.prerequisiteIds).toEqual(["n1"]);
  });

  it("merges node frontmatter prerequisites with derived relatedElementIds, deduped, with source", () => {
    const g = build();
    const p1 = g.nodes.find((n) => n.id === "p1")!;
    // frontmatter prerequisites: n3 (element), p2 (node)
    // derived relatedElementIds for p1: n2, n3 (via n1's connections both directions)
    // merged, deduped, sorted; source records where each id came from
    expect(p1.prerequisiteIds).toEqual(["n2", "n3", "p2"]);
    expect(p1.prerequisiteSources).toEqual({
      n2: "derived",
      n3: "frontmatter",
      p2: "frontmatter",
    });
  });

  it("keeps node prerequisiteIds empty when neither frontmatter nor connections exist", () => {
    const g = build();
    const p2 = g.nodes.find((n) => n.id === "p2")!;
    expect(p2.prerequisiteIds).toEqual([]);
    expect(p2.prerequisiteSources).toEqual({});
  });

  it("is deterministic: two runs produce identical output", () => {
    expect(build()).toEqual(build());
  });

  it("marks a question-typed element deprecated and leaves others not deprecated", () => {
    const g = build();
    expect(g.elements.nq.deprecated).toBe(true);
    expect(g.elements.n1.deprecated).toBe(false);
  });
});

describe("buildSubjectGraph — step-DAG", () => {
  it("emits steps keyed by node-qualified id with title, order, deps, and teaches", () => {
    const g = buildStepDag();
    expect(g.steps).toEqual({
      "s1/warmup": {
        id: "s1/warmup",
        stepId: "warmup",
        nodeId: "s1",
        title: "Warmup",
        order: 1,
        deps: [],
        teaches: ["n1"],
        sources: [],
      },
      "s1/teach": {
        id: "s1/teach",
        stepId: "teach",
        nodeId: "s1",
        title: "Teach",
        order: 2,
        deps: ["s1/warmup"],
        teaches: ["n1", "n2"],
        sources: ["[[sources/fixture-subject/book.pdf#Intro]]"],
      },
      "s1/apply": {
        id: "s1/apply",
        stepId: "apply",
        nodeId: "s1",
        title: "Apply",
        order: 3,
        deps: ["s1/warmup", "s1/teach"],
        teaches: ["n3"],
        sources: [],
      },
    });
  });

  it("emits step DAG dependency edges between steps", () => {
    const g = buildStepDag();
    const stepEdges = g.edges.filter((e) => e.kind === "step-dep");
    expect(stepEdges).toHaveLength(3);
    expect(stepEdges).toContainEqual({ from: "s1/warmup", to: "s1/teach", kind: "step-dep" });
    expect(stepEdges).toContainEqual({ from: "s1/warmup", to: "s1/apply", kind: "step-dep" });
    expect(stepEdges).toContainEqual({ from: "s1/teach", to: "s1/apply", kind: "step-dep" });
  });

  it("resolves step teaches to element links and element to step links", () => {
    const g = buildStepDag();
    expect(g.elements.n1.taughtBySteps).toEqual(["s1/warmup", "s1/teach"]);
    expect(g.elements.n2.taughtBySteps).toEqual(["s1/teach"]);
    expect(g.elements.n3.taughtBySteps).toEqual(["s1/apply"]);
  });

  it("keeps a legacy node with no steps unchanged in shape", () => {
    const g = build();
    expect(g.steps).toEqual({});
    for (const n of g.nodes) {
      expect(n).not.toHaveProperty("steps");
    }
  });
});

describe("scanSubject", () => {
  it("reads depth-1 files and excludes nested duplicate subject folders", () => {
    const root = mkdtempSync(join(tmpdir(), "km-test-"));
    try {
      mkdirSync(join(root, "learn", "fixture-subject", "nodes"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "elements"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "edges"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "learn", "fixture-subject", "nodes"), { recursive: true });
      writeFileSync(join(root, "learn", "fixture-subject", "ROADMAP.md"), ROADMAP);
      writeFileSync(join(root, "learn", "fixture-subject", "nodes", "p1.mdx"), P1);
      writeFileSync(
        join(root, "learn", "fixture-subject", "learn", "fixture-subject", "nodes", "stub.mdx"),
        "# stub",
      );
      const scanned = scanSubject("fixture-subject", join(root, "learn"));
      expect(Object.keys(scanned.nodeFiles)).toEqual(["nodes/p1.mdx"]);
      expect(scanned.roadmap).toContain("Tier 1");
      expect(scanned.elementFiles).toEqual({});
      expect(scanned.edgeFiles).toEqual({});
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("collects step files under node directories", () => {
    const root = mkdtempSync(join(tmpdir(), "km-step-"));
    try {
      mkdirSync(join(root, "learn", "fixture-subject", "nodes", "s1"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "elements"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "edges"), { recursive: true });
      writeFileSync(join(root, "learn", "fixture-subject", "ROADMAP.md"), ROADMAP);
      writeFileSync(join(root, "learn", "fixture-subject", "nodes", "s1.mdx"), STEP_NODE);
      writeFileSync(join(root, "learn", "fixture-subject", "nodes", "s1", "warmup.mdx"), STEP_WARMUP);
      const scanned = scanSubject("fixture-subject", join(root, "learn"));
      expect(Object.keys(scanned.nodeFiles)).toEqual(["nodes/s1.mdx"]);
      expect(scanned.stepFiles).toEqual({ "nodes/s1/warmup.mdx": STEP_WARMUP });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

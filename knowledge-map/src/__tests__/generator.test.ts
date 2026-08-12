import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildSubjectGraph,
  parseFrontmatter,
  renderMarkdown,
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

## Paths

### Tier 1 — 基礎

1. **[[learn/fixture-subject/paths/p1|P One]]** — 10–15 minutes
   - Goal: first lesson
   - Sources:
     - [[sources/fixture-subject/book.pdf#Intro]]

2. **[[learn/fixture-subject/paths/p2|P Two]]** — 10–15 minutes
   - Goal: second lesson

### Tier 2 — 進階

3. **[[learn/fixture-subject/paths/p3|P Three]]** — 10–15 minutes
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
nodes:
  - fixture-subject/n1
created: 2026-08-09
updated: 2026-08-09
---

# P One

## Learning goal
First lesson goal.

## Nodes
- [[learn/fixture-subject/nodes/n1|N One]] — 教 n1

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
nodes: []
created: 2026-08-09
updated: 2026-08-09
---

# P Two

## Learning goal
Second.

## Nodes
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
nodes:
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
paths:
  - fixture-subject/p1
sources:
  - "[[sources/fixture-subject/book.pdf#Intro]]"
created: 2026-08-09
updated: 2026-08-09
---

# N One

## The idea
First idea.

## Connections
- [[learn/fixture-subject/nodes/n2|N Two]] — links to n2
- [[learn/fixture-subject/nodes/n3|N Three]] — links to n3

## Deep dive
- [[sources/fixture-subject/book.pdf#Intro]]
`;

const N2 = `---
id: n2
title: N Two
subject: fixture-subject
tier: 2
order: 2
paths:
  - fixture-subject/p3
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# N Two

## Problem Statement
Second idea.

## Connections
- [[learn/fixture-subject/nodes/n1|N One]] — backlink to n1
`;

const N3 = `---
id: n3
title: N Three
subject: fixture-subject
tier: 1
order: 3
paths: []
sources: []
created: 2026-08-09
updated: 2026-08-09
---

# N Three

## The idea
Third idea.

## Connections
- [[learn/fixture-subject/nodes/n1|N One]] — links back
`;

const EDGE = `---
title: N One to N Two
type: extends
from: fixture-subject/n1
to: fixture-subject/n2
paths:
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

const PREPARE_P1 = `---
path: fixture-subject/p1
tier: 1
duration: 3-5 minutes
sources:
  - "[[sources/fixture-subject/book.pdf#Intro]]"
created: 2026-08-09
updated: 2026-08-09
---

# P One — 預習

## Key ideas
1. First plain preview idea.
2. Second plain preview idea.

## 術語預告
- **Term A** — one-line gloss

## 已有基礎
- [[learn/fixture-subject/nodes/n1|N One]] — reminder
`;

const FILES = {
  "paths/p1.md": P1,
  "paths/p2.md": P2,
  "paths/p3.md": P3,
  "nodes/n1.md": N1,
  "nodes/n2.md": N2,
  "nodes/n3.md": N3,
  "edges/e1.md": EDGE,
  "prepares/p1.md": PREPARE_P1,
};

function build() {
  return buildSubjectGraph({
    subject: "fixture-subject",
    roadmap: ROADMAP,
    pathFiles: {
      "paths/p1.md": FILES["paths/p1.md"],
      "paths/p2.md": FILES["paths/p2.md"],
      "paths/p3.md": FILES["paths/p3.md"],
    },
    nodeFiles: {
      "nodes/n1.md": FILES["nodes/n1.md"],
      "nodes/n2.md": FILES["nodes/n2.md"],
      "nodes/n3.md": FILES["nodes/n3.md"],
    },
    edgeFiles: { "edges/e1.md": FILES["edges/e1.md"] },
    prepareFiles: { "prepares/p1.md": FILES["prepares/p1.md"] },
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
    expect(data.nodes).toEqual(["fixture-subject/n1"]);
    expect((data.sources as string[])[0]).toBe("[[sources/fixture-subject/book.pdf#Intro]]");
    expect(body).toContain("# P One");
  });

  it("parses an empty list as []", () => {
    const { data } = parseFrontmatter(P2);
    expect(data.nodes).toEqual([]);
    expect(data.sources).toEqual([]);
  });
});

describe("renderMarkdown", () => {
  it("renders headings, paragraphs, and bold", () => {
    const html = renderMarkdown("# Hi\n\nWorld **bold** text.");
    expect(html).toContain("<h1>Hi</h1>");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("renders wikilinks as anchors with data-target", () => {
    const html = renderMarkdown("See [[learn/fixture-subject/nodes/n2|N Two]].");
    expect(html).toContain("data-target=\"learn/fixture-subject/nodes/n2\"");
    expect(html).toContain(">N Two</a>");
  });

  it("renders source wikilinks as source refs", () => {
    const html = renderMarkdown("- [[sources/fixture-subject/book.pdf#Intro]]");
    expect(html).toContain("source-ref");
  });

  it("renders lists", () => {
    const html = renderMarkdown("- a\n- b");
    expect(html).toContain("<li>a</li>");
  });
});

describe("buildSubjectGraph", () => {
  it("parses paths with tier, order, status, sources, and taught nodes", () => {
    const g = build();
    expect(g.subject).toBe("fixture-subject");
    const p1 = g.paths.find((p) => p.id === "p1")!;
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
    expect(p1.taughtNodeIds).toEqual(["n1"]);
    expect(p1.contentHtml).toContain("<h2>");
    expect(p1.fullArticleHtml).toContain("<h1>P One</h1>");
  });

  it("appends a Sources section to fullArticleHtml when the body lacks one", () => {
    const g = build();
    const p3 = g.paths.find((p) => p.id === "p3")!;
    expect(p3.contentHtml).not.toContain("<h2>Sources</h2>");
    expect(p3.fullArticleHtml).toContain("<h2>Sources</h2>");
    expect(p3.fullArticleHtml).toContain(
      '<span class="source-ref">sources/fixture-subject/book.pdf#Intro</span>',
    );
  });

  it("does not duplicate a Sources section already present in the body", () => {
    const g = build();
    const p1 = g.paths.find((p) => p.id === "p1")!;
    const count = p1.fullArticleHtml.match(/<h2>Sources<\/h2>/g);
    expect(count).toHaveLength(1);
  });

  it("treats a skeleton path as empty taught nodes", () => {
    const g = build();
    const p2 = g.paths.find((p) => p.id === "p2")!;
    expect(p2.status).toBe("draft");
    expect(p2.taughtNodeIds).toEqual([]);
    expect(p2.relatedNodeIds).toEqual([]);
  });

  it("builds tiers from ROADMAP headings in ascending order with pathIds", () => {
    const g = build();
    expect(g.tiers).toEqual([
      { tier: 1, title: "基礎", pathIds: ["p1", "p2"] },
      { tier: 2, title: "進階", pathIds: ["p3"] },
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

  it("derives shared-concept edges for paths teaching the same node, deduped and oriented by global order", () => {
    const g = build();
    const shared = g.edges.filter((e) => e.kind === "shared-concept");
    // p1 and p3 both teach n1; p1 comes earlier in global order
    expect(shared).toContainEqual({ from: "p1", to: "p3", kind: "shared-concept" });
    expect(shared.filter((e) => e.from === "p3" && e.to === "p1")).toHaveLength(0);
  });

  it("maps explicit node edges to path-level edges via teaching paths, with label", () => {
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

  it("derives relatedNodeIds from node Connections in both directions", () => {
    const g = build();
    const p1 = g.paths.find((p) => p.id === "p1")!;
    // p1 teaches n1; n1 links out to n2,n3; n2,n3 link back to n1
    expect(p1.relatedNodeIds.sort()).toEqual(["n2", "n3"]);
    const p3 = g.paths.find((p) => p.id === "p3")!;
    // p3 teaches n2,n1; related = n3 only (n2 and n1 are already taught)
    expect(p3.relatedNodeIds).toEqual(["n3"]);
  });

  it("records a node map with body, connections, and sources", () => {
    const g = build();
    const n1 = g.nodes.n1;
    expect(n1.title).toBe("N One");
    expect(n1.bodyHtml).toContain("<h2>Connections</h2>");
    expect(n1.connections).toEqual(["n2", "n3"]);
    expect(n1.taughtBy).toEqual(["p1"]);
    expect(n1.sources).toEqual(["[[sources/fixture-subject/book.pdf#Intro]]"]);
  });

  it("carries a prepare note into the path as rendered prepareHtml + hasPrepare", () => {
    const g = build();
    const p1 = g.paths.find((p) => p.id === "p1")!;
    expect(p1.hasPrepare).toBe(true);
    expect(p1.prepareHtml).toContain("First plain preview idea.");
    expect(p1.prepareHtml).toContain("data-target=\"learn/fixture-subject/nodes/n1\"");
    expect(p1.prepareHtml).not.toContain("path: fixture-subject/p1");
  });

  it("defaults paths without a prepare note to null and false", () => {
    const g = build();
    const p2 = g.paths.find((p) => p.id === "p2")!;
    const p3 = g.paths.find((p) => p.id === "p3")!;
    expect(p2.hasPrepare).toBe(false);
    expect(p2.prepareHtml).toBeNull();
    expect(p3.hasPrepare).toBe(false);
    expect(p3.prepareHtml).toBeNull();
  });

  it("is deterministic: two runs produce identical output", () => {
    expect(build()).toEqual(build());
  });
});

describe("scanSubject", () => {
  it("reads depth-1 files and excludes nested duplicate subject folders", () => {
    const root = mkdtempSync(join(tmpdir(), "km-test-"));
    try {
      mkdirSync(join(root, "learn", "fixture-subject", "paths"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "nodes"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "edges"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "prepares"), { recursive: true });
      mkdirSync(join(root, "learn", "fixture-subject", "learn", "fixture-subject", "paths"), { recursive: true });
      writeFileSync(join(root, "learn", "fixture-subject", "ROADMAP.md"), ROADMAP);
      writeFileSync(join(root, "learn", "fixture-subject", "paths", "p1.md"), P1);
      writeFileSync(
        join(root, "learn", "fixture-subject", "prepares", "p1.md"),
        PREPARE_P1,
      );
      writeFileSync(
        join(root, "learn", "fixture-subject", "learn", "fixture-subject", "paths", "stub.md"),
        "# stub",
      );
      const scanned = scanSubject("fixture-subject", join(root, "learn"));
      expect(Object.keys(scanned.pathFiles)).toEqual(["paths/p1.md"]);
      expect(scanned.roadmap).toContain("Tier 1");
      expect(scanned.nodeFiles).toEqual({});
      expect(scanned.prepareFiles).toEqual({ "prepares/p1.md": PREPARE_P1 });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

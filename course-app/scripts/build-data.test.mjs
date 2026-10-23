import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildSubject, discoverSubjects } from "./build-data.mjs";

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "course-build-"));
  const learnRoot = path.join(root, "learn");
  const appRoot = path.join(root, "app");
  const subjectDir = path.join(learnRoot, "demo");

  write(
    path.join(subjectDir, "ROADMAP.md"),
    `---
subject: demo
status: confirmed
created: 2026-10-22
---

# Demo

## Goal

Learn the demo.

## Nodes

### Tier 1 — Basics

1. **[Node A](nodes/node-a.md)**
   - Goal: Node A goal.
   - Steps: 2
`
  );

  write(
    path.join(subjectDir, "MEMORY.md"),
    `---
subject: demo
language: zh-Hant
---

# Learner profile
`
  );

  write(
    path.join(subjectDir, "nodes", "node-a.md"),
    `---
id: node-a
title: "Node A"
subject: demo
tier: 1
order: 1
status: confirmed
goal: "Node A goal."
prerequisites: []
steps:
  - id: step-two
    title: "Step Two"
    purpose: "Second purpose."
    sources:
      - "[[sources/demo/source.txt#L10-L20]]"
  - id: step-one
    title: "Step One"
    purpose: "First purpose."
    sources:
      - "[[sources/demo/source.txt#L1-L5]]"
created: 2026-10-22
updated: 2026-10-22
---

# Node A

## Lesson

Lesson body for node A.

## Steps

1. [Step Two](node-a/step-two.md)
2. [Step One](node-a/step-one.md)
`
  );

  write(
    path.join(subjectDir, "nodes", "node-a", "step-one.md"),
    `# Step One

First article body.

![第 1 段配圖](./step-one-assets/image-1.webp)
*AI 生成示意圖*
`
  );
  write(
    path.join(subjectDir, "nodes", "node-a", "step-one-assets", "image-1.webp"),
    "fake-webp"
  );
  write(path.join(subjectDir, "nodes", "ignored.mdx"), "# ignored");

  return { root, learnRoot, appRoot };
}

test("discovers subjects that have a ROADMAP.md", () => {
  const { learnRoot } = fixture();
  assert.deepEqual(discoverSubjects(learnRoot), ["demo"]);
});

test("reads Markdown nodes and keeps frontmatter step order", () => {
  const { learnRoot, appRoot } = fixture();
  const course = buildSubject("demo", { learnRoot, appRoot });

  assert.equal(course.subject, "demo");
  assert.equal(course.goal, "Learn the demo.");
  assert.deepEqual(course.tiers, [{ tier: 1, name: "Basics" }]);

  const node = course.nodes[0];
  assert.equal(node.id, "node-a");
  assert.equal(node.title, "Node A");
  assert.equal(node.goal, "Node A goal.");
  assert.equal(node.lessonIntro, "Lesson body for node A.");
  assert.deepEqual(
    node.steps.map((step) => step.id),
    ["step-two", "step-one"]
  );
  assert.deepEqual(
    node.steps.map((step) => step.order),
    [1, 2]
  );
  assert.equal(node.steps[0].hasContent, false);
  assert.equal(node.steps[1].hasContent, true);
  assert.match(node.steps[1].articleMd, /^# Step One/);
  assert.match(node.steps[1].articleMd, /First article body/);
  assert.match(node.steps[1].articleMd, /!\[第 1 段配圖\]\(\.\/step-one-assets\/image-1\.webp\)/);
  assert.match(node.steps[1].articleMd, /\*AI 生成示意圖\*/);
  assert.deepEqual(
    node.steps.map((step) => step.purpose),
    ["Second purpose.", "First purpose."]
  );
  assert.equal(node.steps[0].sources[0].label, "source.txt#L10-L20");
  assert.equal(node.steps[0].sources[0].name, "source.txt");
  assert.equal(node.steps[0].sources[0].lines, "L10-L20");
  assert.equal(node.status, undefined, "the viewer no longer exposes node status");
});

test("orders nodes by relative roadmap links", () => {
  const { learnRoot, appRoot } = fixture();
  write(
    path.join(learnRoot, "demo", "nodes", "node-b.md"),
    `---
id: node-b
title: "Node B"
subject: demo
tier: 1
order: 2
status: draft
goal: "Node B goal."
prerequisites: []
steps: []
created: 2026-10-22
updated: 2026-10-22
---

# Node B

## Lesson

Planned.
`
  );
  write(
    path.join(learnRoot, "demo", "ROADMAP.md"),
    `---
subject: demo
status: confirmed
created: 2026-10-22
---

# Demo

## Nodes

### Tier 1 — Basics

1. **[Node B](nodes/node-b.md)**
2. **[Node A](nodes/node-a.md)**
`
  );

  const course = buildSubject("demo", { learnRoot, appRoot });
  assert.deepEqual(
    course.nodes.map((node) => node.id),
    ["node-b", "node-a"]
  );
});

test("treats an H1-only skeleton as unwritten", () => {
  const { learnRoot, appRoot } = fixture();
  write(
    path.join(learnRoot, "demo", "nodes", "node-a", "step-two.md"),
    "# Step Two\n"
  );

  const course = buildSubject("demo", { learnRoot, appRoot });
  const step = course.nodes[0].steps.find((item) => item.id === "step-two");
  assert.equal(step.hasContent, false);
});

test("copies step assets and does not copy HTML lessons", () => {
  const { learnRoot, appRoot } = fixture();
  write(path.join(learnRoot, "demo", "lessons", "old.html"), "<html></html>");

  buildSubject("demo", { learnRoot, appRoot });

  assert.equal(
    fs.readFileSync(
      path.join(
        appRoot,
        "public/nodes/demo/node-a/step-one-assets/image-1.webp"
      ),
      "utf8"
    ),
    "fake-webp"
  );
  assert.equal(fs.existsSync(path.join(appRoot, "public/lessons")), false);
});

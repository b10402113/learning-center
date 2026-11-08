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
    author: "test-model"
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

test("falls back to the article H1 or the step id when no title is written back", () => {
  const { learnRoot, appRoot } = fixture();
  const subjectDir = path.join(learnRoot, "demo");
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
    purpose: "Second purpose."
    sources:
      - "[[sources/demo/source.txt#L10-L20]]"
  - id: step-one
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

1. [step-two](node-a/step-two.md)
2. [step-one](node-a/step-one.md)
`
  );
  write(path.join(subjectDir, "nodes", "node-a", "step-two.md"), "# Published Title\n\nBody.\n");
  write(path.join(subjectDir, "nodes", "node-a", "step-one.md"), "");

  const course = buildSubject("demo", { learnRoot, appRoot });
  assert.deepEqual(
    course.nodes[0].steps.map((step) => step.title),
    ["Published Title", "step-one"]
  );
});

test("reads Markdown nodes and keeps frontmatter step order", () => {
  const { learnRoot, appRoot } = fixture();
  const course = buildSubject("demo", { learnRoot, appRoot });

  assert.equal(course.subject, "demo");
  assert.equal(course.goal, "Learn the demo.");
  assert.equal(course.updated, "2026-10-22");
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
  assert.deepEqual(
    node.steps.map((step) => step.author),
    ["test-model", null]
  );
  assert.equal(node.steps[0].sources[0].label, "source.txt#L10-L20");
  assert.equal(node.steps[0].sources[0].name, "source.txt");
  assert.equal(node.steps[0].sources[0].lines, "L10-L20");
  assert.equal(node.status, undefined, "the viewer no longer exposes node status");
});

test("resolves prerequisite paths to node ids", () => {
  const { learnRoot, appRoot } = fixture();
  write(
    path.join(learnRoot, "demo", "nodes", "node-b.md"),
    `---
id: node-b
title: "Node B"
subject: demo
tier: 2
order: 2
status: draft
goal: "Node B goal."
prerequisites:
  - "learn/demo/nodes/node-a.md"
  - "learn/demo/nodes/node-a.md"
  - "learn/demo/nodes/missing.md"
steps: []
created: 2026-10-22
updated: 2026-10-22
---

# Node B

## Lesson

Lesson body for node B.

## Steps
`
  );

  const course = buildSubject("demo", { learnRoot, appRoot });
  const nodeB = course.nodes.find((node) => node.id === "node-b");
  assert.deepEqual(nodeB.requires, ["node-a"]);
  assert.deepEqual(nodeB.prerequisites, [
    "learn/demo/nodes/node-a.md",
    "learn/demo/nodes/node-a.md",
    "learn/demo/nodes/missing.md",
  ]);
});

function quizPayload() {
  return {
    "quiz-generated": true,
    questions: [
      {
        question: "Question one?",
        options: ["One", "Two", "Three"],
        answer: 0,
        explain: "Because one is first.",
      },
      {
        question: "Question two?",
        options: ["One", "Two", "Three"],
        answer: 1,
        explain: "Because two is second.",
      },
      {
        question: "Question three?",
        options: ["One", "Two", "Three"],
        answer: 2,
        explain: "Because three is third.",
      },
    ],
  };
}

function stepOneQuizPath(learnRoot) {
  return path.join(learnRoot, "demo", "nodes", "node-a", "step-one.quiz.json");
}

test("reads a quiz sidecar onto its step", () => {
  const { learnRoot, appRoot } = fixture();
  write(stepOneQuizPath(learnRoot), JSON.stringify(quizPayload()));

  const course = buildSubject("demo", { learnRoot, appRoot });
  const step = course.nodes[0].steps.find((item) => item.id === "step-one");

  assert.equal(step.quizzes.length, 3);
  assert.deepEqual(step.quizzes[0], {
    question: "Question one?",
    options: ["One", "Two", "Three"],
    answer: 0,
    explain: "Because one is first.",
  });
});

test("skips an invalid quiz sidecar without failing the build", (t) => {
  const originalWarn = console.warn;
  console.warn = () => {};
  t.after(() => {
    console.warn = originalWarn;
  });

  for (const payload of [
    "{not json",
    JSON.stringify({ ...quizPayload(), "quiz-generated": false }),
    JSON.stringify({
      "quiz-generated": true,
      questions: quizPayload().questions.slice(0, 2),
    }),
    JSON.stringify({
      "quiz-generated": true,
      questions: [
        ...quizPayload().questions,
        {
          question: "Question four?",
          options: ["One", "Two", "Three"],
          answer: 0,
          explain: "Too many for this article.",
        },
      ],
    }),
  ]) {
    const { learnRoot, appRoot } = fixture();
    write(stepOneQuizPath(learnRoot), payload);

    const course = buildSubject("demo", { learnRoot, appRoot });
    const step = course.nodes[0].steps.find((item) => item.id === "step-one");
    assert.deepEqual(step.quizzes, []);
  }
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

test("copies block assets and exposes the block image", () => {
  const { learnRoot, appRoot } = fixture();
  writeBlockFiles(learnRoot);
  write(path.join(learnRoot, "demo", "blocks", "agent-assets", "image-1.webp"), "fake-webp");

  const course = buildSubject("demo", { learnRoot, appRoot });
  const agent = course.blocks.find((block) => block.id === "agent");
  assert.equal(agent.image, "agent-assets/image-1.webp");
  assert.equal(
    fs.readFileSync(path.join(appRoot, "public/blocks/demo/agent-assets/image-1.webp"), "utf8"),
    "fake-webp"
  );
  assert.equal(course.blocks.find((block) => block.id === "tool").image, undefined);
});

function writeBlockFiles(learnRoot) {
  write(
    path.join(learnRoot, "demo", "nodes", "node-a.md"),
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
    blocks:
      - tool
  - id: step-one
    title: "Step One"
    purpose: "First purpose."
    sources:
      - "[[sources/demo/source.txt#L1-L5]]"
    blocks:
      - agent
      - tool
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
    path.join(learnRoot, "demo", "blocks", "agent.md"),
    `---
id: agent
title: "Agent（代理）"
label: Agent
subject: demo
type: concept
status: draft
summary: "Agent 是能感知環境並採取行動的實體。"
aliases: []
prerequisites: []
related:
  - tool
sources:
  - "[[sources/demo/source.txt#L1-L5]]"
created: 2026-10-22
updated: 2026-10-22
---

# Agent（代理）

Agent 的說明。
`
  );
  write(
    path.join(learnRoot, "demo", "blocks", "tool.md"),
    `---
id: tool
title: "Tool（工具）"
label: Tool
subject: demo
type: concept
status: reviewed
summary: "Tool 是模型可以呼叫的外部能力。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/demo/source.txt#L10-L20]]"
created: 2026-10-22
updated: 2026-10-22
---

# Tool（工具）

Tool 的說明。
`
  );
}

test("builds block summaries, step blocks, edges, and per-block files", () => {
  const { learnRoot, appRoot } = fixture();
  writeBlockFiles(learnRoot);
  write(
    path.join(appRoot, "src", "data", "blocks", "demo", "stale.json"),
    "{}"
  );

  const course = buildSubject("demo", { learnRoot, appRoot });
  const agent = course.blocks.find((block) => block.id === "agent");
  const tool = course.blocks.find((block) => block.id === "tool");

  assert.equal(agent.summary, "Agent 是能感知環境並採取行動的實體。");
  assert.equal(agent.type, "concept");
  assert.equal(agent.status, "draft");
  assert.deepEqual(agent.related, ["tool"]);
  assert.equal(agent.bodyMd, undefined, "subject data carries no block body");
  assert.equal(
    JSON.stringify(course).includes("Agent 的說明"),
    false,
    "block prose stays out of the subject JSON"
  );

  const stepTwo = course.nodes[0].steps.find((step) => step.id === "step-two");
  const stepOne = course.nodes[0].steps.find((step) => step.id === "step-one");
  assert.deepEqual(
    stepOne.blocks.map((block) => block.id),
    ["agent", "tool"]
  );
  assert.deepEqual(stepOne.blocks[0], {
    id: "agent",
    title: "Agent（代理）",
    summary: "Agent 是能感知環境並採取行動的實體。",
    type: "concept",
    status: "draft",
    prerequisites: [],
    related: ["tool"],
    steps: ["node-a/step-one"],
  });
  assert.deepEqual(
    stepTwo.blocks.map((block) => block.id),
    ["tool"]
  );

  assert.deepEqual(course.blockEdges, [
    { from: "agent", to: "tool", kind: "related" },
  ]);

  const blockDir = path.join(appRoot, "src", "data", "blocks", "demo");
  assert.equal(fs.existsSync(path.join(blockDir, "stale.json")), false);

  const agentFile = JSON.parse(
    fs.readFileSync(path.join(blockDir, "agent.json"), "utf8")
  );
  assert.match(agentFile.bodyMd, /Agent 的說明/);
  assert.equal(agentFile.sources[0].name, "source.txt");
  assert.equal(agentFile.sources[0].lines, "L1-L5");
  assert.deepEqual(agentFile.steps, [
    {
      nodeId: "node-a",
      nodeTitle: "Node A",
      stepId: "step-one",
      stepTitle: "Step One",
    },
  ]);
  assert.deepEqual(agentFile.backlinks, [
    { id: "tool", title: "Tool（工具）", kind: "related" },
  ]);

  const toolFile = JSON.parse(
    fs.readFileSync(path.join(blockDir, "tool.json"), "utf8")
  );
  assert.deepEqual(
    toolFile.steps.map((step) => step.stepId),
    ["step-two", "step-one"]
  );
  assert.deepEqual(toolFile.backlinks, [
    { id: "agent", title: "Agent（代理）", kind: "related" },
  ]);
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGraph,
  filterBlocks,
  graphEdges,
  localNodeIds,
  neighborsOf,
} from "./block-graph.mjs";

const BLOCKS = [
  {
    id: "agent",
    title: "Agent（代理）",
    label: "Agent",
    summary: "能感知環境並採取行動的實體。",
    type: "concept",
    status: "draft",
    prerequisites: [],
    related: ["tool"],
    steps: [],
  },
  {
    id: "tool",
    title: "Tool（工具）",
    label: "Tool",
    summary: "模型可以呼叫的外部能力。",
    type: "concept",
    status: "reviewed",
    prerequisites: [],
    related: [],
    steps: [],
  },
  {
    id: "react",
    title: "ReAct",
    label: "ReAct",
    summary: "推理與行動交錯的提示策略。",
    type: "procedure",
    status: "draft",
    prerequisites: ["tool"],
    related: [],
    steps: [],
  },
  {
    id: "agent-vs-workflow",
    title: "Agent vs Workflow",
    label: "Agent vs Workflow",
    summary: "控制權在模型或流程之間的對比。",
    type: "contrast",
    status: "draft",
    prerequisites: [],
    related: [],
    steps: [],
  },
];

const EDGES = [
  { from: "agent", to: "tool", kind: "related" },
  { from: "react", to: "tool", kind: "prerequisite" },
];

const COURSE = { blocks: BLOCKS, blockEdges: EDGES };

test("filters by type and search query", () => {
  assert.deepEqual(
    filterBlocks(BLOCKS, { type: "procedure" }).map((block) => block.id),
    ["react"]
  );
  assert.deepEqual(
    filterBlocks(BLOCKS, { query: "流程" }).map((block) => block.id),
    ["agent-vs-workflow"]
  );
  assert.deepEqual(
    filterBlocks(BLOCKS, { query: "TOOL" }).map((block) => block.id),
    ["tool"]
  );
  assert.equal(filterBlocks(BLOCKS, { type: "all" }).length, 4);
});

test("keeps only edges whose endpoints are present", () => {
  const edges = graphEdges(EDGES, new Set(["agent"]));
  assert.deepEqual(edges, []);
});

test("dedupes an undirected related edge regardless of direction", () => {
  const edges = graphEdges(
    [
      { from: "agent", to: "tool", kind: "related" },
      { from: "tool", to: "agent", kind: "related" },
    ],
    new Set(["agent", "tool"])
  );
  assert.deepEqual(edges, [
    { from: "agent", to: "tool", kind: "related" },
  ]);
});

test("finds first-degree neighbors in both directions", () => {
  const neighbors = neighborsOf(EDGES, "tool");
  assert.deepEqual([...neighbors].sort(), ["agent", "react"]);
  assert.deepEqual([...neighborsOf(EDGES, "react")], ["tool"]);
  assert.deepEqual([...neighborsOf(EDGES, "missing")], []);
});

test("builds a position-free graph from the filtered blocks", () => {
  const graph = buildGraph(COURSE, { type: "concept" });

  assert.deepEqual(
    graph.nodes.map((node) => node.id),
    ["agent", "tool"]
  );
  assert.deepEqual(graph.links, [
    { from: "agent", to: "tool", kind: "related" },
  ]);

  for (const node of graph.nodes) {
    assert.equal(Number.isFinite(node.radius), true);
    assert.equal("x" in node, false);
    assert.equal("y" in node, false);
  }
});

test("sizes a node by how many edges touch it", () => {
  const graph = buildGraph(COURSE);
  const tool = graph.nodes.find((node) => node.id === "tool");
  const lonely = graph.nodes.find((node) => node.id === "agent-vs-workflow");
  assert.equal(tool.degree, 2);
  assert.ok(tool.radius > lonely.radius);
});

test("falls back to the title minus its Chinese gloss for the node label", () => {
  const graph = buildGraph({
    blocks: [
      {
        id: "agent-loop",
        title: "Agent Loop（代理迴圈）",
        summary: "反覆行動直到停止條件成立。",
        type: "concept",
      },
    ],
    blockEdges: [],
  });
  assert.equal(graph.nodes[0].label, "Agent Loop");
});

test("returns an empty graph when everything is filtered out", () => {
  const graph = buildGraph(COURSE, { query: "not-a-block" });
  assert.deepEqual(graph.nodes, []);
  assert.deepEqual(graph.links, []);
});

test("collects the focus and its neighbourhood up to a depth", () => {
  assert.deepEqual(
    [...localNodeIds(EDGES, "tool", 1)].sort(),
    ["agent", "react", "tool"]
  );
  assert.deepEqual([...localNodeIds(EDGES, "react", 1)].sort(), [
    "react",
    "tool",
  ]);
  assert.equal(localNodeIds(EDGES, null), null);
});

test("keeps only the focus neighbourhood and marks the focus node", () => {
  const graph = buildGraph(COURSE, { focus: "react", depth: 1 });

  assert.deepEqual(
    graph.nodes.map((node) => node.id).sort(),
    ["react", "tool"]
  );
  assert.deepEqual(graph.links, [
    { from: "react", to: "tool", kind: "prerequisite" },
  ]);

  const react = graph.nodes.find((node) => node.id === "react");
  const tool = graph.nodes.find((node) => node.id === "tool");
  assert.equal(react.isFocus, true);
  assert.equal(tool.isFocus, false);
  assert.ok(react.radius > tool.radius);
});

test("an isolated focus still renders as a single node", () => {
  const graph = buildGraph(
    { blocks: BLOCKS, blockEdges: [] },
    { focus: "agent-vs-workflow" }
  );
  assert.deepEqual(
    graph.nodes.map((node) => node.id),
    ["agent-vs-workflow"]
  );
  assert.deepEqual(graph.links, []);
});

test("keeps the union of several focus neighbourhoods and marks each focus", () => {
  const graph = buildGraph(COURSE, { focusIds: ["agent", "react"], depth: 1 });

  assert.deepEqual(
    graph.nodes.map((node) => node.id).sort(),
    ["agent", "react", "tool"]
  );
  assert.equal(graph.nodes.find((node) => node.id === "agent").isFocus, true);
  assert.equal(graph.nodes.find((node) => node.id === "react").isFocus, true);
  assert.equal(graph.nodes.find((node) => node.id === "tool").isFocus, false);
});

test("falls back to a single focus when focusIds is empty", () => {
  const graph = buildGraph(COURSE, { focus: "react", focusIds: [], depth: 1 });
  assert.deepEqual(graph.nodes.map((node) => node.id).sort(), [
    "react",
    "tool",
  ]);
});

test("entities adds teach steps and their nodes to the graph", () => {
  const course = {
    blocks: [
      {
        ...BLOCKS[0],
        steps: ["n1/s1", "n1/s2"],
      },
      { ...BLOCKS[1], steps: ["n2/s1"] },
    ],
    blockEdges: [{ from: "agent", to: "tool", kind: "related" }],
    nodes: [
      { id: "n1", title: "Node One", steps: [{ id: "s1", title: "First Step" }, { id: "s2", title: "Second Step" }] },
      { id: "n2", title: "Node Two", steps: [{ id: "s1", title: "Third Step" }] },
    ],
  };
  const plain = buildGraph(course, {});
  assert.equal(plain.nodes.every((node) => node.entity === "block"), true);

  const graph = buildGraph(course, { entities: true });
  const entities = new Set(graph.nodes.map((node) => node.entity));
  assert.deepEqual([...entities].sort(), ["block", "node", "step"]);

  const step = graph.nodes.find((node) => node.id === "step:n1/s1");
  assert.equal(step.entity, "step");
  assert.equal(step.label, "First Step");
  const node = graph.nodes.find((node) => node.id === "node:n1");
  assert.equal(node.entity, "node");
  assert.equal(node.label, "Node One");

  assert.ok(graph.links.some((link) => link.from === "agent" && link.to === "step:n1/s1" && link.kind === "step"));
  assert.ok(graph.links.some((link) => link.from === "step:n1/s1" && link.to === "node:n1" && link.kind === "node"));
  assert.ok(graph.links.some((link) => link.from === "agent" && link.to === "tool" && link.kind === "related"));
});

test("entities stays on for a focused block neighbourhood", () => {
  const course = {
    blocks: [{ ...BLOCKS[0], steps: ["n1/s1"] }],
    blockEdges: [],
    nodes: [{ id: "n1", title: "Node One", steps: [{ id: "s1", title: "First Step" }] }],
  };
  const graph = buildGraph(course, { focus: "agent", entities: true });
  assert.equal(graph.nodes.length, 3);
  assert.equal(graph.nodes.filter((node) => node.entity === "block").length, 1);
});

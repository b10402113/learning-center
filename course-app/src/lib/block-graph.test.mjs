import assert from "node:assert/strict";
import test from "node:test";
import {
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  filterBlocks,
  graphEdges,
  layoutBlockGraph,
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

test("lays out the filtered graph deterministically", () => {
  const first = layoutBlockGraph(COURSE, { type: "concept" });
  const second = layoutBlockGraph(COURSE, { type: "concept" });

  assert.deepEqual(
    first.nodes.map((node) => node.id),
    ["agent", "tool"]
  );
  assert.deepEqual(first.links, [
    { from: "agent", to: "tool", kind: "related" },
  ]);
  assert.deepEqual(
    first.nodes.map(({ id, x, y }) => ({ id, x, y })),
    second.nodes.map(({ id, x, y }) => ({ id, x, y })),
    "the fixed seed produces the same positions on every run"
  );

  for (const node of first.nodes) {
    assert.equal(Number.isFinite(node.x), true);
    assert.equal(Number.isFinite(node.y), true);
    assert.ok(node.x >= 0 && node.x <= GRAPH_WIDTH);
    assert.ok(node.y >= 0 && node.y <= GRAPH_HEIGHT);
  }
});

test("carries only summary fields into graph nodes", () => {
  const { nodes } = layoutBlockGraph(COURSE);
  const agent = nodes.find((node) => node.id === "agent");
  assert.deepEqual(Object.keys(agent).sort(), [
    "id",
    "label",
    "radius",
    "summary",
    "title",
    "type",
    "x",
    "y",
  ]);
});

test("falls back to the title minus its Chinese gloss for the node label", () => {
  const graph = layoutBlockGraph({
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
  const graph = layoutBlockGraph(COURSE, { query: "not-a-block" });
  assert.deepEqual(graph.nodes, []);
  assert.deepEqual(graph.links, []);
  assert.equal(graph.width, GRAPH_WIDTH);
  assert.equal(graph.height, GRAPH_HEIGHT);
});

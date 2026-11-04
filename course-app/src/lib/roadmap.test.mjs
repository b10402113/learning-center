import assert from "node:assert/strict";
import test from "node:test";
import {
  CARD_H,
  CARD_W,
  COL_GAP,
  ROW_GAP,
  buildGraph,
  layoutRoadmap,
  neighbors,
  reduceEdges,
} from "./roadmap.mjs";

function node(id, tier, globalOrder, requires = []) {
  return { id, tier, globalOrder, requires, title: id, steps: [] };
}

const nodes = [
  node("a", 1, 1),
  node("b", 2, 2, ["a"]),
  node("c", 2, 3, ["a"]),
  node("d", 3, 4, ["b"]),
  node("e", 3, 5, ["c"]),
];

test("builds one edge per prerequisite and drops dangling ids", () => {
  const graph = buildGraph([
    node("a", 1, 1),
    node("b", 2, 2, ["a", "missing", "a"]),
  ]);
  assert.deepEqual(graph.edges, [{ from: "a", to: "b" }]);
  assert.deepEqual(graph.parents.get("b"), ["a"]);
  assert.deepEqual(graph.children.get("a"), ["b"]);
});

test("neighbors collects both upstream and downstream nodes", () => {
  const edges = [
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "d", to: "b" },
  ];
  assert.deepEqual([...neighbors(edges, "b")].sort(), ["a", "b", "c", "d"]);
  assert.deepEqual([...neighbors(edges, "c")].sort(), ["b", "c"]);
});

test("drops edges implied by a longer path", () => {
  const graph = buildGraph([
    node("a", 1, 1),
    node("b", 2, 2, ["a"]),
    node("c", 3, 3, ["a", "b"]),
  ]);
  const reduced = reduceEdges(graph);
  assert.deepEqual(
    reduced.edges.map((edge) => `${edge.from}->${edge.to}`),
    ["a->b", "b->c"]
  );
});

test("lays tiers out top to bottom", () => {
  const layout = layoutRoadmap(nodes);
  assert.deepEqual(
    layout.rows.map((row) => row.tier),
    [1, 2, 3]
  );
  const [first, second, third] = layout.rows;
  assert.ok(second.y > first.y);
  assert.ok(third.y > second.y);
  assert.equal(second.y - first.y, CARD_H + ROW_GAP);
});

test("nodes in one tier share a row and never overlap", () => {
  const layout = layoutRoadmap(nodes);
  const row = layout.rows[1];
  assert.equal(row.nodes.length, 2);
  assert.equal(row.nodes[0].y, row.nodes[1].y);
  const [left, right] = [...row.nodes].sort((a, b) => a.x - b.x);
  assert.ok(right.x - left.x >= CARD_W + COL_GAP - 0.001);
});

test("every edge has a bezier path", () => {
  const layout = layoutRoadmap(nodes);
  assert.equal(layout.edges.length, 4);
  for (const edge of layout.edges) {
    assert.match(edge.path, /^M .+ C .+, .+, .+$/);
  }
});

test("the layout is deterministic", () => {
  assert.deepEqual(layoutRoadmap(nodes), layoutRoadmap(nodes));
});

test("same-tier edges leave the right side and enter the left", () => {
  const layout = layoutRoadmap([
    node("a", 1, 1),
    node("b", 1, 2, ["a"]),
  ]);
  const edge = layout.edges[0];
  const from = layout.positions.get("a");
  const fromX = from.x + CARD_W;
  const fromY = from.y + CARD_H / 2;
  assert.ok(edge.path.startsWith(`M ${fromX} ${fromY}`));
});

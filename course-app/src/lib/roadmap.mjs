/**
 * Deterministic layered layout for the subject roadmap.
 *
 * One tier is one horizontal row, ordered top to bottom. Within a row, nodes
 * start in teaching order and then settle by the median x of their
 * prerequisites, which keeps most edges from crossing.
 */

export const CARD_W = 184;
export const CARD_H = 68;
export const COL_GAP = 32;
export const ROW_GAP = 92;
export const PAD = 36;

/** Derive prerequisite edges (parent -> child) from `node.requires`. */
export function buildGraph(nodes) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const parents = new Map(nodes.map((node) => [node.id, []]));
  const children = new Map(nodes.map((node) => [node.id, []]));
  const edges = [];
  const seen = new Set();

  for (const node of nodes) {
    for (const parentId of node.requires || []) {
      if (parentId === node.id || !byId.has(parentId)) continue;
      const key = `${parentId}->${node.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from: parentId, to: node.id });
      parents.get(node.id).push(parentId);
      children.get(parentId).push(node.id);
    }
  }

  return { byId, edges, parents, children };
}

/**
 * Drop edges implied by a longer path (`a -> b -> c` keeps `a -> c` out of the
 * drawing). Redundant edges add spaghetti without teaching a new dependency.
 */
export function reduceEdges(graph) {
  const kept = graph.edges.filter(({ from, to }) => {
    const stack = (graph.children.get(from) || []).filter((id) => id !== to);
    const seen = new Set();
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === to) return false;
      if (seen.has(current)) continue;
      seen.add(current);
      for (const next of graph.children.get(current) || []) stack.push(next);
    }
    return true;
  });

  const parents = new Map([...graph.byId.keys()].map((id) => [id, []]));
  const children = new Map([...graph.byId.keys()].map((id) => [id, []]));
  for (const { from, to } of kept) {
    parents.get(to).push(from);
    children.get(from).push(to);
  }
  return { byId: graph.byId, edges: kept, parents, children };
}

function rowWidth(count) {
  return count * CARD_W + Math.max(0, count - 1) * COL_GAP;
}

function teachingOrder(a, b) {
  return (a.globalOrder ?? 0) - (b.globalOrder ?? 0);
}

/**
 * @returns {{
 *   width: number,
 *   height: number,
 *   rows: Array<{ tier: number|undefined, y: number, nodes: Array<{node: object, x: number, y: number}> }>,
 *   positions: Map<string, {x: number, y: number}>,
 *   edges: Array<{from: string, to: string, path: string}>,
 * }}
 */
export function layoutRoadmap(nodes) {
  const graph = reduceEdges(buildGraph(nodes));
  const tiers = [];
  for (const node of nodes) {
    if (!tiers.includes(node.tier)) tiers.push(node.tier);
  }
  tiers.sort((a, b) => {
    if (a === undefined) return 1;
    if (b === undefined) return -1;
    return a - b;
  });

  let rows = tiers.map((tier) =>
    nodes.filter((node) => node.tier === tier).sort(teachingOrder)
  );

  const widest = rows.reduce((max, row) => Math.max(max, rowWidth(row.length)), CARD_W);
  const width = widest + PAD * 2;
  const height =
    rows.length * CARD_H + Math.max(0, rows.length - 1) * ROW_GAP + PAD * 2;

  const x = new Map();
  const y = new Map();
  const place = (currentRows) => {
    currentRows.forEach((row, rowIndex) => {
      const start = PAD + (widest - rowWidth(row.length)) / 2;
      row.forEach((node, index) => {
        x.set(node.id, start + index * (CARD_W + COL_GAP));
        y.set(node.id, PAD + rowIndex * (CARD_H + ROW_GAP));
      });
    });
  };
  place(rows);

  const reorder = (currentRows) =>
    currentRows.map((row) =>
      [...row].sort((a, b) => {
        const score = (node) => {
          const parents = graph.parents.get(node.id) || [];
          if (parents.length === 0) return x.get(node.id) ?? 0;
          return (
            parents.reduce((sum, parentId) => sum + (x.get(parentId) ?? 0), 0) /
            parents.length
          );
        };
        return score(a) - score(b) || teachingOrder(a, b);
      })
    );

  for (let pass = 0; pass < 3; pass += 1) {
    rows = reorder(rows);
    place(rows);
  }

  const positions = new Map();
  for (const row of rows) {
    for (const node of row) {
      positions.set(node.id, { x: x.get(node.id), y: y.get(node.id) });
    }
  }

  const edges = graph.edges.map((edge) => ({
    ...edge,
    path: edgePath(positions.get(edge.from), positions.get(edge.to)),
  }));

  return {
    width,
    height,
    rows: rows.map((row, rowIndex) => ({
      tier: tiers[rowIndex],
      y: PAD + rowIndex * (CARD_H + ROW_GAP),
      nodes: row.map((node) => ({
        node,
        x: x.get(node.id),
        y: y.get(node.id),
      })),
    })),
    positions,
    edges,
  };
}

/** The hovered node plus every node one edge away in either direction. */
export function neighbors(edges, id) {
  const ids = new Set([id]);
  for (const edge of edges) {
    if (edge.from === id) ids.add(edge.to);
    if (edge.to === id) ids.add(edge.from);
  }
  return ids;
}

/** A cubic bezier between two cards, leaving the bottom and entering the top. */
export function edgePath(from, to) {
  if (!from || !to) return "";
  const fromX = from.x + CARD_W / 2;
  const fromY = from.y + CARD_H;
  const toX = to.x + CARD_W / 2;
  const toY = to.y;

  if (from.y === to.y) {
    const startX = from.x + CARD_W;
    const startY = from.y + CARD_H / 2;
    const endX = to.x;
    const endY = to.y + CARD_H / 2;
    const bend = Math.max(36, Math.abs(endX - startX) / 2);
    return `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`;
  }

  const bend = Math.max(24, (toY - fromY) / 2);
  return `M ${fromX} ${fromY} C ${fromX} ${fromY + bend}, ${toX} ${toY - bend}, ${toX} ${toY}`;
}

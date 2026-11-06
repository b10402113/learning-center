import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";

export const GRAPH_WIDTH = 960;
export const GRAPH_HEIGHT = 680;
export const GRAPH_SEED = 20261106;

const GRAPH_TICKS = 420;
const PADDING = 58;
const NODE_EDGE_MARGIN = 28;

/** Deterministic PRNG so the force layout matches after every reload. */
function seededRandom(seed = GRAPH_SEED) {
  let state = (Number(seed) || GRAPH_SEED) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function searchText(block) {
  return [block.id, block.title, block.label, block.summary]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** "Agent Loop（代理迴圈）" → "Agent Loop"; the graph needs a short name. */
function shortLabel(block) {
  if (block.label) return block.label;
  return String(block.title || block.id)
    .replace(/（[^）]*）/g, "")
    .trim();
}

/** Blocks matching the type filter and the free-text query. */
export function filterBlocks(blocks, { type = "all", query = "" } = {}) {
  const needle = String(query || "")
    .trim()
    .toLowerCase();
  return (Array.isArray(blocks) ? blocks : []).filter((block) => {
    if (type && type !== "all" && block.type !== type) return false;
    if (needle && !searchText(block).includes(needle)) return false;
    return true;
  });
}

function endpointId(endpoint) {
  return endpoint && typeof endpoint === "object" ? endpoint.id : endpoint;
}

/**
 * Edges whose two endpoints survive the filter. `related` is undirected, so
 * the pair is normalized and deduped; `prerequisite` keeps its direction.
 */
export function graphEdges(edges, ids) {
  const seen = new Set();
  const result = [];
  for (const edge of Array.isArray(edges) ? edges : []) {
    const from = endpointId(edge?.from);
    const to = endpointId(edge?.to);
    if (!ids.has(from) || !ids.has(to) || from === to) continue;
    const kind = edge.kind === "prerequisite" ? "prerequisite" : "related";
    const pair = kind === "related" ? [from, to].sort() : [from, to];
    const key = `${pair[0]}->${pair[1]}:${kind}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ from: pair[0], to: pair[1], kind });
  }
  return result;
}

/** The node itself plus everything connected to it by one edge. */
export function neighborsOf(edges, id) {
  const neighbors = new Set();
  if (!id) return neighbors;
  for (const edge of Array.isArray(edges) ? edges : []) {
    const from = endpointId(edge?.from);
    const to = endpointId(edge?.to);
    if (from === id && to !== id) neighbors.add(to);
    else if (to === id && from !== id) neighbors.add(from);
  }
  return neighbors;
}

/**
 * Keep a dragged node inside the graph box so its edges never converge on a
 * clipped corner. A non-finite position falls back to the centre.
 */
export function clampNodePosition(position, radius, width = GRAPH_WIDTH, height = GRAPH_HEIGHT) {
  const limit = Math.max(0, Number(radius) || 0) + NODE_EDGE_MARGIN;
  const x = Number.isFinite(position?.x) ? position.x : width / 2;
  const y = Number.isFinite(position?.y) ? position.y : height / 2;
  return {
    x: Math.min(width - limit, Math.max(limit, x)),
    y: Math.min(height - limit, Math.max(limit, y)),
  };
}

/**
 * Clamp a pan offset so the graph never leaves the viewport. At scale 1 the
 * graph already fits, so the only valid offset is zero.
 */
export function clampOffset(offset, scale, width = GRAPH_WIDTH, height = GRAPH_HEIGHT) {
  const factor = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const spanX = width * factor;
  const spanY = height * factor;
  const minX = Math.min(0, width - spanX);
  const maxX = Math.max(0, width - spanX);
  const minY = Math.min(0, height - spanY);
  const maxY = Math.max(0, height - spanY);
  const x = Number.isFinite(offset?.x) ? offset.x : 0;
  const y = Number.isFinite(offset?.y) ? offset.y : 0;
  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
}

/** Scale every node into the fixed viewport so the graph always fits. */
function fitToBox(nodes) {
  if (nodes.length === 0) return;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.x - node.radius);
    maxX = Math.max(maxX, node.x + node.radius);
    minY = Math.min(minY, node.y - node.radius);
    maxY = Math.max(maxY, node.y + node.radius);
  }
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const scale = Math.min(
    1.1,
    (GRAPH_WIDTH - PADDING * 2) / spanX,
    (GRAPH_HEIGHT - PADDING * 2) / spanY
  );
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  for (const node of nodes) {
    node.x = (node.x - centerX) * scale + GRAPH_WIDTH / 2;
    node.y = (node.y - centerY) * scale + GRAPH_HEIGHT / 2;
  }
}

/**
 * Run d3-force once with a fixed seed and return plain nodes and edges. The
 * result carries only summary fields — never a block's Markdown body.
 */
export function layoutBlockGraph(course, { type = "all", query = "" } = {}) {
  const filtered = filterBlocks(course?.blocks, { type, query });
  const ids = new Set(filtered.map((block) => block.id));
  const links = graphEdges(course?.blockEdges, ids);

  if (filtered.length === 0) {
    return { nodes: [], links: [], width: GRAPH_WIDTH, height: GRAPH_HEIGHT };
  }

  const degree = new Map(filtered.map((block) => [block.id, 0]));
  for (const link of links) {
    degree.set(link.from, degree.get(link.from) + 1);
    degree.set(link.to, degree.get(link.to) + 1);
  }

  const simNodes = filtered.map((block) => ({
    id: block.id,
    radius: 10 + Math.min(8, (degree.get(block.id) || 0) * 1.6),
  }));
  const simLinks = links.map((link) => ({
    source: link.from,
    target: link.to,
    kind: link.kind,
  }));

  const simulation = forceSimulation(simNodes)
    .randomSource(seededRandom(GRAPH_SEED))
    .force(
      "link",
      forceLink(simLinks)
        .id((node) => node.id)
        .distance(140)
        .strength(0.5)
    )
    .force("charge", forceManyBody().strength(-720).distanceMax(460))
    .force("x", forceX(GRAPH_WIDTH / 2).strength(0.03))
    .force("y", forceY(GRAPH_HEIGHT / 2).strength(0.03))
    .force(
      "collide",
      forceCollide((node) => node.radius + 30).iterations(3)
    )
    .stop();

  for (let tick = 0; tick < GRAPH_TICKS; tick += 1) simulation.tick();
  simulation.stop();
  fitToBox(simNodes);

  const positions = new Map(simNodes.map((node) => [node.id, node]));
  const nodes = filtered.map((block) => {
    const position = positions.get(block.id);
    return {
      id: block.id,
      title: block.title,
      label: shortLabel(block),
      summary: block.summary || "",
      type: block.type || "concept",
      radius: position.radius,
      x: position.x,
      y: position.y,
    };
  });

  return { nodes, links, width: GRAPH_WIDTH, height: GRAPH_HEIGHT };
}

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
 * Every node reachable from any of `focusIds` within `depth` edges, in either
 * direction. Returns null when there is no focus.
 */
export function localNodeIdsFromMany(edges, focusIds, depth = 1) {
  const seeds = (Array.isArray(focusIds) ? focusIds : []).filter(Boolean);
  if (seeds.length === 0) return null;

  const adjacency = new Map();
  for (const edge of Array.isArray(edges) ? edges : []) {
    const from = endpointId(edge?.from);
    const to = endpointId(edge?.to);
    if (!from || !to) continue;
    if (!adjacency.has(from)) adjacency.set(from, new Set());
    if (!adjacency.has(to)) adjacency.set(to, new Set());
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  }

  const seen = new Set(seeds);
  let frontier = [...seeds];
  for (let step = 0; step < depth && frontier.length > 0; step += 1) {
    const next = [];
    for (const id of frontier) {
      for (const neighbor of adjacency.get(id) || []) {
        if (seen.has(neighbor)) continue;
        seen.add(neighbor);
        next.push(neighbor);
      }
    }
    frontier = next;
  }
  return seen;
}

/**
 * Every node reachable from `focusId` within `depth` edges, in either
 * direction. Returns null when there is no focus.
 */
export function localNodeIds(edges, focusId, depth = 1) {
  if (!focusId) return null;
  return localNodeIdsFromMany(edges, [focusId], depth);
}

/**
 * The filtered graph as plain nodes and edges. The force simulation runs in
 * the viewer (react-force-graph), so this carries no positions; node size
 * follows how many edges touch it. With a `focus`, only the neighbourhood of
 * that block up to `depth` edges is kept.
 */
export function buildGraph(
  course,
  { type = "all", query = "", focus = null, focusIds = null, depth = 1 } = {}
) {
  const focusList =
    Array.isArray(focusIds) && focusIds.length > 0
      ? focusIds.filter(Boolean)
      : focus
        ? [focus]
        : null;
  const focusSet = focusList ? new Set(focusList) : null;
  const local = focusList
    ? localNodeIdsFromMany(course?.blockEdges, focusList, depth)
    : null;
  const blocks = filterBlocks(course?.blocks, { type, query }).filter(
    (block) => !local || local.has(block.id)
  );
  const ids = new Set(blocks.map((block) => block.id));
  const links = graphEdges(course?.blockEdges, ids);

  const degree = new Map(blocks.map((block) => [block.id, 0]));
  for (const link of links) {
    degree.set(link.from, degree.get(link.from) + 1);
    degree.set(link.to, degree.get(link.to) + 1);
  }

  const nodes = blocks.map((block) => {
    const count = degree.get(block.id) || 0;
    const isFocus = Boolean(focusSet && focusSet.has(block.id));
    return {
      id: block.id,
      title: block.title,
      label: shortLabel(block),
      summary: block.summary || "",
      type: block.type || "concept",
      degree: count,
      isFocus,
      radius: (10 + Math.min(8, count * 1.8)) * (isFocus ? 1.4 : 1),
    };
  });

  return { nodes, links };
}

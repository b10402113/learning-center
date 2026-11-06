/**
 * The app is served from Vite's `base` (e.g. `/learning-center/` on GitHub
 * Pages), so every href and every parsed pathname carries that prefix.
 */
const BASE = (import.meta.env?.BASE_URL || "/").replace(/\/+$/, "");

/** The subject index lives at `/`. All ids are null there. */
export function indexRoute() {
  return { subjectId: null, nodeId: null, stepId: null };
}

/**
 * Parse `/`, `/<subject>`, `/<subject>/<node>`, `/<subject>/<node>/<step>`,
 * the block index `/<subject>/blocks`, and one block's detail page
 * `/<subject>/blocks/<block>`. Returns null for anything else. The `blocks`
 * segment is reserved for block routes.
 */
export function parsePath(pathname = "/", base = BASE) {
  const prefix = String(base).replace(/\/+$/, "");
  let value = String(pathname).trim();
  if (prefix && (value === prefix || value.startsWith(`${prefix}/`))) {
    value = value.slice(prefix.length);
  }
  if (!value.startsWith("/")) value = `/${value}`;

  const parts = value.split("/").filter(Boolean);
  if (parts.length === 0) return indexRoute();
  if (parts.length > 3) return null;

  const subjectId = decodeURIComponent(parts[0]);
  if (parts[1] === "blocks") {
    return parts[2]
      ? {
          subjectId,
          nodeId: null,
          stepId: null,
          blockId: decodeURIComponent(parts[2]),
          blockRoute: true,
        }
      : {
          subjectId,
          nodeId: null,
          stepId: null,
          blocksRoute: true,
        };
  }

  return {
    subjectId,
    nodeId: parts[1] ? decodeURIComponent(parts[1]) : null,
    stepId: parts[2] ? decodeURIComponent(parts[2]) : null,
  };
}

/** Build a path for the subject index, one node, or one step. */
export function pathFor(subjectId, nodeId, stepId = null, base = BASE) {
  const prefix = String(base).replace(/\/+$/, "");
  const parts = [subjectId, nodeId, stepId]
    .filter((part) => part != null && part !== "")
    .map((part) => encodeURIComponent(part));
  return `${prefix}/${parts.join("/")}`;
}

/** Build the path for one block's detail page. */
export function pathForBlock(subjectId, blockId, base = BASE) {
  return pathFor(subjectId, "blocks", blockId, base);
}

/** Build the path for a subject's block index and knowledge graph. */
export function pathForBlocks(subjectId, base = BASE) {
  return pathFor(subjectId, "blocks", null, base);
}

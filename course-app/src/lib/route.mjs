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
 * Parse `/`, `/<subject>`, `/<subject>/<node>`, and
 * `/<subject>/<node>/<step>`. Returns null for anything else.
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

  return {
    subjectId: decodeURIComponent(parts[0]),
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

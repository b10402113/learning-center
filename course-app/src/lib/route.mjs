/** The subject index lives at `#/`. All ids are null there. */
export function indexRoute() {
  return { subjectId: null, nodeId: null, stepId: null };
}

/**
 * Parse `#/`, `#/<subject>`, `#/<subject>/<node>`, and
 * `#/<subject>/<node>/<step>`. Returns null for anything else.
 */
export function parseHash(hash = "") {
  const value = String(hash).trim();
  if (value === "" || value === "#" || value === "#/") return indexRoute();

  const m = value.match(
    /^#\/([^/?#]+)(?:\/([^/?#]+))?(?:\/([^/?#]+))?\/?$/
  );
  if (!m) return null;
  return {
    subjectId: decodeURIComponent(m[1]),
    nodeId: m[2] ? decodeURIComponent(m[2]) : null,
    stepId: m[3] ? decodeURIComponent(m[3]) : null,
  };
}

/** Build a hash for the subject index, one node, or one step. */
export function hashFor(subjectId, nodeId, stepId = null) {
  const parts = [subjectId, nodeId, stepId]
    .filter((part) => part != null && part !== "")
    .map((part) => encodeURIComponent(part));
  return `#/${parts.join("/")}`;
}

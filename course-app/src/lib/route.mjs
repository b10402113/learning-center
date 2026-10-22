/** Parse `#/<subject>/<node>` and `#/<subject>/<node>/<step>`. */
export function parseHash(hash = "") {
  const m = String(hash).match(
    /^#\/([^/?#]+)\/([^/?#]+)(?:\/([^/?#]+))?\/?$/
  );
  if (!m) return null;
  return {
    subjectId: decodeURIComponent(m[1]),
    nodeId: decodeURIComponent(m[2]),
    stepId: m[3] ? decodeURIComponent(m[3]) : null,
  };
}

/** Build a hash for one node or step. Empty ids are treated as absent. */
export function hashFor(subjectId, nodeId, stepId = null) {
  const parts = [subjectId, nodeId, stepId]
    .filter((part) => part != null && part !== "")
    .map((part) => encodeURIComponent(part));
  return `#/${parts.join("/")}`;
}

// Discriminated routing contract. The map route is the legacy `#s=<subject>&p=<node-id>`
// deep-link; the path-style routes are the standalone lesson (`#/nodes/…`) and
// element (`#/elements/…`) pages. An element route may carry a `?from=<node-id>`
// origin recording the teaching lesson the learner came from (ADR-0003).
export type Route =
  | { kind: "map"; subject: string | null; nodeId: string | null }
  | { kind: "node"; subject: string; nodeId: string }
  | { kind: "element"; subject: string; elementId: string; from: string | null }
  | { kind: "step"; subject: string; nodeId: string; stepId: string };

// Parse a path-style `#/<kind>/<subject>/<id>` hash into its parts.
function parsePathKind(
  raw: string,
  kind: "nodes" | "elements",
): { subject: string; id: string; query: string } | null {
  const prefix = `${kind}/`;
  if (!raw.startsWith(prefix)) return null;
  const rest = raw.slice(prefix.length);
  const slash = rest.indexOf("/");
  if (slash <= 0 || slash >= rest.length - 1) return null;
  // The id segment may be followed by a `?from=…` query string — split it off
  // so only the path participates in the id decode.
  const idSegment = rest.slice(slash + 1);
  const qIndex = idSegment.indexOf("?");
  const id = qIndex >= 0 ? idSegment.slice(0, qIndex) : idSegment;
  const query = qIndex >= 0 ? idSegment.slice(qIndex + 1) : "";
  try {
    return {
      subject: decodeURIComponent(rest.slice(0, slash)),
      id: decodeURIComponent(id),
      query,
    };
  } catch {
    // Malformed percent-encoding in the deep-link — fall back to the map
    // route so the app never white-screens.
    return null;
  }
}

// Parse a step path `#/steps/<subject>/<node-id>/<step-id>` into its parts. The
// step route is the only three-segment path route (a node owns its steps), so it
// parses its own shape instead of reusing the two-segment `parsePathKind`.
function parseStepPath(
  raw: string,
): { subject: string; nodeId: string; stepId: string } | null {
  const prefix = "steps/";
  if (!raw.startsWith(prefix)) return null;
  const rest = raw.slice(prefix.length);
  const parts = rest.split("/");
  if (parts.length !== 3) return null;
  const [subjectRaw, nodeRaw, stepRaw] = parts;
  if (!subjectRaw || !nodeRaw || !stepRaw) return null;
  // The step segment may carry a trailing `?query=…` — split it off so only the
  // path participates in the step decode.
  const qIndex = stepRaw.indexOf("?");
  const stepId = qIndex >= 0 ? stepRaw.slice(0, qIndex) : stepRaw;
  if (!stepId) return null;
  try {
    return {
      subject: decodeURIComponent(subjectRaw),
      nodeId: decodeURIComponent(nodeRaw),
      stepId: decodeURIComponent(stepId),
    };
  } catch {
    // Malformed percent-encoding — fall back to the map route.
    return null;
  }
}

// Read a hash string (with or without `#`) into a Route.
export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "").replace(/^\//, "");
  const stepPath = parseStepPath(raw);
  if (stepPath) {
    return {
      kind: "step",
      subject: stepPath.subject,
      nodeId: stepPath.nodeId,
      stepId: stepPath.stepId,
    };
  }
  const nodePath = parsePathKind(raw, "nodes");
  if (nodePath) return { kind: "node", subject: nodePath.subject, nodeId: nodePath.id };
  const elementPath = parsePathKind(raw, "elements");
  if (elementPath) {
    const from = new URLSearchParams(elementPath.query).get("from");
    return {
      kind: "element",
      subject: elementPath.subject,
      elementId: elementPath.id,
      from: from || null,
    };
  }
  const params = new URLSearchParams(raw);
  return { kind: "map", subject: params.get("s"), nodeId: params.get("p") };
}

// Build the canonical `#s=<subject>&p=<node-id>` map hash. Omits `p` when null so
// a subject-only view stays shareable.
export function buildHash(subject: string, nodeId: string | null): string {
  const params = new URLSearchParams();
  params.set("s", subject);
  if (nodeId) params.set("p", nodeId);
  const str = params.toString();
  return str ? `#${str}` : "";
}

// Build the canonical `#/nodes/<subject>/<node-id>` lesson deep-link.
export function buildNodeHash(subject: string, nodeId: string): string {
  return `#/nodes/${encodeURIComponent(subject)}/${encodeURIComponent(nodeId)}`;
}

// Build the canonical `#/elements/<subject>/<element-id>` element deep-link. A
// non-empty `from` origin is appended as `?from=<node-id>`.
export function buildElementHash(
  subject: string,
  elementId: string,
  from?: string | null,
): string {
  const base = `#/elements/${encodeURIComponent(subject)}/${encodeURIComponent(elementId)}`;
  if (!from) return base;
  return `${base}?from=${encodeURIComponent(from)}`;
}

// Build the canonical `#/steps/<subject>/<node-id>/<step-id>` step deep-link.
export function buildStepHash(subject: string, nodeId: string, stepId: string): string {
  return `#/steps/${encodeURIComponent(subject)}/${encodeURIComponent(nodeId)}/${encodeURIComponent(stepId)}`;
}

/**
 * Resolve the element page's breadcrumb "source lesson" (ADR-0003). The explicit
 * `?from` origin wins when it names a real node; otherwise the element's first
 * taught-by node is used; with none, the element has no source lesson. Pure —
 * the caller supplies the set of known node ids.
 */
export function resolveElementSource(
  from: string | null,
  taughtByNodes: readonly string[],
  knownNodeIds: ReadonlySet<string>,
): string | null {
  if (from && knownNodeIds.has(from)) return from;
  return taughtByNodes.find((id) => knownNodeIds.has(id)) ?? null;
}

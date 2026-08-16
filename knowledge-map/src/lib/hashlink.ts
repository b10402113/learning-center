// Discriminated routing contract. The map route is the legacy `#s=<subject>&p=<node-id>`
// deep-link; the path-style routes are the standalone lesson (`#/nodes/…`) and
// element (`#/elements/…`) pages.
export type Route =
  | { kind: "map"; subject: string | null; nodeId: string | null }
  | { kind: "node"; subject: string; nodeId: string }
  | { kind: "element"; subject: string; elementId: string };

// Parse a path-style `#/<kind>/<subject>/<id>` hash into its parts.
function parsePathKind(
  raw: string,
  kind: "nodes" | "elements",
): { subject: string; id: string } | null {
  const prefix = `${kind}/`;
  if (!raw.startsWith(prefix)) return null;
  const rest = raw.slice(prefix.length);
  const slash = rest.indexOf("/");
  if (slash <= 0 || slash >= rest.length - 1) return null;
  try {
    return {
      subject: decodeURIComponent(rest.slice(0, slash)),
      id: decodeURIComponent(rest.slice(slash + 1)),
    };
  } catch {
    // Malformed percent-encoding in the deep-link — fall back to the map
    // route so the app never white-screens.
    return null;
  }
}

// Read a hash string (with or without `#`) into a Route.
export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "").replace(/^\//, "");
  const nodePath = parsePathKind(raw, "nodes");
  if (nodePath) return { kind: "node", subject: nodePath.subject, nodeId: nodePath.id };
  const elementPath = parsePathKind(raw, "elements");
  if (elementPath) {
    return { kind: "element", subject: elementPath.subject, elementId: elementPath.id };
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

// Build the canonical `#/elements/<subject>/<element-id>` element deep-link.
export function buildElementHash(subject: string, elementId: string): string {
  return `#/elements/${encodeURIComponent(subject)}/${encodeURIComponent(elementId)}`;
}

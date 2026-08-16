// Discriminated routing contract. The map route is the legacy `#s=<subject>&p=<node-id>`
// deep-link; the element route is the path-style `#/elements/<subject>/<element-id>`.
export type Route =
  | { kind: "map"; subject: string | null; nodeId: string | null }
  | { kind: "element"; subject: string; elementId: string };

// Read a hash string (with or without `#`) into a Route.
export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "").replace(/^\//, "");
  if (raw.startsWith("elements/")) {
    const rest = raw.slice("elements/".length);
    const slash = rest.indexOf("/");
    if (slash > 0 && slash < rest.length - 1) {
      try {
        return {
          kind: "element",
          subject: decodeURIComponent(rest.slice(0, slash)),
          elementId: decodeURIComponent(rest.slice(slash + 1)),
        };
      } catch {
        // Malformed percent-encoding in the deep-link — fall back to the map
        // route so the app never white-screens.
        return { kind: "map", subject: null, nodeId: null };
      }
    }
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

// Build the canonical `#/elements/<subject>/<element-id>` element deep-link.
export function buildElementHash(subject: string, elementId: string): string {
  return `#/elements/${encodeURIComponent(subject)}/${encodeURIComponent(elementId)}`;
}

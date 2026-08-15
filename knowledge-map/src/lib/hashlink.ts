export interface HashState {
  subject: string | null;
  nodeId: string | null;
}

// Read `#s=<subject>&p=<node-id>` from a hash string (with or without `#`).
export function parseHash(hash: string): HashState {
  const raw = hash.replace(/^#/, "");
  const params = new URLSearchParams(raw);
  return { subject: params.get("s"), nodeId: params.get("p") };
}

// Build the canonical `#s=<subject>&p=<node-id>` hash. Omits `p` when null so a
// subject-only view stays shareable.
export function buildHash(subject: string, nodeId: string | null): string {
  const params = new URLSearchParams();
  params.set("s", subject);
  if (nodeId) params.set("p", nodeId);
  const str = params.toString();
  return str ? `#${str}` : "";
}

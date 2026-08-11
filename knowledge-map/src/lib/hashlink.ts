export interface HashState {
  subject: string | null;
  pathId: string | null;
}

// Read `#s=<subject>&p=<path-id>` from a hash string (with or without `#`).
export function parseHash(hash: string): HashState {
  const raw = hash.replace(/^#/, "");
  const params = new URLSearchParams(raw);
  return { subject: params.get("s"), pathId: params.get("p") };
}

// Build the canonical `#s=<subject>&p=<path-id>` hash. Omits `p` when null so a
// subject-only view stays shareable.
export function buildHash(subject: string, pathId: string | null): string {
  const params = new URLSearchParams();
  params.set("s", subject);
  if (pathId) params.set("p", pathId);
  const str = params.toString();
  return str ? `#${str}` : "";
}

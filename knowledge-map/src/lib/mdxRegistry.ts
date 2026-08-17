import type { ComponentType } from "react";

type MdxComponent = ComponentType<{ components?: Record<string, ComponentType | string> }>;

// Vite resolves these at build/dev time. Keys look like
// `@learn/<subject>/nodes/<id>.md(x)`, `@learn/<subject>/elements/<id>.md(x)`,
// and `@learn/<subject>/nodes/<node-id>/<step-id>.md(x)` (steps nest under a
// node directory, ADR-0004).
const modules = import.meta.glob("@learn/*/{nodes,elements}/*.{md,mdx}", {
  eager: true,
  import: "default",
}) as Record<string, MdxComponent>;
const stepModules = import.meta.glob("@learn/*/nodes/*/*.{md,mdx}", {
  eager: true,
  import: "default",
}) as Record<string, MdxComponent>;

type Kind = "nodes" | "elements" | "steps";

function parseKey(
  key: string,
): { subject: string; kind: Kind; id: string; nodeId: string | null } | null {
  // Vite resolves the @learn alias before the glob runs, so keys are relative
  // to this module (e.g. `../learn/<subject>/nodes/<id>.mdx` or
  // `../learn/<subject>/nodes/<node-id>/<step-id>.mdx`).
  // Steps nest one level deeper than nodes/elements — match them first so the
  // node-level regex below cannot swallow a step path's trailing segment.
  const step = key.match(/([^/]+)\/nodes\/([^/]+)\/([^/]+)\.mdx?$/);
  if (step) return { subject: step[1], kind: "steps", nodeId: step[2], id: step[3] };
  const m = key.match(/([^/]+)\/(nodes|elements)\/([^/]+)\.mdx?$/);
  if (!m) return null;
  return { subject: m[1], kind: m[2] as Kind, id: m[3], nodeId: null };
}

const nodeByKey = new Map<string, MdxComponent>();
const elementByKey = new Map<string, MdxComponent>();
const stepByKey = new Map<string, MdxComponent>();

for (const [key, component] of Object.entries(modules)) {
  const parsed = parseKey(key);
  if (!parsed) continue;
  const mapKey = `${parsed.subject}/${parsed.id}`;
  if (parsed.kind === "nodes") nodeByKey.set(mapKey, component);
  else elementByKey.set(mapKey, component);
}

for (const [key, component] of Object.entries(stepModules)) {
  const parsed = parseKey(key);
  if (!parsed || parsed.kind !== "steps") continue;
  stepByKey.set(`${parsed.subject}/${parsed.nodeId}/${parsed.id}`, component);
}

/** Compiled MDX article for a node, keyed `subject/id`. */
export function getNodeMdx(subject: string, id: string): MdxComponent | null {
  return nodeByKey.get(`${subject}/${id}`) ?? null;
}

/** Compiled MDX article for an element, keyed `subject/id`. */
export function getElementMdx(subject: string, id: string): MdxComponent | null {
  return elementByKey.get(`${subject}/${id}`) ?? null;
}

/** Compiled MDX article for a step, keyed `subject/nodeId/stepId`. */
export function getStepMdx(subject: string, nodeId: string, stepId: string): MdxComponent | null {
  return stepByKey.get(`${subject}/${nodeId}/${stepId}`) ?? null;
}

import type { ComponentType } from "react";

type MdxComponent = ComponentType<{ components?: Record<string, ComponentType | string> }>;

// Vite resolves these at build/dev time. Keys look like
// `@learn/<subject>/nodes/<id>.mdx` and `@learn/<subject>/elements/<id>.mdx`.
const modules = import.meta.glob("@learn/*/{nodes,elements}/*.mdx", {
  eager: true,
  import: "default",
}) as Record<string, MdxComponent>;

type Kind = "nodes" | "elements";

function parseKey(key: string): { subject: string; kind: Kind; id: string } | null {
  // Vite resolves the @learn alias before the glob runs, so keys are relative
  // to this module (e.g. `../learn/<subject>/nodes/<id>.mdx`).
  const m = key.match(/([^/]+)\/(nodes|elements)\/([^/]+)\.mdx$/);
  if (!m) return null;
  return { subject: m[1], kind: m[2] as Kind, id: m[3] };
}

const nodeByKey = new Map<string, MdxComponent>();
const elementByKey = new Map<string, MdxComponent>();

for (const [key, component] of Object.entries(modules)) {
  const parsed = parseKey(key);
  if (!parsed) continue;
  const mapKey = `${parsed.subject}/${parsed.id}`;
  if (parsed.kind === "nodes") nodeByKey.set(mapKey, component);
  else elementByKey.set(mapKey, component);
}

/** Compiled MDX article for a node, keyed `subject/id`. */
export function getNodeMdx(subject: string, id: string): MdxComponent | null {
  return nodeByKey.get(`${subject}/${id}`) ?? null;
}

/** Compiled MDX article for an element, keyed `subject/id`. */
export function getElementMdx(subject: string, id: string): MdxComponent | null {
  return elementByKey.get(`${subject}/${id}`) ?? null;
}

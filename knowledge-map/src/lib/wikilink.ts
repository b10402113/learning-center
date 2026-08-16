// Client-side wikilink target parser. The MDX `a` override (`WikiLink`) stamps
// `data-target="learn/<subject>/<kind>/<id>"` on in-app navigation anchors; this
// turns that back into a structured destination. Shared by the reader modal and
// the standalone docs page so article-internal jumps behave identically
// everywhere.
export function parseWikilinkTarget(
  target: string,
): { subject: string; kind: "element" | "node"; id: string } | null {
  const m = target.match(/^learn\/([^/]+)\/(elements|nodes)\/([^#/]+)/);
  if (!m) return null;
  return { subject: m[1], kind: m[2] === "elements" ? "element" : "node", id: m[3] };
}

// Walk a click event up to a `a.wikilink` and classify its destination. Both
// reading surfaces delegate article clicks through this so the jump behaviour
// never drifts.
export function findWikilinkTarget(event: {
  target: EventTarget | null;
}): { subject: string; kind: "element" | "node"; id: string } | null {
  const el = event.target as HTMLElement | null;
  const anchor = el?.closest("a.wikilink");
  if (!anchor) return null;
  const target = anchor.getAttribute("data-target");
  if (!target) return null;
  return parseWikilinkTarget(target);
}

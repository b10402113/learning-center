import type { Link, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

type WikiPart =
  | { type: "text"; value: string }
  | { type: "wiki"; target: string; label: string };

/**
 * Split a string on Obsidian-style `[[target|label]]` wikilinks. Returns a
 * list of plain text runs and wikilink parts. Nested brackets are not handled
 * (learn content does not use them).
 */
export function splitWikiLinks(value: string): WikiPart[] {
  const parts: WikiPart[] = [];
  const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: value.slice(last, m.index) });
    const target = m[1].trim();
    const label = m[2] ? m[2].trim() : target.split("/").pop() ?? target;
    parts.push({ type: "wiki", target, label });
    last = m.index + m[0].length;
  }
  if (last < value.length) parts.push({ type: "text", value: value.slice(last) });
  return parts;
}

/**
 * remark plugin: convert Obsidian `[[...]]` wikilinks in text nodes into
 * markdown links with a `km:` URL scheme. The app maps `a` (via the MDX
 * `components` prop) to a component that either navigates in-app (`km:learn/…`)
 * or renders a source reference (`km:sources/…`).
 */
export function remarkWikiLinks() {
  return (tree: Root) => {
    visit(tree, "text", (node, index, parent) => {
      if (index == null || !parent) return;
      const parts = splitWikiLinks(node.value);
      if (parts.length === 1 && parts[0].type === "text") return;
      const children = parts.map((part): Text | Link => {
        if (part.type === "text") return { type: "text", value: part.value };
        return {
          type: "link",
          url: `km:${part.target}`,
          children: [{ type: "text", value: part.label }],
        };
      });
      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}
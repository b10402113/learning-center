/**
 * Heading anchors shared by build-data and the Markdown renderer.
 *
 * The course app has no heading ids in the source Markdown. `extractHeadings`
 * runs at build time to produce the step's TOC, and `rehypeHeadingIds` runs at
 * render time to stamp the matching ids onto the rendered `<h2>` / `<h3>`.
 * Both go through `slugifyHeading` and `uniqueSlug`, so the two sides cannot
 * drift apart.
 */

const HEADING_LEVELS = new Set([2, 3]);

/** Strip inline Markdown so TOC text matches the rendered heading text. */
export function headingText(value) {
  return String(value ?? "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/`+([^`]*)`+/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** CJK-safe slug: keep letters and numbers, turn everything else into `-`. */
export function slugifyHeading(value) {
  const slug = String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}

/** Append `-2`, `-3`… for repeated headings. */
export function uniqueSlug(base, seen) {
  const count = (seen.get(base) || 0) + 1;
  seen.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
}

/**
 * Pull `##` / `###` headings out of a Markdown document, skipping fenced code.
 * Returns `{ depth, text, id }` in document order.
 */
export function extractHeadings(markdown) {
  const headings = [];
  const seen = new Map();
  let fence = null;

  for (const line of String(markdown ?? "").split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!fence) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence) continue;

    const match = line.match(/^(#{1,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const depth = match[1].length;
    if (!HEADING_LEVELS.has(depth)) continue;

    const text = headingText(match[2]);
    if (!text) continue;
    const id = uniqueSlug(slugifyHeading(text), seen);
    headings.push({ depth, text, id });
  }

  return headings;
}

function textContent(node) {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map(textContent).join("");
}

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  visit(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visit);
  }
}

/** Rehype plugin: give every `h2` / `h3` the id the TOC expects. */
export function rehypeHeadingIds() {
  return (tree) => {
    const seen = new Map();
    walk(tree, (node) => {
      if (node.type !== "element") return;
      const level = Number(String(node.tagName || "").replace(/^h/, ""));
      if (!HEADING_LEVELS.has(level)) return;
      const text = headingText(textContent(node));
      if (!text) return;
      node.properties = node.properties || {};
      node.properties.id = uniqueSlug(slugifyHeading(text), seen);
    });
  };
}

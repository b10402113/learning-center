import { pathForBlock } from "./route.mjs";

const WIKILINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

/**
 * Turn `[[block-id]]` / `[[block-id|label]]` into an in-app Markdown link.
 * Source citations keep their `[[sources/...]]` form and are left alone.
 */
export function replaceBlockLinks(markdown, subjectId, knownIds = null) {
  if (!subjectId) return String(markdown ?? "");
  const known = knownIds ? new Set(knownIds) : null;
  return String(markdown ?? "")
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part.replace(WIKILINK, (match, target, label) => {
        const id = String(target ?? "").trim();
        if (!id || id.startsWith("sources/") || id.includes("/")) return match;
        if (known && !known.has(id)) return match;
        const text = String(label ?? id).trim() || id;
        return `[${text}](${pathForBlock(subjectId, id)})`;
      });
    })
    .join("");
}

const DERIVED_COMMENT = /^<!--\s*derived\s*-->$/;
const SOURCE_COMMENT = /^<!--\s*source:\s*sources\/.+#L\d+(?:-L\d+)?\s*-->$/;
const FENCE_OPEN = /^\s*(`{3,}|~{3,})\s*([^\s`]*)/;

export function isProvenanceLine(line) {
  const trimmed = String(line ?? "").trim();
  return DERIVED_COMMENT.test(trimmed) || SOURCE_COMMENT.test(trimmed);
}

/**
 * Every fenced block except a `quiz` fence must be preceded by a provenance
 * comment. Returns the offending blocks with their 1-based opening line.
 */
export function unprovenancedBlocks(markdown) {
  const lines = String(markdown ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!fence) {
      const match = line.match(FENCE_OPEN);
      if (!match) continue;
      fence = { marker: match[1], lang: match[2] || "", line: index + 1 };
      continue;
    }
    if (!line.trim().startsWith(fence.marker)) continue;
    const closed = fence;
    fence = null;
    if (closed.lang === "quiz") continue;
    let previous = closed.line - 2;
    while (previous >= 0 && lines[previous].trim() === "") previous -= 1;
    if (previous >= 0 && isProvenanceLine(lines[previous])) continue;
    blocks.push({ line: closed.line, lang: closed.lang });
  }

  return blocks;
}

/**
 * Deterministic repair: put `<!-- derived -->` above every fenced block that
 * has no provenance comment. Used as the last step of compose so the original
 * never reaches polish/publish with an unexplained code block.
 */
export function addDerivedProvenance(markdown) {
  const blocks = unprovenancedBlocks(markdown);
  if (blocks.length === 0) return { text: markdown, added: 0 };
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const targets = new Set(blocks.map((block) => block.line));
  const out = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (targets.has(index + 1)) {
      out.push("<!-- derived -->", "");
    }
    out.push(lines[index]);
  }
  return { text: out.join("\n"), added: blocks.length };
}

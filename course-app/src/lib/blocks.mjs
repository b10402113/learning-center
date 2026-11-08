const BLOCK_TYPE_LABELS = {
  concept: "概念",
  procedure: "流程",
  principle: "原則",
  contrast: "對比",
};

const BLOCK_TYPE_MARKS = {
  concept: "●",
  procedure: "▤",
  principle: "◆",
  contrast: "⇄",
};

const BLOCK_TYPE_FILLS = {
  concept: "var(--color-surface)",
  procedure: "var(--color-shade)",
  principle: "var(--color-accent)",
  contrast: "var(--color-dark)",
};

export const RAIL_LIMIT = 6;

export const ENTITY_LABELS = { block: "知識點", step: "步驟", node: "節點" };
const ENTITY_MARKS = { step: "▸", node: "◈" };

export function entityLabel(entity) {
  return ENTITY_LABELS[entity] || ENTITY_LABELS.block;
}

/** A graph node's glyph: block type marks, plus a step and node mark. */
export function graphNodeMark(node) {
  if (node?.entity === "block") return blockTypeMark(node.type);
  return ENTITY_MARKS[node?.entity] ?? "";
}

export function blockTypeLabel(type) {
  return BLOCK_TYPE_LABELS[type] || type || "概念";
}

/** A short glyph for graph nodes; colours alone would not be accessible. */
export function blockTypeMark(type) {
  return BLOCK_TYPE_MARKS[type] || BLOCK_TYPE_MARKS.concept;
}

export function blockTypeFill(type) {
  return BLOCK_TYPE_FILLS[type] || BLOCK_TYPE_FILLS.concept;
}

/** Ink that stays legible on top of the type's fill. */
export function blockTypeInk(type) {
  return type === "contrast" ? "var(--color-paper)" : "var(--color-ink)";
}

export function blockIndex(course) {
  return new Map(
    (Array.isArray(course?.blocks) ? course.blocks : []).map((block) => [
      block.id,
      block,
    ])
  );
}

/** The step's blocks, plus their prerequisites that the step does not cover. */
export function railBlocks(course, step, limit = RAIL_LIMIT) {
  const own = Array.isArray(step?.blocks) ? step.blocks : [];
  const byId = blockIndex(course);
  const seen = new Set();
  const items = [];

  for (const block of own) {
    if (!block?.id || seen.has(block.id)) continue;
    seen.add(block.id);
    items.push({ ...block, prerequisite: false });
  }
  for (const block of own) {
    if (items.length >= limit) break;
    for (const id of block?.prerequisites || []) {
      if (items.length >= limit) break;
      if (seen.has(id)) continue;
      const prerequisite = byId.get(id);
      if (!prerequisite) continue;
      seen.add(id);
      items.push({ ...prerequisite, prerequisite: true });
    }
  }
  return items;
}

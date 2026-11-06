const BLOCK_TYPE_LABELS = {
  concept: "概念",
  procedure: "流程",
  principle: "原則",
  contrast: "對比",
};

export const RAIL_LIMIT = 6;

export function blockTypeLabel(type) {
  return BLOCK_TYPE_LABELS[type] || type || "概念";
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

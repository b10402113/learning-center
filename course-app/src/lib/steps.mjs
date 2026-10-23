/**
 * Find the steps before and after `stepId` in a node's `steps` array order.
 * The first step has no previous; the last step has no next.
 */
export function stepNeighbors(steps, stepId) {
  const list = Array.isArray(steps) ? steps : [];
  const index = list.findIndex((step) => step.id === stepId);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? list[index - 1] : null,
    next: index + 1 < list.length ? list[index + 1] : null,
  };
}

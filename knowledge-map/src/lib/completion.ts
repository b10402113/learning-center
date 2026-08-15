/**
 * Checklist completion derivation (ADR 0002). Pure functions only: a node is
 * complete when every checklist item — its taught elements plus the final
 * "main" article — is in the manual completion set. No storage or DOM access.
 */

export type CompletionItem =
  | { kind: "element"; id: string }
  | { kind: "main"; id: string };

/** The slice of a node the derivation reads. */
export interface NodeItemsSource {
  id: string;
  taughtElementIds: string[];
}

export function nodeItems(node: NodeItemsSource): CompletionItem[] {
  const items: CompletionItem[] = node.taughtElementIds.map((id) => ({
    kind: "element",
    id,
  }));
  // The main item's completion id is the node's own id — node and element ids
  // live in disjoint spaces, so they can never collide.
  items.push({ kind: "main", id: node.id });
  return items;
}

export function isNodeComplete(
  node: NodeItemsSource,
  manualElements: ReadonlySet<string>,
): boolean {
  return nodeItems(node).every((item) => manualElements.has(item.id));
}

/**
 * A question element's check is locked until the in-app quiz is answered
 * correctly (self-test, not a gate on the rest of the course). Already-checked
 * rows stay uncheckable-able; the lock only blocks marking complete.
 */
export function isCompletionLocked(
  elementType: string | undefined,
  checked: boolean,
  quizSolved: boolean,
): boolean {
  return elementType === "question" && !checked && !quizSolved;
}

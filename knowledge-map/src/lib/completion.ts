/**
 * Step-based completion derivation (ADR-0005). Pure functions only: a step is
 * complete when it is in the manual completion set or the generate-time seed
 * set, unless the learner explicitly cleared it (manual override wins over a
 * seed). A node is complete iff every step in its DAG is complete. Elements
 * are keywords and never marked complete. No storage or DOM access.
 */

export interface CompletionInput {
  /**
   * Node-qualified step ids seeded complete from `learn/<subject>/mastery.md`
   * at generate time (read-only, ships in `graph.json`).
   */
  seeded: ReadonlySet<string>;
  /** Node-qualified step ids the learner manually marked complete. */
  manual: ReadonlySet<string>;
  /** Node-qualified step ids the learner manually cleared, overriding a seed. */
  cleared: ReadonlySet<string>;
}

export function isStepComplete(stepId: string, input: CompletionInput): boolean {
  // Manual state is authoritative: a manual mark beats a cleared seed, and a
  // manual clear beats a seed. The seed only fills in steps never touched.
  if (input.manual.has(stepId)) return true;
  if (input.cleared.has(stepId)) return false;
  return input.seeded.has(stepId);
}

/**
 * A node is complete iff every step in its DAG is complete. A node with no
 * steps has no completion signal (legacy single-article nodes are unsupported)
 * and is never complete.
 */
export function nodeCompletion(
  stepIds: readonly string[],
  input: CompletionInput,
): boolean {
  if (stepIds.length === 0) return false;
  return stepIds.every((id) => isStepComplete(id, input));
}
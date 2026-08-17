/**
 * Step-based completion derivation (ADR-0005). Pure functions only: a step is
 * complete when it is in the manual completion set or the generate-time seed
 * set, unless the learner explicitly cleared it (manual override wins over a
 * seed). A node is complete iff every step in its DAG is complete. Elements
 * are keywords and never marked complete. No storage or DOM access.
 */

import type { Step } from "./types";

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

/**
 * The node's steps in reading order (by `order`), for DAG-based completion and
 * the step checklist. Shared by the app's node-completion derivation and the
 * node page so "a node's steps" has one definition.
 */
export function stepsOfNode(steps: Record<string, Step>, nodeId: string): Step[] {
  return Object.values(steps)
    .filter((s) => s.nodeId === nodeId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Toggle one step's completion under the same precedence `isStepComplete`
 * uses, so the UI's toggle can never drift from the derivation: un-checking a
 * seeded step records a clear; re-checking records a manual mark (which beats
 * the clear). Returns the next manual/cleared arrays for the progress record.
 */
export function toggleStep(
  stepId: string,
  input: CompletionInput,
): { steps: string[]; cleared: string[] } {
  const manual = new Set(input.manual);
  const cleared = new Set(input.cleared);
  if (isStepComplete(stepId, input)) {
    if (manual.has(stepId)) manual.delete(stepId);
    else cleared.add(stepId);
  } else {
    cleared.delete(stepId);
    manual.add(stepId);
  }
  return { steps: [...manual], cleared: [...cleared] };
}

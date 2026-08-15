export const STORAGE_KEY = "knowledge-map:progress";

export interface SubjectProgress {
  /**
   * Ids the learner manually checked complete: element ids, plus node ids for
   * a node's final "main" article row (see nodeItems in lib/completion). Node
   * completion is derived from this set — it is never stored separately.
   */
  elements: string[];
}

export type ProgressRecord = {
  [subject: string]: SubjectProgress;
};

export function emptySubjectProgress(): SubjectProgress {
  return { elements: [] };
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((x): x is string => typeof x === "string")
    : [];
}

export function parseProgress(raw: string | null): ProgressRecord {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const record: ProgressRecord = {};
    for (const [subject, value] of Object.entries(parsed)) {
      if (Array.isArray(value)) {
        // Legacy shape: a bare array per subject held gating-era node ids.
        // There is no element data to recover, so it becomes empty.
        record[subject] = { elements: [] };
      } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        // Legacy three-column shape: element completions live under `elements`
        // (post-rename) or, in older stored data, under `nodes`. Path/node ids
        // and beaten-tier marks are gone with the gating model.
        const { elements, nodes } = value as Record<string, unknown>;
        const elementIds = Array.isArray(elements)
          ? elements
          : Array.isArray(nodes)
            ? nodes
            : [];
        record[subject] = { elements: toStringArray(elementIds) };
      }
    }
    return record;
  } catch {
    return {};
  }
}

export function loadProgress(): ProgressRecord {
  return parseProgress(window.localStorage.getItem(STORAGE_KEY));
}

export function saveProgress(record: ProgressRecord): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

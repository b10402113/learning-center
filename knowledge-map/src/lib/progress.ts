export const STORAGE_KEY = "knowledge-map:progress";

export interface SubjectProgress {
  /**
   * Node-qualified step ids the learner manually marked complete (ADR-0005).
   * Steps are the only completion unit; element completions no longer exist.
   */
  steps: string[];
  /**
   * Node-qualified step ids the learner manually cleared, overriding a
   * generate-time seed back to incomplete. Manual state wins over a seed.
   */
  cleared: string[];
}

export type ProgressRecord = {
  [subject: string]: SubjectProgress;
};

export function emptySubjectProgress(): SubjectProgress {
  return { steps: [], cleared: [] };
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((x): x is string => typeof x === "string")
    : [];
}

// A node-qualified step id is always `<nodeId>/<stepId>` — it contains a slash.
// Legacy data stored element ids and node "main" ids, neither of which can be a
// step id; those completions are retired and drop away on migration.
function toStepIds(value: unknown): string[] {
  return toStringArray(value).filter((x) => x.includes("/"));
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
        // There is no step data to recover, so it becomes empty.
        record[subject] = emptySubjectProgress();
      } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        const v = value as Record<string, unknown>;
        if (Array.isArray(v.steps) || Array.isArray(v.cleared)) {
          // Current step-based shape.
          record[subject] = {
            steps: toStringArray(v.steps),
            cleared: toStringArray(v.cleared),
          };
        } else {
          // Legacy three-column shape: element completions lived under
          // `elements` (post-rename) or, in older stored data, under `nodes`.
          // Only ids shaped like node-qualified step ids are preserved.
          const legacy = Array.isArray(v.elements) ? v.elements : Array.isArray(v.nodes) ? v.nodes : [];
          record[subject] = { steps: toStepIds(legacy), cleared: [] };
        }
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
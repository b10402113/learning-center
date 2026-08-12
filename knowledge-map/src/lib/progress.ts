export const STORAGE_KEY = "knowledge-map:progress";

export interface SubjectProgress {
  /** Path ids the learner manually marked complete. */
  paths: string[];
  /** Node ids the learner read and marked complete. */
  nodes: string[];
  /** Tier numbers whose boss battle was beaten ("1", "2", …). */
  tiers: string[];
}

export type ProgressRecord = {
  [subject: string]: SubjectProgress;
};

export function emptySubjectProgress(): SubjectProgress {
  return { paths: [], nodes: [], tiers: [] };
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
        // Legacy shape: a bare array per subject. Treat it as the paths list.
        record[subject] = { ...emptySubjectProgress(), paths: toStringArray(value) };
      } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        const { paths, nodes, tiers } = value as Record<string, unknown>;
        record[subject] = {
          ...emptySubjectProgress(),
          paths: toStringArray(paths),
          nodes: toStringArray(nodes),
          tiers: toStringArray(tiers),
        };
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

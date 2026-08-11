export const STORAGE_KEY = "knowledge-map:progress";

export interface ProgressRecord {
  [subject: string]: string[];
}

export function parseProgress(raw: string | null): ProgressRecord {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const record: ProgressRecord = {};
    for (const [subject, value] of Object.entries(parsed)) {
      if (Array.isArray(value)) {
        record[subject] = value.filter((x): x is string => typeof x === "string");
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

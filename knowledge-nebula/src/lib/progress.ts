const KEY = "knowledge-map:progress"

export type ProgressMap = Record<string, string[]>

function safeParse(raw: string | null): ProgressMap {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: ProgressMap = {}
      for (const [subject, ids] of Object.entries(parsed)) {
        if (Array.isArray(ids)) {
          out[subject] = ids.filter((x): x is string => typeof x === "string")
        }
      }
      return out
    }
  } catch {
    // corrupted storage degrades to empty
  }
  return {}
}

export function loadProgress(): ProgressMap {
  if (typeof localStorage === "undefined") return {}
  return safeParse(localStorage.getItem(KEY))
}

export function saveProgress(map: ProgressMap): void {
  if (typeof localStorage === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(map))
  } catch {
    // ignore quota / privacy-mode failures
  }
}

export function toggleComplete(
  map: ProgressMap,
  subject: string,
  pathId: string,
): ProgressMap {
  const current = new Set(map[subject] ?? [])
  if (current.has(pathId)) current.delete(pathId)
  else current.add(pathId)
  return { ...map, [subject]: [...current] }
}

export function resetSubject(map: ProgressMap, subject: string): ProgressMap {
  const next = { ...map }
  delete next[subject]
  return next
}

export function isManuallyComplete(
  map: ProgressMap,
  subject: string,
  pathId: string,
): boolean {
  return (map[subject] ?? []).includes(pathId)
}

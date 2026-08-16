import type { PathNode, Subject } from "@/types"
import { isAutoCharted } from "./colors"
import type { ProgressMap } from "./progress"

export interface SubjectStat {
  plates: number
  charted: number
}

export function subjectStat(subject: Subject, progress: ProgressMap): SubjectStat {
  const manual = new Set(progress[subject.id] ?? [])
  let charted = 0
  for (const p of subject.paths) {
    if (isAutoCharted(p.status) || manual.has(p.id)) charted++
  }
  return { plates: subject.paths.length, charted }
}

export function isLit(
  path: PathNode,
  subjectId: string,
  progress: ProgressMap,
): boolean {
  const manual = new Set(progress[subjectId] ?? [])
  return isAutoCharted(path.status) || manual.has(path.id)
}

export function firstUnchartedInSpine(
  subject: Subject,
  progress: ProgressMap,
): PathNode | null {
  const sorted = [...subject.paths].sort((a, b) => a.spineOrder - b.spineOrder)
  for (const p of sorted) {
    if (!isLit(p, subject.id, progress)) return p
  }
  return null
}

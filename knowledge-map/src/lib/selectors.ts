import { isWritten } from "./colors";
import type { SubjectProgress } from "./progress";
import type { PathNode, SubjectGraph } from "./types";

export interface UnlockOptions {
  /**
   * Fraction (0..1) of the previous tier's paths that must be charted before
   * this tier unlocks. Default 1 (all paths). A path is charted when its
   * status is content-written/edges-written or it is manually completed.
   */
  pathsThreshold?: number;
  /**
   * Fraction (0..1) of the previous tier's nodes that must be charted before
   * this tier unlocks. Default undefined (node coverage not required).
   */
  nodesThreshold?: number;
}

/**
 * Whether a tier's content may be formally progressed (paths markable, next
 * tier's boss reachable). Tier 1 is the entrance floor and is always unlocked.
 * Every higher tier unlocks only after the previous tier's boss was beaten
 * (recorded in `progress.tiers`) and the previous tier's content is charted —
 * optionally keyed on node coverage as well.
 */
export function tierIsUnlocked(
  graph: SubjectGraph,
  tier: number,
  progress: SubjectProgress,
  opts: UnlockOptions = {},
): boolean {
  if (tier <= 1) return true;
  const prev = tier - 1;
  if (!progress.tiers.includes(String(prev))) return false;
  if (!tierIsUnlocked(graph, prev, progress, opts)) return false;
  const prevTier = graph.tiers.find((t) => t.tier === prev);
  if (!prevTier) return false;

  const manualPaths = new Set(progress.paths);
  const charted = new Set(
    graph.paths
      .filter((p) => isWritten(p.status) || manualPaths.has(p.id))
      .map((p) => p.id),
  );
  const total = prevTier.pathIds.length;
  const covered = total === 0 ? 1 : prevTier.pathIds.filter((id) => charted.has(id)).length / total;
  if (covered < (opts.pathsThreshold ?? 1)) return false;

  const nodesThreshold = opts.nodesThreshold;
  if (nodesThreshold !== undefined) {
    const nodeIds = Object.values(graph.nodes)
      .filter((n) => n.tier === prev)
      .map((n) => n.id);
    if (nodeIds.length > 0) {
      const coveredNodes = nodeIds.filter((id) => progress.nodes.includes(id)).length / nodeIds.length;
      if (coveredNodes < nodesThreshold) return false;
    }
  }

  return true;
}

/** Boss-gate lifecycle of one tier, used to render lock styles and the gate. */
export type TierBossState = "locked" | "open" | "ready" | "beaten";

/**
 * The boss-gate state of one tier:
 * - `"locked"`: the tier is not unlocked yet — its tiles render dimmed and its
 *   paths cannot be marked complete, though content stays readable.
 * - `"open"`: unlocked but not every path in the tier is charted; the boss
 *   gate is not reachable yet.
 * - `"ready"`: unlocked and every path in the tier is charted, but this tier's
 *   boss was not beaten — the boss-gate entrance is shown.
 * - `"beaten"`: the tier records a beaten boss in `progress.tiers`.
 *
 * The unlock chain is checked first, so a tier that re-locks (e.g. an earlier
 * path was unmarked) reports `"locked"` again instead of a stale "beaten".
 */
export function tierBossState(
  graph: SubjectGraph,
  tier: number,
  progress: SubjectProgress,
  opts: UnlockOptions = {},
): TierBossState {
  if (!tierIsUnlocked(graph, tier, progress, opts)) return "locked";

  const tierDef = graph.tiers.find((t) => t.tier === tier);
  if (!tierDef) return "locked";
  if (progress.tiers.includes(String(tier))) return "beaten";

  // A tier with no paths is trivially fully charted, so its boss gate can be
  // reached (mirrors tierIsUnlocked treating an empty previous tier as covered).
  const manual = new Set(progress.paths);
  const allCharted =
    tierDef.pathIds.length === 0 ||
    tierDef.pathIds.every((id) => {
      const p = graph.paths.find((q) => q.id === id);
      return isWritten(p?.status ?? "") || manual.has(id);
    });
  return allCharted ? "ready" : "open";
}

export function chartedCount(graph: SubjectGraph, manual: Set<string>): number {
  return graph.paths.filter((p) => isWritten(p.status) || manual.has(p.id)).length;
}

// The first path in spine order that is neither auto-written nor manually
// completed. Spine order is recovered by walking the spine edges; anything not
// on the chain (e.g. a branch) appends in (tier, order) sequence.
export function firstUnchartedInSpine(
  graph: SubjectGraph,
  manual: Set<string>,
): PathNode | null {
  const byFrom = new Map<string, string>();
  const hasIncoming = new Set<string>();
  for (const e of graph.edges) {
    if (e.kind !== "spine") continue;
    byFrom.set(e.from, e.to);
    hasIncoming.add(e.to);
  }

  const byId = new Map(graph.paths.map((p) => [p.id, p]));
  const order: string[] = [];
  const visited = new Set<string>();
  const byTierOrder = [...graph.paths].sort(
    (a, b) => a.tier - b.tier || a.order - b.order,
  );

  const walk = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    order.push(id);
    const next = byFrom.get(id);
    if (next && !visited.has(next)) walk(next);
  };

  for (const p of byTierOrder) {
    if (!hasIncoming.has(p.id)) walk(p.id);
  }
  for (const p of byTierOrder) {
    if (!visited.has(p.id)) walk(p.id);
  }

  for (const id of order) {
    const p = byId.get(id);
    if (p && !isWritten(p.status) && !manual.has(id)) return p;
  }
  return null;
}

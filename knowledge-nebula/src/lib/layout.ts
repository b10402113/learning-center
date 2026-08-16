import type { Subject, EdgeKind } from "@/types"

export const TILE_W = 200
export const TILE_H = 96
export const COL_GAP = 56
export const ROW_GAP = 150
export const LANE_W = 132
export const TIER_PAD_TOP = 44
export const TIER_PAD_BOTTOM = 44
export const MAP_PAD = 200

export interface TileBox {
  id: string
  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
}

export interface FloorBox {
  tierId: string
  y: number
  height: number
  laneX: number
  numeral: string
  title: string
  subtitle?: string
}

export interface EdgePath {
  id: string
  kind: EdgeKind
  d: string
  label?: string
  labelX: number
  labelY: number
  hasArrow: boolean
}

export interface Layout {
  tiles: Record<string, TileBox>
  floors: FloorBox[]
  edges: EdgePath[]
  width: number
  height: number
}

function orderedTiers(subject: Subject) {
  return subject.tiers
}

export function computeLayout(subject: Subject): Layout {
  const tiers = orderedTiers(subject)
  const tiles: Record<string, TileBox> = {}
  const floors: FloorBox[] = []

  const laneX = MAP_PAD
  const firstCol = laneX + LANE_W + COL_GAP
  let cursorY = MAP_PAD
  let maxRight = firstCol

  for (const tier of tiers) {
    const tierPaths = subject.paths
      .filter((p) => p.tierId === tier.id)
      .sort((a, b) => a.order - b.order)

    const rows = Math.max(1, tierPaths.length)
    const floorTop = cursorY
    const contentTop = floorTop + TIER_PAD_TOP

    tierPaths.forEach((p, i) => {
      const x = firstCol + i * (TILE_W + COL_GAP)
      const y = contentTop
      tiles[p.id] = {
        id: p.id,
        x,
        y,
        w: TILE_W,
        h: TILE_H,
        cx: x + TILE_W / 2,
        cy: y + TILE_H / 2,
      }
      maxRight = Math.max(maxRight, x + TILE_W)
    })

    const floorHeight = TIER_PAD_TOP + TILE_H + TIER_PAD_BOTTOM
    floors.push({
      tierId: tier.id,
      y: floorTop,
      height: floorHeight,
      laneX,
      numeral: tier.numeral,
      title: tier.title,
      subtitle: tier.subtitle,
    })

    cursorY = floorTop + floorHeight + ROW_GAP
    void rows
  }

  const edges = buildEdgePaths(subject, tiles)

  const width = maxRight + MAP_PAD
  const height = cursorY - ROW_GAP + MAP_PAD

  return { tiles, floors, edges, width, height }
}

function buildEdgePaths(
  subject: Subject,
  tiles: Record<string, TileBox>,
): EdgePath[] {
  const paths: EdgePath[] = []
  // fan-out counters so multiple shared/explicit edges between same rows don't overlap
  const laneCounter = new Map<string, number>()

  for (const edge of subject.edges) {
    const a = tiles[edge.from]
    const b = tiles[edge.to]
    if (!a || !b) continue

    let d = ""
    let labelX = (a.cx + b.cx) / 2
    let labelY = (a.cy + b.cy) / 2

    if (edge.kind === "spine") {
      const sameRow = Math.abs(a.cy - b.cy) < 1
      if (sameRow) {
        const x1 = a.x + a.w
        const x2 = b.x
        const y = a.cy
        d = `M ${x1} ${y} L ${x2 - 8} ${y}`
        labelX = (x1 + x2) / 2
        labelY = y
      } else {
        // drop curve across a tier boundary
        const x1 = a.cx
        const y1 = a.y + a.h
        const x2 = b.cx
        const y2 = b.y
        const midY = (y1 + y2) / 2
        d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2 - 8}`
        labelX = (x1 + x2) / 2
        labelY = midY
      }
    } else {
      // shared / explicit: arc above or below, offset by fan counter
      const key = [edge.from, edge.to].sort().join("|")
      const n = laneCounter.get(key) ?? 0
      laneCounter.set(key, n + 1)
      const dir = edge.kind === "shared" ? -1 : 1
      const lift = (48 + n * 26) * dir
      const x1 = a.cx
      const x2 = b.cx
      const y1 = a.cy + (dir < 0 ? -a.h / 2 : a.h / 2)
      const y2 = b.cy + (dir < 0 ? -b.h / 2 : b.h / 2)
      const cx = (x1 + x2) / 2
      const cy = (y1 + y2) / 2 + lift
      d = `M ${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}`
      labelX = cx
      labelY = cy + (dir < 0 ? -6 : 12)
    }

    paths.push({
      id: edge.id,
      kind: edge.kind,
      d,
      label: edge.label,
      labelX,
      labelY,
      hasArrow: edge.kind === "spine" || edge.kind === "explicit",
    })
  }

  return paths
}

/** Seeded PRNG (mulberry32) for deterministic star-fields. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export interface Star {
  x: number
  y: number
  r: number
  o: number
  delay: number
}

export function makeStars(subject: Subject, w: number, h: number): Star[] {
  const rand = seededRandom(hashString(subject.id))
  const count = Math.min(220, Math.max(80, Math.round((w * h) / 26000)))
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * w,
      y: rand() * h,
      r: 0.4 + rand() * 1.6,
      o: 0.15 + rand() * 0.6,
      delay: rand() * 6,
    })
  }
  return stars
}

import type { SubjectGraph } from "./types";

export const TILE_W = 200;
export const TILE_H = 96;
export const COL_GAP = 78;
export const ROW_GAP = 172;
export const LANE_W = 132;
export const TIER_PAD_TOP = 76;
export const TIER_PAD_BOTTOM = 76;
export const MAP_PAD = 200;

const ROMAN = ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"];

export function roman(tier: number): string {
  return ROMAN[tier] ?? String(tier);
}

export type EdgeRenderKind = "spine" | "shared" | "explicit";

export interface TileBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export interface FloorBox {
  tier: number;
  title: string;
  numeral: string;
  y: number;
  height: number;
  laneX: number;
}

export interface EdgePath {
  id: string;
  kind: EdgeRenderKind;
  from: string;
  to: string;
  d: string;
  label?: string;
  labelX: number;
  labelY: number;
  hasArrow: boolean;
}

export interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  delay: number;
}

export interface NodeMarker {
  id: string;
  title: string;
  tier: number;
  x: number;
  y: number;
  /** Teaching-lesson tile centers this node is force-connected to. */
  anchors: { x: number; y: number; pathId: string }[];
}

export interface TowerLayout {
  tiles: Record<string, TileBox>;
  floors: FloorBox[];
  edges: EdgePath[];
  nodeMarkers: NodeMarker[];
  bossIds: string[];
  stars: Star[];
  width: number;
  height: number;
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  anchors: { x: number; y: number }[];
  /** Seeded constant bias that breaks symmetric equilibria organically. */
  wanderX: number;
  wanderY: number;
}

// A tiny, fully deterministic force layout: concept nodes are springs tethered
// to their teaching lessons, repelled by each other and gently pushed off every
// tile. Fixed iteration count + seeded start = stable positions across runs.
function settleNodes(
  nodes: LayoutNode[],
  tileRects: { x: number; y: number; w: number; h: number }[],
): void {
  const STEPS = 300;
  const SPRING_K = 0.12;
  const SPRING_TARGET = 88;
  const REPULSE = 240;
  const DAMPING = 0.86;
  for (let s = 0; s < STEPS; s++) {
      for (const n of nodes) {
        let fx = n.wanderX;
        let fy = n.wanderY;
        for (const a of n.anchors) {
        let dx = a.x - n.x;
        let dy = a.y - n.y;
        const len = Math.hypot(dx, dy) || 1;
        const f = SPRING_K * (len - SPRING_TARGET);
        fx += (dx / len) * f;
        fy += (dy / len) * f;
      }
      for (const m of nodes) {
        if (m === n) continue;
        let dx = n.x - m.x;
        let dy = n.y - m.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          dx = n.id < m.id ? 1 : -1;
          dy = 0;
          d2 = 1;
        }
        const d = Math.sqrt(d2);
        fx += (dx / d) * (REPULSE / d);
        fy += (dy / d) * (REPULSE / d);
      }
      for (const r of tileRects) {
        const cx = Math.max(r.x, Math.min(n.x, r.x + r.w));
        const cy = Math.max(r.y, Math.min(n.y, r.y + r.h));
        let dx = n.x - cx;
        let dy = n.y - cy;
        let d = Math.hypot(dx, dy);
        if (d < 30) {
          if (d < 1) {
            dx = 1;
            d = 1;
          }
          const push = 9 * (1 - d / 30);
          fx += (dx / d) * push;
          fy += (dy / d) * push;
        }
      }
      n.vx = (n.vx + fx) * DAMPING;
      n.vy = (n.vy + fy) * DAMPING;
    }
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
    }
  }
}

export function computeLayout(graph: SubjectGraph): TowerLayout {
  const tiles: Record<string, TileBox> = {};
  const floors: FloorBox[] = [];
  const bossIds: string[] = [];
  const nodeMarkers: NodeMarker[] = [];

  const laneX = MAP_PAD;
  const firstCol = laneX + LANE_W + COL_GAP;
  let cursorY = MAP_PAD;
  let maxRight = firstCol;

  for (const tier of graph.tiers) {
    const floorTop = cursorY;
    const contentTop = floorTop + TIER_PAD_TOP;

    tier.pathIds.forEach((id, i) => {
      const x = firstCol + i * (TILE_W + COL_GAP);
      const y = contentTop;
      tiles[id] = {
        id,
        x,
        y,
        w: TILE_W,
        h: TILE_H,
        cx: x + TILE_W / 2,
        cy: y + TILE_H / 2,
      };
      maxRight = Math.max(maxRight, x + TILE_W);
    });

    const floorHeight = TIER_PAD_TOP + TILE_H + TIER_PAD_BOTTOM;
    floors.push({
      tier: tier.tier,
      title: tier.title,
      numeral: roman(tier.tier),
      y: floorTop,
      height: floorHeight,
      laneX,
    });

    const last = tier.pathIds[tier.pathIds.length - 1];
    if (last) bossIds.push(last);

    // Concept node markers are force-laid out and tethered to the lessons that
    // teach them: each node springs toward its teaching tiles, repels its
    // neighbours, and is pushed off every tile. The tiles themselves stay
    // exactly where the tower puts them — only the nodes float. Deterministic:
    // seeded start positions + a fixed number of steps.
    const tierNodes = Object.values(graph.nodes)
      .filter((n) => n.tier === tier.tier)
      .sort((a, b) => a.order - b.order);
    const rand = mulberry32(hashSeed(`${graph.subject}:tier:${tier.tier}`));
    const tierTiles = tier.pathIds
      .map((id) => tiles[id])
      .filter((t): t is TileBox => Boolean(t));
    const fallback = tierTiles.length
      ? {
          x: tierTiles.reduce((a, t) => a + t.cx, 0) / tierTiles.length,
          y: tierTiles.reduce((a, t) => a + t.cy, 0) / tierTiles.length,
        }
      : null;
    const teachingAnchors = (nodeId: string): { x: number; y: number; pathId: string }[] =>
      (graph.nodes[nodeId]?.taughtBy ?? [])
        .map((pid) => tiles[pid])
        .filter((t): t is TileBox => Boolean(t))
        .map((t) => ({ x: t.cx, y: t.cy, pathId: t.id }));
    const forceNodes: LayoutNode[] = tierNodes.map((n) => {
      const anchors = teachingAnchors(n.id);
      const home = anchors.length
        ? anchors.reduce((a, p) => ({ x: a.x + p.x / anchors.length, y: a.y + p.y / anchors.length }), { x: 0, y: 0 })
        : fallback ?? { x: firstCol + TILE_W / 2, y: contentTop + TILE_H / 2 };
      return {
        id: n.id,
        x: home.x + (rand() - 0.5) * 96,
        y: home.y + (rand() - 0.5) * 64,
        vx: 0,
        vy: 0,
        anchors: anchors.length ? anchors : fallback ? [fallback] : [],
        wanderX: (rand() - 0.5) * 6,
        wanderY: (rand() - 0.5) * 6,
      };
    });
    settleNodes(forceNodes, Object.values(tiles).map((t) => ({ x: t.x, y: t.y, w: t.w, h: t.h })));
    forceNodes.forEach((fn, i) => {
      const n = tierNodes[i];
      nodeMarkers.push({
        id: n.id,
        title: n.title,
        tier: n.tier,
        x: fn.x,
        y: fn.y,
        anchors: teachingAnchors(n.id),
      });
      // the label + leader line reach ~74px to the right of the marker
      maxRight = Math.max(maxRight, fn.x + 18 + Math.min(56, n.title.length * 7) + 6);
    });

    cursorY = floorTop + floorHeight + ROW_GAP;
  }

  const edges = buildEdgePaths(graph, tiles);

  const width = maxRight + MAP_PAD;
  const height = cursorY - ROW_GAP + MAP_PAD;

  const stars = makeStars(graph.subject, width, height);

  return { tiles, floors, edges, nodeMarkers, bossIds, stars, width, height };
}

function buildEdgePaths(
  graph: SubjectGraph,
  tiles: Record<string, TileBox>,
): EdgePath[] {
  const paths: EdgePath[] = [];
  const laneCounter = new Map<string, number>();

  graph.edges.forEach((edge, i) => {
    const a = tiles[edge.from];
    const b = tiles[edge.to];
    if (!a || !b) return;

    const kind: EdgeRenderKind =
      edge.kind === "shared-concept" ? "shared" : edge.kind;

    let d = "";
    let labelX = (a.cx + b.cx) / 2;
    let labelY = (a.cy + b.cy) / 2;

    if (kind === "spine") {
      const sameRow = Math.abs(a.cy - b.cy) < 1;
      if (sameRow) {
        const x1 = a.x + a.w;
        const x2 = b.x;
        const y = a.cy;
        d = `M ${x1} ${y} L ${x2 - 8} ${y}`;
        labelX = (x1 + x2) / 2;
        labelY = y;
      } else {
        // drop curve across a tier boundary
        const x1 = a.cx;
        const y1 = a.y + a.h;
        const x2 = b.cx;
        const y2 = b.y;
        const midY = (y1 + y2) / 2;
        d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2 - 8}`;
        labelX = (x1 + x2) / 2;
        labelY = midY;
      }
    } else {
      // shared / explicit: arc above or below, offset by fan counter
      const key = [edge.from, edge.to].sort().join("|");
      const n = laneCounter.get(key) ?? 0;
      laneCounter.set(key, n + 1);
      const dir = kind === "shared" ? -1 : 1;
      const lift = (48 + n * 26) * dir;
      const x1 = a.cx;
      const x2 = b.cx;
      const y1 = a.cy + (dir < 0 ? -a.h / 2 : a.h / 2);
      const y2 = b.cy + (dir < 0 ? -b.h / 2 : b.h / 2);
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2 + lift;
      d = `M ${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}`;
      labelX = cx;
      labelY = cy + (dir < 0 ? -6 : 12);
    }

    paths.push({
      id: `${edge.from}->${edge.to}#${i}`,
      kind,
      from: edge.from,
      to: edge.to,
      d,
      label: edge.label,
      labelX,
      labelY,
      hasArrow: kind === "spine" || kind === "explicit",
    });
  });

  return paths;
}

export function makeStars(seedKey: string, w: number, h: number): Star[] {
  const rand = mulberry32(hashSeed(seedKey));
  const count = Math.min(220, Math.max(80, Math.round((w * h) / 26000)));
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * w,
      y: rand() * h,
      r: 0.4 + rand() * 1.6,
      o: 0.15 + rand() * 0.6,
      delay: rand() * 6,
    });
  }
  return stars;
}

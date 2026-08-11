import type { SubjectGraph } from "./types";

export const TILE_W = 172;
export const TILE_H = 60;
export const TILE_GAP = 56;
export const FLOOR_H = 168;
export const STAGGER_X = 22;
export const STAGGER_Y = 18;
export const LANE_X = 196;
export const MARGIN_TOP = 64;
export const MARGIN_BOTTOM = 48;
export const MARGIN_RIGHT = 56;

export interface Point {
  x: number;
  y: number;
}

export interface TilePos extends Point {
  id: string;
  order: number;
}

export interface TierFloor {
  tier: number;
  title: string;
  y: number;
  tiles: TilePos[];
}

export interface LinkPos {
  from: Point;
  to: Point;
  label?: string;
}

export interface TowerLayout {
  width: number;
  height: number;
  floors: TierFloor[];
  bossIds: string[];
  spine: LinkPos[];
  boundarySpine: LinkPos[];
  shared: LinkPos[];
  explicit: LinkPos[];
  stars: Point[];
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

export function computeLayout(graph: SubjectGraph): TowerLayout {
  const pathById = new Map(graph.paths.map((p) => [p.id, p]));

  const floors: TierFloor[] = graph.tiers.map((tier, fi) => {
    const tiles: TilePos[] = tier.pathIds.map((id, i) => {
      const p = pathById.get(id);
      return {
        id,
        order: p?.order ?? i + 1,
        x: LANE_X + i * (TILE_W + TILE_GAP) + (i % 2) * STAGGER_X,
        y: MARGIN_TOP + fi * FLOOR_H + (i % 2) * STAGGER_Y,
      };
    });
    return {
      tier: tier.tier,
      title: tier.title,
      y: MARGIN_TOP + fi * FLOOR_H,
      tiles,
    };
  });

  const width =
    Math.max(...floors.map((f) => Math.max(...f.tiles.map((t) => t.x + TILE_W), LANE_X))) +
    MARGIN_RIGHT;
  const height = MARGIN_TOP + floors.length * FLOOR_H + MARGIN_BOTTOM;

  const pos = (id: string): TilePos | null => {
    for (const f of floors) {
      const t = f.tiles.find((tile) => tile.id === id);
      if (t) return t;
    }
    return null;
  };

  const tierPathIds = new Map(graph.tiers.map((t) => [t.tier, new Set(t.pathIds)]));

  const spine: LinkPos[] = [];
  const boundarySpine: LinkPos[] = [];
  const shared: LinkPos[] = [];
  const explicit: LinkPos[] = [];

  for (const e of graph.edges) {
    const a = pos(e.from);
    const b = pos(e.to);
    if (!a || !b) continue;
    const fromPath = pathById.get(e.from);
    const sameTier = fromPath ? tierPathIds.get(fromPath.tier)?.has(e.to) ?? false : false;
    if (e.kind === "spine") {
      const link = sameTier
        ? {
            from: { x: a.x + TILE_W, y: a.y + TILE_H / 2 },
            to: { x: b.x, y: b.y + TILE_H / 2 },
          }
        : {
            from: { x: a.x + TILE_W / 2, y: a.y + TILE_H },
            to: { x: b.x + TILE_W / 2, y: b.y },
          };
      (sameTier ? spine : boundarySpine).push(link);
    } else if (e.kind === "shared-concept") {
      shared.push({
        from: { x: a.x + TILE_W, y: a.y + TILE_H / 2 },
        to: { x: b.x, y: b.y + TILE_H / 2 },
      });
    } else {
      explicit.push({
        from: { x: a.x + TILE_W, y: a.y + TILE_H / 2 },
        to: { x: b.x, y: b.y + TILE_H / 2 },
        label: e.label,
      });
    }
  }

  const bossIds = floors
    .map((f) => f.tiles[f.tiles.length - 1]?.id)
    .filter((id): id is string => Boolean(id));

  const rand = mulberry32(hashSeed(graph.subject));
  const stars: Point[] = [];
  for (let i = 0; i < 150; i++) {
    stars.push({ x: Math.round(rand() * width), y: Math.round(rand() * height) });
  }

  return { width, height, floors, bossIds, spine, boundarySpine, shared, explicit, stars };
}

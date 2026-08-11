export interface Camera {
  x: number;
  y: number;
  s: number;
}

// A width/height pair. World bounds and viewport are the same shape — only the
// role differs, so both are named aliases of the same type.
export interface Size {
  w: number;
  h: number;
}

export type WorldBounds = Size;
export type Viewport = Size;

export const MIN_SCALE = 0.08;
export const MAX_SCALE = 3;
export const SEAT_SCALE = 1;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// Frame the whole tower in the viewport with a padding gutter, centered.
export function fitCamera(bounds: WorldBounds, viewport: Viewport): Camera {
  const s = clamp(
    Math.min((viewport.w - PAD * 2) / bounds.w, (viewport.h - PAD * 2) / bounds.h),
    MIN_SCALE,
    MAX_SCALE,
  );
  const x = (viewport.w - bounds.w * s) / 2;
  const y = (viewport.h - bounds.h * s) / 2;
  return { x, y, s };
}

const PAD = 48;
const CLAMP_MARGIN = 40;

// Keep the tower reachable: when it fits, center it; when it overflows, clamp
// the translation so at least a margin of content stays visible on every edge.
export function clampCamera(cam: Camera, bounds: WorldBounds, viewport: Viewport): Camera {
  const s = clamp(cam.s, MIN_SCALE, MAX_SCALE);
  const cw = bounds.w * s;
  const ch = bounds.h * s;
  let x = cam.x;
  let y = cam.y;
  if (cw <= viewport.w) {
    x = (viewport.w - cw) / 2;
  } else {
    const lo = viewport.w - cw - CLAMP_MARGIN;
    const hi = CLAMP_MARGIN;
    x = clamp(x, Math.min(lo, hi), Math.max(lo, hi));
  }
  if (ch <= viewport.h) {
    y = (viewport.h - ch) / 2;
  } else {
    const lo = viewport.h - ch - CLAMP_MARGIN;
    const hi = CLAMP_MARGIN;
    y = clamp(y, Math.min(lo, hi), Math.max(lo, hi));
  }
  return { x, y, s };
}

// Zoom by `factor` about a screen point, pinning the world under that point.
export function zoomAt(
  cam: Camera,
  px: number,
  py: number,
  factor: number,
  bounds: WorldBounds,
  viewport: Viewport,
): Camera {
  const ns = clamp(cam.s * factor, MIN_SCALE, MAX_SCALE);
  const k = ns / cam.s;
  const x = px - (px - cam.x) * k;
  const y = py - (py - cam.y) * k;
  return clampCamera({ x, y, s: ns }, bounds, viewport);
}

// Pan by a screen-space delta.
export function pan(
  cam: Camera,
  dx: number,
  dy: number,
  bounds: WorldBounds,
  viewport: Viewport,
): Camera {
  return clampCamera({ x: cam.x + dx, y: cam.y + dy, s: cam.s }, bounds, viewport);
}

// Center on a world point, zooming in to a readable level if the camera is
// pulled back further than SEAT_SCALE.
export function seatCamera(
  cam: Camera,
  wx: number,
  wy: number,
  viewport: Viewport,
  bounds: WorldBounds,
): Camera {
  const s = clamp(Math.max(cam.s, SEAT_SCALE), MIN_SCALE, MAX_SCALE);
  const x = viewport.w / 2 - wx * s;
  const y = viewport.h / 2 - wy * s;
  return clampCamera({ x, y, s }, bounds, viewport);
}

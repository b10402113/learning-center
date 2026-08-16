export interface Camera {
  /** translation in screen pixels */
  x: number
  y: number
  scale: number
}

export const MIN_SCALE = 0.08
export const MAX_SCALE = 3

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

export interface Viewport {
  width: number
  height: number
}

export interface WorldSize {
  width: number
  height: number
}

/** Fit an entire world rect inside the viewport with padding. */
export function fitCamera(
  world: WorldSize,
  view: Viewport,
  pad = 0.9,
): Camera {
  if (view.width === 0 || view.height === 0) {
    return { x: 0, y: 0, scale: 1 }
  }
  const scale = clampScale(
    Math.min(view.width / world.width, view.height / world.height) * pad,
  )
  const x = (view.width - world.width * scale) / 2
  const y = (view.height - world.height * scale) / 2
  return { x, y, scale }
}

/** Center the camera on a world point at a target scale. */
export function seatCamera(
  point: { x: number; y: number },
  view: Viewport,
  scale: number,
): Camera {
  const s = clampScale(scale)
  return {
    x: view.width / 2 - point.x * s,
    y: view.height / 2 - point.y * s,
    scale: s,
  }
}

/** Zoom toward a screen-space cursor position. */
export function zoomAt(
  cam: Camera,
  cursor: { x: number; y: number },
  factor: number,
): Camera {
  const scale = clampScale(cam.scale * factor)
  const k = scale / cam.scale
  return {
    scale,
    x: cursor.x - (cursor.x - cam.x) * k,
    y: cursor.y - (cursor.y - cam.y) * k,
  }
}

/** Keep the world within reach: never let it drift entirely off-screen. */
export function clampTranslation(
  cam: Camera,
  world: WorldSize,
  view: Viewport,
): Camera {
  const margin = 240
  const w = world.width * cam.scale
  const h = world.height * cam.scale
  const minX = Math.min(margin, view.width - w - margin)
  const maxX = Math.max(view.width - w - margin, margin)
  const minY = Math.min(margin, view.height - h - margin)
  const maxY = Math.max(view.height - h - margin, margin)
  return {
    ...cam,
    x: Math.min(maxX, Math.max(minX, cam.x)),
    y: Math.min(maxY, Math.max(minY, cam.y)),
  }
}

export function lerpCamera(a: Camera, b: Camera, t: number): Camera {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    scale: a.scale + (b.scale - a.scale) * t,
  }
}

export function camerasClose(a: Camera, b: Camera): boolean {
  return (
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5 &&
    Math.abs(a.scale - b.scale) < 0.002
  )
}

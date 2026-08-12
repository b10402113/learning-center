import { describe, expect, it } from "vitest";
import {
  MAX_SCALE,
  MIN_SCALE,
  SEAT_SCALE,
  clampCamera,
  fitCamera,
  pan,
  seatCamera,
  zoomAt,
  type Camera,
  type Viewport,
  type WorldBounds,
} from "../lib/camera";

// Common fixture sizes shared across the suite.
const vp: Viewport = { w: 800, h: 600 };
const tower: WorldBounds = { w: 1600, h: 1200 };

describe("fitCamera", () => {
  it("frames the whole tower with a padding gutter, centered", () => {
    // scale = min((800-96)/1600, (600-96)/1200) = 0.42
    expect(fitCamera(tower, vp)).toEqual({ x: 64, y: 48, s: 0.42 });
  });

  it("clamps the fit scale at MIN_SCALE for a huge world", () => {
    const small: Viewport = { w: 200, h: 150 };
    const huge: WorldBounds = { w: 5000, h: 4000 };
    expect(fitCamera(huge, small)).toEqual({ x: -100, y: -85, s: MIN_SCALE });
  });

  it("clamps the fit scale at MAX_SCALE for a tiny world", () => {
    const huge: Viewport = { w: 1600, h: 1200 };
    const tiny: WorldBounds = { w: 200, h: 150 };
    expect(fitCamera(tiny, huge)).toEqual({ x: 500, y: 375, s: MAX_SCALE });
  });
});

describe("clampCamera", () => {
  it("centers the camera when the tower fits the viewport", () => {
    const cam: Camera = { x: 0, y: 0, s: 1 };
    const small: WorldBounds = { w: 200, h: 150 };
    expect(clampCamera(cam, small, vp)).toEqual({ x: 300, y: 225, s: 1 });
  });

  it("clamps translation so a margin of tower stays visible on every edge", () => {
    const cam: Camera = { x: -99999, y: 99999, s: 1 };
    // cw=1600>800: lo=800-1600-40=-840, hi=40 → x=-840
    // ch=1200>600: lo=600-1200-40=-640, hi=40 → y=40
    expect(clampCamera(cam, tower, vp)).toEqual({ x: -840, y: 40, s: 1 });
  });

  it("never lets the scale escape MIN/MAX even when zooming is clamped", () => {
    expect(clampCamera({ x: 0, y: 0, s: 99 }, tower, vp).s).toBe(MAX_SCALE);
    expect(clampCamera({ x: 0, y: 0, s: 0.0001 }, tower, vp).s).toBe(MIN_SCALE);
  });

  it("keeps an already-legal camera unchanged", () => {
    const cam: Camera = { x: 64, y: 48, s: 0.42 };
    expect(clampCamera(cam, tower, vp)).toEqual(cam);
  });
});

describe("zoomAt", () => {
  it("pins the world point under the screen cursor", () => {
    const cam: Camera = { x: 0, y: 0, s: 1 };
    const wide: WorldBounds = { w: 2000, h: 1500 };
    const next = zoomAt(cam, 400, 300, 2, wide, vp);
    expect(next).toEqual({ x: -400, y: -300, s: 2 });
    // the world point under screen (400,300) must map back to screen (400,300)
    expect(400 * next.s + next.x).toBeCloseTo(400);
    expect(300 * next.s + next.y).toBeCloseTo(300);
  });

  it("clamps zoom-out at MIN_SCALE and re-centers a now-fitting tower", () => {
    const cam: Camera = { x: 0, y: 0, s: 0.2 };
    expect(zoomAt(cam, 400, 300, 0.01, tower, vp)).toEqual({
      x: 336,
      y: 252,
      s: MIN_SCALE,
    });
  });

  it("clamps zoom-in at MAX_SCALE", () => {
    const cam: Camera = { x: 0, y: 0, s: 2 };
    expect(zoomAt(cam, 400, 300, 10, tower, vp).s).toBe(MAX_SCALE);
  });
});

describe("pan", () => {
  it("moves the camera by the screen delta while the tower overflows", () => {
    const cam: Camera = { x: -400, y: -300, s: 1 };
    expect(pan(cam, 200, 200, tower, vp)).toEqual({ x: -200, y: -100, s: 1 });
  });

  it("neutralizes pan when the tower fits — it stays centered and reachable", () => {
    const cam: Camera = { x: 64, y: 48, s: 0.42 };
    expect(pan(cam, 100, 100, tower, vp)).toEqual(cam);
  });

  it("clamps a runaway pan back to the visible margin", () => {
    const cam: Camera = { x: -400, y: -300, s: 1 };
    expect(pan(cam, -99999, 99999, tower, vp)).toEqual({ x: -840, y: 40, s: 1 });
  });
});

describe("seatCamera", () => {
  it("centers the world point in the viewport", () => {
    const cam: Camera = { x: 0, y: 0, s: 0.5 };
    const next = seatCamera(cam, 400, 300, vp, tower);
    expect(next).toEqual({ x: 0, y: 0, s: 1 });
    expect(400 * next.s + next.x).toBeCloseTo(400);
    expect(300 * next.s + next.y).toBeCloseTo(300);
  });

  it("zooms in to SEAT_SCALE when pulled back further than readable", () => {
    const cam: Camera = { x: 0, y: 0, s: 0.1 };
    expect(seatCamera(cam, 400, 300, vp, tower).s).toBe(SEAT_SCALE);
  });

  it("clamps a seat aimed past the tower edge so the tower stays reachable", () => {
    const cam: Camera = { x: 0, y: 0, s: 0.1 };
    // centering world (1400,1100) would push the camera beyond the clamp margin
    expect(seatCamera(cam, 1400, 1100, vp, tower)).toEqual({
      x: -840,
      y: -640,
      s: SEAT_SCALE,
    });
  });

  it("does not zoom in past the operator's current scale when already readable", () => {
    const cam: Camera = { x: 0, y: 0, s: 1.5 };
    expect(seatCamera(cam, 400, 300, vp, tower).s).toBe(1.5);
  });
});

describe("reset — zoom/reset returns to bird's-eye", () => {
  it("fitCamera restores the bird's-eye view after the camera has zoomed in", () => {
    const start = fitCamera(tower, vp);
    const zoomed = zoomAt(start, 600, 400, 2, tower, vp);
    expect(zoomed).not.toEqual(start);
    // the reset button re-fits: the whole tower is framed again
    expect(fitCamera(tower, vp)).toEqual(start);
  });

  it("reset re-centers after the operator has panned and zoomed around", () => {
    const start = fitCamera(tower, vp);
    const moved = pan(zoomAt(start, 200, 100, 1.5, tower, vp), 300, -200, tower, vp);
    expect(moved).not.toEqual(start);
    expect(fitCamera(tower, vp)).toEqual(start);
  });
});

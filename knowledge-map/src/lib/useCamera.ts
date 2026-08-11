import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clampCamera,
  fitCamera,
  pan,
  seatCamera,
  zoomAt,
  type Camera,
  type WorldBounds,
  type Viewport,
} from "./camera";

export interface CameraApi {
  cam: Camera;
  animating: boolean;
  zoomAt: (px: number, py: number, factor: number) => void;
  panBy: (dx: number, dy: number) => void;
  seat: (wx: number, wy: number) => void;
  reset: () => void;
}

// A camera owns the world→screen transform (screen = world * s + translate).
// It refits the whole tower whenever the world changes identity — the subject
// slug plus its bounds — or on first measurement, clamps on resize, and exposes
// zoom/pan/seat/reset mutators that always keep the tower reachable.
export function useCamera(
  resetKey: string,
  bounds: WorldBounds | null,
  viewport: Viewport,
): CameraApi {
  const [cam, setCam] = useState<Camera>({ x: 0, y: 0, s: 1 });
  const [animating, setAnimating] = useState(false);
  const [fitKey, setFitKey] = useState("");
  const camRef = useRef(cam);
  camRef.current = cam;
  const prevViewport = useRef<Viewport>({ w: 0, h: 0 });

  const ready = Boolean(bounds && viewport.w > 0 && viewport.h > 0);

  useEffect(() => {
    if (!ready) return;
    const key = `${resetKey}|${bounds!.w}x${bounds!.h}`;
    if (fitKey !== key) {
      setFitKey(key);
      setAnimating(false);
      setCam(fitCamera(bounds!, viewport));
    } else if (prevViewport.current.w !== viewport.w || prevViewport.current.h !== viewport.h) {
      // A resize preserves the world point at the viewport centre (chartr
      // #onResize precedent), then clamps so the tower stays reachable.
      const c = camRef.current;
      const { w: pw, h: ph } = prevViewport.current;
      const wx = (pw / 2 - c.x) / c.s;
      const wy = (ph / 2 - c.y) / c.s;
      setCam(
        clampCamera({ x: viewport.w / 2 - wx * c.s, y: viewport.h / 2 - wy * c.s, s: c.s }, bounds!, viewport),
      );
    } else {
      setCam((c) => clampCamera(c, bounds!, viewport));
    }
    prevViewport.current = viewport;
  }, [resetKey, bounds, viewport.w, viewport.h, fitKey, ready]);

  const zoom = useCallback(
    (px: number, py: number, factor: number) => {
      if (!ready) return;
      setAnimating(false);
      setCam((c) => zoomAt(c, px, py, factor, bounds!, viewport));
    },
    [ready, bounds, viewport],
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      if (!ready) return;
      setAnimating(false);
      setCam((c) => pan(c, dx, dy, bounds!, viewport));
    },
    [ready, bounds, viewport],
  );

  const seat = useCallback(
    (wx: number, wy: number) => {
      if (!ready) return;
      setAnimating(true);
      setCam((c) => seatCamera(c, wx, wy, viewport, bounds!));
    },
    [ready, bounds, viewport],
  );

  const reset = useCallback(() => {
    if (!ready) return;
    setAnimating(true);
    setCam(fitCamera(bounds!, viewport));
  }, [ready, bounds, viewport]);

  return useMemo(
    () => ({ cam, animating, zoomAt: zoom, panBy, seat, reset }),
    [cam, animating, zoom, panBy, seat, reset],
  );
}

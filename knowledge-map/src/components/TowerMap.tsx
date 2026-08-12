import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EdgeLayer } from "./EdgeLayer";
import { FloorLayer } from "./FloorLayer";
import { MapDefs } from "./MapDefs";
import { Tile } from "./Tile";
import { isWritten } from "../lib/colors";
import { computeLayout, type TileBox } from "../lib/layout";
import type { TierBossState } from "../lib/selectors";
import type { FocusRequest, PathNode, SubjectGraph } from "../lib/types";
import { useCamera } from "../lib/useCamera";
import type { Viewport, WorldBounds } from "../lib/camera";

export interface TowerMapHandle {
  fit: () => void;
  seatOnPath: (pathId: string) => void;
  zoomBy: (factor: number) => void;
}

interface Props {
  graph: SubjectGraph;
  selectedId: string | null;
  focusRequest: FocusRequest | null;
  manualCompleted: Set<string>;
  manualNodes: Set<string>;
  bossStates: Map<number, TierBossState>;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onUnlockTier: (tier: number) => void;
}

export const TowerMap = forwardRef<TowerMapHandle, Props>(function TowerMap(
  { graph, selectedId, focusRequest, manualCompleted, manualNodes, bossStates, hoveredId, onSelect, onHover, onUnlockTier },
  ref,
) {
  const layout = useMemo(() => computeLayout(graph), [graph]);
  const written = useMemo(
    () => new Set(graph.paths.filter((p) => isWritten(p.status)).map((p) => p.id)),
    [graph],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setViewport({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bounds: WorldBounds = useMemo(
    () => ({ w: layout.width, h: layout.height }),
    [layout],
  );
  const { cam, animating, zoomAt, panBy, seat, reset } = useCamera(
    graph.subject,
    bounds,
    viewport,
  );

  // A deep-link names a tile to focus: seat the camera on it once per request.
  const lastFocus = useRef<string | null>(null);
  useEffect(() => {
    if (!focusRequest || viewport.w === 0) return;
    const key = `${focusRequest.pathId}#${focusRequest.tick}`;
    if (lastFocus.current === key) return;
    const box = layout.tiles[focusRequest.pathId];
    if (!box) return;
    lastFocus.current = key;
    seat(box.cx, box.cy);
  }, [focusRequest, layout, viewport.w, seat]);

  const seatOnPath = useCallback(
    (pathId: string) => {
      const box: TileBox | undefined = layout.tiles[pathId];
      if (!box) return;
      seat(box.cx, box.cy);
    },
    [layout.tiles, seat],
  );

  useImperativeHandle(
    ref,
    () => ({
      fit: reset,
      seatOnPath,
      zoomBy: (factor: number) => zoomAt(viewport.w / 2, viewport.h / 2, factor),
    }),
    [reset, seatOnPath, zoomAt, viewport.w, viewport.h],
  );

  // Wheel must be a non-passive native listener so preventDefault works; a
  // trackpad pinch arrives as a ctrl-flagged wheel (Chrome/Firefox); WebKit
  // reports it through the gesture events instead — both are handled here.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const point = (e: { clientX: number; clientY: number }) => {
      const rect = el.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { x, y } = point(e);
      const px = Math.max(-140, Math.min(140, e.deltaY));
      const pinch = e.ctrlKey;
      zoomAt(x, y, Math.exp(-px * (pinch ? 0.011 : 0.0016)));
    };
    let gestureScale = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gestureScale = 1;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const ge = e as unknown as { scale: number; clientX: number; clientY: number };
      const { x, y } = point(ge);
      const s = ge.scale || 1;
      zoomAt(x, y, s / (gestureScale || 1));
      gestureScale = s;
    };
    const onGestureEnd = (e: Event) => {
      e.preventDefault();
      gestureScale = 1;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("gesturestart", onGestureStart as EventListener);
    el.addEventListener("gesturechange", onGestureChange as EventListener);
    el.addEventListener("gestureend", onGestureEnd as EventListener);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("gesturestart", onGestureStart as EventListener);
      el.removeEventListener("gesturechange", onGestureChange as EventListener);
      el.removeEventListener("gestureend", onGestureEnd as EventListener);
    };
  }, [zoomAt]);

  // Pointer drag pans the camera. Only claim the pointer once the drag passes a
  // threshold, so a plain click still reaches the tile beneath the cursor; the
  // trailing click after a drag must not select a tile.
  const drag = useRef({
    active: false,
    moved: false,
    captured: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    pointerId: -1,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = {
      active: true,
      moved: false,
      captured: false,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    const totalMove =
      Math.abs(e.clientX - drag.current.startX) +
      Math.abs(e.clientY - drag.current.startY);
    if (totalMove > 4) {
      drag.current.moved = true;
      if (!drag.current.captured) {
        drag.current.captured = true;
        try {
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
    }
    if (drag.current.moved) {
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      panBy(dx, dy);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    drag.current.active = false;
    if (drag.current.captured) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    // clear the moved flag on the next tick so the click handler (which fires
    // right after pointerup) can still read it
    requestAnimationFrame(() => {
      drag.current.moved = false;
    });
  };

  const guardedSelect = useCallback(
    (id: string) => {
      if (drag.current.moved) return;
      onSelect(id);
    },
    [onSelect],
  );

  const transform = `translate(${cam.x} ${cam.y}) scale(${cam.s})`;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label={`${graph.subject} 塔圖`}
      role="application"
    >
      <svg className="absolute inset-0 h-full w-full select-none" aria-hidden={false}>
        <MapDefs />
        <rect width="100%" height="100%" fill="url(#skyGrad)" />

        <g
          style={{
            transform,
            transformOrigin: "0 0",
            transformBox: "view-box",
            transition: animating ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        >
          {/* star-field */}
          <g aria-hidden>
            {layout.stars.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="var(--color-foreground)"
                opacity={s.o}
                style={{
                  animation: `nb-twinkle ${5 + (i % 5)}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </g>

          <FloorLayer floors={layout.floors} width={layout.width} bossStates={bossStates} onUnlock={onUnlockTier} />

          <EdgeLayer edges={layout.edges} hoveredId={hoveredId} />

          {graph.paths.map((p: PathNode) => {
            const box = layout.tiles[p.id];
            if (!box) return null;
            const auto = written.has(p.id);
            const manual = manualCompleted.has(p.id) && !auto;
            const locked = bossStates.get(p.tier) === "locked";
            const nodeReadCount = p.taughtNodeIds.filter((id) => manualNodes.has(id)).length;
            return (
              <Tile
                key={p.id}
                path={p}
                box={box}
                lit={auto || manual}
                locked={locked}
                nodeReadCount={nodeReadCount}
                boss={layout.bossIds.includes(p.id)}
                selected={selectedId === p.id}
                onSelect={guardedSelect}
                onHover={onHover}
              />
            );
          })}
        </g>

        <rect
          width="100%"
          height="100%"
          fill="url(#vignette)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
});

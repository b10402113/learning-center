import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  clampCamera,
  fitCamera,
  pan,
  seatCamera,
  zoomAt,
  type Camera,
  type Viewport,
} from "../lib/camera";
import { isWritten } from "../lib/colors";
import { computeLayout } from "../lib/layout";
import type { TierBossState } from "../lib/selectors";
import type { FocusRequest, SubjectGraph, TowerMapHandle } from "../lib/types";
import { EdgeLayer } from "./EdgeLayer";
import { FloorLayer } from "./FloorLayer";
import { MapDefs } from "./MapDefs";
import { NodeLayer } from "./NodeLayer";
import { Tile } from "./Tile";

interface TowerMapProps {
  graph: SubjectGraph;
  selectedId: string | null;
  selectedNodeId: string | null;
  focusRequest: FocusRequest | null;
  manualCompleted: Set<string>;
  manualNodes: Set<string>;
  bossStates: Map<number, TierBossState>;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onSelectNode: (id: string) => void;
  onHover: (id: string | null) => void;
  onUnlockTier: (tier: number) => void;
}

export const TowerMap = forwardRef<TowerMapHandle, TowerMapProps>(function TowerMap(
  {
    graph,
    selectedId,
    selectedNodeId,
    focusRequest,
    manualCompleted,
    manualNodes,
    bossStates,
    hoveredId,
    onSelect,
    onSelectNode,
    onHover,
    onUnlockTier,
  }: TowerMapProps,
  ref,
) {
  const layout = useMemo(() => computeLayout(graph), [graph]);
  const written = useMemo(
    () => new Set(graph.paths.filter((p) => isWritten(p.status)).map((p) => p.id)),
    [graph],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ w: 0, h: 0 });
  const [cam, setCam] = useState<Camera>({ x: 0, y: 0, s: 1 });
  const [animating, setAnimating] = useState(false);
  const [fitKey, setFitKey] = useState("");
  const prevViewportRef = useRef<Viewport>({ w: 0, h: 0 });
  const lastFocusRef = useRef<string | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;
  const camRef = useRef(cam);
  camRef.current = cam;

  const bounds = useCallback((): Viewport => ({ w: layout.width, h: layout.height }), [layout]);

  // Camera mutators — always keep the tower reachable.
  const zoomAtPoint = useCallback((px: number, py: number, factor: number): void => {
    const vp = viewportRef.current;
    if (vp.w === 0) return;
    setAnimating(false);
    setCam((c) => zoomAt(c, px, py, factor, bounds(), vp));
  }, [bounds]);

  const panBy = useCallback((dx: number, dy: number): void => {
    const vp = viewportRef.current;
    if (vp.w === 0) return;
    setAnimating(false);
    setCam((c) => pan(c, dx, dy, bounds(), vp));
  }, [bounds]);

  const seat = useCallback((wx: number, wy: number): void => {
    const vp = viewportRef.current;
    if (vp.w === 0) return;
    setAnimating(true);
    setCam((c) => seatCamera(c, wx, wy, vp, bounds()));
  }, [bounds]);

  const reset = useCallback((): void => {
    const vp = viewportRef.current;
    if (vp.w === 0) return;
    setAnimating(true);
    setCam(fitCamera(bounds(), vp));
  }, [bounds]);

  useImperativeHandle(
    ref,
    () => ({
      fit: reset,
      seatOnPath: (pathId: string) => {
        const box = layout.tiles[pathId];
        if (box) seat(box.cx, box.cy);
      },
      zoomBy: (factor: number) => {
        const vp = viewportRef.current;
        zoomAtPoint(vp.w / 2, vp.h / 2, factor);
      },
    }),
    [reset, seat, zoomAtPoint, layout],
  );

  // Refit whenever the tower's identity (subject + bounds) changes, clamp on
  // resize preserving the viewport-centre world point, and clamp otherwise.
  useEffect(() => {
    if (viewport.w === 0 || viewport.h === 0) return;
    const b = bounds();
    const key = `${graph.subject}|${b.w}x${b.h}`;
    if (fitKey !== key) {
      setFitKey(key);
      setAnimating(false);
      setCam(fitCamera(b, viewport));
    } else if (
      prevViewportRef.current.w !== viewport.w ||
      prevViewportRef.current.h !== viewport.h
    ) {
      const c = camRef.current;
      const wx = (prevViewportRef.current.w / 2 - c.x) / c.s;
      const wy = (prevViewportRef.current.h / 2 - c.y) / c.s;
      setCam(
        clampCamera(
          { x: viewport.w / 2 - wx * c.s, y: viewport.h / 2 - wy * c.s, s: c.s },
          b,
          viewport,
        ),
      );
    } else {
      setCam(clampCamera(camRef.current, b, viewport));
    }
    prevViewportRef.current = viewport;
  }, [graph, viewport, fitKey, bounds]);

  // A deep-link names a tile to focus: seat the camera on it once per request.
  useEffect(() => {
    if (!focusRequest || viewport.w === 0) return;
    const key = `${focusRequest.pathId}#${focusRequest.tick}`;
    if (lastFocusRef.current === key) return;
    const box = layout.tiles[focusRequest.pathId];
    if (!box) return;
    lastFocusRef.current = key;
    seat(box.cx, box.cy);
  }, [focusRequest, viewport, layout, seat]);

  // Wheel must be a non-passive native listener so preventDefault works; a
  // trackpad pinch arrives as a ctrl-flagged wheel (Chrome/Firefox); WebKit
  // reports it through the gesture events instead — both are handled here.
  const zoomAtPointRef = useRef(zoomAtPoint);
  zoomAtPointRef.current = zoomAtPoint;
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setViewport({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const point = (e: { clientX: number; clientY: number }) => {
      const rect = el.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { x, y } = point(e);
      const px = Math.max(-140, Math.min(140, e.deltaY));
      const pinch = e.ctrlKey;
      zoomAtPointRef.current(x, y, Math.exp(-px * (pinch ? 0.011 : 0.0016)));
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
      zoomAtPointRef.current(x, y, s / (gestureScale || 1));
      gestureScale = s;
    };
    const onGestureEnd = (e: Event) => {
      e.preventDefault();
      gestureScale = 1;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("gesturestart", onGestureStart);
    el.addEventListener("gesturechange", onGestureChange);
    el.addEventListener("gestureend", onGestureEnd);
    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
      el.removeEventListener("gestureend", onGestureEnd);
    };
  }, []);

  // Pointer drag pans the camera. Only claim the pointer once the drag passes a
  // threshold, so a plain click still reaches the tile beneath the cursor; the
  // trailing click after a drag must not select a tile.
  const dragRef = useRef({
    active: false,
    moved: false,
    captured: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    pointerId: -1,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragRef.current = {
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

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    const totalMove =
      Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY);
    if (totalMove > 4) {
      drag.moved = true;
      if (!drag.captured) {
        drag.captured = true;
        try {
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
    }
    if (drag.moved) {
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      panBy(dx, dy);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    drag.active = false;
    if (drag.captured) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    // clear the moved flag on the next tick so the click handler (which fires
    // right after pointerup) can still read it
    requestAnimationFrame(() => {
      dragRef.current.moved = false;
    });
  };

  const guardedSelect = (id: string) => {
    if (dragRef.current.moved) return;
    onSelect(id);
  };

  const guardedNodeSelect = (id: string) => {
    if (dragRef.current.moved) return;
    onSelectNode(id);
  };

  // NB: comma-separated translate() — Chrome drops a space-separated
  // `translate(-130px -112px)` with negative values as invalid CSS.
  const transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`;
  const transformStyle: React.CSSProperties = {
    transform,
    transformOrigin: "0 0",
    transition: animating
      ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none",
  };

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
      <svg className="absolute inset-0 h-full w-full select-none">
        <MapDefs />
        <rect width="100%" height="100%" fill="url(#skyGrad)" />

        <g style={transformStyle}>
          {/* star-field */}
          <g aria-hidden="true">
            {layout.stars.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="var(--color-foreground)"
                opacity={s.o}
                style={{ animation: `nb-twinkle ${5 + (i % 5)}s ease-in-out ${s.delay}s infinite` }}
              />
            ))}
          </g>

          <FloorLayer
            floors={layout.floors}
            width={layout.width}
            bossStates={bossStates}
            onUnlock={onUnlockTier}
          />

          <EdgeLayer edges={layout.edges} hoveredId={hoveredId} />

          <NodeLayer
            markers={layout.nodeMarkers}
            selectedId={selectedNodeId}
            completedIds={manualNodes}
            hoveredId={hoveredId}
            onSelect={guardedNodeSelect}
            layer="anchors"
          />

          {graph.paths.map((p) => {
            const box = layout.tiles[p.id];
            if (!box) return null;
            return (
              <Tile
                key={p.id}
                path={p}
                box={box}
                lit={written.has(p.id) || (manualCompleted.has(p.id) && !written.has(p.id))}
                locked={bossStates.get(p.tier) === "locked"}
                nodeReadCount={p.taughtNodeIds.filter((id) => manualNodes.has(id)).length}
                boss={layout.bossIds.includes(p.id)}
                selected={selectedId === p.id}
                onSelect={guardedSelect}
                onHover={onHover}
              />
            );
          })}

          {/* Keep node markers above path cards when their layouts overlap. */}
          <NodeLayer
            markers={layout.nodeMarkers}
            selectedId={selectedNodeId}
            completedIds={manualNodes}
            hoveredId={hoveredId}
            onSelect={guardedNodeSelect}
            layer="markers"
          />
        </g>

        <rect width="100%" height="100%" fill="url(#vignette)" pointerEvents="none" />
      </svg>
    </div>
  );
});

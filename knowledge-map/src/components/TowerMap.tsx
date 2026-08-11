import { CheckCircle2, Circle, Crown, LocateFixed, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { isWritten, PALETTE, statusLabel } from "../lib/colors";
import {
  computeLayout,
  LANE_X,
  TILE_H,
  TILE_W,
  type LinkPos,
  type Point,
} from "../lib/layout";
import type { FocusRequest, PathNode, SubjectGraph } from "../lib/types";
import { useCamera } from "../lib/useCamera";
import type { Viewport, WorldBounds } from "../lib/camera";

function horizCurve(a: Point, b: Point): string {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

function dropCurve(a: Point, b: Point): string {
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
}

function EdgePath({ link, d, stroke, width, opacity, dash, glow, arrow }: {
  link: LinkPos;
  d: string;
  stroke: string;
  width: number;
  opacity: number;
  dash?: string;
  glow?: boolean;
  arrow?: boolean;
}) {
  return (
    <g>
      {glow && (
        <path d={d} fill="none" stroke={stroke} strokeWidth={width * 3} opacity={opacity * 0.35} filter="url(#edgeGlow)" />
      )}
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} opacity={opacity} strokeDasharray={dash} markerEnd={arrow ? "url(#arrowhead)" : undefined} />
      {link.label && (
        <text
          x={(link.from.x + link.to.x) / 2}
          y={(link.from.y + link.to.y) / 2 - 6}
          textAnchor="middle"
          fontSize={10}
          fill={PALETTE.claimed}
          fontFamily="var(--font-mono)"
        >
          {link.label}
        </text>
      )}
    </g>
  );
}

function Tile({ path, boss, lit, manual, selected, onToggle }: {
  path: PathNode;
  boss: boolean;
  lit: boolean;
  manual: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  const written = isWritten(path.status);
  return (
    <div
      className={`group relative h-full w-full overflow-hidden rounded-lg border p-2 transition-colors ${
        selected
          ? "border-ring bg-secondary"
          : lit
            ? manual
              ? "border-[#ffb020]/70 bg-[oklch(0.24_0.06_75)]/90"
              : "border-[#5b9077]/60 bg-[oklch(0.2_0.03_155)]/85"
            : "border-transparent bg-card/50"
      }`}
    >
      <div className="absolute left-1.5 top-1.5 grid size-5 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-muted-foreground">
        {path.order}
      </div>
      {boss && <Crown className="absolute right-1.5 top-1.5 size-4" color={PALETTE.claimed} strokeWidth={2} />}
      <div className="mt-4 line-clamp-2 px-1 text-xs font-medium leading-tight text-foreground">
        {path.title}
      </div>
      <div className="absolute bottom-1 left-2 right-2 flex items-center gap-1">
        <span className="min-w-0 flex-1 truncate font-mono text-[0.6rem] text-muted-foreground">
          {statusLabel(path.status)}
        </span>
        {!written && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label={manual ? "取消完成標記" : "標記完成"}
            title={manual ? "取消完成標記" : "標記為完成"}
            className="grid size-4 shrink-0 place-items-center rounded-full text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-foreground"
          >
            {manual ? (
              <CheckCircle2 className="size-3.5" color={PALETTE.claimed} strokeWidth={2} />
            ) : (
              <Circle className="size-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

interface Tooltip {
  id: string;
  x: number;
  y: number;
}

interface Props {
  graph: SubjectGraph;
  selectedId: string | null;
  focusRequest: FocusRequest | null;
  manualCompleted: Set<string>;
  onToggleComplete: (id: string) => void;
  onSelect: (id: string | null) => void;
}

export function TowerMap({ graph, selectedId, focusRequest, manualCompleted, onToggleComplete, onSelect }: Props) {
  const layout = useMemo(() => computeLayout(graph), [graph]);
  const pathById = useMemo(() => new Map(graph.paths.map((p) => [p.id, p])), [graph]);
  const written = useMemo(
    () => new Set(graph.paths.filter((p) => isWritten(p.status)).map((p) => p.id)),
    [graph],
  );
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const hovered = tooltip ? pathById.get(tooltip.id) : null;

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
  const { cam, animating, zoomAt, panBy, seat, reset } = useCamera(graph.subject, bounds, viewport);

  // A deep-link names a tile to focus: seat the camera on it once per request.
  // The request is only consumed once the tile exists in the current layout, so
  // a race between a focus request and a subject switch is not lost silently.
  const lastFocus = useRef<string | null>(null);
  useEffect(() => {
    if (!focusRequest || viewport.w === 0) return;
    const key = `${focusRequest.pathId}#${focusRequest.tick}`;
    if (lastFocus.current === key) return;
    const tile = layout.floors.flatMap((f) => f.tiles).find((t) => t.id === focusRequest.pathId);
    if (!tile) return;
    lastFocus.current = key;
    seat(tile.x + TILE_W / 2, tile.y + TILE_H / 2);
  }, [focusRequest, layout, viewport.w, seat]);

  // Wheel must be a non-passive native listener so preventDefault works; React's
  // onWheel is passive and cannot stop the page from scrolling under the map.
  // A trackpad pinch arrives as a ctrl-flagged wheel (Chrome/Firefox); WebKit
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

  // Pointer drag pans the camera. Move/up are tracked on the window so a drag
  // that leaves the map still ends cleanly, and a press that moved becomes a
  // drag whose trailing click must not select a tile underneath.
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
      if (d.moved) {
        panBy(dx, dy);
        d.x = e.clientX;
        d.y = e.clientY;
      }
    };
    const onUp = () => {
      const d = drag.current;
      drag.current = null;
      if (d?.moved) {
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 0);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [panBy]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };

  const transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`;

  return (
    <div
      ref={containerRef}
      className="relative min-h-0 flex-1 touch-none select-none overflow-hidden"
      onPointerDown={onPointerDown}
      onClick={() => {
        if (suppressClick.current) return;
        onSelect(null);
      }}
    >
      {viewport.w > 0 && (
      <svg
        width={viewport.w}
        height={viewport.h}
        className="block h-full w-full cursor-grab"
        role="img"
        aria-label={`${graph.subject} 學習路線塔`}
      >
        <defs>
          <filter id="tileGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="edgeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <marker
            id="arrowhead"
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L7,3.5 L0,7 z" fill={PALETTE.frontier} />
          </marker>
        </defs>

        <g
          style={{
            transform,
            transformOrigin: "0 0",
            transformBox: "view-box",
            transition: animating ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        >
          <rect x={0} y={0} width={layout.width} height={layout.height} fill="var(--background)" />

          {layout.stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={i % 5 === 0 ? 1.3 : 0.7} fill={PALETTE.frontier} opacity={0.25} />
          ))}

          {layout.floors.map((f) => (
            <g key={f.tier}>
              <line
                x1={LANE_X - 20}
                x2={layout.width}
                y1={f.y + TILE_H / 2}
                y2={f.y + TILE_H / 2}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="2 8"
                opacity={0.5}
              />
              <text
                x={LANE_X - 26}
                y={f.y + TILE_H / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={13}
                fontWeight={600}
                fill="var(--muted-foreground)"
              >
                {`T${f.tier}`}
              </text>
              <text
                x={LANE_X - 26}
                y={f.y + TILE_H / 2 + 15}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={10}
                fill="var(--muted-foreground)"
                opacity={0.7}
              >
                {f.title}
              </text>
            </g>
          ))}

          {layout.shared.map((link, i) => (
            <EdgePath
              key={`s${i}`}
              link={link}
              d={horizCurve(link.from, link.to)}
              stroke={PALETTE.claimed}
              width={1}
              opacity={0.4}
              dash="4 4"
            />
          ))}

          {layout.spine.map((link, i) => (
            <EdgePath key={`sp${i}`} link={link} d={horizCurve(link.from, link.to)} stroke={PALETTE.frontier} width={1.6} opacity={0.85} arrow />
          ))}

          {layout.boundarySpine.map((link, i) => (
            <EdgePath key={`bp${i}`} link={link} d={dropCurve(link.from, link.to)} stroke={PALETTE.frontier} width={1.6} opacity={0.85} arrow />
          ))}

          {layout.explicit.map((link, i) => (
            <EdgePath key={`e${i}`} link={link} d={horizCurve(link.from, link.to)} stroke={PALETTE.resolved} width={1.4} opacity={0.9} glow arrow />
          ))}

          {layout.floors.flatMap((f) => f.tiles).map((t) => {
            const path = pathById.get(t.id);
            if (!path) return null;
            const auto = written.has(t.id);
            const manual = manualCompleted.has(t.id) && !auto;
            const lit = auto || manual;
            const boss = layout.bossIds.includes(t.id);
            const selected = selectedId === t.id;
            return (
              <g
                key={t.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (suppressClick.current) return;
                  onSelect(selected ? null : t.id);
                }}
                onMouseMove={(e) => setTooltip({ id: t.id, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip(null)}
                className="cursor-pointer"
              >
                {lit && (
                  <rect
                    x={t.x}
                    y={t.y}
                    width={TILE_W}
                    height={TILE_H}
                    rx={8}
                    fill={manual ? PALETTE.claimedGlow : PALETTE.resolvedGlow}
                    opacity={0.22}
                    filter="url(#tileGlow)"
                  />
                )}
                <foreignObject x={t.x} y={t.y} width={TILE_W} height={TILE_H}>
                  <div style={{ width: "100%", height: "100%" }} className={lit || selected ? "" : "opacity-55"}>
                    <Tile
                      path={path}
                      boss={boss}
                      lit={lit}
                      manual={manual}
                      selected={selected}
                      onToggle={() => onToggleComplete(t.id)}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>
      )}

      <div
        className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => zoomAt(viewport.w / 2, viewport.h / 2, 1.4)}
          aria-label="放大"
          title="放大"
          className="grid size-8 place-items-center rounded-md border border-input bg-card/85 text-muted-foreground backdrop-blur-sm transition-colors hover:border-ring hover:text-foreground"
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomAt(viewport.w / 2, viewport.h / 2, 1 / 1.4)}
          aria-label="縮小"
          title="縮小"
          className="grid size-8 place-items-center rounded-md border border-input bg-card/85 text-muted-foreground backdrop-blur-sm transition-colors hover:border-ring hover:text-foreground"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="回到鳥瞰"
          title="回到鳥瞰"
          className="grid size-8 place-items-center rounded-md border border-input bg-card/85 text-muted-foreground backdrop-blur-sm transition-colors hover:border-ring hover:text-foreground"
        >
          <LocateFixed className="size-4" />
        </button>
      </div>

      {tooltip && hovered && (
        <div
          className="pointer-events-none fixed z-20 w-64 rounded-lg border border-border bg-card/95 p-2.5 shadow-xl backdrop-blur-sm"
          style={{
            left: Math.min(tooltip.x + 14, window.innerWidth - 268),
            top: tooltip.y + 14,
          }}
        >
          <div className="text-xs font-semibold text-foreground">{hovered.title}</div>
          <div className="mt-0.5 font-mono text-[0.65rem] text-muted-foreground">{statusLabel(hovered.status)}</div>
          {hovered.goal && (
            <div className="mt-1 line-clamp-3 text-[0.7rem] leading-relaxed text-muted-foreground">{hovered.goal}</div>
          )}
        </div>
      )}
    </div>
  );
}

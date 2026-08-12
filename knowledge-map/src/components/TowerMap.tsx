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

const ROMAN = ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ"];

function roman(tier: number): string {
  return ROMAN[tier] ?? String(tier);
}

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
          fontFamily="var(--font-mono-stack)"
        >
          {link.label}
        </text>
      )}
    </g>
  );
}

/* A brass survey seal: the signature of a charted lesson. Rendered as
   concentric rings + center dot, like a wax stamp on a printed chart. */
function Seal({ className }: { className?: string }) {
  return (
    <svg className={`seal ${className ?? ""}`} width="14" height="14" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6.4" fill="none" stroke={PALETTE.claimed} strokeWidth="1.1" />
      <circle cx="8" cy="8" r="4.1" fill="none" stroke={PALETTE.claimed} strokeWidth="0.6" opacity="0.6" />
      <circle cx="8" cy="8" r="1.3" fill={PALETTE.claimed} />
    </svg>
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
      className={`group relative h-full w-full overflow-hidden rounded-[3px] border p-1 transition-colors ${
        selected
          ? "border-brass bg-secondary"
          : lit
            ? manual
              ? "border-brass/70 bg-brass/[0.06]"
              : "border-sage/60 bg-sage/[0.06]"
            : "border-steel/25 bg-card/60 hover:border-steel/50"
      }`}
    >
      <div className="flex items-center gap-1 pr-3">
        <span className="h-px w-2 bg-steel/60" aria-hidden />
        <span className="font-mono text-[0.58rem] leading-none text-faint">
          {String(path.order).padStart(2, "0")}
        </span>
      </div>
      {lit ? (
        <Seal className="absolute right-1 top-1 size-3.5" />
      ) : (
        boss && (
          <Crown
            className="absolute right-1 top-1 size-3.5"
            color={PALETTE.claimed}
            strokeWidth={1.5}
          />
        )
      )}
      <div className="mt-1 line-clamp-2 px-0.5 pr-4 text-[0.7rem] font-medium leading-[1.3] text-foreground">
        {path.title}
      </div>
      <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center gap-1">
        <span className="min-w-0 flex-1 truncate font-mono text-[0.58rem] text-faint">
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
            className="grid size-3.5 shrink-0 place-items-center rounded-full text-faint opacity-0 transition-all group-hover:opacity-100 hover:text-foreground"
          >
            {manual ? (
              <CheckCircle2 className="size-3.5" color={PALETTE.claimed} strokeWidth={1.5} />
            ) : (
              <Circle className="size-3.5" strokeWidth={1.5} />
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
  const chartedCount = useMemo(
    () => graph.paths.filter((p) => isWritten(p.status) || manualCompleted.has(p.id)).length,
    [graph, manualCompleted],
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

  const grid = useMemo(() => {
    const v: number[] = [];
    const h: number[] = [];
    const step = 96;
    for (let x = LANE_X; x < layout.width; x += step) v.push(x);
    for (let y = 0; y < layout.height; y += step) h.push(y);
    return { v, h };
  }, [layout.width, layout.height]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 touch-none select-none overflow-hidden"
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
          <linearGradient id="chartSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#131d33" />
            <stop offset="100%" stopColor="#0b1220" />
          </linearGradient>
          <radialGradient id="chartVignette" cx="50%" cy="42%" r="75%">
            <stop offset="55%" stopColor="#0b1220" stopOpacity="0" />
            <stop offset="100%" stopColor="#04070f" stopOpacity="0.55" />
          </radialGradient>
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
          <rect x={0} y={0} width={layout.width} height={layout.height} fill="url(#chartSky)" />
          <rect x={0} y={0} width={layout.width} height={layout.height} fill="url(#chartVignette)" />

          {grid.v.map((x) => (
            <line key={`gv${x}`} x1={x} y1={0} x2={x} y2={layout.height} stroke="var(--border)" strokeWidth={1} opacity={0.14} />
          ))}
          {grid.h.map((y) => (
            <line key={`gh${y}`} x1={0} y1={y} x2={layout.width} y2={y} stroke="var(--border)" strokeWidth={1} opacity={0.14} />
          ))}

          {layout.stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={i % 5 === 0 ? 1.3 : 0.7} fill={PALETTE.frontier} opacity={0.22} />
          ))}

          {layout.floors.map((f) => (
            <g key={f.tier}>
              <line
                x1={LANE_X - 16}
                x2={layout.width}
                y1={f.y + TILE_H / 2}
                y2={f.y + TILE_H / 2}
                stroke="var(--border)"
                strokeWidth={1}
                opacity={0.5}
              />
              <text
                x={LANE_X - 24}
                y={f.y + TILE_H / 2 - 6}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={18}
                fontFamily="var(--display)"
                fill={PALETTE.claimed}
              >
                {roman(f.tier)}
              </text>
              <text
                x={LANE_X - 24}
                y={f.y + TILE_H / 2 + 14}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={10}
                fill="var(--muted-foreground)"
                opacity={0.9}
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
                    rx={4}
                    fill={manual ? PALETTE.claimedGlow : PALETTE.resolvedGlow}
                    opacity={0.22}
                    filter="url(#tileGlow)"
                  />
                )}
                <foreignObject x={t.x} y={t.y} width={TILE_W} height={TILE_H}>
                  <div style={{ width: "100%", height: "100%" }} className={lit || selected ? "" : "opacity-60"}>
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

          <rect
            x={0.5}
            y={0.5}
            width={layout.width - 1}
            height={layout.height - 1}
            fill="none"
            stroke="var(--border)"
            opacity={0.7}
          />
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
          className="grid size-8 place-items-center rounded-sm border border-input bg-card/80 text-faint backdrop-blur-sm transition-colors hover:border-brass hover:text-brass"
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomAt(viewport.w / 2, viewport.h / 2, 1 / 1.4)}
          aria-label="縮小"
          title="縮小"
          className="grid size-8 place-items-center rounded-sm border border-input bg-card/80 text-faint backdrop-blur-sm transition-colors hover:border-brass hover:text-brass"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="回到鳥瞰"
          title="回到鳥瞰"
          className="grid size-8 place-items-center rounded-sm border border-input bg-card/80 text-faint backdrop-blur-sm transition-colors hover:border-brass hover:text-brass"
        >
          <LocateFixed className="size-4" />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 z-10 hidden text-right font-mono text-[0.6rem] leading-relaxed tracking-wide text-faint md:block">
        <div className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: PALETTE.claimed }}>
          {graph.subject}
        </div>
        <div>
          {graph.paths.length} plates · {graph.tiers.length} tiers
        </div>
        <div>{chartedCount} charted</div>
      </div>

      {tooltip && hovered && (
        <div
          className="pointer-events-none fixed z-20 w-64 rounded-sm border border-steel/40 bg-card/95 p-2.5 shadow-xl backdrop-blur-sm"
          style={{
            left: Math.min(tooltip.x + 14, window.innerWidth - 268),
            top: tooltip.y + 14,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[0.6rem] text-faint">
              {String(hovered.order).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1 font-display text-sm leading-snug text-foreground">
              {hovered.title}
            </div>
            {(written.has(hovered.id) || manualCompleted.has(hovered.id)) && (
              <Seal className="size-3 shrink-0" />
            )}
          </div>
          <div className="mt-0.5 font-mono text-[0.62rem] text-faint">{statusLabel(hovered.status)}</div>
          {hovered.goal && (
            <div className="mt-1 line-clamp-3 text-[0.7rem] leading-relaxed text-muted-foreground">
              {hovered.goal}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

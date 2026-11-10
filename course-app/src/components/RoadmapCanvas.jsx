import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { NodeGlyph } from "./Glyphs.jsx";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor } from "../lib/route.mjs";
import { CARD_H, CARD_W, layoutRoadmap, neighbors } from "../lib/roadmap.mjs";

const MIN_SCALE = 0.2;
const MAX_SCALE = 2;

function clamp(value) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function ZoomButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-lg bg-surface text-sm leading-none text-ink ring-1 ring-hairline transition-colors hover:text-accent hover:ring-accent/40"
    >
      {children}
    </button>
  );
}

/**
 * The subject roadmap: one tier per row, prerequisite edges as beziers, and
 * every node card links to its node page. Fits the graph to the container and
 * lets the reader drag or zoom when it gets dense.
 */
export default function RoadmapCanvas({
  course,
  onNavigate = null,
  focusNodeId = null,
}) {
  const layout = useMemo(() => layoutRoadmap(course.nodes), [course.nodes]);
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, moved: false, x: 0, y: 0 });
  const [fit, setFit] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(null);
  // A node page keeps its own neighbourhood lit. On the subject roadmap
  // (no focus) hovering previews a node instead.
  const anchor = focusNodeId ?? hovered ?? null;
  const related = useMemo(
    () => (anchor ? neighbors(layout.edges, anchor) : null),
    [anchor, layout.edges]
  );

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const update = () => {
      const ratio = element.clientWidth / layout.width;
      // Keep node labels readable: on wide screens do not shrink the map below
      // 0.78. The canvas overflows and the reader pans instead of squinting.
      const next =
        element.clientWidth >= 640 && ratio < 0.78
          ? 0.78
          : Math.min(1, ratio);
      setFit(next);
      setScale(next);
      setOffset({
        x:
          next > ratio
            ? Math.round((element.clientWidth - layout.width * next) / 2)
            : 0,
        y: 0,
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [layout.width]);

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    dragRef.current = {
      active: true,
      moved: false,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    drag.x = event.clientX;
    drag.y = event.clientY;
    setOffset((current) => ({ x: current.x + dx, y: current.y + dy }));
  };

  const endDrag = (event) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setScale((current) => clamp(current * (event.deltaY < 0 ? 1.1 : 0.9)));
  };

  const height = Math.max(260, Math.round(layout.height * fit));

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-1">
        <span className="robo-kicker mr-1 font-label text-[9px] text-ink-soft">
          縮放
        </span>
        <ZoomButton
          label="縮小"
          onClick={() => setScale((current) => clamp(current / 1.15))}
        >
          −
        </ZoomButton>
        <ZoomButton
          label="放大"
          onClick={() => setScale((current) => clamp(current * 1.15))}
        >
          +
        </ZoomButton>
        <ZoomButton
          label="重設視圖"
          onClick={() => {
            const element = containerRef.current;
            if (!element) return;
            setScale(fit);
            setOffset({
              x: Math.round((element.clientWidth - layout.width * fit) / 2),
              y: 0,
            });
          }}
        >
          ⟲
        </ZoomButton>
      </div>

      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onClickCapture={(event) => {
          if (!dragRef.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          dragRef.current.moved = false;
        }}
        className="dot-grid relative touch-none select-none overflow-hidden rounded-2xl border border-hairline bg-surface/40"
        style={{ height }}
        role="group"
        aria-label={`${course.title} roadmap`}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          <svg
            width={layout.width}
            height={layout.height}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 text-ink"
          >
            {layout.rows.map((row) => (
              <line
                key={`band-${row.tier}`}
                x1={0}
                x2={layout.width}
                y1={row.y - 26}
                y2={row.y - 26}
                stroke="currentColor"
                strokeOpacity="0.06"
                strokeDasharray="2 7"
              />
            ))}
            {layout.edges.map((edge) => {
              const connected =
                anchor && (edge.from === anchor || edge.to === anchor);
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edge.path}
                  fill="none"
                  stroke={connected ? "var(--color-accent)" : "currentColor"}
                  strokeOpacity={
                    hovered ? (connected ? 0.9 : 0.06) : 0.26
                  }
                  strokeWidth={connected ? 1.7 : 1.3}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {layout.rows.map((row) => {
            const tier = course.tiers.find((item) => item.tier === row.tier);
            return (
              <span
                key={`label-${row.tier}`}
                className="robo-kicker absolute left-1 -translate-y-1/2 bg-surface pr-2 font-label text-[9px] text-ink-soft"
                style={{ top: row.y - 26 }}
              >
                T{row.tier}
                {tier ? ` · ${tier.name}` : ""}
              </span>
            );
          })}

          {course.nodes.map((node) => {
            const position = layout.positions.get(node.id);
            if (!position) return null;
            const href = pathFor(course.subject, node.id);
            return (
              <a
                key={node.id}
                href={href}
                onClick={(event) => {
                  if (followInternalLink(event, href, onNavigate)) {
                    event.preventDefault();
                  }
                }}
                onPointerEnter={() => setHovered(node.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                aria-current={node.id === focusNodeId ? "page" : undefined}
                style={{
                  left: position.x,
                  top: position.y,
                  width: CARD_W,
                  height: CARD_H,
                  opacity: related && !related.has(node.id) ? 0.3 : 1,
                  zIndex: anchor === node.id ? 10 : 1,
                }}
                className={`group absolute flex flex-col justify-between rounded-xl bg-surface px-3 py-2.5 shadow-soft ring-1 transition-[opacity,box-shadow] ${
                  anchor === node.id
                    ? "shadow-lift ring-accent"
                    : "ring-hairline hover:shadow-lift hover:ring-accent/40"
                }`}
              >
                <NodeGlyph
                  seed={node.id}
                  size={13}
                  className="absolute right-2.5 top-2.5 text-ink-soft/40 transition-colors group-hover:text-accent"
                />
                <span className="line-clamp-2 pr-4 text-[0.86rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                  {node.title}
                </span>
                <span className="font-mono text-[10px] tabular-nums text-ink-soft">
                  {node.steps.length} 篇
                </span>
              </a>
            );
          })}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-paper/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-paper/80 to-transparent"
        />
        <p className="pointer-events-none absolute bottom-2.5 left-3 font-label text-[9.5px] tracking-[0.04em] text-ink-soft">
          拖曳移動 · ⌘/Ctrl + 滾輪縮放 · 點節點開始讀
        </p>
      </div>
    </div>
  );
}

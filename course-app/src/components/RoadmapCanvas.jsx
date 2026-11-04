import { useLayoutEffect, useMemo, useRef, useState } from "react";
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
      className="grid size-7 place-items-center border-2 border-ink bg-surface font-mono text-sm leading-none text-ink transition-colors hover:border-accent hover:text-accent"
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
export default function RoadmapCanvas({ course }) {
  const layout = useMemo(() => layoutRoadmap(course.nodes), [course.nodes]);
  const containerRef = useRef(null);
  const dragRef = useRef({ active: false, moved: false, x: 0, y: 0 });
  const [fit, setFit] = useState(1);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(null);
  const related = useMemo(
    () => (hovered ? neighbors(layout.edges, hovered) : null),
    [hovered, layout.edges]
  );

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const update = () => {
      const next = Math.min(1, element.clientWidth / layout.width);
      setFit(next);
      setScale(next);
      setOffset({ x: 0, y: 0 });
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
      <div className="mb-2 flex items-center justify-end gap-1">
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
            setScale(fit);
            setOffset({ x: 0, y: 0 });
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
        className="relative touch-none select-none overflow-hidden border-2 border-ink bg-paper"
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
                strokeOpacity="0.08"
                strokeDasharray="3 6"
              />
            ))}
            {layout.edges.map((edge) => {
              const connected =
                hovered && (edge.from === hovered || edge.to === hovered);
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edge.path}
                  fill="none"
                  stroke={connected ? "var(--color-accent)" : "currentColor"}
                  strokeOpacity={
                    hovered ? (connected ? 0.9 : 0.07) : 0.32
                  }
                  strokeWidth={connected ? 2.5 : 2}
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
                className="robo-kicker absolute left-1 -translate-y-1/2 bg-paper pr-2 font-label text-[9px] text-ink-soft"
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
            return (
              <a
                key={node.id}
                href={pathFor(course.subject, node.id)}
                onPointerEnter={() => setHovered(node.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                style={{
                  left: position.x,
                  top: position.y,
                  width: CARD_W,
                  height: CARD_H,
                  opacity: related && !related.has(node.id) ? 0.3 : 1,
                  zIndex: hovered === node.id ? 10 : 1,
                }}
                className={`group absolute flex flex-col justify-between border-2 bg-surface px-3 py-2 shadow-[4px_4px_0_var(--robo-shadow-soft)] transition-[opacity,border-color] ${
                  hovered === node.id
                    ? "border-accent"
                    : "border-ink hover:border-accent"
                }`}
              >
                <span className="line-clamp-2 text-[0.88rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                  {node.title}
                </span>
                <span className="font-mono text-[10px] tabular-nums text-ink-soft">
                  {node.steps.length} 篇
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-1 h-[3px] bg-ink/10"
                >
                  <span className="block h-full w-full bg-accent/45" />
                </span>
              </a>
            );
          })}
        </div>

        <p className="robo-kicker pointer-events-none absolute bottom-2.5 left-3 font-label text-[9px] text-ink-soft">
          拖曳移動 · ⌘/Ctrl + 滾輪縮放 · 點節點開始讀
        </p>
      </div>
    </div>
  );
}

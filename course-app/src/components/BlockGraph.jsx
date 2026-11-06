import { useEffect, useMemo, useRef, useState } from "react";
import {
  blockTypeFill,
  blockTypeInk,
  blockTypeLabel,
  blockTypeMark,
} from "../lib/blocks.mjs";
import {
  clampNodePosition,
  clampOffset,
  layoutBlockGraph,
  neighborsOf,
} from "../lib/block-graph.mjs";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathForBlock } from "../lib/route.mjs";

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.4;

function clamp(value) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

/** Phones start zoomed in; the whole graph is still reachable by panning. */
function defaultScale() {
  if (typeof window === "undefined" || !window.matchMedia) return 1;
  return window.matchMedia("(max-width: 640px)").matches ? 2 : 1;
}

function wrapLabel(text, max = 14) {
  const lines = [];
  let line = "";
  for (const word of String(text || "").split(/\s+/)) {
    if (!word) continue;
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
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
 * One subject's knowledge graph: blocks as nodes, `prerequisite` edges with an
 * arrow, `related` edges dotted. The force layout runs once from a fixed seed,
 * so the picture is stable after a reload.
 */
export default function BlockGraph({ course, type = "all", query = "", onNavigate = null }) {
  const graph = useMemo(
    () => layoutBlockGraph(course, { type, query }),
    [course, type, query]
  );
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const panRef = useRef({ active: false, moved: false, x: 0, y: 0 });
  const nodeDragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [scale, setScale] = useState(defaultScale);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [draggedPositions, setDraggedPositions] = useState({});
  const [hovered, setHovered] = useState(null);

  // A new filter or a dragged node must not survive the next layout.
  useEffect(() => {
    setDraggedPositions({});
    setHovered(null);
  }, [graph]);

  const byId = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph.nodes]
  );
  const neighbors = useMemo(
    () => neighborsOf(graph.links, hovered),
    [graph.links, hovered]
  );
  const related = hovered ? new Set([hovered, ...neighbors]) : null;

  const positionOf = (id) => {
    const position = draggedPositions[id] || byId.get(id);
    if (!position) return null;
    const node = byId.get(id);
    return clampNodePosition(
      position,
      node?.radius ?? 0,
      graph.width,
      graph.height
    );
  };

  // Pointer pixels are not SVG user units once the viewBox scales to fit.
  const toGraphDelta = (dx, dy) => {
    const element = svgRef.current;
    if (!element) return { x: dx, y: dy };
    const rect = element.getBoundingClientRect();
    return {
      x: (dx * graph.width) / (rect.width || graph.width),
      y: (dy * graph.height) / (rect.height || graph.height),
    };
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 || nodeDragRef.current) return;
    panRef.current = {
      active: true,
      moved: false,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onPointerMove = (event) => {
    const pan = panRef.current;
    if (!pan.active) return;
    const dx = event.clientX - pan.x;
    const dy = event.clientY - pan.y;
    if (!pan.moved && Math.hypot(dx, dy) < 4) return;
    if (!pan.moved) {
      pan.moved = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
    pan.x = event.clientX;
    pan.y = event.clientY;
    const delta = toGraphDelta(dx, dy);
    setOffset((current) =>
      clampOffset(
        { x: current.x + delta.x, y: current.y + delta.y },
        scale,
        graph.width,
        graph.height
      )
    );
  };

  const endPan = (event) => {
    const pan = panRef.current;
    pan.active = false;
    if (pan.moved) {
      window.setTimeout(() => {
        pan.moved = false;
      }, 0);
    }
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const zoomBy = (factor) => {
    const next = clamp(scale * factor);
    setScale(next);
    setOffset((current) => clampOffset(current, next, graph.width, graph.height));
  };

  const onWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 1.1 : 0.9);
  };

  const onNodeDown = (event, node) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    const start = positionOf(node.id);
    if (!start) return;
    nodeDragRef.current = {
      id: node.id,
      x: event.clientX,
      y: event.clientY,
      ox: start.x,
      oy: start.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onNodeMove = (event) => {
    const drag = nodeDragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 3) return;
    drag.moved = true;
    suppressClickRef.current = true;
    const delta = toGraphDelta(dx, dy);
    const node = byId.get(drag.id);
    setDraggedPositions((current) => ({
      ...current,
      [drag.id]: clampNodePosition(
        { x: drag.ox + delta.x / scale, y: drag.oy + delta.y / scale },
        node?.radius ?? 0,
        graph.width,
        graph.height
      ),
    }));
  };

  const endNodeDrag = (event) => {
    if (nodeDragRef.current) nodeDragRef.current = null;
    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  if (graph.nodes.length === 0) {
    return (
      <p className="border-2 border-dashed border-ink/40 bg-surface px-5 py-12 text-center text-[0.95rem] text-ink-soft">
        沒有符合條件的知識點。
      </p>
    );
  }

  const hoveredNode = hovered ? byId.get(hovered) : null;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="robo-kicker font-label text-[10px] text-ink-soft">
          實線箭頭＝先備知識 · 虛線＝相關知識
        </p>
        <div className="flex items-center gap-1">
          <span className="robo-kicker mr-1 font-label text-[9px] text-ink-soft">
            縮放
          </span>
          <ZoomButton label="縮小" onClick={() => zoomBy(1 / 1.15)}>
            −
          </ZoomButton>
          <ZoomButton label="放大" onClick={() => zoomBy(1.15)}>
            +
          </ZoomButton>
          <ZoomButton
            label="重設視圖"
            onClick={() => {
              setScale(defaultScale());
              setOffset({ x: 0, y: 0 });
              setDraggedPositions({});
            }}
          >
            ⟲
          </ZoomButton>
        </div>
      </div>

      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onWheel={onWheel}
        onClickCapture={(event) => {
          if (!panRef.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          panRef.current.moved = false;
        }}
        className="relative touch-none select-none overflow-hidden border-2 border-ink bg-paper"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`${course.title} 知識圖`}
        >
          <defs>
            <marker
              id="block-graph-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-ink-soft)" />
            </marker>
          </defs>

          <g
            transform={`translate(${offset.x} ${offset.y}) scale(${scale})`}
          >
            {graph.links.map((link) => {
              const from = positionOf(link.from);
              const to = positionOf(link.to);
              if (!from || !to) return null;
              const active =
                !related || link.from === hovered || link.to === hovered;
              const prerequisite = link.kind === "prerequisite";
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const length = Math.hypot(dx, dy) || 1;
              const x1 = from.x + (dx / length) * from.radius;
              const y1 = from.y + (dy / length) * from.radius;
              const x2 = to.x - (dx / length) * to.radius;
              const y2 = to.y - (dy / length) * to.radius;
              return (
                <line
                  key={`${link.from}-${link.to}-${link.kind}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={active ? "var(--color-ink-soft)" : "var(--color-ink)"}
                  strokeOpacity={active ? 0.55 : 0.08}
                  strokeWidth={prerequisite ? 1.8 : 1.2}
                  strokeDasharray={prerequisite ? undefined : "4 5"}
                  markerEnd={
                    prerequisite && active
                      ? "url(#block-graph-arrow)"
                      : undefined
                  }
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {graph.nodes.map((node) => {
              const position = positionOf(node.id);
              if (!position) return null;
              const dim = related && !related.has(node.id);
              const hot = hovered === node.id;
              const href = pathForBlock(course.subject, node.id);
              const lines = wrapLabel(node.label);
              const ink = hot ? "var(--color-ink)" : blockTypeInk(node.type);
              return (
                <a
                  key={node.id}
                  href={href}
                  onPointerDown={(event) => onNodeDown(event, node)}
                  onPointerMove={onNodeMove}
                  onPointerUp={endNodeDrag}
                  onPointerCancel={endNodeDrag}
                  onPointerEnter={() => setHovered(node.id)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(node.id)}
                  onBlur={() => setHovered(null)}
                  onClick={(event) => {
                    if (suppressClickRef.current) {
                      suppressClickRef.current = false;
                      event.preventDefault();
                      event.stopPropagation();
                      return;
                    }
                    if (followInternalLink(event, href, onNavigate)) {
                      event.preventDefault();
                    }
                  }}
                  opacity={dim ? 0.25 : 1}
                  className="cursor-pointer"
                >
                  <title>
                    {node.summary
                      ? `${node.title} — ${node.summary}`
                      : node.title}
                  </title>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={node.radius}
                    fill={
                      hot ? "var(--color-accent)" : blockTypeFill(node.type)
                    }
                    stroke={hot ? "var(--color-accent)" : "var(--color-ink)"}
                    strokeWidth={hot ? 3 : 2}
                  />
                  <text
                    x={position.x}
                    y={position.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={ink}
                    className="font-mono text-[9px]"
                    style={{ pointerEvents: "none" }}
                  >
                    {blockTypeMark(node.type)}
                  </text>
                  <text
                    x={position.x}
                    y={position.y + node.radius + 13}
                    textAnchor="middle"
                    className="fill-ink font-sans text-[10px]"
                    style={{
                      pointerEvents: "none",
                      paintOrder: "stroke",
                      stroke: "var(--color-paper)",
                      strokeWidth: 3,
                      strokeLinejoin: "round",
                    }}
                  >
                    {lines.map((line, index) => (
                      <tspan
                        key={`${node.id}-${index}`}
                        x={position.x}
                        dy={index === 0 ? 0 : 11}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </a>
              );
            })}
          </g>
        </svg>

        <p className="pointer-events-none absolute bottom-2.5 left-3 max-w-[70%] truncate font-label text-[10px] text-ink-soft">
          {hoveredNode
            ? `${hoveredNode.title} · ${blockTypeLabel(hoveredNode.type)}`
            : "拖曳節點移動 · 縮放後拖曳空白平移 · ⌘/Ctrl + 滾輪縮放 · 點節點開啟"}
        </p>
      </div>
    </div>
  );
}

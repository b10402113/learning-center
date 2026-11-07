import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ForceGraph2D from "react-force-graph-2d";
import { forceCollide } from "d3-force";
import { blockTypeLabel, blockTypeMark } from "../lib/blocks.mjs";
import { buildGraph, neighborsOf } from "../lib/block-graph.mjs";
import { followInternalLink, isPlainLeftClick } from "../lib/navigation.mjs";
import { pathForBlock } from "../lib/route.mjs";

const MIN_GRAPH_HEIGHT = 420;
const MAX_GRAPH_HEIGHT = 680;
const INITIAL_FIT_PADDING = 116;
const FONT_FAMILY =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Noto Sans TC", sans-serif';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Resolve the theme tokens once per paint; canvas cannot read CSS variables. */
function readPalette() {
  if (typeof document === "undefined") {
    return {
      paper: "#faf8f5",
      surface: "#faf8f2",
      shade: "#e8e2d2",
      accent: "#ff6b1a",
      darkColor: "#131311",
      ink: "#1c1a16",
      inkSoft: "#6f6a5c",
      isDark: false,
    };
  }
  const styles = getComputedStyle(document.documentElement);
  const read = (name, fallback) =>
    styles.getPropertyValue(name).trim() || fallback;
  return {
    paper: read("--color-paper", "#faf8f5"),
    surface: read("--color-surface", "#faf8f2"),
    shade: read("--color-shade", "#e8e2d2"),
    accent: read("--color-accent", "#ff6b1a"),
    darkColor: read("--color-dark", "#131311"),
    ink: read("--color-ink", "#1c1a16"),
    inkSoft: read("--color-ink-soft", "#6f6a5c"),
    isDark: document.documentElement.classList.contains("dark"),
  };
}

function usePalette() {
  const [palette, setPalette] = useState(readPalette);
  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return palette;
}

function fillFor(type, palette) {
  if (type === "procedure") return palette.shade;
  if (type === "principle") return palette.accent;
  if (type === "contrast") return palette.darkColor;
  return palette.surface;
}

function inkFor(type, palette) {
  if (type !== "contrast") return palette.ink;
  return palette.isDark ? palette.ink : palette.paper;
}

function truncate(text, max) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** Width, and a height that keeps the graph readable at every breakpoint. */
function useCanvasSize(minHeight = MIN_GRAPH_HEIGHT, maxHeight = MAX_GRAPH_HEIGHT) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: minHeight });
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const width = element.clientWidth;
      if (!width) return;
      setSize({
        width,
        height: Math.round(clamp(width * 0.64, minHeight, maxHeight)),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [minHeight, maxHeight]);
  return [ref, size];
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
 * One subject's knowledge graph, drawn on a canvas by react-force-graph.
 * Blocks are nodes; `prerequisite` edges carry an arrow and `related` edges
 * are dashed. Hovering dims everything but the node and its neighbours.
 */
export default function BlockGraph({
  course,
  type = "all",
  query = "",
  focus = null,
  focusIds = null,
  depth = 1,
  minHeight = MIN_GRAPH_HEIGHT,
  maxHeight = MAX_GRAPH_HEIGHT,
  compact = false,
  showHint = true,
  framed = true,
  settleImmediately = false,
  onNavigate = null,
}) {
  const graph = useMemo(
    () => buildGraph(course, { type, query, focus, focusIds, depth }),
    [course, type, query, focus, focusIds, depth]
  );

  // react-force-graph wants `source`/`target`; the layout starts empty.
  const data = useMemo(
    () => ({
      // Hubs are painted first, so their labels win the collision pass.
      nodes: [...graph.nodes]
        .sort((a, b) => b.degree - a.degree)
        .map((node) => ({ ...node })),
      links: graph.links.map((link) => ({
        ...link,
        source: link.from,
        target: link.to,
      })),
    }),
    [graph]
  );

  const palette = usePalette();
  const [containerRef, size] = useCanvasSize(minHeight, maxHeight);
  const fgRef = useRef(null);
  const fittedForRef = useRef(null);
  const placedLabelsRef = useRef([]);
  const [hovered, setHovered] = useState(null);
  const [ready, setReady] = useState(false);
  const [fitted, setFitted] = useState(!settleImmediately);

  const byId = useMemo(
    () => new Map(data.nodes.map((node) => [node.id, node])),
    [data.nodes]
  );
  const neighbors = useMemo(
    () => neighborsOf(graph.links, hovered),
    [graph.links, hovered]
  );
  const related = hovered ? new Set([hovered, ...neighbors]) : null;

  // A new filter rebuilds the graph; drop the stale hover and marker.
  useEffect(() => {
    setHovered(null);
    fittedForRef.current = null;
    setFitted(!settleImmediately);
  }, [data, settleImmediately]);

  // Softer charge and a little collision keep the 50-node course tidy.
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-160).distanceMax(520);
    const link = fg.d3Force("link");
    link?.distance(72);
    link?.strength(0.5);
    fg.d3Force(
      "collide",
      forceCollide((node) => (node.radius || 12) + 16).iterations(3)
    );
  }, [data, ready]);

  // Wait until the container is measured so the canvas is not created at 0px.
  useEffect(() => {
    if (size.width > 0) setReady(true);
  }, [size.width]);

  const drawNode = useCallback(
    (node, ctx, globalScale) => {
      const dim = related && !related.has(node.id);
      const hot = hovered === node.id;
      const radius = node.radius;

      ctx.save();
      ctx.globalAlpha = dim ? 0.18 : 1;

      if (node.isFocus) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = palette.accent;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = hot ? palette.accent : fillFor(node.type, palette);
      ctx.fill();
      ctx.lineWidth = hot ? 2.4 : 1.6;
      ctx.strokeStyle = hot ? palette.accent : palette.ink;
      ctx.stroke();

      const markSize = Math.max(7, radius * 0.95);
      ctx.font = `700 ${markSize}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = hot ? palette.paper : inkFor(node.type, palette);
      ctx.fillText(blockTypeMark(node.type), node.x, node.y + markSize * 0.04);

      const priority = hot || node.isFocus || related?.has(node.id);
      const showLabel = priority || globalScale >= 0.15;
      if (showLabel) {
        const labelSize = 12 / globalScale;
        const label = truncate(node.label, 20);
        ctx.font = `500 ${labelSize}px ${FONT_FAMILY}`;
        const width = ctx.measureText(label).width;
        const labelY = node.y + radius + 4 / globalScale;
        const rect = {
          x: node.x - width / 2 - 2,
          y: labelY - 1,
          w: width + 4,
          h: labelSize * 1.25,
        };
        const collides = placedLabelsRef.current.some(
          (placed) =>
            rect.x < placed.x + placed.w &&
            rect.x + rect.w > placed.x &&
            rect.y < placed.y + placed.h &&
            rect.y + rect.h > placed.y
        );
        if (priority || !collides) {
          placedLabelsRef.current.push(rect);
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.lineWidth = 3 / globalScale;
          ctx.strokeStyle = palette.paper;
          ctx.lineJoin = "round";
          ctx.strokeText(label, node.x, labelY);
          ctx.fillStyle = hot ? palette.ink : palette.inkSoft;
          ctx.fillText(label, node.x, labelY);
        }
      }

      ctx.restore();
    },
    [hovered, related, palette]
  );

  const drawPointerArea = useCallback((node, color, ctx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const drawLink = useCallback(
    (link, ctx, globalScale) => {
      const from = link.source;
      const to = link.target;
      if (!from || !to || typeof from !== "object" || typeof to !== "object") {
        return;
      }

      const prerequisite = link.kind === "prerequisite";
      const active =
        !related || from.id === hovered || to.id === hovered;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.hypot(dx, dy) || 1;
      const x1 = from.x + (dx / length) * (from.radius || 0);
      const y1 = from.y + (dy / length) * (from.radius || 0);
      const x2 = to.x - (dx / length) * (to.radius || 0);
      const y2 = to.y - (dy / length) * (to.radius || 0);

      ctx.save();
      ctx.globalAlpha = active ? 0.6 : 0.08;
      ctx.strokeStyle = palette.inkSoft;
      ctx.lineWidth = prerequisite ? 1.8 : 1.2;
      ctx.setLineDash(prerequisite ? [] : [5, 5]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (prerequisite && active) {
        const size = 6;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.setLineDash([]);
        ctx.fillStyle = palette.inkSoft;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
          x2 - size * Math.cos(angle - Math.PI / 6),
          y2 - size * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          x2 - size * Math.cos(angle + Math.PI / 6),
          y2 - size * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    },
    [hovered, palette, related]
  );

  const onNodeClick = useCallback(
    (node, event) => {
      const href = pathForBlock(course.subject, node.id);
      if (onNavigate && followInternalLink(event, href, onNavigate)) {
        event.preventDefault();
        return;
      }
      if (!onNavigate && isPlainLeftClick(event)) {
        window.location.assign(href);
      }
    },
    [course.subject, onNavigate]
  );

  const zoomBy = (factor) => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.zoom(fg.zoom() * factor, 200);
  };

  const fitView = (duration = 500, padding = 96) => {
    const fg = fgRef.current;
    if (!fg) return;
    const instant = duration === 0;
    // Fitting one node would zoom until the circle fills the canvas.
    if (data.nodes.length === 1) {
      const node = data.nodes[0];
      if (Number.isFinite(node.x) && Number.isFinite(node.y)) {
        fg.centerAt(node.x, node.y, duration);
      }
      fg.zoom(1.2, duration);
      return;
    }
    fg.zoomToFit(duration, padding);
    window.setTimeout(() => {
      // A handful of nodes should not be blown up to fill the canvas.
      if (data.nodes.length <= 4 && fg.zoom() > 1.8) {
        fg.zoom(1.8, instant ? 0 : 200);
      }
      // A phone-sized canvas would render a big graph as tiny dots.
      if (size.width < 640 && data.nodes.length > 8) {
        fg.zoom(fg.zoom() * 2.2, instant ? 0 : 250);
      }
    }, duration + 20);
  };

  const resetView = () =>
    fitView(450, settleImmediately ? INITIAL_FIT_PADDING : 96);

  // Settled graphs must never show the unstyled layout first: fit and reveal
  // once, with no animated zoom. This effect is the fallback if the engine
  // stops before the ref is wired.
  useEffect(() => {
    if (!settleImmediately || !ready) return;
    if (fittedForRef.current === data) {
      setFitted(true);
      return;
    }
    const timer = window.setTimeout(() => {
      if (fittedForRef.current === data) return;
      fittedForRef.current = data;
      fitView(0, settleImmediately ? INITIAL_FIT_PADDING : 96);
      setFitted(true);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [settleImmediately, ready, data]);

  if (graph.nodes.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-hairline bg-surface/50 px-5 py-12 text-center text-[0.95rem] text-ink-soft">
        沒有符合條件的知識點。
      </p>
    );
  }

  const hoveredNode = hovered ? byId.get(hovered) : null;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="font-label text-[10px] tracking-[0.04em] text-ink-soft">
          {compact ? "點節點可跳轉" : "實線箭頭＝先備知識 · 虛線＝相關知識"}
        </p>
        <div className="flex items-center gap-1">
          <span className="robo-kicker mr-1 font-label text-[9px] text-ink-soft">
            縮放
          </span>
          <ZoomButton label="縮小" onClick={() => zoomBy(1 / 1.2)}>
            −
          </ZoomButton>
          <ZoomButton label="放大" onClick={() => zoomBy(1.2)}>
            +
          </ZoomButton>
          <ZoomButton label="重設視圖" onClick={resetView}>
            ⟲
          </ZoomButton>
        </div>
      </div>

      <div
        ref={containerRef}
        role="img"
        aria-label={`${course.title} 知識圖`}
        className={`relative overflow-hidden rounded-2xl ${
          framed ? "border border-hairline bg-surface/40" : "bg-shade/40"
        }`}
        style={{ height: size.height }}
      >
        {ready && size.width > 0 && (
          <ForceGraph2D
            ref={fgRef}
            graphData={data}
            width={size.width}
            height={size.height}
            backgroundColor="rgba(0,0,0,0)"
            nodeCanvasObject={drawNode}
            nodePointerAreaPaint={drawPointerArea}
            linkCanvasObject={drawLink}
            onNodeHover={(node) => setHovered(node ? node.id : null)}
            onNodeClick={onNodeClick}
            onRenderFramePre={() => {
              placedLabelsRef.current = [];
            }}
            onEngineStop={() => {
              if (fittedForRef.current === data) {
                setFitted(true);
                return;
              }
              fittedForRef.current = data;
              fitView(0, settleImmediately ? INITIAL_FIT_PADDING : 96);
              setFitted(true);
            }}
            warmupTicks={settleImmediately ? 180 : 0}
            cooldownTicks={settleImmediately ? 0 : 200}
            enableNodeDrag
            style={{
              opacity: fitted ? 1 : 0,
              transition: "none",
            }}
          />
        )}

        {showHint && (
          <p className="pointer-events-none absolute bottom-2.5 left-3 max-w-[70%] truncate font-label text-[10px] text-ink-soft">
            {hoveredNode
              ? `${hoveredNode.title} · ${blockTypeLabel(hoveredNode.type)}`
              : compact
                ? "拖曳 · 滾輪縮放 · 點節點開啟"
                : "拖曳節點移動 · 拖曳空白平移 · 滾輪縮放 · 點節點開啟"}
          </p>
        )}
      </div>
    </div>
  );
}

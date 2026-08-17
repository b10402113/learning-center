import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import ForceGraph, {
  type GraphData,
  type LinkObject,
  type NodeObject,
} from "force-graph";
import { isWritten } from "../lib/colors";
import type { FocusRequest, MapHandle, SubjectGraph } from "../lib/types";

interface FNode extends NodeObject {
  id: string;
  kind: "node" | "element";
  nodeId?: string;
  elementId?: string;
  title: string;
  tier: number;
}
interface FLink extends LinkObject<FNode> {
  kind: "spine" | "shared" | "explicit" | "teach";
  label?: string;
}
type FGraph = ForceGraph<FNode, FLink>;

interface ForceMapProps {
  graph: SubjectGraph;
  selectedId: string | null;
  selectedElementId: string | null;
  focusRequest: FocusRequest | null;
  completedNodes: Set<string>;
  manualElements: Set<string>;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onSelectElement: (id: string) => void;
  onHover: (id: string | null) => void;
}

export const ForceMap = forwardRef<MapHandle, ForceMapProps>(function ForceMap(
  {
    graph,
    selectedId,
    selectedElementId,
    focusRequest,
    completedNodes,
    manualElements,
    hoveredId,
    onSelect,
    onSelectElement,
    onHover,
  }: ForceMapProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gRef = useRef<FGraph | null>(null);
  const engineStoppedRef = useRef(false);
  const pendingSeatRef = useRef<string | null>(null);
  const lastFocusRef = useRef<string | null>(null);

  // Theme tokens (mirrors app.css, drawn directly onto the canvas).
  const C = {
    brass: "#ff0071",
    brassDim: "#c40058",
    beacon: "#ff5ca8",
    surface2: "#1e1e21",
    border: "#2a2a2e",
    muted: "#a0a0a5",
    foreground: "#f5f5f5",
    faint: "#8b8b8f",
    teach: "#2f2f33",
  };

  const LINK_STYLES: Record<
    FLink["kind"],
    { color: string; width: number; dash?: number[] }
  > = {
    spine: { color: C.muted, width: 1.6 },
    shared: { color: C.brassDim, width: 1.1, dash: [4, 5] },
    explicit: { color: C.beacon, width: 1.9 },
    teach: { color: C.teach, width: 0.7, dash: [1, 3] },
  };

  const written = useMemo(
    () => new Set(graph.nodes.filter((p) => isWritten(p.status)).map((p) => p.id)),
    [graph],
  );

  // The draw callbacks are registered once with force-graph; the continuous
  // render loop (autoPauseRedraw(false)) re-reads live state every frame, so
  // selection / hover / completion changes redraw without re-registering.
  const liveRef = useRef({
    selectedId,
    selectedElementId,
    written,
    completedNodes,
    manualElements,
    hoveredId,
    onSelect,
    onSelectElement,
    onHover,
  });
  liveRef.current = {
    selectedId,
    selectedElementId,
    written,
    completedNodes,
    manualElements,
    hoveredId,
    onSelect,
    onSelectElement,
    onHover,
  };

  function truncate(s: string, max: number): string {
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
  }

  const radiusOf = (n: FNode): number => {
    const { selectedId, selectedElementId, written, completedNodes } = liveRef.current;
    if (n.kind === "node") {
      if (n.nodeId === selectedId) return 11;
      if (written.has(n.nodeId!) || completedNodes.has(n.nodeId!)) return 9;
      return 8;
    }
    return n.elementId === selectedElementId ? 7 : 5;
  };

  const matches = (n: FNode, id: string) =>
    n.kind === "node" ? n.nodeId === id : n.elementId === id;

  function drawNode(node: FNode, ctx: CanvasRenderingContext2D, gs: number) {
    const { selectedId, selectedElementId, written, completedNodes, manualElements } =
      liveRef.current;
    const isLesson = node.kind === "node";
    const selected = isLesson
      ? node.nodeId === selectedId
      : node.elementId === selectedElementId;
    const lit =
      isLesson && (written.has(node.nodeId!) || completedNodes.has(node.nodeId!));
    const r = radiusOf(node);
    ctx.save();
    ctx.translate(node.x ?? 0, node.y ?? 0);
    if (isLesson) {
      if (selected) {
        ctx.beginPath();
        ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 92, 168, 0.16)";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = lit ? "#241019" : C.surface2;
      ctx.fill();
      ctx.strokeStyle = selected ? C.beacon : lit ? C.brassDim : C.border;
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      ctx.font = `${10 / gs}px "IBM Plex Sans", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = selected ? C.foreground : C.faint;
      ctx.fillText(node.title, 0, r + 5 / gs);
    } else {
      const completed = manualElements.has(node.elementId ?? "");
      const nr = selected ? 7 : 5;
      ctx.beginPath();
      ctx.arc(0, 0, nr, 0, Math.PI * 2);
      ctx.fillStyle = selected ? C.beacon : completed ? C.brass : C.brassDim;
      ctx.globalAlpha = selected ? 0.95 : completed ? 0.9 : 0.35;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = selected ? C.beacon : completed ? C.brass : C.brassDim;
      ctx.lineWidth = selected ? 2 : 1.25;
      ctx.stroke();
      ctx.font = `${9 / gs}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = C.faint;
      ctx.fillText(truncate(node.title, 8), 10 / gs, 0);
    }
    ctx.restore();
  }

  function drawLink(link: FLink, ctx: CanvasRenderingContext2D) {
    const { hoveredId } = liveRef.current;
    const s = link.source;
    const t = link.target;
    if (
      !s ||
      !t ||
      typeof s === "string" ||
      typeof t === "string" ||
      typeof s === "number" ||
      typeof t === "number"
    )
      return;
    const x1 = s.x ?? 0;
    const y1 = s.y ?? 0;
    const x2 = t.x ?? 0;
    const y2 = t.y ?? 0;
    const hovered = hoveredId !== null;
    const connected = hovered && (matches(s, hoveredId) || matches(t, hoveredId));
    const style = LINK_STYLES[link.kind];
    ctx.save();
    ctx.globalAlpha = hovered && !connected ? 0.1 : 1;
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    if (style.dash) ctx.setLineDash(style.dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (link.kind === "spine" || link.kind === "explicit") {
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const r = radiusOf(t);
      const tipX = x2 - Math.cos(ang) * r;
      const tipY = y2 - Math.sin(ang) * r;
      const size = 5;
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - Math.cos(ang - Math.PI / 6) * size, tipY - Math.sin(ang - Math.PI / 6) * size);
      ctx.lineTo(tipX - Math.cos(ang + Math.PI / 6) * size, tipY - Math.sin(ang + Math.PI / 6) * size);
      ctx.closePath();
      ctx.fillStyle = style.color;
      ctx.fill();
    }
    ctx.restore();
  }

  const buildData = useCallback(
    (subject: SubjectGraph): GraphData<FNode, FLink> => {
      const nodes: FNode[] = [];
      const links: FLink[] = [];
      for (const p of subject.nodes) {
        nodes.push({
          id: `p:${p.id}`,
          kind: "node",
          nodeId: p.id,
          title: p.title,
          tier: p.tier,
        });
        for (const nid of p.taughtElementIds) {
          links.push({ source: `p:${p.id}`, target: `n:${nid}`, kind: "teach" });
        }
      }
      for (const [nid, n] of Object.entries(subject.elements)) {
        nodes.push({ id: `n:${nid}`, kind: "element", elementId: nid, title: n.title, tier: n.tier });
      }
      for (const e of subject.edges) {
        // step-dep edges connect steps (nodeId/stepId), which the nebula does
        // not render as nodes yet — the step-node rework owns those links.
        if (e.kind === "step-dep") continue;
        const kind = e.kind === "shared-concept" ? "shared" : e.kind;
        links.push({ source: `p:${e.from}`, target: `p:${e.to}`, kind, label: e.label });
      }
      return { nodes, links };
    },
    [],
  );

  const seatNow = useCallback((nodeId: string) => {
    const g = gRef.current;
    if (!g) return;
    const n = g.graphData().nodes.find(
      (node) => node.kind === "node" && node.nodeId === nodeId,
    );
    if (!n) return;
    g.centerAt(n.x ?? 0, n.y ?? 0, 450);
    g.zoom(1.7, 450);
  }, []);

  const centerOn = useCallback((node: FNode) => {
    const g = gRef.current;
    if (!g) return;
    g.centerAt(node.x ?? 0, node.y ?? 0, 400);
    g.zoom(1.5, 400);
  }, []);

  const requestSeat = useCallback((nodeId: string) => {
    if (!gRef.current) return;
    if (engineStoppedRef.current) {
      seatNow(nodeId);
    } else {
      pendingSeatRef.current = nodeId;
    }
  }, [seatNow]);

  // Imperative surface shared with the roadmap view's controls.
  useImperativeHandle(
    ref,
    () => ({
      fit: () => {
        gRef.current?.zoomToFit(400, 48);
      },
      zoomBy: (factor: number) => {
        const g = gRef.current;
        if (!g) return;
        g.zoom(g.zoom() * factor, 200);
      },
      seatOnNode: (nodeId: string) => {
        requestSeat(nodeId);
      },
    }),
    [requestSeat],
  );

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    const g = new ForceGraph<FNode, FLink>(host)
      .nodeId("id")
      .linkSource("source")
      .linkTarget("target")
      .graphData(buildData(graph))
      .width(w)
      .height(h)
      .nodeVal((n) => (n.kind === "node" ? 1.6 : 1))
      .cooldownTime(2200)
      .d3VelocityDecay(0.34)
      .autoPauseRedraw(false)
      .nodeLabel(() => "")
      .linkLabel(() => "")
      .nodeCanvasObjectMode(() => "replace")
      .nodeCanvasObject(drawNode)
      .linkCanvasObjectMode(() => "replace")
      .linkCanvasObject(drawLink)
      .onNodeClick((node) => {
        const n = node as FNode;
        if (n.kind === "node") liveRef.current.onSelect(n.nodeId ?? null);
        else {
          centerOn(n);
          liveRef.current.onSelectElement(n.elementId ?? "");
        }
      })
      .onNodeHover((node) => {
        const n = node as FNode | null;
        if (n?.kind === "node") liveRef.current.onHover(n.nodeId ?? null);
        else liveRef.current.onHover(null);
      })
      .onEngineStop(() => {
        engineStoppedRef.current = true;
        if (pendingSeatRef.current) {
          seatNow(pendingSeatRef.current);
          pendingSeatRef.current = null;
        } else {
          g.zoomToFit(450, 48);
        }
      });
    // Tune the default forces: nodes spread more than concept elements, and the
    // teach-links pull each concept element closer to its nodes.
    const charge = g.d3Force("charge");
    if (charge) charge.strength((n: FNode) => (n.kind === "node" ? -28 : -16));
    const link = g.d3Force("link");
    if (link) link.distance((l: FLink) => (l.kind === "teach" ? 55 : 80));
    gRef.current = g;
    if (focusRequest) requestSeat(focusRequest.nodeId);
    const ro = new ResizeObserver(() => {
      g.width(host.clientWidth).height(host.clientHeight);
    });
    ro.observe(host);
    return () => {
      ro.disconnect();
      g._destructor();
      gRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A subject switch rebuilds the graph and re-runs the layout.
  useEffect(() => {
    const g = gRef.current;
    if (!g) return;
    g.graphData(buildData(graph));
    engineStoppedRef.current = false;
    pendingSeatRef.current = null;
  }, [graph, buildData]);

  // A deep-link names a tile to focus: seat the camera on it once per request.
  useEffect(() => {
    if (!focusRequest || !gRef.current) return;
    const key = `${focusRequest.nodeId}#${focusRequest.tick}`;
    if (lastFocusRef.current === key) return;
    lastFocusRef.current = key;
    requestSeat(focusRequest.nodeId);
  }, [focusRequest, requestSeat]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full touch-none select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 18%, #161618, #121214 42%, #0a0a0c)",
      }}
      aria-label={`${graph.subject} 星雲圖`}
      role="application"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="fgDotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="#2a2a2e" fillOpacity="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fgDotGrid)" />
      </svg>
    </div>
  );
});

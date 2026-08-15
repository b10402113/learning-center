import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import ForceGraph, {
  type GraphData,
  type LinkObject,
  type NodeObject,
} from "force-graph";
import { isWritten } from "../lib/colors";
import { makeStars } from "../lib/layout";
import type { TierBossState } from "../lib/selectors";
import type { FocusRequest, SubjectGraph, TowerMapHandle } from "../lib/types";

interface FNode extends NodeObject {
  id: string;
  kind: "path" | "node";
  pathId?: string;
  nodeId?: string;
  title: string;
  tier: number;
  boss?: boolean;
}
interface FLink extends LinkObject<FNode> {
  kind: "spine" | "shared" | "explicit" | "teach";
  label?: string;
}
type FGraph = ForceGraph<FNode, FLink>;

interface ForceMapProps {
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
}

export const ForceMap = forwardRef<TowerMapHandle, ForceMapProps>(function ForceMap(
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
  }: ForceMapProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const gRef = useRef<FGraph | null>(null);
  const engineStoppedRef = useRef(false);
  const pendingSeatRef = useRef<string | null>(null);
  const lastFocusRef = useRef<string | null>(null);

  // Theme tokens (mirrors app.css, drawn directly onto the canvas).
  const C = {
    brass: "oklch(0.82 0.13 82)",
    brassDim: "oklch(0.55 0.09 82)",
    beacon: "oklch(0.78 0.13 205)",
    surface2: "oklch(0.26 0.028 265)",
    lockedFill: "oklch(0.17 0.022 265)",
    border: "oklch(0.34 0.03 265)",
    muted: "oklch(0.62 0.02 260)",
    foreground: "oklch(0.92 0.01 260)",
    steel: "oklch(0.42 0.03 265)",
    faint: "oklch(0.62 0.02 260)",
    teach: "oklch(0.45 0.03 265)",
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
    () => new Set(graph.paths.filter((p) => isWritten(p.status)).map((p) => p.id)),
    [graph],
  );
  const bossIds = useMemo(
    () =>
      new Set(
        graph.tiers
          .map((t) => t.pathIds[t.pathIds.length - 1])
          .filter((id): id is string => Boolean(id)),
      ),
    [graph],
  );
  const stars = useMemo(
    () => makeStars(graph.subject, viewport.w || 800, viewport.h || 600),
    [graph.subject, viewport],
  );

  // The draw callbacks are registered once with force-graph; the continuous
  // render loop (autoPauseRedraw(false)) re-reads live state every frame, so
  // selection / hover / completion changes redraw without re-registering.
  const liveRef = useRef({
    selectedId,
    selectedNodeId,
    written,
    bossIds,
    manualCompleted,
    manualNodes,
    bossStates,
    hoveredId,
    onSelect,
    onSelectNode,
    onHover,
  });
  liveRef.current = {
    selectedId,
    selectedNodeId,
    written,
    bossIds,
    manualCompleted,
    manualNodes,
    bossStates,
    hoveredId,
    onSelect,
    onSelectNode,
    onHover,
  };

  function truncate(s: string, max: number): string {
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
  }

  const radiusOf = (n: FNode): number => {
    const { selectedId, selectedNodeId, written, manualCompleted, bossStates } = liveRef.current;
    if (n.kind === "path") {
      if (n.pathId === selectedId) return 11;
      if (bossStates.get(n.tier) === "locked") return 7;
      if (written.has(n.pathId!) || manualCompleted.has(n.pathId!)) return 9;
      return 8;
    }
    return n.nodeId === selectedNodeId ? 7 : 5;
  };

  const matches = (n: FNode, id: string) =>
    n.kind === "path" ? n.pathId === id : n.nodeId === id;

  function drawNode(node: FNode, ctx: CanvasRenderingContext2D, gs: number) {
    const { selectedId, selectedNodeId, written, manualCompleted, manualNodes, bossStates } =
      liveRef.current;
    const isPath = node.kind === "path";
    const selected = isPath
      ? node.pathId === selectedId
      : node.nodeId === selectedNodeId;
    const lit =
      isPath && (written.has(node.pathId!) || manualCompleted.has(node.pathId!));
    const locked = isPath && bossStates.get(node.tier) === "locked";
    const r = radiusOf(node);
    ctx.save();
    ctx.translate(node.x ?? 0, node.y ?? 0);
    if (isPath) {
      if (selected) {
        ctx.beginPath();
        ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = "oklch(0.78 0.13 205 / 0.16)";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = locked ? C.lockedFill : lit ? "oklch(0.3 0.045 90)" : C.surface2;
      ctx.fill();
      ctx.strokeStyle = selected ? C.beacon : locked ? C.steel : lit ? C.brassDim : C.border;
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      if (node.boss) {
        ctx.font = `${12 / gs}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = C.brass;
        ctx.fillText("♛", 0, -r - 8 / gs);
      }
      if (locked) {
        ctx.font = `${9 / gs}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = C.faint;
        ctx.fillText("🔒", 0, -r - 6 / gs);
      }
      ctx.font = `${10 / gs}px "IBM Plex Sans", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = selected ? C.foreground : C.faint;
      ctx.fillText(node.title, 0, r + 5 / gs);
    } else {
      const completed = manualNodes.has(node.nodeId ?? "");
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
      for (const p of subject.paths) {
        nodes.push({
          id: `p:${p.id}`,
          kind: "path",
          pathId: p.id,
          title: p.title,
          tier: p.tier,
          boss: bossIds.has(p.id),
        });
        for (const nid of p.taughtNodeIds) {
          links.push({ source: `p:${p.id}`, target: `n:${nid}`, kind: "teach" });
        }
      }
      for (const [nid, n] of Object.entries(subject.nodes)) {
        nodes.push({ id: `n:${nid}`, kind: "node", nodeId: nid, title: n.title, tier: n.tier });
      }
      for (const e of subject.edges) {
        const kind = e.kind === "shared-concept" ? "shared" : e.kind;
        links.push({ source: `p:${e.from}`, target: `p:${e.to}`, kind, label: e.label });
      }
      return { nodes, links };
    },
    [bossIds],
  );

  const seatNow = useCallback((pathId: string) => {
    const g = gRef.current;
    if (!g) return;
    const n = g.graphData().nodes.find(
      (node) => node.kind === "path" && node.pathId === pathId,
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

  const requestSeat = useCallback((pathId: string) => {
    if (!gRef.current) return;
    if (engineStoppedRef.current) {
      seatNow(pathId);
    } else {
      pendingSeatRef.current = pathId;
    }
  }, [seatNow]);

  // Imperative surface shared with the tower view's controls.
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
      seatOnPath: (pathId: string) => {
        requestSeat(pathId);
      },
    }),
    [requestSeat],
  );

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    setViewport({ w, h });
    const g = new ForceGraph<FNode, FLink>(host)
      .nodeId("id")
      .linkSource("source")
      .linkTarget("target")
      .graphData(buildData(graph))
      .width(w)
      .height(h)
      .nodeVal((n) => (n.kind === "path" ? 1.6 : 1))
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
        if (n.kind === "path") liveRef.current.onSelect(n.pathId ?? null);
        else {
          centerOn(n);
          liveRef.current.onSelectNode(n.nodeId ?? "");
        }
      })
      .onNodeHover((node) => {
        const n = node as FNode | null;
        if (n?.kind === "path") liveRef.current.onHover(n.pathId ?? null);
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
    // Tune the default forces: lessons spread more than concept nodes, and the
    // teach-links pull each concept node closer to its lessons.
    const charge = g.d3Force("charge");
    if (charge) charge.strength((n: FNode) => (n.kind === "path" ? -28 : -16));
    const link = g.d3Force("link");
    if (link) link.distance((l: FLink) => (l.kind === "teach" ? 55 : 80));
    gRef.current = g;
    if (focusRequest) requestSeat(focusRequest.pathId);
    const ro = new ResizeObserver(() => {
      setViewport({ w: host.clientWidth, h: host.clientHeight });
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
    const key = `${focusRequest.pathId}#${focusRequest.tick}`;
    if (lastFocusRef.current === key) return;
    lastFocusRef.current = key;
    requestSeat(focusRequest.pathId);
  }, [focusRequest, requestSeat]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full touch-none select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 18%, oklch(0.24 0.05 275), oklch(0.18 0.03 268) 42%, oklch(0.12 0.02 265))",
      }}
      aria-label={`${graph.subject} 星雲圖`}
      role="application"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {stars.map((s, i) => (
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
      </svg>
    </div>
  );
});

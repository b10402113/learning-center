import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import ForceGraph, {
  type GraphData,
  type LinkObject,
  type NodeObject,
} from "force-graph";
import type { FocusRequest, MapHandle, SubjectGraph } from "../lib/types";

interface FNode extends NodeObject {
  id: string;
  kind: "step" | "element";
  /** Node-qualified step id (`nodeId/stepId`) for step nodes. */
  stepId?: string;
  elementId?: string;
  title: string;
  /** Owning node's title, shown under a step's label (ADR-0004). */
  nodeTitle: string;
  tier: number;
}
interface FLink extends LinkObject<FNode> {
  kind: "step-dep" | "teach";
}
type FGraph = ForceGraph<FNode, FLink>;

interface ForceMapProps {
  graph: SubjectGraph;
  /** The selected step id (`nodeId/stepId`) or element id, for highlight. */
  selectedId: string | null;
  selectedElementId: string | null;
  focusRequest: FocusRequest | null;
  /** Node-qualified step ids seeded/overridden complete (ADR-0005). */
  completedSteps: Set<string>;
  hoveredId: string | null;
  onSelectStep: (nodeId: string, stepId: string) => void;
  onSelectElement: (id: string) => void;
  onHover: (id: string | null) => void;
}

export const ForceMap = forwardRef<MapHandle, ForceMapProps>(function ForceMap(
  {
    graph,
    selectedId,
    selectedElementId,
    focusRequest,
    completedSteps,
    hoveredId,
    onSelectStep,
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

  // Adjacency index over the live graph's links (step-dep + teach), keyed by
  // full node ids (`p:<stepId>` / `n:<elementId>`). Rebuilt when the graph
  // rebuilds; drives hover dimming of non-neighbor nodes.
  const neighborsRef = useRef<ReadonlyMap<string, ReadonlySet<string>>>(new Map());

  const indexNeighbors = useCallback((links: FLink[]) => {
      const m = new Map<string, Set<string>>();
      for (const l of links) {
        const s = typeof l.source === "string" ? l.source : (l.source as FNode)?.id;
        const t = typeof l.target === "string" ? l.target : (l.target as FNode)?.id;
        if (!s || !t) continue;
        const a = m.get(s) ?? new Set<string>();
        const b = m.get(t) ?? new Set<string>();
        a.add(t);
        b.add(s);
        m.set(s, a);
        m.set(t, b);
      }
      neighborsRef.current = m;
    }, []);

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
    teach: "#5f5f66",
  };

  const LINK_STYLES: Record<
    FLink["kind"],
    { color: string; width: number; dash?: number[] }
  > = {
    // Dependency edges come from a step's `deps` — dashed to read as "must come
    // first", with an arrowhead showing the direction of the dependency.
    "step-dep": { color: C.beacon, width: 1.3, dash: [5, 4] },
    // Teach links pull each concept element toward the step teaching it.
    teach: { color: C.teach, width: 0.8, dash: [1, 3] },
  };

  // The draw callbacks are registered once with force-graph; the continuous
  // render loop (autoPauseRedraw(false)) re-reads live state every frame, so
  // selection / hover / completion changes redraw without re-registering.
  const liveRef = useRef({
    selectedId,
    selectedElementId,
    completedSteps,
    hoveredId,
    onSelectStep,
    onSelectElement,
    onHover,
  });
  liveRef.current = {
    selectedId,
    selectedElementId,
    completedSteps,
    hoveredId,
    onSelectStep,
    onSelectElement,
    onHover,
  };

  function truncate(s: string, max: number): string {
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
  }

  const radiusOf = (n: FNode): number => {
    const { selectedId, selectedElementId, completedSteps } = liveRef.current;
    if (n.kind === "step") {
      if (n.stepId === selectedId) return 11;
      if (completedSteps.has(n.stepId!)) return 9;
      return 8;
    }
    return n.elementId === selectedElementId ? 7 : 5;
  };

  const matches = (n: FNode, id: string) =>
    n.kind === "step" ? n.stepId === id : n.elementId === id;

  // Whether a node is the hovered node or directly connected to it by a
  // step-dep or teach link. Drives the hover highlight: neighbors stay lit,
  // everything else fades.
  const isHoverNeighbor = (node: FNode, hoveredId: string): boolean => {
    const myFull = node.kind === "step" ? `p:${node.stepId}` : `n:${node.elementId}`;
    const hoverFull = `p:${hoveredId}`;
    const hoverElemFull = `n:${hoveredId}`;
    if (myFull === hoverFull || myFull === hoverElemFull) return true;
    const ns = neighborsRef.current.get(hoverFull);
    if (ns && ns.has(myFull)) return true;
    const ne = neighborsRef.current.get(hoverElemFull);
    if (ne && ne.has(myFull)) return true;
    return false;
  };

  function drawNode(node: FNode, ctx: CanvasRenderingContext2D, gs: number) {
    const { selectedId, selectedElementId, completedSteps, hoveredId } = liveRef.current;
    const isStep = node.kind === "step";
    const selected = isStep
      ? node.stepId === selectedId
      : node.elementId === selectedElementId;
    const done = isStep && completedSteps.has(node.stepId!);
    const r = radiusOf(node);
    const dimmed = hoveredId !== null && !isHoverNeighbor(node, hoveredId) ? 0.15 : 1;
    ctx.save();
    ctx.translate(node.x ?? 0, node.y ?? 0);
    if (isStep) {
      ctx.globalAlpha = dimmed;
      if (selected) {
        ctx.beginPath();
        ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 92, 168, 0.16)";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = done ? "#241019" : C.surface2;
      ctx.fill();
      ctx.strokeStyle = selected ? C.beacon : done ? C.brassDim : C.border;
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      // Step title below the node; the owning node's label rides under it in a
      // smaller mono face so the step reads as belonging to its container.
      ctx.font = `${10 / gs}px "IBM Plex Sans", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = selected ? C.foreground : C.faint;
      ctx.fillText(truncate(node.title, 22), 0, r + 5 / gs);
      ctx.font = `${8 / gs}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.fillStyle = C.faint;
      ctx.fillText(`◂ ${truncate(node.nodeTitle, 18)}`, 0, r + 5 / gs + 12 / gs);
    } else {
      const nr = selected ? 7 : 5;
      ctx.beginPath();
      ctx.arc(0, 0, nr, 0, Math.PI * 2);
      ctx.fillStyle = selected ? C.beacon : C.brassDim;
      ctx.globalAlpha = (selected ? 0.95 : 0.35) * dimmed;
      ctx.fill();
      ctx.strokeStyle = selected ? C.beacon : C.brassDim;
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
    ctx.globalAlpha = hovered && !connected ? 0.08 : 1;
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    if (style.dash) ctx.setLineDash(style.dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (link.kind === "step-dep") {
      // Arrowhead on the step that depends on the source step — the target of
      // the dependency edge is the dependent step.
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
      const nodeById = new Map(subject.nodes.map((n) => [n.id, n]));
      // Steps are the nebula's lesson nodes: one node per step, pulled toward
      // the elements it teaches; step-dep edges wire the node's step-DAG.
      for (const [id, s] of Object.entries(subject.steps)) {
        const owning = nodeById.get(s.nodeId);
        nodes.push({
          id: `p:${id}`,
          kind: "step",
          stepId: id,
          title: s.title,
          nodeTitle: owning?.title ?? s.nodeId,
          tier: owning?.tier ?? 1,
        });
        for (const depId of s.deps) {
          links.push({ source: `p:${depId}`, target: `p:${id}`, kind: "step-dep" });
        }
        for (const eid of s.teaches) {
          links.push({ source: `p:${id}`, target: `n:${eid}`, kind: "teach" });
        }
      }
      for (const [nid, n] of Object.entries(subject.elements)) {
        nodes.push({
          id: `n:${nid}`,
          kind: "element",
          elementId: nid,
          title: n.title,
          nodeTitle: "",
          tier: n.tier,
        });
      }
      return { nodes, links };
    },
    [],
  );

  const seatNow = useCallback((stepId: string) => {
    const g = gRef.current;
    if (!g) return;
    const n = g.graphData().nodes.find(
      (node) => node.kind === "step" && node.stepId === stepId,
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

  const requestSeat = useCallback(
    (stepId: string) => {
      if (!gRef.current) return;
      if (engineStoppedRef.current) {
        seatNow(stepId);
      } else {
        pendingSeatRef.current = stepId;
      }
    },
    [seatNow],
  );

  // Imperative surface shared with the roadmap view's controls. `nodeId` here is
  // a node-qualified step id (`nodeId/stepId`) in the nebula.
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
      seatOnNode: (stepId: string) => {
        requestSeat(stepId);
      },
    }),
    [requestSeat],
  );

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    const initial = buildData(graph);
    indexNeighbors(initial.links);
    const g = new ForceGraph<FNode, FLink>(host)
      .nodeId("id")
      .linkSource("source")
      .linkTarget("target")
      .graphData(initial)
      .width(w)
      .height(h)
      .nodeVal((n) => (n.kind === "step" ? 1.6 : 1))
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
        if (n.kind === "step") {
          const id = n.stepId!;
          const slash = id.indexOf("/");
          if (slash > 0) {
            liveRef.current.onSelectStep(id.slice(0, slash), id.slice(slash + 1));
          }
        } else {
          centerOn(n);
          liveRef.current.onSelectElement(n.elementId ?? "");
        }
      })
      .onNodeHover((node) => {
        const n = node as FNode | null;
        if (n?.kind === "step") liveRef.current.onHover(n.stepId ?? null);
        else if (n?.kind === "element") liveRef.current.onHover(n.elementId ?? null);
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
    // Tune the default forces: step nodes spread more than concept elements, and
    // the teach-links pull each concept element closer to the step teaching it.
    const charge = g.d3Force("charge");
    if (charge) charge.strength((n: FNode) => (n.kind === "step" ? -28 : -16));
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
    const next = buildData(graph);
    indexNeighbors(next.links);
    g.graphData(next);
    engineStoppedRef.current = false;
    pendingSeatRef.current = null;
  }, [graph, buildData, indexNeighbors]);

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


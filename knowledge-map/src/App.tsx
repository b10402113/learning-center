import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import graphData from "./data/graph.json";
import { RoadMap } from "./components/RoadMap";
import { ElementPage } from "./components/ElementPage";
import { ForceMap } from "./components/ForceMap";
import { HoverCard } from "./components/HoverCard";
import { Legend } from "./components/Legend";
import { MapControls } from "./components/MapControls";
import { NodeDetailView } from "./components/NodeDetailView";
import { NodePage } from "./components/NodePage";
import { ReaderModal } from "./components/ReaderModal";
import { StepPage } from "./components/StepPage";
import { TopBar } from "./components/TopBar";
import { isStepComplete, nodeCompletion, stepsOfNode, toggleStep, type CompletionInput } from "./lib/completion";
import { isWritten } from "./lib/colors";
import { buildHash, buildElementHash, buildNodeHash, buildStepHash, parseHash, type Route } from "./lib/hashlink";
import {
  emptySubjectProgress,
  loadProgress,
  saveProgress,
  type ProgressRecord,
  type SubjectProgress,
} from "./lib/progress";
import type { FocusRequest, MapHandle, ReaderModalTarget, SubjectGraph } from "./lib/types";

const graphs = graphData as unknown as SubjectGraph[];

function defaultSubject(): string {
  let best = graphs[0]?.subject ?? "";
  let bestCount = -1;
  for (const g of graphs) {
    const count = g.nodes.filter((n) => isWritten(n.status)).length;
    if (count > bestCount) {
      bestCount = count;
      best = g.subject;
    }
  }
  return best;
}

// Resolve a hash to a concrete route. The node route must name a subject and
// lesson that exist; the element route must name a subject and element that
// exist; the map route must name a subject and node that exist; anything else
// falls back to the given subject with no selection.
function resolveRoute(hash: string, fallbackSubject: string): Route {
  const route = parseHash(hash);
  const graph = graphs.find((g) => g.subject === route.subject);
  if (route.kind === "node") {
    const validNode = graph?.nodes.some((n) => n.id === route.nodeId);
    if (graph && validNode) return route;
    return { kind: "map", subject: graph?.subject ?? fallbackSubject, nodeId: null };
  }
  if (route.kind === "element") {
    const element = graph?.elements[route.elementId];
    if (graph && element) return route;
    return { kind: "map", subject: graph?.subject ?? fallbackSubject, nodeId: null };
  }
  if (route.kind === "step") {
    const step = graph?.steps[`${route.nodeId}/${route.stepId}`];
    const validNode = graph?.nodes.some((n) => n.id === route.nodeId);
    if (graph && validNode && step) return route;
    return { kind: "map", subject: graph?.subject ?? fallbackSubject, nodeId: null };
  }
  const validNode = graph?.nodes.some((n) => n.id === route.nodeId) ? route.nodeId : null;
  return { kind: "map", subject: graph ? graph.subject : fallbackSubject, nodeId: validNode };
}

// Resolve the initial deep-link once at module load. The app mounts a single
// time and reads the URL only on first render; later navigation flows through
// the hashchange dispatch.
const initialRoute = resolveRoute(window.location.hash, defaultSubject());

// Derive the completion state for one subject's graph (ADR-0005): step
// completion = seed ∪ manual, with manual clears winning over a seed; a node
// is complete iff every step in its DAG is complete. Pure — never reads
// storage or the DOM.
function completionFor(
  g: SubjectGraph,
  rec: SubjectProgress | undefined,
): { completedSteps: Set<string>; completedNodes: Set<string> } {
  const state: CompletionInput = {
    seeded: new Set(g.seededSteps),
    manual: new Set(rec?.steps ?? []),
    cleared: new Set(rec?.cleared ?? []),
  };
  const completedSteps = new Set(
    Object.keys(g.steps).filter((id) => isStepComplete(id, state)),
  );
  const completedNodes = new Set(
    g.nodes
      .filter((n) =>
        nodeCompletion(
          stepsOfNode(g.steps, n.id).map((s) => s.id),
          state,
        ),
      )
      .map((n) => n.id),
  );
  return { completedSteps, completedNodes };
}

export default function App() {
  const [route, setRoute] = useState<Route>(initialRoute);
  const [subject, setSubject] = useState<string>(() => initialRoute.subject ?? defaultSubject());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() =>
    initialRoute.kind === "element" ||
    initialRoute.kind === "node" ||
    initialRoute.kind === "step"
      ? null
      : initialRoute.nodeId,
  );
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(() =>
    initialRoute.kind === "map" && initialRoute.nodeId
      ? { nodeId: initialRoute.nodeId, tick: 0 }
      : null,
  );
  const [progress, setProgress] = useState<ProgressRecord>(loadProgress);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [view, setView] = useState<"nebula" | "roadmap">("nebula");
  const [nodeDetailOpen, setNodeDetailOpen] = useState(false);
  const [readerModal, setReaderModal] = useState<ReaderModalTarget | null>(null);
  const mapRef = useRef<MapHandle | null>(null);

  // Mirror subject + selection into the hash so the current map view is
  // shareable. replaceState (not pushState) so the map never floods the history
  // stack. Element routes are never overwritten — they are navigated to by
  // setting location.hash, which adds a history entry for back/forward.
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (route.kind !== "map") return;
    const next = buildHash(subject, selectedNodeId);
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [route, subject, selectedNodeId]);

  // React to external hash edits (back/forward, pasted links, manual typing,
  // and our own element/map navigation) and dispatch to the right view. Any
  // hash navigation also dismisses the transient reader modal.
  useEffect(() => {
    const onHashChange = () => {
      const next = resolveRoute(window.location.hash, subject);
      setRoute(next);
      setNodeDetailOpen(false);
      setReaderModal(null);
      if (next.kind === "element" || next.kind === "node" || next.kind === "step") {
        setSubject(next.subject);
        setSelectedNodeId(null);
        setFocusRequest(null);
      } else {
        setSubject(next.subject ?? subject);
        setSelectedNodeId(next.nodeId);
        if (next.nodeId) setFocusRequest({ nodeId: next.nodeId, tick: performance.now() });
        else setFocusRequest(null);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [subject]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const graph = graphs.find((g) => g.subject === subject) ?? graphs[0];

  // The reader modal can carry a different subject than the map (cross-subject
  // wikilinks); resolve the graph for whatever it is currently showing.
  const modalGraph = readerModal
    ? (graphs.find((g) => g.subject === readerModal.subject) ?? graphs[0])
    : null;

  const subjectProgress = progress[graph.subject] ?? emptySubjectProgress();

  // Step completion is the only completion unit: seeded from mastery at
  // generate time, overridable by hand in localStorage. Node completion is
  // derived from its step-DAG — never stored.
  const completion = useMemo(
    () => completionFor(graph, progress[graph.subject]),
    [graph, progress],
  );

  // Completion inside the modal reads/writes the *modal* subject's record — never
  // the map subject's — so cross-subject wikilinks can't pollute progress.
  const modalCompletion = useMemo(
    () => (modalGraph ? completionFor(modalGraph, progress[modalGraph.subject]) : null),
    [modalGraph, progress],
  );

  const hasProgress =
    subjectProgress.steps.length > 0 || subjectProgress.cleared.length > 0;

  // Mutate one subject's progress record inside the shared ProgressRecord.
  function updateSubject(
    subjectKey: string,
    update: (s: SubjectProgress) => SubjectProgress,
  ) {
    const current = progress[subjectKey] ?? emptySubjectProgress();
    setProgress({ ...progress, [subjectKey]: update(current) });
  }

  // Toggle one step's completion. Manual state is authoritative over a seed:
  // un-checking a seeded step records a clear; re-checking records a manual
  // mark (which beats the clear). Pure toggle logic lives in lib/completion.
  function toggleStepCompletion(subjectKey: string, stepId: string) {
    const target = graphs.find((g) => g.subject === subjectKey) ?? graphs[0];
    updateSubject(subjectKey, (s) =>
      toggleStep(stepId, {
        seeded: new Set(target.seededSteps),
        manual: new Set(s.steps),
        cleared: new Set(s.cleared),
      }),
    );
  }

  function resetProgress() {
    if (!(graph.subject in progress)) return;
    const next = { ...progress };
    delete next[graph.subject];
    setProgress(next);
    toast("已清除手動進度", { description: graph.subject });
  }

  // track the pointer for the hover card
  useEffect(() => {
    if (!hoveredId) return;
    const onMove = (e: MouseEvent) => {
      setPointer({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hoveredId]);

  // Navigation through the URL hash keeps the browser back/forward button in
  // sync and keeps element deep-links shareable.
  function navigateToMap(targetSubject: string, nodeId: string | null) {
    window.location.hash = buildHash(targetSubject, nodeId);
  }

  function navigateToNode(targetSubject: string, nodeId: string) {
    window.location.hash = buildNodeHash(targetSubject, nodeId);
  }

  function navigateToElement(targetSubject: string, elementId: string, from?: string | null) {
    window.location.hash = buildElementHash(targetSubject, elementId, from);
  }

  function navigateToStep(targetSubject: string, nodeId: string, stepId: string) {
    window.location.hash = buildStepHash(targetSubject, nodeId, stepId);
  }

  // ── Reader modal (ADR-0003) ──
  // The transient overlay is pure React state — never written to the URL. Map
  // clicks open it; links inside it switch its content; expand navigates to
  // the standalone page (closing the modal); close/Esc dismiss it back to the
  // surface underneath.
  function openNodeReader(targetSubject: string, nodeId: string) {
    setReaderModal({ kind: "node", subject: targetSubject, nodeId });
  }

  function openStepReader(targetSubject: string, nodeId: string, stepId: string) {
    setReaderModal({ kind: "step", subject: targetSubject, nodeId, stepId });
  }

  function openElementReader(
    targetSubject: string,
    elementId: string,
    from: string | null = null,
  ) {
    setReaderModal({ kind: "element", subject: targetSubject, elementId, from });
  }

  function closeReaderModal() {
    setReaderModal(null);
  }

  function expandReaderModal(target: ReaderModalTarget) {
    if (target.kind === "node") navigateToNode(target.subject, target.nodeId);
    else if (target.kind === "step") navigateToStep(target.subject, target.nodeId, target.stepId);
    else navigateToElement(target.subject, target.elementId, target.from);
    setReaderModal(null);
  }

  function selectNode(id: string | null) {
    setSelectedNodeId(id);
    if (id && view === "roadmap") {
      setNodeDetailOpen(true);
    } else if (id && view === "nebula") {
      openNodeReader(subject, id);
    }
    if (id) setFocusRequest({ nodeId: id, tick: performance.now() });
    else setFocusRequest(null);
  }

  function closeNodeDetail() {
    setNodeDetailOpen(false);
    setSelectedNodeId(null);
    setFocusRequest(null);
  }

  // Standalone pages navigate directly — links inside them never open the modal.
  function openElement(subjectKey: string, elementId: string, from?: string | null) {
    navigateToElement(subjectKey, elementId, from);
  }

  function openNode(subjectKey: string, nodeId: string) {
    navigateToNode(subjectKey, nodeId);
  }

  function openStep(subjectKey: string, nodeId: string, stepId: string) {
    navigateToStep(subjectKey, nodeId, stepId);
  }

  function switchSubject(s: string) {
    if (s === subject) return;
    navigateToMap(s, null);
  }

  function switchView(v: "nebula" | "roadmap") {
    if (route.kind === "element" || route.kind === "node" || route.kind === "step") {
      // The view toggle doubles as "back to the map" from a standalone page.
      navigateToMap(subject, null);
      setView(v);
      return;
    }
    setView(v);
  }

  const selectedNode = selectedNodeId
    ? (graph.nodes.find((n) => n.id === selectedNodeId) ?? null)
    : null;
  const hoveredNode =
    hoveredId && hoveredId !== selectedNodeId
      ? (graph.nodes.find((n) => n.id === hoveredId) ?? null)
      : null;

  return (
    <TooltipPrimitive.Provider>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <TopBar
          graphs={graphs}
          subject={subject}
          view={view}
          hasProgress={hasProgress}
          onReset={resetProgress}
          onSelect={switchSubject}
          onViewChange={switchView}
        />
        {route.kind === "node" ? (
          <NodePage
            graph={graph}
            nodeId={route.nodeId}
            completedSteps={completion.completedSteps}
            onToggleStep={(id) => toggleStepCompletion(graph.subject, id)}
            onNavigateNode={openNode}
            onNavigateStep={openStep}
            onNavigateElement={openElement}
            onBackToMap={() => navigateToMap(subject, null)}
          />
        ) : route.kind === "element" ? (
          <ElementPage
            graph={graph}
            elementId={route.elementId}
            from={route.from}
            completedSteps={completion.completedSteps}
            onToggleStep={(id) => toggleStepCompletion(graph.subject, id)}
            onNavigateNode={openNode}
            onNavigateStep={openStep}
            onNavigateElement={openElement}
            onBackToMap={() => navigateToMap(subject, null)}
          />
        ) : route.kind === "step" ? (
          <StepPage
            graph={graph}
            nodeId={route.nodeId}
            stepId={route.stepId}
            completedSteps={completion.completedSteps}
            onToggleStep={(id) => toggleStepCompletion(graph.subject, id)}
            onNavigateNode={openNode}
            onNavigateStep={openStep}
            onNavigateElement={openElement}
            onBackToMap={() => navigateToMap(subject, null)}
          />
        ) : (
          <div className="relative min-h-0 flex-1">
            {view === "roadmap" ? (
              <RoadMap
                ref={mapRef}
                graph={graph}
                selectedId={selectedNodeId}
                focusRequest={focusRequest}
                completedNodes={completion.completedNodes}
                onSelect={selectNode}
                onHover={setHoveredId}
              />
            ) : (
              <ForceMap
                ref={mapRef}
                graph={graph}
                selectedId={selectedNodeId}
                selectedElementId={null}
                focusRequest={focusRequest}
                completedNodes={completion.completedNodes}
                hoveredId={hoveredId}
                onSelect={selectNode}
                onSelectElement={(elementId) => openElementReader(subject, elementId)}
                onHover={setHoveredId}
              />
            )}

            <Legend />

            <MapControls
              onZoomIn={() => mapRef.current?.zoomBy(1.25)}
              onZoomOut={() => mapRef.current?.zoomBy(0.8)}
              onReset={() => mapRef.current?.fit()}
              onResetProgress={resetProgress}
              canResetProgress={hasProgress}
            />

            {hoveredNode ? <HoverCard node={hoveredNode} x={pointer.x} y={pointer.y} /> : null}

            {nodeDetailOpen && selectedNode ? (
              <NodeDetailView
                graph={graph}
                node={selectedNode}
                completedSteps={completion.completedSteps}
                onViewElement={(elementId) => openElementReader(graph.subject, elementId, selectedNode.id)}
                onViewNode={(nodeId) => openNodeReader(graph.subject, nodeId)}
                onViewContent={() => openNodeReader(graph.subject, selectedNode.id)}
                onClose={closeNodeDetail}
                escDisabled={readerModal !== null}
              />
            ) : null}

            {readerModal && modalGraph ? (
              <ReaderModal
                graph={modalGraph}
                target={readerModal}
                completedSteps={modalCompletion?.completedSteps ?? new Set()}
                onToggleStep={(id) => toggleStepCompletion(modalGraph.subject, id)}
                onNavigateNode={openNodeReader}
                onNavigateStep={openStepReader}
                onNavigateElement={openElementReader}
                onBackToMap={closeReaderModal}
                onExpand={expandReaderModal}
                onClose={closeReaderModal}
              />
            ) : null}
          </div>
        )}
      </div>
      <Toaster
        theme="dark"
        position="bottom-center"
        visibleToasts={4}
        closeButton
        richColors
      />
    </TooltipPrimitive.Provider>
  );
}

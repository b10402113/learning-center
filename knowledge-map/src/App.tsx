import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import graphData from "./data/graph.json";
import { RoadMap } from "./components/RoadMap";
import { DetailPane } from "./components/DetailPane";
import { ForceMap } from "./components/ForceMap";
import { HoverCard } from "./components/HoverCard";
import { Legend } from "./components/Legend";
import { MapControls } from "./components/MapControls";
import { NodeDetailView } from "./components/NodeDetailView";
import { TopBar } from "./components/TopBar";
import { isNodeComplete } from "./lib/completion";
import { isWritten } from "./lib/colors";
import { buildHash, parseHash } from "./lib/hashlink";
import {
  emptySubjectProgress,
  loadProgress,
  saveProgress,
  toggleId,
  type ProgressRecord,
  type SubjectProgress,
} from "./lib/progress";
import type { FocusRequest, MapHandle, SubjectGraph, View } from "./lib/types";

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

// Resolve a hash to a concrete subject + node. The subject must exist and the
// node must exist in that subject; anything else falls back to the given
// subject with no selection.
function resolveHash(
  hash: string,
  fallbackSubject: string,
): { subject: string; nodeId: string | null } {
  const { subject, nodeId } = parseHash(hash);
  const graph = graphs.find((g) => g.subject === subject);
  const validNode = graph?.nodes.some((n) => n.id === nodeId) ? nodeId : null;
  return {
    subject: graph ? graph.subject : fallbackSubject,
    nodeId: validNode,
  };
}

export default function App() {
  const [subject, setSubject] = useState<string>(() =>
    resolveHash(window.location.hash, defaultSubject()).subject,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() =>
    resolveHash(window.location.hash, defaultSubject()).nodeId,
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(() => {
    const initial = resolveHash(window.location.hash, defaultSubject());
    return initial.nodeId ? { nodeId: initial.nodeId, tick: 0 } : null;
  });
  const [progress, setProgress] = useState<ProgressRecord>(loadProgress);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [view, setView] = useState<"nebula" | "roadmap">("nebula");
  const [nodeDetailOpen, setNodeDetailOpen] = useState(false);
  const mapRef = useRef<MapHandle | null>(null);

  // Mirror subject + selection into the hash so the current view is shareable.
  // replaceState (not pushState) so the map never floods the history stack.
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const next = buildHash(subject, selectedNodeId);
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [subject, selectedNodeId]);

  // React to external hash edits (back/forward, pasted links, manual typing).
  useEffect(() => {
    const onHashChange = () => {
      const next = resolveHash(window.location.hash, subject);
      setSubject(next.subject);
      setSelectedNodeId(next.nodeId);
      setSelectedElementId(null);
      if (next.nodeId) setFocusRequest({ nodeId: next.nodeId, tick: performance.now() });
      else setFocusRequest(null);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [subject]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const graph = graphs.find((g) => g.subject === subject) ?? graphs[0];

  const subjectProgress = progress[graph.subject] ?? emptySubjectProgress();

  // The manual completion set holds element ids and a node's own id (its main
  // article row). Node completion is derived from it — never stored.
  const manualElements = useMemo(() => new Set(subjectProgress.elements), [subjectProgress]);
  const completedNodes = useMemo(
    () =>
      new Set(
        graph.nodes.filter((n) => isNodeComplete(n, manualElements)).map((n) => n.id),
      ),
    [graph, manualElements],
  );

  const hasProgress = subjectProgress.elements.length > 0;

  // Mutate one subject's progress record inside the shared ProgressRecord.
  function updateSubject(
    subjectKey: string,
    update: (s: SubjectProgress) => SubjectProgress,
  ) {
    const current = progress[subjectKey] ?? emptySubjectProgress();
    setProgress({ ...progress, [subjectKey]: update(current) });
  }

  // Toggle one checklist row: an element id, or a node id for its main row.
  function toggleCompletion(id: string) {
    updateSubject(graph.subject, (s) => ({ ...s, elements: toggleId(s.elements, id) }));
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

  function selectNode(id: string | null) {
    setSelectedNodeId(id);
    setSelectedElementId(null);
    if (id && view === "roadmap") {
      setNodeDetailOpen(true);
    }
    if (id) setFocusRequest({ nodeId: id, tick: performance.now() });
    else setFocusRequest(null);
  }

  function closeNodeDetail() {
    setNodeDetailOpen(false);
    setSelectedNodeId(null);
    setSelectedElementId(null);
    setFocusRequest(null);
  }

  function openElementFromDetail(elementId: string) {
    setNodeDetailOpen(false);
    setSelectedElementId(elementId);
    setSelectedNodeId(null);
  }

  function openContentFromDetail() {
    // Keep the node selected so DetailPane opens with full-read.
    setNodeDetailOpen(false);
  }

  function selectElement(id: string) {
    setSelectedElementId(id);
    setSelectedNodeId(null);
    setFocusRequest(null);
  }

  function switchSubject(s: string) {
    if (s === subject) return;
    setSubject(s);
    setSelectedNodeId(null);
    setSelectedElementId(null);
    setNodeDetailOpen(false);
    setFocusRequest(null);
    setHoveredId(null);
  }

  const selectedNode = selectedNodeId
    ? (graph.nodes.find((n) => n.id === selectedNodeId) ?? null)
    : null;
  const selectedElement = selectedElementId ? (graph.elements[selectedElementId] ?? null) : null;
  const root: View | null = nodeDetailOpen
    ? null
    : selectedElement
      ? { kind: "element", id: selectedElement.id }
      : selectedNode
        ? { kind: "node", id: selectedNode.id }
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
          onViewChange={(v: "nebula" | "roadmap") => setView(v)}
        />
        <div className="relative min-h-0 flex-1">
          {view === "roadmap" ? (
            <RoadMap
              ref={mapRef}
              graph={graph}
              selectedId={selectedNodeId}
              focusRequest={focusRequest}
              completedNodes={completedNodes}
              onSelect={selectNode}
              onHover={setHoveredId}
            />
          ) : (
            <ForceMap
              ref={mapRef}
              graph={graph}
              selectedId={selectedNodeId}
              selectedElementId={selectedElementId}
              focusRequest={focusRequest}
              completedNodes={completedNodes}
              manualElements={manualElements}
              hoveredId={hoveredId}
              onSelect={selectNode}
              onSelectElement={selectElement}
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

          {root ? (
            <DetailPane
              graph={graph}
              root={root}
              manualElements={manualElements}
              onToggleCompletion={toggleCompletion}
              onClose={() => selectNode(null)}
            />
          ) : null}

          {nodeDetailOpen && selectedNode ? (
            <NodeDetailView
              graph={graph}
              node={selectedNode}
              manualElements={manualElements}
              onToggleCompletion={toggleCompletion}
              onViewElement={openElementFromDetail}
              onViewContent={openContentFromDetail}
              onClose={closeNodeDetail}
            />
          ) : null}
        </div>
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

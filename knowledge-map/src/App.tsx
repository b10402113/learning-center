import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import graphData from "./data/graph.json";
import { DetailPane } from "./components/DetailPane";
import { ForceMap } from "./components/ForceMap";
import { HoverCard } from "./components/HoverCard";
import { Legend } from "./components/Legend";
import { MapControls } from "./components/MapControls";
import { TopBar } from "./components/TopBar";
import { TowerMap } from "./components/TowerMap";
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
import { firstUnchartedInSpine, tierBossState, tierIsUnlocked } from "./lib/selectors";
import type { FocusRequest, SubjectGraph, TowerMapHandle, View } from "./lib/types";

const graphs = graphData as unknown as SubjectGraph[];

function defaultSubject(): string {
  let best = graphs[0]?.subject ?? "";
  let bestCount = -1;
  for (const g of graphs) {
    const count = g.paths.filter((p) => isWritten(p.status)).length;
    if (count > bestCount) {
      bestCount = count;
      best = g.subject;
    }
  }
  return best;
}

// Resolve a hash to a concrete subject + path. The subject must exist and the
// path must exist in that subject; anything else falls back to the given
// subject with no selection.
function resolveHash(
  hash: string,
  fallbackSubject: string,
): { subject: string; pathId: string | null } {
  const { subject, pathId } = parseHash(hash);
  const graph = graphs.find((g) => g.subject === subject);
  const validPath = graph?.paths.some((p) => p.id === pathId) ? pathId : null;
  return {
    subject: graph ? graph.subject : fallbackSubject,
    pathId: validPath,
  };
}

export default function App() {
  const [subject, setSubject] = useState<string>(() =>
    resolveHash(window.location.hash, defaultSubject()).subject,
  );
  const [selectedPathId, setSelectedPathId] = useState<string | null>(() =>
    resolveHash(window.location.hash, defaultSubject()).pathId,
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(() => {
    const initial = resolveHash(window.location.hash, defaultSubject());
    return initial.pathId ? { pathId: initial.pathId, tick: 0 } : null;
  });
  const [progress, setProgress] = useState<ProgressRecord>(loadProgress);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [view, setView] = useState<"nebula" | "tower">("nebula");
  const mapRef = useRef<TowerMapHandle | null>(null);

  // Mirror subject + selection into the hash so the current view is shareable.
  // replaceState (not pushState) so the map never floods the history stack.
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const next = buildHash(subject, selectedPathId);
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [subject, selectedPathId]);

  // React to external hash edits (back/forward, pasted links, manual typing).
  useEffect(() => {
    const onHashChange = () => {
      const next = resolveHash(window.location.hash, subject);
      setSubject(next.subject);
      setSelectedPathId(next.pathId);
      setSelectedNodeId(null);
      if (next.pathId) setFocusRequest({ pathId: next.pathId, tick: performance.now() });
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

  const manualCompleted = useMemo(() => new Set(subjectProgress.paths), [subjectProgress]);
  const manualNodes = useMemo(() => new Set(subjectProgress.nodes), [subjectProgress]);

  // Per-tier boss lifecycle: drives lock styling on tiles and the boss gate.
  const bossStates = useMemo(
    () =>
      new Map(
        graph.tiers.map((t) => [t.tier, tierBossState(graph, t.tier, subjectProgress)]),
      ),
    [graph, subjectProgress],
  );

  const hasProgress =
    subjectProgress.paths.length > 0 ||
    subjectProgress.nodes.length > 0 ||
    subjectProgress.tiers.length > 0;

  // Mutate one subject's progress record inside the shared ProgressRecord.
  function updateSubject(
    subjectKey: string,
    update: (s: SubjectProgress) => SubjectProgress,
  ) {
    const current = progress[subjectKey] ?? emptySubjectProgress();
    setProgress({ ...progress, [subjectKey]: update(current) });
  }

  function toggleComplete(id: string) {
    const path = graph.paths.find((p) => p.id === id);
    if (!path || isWritten(path.status)) return;
    // a locked tier cannot be formally progressed, only read
    if (!tierIsUnlocked(graph, path.tier, progress[graph.subject] ?? emptySubjectProgress())) {
      return;
    }
    updateSubject(graph.subject, (s) => ({ ...s, paths: toggleId(s.paths, id) }));
  }

  function toggleNode(id: string) {
    updateSubject(graph.subject, (s) => ({ ...s, nodes: toggleId(s.nodes, id) }));
  }

  // The learner beats a tier's boss (after /quiz passes) and manually records
  // the unlock; the app never decides correctness itself.
  function unlockTier(tier: number) {
    updateSubject(graph.subject, (s) => {
      const tiers = s.tiers.includes(String(tier))
        ? s.tiers
        : [...s.tiers, String(tier)];
      return { ...s, tiers };
    });
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

  function selectPath(id: string | null) {
    setSelectedPathId(id);
    setSelectedNodeId(null);
    if (id) setFocusRequest({ pathId: id, tick: performance.now() });
    else setFocusRequest(null);
  }

  function selectNode(id: string) {
    setSelectedNodeId(id);
    setSelectedPathId(null);
    setFocusRequest(null);
  }

  function switchSubject(s: string) {
    if (s === subject) return;
    setSubject(s);
    setSelectedPathId(null);
    setSelectedNodeId(null);
    setFocusRequest(null);
    setHoveredId(null);
  }

  const nextUp = useMemo(() => firstUnchartedInSpine(graph, manualCompleted), [graph, manualCompleted]);

  function goNextUp() {
    if (nextUp) selectPath(nextUp.id);
  }

  const selectedPath = selectedPathId
    ? (graph.paths.find((p) => p.id === selectedPathId) ?? null)
    : null;
  const selectedNode = selectedNodeId ? (graph.nodes[selectedNodeId] ?? null) : null;
  const root: View | null = selectedNode
    ? { kind: "node", id: selectedNode.id }
    : selectedPath
      ? { kind: "path", id: selectedPath.id }
      : null;
  const hoveredPath =
    hoveredId && hoveredId !== selectedPathId
      ? (graph.paths.find((p) => p.id === hoveredId) ?? null)
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
          onViewChange={(v: "nebula" | "tower") => setView(v)}
        />
        <div className="relative min-h-0 flex-1">
          {view === "tower" ? (
            <TowerMap
              ref={mapRef}
              graph={graph}
              selectedId={selectedPathId}
              selectedNodeId={selectedNodeId}
              focusRequest={focusRequest}
              manualCompleted={manualCompleted}
              manualNodes={manualNodes}
              bossStates={bossStates}
              hoveredId={hoveredId}
              onSelect={selectPath}
              onSelectNode={selectNode}
              onHover={setHoveredId}
              onUnlockTier={unlockTier}
            />
          ) : (
            <ForceMap
              ref={mapRef}
              graph={graph}
              selectedId={selectedPathId}
              selectedNodeId={selectedNodeId}
              focusRequest={focusRequest}
              manualCompleted={manualCompleted}
              manualNodes={manualNodes}
              bossStates={bossStates}
              hoveredId={hoveredId}
              onSelect={selectPath}
              onSelectNode={selectNode}
              onHover={setHoveredId}
            />
          )}

          <Legend />

          <MapControls
            onZoomIn={() => mapRef.current?.zoomBy(1.25)}
            onZoomOut={() => mapRef.current?.zoomBy(0.8)}
            onReset={() => mapRef.current?.fit()}
            onResetProgress={resetProgress}
            onNextUp={goNextUp}
            canResetProgress={hasProgress}
            hasNextUp={Boolean(nextUp)}
          />

          {hoveredPath ? <HoverCard path={hoveredPath} x={pointer.x} y={pointer.y} /> : null}

          {root ? (
            <DetailPane
              graph={graph}
              root={root}
              manualCompleted={manualCompleted}
              manualNodes={manualNodes}
              bossStates={bossStates}
              onToggleComplete={toggleComplete}
              onToggleNode={toggleNode}
              onUnlockTier={unlockTier}
              onClose={() => selectPath(null)}
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

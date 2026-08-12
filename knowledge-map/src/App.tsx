import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import graphData from "./data/graph.json";
import { DetailPane } from "./components/DetailPane";
import { HoverCard } from "./components/HoverCard";
import { Legend } from "./components/Legend";
import { MapControls } from "./components/MapControls";
import { TopBar } from "./components/TopBar";
import { TowerMap, type TowerMapHandle } from "./components/TowerMap";
import { isWritten } from "./lib/colors";
import { buildHash, parseHash } from "./lib/hashlink";
import {
  emptySubjectProgress,
  loadProgress,
  saveProgress,
  toggleId,
  type ProgressRecord,
} from "./lib/progress";
import { firstUnchartedInSpine } from "./lib/selectors";
import type { FocusRequest, SubjectGraph } from "./lib/types";

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
  const initial = useMemo(
    () => resolveHash(window.location.hash, defaultSubject()),
    [],
  );
  const [subject, setSubject] = useState<string>(initial.subject);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(
    initial.pathId,
  );
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(
    initial.pathId ? { pathId: initial.pathId, tick: 0 } : null,
  );
  const [progress, setProgress] = useState<ProgressRecord>(() => loadProgress());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const mapRef = useRef<TowerMapHandle>(null);

  // Mirror subject + selection into the hash so the current view is shareable.
  // replaceState (not pushState) so the map never floods the history stack.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const next = buildHash(graph.subject, selectedPathId);
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  });

  // React to external hash edits (back/forward, pasted links, manual typing).
  useEffect(() => {
    const onHashChange = () => {
      const next = resolveHash(window.location.hash, subject);
      setSubject(next.subject);
      setSelectedPathId(next.pathId);
      if (next.pathId) setFocusRequest({ pathId: next.pathId, tick: performance.now() });
      else setFocusRequest(null);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [subject]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const graph = useMemo(
    () => graphs.find((g) => g.subject === subject) ?? graphs[0],
    [subject],
  );

  const manualCompleted = useMemo(
    () => new Set(progress[graph.subject]?.paths ?? []),
    [progress, graph.subject],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      const path = graph.paths.find((p) => p.id === id);
      if (!path || isWritten(path.status)) return;
      setProgress((prev) => {
        const subject = prev[graph.subject] ?? emptySubjectProgress();
        return {
          ...prev,
          [graph.subject]: { ...subject, paths: toggleId(subject.paths, id) },
        };
      });
    },
    [graph],
  );

  const resetProgress = useCallback(() => {
    setProgress((prev) => {
      if (!(graph.subject in prev)) return prev;
      const next = { ...prev };
      delete next[graph.subject];
      return next;
    });
  }, [graph.subject]);

  // track the pointer for the hover card
  useEffect(() => {
    if (!hoveredId) return;
    const onMove = (e: MouseEvent) => setPointer({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hoveredId]);

  const selectPath = useCallback((id: string | null) => {
    setSelectedPathId(id);
    if (id) setFocusRequest({ pathId: id, tick: performance.now() });
    else setFocusRequest(null);
  }, []);

  const switchSubject = useCallback(
    (s: string) => {
      if (s === subject) return;
      setSubject(s);
      setSelectedPathId(null);
      setFocusRequest(null);
      setHoveredId(null);
    },
    [subject],
  );

  const nextUp = useMemo(
    () => firstUnchartedInSpine(graph, manualCompleted),
    [graph, manualCompleted],
  );

  const goNextUp = useCallback(() => {
    if (nextUp) selectPath(nextUp.id);
  }, [nextUp, selectPath]);

  const selectedPath = selectedPathId
    ? graph.paths.find((p) => p.id === selectedPathId) ?? null
    : null;
  const hoveredPath =
    hoveredId && hoveredId !== selectedPathId
      ? graph.paths.find((p) => p.id === hoveredId) ?? null
      : null;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar
        graphs={graphs}
        subject={graph.subject}
        manualCount={manualCompleted.size}
        onReset={resetProgress}
        onSelect={switchSubject}
      />
      <div className="relative min-h-0 flex-1">
        <TowerMap
          ref={mapRef}
          graph={graph}
          selectedId={selectedPathId}
          focusRequest={focusRequest}
          manualCompleted={manualCompleted}
          hoveredId={hoveredId}
          onSelect={selectPath}
          onHover={setHoveredId}
        />

        <Legend />

        <MapControls
          onZoomIn={() => mapRef.current?.zoomBy(1.25)}
          onZoomOut={() => mapRef.current?.zoomBy(0.8)}
          onReset={() => mapRef.current?.fit()}
          onResetProgress={resetProgress}
          onNextUp={goNextUp}
          canResetProgress={manualCompleted.size > 0}
          hasNextUp={Boolean(nextUp)}
        />

        {hoveredPath && (
          <HoverCard path={hoveredPath} x={pointer.x} y={pointer.y} />
        )}

        {selectedPath && (
          <DetailPane
            graph={graph}
            path={selectedPath}
            manualCompleted={manualCompleted}
            onToggleComplete={toggleComplete}
            onClose={() => selectPath(null)}
          />
        )}
      </div>
    </div>
  );
}

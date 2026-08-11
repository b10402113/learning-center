import { useEffect, useMemo, useRef, useState } from "react";
import graphData from "./data/graph.json";
import { TopBar } from "./components/TopBar";
import { TowerMap } from "./components/TowerMap";
import { DetailPane } from "./components/DetailPane";
import { isWritten } from "./lib/colors";
import { buildHash, parseHash } from "./lib/hashlink";
import { loadProgress, saveProgress, toggleId, type ProgressRecord } from "./lib/progress";
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
function resolveHash(hash: string, fallbackSubject: string): { subject: string; pathId: string | null } {
  const { subject, pathId } = parseHash(hash);
  const graph = graphs.find((g) => g.subject === subject);
  const validPath = graph?.paths.some((p) => p.id === pathId) ? pathId : null;
  return {
    subject: graph ? graph.subject : fallbackSubject,
    pathId: validPath,
  };
}

export default function App() {
  const initial = useMemo(() => resolveHash(window.location.hash, defaultSubject()), []);
  const [subject, setSubject] = useState<string>(initial.subject);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(initial.pathId);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(
    initial.pathId ? { pathId: initial.pathId, tick: 0 } : null,
  );
  const [progress, setProgress] = useState<ProgressRecord>(() => loadProgress());

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
    () => new Set(progress[graph.subject] ?? []),
    [progress, graph.subject],
  );

  const toggleComplete = (id: string) => {
    const path = graph.paths.find((p) => p.id === id);
    if (!path || isWritten(path.status)) return;
    setProgress((prev) => ({ ...prev, [graph.subject]: toggleId(prev[graph.subject] ?? [], id) }));
  };

  const resetProgress = () => {
    setProgress((prev) => {
      if (!(graph.subject in prev)) return prev;
      const next = { ...prev };
      delete next[graph.subject];
      return next;
    });
  };

  const selectedPath = selectedPathId
    ? graph.paths.find((p) => p.id === selectedPathId) ?? null
    : null;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar
        graphs={graphs}
        subject={graph.subject}
        manualCount={manualCompleted.size}
        onReset={resetProgress}
        onSelect={(s) => {
          setSubject(s);
          setSelectedPathId(null);
          setFocusRequest(null);
        }}
      />
      <div className="relative min-h-0 flex-1">
        <TowerMap
          graph={graph}
          selectedId={selectedPathId}
          focusRequest={focusRequest}
          manualCompleted={manualCompleted}
          onToggleComplete={toggleComplete}
          onSelect={setSelectedPathId}
        />
        {selectedPath && (
          <DetailPane
            key={selectedPath.id}
            graph={graph}
            path={selectedPath}
            onClose={() => setSelectedPathId(null)}
          />
        )}
      </div>
    </div>
  );
}

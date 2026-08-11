import { useMemo, useState } from "react";
import graphData from "./data/graph.json";
import { TopBar } from "./components/TopBar";
import { TowerMap } from "./components/TowerMap";
import { DetailPane } from "./components/DetailPane";
import { isWritten } from "./lib/colors";
import type { SubjectGraph } from "./lib/types";

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

export default function App() {
  const [subject, setSubject] = useState<string>(defaultSubject);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const graph = useMemo(
    () => graphs.find((g) => g.subject === subject) ?? graphs[0],
    [subject],
  );

  const selectedPath = selectedPathId
    ? graph.paths.find((p) => p.id === selectedPathId) ?? null
    : null;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar
        graphs={graphs}
        subject={graph.subject}
        onSelect={(s) => {
          setSubject(s);
          setSelectedPathId(null);
        }}
      />
      <div className="relative min-h-0 flex-1">
        <TowerMap
          graph={graph}
          selectedId={selectedPathId}
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

import { useMemo, useState } from "react";
import graphData from "./data/graph.json";
import { TopBar } from "./components/TopBar";
import { TowerMap } from "./components/TowerMap";
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
  const graph = useMemo(
    () => graphs.find((g) => g.subject === subject) ?? graphs[0],
    [subject],
  );

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar graphs={graphs} subject={graph.subject} onSelect={setSubject} />
      <TowerMap graph={graph} />
    </div>
  );
}

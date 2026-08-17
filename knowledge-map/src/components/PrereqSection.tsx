import { cn } from "../lib/cn";
import type { SubjectGraph } from "../lib/types";

interface PrereqSectionProps {
  graph: SubjectGraph;
  prerequisiteIds: string[];
  onNavigate: (kind: "element" | "node", id: string) => void;
}

interface PrereqEntry {
  kind: "element" | "node";
  id: string;
  title: string;
  sub: string;
}

/**
 * Colored prerequisite grid for a node detail view. Element prerequisites get
 * one color, node prerequisites another, so the learner can tell "which concept
 * to brush up on" from "which lesson to read first" at a glance. Purely
 * navigational — elements are keywords and are never marked complete
 * (ADR-0005), so no checkbox rides on these cards.
 */
export function PrereqSection({
  graph,
  prerequisiteIds,
  onNavigate,
}: PrereqSectionProps) {
  const entries: PrereqEntry[] = prerequisiteIds
    .map((id): PrereqEntry | null => {
      const element = graph.elements[id];
      if (element) {
        return {
          kind: "element",
          id,
          title: element.title,
          sub: element.taughtByNodes[0]
            ? (graph.nodes.find((n) => n.id === element.taughtByNodes[0])?.title ?? "")
            : "",
        };
      }
      const node = graph.nodes.find((n) => n.id === id);
      if (node) {
        return { kind: "node", id, title: node.title, sub: node.goal };
      }
      return null;
    })
    .filter((e): e is PrereqEntry => e !== null);

  if (entries.length === 0) return null;

  return (
    <section className="path-detail-section">
      <h3 className="path-detail-section-title">Prerequisites</h3>
      <div className="path-detail-prereq-grid">
        {entries.map((entry) => (
          <button
            key={`${entry.kind}:${entry.id}`}
            type="button"
            onClick={() => onNavigate(entry.kind, entry.id)}
            className={cn(
              "path-detail-prereq-card",
              entry.kind === "element" ? "prereq-element" : "prereq-node",
            )}
          >
            <div className="prereq-card-top">
              <span className="prereq-card-title">{entry.title}</span>
              {entry.kind === "element" ? null : <span className="prereq-node-tag">node</span>}
            </div>
            <span className="prereq-card-sub">{entry.sub}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
import { useEffect, useMemo } from "react";
import { stepsOfNode } from "../lib/completion";
import type { Node, SubjectGraph } from "../lib/types";
import { Check } from "./icons/Check";
import { X } from "./icons/X";
import { PrereqSection } from "./PrereqSection";

interface NodeDetailViewProps {
  graph: SubjectGraph;
  node: Node;
  /** Node-qualified step ids currently complete for this subject. */
  completedSteps: Set<string>;
  /** Opens a step's reader modal (ADR-0003), leaving the overlay underneath. */
  onSelectStep: (nodeId: string, stepId: string) => void;
  onNavigateElement: (elementId: string) => void;
  onNavigateNode: (nodeId: string) => void;
  onClose: () => void;
  /** When a reader modal sits on top, Esc belongs to it — not the detail. */
  escDisabled?: boolean;
}

/**
 * The roadmap node detail overlay (ADR-0006): the overlay that replaces the
 * retired card expansion. It reports the node's step-DAG as a clickable list
 * (a step opens its reader modal), plus a step x / y counter and prerequisite
 * cards. The node card itself stays fixed-size — it never expands in place.
 */
export function NodeDetailView({
  graph,
  node,
  completedSteps,
  onSelectStep,
  onNavigateElement,
  onNavigateNode,
  onClose,
  escDisabled,
}: NodeDetailViewProps) {
  const steps = useMemo(() => stepsOfNode(graph.steps, node.id), [graph, node]);
  const completedCount = steps.filter((s) => completedSteps.has(s.id)).length;
  const totalCount = steps.length;

  useEffect(() => {
    if (escDisabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, escDisabled]);

  return (
    <div
      className="path-detail-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="path-detail-modal" role="dialog" aria-label={node.title}>
        <div className="path-detail-header">
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="path-detail-close-btn"
          >
            <X size={20} />
          </button>
          <h2 className="path-detail-title">{node.title}</h2>
          {totalCount > 0 ? (
            <p className="path-detail-progress-text">
              step {completedCount} / {totalCount}
            </p>
          ) : null}
        </div>

        <div className="path-detail-body">
          <PrereqSection
            graph={graph}
            prerequisiteIds={node.prerequisiteIds}
            onNavigate={(kind, id) =>
              kind === "element" ? onNavigateElement(id) : onNavigateNode(id)
            }
          />

          <section className="path-detail-list-section">
            <div className="path-detail-list-header">
              <span>STEPS</span>
            </div>
            {steps.length ? (
              steps.map((step) => {
                const done = completedSteps.has(step.id);
                const depTitles = step.deps
                  .map((d) => graph.steps[d]?.title)
                  .filter((t): t is string => Boolean(t));
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => onSelectStep(node.id, step.stepId)}
                    className="path-detail-step-row path-detail-step-btn"
                  >
                    <span>
                      <span
                        className={done ? "status-circle status-on" : "status-circle"}
                        aria-label={done ? "已完成" : "未完成"}
                      >
                        {done ? <Check size={14} /> : null}
                      </span>
                    </span>
                    <span>
                      {step.title}
                      {depTitles.length > 0 ? (
                        <span className="path-detail-step-deps">
                          ↖ {depTitles.join("、")}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="path-detail-empty">此課文沒有 step（舊式單文章 node）。</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
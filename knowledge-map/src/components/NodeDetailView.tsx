import { useEffect, useMemo, useRef } from "react";
import { stepsOfNode } from "../lib/completion";
import type { Node, SubjectGraph } from "../lib/types";
import { Check } from "./icons/Check";
import { X } from "./icons/X";
import { Expand } from "./icons/Expand";
import { PrereqSection } from "./PrereqSection";

interface NodeDetailViewProps {
  graph: SubjectGraph;
  node: Node;
  /** Node-qualified step ids currently complete for this subject. */
  completedSteps: Set<string>;
  onViewElement: (elementId: string) => void;
  onViewNode: (nodeId: string) => void;
  onViewContent: () => void;
  onClose: () => void;
  /** When a reader modal sits on top, Esc belongs to it — not the detail. */
  escDisabled?: boolean;
}

/**
 * The roadmap node detail panel. Completion is step-based (ADR-0005): the node's
 * checklist is its step-DAG — every step complete marks the node complete.
 * Elements are keywords and never appear as checklist rows. The step toggles
 * live on the node reader page; this panel only reports progress and offers
 * navigation (prerequisites, the node's own article).
 */
export function NodeDetailView({
  graph,
  node,
  completedSteps,
  onViewElement,
  onViewNode,
  onViewContent,
  onClose,
  escDisabled,
}: NodeDetailViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = useMemo(() => stepsOfNode(graph.steps, node.id), [graph, node]);
  const completedCount = steps.filter((s) => completedSteps.has(s.id)).length;
  const totalCount = steps.length;
  const nodeComplete = totalCount > 0 && completedCount === totalCount;

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
      <div className="path-detail-modal">
        <div className="path-detail-header">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="path-detail-close-btn"
          >
            <X size={20} />
          </button>
          <h2 className="path-detail-title">{node.title}</h2>
          <p className="path-detail-progress-text">
            step {completedCount} / {totalCount}
          </p>
          {nodeComplete ? (
            <span className="path-detail-complete-badge">
              <Check size={12} />
              節點完成
            </span>
          ) : null}
          <div className="path-detail-progress-ring">
            <svg viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#2a2a2e"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#ff0071"
                strokeWidth="3"
                strokeDasharray={`${totalCount > 0 ? (completedCount / totalCount) * 88 : 0} 88`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
        </div>

        <div ref={scrollRef} className="path-detail-body">
          <PrereqSection
            graph={graph}
            prerequisiteIds={node.prerequisiteIds}
            onNavigate={(kind, id) =>
              kind === "element" ? onViewElement(id) : onViewNode(id)
            }
          />

          <section className="path-detail-list-section">
            <div className="path-detail-list-header">
              <span className="list-col-title">STEPS</span>
            </div>
            {steps.length ? (
              steps.map((step) => {
                const done = completedSteps.has(step.id);
                return (
                  <div key={step.id} className="path-detail-step-row">
                    <span className="list-col-status">
                      <span className={done ? "status-circle status-on" : "status-circle"}>
                        {done ? <Check size={14} /> : null}
                      </span>
                    </span>
                    <span className="list-col-title">{step.title}</span>
                  </div>
                );
              })
            ) : (
              <p className="path-detail-empty">此課文沒有 step（舊式單文章 node）。</p>
            )}
          </section>

          <button
            type="button"
            onClick={onViewContent}
            className="path-detail-read-btn"
          >
            <Expand size={12} />
            閱讀課文
          </button>
        </div>
      </div>
    </div>
  );
}
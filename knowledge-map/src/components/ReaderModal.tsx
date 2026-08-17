import { useEffect } from "react";
import type { ReaderModalTarget, SubjectGraph } from "../lib/types";
import { ReaderPage, type ReaderCommonProps } from "./ReaderPage";

interface ReaderModalProps extends ReaderCommonProps {
  graph: SubjectGraph;
  target: ReaderModalTarget;
  onExpand: (target: ReaderModalTarget) => void;
  onClose: () => void;
}

/**
 * The transient element window (ADR-0003): the shared docs page hosted in an
 * overlay above whatever surface opened it (the map, or the checklist modal,
 * which stays mounted underneath so its scroll position survives). Esc and the
 * close button dismiss it back to the surface below; expand promotes the current
 * content to its standalone page.
 */
export function ReaderModal({
  graph,
  target,
  completedSteps,
  onToggleStep,
  onNavigateNode,
  onNavigateStep,
  onNavigateElement,
  onBackToMap,
  onExpand,
  onClose,
}: ReaderModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const readerProps = {
    graph,
    presentation: "readerModal" as const,
    completedSteps,
    onToggleStep,
    onNavigateNode,
    onNavigateStep,
    onNavigateElement,
    onBackToMap,
    onExpand,
    onClose,
  };

  return (
    <div
      className="reader-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="reader-modal-surface"
        role="dialog"
        aria-modal="true"
        aria-label="內容閱讀視窗"
      >
        {target.kind === "step" ? (
          <ReaderPage {...readerProps} mode="step" nodeId={target.nodeId} stepId={target.stepId} />
        ) : target.kind === "node" ? (
          <ReaderPage {...readerProps} mode="node" nodeId={target.nodeId} />
        ) : (
          <ReaderPage
            {...readerProps}
            mode="element"
            elementId={target.elementId}
            from={target.from}
          />
        )}
      </div>
    </div>
  );
}

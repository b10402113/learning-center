import { useEffect, useMemo, useRef } from "react";
import { cn } from "../lib/cn";
import { isWritten } from "../lib/colors";
import { isNodeComplete, nodeItems } from "../lib/completion";
import type { Element, ElementType, Node, SubjectGraph } from "../lib/types";
import { Check } from "./icons/Check";
import { Circle } from "./icons/Circle";
import { X } from "./icons/X";
import { Expand } from "./icons/Expand";
import { PrereqSection } from "./PrereqSection";

interface NodeDetailViewProps {
  graph: SubjectGraph;
  node: Node;
  manualElements: Set<string>;
  quizSolved: Set<string>;
  onToggleCompletion: (id: string) => void;
  onViewElement: (elementId: string) => void;
  onViewNode: (nodeId: string) => void;
  onViewContent: () => void;
  onClose: () => void;
}

type ListItem =
  | { kind: "element"; element: Element }
  | { kind: "content"; node: Node };

export function NodeDetailView({
  graph,
  node,
  manualElements,
  quizSolved,
  onToggleCompletion,
  onViewElement,
  onViewNode,
  onViewContent,
  onClose,
}: NodeDetailViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // The checklist contract: taught elements in order, then the main row.
  const checklist = useMemo(() => nodeItems(node), [node]);

  // Main list: taught elements first, then the node content as the last item
  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    for (const item of checklist) {
      if (item.kind === "element") {
        const element = graph.elements[item.id];
        if (element) items.push({ kind: "element", element });
      } else {
        items.push({ kind: "content", node });
      }
    }
    return items;
  }, [checklist, graph, node]);

  const completedCount = useMemo(
    () => checklist.filter((item) => manualElements.has(item.id)).length,
    [checklist, manualElements],
  );

  const totalCount = listItems.length;

  const nodeComplete = useMemo(
    () => isNodeComplete(node, manualElements),
    [node, manualElements],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function getStatus(item: ListItem): boolean {
    if (item.kind === "element") return manualElements.has(item.element.id);
    return manualElements.has(item.node.id);
  }

  function getDifficulty(item: ListItem): string {
    if (item.kind === "element") {
      if (item.element.tier <= 1) return "Easy";
      if (item.element.tier <= 2) return "Medium";
      return "Hard";
    }
    if (isWritten(item.node.status)) return "Complete";
    if (item.node.status === "content-written") return "Ready";
    return item.node.status;
  }

  function handleToggle(item: ListItem) {
    if (item.kind === "element") {
      onToggleCompletion(item.element.id);
    } else {
      onToggleCompletion(item.node.id);
    }
  }

  function handleView(item: ListItem) {
    if (item.kind === "element") {
      onViewElement(item.element.id);
    } else {
      onViewContent();
    }
  }

  return (
    <div
      className="path-detail-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="path-detail-modal">
        {/* Header */}
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
            ({completedCount} / {totalCount})
          </p>
          {nodeComplete ? (
            <span className="path-detail-complete-badge">
              <Check size={12} />
              檢查清單完成
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
                strokeDasharray={`${(completedCount / totalCount) * 88} 88`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
        </div>

        <div ref={scrollRef} className="path-detail-body">
          {/* Prerequisites */}
          <PrereqSection
            graph={graph}
            prerequisiteIds={node.prerequisiteIds}
            manualElements={manualElements}
            quizSolved={quizSolved}
            onToggleCompletion={onToggleCompletion}
            onNavigate={(kind, id) =>
              kind === "element" ? onViewElement(id) : onViewNode(id)
            }
          />

          {/* Items list */}
          <section className="path-detail-list-section">
            <div className="path-detail-list-header">
              <span className="list-col-status">STATUS</span>
              <span className="list-col-type">TYPE</span>
              <span className="list-col-title">TITLE</span>
              <span className="list-col-difficulty">DIFFICULTY</span>
              <span className="list-col-action">ACTION</span>
            </div>
            {listItems.map((item) => {
              const done = getStatus(item);
              const difficulty = getDifficulty(item);
              const title = item.kind === "element" ? item.element.title : item.node.title;
              const badgeType: ElementType | "main" =
                item.kind === "element" ? item.element.type : "main";

              return (
                <div
                  key={
                    item.kind === "element" ? `element-${item.element.id}` : `content-${item.node.id}`
                  }
                  className={cn("path-detail-list-row", done ? "row-done" : "")}
                >
                  <span className="list-col-status">
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      className={cn(
                        "status-circle",
                        done ? "status-on" : "",
                      )}
                      aria-label={done ? "Mark incomplete" : "Mark complete"}
                    >
                      {done ? <Check size={14} /> : <Circle size={14} />}
                    </button>
                  </span>
                  <span className="list-col-type">
                    <span className={cn("type-badge", typeBadgeClass(badgeType))}>
                      {badgeType}
                    </span>
                  </span>
                  <span className="list-col-title">
                    <button
                      type="button"
                      onClick={() => handleView(item)}
                      className="title-link"
                    >
                      {title}
                      <Expand size={12} className="title-link-icon" />
                    </button>
                  </span>
                  <span className="list-col-difficulty">
                    <span className={cn("diff-badge", difficultyColorClass(difficulty))}>
                      {difficulty}
                    </span>
                  </span>
                  <span className="list-col-action">
                    <button
                      type="button"
                      onClick={() => handleView(item)}
                      className="action-btn"
                      aria-label={`View ${title}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </button>
                  </span>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}

function difficultyColorClass(difficulty: string): string {
  if (difficulty === "Easy") return "diff-easy";
  if (difficulty === "Medium") return "diff-medium";
  if (difficulty === "Hard" || difficulty === "Complete") return "diff-hard";
  return "diff-default";
}

function typeBadgeClass(type: ElementType | "main"): string {
  switch (type) {
    case "video":
      return "type-video";
    case "question":
      return "type-question";
    case "main":
      return "type-main";
    default:
      return "type-article";
  }
}

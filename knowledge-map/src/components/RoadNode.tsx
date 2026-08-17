import { useId } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "../lib/cn";
import { Check } from "./icons/Check";

export const ROAD_NODE_WIDTH = 160;
export const ROAD_NODE_HEIGHT = 48;

// Expanded-card layout metrics. The card widens a touch and grows downward to
// host the node's lesson description + step-DAG; the roadmap shifts tiers below
// by the computed height so the expansion never collides with the next row.
export const EXPANDED_W = 200;
export const EXPANDED_LESSON = 56;
export const STEP_H = 34;
export const STEP_GAP = 8;
export const EXPANDED_PAD = 6;

/** Deterministic height of an expanded node card (ADR-0004 DAG expansion). */
export function expandedCardHeight(stepCount: number): number {
  return (
    ROAD_NODE_HEIGHT +
    EXPANDED_LESSON +
    EXPANDED_PAD +
    Math.max(0, stepCount) * (STEP_H + STEP_GAP) +
    EXPANDED_PAD
  );
}

export interface RoadStepData {
  /** Node-qualified step id (`nodeId/stepId`). */
  id: string;
  stepId: string;
  title: string;
  order: number;
  done: boolean;
  /** Node-qualified step ids this step depends on (drives the arrows). */
  depIds: string[];
  /** Titles of the steps this step depends on (deps marker). */
  depTitles: string[];
  /** Titles of the elements this step teaches (element markers lean here). */
  teachesTitles: string[];
}

interface RoadNodeData {
  label: string;
  tier: number;
  isWritten: boolean;
  isComplete: boolean;
  isSelected: boolean;
  nodeId: string;
  expanded: boolean;
  lesson: string;
  steps: RoadStepData[];
  onSelectStep: (nodeId: string, stepId: string) => void;
  [key: string]: unknown;
}

type RoadNodeType = Node<RoadNodeData, "roadNode">;

export function RoadNode({ data, selected }: NodeProps<RoadNodeType>) {
  const {
    label,
    isWritten,
    isComplete,
    isSelected,
    nodeId,
    expanded,
    lesson,
    steps,
    onSelectStep,
  } = data as RoadNodeData;
  const active = selected || isSelected;
  const arrowId = useId();

  const borderColor = isComplete
    ? "#ff0071"
    : isWritten
      ? "#c40058"
      : active
        ? "#ff5ca8"
        : expanded
          ? "#ff5ca8"
          : "#2a2a2e";

  const bgColor = isComplete
    ? "rgba(36, 16, 25, 0.9)"
    : isWritten
      ? "rgba(26, 20, 24, 0.9)"
      : active
        ? "rgba(30, 20, 26, 0.9)"
        : expanded
          ? "rgba(30, 20, 26, 0.95)"
          : "#1a1a1d";

  const progressColor = isComplete ? "#ff0071" : isWritten ? "#c40058" : "#3a3a3e";
  const progressWidth = isComplete ? "100%" : isWritten ? "60%" : "0%";

  // Dependency arrows: steps stack in reading order; a dep always comes earlier,
  // so each arrow runs from the dep's row down to the dependent's row (a smooth
  // curve + arrowhead, the roadmap's equivalent of a smoothstep edge).
  const idxById = new Map(steps.map((s, i) => [s.id, i]));
  // Arrow coordinates are relative to the step container (SVG inset-0). Buttons
  // start 4px down + 18px right of that origin (the arrow gutter sits left of
  // them), spaced STEP_H + STEP_GAP apart.
  const rowCenter = (i: number) => 4 + i * (STEP_H + STEP_GAP) + STEP_H / 2;
  const arrows: { from: number; to: number }[] = [];
  steps.forEach((s, i) => {
    for (const depId of s.depIds) {
      const depIdx = idxById.get(depId);
      if (depIdx === undefined || depIdx === i) continue;
      arrows.push({ from: depIdx, to: i });
    }
  });

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border transition-all",
        active ? "shadow-[0_0_18px_rgba(255,92,168,0.22)]" : "",
        expanded ? "shadow-[0_0_18px_rgba(255,92,168,0.16)]" : "",
      )}
      style={{
        width: expanded ? EXPANDED_W : ROAD_NODE_WIDTH,
        height: expanded ? expandedCardHeight(steps.length) : ROAD_NODE_HEIGHT,
        borderColor,
        backgroundColor: bgColor,
        overflow: "hidden",
      }}
    >
      {/* Check badge when the node's DAG is complete */}
      {isComplete && (
        <span
          className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-brass px-1.5 py-0.5"
          aria-label="節點完成"
        >
          <Check size={11} className="text-background" strokeWidth={2.5} />
        </span>
      )}

      {/* Header: label + expand affordance */}
      <div
        className="flex items-center justify-between gap-1 px-2"
        style={{ height: ROAD_NODE_HEIGHT }}
      >
        <span
          className="flex-1 text-center font-sans text-[0.7rem] font-medium leading-tight"
          style={{ color: "#f5f5f5" }}
        >
          {label}
        </span>
        {steps.length > 0 ? (
          <span
            aria-hidden="true"
            className={cn(
              "shrink-0 font-mono text-[0.6rem] leading-none transition-transform",
              expanded ? "rotate-180" : "",
            )}
            style={{ color: "#a0a0a5" }}
          >
            ▾
          </span>
        ) : null}
      </div>

      {/* Progress bar at bottom of the header */}
      <div className="h-0.5 w-full overflow-hidden rounded-b-lg bg-background/30">
        <div
          className="h-full transition-all"
          style={{ width: progressWidth, backgroundColor: progressColor }}
        />
      </div>

      {expanded ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Lesson description */}
          <div
            className="px-2.5 pt-2 font-sans text-[0.62rem] leading-snug"
            style={{
              height: EXPANDED_LESSON,
              color: "#c9c9cd",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={lesson}
          >
            {lesson || "（此課文沒有說明。）"}
          </div>

          {/* Step-DAG */}
          {steps.length ? (
            <div className="relative flex-1">
              {/* Dependency arrows overlay (smoothstep-equivalent curves) */}
              <svg
                className="pointer-events-none absolute inset-0"
                width={EXPANDED_W}
                height={steps.length * (STEP_H + STEP_GAP) + 4}
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id={arrowId}
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff5ca8" />
                  </marker>
                </defs>
                {arrows.map((a, k) => {
                  const y1 = rowCenter(a.from);
                  const y2 = rowCenter(a.to);
                  // A left-leaning S-curve through the arrow gutter (x 6..18):
                  // it leaves the dep card's left edge (18, y1), bulges into the
                  // gutter, and re-enters the dependent card's left edge (18, y2).
                  return (
                    <path
                      key={k}
                      d={`M 18 ${y1} C 6 ${y1}, 6 ${y2}, 18 ${y2}`}
                      fill="none"
                      stroke="#ff5ca8"
                      strokeWidth={1.2}
                      strokeDasharray="3 2"
                      markerEnd={`url(#${arrowId})`}
                    />
                  );
                })}
              </svg>

              <div className="flex flex-col" style={{ gap: STEP_GAP, marginTop: 4, marginLeft: 18 }}>
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStep(nodeId, s.stepId);
                    }}
                    className={cn(
                      "relative flex w-full items-center gap-1.5 rounded border px-2 text-left transition-colors hover:border-[#ff5ca8]",
                      s.done ? "border-[#c40058]/70 bg-[#241019]/60" : "border-[#2a2a2e] bg-[#161618]/80",
                    )}
                    style={{ height: STEP_H, width: EXPANDED_W - 18 - 8, boxSizing: "border-box" }}
                    title={s.title}
                  >
                    <span className="font-mono text-[0.55rem] text-[#8b8b8f]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "flex h-3 w-3 shrink-0 items-center justify-center rounded-full border",
                        s.done ? "border-transparent bg-[#ff0071]" : "border-[#3a3a3e]",
                      )}
                      aria-label={s.done ? "已完成" : "未完成"}
                    >
                      {s.done ? <Check size={8} strokeWidth={3} className="text-background" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-sans text-[0.62rem] font-medium leading-tight text-[#f5f5f5]">
                        {s.title}
                      </span>
                      {(s.depTitles.length > 0 || s.teachesTitles.length > 0) && (
                        <span className="block truncate font-mono text-[0.5rem] leading-tight text-[#8b8b8f]">
                          {s.depTitles.length ? `↖ ${s.depTitles.join("、")}` : ""}
                          {s.depTitles.length > 0 && s.teachesTitles.length > 0 ? " · " : ""}
                          {s.teachesTitles.length ? `◎ ${s.teachesTitles.join("、")}` : ""}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="px-2.5 pb-2 font-mono text-[0.55rem] text-[#8b8b8f]">
              此課文沒有 step（舊式單文章 node）。
            </p>
          )}
        </div>
      ) : null}

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 8, height: 8 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 8, height: 8 }}
      />
    </div>
  );
}
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "../lib/cn";
import { Check } from "./icons/Check";

export const ROAD_NODE_WIDTH = 200;
export const ROAD_NODE_HEIGHT = 64;

interface RoadNodeData {
  label: string;
  tier: number;
  isWritten: boolean;
  isComplete: boolean;
  isSelected: boolean;
  isLocked: boolean;
  nodeId: string;
  duration: string;
  totalSteps: number;
  completedSteps: number;
  [key: string]: unknown;
}

type RoadNodeType = Node<RoadNodeData, "roadNode">;

export function RoadNode({ data, selected }: NodeProps<RoadNodeType>) {
  const {
    label,
    isWritten,
    isComplete,
    isSelected,
    isLocked,
    duration,
    totalSteps,
    completedSteps,
  } = data as RoadNodeData;
  const active = selected || isSelected;
  const inProgress = isWritten && !isComplete && completedSteps > 0;

  // Visual state system: each state has a unique color job
  const borderColor = isComplete
    ? "#4ade80"              // green — done
    : inProgress
      ? "#f59e0b"            // amber — actively in progress
      : isWritten
        ? "#3a3a3e"          // neutral — written but not started
        : isLocked
          ? "rgba(255,255,255,0.04)" // ghost — locked/unavailable
          : active
            ? "rgba(240, 64, 122, 0.4)" // pink glow — selected
            : "#2a2a2e";     // default border

  const bgColor = isComplete
    ? "rgba(20, 40, 28, 0.85)"
    : inProgress
      ? "rgba(35, 28, 16, 0.85)"
      : isWritten
        ? "rgba(23, 23, 28, 0.9)"
        : isLocked
          ? "rgba(18, 18, 20, 0.7)"
          : "#1a1a1d";

  const titleColor = isComplete
    ? "#bbf7d0"
    : inProgress
      ? "#fde68a"
      : isLocked
        ? "#6b6b75"
        : "#e5e5e8";

  const metaColor = isComplete
    ? "#4ade80"
    : inProgress
      ? "#f59e0b"
      : isLocked
        ? "#4a4a50"
        : "#6b6b75";

  const progressColor = isComplete ? "#4ade80" : inProgress ? "#f59e0b" : "#2a2a2e";
  const progressPct = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border transition-all",
        active && !isComplete ? "shadow-[0_0_20px_rgba(240,64,122,0.18)]" : "",
        isComplete ? "shadow-[0_0_12px_rgba(74,222,128,0.15)]" : "",
        inProgress ? "shadow-[0_0_12px_rgba(245,158,11,0.12)]" : "",
      )}
      style={{
        width: ROAD_NODE_WIDTH,
        height: ROAD_NODE_HEIGHT,
        borderColor,
        backgroundColor: bgColor,
        overflow: "hidden",
      }}
    >
      {/* Check badge when the node's DAG is complete */}
      {isComplete && (
        <span
          className="absolute -top-2.5 left-3 flex items-center justify-center rounded-full bg-done p-0.5"
          aria-label="節點完成"
        >
          <Check size={10} className="text-background" strokeWidth={3} />
        </span>
      )}

      {/* Lock icon for locked nodes */}
      {isLocked && (
        <span
          className="absolute -top-2.5 left-3 flex items-center justify-center rounded-full border border-white/5 bg-surface p-0.5"
          aria-label="尚未開放"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4a4a50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
      )}

      {/* Card content */}
      <div className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-1.5">
        {/* Title — left-aligned for readability */}
        <span
          className="truncate font-sans text-[0.68rem] font-semibold leading-tight"
          style={{ color: titleColor }}
        >
          {label}
        </span>

        {/* Meta row: duration + step count */}
        <div className="flex items-center gap-1.5">
          {duration && (
            <span
              className="font-mono text-[0.55rem] font-medium"
              style={{ color: metaColor }}
            >
              {duration}
            </span>
          )}
          {totalSteps > 0 && (
            <span
              className="font-mono text-[0.55rem]"
              style={{ color: metaColor }}
            >
              {completedSteps}/{totalSteps} steps
            </span>
          )}
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="h-[3px] w-full overflow-hidden rounded-b-lg bg-background/40">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 6, height: 6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 6, height: 6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 6, height: 6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!border-[#3a3a3e] !bg-[#1e1e21]"
        style={{ width: 6, height: 6 }}
      />
    </div>
  );
}

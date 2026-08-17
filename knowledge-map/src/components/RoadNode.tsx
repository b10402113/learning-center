import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "../lib/cn";
import { Check } from "./icons/Check";

export const ROAD_NODE_WIDTH = 160;
export const ROAD_NODE_HEIGHT = 48;

interface RoadNodeData {
  label: string;
  tier: number;
  isWritten: boolean;
  isComplete: boolean;
  isSelected: boolean;
  nodeId: string;
  [key: string]: unknown;
}

type RoadNodeType = Node<RoadNodeData, "roadNode">;

export function RoadNode({ data, selected }: NodeProps<RoadNodeType>) {
  const { label, isWritten, isComplete, isSelected } = data as RoadNodeData;
  const active = selected || isSelected;

  const borderColor = isComplete
    ? "#ff0071"
    : isWritten
      ? "#c40058"
      : active
        ? "#ff5ca8"
        : "#2a2a2e";

  const bgColor = isComplete
    ? "rgba(36, 16, 25, 0.9)"
    : isWritten
      ? "rgba(26, 20, 24, 0.9)"
      : active
        ? "rgba(30, 20, 26, 0.9)"
        : "#1a1a1d";

  const progressColor = isComplete ? "#ff0071" : isWritten ? "#c40058" : "#3a3a3e";
  const progressWidth = isComplete ? "100%" : isWritten ? "60%" : "0%";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border transition-all",
        active ? "shadow-[0_0_18px_rgba(255,92,168,0.22)]" : "",
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
          className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-brass px-1.5 py-0.5"
          aria-label="節點完成"
        >
          <Check size={11} className="text-background" strokeWidth={2.5} />
        </span>
      )}

      {/* Header: label. Clicking the card opens the node detail overlay
          (ADR-0006); hover highlight is the affordance, so no ▾ marker. */}
      <div
        className="flex items-center justify-center px-2"
        style={{ height: ROAD_NODE_HEIGHT }}
      >
        <span
          className="flex-1 text-center font-sans text-[0.7rem] font-medium leading-tight"
          style={{ color: "#f5f5f5" }}
        >
          {label}
        </span>
      </div>

      {/* Progress bar at bottom of the header */}
      <div className="h-0.5 w-full overflow-hidden rounded-b-lg bg-background/30">
        <div
          className="h-full transition-all"
          style={{ width: progressWidth, backgroundColor: progressColor }}
        />
      </div>

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
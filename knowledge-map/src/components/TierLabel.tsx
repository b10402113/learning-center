import { type Node, type NodeProps } from "@xyflow/react";

interface TierLabelData {
  stage: number;
  title: string;
  nodeCount: number;
  [key: string]: unknown;
}

type TierLabelType = Node<TierLabelData, "tierLabel">;

export function TierLabel({ data }: NodeProps<TierLabelType>) {
  const { stage, title } = data as TierLabelData;

  return (
    <div className="pointer-events-none flex flex-col gap-1 select-none" style={{ width: 100 }}>
      {/* Stage number */}
      <span
        className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em]"
        style={{ color: "rgba(240, 64, 122, 0.55)" }}
      >
        Stage {String(stage).padStart(2, "0")}
      </span>
      {/* Tier title */}
      <span
        className="font-sans text-[0.58rem] font-medium leading-snug"
        style={{ color: "#6b6b75" }}
      >
        {title}
      </span>
    </div>
  );
}

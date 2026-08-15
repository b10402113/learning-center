import { STATUS_LABEL } from "../lib/colors";
import type { Node } from "../lib/types";

interface HoverCardProps {
  node: Node;
  x: number;
  y: number;
}

export function HoverCard({ node, x, y }: HoverCardProps) {
  return (
    <div
      className="pointer-events-none absolute z-20 w-64 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-surface/95 p-3 shadow-xl shadow-black/40 backdrop-blur-md"
      style={{ left: x, top: y - 14 }}
      role="tooltip"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{node.title}</span>
        <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted">
          {STATUS_LABEL[node.status]}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{node.goal}</p>
    </div>
  );
}

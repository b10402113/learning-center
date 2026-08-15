import type { NodeStatus } from "./types";

export const STATUS_ORDER: NodeStatus[] = [
  "draft",
  "confirmed",
  "nodes-written",
  "content-written",
  "edges-written",
];

export const STATUS_LABEL: Record<NodeStatus, string> = {
  draft: "草稿",
  confirmed: "已確認",
  "nodes-written": "節點就緒",
  "content-written": "已成文",
  "edges-written": "已連線",
};

export const STATUS_LABEL_EN: Record<NodeStatus, string> = {
  draft: "draft",
  confirmed: "confirmed",
  "nodes-written": "nodes written",
  "content-written": "content written",
  "edges-written": "edges written",
};

/** content-written and edges-written are automatically charted */
export function isAutoCharted(status: NodeStatus): boolean {
  return status === "content-written" || status === "edges-written";
}

export function isWritten(status: string): boolean {
  return status === "content-written" || status === "edges-written";
}

export function statusLabel(status: string): string {
  return STATUS_LABEL[status as NodeStatus] ?? status;
}

export function statusRank(status: NodeStatus): number {
  return STATUS_ORDER.indexOf(status);
}

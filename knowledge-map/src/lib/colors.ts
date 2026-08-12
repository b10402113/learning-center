import type { PathStatus } from "./types";

export const STATUS_ORDER: PathStatus[] = [
  "draft",
  "confirmed",
  "nodes-written",
  "content-written",
  "edges-written",
];

export const STATUS_LABEL: Record<PathStatus, string> = {
  draft: "草稿",
  confirmed: "已確認",
  "nodes-written": "節點就緒",
  "content-written": "已成文",
  "edges-written": "已連線",
};

export const STATUS_LABEL_EN: Record<PathStatus, string> = {
  draft: "draft",
  confirmed: "confirmed",
  "nodes-written": "nodes written",
  "content-written": "content written",
  "edges-written": "edges written",
};

/** content-written and edges-written are automatically charted */
export function isAutoCharted(status: PathStatus): boolean {
  return status === "content-written" || status === "edges-written";
}

export function isWritten(status: string): boolean {
  return status === "content-written" || status === "edges-written";
}

export function statusLabel(status: string): string {
  return STATUS_LABEL[status as PathStatus] ?? status;
}

export function statusRank(status: PathStatus): number {
  return STATUS_ORDER.indexOf(status);
}

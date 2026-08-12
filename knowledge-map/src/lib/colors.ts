export const PALETTE = {
  resolved: "#a3cea1",
  resolvedGlow: "#6fa67a",
  frontier: "#86cfe8",
  frontierGlow: "#3e86a8",
  claimed: "#e0b455",
  claimedGlow: "#c79a3f",
  blocked: "#d7a6a0",
  outOfScope: "#7a8699",
} as const;

export function isWritten(status: string): boolean {
  return status === "content-written" || status === "edges-written";
}

const STATUS_LABELS: Record<string, string> = {
  draft: "草稿",
  confirmed: "已確認",
  "nodes-written": "節點已寫",
  "content-written": "內容已寫",
  "edges-written": "邊緣已寫",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

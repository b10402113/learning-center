export const PALETTE = {
  resolved: "#b9d6c4",
  resolvedGlow: "#5b9077",
  frontier: "#8ad8ff",
  frontierGlow: "#2f9be0",
  claimed: "#ffd873",
  claimedGlow: "#ffb020",
  blocked: "#e2c3c3",
  outOfScope: "#948da4",
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

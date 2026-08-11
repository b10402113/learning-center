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

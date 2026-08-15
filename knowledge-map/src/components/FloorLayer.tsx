import type { FloorBox } from "../lib/layout";
import type { TierBossState } from "../lib/selectors";
import { Crown } from "./icons/Crown";

interface FloorLayerProps {
  floors: FloorBox[];
  width: number;
  bossStates: Map<number, TierBossState>;
  onUnlock: (tier: number) => void;
}

export function FloorLayer({ floors, width, bossStates, onUnlock }: FloorLayerProps) {
  return (
    <g>
      {floors.map((f, i) => {
        const state = bossStates.get(f.tier) ?? "locked";
        return (
          <g key={f.tier}>
            {/* floor band */}
            <g aria-hidden="true">
              <rect
                x={f.laneX - 40}
                y={f.y}
                width={width - f.laneX + 40 - 120}
                height={f.height}
                rx={16}
                fill="oklch(0.2 0.024 265)"
                fillOpacity={i % 2 === 0 ? 0.35 : 0.22}
                stroke="var(--color-border)"
                strokeOpacity={0.5}
                strokeWidth={1}
              />

              {/* lane */}
              <g transform={`translate(${f.laneX} ${f.y + f.height / 2})`}>
                <text
                  x={0}
                  y={-6}
                  fontFamily="var(--font-serif)"
                  fontSize={54}
                  fill="var(--color-brass)"
                  opacity={0.9}
                >
                  {f.numeral}
                </text>
                <text
                  x={0}
                  y={26}
                  fontFamily="var(--font-sans)"
                  fontSize={17}
                  fontWeight={600}
                  fill="var(--color-foreground)"
                >
                  {f.title}
                </text>
                <line
                  x1={0}
                  y1={58}
                  x2={116}
                  y2={58}
                  stroke="var(--color-brass-dim)"
                  strokeOpacity={0.5}
                  strokeWidth={1}
                />
              </g>
            </g>

            {/* boss gate: the door out of this tier */}
            {state === "ready" ? (
              <g
                transform={`translate(${f.laneX} ${f.y + f.height / 2})`}
                role="button"
                tabIndex={0}
                aria-label={`${f.title}：頭目戰解鎖`}
                className="cursor-pointer"
                onClick={() => onUnlock(f.tier)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onUnlock(f.tier);
                  }
                }}
              >
                <rect
                  x={-4}
                  y={64}
                  width={124}
                  height={24}
                  rx={12}
                  fill="var(--color-surface-2)"
                  stroke="var(--color-brass-dim)"
                  strokeWidth={1}
                />
                <g transform="translate(4 69)" style={{ color: "var(--color-brass)" }}>
                  <Crown size={13} strokeWidth={2} />
                </g>
                <text
                  x={24}
                  y={80}
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fill="var(--color-brass)"
                >
                  頭目戰 · 解鎖
                </text>
              </g>
            ) : state === "beaten" ? (
              <g transform={`translate(${f.laneX} ${f.y + f.height / 2})`} aria-label={`${f.title}：已解鎖`}>
                <text
                  x={2}
                  y={80}
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fill="var(--color-muted)"
                >
                  ✓ 已解鎖
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

import type { FloorBox } from "@/lib/layout"
import { LANE_W } from "@/lib/layout"

interface FloorLayerProps {
  floors: FloorBox[]
  width: number
}

export function FloorLayer({ floors, width }: FloorLayerProps) {
  return (
    <g aria-hidden>
      {floors.map((f, i) => (
        <g key={f.tierId}>
          {/* floor band */}
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
            {f.subtitle && (
              <text
                x={0}
                y={46}
                fontFamily="var(--font-mono)"
                fontSize={11}
                fill="var(--color-muted)"
                letterSpacing={1}
              >
                {f.subtitle.toUpperCase()}
              </text>
            )}
            <line
              x1={0}
              y1={58}
              x2={LANE_W - 24}
              y2={58}
              stroke="var(--color-brass-dim)"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          </g>
        </g>
      ))}
    </g>
  )
}

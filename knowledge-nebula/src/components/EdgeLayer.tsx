import type { EdgePath } from "@/lib/layout"
import type { Subject } from "@/types"

interface EdgeLayerProps {
  edges: EdgePath[]
  hoveredId: string | null
  subject: Subject
}

function edgeTouchesHover(
  edgeId: string,
  hoveredId: string | null,
  subject: Subject,
): boolean {
  if (!hoveredId) return false
  const e = subject.edges.find((x) => x.id === edgeId)
  if (!e) return false
  return e.from === hoveredId || e.to === hoveredId
}

export function EdgeLayer({ edges, hoveredId, subject }: EdgeLayerProps) {
  return (
    <g aria-hidden>
      {edges.map((e) => {
        const active = edgeTouchesHover(e.id, hoveredId, subject)
        const dim = hoveredId !== null && !active
        const baseOpacity = dim ? 0.12 : 1

        if (e.kind === "spine") {
          return (
            <g key={e.id} opacity={baseOpacity}>
              <path
                d={e.d}
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth={active ? 2.4 : 1.6}
                markerEnd="url(#arrowSpine)"
              />
            </g>
          )
        }

        if (e.kind === "shared") {
          return (
            <g key={e.id} opacity={baseOpacity}>
              <path
                d={e.d}
                fill="none"
                stroke="var(--color-brass-dim)"
                strokeWidth={active ? 2 : 1.3}
                strokeDasharray="4 5"
                strokeOpacity={0.85}
              />
              {active && e.label && (
                <text
                  x={e.labelX}
                  y={e.labelY}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-brass)"
                >
                  {e.label}
                </text>
              )}
            </g>
          )
        }

        // explicit
        return (
          <g key={e.id} opacity={baseOpacity} filter="url(#beaconGlow)">
            <path
              d={e.d}
              fill="none"
              stroke="var(--color-beacon)"
              strokeWidth={active ? 2.4 : 1.6}
              strokeOpacity={0.9}
              markerEnd="url(#arrowExplicit)"
            />
            {e.label && (
              <text
                x={e.labelX}
                y={e.labelY}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-beacon)"
              >
                {e.label}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

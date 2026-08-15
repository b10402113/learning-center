import type { NodeMarker } from "../lib/layout";

interface NodeLayerProps {
  markers: NodeMarker[];
  selectedId: string | null;
  completedIds: Set<string>;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  layer?: "all" | "anchors" | "markers";
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export function NodeLayer({ markers, selectedId, completedIds, hoveredId, onSelect, layer = "all" }: NodeLayerProps) {
  return (
    <g aria-label="概念 node">
      {layer !== "markers" ? (
        /* force tether lines: node → its teaching lessons */
        <g aria-hidden="true">
          {markers.map((m) =>
            m.anchors.length ? (
              <g key={m.id}>
                {m.anchors.map((a) => {
                  const dim = hoveredId !== null && !m.anchors.some((x) => x.pathId === hoveredId);
                  const opacity = dim ? 0.08 : 0.4;
                  return (
                    <line
                      key={a.pathId}
                      x1={m.x}
                      y1={m.y}
                      x2={a.x}
                      y2={a.y}
                      stroke="var(--color-brass-dim)"
                      strokeOpacity={opacity}
                      strokeWidth={1}
                      strokeDasharray="3 4"
                    />
                  );
                })}
              </g>
            ) : null,
          )}
        </g>
      ) : null}

      {layer !== "anchors" ? (
        markers.map((m) => {
          const selected = selectedId === m.id;
          const completed = completedIds.has(m.id);
          const fill = selected ? "var(--color-beacon)" : completed ? "var(--color-brass)" : "var(--color-brass-dim)";
          const fillOpacity = selected ? 0.95 : completed ? 0.9 : 0.35;
          return (
            <g
              key={m.id}
              transform={`translate(${m.x} ${m.y})`}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${m.title}（node）${completed ? "已學" : ""}`}
              onClick={() => onSelect(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(m.id);
                }
              }}
            >
              <title>{m.title}</title>
              <circle
                r={6}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={fill}
                strokeWidth={selected ? 2 : 1.25}
              />
              <text
                x={10}
                y={3}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-faint)"
              >
                {truncate(m.title, 8)}
              </text>
            </g>
          );
        })
      ) : null}
    </g>
  );
}

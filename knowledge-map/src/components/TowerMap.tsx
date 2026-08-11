import { Crown } from "lucide-react";
import { useMemo, useState } from "react";
import { isWritten, PALETTE, statusLabel } from "../lib/colors";
import {
  computeLayout,
  LANE_X,
  TILE_H,
  TILE_W,
  type LinkPos,
  type Point,
} from "../lib/layout";
import type { PathNode, SubjectGraph } from "../lib/types";

function horizCurve(a: Point, b: Point): string {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

function dropCurve(a: Point, b: Point): string {
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
}

function EdgePath({ link, d, stroke, width, opacity, dash, glow, arrow }: {
  link: LinkPos;
  d: string;
  stroke: string;
  width: number;
  opacity: number;
  dash?: string;
  glow?: boolean;
  arrow?: boolean;
}) {
  return (
    <g>
      {glow && (
        <path d={d} fill="none" stroke={stroke} strokeWidth={width * 3} opacity={opacity * 0.35} filter="url(#edgeGlow)" />
      )}
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} opacity={opacity} strokeDasharray={dash} markerEnd={arrow ? "url(#arrowhead)" : undefined} />
      {link.label && (
        <text
          x={(link.from.x + link.to.x) / 2}
          y={(link.from.y + link.to.y) / 2 - 6}
          textAnchor="middle"
          fontSize={10}
          fill={PALETTE.claimed}
          fontFamily="var(--font-mono)"
        >
          {link.label}
        </text>
      )}
    </g>
  );
}

function Tile({ path, boss, lit, selected }: { path: PathNode; boss: boolean; lit: boolean; selected: boolean }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-lg border p-2 transition-colors ${
        selected
          ? "border-ring bg-secondary"
          : lit
            ? "border-[#5b9077]/60 bg-[oklch(0.2_0.03_155)]/85"
            : "border-transparent bg-card/50"
      }`}
    >
      <div className="absolute left-1.5 top-1.5 grid size-5 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-muted-foreground">
        {path.order}
      </div>
      {boss && <Crown className="absolute right-1.5 top-1.5 size-4" color={PALETTE.claimed} strokeWidth={2} />}
      <div className="mt-4 line-clamp-2 px-1 text-xs font-medium leading-tight text-foreground">
        {path.title}
      </div>
      <div className="absolute bottom-1 left-2 right-2 truncate font-mono text-[0.6rem] text-muted-foreground">
        {statusLabel(path.status)}
      </div>
    </div>
  );
}

interface Tooltip {
  id: string;
  x: number;
  y: number;
}

interface Props {
  graph: SubjectGraph;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function TowerMap({ graph, selectedId, onSelect }: Props) {
  const layout = useMemo(() => computeLayout(graph), [graph]);
  const pathById = useMemo(() => new Map(graph.paths.map((p) => [p.id, p])), [graph]);
  const written = useMemo(
    () => new Set(graph.paths.filter((p) => isWritten(p.status)).map((p) => p.id)),
    [graph],
  );
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const hovered = tooltip ? pathById.get(tooltip.id) : null;

  return (
    <div
      className="relative min-h-0 flex-1 overflow-auto"
      onClick={() => onSelect(null)}
    >
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="block h-auto min-w-[720px] w-full"
        role="img"
        aria-label={`${graph.subject} 學習路線塔`}
      >
        <defs>
          <filter id="tileGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="edgeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <marker
            id="arrowhead"
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L7,3.5 L0,7 z" fill={PALETTE.frontier} />
          </marker>
        </defs>

        <rect x={0} y={0} width={layout.width} height={layout.height} fill="var(--background)" />

        {layout.stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={i % 5 === 0 ? 1.3 : 0.7} fill={PALETTE.frontier} opacity={0.25} />
        ))}

        {layout.floors.map((f) => (
          <g key={f.tier}>
            <line
              x1={LANE_X - 20}
              x2={layout.width}
              y1={f.y + TILE_H / 2}
              y2={f.y + TILE_H / 2}
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray="2 8"
              opacity={0.5}
            />
            <text
              x={LANE_X - 26}
              y={f.y + TILE_H / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={13}
              fontWeight={600}
              fill="var(--muted-foreground)"
            >
              {`T${f.tier}`}
            </text>
            <text
              x={LANE_X - 26}
              y={f.y + TILE_H / 2 + 15}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="var(--muted-foreground)"
              opacity={0.7}
            >
              {f.title}
            </text>
          </g>
        ))}

        {layout.shared.map((link, i) => (
          <EdgePath
            key={`s${i}`}
            link={link}
            d={horizCurve(link.from, link.to)}
            stroke={PALETTE.claimed}
            width={1}
            opacity={0.4}
            dash="4 4"
          />
        ))}

        {layout.spine.map((link, i) => (
          <EdgePath key={`sp${i}`} link={link} d={horizCurve(link.from, link.to)} stroke={PALETTE.frontier} width={1.6} opacity={0.85} arrow />
        ))}

        {layout.boundarySpine.map((link, i) => (
          <EdgePath key={`bp${i}`} link={link} d={dropCurve(link.from, link.to)} stroke={PALETTE.frontier} width={1.6} opacity={0.85} arrow />
        ))}

        {layout.explicit.map((link, i) => (
          <EdgePath key={`e${i}`} link={link} d={horizCurve(link.from, link.to)} stroke={PALETTE.resolved} width={1.4} opacity={0.9} glow arrow />
        ))}

        {layout.floors.flatMap((f) => f.tiles).map((t) => {
          const path = pathById.get(t.id);
          if (!path) return null;
          const lit = written.has(t.id);
          const boss = layout.bossIds.includes(t.id);
          const selected = selectedId === t.id;
          return (
            <g
              key={t.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(selected ? null : t.id);
              }}
              onMouseMove={(e) => setTooltip({ id: t.id, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
              className="cursor-pointer"
            >
              {lit && (
                <rect
                  x={t.x}
                  y={t.y}
                  width={TILE_W}
                  height={TILE_H}
                  rx={8}
                  fill={PALETTE.resolvedGlow}
                  opacity={0.22}
                  filter="url(#tileGlow)"
                />
              )}
              <foreignObject x={t.x} y={t.y} width={TILE_W} height={TILE_H}>
                <div style={{ width: "100%", height: "100%" }} className={lit || selected ? "" : "opacity-55"}>
                  <Tile path={path} boss={boss} lit={lit} selected={selected} />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {tooltip && hovered && (
        <div
          className="pointer-events-none fixed z-20 w-64 rounded-lg border border-border bg-card/95 p-2.5 shadow-xl backdrop-blur-sm"
          style={{
            left: Math.min(tooltip.x + 14, window.innerWidth - 268),
            top: tooltip.y + 14,
          }}
        >
          <div className="text-xs font-semibold text-foreground">{hovered.title}</div>
          <div className="mt-0.5 font-mono text-[0.65rem] text-muted-foreground">{statusLabel(hovered.status)}</div>
          {hovered.goal && (
            <div className="mt-1 line-clamp-3 text-[0.7rem] leading-relaxed text-muted-foreground">{hovered.goal}</div>
          )}
        </div>
      )}
    </div>
  );
}

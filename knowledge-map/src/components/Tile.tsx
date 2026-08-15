import { STATUS_LABEL } from "../lib/colors";
import type { TileBox } from "../lib/layout";
import type { PathNode } from "../lib/types";
import { Check } from "./icons/Check";
import { Crown } from "./icons/Crown";
import { Lock } from "./icons/Lock";

interface TileProps {
  path: PathNode;
  box: TileBox;
  lit: boolean;
  locked: boolean;
  nodeReadCount: number;
  boss: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export function Tile({ path, box, lit, locked, nodeReadCount, boss, selected, onSelect, onHover }: TileProps) {
  const stroke = selected
    ? "var(--color-beacon)"
    : locked
      ? "var(--color-steel)"
      : lit
        ? "var(--color-brass-dim)"
        : "var(--color-border)";

  function truncate(s: string, max: number): string {
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
  }

  return (
    <g
      transform={`translate(${box.x} ${box.y})`}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${path.title} — ${STATUS_LABEL[path.status]}${locked ? "（鎖定）" : ""}`}
      onClick={() => onSelect(path.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(path.id);
        }
      }}
      onMouseEnter={() => onHover(path.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(path.id)}
      onBlur={() => onHover(null)}
    >
      {lit && !locked ? (
        <rect
          x={-6}
          y={-6}
          width={box.w + 12}
          height={box.h + 12}
          rx={12}
          fill="none"
          stroke="var(--color-brass)"
          strokeOpacity={0.18}
          strokeWidth={10}
        />
      ) : null}
      <rect
        width={box.w}
        height={box.h}
        rx={10}
        fill={locked ? "oklch(0.17 0.022 265)" : lit ? "url(#tileLit)" : "url(#tileDim)"}
        stroke={stroke}
        strokeWidth={selected ? 2.5 : 1.25}
      />

      {/* locked tiers dim their content but keep it readable */}
      <g opacity={locked ? 0.5 : 1}>
        {/* order chip */}
        <g transform="translate(14 14)">
          <rect
            width={26}
            height={26}
            rx={6}
            fill="var(--color-surface-2)"
            stroke="var(--color-border)"
            strokeWidth={1}
          />
          <text
            x={13}
            y={17}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={13}
            fill="var(--color-muted)"
          >
            {path.order}
          </text>
        </g>

        {/* title */}
        <text
          x={14}
          y={58}
          fontFamily="var(--font-sans)"
          fontSize={16}
          fontWeight={600}
          fill="var(--color-foreground)"
        >
          {truncate(path.title, 12)}
        </text>

        {/* status label */}
        <g transform={`translate(14 ${box.h - 22})`}>
          <circle cx={4} cy={-4} r={4} fill={lit ? "var(--color-brass)" : "var(--color-muted)"} />
          <text
            x={16}
            y={0}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-muted)"
          >
            {STATUS_LABEL[path.status]}
          </text>
        </g>

        {/* brass seal when charted */}
        {lit ? (
          <g transform={`translate(${box.w - 30} ${box.h - 30})`} aria-hidden="true">
            <circle
              r={11}
              cx={11}
              cy={11}
              fill="var(--color-brass)"
              fillOpacity={0.15}
              stroke="var(--color-brass)"
              strokeWidth={1.5}
            />
            <path
              d="M 6 11 L 9.5 14.5 L 16 8"
              fill="none"
              stroke="var(--color-brass)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ) : null}
      </g>

      {/* node-read badge: how many taught nodes were marked complete */}
      {nodeReadCount > 0 ? (
        <g transform={`translate(${boss ? box.w - 62 : box.w - 38} 12)`} aria-label={`已學 ${nodeReadCount} 個 node`}>
          <title>{`已學 ${nodeReadCount} 個 node`}</title>
          <rect
            width={24}
            height={24}
            rx={7}
            fill="var(--color-surface-2)"
            stroke="var(--color-brass-dim)"
            strokeWidth={1}
          />
          <g transform="translate(2 2)" style={{ color: "var(--color-brass)" }}>
            <Check size={12} strokeWidth={2.5} />
          </g>
          <text
            x={17}
            y={18}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-brass)"
          >
            {nodeReadCount}
          </text>
        </g>
      ) : null}

      {boss ? (
        <g transform={`translate(${box.w - 34} 12)`} aria-hidden="true" style={{ color: "var(--color-brass)" }}>
          <Crown size={20} strokeWidth={2} />
        </g>
      ) : null}

      {/* lock overlay for gated tiers */}
      {locked ? (
        <g transform={`translate(${box.w / 2} 20)`} aria-hidden="true">
          <rect
            x={-11}
            y={-11}
            width={22}
            height={22}
            rx={6}
            fill="var(--color-surface-2)"
            fillOpacity={0.9}
          />
          <g transform="translate(-7 -7)" style={{ color: "var(--color-muted)" }}>
            <Lock size={14} strokeWidth={2} />
          </g>
        </g>
      ) : null}
    </g>
  );
}

import { Check } from "./icons/Check";

export function Legend() {
  return (
    <div className="pointer-events-none absolute bottom-5 left-5 rounded-lg border border-border bg-surface/70 px-4 py-3 backdrop-blur-md">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        圖例 · Legend
      </div>
      <ul className="flex flex-col gap-1.5 text-xs text-foreground">
        <li className="flex items-center gap-2.5">
          <svg width="34" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="26"
              y2="4"
              stroke="var(--color-beacon)"
              strokeWidth="1.3"
              strokeDasharray="5 4"
            />
            <path d="M 26 1 L 32 4 L 26 7 z" fill="var(--color-beacon)" />
          </svg>
          <span>依賴 · step-dep</span>
        </li>
        <li className="flex items-center gap-2.5">
          <svg width="34" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="34"
              y2="4"
              stroke="#5f5f66"
              strokeWidth="1"
              strokeDasharray="1 3"
            />
          </svg>
          <span>教學 · teach</span>
        </li>
        <li className="mt-1 flex items-center gap-2.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border border-brass-dim"
            style={{ background: "#241019" }}
          ></span>
          <span>步驟完成 · step complete</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="inline-flex h-5 w-6 items-center justify-center rounded-sm border border-brass-dim/60 bg-brass/10">
            <Check size={11} className="text-brass" />
          </span>
          <span>節點完成 · node complete</span>
        </li>
      </ul>
    </div>
  );
}


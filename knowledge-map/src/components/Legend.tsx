import { Check, Crown, Lock } from "lucide-react";

export function Legend() {
  return (
    <div className="pointer-events-none absolute bottom-5 left-5 rounded-lg border border-border bg-surface/70 px-4 py-3 backdrop-blur-md">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        圖例 · Legend
      </div>
      <ul className="flex flex-col gap-1.5 text-xs text-foreground">
        <li className="flex items-center gap-2.5">
          <svg width="34" height="8" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="26"
              y2="4"
              stroke="var(--color-muted)"
              strokeWidth="1.6"
            />
            <path d="M 26 1 L 32 4 L 26 7 z" fill="var(--color-muted)" />
          </svg>
          <span>順序 · spine</span>
        </li>
        <li className="flex items-center gap-2.5">
          <svg width="34" height="8" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="34"
              y2="4"
              stroke="var(--color-brass-dim)"
              strokeWidth="1.6"
              strokeDasharray="4 5"
            />
          </svg>
          <span>共享概念 · shared</span>
        </li>
        <li className="flex items-center gap-2.5">
          <svg width="34" height="8" aria-hidden>
            <line
              x1="0"
              y1="4"
              x2="26"
              y2="4"
              stroke="var(--color-beacon)"
              strokeWidth="1.6"
            />
            <path d="M 26 1 L 32 4 L 26 7 z" fill="var(--color-beacon)" />
          </svg>
          <span>顯式關係 · explicit</span>
        </li>
        <li className="mt-1 flex items-center gap-2.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brass" />
          <span>已成圖 · charted</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="inline-flex h-5 w-6 items-center justify-center rounded-sm border border-steel bg-surface-2/60">
            <Lock size={11} className="text-muted" />
          </span>
          <span>鎖定 · locked</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="inline-flex h-5 w-6 items-center justify-center rounded-sm border border-brass-dim/60 bg-brass/10">
            <Crown size={11} className="text-brass" />
          </span>
          <span>已解鎖 · unlocked</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="inline-flex h-5 w-6 items-center justify-center rounded-sm border border-brass-dim/60 bg-brass/10">
            <Check size={11} className="text-brass" />
          </span>
          <span>node 已學 · node read</span>
        </li>
      </ul>
    </div>
  );
}

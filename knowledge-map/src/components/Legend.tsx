import { useState } from "react";

export function Legend() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="pointer-events-auto absolute bottom-5 left-5 rounded-lg border border-border bg-surface/80 backdrop-blur-md transition-all"
    >
      {/* Toggle header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${expanded ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        圖例 · Legend
      </button>

      {/* Collapsible content */}
      {expanded && (
        <div className="border-t border-border px-3 pb-3 pt-2">
          {/* Card states */}
          <div className="mb-2.5">
            <div className="mb-1.5 font-mono text-[0.5rem] uppercase tracking-[0.15em] text-faint">
              節點狀態
            </div>
            <ul className="flex flex-col gap-1.5 text-[0.65rem]">
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ border: "1px solid rgba(74,222,128,0.5)", background: "rgba(74,222,128,0.12)" }}
                />
                <span style={{ color: "#a1a1aa" }}>已完成 · Complete</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ border: "1px solid rgba(245,158,11,0.5)", background: "rgba(245,158,11,0.12)" }}
                />
                <span style={{ color: "#a1a1aa" }}>進行中 · In progress</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#17171c" }}
                />
                <span style={{ color: "#a1a1aa" }}>未開始 · Not started</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}
                />
                <span style={{ color: "#a1a1aa" }}>鎖定 · Locked</span>
              </li>
            </ul>
          </div>

          {/* Edge types */}
          <div>
            <div className="mb-1.5 font-mono text-[0.5rem] uppercase tracking-[0.15em] text-faint">
              連線類型
            </div>
            <ul className="flex flex-col gap-1.5 text-[0.65rem]">
              <li className="flex items-center gap-2">
                <svg width="28" height="8" aria-hidden="true">
                  <line
                    x1="0" y1="4" x2="22" y2="4"
                    stroke="rgba(160,160,165,0.4)"
                    strokeWidth="1.3"
                    strokeDasharray="6 4"
                  />
                </svg>
                <span style={{ color: "#a1a1aa" }}>教學順序 · Teaching order</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

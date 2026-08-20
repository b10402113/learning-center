import { toast } from "sonner";
import { button } from "../lib/buttonVariants";
import { cn } from "../lib/cn";
import { isWritten } from "../lib/colors";
import type { SubjectGraph } from "../lib/types";
import { Graph } from "./icons/Graph";
import { Map } from "./icons/Map";
import { Reset } from "./icons/Reset";
import { Tooltip } from "./ui/Tooltip";
import { useEffect, useRef, useState } from "react";

interface TopBarProps {
  graphs: SubjectGraph[];
  subject: string;
  view: "nebula" | "roadmap";
  hasProgress: boolean;
  onReset: () => void;
  onSelect: (s: string) => void;
  onViewChange: (v: "nebula" | "roadmap") => void;
}

/** Secondary controls (metadata legend + reset) collapsed behind "⋯ 檢視選項". */
function ViewOptionsMenu({ hasProgress, onReset }: { hasProgress: boolean; onReset: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="view-options-wrap" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="view-options-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span aria-hidden="true">⋯</span>
        <span className="hidden sm:inline">檢視選項</span>
      </button>

      {open ? (
        <div className="view-options-menu" role="menu" aria-label="檢視選項">
          <div className="view-options-label">地圖圖層</div>
          <div className="view-options-item" title="spine：節點的順序">
            <span className="view-options-swatch">
              <span className="h-0.5 w-4 rounded bg-muted" />
            </span>
            <span>spine · 順序</span>
          </div>
          <div className="view-options-item" title="shared：共享概念">
            <span className="view-options-swatch">
              <span className="h-px w-4 border-t border-dashed border-muted" />
            </span>
            <span>shared · 共享</span>
          </div>
          <div className="view-options-item" title="charted：已寫內容">
            <span className="view-options-swatch">
              <span className="size-1.5 rounded-full bg-muted" />
            </span>
            <span>charted · 已成文</span>
          </div>

          <div className="view-options-sep" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
            disabled={!hasProgress}
            className="view-options-action"
          >
            <Reset size={12} />
            重置進度
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function TopBar({
  graphs,
  subject,
  view,
  hasProgress,
  onReset,
  onSelect,
  onViewChange,
}: TopBarProps) {
  const writtenCount = (g: SubjectGraph) =>
    g.nodes.filter((n) => isWritten(n.status)).length;
  const plate = graphs.findIndex((g) => g.subject === subject) + 1;

  const selectRef = useRef<HTMLSelectElement | null>(null);

  // ⌘K focuses the subject switcher, mirroring the docs-site search affordance.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        selectRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleItem = (active: boolean) =>
    cn(
      "flex h-8 items-center gap-1.5 rounded-md px-3 font-mono text-[0.72rem] transition-colors",
      active
        ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
        : "text-faint hover:text-foreground",
    );

  function copyShareLink() {
    const url = window.location.href;
    navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("已複製分享連結"))
      .catch(() => toast("無法複製連結", { description: url }));
  }

  return (
    <header className="cockpit-bar shrink-0 gap-4">
      <div className="flex items-baseline gap-2.5">
        <span className="text-lg font-bold leading-none tracking-tight text-foreground">
          知識星雲
        </span>
        <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.22em] text-faint md:inline">
          Knowledge Nebula · Sheet {String(plate).padStart(2, "0")}
        </span>
      </div>

      <label className="group relative flex min-w-0 items-center">
        <span className="pointer-events-none absolute left-2.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
          Subject
        </span>
        <select
          ref={selectRef}
          value={subject}
          onChange={(e) => onSelect(e.currentTarget.value)}
          className="h-8 min-w-0 max-w-64 flex-1 cursor-pointer appearance-none rounded-lg border border-input bg-surface pl-[4.1rem] pr-8 font-mono text-xs font-medium text-foreground outline-none transition-colors hover:border-steel/70 focus:border-brand-primary"
        >
          {graphs.map((g) => (
            <option key={g.subject} value={g.subject}>
              {g.subject} · {g.nodes.length} plates · {writtenCount(g)} charted
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 font-mono text-[0.6rem] text-faint">
          ⌘K
        </span>
      </label>

      <div className="ml-auto flex items-center gap-2 text-[0.65rem] text-faint">
        {/* Primary layer — view switch + the single primary CTA (share) */}
        <div className="flex items-center gap-0.5 rounded-lg border border-input bg-surface p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("nebula")}
            className={toggleItem(view === "nebula")}
            aria-pressed={view === "nebula"}
          >
            <Graph size={13} />
            星雲
          </button>
          <button
            type="button"
            onClick={() => onViewChange("roadmap")}
            className={toggleItem(view === "roadmap")}
            aria-pressed={view === "roadmap"}
          >
            <Map size={13} />
            節點
          </button>
        </div>

        <Tooltip
          trigger={(props) => (
            <button
              {...props}
              type="button"
              onClick={copyShareLink}
              className={cn(button({ variant: "primary", size: "md" }), "h-8 px-4 text-[0.72rem]")}
            >
              ⌘ 分享
            </button>
          )}
        >
          複製目前頁面連結
        </Tooltip>

        {/* Secondary layer — metadata toggles + reset, folded behind ⋯ */}
        <ViewOptionsMenu hasProgress={hasProgress} onReset={onReset} />
      </div>
    </header>
  );
}

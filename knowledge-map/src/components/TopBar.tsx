import { toast } from "sonner";
import { button } from "../lib/buttonVariants";
import { cn } from "../lib/cn";
import { isWritten } from "../lib/colors";
import type { SubjectGraph } from "../lib/types";
import { Graph } from "./icons/Graph";
import { Map } from "./icons/Map";
import { Reset } from "./icons/Reset";
import { Tooltip } from "./ui/Tooltip";
import { useEffect, useRef } from "react";

interface TopBarProps {
  graphs: SubjectGraph[];
  subject: string;
  view: "nebula" | "roadmap";
  hasProgress: boolean;
  onReset: () => void;
  onSelect: (s: string) => void;
  onViewChange: (v: "nebula" | "roadmap") => void;
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

      <div className="ml-auto flex items-center gap-4 text-[0.65rem] text-faint">
        {/* View mode toggle — clearly separated */}
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

        {/* Separator line between view toggle and status indicators */}
        <div className="h-4 w-px bg-border" />

        {/* Status indicators — badge style with icon+text */}
        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-1 rounded-md border border-input bg-surface px-2 py-0.5" title="spine：節點的順序">
            <span className="h-0.5 w-3 bg-muted rounded"></span>
            <span className="font-mono text-[0.62rem]">spine</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-input bg-surface px-2 py-0.5" title="shared：共享概念">
            <span className="h-px w-3 border-t border-dashed border-brand-primary-dim"></span>
            <span className="font-mono text-[0.62rem]">shared</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-input bg-surface px-2 py-0.5" title="written：已寫內容">
            <span className="size-1.5 rounded-full bg-brand-primary"></span>
            <span className="font-mono text-[0.62rem]">charted</span>
          </span>
        </div>

        {/* Separator line before buttons */}
        <div className="h-4 w-px bg-border" />

        {/* Action buttons — clearly styled as clickable */}
        <Tooltip
          trigger={(props) => (
            <button
              {...props}
              type="button"
              onClick={onReset}
              disabled={!hasProgress}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 font-mono transition-colors",
                "rounded-md border border-input bg-surface px-2.5 py-1.5",
                "text-faint hover:border-brand-primary hover:text-brand-primary",
                "disabled:pointer-events-none disabled:opacity-40",
              )}
              aria-label="重置進度"
            >
              <Reset size={12} />
              <span className="hidden sm:inline">重置進度</span>
            </button>
          )}
        >
          清除手動標記的完成進度（element 與 node 主文；已寫內容的狀態不受影響）
        </Tooltip>
        <button
          type="button"
          onClick={copyShareLink}
          className={cn(
            button({ variant: "primary", size: "md" }),
            "h-8 px-4 text-[0.72rem]",
          )}
        >
          ⌘ 分享
        </button>
      </div>
    </header>
  );
}
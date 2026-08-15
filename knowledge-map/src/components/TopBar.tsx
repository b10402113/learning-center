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
      "flex h-7 items-center gap-1 rounded-md px-2.5 font-mono text-[0.7rem] transition-colors",
      active
        ? "bg-brass/10 text-brass"
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
          className="h-8 min-w-0 max-w-64 flex-1 cursor-pointer appearance-none rounded-lg border border-input bg-surface pl-[4.1rem] pr-8 font-mono text-xs font-medium text-foreground outline-none transition-colors hover:border-steel/70 focus:border-brass"
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

        <span className="hidden items-center gap-1.5 lg:flex" title="spine：節點的順序">
          <span className="h-0.5 w-4 bg-muted"></span>
          spine
        </span>
        <span className="hidden items-center gap-1.5 lg:flex" title="shared：共享概念">
          <span className="h-px w-4 border-t-2 border-dashed border-brass-dim"></span>
          shared
        </span>
        <span className="hidden items-center gap-1.5 lg:flex" title="written：已寫內容">
          <span className="size-2 rounded-full bg-brass"></span>
          charted
        </span>
        <Tooltip
          trigger={(props) => (
            <button
              {...props}
              type="button"
              onClick={onReset}
              disabled={!hasProgress}
              className={cn(button({ variant: "outline", size: "sm" }), "h-7 px-2.5")}
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
          className={cn(button({ variant: "primary", size: "md" }), "h-7 px-3.5 text-[0.7rem]")}
        >
          ⌘ 分享
        </button>
      </div>
    </header>
  );
}

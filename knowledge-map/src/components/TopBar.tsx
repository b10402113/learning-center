import { RotateCcw } from "lucide-react";
import { isWritten } from "../lib/colors";
import type { SubjectGraph } from "../lib/types";

interface Props {
  graphs: SubjectGraph[];
  subject: string;
  hasProgress: boolean;
  onReset: () => void;
  onSelect: (subject: string) => void;
}

export function TopBar({ graphs, subject, hasProgress, onReset, onSelect }: Props) {
  const writtenCount = (g: SubjectGraph) => g.paths.filter((p) => isWritten(p.status)).length;
  const plate = graphs.findIndex((g) => g.subject === subject) + 1;
  return (
    <header className="cockpit-bar shrink-0 gap-3">
      <span className="font-display text-lg leading-none tracking-wide text-foreground">
        知識星雲
      </span>
      <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.22em] text-faint md:inline">
        Knowledge Nebula · Sheet {String(plate).padStart(2, "0")}
      </span>

      <div className="mx-1 h-4 w-px shrink-0 bg-steel/50" aria-hidden />

      <label className="flex min-w-0 items-center gap-1.5">
        <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint lg:inline">
          Subject
        </span>
        <select
          value={subject}
          onChange={(e) => onSelect(e.target.value)}
          className="h-7 min-w-0 max-w-56 flex-1 truncate rounded-sm border border-input bg-card px-1.5 font-mono text-xs font-medium text-foreground outline-none transition-colors hover:border-steel/60 focus:border-brass"
        >
          {graphs.map((g) => (
            <option key={g.subject} value={g.subject}>
              {g.subject} · {g.paths.length} plates · {writtenCount(g)} charted
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex items-center gap-4 text-[0.65rem] text-faint">
        <span className="hidden items-center gap-1.5 md:flex" title="spine：路徑的順序">
          <span className="h-0.5 w-4 bg-muted" />
          spine
        </span>
        <span className="hidden items-center gap-1.5 md:flex" title="shared：共享概念">
          <span className="h-px w-4 border-t-2 border-dashed border-brass-dim" />
          shared
        </span>
        <span className="hidden items-center gap-1.5 md:flex" title="written：已寫內容">
          <span className="size-2 rounded-full bg-brass" />
          charted
        </span>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasProgress}
          title="清除手動標記的進度（path / node / tier 解鎖一起清；content-written 的自動完成不受影響）"
          className="flex h-6 items-center gap-1 rounded-sm border border-input px-2 font-mono text-[0.65rem] text-faint transition-colors hover:border-brass hover:text-brass disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw className="size-3" />
          <span className="hidden sm:inline">重置進度</span>
        </button>
      </div>
    </header>
  );
}

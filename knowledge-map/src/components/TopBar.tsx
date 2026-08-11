import { Sparkles } from "lucide-react";
import { isWritten, PALETTE } from "../lib/colors";
import type { SubjectGraph } from "../lib/types";

interface Props {
  graphs: SubjectGraph[];
  subject: string;
  onSelect: (subject: string) => void;
}

export function TopBar({ graphs, subject, onSelect }: Props) {
  const writtenCount = (g: SubjectGraph) => g.paths.filter((p) => isWritten(p.status)).length;
  return (
    <header className="cockpit-bar shrink-0">
      <Sparkles className="size-4 text-primary" />
      <span className="text-sm font-semibold tracking-tight">知識星雲</span>
      <span className="text-xs text-muted-foreground">/</span>
      <select
        value={subject}
        onChange={(e) => onSelect(e.target.value)}
        className="h-7 rounded-md border border-input bg-input/20 px-2 font-mono text-xs font-medium text-foreground outline-none focus:border-ring"
      >
        {graphs.map((g) => (
          <option key={g.subject} value={g.subject}>
            {g.subject} · {g.paths.length} paths · {writtenCount(g)} written
          </option>
        ))}
      </select>
      <div className="ml-auto flex items-center gap-4 text-[0.65rem] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4" style={{ background: PALETTE.frontier }} />
          spine 順序
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-px w-4 border-t border-dashed" style={{ borderColor: PALETTE.claimed }} />
          shared 共享概念
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: PALETTE.resolved }} />
          written 已寫
        </span>
      </div>
    </header>
  );
}

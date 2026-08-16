import { Minimize2 } from "lucide-react"
import type { PathNode } from "@/types"
import { ArticleBody } from "./ArticleBody"

interface FullReadProps {
  path: PathNode
  validTargets: Set<string>
  onNavigateNode: (id: string) => void
  onClose: () => void
}

export function FullRead({
  path,
  validTargets,
  onNavigateNode,
  onClose,
}: FullReadProps) {
  return (
    <div
      role="dialog"
      aria-label={`全螢幕閱讀：${path.title}`}
      className="fixed inset-0 z-40 flex flex-col bg-background/98 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          閱讀模式 · Reading
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
          aria-label="收起（Esc）"
        >
          <Minimize2 size={14} />
          收起 · Esc
        </button>
      </div>
      <div className="nb-scroll flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <ArticleBody
            html={path.fullArticleHtml}
            validTargets={validTargets}
            onNavigate={onNavigateNode}
            className="text-[1.02rem]"
          />
        </div>
      </div>
    </div>
  )
}

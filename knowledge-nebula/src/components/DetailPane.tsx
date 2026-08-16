import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  BookOpen,
  Check,
  Circle,
  Maximize2,
  X,
} from "lucide-react"
import type { ConceptNode, PathNode, Subject } from "@/types"
import { STATUS_LABEL, STATUS_LABEL_EN, isAutoCharted } from "@/lib/colors"
import { ArticleBody } from "./ArticleBody"
import { FullRead } from "./FullRead"

type Frame =
  | { kind: "path"; id: string }
  | { kind: "node"; id: string }

interface DetailPaneProps {
  subject: Subject
  rootPathId: string
  manuallyComplete: boolean
  onClose: () => void
  onToggleComplete: (pathId: string) => void
}

export function DetailPane({
  subject,
  rootPathId,
  manuallyComplete,
  onClose,
  onToggleComplete,
}: DetailPaneProps) {
  const [stack, setStack] = useState<Frame[]>([{ kind: "path", id: rootPathId }])
  const [fullRead, setFullRead] = useState(false)

  // reset the stack whenever the root selection changes
  useEffect(() => {
    setStack([{ kind: "path", id: rootPathId }])
    setFullRead(false)
  }, [rootPathId])

  const pathById = useMemo(
    () => new Map(subject.paths.map((p) => [p.id, p])),
    [subject],
  )
  const nodeById = useMemo(
    () => new Map(subject.nodes.map((n) => [n.id, n])),
    [subject],
  )
  const validTargets = useMemo(
    () => new Set(subject.nodes.map((n) => n.id)),
    [subject],
  )

  const top = stack[stack.length - 1]

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  }, [])

  const pushNode = useCallback((nodeId: string) => {
    setStack((s) => [...s, { kind: "node", id: nodeId }])
  }, [])

  const pushPath = useCallback((pathId: string) => {
    setStack((s) => [...s, { kind: "path", id: pathId }])
  }, [])

  // Escape steps back, then closes; also closes full-read first
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (fullRead) {
        setFullRead(false)
        return
      }
      setStack((s) => {
        if (s.length > 1) return s.slice(0, -1)
        onClose()
        return s
      })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [fullRead, onClose])

  const currentPath: PathNode | undefined =
    top.kind === "path" ? pathById.get(top.id) : undefined
  const currentNode: ConceptNode | undefined =
    top.kind === "node" ? nodeById.get(top.id) : undefined

  return (
    <aside
      role="dialog"
      aria-label="課程詳情"
      className="nb-pane-in absolute right-0 top-0 z-20 flex h-full w-full max-w-[440px] flex-col border-l border-border bg-surface/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
    >
      {/* breadcrumb / actions */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          {stack.length > 1 && (
            <button
              onClick={back}
              className="mr-1 flex items-center gap-1 rounded-md px-1.5 py-1 text-foreground transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
              aria-label="返回"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <Breadcrumb
            stack={stack}
            pathById={pathById}
            nodeById={nodeById}
            onJump={(i) => setStack((s) => s.slice(0, i + 1))}
          />
        </div>
        <div className="flex items-center gap-1">
          {currentPath && (
            <button
              onClick={() => setFullRead(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
              aria-label="全螢幕閱讀"
            >
              <Maximize2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
            aria-label="關閉"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="nb-scroll flex-1 overflow-y-auto px-5 py-5">
        {currentPath && (
          <PathView
            path={currentPath}
            subject={subject}
            manuallyComplete={manuallyComplete}
            validTargets={validTargets}
            onNavigateNode={pushNode}
            onToggleComplete={onToggleComplete}
          />
        )}
        {currentNode && (
          <NodeView
            node={currentNode}
            subject={subject}
            validTargets={validTargets}
            onNavigateNode={pushNode}
            onNavigatePath={pushPath}
          />
        )}
      </div>

      {fullRead && currentPath && (
        <FullRead
          path={currentPath}
          validTargets={validTargets}
          onNavigateNode={(id) => {
            setFullRead(false)
            pushNode(id)
          }}
          onClose={() => setFullRead(false)}
        />
      )}
    </aside>
  )
}

function Breadcrumb({
  stack,
  pathById,
  nodeById,
  onJump,
}: {
  stack: Frame[]
  pathById: Map<string, PathNode>
  nodeById: Map<string, ConceptNode>
  onJump: (index: number) => void
}) {
  return (
    <nav className="flex min-w-0 items-center gap-1 truncate">
      {stack.map((f, i) => {
        const title =
          f.kind === "path"
            ? (pathById.get(f.id)?.title ?? f.id)
            : (nodeById.get(f.id)?.title ?? f.id)
        const isLast = i === stack.length - 1
        return (
          <span key={`${f.kind}-${f.id}-${i}`} className="flex items-center gap-1 truncate">
            {i > 0 && <span className="text-border">/</span>}
            <button
              onClick={() => onJump(i)}
              disabled={isLast}
              className={`max-w-[130px] truncate rounded px-1 py-0.5 ${
                isLast
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon`}
            >
              {title}
            </button>
          </span>
        )
      })}
    </nav>
  )
}

function PathView({
  path,
  subject,
  manuallyComplete,
  validTargets,
  onNavigateNode,
  onToggleComplete,
}: {
  path: PathNode
  subject: Subject
  manuallyComplete: boolean
  validTargets: Set<string>
  onNavigateNode: (id: string) => void
  onToggleComplete: (pathId: string) => void
}) {
  const auto = isAutoCharted(path.status)
  const nodeTitle = (id: string) =>
    subject.nodes.find((n) => n.id === id)?.title ?? id

  return (
    <div>
      <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        {STATUS_LABEL_EN[path.status]}
      </div>
      <h2 className="font-serif text-3xl leading-tight text-foreground">
        {path.title}
      </h2>

      <div className="mt-4 rounded-lg border border-border bg-surface-2/60 p-3.5">
        <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-brass">
          學習目標 · Goal
        </div>
        <p className="text-sm leading-relaxed text-foreground">{path.goal}</p>
      </div>

      {/* progress control */}
      <div className="mt-4">
        {auto ? (
          <div className="flex items-center gap-2 rounded-lg border border-brass-dim/50 bg-brass/10 px-3 py-2 text-sm text-brass">
            <Check size={16} />
            自動標記完成（{STATUS_LABEL[path.status]}）
          </div>
        ) : (
          <button
            onClick={() => onToggleComplete(path.id)}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon ${
              manuallyComplete
                ? "border-brass-dim/60 bg-brass/10 text-brass"
                : "border-border bg-surface-2 text-muted hover:text-foreground"
            }`}
          >
            {manuallyComplete ? <Check size={16} /> : <Circle size={16} />}
            {manuallyComplete ? "已手動標記完成" : "標記為完成"}
          </button>
        )}
      </div>

      <div className="my-5 h-px bg-border" />

      <div className="mb-2 flex items-center gap-2 text-muted">
        <BookOpen size={15} />
        <span className="font-mono text-[11px] uppercase tracking-wider">
          課文 · Lesson
        </span>
      </div>
      <ArticleBody
        html={path.articleHtml}
        validTargets={validTargets}
        onNavigate={onNavigateNode}
      />

      {path.taughtNodeIds.length > 0 && (
        <ChipSection
          title="教授概念 · Teaches"
          ids={path.taughtNodeIds}
          label={nodeTitle}
          accent="brass"
          onClick={onNavigateNode}
        />
      )}
      {path.relatedNodeIds.length > 0 && (
        <ChipSection
          title="相關概念 · Related"
          ids={path.relatedNodeIds}
          label={nodeTitle}
          accent="beacon"
          onClick={onNavigateNode}
        />
      )}

      {path.sources.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
            來源 · Sources
          </div>
          <ul className="flex flex-col gap-1.5">
            {path.sources.map((s, i) => (
              <li key={i} className="text-sm">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-beacon underline underline-offset-2 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                ) : (
                  <span className="text-muted">{s.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function NodeView({
  node,
  subject,
  validTargets,
  onNavigateNode,
  onNavigatePath,
}: {
  node: ConceptNode
  subject: Subject
  validTargets: Set<string>
  onNavigateNode: (id: string) => void
  onNavigatePath: (id: string) => void
}) {
  const taughtBy = subject.paths.filter((p) => p.taughtNodeIds.includes(node.id))
  const nodeTitle = (id: string) =>
    subject.nodes.find((n) => n.id === id)?.title ?? id

  return (
    <div>
      <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.15em] text-brass">
        概念 · Concept
      </div>
      <h2 className="font-serif text-3xl leading-tight text-foreground">
        {node.title}
      </h2>

      <div className="mt-4">
        <ArticleBody
          html={node.bodyHtml}
          validTargets={validTargets}
          onNavigate={onNavigateNode}
        />
      </div>

      {taughtBy.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
            由此教授 · Taught by
          </div>
          <div className="flex flex-wrap gap-2">
            {taughtBy.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigatePath(p.id)}
                className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-foreground transition-colors hover:border-beacon-dim focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {node.relatedNodeIds.length > 0 && (
        <ChipSection
          title="相關概念 · Related"
          ids={node.relatedNodeIds}
          label={nodeTitle}
          accent="brass"
          onClick={onNavigateNode}
        />
      )}
    </div>
  )
}

function ChipSection({
  title,
  ids,
  label,
  accent,
  onClick,
}: {
  title: string
  ids: string[]
  label: (id: string) => string
  accent: "brass" | "beacon"
  onClick: (id: string) => void
}) {
  const ring = accent === "brass" ? "hover:border-brass-dim" : "hover:border-beacon-dim"
  return (
    <div className="mt-6">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => (
          <button
            key={id}
            onClick={() => onClick(id)}
            className={`rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-beacon ${ring}`}
          >
            {label(id)}
          </button>
        ))}
      </div>
    </div>
  )
}

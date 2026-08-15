import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { isWritten, statusLabel } from "../lib/colors";
import { button } from "../lib/buttonVariants";
import { cn } from "../lib/cn";
import type { TierBossState } from "../lib/selectors";
import type { SubjectGraph, View } from "../lib/types";
import { Check } from "./icons/Check";
import { ChevronLeft } from "./icons/ChevronLeft";
import { Crown } from "./icons/Crown";
import { Expand } from "./icons/Expand";
import { Lock } from "./icons/Lock";
import { X } from "./icons/X";
import { CompletionToggle } from "./CompletionToggle";

function stripLeadingH1(html: string): string {
  return html.replace(/^<h1>[\s\S]*?<\/h1>\s*/, "");
}

function parseWikilinkTarget(
  target: string,
): { subject: string; kind: "node" | "path"; id: string } | null {
  const m = target.match(/^learn\/([^/]+)\/(nodes|paths)\/([^#/]+)/);
  if (!m) return null;
  return { subject: m[1], kind: m[2] === "nodes" ? "node" : "path", id: m[3] };
}

interface DetailPaneProps {
  graph: SubjectGraph;
  root: View;
  manualCompleted: Set<string>;
  manualNodes: Set<string>;
  bossStates: Map<number, TierBossState>;
  onToggleComplete: (id: string) => void;
  onToggleNode: (id: string) => void;
  onUnlockTier: (tier: number) => void;
  onClose: () => void;
}

export function DetailPane({
  graph,
  root,
  manualCompleted,
  manualNodes,
  bossStates,
  onToggleComplete,
  onToggleNode,
  onUnlockTier,
  onClose,
}: DetailPaneProps) {
  const pathById = useMemo(() => new Map(graph.paths.map((p) => [p.id, p])), [graph]);

  const [stack, setStack] = useState<View[]>([root]);
  const [dir, setDir] = useState<"forward" | "back">("forward");
  const [fullRead, setFullRead] = useState(false);

  // A new selection from the map replaces the whole navigation stack. The
  // state is adjusted during render so the committed frame never flashes the
  // previous stack top.
  const rootKey = `${root.kind}:${root.id}`;
  const prevRootKeyRef = useRef(rootKey);
  if (rootKey !== prevRootKeyRef.current) {
    prevRootKeyRef.current = rootKey;
    setStack([root]);
    setDir("forward");
    setFullRead(false);
  }

  // Until the stack is seeded (which happens before the first commit), the
  // current view falls back to the incoming root.
  const current = stack.length > 0 ? stack[stack.length - 1] : root;
  const currentPath = current.kind === "path" ? (pathById.get(current.id) ?? null) : null;
  const currentNode = current.kind === "node" ? (graph.nodes[current.id] ?? null) : null;
  const titleFor = (v: View): string =>
    v.kind === "path"
      ? (pathById.get(v.id)?.title ?? v.id)
      : (graph.nodes[v.id]?.title ?? v.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (fullRead) {
        setFullRead(false);
        return;
      }
      if (stack.length > 1) {
        setDir("back");
        setStack(stack.slice(0, -1));
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullRead, stack, onClose]);

  function push(view: View) {
    if (view.kind === current.kind && view.id === current.id) return;
    setDir("forward");
    setStack((s) => [...s, view]);
  }

  function back() {
    if (stack.length <= 1) return;
    setDir("back");
    setStack((s) => s.slice(0, -1));
  }

  function jumpTo(index: number) {
    if (index === stack.length - 1) return;
    setDir(index < stack.length - 1 ? "back" : "forward");
    setStack((s) => s.slice(0, index + 1));
  }

  function handleContentClick(e: React.MouseEvent) {
    const anchor = (e.target as HTMLElement).closest("a.wikilink");
    if (!anchor) return;
    const target = anchor.getAttribute("data-target");
    if (!target) return;
    const parsed = parseWikilinkTarget(target);
    if (!parsed || parsed.subject !== graph.subject) return;
    push(
      parsed.kind === "node"
        ? { kind: "node", id: parsed.id }
        : { kind: "path", id: parsed.id },
    );
  }

  function handleToggleComplete() {
    if (!currentPath) return;
    const wasActive = manualCompleted.has(currentPath.id);
    onToggleComplete(currentPath.id);
    if (wasActive) {
      toast("已取消標記完成", { description: currentPath.title });
    } else {
      toast.success("已標記完成", { description: currentPath.title });
    }
  }

  function handleToggleNode() {
    if (!currentNode) return;
    const wasActive = manualNodes.has(currentNode.id);
    onToggleNode(currentNode.id);
    if (wasActive) {
      toast("已取消標記 node", { description: currentNode.title });
    } else {
      toast.success("node 已學", { description: currentNode.title });
    }
  }

  function handleUnlockTier() {
    if (!currentPath) return;
    onUnlockTier(currentPath.tier);
    toast.success(`已解鎖 Tier ${currentPath.tier}`);
  }

  const paneClass = cn(
    "absolute z-10 flex flex-col overflow-hidden rounded-none border-border bg-surface/85 backdrop-blur-sm",
    fullRead
      ? "inset-0 w-auto max-w-none border-0 bg-surface/95"
      : "inset-y-0 right-0 w-[26rem] max-w-[85%] border-l",
  );

  const orderBadge = current.kind === "path" ? currentPath?.order : `T${currentNode?.tier ?? "?"}`;

  return (
    <aside aria-label={`${titleFor(current)} 詳情`} className={paneClass}>
      {fullRead && (currentPath || currentNode) ? (
        <header className="flex shrink-0 items-center gap-1.5 border-b border-border px-3 py-2">
          <button
            type="button"
            onClick={() => setFullRead(false)}
            aria-label="返回面板"
            title="返回面板 (Esc)"
            className={button({ variant: "ghost", size: "icon" })}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-0 flex-1 truncate font-display text-base" title={titleFor(current)}>
            {titleFor(current)}
          </span>
          <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-faint">
            {orderBadge}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉面板"
            title="關閉"
            className={button({ variant: "ghost", size: "icon" })}
          >
            <X size={16} />
          </button>
        </header>
      ) : (
        <header className="flex shrink-0 flex-col gap-1.5 border-b border-border px-3 py-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={back}
              disabled={stack.length <= 1}
              aria-label="返回"
              title="返回 (上一層)"
              className={button({ variant: "ghost", size: "icon" })}
            >
              <ChevronLeft size={16} />
            </button>
            <nav
              aria-label="所在位置"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap font-mono text-[0.65rem] text-faint"
            >
              {stack.map((v, i) => (
                <span key={`${v.kind}:${v.id}`} className="flex min-w-0 items-center gap-1">
                  {i > 0 ? <span className="shrink-0 text-border">/</span> : null}
                  {i === stack.length - 1 ? (
                    <span className="truncate text-foreground">{titleFor(v)}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      title={titleFor(v)}
                      className="truncate underline-offset-2 transition-colors hover:text-brass hover:underline"
                    >
                      {titleFor(v)}
                    </button>
                  )}
                </span>
              ))}
            </nav>
            {current.kind === "path" && currentPath ? (
              <button
                type="button"
                onClick={() => setFullRead(true)}
                aria-label="整篇閱讀"
                title="整篇閱讀"
                className={cn(button({ variant: "outline", size: "sm" }), "h-7 px-2 border-steel/40")}
              >
                <Expand size={14} />
                整篇閱讀
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉面板 (Esc)"
              title="關閉 (Esc)"
              className={button({ variant: "ghost", size: "icon" })}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-faint">
              {orderBadge}
            </span>
            <span className="min-w-0 flex-1 truncate font-display text-base" title={titleFor(current)}>
              {titleFor(current)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[0.7rem] text-faint">
            {current.kind === "path" && currentPath ? (
              <>
                <span className="font-mono">{statusLabel(currentPath.status)}</span>
                {currentPath.duration ? (
                  <>
                    <span className="text-border">/</span>
                    <span className="font-mono">{currentPath.duration}</span>
                  </>
                ) : null}
              </>
            ) : (
              <span className="font-mono">node</span>
            )}
          </div>
        </header>
      )}

      <div className="relative min-h-0 flex-1">
        <div key={`${current.kind}:${current.id}`}>
          <div
            className={cn(
              "pane-view absolute inset-0 overflow-y-auto px-3 py-3",
              dir === "forward" ? "pane-forward" : "pane-back",
              fullRead ? "pointer-events-none invisible" : "",
            )}
            role="presentation"
            onClick={handleContentClick}
          >
            {current.kind === "path" && currentPath ? (
              <>
                <section className="mb-4 flex flex-col gap-1">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>學習目標
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90">{currentPath.goal}</p>
                </section>

                {!isWritten(currentPath.status) && bossStates.get(currentPath.tier) !== "locked" ? (
                  <section className="mb-4">
                    <CompletionToggle
                      active={manualCompleted.has(currentPath.id)}
                      onClick={handleToggleComplete}
                      activeLabel="已手動標記完成"
                      idleLabel="標記為完成"
                    />
                  </section>
                ) : !isWritten(currentPath.status) ? (
                  <section className="mb-4">
                    <div className="flex w-full items-center gap-2 rounded-md border border-steel/40 bg-surface-2/50 px-3 py-2 font-mono text-xs text-muted">
                      <Lock size={14} className="shrink-0" />
                      <span>此 tier 尚未解鎖：完成上一層的頭目戰後才能標記完成。內容仍可閱讀。</span>
                    </div>
                  </section>
                ) : null}

                {bossStates.get(currentPath.tier) === "ready" ? (
                  <section className="mb-4">
                    <button
                      type="button"
                      onClick={handleUnlockTier}
                      title="通過 /quiz 驗證後按下此鍵解鎖本層與下一層"
                      className={button({ variant: "brass", size: "md" })}
                    >
                      <Crown size={14} />
                      頭目戰 · 解鎖此層
                    </button>
                  </section>
                ) : null}

                {currentPath.hasPrepare && currentPath.prepareHtml ? (
                  <section className="mb-4 flex flex-col gap-1">
                    <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                      <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>預習 · 讀文章前
                    </h3>
                    <div
                      className="prose-sm"
                      dangerouslySetInnerHTML={{ __html: stripLeadingH1(currentPath.prepareHtml) }}
                    />
                  </section>
                ) : null}

                {currentPath.contentHtml ? (
                  <section className="mb-4">
                    <div
                      className="prose-sm"
                      dangerouslySetInnerHTML={{ __html: stripLeadingH1(currentPath.contentHtml) }}
                    />
                  </section>
                ) : null}

                <section className="mb-4 flex flex-col gap-1.5">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>教的 node · {currentPath.taughtNodeIds.length}
                  </h3>
                  {currentPath.taughtNodeIds.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {currentPath.taughtNodeIds.map((id) => {
                        const node = graph.nodes[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => push({ kind: "node", id })}
                            className="chip"
                            title={node?.title ?? id}
                          >
                            {manualNodes.has(id) ? (
                              <Check size={12} className="mr-1 shrink-0 text-brass" aria-hidden="true" />
                            ) : null}
                            {node?.title ?? id}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">尚未撰寫 node。</p>
                  )}
                </section>

                <section className="mb-4 flex flex-col gap-1.5">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>關聯 node · {currentPath.relatedNodeIds.length}
                  </h3>
                  {currentPath.relatedNodeIds.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {currentPath.relatedNodeIds.map((id) => {
                        const node = graph.nodes[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => push({ kind: "node", id })}
                            className="chip"
                            title={node?.title ?? id}
                          >
                            {manualNodes.has(id) ? (
                              <Check size={12} className="mr-1 shrink-0 text-brass" aria-hidden="true" />
                            ) : null}
                            {node?.title ?? id}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">無關聯 node。</p>
                  )}
                </section>

                <section className="flex flex-col gap-1">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>Sources
                  </h3>
                  {currentPath.sources.length ? (
                    <ul className="flex flex-col gap-0.5">
                      {currentPath.sources.map((s) => (
                        <li key={s} className="truncate font-mono text-[0.65rem] text-muted-foreground" title={s}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">無來源。</p>
                  )}
                </section>
              </>
            ) : currentNode ? (
              <div>
                <section className="mb-4">
                  <CompletionToggle
                    active={manualNodes.has(currentNode.id)}
                    onClick={handleToggleNode}
                    activeLabel="已標記 node 完成"
                    idleLabel="標記 node 完成"
                  />
                </section>
                <div
                  className="prose-sm"
                  dangerouslySetInnerHTML={{ __html: stripLeadingH1(currentNode.bodyHtml) }}
                />
                {currentNode.taughtBy.length > 0 ? (
                  <section className="mt-5 flex flex-col gap-1.5">
                    <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                      <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>教的 path · {currentNode.taughtBy.length}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {currentNode.taughtBy.map((pid) => {
                        const p = pathById.get(pid);
                        return (
                          <button
                            key={pid}
                            type="button"
                            onClick={() => push({ kind: "path", id: pid })}
                            className="chip"
                            title={p?.title ?? pid}
                          >
                            {p?.title ?? pid}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">找不到此內容。</p>
            )}
          </div>
        </div>

        {fullRead && (currentPath || currentNode) ? (
          <div
            className="pane-view pane-fade absolute inset-0 overflow-y-auto px-6 py-8"
            role="presentation"
            onClick={handleContentClick}
          >
            <article className="prose mx-auto max-w-[42rem]">
              {current.kind === "path" && currentPath ? (
                <div dangerouslySetInnerHTML={{ __html: currentPath.fullArticleHtml }} />
              ) : currentNode ? (
                <div dangerouslySetInnerHTML={{ __html: currentNode.bodyHtml }} />
              ) : null}
            </article>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

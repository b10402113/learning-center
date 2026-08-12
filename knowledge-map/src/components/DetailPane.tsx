import { Check, ChevronLeft, Circle, Crown, Expand, Lock, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { isWritten, statusLabel } from "../lib/colors";
import type { TierBossState } from "../lib/selectors";
import type { PathNode, SubjectGraph } from "../lib/types";
type View = { kind: "path"; id: string } | { kind: "node"; id: string };

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

interface Props {
  graph: SubjectGraph;
  path: PathNode;
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
  path,
  manualCompleted,
  manualNodes,
  bossStates,
  onToggleComplete,
  onToggleNode,
  onUnlockTier,
  onClose,
}: Props) {
  const pathById = useMemo(() => new Map(graph.paths.map((p) => [p.id, p])), [graph]);
  const [stack, setStack] = useState<View[]>([{ kind: "path", id: path.id }]);
  const [dir, setDir] = useState<"forward" | "back">("forward");
  const [fullRead, setFullRead] = useState(false);
  const current = stack[stack.length - 1];
  const currentPath = current.kind === "path" ? pathById.get(current.id) : null;
  const currentNode = current.kind === "node" ? graph.nodes[current.id] : null;
  const titleFor = (v: View): string =>
    v.kind === "path" ? pathById.get(v.id)?.title ?? v.id : graph.nodes[v.id]?.title ?? v.id;

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
        setStack((s) => s.slice(0, -1));
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stack.length, onClose, fullRead]);

  const push = (view: View) => {
    if (view.kind === current.kind && view.id === current.id) return;
    setDir("forward");
    setStack((s) => [...s, view]);
  };

  const back = () => {
    if (stack.length <= 1) return;
    setDir("back");
    setStack((s) => s.slice(0, -1));
  };

  const jumpTo = (index: number) => {
    if (index === stack.length - 1) return;
    setDir(index < stack.length - 1 ? "back" : "forward");
    setStack((s) => s.slice(0, index + 1));
  };

  const handleContentClick = (e: React.MouseEvent<HTMLElement>) => {
    const anchor = (e.target as HTMLElement).closest("a.wikilink");
    if (!anchor) return;
    const target = anchor.getAttribute("data-target");
    if (!target) return;
    const parsed = parseWikilinkTarget(target);
    if (!parsed || parsed.subject !== graph.subject) return;
    push(parsed.kind === "node" ? { kind: "node", id: parsed.id } : { kind: "path", id: parsed.id });
  };

  return (
    <aside
      role="complementary"
      aria-label={`${titleFor(current)} 詳情`}
      className={`absolute z-10 flex flex-col overflow-hidden rounded-none border-border bg-surface/85 backdrop-blur-sm ${
        fullRead
          ? "inset-0 w-auto max-w-none border-0 bg-surface/95"
          : "inset-y-0 right-0 w-[26rem] max-w-[85%] border-l"
      }`}
    >
      {fullRead && (currentPath || currentNode) ? (
        <header className="flex shrink-0 items-center gap-1.5 border-b border-border px-3 py-2">
          <button
            type="button"
            onClick={() => setFullRead(false)}
            aria-label="返回面板"
            title="返回面板 (Esc)"
            className="grid size-7 shrink-0 place-items-center rounded-sm text-faint transition-colors hover:bg-secondary hover:text-brass"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-0 flex-1 truncate font-display text-base" title={titleFor(current)}>
            {titleFor(current)}
          </span>
          <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-faint">
            {current.kind === "path" ? currentPath?.order : `T${currentNode?.tier ?? "?"}`}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉面板"
            title="關閉"
            className="grid size-7 shrink-0 place-items-center rounded-sm text-faint transition-colors hover:bg-secondary hover:text-brass"
          >
            <X className="size-4" />
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
              className="grid size-7 shrink-0 place-items-center rounded-sm text-faint transition-colors hover:bg-secondary hover:text-brass disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <nav
              aria-label="所在位置"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap font-mono text-[0.65rem] text-faint"
            >
              {stack.map((v, i) => (
                <span key={`${v.kind}:${v.id}`} className="flex min-w-0 items-center gap-1">
                  {i > 0 && <span className="shrink-0 text-border">/</span>}
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
            {current.kind === "path" && currentPath && (
              <button
                type="button"
                onClick={() => setFullRead(true)}
                aria-label="整篇閱讀"
                title="整篇閱讀"
                className="flex h-7 shrink-0 items-center gap-1 rounded-sm border border-steel/40 px-2 font-mono text-[0.65rem] text-faint transition-colors hover:border-brass hover:text-brass"
              >
                <Expand className="size-3.5" />
                整篇閱讀
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉面板 (Esc)"
              title="關閉 (Esc)"
              className="grid size-7 shrink-0 place-items-center rounded-sm text-faint transition-colors hover:bg-secondary hover:text-brass"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {current.kind === "path" && currentPath ? (
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-faint">
                {currentPath.order}
              </span>
            ) : (
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-faint">
                T{currentNode?.tier ?? "?"}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate font-display text-base" title={titleFor(current)}>
              {titleFor(current)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[0.7rem] text-faint">
            {current.kind === "path" && currentPath ? (
              <>
                <span className="font-mono">{statusLabel(currentPath.status)}</span>
                {currentPath.duration && (
                  <>
                    <span className="text-border">/</span>
                    <span className="font-mono">{currentPath.duration}</span>
                  </>
                )}
              </>
            ) : (
              <span className="font-mono">node</span>
            )}
          </div>
        </header>
      )}

      <div className="relative min-h-0 flex-1">
        <div
          key={`${current.kind}:${current.id}`}
          className={`pane-view absolute inset-0 overflow-y-auto px-3 py-3 ${
            dir === "forward" ? "pane-forward" : "pane-back"
          } ${fullRead ? "pointer-events-none invisible" : ""}`}
        >
          {current.kind === "path" && currentPath ? (
            <>
              {currentPath.goal && (
                <section className="mb-4 flex flex-col gap-1">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint"><span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden />學習目標</h3>
                  <p className="text-sm leading-relaxed text-foreground/90">{currentPath.goal}</p>
                </section>
              )}

              {!isWritten(currentPath.status) &&
                (bossStates.get(currentPath.tier) !== "locked" ? (
                  <section className="mb-4">
                    <CompletionToggle
                      active={manualCompleted.has(currentPath.id)}
                      onClick={() => onToggleComplete(currentPath.id)}
                      activeLabel="已手動標記完成"
                      idleLabel="標記為完成"
                    />
                  </section>
                ) : (
                  <section className="mb-4">
                    <div className="flex w-full items-center gap-2 rounded-md border border-steel/40 bg-surface-2/50 px-3 py-2 font-mono text-xs text-muted">
                      <Lock className="size-3.5 shrink-0" />
                      <span>
                        此 tier 尚未解鎖：完成上一層的頭目戰後才能標記完成。內容仍可閱讀。
                      </span>
                    </div>
                  </section>
                ))}

              {bossStates.get(currentPath.tier) === "ready" && (
                <section className="mb-4">
                  <button
                    type="button"
                    onClick={() => onUnlockTier(currentPath.tier)}
                    title="通過 /quiz 驗證後按下此鍵解鎖本層與下一層"
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-brass-dim/70 bg-brass/10 px-3 py-2 font-mono text-xs text-brass transition-colors hover:bg-brass/20 focus-visible:ring-2 focus-visible:ring-beacon"
                  >
                    <Crown className="size-3.5" />
                    頭目戰 · 解鎖此層
                  </button>
                </section>
              )}

              {currentPath.contentHtml && (
                <section className="mb-4" onClick={handleContentClick}>
                  <div
                    className="prose-sm"
                    dangerouslySetInnerHTML={{ __html: stripLeadingH1(currentPath.contentHtml) }}
                  />
                </section>
              )}

              <section className="mb-4 flex flex-col gap-1.5">
                <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint"><span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden />教的 node · {currentPath.taughtNodeIds.length}</h3>
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
                          {manualNodes.has(id) && (
                            <Check className="mr-1 size-3 shrink-0 text-brass" aria-hidden />
                          )}
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
                <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint"><span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden />關聯 node · {currentPath.relatedNodeIds.length}</h3>
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
                          {manualNodes.has(id) && (
                            <Check className="mr-1 size-3 shrink-0 text-brass" aria-hidden />
                          )}
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
                <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint"><span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden />Sources</h3>
                {currentPath.sources.length ? (
                  <ul className="flex flex-col gap-0.5">
                    {currentPath.sources.map((s, i) => (
                      <li
                        key={i}
                        className="truncate font-mono text-[0.65rem] text-muted-foreground"
                        title={s}
                      >
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
            <div onClick={handleContentClick}>
              <section className="mb-4">
                <CompletionToggle
                  active={manualNodes.has(currentNode.id)}
                  onClick={() => onToggleNode(currentNode.id)}
                  activeLabel="已標記 node 完成"
                  idleLabel="標記 node 完成"
                />
              </section>
              <div
                className="prose-sm"
                dangerouslySetInnerHTML={{ __html: stripLeadingH1(currentNode.bodyHtml) }}
              />
              {currentNode.taughtBy.length > 0 && (
                <section className="mt-5 flex flex-col gap-1.5">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint"><span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden />教的 path · {currentNode.taughtBy.length}</h3>
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
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">找不到此內容。</p>
          )}
        </div>
        {fullRead && (currentPath || currentNode) && (
          <div
            className="pane-view pane-fade absolute inset-0 overflow-y-auto px-6 py-8"
            onClick={handleContentClick}
          >
            <article className="prose mx-auto max-w-[42rem]">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    current.kind === "path" && currentPath
                      ? currentPath.fullArticleHtml
                      : currentNode?.bodyHtml ?? "",
                }}
              />
            </article>
          </div>
        )}
      </div>
    </aside>
  );
}

function CompletionToggle({
  active,
  onClick,
  activeLabel,
  idleLabel,
}: {
  active: boolean;
  onClick: () => void;
  activeLabel: string;
  idleLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-beacon ${
        active
          ? "border-brass-dim/60 bg-brass/10 text-brass"
          : "border-input text-faint hover:border-brass hover:text-brass"
      }`}
    >
      {active ? <Check className="size-3.5" /> : <Circle className="size-3.5" />}
      {active ? activeLabel : idleLabel}
    </button>
  );
}

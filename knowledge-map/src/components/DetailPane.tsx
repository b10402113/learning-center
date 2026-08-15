import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { statusLabel } from "../lib/colors";
import { button } from "../lib/buttonVariants";
import { cn } from "../lib/cn";
import { isNodeComplete, nodeItems } from "../lib/completion";
import { elementMdxComponents, nodeMdxComponents } from "../lib/mdxComponents";
import { getElementMdx, getNodeMdx } from "../lib/mdxRegistry";
import type { SubjectGraph, View } from "../lib/types";
import { Check } from "./icons/Check";
import { ChevronLeft } from "./icons/ChevronLeft";
import { Circle } from "./icons/Circle";
import { Expand } from "./icons/Expand";
import { X } from "./icons/X";
import { ElementMdxView } from "./ElementMdxView";

function parseWikilinkTarget(
  target: string,
): { subject: string; kind: "element" | "node"; id: string } | null {
  const m = target.match(/^learn\/([^/]+)\/(elements|nodes)\/([^#/]+)/);
  if (!m) return null;
  return { subject: m[1], kind: m[2] === "elements" ? "element" : "node", id: m[3] };
}

interface DetailPaneProps {
  graph: SubjectGraph;
  root: View;
  manualElements: Set<string>;
  quizSolved: Set<string>;
  onQuizSolved: (elementId: string) => void;
  onToggleCompletion: (id: string) => void;
  onClose: () => void;
}

// The pane's `components` map: wikilinks as in-app nav or source refs, and the
// `h1` hidden so the narrow article does not duplicate the header title.
const MDX_PANE_COMPONENTS = { ...nodeMdxComponents, h1: () => null };

export function DetailPane({
  graph,
  root,
  manualElements,
  quizSolved,
  onQuizSolved,
  onToggleCompletion,
  onClose,
}: DetailPaneProps) {
  const nodeById = useMemo(() => new Map(graph.nodes.map((p) => [p.id, p])), [graph]);

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
  const currentNode = current.kind === "node" ? (nodeById.get(current.id) ?? null) : null;
  const currentElement = current.kind === "element" ? (graph.elements[current.id] ?? null) : null;
  const titleFor = (v: View): string =>
    v.kind === "node"
      ? (nodeById.get(v.id)?.title ?? v.id)
      : (graph.elements[v.id]?.title ?? v.id);

  // Node completion is derived from the checklist: taught elements + main row.
  const nodeChecklist = useMemo(
    () => (currentNode ? nodeItems(currentNode) : []),
    [currentNode],
  );
  const nodeComplete = useMemo(
    () => (currentNode ? isNodeComplete(currentNode, manualElements) : false),
    [currentNode, manualElements],
  );
  const checkedCount = useMemo(
    () => nodeChecklist.filter((item) => manualElements.has(item.id)).length,
    [nodeChecklist, manualElements],
  );

  // The compiled MDX article for the current node / element, if any.
  const NodeMdx = currentNode ? getNodeMdx(graph.subject, currentNode.id) : null;
  const ElementMdx = currentElement ? getElementMdx(graph.subject, currentElement.id) : null;

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
      parsed.kind === "element"
        ? { kind: "element", id: parsed.id }
        : { kind: "node", id: parsed.id },
    );
  }

  function handleToggleElement() {
    if (!currentElement) return;
    const wasActive = manualElements.has(currentElement.id);
    onToggleCompletion(currentElement.id);
    if (wasActive) {
      toast("已取消標記元素", { description: currentElement.title });
    } else {
      toast.success("元素已學", { description: currentElement.title });
    }
  }

  function markQuizSolved() {
    if (!currentElement) return;
    onQuizSolved(currentElement.id);
  }

  const paneClass = cn(
    "absolute z-10 flex flex-col overflow-hidden rounded-none border-border bg-surface/85 backdrop-blur-sm",
    fullRead
      ? "inset-0 w-auto max-w-none border-0 bg-surface/95"
      : "inset-y-0 right-0 w-[26rem] max-w-[85%] border-l",
  );

  const orderBadge = current.kind === "node" ? currentNode?.order : `T${currentElement?.tier ?? "?"}`;

  return (
    <aside aria-label={`${titleFor(current)} 詳情`} className={paneClass}>
      {fullRead && (currentNode || currentElement) ? (
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
            {current.kind === "node" && currentNode ? (
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
            {current.kind === "node" && currentNode ? (
              <>
                <span className="font-mono">{statusLabel(currentNode.status)}</span>
                {currentNode.duration ? (
                  <>
                    <span className="text-border">/</span>
                    <span className="font-mono">{currentNode.duration}</span>
                  </>
                ) : null}
              </>
            ) : currentElement ? (
              <>
                <span className="font-mono">{currentElement.type}</span>
                {currentElement.type === "video" && currentElement.videoUrl ? (
                  <>
                    <span className="text-border">/</span>
                    <span className="font-mono">video</span>
                  </>
                ) : null}
              </>
            ) : null}
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
            {current.kind === "node" && currentNode ? (
              <>
                <section className="mb-4 flex flex-col gap-1">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>學習目標
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90">{currentNode.goal}</p>
                </section>

                <section className="mb-4">
                  <div
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 font-mono text-xs",
                      nodeComplete
                        ? "border-brass-dim/60 bg-brass/10 text-brass"
                        : "border-input text-faint",
                    )}
                  >
                    {nodeComplete ? <Check size={14} /> : <Circle size={14} />}
                    {nodeComplete
                      ? "檢查清單已全數完成"
                      : `已完成 ${checkedCount} / ${nodeChecklist.length} 項`}
                  </div>
                </section>

                {NodeMdx ? (
                  <section className="mb-4 prose-sm">
                    <NodeMdx components={MDX_PANE_COMPONENTS} />
                  </section>
                ) : (
                  <p className="text-xs text-muted-foreground">找不到此內容。</p>
                )}

                <section className="mb-4 flex flex-col gap-1.5">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>教的元素 · {currentNode.taughtElementIds.length}
                  </h3>
                  {currentNode.taughtElementIds.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {currentNode.taughtElementIds.map((id) => {
                        const element = graph.elements[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => push({ kind: "element", id })}
                            className="chip"
                            title={element?.title ?? id}
                          >
                            {manualElements.has(id) ? (
                              <Check size={12} className="mr-1 shrink-0 text-brass" aria-hidden="true" />
                            ) : null}
                            {element?.title ?? id}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">尚未撰寫元素。</p>
                  )}
                </section>

                <section className="mb-4 flex flex-col gap-1.5">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>關聯元素 · {currentNode.relatedElementIds.length}
                  </h3>
                  {currentNode.relatedElementIds.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {currentNode.relatedElementIds.map((id) => {
                        const element = graph.elements[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => push({ kind: "element", id })}
                            className="chip"
                            title={element?.title ?? id}
                          >
                            {manualElements.has(id) ? (
                              <Check size={12} className="mr-1 shrink-0 text-brass" aria-hidden="true" />
                            ) : null}
                            {element?.title ?? id}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">無關聯元素。</p>
                  )}
                </section>

                <section className="flex flex-col gap-1">
                  <h3 className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    <span className="mr-1 inline-block h-1.5 w-1.5 bg-brass/80" aria-hidden="true"></span>Sources
                  </h3>
                  {currentNode.sources.length ? (
                    <ul className="flex flex-col gap-0.5">
                      {currentNode.sources.map((s) => (
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
            ) : currentElement ? (
              <ElementMdxView
                element={currentElement}
                content={ElementMdx}
                checked={manualElements.has(currentElement.id)}
                quizSolved={quizSolved.has(currentElement.id)}
                onToggle={handleToggleElement}
                onQuizSolved={markQuizSolved}
              />
            ) : (
              <p className="text-xs text-muted-foreground">找不到此內容。</p>
            )}
          </div>
        </div>

        {fullRead && (currentNode || currentElement) ? (
          <div
            className="pane-view pane-fade absolute inset-0 overflow-y-auto px-6 py-8"
            role="presentation"
            onClick={handleContentClick}
          >
            <article className="prose mx-auto max-w-[42rem]">
              {current.kind === "node" && currentNode && NodeMdx ? (
                <NodeMdx components={nodeMdxComponents} />
              ) : currentElement && ElementMdx ? (
                <ElementMdx
                  components={elementMdxComponents(currentElement, markQuizSolved)}
                />
              ) : (
                <p className="text-xs text-muted-foreground">找不到此內容。</p>
              )}
            </article>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

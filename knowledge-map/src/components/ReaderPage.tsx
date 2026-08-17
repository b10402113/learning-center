import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { button } from "../lib/buttonVariants";
import { cn } from "../lib/cn";
import { statusLabel } from "../lib/colors";
import { stepsOfNode } from "../lib/completion";
import { resolveElementSource } from "../lib/hashlink";
import { elementMdxComponents, nodeMdxComponents, type MdxComponents } from "../lib/mdxComponents";
import { getElementMdx, getStepMdx } from "../lib/mdxRegistry";
import type { Node, ReaderModalTarget, Step, SubjectGraph } from "../lib/types";
import { findWikilinkTarget } from "../lib/wikilink";
import { ChevronRight } from "./icons/ChevronRight";
import { Expand } from "./icons/Expand";
import { X } from "./icons/X";

const TIER_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

export interface ReaderCommonProps {
  graph: SubjectGraph;
  /** Node-qualified step ids currently complete for this graph's subject. */
  completedSteps: Set<string>;
  /** Toggle one step's completion in this graph's subject record. */
  onToggleStep: (stepId: string) => void;
  onNavigateNode: (subject: string, nodeId: string) => void;
  onNavigateStep: (subject: string, nodeId: string, stepId: string) => void;
  onNavigateElement: (subject: string, elementId: string, from?: string | null) => void;
  onBackToMap: () => void;
}

type ReaderPageProps = ReaderCommonProps &
  (
    | { mode: "node"; nodeId: string }
    | { mode: "element"; elementId: string; from: string | null }
    | { mode: "step"; nodeId: string; stepId: string }
  ) & {
    // `standalone` (default) is the addressable full page; `readerModal` hosts the
    // same docs page inside the transient overlay, swapping the focus toggle for
    // expand/close (ADR-0003).
    presentation?: "standalone" | "readerModal";
    onExpand?: (target: ReaderModalTarget) => void;
    onClose?: () => void;
  };

/**
 * The shared three-column docs page (ADR-0003). Left course nav, central
 * article, right TOC → related list. Renders a node container (`mode: "node"`,
 * the lesson description + step-DAG), a step article (`mode: "step"`), or an
 * element concept (`mode: "element"`) through the same layout so the three never
 * diverge. Standalone presentation owns a focus mode that collapses the chrome;
 * the reader-modal presentation reuses this component inside an overlay.
 * Completion is step-based (ADR-0005) and lives on the map — a node's steps
 * toggle here, elements never do.
 */
export function ReaderPage({
  graph,
  completedSteps,
  onToggleStep,
  onNavigateNode,
  onNavigateStep,
  onNavigateElement,
  onBackToMap,
  ...props
}: ReaderPageProps) {
  const mode = props.mode;
  const readerModal = (props.presentation ?? "standalone") === "readerModal";

  const node =
    mode === "node" || mode === "step"
      ? (graph.nodes.find((n) => n.id === props.nodeId) ?? null)
      : null;
  const step = mode === "step" ? (graph.steps[`${props.nodeId}/${props.stepId}`] ?? null) : null;
  const element =
    mode === "element" ? (graph.elements[props.elementId] ?? null) : null;

  const [focusMode, setFocusMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<HTMLElement[]>([]);
  const [toc, setToc] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const nodeById = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);
  const nodeIds = useMemo(() => new Set(graph.nodes.map((n) => n.id)), [graph]);
  const stepIds = useMemo(() => new Set(Object.keys(graph.steps)), [graph]);

  const sortedElements = useMemo(
    () => Object.values(graph.elements).sort((a, b) => a.order - b.order || a.tier - b.tier),
    [graph],
  );

  // Course order from tiers → nodes, for prev/next node navigation.
  const courseNodes = useMemo<Node[]>(() => {
    const seen = new Set<string>();
    const ordered: Node[] = [];
    for (const tier of graph.tiers) {
      for (const id of tier.nodeIds) {
        if (seen.has(id)) continue;
        const n = nodeById.get(id);
        if (n) {
          seen.add(id);
          ordered.push(n);
        }
      }
    }
    return ordered;
  }, [graph, nodeById]);

  // The node's step-DAG in reading order (ADR-0004): the container's directory,
  // shared by the node page's DAG section, the step page's prev/next + TOC, and
  // the completion checklist.
  const dagNodeId = mode === "node" || mode === "step" ? props.nodeId : null;
  const nodeSteps = useMemo<Step[]>(() => {
    if (dagNodeId == null) return [];
    return stepsOfNode(graph.steps, dagNodeId);
  }, [graph, dagNodeId]);

  const stepById = graph.steps;

  const contentKey =
    mode === "element"
      ? props.elementId
      : mode === "step"
        ? `${props.nodeId}/${props.stepId}`
        : props.nodeId;

  // Element breadcrumb source lesson: the explicit ?from origin wins, else the
  // first teaching step's node, else none (subject / 元素 / title).
  const sourceNodeId =
    mode === "element"
      ? resolveElementSource(props.from, element?.taughtBySteps ?? [], stepIds, nodeIds)
      : null;
  const sourceNode = sourceNodeId ? nodeById.get(sourceNodeId) ?? null : null;

  // The step page renders its own article; the node page renders its step-DAG
  // directory instead of a node article (the node is a container, ADR-0004).
  const Content =
    mode === "step"
      ? getStepMdx(graph.subject, props.nodeId, props.stepId)
      : mode === "element"
        ? getElementMdx(graph.subject, props.elementId)
        : null;

  const components = useMemo<MdxComponents | undefined>(() => {
    if (mode === "node") return undefined;
    if (mode === "step") {
      // The page header owns the title; the article's own h1 would duplicate it.
      return { ...nodeMdxComponents, h1: () => null };
    }
    if (!element) return undefined;
    return {
      // Question elements are deprecated (ADR-0005) — they render as plain
      // articles with no interactive quiz.
      ...elementMdxComponents(element),
      // The page header owns the title; the article's own h1 would duplicate it.
      h1: () => null,
    };
  }, [mode, element]);

  // Reset reading position and drop the transient focus mode when the content
  // changes (navigation keeps this component mounted).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setFocusMode(false);
  }, [contentKey]);

  // Collect the rendered article's h2 headings into the scroll-spy TOC and keep
  // the active heading in sync as the learner scrolls.
  useLayoutEffect(() => {
    const container = scrollRef.current;
    headingRefs.current = container
      ? Array.from(container.querySelectorAll<HTMLElement>("h2"))
      : [];
    setToc(headingRefs.current.map((h) => h.textContent ?? ""));
    setActiveIndex(0);
    if (!container || headingRefs.current.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; top: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = headingRefs.current.indexOf(entry.target as HTMLElement);
          if (idx < 0) continue;
          if (best === null || entry.boundingClientRect.top < best.top) {
            best = { idx, top: entry.boundingClientRect.top };
          }
        }
        if (best) setActiveIndex(best.idx);
      },
      { root: container, rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    headingRefs.current.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [contentKey, graph]);

  // Esc leaves focus mode (transient state — never written to the URL).
  useEffect(() => {
    if (!focusMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode]);

  const missing =
    mode === "node"
      ? node === null
      : mode === "step"
        ? node === null || step === null
        : element === null;

  if (missing) {
    const label =
      mode === "node" ? "找不到此課文。" : mode === "step" ? "找不到此步驟。" : "找不到此元素。";
    return (
      <div className="grid h-full place-items-center bg-background text-muted">
        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-sm">{label}</p>
          <button type="button" onClick={onBackToMap} className="toc-link">
            ← 回到地圖
          </button>
        </div>
      </div>
    );
  }

  const title =
    mode === "node" ? node!.title : mode === "step" ? step!.title : element!.title;

  function scrollToHeading(index: number) {
    const el = headingRefs.current[index];
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  // The lesson origin carried into element navigations: the node being read on
  // a node or step page, or the element page's *resolved* source lesson (so a
  // ghost `?from` never propagates — the breadcrumb source is the real node
  // shown). A step belongs to its node, so its wikilinks point back at the node.
  const origin = mode === "step" ? props.nodeId : mode === "node" ? props.nodeId : sourceNodeId;

  // In the reader-modal presentation, "expand" promotes the current content to
  // its standalone page: elements carry the resolved source so the full page's
  // breadcrumb can jump straight back.
  function handleExpand() {
    if (!props.onExpand) return;
    if (mode === "node") {
      props.onExpand({ kind: "node", subject: graph.subject, nodeId: node!.id });
    } else if (mode === "step") {
      props.onExpand({
        kind: "step",
        subject: graph.subject,
        nodeId: node!.id,
        stepId: step!.id,
      });
    } else {
      props.onExpand({
        kind: "element",
        subject: graph.subject,
        elementId: element!.id,
        from: sourceNodeId,
      });
    }
  }

  function handleContentClick(e: React.MouseEvent) {
    const parsed = findWikilinkTarget(e);
    if (!parsed) return;
    if (parsed.kind === "element") {
      // A wikilink carries the current lesson origin so the target's breadcrumb
      // can jump back (from a lesson/step it is that node; from an element page
      // it keeps the page's resolved source, if any).
      onNavigateElement(parsed.subject, parsed.id, origin);
    } else {
      onNavigateNode(parsed.subject, parsed.id);
    }
  }

  // Element prev/next by element order; node prev/next by course order; step
  // prev/next by the owning node's step-DAG reading order (absent at the ends).
  const currentIndex =
    mode === "element"
      ? sortedElements.findIndex((e) => e.id === element!.id)
      : mode === "step"
        ? nodeSteps.findIndex((s) => s.stepId === step!.stepId)
        : courseNodes.findIndex((n) => n.id === node!.id);
  const prev =
    mode === "element"
      ? currentIndex > 0
        ? sortedElements[currentIndex - 1]
        : null
      : mode === "step"
        ? currentIndex > 0
          ? nodeSteps[currentIndex - 1]
          : null
        : currentIndex > 0
          ? courseNodes[currentIndex - 1]
          : null;
  const next =
    mode === "element"
      ? currentIndex >= 0 && currentIndex < sortedElements.length - 1
        ? sortedElements[currentIndex + 1]
        : null
      : mode === "step"
        ? currentIndex >= 0 && currentIndex < nodeSteps.length - 1
          ? nodeSteps[currentIndex + 1]
          : null
        : currentIndex >= 0 && currentIndex < courseNodes.length - 1
          ? courseNodes[currentIndex + 1]
          : null;

  const activeNodeId = mode === "node" || mode === "step" ? node!.id : sourceNodeId;

  // A node is complete iff every step in its DAG is complete (ADR-0005).
  const nodeComplete = nodeSteps.length > 0 && nodeSteps.every((s) => completedSteps.has(s.id));

  // Footer prev/next shares a shape across modes: an element (by element order),
  // a course-ordered node, or a node's step (by DAG order). Steps carry their
  // `stepId` for navigation; nodes/elements carry their `id`.
  const footPrev = prev
    ? mode === "step"
      ? { id: (prev as Step).stepId, title: prev.title }
      : { id: prev.id, title: prev.title }
    : null;
  const footNext = next
    ? mode === "step"
      ? { id: (next as Step).stepId, title: next.title }
      : { id: next.id, title: next.title }
    : null;

  function navigateFoot(target: { id: string }) {
    if (mode === "element") onNavigateElement(graph.subject, target.id, origin);
    else if (mode === "step") onNavigateStep(graph.subject, props.nodeId, target.id);
    else onNavigateNode(graph.subject, target.id);
  }

  return (
    <div className={cn("element-page", focusMode && "element-page-focus")}>
      {!focusMode ? (
        <aside className="element-leftnav" aria-label="課程導覽">
          <div className="element-nav-label">課程 · {graph.subject}</div>
          <div className="element-nav-group">
            {graph.tiers.map((tier) => (
              <div key={tier.tier}>
                <div className="element-nav-tier">
                  {TIER_ROMAN[tier.tier - 1] ?? tier.tier} · {tier.title}
                </div>
                {tier.nodeIds.map((id) => {
                  const n = nodeById.get(id);
                  if (!n) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onNavigateNode(graph.subject, id)}
                      className={cn("element-nav-item", id === activeNodeId && "active")}
                      aria-current={id === activeNodeId ? "page" : undefined}
                      title={n.title}
                    >
                      <span className="n">{String(n.order).padStart(2, "0")}</span>
                      <span className="dot" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate text-left">{n.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>
      ) : null}

      <main className="element-main">
        {!focusMode ? (
          <div className="element-chrome-row">
            <nav className="element-breadcrumb" aria-label="所在位置">
              <button type="button" onClick={onBackToMap} className="link">
                {graph.subject}
              </button>
              <span className="sep">/</span>
              {mode === "node" ? (
                <span className="current">{title}</span>
              ) : mode === "step" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateNode(graph.subject, node!.id)}
                    className="link"
                    title={`回到課文：${node!.title}`}
                  >
                    {node!.title}
                  </button>
                  <span className="sep">/</span>
                  <span className="current">{title}</span>
                </>
              ) : sourceNode ? (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateNode(graph.subject, sourceNode!.id)}
                    className="link"
                    title={`回到課文：${sourceNode!.title}`}
                  >
                    {sourceNode!.title}
                  </button>
                  <span className="sep">/</span>
                  <span className="current">{title}</span>
                </>
              ) : (
                <>
                  <span className="link-static">元素</span>
                  <span className="sep">/</span>
                  <span className="current">{title}</span>
                </>
              )}
            </nav>
            {readerModal ? (
              <>
                <button
                  type="button"
                  onClick={handleExpand}
                  className="element-focus-toggle"
                  title="展開為獨立全頁"
                >
                  <Expand size={12} />
                  展開
                </button>
                <button
                  type="button"
                  onClick={props.onClose}
                  aria-label="關閉視窗"
                  title="關閉 (Esc)"
                  className={cn(button({ variant: "ghost", size: "icon" }), "shrink-0")}
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setFocusMode(true)}
                className="element-focus-toggle"
                title="聚焦模式 (Esc 離開)"
              >
                <Expand size={12} />
                聚焦
              </button>
            )}
          </div>
        ) : null}

        <div ref={scrollRef} className="element-scroll">
          <article className="element-article">
            <header className="element-article-head">
              <div className="element-meta-row">
                {mode === "element" ? (
                  <>
                    <span className={cn("type-badge", `type-${element!.type}`)}>
                      {element!.type}
                    </span>
                    <span className="element-meta-chip">
                      T{element!.tier} · #{element!.order}
                    </span>
                  </>
                ) : mode === "step" ? (
                  <>
                    <span className="element-meta-chip">步驟</span>
                    <span className="element-meta-chip">
                      T{node!.tier} · #{step!.order}
                    </span>
                    {node!.duration ? (
                      <span className="element-meta-chip">{node!.duration}</span>
                    ) : null}
                  </>
                ) : (
                  <>
                    <span className="element-meta-chip">課文</span>
                    {node!.status ? (
                      <span className="element-meta-chip">{statusLabel(node!.status)}</span>
                    ) : null}
                    {node!.duration ? (
                      <span className="element-meta-chip">{node!.duration}</span>
                    ) : null}
                  </>
                )}
              </div>
              <h1>{title}</h1>
              {mode === "node" && node!.goal ? (
                <p className="element-goal">{node!.goal}</p>
              ) : null}
            </header>

            <div className="nb-prose element-prose" onClick={handleContentClick}>
              {mode === "node" ? (
                <section className="node-dag" aria-label="課程步驟">
                  <div className="node-dag-head">
                    <h2>Steps · 課程結構</h2>
                    <p className="node-dag-hint">
                      每個 step 是一篇可獨立閱讀的課文；deps 標明閱讀順序。
                    </p>
                  </div>
                  {nodeSteps.length ? (
                    <div className="node-dag-list">
                      {nodeSteps.map((s) => {
                        const done = completedSteps.has(s.id);
                        const deps = s.deps
                          .map((id) => stepById[id])
                          .filter((d): d is Step => Boolean(d));
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => onNavigateStep(graph.subject, node!.id, s.stepId)}
                            className={cn("node-dag-card", done && "on")}
                            title={s.title}
                          >
                            <span className="n">{String(s.order).padStart(2, "0")}</span>
                            <span
                              className={cn("status-dot", done && "on")}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="t block truncate text-left">{s.title}</span>
                              <span className="sub block truncate text-left">
                                {deps.length
                                  ? `依賴：${deps.map((d) => d.title).join("、")}`
                                  : "無前置 step"}
                              </span>
                            </span>
                            <ChevronRight size={14} className="node-dag-chevron" />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="node-dag-empty">此課文沒有 step（舊式單文章 node）。</p>
                  )}
                </section>
              ) : Content && components ? (
                <Content components={components} />
              ) : (
                <p>找不到此內容。</p>
              )}
            </div>

            {mode === "element" && element!.taughtBySteps.length ? (
              <section className="element-taught">
                <h2>由哪堂課教授</h2>
                <div className="flex flex-col gap-2.5">
                  {element!.taughtBySteps.map((id) => {
                    const s = stepById[id];
                    if (!s) return null;
                    const n = nodeById.get(s.nodeId);
                    if (!n) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onNavigateStep(graph.subject, n.id, s.stepId)}
                        className="element-taught-card"
                        title={`回到步驟：${s.title}`}
                      >
                        <span className="n">{String(s.order).padStart(2, "0")}</span>
                        <span className="min-w-0">
                          <span className="t block truncate text-left">{s.title}</span>
                          <span className="sub block truncate text-left">
                            {n.title} · Tier {TIER_ROMAN[n.tier - 1] ?? n.tier}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {!focusMode ? (
              <footer className="element-foot">
                {footPrev ? (
                  <button
                    type="button"
                    className="element-foot-link"
                    onClick={() => navigateFoot(footPrev!)}
                  >
                    <span className="k">
                      {mode === "element"
                        ? "← 上一元素"
                        : mode === "step"
                          ? "← 上一步"
                          : "← 上一課文"}
                    </span>
                    <span className="min-w-0 truncate">{footPrev.title}</span>
                  </button>
                ) : (
                  <span className="flex-1" />
                )}
                {footNext ? (
                  <button
                    type="button"
                    className="element-foot-link next"
                    onClick={() => navigateFoot(footNext!)}
                  >
                    <span className="k">
                      {mode === "element"
                        ? "下一元素 →"
                        : mode === "step"
                          ? "下一步 →"
                          : "下一課文 →"}
                    </span>
                    <span className="min-w-0 truncate">{footNext.title}</span>
                  </button>
                ) : (
                  <span className="flex-1" />
                )}
              </footer>
            ) : null}
          </article>
        </div>

        {focusMode ? (
          <button
            type="button"
            onClick={() => setFocusMode(false)}
            className="element-focus-exit"
            aria-label="離開聚焦模式"
            title="離開聚焦模式 (Esc)"
          >
            <X size={14} />
            離開聚焦
          </button>
        ) : null}
      </main>

      {!focusMode ? (
        <aside className="element-toc" aria-label="本頁目錄">
          <div className="toc-label">本頁</div>
          {toc.map((label, i) => (
            <button
              key={`${i}-${label}`}
              type="button"
              className={cn("toc-link", i === activeIndex && "on")}
              onClick={() => scrollToHeading(i)}
            >
              {label}
            </button>
          ))}
          {!readerModal ? (
            <button
              type="button"
              className="toc-focus"
              onClick={() => setFocusMode(true)}
              title="聚焦模式 (Esc 離開)"
            >
              <Expand size={12} />
              進入聚焦
            </button>
          ) : null}

          {mode === "element" ? (
            <div className="toc-index">
              <div className="toc-label">元素</div>
              {sortedElements.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onNavigateElement(graph.subject, e.id, origin)}
                  className={cn("toc-link toc-index-item", e.id === element!.id && "on")}
                  aria-current={e.id === element!.id ? "page" : undefined}
                  title={e.title}
                >
                  <span className="toc-index-n">T{e.tier}</span>
                  <span className="min-w-0 flex-1 truncate text-left">{e.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              {nodeSteps.length ? (
                <div className="toc-complete">
                  <div className="lbl">
                    {mode === "step" ? "Steps · 本課目錄" : "進度 · Steps"}
                  </div>
                  {nodeSteps.map((s) => {
                    const done = completedSteps.has(s.id);
                    const isCurrent = mode === "step" && s.stepId === step!.stepId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          // The step page's TOC is a directory — a sibling step
                          // navigates there; the current step toggles. The node
                          // page's TOC keeps the completion checklist (ADR-0005),
                          // while its central DAG cards handle navigation.
                          if (mode === "step") {
                            if (isCurrent) onToggleStep(s.id);
                            else onNavigateStep(graph.subject, node!.id, s.stepId);
                          } else {
                            onToggleStep(s.id);
                          }
                        }}
                        className={cn("toc-link toc-index-item", done && "on")}
                        aria-current={isCurrent ? "page" : undefined}
                        title={s.title}
                      >
                        <span className={cn("toc-index-dot", done && "on")} aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate text-left">{s.title}</span>
                      </button>
                    );
                  })}
                  {nodeComplete ? (
                    <span className="toc-complete-badge">節點完成</span>
                  ) : null}
                </div>
              ) : null}
              {mode === "step" && step!.teaches.length ? (
                <div className="toc-index">
                  <div className="toc-label">此 step 教的元素</div>
                  {step!.teaches.map((id) => {
                    const e = graph.elements[id];
                    if (!e) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onNavigateElement(graph.subject, id, node!.id)}
                        className="toc-link toc-index-item"
                        title={e.title}
                      >
                        <span className="toc-index-n">T{e.tier}</span>
                        <span className="min-w-0 flex-1 truncate text-left">{e.title}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {mode === "node" && node!.relatedElementIds.length ? (
                <div className="toc-index">
                  <div className="toc-label">關聯元素</div>
                  {node!.relatedElementIds.map((id) => {
                    const e = graph.elements[id];
                    if (!e) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onNavigateElement(graph.subject, id, node!.id)}
                        className="toc-link toc-index-item"
                        title={e.title}
                      >
                        <span className="toc-index-n">T{e.tier}</span>
                        <span className="min-w-0 flex-1 truncate text-left">{e.title}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </>
          )}
        </aside>
      ) : null}
    </div>
  );
}

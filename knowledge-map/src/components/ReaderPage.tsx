import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { button } from "../lib/buttonVariants";
import { cn } from "../lib/cn";
import { statusLabel } from "../lib/colors";
import { resolveElementSource } from "../lib/hashlink";
import { elementMdxComponents, nodeMdxComponents, type MdxComponents } from "../lib/mdxComponents";
import { getElementMdx, getNodeMdx } from "../lib/mdxRegistry";
import type { Node, ReaderModalTarget, SubjectGraph } from "../lib/types";
import { findWikilinkTarget } from "../lib/wikilink";
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
  onNavigateElement: (subject: string, elementId: string, from?: string | null) => void;
  onBackToMap: () => void;
}

type ReaderPageProps = ReaderCommonProps &
  (
    | { mode: "node"; nodeId: string }
    | { mode: "element"; elementId: string; from: string | null }
  ) & {
    // `standalone` (default) is the addressable full page; `readerModal` hosts the
    // same docs page inside the transient overlay, swapping the focus toggle for
    // expand/close (ADR-0003).
    presentation?: "standalone" | "readerModal";
    onExpand?: (target: ReaderModalTarget) => void;
    onClose?: () => void;
  };

/**
 * The shared three-column docs page (ADR-0003). Left course nav (nodes only),
 * central article, right TOC → related list. Renders a node lesson
 * (`mode: "node"`) or an element concept (`mode: "element"`) through the same
 * layout so the two never diverge. Standalone presentation owns a focus mode
 * that collapses the chrome; the reader-modal presentation reuses this
 * component inside an overlay. Completion is step-based (ADR-0005) and lives on
 * the map — this page shows no completion toggles.
 */
export function ReaderPage({
  graph,
  completedSteps,
  onToggleStep,
  onNavigateNode,
  onNavigateElement,
  onBackToMap,
  ...props
}: ReaderPageProps) {
  const mode = props.mode;
  const readerModal = (props.presentation ?? "standalone") === "readerModal";
  const node = mode === "node" ? graph.nodes.find((n) => n.id === props.nodeId) ?? null : null;
  const element =
    mode === "element" ? (graph.elements[props.elementId] ?? null) : null;

  const [focusMode, setFocusMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<HTMLElement[]>([]);
  const [toc, setToc] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const nodeById = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);
  const nodeIds = useMemo(() => new Set(graph.nodes.map((n) => n.id)), [graph]);

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

  const contentKey = mode === "node" ? props.nodeId : props.elementId;

  // Element breadcrumb source lesson: the explicit ?from origin wins, else the
  // first node that teaches this element, else none (subject / 元素 / title).
  const sourceNodeId =
    mode === "element"
      ? resolveElementSource(props.from, element?.taughtByNodes ?? [], nodeIds)
      : null;
  const sourceNode = sourceNodeId ? nodeById.get(sourceNodeId) ?? null : null;

  const Content = mode === "node" ? getNodeMdx(graph.subject, props.nodeId) : getElementMdx(graph.subject, props.elementId);

  const components = useMemo<MdxComponents | undefined>(() => {
    if (mode === "node") {
      // The page header owns the title; the article's own h1 would duplicate it.
      return { ...nodeMdxComponents, h1: () => null };
    }
    if (!element) return undefined;
    return {
      // Question elements no longer gate anything (ADR-0005) — the QuizBlock
      // renders as a plain self-check without reporting back.
      ...elementMdxComponents(element, undefined),
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

  const missing = mode === "node" ? node === null : element === null;

  if (missing) {
    const label = mode === "node" ? "找不到此課文。" : "找不到此元素。";
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

  const title = mode === "node" ? node!.title : element!.title;

  function scrollToHeading(index: number) {
    const el = headingRefs.current[index];
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  // The lesson origin carried into element navigations: the node being read on
  // a lesson page, or the element page's *resolved* source lesson (so a ghost
  // `?from` never propagates — the breadcrumb source is the real node shown).
  const origin = mode === "node" ? props.nodeId : sourceNodeId;

  // In the reader-modal presentation, "expand" promotes the current content to
  // its standalone page: elements carry the resolved source so the full page's
  // breadcrumb can jump straight back.
  function handleExpand() {
    if (!props.onExpand) return;
    if (mode === "node") {
      props.onExpand({ kind: "node", subject: graph.subject, nodeId: node!.id });
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
      // can jump back (from a lesson it is that lesson; from an element page it
      // keeps the page's resolved source, if any).
      onNavigateElement(parsed.subject, parsed.id, origin);
    } else {
      onNavigateNode(parsed.subject, parsed.id);
    }
  }

  // Element prev/next by element order; node prev/next by course order.
  const currentIndex =
    mode === "element"
      ? sortedElements.findIndex((e) => e.id === element!.id)
      : courseNodes.findIndex((n) => n.id === node!.id);
  const prev =
    currentIndex > 0 ? (mode === "element" ? sortedElements[currentIndex - 1] : courseNodes[currentIndex - 1]) : null;
  const next =
    currentIndex >= 0 && currentIndex < (mode === "element" ? sortedElements.length : courseNodes.length) - 1
      ? (mode === "element" ? sortedElements[currentIndex + 1] : courseNodes[currentIndex + 1])
      : null;

  const activeNodeId = mode === "node" ? node!.id : sourceNodeId;

  // The node's step-DAG in reading order, for the completion checklist
  // (ADR-0005): steps are the only completion unit and a node is complete iff
  // every step in its DAG is complete.
  const nodeSteps = useMemo(
    () =>
      mode === "node"
        ? Object.values(graph.steps)
            .filter((s) => s.nodeId === node!.id)
            .sort((a, b) => a.order - b.order)
        : [],
    [graph, mode, node],
  );
  const nodeComplete = nodeSteps.length > 0 && nodeSteps.every((s) => completedSteps.has(s.id));

  // Footer prev/next shares a shape across modes: an element (by element order)
  // or a course-ordered node. `id`/`title` exist on both, so no cast is needed.
  const footPrev = prev ? { id: prev.id, title: prev.title } : null;
  const footNext = next ? { id: next.id, title: next.title } : null;

  function navigateFoot(target: { id: string }) {
    if (mode === "element") onNavigateElement(graph.subject, target.id, origin);
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
              {mode === "element" ? (
                sourceNode ? (
                  <button
                    type="button"
                    onClick={() => onNavigateNode(graph.subject, sourceNode!.id)}
                    className="link"
                    title={`回到課文：${sourceNode!.title}`}
                  >
                    {sourceNode!.title}
                  </button>
                ) : (
                  <span className="link-static">元素</span>
                )
              ) : null}
              {mode === "element" ? <span className="sep">/</span> : null}
              <span className="current">{title}</span>
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
              {Content && components ? (
                <Content components={components} />
              ) : (
                <p>找不到此內容。</p>
              )}
            </div>

            {mode === "element" && element!.taughtByNodes.length ? (
              <section className="element-taught">
                <h2>由哪堂課教授</h2>
                <div className="flex flex-col gap-2.5">
                  {element!.taughtByNodes.map((id) => {
                    const n = nodeById.get(id);
                    if (!n) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onNavigateNode(graph.subject, n.id)}
                        className="element-taught-card"
                        title={`回到課文：${n.title}`}
                      >
                        <span className="n">{String(n.order).padStart(2, "0")}</span>
                        <span className="min-w-0">
                          <span className="t block truncate text-left">{n.title}</span>
                          <span className="sub block truncate text-left">
                            Tier {TIER_ROMAN[n.tier - 1] ?? n.tier} · {n.goal}
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
                      {mode === "element" ? "← 上一元素" : "← 上一課文"}
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
                      {mode === "element" ? "下一元素 →" : "下一課文 →"}
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
                  <div className="lbl">進度 · Steps</div>
                  {nodeSteps.map((s) => {
                    const done = completedSteps.has(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onToggleStep(s.id)}
                        className={cn("toc-link toc-index-item", done && "on")}
                        aria-pressed={done}
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
              {node!.relatedElementIds.length ? (
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
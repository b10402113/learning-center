import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { isCompletionLocked } from "../lib/completion";
import { elementMdxComponents } from "../lib/mdxComponents";
import { getElementMdx } from "../lib/mdxRegistry";
import type { SubjectGraph } from "../lib/types";
import { findWikilinkTarget } from "../lib/wikilink";
import { CompletionToggle } from "./CompletionToggle";
import { Expand } from "./icons/Expand";
import { X } from "./icons/X";

const TIER_ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

interface ElementPageProps {
  graph: SubjectGraph;
  elementId: string;
  manualElements: Set<string>;
  quizSolved: Set<string>;
  onQuizSolved: (elementId: string) => void;
  onToggleCompletion: (id: string) => void;
  onNavigateElement: (subject: string, elementId: string) => void;
  onNavigateNode: (nodeId: string) => void;
  onBackToMap: () => void;
}

/**
 * The standalone element page (design A: docs layout). Left course nav, central
 * MDX article, right scroll-spy TOC with a gated completion card, prev/next
 * footer, and a transient focus mode that hides every column of chrome. The URL
 * hash is the single source of truth for which element is shown — navigation
 * goes through the App's hash dispatch.
 */
export function ElementPage({
  graph,
  elementId,
  manualElements,
  quizSolved,
  onQuizSolved,
  onToggleCompletion,
  onNavigateElement,
  onNavigateNode,
  onBackToMap,
}: ElementPageProps) {
  const element = graph.elements[elementId];
  const [focusMode, setFocusMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<HTMLElement[]>([]);
  const [toc, setToc] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const nodeById = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);
  const sortedElements = useMemo(
    () => Object.values(graph.elements).sort((a, b) => a.order - b.order || a.tier - b.tier),
    [graph],
  );

  const checked = element ? manualElements.has(element.id) : false;
  const locked = element
    ? isCompletionLocked(element.type, checked, quizSolved.has(element.id))
    : false;
  const Content = element ? getElementMdx(graph.subject, element.id) : null;

  const components = useMemo(() => {
    if (!element) return undefined;
    return {
      ...elementMdxComponents(
        element,
        element.type === "question" ? () => onQuizSolved(element.id) : undefined,
      ),
      // The page header owns the title; the article's own h1 would duplicate it.
      h1: () => null,
    };
  }, [element, onQuizSolved]);

  // Reset reading position and drop the transient focus mode when the element
  // changes (navigation keeps this component mounted).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setFocusMode(false);
  }, [elementId]);

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
  }, [elementId, graph]);

  // Esc leaves focus mode (transient state — never written to the URL).
  useEffect(() => {
    if (!focusMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode]);

  if (!element) {
    return (
      <div className="grid h-full place-items-center bg-background text-muted">
        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-sm">找不到此元素。</p>
          <button type="button" onClick={onBackToMap} className="toc-link">
            ← 回到地圖
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = sortedElements.findIndex((e) => e.id === element.id);
  const prev = currentIndex > 0 ? sortedElements[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < sortedElements.length - 1
      ? sortedElements[currentIndex + 1]
      : null;
  const taughtBy = element.taughtByNodes
    .map((id) => nodeById.get(id))
    .filter((n) => n !== undefined);

  function handleToggle() {
    if (locked) return;
    const wasActive = manualElements.has(element.id);
    onToggleCompletion(element.id);
    if (wasActive) {
      toast("已取消標記元素", { description: element.title });
    } else {
      toast.success("元素已學", { description: element.title });
    }
  }

  function scrollToHeading(index: number) {
    const el = headingRefs.current[index];
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function handleContentClick(e: React.MouseEvent) {
    const parsed = findWikilinkTarget(e);
    if (!parsed) return;
    if (parsed.kind === "element") {
      onNavigateElement(parsed.subject, parsed.id);
    } else if (parsed.subject === graph.subject) {
      onNavigateNode(parsed.id);
    }
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
                  const node = nodeById.get(id);
                  if (!node) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onNavigateNode(id)}
                      className="element-nav-item"
                      title={node.title}
                    >
                      <span className="n">{String(node.order).padStart(2, "0")}</span>
                      <span className="dot" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate text-left">{node.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="element-nav-label">元素</div>
          <div className="element-nav-group">
            {sortedElements.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => onNavigateElement(graph.subject, e.id)}
                className={cn("element-nav-item", e.id === element.id && "active")}
                aria-current={e.id === element.id ? "page" : undefined}
                title={e.title}
              >
                <span className="n">T{e.tier}</span>
                <span className="dot" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-left">{e.title}</span>
              </button>
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
              <button type="button" onClick={onBackToMap} className="link">
                元素
              </button>
              <span className="sep">/</span>
              <span className="current">{element.title}</span>
            </nav>
            <button
              type="button"
              onClick={() => setFocusMode(true)}
              className="element-focus-toggle"
              title="聚焦模式 (Esc 離開)"
            >
              <Expand size={12} />
              聚焦
            </button>
          </div>
        ) : null}

        <div ref={scrollRef} className="element-scroll">
          <article className="element-article">
            <header className="element-article-head">
              <div className="element-meta-row">
                <span className={cn("type-badge", `type-${element.type}`)}>{element.type}</span>
                <span className="element-meta-chip">
                  T{element.tier} · #{element.order}
                </span>
                {element.type === "question" && element.questions?.length ? (
                  <span className="element-meta-chip">{element.questions.length} 題測驗</span>
                ) : null}
              </div>
              <h1>{element.title}</h1>
            </header>

            <div className="nb-prose element-prose" onClick={handleContentClick}>
              {Content && components ? (
                <Content components={components} />
              ) : (
                <p>找不到此內容。</p>
              )}
            </div>

            {taughtBy.length ? (
              <section className="element-taught">
                <h2>由哪堂課教授</h2>
                <div className="flex flex-col gap-2.5">
                  {taughtBy.map((node) => (
                    <button
                      key={node!.id}
                      type="button"
                      onClick={() => onNavigateNode(node!.id)}
                      className="element-taught-card"
                      title={`回到地圖：${node!.title}`}
                    >
                      <span className="n">{String(node!.order).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="t block truncate text-left">{node!.title}</span>
                        <span className="sub block truncate text-left">
                          Tier {TIER_ROMAN[node!.tier - 1] ?? node!.tier} · {node!.goal}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {!focusMode ? (
              <footer className="element-foot">
                {prev ? (
                  <button type="button" className="element-foot-link" onClick={() => onNavigateElement(graph.subject, prev.id)}>
                    <span className="k">← 上一元素</span>
                    <span className="min-w-0 truncate">{prev.title}</span>
                  </button>
                ) : (
                  <span className="flex-1" />
                )}
                {next ? (
                  <button type="button" className="element-foot-link next" onClick={() => onNavigateElement(graph.subject, next.id)}>
                    <span className="k">下一元素 →</span>
                    <span className="min-w-0 truncate">{next.title}</span>
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
          <div className="toc-complete">
            <div className="lbl">進度</div>
            <CompletionToggle
              active={checked}
              disabled={locked}
              onClick={handleToggle}
              activeLabel="已標記元素完成"
              idleLabel={locked ? "先答對測驗即可標記" : "標記元素完成"}
            />
            {locked ? (
              <p className="toc-hint">這是測驗元素：答對所有題目後才能標記完成。</p>
            ) : null}
            <button
              type="button"
              className="toc-focus"
              onClick={() => setFocusMode(true)}
              title="聚焦模式 (Esc 離開)"
            >
              <Expand size={12} />
              進入聚焦
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

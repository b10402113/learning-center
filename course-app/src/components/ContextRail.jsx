import { useEffect, useState } from "react";
import { blockTypeMark, railBlocks } from "../lib/blocks.mjs";
import { followInternalLink, isPlainLeftClick } from "../lib/navigation.mjs";
import { pathForBlock } from "../lib/route.mjs";

const TOC_LINE = 120;

function jumpTo(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function useActiveHeading(headings) {
  const key = headings.map((heading) => heading.id).join("|");
  const [active, setActive] = useState(headings[0]?.id ?? null);

  useEffect(() => {
    if (!key) return;
    const ids = key.split("|");
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= TOC_LINE) current = id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return active;
}

function TocLink({ heading, active, compact = false }) {
  return (
    <a
      href={`#${heading.id}`}
      onClick={(event) => {
        if (jumpTo(heading.id)) event.preventDefault();
      }}
      style={{ paddingLeft: heading.depth === 3 ? (compact ? 14 : 22) : 10 }}
      className={`block border-l-2 py-1 pr-1 leading-snug transition-colors ${
        compact ? "text-[0.82rem]" : "text-[0.8rem]"
      } ${
        active
          ? "border-accent font-medium text-accent"
          : "border-transparent text-ink-soft hover:border-hairline hover:text-ink"
      }`}
    >
      {heading.text}
    </a>
  );
}

/** The right-hand context rail: page TOC plus the step's knowledge points. */
export default function ContextRail({
  course,
  step,
  onNavigate = null,
  onOpenBlock = null,
  onClose = null,
}) {
  const headings = Array.isArray(step?.headings) ? step.headings : [];
  const blockCount = railBlocks(course, step).length;
  const active = useActiveHeading(headings);

  return (
    <aside
      className="scroll-slim sticky top-[4.75rem] max-h-[calc(100vh-4.75rem)] w-full overflow-y-auto py-12 pr-1"
      aria-label="本步情境"
    >
      <div>
        {headings.length >= 2 && (
          <nav aria-label="本頁目錄">
            <div className="flex items-center justify-between gap-2">
              <p className="robo-kicker font-label text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                本頁目錄
              </p>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="收合右側大綱"
                  title="收合右側大綱（⌘\\ 重新展開）"
                  className="-mr-1 grid size-6 place-items-center rounded-md text-[0.85rem] text-ink-soft transition-colors hover:bg-surface hover:text-accent"
                >
                  ✕
                </button>
              )}
            </div>
            <ol className="mt-3 space-y-0.5">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <TocLink heading={heading} active={active === heading.id} />
                </li>
              ))}
            </ol>
          </nav>
        )}

        {blockCount > 0 && (
          <section
            className={
              headings.length >= 2
                ? "mt-8 border-t border-hairline pt-6"
                : ""
            }
            aria-label="本步知識點"
          >
            <p className="robo-kicker font-label text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              本步知識點
            </p>
            <ConceptList
              course={course}
              step={step}
              onNavigate={onNavigate}
              onOpenBlock={onOpenBlock}
              className="mt-3"
            />
          </section>
        )}
      </div>
    </aside>
  );
}

/** The step's blocks as a quiet list; shared by the rail and narrow screens. */
export function ConceptList({
  course,
  step,
  onNavigate = null,
  onOpenBlock = null,
  className = "",
}) {
  const blocks = railBlocks(course, step);
  if (blocks.length === 0) return null;

  return (
    <ul className={`space-y-3 ${className}`}>
      {blocks.map((block) => {
        const href = pathForBlock(course.subject, block.id);
        return (
          <li key={block.id}>
            <a
              href={href}
              onClick={(event) => {
                if (onOpenBlock && isPlainLeftClick(event)) {
                  event.preventDefault();
                  onOpenBlock(block.id);
                  return;
                }
                if (followInternalLink(event, href, onNavigate)) {
                  event.preventDefault();
                }
              }}
              className="group flex gap-2.5"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[0.62rem] leading-none text-ink-soft transition-colors group-hover:text-accent"
              >
                {blockTypeMark(block.type)}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.86rem] leading-snug text-ink transition-colors group-hover:text-accent">
                  {block.title}
                </span>
                {block.summary && (
                  <span className="mt-0.5 block truncate text-[0.72rem] leading-snug text-ink-soft">
                    {block.summary}
                  </span>
                )}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Narrow screens keep the TOC inline, collapsed under the title. */
export function TocDetails({ headings, className = "" }) {
  if (!Array.isArray(headings) || headings.length < 2) return null;

  return (
    <details
      className={`rounded-2xl bg-shade/40 px-4 py-3.5 ${className}`}
    >
      <summary className="cursor-pointer font-label text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
        本頁目錄
        <span className="ml-2 font-mono text-[11px] tabular-nums text-ink-soft">
          {headings.length}
        </span>
      </summary>
      <ol className="mt-3 space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <TocLink heading={heading} active={false} compact />
          </li>
        ))}
      </ol>
    </details>
  );
}

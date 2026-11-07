import { useMemo, useState } from "react";
import BlockGraph from "./BlockGraph.jsx";
import { blockTypeLabel } from "../lib/blocks.mjs";
import { filterBlocks } from "../lib/block-graph.mjs";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor, pathForBlock } from "../lib/route.mjs";

const MODES = [
  { id: "list", label: "清單" },
  { id: "graph", label: "圖" },
];

const TYPE_ORDER = ["concept", "procedure", "principle", "contrast"];

function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 font-label text-[11px] transition-colors ${
        active
          ? "bg-accent-tint font-medium text-accent ring-1 ring-accent/30"
          : "text-ink-soft hover:bg-surface hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function TypeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-2.5 py-1 font-label text-[10px] transition-colors ${
        active
          ? "bg-accent-tint font-medium text-accent ring-1 ring-accent/25"
          : "text-ink-soft hover:bg-surface hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function BlockCard({ course, block, onNavigate }) {
  const href = pathForBlock(course.subject, block.id);
  const steps = Array.isArray(block.steps) ? block.steps.length : 0;
  return (
    <a
      href={href}
      onClick={(event) => {
        if (followInternalLink(event, href, onNavigate)) {
          event.preventDefault();
        }
      }}
      className="group flex flex-col rounded-2xl bg-surface px-4 py-4 ring-1 ring-hairline shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-accent/40"
    >
      <span className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-shade px-2 py-0.5 font-label text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          {blockTypeLabel(block.type)}
        </span>
        <span className="font-mono text-[10px] text-ink-soft">{block.id}</span>
      </span>
      <span className="mt-2 text-[1rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
        {block.title}
      </span>
      {block.summary && (
        <span className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">
          {block.summary}
        </span>
      )}
      <span className="mt-auto pt-3 font-mono text-[10px] tabular-nums text-ink-soft">
        {steps} 步使用
      </span>
    </a>
  );
}

/**
 * Subject-level block index. Readers can scan a list or switch to the
 * knowledge graph; both views share the type filter and the search query.
 */
export default function BlocksIndex({ course, onNavigate = null }) {
  const blocks = Array.isArray(course.blocks) ? course.blocks : [];
  const [mode, setMode] = useState("list");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");

  const types = useMemo(() => {
    const present = new Set(blocks.map((block) => block.type));
    return TYPE_ORDER.filter((item) => present.has(item));
  }, [blocks]);

  const filtered = useMemo(
    () =>
      filterBlocks(blocks, { type, query }).sort((a, b) =>
        String(a.title).localeCompare(String(b.title), "zh-Hant")
      ),
    [blocks, type, query]
  );

  const edges = Array.isArray(course.blockEdges) ? course.blockEdges : [];

  return (
    <article>
      <nav
        aria-label="麵包屑"
        className="flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
      >
        <span>課程清單</span>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <a
          href={pathFor(course.subject)}
          onClick={(event) => {
            const href = pathFor(course.subject);
            if (followInternalLink(event, href, onNavigate)) {
              event.preventDefault();
            }
          }}
          className="transition-colors hover:text-accent"
        >
          {course.title}
        </a>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <span className="text-ink">知識點</span>
      </nav>

      <header className="mt-4">
        <p className="robo-kicker font-label text-[10px] text-accent">
          Knowledge Graph
        </p>
        <h1 className="mt-3 font-display text-[2.2rem] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[2.6rem]">
          知識點
        </h1>
        <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.85] text-ink-soft">
          這門課萃取出的獨立知識點。切換成圖，看先備與相關概念怎麼連在一起。
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-ink-soft">
          <span>{blocks.length} 個知識點</span>
          <span aria-hidden="true" className="text-hairline">·</span>
          <span>{edges.length} 條關係</span>
        </div>
      </header>

      {blocks.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-hairline bg-surface/50 px-5 py-12 text-center text-[0.95rem] text-ink-soft">
          這門課還沒有建立知識點。
        </p>
      ) : (
        <>
          <section className="mt-8 border-y border-hairline py-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {MODES.map((item) => (
                  <ModeButton
                    key={item.id}
                    active={mode === item.id}
                    onClick={() => setMode(item.id)}
                  >
                    {item.label}
                  </ModeButton>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <TypeButton
                  active={type === "all"}
                  onClick={() => setType("all")}
                >
                  全部
                </TypeButton>
                {types.map((item) => (
                  <TypeButton
                    key={item}
                    active={type === item}
                    onClick={() => setType(item)}
                  >
                    {blockTypeLabel(item)}
                  </TypeButton>
                ))}
              </div>

              <label className="ml-auto flex min-w-[190px] items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1">
                <span className="sr-only">搜尋知識點</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="shrink-0 text-ink-soft"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜尋知識點…"
                  className="min-w-0 flex-1 bg-transparent font-sans text-[0.85rem] text-ink outline-none placeholder:text-ink-soft/60"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="清除搜尋"
                    className="shrink-0 text-[0.8rem] text-ink-soft transition-colors hover:text-accent"
                  >
                    ✕
                  </button>
                )}
              </label>

              <span className="font-mono text-[10px] tabular-nums text-ink-soft">
                {filtered.length}/{blocks.length}
              </span>
            </div>
          </section>

          {mode === "list" ? (
            filtered.length === 0 ? (
              <p className="mt-10 rounded-2xl border border-dashed border-hairline bg-surface/50 px-5 py-12 text-center text-[0.95rem] text-ink-soft">
                沒有符合條件的知識點。
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filtered.map((block) => (
                  <BlockCard
                    key={block.id}
                    course={course}
                    block={block}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="mt-6">
              <BlockGraph
                course={course}
                type={type}
                query={query}
                onNavigate={onNavigate}
              />
            </div>
          )}
        </>
      )}

      <footer className="robo-kicker mt-20 border-t border-hairline pt-5 font-label text-[10px] text-ink-soft">
        {course.title} · {blocks.length} 個知識點 · {edges.length} 條關係
      </footer>
    </article>
  );
}

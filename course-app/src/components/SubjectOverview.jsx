import RoadmapCanvas from "./RoadmapCanvas.jsx";
import {
  ChapterRule,
  KnowledgeGlyph,
  NodeGlyph,
  OrbitMark,
} from "./Glyphs.jsx";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor, pathForBlocks } from "../lib/route.mjs";

function NodeLink({ course, node, onNavigate }) {
  const href = pathFor(course.subject, node.id);
  return (
    <a
      href={href}
      onClick={(event) => {
        if (followInternalLink(event, href, onNavigate)) {
          event.preventDefault();
        }
      }}
      className="group flex items-start gap-3 rounded-xl bg-surface px-3.5 py-3 ring-1 ring-hairline transition-colors hover:bg-surface hover:ring-accent/40"
    >
      <span className="mt-0.5 w-6 shrink-0 font-mono text-[10px] tabular-nums text-ink-soft">
        {String(node.globalOrder).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.94rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
          {node.title}
        </span>
        <span className="mt-1 block font-mono text-[10px] tabular-nums text-ink-soft">
          {node.steps.length} 篇
        </span>
      </span>
      <NodeGlyph
        seed={node.id}
        size={15}
        className="mt-1 shrink-0 text-ink-soft/50 transition-colors group-hover:text-accent"
      />
    </a>
  );
}

/**
 * Subject landing page. The roadmap is the whole point: it shows how the
 * nodes depend on each other before the reader commits to a path. On narrow
 * screens the same data falls back to a tier list, where a scaled diagram
 * would be unreadable.
 */
export default function SubjectOverview({ course, onNavigate = null }) {
  const totalSteps = course.nodes.reduce(
    (sum, node) => sum + node.steps.length,
    0
  );
  const blocks = Array.isArray(course.blocks) ? course.blocks : [];
  const blockEdges = Array.isArray(course.blockEdges) ? course.blockEdges : [];
  const blocksHref = pathForBlocks(course.subject);
  return (
    <article>
      <nav
        aria-label="麵包屑"
        className="flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
      >
        <span>課程清單</span>
        <span aria-hidden="true" className="text-hairline">
          /
        </span>
        <span className="text-ink">{course.title}</span>
      </nav>

      <header className="mt-5 grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <p className="robo-kicker font-label text-[10px] text-accent">
            Roadmap
          </p>
          <h1 className="mt-3 font-display text-[2.3rem] font-semibold leading-[1.14] tracking-[-0.5px] text-ink sm:text-[2.85rem]">
            {course.title}
          </h1>
          {course.goal && (
            <p className="mt-4 max-w-[58ch] text-[1.02rem] leading-[1.85] text-ink-soft">
              {course.goal}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-ink-soft">
            <span>{course.nodes.length} 個節點</span>
            <span aria-hidden="true" className="text-hairline">
              ·
            </span>
            <span>{totalSteps} 個步驟</span>
            {blocks.length > 0 && (
              <>
                <span aria-hidden="true" className="text-hairline">
                  ·
                </span>
                <span>{blocks.length} 個知識點</span>
              </>
            )}
          </div>
        </div>
        <div className="hidden justify-center sm:flex">
          <OrbitMark className="h-44 w-full max-w-[240px] text-ink" />
        </div>
      </header>

      <a
        href={blocksHref}
        onClick={(event) => {
          if (followInternalLink(event, blocksHref, onNavigate)) {
            event.preventDefault();
          }
        }}
        className="group mt-8 flex w-full items-center gap-4 rounded-2xl bg-surface px-4 py-3.5 text-left ring-1 ring-hairline shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-accent/40 sm:w-auto sm:max-w-[420px]"
      >
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-tint text-accent"
        >
          <KnowledgeGlyph size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="robo-kicker block font-label text-[9px] text-ink-soft">
            Knowledge Graph
          </span>
          <span className="mt-0.5 block text-[0.98rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
            知識圖
          </span>
        </span>
        <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink-soft">
          {blocks.length} 知識點 · {blockEdges.length} 條關係
        </span>
      </a>

      <section className="mt-12">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="robo-kicker font-label text-[10px] text-ink-soft">
              課程地圖
            </p>
            <h2 className="mt-1 font-display text-[1.15rem] font-semibold text-ink">
              節點與先備關係
            </h2>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-ink-soft">
            {course.nodes.length} nodes
          </span>
        </div>
        <ChapterRule className="mb-4" />
        <RoadmapCanvas course={course} onNavigate={onNavigate} />
      </section>

      <section className="mt-12 md:hidden">
        <div className="mb-4 flex items-end justify-between gap-3 border-b border-hairline pb-3">
          <div>
            <p className="robo-kicker font-label text-[10px] text-ink-soft">
              依 tier 閱讀
            </p>
            <h2 className="mt-1 font-display text-[1.15rem] font-semibold text-ink">
              課程順序
            </h2>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-ink-soft">
            {course.nodes.length}
          </span>
        </div>
        <div className="space-y-7">
          {course.tiers.map((tier) => {
            const nodes = course.nodes.filter((node) => node.tier === tier.tier);
            if (nodes.length === 0) return null;
            return (
              <div key={tier.tier}>
                <p className="robo-kicker mb-2.5 font-label text-[9.5px] text-ink-soft">
                  Tier {tier.tier} · {tier.name}
                </p>
                <ul className="space-y-2">
                  {nodes.map((node) => (
                    <li key={node.id}>
                      <NodeLink
                        course={course}
                        node={node}
                        onNavigate={onNavigate}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="robo-kicker mt-20 border-t border-hairline pt-5 font-label text-[10px] text-ink-soft">
        {course.title} · {course.nodes.length} 個節點 ·{" "}
        {course.tiers.length} 個 tier
      </footer>
    </article>
  );
}

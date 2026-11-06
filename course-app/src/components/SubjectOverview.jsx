import DotMatrix from "./DotMatrix.jsx";
import RoadmapCanvas from "./RoadmapCanvas.jsx";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor, pathForBlocks } from "../lib/route.mjs";

function NodeLink({ course, node }) {
  return (
    <a
      href={pathFor(course.subject, node.id)}
      className="group robo-card robo-press flex items-start gap-3 px-3 py-3 hover:border-accent"
    >
      <span className="mt-0.5 w-7 shrink-0 font-mono text-[11px] tabular-nums text-ink-soft">
        {String(node.globalOrder).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
          {node.title}
        </span>
        <span className="mt-1 block font-mono text-[10px] tabular-nums text-ink-soft">
          {node.steps.length} 篇
        </span>
      </span>
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
        className="robo-kicker flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
      >
        <span>課程清單</span>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <span className="text-ink">{course.title}</span>
      </nav>

      <header className="mt-4 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_190px]">
        <div>
          <p className="robo-kicker font-label text-[11px] text-ink-soft">
            Roadmap
          </p>
          <h1 className="mt-2 text-[2rem] font-medium leading-[1.15] tracking-[-1px] text-ink sm:text-[2.5rem]">
            {course.title}
          </h1>
          {course.goal && (
            <p className="mt-3 max-w-[58ch] text-[1rem] leading-relaxed text-ink-soft">
              {course.goal}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2 font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            <span className="border border-ink bg-surface px-2 py-1">
              {course.nodes.length} 個節點
            </span>
            <span className="border border-ink bg-surface px-2 py-1">
              {totalSteps} 個步驟
            </span>
            {blocks.length > 0 && (
              <span className="border border-ink bg-surface px-2 py-1">
                {blocks.length} 個知識點
              </span>
            )}
          </div>
          <a
            href={blocksHref}
            onClick={(event) => {
              if (followInternalLink(event, blocksHref, onNavigate)) {
                event.preventDefault();
              }
            }}
            className="group mt-4 flex flex-wrap items-center gap-3 border-2 border-ink bg-surface px-3 py-2 shadow-[4px_4px_0_var(--robo-shadow)] transition-colors hover:border-accent sm:inline-flex"
          >
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center border-2 border-ink bg-shade font-mono text-[13px] text-ink"
            >
              ◉
            </span>
            <span className="min-w-0">
              <span className="block font-label text-[9px] uppercase tracking-[0.16em] text-ink-soft">
                Knowledge Graph
              </span>
              <span className="block text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
                知識圖
              </span>
            </span>
            <span className="font-mono text-[10px] tabular-nums text-ink-soft">
              {blocks.length} 知識點 · {blockEdges.length} 條關係
            </span>
          </a>
        </div>
        <div className="hidden sm:block">
          <div className="border-2 border-ink bg-surface p-2 shadow-[6px_6px_0_var(--robo-shadow)]">
            <DotMatrix variant="hexagon" height={150} />
          </div>
        </div>
      </header>

      <section className="mt-10">
        <div className="mb-3 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
          <h2 className="robo-kicker font-label text-[11px] font-medium text-ink-soft">
            課程地圖
          </h2>
          <span className="font-mono text-[11px] tabular-nums text-ink-soft">
            {course.nodes.length} nodes
          </span>
        </div>
        <RoadmapCanvas course={course} />
      </section>

      <section className="mt-10 md:hidden">
        <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
          <h2 className="robo-kicker font-label text-[11px] font-medium text-ink-soft">
            依 tier 閱讀
          </h2>
          <span className="font-mono text-[11px] tabular-nums text-ink-soft">
            {course.nodes.length}
          </span>
        </div>
        <div className="space-y-7">
          {course.tiers.map((tier) => {
            const nodes = course.nodes.filter((node) => node.tier === tier.tier);
            if (nodes.length === 0) return null;
            return (
              <div key={tier.tier}>
                <p className="robo-kicker mb-2 font-label text-[10px] text-ink-soft">
                  Tier {tier.tier} · {tier.name}
                </p>
                <ul className="space-y-2">
                  {nodes.map((node) => (
                    <li key={node.id}>
                      <NodeLink course={course} node={node} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="robo-kicker mt-16 border-t-2 border-ink pt-4 font-label text-[11px] text-ink-soft">
        {course.title} · {course.nodes.length} 個節點 ·{" "}
        {course.tiers.length} 個 tier
      </footer>
    </article>
  );
}

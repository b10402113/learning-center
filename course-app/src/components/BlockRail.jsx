import { blockTypeLabel, railBlocks } from "../lib/blocks.mjs";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathForBlock } from "../lib/route.mjs";

function RailCard({ course, block, onNavigate }) {
  const href = pathForBlock(course.subject, block.id);
  return (
    <a
      href={href}
      onClick={(event) => {
        if (followInternalLink(event, href, onNavigate)) {
          event.preventDefault();
        }
      }}
      className="group block border-2 border-ink bg-surface px-3 py-3 shadow-[3px_3px_0_var(--robo-shadow)] transition-colors hover:border-accent"
    >
      <span className="flex flex-wrap items-center gap-1.5 font-label text-[9px] uppercase tracking-[0.14em]">
        <span className="border border-ink bg-shade px-1.5 py-0.5 text-ink-soft">
          {blockTypeLabel(block.type)}
        </span>
        {block.prerequisite && (
          <span className="border border-accent px-1.5 py-0.5 text-accent">
            先備
          </span>
        )}
      </span>
      <span className="mt-2 block text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
        {block.title}
      </span>
      {block.summary && (
        <span className="mt-1 block text-[0.82rem] leading-relaxed text-ink-soft">
          {block.summary}
        </span>
      )}
    </a>
  );
}

/**
 * The step's knowledge points. `rail` is the sticky column shown from `xl`
 * up; `inline` is the collapsible block that takes its place on narrow
 * screens, placed after the article and before the self-check.
 */
export default function BlockRail({
  course,
  step,
  onNavigate = null,
  variant = "rail",
}) {
  const blocks = railBlocks(course, step);
  if (blocks.length === 0) return null;

  if (variant === "inline") {
    return (
      <details className="mt-12 border-2 border-ink bg-shade px-4 py-3 xl:hidden">
        <summary className="cursor-pointer font-label text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
          本步知識點
          <span className="ml-2 font-mono text-[11px] tabular-nums text-ink-soft">
            {blocks.length}
          </span>
        </summary>
        <div className="mt-4 space-y-3">
          {blocks.map((block) => (
            <RailCard
              key={block.id}
              course={course}
              block={block}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </details>
    );
  }

  return (
    <aside className="hidden xl:block" aria-label="本步知識點">
      <div className="sticky top-[3.625rem]">
        <div className="border-b-2 border-ink pb-2">
          <p className="robo-kicker font-label text-[11px] font-medium text-ink-soft">
            本步知識點
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {blocks.map((block) => (
            <RailCard
              key={block.id}
              course={course}
              block={block}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

import Markdown from "./Markdown.jsx";
import { ChapterRule, EmptyMark, NodeGlyph } from "./Glyphs.jsx";
import { tierDotClass } from "./Sidebar.jsx";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor } from "../lib/route.mjs";

/**
 * Node detail view: title, goal, node lesson, and the step list in the order
 * declared by the node's `steps` array. Each step links to its own article.
 */
export default function NodeView({
  course,
  node,
  onSelect,
  onSubject,
  onNavigate = null,
}) {
  const prereqs = (node.requires || [])
    .map((id) => course.nodes.find((n) => n.id === id) || null)
    .filter(Boolean);
  const dependents = course.nodes.filter((n) =>
    (n.requires || []).includes(node.id)
  );

  const tier = course.tiers.find((t) => t.tier === node.tier);

  return (
    <article>
      <nav
        aria-label="麵包屑"
        className="flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
      >
        <a
          href={pathFor(course.subject)}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;
            event.preventDefault();
            onSubject?.();
          }}
          className="transition-colors hover:text-accent"
        >
          {course.title}
        </a>
        <span aria-hidden="true" className="text-hairline">
          /
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${tierDotClass(node.tier)}`}
          />
          Tier {node.tier}
        </span>
        <span aria-hidden="true" className="text-hairline">
          /
        </span>
        <span className="text-ink">Node {node.globalOrder}</span>
      </nav>

      <header className="mt-5 grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_170px]">
        <div>
          <p className="robo-kicker font-label text-[10px] text-accent">
            Node {String(node.globalOrder).padStart(2, "0")}
            {tier ? ` · ${tier.name}` : ""}
          </p>
          <h1 className="mt-3 font-display text-[2.15rem] font-semibold leading-[1.16] tracking-[-0.5px] text-ink sm:text-[2.6rem]">
            {node.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-ink-soft">
            <span>
              {node.globalOrder} / {course.nodes.length} 個節點
            </span>
            <span aria-hidden="true" className="text-hairline">
              ·
            </span>
            <span>{node.steps.length} 個步驟</span>
            <span aria-hidden="true" className="text-hairline">
              ·
            </span>
            <span>
              Tier {node.tier}
              {tier ? ` — ${tier.name}` : ""}
            </span>
          </div>
        </div>
        <div className="hidden justify-center sm:flex">
          <div className="relative grid size-[152px] place-items-center rounded-[34px] bg-surface ring-1 ring-hairline shadow-soft">
            <NodeGlyph
              seed={node.id}
              size={58}
              strokeWidth={1.1}
              className="text-ink"
            />
            <span className="absolute right-6 top-6 size-2 rounded-full bg-accent" />
          </div>
        </div>
      </header>

      {node.goal && (
        <div className="mt-9 rounded-2xl bg-accent-tint px-5 py-4 ring-1 ring-accent/15">
          <p className="robo-kicker mb-1.5 font-label text-[9.5px] font-medium text-accent">
            學習目標
          </p>
          <p className="text-[1.02rem] leading-[1.8] text-ink">{node.goal}</p>
        </div>
      )}

      {prereqs.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2 font-label text-[11px]">
          <span className="robo-kicker text-ink-soft">前置節點</span>
          {prereqs.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-medium text-ink ring-1 ring-hairline transition-colors hover:text-accent hover:ring-accent/40"
            >
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              {p.title}
            </button>
          ))}
        </div>
      )}

      {dependents.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2 font-label text-[11px]">
          <span className="robo-kicker text-ink-soft">後續節點</span>
          {dependents.map((next) => (
            <button
              key={next.id}
              type="button"
              onClick={() => onSelect(next.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-medium text-ink ring-1 ring-hairline transition-colors hover:text-accent hover:ring-accent/40"
            >
              {next.title}
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {node.lessonIntro && (
        <div className="mt-8 max-w-[74ch] text-ink">
          <Markdown>{node.lessonIntro}</Markdown>
        </div>
      )}

      <section className="mt-14">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="robo-kicker font-label text-[10px] text-ink-soft">
              課程步驟
            </p>
            <h2 className="mt-1 font-display text-[1.15rem] font-semibold text-ink">
              依序讀完這 {node.steps.length} 步
            </h2>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-ink-soft">
            {String(node.steps.length).padStart(2, "0")}
          </span>
        </div>
        <ChapterRule className="mb-4" />

        {node.steps.length > 0 ? (
          <ol className="space-y-3">
            {node.steps.map((step) => {
              const href = pathFor(course.subject, node.id, step.id);
              return (
              <li key={step.id}>
                <a
                  href={href}
                  onClick={(event) => {
                    if (followInternalLink(event, href, onNavigate)) {
                      event.preventDefault();
                    }
                  }}
                  className="group flex items-start gap-4 rounded-2xl bg-surface px-4 py-4 ring-1 ring-hairline shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-accent/40"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-accent-tint font-mono text-xs font-semibold tabular-nums text-accent transition-colors group-hover:bg-accent group-hover:text-dark"
                  >
                    {step.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1rem] font-medium leading-snug text-ink sm:text-[1.04rem]">
                      {step.title}
                    </span>
                    {step.purpose && (
                      <span className="mt-1.5 block text-[0.92rem] leading-[1.7] text-ink-soft">
                        {step.purpose}
                      </span>
                    )}
                    {!step.hasContent && (
                      <span className="robo-kicker mt-2.5 inline-block rounded-full bg-shade px-2 py-0.5 font-label text-[9px] text-ink-soft">
                        尚未產生
                      </span>
                    )}
                  </span>
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 shrink-0 text-ink-soft transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
              </li>
              );
            })}
          </ol>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-hairline bg-surface/50 px-5 py-12 text-center">
            <EmptyMark className="text-ink-soft" size={110} />
            <p className="text-[0.95rem] text-ink-soft">此節點尚未規劃步驟。</p>
          </div>
        )}
      </section>

      <footer className="robo-kicker mt-20 border-t border-hairline pt-5 font-label text-[10px] text-ink-soft">
        {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
        {node.title}
      </footer>
    </article>
  );
}

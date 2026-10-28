import Markdown from "./Markdown.jsx";
import DotMatrix from "./DotMatrix.jsx";
import { tierDotClass } from "./Sidebar.jsx";
import { hashFor } from "../lib/route.mjs";

/**
 * Node detail view: title, goal, node lesson, and the step list in the order
 * declared by the node's `steps` array. Each step links to its own article.
 */
export default function NodeView({ course, node, onSelect }) {
  const prereqs = (node.prerequisites || [])
    .map((p) => {
      const pid = String(p).split("/").pop().replace(/\.md$/, "");
      return course.nodes.find((n) => n.id === pid) || null;
    })
    .filter(Boolean);

  const tier = course.tiers.find((t) => t.tier === node.tier);

  return (
    <article>
      <nav
        aria-label="麵包屑"
        className="robo-kicker flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
      >
        <span>{course.title}</span>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={`size-1.5 ${tierDotClass(node.tier)}`}
          />
          Tier {node.tier}
        </span>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <span className="text-ink">Node {node.globalOrder}</span>
      </nav>

      <header className="mt-4 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_190px]">
        <div>
          <p className="robo-kicker font-label text-[11px] text-ink-soft">
            Node <span className="doto text-accent">{String(node.globalOrder).padStart(2, "0")}</span>
            {tier ? ` · ${tier.name}` : ""}
          </p>
          <h1 className="mt-2 text-[2rem] font-medium leading-[1.15] tracking-[-1px] text-ink sm:text-[2.5rem]">
            {node.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            <span className="border border-ink bg-surface px-2 py-1">
              {node.globalOrder} / {course.nodes.length} 個節點
            </span>
            <span className="border border-ink bg-surface px-2 py-1">
              {node.steps.length} 個步驟
            </span>
            <span className="border border-ink bg-surface px-2 py-1">
              Tier {node.tier}
              {tier ? ` — ${tier.name}` : ""}
            </span>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="border-2 border-ink bg-surface p-2 shadow-[6px_6px_0_var(--robo-shadow)]">
            <DotMatrix variant="hexagon" height={150} />
          </div>
        </div>
      </header>

      {node.goal && (
        <div className="robo-card-hot mt-8 px-5 py-4 text-[1rem] leading-relaxed text-ink">
          <p className="robo-kicker mb-1.5 font-label text-[11px] font-medium text-accent">
            學習目標
          </p>
          {node.goal}
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
              className="border-2 border-ink bg-surface px-3 py-1 font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              ← {p.title}
            </button>
          ))}
        </div>
      )}

      {node.lessonIntro && (
        <div className="mt-7 text-ink/90">
          <Markdown>{node.lessonIntro}</Markdown>
        </div>
      )}

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
          <h2 className="robo-kicker font-label text-[11px] font-medium text-ink-soft">
            課程步驟
          </h2>
          <span className="font-mono text-[11px] tabular-nums text-ink-soft">
            {String(node.steps.length).padStart(2, "0")}
          </span>
        </div>

        {node.steps.length > 0 ? (
          <ol className="space-y-3">
            {node.steps.map((step) => (
              <li key={step.id}>
                <a
                  href={hashFor(course.subject, node.id, step.id)}
                  className="group robo-card robo-press flex items-start gap-4 px-4 py-4 hover:border-accent"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-8 shrink-0 place-items-center border-2 border-ink bg-paper font-mono text-xs font-semibold tabular-nums text-ink transition-colors group-hover:bg-accent group-hover:text-dark"
                  >
                    {step.order}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1rem] font-medium leading-snug text-ink sm:text-[1.05rem]">
                      {step.title}
                    </span>
                    {step.purpose && (
                      <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-ink-soft">
                        {step.purpose}
                      </span>
                    )}
                    {!step.hasContent && (
                      <span className="robo-kicker mt-2 inline-block border border-ink bg-shade px-1.5 py-0.5 font-label text-[10px] text-ink-soft">
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
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 shrink-0 text-ink-soft transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <div className="border-2 border-dashed border-ink/40 bg-surface px-5 py-10 text-center">
            <p className="text-[0.95rem] text-ink-soft">此節點尚未規劃步驟。</p>
          </div>
        )}
      </section>

      <footer className="robo-kicker mt-16 border-t-2 border-ink pt-4 font-label text-[11px] text-ink-soft">
        {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
        {node.title}
      </footer>
    </article>
  );
}

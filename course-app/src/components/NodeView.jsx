import Markdown from "./Markdown.jsx";
import { tierTextClass } from "./Sidebar.jsx";
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

  return (
    <article>
      <h1 className="border-b-2 border-accent pb-1.5 text-[1.7rem] font-semibold leading-tight sm:text-[2rem]">
        {node.title}
      </h1>
      <p className="font-label mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-wide text-ink-soft sm:text-sm">
        <span>
          Node {node.globalOrder}/{course.nodes.length}
        </span>
        <span aria-hidden="true">·</span>
        <span className={tierTextClass(node.tier)}>
          Tier {node.tier} —{" "}
          {course.tiers.find((t) => t.tier === node.tier)?.name}
        </span>
        <span aria-hidden="true">·</span>
        <span>{node.steps.length} Steps</span>
      </p>

      {node.goal && (
        <div className="mt-6 rounded-r-lg border-l-4 border-accent bg-accent-soft px-4 py-3 text-[0.95em]">
          {node.goal}
        </div>
      )}

      {prereqs.length > 0 && (
        <div className="font-label mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="uppercase tracking-[0.08em] text-ink-soft">前置</span>
          {prereqs.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="rounded-full border border-line bg-shade px-2.5 py-1 font-medium text-accent transition-colors hover:border-accent hover:bg-accent-soft"
            >
              ↰ {p.title}
            </button>
          ))}
        </div>
      )}

      {node.lessonIntro && (
        <div className="mt-5 text-ink/90">
          <Markdown>{node.lessonIntro}</Markdown>
        </div>
      )}

      <h3 className="font-label mt-8 mb-3 text-xs uppercase tracking-[0.08em] text-ink-soft">
        Steps
      </h3>
      {node.steps.length > 0 ? (
        <ol className="space-y-2.5">
          {node.steps.map((step) => (
            <li key={step.id}>
              <a
                href={hashFor(course.subject, node.id, step.id)}
                className="group flex items-start gap-3 rounded-lg border border-line bg-shade px-3.5 py-3 transition-colors hover:border-accent hover:bg-accent-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
                >
                  {step.order}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-medium text-ink sm:text-base">
                    {step.title}
                  </span>
                  {step.purpose && (
                    <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">
                      {step.purpose}
                    </span>
                  )}
                  {!step.hasContent && (
                    <span className="font-label mt-1 block text-[11px] uppercase tracking-wide text-ink-soft/70">
                      尚未產生
                    </span>
                  )}
                </span>
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-2 rounded-lg border border-dashed border-line px-5 py-8 text-center">
          <p className="text-sm text-ink-soft">此節點尚未規劃步驟。</p>
        </div>
      )}

      <footer className="mt-14 border-t border-line pt-4 text-xs text-ink-soft">
        <p>
          {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
          {node.title} · Generated from learning-center
        </p>
      </footer>
    </article>
  );
}

import Markdown from "./Markdown.jsx";
import { hashFor } from "../lib/route.mjs";
import { stepNeighbors } from "../lib/steps.mjs";

const BASE = import.meta.env.BASE_URL;

function StepLink({ course, node, step, direction }) {
  const next = direction === "next";
  return (
    <a
      href={hashFor(course.subject, node.id, step.id)}
      className={`group rounded-lg border border-line bg-shade px-3.5 py-3 transition-colors hover:border-accent hover:bg-accent-soft ${
        next ? "text-right" : ""
      }`}
    >
      <span className="font-label block text-[10px] uppercase tracking-[0.1em] text-ink-soft">
        {next ? "下一步" : "上一步"}
      </span>
      <span className="mt-0.5 block text-sm font-medium text-ink">
        {next ? `${step.title} →` : `← ${step.title}`}
      </span>
    </a>
  );
}

/** One step rendered as a full Markdown article. */
export default function StepView({ course, node, step }) {
  const assetBase = `${BASE}nodes/${encodeURIComponent(course.subject)}/${encodeURIComponent(node.id)}/`;
  const { previous, next } = stepNeighbors(node.steps, step.id);
  const sources = step.sources || [];

  return (
    <article>
      <a
        href={hashFor(course.subject, node.id)}
        className="font-label inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-accent"
      >
        ← {node.title}
      </a>
      <p className="font-label mt-2 text-xs tracking-wide text-ink-soft">
        Step {step.order} / {node.steps.length}
      </p>

      {step.hasContent ? (
        <div className="mt-4">
          <Markdown assetBase={assetBase}>{step.articleMd}</Markdown>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-line px-5 py-8 text-center">
          <p className="text-sm text-ink-soft">這一步的文章尚未產生。</p>
        </div>
      )}

      {sources.length > 0 && (
        <section className="mt-12 border-t border-line pt-5" aria-label="來源">
          <h2 className="font-label text-xs uppercase tracking-[0.08em] text-ink-soft">
            來源
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {sources.map((source, index) => (
              <li
                key={`${source.file}-${source.locator}-${index}`}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                title={source.file}
              >
                <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-[0.8em] text-ink">
                  {source.name}
                </code>
                <span className="font-label text-xs text-ink-soft">
                  {source.lines}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav
        aria-label="步驟導覽"
        className="mt-10 grid grid-cols-2 gap-3 border-t border-line pt-4"
      >
        {previous ? (
          <StepLink course={course} node={node} step={previous} direction="previous" />
        ) : (
          <span aria-hidden="true" />
        )}
        {next ? (
          <StepLink course={course} node={node} step={next} direction="next" />
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>

      <footer className="mt-8 border-t border-line pt-4 text-xs text-ink-soft">
        <p>
          {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
          {node.title} · Step {step.order}/{node.steps.length}
        </p>
      </footer>
    </article>
  );
}

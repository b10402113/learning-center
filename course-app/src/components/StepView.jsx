import Markdown from "./Markdown.jsx";
import { hashFor } from "../lib/route.mjs";

const BASE = import.meta.env.BASE_URL;

/** One step rendered as a full Markdown article. */
export default function StepView({ course, node, step }) {
  const assetBase = `${BASE}nodes/${encodeURIComponent(course.subject)}/${encodeURIComponent(node.id)}/`;

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

      <footer className="mt-14 border-t border-line pt-4 text-xs text-ink-soft">
        <p>
          {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
          {node.title} · Step {step.order}/{node.steps.length}
        </p>
      </footer>
    </article>
  );
}

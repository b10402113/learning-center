import Markdown from "./Markdown.jsx";
import Quiz from "./Quiz.jsx";
import { tierDotClass } from "./Sidebar.jsx";
import { hashFor } from "../lib/route.mjs";
import { stepNeighbors } from "../lib/steps.mjs";

const BASE = import.meta.env.BASE_URL;

function readingMinutes(markdown) {
  const chars = String(markdown || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_`~[\]()|!-]/g, "")
    .replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 450));
}

function StepLink({ course, node, step, direction }) {
  const next = direction === "next";
  return (
    <a
      href={hashFor(course.subject, node.id, step.id)}
      className={`group flex items-center gap-3 border-2 px-4 py-3.5 transition-colors ${
        next
          ? "border-ink bg-accent text-dark shadow-[6px_6px_0_rgba(28,26,22,0.9)] sm:flex-row-reverse"
          : "border-ink bg-surface text-ink shadow-[4px_4px_0_rgba(28,26,22,0.9)] hover:border-accent"
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid size-8 shrink-0 place-items-center border-2 border-ink ${
          next
            ? "bg-surface text-dark"
            : "bg-paper text-ink transition-colors group-hover:text-accent"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {next ? (
            <path d="m9 18 6-6-6-6" />
          ) : (
            <path d="m15 18-6-6 6-6" />
          )}
        </svg>
      </span>
      <span className={`min-w-0 flex-1 ${next ? "sm:text-right" : ""}`}>
        <span
          className={`robo-kicker block font-label text-[10px] font-medium ${
            next ? "text-ink/70" : "text-ink-soft"
          }`}
        >
          {next ? "下一步" : "上一步"}
        </span>
        <span className="mt-0.5 block truncate text-[0.95rem] font-medium">
          {step.title}
        </span>
      </span>
    </a>
  );
}

/** One step rendered as a full Markdown article. */
export default function StepView({ course, node, step }) {
  const assetBase = `${BASE}nodes/${encodeURIComponent(course.subject)}/${encodeURIComponent(node.id)}/`;
  const { previous, next } = stepNeighbors(node.steps, step.id);
  const sources = step.sources || [];
  const quizzes = Array.isArray(step.quizzes) ? step.quizzes : [];
  const minutes = readingMinutes(step.articleMd);
  // The article body repeats the step title as an H1; the header already
  // renders it, so drop the leading heading before rendering.
  const body = String(step.articleMd || "").replace(/^\s*#\s+.*(?:\r?\n)+/, "");

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
        <a
          href={hashFor(course.subject, node.id)}
          className="transition-colors hover:text-accent"
        >
          {node.title}
        </a>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <span className="text-ink">Step {step.order}</span>
      </nav>

      <header className="mt-4">
        <p className="robo-kicker flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`size-1.5 ${tierDotClass(node.tier)}`}
            />
            Tier {node.tier}
          </span>
          <span aria-hidden="true" className="text-ink-soft/50">
            ·
          </span>
          <span className="font-mono text-[11px] tabular-nums">
            Step {String(step.order).padStart(2, "0")} /{" "}
            {String(node.steps.length).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="text-ink-soft/50">
            ·
          </span>
          <span>約 {minutes} 分鐘</span>
        </p>
        <h1 className="mt-2.5 text-[1.95rem] font-medium leading-[1.2] tracking-[-1px] text-ink sm:text-[2.4rem]">
          {step.title}
        </h1>
      </header>

      <div className="mt-8 border-t-2 border-ink pt-8">
        {step.hasContent ? (
          <Markdown assetBase={assetBase}>{body}</Markdown>
        ) : (
          <div className="border-2 border-dashed border-ink/40 bg-surface px-5 py-12 text-center">
            <p className="text-[0.95rem] text-ink-soft">這一步的文章尚未產生。</p>
          </div>
        )}
      </div>

      {quizzes.length > 0 && (
        <section
          className="mt-14 border-t-2 border-ink pt-8"
          aria-label="自我檢查"
        >
          <p className="robo-kicker font-label text-[11px] font-medium text-accent">
            SELF CHECK
          </p>
          <h2 className="mt-2 text-[1.45rem] font-medium leading-snug text-ink">
            自我檢查
          </h2>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            讀完之後，試著回答這幾題。
          </p>
          <div className="mt-6">
            {quizzes.map((quiz, index) => (
              <Quiz
                key={`${index}-${quiz.question}`}
                quiz={quiz}
              />
            ))}
          </div>
        </section>
      )}

      {sources.length > 0 && (
        <section
          className="mt-14 border-2 border-ink bg-shade px-4 py-4 shadow-[6px_6px_0_rgba(28,26,22,0.9)] sm:px-5"
          aria-label="來源"
        >
          <h2 className="robo-kicker font-label text-[11px] font-medium text-ink">
            來源
          </h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {sources.map((source, index) => (
              <li
                key={`${source.file}-${source.locator}-${index}`}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                title={source.file}
              >
                <code className="border border-ink bg-surface px-1.5 py-0.5 font-mono text-[0.78em] text-ink">
                  {source.name}
                </code>
                <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                  {source.lines}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav
        aria-label="步驟導覽"
        className="mt-12 grid grid-cols-1 gap-3 border-t-2 border-ink pt-6 sm:grid-cols-2"
      >
        {previous ? (
          <StepLink
            course={course}
            node={node}
            step={previous}
            direction="previous"
          />
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}
        {next ? (
          <StepLink
            course={course}
            node={node}
            step={next}
            direction="next"
          />
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}
      </nav>

      <footer className="robo-kicker mt-12 border-t-2 border-ink pt-4 font-label text-[11px] text-ink-soft">
        {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
        {node.title} · Step {step.order}/{node.steps.length}
      </footer>
    </article>
  );
}

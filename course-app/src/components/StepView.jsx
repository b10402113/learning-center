import { useEffect, useRef, useState } from "react";
import Markdown from "./Markdown.jsx";
import Quiz from "./Quiz.jsx";
import ConceptGraph from "./ConceptGraph.jsx";
import { ConceptList, TocDetails } from "./ContextRail.jsx";
import { railBlocks } from "../lib/blocks.mjs";
import { tierDotClass } from "./Sidebar.jsx";
import { articleForClipboard, copyText } from "../lib/clipboard.mjs";
import { pathFor } from "../lib/route.mjs";
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
      href={pathFor(course.subject, node.id, step.id)}
      className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 ring-1 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift ${
        next
          ? "bg-accent-tint ring-accent/30 hover:ring-accent/50 sm:flex-row-reverse"
          : "bg-surface ring-hairline hover:ring-accent/40"
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid size-8 shrink-0 place-items-center rounded-full ${
          next
            ? "bg-accent text-dark"
            : "bg-surface text-ink-soft ring-1 ring-hairline transition-colors group-hover:text-accent"
        }`}
      >
        <svg
          width="15"
          height="15"
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
          className={`robo-kicker block font-label text-[9px] font-medium ${
            next ? "text-accent" : "text-ink-soft"
          }`}
        >
          {next ? "下一步" : "上一步"}
        </span>
        <span className="mt-0.5 block truncate text-[0.95rem] font-medium text-ink">
          {step.title}
        </span>
      </span>
    </a>
  );
}

function CopyIcon({ done }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {done ? (
        <path d="m4 12 5 5L20 6" />
      ) : (
        <>
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
        </>
      )}
    </svg>
  );
}

const COPY_LABELS = {
  idle: "複製全文",
  copied: "已複製",
  failed: "複製失敗",
};

function CopyArticleButton({ text }) {
  const [state, setState] = useState("idle");
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const onClick = async () => {
    window.clearTimeout(timerRef.current);
    const ok = await copyText(text);
    setState(ok ? "copied" : "failed");
    timerRef.current = window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title="複製這一步的完整文章（Markdown）"
      aria-label="複製這一步的完整文章"
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.1em] ring-1 transition-colors ${
        state === "copied"
          ? "bg-accent text-dark ring-accent"
          : state === "failed"
            ? "bg-shade text-ink-soft ring-hairline"
            : "bg-surface/70 text-ink ring-hairline hover:text-accent hover:ring-accent/40"
      }`}
    >
      <CopyIcon done={state === "copied"} />
      <span aria-live="polite">{COPY_LABELS[state]}</span>
    </button>
  );
}

/** One step rendered as a full Markdown article. */
export default function StepView({
  course,
  node,
  step,
  onNavigate = null,
  onOpenBlock = null,
}) {
  const assetBase = `${BASE}nodes/${encodeURIComponent(course.subject)}/${encodeURIComponent(node.id)}/`;
  const { previous, next } = stepNeighbors(node.steps, step.id);
  const sources = step.sources || [];
  const quizzes = Array.isArray(step.quizzes) ? step.quizzes : [];
  const headings = Array.isArray(step.headings) ? step.headings : [];
  const hasBlocks = railBlocks(course, step).length > 0;
  const hasRailContent = headings.length >= 2 || hasBlocks;
  const minutes = readingMinutes(step.articleMd);
  // The article body repeats the step title as an H1; the header already
  // renders it, so drop the leading heading before rendering.
  const body = String(step.articleMd || "").replace(/^\s*#\s+.*(?:\r?\n)+/, "");
  const copyMarkdown = step.hasContent
    ? articleForClipboard(step.articleMd, {
        title: step.title,
        assetBase,
        origin: window.location.href,
      })
    : "";

  return (
    <div className="w-full">
      <article className="mx-auto min-w-0 w-full max-w-[816px] px-0 lg:px-8 xl:px-12">
        <nav
          aria-label="麵包屑"
          className="flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
        >
          <span>{course.title}</span>
          <span aria-hidden="true" className="text-hairline">
            /
          </span>
          <a
            href={pathFor(course.subject, node.id)}
            className="transition-colors hover:text-accent"
          >
            {node.title}
          </a>
          <span aria-hidden="true" className="text-hairline">
            /
          </span>
          <span className="text-ink">Step {step.order}</span>
        </nav>

        <header className="mt-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-label text-[10px] tracking-[0.04em] text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${tierDotClass(node.tier)}`}
                  />
                  Tier {node.tier}
                </span>
                <span aria-hidden="true" className="text-hairline">
                  ·
                </span>
                <span className="font-mono tabular-nums">
                  Step {String(step.order).padStart(2, "0")} /{" "}
                  {String(node.steps.length).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="text-hairline">
                  ·
                </span>
                <span>約 {minutes} 分鐘</span>
              </p>
              <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.18] tracking-[-0.5px] text-ink sm:text-[2.5rem]">
                {step.title}
              </h1>
              {step.author && (
                <p className="mt-2.5 font-mono text-[10px] text-ink-soft/80">
                  模型 {step.author}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {copyMarkdown && <CopyArticleButton text={copyMarkdown} />}
            </div>
          </div>
        </header>

        <TocDetails
          headings={headings}
          className={`mt-8 ${hasRailContent ? "xl:hidden" : ""}`}
        />

        <div className="mt-8 border-t border-hairline pt-8">
          {step.hasContent ? (
            <Markdown
              assetBase={assetBase}
              subjectId={course.subject}
              blockIds={(course.blocks || []).map((block) => block.id)}
              onNavigate={onNavigate}
              onOpenBlock={onOpenBlock}
            >
              {body}
            </Markdown>
          ) : (
            <div className="rounded-2xl border border-dashed border-hairline bg-surface/50 px-5 py-14 text-center">
              <p className="text-[0.95rem] text-ink-soft">
                這一步的文章尚未產生。
              </p>
            </div>
          )}
        </div>

        {hasBlocks && (
          <section
            className={`mt-12 ${hasRailContent ? "xl:hidden" : ""}`}
            aria-label="本步知識點"
          >
            <p className="robo-kicker font-label text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              本步知識點
            </p>
            <ConceptList
              course={course}
              step={step}
              onNavigate={onNavigate}
              onOpenBlock={onOpenBlock}
              className="mt-4"
            />
          </section>
        )}

        <ConceptGraph
          course={course}
          step={step}
          onNavigate={onNavigate}
          onOpenBlock={onOpenBlock}
        />

        {quizzes.length > 0 && (
          <section
            className="mt-16 border-t border-hairline pt-8"
            aria-label="自我檢查"
          >
            <p className="robo-kicker font-label text-[10px] font-medium text-accent">
              Self Check
            </p>
            <h2 className="mt-2 font-display text-[1.5rem] font-semibold leading-snug text-ink">
              自我檢查
            </h2>
            <p className="mt-2 text-[0.95rem] text-ink-soft">
              讀完之後，試著回答這幾題。
            </p>
            <div className="mt-6">
              {quizzes.map((quiz, index) => (
                <Quiz key={`${index}-${quiz.question}`} quiz={quiz} />
              ))}
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <section
            className="mt-16 rounded-2xl bg-shade/55 px-5 py-5 ring-1 ring-hairline"
            aria-label="來源"
          >
            <h2 className="robo-kicker font-label text-[10px] font-medium text-ink-soft">
              來源
            </h2>
            <ul className="mt-3 space-y-2 text-[0.92rem]">
              {sources.map((source, index) => (
                <li
                  key={`${source.file}-${source.locator}-${index}`}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                  title={source.file}
                >
                  <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.78em] text-ink ring-1 ring-hairline">
                    {source.name}
                  </code>
                  <span className="font-mono text-[10px] tabular-nums text-ink-soft">
                    {source.lines}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav
          aria-label="步驟導覽"
          className="mt-14 grid grid-cols-1 gap-3 border-t border-hairline pt-6 sm:grid-cols-2"
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

        <footer className="robo-kicker mt-14 border-t border-hairline pt-5 font-label text-[10px] text-ink-soft">
          {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
          {node.title} · Step {step.order}/{node.steps.length}
        </footer>
      </article>
    </div>
  );
}

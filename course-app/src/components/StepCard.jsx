import Markdown from "./Markdown.jsx";

const BASE = import.meta.env.BASE_URL;

/**
 * Collapsible step card.
 * Collapsed: number, title, dep chips, learning-goal excerpt + "Read more".
 * Expanded ("read more"): full lesson rendered as markdown, course-page link,
 * source references.
 */
export default function StepCard({ node, step, allSteps, open, onToggle }) {
  const key = `${node.id}/${step.id}`;
  const depSteps = step.deps
    .map((d) => allSteps.find((s) => s.id === d))
    .filter(Boolean);
  const depLabel =
    depSteps.length > 0
      ? `after Step ${depSteps.map((d) => d.order).join("、")}`
      : null;

  return (
    <li className="overflow-hidden rounded-lg border border-line bg-shade transition-shadow">
      {/* Header — always visible, toggles expand */}
      <button
        onClick={onToggle}
        aria-expanded={open}
        className={`flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-accent-soft sm:gap-3.5 sm:px-4 ${
          open ? "bg-accent-soft" : ""
        }`}
      >
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
        >
          {step.order}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.95rem] font-medium text-ink sm:text-base">
            {step.title}
          </span>
          {depLabel && (
            <span className="font-label mt-0.5 block text-[11px] tracking-wide text-ink-soft">
              ↳ {depLabel}
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
          className={`shrink-0 text-ink-soft transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Collapsed body — short excerpt + explicit Read more */}
      {!open && (
        <div className="border-t border-line bg-paper px-3.5 py-3 sm:px-4">
          {step.learningGoal && (
            <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
              {step.learningGoal}
            </p>
          )}
          {step.hasContent ? (
            <button
              onClick={onToggle}
              className="font-label mt-2 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-xs font-bold uppercase tracking-[0.08em] text-accent transition-colors hover:text-accent/80"
            >
              閱讀更多 Read more
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <p className="font-label mt-2 text-xs uppercase tracking-wide text-ink-soft/70">
              內容待生成
            </p>
          )}
        </div>
      )}

      {/* Expanded body — full lesson */}
      {open && (
        <div className="border-t border-line bg-paper px-3.5 py-4 sm:px-5">
          {step.learningGoal && (
            <div className="mb-4 rounded-r-lg border-l-[3px] border-accent bg-accent-soft px-3.5 py-2.5 text-sm leading-relaxed sm:px-4">
              <strong className="font-semibold">學習目標</strong>
              <span className="text-ink-soft">：</span>
              {step.learningGoal}
            </div>
          )}

          {step.hasContent ? (
            <Markdown>{step.lessonMd}</Markdown>
          ) : (
            <p className="text-sm italic text-ink-soft">
              此步驟的課程內容尚未生成（draft）。
            </p>
          )}

          {step.coursePage && (
            <a
              href={`${BASE}lessons/${step.coursePage}`}
              target="_blank"
              rel="noreferrer"
              className="font-label mt-4 inline-flex items-center gap-1.5 rounded-md border border-line bg-shade px-3 py-1.5 text-xs font-semibold tracking-wide text-accent transition-colors hover:border-accent hover:bg-accent-soft"
            >
              ↗ 開啟完整課程頁面
            </a>
          )}

          {step.sources?.length > 0 && (
            <div className="mt-4 border-t border-line pt-2.5">
              <p className="font-label text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                Sources
              </p>
              <ul className="mt-1 space-y-0.5">
                {step.sources.map((s, i) => (
                  <li key={i} className="text-xs leading-relaxed text-ink-soft">
                    · {s.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onToggle}
            className="font-label mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-accent"
          >
            收合 Collapse
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
}

import { useMemo, useState } from "react";
import DotMatrix from "./DotMatrix.jsx";
import { hashFor } from "../lib/route.mjs";
import { SUBJECT_SORTS, sortSubjects } from "../lib/sort.mjs";

const SORT_KEY = "lc.subjects-sort";

function initialSort() {
  try {
    const saved = window.localStorage.getItem(SORT_KEY);
    return SUBJECT_SORTS.some((s) => s.id === saved) ? saved : "default";
  } catch {
    return "default";
  }
}

/**
 * Subject directory: the entry point of the app. Each card links to that
 * subject's course, so switching subjects is a navigation, not a dropdown.
 */
export default function SubjectsView({ subjects }) {
  const [sort, setSort] = useState(initialSort);
  const sorted = useMemo(() => sortSubjects(subjects, sort), [subjects, sort]);
  const totalNodes = subjects.reduce((sum, s) => sum + (s.nodes || 0), 0);
  const totalSteps = subjects.reduce((sum, s) => sum + (s.steps || 0), 0);

  const chooseSort = (id) => {
    setSort(id);
    try {
      window.localStorage.setItem(SORT_KEY, id);
    } catch {
      /* private mode */
    }
  };

  return (
    <article>
      <header className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_190px]">
        <div>
          <p className="robo-kicker font-label text-[11px] text-ink-soft">
            Learning Center
          </p>
          <h1 className="mt-2 text-[2rem] font-medium leading-[1.15] tracking-[-1px] text-ink sm:text-[2.5rem]">
            課程清單
          </h1>
          <p className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
            選一門課開始讀。每一門課都是一份可依序讀完的學習路徑，從觀念到能指著程式碼說出所以然。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 font-label text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            <span className="border border-ink bg-surface px-2 py-1">
              {subjects.length} 門課
            </span>
            <span className="border border-ink bg-surface px-2 py-1">
              {totalNodes} 個節點
            </span>
            <span className="border border-ink bg-surface px-2 py-1">
              {totalSteps} 個步驟
            </span>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="border-2 border-ink bg-surface p-2 shadow-[6px_6px_0_rgba(28,26,22,0.9)]">
            <DotMatrix variant="hexagon" height={150} />
          </div>
        </div>
      </header>

      <section className="mt-12">
        <div className="border-b-2 border-ink pb-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="robo-kicker font-label text-[11px] font-medium text-ink-soft">
              Subjects
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-ink-soft">
              {String(sorted.length).padStart(2, "0")}
            </span>
          </div>
          <div
            className="mt-3 flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="課程排序"
          >
            <span className="robo-kicker mr-1 font-label text-[10px] text-ink-soft">
              排序
            </span>
            {SUBJECT_SORTS.map((option) => {
              const active = option.id === sort;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => chooseSort(option.id)}
                  aria-pressed={active}
                  className={`border-2 px-2 py-0.5 font-label text-[11px] transition-colors ${
                    active
                      ? "border-accent bg-surface font-medium text-accent shadow-[2px_2px_0_var(--color-accent)]"
                      : "border-ink bg-surface text-ink-soft hover:border-accent hover:text-accent"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sorted.map((subject, index) => (
            <li key={subject.id}>
              <a
                href={hashFor(subject.id)}
                className="group robo-card robo-press flex h-full flex-col px-4 py-4 hover:border-accent"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {subject.updated && (
                    <span className="font-mono text-[10px] tabular-nums text-ink-soft">
                      更新 {subject.updated}
                    </span>
                  )}
                </span>
                <span className="mt-3 block text-[1.2rem] font-medium leading-snug text-ink">
                  {subject.title}
                </span>
                {subject.goal && (
                  <span className="mt-2 block flex-1 text-[0.95rem] leading-relaxed text-ink-soft line-clamp-4">
                    {subject.goal}
                  </span>
                )}
                <span className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <span className="robo-kicker font-label text-[10px] text-ink-soft">
                    {subject.nodes || 0} 節點
                    {subject.steps ? ` · ${subject.steps} 步驟` : ""}
                  </span>
                  <span className="flex items-center gap-2 font-label text-[11px] uppercase tracking-[0.1em] text-ink transition-colors group-hover:text-accent">
                    開始閱讀
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
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <footer className="robo-kicker mt-16 border-t-2 border-ink pt-4 font-label text-[11px] text-ink-soft">
        Learning Center · {subjects.length} subjects
      </footer>
    </article>
  );
}

import { useMemo, useState } from "react";
import { ChapterRule, NodeGlyph, OrbitMark } from "./Glyphs.jsx";
import { pathFor } from "../lib/route.mjs";
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
      <header className="grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <p className="robo-kicker font-label text-[10px] text-accent">
            Learning Center
          </p>
          <h1 className="mt-3 font-display text-[2.35rem] font-semibold leading-[1.14] tracking-[-0.5px] text-ink sm:text-[2.9rem]">
            課程清單
          </h1>
          <p className="mt-4 max-w-[52ch] text-[1.02rem] leading-[1.85] text-ink-soft">
            選一門課開始讀。每一門課都是一份可依序讀完的學習路徑，從觀念到能指著程式碼說出所以然。
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-ink-soft">
            <span>{subjects.length} 門課</span>
            <span aria-hidden="true" className="text-hairline">
              ·
            </span>
            <span>{totalNodes} 個節點</span>
            <span aria-hidden="true" className="text-hairline">
              ·
            </span>
            <span>{totalSteps} 個步驟</span>
          </div>
        </div>
        <div className="hidden justify-center sm:flex">
          <OrbitMark className="h-44 w-full max-w-[240px] text-ink" />
        </div>
      </header>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
          <div>
            <p className="robo-kicker font-label text-[10px] text-ink-soft">
              Subjects
            </p>
            <h2 className="mt-1 font-display text-[1.15rem] font-semibold text-ink">
              所有課程
            </h2>
          </div>
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="group"
            aria-label="課程排序"
          >
            <span className="robo-kicker mr-1 font-label text-[9px] text-ink-soft">
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
                  className={`rounded-full px-3 py-1 font-label text-[11px] transition-colors ${
                    active
                      ? "bg-accent-tint font-medium text-accent ring-1 ring-accent/30"
                      : "text-ink-soft hover:bg-surface hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <ChapterRule className="mb-5" />

        <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sorted.map((subject, index) => (
            <li key={subject.id}>
              <a
                href={pathFor(subject.id)}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-surface p-5 ring-1 ring-hairline shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-accent/40"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <NodeGlyph
                  seed={subject.id}
                  size={18}
                  className="absolute right-5 top-5 text-ink-soft/60 transition-colors group-hover:text-accent"
                />
                <span className="flex items-center gap-3 font-mono text-[10px] tabular-nums text-ink-soft">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {subject.updated && (
                    <>
                      <span aria-hidden="true" className="text-hairline">
                        ·
                      </span>
                      <span>更新 {subject.updated}</span>
                    </>
                  )}
                </span>
                <span className="mt-4 block font-display text-[1.24rem] font-semibold leading-snug text-ink">
                  {subject.title}
                </span>
                {subject.goal && (
                  <span className="mt-2 flex-1 text-[0.92rem] leading-[1.75] text-ink-soft line-clamp-3">
                    {subject.goal}
                  </span>
                )}
                <span className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-hairline/80 pt-4">
                  <span className="robo-kicker font-label text-[9px] text-ink-soft">
                    {subject.nodes || 0} 節點
                    {subject.steps ? ` · ${subject.steps} 步驟` : ""}
                  </span>
                  <span className="flex items-center gap-1.5 font-label text-[11px] font-medium tracking-[0.02em] text-ink transition-colors group-hover:text-accent">
                    開始閱讀
                    <svg
                      aria-hidden="true"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-1"
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

      <footer className="robo-kicker mt-20 border-t border-hairline pt-5 font-label text-[10px] text-ink-soft">
        Learning Center · {subjects.length} subjects
      </footer>
    </article>
  );
}

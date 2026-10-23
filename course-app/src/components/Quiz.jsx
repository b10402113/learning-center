import { useState } from "react";
import { parseQuiz } from "../lib/quiz.mjs";

/**
 * Interactive quiz rendered from a fenced `quiz` block. A wrong pick can be
 * retried; a correct pick locks the question and reveals the explanation.
 */
export default function Quiz({ source }) {
  const quiz = parseQuiz(source);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());

  if (!quiz) return null;

  const pick = (index) => {
    if (solved) return;
    if (index === quiz.answer) {
      setSolved(true);
      return;
    }
    setWrong((current) => new Set(current).add(index));
  };

  return (
    <section
      className="my-8 rounded-lg border border-line bg-shade px-4 py-5 sm:px-5"
      aria-label="練習題"
    >
      <p className="font-label text-[10px] uppercase tracking-[0.12em] text-ink-soft">
        練習題
      </p>
      <p className="mt-1 text-base font-medium leading-relaxed text-ink">
        {quiz.question}
      </p>
      <ol className="mt-4 space-y-2">
        {quiz.options.map((option, index) => {
          const isWrong = wrong.has(index);
          const isCorrect = solved && index === quiz.answer;
          return (
            <li key={`${index}-${option}`}>
              <button
                type="button"
                onClick={() => pick(index)}
                disabled={solved}
                aria-pressed={isCorrect || isWrong}
                className={`flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left text-sm leading-relaxed transition-colors ${
                  isCorrect
                    ? "border-good bg-good-bg text-ink"
                    : isWrong
                      ? "border-bad bg-bad-bg text-ink"
                      : "border-line bg-paper text-ink hover:border-accent hover:bg-accent-soft"
                } ${solved && !isCorrect ? "opacity-60" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                    isCorrect
                      ? "border-good text-good"
                      : isWrong
                        ? "border-bad text-bad"
                        : "border-line text-ink-soft"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div aria-live="polite" className="mt-3 text-sm">
        {solved ? (
          <p className="text-good">
            答對了 ✓<span className="ml-2 text-ink/80">{quiz.explain}</span>
          </p>
        ) : wrong.size > 0 ? (
          <p className="text-bad">再想想，答案不是這個。</p>
        ) : null}
      </div>
    </section>
  );
}

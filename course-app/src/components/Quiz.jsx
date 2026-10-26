import { useState } from "react";
import { parseQuiz } from "../lib/quiz.mjs";

/**
 * Interactive quiz. A wrong pick can be retried; a correct pick locks the
 * question and reveals the explanation.
 */
export default function Quiz({ source, quiz: providedQuiz }) {
  const quiz = providedQuiz ?? parseQuiz(source);
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
      className="robo-card my-9 px-5 py-5"
      aria-label="練習題"
    >
      <p className="robo-kicker font-label text-[11px] font-medium text-accent">
        練習題
      </p>
      <p className="mt-2 text-[1.05rem] font-medium leading-relaxed text-ink">
        {quiz.question}
      </p>
      <ol className="mt-5 list-none space-y-2.5 !pl-0">
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
                className={`flex w-full items-start gap-3 border-2 px-3 py-2.5 text-left text-[0.95rem] leading-relaxed transition-colors ${
                  isCorrect
                    ? "border-accent bg-surface text-ink shadow-[3px_3px_0_var(--color-accent)]"
                    : isWrong
                      ? "border-ink bg-shade text-ink-soft"
                      : "border-ink bg-paper text-ink hover:border-accent hover:bg-surface"
                } ${solved && !isCorrect ? "opacity-55" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center border-2 font-mono text-[11px] font-semibold ${
                    isCorrect
                      ? "border-accent text-accent"
                      : isWrong
                        ? "border-ink text-ink-soft"
                        : "border-ink text-ink-soft"
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
      <div aria-live="polite" className="mt-4 text-[0.95rem]">
        {solved ? (
          <p className="text-accent">
            答對了 ✓<span className="ml-2 text-ink/80">{quiz.explain}</span>
          </p>
        ) : wrong.size > 0 ? (
          <p className="text-ink-soft">再想想，答案不是這個。</p>
        ) : null}
      </div>
    </section>
  );
}

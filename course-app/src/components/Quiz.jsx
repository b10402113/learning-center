import { useRef, useState } from "react";
import { parseQuiz } from "../lib/quiz.mjs";
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion.mjs";

const NUDGE_KEYFRAMES = [
  { transform: "translateX(-2px)" },
  { transform: "translateX(2px)" },
  { transform: "translateX(0)" },
];

/**
 * Interactive quiz. A wrong pick can be retried; a correct pick locks the
 * question and reveals the explanation.
 */
export default function Quiz({
  source,
  quiz: providedQuiz,
  solved: solvedProp,
  onSolved,
}) {
  const quiz = providedQuiz ?? parseQuiz(source);
  const [localSolved, setLocalSolved] = useState(false);
  const [wrong, setWrong] = useState(() => new Set());
  const solved = solvedProp ?? localSolved;
  const reduced = usePrefersReducedMotion();
  const optionsRef = useRef(null);
  const nudgeRef = useRef(null);

  if (!quiz) return null;

  // One quiet push, no loop: a wrong pick nudges the list once and stops.
  const nudge = () => {
    const list = optionsRef.current;
    if (reduced || !list || typeof list.animate !== "function") return;
    nudgeRef.current?.cancel();
    nudgeRef.current = list.animate(NUDGE_KEYFRAMES, {
      duration: 180,
      easing: "ease-in-out",
    });
  };

  const pick = (index) => {
    if (solved) return;
    if (index === quiz.answer) {
      setLocalSolved(true);
      onSolved?.();
      return;
    }
    setWrong((current) => new Set(current).add(index));
    nudge();
  };

  return (
    <section
      className="my-8 rounded-2xl bg-surface px-5 py-5 shadow-soft ring-1 ring-hairline"
      aria-label="練習題"
    >
      <p className="robo-kicker font-label text-[9.5px] font-medium text-accent">
        練習題
      </p>
      <p className="mt-2 text-[1.05rem] font-medium leading-relaxed text-ink">
        {quiz.question}
      </p>
      <ol
        ref={optionsRef}
        className="mt-5 list-none space-y-2.5 !pl-0"
      >
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
                className={`flex w-full origin-center items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-[0.95rem] leading-relaxed transition-[transform,scale,background-color,border-color,color,opacity] duration-[160ms] active:scale-[0.995] active:duration-[120ms] ${
                  isCorrect
                    ? "border-accent/50 bg-accent-tint text-ink"
                    : isWrong
                      ? "border-hairline bg-shade/60 text-ink-soft"
                      : "border-hairline bg-paper text-ink hover:border-accent/40 hover:bg-surface"
                } ${solved && !isCorrect ? "opacity-55" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-semibold ${
                    isCorrect
                      ? "border-accent text-accent"
                      : isWrong
                        ? "border-hairline text-ink-soft"
                        : "border-hairline text-ink-soft"
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
          <p className="quiz-explain flex items-start gap-2 text-accent">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="quiz-check mt-0.5 shrink-0"
            >
              <path d="m4 12 5 5L20 6" pathLength="1" />
            </svg>
            <span>
              答對了<span className="ml-2 text-ink/80">{quiz.explain}</span>
            </span>
          </p>
        ) : wrong.size > 0 ? (
          <p className="text-ink-soft">再想想，答案不是這個。</p>
        ) : null}
      </div>
    </section>
  );
}

import { useState } from "react";
import {
  completionDelayMs,
  quizDirection,
  quizEnterOffset,
} from "../lib/motion.mjs";
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion.mjs";
import Quiz from "./Quiz.jsx";

/**
 * One quiz at a time. A correct pick records the question; the learner moves
 * on with the next button, or can skip ahead and step back at any time.
 */
export default function QuizDeck({ quizzes }) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(() => new Set());
  const [direction, setDirection] = useState("next");
  const [hasMoved, setHasMoved] = useState(false);
  const reduced = usePrefersReducedMotion();

  if (quizzes.length === 0) return null;

  const total = quizzes.length;
  const finished = index >= total;
  const enterFrom = `${quizEnterOffset(direction)}px`;
  const finishDelay = (order) => (reduced ? 0 : completionDelayMs(order));

  const goTo = (target) => {
    const next = Math.max(0, Math.min(total, target));
    if (next !== index) {
      setDirection(quizDirection(index, next));
      setHasMoved(true);
    }
    setIndex(next);
  };

  const handleSolved = (solvedIndex) => {
    setAnswered((current) => new Set(current).add(solvedIndex));
  };

  const restart = () => {
    setAnswered(new Set());
    setDirection("next");
    setHasMoved(true);
    setIndex(0);
  };

  return (
    <div>
      {finished ? (
        <div className="rounded-2xl bg-surface px-5 py-8 text-center shadow-soft ring-1 ring-hairline">
          <p
            className="quiz-finish-item robo-kicker font-label text-[9.5px] font-medium text-accent"
            style={{ "--quiz-delay": `${finishDelay(0)}ms` }}
          >
            完成
          </p>
          <p
            className="quiz-finish-item mt-3 text-[1.05rem] font-medium text-ink"
            style={{ "--quiz-delay": `${finishDelay(1)}ms` }}
          >
            你答對了 {answered.size} / {total} 題
          </p>
          <p
            className="quiz-finish-item mt-2 text-[0.95rem] text-ink-soft"
            style={{ "--quiz-delay": `${finishDelay(2)}ms` }}
          >
            想再確認一次，可以重新作答。
          </p>
          <button
            type="button"
            onClick={restart}
            style={{ "--quiz-delay": `${finishDelay(3)}ms` }}
            className="quiz-finish-item mt-5 inline-flex items-center gap-2 rounded-full bg-accent-tint px-4 py-2 font-label text-[10px] uppercase tracking-[0.1em] text-ink ring-1 ring-accent/30 transition-colors hover:ring-accent/50"
          >
            重新作答
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <p
              aria-live="polite"
              className="font-mono text-[11px] tabular-nums text-ink-soft"
            >
              第 {index + 1} / {total} 題
            </p>
            <div className="flex items-center gap-1.5">
              {quizzes.map((_, dot) => (
                <span
                  key={dot}
                  aria-hidden="true"
                  className={`quiz-dot size-1.5 rounded-full ${
                    dot === index
                      ? "is-active bg-accent"
                      : answered.has(dot)
                        ? "bg-accent/45"
                        : "bg-hairline"
                  }`}
                />
              ))}
            </div>
          </div>

          <div
            key={index}
            style={{ "--quiz-from": enterFrom }}
            className={hasMoved ? "quiz-enter" : undefined}
          >
            <Quiz
              quiz={quizzes[index]}
              solved={answered.has(index)}
              onSolved={() => handleSolved(index)}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 font-label text-[10px] uppercase tracking-[0.1em] text-ink ring-1 ring-hairline transition-colors hover:text-accent hover:ring-accent/40 disabled:pointer-events-none disabled:opacity-40"
            >
              上一題
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-3.5 py-2 font-label text-[10px] uppercase tracking-[0.1em] text-ink ring-1 ring-accent/30 transition-colors hover:ring-accent/50"
            >
              {index === total - 1 ? "完成" : "下一題"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

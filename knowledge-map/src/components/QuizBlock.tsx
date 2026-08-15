import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import type { QuizQuestion } from "../lib/types";

interface QuizBlockProps {
  questions: QuizQuestion[];
  onSolved?: () => void;
}

/**
 * In-app multiple-choice self-test for a `question` element. The learner picks
 * an option per question; a wrong pick shows feedback and can be retried, a
 * correct pick locks that question. Once every question is answered correctly
 * `onSolved` fires once — the completion toggle stays locked until then.
 */
export function QuizBlock({ questions, onSolved }: QuizBlockProps) {
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  const [wrong, setWrong] = useState<number[]>([]);
  const solvedRef = useRef(false);

  // A question element with no questions is malformed — never auto-solve it.
  const allCorrect = questions.length > 0 && questions.every((q, i) => picks[i] === q.answer);

  useEffect(() => {
    if (allCorrect && !solvedRef.current) {
      solvedRef.current = true;
      onSolved?.();
    }
  }, [allCorrect, onSolved]);

  if (questions.length === 0) return null;

  function pick(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex];
    if (picks[questionIndex] === question.answer) return;
    setPicks((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
    setWrong((prev) =>
      optionIndex === question.answer
        ? prev.filter((i) => i !== questionIndex)
        : prev.includes(questionIndex)
          ? prev
          : [...prev, questionIndex],
    );
  }

  return (
    <div className="quiz-block" data-testid="quiz-block">
      {questions.map((q, qi) => {
        const locked = picks[qi] === q.answer;
        const isWrong = wrong.includes(qi);
        return (
          <div
            key={qi}
            className={cn("quiz-question", locked ? "quiz-solved" : "", isWrong ? "quiz-wrong" : "")}
          >
            <p className="quiz-prompt">{q.question}</p>
            <div className="quiz-options" role="radiogroup" aria-label={q.question}>
              {q.options.map((option, oi) => {
                const selected = picks[qi] === oi;
                const correct = locked && oi === q.answer;
                return (
                  <button
                    key={oi}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={locked}
                    onClick={() => pick(qi, oi)}
                    className={cn(
                      "quiz-option",
                      selected ? "quiz-option-selected" : "",
                      correct ? "quiz-option-correct" : "",
                      selected && !correct ? "quiz-option-wrong" : "",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {isWrong ? (
              <p className="quiz-feedback quiz-feedback-wrong">答錯了，再試一次。</p>
            ) : locked ? (
              <p className="quiz-feedback quiz-feedback-correct">答對了。</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

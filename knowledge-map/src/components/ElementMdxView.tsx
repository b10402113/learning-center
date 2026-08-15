import { useMemo, type ComponentType } from "react";
import { isCompletionLocked } from "../lib/completion";
import { elementMdxComponents } from "../lib/mdxComponents";
import type { Element } from "../lib/types";
import { CompletionToggle } from "./CompletionToggle";

interface ElementMdxViewProps {
  element: Element;
  content: ComponentType<{ components?: Record<string, ComponentType | string> }> | null;
  checked: boolean;
  quizSolved: boolean;
  onToggle: () => void;
  onQuizSolved: () => void;
}

/**
 * Renders one element's MDX article with the whitelisted interactive components
 * (`QuizBlock` for question elements, `VideoEmbed` for video elements) bound to
 * that element's data, plus the gated completion toggle. Extracted as its own
 * component so the render/gating behavior is testable with a fixture `.mdx`.
 */
export function ElementMdxView({
  element,
  content,
  checked,
  quizSolved,
  onToggle,
  onQuizSolved,
}: ElementMdxViewProps) {
  const locked = isCompletionLocked(element.type, checked, quizSolved);
  const Content = content;

  const components = useMemo(
    () => elementMdxComponents(element, element.type === "question" ? onQuizSolved : undefined),
    [element, onQuizSolved],
  );

  return (
    <div>
      <section className="mb-4">
        <CompletionToggle
          active={checked}
          disabled={locked}
          onClick={onToggle}
          activeLabel="已標記元素完成"
          idleLabel={locked ? "先答對測驗即可標記" : "標記元素完成"}
        />
        {locked ? (
          <p className="mt-2 text-center font-mono text-[0.65rem] text-faint">
            這是測驗元素：答對所有題目後才能標記完成。
          </p>
        ) : null}
      </section>
      {Content ? (
        <Content components={components} />
      ) : (
        <p className="text-xs text-muted-foreground">找不到此內容。</p>
      )}
    </div>
  );
}

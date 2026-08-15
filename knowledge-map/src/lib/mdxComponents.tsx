import type { ComponentType } from "react";
import type { Element } from "./types";
import { QuizBlock } from "../components/QuizBlock";
import { VideoEmbed } from "../components/VideoEmbed";
import { WikiLink } from "../components/WikiLink";

export type MdxComponents = Record<string, ComponentType | string>;

/**
 * The shared MDX `components` map for one element's article: wikilinks become
 * in-app navigation or source refs, and the whitelisted interactive components
 * are bound to the element's data. Question elements get a QuizBlock that
 * reports a correct answer through `onQuizSolved`; video elements get a
 * VideoEmbed. Used by both the pane and full-read render paths so the two never
 * drift.
 */
export function elementMdxComponents(
  element: Element,
  onQuizSolved: (() => void) | undefined,
): MdxComponents {
  return {
    a: WikiLink,
    QuizBlock: () => (
      <QuizBlock
        questions={element.questions ?? []}
        onSolved={element.type === "question" ? onQuizSolved : undefined}
      />
    ),
    VideoEmbed: () => <VideoEmbed url={element.videoUrl} title={element.title} />,
  };
}

/** Node articles carry no whitelisted interactive components — only wikilinks. */
export const nodeMdxComponents: MdxComponents = { a: WikiLink };

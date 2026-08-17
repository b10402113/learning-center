import type { ComponentType } from "react";
import type { Element } from "./types";
import { VideoEmbed } from "../components/VideoEmbed";
import { WikiLink } from "../components/WikiLink";

export type MdxComponents = Record<string, ComponentType | string>;

/**
 * The shared MDX `components` map for one element's article: wikilinks become
 * in-app navigation or source refs, and the whitelisted interactive components
 * are bound to the element's data. Question elements are deprecated (ADR-0005)
 * and render as plain articles — the QuizBlock no longer ships; video elements
 * get a VideoEmbed. Used by both the pane and full-read render paths so the two
 * never drift.
 */
export function elementMdxComponents(element: Element): MdxComponents {
  return {
    a: WikiLink,
    VideoEmbed: () => <VideoEmbed url={element.videoUrl} title={element.title} />,
  };
}

/** Node articles carry no whitelisted interactive components — only wikilinks. */
export const nodeMdxComponents: MdxComponents = { a: WikiLink };

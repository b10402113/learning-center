import rehypeHighlight from "rehype-highlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";

/**
 * Only the grammars the course actually uses ship to the browser. Add a
 * language here (import its grammar first) instead of switching to the
 * `common` bundle.
 */
export const languages = { javascript, python, typescript };

export const highlightOptions = {
  languages,
  // Legacy fenced `quiz` blocks are data for <Quiz>, not code to colorize.
  plainText: ["quiz"],
};

export const rehypeHighlightPlugin = [rehypeHighlight, highlightOptions];

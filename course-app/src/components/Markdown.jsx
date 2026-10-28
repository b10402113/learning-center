import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveSrc } from "../lib/assets.mjs";
import { rehypeHighlightPlugin } from "../lib/highlight.mjs";
import Quiz from "./Quiz.jsx";

function fencedText(children) {
  return Array.isArray(children) ? children.join("") : String(children ?? "");
}

/**
 * Renders Markdown with the course reading styles. Relative images resolve
 * against `assetBase`, which points at the step's directory in public/nodes/.
 */
export default function Markdown({ children, className = "", assetBase = "" }) {
  // Provenance comments (`<!-- source: … -->`) are editorial metadata for
  // verify, not reading material.
  const content = String(children ?? "").replace(/<!--[\s\S]*?-->\s*/g, "");

  return (
    <div
      className={`prose prose-base max-w-none
        prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-ink
        prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b-2 prose-h2:border-ink prose-h2:pb-2 prose-h2:text-[1.55rem] prose-h2:leading-snug
        prose-h3:mt-9 prose-h3:mb-2 prose-h3:text-[1.25rem]
        prose-h4:text-[1.1rem]
        prose-p:text-[1.15rem] prose-p:leading-[1.9] prose-p:text-ink/90
        prose-li:text-[1.15rem] prose-li:leading-[1.85] prose-li:text-ink/90 prose-li:my-1.5 prose-li:marker:text-ink-soft
        prose-ul:my-5 prose-ol:my-5
        prose-strong:font-semibold prose-strong:text-ink
        prose-a:font-medium prose-a:text-accent prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-ink
        prose-code:rounded-none prose-code:border prose-code:border-ink prose-code:bg-shade prose-code:px-1.5 prose-code:py-0.5
        prose-code:font-mono prose-code:text-[0.86em] prose-code:font-normal prose-code:text-ink
        prose-code:before:content-none prose-code:after:content-none
        prose-pre:my-7 prose-pre:rounded-none prose-pre:border-2 prose-pre:border-ink prose-pre:bg-dark prose-pre:px-5 prose-pre:py-4
        prose-pre:text-[0.9rem] prose-pre:leading-relaxed prose-pre:text-cream prose-pre:shadow-[6px_6px_0_var(--robo-shadow)]
        prose-blockquote:my-7 prose-blockquote:border-l-4 prose-blockquote:border-accent
        prose-blockquote:bg-surface prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:not-italic
        prose-blockquote:text-ink/80
        prose-th:border prose-th:border-ink prose-th:bg-shade prose-th:px-3 prose-th:py-2
        prose-th:font-label prose-th:text-sm prose-th:font-medium prose-th:uppercase prose-th:tracking-wide prose-th:text-ink
        prose-td:border prose-td:border-ink prose-td:px-3 prose-td:py-2 prose-td:align-top
        prose-hr:my-10 prose-hr:border-t-2 prose-hr:border-ink
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlightPlugin]}
        components={{
          pre: ({ children }) => {
            const child = Array.isArray(children) ? children[0] : children;
            const isQuiz = String(child?.props?.className || "")
              .split(/\s+/)
              .includes("language-quiz");
            return isQuiz ? (
              <Quiz source={fencedText(child?.props?.children)} />
            ) : (
              <pre>{children}</pre>
            );
          },
          img: ({ src, alt, title }) => (
            <img
              src={resolveSrc(src, assetBase, window.location.href)}
              alt={alt || ""}
              title={title}
              loading="lazy"
              className="lesson-figure my-7 w-full"
            />
          ),
          table: (props) => (
            <div className="my-6 overflow-x-auto border-2 border-ink">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

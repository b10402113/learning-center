import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { resolveSrc } from "../lib/assets.mjs";
import { replaceBlockLinks } from "../lib/block-links.mjs";
import { rehypeHeadingIds } from "../lib/heading-anchor.mjs";
import { rehypeHighlightPlugin } from "../lib/highlight.mjs";
import { followInternalLink } from "../lib/navigation.mjs";
import Quiz from "./Quiz.jsx";

function fencedText(children) {
  return Array.isArray(children) ? children.join("") : String(children ?? "");
}

/**
 * Renders Markdown with the course reading styles. Relative images resolve
 * against `assetBase`, which points at the step's directory in public/nodes/.
 */
export default function Markdown({
  children,
  className = "",
  assetBase = "",
  subjectId = null,
  blockIds = null,
  onNavigate = null,
}) {
  // Provenance comments (`<!-- source: … -->`) are editorial metadata for
  // verify, not reading material.
  const content = replaceBlockLinks(
    String(children ?? "").replace(/<!--[\s\S]*?-->\s*/g, ""),
    subjectId,
    blockIds
  );

  return (
    <div
      className={`prose prose-base max-w-none
        prose-headings:font-sans prose-headings:font-medium prose-headings:tracking-tight
        prose-h2:mt-14 prose-h2:mb-5 prose-h2:border-b prose-h2:border-hairline prose-h2:pb-3 prose-h2:text-[1.5rem] prose-h2:leading-snug
        prose-h3:mt-10 prose-h3:mb-2.5 prose-h3:text-[1.2rem]
        prose-h4:text-[1.05rem]
        prose-p:text-[1.08rem] prose-p:leading-[1.9] prose-p:text-ink/85
        prose-li:text-[1.08rem] prose-li:leading-[1.85] prose-li:text-ink/85 prose-li:my-1.5
        prose-ul:my-5 prose-ol:my-5
        prose-strong:font-semibold
        prose-a:font-medium prose-a:text-accent prose-a:underline hover:prose-a:text-ink
        prose-code:rounded-md prose-code:border prose-code:border-hairline prose-code:bg-shade prose-code:px-1.5 prose-code:py-0.5
        prose-code:font-mono prose-code:text-[0.85em] prose-code:font-normal prose-code:text-ink
        prose-code:before:content-none prose-code:after:content-none
        prose-pre:my-8 prose-pre:rounded-2xl prose-pre:border prose-pre:border-hairline prose-pre:bg-dark prose-pre:px-5 prose-pre:py-4
        prose-pre:text-[0.88rem] prose-pre:leading-relaxed prose-pre:text-cream prose-pre:shadow-soft
        prose-blockquote:my-8 prose-blockquote:rounded-r-xl prose-blockquote:border-l-2 prose-blockquote:border-accent
        prose-blockquote:bg-accent-tint prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:not-italic
        prose-blockquote:text-ink/80
        prose-th:border prose-th:border-hairline prose-th:bg-shade prose-th:px-3 prose-th:py-2
        prose-th:font-label prose-th:text-sm prose-th:font-medium prose-th:uppercase prose-th:tracking-wide prose-th:text-ink
        prose-td:border prose-td:border-hairline prose-td:px-3 prose-td:py-2 prose-td:align-top
        prose-hr:my-12 prose-hr:border-t prose-hr:border-hairline
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHeadingIds, rehypeHighlightPlugin, rehypeKatex]}
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
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              onClick={(event) => {
                if (followInternalLink(event, href, onNavigate)) {
                  event.preventDefault();
                }
              }}
              {...props}
            >
              {children}
            </a>
          ),
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
            <div className="my-7 overflow-x-auto rounded-xl border border-hairline">
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

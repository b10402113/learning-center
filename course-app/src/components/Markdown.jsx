import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveSrc } from "../lib/assets.mjs";

/**
 * Renders Markdown with paper-theme prose styling. Relative images resolve
 * against `assetBase`, which points at the step's directory in public/nodes/.
 */
export default function Markdown({ children, className = "", assetBase = "" }) {
  return (
    <div
      className={`prose prose-sm sm:prose-base max-w-none
        prose-headings:font-serif prose-headings:font-semibold prose-headings:text-ink
        prose-p:text-ink/90 prose-p:leading-relaxed
        prose-li:text-ink/90
        prose-strong:text-ink prose-strong:font-semibold
        prose-a:text-accent prose-a:font-medium hover:prose-a:underline
        prose-code:rounded prose-code:bg-mist prose-code:px-1.5 prose-code:py-0.5
        prose-code:font-normal prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-mist prose-pre:border prose-pre:border-line prose-pre:rounded-lg prose-pre:text-sm prose-pre:text-ink
        prose-blockquote:border-l-accent prose-blockquote:bg-accent-soft/40
        prose-blockquote:py-0.5 prose-blockquote:not-italic prose-blockquote:text-ink/80
        prose-th:bg-shade prose-th:border prose-th:border-line prose-th:px-3 prose-th:py-1.5
        prose-th:font-label prose-th:text-xs prose-th:uppercase prose-th:tracking-wider prose-th:text-ink-soft
        prose-td:border prose-td:border-line prose-td:px-3 prose-td:py-1.5 prose-td:align-top
        prose-hr:border-line
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt, title }) => (
            <img
              src={resolveSrc(src, assetBase, window.location.href)}
              alt={alt || ""}
              title={title}
              loading="lazy"
              className="lesson-figure my-6 w-full rounded-lg border border-line"
            />
          ),
          table: (props) => (
            <div className="my-4 overflow-x-auto">
              <table {...props} />
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeHeadingIds } from "../lib/heading-anchor.mjs";
import { rehypeHighlightPlugin } from "../lib/highlight.mjs";

export default function Markdown({ children, onOpenBlock, blockIds = [] }) {
  const content = String(children || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, id, label) =>
      blockIds.includes(id) ? `[${label || id}](/blocks/${id}/)` : label || id,
    );
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHeadingIds, rehypeHighlightPlugin, rehypeKatex]}
        components={{
          a: ({ node, href, children, ...props }) => (
            <a
              href={href}
              {...props}
              onClick={
                onOpenBlock
                  ? (event) => {
                      const id = href?.match(
                        /^\/blocks\/([a-z0-9-]+)\/?$/,
                      )?.[1];
                      if (
                        id &&
                        blockIds.includes(id) &&
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.shiftKey &&
                        !event.altKey
                      ) {
                        event.preventDefault();
                        onOpenBlock(id);
                      }
                    }
                  : undefined
              }
            >
              {children}
            </a>
          ),
          img: ({ node, ...props }) => (
            <img {...props} loading="lazy" decoding="async" />
          ),
          table: ({ node, ...props }) => (
            <div className="table-scroll">
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

import { X } from "lucide-react";
import { statusLabel } from "../lib/colors";
import type { NodeRecord, PathNode } from "../lib/types";

function stripLeadingH1(html: string): string {
  return html.replace(/^<h1>[\s\S]*?<\/h1>\s*/, "");
}

interface Props {
  path: PathNode;
  nodes: Record<string, NodeRecord>;
  onClose: () => void;
}

export function DetailPane({ path, nodes, onClose }: Props) {
  const taught = path.taughtNodeIds.map((id) => nodes[id]?.title ?? id);
  const related = path.relatedNodeIds.map((id) => nodes[id]?.title ?? id);

  return (
    <aside
      role="complementary"
      aria-label={`${path.title} 詳情`}
      className="absolute inset-y-0 right-0 z-10 flex w-[26rem] max-w-[85%] flex-col overflow-hidden rounded-none border-l border-border bg-card/80 backdrop-blur-sm"
    >
      <header className="flex shrink-0 flex-col gap-1.5 border-b border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[0.65rem] text-muted-foreground">
            {path.order}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium" title={path.title}>
            {path.title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉面板 (Esc)"
            title="關閉 (Esc)"
            className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground">
          <span className="font-mono">{statusLabel(path.status)}</span>
          {path.duration && (
            <>
              <span className="text-border">/</span>
              <span className="font-mono">{path.duration}</span>
            </>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {path.goal && (
          <section className="mb-4 flex flex-col gap-1">
            <h3 className="text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
              學習目標
            </h3>
            <p className="text-sm leading-relaxed text-foreground/90">{path.goal}</p>
          </section>
        )}

        {path.contentHtml && (
          <section className="mb-4">
            <div className="prose-sm" dangerouslySetInnerHTML={{ __html: stripLeadingH1(path.contentHtml) }} />
          </section>
        )}

        <section className="mb-4 flex flex-col gap-1.5">
          <h3 className="text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
            教的 node · {taught.length}
          </h3>
          {taught.length ? (
            <div className="flex flex-wrap gap-1.5">
              {taught.map((title) => (
                <span key={title} className="chip">
                  {title}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">尚未撰寫 node。</p>
          )}
        </section>

        <section className="mb-4 flex flex-col gap-1.5">
          <h3 className="text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
            關聯 node · {related.length}
          </h3>
          {related.length ? (
            <div className="flex flex-wrap gap-1.5">
              {related.map((title) => (
                <span key={title} className="chip">
                  {title}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">無關聯 node。</p>
          )}
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-[0.7rem] font-semibold tracking-wide text-muted-foreground uppercase">
            Sources
          </h3>
          {path.sources.length ? (
            <ul className="flex flex-col gap-0.5">
              {path.sources.map((s, i) => (
                <li key={i} className="truncate font-mono text-[0.65rem] text-muted-foreground" title={s}>
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">無來源。</p>
          )}
        </section>
      </div>
    </aside>
  );
}

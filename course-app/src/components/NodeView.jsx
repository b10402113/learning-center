import Markdown from "./Markdown.jsx";
import StepCard from "./StepCard.jsx";
import { tierTextClass } from "./Sidebar.jsx";

const TIER_BG = {
  1: "bg-tier-1",
  2: "bg-tier-2",
  3: "bg-tier-3",
  4: "bg-tier-4",
};

/**
 * Node detail view — preview-2 baseline:
 * header (numbered badge, title, meta), goal callout, node intro,
 * prerequisites, collapsible step cards.
 */
export default function NodeView({ course, node, expanded, onToggleStep, onSelect }) {
  const written = node.status === "content-written";
  const stepCount = node.steps.length;

  const prereqs = (node.prerequisites || [])
    .map((p) => {
      const pid = String(p).split("/").pop();
      return course.nodes.find((n) => n.id === pid) || null;
    })
    .filter(Boolean);

  return (
    <article>
      {/* Header */}
      <h1 className="border-b-2 border-accent pb-1.5 text-[1.7rem] font-semibold leading-tight sm:text-[2rem]">
        {node.title}
      </h1>
      <p className="font-label mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-wide text-ink-soft sm:text-sm">
        <span>
          Node {node.globalOrder}/{course.nodes.length}
        </span>
        <span aria-hidden="true">·</span>
        <span className={tierTextClass(node.tier)}>
          Tier {node.tier} — {course.tiers.find((t) => t.tier === node.tier)?.name}
        </span>
        <span aria-hidden="true">·</span>
        <span>{stepCount} Steps</span>
        <span
          className={`rounded px-1.5 py-0.5 font-label text-[10px] font-semibold uppercase tracking-[0.06em] ${
            written ? "bg-good-bg text-good" : "bg-shade text-ink-soft"
          }`}
          title={written ? "內容已完成" : "草稿"}
        >
          {node.status}
        </span>
      </p>

      {/* Goal callout */}
      {node.goal && (
        <div className="mt-6 rounded-r-lg border-l-4 border-accent bg-accent-soft px-4 py-3 text-[0.95em]">
          {node.goal}
        </div>
      )}

      {/* Prerequisites */}
      {prereqs.length > 0 && (
        <div className="font-label mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="uppercase tracking-[0.08em] text-ink-soft">前置</span>
          {prereqs.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="rounded-full border border-line bg-shade px-2.5 py-1 font-medium text-accent transition-colors hover:border-accent hover:bg-accent-soft"
            >
              ↰ {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Node-level intro */}
      {node.lessonIntro && (
        <div className="mt-5 text-ink/90">
          <Markdown>{node.lessonIntro}</Markdown>
        </div>
      )}

      {/* Steps */}
      {stepCount > 0 ? (
        <>
          <h3 className="font-label mt-8 mb-3 text-xs uppercase tracking-[0.08em] text-ink-soft">
            Steps（DAG）
          </h3>
          <ol className="space-y-2.5">
            {node.steps.map((step) => (
              <StepCard
                key={step.id}
                node={node}
                step={step}
                allSteps={node.steps}
                open={expanded.has(`${node.id}/${step.id}`)}
                onToggle={() => onToggleStep(`${node.id}/${step.id}`)}
              />
            ))}
          </ol>
        </>
      ) : (
        <div className={`mt-8 rounded-lg border border-dashed px-5 py-8 text-center ${written ? "border-line" : "border-line"}`}>
          <p
            aria-hidden="true"
            className={`mx-auto mb-3 flex size-10 items-center justify-center rounded-full text-white ${TIER_BG[node.tier] || "bg-accent"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </p>
          <p className="text-sm text-ink-soft">
            此節點尚為草稿，步驟內容尚未生成。
          </p>
          <p className="font-label mt-1.5 text-xs uppercase tracking-wide text-ink-soft/70">
            /nodes system-design/{node.id} → 規劃步驟 · /teach → 生成內容
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-14 border-t border-line pt-4 text-xs text-ink-soft">
        <p>
          {course.title} · Node {node.globalOrder}/{course.nodes.length} ·{" "}
          {node.title} · Generated from learning-center
        </p>
      </footer>
    </article>
  );
}

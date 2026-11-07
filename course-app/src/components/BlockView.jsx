import Markdown from "./Markdown.jsx";
import BlockGraph from "./BlockGraph.jsx";
import { blockTypeLabel, blockIndex } from "../lib/blocks.mjs";
import { localNodeIds } from "../lib/block-graph.mjs";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor, pathForBlock } from "../lib/route.mjs";

function Badge({ children, hot = false }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 font-label text-[9.5px] uppercase tracking-[0.12em] ${
        hot
          ? "bg-accent-tint text-accent ring-1 ring-accent/25"
          : "bg-shade text-ink-soft"
      }`}
    >
      {children}
    </span>
  );
}

function BlockLink({ course, id, title, onNavigate }) {
  const href = pathForBlock(course.subject, id);
  return (
    <a
      href={href}
      onClick={(event) => {
        if (followInternalLink(event, href, onNavigate)) {
          event.preventDefault();
        }
      }}
      className="group inline-flex items-baseline gap-2 rounded-full bg-surface px-3 py-1.5 ring-1 ring-hairline transition-colors hover:ring-accent/40"
    >
      <span className="font-medium text-ink transition-colors group-hover:text-accent">
        {title || id}
      </span>
      <span className="font-mono text-[10px] text-ink-soft">{id}</span>
    </a>
  );
}

function StepLink({ course, step, onNavigate }) {
  const href = pathFor(course.subject, step.nodeId, step.stepId);
  return (
    <a
      href={href}
      onClick={(event) => {
        if (followInternalLink(event, href, onNavigate)) {
          event.preventDefault();
        }
      }}
      className="group flex items-baseline gap-2 rounded-xl bg-surface px-3.5 py-2 ring-1 ring-hairline transition-colors hover:ring-accent/40"
    >
      <span className="min-w-0 flex-1 truncate font-medium text-ink transition-colors group-hover:text-accent">
        {step.stepTitle}
      </span>
      <span className="shrink-0 font-mono text-[10px] text-ink-soft">
        {step.nodeTitle}
      </span>
    </a>
  );
}

function Section({ title, count, children }) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-hairline pb-3">
        <h2 className="font-display text-[1.1rem] font-semibold text-ink">
          {title}
        </h2>
        <span className="font-mono text-[10px] tabular-nums text-ink-soft">
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

/**
 * One standalone knowledge point. The body arrives in its own lazily loaded
 * JSON file; this view adds the relations and backlinks the reader needs.
 */
export default function BlockView({ course, block, onNavigate = null }) {
  if (block?.missing) {
    return (
      <p className="py-16 text-center text-[0.95rem] text-ink-soft">
        找不到這個知識點。
      </p>
    );
  }
  if (!block) {
    return (
      <p className="py-16 text-center text-[0.95rem] text-ink-soft">
        正在載入知識點…
      </p>
    );
  }

  const byId = blockIndex(course);
  const body = String(block.bodyMd || "").replace(
    /^\s*#\s+.*(?:\r?\n)+/,
    ""
  );
  const prerequisites = (block.prerequisites || []).map(
    (id) => byId.get(id) || { id, title: id }
  );
  const related = (block.related || []).map(
    (id) => byId.get(id) || { id, title: id }
  );
  const backlinkBlocks = Array.isArray(block.backlinks) ? block.backlinks : [];
  const backlinkSteps = Array.isArray(block.steps) ? block.steps : [];
  const sources = Array.isArray(block.sources) ? block.sources : [];
  const localIds = localNodeIds(course.blockEdges, block.id, 2);
  const localCount = (course.blocks || []).filter((item) =>
    localIds?.has(item.id)
  ).length;

  return (
    <article>
      <nav
        aria-label="麵包屑"
        className="flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
      >
        <a
          href={pathFor(course.subject)}
          onClick={(event) => {
            if (
              followInternalLink(
                event,
                pathFor(course.subject),
                onNavigate
              )
            ) {
              event.preventDefault();
            }
          }}
          className="transition-colors hover:text-accent"
        >
          {course.title}
        </a>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <span>知識點</span>
        <span aria-hidden="true" className="text-ink-soft/50">
          /
        </span>
        <span className="text-ink">{block.title}</span>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge hot>{blockTypeLabel(block.type)}</Badge>
          <Badge>{block.status}</Badge>
          <span className="font-mono text-[11px] text-ink-soft">
            {block.id}
          </span>
        </div>
        <h1 className="mt-3 font-display text-[2.2rem] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[2.6rem]">
          {block.title}
        </h1>
        {block.summary && (
          <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-[1.85] text-ink-soft">
            {block.summary}
          </p>
        )}
      </header>

      <div className="mt-8 max-w-[820px] border-t border-hairline pt-8">
        <Markdown
          subjectId={course.subject}
          blockIds={(course.blocks || []).map((item) => item.id)}
          onNavigate={onNavigate}
        >
          {body}
        </Markdown>
      </div>

      {prerequisites.length > 0 && (
        <Section title="先備知識" count={prerequisites.length}>
          <div className="flex flex-wrap gap-2">
            {prerequisites.map((item) => (
              <BlockLink
                key={item.id}
                course={course}
                id={item.id}
                title={item.title}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section title="相關知識" count={related.length}>
          <div className="flex flex-wrap gap-2">
            {related.map((item) => (
              <BlockLink
                key={item.id}
                course={course}
                id={item.id}
                title={item.title}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </Section>
      )}

      {(backlinkSteps.length > 0 || backlinkBlocks.length > 0) && (
        <Section
          title="反向連結"
          count={backlinkSteps.length + backlinkBlocks.length}
        >
          {backlinkSteps.length > 0 && (
            <div>
              <p className="robo-kicker mb-2 font-label text-[9.5px] text-ink-soft">
                使用此知識點的步驟
              </p>
              <div className="space-y-2">
                {backlinkSteps.map((step) => (
                  <StepLink
                    key={`${step.nodeId}/${step.stepId}`}
                    course={course}
                    step={step}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          )}
          {backlinkBlocks.length > 0 && (
            <div className={backlinkSteps.length > 0 ? "mt-5" : ""}>
              <p className="robo-kicker mb-2 font-label text-[9.5px] text-ink-soft">
                指向此知識點的知識點
              </p>
              <div className="flex flex-wrap gap-2">
                {backlinkBlocks.map((item) => (
                  <BlockLink
                    key={`${item.id}-${item.kind}`}
                    course={course}
                    id={item.id}
                    title={item.title}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {sources.length > 0 && (
        <Section title="來源" count={sources.length}>
          <ul className="space-y-2 rounded-2xl bg-shade/55 px-4 py-4 text-[0.92rem] ring-1 ring-hairline sm:px-5">
            {sources.map((source, index) => (
              <li
                key={`${source.file}-${source.locator}-${index}`}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                title={source.file}
              >
                <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.78em] text-ink ring-1 ring-hairline">
                  {source.name}
                </code>
                <span className="font-mono text-[11px] tabular-nums text-ink-soft">
                  {source.lines}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="知識圖" count={localCount}>
        <p className="mb-3 max-w-[62ch] text-[0.92rem] leading-[1.75] text-ink-soft">
          以這個知識點為中心，顯示與它相連的概念（含兩層鄰居）。可以拖曳、縮放，點其他節點即可跳轉。
        </p>
        <BlockGraph
          course={course}
          focus={block.id}
          depth={2}
          minHeight={300}
          maxHeight={440}
          onNavigate={onNavigate}
        />
      </Section>

      <footer className="robo-kicker mt-20 border-t border-hairline pt-5 font-label text-[10px] text-ink-soft">
        {course.title} · 知識點 · {block.title}
      </footer>
    </article>
  );
}

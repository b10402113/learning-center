import Markdown from "./Markdown.jsx";
import { blockTypeLabel, blockIndex } from "../lib/blocks.mjs";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor, pathForBlock } from "../lib/route.mjs";

function Badge({ children, hot = false }) {
  return (
    <span
      className={`border px-2 py-0.5 font-label text-[10px] uppercase tracking-[0.14em] ${
        hot
          ? "border-accent text-accent"
          : "border-ink bg-shade text-ink-soft"
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
      className="group inline-flex items-baseline gap-2 border-2 border-ink bg-surface px-3 py-1.5 transition-colors hover:border-accent"
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
      className="group flex items-baseline gap-2 border-2 border-ink bg-surface px-3 py-2 transition-colors hover:border-accent"
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
    <section className="mt-10">
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
        <h2 className="robo-kicker font-label text-[11px] font-medium text-ink-soft">
          {title}
        </h2>
        <span className="font-mono text-[11px] tabular-nums text-ink-soft">
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

  return (
    <article>
      <nav
        aria-label="麵包屑"
        className="robo-kicker flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft"
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
        <h1 className="mt-3 text-[2rem] font-medium leading-[1.15] tracking-[-1px] text-ink sm:text-[2.5rem]">
          {block.title}
        </h1>
        {block.summary && (
          <p className="mt-3 max-w-[62ch] text-[1.05rem] leading-relaxed text-ink-soft">
            {block.summary}
          </p>
        )}
      </header>

      <div className="mt-8 border-t-2 border-ink pt-8">
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
              <p className="robo-kicker mb-2 font-label text-[10px] text-ink-soft">
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
              <p className="robo-kicker mb-2 font-label text-[10px] text-ink-soft">
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
          <ul className="space-y-2 border-2 border-ink bg-shade px-4 py-4 text-[0.95rem] shadow-[6px_6px_0_var(--robo-shadow)] sm:px-5">
            {sources.map((source, index) => (
              <li
                key={`${source.file}-${source.locator}-${index}`}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                title={source.file}
              >
                <code className="border border-ink bg-surface px-1.5 py-0.5 font-mono text-[0.78em] text-ink">
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

      <footer className="robo-kicker mt-16 border-t-2 border-ink pt-4 font-label text-[11px] text-ink-soft">
        {course.title} · 知識點 · {block.title}
      </footer>
    </article>
  );
}

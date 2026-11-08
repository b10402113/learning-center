import Markdown from "./Markdown.jsx";
import BlockGraph from "./BlockGraph.jsx";
import { blockTypeLabel, blockIndex } from "../lib/blocks.mjs";
import { localNodeIds } from "../lib/block-graph.mjs";
import { followInternalLink } from "../lib/navigation.mjs";
import { pathFor, pathForBlock } from "../lib/route.mjs";

const BASE = import.meta.env.BASE_URL;

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

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-1 shrink-0 text-ink-soft/50 transition duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function RelationLabel({ children, hot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-label text-[9.5px] uppercase tracking-[0.14em] ${
        hot ? "text-accent" : "text-ink-soft"
      }`}
    >
      {hot && (
        <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
      )}
      {children}
    </span>
  );
}

function RelationCard({
  course,
  id,
  title,
  summary,
  relation,
  hot = false,
  onNavigate,
}) {
  const href = pathForBlock(course.subject, id);
  return (
    <a
      href={href}
      onClick={(event) => {
        if (followInternalLink(event, href, onNavigate)) {
          event.preventDefault();
        }
      }}
      className="group flex min-w-0 items-start gap-3 rounded-xl border border-hairline bg-surface/60 px-4 py-3.5 transition-colors duration-200 hover:border-accent/35 hover:bg-surface"
    >
      <span className="min-w-0 flex-1">
        <RelationLabel hot={hot}>{relation}</RelationLabel>
        <span className="mt-1.5 block text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
          {title || id}
        </span>
        {summary && (
          <span className="mt-1 line-clamp-2 block text-[0.82rem] leading-relaxed text-ink-soft">
            {summary}
          </span>
        )}
      </span>
      <ArrowIcon />
    </a>
  );
}

function StepCard({ course, step, onNavigate }) {
  const href = pathFor(course.subject, step.nodeId, step.stepId);
  return (
    <a
      href={href}
      onClick={(event) => {
        if (followInternalLink(event, href, onNavigate)) {
          event.preventDefault();
        }
      }}
      className="group flex min-w-0 items-start gap-3 rounded-xl border border-hairline bg-surface/60 px-4 py-3.5 transition-colors duration-200 hover:border-accent/35 hover:bg-surface"
    >
      <span className="min-w-0 flex-1">
        <RelationLabel>步驟引用</RelationLabel>
        <span className="mt-1.5 block text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
          {step.stepTitle}
        </span>
        <span className="mt-1 block truncate text-[0.82rem] leading-relaxed text-ink-soft">
          {step.nodeTitle}
        </span>
      </span>
      <ArrowIcon />
    </a>
  );
}

function CardGrid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">{children}</div>
  );
}

function Subhead({ children, count }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-1 rounded-full bg-accent/70"
      />
      <span className="font-label text-[9.5px] uppercase tracking-[0.14em] text-ink-soft">
        {children}
      </span>
      <span className="font-mono text-[10px] tabular-nums text-ink-soft/70">
        {count}
      </span>
    </div>
  );
}

function Section({ title, count, hint, children }) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-[1.1rem] font-semibold text-ink">
            {title}
          </h2>
          <span className="rounded-full bg-shade px-2 py-0.5 font-mono text-[10px] leading-none tabular-nums text-ink-soft">
            {count}
          </span>
        </div>
        {hint && (
          <p className="text-[0.78rem] text-ink-soft/80">{hint}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/**
 * One standalone knowledge point. The body arrives in its own lazily loaded
 * JSON file; this view adds the relations and backlinks the reader needs.
 */
export default function BlockView({
  course,
  block,
  onNavigate = null,
  embedded = false,
}) {
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
  const backlinkBlocks = (
    Array.isArray(block.backlinks) ? block.backlinks : []
  ).map((item) => {
    const meta = byId.get(item.id);
    return { ...meta, ...item, summary: meta?.summary || "" };
  });
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
        className={`flex flex-wrap items-center gap-2 font-label text-[11px] text-ink-soft ${
          embedded ? "hidden" : ""
        }`}
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

      <header className={embedded ? "" : "mt-4"}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge hot>{blockTypeLabel(block.type)}</Badge>
          <Badge>{block.status}</Badge>
          <span className="font-mono text-[11px] text-ink-soft">
            {block.id}
          </span>
        </div>
        <h1
          className={`mt-3 font-display font-semibold leading-[1.15] tracking-[-0.5px] text-ink ${
            embedded ? "text-[1.75rem] sm:text-[2rem]" : "text-[2.2rem] sm:text-[2.6rem]"
          }`}
        >
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
          assetBase={`${BASE}blocks/${encodeURIComponent(course.subject)}/`}
          onNavigate={onNavigate}
        >
          {body}
        </Markdown>
      </div>

      {prerequisites.length > 0 && (
        <Section
          title="先備知識"
          count={prerequisites.length}
          hint="閱讀前先掌握的概念"
        >
          <CardGrid>
            {prerequisites.map((item) => (
              <RelationCard
                key={item.id}
                course={course}
                id={item.id}
                title={item.title}
                summary={item.summary}
                relation="先備知識"
                onNavigate={onNavigate}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      {related.length > 0 && (
        <Section
          title="相關知識"
          count={related.length}
          hint="同一主題的延伸"
        >
          <CardGrid>
            {related.map((item) => (
              <RelationCard
                key={item.id}
                course={course}
                id={item.id}
                title={item.title}
                summary={item.summary}
                relation="相關知識"
                hot
                onNavigate={onNavigate}
              />
            ))}
          </CardGrid>
        </Section>
      )}

      {(backlinkSteps.length > 0 || backlinkBlocks.length > 0) && (
        <Section
          title="反向連結"
          count={backlinkSteps.length + backlinkBlocks.length}
          hint="從其他內容連回這裡"
        >
          <div className="space-y-6">
            {backlinkSteps.length > 0 && (
              <div>
                <Subhead count={backlinkSteps.length}>
                  使用此知識點的步驟
                </Subhead>
                <CardGrid>
                  {backlinkSteps.map((step) => (
                    <StepCard
                      key={`${step.nodeId}/${step.stepId}`}
                      course={course}
                      step={step}
                      onNavigate={onNavigate}
                    />
                  ))}
                </CardGrid>
              </div>
            )}
            {backlinkBlocks.length > 0 && (
              <div>
                <Subhead count={backlinkBlocks.length}>
                  指向此知識點的知識點
                </Subhead>
                <CardGrid>
                  {backlinkBlocks.map((item) => (
                    <RelationCard
                      key={`${item.id}-${item.kind}`}
                      course={course}
                      id={item.id}
                      title={item.title}
                      summary={item.summary}
                      relation={
                        item.kind === "prerequisite"
                          ? "來自先備知識"
                          : "來自相關知識"
                      }
                      hot={item.kind !== "prerequisite"}
                      onNavigate={onNavigate}
                    />
                  ))}
                </CardGrid>
              </div>
            )}
          </div>
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
          entities

          minHeight={300}
          maxHeight={440}
          onNavigate={onNavigate}
        />
      </Section>

      {!embedded && (
        <footer className="robo-kicker mt-20 border-t border-hairline pt-5 font-label text-[10px] text-ink-soft">
          {course.title} · 知識點 · {block.title}
        </footer>
      )}
    </article>
  );
}

import { NodeGlyph } from "./Glyphs.jsx";

const TIER_TEXT = {
  1: "text-ink-soft",
  2: "text-ink-soft",
  3: "text-ink-soft",
  4: "text-ink-soft",
};

const TIER_DOT = {
  1: "bg-ink",
  2: "bg-ink",
  3: "bg-ink",
  4: "bg-ink",
};

export const tierTextClass = (tier) => TIER_TEXT[tier] || "text-ink-soft";
export const tierDotClass = (tier) => TIER_DOT[tier] || "bg-ink";

function groupByTier(course) {
  const grouped = new Map(course.tiers.map((t) => [t.tier, []]));
  for (const node of course.nodes) {
    if (!grouped.has(node.tier)) grouped.set(node.tier, []);
    grouped.get(node.tier).push(node);
  }
  return grouped;
}

function SidebarBody({
  course,
  currentId,
  currentStepId,
  onSelect,
  onSelectStep,
  onSubject,
  onClose,
  onToggle,
}) {
  const nodesByTier = groupByTier(course);

  return (
    <>
      <div className="flex items-center justify-between gap-2 pb-3 pt-5">
          <p className="robo-kicker font-label text-[13px] text-ink-soft">
          課程目錄
        </p>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[10.5px] tabular-nums text-ink ring-1 ring-hairline">
            {course.nodes.length} 節點
          </span>
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              aria-label="收合左側目錄"
              title="收合左側目錄"
              className="grid size-7 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-surface hover:text-accent"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="16" rx="2.5" />
                <path d="M9 4v16" />
                <path d="m16 9-3 3 3 3" />
              </svg>
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉選單"
              className="rounded-lg p-1.5 text-ink-soft transition-colors hover:bg-surface hover:text-accent lg:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3 py-1.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface text-ink-soft ring-1 ring-hairline">
            <NodeGlyph seed={course.subject} size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="robo-kicker block font-label text-[10px] text-ink-soft">
              課程
            </span>
            <span className="mt-0.5 block truncate font-display text-[1.08rem] font-semibold text-ink">
              {course.title}
            </span>
          </span>
        </div>
        {onSubject && (
          <button
            type="button"
            onClick={onSubject}
            className="group flex w-full items-center gap-3 rounded-xl py-2 text-left transition-colors hover:bg-surface"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface text-ink-soft ring-1 ring-hairline transition-colors group-hover:text-accent">
              <svg
                aria-hidden="true"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="6" cy="6" r="2" />
                <circle cx="18" cy="18" r="2" />
                <path d="M8 6h6a4 4 0 0 1 0 8H10a4 4 0 0 0 0 8" />
              </svg>
            </span>
            <span className="robo-kicker font-label text-[11px] text-ink transition-colors group-hover:text-accent">
              課程地圖
            </span>
          </button>
        )}
      </div>

      {course.goal && course.goal !== "none" && (
        <div className="pt-4">
          <p className="border-l-2 border-accent/45 pl-3 text-[0.9rem] leading-relaxed text-ink-soft line-clamp-4">
            {course.goal}
          </p>
        </div>
      )}

      <nav className="mt-7 flex-1 space-y-7 pb-12" aria-label="課程導覽">
        {course.tiers.map((tier) => {
          const items = nodesByTier.get(tier.tier) || [];
          if (!items.length) return null;
          return (
            <div key={tier.tier}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${tierDotClass(tier.tier)}`}
                />
                <span
                  className={`robo-kicker font-label text-[10.5px] font-medium ${tierTextClass(tier.tier)}`}
                >
                  Tier {tier.tier} · {tier.name}
                </span>
              </div>
              <ul className="space-y-1">
                {items.map((node) => {
                  const active = node.id === currentId;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(node.id)}
                        aria-current={active ? "page" : undefined}
                        aria-expanded={node.steps.length > 0 ? active : undefined}
                        className={`group relative flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-[0.95rem] leading-relaxed transition-colors ${
                          active
                            ? "bg-accent-tint font-medium text-ink ring-1 ring-accent/20"
                            : "text-ink hover:bg-surface"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full transition-colors ${
                            active ? "bg-accent" : "bg-transparent"
                          }`}
                        />
                        <span
                          className={`mt-[3px] w-5 shrink-0 font-mono text-[10.5px] font-medium tabular-nums ${
                            active ? "text-accent" : "text-ink-soft"
                          }`}
                        >
                          {String(node.globalOrder).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 break-words">
                          {node.title}
                        </span>
                        {node.steps.length > 0 && (
                          <span className="mt-[3px] flex shrink-0 items-center gap-1">
                            <span
                              className={`font-mono text-[10.5px] tabular-nums ${
                                active ? "text-accent" : "text-ink-soft"
                              }`}
                            >
                              {node.steps.length}
                            </span>
                            <svg
                              aria-hidden="true"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`transition-transform ${
                                active
                                  ? "rotate-90 text-accent"
                                  : "text-ink-soft"
                              }`}
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </span>
                        )}
                      </button>

                      {active && node.steps.length > 0 && (
                        <ul className="ml-5 mt-1.5 space-y-1 border-l border-hairline pl-3">
                          {node.steps.map((step) => {
                            const stepActive = step.id === currentStepId;
                            return (
                              <li key={step.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSelectStep(node.id, step.id)
                                  }
                                  aria-current={stepActive ? "step" : undefined}
                                  className={`flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left text-[0.88rem] leading-relaxed transition-colors ${
                                    stepActive
                                      ? "bg-accent-tint font-medium text-accent"
                                      : "text-ink-soft hover:bg-surface hover:text-ink"
                                  }`}
                                >
                                  <span className="mt-[3px] w-4 shrink-0 font-mono text-[10px] tabular-nums">
                                    {String(step.order).padStart(2, "0")}
                                  </span>
                                  <span className="min-w-0 flex-1 break-words">
                                    {step.title}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );
}

/**
 * Desktop course navigation. It sits in a fixed-width layout slot so showing
 * or collapsing it never moves the article. Collapsed, it becomes a slim icon
 * rail with native tooltips.
 */
export default function Sidebar({
  course,
  currentId,
  currentStepId,
  onSelect,
  onSelectStep,
  onSubject,
  collapsed,
  onToggle,
}) {
  return (
    <aside
      className="sticky top-[4.75rem] hidden h-[calc(100vh-4.75rem)] w-full lg:block"
      aria-label="課程導覽"
    >
      {collapsed ? (
        <div className="scroll-slim flex h-full w-[4.25rem] flex-col items-center gap-2 overflow-y-auto border-r border-hairline bg-paper/40 py-4">
          {onToggle && (
            <>
              <button
                type="button"
                onClick={onToggle}
                aria-label="展開左側目錄"
                title="展開左側目錄"
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-tint text-accent transition-colors hover:bg-accent hover:text-dark"
              >
                <svg
                  aria-hidden="true"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <path d="M9 4v16" />
                  <path d="m13 9 3 3-3 3" />
                </svg>
              </button>
              <span
                aria-hidden="true"
                className="my-0.5 h-px w-6 rounded-full bg-hairline"
              />
            </>
          )}
          {course.nodes.map((node) => {
            const active = node.id === currentId;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelect(node.id)}
                title={node.title}
                aria-label={node.title}
                aria-current={active ? "page" : undefined}
                className={`group grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
                  active
                    ? "bg-accent-tint text-accent ring-1 ring-accent/30"
                    : "bg-surface text-ink-soft ring-1 ring-hairline hover:text-accent"
                }`}
              >
                <NodeGlyph seed={node.id} size={16} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="scroll-slim flex h-full flex-col overflow-y-auto border-r border-hairline bg-paper/40 px-4">
          <SidebarBody
            course={course}
            currentId={currentId}
            currentStepId={currentStepId}
            onSelect={onSelect}
            onSelectStep={onSelectStep}
            onSubject={onSubject}
            onToggle={onToggle}
          />
        </div>
      )}
    </aside>
  );
}

/** Mobile slide-in drawer; the desktop column lives in the layout slot. */
export function SidebarDrawer({
  course,
  currentId,
  currentStepId,
  onSelect,
  onSelectStep,
  onSubject,
  open,
  onClose,
}) {
  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[86vw] shrink-0 flex-col bg-paper shadow-2xl ring-1 ring-hairline transition-transform duration-200 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="課程導覽"
        aria-hidden={!open}
      >
        <div className="scroll-slim flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4">
          <SidebarBody
            course={course}
            currentId={currentId}
            currentStepId={currentStepId}
            onSelect={onSelect}
            onSelectStep={onSelectStep}
            onSubject={onSubject}
            onClose={onClose}
          />
        </div>
      </aside>
    </>
  );
}

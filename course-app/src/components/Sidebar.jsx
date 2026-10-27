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

function CollapseIcon({ expand = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="0" />
      <path d="M9 4v16" />
      {expand ? <path d="m13 9 3 3-3 3" /> : <path d="m16 9-3 3 3 3" />}
    </svg>
  );
}

function SidebarBody({
  course,
  currentId,
  currentStepId,
  onSelect,
  onSelectStep,
  onHome,
  onToggle,
  showToggle = false,
  onClose,
}) {
  const nodesByTier = groupByTier(course);

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b-2 border-ink px-4 py-4">
        <p className="robo-kicker font-label text-[11px] text-ink-soft">
          課程目錄
        </p>
        <div className="flex items-center gap-1.5">
          <span className="border border-ink bg-surface px-2 py-0.5 font-mono text-[11px] tabular-nums text-ink">
            {course.nodes.length} 節點
          </span>
          {showToggle && (
            <button
              type="button"
              onClick={onToggle}
              aria-label="收合側欄"
              title="收合側欄（⌘B）"
              className="p-1.5 text-ink-soft transition-colors hover:text-accent"
            >
              <CollapseIcon />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉選單"
              className="p-1.5 text-ink-soft transition-colors hover:text-accent lg:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={onHome}
          className="group flex w-full items-center gap-2 border-2 border-ink bg-surface px-3 py-2 text-left transition-colors hover:border-accent"
        >
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-ink-soft transition-colors group-hover:text-accent"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="min-w-0 flex-1">
            <span className="robo-kicker block font-label text-[10px] text-ink-soft">
              所有課程
            </span>
            <span className="mt-0.5 block truncate font-label text-[0.95rem] font-medium text-ink transition-colors group-hover:text-accent">
              {course.title}
            </span>
          </span>
        </button>
      </div>

      <div className="px-4 pt-4">
        <p className="border-l-4 border-accent pl-3 text-sm leading-relaxed text-ink-soft line-clamp-4">
          {course.goal}
        </p>
      </div>

      <nav className="mt-6 flex-1 space-y-7 px-3 pb-10" aria-label="課程導覽">
        {course.tiers.map((tier) => {
          const items = nodesByTier.get(tier.tier) || [];
          if (!items.length) return null;
          return (
            <div key={tier.tier}>
              <div className="mb-2 flex items-center gap-2 px-2">
                <span
                  aria-hidden="true"
                  className={`size-2 ${tierDotClass(tier.tier)}`}
                />
                <span
                  className={`robo-kicker font-label text-[10px] font-medium ${tierTextClass(tier.tier)}`}
                >
                  Tier {tier.tier} · {tier.name}
                </span>
              </div>
              <ul className="space-y-1.5">
                {items.map((node) => {
                  const active = node.id === currentId;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(node.id)}
                        aria-current={active ? "page" : undefined}
                        aria-expanded={node.steps.length > 0 ? active : undefined}
                        className={`group flex w-full items-start gap-2.5 border-2 px-2.5 py-2 text-left text-[0.95rem] leading-snug transition-colors ${
                          active
                            ? "border-accent bg-surface font-medium text-ink shadow-[3px_3px_0_var(--color-accent)]"
                            : "border-transparent text-ink hover:border-ink hover:bg-surface"
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-4 shrink-0 font-mono text-[11px] font-medium tabular-nums ${
                            active ? "text-accent" : "text-ink-soft"
                          }`}
                        >
                          {String(node.globalOrder).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">{node.title}</span>
                        {node.steps.length > 0 && (
                          <span className="mt-0.5 flex shrink-0 items-center gap-1">
                            <span
                              className={`font-mono text-[11px] tabular-nums ${
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
                              strokeWidth="2.2"
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
                        <ul className="mt-1.5 ml-4 space-y-0.5 border-l-2 border-ink/20 pl-2">
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
                                  className={`flex w-full items-start gap-2 border-2 px-2 py-1.5 text-left text-[0.85rem] leading-snug transition-colors ${
                                    stepActive
                                      ? "border-accent bg-surface font-medium text-accent"
                                      : "border-transparent text-ink-soft hover:border-ink hover:bg-surface hover:text-ink"
                                  }`}
                                >
                                  <span className="mt-0.5 w-4 shrink-0 font-mono text-[10px] tabular-nums">
                                    {String(step.order).padStart(2, "0")}
                                  </span>
                                  <span className="min-w-0 flex-1">
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
 * Course navigation. Desktop is a sticky column that collapses into a slim
 * numbered rail for focus mode; mobile is a slide-in drawer.
 */
export default function Sidebar({
  course,
  currentId,
  currentStepId,
  onSelect,
  onSelectStep,
  onHome,
  open,
  onClose,
  collapsed,
  onToggle,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-dark/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Desktop rail (focus mode) */}
      <aside
        className={`sticky top-[3.625rem] hidden h-[calc(100vh-3.625rem)] shrink-0 border-r-2 border-ink bg-paper ${
          collapsed ? "lg:flex" : ""
        }`}
      >
        <div className="scroll-slim flex w-16 flex-col items-center gap-2 overflow-y-auto py-4">
          <button
            type="button"
            onClick={onToggle}
            aria-label="展開側欄"
            title="展開側欄（⌘B）"
            className="mb-1 p-2 text-ink-soft transition-colors hover:text-accent"
          >
            <CollapseIcon expand />
          </button>
          <button
            type="button"
            onClick={onHome}
            aria-label="所有課程"
            title="所有課程"
            className="grid size-9 shrink-0 place-items-center border-2 border-ink bg-surface text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
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
                className={`grid size-9 shrink-0 place-items-center border-2 font-mono text-[0.9rem] font-medium tabular-nums transition-colors ${
                  active
                    ? "border-ink bg-accent text-dark shadow-[3px_3px_0_rgba(28,26,22,0.9)]"
                    : "border-ink bg-surface text-ink-soft hover:border-accent hover:text-accent"
                }`}
              >
                {node.globalOrder}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Desktop expanded column */}
      <aside
        className={`sticky top-[3.625rem] hidden h-[calc(100vh-3.625rem)] w-80 shrink-0 flex-col border-r-2 border-ink bg-paper ${
          collapsed ? "" : "lg:flex"
        }`}
      >
        <div className="scroll-slim flex min-h-0 flex-1 flex-col overflow-y-auto">
          <SidebarBody
            course={course}
            currentId={currentId}
            currentStepId={currentStepId}
            onSelect={onSelect}
            onSelectStep={onSelectStep}
            onHome={onHome}
            onToggle={onToggle}
            showToggle
          />
        </div>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[86vw] shrink-0 flex-col border-r-2 border-ink bg-paper shadow-[8px_8px_0_rgba(28,26,22,0.25)] transition-transform duration-200 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="課程導覽"
        aria-hidden={!open}
      >
        <div className="scroll-slim flex min-h-0 flex-1 flex-col overflow-y-auto">
          <SidebarBody
            course={course}
            currentId={currentId}
            currentStepId={currentStepId}
            onSelect={onSelect}
            onSelectStep={onSelectStep}
            onHome={onHome}
            onClose={onClose}
          />
        </div>
      </aside>
    </>
  );
}

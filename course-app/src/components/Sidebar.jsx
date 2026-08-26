const TIER_TEXT = {
  1: "text-tier-1",
  2: "text-tier-2",
  3: "text-tier-3",
  4: "text-tier-4",
};

export const tierTextClass = (tier) => TIER_TEXT[tier] || "text-accent";

/**
 * Sidebar navigation — subject switcher + tier-grouped node list.
 * Desktop (lg+): sticky column. Mobile: slide-in drawer controlled by `open`.
 */
export default function Sidebar({
  subjects,
  course,
  currentId,
  onSelect,
  onSwitchSubject,
  open,
  onClose,
}) {
  const nodesByTier = new Map(course.tiers.map((t) => [t.tier, []]));
  for (const node of course.nodes) {
    if (!nodesByTier.has(node.tier)) nodesByTier.set(node.tier, []);
    nodesByTier.get(node.tier).push(node);
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        className={`scroll-slim fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] shrink-0
          flex-col overflow-y-auto border-r border-line bg-shade px-4 py-5 pb-10
          transition-transform duration-200 ease-out
          lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0
          ${open ? "translate-x-0 shadow-xl lg:shadow-none" : "-translate-x-full"}`}
        aria-label="課程導覽"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          {/* Subject switcher */}
          <label className="min-w-0 flex-1">
            <span className="font-label mb-1 block text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Subject
            </span>
            <select
              value={course.subject}
              onChange={(e) => onSwitchSubject(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-line bg-paper px-2 py-1.5 font-label text-sm font-semibold text-ink outline-none transition-colors hover:border-accent focus:border-accent"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}（{s.nodes}）
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={onClose}
            className="-mr-1 mt-5 rounded-md p-1 text-ink-soft hover:bg-accent-soft lg:hidden"
            aria-label="關閉選單"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-4 border-l-[3px] border-accent pl-3 text-sm leading-relaxed text-ink-soft line-clamp-4">
          {course.goal}
        </p>

        {course.tiers.map((tier) => {
          const items = nodesByTier.get(tier.tier) || [];
          if (!items.length) return null;
          return (
            <div key={tier.tier} className="mb-5">
              <div className={`mb-1.5 px-1.5 font-label text-[11px] font-bold uppercase tracking-[0.08em] ${tierTextClass(tier.tier)}`}>
                Tier {tier.tier} — {tier.name}
              </div>
              {items.map((node) => {
                const active = node.id === currentId;
                const written = node.status === "content-written";
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelect(node.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-[7px] text-left text-sm leading-snug transition-colors ${
                      active
                        ? "bg-accent-soft font-semibold text-ink"
                        : "text-ink hover:bg-accent-soft/60"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block size-2 shrink-0 rounded-full ${written ? "bg-good" : "bg-line"}`}
                      title={written ? "內容已完成" : "草稿"}
                    />
                    <span className="truncate">{node.title}</span>
                  </button>
                );
              })}
            </div>
          );
        })}

        <div className="mt-auto pt-4">
          <p className="flex items-center gap-2 px-1.5 text-[11px] text-ink-soft">
            <span className="inline-block size-2 rounded-full bg-good" /> 內容完成
            <span className="ml-2 inline-block size-2 rounded-full bg-line" /> 草稿
          </p>
        </div>
      </nav>
    </>
  );
}

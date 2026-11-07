import { useMemo } from "react";
import BlockGraph from "./BlockGraph.jsx";
import { railBlocks } from "../lib/blocks.mjs";

/** The step's local concept graph, rendered at the end of the article. */
export default function ConceptGraph({ course, step, onNavigate = null }) {
  const focusIds = useMemo(
    () =>
      (Array.isArray(step?.blocks) ? step.blocks : [])
        .map((block) => (block && typeof block === "object" ? block.id : block))
        .filter(Boolean),
    [step]
  );

  if (railBlocks(course, step).length === 0) return null;

  return (
    <section
      className="mt-16 border-t border-hairline pt-8"
      aria-label="概念關聯"
    >
      <p className="robo-kicker font-label text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
        Concept Map
      </p>
      <h2 className="mt-2 font-display text-[1.5rem] font-semibold leading-snug text-ink">
        概念關聯
      </h2>
      <p className="mt-2 text-[0.95rem] text-ink-soft">
        這一步用到的知識點，以及它們的先備與相關連結。
      </p>
      <div className="mt-6">
        <BlockGraph
          course={course}
          focusIds={focusIds}
          depth={1}
          minHeight={360}
          maxHeight={420}
          showHint={false}
          framed={false}
          onNavigate={onNavigate}
        />
      </div>
    </section>
  );
}

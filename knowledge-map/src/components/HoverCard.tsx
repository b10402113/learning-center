import { useLayoutEffect, useRef, useState } from "react";
import { STATUS_LABEL } from "../lib/colors";
import type { Node } from "../lib/types";

interface HoverCardProps {
  node: Node;
  x: number;
  y: number;
}

// Offset between the cursor and the card's top-left corner, and the minimum gap
// kept between the card and any viewport edge.
const GAP = 16;
const EDGE = 12;

// The card's fixed width (w-64). Seeded so the edge clamp engages on the very
// first frame, before the ResizeObserver reports the real size.
const CARD_WIDTH = 256;
const CARD_HEIGHT_GUESS = 120;

/**
 * The map's shared hover card: sits in the cursor's bottom-right with a gap
 * instead of covering the pointer, and clamps back into the viewport near the
 * edges so it never occludes the map center or runs off screen (spec: unified
 * reading surface, hover-card decision). `fixed` positioning so the
 * viewport-relative cursor coordinates land exactly on the card regardless of
 * the map container's offset. Shared by the nebula and roadmap views.
 */
export function HoverCard({ node, x, y }: HoverCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: CARD_WIDTH, height: CARD_HEIGHT_GUESS });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const left = Math.max(EDGE, Math.min(x + GAP, window.innerWidth - size.width - EDGE));
  const top = Math.max(EDGE, Math.min(y + GAP, window.innerHeight - size.height - EDGE));

  return (
    <div
      ref={ref}
      className="hover-card pointer-events-none fixed z-20 w-64 rounded-lg border border-border bg-surface/95 p-3 shadow-xl shadow-black/40 backdrop-blur-md"
      style={{ left, top }}
      role="tooltip"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-foreground">{node.title}</span>
        <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted">
          {STATUS_LABEL[node.status]}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{node.goal}</p>
    </div>
  );
}

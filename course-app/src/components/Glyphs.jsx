/**
 * Custom line-art marks for the course. Everything is drawn on a 24px grid
 * with currentColor so it inherits the warm paper / ink / orange tokens.
 * The glyph a node gets is derived from its id, which keeps the same node
 * recognisable across the index, sidebar and roadmap without storing artwork.
 */

const GLYPHS = [
  // orbit / compass
  <>
    <circle cx="12" cy="12" r="7.4" />
    <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
    <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4" />
  </>,
  // layers
  <>
    <path d="m12 3.8 8 4.1-8 4.1-8-4.1Z" />
    <path d="m4 12.2 8 4.1 8-4.1" />
    <path d="m4 16.1 8 4.1 8-4.1" />
  </>,
  // loop
  <>
    <path d="M5.2 9A7.2 7.2 0 0 1 18 7.6" />
    <path d="M18 4.4v3.2h-3.2" />
    <path d="M18.8 15A7.2 7.2 0 0 1 6 16.4" />
    <path d="M6 19.6v-3.2h3.2" />
  </>,
  // terminal
  <>
    <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="3" />
    <path d="m7.6 9.8 2.6 2.2-2.6 2.2" />
    <path d="M12.6 14.2h4" />
  </>,
  // branch
  <>
    <circle cx="6.4" cy="6" r="2.2" />
    <circle cx="6.4" cy="18" r="2.2" />
    <circle cx="18" cy="12" r="2.2" />
    <path d="M8.5 7.1c3 .9 4.6 2.4 7.4 3.6" />
    <path d="M8.5 16.9c3-.9 4.6-2.4 7.4-3.6" />
  </>,
  // shield
  <>
    <path d="M12 3.4 19 6v5.4c0 4-2.8 7-7 8.8-4.2-1.8-7-4.8-7-8.8V6Z" />
    <path d="m9.1 11.8 2.1 2.1 3.9-4.2" />
  </>,
  // open book
  <>
    <path d="M12 6.1C10 4.8 7.5 4.3 4.6 4.8v13c2.9-.5 5.4 0 7.4 1.4 2-1.4 4.5-1.9 7.4-1.4v-13c-2.9-.5-5.4 0-7.4 1.3Z" />
    <path d="M12 6.1v13" />
  </>,
  // spark
  <>
    <path d="M12 3.4c.7 4.7 3.3 7.3 8 8-4.7.7-7.3 3.3-8 8-.7-4.7-3.3-7.3-8-8 4.7-.7 7.3-3.3 8-8Z" />
    <circle cx="18.6" cy="5.4" r="1.1" fill="currentColor" stroke="none" />
  </>,
];

function hash(value) {
  let h = 2166136261;
  const text = String(value ?? "");
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function glyphIndex(seed) {
  return hash(seed) % GLYPHS.length;
}

/** One deterministic line glyph for a node, step or subject. */
export function NodeGlyph({
  seed,
  size = 20,
  className = "",
  strokeWidth = 1.55,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {GLYPHS[glyphIndex(seed)]}
    </svg>
  );
}

/** Small graph mark: three concepts joined by an edge. */
export function KnowledgeGlyph({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="6" cy="7" r="2.4" />
      <circle cx="18" cy="6" r="2.1" />
      <circle cx="12" cy="18" r="2.6" />
      <path d="m8.2 7.8 7.3-1.1M7.2 9.2l3.6 6.6M16.9 8l-3.9 7.6" />
    </svg>
  );
}

/**
 * Large hero illustration: a calm orbit field. Two rings and a handful of
 * dots, with one orange node. The dashed ring drifts very slowly unless the
 * reader prefers reduced motion.
 */
export function OrbitMark({ className = "", title = "" }) {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
    >
      {title ? <title>{title}</title> : null}
      <ellipse
        cx="110"
        cy="90"
        rx="86"
        ry="49"
        transform="rotate(-17 110 90)"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.2"
      />
      <ellipse
        cx="110"
        cy="90"
        rx="63"
        ry="34"
        transform="rotate(23 110 90)"
        stroke="currentColor"
        strokeOpacity="0.26"
        strokeWidth="1.2"
      />
      <g className="orbit-spin">
        <circle
          cx="110"
          cy="90"
          r="40"
          stroke="currentColor"
          strokeOpacity="0.32"
          strokeWidth="1.1"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M110 62c3.1 22 12.9 31.8 35 35-22.1 3.2-31.9 13-35 35-3.1-22-12.9-31.8-35-35 22.1-3.2 31.9-13 35-35Z"
        stroke="currentColor"
        strokeOpacity="0.62"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="110" cy="97" r="4.2" fill="var(--color-accent)" />
      <g fill="currentColor">
        <circle cx="181" cy="63" r="2.6" opacity="0.5" />
        <circle cx="46" cy="116" r="2.2" opacity="0.4" />
        <circle cx="157" cy="143" r="2.4" opacity="0.35" />
        <circle cx="67" cy="47" r="1.8" opacity="0.45" />
      </g>
      <circle cx="146" cy="121" r="3.4" fill="var(--color-accent)" opacity="0.85" />
      <circle
        cx="146"
        cy="121"
        r="7.5"
        stroke="var(--color-accent)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Decorative section rule: a small sprout mark followed by a hairline that
 * fades out. Replaces the old hard 2px section underline.
 */
export function ChapterRule({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-2.5 ${className}`}
    >
      <svg
        width="22"
        height="10"
        viewBox="0 0 22 10"
        fill="none"
        className="shrink-0 text-accent"
      >
        <path
          d="M1 5h6.2M14 5h7"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="11" cy="5" r="2.1" fill="currentColor" />
        <circle cx="11" cy="5" r="4" stroke="currentColor" strokeOpacity="0.3" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-r from-ink/20 via-ink/10 to-transparent" />
    </div>
  );
}

/** Line-art empty state: a quiet path ending at a flag. */
export function EmptyMark({ className = "", size = 120 }) {
  return (
    <svg
      width={size}
      height={(size * 3) / 4}
      viewBox="0 0 160 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M18 96c18-4 28-4 44 0s26 4 42 0 24-4 38 0"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M36 96c0-22 8-34 24-42s26-14 34-30"
        stroke="currentColor"
        strokeOpacity="0.38"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="4 6"
      />
      <circle cx="36" cy="96" r="4" fill="currentColor" opacity="0.4" />
      <path
        d="M94 24v30"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M94 25h20l-4 7 4 7H94Z"
        stroke="var(--color-accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="94" cy="18" r="2.6" fill="var(--color-accent)" />
    </svg>
  );
}

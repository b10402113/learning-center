---
source: sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/resources/robo-style/robo-SKILL.md
source_type: text
source_lines: 136
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Skill identity — `name: robo`; description calls it the locked ROBO visual style: static, infographic-heavy, dot-matrix (halftone) art, paper-white/black/orange palette, Outfit + Doto type; triggers on "/robo", "robo style", "robo slides", "robo design", "make it robo".
- Single-file style — one SKILL.md holds the whole system (palette, type, dot-matrix technique, cards, icons) and points to `brand-book.html` in the same folder as the self-documenting reference to open first.
- Locked palette — paper white `#f2efe8` (cards `#faf8f2`), near-black `#131311`, ink `#1c1a16`, cream `#e8e2d2`, muted grays, and orange `#ff6b1a` as the only accent; yellow `#f5a623` is an optional cameo, never a second accent.
- Locked type — Outfit everywhere (headings 500, body 400, letterspaced uppercase kickers) with Doto 900 for 1–2 emphasized heading words or big stats, both loaded from Google Fonts, plus a `.doto { margin-left: 0.15em; }` spacing rule.
- House technique — a variable-thickness dot matrix rendered on canvas by the included `halftone()` engine plus `pn()` deterministic noise and `inPoly()`; dots get radius from a brightness function, with worked recipes for sphere, hexagon, arrow, bar chart, wave, and sunburst.
- Components — cards are 2px ink borders with solid offset shadows (orange for the one highlighted card) and pixel-sprite icons drawn from row-string grids via `sprite()`, not vector SVGs.
- Guardrails — canvas sizing gotchas, `color-scheme` declarations, a 20%-opacity rule for text over dots, a never-break arrow/connector rule, and an explicit "what this style is NOT" list.

# L2 detail

- `#L1-L11` — Frontmatter (`name: robo`, description with palette, fonts, and trigger phrases) and the opening statement that this one file is the entire style, with `brand-book.html` to be opened first and visually matched.
- `#L12-L45` — Colors table (backgrounds, ink, cream, muted, orange highlight, yellow cameo) and the orange-discipline rule that orange marks exactly one deliberate highlight; typography table (Outfit weights and spacing, Doto for headers and stats), Doto spacing rule, and the Google Fonts import block.
- `#L46-L84` — The dot-matrix halftone technique: verbatim `halftone()`, `pn()`, and `inPoly()` code, conventions (color-scheme guard, text-over-dots rule at ~20% opacity, two layers max, step 8–11px, `maxR` ≈ 0.4×step, deterministic noise, per-background dot colors), the recipe library for eight shapes, and guidance to write new 10–30 line brightness functions instead of hand-placing dots.
- `#L85-L116` — Cards and pixel icons: card CSS with hard border, offset shadow, icon column grid, highlighted `.hot` variant, dark inversion; the `sprite()` canvas renderer with a worked folder icon, icon rules (10×10 or 12×12, one color, outline preferred, orange only for the highlighted card, `image-rendering: pixelated`), and pointers to brand-book examples.
- `#L117-L136` — Canvas gotchas (1: `inset: 0` does not stretch a canvas; 2: headless slide screenshots by hiding other slides rather than slicing sections; 3: declare `color-scheme` on pages with a theme toggle), the arrow/connector rule (same coordinate system, own grid cell, or runtime `getBoundingClientRect()`), and the "what this style is NOT" constraints.

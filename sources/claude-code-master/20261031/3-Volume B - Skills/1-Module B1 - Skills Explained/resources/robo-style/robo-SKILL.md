---
name: robo
description: The ROBO visual style - static, infographic-heavy design with dot-matrix (halftone) art, a paper-white / black / orange palette, and Outfit + Doto type. Use for slides, decks, one-pagers, simple web UI, and any visual where you want a clean, printed, professional look. Triggers on "/robo", "robo style", "robo slides", "robo design", "make it robo".
---

# /robo - The ROBO Visual Style

A locked house style: static, professional, infographic-heavy, dot-matrix art. Everything below applies to **every** robo build. This one file is the whole style - palette, type, the dot-matrix technique, cards, and icons.

**Brand book (open FIRST):** [`brand-book.html`](brand-book.html) in this skill folder - the style documenting itself: colors, the type ramp with locked weights, dot-matrix principles, shape-recipe thumbnails, the card + icon spec, and layout rules. It is built entirely in /robo style. When you build something, match how it looks.

---

## Colors (LOCKED)

| Role | Value | Use |
|---|---|---|
| Main background | `#f2efe8` (paper white; `#faf8f2` for cards on it) | default light bg |
| Secondary background | `#131311` (near-black) | emphasis slides, half-slide splits, dark sections, app dark mode |
| Ink (text on light) | `#1c1a16` | all text on paper |
| Cream (text on dark) | `#e8e2d2` | all text on black |
| Muted | `#6f6a5c` light / `#8d8775` dark | secondary text |
| **Highlight** | `#ff6b1a` orange | the ONLY accent. Emphasis words, key dots, hero shapes |
| Secondary highlight | `#f5a623` yellow | **only when you deliberately choose it.** Never by default. When used, keep it a cameo - 1-2 small appearances (a stream, rare flecks), never a second co-equal accent |

No other colors. No teal / violet / cyan in this style.

**Orange discipline:** orange marks ONE deliberate highlight - the thing the slide is telling you to pick or look at (e.g. the recommended option in a list). If nothing on the slide needs highlighting, NO box / card / chip gets orange - everything stays ink on paper. Never orange elements just for visual variety or to "show" a detail the layout already shows. Doto emphasis words in headings and orange stat numbers are fine; orange borders / shadows on boxes need a reason you could say out loud.

## Typography (LOCKED)

| Font | Role | Rules |
|---|---|---|
| **Outfit** | Everything by default | Headings **500** (700-800 is too thick), tight letter-spacing (-1 to -2px). Body **400** (100-300 is too thin). Kickers: weight 400, letterspaced 6px, uppercase. |
| **Doto** (Google Fonts, weight 900) | The pixel font | **Headers only**, to emphasize 1-2 words inside an Outfit heading (`The system is <span class="doto">YOURS</span>`). Usually orange. Also OK for big standalone stats / numbers. Never body text. |

Both fonts are free Google Fonts - load them from the CDN, nothing to install.

**Doto spacing rule (LOCKED):** when a Doto span follows Outfit text on the same line, the natural word space looks too tight (Doto glyphs fill their full box). Always include `.doto { margin-left: 0.15em; }` so inline Doto emphasis gets extra breathing room after Outfit. Harmless on line-start spans, so apply it globally.

Import block:
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&family=Doto:wght@400;600;700;900&display=swap" rel="stylesheet">
```

## Visuals - dot-matrix halftone (THE house technique)

Every visual is rendered as a **variable-thickness dot matrix**: dots on a fixed grid where dot RADIUS comes from a brightness function - shapes emerge from dot size, like halftone print. Render on `<canvas>` with this engine (copy verbatim into every build):

```js
function halftone(id, w, h, step, maxR, color, fn, color2, fn2) {
  const c = document.getElementById(id); if (!c) return;
  const ctx = c.getContext('2d'); const dpr = window.devicePixelRatio || 1;
  c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px'; ctx.scale(dpr, dpr);
  for (let y = step / 2; y < h; y += step) for (let x = step / 2; x < w; x += step) {
    const u = x / w, v = y / h;
    let b = fn(u, v), col = color;
    if (fn2) { const b2 = fn2(u, v); if (b2 > b) { b = b2; col = color2; } }
    if (b <= 0.02) continue;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, Math.min(maxR, b * maxR), 0, Math.PI * 2); ctx.fill();
  }
}
function pn(x, y) { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v); }   // deterministic noise
function inPoly(pts, u, v) { let s = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) if ((pts[i][1] > v) !== (pts[j][1] > v) && u < (pts[j][0] - pts[i][0]) * (v - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0]) s = !s; return s; }
```

Conventions:
- **Color-scheme guard:** every deck / page gets `html { color-scheme: light; }` (plus `dark` on the dark-theme selector if there's a theme toggle) so Chrome's Auto Dark Mode never inverts the palette.
- **Text over dots rule (LOCKED):** if text sits on top of a dot-matrix area, the dots behind the text drop to ~20% opacity (80% transparent) - e.g. `rgba(255,107,26,0.2)`. Never full-strength dots under same-color text. Alternatives that also satisfy the rule: leave a hollow zone in the brightness function where the text sits (sunburst-style), or reduce the field's alpha in a radius around the text block.
- Two layers max per shape: ink / cream field + one orange feature layer (`fn2`).
- `step` 8-11px, `maxR` ≈ 0.4×step. Use `pn()` for texture, never `Math.random()` (renders must be reproducible).
- Light bg → ink dots `rgba(28,26,22,0.88)`. Dark bg → cream dots `rgba(232,226,210,0.85)`. Orange `#ff6b1a` for the feature.

**Recipe library** - worked brightness functions you can copy straight from `brand-book.html` (the eight shapes on the "Recipe library" slide are all live code in its `<script>`):
- **Sphere** - lambert shading: `z = sqrt(r²-d²)`, brightness from a light vector. Optional facet / grid quantization (disco ball, globe).
- **Hexagon** - `inPoly(HEX, u, v)` + a diagonal light edge; `HEX` points and `hexFn` / `hexEdge` are in `brand-book.html`.
- **Arrow** - shaft + head region test, brightness ramps toward the tip.
- **Bar chart** - column index from `floor(u*n)`, dots appear above `1-height`, thicken upward. Data slides stay in-style.
- **Wave** - sine crest, dots thicken with depth below it.
- **Sunburst** - `sin(angle*rays)` × radial falloff, hollow center for type.
- **Hourglass / mountain** - see `brand-book.html`.

New shapes: write a new brightness function (10-30 lines). Cheap in tokens - never hand-place dots, never emit thousands of SVG circles.

## Cards + pixel icons

Card design:
```css
.card { border: 2px solid var(--ink); background: #faf8f2; padding: 18px 20px;
        box-shadow: 6px 6px 0 rgba(28,26,22,0.9);
        display: grid; grid-template-columns: 52px 1fr; gap: 16px; align-items: center; }
.card.hot { border-color: #ff6b1a; box-shadow: 6px 6px 0 #ff6b1a; }   /* highlight card */
```
Hard 2px ink border, solid offset shadow (ink default, orange for THE highlighted card), icon column left + title / sub right. On dark backgrounds invert: cream border `#e8e2d2`, shadow `rgba(232,226,210,0.35)`.

**Icons are pixel sprites, not vector SVGs.** Render on canvas from row-string grids (crisp at any scale via integer pixel cells):

```js
function sprite(canvasId, rows, palette, px) {
  const c = document.getElementById(canvasId); if (!c) return;
  const ctx = c.getContext('2d');
  c.width = rows[0].length * px; c.height = rows.length * px;
  rows.forEach((row, y) => [...row].forEach((k, x) => {
    if (k !== '.') { ctx.fillStyle = palette[k]; ctx.fillRect(x * px, y * px, px, px); }
  }));
}
// usage: 10x10 grid, '.'=empty, letter keys map to palette colors
sprite('icFolder', ['..........','.kkkk.....','k....k....','k....kkkkk','k........k','k........k','k........k','k........k','.kkkkkkkk.','..........'], { k:'#1c1a16' }, 4.5);
```

Icon rules:
- 10×10 or 12×12 grids, one color per icon: ink `#1c1a16` on light, cream `#e8e2d2` on dark, orange `#ff6b1a` ONLY for the highlight card's icon.
- Outline style preferred (hollow shapes) - it matches the dot-matrix lightness. Solid fill reserved for the orange highlight icon.
- Set `image-rendering: pixelated` if the canvas is CSS-scaled.
- Three worked icons (folder outline, router/skills, solid orange highlight) live in `brand-book.html` on the "Cards + icons" slide - copy them.

## Canvas gotchas (these will bite you)

1. **`inset: 0` does NOT stretch a canvas.** Canvas is a replaced element - absolute positioning with `inset: 0` leaves it at its intrinsic 300×150. Always set explicit size: `width: 100%; height: 100%` (or `100vw/100vh` for fixed backgrounds). Symptom: the dot effect renders in a tiny patch at the top-left.
2. **Verifying slides headlessly:** anchor links (`#s3`) don't scroll reliably in headless Chrome with scroll-snap. To screenshot one slide, write a temp copy that hides the others: append `.slide{display:none!important} #s3{display:flex!important}` to the CSS. Don't slice sections out of the file - the shared JS dies on missing elements and every canvas goes blank.
3. **Declare `color-scheme` on any page with a light / dark toggle.** `html { color-scheme: light; }` + `html[data-theme="dark"] { color-scheme: dark; }`. Without it, Chrome's Auto Dark Mode can invert the palette on its own.

## Arrow / connector rule (never break)

Never hand-place an arrow over HTML with absolute coordinates. Either:
1. arrows + endpoints live in the **same canvas / SVG coordinate system**, or
2. the arrow gets its **own grid cell** between boxes (`grid-template-columns: auto 1fr auto 1fr auto`), or
3. measure endpoints at runtime with `getBoundingClientRect()`.

## What this style is NOT

- Not multi-color (no teal / violet / cyan accents)
- Not text-heavy (no paragraph slides, no bullet walls)
- Not a serif voice - /robo is Outfit-only plus the Doto pixel font for emphasis
- No background mesh, no scattered sprites, no watermark - clean canvas
- Static by default; the only motion is sparing dot-matrix animation

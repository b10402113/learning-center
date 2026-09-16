---
source: reacticle
source_type: codebase
source_lines: 24475
language: typescript
file_count: 166
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — reacticle

## Overview (L1)

- `src/components/` — 26 semantic React components (structure, insight, media, decision, technical, interaction, free-layer) that form the ReActicle article protocol. AI agents compose these instead of writing raw HTML; each component renders themed, self-contained markup.
- `src/theme/` — Token-based theme system (`--ra-*` CSS variables) with 11 editorial themes (Tufte, Press, Shannon, Vignelli, Knuth, Freddie, Andy, Bodoni, Bayer, Fuller, Sottsass). Each theme is a CSS token bundle + a Markdown authoring profile. ThemeProvider sets `data-theme` on the root.
- `src/export/` — Export utilities: ExportBar toolbar (PDF via print, copy as Action Items, copy as Prompt), clipboard helpers, and format converters (`actionItemsToMarkdown`, `decisionToPrompt`).
- `apps/site/` — Unified docs + component reference + gallery site built entirely in ReActicle. Hash-routed SPA with pages for getting started, theming, components, gallery, recipes, FAQ, architecture, contributing.
- `vite.config.ts` — Library build: ES module output from `src/index.ts`, externalizes React. Site build: Vite SPA from `apps/site/`. Report build: single-file HTML via `vite-plugin-singlefile`.
- `netlify.toml` — Deploys to Netlify with SPA fallback redirect to `index.html`.

## Structure (L2)

### `src/index.ts`

- Locator: `[[sources/ai-html/20260910/reacticle/src/index.ts]]`
- Purpose: Public API barrel — single import surface (`reacticle`) for all components, theme types, and export utilities. Authors and AI import from here; no submodule paths.
- Key exports: `ThemeProvider`, `THEMES`, `ThemeName`, `Article`, `Hero`, `Lead`, `Section`, `Subsection`, `TOC`, `Conclusion`, `Summary`, `Aside`, `Quote`, `Table`, `Image`, `Video`, `Audio`, `RiskList`, `Decision`, `ActionList`, `Checkpoint`, `Tradeoff`, `Incident`, `CodeBlock`, `Formula`, `HighlightedCode`, `DiffReview`, `Detail`, `Tabs`, `Raw`, `MissingField`, `ExportBar`, `actionItemsToMarkdown`, `decisionToPrompt`, `copyToClipboard`
- Dependencies: All `src/components/` and `src/theme/` modules
- Learner-relevant: Shows how a React library exposes a flat, convention-over-configuration public API for AI authoring

### `src/components/structure/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/structure/]]`
- Purpose: Article skeleton — container, title block, lead paragraph, numbered sections, nested subsections, auto-derived TOC with scroll-spy, and conclusion. The structural bones every ReActicle article uses.
- Key exports: `Article` (top-level container, width modes: narrow/regular/wide/full, auto-TOC via `useLayoutEffect` + `IntersectionObserver`), `Hero` (title block with eyebrow/subtitle/meta), `Lead` (opening paragraph), `Section` (h2-level section with index/anchor), `Subsection` (h3/h4 nested, auto-level via `HeadingDepthContext`), `TOC` (left-hand nav with scroll-spy, hash-safe anchor clicks via `replaceState`), `Conclusion` (takeaways list + body)
- Dependencies: `src/components/internal/MissingField` (missing field markers), `structure.css`
- Learner-relevant: Demonstrates DOM-reading patterns (`data-ra-toc` attributes read by `Article` after commit), heading depth context propagation, and scroll-spy via IntersectionObserver

### `src/components/insight/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/insight/]]`
- Purpose: Point-making components — Summary (key takeaways as bullet list), Aside (themed callout with 4 tones: note/principle/capability/warning), Quote (attributed quotation with who/source).
- Key exports: `Summary` (points array + optional title), `Aside` (tone + label + children), `Quote` (who + source + children)
- Dependencies: `src/components/internal/MissingField`, `insight.css`
- Learner-relevant: Shows how semantic tone ("principle" vs "warning") is component-owned but visually theme-owned — the same Aside renders differently in Tufte vs Sottsass

### `src/components/structured/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/structured/]]`
- Purpose: Media and data components — Image (URL + caption + credit + ratio), Video (native controls + caption), Audio (native controls + caption), Table (typed columns/rows with alignment). All accept `width` and `ratio` for layout stability.
- Key exports: `Image` (src/alt/caption/credit/ratio/width), `Video` (src/title/poster/caption/credit/ratio/controls/autoPlay/muted), `Audio` (src/title/caption/credit/width), `Table` (caption/source/columns/rows, columns typed as `TableColumn[]` with key/label/align/width)
- Dependencies: `src/components/internal/MissingField`, `structured.css`
- Learner-relevant: Image intentionally rejects SVG (directs to Raw); media components handle missing required fields with explicit `MissingField` markers rather than silent fallbacks

### `src/components/decision/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/decision/]]`
- Purpose: Judgment and execution components — Decision (ADR-style: question/options/criteria/recommended/rationale), RiskList (risk items with impact/likelihood/mitigation/owner), ActionList (task/owner/due/status), Checkpoint (human-in-the-loop confirmation), Tradeoff (pros/cons/verdict), Incident (severity/status/timeline/rootCause/resolution). Pill component renders severity/status badges.
- Key exports: `Decision`, `RiskList`, `ActionList`, `Checkpoint`, `Tradeoff`, `Incident`, `Pill` (Level type: 'high' | 'medium' | 'low')
- Dependencies: `src/components/internal/MissingField`, `decision.css`
- Learner-relevant: This is the "report-grade" component set that makes ReActicle more than a blog renderer — it captures engineering decisions, risk assessments, incident postmortems, and action tracking as first-class semantic structures

### `src/components/technical/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/technical/]]`
- Purpose: Code and math presentation — CodeBlock (Prism syntax highlighting + copy button + line numbers), Formula (KaTeX inline/block rendering), HighlightedCode (shared Prism renderer, used by CodeBlock), DiffReview (diff lines with add/del/context markers + review notes).
- Key exports: `CodeBlock` (code/language/title/showLineNumbers/copyable), `Formula` (tex/block/caption), `HighlightedCode` (code/language/showLineNumbers), `DiffReview` (file/title/lines/notes, DiffLine type: add|del|ctx, DiffNote type: ref|text)
- Dependencies: `prismjs` (runtime dep, bundled), `katex` (runtime dep, bundled), `src/export/exports` (clipboard), `src/components/internal/MissingField`, `technical.css`
- Learner-relevant: Prism languages are imported statically (markup, css, javascript, jsx, typescript, tsx, bash, json) — not all Prism grammars. KaTeX renders to HTML+MathML with `throwOnError: false`. DiffReview renders diffs as structured data, not raw text.

### `src/components/interaction/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/interaction/]]`
- Purpose: Lightweight interactivity — Detail (collapsible `<details>`-like component with summary + expandable children), Tabs (multi-perspective view with label/content tab items and initial index).
- Key exports: `Detail` (summary/children/open), `Tabs` (tabs/initial, TabItem type: label|content)
- Dependencies: `interaction.css`
- Learner-relevant: These are the only two components that add interactive state beyond the semantic layer; everything else is static markup

### `src/components/free/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/free/Raw.tsx]]`
- Purpose: The free-expression escape hatch — accepts arbitrary React children, HTML strings, SVG, canvas, animations. Must use `--ra-*` theme tokens for consistency. Not a widget library; each Raw block is authored fresh for its specific spot.
- Key exports: `Raw` (title/html/children — html renders via `dangerouslySetInnerHTML`, children renders React content directly)
- Dependencies: `free.css`
- Learner-relevant: Raw is described as "not rarely-used" — the protocol expects heavy use. The contract is: any creative content (SVG diagrams, interactive widgets, animations) goes here, but always reads theme tokens. Theme switching re-styles all Raw blocks automatically.

### `src/components/internal/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/components/internal/MissingField.tsx]]`
- Purpose: Completeness enforcement without a separate validator — when a required field is missing, `MissingField` renders an explicit visible warning ("未指定{label}") instead of silently swallowing it. `fieldOr()` helper returns the value or a MissingField marker.
- Key exports: `MissingField` (label), `fieldOr` (value, label) → string | ReactNode
- Dependencies: `MissingField.css`
- Learner-relevant: Key design decision — no Guard/validator layer; completeness is enforced at render time by the components themselves. This makes missing fields visible in the final HTML output.

### `src/theme/ThemeProvider.tsx`

- Locator: `[[sources/ai-html/20260910/reacticle/src/theme/ThemeProvider.tsx]]`
- Purpose: Establishes the theme root. Wraps content in a `div.ra-root` with `data-theme` attribute. Default theme is "tufte". Exports `THEMES` (array of 11 theme names) and `THEME_LABELS` (human-readable labels).
- Key exports: `ThemeProvider` (theme/children/classname), `THEMES` (readonly tuple), `THEME_LABELS` (Record<ThemeName, string>), `ThemeName` type
- Dependencies: `index.css` (imports all theme CSS)
- Learner-relevant: The Provider is deliberately thin — just a div with an attribute. All visual differentiation happens via CSS `[data-theme="..."]` selectors, not React context.

### `src/theme/tokens.css`

- Locator: `[[sources/ai-html/20260910/reacticle/src/theme/tokens.css]]`
- Purpose: The `--ra-*` design token contract — the ONLY values components may reference. Covers surfaces/ink colors, accent/semantic colors, typography (fonts, sizes, weights, tracking), spacing scale (9 levels), shape/depth (radius, shadow), motion (ease, transition), and layout (content-width, measure, toc-width). Default values are neutral fallbacks.
- Key exports: `:root` CSS custom properties (70+ `--ra-*` variables)
- Dependencies: None (foundation layer)
- Learner-relevant: This is the core architectural constraint — components never hardcode colors/spacing/fonts. A theme overrides these tokens via `[data-theme="..."]` selectors. The token system includes deliberate design choices: italics disabled across ALL themes (`font-style: normal !important`), emphasis carried by weight/color/spacing only.

### `src/theme/base.css`

- Locator: `[[sources/ai-html/20260910/reacticle/src/theme/base.css]]`
- Purpose: Base styling at `.ra-root` — sets typography from tokens, heading hierarchy, link styling (ink+thin underline), code font, selection color, eyebrow label style, and side-note (marginalia) pattern. Deliberately spare: no background washes, no decoration.
- Key exports: `.ra-root`, `.ra-root h1-h4`, `.ra-root p`, `.ra-root a`, `.ra-root code`, `.ra-eyebrow`, `.ra-sidenote`
- Dependencies: `tokens.css`
- Learner-relevant: Encodes the "line-not-box" philosophy — no card fills, no shadows, no radius at the base layer. Italic disabled globally with `!important`.

### `src/theme/themes/`

- Locator: `[[sources/ai-html/20260910/reacticle/src/theme/themes/]]`
- Purpose: 11 editorial themes, each as a CSS file + Markdown authoring profile. CSS files override `--ra-*` tokens under `[data-theme="<name>"]` selectors. Markdown files describe the theme's design rationale, palette, typography, spacing, signature techniques, code/media/Raw style, and anti-patterns.
- Key exports: 11 subdirectories: `tufte/`, `press/`, `shannon/`, `vignelli/`, `knuth/`, `freddie/`, `andy/`, `bodoni/`, `bayer/`, `fuller/`, `sottsass/`
- Dependencies: `tokens.css` (they override `--ra-*` values)
- Learner-relevant: Each theme is both a visual contract (CSS tokens) and an authoring contract (Markdown). The Markdown profiles instruct AI agents on what photography, code style, and Raw idioms belong to that theme — "themes are contracts, not stylesheets." Example: Tufte enforces maximum data-ink ratio, no cards/shadows/radius, exactly two data colors, old-style serif body.

### `src/theme/index.css`

- Locator: `[[sources/ai-html/20260910/reacticle/src/theme/index.css]]`
- Purpose: Single CSS entry point — imports tokens, base, all 11 theme CSS files, and print.css in order.
- Key exports: CSS import chain
- Dependencies: All theme CSS files, `tokens.css`, `base.css`, `print.css`
- Learner-relevant: Shows the CSS cascade structure — token defaults → base reset → theme overrides → print overrides

### `src/export/ExportBar.tsx`

- Locator: `[[sources/ai-html/20260910/reacticle/src/export/ExportBar.tsx]]`
- Purpose: Non-print toolbar with three export actions: PDF (via `window.print()`), copy action items as markdown, copy decision as AI prompt. Hidden automatically in print via `.no-print` class.
- Key exports: `ExportBar` (actionItems?: ActionItem[], decision?: DecisionProps)
- Dependencies: `src/components/decision/ActionList` (ActionItem type), `src/components/decision/Decision` (DecisionProps type), `src/export/exports` (format functions), `ExportBar.css`
- Learner-relevant: Demonstrates the "export as prompt" pattern — structured components can be serialized back to text suitable for feeding into AI agents, completing the round-trip from AI-authored component → rendered HTML → AI-readable text.

### `src/export/exports.ts`

- Locator: `[[sources/ai-html/20260910/reacticle/src/export/exports.ts]]`
- Purpose: Three utility functions: `actionItemsToMarkdown` (renders ActionItem[] as markdown checklist with owner/due/status), `decisionToPrompt` (renders DecisionProps as structured prompt text), `copyToClipboard` (async with `navigator.clipboard` → legacy `execCommand` fallback).
- Key exports: `actionItemsToMarkdown`, `decisionToPrompt`, `copyToClipboard`
- Dependencies: `src/components/decision/ActionList` (ActionItem type), `src/components/decision/Decision` (DecisionProps type)
- Learner-relevant: The `decisionToPrompt` function shows how structured component data can be serialized back to natural language for feeding into AI agents — a key "round-trip" pattern in the ReActicle protocol.

### `apps/site/src/App.tsx`

- Locator: `[[sources/ai-html/20260910/reacticle/apps/site/src/App.tsx]]`
- Purpose: Root SPA component — hash-based router with four top-level sections (home, guide, components, gallery). Routes: home, start, components, component/:slug, theming, raw, export, skill, recipes, faq, contributing, markdown, gallery/:slug, architecture. Theme follows user only in components section; other sections pinned to fixed default theme.
- Key exports: `App` component
- Dependencies: All page components, `lib/site` (router/theme hooks), UI components (TopNav, Sidebar, OnThisPage, Footer)
- Learner-relevant: Demonstrates a zero-dependency hash router built from scratch (`useRoute` hook parsing `window.location.hash`), external store pattern for theme state (`useSyncExternalStore`), and section-aware theme behavior.

### `apps/site/src/lib/site.ts`

- Locator: `[[sources/ai-html/20260910/reacticle/apps/site/src/lib/site.ts]]`
- Purpose: Site infrastructure — hash router (`useRoute`), global theme store (`useSiteTheme`/`setSiteTheme` via external store), section-aware chrome theme application, version constant. Theme state persisted in localStorage, broadcast to listeners via `Set<() => void>`.
- Key exports: `useRoute` (returns RouteState), `useSiteTheme` (returns ThemeName), `setSiteTheme`, `applyChromeTheme`, `sectionOf`, `REPO_URL`, `VERSION`
- Dependencies: `reacticle` (THEMES, ThemeName)
- Learner-relevant: External store pattern without React context — deeply nested components can re-render on theme change without prop-drilling. Hash routing via `location.hash` parsing with manual scroll and `history.replaceState` for anchor management.

### `apps/site/src/data/catalog.tsx`

- Locator: `[[sources/ai-html/20260910/reacticle/apps/site/src/data/catalog.tsx]]`
- Purpose: Component catalog data — defines all 26 components organized into 7 categories (structure, insight, media, data, decision, technical, interaction, free) with live demos, copyable code snippets, props tables, and multi-example detail views. Exports `allComponents` (flattened), `findComponent`, `componentNeighbors`.
- Key exports: `catalog` (CatalogCategory[]), `allComponents` (FlatComponent[]), `findComponent`, `componentNeighbors`, `slugOf`
- Dependencies: All `reacticle` components (for live demos), `reports/RawPieces` and `reports/RawExamples` (for Raw examples)
- Learner-relevant: The catalog is both documentation data and a live testing ground — each component demo renders the actual component with real props, not a static screenshot.

### `apps/site/src/data/gallery.tsx`

- Locator: `[[sources/ai-html/20260910/reacticle/apps/site/src/data/gallery.tsx]]`
- Purpose: Gallery specimen articles — 11 curated long-form articles (one per theme), each a full React component rendered inside ThemeProvider. Entries carry metadata (slug, title, kind, theme, date, blurb) for the index page. Exports sorted entries, kind filters, and neighbor navigation.
- Key exports: `galleryEntries` (GalleryEntry[]), `galleryKinds` (string[]), `findGalleryEntry`, `galleryNeighbors`, `THEME_ACCENT` (per-theme accent colors)
- Dependencies: All 11 report components from `reports/`, `reacticle` (ThemeName type)
- Learner-relevant: Each gallery entry is a complete, themed ReActicle article — the gallery is the canonical demonstration that the protocol works end-to-end across all 11 themes.

### `apps/site/src/reports/`

- Locator: `[[sources/ai-html/20260910/reacticle/apps/site/src/reports/]]`
- Purpose: 11 specimen long-form articles + shared Raw pieces. Each report (CaffeineHalfLife, MovableType, PoolExhaustion, OrbitSpec, LinearAttention, FirstNewsletter, SlowBreathing, FrontPage, GeometryOfMeaning, RateLimiter, ColorClash) is a self-contained React component using ReActicle components + custom Raw blocks. RawPieces.tsx contains reusable creative components (TokenEconomics, DensityChart, ThemeTokens, KineticHeadline, FeatureGrid, ComponentCloud). RawExamples.tsx contains small capability demos (LiveCounter, ProgressGauge, Kimiline, OrbitLoader). report-entry.tsx is the entry for single-file HTML builds.
- Key exports: 11 report components, 6 RawPieces components, 4 RawExamples components
- Dependencies: All `reacticle` components (Article, Hero, Section, CodeBlock, etc.), RawExamples/RawPieces
- Learner-relevant: These reports demonstrate the full range of ReActicle's capabilities — from Tufte-style data notes with inline SVG Kimilines and draggable calculators, to Shannon-style incident postmortems with DiffReview and RiskList, to Knuth-style academic papers with KaTeX formulas and numbered figures. They also show the single-file HTML build pattern via report-entry.tsx.

### `apps/site/vite.config.ts`

- Locator: `[[sources/ai-html/20260910/reacticle/apps/site/vite.config.ts]]`
- Purpose: Site build config — Vite SPA with React plugin, alias `reacticle` to `src/index.ts` (consumes library like an external user), builds to `dist/site`.
- Key exports: Vite config
- Dependencies: `@vitejs/plugin-react`
- Learner-relevant: The site consumes the library through its public API only (aliased `reacticle` path), never internal module paths — proving the public API is sufficient for real-world use.

### `apps/site/vite.report.config.ts`

- Locator: `[[sources/ai-html/20260910/reacticle/apps/site/vite.report.config.ts]]`
- Purpose: Single-file HTML build config — uses `vite-plugin-singlefile` to inline all CSS+JS into one HTML file. Entry: `report.html`. Output: `dist-report/report.html`. Produces a self-contained artifact that opens offline.
- Key exports: Vite config with `viteSingleFile()` plugin
- Dependencies: `vite-plugin-singlefile` (dev dep), `@vitejs/plugin-react`
- Learner-relevant: This is the "self-contained" promise in action — one `vite build` produces a single HTML file with everything inlined, shareable as a file, openable offline, printable to PDF.

### `vite.config.ts` (root)

- Locator: `[[sources/ai-html/20260910/reacticle/vite.config.ts]]`
- Purpose: Library build config — ES module output from `src/index.ts`, externalizes react/react-dom/jsx-runtime, outputs to `dist/`.
- Key exports: Vite config
- Dependencies: `@vitejs/plugin-react`
- Learner-relevant: Standard Vite library mode — single entry, externalized peer deps, ES format only.

### `netlify.toml`

- Locator: `[[sources/ai-html/20260910/reacticle/netlify.toml]]`
- Purpose: Netlify deployment — runs `npm run build`, publishes `dist/site`, SPA fallback redirect (`/* → /index.html`), Node 20.
- Key exports: N/A (deployment config)
- Dependencies: N/A
- Learner-relevant: The docs site is deployed as a static SPA with SPA routing support.

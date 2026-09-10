---
source: guizang-ppt-skill
source_type: codebase
source_lines: 30833
language: HTML/CSS/JS/Node.js
file_count: 41
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — guizang-ppt-skill

## Overview (L1)

- **SKILL.md** — Agent-facing workflow dispatcher: 7-question intake checklist, 10-step production pipeline (update check → need clarification → copy template → fill content → optional Codex images → speaker notes → self-check → preview → rehearse → iterate), Swiss locked mode rules, Chinese title sizing rules, theme selection (5 Style-A + 4 Style-B presets, no custom hex), authoring principles for both styles
- **assets/** — Two full HTML templates (Style A `template.html` magazine-ink + Style B `template-swiss.html` Swiss International), `motion.min.js` Motion One offline fallback (~64KB), `screenshot-backgrounds/` (5 Style-A + 4 Style-B WebP backgrounds for CleanShot-X-style framing)
- **references/** — 11 reference docs: `layouts.md` (10 Style-A layouts with pre-flight class check), `layouts-swiss.md` (22 locked Swiss layouts), `swiss-layout-lock.md` (golden-source layout registry + hard rules), `themes.md` (5 Style-A presets), `themes-swiss.md` (4 Swiss accent presets), `components.md` (Style-A component handbook), `presenter-mode.md` (speaker-notes contract + dual-window runtime), `checklist.md` (P0–P3 quality checklist from real iterations), `image-prompts.md` (GPT-M 2.0 prompt recipes), `screenshot-framing.md` (semantic screenshot processing rules), `swiss-map-component.md` (MapLibre S08 extension for geographic content)
- **scripts/** — Three Node.js validators: `validate-swiss-deck.mjs` (static + optional Playwright layout/overflow measurement), `validate-presenter-mode.mjs` (page-ID, notes, timing, runtime checks), `check-presenter-runtime-sync.mjs` (byte-identical CSS/JS drift detection between the two templates)
- **docs/** — `unification-plan.md` (internal refactoring notes)
- **.github/** — CI workflow configuration

## Structure (L2)

### SKILL.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/SKILL.md]]`
- Purpose: Complete agent workflow — from intake (7 questions: style A/B, audience, duration, material, images, theme, constraints) through template copy, content filling (theme rhythm planning, layout selection, image ratio rules, Chinese title sizing, Swiss font-weight hierarchy), optional Codex image generation, speaker-notes generation with stable `data-slide-id`, self-check (checklist + validators), preview, and iteration. Includes explicit Style-A vs Style-B class-name non-interchangeability rules and `validate-swiss-deck.mjs` / `validate-presenter-mode.mjs` invocation
- Key exports: 10-step workflow, 7-question intake, 24-item Swiss self-check, 7-item Style-A self-check
- Dependencies: `references/*.md`, `assets/template*.html`, `scripts/*.mjs`
- Learner-relevant: Teaches structured PPT authoring workflow with mandatory pre-flight checks; demonstrates how a single SKILL.md can encode a complete visual design system's rules, prevent common failure modes (class-name drift, image ratio chaos, unregistered layouts), and enforce aesthetic constraints ("no custom hex colors")

### assets/template.html

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/assets/template.html]]`
- Purpose: Style A (Electronic Magazine × E-Ink) seed file — single-file HTML with embedded WebGL fluid/contour/dispersion shaders, slide system (`.slide.light` / `.slide.dark` / `.slide.hero`), keyboard-driven horizontal navigation (← → / scroll / touch), Motion One entry animations, `SPEAKER_NOTES` JS array, full presenter-mode runtime (dual-window sync via BroadcastChannel, current/next 16:9 iframe preview, speaker script panel, timer, rehearsal recording, laser pointer, circle annotation, black/white screen freeze, pre-flight checks), and 5 CSS theme variable sets (`--ink` / `--paper` / etc.)
- Key exports: Complete runnable single-file HTML deck; CSS classes: `.h-hero`, `.display-zh`, `.stat-card`, `.pipeline`, `.grid-2-7-5`, `.frame-img`, `.callout`; JS: `SPEAKER_NOTES`, `playSlide()`, `openPresenter()`
- Dependencies: `motion.min.js` (CDN + local fallback), Lucide icons CDN, Google Fonts CDN (Noto Serif SC, Playfair Display, IBM Plex Mono)
- Learner-relevant: Teaches how a single HTML file can contain WebGL shaders, a full keyboard runtime, dual-window presenter mode, and a complete design system — all without a build step

### assets/template-swiss.html

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/assets/template-swiss.html]]`
- Purpose: Style B (Swiss International Typography) seed file — single-file HTML with WebGL fine-grid + dot-matrix background, Swiss design language (Inter/Helvetica Neue sans-serif, weight 200/300/600 hierarchy, `--accent` single high-saturation anchor color), 22 locked layout class system (`S01–S22`), `data-layout="Sxx"` attribute on every `<section>`, presenter-mode runtime shared with Style A, `B`-key low-power static mode (kills WebGL RAF + Motion animations)
- Key exports: Complete runnable single-file HTML deck; CSS classes: `.h-hero` (sans-serif weight 200), `.kpi-hero`, `.accent-block`, `.span-N`, `.dots`, `.card-ink/accent/fill/outlined`, `.grid-12`, `.timeline-v/h`, `.kpi-tower-row`, `.h-bar-chart`; JS: same runtime as Style A
- Dependencies: `motion.min.js`, Lucide icons CDN, Google Fonts CDN (Inter, Noto Sans SC, JetBrains Mono)
- Learner-relevant: Teaches Swiss International design system implementation — locked 22-layout grid, weight-size inverse hierarchy (bigger = lighter), single accent color constraint, hairline borders, no gradients/shadows/rounded corners

### assets/screenshot-backgrounds/

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/assets/screenshot-backgrounds/]]`
- Purpose: Pre-made WebP background canvases for CleanShot-X-style screenshot framing — `style-a/` (5 variants matching the 5 magazine themes) and `style-b/` (4 variants matching the 4 Swiss accent colors). Used by `screenshot-framing.md` processing rules
- Key exports: WebP image assets
- Dependencies: Referenced by `references/screenshot-framing.md` and the image-prompt workflow
- Learner-relevant: Teaches systematic screenshot processing — programmatic canvas composition (scale original screenshot, paste onto themed background, enforce target aspect ratio) as alternative to AI regeneration

### references/layouts.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/layouts.md]]`
- Purpose: Style A 10-page layout library with pre-flight checklist: cover, chapter divider, data hero (stat-highlight), quote+image, image grid, pipeline, question/closing, big-quote, before/after comparison, lead-image+side-text. Each layout is a complete paste-ready `<section class="slide ...">` block. Includes mandatory pre-flight rules: class-name verification against `template.html`, image ratio standards, vertical alignment guidance, title-content spacing rules, and theme-rhythm planning (light/dark/hero alternation)
- Key exports: 10 layout skeletons with demo HTML, Pre-flight class list, image ratio table, theme-rhythm rules
- Dependencies: `assets/template.html` (all class names must exist in its `<style>` block)
- Learner-relevant: Teaches layout composition from templates, class-name pre-flight verification, and theme-rhythm planning to avoid visual fatigue

### references/layouts-swiss.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/layouts-swiss.md]]`
- Purpose: Style B 22 locked layout catalog — `S01` Index Cover through `S22` Image Hero. Each layout specifies: purpose, HTML skeleton with `data-layout="Sxx"`, key CSS classes, animation recipe, and constraints. Includes Swiss design language baseline (color tokens, typography hierarchy, Chinese title sizing table, minimum font sizes for projection, weight-size mapping). P23/P24 historical experiments are deprecated by default
- Key exports: 22 registered layout skeletons, Swiss design baseline, Chinese title sizing table, font-weight hierarchy
- Dependencies: `references/swiss-layout-lock.md` (golden-source authority), `assets/template-swiss.html`
- Learner-relevant: Teaches locked-layout design systems — how constraining to registered layouts prevents visual drift; demonstrates the Swiss weight-size inverse hierarchy as a concrete implementation of a design principle

### references/themes.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/themes.md]]`
- Purpose: 5 Style-A theme presets — Ink Classic (Monocle default), Indigo Porcelain (tech/research), Forest Ink (nature/culture), Kraft Paper (nostalgia/literature), Dune (art/design). Each provides exact `:root` CSS variable values (`--ink`, `--ink-rgb`, `--paper`, `--paper-rgb`, `--paper-tint`, `--ink-tint`). Hard rule: no custom hex colors, no mixing themes
- Key exports: 5 CSS variable sets, recommendation table, switching principles
- Dependencies: `assets/template.html` (`:root` block)
- Learner-relevant: Teaches constrained theme design — protecting aesthetic quality by limiting choices to curated presets

### references/themes-swiss.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/themes-swiss.md]]`
- Purpose: 4 Swiss accent-color presets — Klein Blue IKB (default), Lemon Yellow, Lemon Green, Safety Orange. Each provides `--paper`, `--ink`, `--grey-1/2/3`, `--accent`, `--accent-rgb`, `--accent-on` variables. Hard rules: single accent per deck, no gradients, no mixed highlights, grey scale is cross-theme constant
- Key exports: 4 CSS variable sets, usage notes per accent, grey-scale reference table
- Dependencies: `assets/template-swiss.html`
- Learner-relevant: Teaches Swiss "single anchor color" constraint as a concrete implementation of the international typography principle

### references/presenter-mode.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/presenter-mode.md]]`
- Purpose: Speaker-notes contract and presenter-mode runtime specification — page plan table format (page-ID, section, purpose, visible info, speaker supplement, timing, transition, optional stage info), `SPEAKER_NOTES` JS data structure, stable `data-slide-id` rules, notes-by-ID persistence, dual-window sync, rehearsal mode (per-page timing, 5-session local storage), auto-advance pause rules, laser/circle/black-screen/freeze tools, pre-flight check coverage, viewer-status protocol
- Key exports: `SPEAKER_NOTES` schema, page-plan table format, presenter-mode behavioral contract
- Dependencies: Both `template.html` and `template-swiss.html` (shared runtime)
- Learner-relevant: Teaches how to encode a speaker-notes data contract that survives page reordering, audience-window disconnect/reconnect, and multi-session rehearsal — without cloud services

### references/checklist.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/checklist.md]]`
- Purpose: P0–P3 quality checklist distilled from real "One-Person Company" presentation iterations. P0 includes: presenter-mode controllability + Swiss locked mode compliance. P1 covers visual rhythm, image alignment, title sizing. P2 covers animation restraint, mobile preview. P3 covers edge cases. Each item has phenomenon, root cause, fix, and verification command
- Key exports: ~40 quality rules with P0–P3 severity, verification commands (`validate-swiss-deck.mjs`, `validate-presenter-mode.mjs`)
- Dependencies: `scripts/*.mjs` validators
- Learner-relevant: Teaches how real-world iteration failures become structured quality gates — a checklist as institutional memory of visual design mistakes

### references/components.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/components.md]]`
- Purpose: Style-A component handbook — slide shell (`light`/`dark`/`hero` theme classes), typography hierarchy (`.display` 11vw → `.display-zh` 7.8vw → `.h1-zh` 4.6vw → `.lead` 1.9vw → `.body-zh` 1.22vw → `.kicker` 12px → `.meta` 0.88vw), chrome/foot, callout, stat matrix, platform card, rowline table, pillar card, tag/kicker, figure frame, icons (Lucide), ghost background text, highlight, and Motion animation system
- Key exports: 13 component categories with class names, sizing, and usage rules
- Dependencies: `assets/template.html` (all styles defined there)
- Learner-relevant: Teaches how a component handbook prevents agent hallucination of non-existent classes — "don't invent new class names, use `style='...'` inline if needed"

### references/image-prompts.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/image-prompts.md]]`
- Purpose: GPT-M 2.0 image-generation prompt recipes for PPT illustration — ratio selection table (main visual 16:9, Swiss hero 21:9, left-text-right-image 16:10, infographic 16:9/16:10, screenshot redesign 16:10, small inline 3:2/3:4), image standardization strategy (slot-first approach), Style-A vs Style-B prompt tone rules, language-following rule (Chinese deck → Chinese labels), "images are materials not slides" rule (no self-contained page chrome)
- Key exports: Ratio selection table, prompt templates per image type, standardization workflow
- Dependencies: `references/layouts.md`, `references/layouts-swiss.md` (slot definitions)
- Learner-relevant: Teaches slot-first image generation — decide where the image goes before generating it, ensuring aspect ratio matches the layout slot

### references/screenshot-framing.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/screenshot-framing.md]]`
- Purpose: Semantic rules for processing user screenshots into PPT-ready image assets — priority hierarchy (programmatic adaptation > GPT-M redesign), 7 semantic parameters (purpose, target ratio, background, alignment, padding, crop strategy, fidelity), built-in background asset mapping, CleanShot-X-style processing pipeline (create canvas → fill background → scale screenshot → paste with alignment)
- Key exports: 7-parameter semantic model, processing pipeline, background asset mapping
- Dependencies: `assets/screenshot-backgrounds/`, `references/image-prompts.md`
- Learner-relevant: Teaches programmatic screenshot framing as a deterministic alternative to AI regeneration — preserving UI fidelity while achieving visual consistency

### references/swiss-layout-lock.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/swiss-layout-lock.md]]`
- Purpose: Golden-source authority for Swiss layout compliance — registers S01–S22 with original-page mapping, required skeleton, and image rules. Hard rules: every body page must have `data-layout="Sxx"`, no invented P23/P24, title left-aligned on left content axis, SVG only for geometry (no text), image slots bound to generation ratios. Includes S08 + Swiss Map Component extension rules
- Key exports: 22-layout registry table, 5 hard rules, image slot rules per layout
- Dependencies: `assets/template-swiss.html` (golden source)
- Learner-relevant: Teaches layout-locking as a design-integrity mechanism — registering allowed structures prevents agents from inventing visually inconsistent pages

### references/swiss-map-component.md

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/references/swiss-map-component.md]]`
- Purpose: S08 Duo-Compare extension for geographic content — MapLibre-based map card replacing the right slot, HTML point markers (`.pin-dot` + `.pin-line` + `.pin-card`), `MAP_POINTS` / `MAP_RELATIONS` data contract, static fallback coordinates, interaction controls (+/-/DRAG), disabled scroll-zoom to prevent deck navigation conflicts
- Key exports: `MAP_POINTS` schema, `MAP_RELATIONS` schema, MapLibre integration rules, static fallback strategy
- Dependencies: `references/swiss-layout-lock.md` (S08 identity), MapLibre GL JS CDN
- Learner-relevant: Teaches how to extend a locked layout system with interactive components while maintaining the layout's identity and preventing interaction conflicts

### scripts/validate-swiss-deck.mjs

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/scripts/validate-swiss-deck.mjs]]`
- Purpose: Swiss deck validator — static checks (every `<section class="slide">` has `data-layout="Sxx"`, registered layout exists in S01–S22, no SVG text elements, image slots referenced in layout exist, title alignment) + optional Playwright rendering checks (DOM/visual overflow measurement in px, bottom whitespace ratio, nav-safe line verification, title gap measurement). Provides graduated overflow-fix recommendations (1–40px nudge, 40–90px compact, 90–160px compress, 160px+ redesign)
- Key exports: `--allow-experimental` flag, Playwright measurement pipeline, overflow-fix recommendation ladder
- Dependencies: Node.js `fs`, optional `playwright` package
- Learner-relevant: Teaches how a validator can bridge static analysis and visual measurement — catching layout violations that only appear at render time

### scripts/validate-presenter-mode.mjs

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/scripts/validate-presenter-mode.mjs]]`
- Purpose: Presenter-mode validator — checks page-ID uniqueness/stability, `SPEAKER_NOTES` array count matches `<section class="slide">` count, notes-by-ID alignment, required fields (`id`, `title`, `purpose`, `talk`, `transition`), type validation, total suggested timing ≤ 90% of `--target-minutes`, and runtime-component presence (timer, rehearsal, auto-advance, laser, circle, pre-flight)
- Key exports: `--target-minutes` flag, JS array extraction from HTML, slide-tag matching
- Dependencies: Node.js `fs`, `vm`
- Learner-relevant: Teaches how to validate a JS data structure embedded in HTML — extracting `SPEAKER_NOTES` via regex and bracket-matching, then cross-referencing against DOM structure

### scripts/check-presenter-runtime-sync.mjs

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/scripts/check-presenter-runtime-sync.mjs]]`
- Purpose: Byte-identical drift detection between `template.html` and `template-swiss.html` — extracts presenter-mode CSS and JavaScript blocks using marker comments, compares them line-by-line, reports first-differing line number on drift
- Key exports: Exit code 0 (PASS) or 1 (drift detected)
- Dependencies: Node.js `fs`, `path`
- Learner-relevant: Teaches how to maintain shared runtime code across two templates — marker-comment extraction + structural diff as a lightweight alternative to code deduplication

### assets/motion.min.js

- Locator: `[[sources/ai-html/20260910/guizang-ppt-skill/assets/motion.min.js]]`
- Purpose: Local offline copy of Motion One animation library (~64KB) — serves as CDN fallback when network is unavailable; used by both templates for `data-anim` / `data-animate` entry animation recipes
- Key exports: Motion One API (animate, stagger, etc.)
- Dependencies: None
- Learner-relevant: Teaches offline-first resilience in web presentation tooling — local fallback ensures decks work without internet

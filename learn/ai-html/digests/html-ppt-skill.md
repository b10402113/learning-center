---
source: html-ppt-skill
source_type: codebase
source_lines: 48455
language: HTML/CSS/JS
file_count: 226
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — html-ppt-skill

## Overview (L1)

- **SKILL.md** — Agent-facing dispatcher: 36 themes × 15 full-deck templates × 31 layouts × 47 animations, presenter mode with 4 magnetic cards, keyboard runtime; authoring rules (token-driven design, always start from template, never invent layout files), 6-step catalog loading guide, recommended theme→audience mapping
- **assets/** — Token-driven design system: `base.css` (CSS reset + tokens + slide system + typography + layout primitives + cards + chrome), `fonts.css` (Noto Sans/Serif SC + JetBrains Mono imports), `runtime.js` (960-line keyboard-driven deck runtime with presenter-mode popup window, BroadcastChannel sync, overview grid, theme cycling, animation re-triggering, preview-only iframe mode), `themes/` (36 CSS token-override files), `animations/` (27 CSS entry animations + 20 canvas FX modules + fx-runtime.js lifecycle manager)
- **templates/** — `deck.html` (minimal starter), `theme-showcase.html` (iframe-isolated theme tour), `layout-showcase.html` (all 31 layouts), `animation-showcase.html` (47 animation slides), `full-decks-index.html` (14-deck gallery), `full-decks/` (15 scoped multi-slide templates), `single-page/` (31 layout HTML files with demo data)
- **references/** — 6 catalog docs: `themes.md` (36 themes with when-to-use), `layouts.md` (31 layout types with structure conventions), `animations.md` (27 CSS + 20 FX catalog), `full-decks.md` (15 templates with source inspiration and use guidance), `presenter-mode.md` (speaker-notes 3 golden rules + dual-window architecture), `authoring-guide.md` (10-step authoring walkthrough)
- **scripts/** — `new-deck.sh` (scaffold from deck.html with path rewriting), `render.sh` (headless Chrome → PNG with `#/N` deep-link iteration), `verify-output/` (56 self-test screenshots)
- **examples/** — `demo-deck/` (complete working deck)
- **docs/** — `readme/` (hero GIF, theme/template/layout/animation showcase images)

## Structure (L2)

### SKILL.md

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/SKILL.md]]`
- Purpose: Agent workflow dispatcher — defines when to trigger (keywords: PPT, slides, deck, keynote, "幻灯片", "演讲稿"), what the skill provides (36 themes, 15 full decks, 31 layouts, 47 animations, presenter mode), authoring rules (always start from template, use tokens not literal colors, never invent layout files, respect chrome slots, keyboard-first, one `.slide` per page, supply notes in `<div class="notes">`), 6-step catalog loading order, theme→audience recommendations
- Key exports: 12 authoring rules, theme recommendation table, keyboard cheat sheet
- Dependencies: `references/*.md`, `assets/*`, `templates/*`
- Learner-relevant: Teaches how an agent skill encodes a complete design system's constraints — preventing hallucinated layouts, enforcing token-based design, and requiring template-first authoring

### assets/base.css

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/assets/base.css]]`
- Purpose: Shared design token file — CSS reset, `:root` token definitions (30+ variables: `--bg`, `--text-1/2/3`, `--accent/2/3`, `--grad`, `--radius*`, `--shadow*`, `--font-sans/serif/mono/display`), slide system (`.deck`, `.slide` with absolute positioning + opacity transition + `is-active`/`is-prev` states, `body.single` standalone mode), typography scale (`.eyebrow` 13px → `.kicker` 14px → `h1` 72px → `h2` 54px → `h3` 32px → `h4` 22px → `.lede` 22px), layout primitives (`.stack`, `.row`, `.grid`, `.g2/g3/g4`, `.center`), card variants (`.card`, `.card-soft`, `.card-outline`, `.card-accent`, `.card-hover`), chrome (`.deck-header`, `.deck-footer`, `.slide-number`, `.progress-bar`), presenter/overview CSS (`.notes` hidden, `.notes-overlay`, `.overview` grid), print media queries
- Key exports: 30+ CSS custom properties, `.slide.is-active` visibility system, card/chrome/overview component classes
- Dependencies: None (root of design system)
- Learner-relevant: Teaches token-driven design — one variable change reskins the entire deck; demonstrates how a single CSS file can define a complete presentation design system with typography scale, spacing rhythm, and component library

### assets/runtime.js

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/assets/runtime.js]]`
- Purpose: 960-line zero-dependency keyboard runtime — preview-only mode (iframe `?preview=N` renders single slide, no chrome), navigation (`go()` with slide toggling + hash deep-link + progress bar + animation re-triggering + counter-up), BroadcastChannel sync (audience↔presenter bidirectional), presenter-mode popup window (`buildPresenterHTML()` generates complete 4-card layout: CURRENT/NEXT iframes at 1920×1080 with `postMessage` smooth navigation + SPEAKER SCRIPT card + TIMER card with elapsed/slide-count/prev-next/reset), card drag/resize with localStorage persistence, overview grid with mini-slide scaling, theme cycling (`T` key, reads `data-themes` attribute), animation cycling (`A` key)
- Key exports: `go()`, `openPresenterWindow()`, `buildPresenterHTML()`, `cycleTheme()`, `cycleAnim()`, preview-only mode, BroadcastChannel sync
- Dependencies: None (reads DOM state, uses `BroadcastChannel` API, `window.open()` for presenter)
- Learner-relevant: Teaches how a single JS file can power a complete presentation runtime — keyboard navigation, dual-window presenter mode with pixel-perfect iframe previews, and theme sync — without any framework or build step; the `?preview=N` pattern for iframe isolation is a reusable architecture

### assets/themes/

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/assets/themes/]]`
- Purpose: 36 CSS theme files, each overriding `:root` tokens from `base.css` — categorized as Light & calm (6: minimal-white, editorial-serif, soft-pastel, xiaohongshu-white, solarized-light, catppuccin-latte), Bold & statement (5: sharp-mono, neo-brutalism, bauhaus, swiss-grid, memphis-pop), Cool & dark (7: catppuccin-mocha, dracula, tokyo-night, nord, gruvbox-dark, rose-pine, arctic-cool), Warm & vibrant (1: sunset-warm), Effect-heavy (5: glassmorphism, aurora, rainbow-gradient, blueprint, terminal-green), v2 additions (12: corporate-clean, pitch-deck-vc, academic-paper, japanese-minimal, engineering-whiteprint, magazine-bold, news-broadcast, midcentury, retro-tv, cyberpunk-neon, vaporwave, y2k-chrome)
- Key exports: 36 theme files, each under ~200 lines
- Dependencies: `assets/base.css` (token definitions being overridden)
- Learner-relevant: Teaches theme-as-token-override architecture — each theme is a short CSS file that overrides the same set of variables, enabling instant visual transformation without touching layout markup

### assets/animations/

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/assets/animations/]]`
- Purpose: Two animation systems — `animations.css` (27 named CSS entry animations via `data-anim` attribute: directional fades, dramatic entries like `rise-in`/`zoom-pop`/`glitch-in`, text effects like `typewriter`/`neon-glow`, list animations like `stagger-list`/`counter-up`, SVG geometry like `path-draw`/`morph-shape`, 3D/perspective like `card-flip-3d`/`cube-rotate-3d`, ambient like `kenburns`/`marquee-scroll`), `fx-runtime.js` (lifecycle manager: auto-inits `[data-fx]` containers on slide enter, cleans up on leave via `ResizeObserver` + DPR correction, reads theme CSS vars for coloring), `fx/` directory (20 hand-rolled canvas modules: `particle-burst`, `confetti-cannon`, `firework`, `starfield`, `matrix-rain`, `knowledge-graph` with force-directed physics, `neural-net` with signal pulses, `constellation`, `orbit-ring`, `galaxy-swirl`, `word-cascade`, `letter-explode`, `chain-react`, `magnetic-field`, `data-stream`, `gradient-blob`, `Kimile-trail`, `shockwave`, `typewriter-multi`, `counter-explosion`)
- Key exports: 27 CSS animation classes, 20 FX module names, `fx-runtime.js` lifecycle API
- Dependencies: `assets/base.css` (theme vars for FX coloring)
- Learner-relevant: Teaches two-tier animation architecture — lightweight CSS entry effects (fire-and-forget) vs live canvas FX (continuous, lifecycle-managed); demonstrates how `ResizeObserver` + DPR correction enables resolution-independent canvas rendering

### templates/full-decks/

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/templates/full-decks/]]`
- Purpose: 15 self-contained multi-slide deck templates — 8 extracted from real-world decks (xhs-white-editorial, graphify-dark-graph, knowledge-arch-blueprint, hermes-cyber-terminal, obsidian-claude-gradient, testing-safety-alert, xhs-pastel-card, dir-key-nav-minimal) and 7 scenario scaffolds (pitch-deck, product-launch, tech-sharing, weekly-report, xhs-post at 3:4 810×1080, course-module, presenter-mode-reveal). Each folder contains `index.html`, scoped `style.css` (`.tpl-<name>` prefix for side-by-side preview), and `README.md` with source inspiration and use guidance
- Key exports: 15 complete deck templates with scoped CSS
- Dependencies: `assets/base.css`, `assets/fonts.css`, `assets/runtime.js`
- Learner-relevant: Teaches scoped template design — `.tpl-<name>` CSS prefixing enables multiple templates on one page without collisions; demonstrates how real-world decks become reusable templates through extraction and generalization

### templates/single-page/

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/templates/single-page/]]`
- Purpose: 31 standalone layout HTML files with realistic demo data — opener/transitions (cover, toc, section-divider), text-centric (bullets, two-column, three-column, big-quote), numbers/data (stat-highlight, kpi-grid, table, chart-bar/line/pie/radar), code/terminal (code, diff, terminal), diagrams/flows (flow-diagram, arch-diagram, process-steps, mindmap), plans/comparisons (timeline, roadmap, gantt, comparison, pros-cons, todo-checklist), visuals (image-hero, image-grid), closers (cta, thanks). Each file is a complete standalone page that can be opened directly in Chrome
- Key exports: 31 layout files with `<section class="slide">` blocks ready for copy-paste
- Dependencies: `assets/base.css`, theme files
- Learner-relevant: Teaches layout-as-composable-unit architecture — each layout is a self-contained HTML page demonstrating one page type; the deck-building workflow is copy-section-from-layout → paste-into-deck → replace-demo-data

### references/themes.md

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/references/themes.md]]`
- Purpose: All 36 themes catalog with when-to-use guidance — organized by category (Light & calm, Bold & statement, Cool & dark, Warm & vibrant, Effect-heavy, v2 additions). Each entry: name, description, when-to-use. Includes application instructions (link href or `data-themes` attribute + `data-theme-base`) and extension guide (copy existing, rename, override variables, keep under ~200 lines)
- Key exports: 36-theme recommendation table, application/extension instructions
- Dependencies: `assets/themes/*.css`
- Learner-relevant: Teaches theme selection as an audience-matching decision — engineers → dark themes, designers → editorial, execs → minimal, consumers → warm

### references/layouts.md

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/references/layouts.md]]`
- Purpose: 31 layout types catalog organized by function — opener/transitions, text-centric, numbers/data, code/terminal, diagrams/flows, plans/comparisons, visuals, closers. Each entry: file name, purpose, recommended usage. Includes naming/structure conventions (`data-title`, `.kicker`, `.eyebrow`, `.h1`/`.h2`, `.lede`, `.card` variants, `.grid.g2/g3/g4`, `.notes`)
- Key exports: Layout selection guide, HTML structure conventions
- Dependencies: `templates/single-page/*.html`
- Learner-relevant: Teaches layout selection as a content-type matching decision — numbers → stat-highlight/kpi-grid, architecture → arch-diagram/flow-diagram, comparison → comparison/pros-cons

### references/animations.md

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/references/animations.md]]`
- Purpose: Complete animation catalog — 27 CSS entry animations (directional fades, dramatic entries, text effects, list/number animations, SVG/geometry, 3D/perspective, ambient/continuous) with name/effect/use-for columns, counter-up markup example, and 20 FX canvas modules with name/effect/use-case/trigger columns. Includes tips: prefer `data-anim` over class, 1-2 animations per slide, FX container needs explicit size, respects `prefers-reduced-motion`
- Key exports: 47 animation entries with use-for guidance, FX lifecycle documentation
- Dependencies: `assets/animations/animations.css`, `assets/animations/fx/*.js`
- Learner-relevant: Teaches animation restraint as a design principle — one accent animation per slide, CSS for entry effects vs canvas for continuous effects, automatic lifecycle management

### references/full-decks.md

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/references/full-decks.md]]`
- Purpose: 15 full-deck template catalog — 8 extracted from real-world decks (with source inspiration, key visual traits, when-to-use for each) and 7 scenario scaffolds (with slide count, feel, when-to-use). Includes authoring notes: `.tpl-<name>` scoping, keep structural classes, shared runtime provides keyboard/fullscreen/overview, charts are hand-rolled SVG
- Key exports: 15 template descriptions with visual trait analysis
- Dependencies: `templates/full-decks/*/`
- Learner-relevant: Teaches template documentation as design-rationale recording — each template stores its "why" (source inspiration, visual traits, use case) alongside its "what" (HTML/CSS)

### references/presenter-mode.md

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/references/presenter-mode.md]]`
- Purpose: Speaker-notes authoring guide with 3 golden rules: (1) prompts not lines — bold keywords, separate transition sentences, (2) 150–300 words per slide (2–3 min/page pace), (3) conversational not written ("所以" not "因此"). Includes recommended做法 (use presenter-mode-reveal template) and 进阶做法 (add `<aside class="notes">` to any template), HTML structure example, presenter-view architecture diagram (4 magnetic cards: CURRENT/NEXT pixel-perfect iframe previews + SPEAKER SCRIPT + TIMER), common mistakes (presenter text on slide, missing runtime.js,书面语, too few/many words), AI prompt template for generating speaker notes
- Key exports: 3 golden rules, HTML structure template, presenter-view architecture, common mistakes list, AI generation prompt
- Dependencies: `assets/runtime.js` (S key presenter popup), `templates/full-decks/presenter-mode-reveal/`
- Learner-relevant: Teaches speaker-notes as "prompt signals not scripts" — the core insight is that presenter notes should be scannable keyword cues, not word-for-word scripts; demonstrates the `?preview=N` iframe isolation pattern for pixel-perfect previews

### references/authoring-guide.md

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/references/authoring-guide.md]]`
- Purpose: 10-step authoring workflow — (1) understand deck (audience/length/language/format/tone), (2) pick theme, (3) outline (cover → toc → sections → body → cta → thanks), (4) scaffold via `new-deck.sh`, (5) author each slide from layout templates, (6) add animations sparingly (one per slide), (7) Chinese+English deck conventions, (8) review in-browser (O/T/S keys), (9) export to PNG via `render.sh`, (10) what NOT to do (no blank-file authoring, no raw hex, no heavy frameworks, no inventing templates, no deleting showcase slides, no presenter text on slides)
- Key exports: 10-step workflow, theme→audience mapping, what-NOT-to-do list
- Dependencies: `scripts/new-deck.sh`, `scripts/render.sh`, `references/themes.md`, `references/layouts.md`, `references/animations.md`
- Learner-relevant: Teaches the complete deck-authoring lifecycle from request to PNG export — demonstrates how structured workflows prevent common agent failure modes (starting from scratch, using raw colors, over-animating)

### scripts/new-deck.sh

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/scripts/new-deck.sh]]`
- Purpose: Deck scaffolding script — copies `templates/deck.html` into `examples/<name>/index.html`, rewrites relative paths (`../assets/` → `../../assets/`) via `sed`, validates template exists, prevents overwrite of existing directories
- Key exports: Shell script (46 lines), path-rewriting logic
- Dependencies: `templates/deck.html`
- Learner-relevant: Teaches path-relative asset referencing in static HTML projects — the script adjusts relative paths when moving a template to a deeper directory

### scripts/render.sh

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/scripts/render.sh]]`
- Purpose: Headless Chrome PNG renderer — wraps macOS Chrome at `/Applications/Google Chrome.app`, supports single-slide render (`#/1`), multi-slide render (`#/1` through `#/N`), auto-detect slide count (grep for `class="slide"`), custom output directory, 1920×1080 default viewport, `--virtual-time-budget=4000` for animation settling
- Key exports: Shell script (71 lines), `render_one()` function, slide-count auto-detection
- Dependencies: Google Chrome (macOS)
- Learner-relevant: Teaches headless Chrome screenshot automation — the `#/N` deep-link + `--virtual-time-budget` pattern ensures animations settle before capture

### examples/demo-deck/

- Locator: `[[sources/ai-html/20260910/html-ppt-skill/examples/demo-deck/]]`
- Purpose: Complete working deck example — `index.html` demonstrating all features (themes, layouts, animations, keyboard navigation, presenter mode) in a single runnable file
- Key exports: Complete deck HTML
- Dependencies: `assets/base.css`, `assets/runtime.js`, `assets/themes/`, `assets/animations/`
- Learner-relevant: Shows the final output format — a single HTML file that works by opening in any browser

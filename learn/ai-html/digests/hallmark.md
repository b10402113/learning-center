---
source: hallmark
source_type: codebase
source_lines: 54510
language: javascript
file_count: 314
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — hallmark

## Overview (L1)

- **skills/hallmark/** — The core design skill: a SKILL.md instruction file plus 29 reference documents encoding anti-AI-slop rules, 21 macrostructures, 50 component archetypes, 21 themes, colour/typography/layout/motion/copy guidelines, 4 genre overlays, and 58 slop-test gates. This is what gets installed into Claude Code / Cursor / Codex to make them generate structurally varied, intentionally designed landing pages.
- **site/** — The marketing site and demo gallery at usehallmark.com: a single-page landing (index.html + 4 CSS files + main.js) that dogfoods the skill's own patterns (theme picker, archetype swapping, per-theme copy), plus 19 example landing pages and 13 generation tests demonstrating the skill's output across diverse briefs.
- **docs/** — Human-facing reference material: 8 worked briefs (recipes.md), 3 DNA-extraction walkthroughs (study-examples.md), talk slides, and screenshots for the marketing site.

## Structure (L2)

### site/index.html

- Locator: `[[sources/ai-html/20260910/hallmark/site/index.html]]`
- Purpose: Landing page for usehallmark.com. Single-page architecture with 7 numbered sections (Hero slot, Examples gallery, Skills/verbs, Anti-patterns, Foundations, With/Without comparison, Install) plus a sticky banner theme picker. Hero and footer are dynamic slots populated from `<template>` elements via JS archetype swapping.
- Key exports: HTML document; template IDs `hero-*` and `footer-*` consumed by main.js `swapArchetypes()`
- Dependencies: css/tokens.css, css/base.css, css/components.css, css/sections.css, js/main.js
- Learner-relevant: Demonstrates how a single HTML structure can serve 21 different visual designs through CSS custom-property theming and JS-driven archetype slot replacement — a pattern for theme-aware component architecture.

### site/js/main.js

- Locator: `[[sources/ai-html/20260910/hallmark/site/js/main.js]]`
- Purpose: All client-side interactivity for the landing page: theme registry (21 themes), archetype-to-slot mapping (hero/footer per theme), per-theme copy fixtures, theme application with View Transitions API, keyboard shortcuts (T cycles, R randomises, Shift+T back), theme dropdown, copy-to-clipboard, hover-to-play video handling, GitHub star count cache, easter egg (spam T triggers overlay), foundations demo (motion, states).
- Key exports: `THEMES`, `ARCHETYPES`, `THEME_GENRES`, `COPY`, `HERO_TITLE`, `applyTheme()`, `swapArchetypes()`, `interpolate()`
- Dependencies: None (vanilla JS, no build step)
- Learner-relevant: Shows how to build a multi-theme demo page with zero dependencies — CSS custom properties for visual theming, `<template>` elements for structural theming, View Transitions API for smooth switches, localStorage for persistence, and a rolling-window easter egg detector.

### site/css/tokens.css

- Locator: `[[sources/ai-html/20260910/hallmark/site/css/tokens.css]]`
- Purpose: Defines all 21 theme token sets as CSS custom properties scoped via `[data-theme="..."]`. Each theme defines: paper/ink/accent colours in OKLCH, font stacks (display/body/serif/label/mono), display weight/style/optical-size, type scale (xs through display), line-height scale, tracking scale, spacing scale (3xs–5xl), section/page layout tokens, component shape tokens (radius, border, shadow), and motion timing tokens (ease curves + durations). ~1221 lines total.
- Key exports: CSS custom properties: `--color-paper`, `--color-accent`, `--font-display`, `--font-body`, `--text-display`, `--space-*`, `--ease-out`, `--dur-*`, `--radius-*`, etc.
- Dependencies: None (pure CSS)
- Learner-relevant: Canonical example of a complete OKLCH-based multi-theme token system. Each theme occupies a distinct point in colour space. Shows how to structure design tokens for 21 radically different visual identities sharing one component library.

### site/css/base.css

- Locator: `[[sources/ai-html/20260910/hallmark/site/css/base.css]]`
- Purpose: CSS reset, Google Fonts import for all theme display/alt faces, body defaults, focus-visible styling, theme transition properties, and base element rules (headings, links, forms, scrollbar). 194 lines.
- Key exports: CSS reset rules, `:root` base typography, theme-transition target list
- Dependencies: tokens.css (consumes custom properties)
- Learner-relevant: Shows how to import a large font corpus (12+ Google Fonts families) cleanly and apply theme-aware transitions to specific element selectors.

### site/css/components.css

- Locator: `[[sources/ai-html/20260910/hallmark/site/css/components.css]]`
- Purpose: Reusable component styles for the landing page: banner, theme dropdown, example cards, skill rows, anti-pattern rows, foundations cards, install pane, interlude, figures, copy-to-clipboard states, easter egg overlay.
- Key exports: CSS class-based component system (`.banner__*`, `.ex-card`, `.skill-row`, `.anti-row`, `.found-card`, `.install-pane`, etc.)
- Dependencies: tokens.css
- Learner-relevant: Component-level CSS architecture for a marketing site — BEM-like naming, theme-aware through token consumption, responsive patterns.

### site/css/sections.css

- Locator: `[[sources/ai-html/20260910/hallmark/site/css/sections.css]]`
- Purpose: Section-level layout: numbered section labels, section headings, full-bleed vs contained layouts, the examples rail scroll, anti-pattern grid, foundations 4×2 grid, with/without comparison panels, install pane steps, and all responsive breakpoints.
- Key exports: Section layout rules (`.section`, `.section--bleed`, `.slot`, `.reveal`)
- Dependencies: tokens.css, base.css, components.css
- Learner-relevant: Section composition patterns for single-page marketing sites — how to structure numbered sections, full-bleed rails, and responsive grid layouts using only CSS custom properties.

### site/_tests/

- Locator: `[[sources/ai-html/20260910/hallmark/site/_tests/]]`
- Purpose: 13 generation test folders (01-tide-podcast through 12-loafer + 13-alma), a custom/ folder with bespoke-theme tests, a verbs/ folder with verb-specific examples, and a shared _thumbs/ directory with screenshot thumbnails. Each test folder contains brief.md (prompt + design flow), index.html (self-contained page), and style.css (tokens + components with Hallmark stamp). Demonstrates the skill's output across diverse briefs.
- Key exports: Self-contained landing pages; brief.md showing the full design-flow reasoning
- Dependencies: None (each test is fully self-contained)
- Learner-relevant: Real-world worked examples of the skill's output. Each test shows how a different brief produces a different macrostructure + theme + enrichment, validating the structural-variety thesis. The brief.md files are especially valuable for understanding the skill's decision-making process.

### site/examples/

- Locator: `[[sources/ai-html/20260910/hallmark/site/examples/]]`
- Purpose: 19 polished example pages linked from the landing page gallery (hum-07, specimen, cobalt-01, custom-01 through custom-05, garden-01, grid-01, lumen-01, najm, press-01, riso-01, tally, wayfare, hyperlane, bananastudio). Each is a standalone HTML page. The scroll-demos.json maps examples to Remotion scroll-capture configs.
- Key exports: Standalone HTML pages; scroll-demos.json
- Dependencies: None (each example is self-contained)
- Learner-relevant: Production-quality outputs of the Hallmark skill — the "proof of concept" that the skill's rules produce genuinely different-looking pages from different briefs.

### skills/hallmark/SKILL.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/SKILL.md]]`
- Purpose: The primary skill file installed into AI coding assistants. ~800+ lines defining: four verbs (build/default, audit, redesign, study), six universal disciplines (pre-emit self-critique, honest copy, locked tokens, no re-drawn chrome, mobile responsiveness, typography purity), the full Design flow (Steps 0–7: pre-flight scan, design-context gate, macrostructure pick with diversification rule, project memory, theme route dispatch, visual ruleset loading, hero enrichment decision, preview block, build, slop test, stamp), component-scope flow, and safety rails. This is the single source of truth for how Hallmark operates.
- Key exports: Skill definition with 4 verbs, 7-step design flow, 6 disciplines, 58 slop-test gates
- Dependencies: All references/ files (loaded on-demand per step)
- Learner-relevant: The most instructive file in the codebase. Shows how to write an AI-agent skill that enforces design discipline through a structured workflow, mandatory checklists, and anti-pattern gates. Key patterns: pre-flight scanning, diversification rules, lazy file loading for token efficiency, and the "state your pick out loud" accountability mechanism.

### skills/hallmark/references/ — macrostructures.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/macrostructures.md]]`
- Purpose: Index of 21 named landing-page shapes (Bento Grid, Long Document, Marquee Hero, Stat-Led, Workbench, Conversational FAQ, Manifesto, Photographic, Quote-Led, Specimen, Catalogue, Letter, Index-First, Narrative Workflow, Split Studio, Feature Stack, Type Specimen, Portfolio Grid, Map/Diagram, Ecosystem Index, Component Playground). Each is a one-line description linking to a detailed per-macrostructure file. Includes the diversification rule, hero polish patterns (HP1–HP4), nav/footer voice guidance, and SaaS page sequence.
- Key exports: 21 macrostructure names + descriptions; diversification rule; hero polish pattern index
- Dependencies: Individual macrostructure files in `references/macrostructures/`
- Learner-relevant: Shows how to design a taxonomy of page shapes. The index-then-pick pattern (read slim index, load only the chosen file) is a key token-efficiency strategy for large reference sets.

### skills/hallmark/references/ — component-cookbook.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/component-cookbook.md]]`
- Purpose: Index of 50 component archetypes across 7 categories: 9 heroes (H1–H9), 5 section heads (S1–S5), 6 feature blocks (F1–F6), 4 CTAs (C1–C4), 4 testimonials (T1–T4), 8 footers (Ft1–Ft8), 14 navs (N1a–N13). Each entry has a shape name, "use when", "don't confuse with", and a DOM/CSS sketch. Includes nav and footer routing tables (genre defaults + acceptable alternates).
- Key exports: 50 archetype codes; nav routing table (N1a–N13 × genre); footer routing table (Ft1–Ft8 × genre)
- Dependencies: Individual component files in `references/components/`
- Learner-relevant: A complete component taxonomy for landing pages. The routing tables at the bottom are especially instructive — they encode genre-scoped defaults and diversification rules for nav/footer selection.

### skills/hallmark/references/ — slop-test.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/slop-test.md]]`
- Purpose: 58 post-emit quality gates plus a 6-axis pre-emit self-critique (Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety). Gates are categorized: visual (gradient checks, card nesting, centred-everything), structural (template reuse, section rhythm), microinteractions (hover-scale, transition-all, bouncy easings), interaction states (8-state checklist), contrast (WCAG 4.5:1 minimum), typography (italic headers, system fonts, single-font), a11y (focus-visible, aria-label, semantic HTML), copy (invented metrics, Kimile emoji, "world-class"), responsive (horizontal scroll, button line-wrap, mobile grid), and diversification (macrostructure/theme/nav/footer repetition).
- Key exports: 58 gate definitions; 6-axis self-critique scoring rubric
- Dependencies: anti-patterns.md (gates reference specific anti-patterns)
- Learner-relevant: A comprehensive AI-output quality checklist. Shows how to encode "what bad looks like" as binary pass/fail gates that an LLM can self-apply. The pre-emit self-critique (score 1–5 on 6 axes, revise if < 3) is a powerful pattern for LLM output quality control.

### skills/hallmark/references/ — anti-patterns.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/anti-patterns.md]]`
- Purpose: Catalogue of named AI-UI tells — the visual, structural, microinteraction, typography, copy, and responsive patterns that signal "this was generated by an LLM". Critical tells include: purple-gradient hero, Inter-everywhere, 3-column feature grid, card-in-card, gradient headline, side-stripe card, full-viewport centred hero. Each entry names the tell, explains why it reads as AI, and provides the Hallmark fix. ~418 lines.
- Key exports: Named anti-patterns with fixes; categories: critical, structural, microinteraction, typography, copy, responsive
- Dependencies: typography.md, color.md, motion.md (cross-references)
- Learner-relevant: The most direct teaching of "what AI-generated UI looks like and how to avoid it". Each anti-pattern is a lesson in design perception — understanding why something feels artificial is more valuable than knowing the rule.

### skills/hallmark/references/ — color.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/color.md]]`
- Purpose: OKLCH colour system rules: palette construction (paper + 3 neutrals + accent), accent discipline (single anchor hue, ≤5% of viewport), neutral mixing at low chroma, dark-mode elevation via lightness (never shadow), and the colour-diversification rule (paper band + accent hue must differ between consecutive outputs).
- Key exports: OKLCH palette construction rules; accent discipline; dark-mode rules
- Learner-relevant: Practical guide to building perceptually uniform palettes in OKLCH. Shows how a single accent hue with disciplined usage creates more sophisticated colour than multi-colour approaches.

### skills/hallmark/references/ — typography.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/typography.md]]`
- Purpose: Font pairing rules: 2+1 discipline (display + body + optional label/mono), italic headers banned, hero headline sizing via clamp(), weight ladder (display ≤350 or ≥700, body 400–500, label 500–600), measure (45–72ch), wordmark guidance (may use different display face), free-vs-paid font trade-offs per tone.
- Key exports: 2+1 font pairing framework; weight ladder; measure range; wordmark rules
- Learner-relevant: Shows how font pairing is a structural choice (not decorative) and how to build distinctive type systems from free Google Fonts families.

### skills/hallmark/references/ — genres/

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/genres/]]`
- Purpose: Four genre overlays — editorial.md, modern-minimal.md, atmospheric.md, playful.md. Each scopes which themes can rotate, which slop-test gates apply, and which voice fixtures the skill picks from. Editorial is the default (13 themes); modern-minimal covers Coral/Cobalt; atmospheric covers Bloom/Midnight/Terminal/Aurora/Lumen; playful stays on Hum.
- Key exports: Genre-scoped rules for theme rotation, gate activation, and voice selection
- Learner-relevant: Shows how genre overlays act as rule-set scoping — the same 21 themes and 58 gates produce different outputs depending on which genre is active.

### skills/hallmark/references/ — custom-theme.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/custom-theme.md]]`
- Purpose: Protocol for custom themes: when to route to custom (creative-intent signals), how to construct an OKLCH palette from a vibe description + optional anchor colour, free-font pairing from the Hallmark font catalogue, computing the three axis values (paper band, display style, accent hue), and the bespoke depth (designing structure from first principles for pages no catalog macrostructure fits). Includes the `design.md` portable format.
- Key exports: Custom palette construction algorithm; font pairing heuristics; axis computation; design.md format
- Learner-relevant: Shows how to generate a complete design system from a natural-language vibe description — translating "moss, lichen, soft pink, herbal" into specific OKLCH values, font choices, and layout rules.

### skills/hallmark/references/ — verbs/

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/verbs/]]`
- Purpose: Verb-specific reference files: audit.md (how to score existing code against anti-patterns), redesign.md (how to preserve content/IA/brand while replacing visual structure, including multi-page flow with design.md). These are loaded only when the corresponding verb runs.
- Key exports: Audit scoring protocol; redesign scope rules; multi-page coherence rules
- Learner-relevant: Shows how to design AI-agent verbs with clear scope constraints — audit never edits, redesign preserves content, study never copies pixels.

### skills/hallmark/references/ — study.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/study.md]]`
- Purpose: Protocol for `hallmark study`: extracting design DNA from a screenshot or URL. Detects input mode (URL vs image), reads page HTML/CSS via WebFetch for URLs, produces a diagnosis report (macrostructure, archetypes, type-pairing, colour anchor), and optionally emits a portable design.md. Includes refusal layer for template-marketplace URLs and attestation requirement for design.md emission.
- Key exports: DNA extraction protocol; URL vs image detection; refusal layer; design.md emission rules
- Learner-relevant: Shows how to build an AI skill that reads and analyzes existing designs — extracting structural patterns rather than copying pixels.

### skills/hallmark/references/ — responsive.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/responsive.md]]`
- Purpose: Mobile responsiveness rules: verified at 320/375/414/768px; no horizontal scroll (overflow-x: clip on html + body); no two-line clickable text; image grid tracks use minmax(0, 1fr); display headers use overflow-wrap: anywhere; section heads collapse to one column; radio-tab patterns don't scroll-jump.
- Key exports: Mobile non-negotiables; breakpoint-specific rules; overflow-x: clip pattern
- Learner-relevant: Shows how to encode mobile-responsiveness as hard gates rather than guidelines.

### skills/hallmark/references/ — microinteractions.md

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/microinteractions.md]]`
- Purpose: Rules for purposeful micro-interactions: max 3 primitives per page; transition-all banned; uniform hover-scale banned; overshoot easings reserved for physical interactions only; focus rings appear instantly; number reveal on stats; pricing card lift; marquee scroll; stagger reveal on lists. Includes duration table per theme genre.
- Key exports: Microinteraction rules; 3-primitive cap; duration table; purpose classification
- Learner-relevant: Shows how to add motion discipline to AI-generated output — limiting animation to purposeful, genre-appropriate microinteractions rather than gratuitous decoration.

### skills/hallmark/references/ — other reference files

- Locator: `[[sources/ai-html/20260910/hallmark/skills/hallmark/references/]]` (remaining files)
- Purpose: layout-and-space.md (4pt scale, grid breaks, asymmetry), motion.md (easings, durations, reduced-motion), copy.md (verb register, label conventions, error structure), hero-enrichment.md (E1–E8 enrichment archetypes, image-need detection, enrichment hierarchy), imagery-kit.md (non-photographic illustration recipes), custom-craft.md (CSS art, SVG, declarative animation), assets.md (icons, photography, Lottie), contract.md (output contract, scope rules), export-formats.md (multi-format exports with design.md), design-md.md (portable design system format), floating-nav.md, preview-examples.md (Step 5 worked examples).
- Key exports: Supplementary rules for layout, motion, copy, enrichment, and export
- Dependencies: Cross-references with tokens, anti-patterns, slop-test
- Learner-relevant: Each file is a focused deep-dive into one design discipline. Together they form a complete design system documentation — the kind of ruleset a human design team would spend months developing.

### docs/recipes.md

- Locator: `[[sources/ai-html/20260910/hallmark/docs/recipes.md]]`
- Purpose: 8 worked briefs showing the full Hallmark flow: verbatim prompt → inferred audience/use/tone → macrostructure + theme + enrichment picks → output excerpt. Includes live page links to _tests/ folders. Ranges from "explicit context" (Coffeebox bakery) to "user skipped all questions" (Tide podcast).
- Key exports: 8 copy-paste prompts with expected outputs
- Learner-relevant: Shows how the skill's design flow translates from natural-language briefs into concrete design decisions. The progression from explicit to inferred briefs demonstrates the skill's flexibility.

### docs/study-examples.md

- Locator: `[[sources/ai-html/20260910/hallmark/docs/recipes.md]]` (parallel to recipes.md)
- Purpose: 3 worked DNA-extraction examples for the `hallmark study` verb: extracting design DNA from screenshots and URLs, producing diagnosis reports and optionally portable design.md files.
- Key exports: DNA extraction walkthroughs with diagnosis reports
- Learner-relevant: Demonstrates the study verb's ability to read and analyse existing designs, extracting structural patterns without copying pixels.

### docs/talk-slides.md

- Locator: `[[sources/ai-html/20260910/hallmark/docs/talk-slides.md]]`
- Purpose: Presentation slides for talks about Hallmark — covering the anti-AI-slop thesis, the skill's architecture, and live demonstrations.
- Key exports: Slide deck content
- Learner-relevant: Narrative explanation of the Hallmark philosophy and architecture, useful for understanding the "why" behind the design decisions.

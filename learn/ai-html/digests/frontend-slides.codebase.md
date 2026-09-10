---
source: frontend-slides
source_type: codebase
source_lines: 50948
language: javascript
file_count: 163
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — frontend-slides (codebase)

## Overview (L1)

- **SKILL.md** — Core workflow document for a Claude Code / coding-agent skill that generates zero-dependency, animation-rich HTML presentations. Defines a 6-phase pipeline: detect mode → content discovery → style discovery → generate → delivery → share/export. Includes fixed 16:9 stage rules, anti-AI-slop design philosophy, and content density modes.
- **STYLE_PRESETS.md** — 12 curated visual preset definitions (Bold Signal, Electric Studio, Creative Voltage, Dark Botanical, Notebook Tabs, Pastel Geometry, Split Pastel, Vintage Editorial, Neon Cyber, Terminal Green, Swiss Modern, Paper & Ink). Each preset specifies typography, CSS colors, signature elements, and a mood pairing table. Includes CSS gotchas for negating CSS functions.
- **animation-patterns.md** — Reference for CSS/JS animation snippets organized by feeling (Dramatic, Techy, Playful, Professional, Calm, Editorial). Covers entrance animations (.reveal, .reveal-scale, .reveal-left, .reveal-blur), background effects (gradient mesh, noise, grid pattern), and interactive effects (3D tilt on hover).
- **html-template.md** — Reference architecture for generated HTML presentations. Defines the base HTML structure, SlidePresentation class (keyboard/touch/wheel navigation, stage scaling), inline editing implementation (JS-based hover with 400ms grace period), and image pipeline (Pillow-based crop/resize). Single-file output model.
- **viewport-base.css** — Mandatory CSS included in every presentation. Locks the browser viewport, defines the fixed 1920x1080 `.deck-stage` canvas, stacks `.slide` elements with `visibility`/`opacity` switching (not `display:none`), and provides `@media print` and `prefers-reduced-motion` support.
- **bold-template-pack/** — 34 design-forward template systems sourced from `beautiful-html-templates`. Each template has a `preview.md` (lightweight style card for title-slide previews) and a `design.md` (full design-system recipe with colors, typography scales, component grammar, and spacing). `selection-index.json` provides compact metadata for candidate selection. `deck-stage.js` is a reusable `<deck-stage>` web component for slide navigation, auto-scaling, and print.
- **plugins/** — Claude Code plugin packaging of the skill. Mirrors the root skill files under `plugins/frontend-slides/skills/frontend-slides/` with `plugin.json` (v2.1.0) and `marketplace.json` for the custom marketplace-source install flow.
- **scripts/** — Shell/Python utilities: `extract-pptx.py` (PPT content extraction), `deploy.sh` (Vercel deployment), `export-pdf.sh` (Playwright-based PDF export from HTML slides).

## Structure (L2)

### SKILL.md

- Locator: `[[sources/ai-html/20260910/frontend-slides/SKILL.md]]`
- Purpose: Main skill workflow document. Defines the full presentation-creation pipeline (Phases 0-6), content and style discovery, PPT conversion, delivery, and share/export. Contains all non-negotiable rules (fixed 16:9 stage, anti-AI-slop, preview authenticity).
- Key exports: N/A (documentation-only)
- Dependencies: References `STYLE_PRESETS.md`, `viewport-base.css`, `html-template.md`, `animation-patterns.md`, `bold-template-pack/selection-index.json`, `scripts/*`
- Learner-relevant: Core architecture of a coding-agent skill for generating HTML presentations; demonstrates progressive-disclosure skill design where an agent reads lightweight indexes first, then loads full references only on demand.

### STYLE_PRESETS.md

- Locator: `[[sources/ai-html/20260910/frontend-slides/STYLE_PRESETS.md]]`
- Purpose: 12 curated visual presets with CSS variable blocks, typography specs, and signature elements. Serves as the safe-fallback style library during Phase 2 style discovery.
- Key exports: 12 preset definitions (Bold Signal, Electric Studio, Creative Voltage, Dark Botanical, Notebook Tabs, Pastel Geometry, Split Pastel, Vintage Editorial, Neon Cyber, Terminal Green, Swiss Modern, Paper & Ink)
- Dependencies: None (standalone reference)
- Learner-relevant: Shows how to define reusable visual design systems with CSS custom properties and typography hierarchies; anti-AI-slop philosophy as a design constraint.

### animation-patterns.md

- Locator: `[[sources/ai-html/20260910/frontend-slides/animation-patterns.md]]`
- Purpose: CSS/JS animation reference library organized by emotional feeling. Provides ready-to-use entrance animation classes, background effects, and interactive effects.
- Key exports: `.reveal`, `.reveal-scale`, `.reveal-left`, `.reveal-blur` CSS classes; `TiltEffect` JS class; gradient-mesh, noise, grid background patterns
- Dependencies: None (standalone reference)
- Learner-relevant: Demonstrates how to map animation techniques to emotional intent; CSS-only entrance animations with transition-delay staggering.

### html-template.md

- Locator: `[[sources/ai-html/20260910/frontend-slides/html-template.md]]`
- Purpose: Reference architecture for generated HTML presentations. Defines the HTML structure, SlidePresentation controller class, inline editing system, and image pipeline.
- Key exports: `SlidePresentation` class (constructor, setupStageScale, setupKeyboardNav, setupTouchNav, showSlide), inline editing with JS-based hotzone hover
- Dependencies: Requires `viewport-base.css` to be pasted inline
- Learner-relevant: Complete pattern for building a zero-dependency slide presentation with keyboard/touch navigation, viewport scaling, and contenteditable-based inline editing.

### viewport-base.css

- Locator: `[[sources/ai-html/20260910/frontend-slides/viewport-base.css]]`
- Purpose: Mandatory base CSS for the fixed 16:9 stage model. Included in full in every generated presentation.
- Key exports: CSS rules for `.deck-viewport`, `.deck-stage` (1920x1080), `.slide` (stacked, visibility-based switching), `.slide.active`/`.slide.visible`, `@media print`, `@media (prefers-reduced-motion)`
- Dependencies: None (standalone CSS)
- Learner-relevant: Canonical pattern for fixed-aspect-ratio viewport scaling with CSS transforms; print stylesheet for slide-per-page output; accessibility via reduced-motion support.

### bold-template-pack/README.md

- Locator: `[[sources/ai-html/20260910/frontend-slides/bold-template-pack/README.md]]`
- Purpose: Documents the progressive-disclosure loading strategy for bold templates: read `selection-index.json` first, shortlist candidates, read `preview.md` for shortlisted candidates, then read exactly one `design.md` after user selection. Defines the preview mix (1 safe + 1 bold + 1 wildcard).
- Key exports: N/A (documentation-only)
- Dependencies: References `selection-index.json`, `preview.md`, `design.md`
- Learner-relevant: Progressive-disclosure pattern for large template libraries; how to balance safe defaults with bold options in a design-selection workflow.

### bold-template-pack/selection-index.json

- Locator: `[[sources/ai-html/20260910/frontend-slides/bold-template-pack/selection-index.json]]`
- Purpose: Compact JSON index of all 34 bold templates. Each entry includes slug, name, tagline, mood, tone, formality, density, scheme, best_for, avoid_for, and file paths to `preview.md` and `design.md`.
- Key exports: JSON array of 34 template metadata objects; `frontend_slides_policy` (fixed-stage rules: 1920x1080 canvas, scale-to-viewport)
- Dependencies: None (standalone JSON)
- Learner-relevant: Shows how to build a machine-readable selection index for a design template library; metadata-driven candidate shortlisting.

### bold-template-pack/deck-stage.js

- Locator: `[[sources/ai-html/20260910/frontend-slides/bold-template-pack/deck-stage.js]]`
- Purpose: Reusable `<deck-stage>` web component (Custom Element with Shadow DOM). Handles slide navigation (keyboard, click, tap zones for mobile), auto-scaling of the 1920x1080 canvas, slide-change events, speaker notes via `postMessage`, print/PDF support, and overlay UI with slide counter and reset button.
- Key exports: `DeckStage` class (extends HTMLElement); attributes: `width`, `height`, `noscale`; public API: `goTo(i)`, `next()`, `prev()`, `reset()`, `index`, `length`; CustomEvent `slidechange` with detail `{index, previousIndex, total, slide, previousSlide, reason}`
- Dependencies: None (self-contained web component)
- Learner-relevant: Production-quality web component pattern for slide presentations; Shadow DOM encapsulation with light-DOM slot for authored CSS; auto-scaling via CSS transform; print stylesheet injection into `document.head`.

### bold-template-pack/templates/*/

- Locator: `[[sources/ai-html/20260910/frontend-slides/bold-template-pack/templates/<slug>/]]`
- Purpose: Each of the 34 template directories contains `preview.md` (lightweight style card with palette snapshot, signature moves, and preview rules) and `design.md` (full design-system recipe with colors, typography scales at every level, component grammar, spacing rhythm, decorative vocabulary, CJK support, and slide-type blueprints).
- Key exports: Per-template `preview.md` and `design.md` files
- Dependencies: None (self-contained per template)
- Learner-relevant: Shows how to structure a design system as two-tier documentation: a compact preview card for rapid comparison and a full specification for implementation.

### plugins/frontend-slides/

- Locator: `[[sources/ai-html/20260910/frontend-slides/plugins/frontend-slides/]]`
- Purpose: Claude Code plugin packaging. Contains `.claude-plugin/plugin.json` (v2.1.0, skill metadata, author info) and a `skills/frontend-slides/` directory that mirrors the root skill files for the plugin marketplace install flow.
- Key exports: `plugin.json` (name, version, description, skills path, author, license); `marketplace.json` (at root `.claude-plugin/`) for the custom marketplace-source install
- Dependencies: Mirrors root skill files (`SKILL.md`, `STYLE_PRESETS.md`, `viewport-base.css`, `html-template.md`, `animation-patterns.md`, `bold-template-pack/`, `scripts/`)
- Learner-relevant: Demonstrates how to package a coding-agent skill as a Claude Code plugin with marketplace discovery; the plugin structure separates user-facing skill files from the plugin manifest.

### scripts/

- Locator: `[[sources/ai-html/20260910/frontend-slides/scripts/]]`
- Purpose: Deployment and export utilities. `extract-pptx.py` extracts text, images, and speaker notes from .pptx files using python-pptx. `deploy.sh` deploys a single HTML file or folder to Vercel. `export-pdf.sh` uses Playwright to screenshot each slide at 1920x1080 and combine into a PDF.
- Key exports: `extract-pptx.py` (Python), `deploy.sh` (Bash), `export-pdf.sh` (Bash)
- Dependencies: `extract-pptx.py` requires `python-pptx` and `Pillow`; `deploy.sh` requires Vercel CLI; `export-pdf.sh` requires Playwright (installs automatically)
- Learner-relevant: Shows how to build tooling around a presentation skill: PPT-to-HTML extraction pipeline, Vercel deployment automation, and headless-browser PDF export with Playwright.

### README.md

- Locator: `[[sources/ai-html/20260910/frontend-slides/README.md]]`
- Purpose: Project README with installation instructions (Claude Code marketplace, manual, other agents), usage examples, style gallery with screenshots for all 34 bold templates, architecture overview, and philosophy.
- Key exports: N/A (documentation-only)
- Dependencies: References all skill files
- Learner-relevant: Shows how to document a coding-agent skill for both human readers and other agents; the "progressive disclosure" architecture pattern for skill files.

### .claude-plugin/marketplace.json

- Locator: `[[sources/ai-html/20260910/frontend-slides/.claude-plugin/marketplace.json]]`
- Purpose: Claude Code marketplace metadata for discovering the plugin. Links to the plugin source at `./plugins/frontend-slides` with category and tags.
- Key exports: N/A (metadata-only)
- Dependencies: Points to `plugins/frontend-slides`
- Learner-relevant: Shows how to register a skill plugin in Claude Code's custom marketplace-source system.

### LICENSE

- Locator: `[[sources/ai-html/20260910/frontend-slides/LICENSE]]`
- Purpose: MIT License, copyright 2025 Zara Zhang.
- Key exports: N/A
- Dependencies: None
- Learner-relevant: N/A

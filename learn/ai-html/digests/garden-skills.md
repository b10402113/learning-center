---
source: garden-skills
source_type: codebase
source_lines: 47093
language: typescript
file_count: 510
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — garden-skills

## Overview (L1)

- **skills/** — The core monorepo: 3 production-ready Agent Skills (beautiful-article, web-design-engineer, web-video-presentation), each a self-contained folder with SKILL.md (agent-facing spec), manifest.json (release metadata), references/ (on-demand docs), and scripts/templates/themes as needed. Skills are distributed via `npx skills add`, Claude Code plugin marketplace, pinned .zip releases, manual copy, or git submodule. Per-skill SemVer; zero npm runtime dependencies.
- **website/** — Two standalone Vite + React + TypeScript showcase sites: `web-design-website` (a 14-chapter interactive presentation of the web-design-engineer skill, with design tokens and motion system) and `gpt-image2-website` (a case gallery and docs viewer for the gpt-image-2 skill with Netlify deployment config).
- **demo/** — Live, openable HTML demos for web-design-engineer: standalone HTML files (demo1, demo2) and a variant with skill integration (demo1-with-skill.html, demo2-with-skill.html), plus a demo2/ subfolder.
- **dist/** — Shared static assets: `prompts/claude-design-system-prompt.md` (the original Claude Design system prompt that inspired web-design-engineer).
- **scripts/** — Release tooling (empty in this snapshot; referenced in package.json: cut-release.mjs, pack-skill.mjs, update-readme.mjs, list-skills.mjs).
- **.claude-plugin/** — Claude Code plugin marketplace manifest (`marketplace.json`) declaring 5 plugin packs (presentation-skills, web-design-skills, knowledge-base-skills, image-generation-skills, beautiful-article-skills). Note: gpt-image-2 and kb-retriever skills are referenced in marketplace.json and README but their `skills/` directories are absent from this snapshot.
- **.github/** — CI workflows: `release-skill.yml` (tag-driven per-skill release → GitHub Releases + README sync) and `validate-skills.yml` (PR guard rails: manifest lint, smoke pack, README link check).

## Structure (L2)

### skills/beautiful-article

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/beautiful-article]]`
- Purpose: Editorial harness skill that turns any source material (URL / PDF / DOCX / Markdown / text / screenshots) into a polished, share-ready single-file HTML article via the reacticle component protocol. Runs a source → plan → double-confirmation → build → final review → repair harness with 3 hard checkpoints. Supports 10 article types (longform, tutorial, explainer, briefing, essay, etc.) and 11 authoring theme profiles.
- Key exports: `SKILL.md` (466-line agent spec in Chinese), `manifest.json` (v0.1.0)
- Dependencies: reacticle (npm), Vite + React + TS scaffold, MarkItDown (Python, optional)
- Learner-relevant: Teaches editorial workflow design for AI agents — how to structure multi-phase creative harnesses with quality gates, SubAgent delegation, and progressive disclosure of reference docs. Models the "harness pattern" for complex content generation.

### skills/beautiful-article/references

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/beautiful-article/references]]`
- Purpose: 18 on-demand reference documents the agent loads per phase: harness.md (harness perspective), source-to-markdown.md (input extraction rules), article-types.md + article-types/*.md (10 type specs), information-density.md, plan-template.md, theme-selection.md, layout.md, asset-policy.md, cover.md (3:4 book-cover design), section-build.md (one-section-one-file rule), component-policy.md (reacticle protocol), raw-policy.md, html-output.md, pdf-output.md, review-checklist.md, repair-policy.md, scaffold.md.
- Key exports: N/A (reference docs, not code)
- Dependencies: beautiful-article SKILL.md
- Learner-relevant: Reference architecture for progressive-load documentation — each file maps to a specific workflow phase, preventing context overload in long agent sessions.

### skills/beautiful-article/theme-profiles

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/beautiful-article/theme-profiles]]`
- Purpose: 11 authoring theme profiles (tufte, press, bayer, bodoni, vignelli, sottsass, freddie, andy, fuller, knuth, shannon) — each a Markdown contract defining palette, typography, spacing, and tone for the agent to follow. `index.json` provides lookup metadata.
- Key exports: `index.json` (theme registry), individual `*.md` theme contracts
- Learner-relevant: Demonstrates how to encode design-system constraints as machine-readable Markdown contracts rather than CSS files — a pattern for theme-driven content generation.

### skills/beautiful-article/scripts

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/beautiful-article/scripts]]`
- Purpose: 5 executable helpers: `scaffold.sh` (creates Vite + React + TS article workspace with cover option), `html-to-pdf.sh` (headless browser PDF export with print CSS injection, zero npm deps), `pdf-print-overrides.css` (print layout overrides), `source-to-markdown-markitdown.py` (MarkItDown-based extraction for complex PDF/DOCX/HTML), `source-to-markdown.py` (lightweight fallback for Markdown/TXT/simple HTML).
- Key exports: `scaffold.sh`, `html-to-pdf.sh`, `source-to-markdown-markitdown.py`, `source-to-markdown.py`
- Dependencies: MarkItDown (Python, optional), chromium-family browser (for PDF)
- Learner-relevant: Shows how to pair bash/Python scripts with agent skills for deterministic operations (scaffolding, file conversion) that agents shouldn't improvise.

### skills/beautiful-article/assets

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/beautiful-article/assets]]`
- Purpose: Scaffold template for the article workspace — contains the Vite + React + TS boilerplate (package.json, vite.config.ts, tsconfig.json, .npmrc, index.html) plus the article/ directory with starter components.
- Key exports: `scaffold-template/` (Vite project skeleton)
- Dependencies: reacticle (npm)
- Learner-relevant: Concrete example of a skill-embedded scaffold template — the skill ships its own project skeleton rather than depending on a global tool.

### skills/web-design-engineer

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-design-engineer]]`
- Purpose: Positions the agent as a top-tier design engineer for building polished HTML/CSS/JS/React visual artifacts (pages, dashboards, prototypes, slide decks, animations, UI mockups, data visualizations). 7-step workflow: verify facts → understand requirements → gather design context → declare design system → show v0 draft → full build → verification. Includes Design Direction Advisor (6 schools), 25 anchored style recipes, anti-cliché blocklist, and 5-dimension critique scoring.
- Key exports: `SKILL.md` (492-line agent spec), `manifest.json` (v1.3.0)
- Dependencies: None (pure agent instructions + reference docs)
- Learner-relevant: The most mature skill in the repo. Teaches design-engineering methodology for AI agents — how to calibrate five design dials (variance, motion, density, asset dependence, brand fidelity), avoid AI-style clichés, and run structured critique. The anti-cliché blocklist and Design Direction Advisor are reusable patterns.

### skills/web-design-engineer/references

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-design-engineer/references]]`
- Purpose: 9 reference documents: advanced-patterns.md (device frames, slide engine, animation timeline, Tweaks panel, dark mode, design canvas, oklch color system), block-library.md (reusable component patterns), browser-acceptance.md (executable QA harness), critique-guide.md (5-dimension scoring rubrics), design-calibration.md (five-dial inference bands and presets), design-directions.md (extended philosophy library + per-school anchor tables), failure-patterns.md (AI-design failure modes by artifact type), redesign-protocol.md (Extension/Preserve/Overhaul classification), and style-recipes/ (25 individual recipe files + INDEX.md).
- Key exports: N/A (reference docs)
- Dependencies: web-design-engineer SKILL.md
- Learner-relevant: The style-recipes/ directory is a catalog of 25 named design anchors (Linear, Aesop, Bloomberg Terminal, Stripe Press, mid-century-modern, Y2K-retrofuturism, etc.) — each a concrete palette/typography/spacing contract. Demonstrates how to build a reusable design recipe system.

### skills/web-design-engineer/references/style-recipes

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-design-engineer/references/style-recipes]]`
- Purpose: 25 individual design-recipe files + INDEX.md. Each recipe (e.g., `linear.md`, `aesop.md`, `bloomberg-terminal.md`) defines a concrete palette, typography, spacing, border-radius, shadow, and motion contract for a named design anchor. INDEX.md provides 3 lookup indexes (by school, by best-for, by mode).
- Key exports: `INDEX.md` (catalog index + 3 indexes + anti-patterns), 25 recipe files
- Dependencies: web-design-engineer SKILL.md (Step 2 + Design Direction Advisor)
- Learner-relevant: A design-system-as-data pattern — each recipe is a Markdown contract that an agent can load on demand and paste directly into a design-system declaration. Models how to encode "taste" as structured, loadable artifacts.

### skills/web-design-engineer/agents

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-design-engineer/agents]]`
- Purpose: Contains `openai.yaml` — an OpenAI-compatible agent configuration for the web-design-engineer skill.
- Key exports: `openai.yaml`
- Dependencies: web-design-engineer SKILL.md
- Learner-relevant: Shows how to adapt a SKILL.md-based skill for non-Claude agent runtimes.

### skills/web-video-presentation

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-video-presentation]]`
- Purpose: Turns scripts/articles/lessons into click-driven 16:9 web presentations that can be screen-recorded as cinematic videos. 4-phase workflow: content writing (script + outline) → web development (scaffold → chapter-by-chapter build) → optional audio synthesis (provider-agnostic TTS) → recording. Ships 23 built-in themes, a Vite + React + TS scaffold, and a (chapter, step) cursor model with narrations.ts as the single source of truth for step count and audio sync.
- Key exports: `SKILL.md` (451-line agent spec), `manifest.json` (v1.2.2)
- Dependencies: Vite + React + TypeScript, TTS providers (MiniMax mmx-cli, OpenAI TTS via curl)
- Learner-relevant: The most complex skill architecturally. Teaches the "presentation-as-video" pattern — a fixed 1920×1080 stage with transform:scale, hidden controls, step-driven cursor, and hard collaboration checkpoints. The narrations.ts → audio-segments.json → TTS pipeline is a reusable pattern for multi-modal content.

### skills/web-video-presentation/references

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-video-presentation/references]]`
- Purpose: 7 reference documents + EXAMPLES/ directory: SCRIPT-STYLE.md (article → narration script rules), OUTLINE-FORMAT.md (outline.md field spec), CHAPTER-CRAFT.md (the single must-read entry for chapter implementation — 8 parts covering principles,开工 questions, decision tree, visual toolbox, timing, anti-AI patterns, code rules, completion checklist), THEMES.md (theme token contract + creation flow), AUDIO.md (provider-agnostic audio synthesis), RECORDING.md (screen recording tools), and EXAMPLES/ (3 structural examples: hook-chapter, list-reveal, case-tech-review).
- Key exports: N/A (reference docs)
- Dependencies: web-video-presentation SKILL.md
- Learner-relevant: CHAPTER-CRAFT.md is the deepest single reference — an 8-part guide that encodes design methodology for video-like web content. The EXAMPLES/ directory provides structural patterns (not templates to copy).

### skills/web-video-presentation/themes

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-video-presentation/themes]]`
- Purpose: 23 built-in themes, each with `theme.json` (name, nameZh, description, descriptionZh, bestFor, mood, color palette, typography) and `tokens.css` (CSS custom properties). Themes span editorial, terminal, engineering, Swiss International, and creative aesthetics.
- Key exports: 23 theme directories (bauhaus-bold, blueprint, bold-signal, chalk-garden, creative-voltage, dark-botanical, dune, electric-studio, forest-ink, indigo-porcelain, kraft-paper, midnight-press, monochrome-print, neon-cyber, newsroom, paper-press, pastel-dream, split-canvas, sunset-zine, swiss-ikb, terminal-green, vintage-editorial, warm-keynote)
- Dependencies: web-video-presentation SKILL.md (Checkpoint Plan reads all theme.json files)
- Learner-relevant: A theme-token architecture — each theme is a self-contained directory with JSON metadata + CSS tokens, making themes swappable at scaffold time. Demonstrates how to separate "design identity" from "layout logic."

### skills/web-video-presentation/templates

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-video-presentation/templates]]`
- Purpose: Scaffold template for the Vite + React + TS presentation project. Contains index.html, package.json, vite.config.ts, and src/ with the chapter framework, hooks, and registry.
- Key exports: Vite project skeleton with chapter framework
- Dependencies: Vite, React, TypeScript
- Learner-relevant: Shows how a skill ships a full project scaffold — not just instructions but a runnable starter with chapter routing, step cursor, and theme integration baked in.

### skills/web-video-presentation/scripts

- Locator: `[[sources/ai-html/20260910/garden-skills/skills/web-video-presentation/scripts]]`
- Purpose: Contains `scaffold.sh` — one-command project scaffolding that creates the Vite + React + TS presentation project with a selected theme. Supports `--list-themes` to show available themes.
- Key exports: `scaffold.sh`
- Dependencies: web-video-presentation themes/
- Learner-relevant: Pattern for skill-bundled scaffold scripts that bootstrap a full project from a theme selection.

### website/web-design-website

- Locator: `[[sources/ai-html/20260910/garden-skills/website/web-design-website]]`
- Purpose: Standalone Vite + React + TypeScript showcase website for the web-design-engineer skill. A 14-chapter interactive presentation (opening → video → core-point → role → workflow → anti-ai → oklch → restraint → verification → to-skill → skill-changes → references → closing → outro) with design tokens (tokens.css), motion system (motion.ts), stage components, and store management.
- Key exports: `src/App.tsx`, `src/chapters/` (14 chapter components), `src/design/` (tokens + motion), `src/stage/`, `src/store/`
- Dependencies: React, TypeScript, Vite
- Learner-relevant: A live example of the web-design-engineer skill's output — demonstrates the 16:9 stage pattern, chapter-based navigation, and design-token architecture in practice.

### website/gpt-image2-website

- Locator: `[[sources/ai-html/20260910/garden-skills/website/gpt-image2-website]]`
- Purpose: Standalone Vite + React + TypeScript showcase website for the gpt-image-2 skill. A case gallery and documentation viewer with hero section, gallery components, skills section, shared utilities, and structured data (cases.json, docs.json). Deployed via Netlify.
- Key exports: `src/App.tsx`, `src/components/` (gallery, hero, shared, skills), `src/data/` (cases.json, docs.json), `src/lib/`, `src/types/`
- Dependencies: React, TypeScript, Vite, Netlify
- Learner-relevant: Demonstrates how to build a showcase/portfolio site for an image-generation skill — structured data driving a gallery UI with category filtering.

### demo/web-design-demo

- Locator: `[[sources/ai-html/20260910/garden-skills/demo/web-design-demo]]`
- Purpose: Live, openable HTML demos for web-design-engineer. Contains standalone HTML files (demo1.html, demo2.html) and skill-integrated variants (demo1-with-skill.html, demo2-with-skill.html), plus a demo2/ subdirectory.
- Key exports: 4 HTML files + demo2/ directory
- Dependencies: None (standalone HTML)
- Learner-relevant: Shows the before/after of applying the web-design-engineer skill — plain HTML vs. skill-enhanced HTML.

### dist/prompts

- Locator: `[[sources/ai-html/20260910/garden-skills/dist/prompts]]`
- Purpose: Shared reference materials. Contains `claude-design-system-prompt.md` — the original Claude Design system prompt that inspired the web-design-engineer skill, preserved for reference.
- Key exports: `claude-design-system-prompt.md`
- Dependencies: None
- Learner-relevant: Historical artifact showing the provenance of the web-design-engineer skill's design philosophy.

### .claude-plugin/marketplace.json

- Locator: `[[sources/ai-html/20260910/garden-skills/.claude-plugin/marketplace.json]]`
- Purpose: Claude Code plugin marketplace manifest declaring 5 plugin packs: presentation-skills (web-video-presentation), web-design-skills (web-design-engineer), knowledge-base-skills (kb-retriever), image-generation-skills (gpt-image-2), beautiful-article-skills (beautiful-article). Enables `/plugin install` from the Claude Code marketplace.
- Key exports: marketplace manifest (v0.4.0)
- Dependencies: All 5 skills
- Learner-relevant: Shows how to package agent skills as discoverable plugin packs for a marketplace ecosystem.

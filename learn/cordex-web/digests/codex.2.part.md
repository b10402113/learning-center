---
source: codex
source_type: codebase
source_lines: 3869
language: TypeScript
file_count: 22
part: 2
status: absorbed
absorbed_at: 2026-10-04
created: 20261004
updated: 20261004
---

# Digest — codex (part 2)

## Overview (L1)

- **README.md + root AGENTS.md** — The repo's front door and Codex steering file. README introduces the Master.dev "Agentic Frontend Development with Codex" course, its example prompts, and the `user-insights` demo app. The root `AGENTS.md` tells Codex to read both local skills before touching frontend code, ignore the `prompts/` folder, and keep the starter project intact with deterministic public-safe data.

- **`prompts/`** — Nine example prompt files used during the course, demonstrating how to brief Codex: a landing page, a "mission control" dashboard from fixtures + moodboard, several User Insights feature prompts (add a section, author a skill, build a tutorial page), and a four-part "Year in a Day" sequence (initial build, add sprites, polish with a GOAL block, debug a specific bug). They show prompt structure from idea → goal → iteration → debug.

- **`fixtures/mission-control-fixtures/`** — Fictional, deterministic JSON data (calendar, gmail, slack, tasks) shared by the Mission Control exercise. Each file carries `fictional: true`, a fixed `referenceDate`/`timeZone`, and stable IDs so refreshes don't duplicate records.

- **`user-insights/`** — A working React 19 + Vite 7 + TypeScript + Tailwind v4 dashboard ("BlossomView") built entirely from deterministic fictional data. Demonstrates a real design system in code (CSS tokens + shadcn-style primitives), a data layer with typed helpers, an interactive WebGL globe, and project-local skills/instructions that teach Codex the codebase.

- **`user-insights/skills/blossomview-card-builder/`** — A project-local Codex skill that encodes how to add dashboard cards using the real BlossomView components, data contracts, and design tokens. Shows how a skill is authored (`SKILL.md` + `references/` + `assets/` + `agents/openai.yaml`).

- **`assets/mission-control-moodboard.png`** — Binary moodboard image referenced by `prompts/mission-control.txt` as art direction only (not read; author says translate its colors/materials/spacing, don't copy its layout).

## Structure (L2)

### README.md

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/README.md]]`
- Purpose: Course entry point. Describes the free Master.dev Codex course, points to `prompts/`, describes the `user-insights` example app and how to run it (`npm install`, `npm run dev`), and states the repo is not open to contributions.
- Key exports: None (prose).
- Dependencies: Links to `master.dev`, the course website, `prompts`, `user-insights`, `LICENSE`.
- Learner-relevant: Shows how a starter repo frames the course: prompts to follow along, one shared example app, MIT license. Read alongside `AGENTS.md` to see the agent-facing versus human-facing split.

### AGENTS.md (root)

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/AGENTS.md]]`
- Purpose: Root Codex steering file. Before changing frontend code, Codex must read and follow `design-ui-with-restraint` and `write-practical-copy` skills; `Ignore the prompts folder`; keep the starter project intact, make scoped changes, use deterministic public-safe data, and verify rendered desktop + mobile before claiming done.
- Key exports: None.
- Dependencies: References the two `.agents/skills/*/SKILL.md` files.
- Learner-relevant: A minimal, high-leverage example of `AGENTS.md` as a scoping/policy file — it doesn't restate the skills but routes Codex to them and sets guardrails (keep the example intact, verify rendering).

### LICENSE

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/LICENSE]]`
- Purpose: MIT License, Copyright (c) 2026 OpenAI.
- Key exports: None.
- Dependencies: None.
- Learner-relevant: Confirms the repo is public-safe, shareable workshop material.

### .agents/skills/design-ui-with-restraint/SKILL.md

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/.agents/skills/design-ui-with-restraint/SKILL.md]]`
- Purpose: Repo-level skill for clear interfaces. Gives rules on structure/hierarchy (one clear title per page/section/card, add labels only when useful, no internal notes in UI), visuals/interaction (match style to audience, accurate charts, consistent spacing, check for visual errors), and editing (change only what's asked; remove elements that add nothing). Includes a small Examples list (remove redundant "Schedule", decorative numbering, group related chart items).
- Key exports: YAML frontmatter `name: design-ui-with-restraint`, `description: ...`.
- Dependencies: None.
- Learner-relevant: Shows a short, opinionated skill expressed as judgment rules plus concrete examples — the pattern of encoding taste as instructions Codex will apply.

### .agents/skills/write-practical-copy/SKILL.md

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/.agents/skills/write-practical-copy/SKILL.md]]`
- Purpose: Repo-level skill for practical copy. Rules for titles/labels (name the thing directly) and descriptions (plain language, concrete, non-repetitive). Ends with an "Avoid" table mapping AI-tell patterns (forced contrasts, poetic-but-meaningless claims, clever-but-unclear headings, vague section names, artificial parallelism, self-important framing, decorative taglines, vague CTAs, dramatic/disconnected fragments) to suggested replacements.
- Key exports: YAML frontmatter `name: write-practical-copy`, `description: ...`.
- Dependencies: None.
- Learner-relevant: A reusable anti-slop copy checklist — good template for encoding a writing standard as a skill with before/after examples.

### .agents/skills/*/agents/openai.yaml

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/.agents/skills/design-ui-with-restraint/agents/openai.yaml]]`, `[[sources/cordex-web/20261004/codex/master-dev-workshop/.agents/skills/write-practical-copy/agents/openai.yaml]]`
- Purpose: Codex-facing interface metadata for each skill: `display_name`, `short_description`, and a `default_prompt` that invokes the skill (e.g. "Use $design-ui-with-restraint to improve this interface...").
- Key exports: `interface.display_name`, `interface.short_description`, `interface.default_prompt`.
- Dependencies: Pair with the sibling `SKILL.md`.
- Learner-relevant: Shows the manifest that makes a skill discoverable/invocable — the `$skill-name` invocation convention.

### prompts/landing-page.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/landing-page.txt]]`
- Purpose: New-site prompt. Build a fictional plant-shop landing page ("Fern & Clay") in `lp-example` using Sites. Specifies skills to use, art direction (winter-garden palette/materials/type), required content sections, image-generation direction, and finishing requirements (responsive, accessible, polished, publish privately).
- Key exports: None.
- Dependencies: Invokes `design-ui-with-restraint` and `write-practical-copy` skills; mentions Sites image generation.
- Learner-relevant: A model "greenfield" brief: role, constraints, art direction, deliverables, and quality bar separated into readable blocks.

### prompts/mission-control.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/mission-control.txt]]`
- Purpose: New-site prompt. Build "Mission Control", a personal workday dashboard, in `mission-control` using the `fixtures/mission-control-fixtures/` data and `assets/mission-control-moodboard.png` as art direction (translate, don't copy). Lists required features (day-at-a-glance, task board with columns, filters, persistence, refresh-without-overwriting-manual-changes, reset), plus responsive/accessibility/publish requirements.
- Key exports: None.
- Dependencies: `fixtures/mission-control-fixtures/*`, `assets/mission-control-moodboard.png`, Sites durable data.
- Learner-relevant: Shows how to combine a moodboard + fixtures into a spec, and how to specify data behavior (persist, refresh vs reset semantics) precisely.

### prompts/user-insights-audience-momentum.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/user-insights-audience-momentum.txt]]`
- Purpose: Existing-project feature prompt. Add a "Where activity is changing" section that follows existing region/period controls, shows fastest-growing country, a trend, gaining/losing lists, and highlights a selected country on the globe. Emphasizes reusing existing state/data/components/styles and checking mobile/tablet/desktop.
- Key exports: None.
- Dependencies: `user-insights` app (`getCities`/`getGrowthData`/globe state), `blossomview-card-builder` patterns.
- Learner-relevant: The canonical "work in an existing codebase" prompt: describe the feature, then explicitly constrain Codex to reuse the project's own patterns instead of inventing new ones.

### prompts/user-insights-screenshot-to-component-skill.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/user-insights-screenshot-to-component-skill.txt]]`
- Purpose: Meta prompt. Use `$skill-creator` to author a `screenshot-to-component` skill for User Insights that recreates a screenshot as an editable React illustration reusing real components/styles/tokens/icons; build real UI (not an image), keep it responsive/accessible, put it in `user-insights/skills/screenshot-to-component`, test with a real screenshot, and run typecheck/build.
- Key exports: None.
- Dependencies: `$skill-creator`, `user-insights` project, `pnpm run typecheck` / `build`.
- Learner-relevant: Demonstrates asking Codex to create a new skill (skill authoring as a task) with explicit reuse and validation requirements.

### prompts/user-insights-tutorial-page.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/user-insights-tutorial-page.txt]]`
- Purpose: Existing-project feature prompt. Build a three-step tutorial webpage for new teammates explaining the dashboard, using the `screenshot-to-component` skill for attached screenshots. Specifies editorial (not marketing/dashboard/slide) tone, step labels/rename, one substantial illustration per section, and anchor navigation.
- Key exports: None.
- Dependencies: `screenshot-to-component` skill (from prior prompt), `user-insights` components/tokens.
- Learner-relevant: Shows a prompt that chains skills together and pins down content shape (three numbered steps, one illustration each) while excluding the wrong genre.

### prompts/year-in-a-day-01-experience.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/year-in-a-day-01-experience.txt]]`
- Purpose: Long-form greenfield prompt. Build "One Turning World", a scroll-driven Three.js + Motion Vite experience: one persistent globe, five cities (Tokyo/Cairo/Paris/New York/Ushuaia), 25 scroll states, per-city lighting/atmosphere, procedural choreography, rear/foreground WebGL layering with hysteresis, a Bézier solar stepper, responsive + accessibility + reduced-motion rules.
- Key exports: None.
- Dependencies: React, TypeScript, Three.js, Motion, WebGL.
- Learner-relevant: A masterclass in structured long prompts — uppercase section headers (CORE CONCEPT, VISUAL COMPOSITION, THREE.JS CHOREOGRAPHY, SOLAR NAVIGATION, RESPONSIVE BEHAVIOR, QUALITY REQUIREMENTS) with exact numeric specs (viewBox, Bézier path, city positions).

### prompts/year-in-a-day-02-sprites.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/year-in-a-day-02-sprites.txt]]`
- Purpose: Iteration prompt. Starting from the existing app, add a restrained set of generated landmark sprites (specific landmarks per city), with asset-production rules (isolated cutouts, transparent WebP, no people/text/scenery), a data-driven sprite config (entry/focal/exit points, scale, orbit), and animation constraints.
- Key exports: None.
- Dependencies: Existing "One Turning World" app, ImageGen, `public/sprites`.
- Learner-relevant: Shows iterating on an existing build without redesigning it, plus very specific asset quality/format requirements.

### prompts/year-in-a-day-03-polish-goal.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/year-in-a-day-03-polish-goal.txt]]`
- Purpose: Goal-oriented polish prompt. Defines a GOAL (exhibition-quality), then SPATIAL MOTION (8-step orbit path, no opacity crossfades, limb clearance, depth hysteresis), CITY OWNERSHIP, ASSET QUALITY, MOTION QUALITY (delta-time damping), THE GLOBE, SOLAR STEPPER, SEASONAL CLARITY, and a VALIDATION LOOP with explicit viewport sizes and checks.
- Key exports: None.
- Dependencies: Existing app; browser inspection; screenshots; production build.
- Learner-relevant: The "GOAL" prompt pattern: state the outcome and define done as a concrete validation loop rather than "build passes."

### prompts/year-in-a-day-04-debug-tokyo.txt

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/prompts/year-in-a-day-04-debug-tokyo.txt]]`
- Purpose: Debug prompt. Describes a specific bug (Tokyo objects stay behind the globe while other cities come in front), asks Codex to reproduce it in the browser, find what's different about Tokyo, fix the root cause without breaking other cities, and check mobile/tablet/desktop.
- Key exports: None.
- Dependencies: Existing app; browser reproduction.
- Learner-relevant: A concise, symptom-plus-expected-behavior bug report that asks for reproduction and root-cause fix rather than a guessed patch.

### fixtures/mission-control-fixtures/README.md

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/fixtures/mission-control-fixtures/README.md]]`
- Purpose: Documents the fictional dataset contract: everything is fabricated; shared fixed `referenceDate` `2026-08-11T09:30:00-05:00` and `America/Chicago` time zone; stable IDs; describes each file; and specifies refresh (insert missing, preserve statuses, never overwrite manual tasks) vs reset (restore original dataset).
- Key exports: None.
- Dependencies: The four JSON files.
- Learner-relevant: Shows how to define deterministic fixture semantics (stable IDs, refresh/reset behavior) that a generated app must honor.

### fixtures/mission-control-fixtures/tasks.json

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/fixtures/mission-control-fixtures/tasks.json]]`
- Purpose: 17 seeded tasks across all board columns (`urgent`, `todo`, `blocked`, `backlog`, `done`) with `source` (slack/gmail/calendar/manual), `person`, `dueAt`, `sourceId`, optional `waitingOn`, and `url`.
- Key exports: Top-level `fictional`, `notice`, `referenceDate`, `timeZone`, and `tasks[]`.
- Dependencies: `sourceId` cross-references slack/gmail/calendar records.
- Learner-relevant: Realistic seed data that exercises a task board's columns, filtering by source, blocked/waiting states, and manual-vs-fixture provenance.

### fixtures/mission-control-fixtures/calendar.json

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/fixtures/mission-control-fixtures/calendar.json]]`
- Purpose: 5 fictional events with `startsAt`/`endsAt`, `attendees`, `location`, and `url`. Includes one focus block.
- Key exports: `fictional`, `notice`, `referenceDate`, `timeZone`, `events[]`.
- Dependencies: Referenced by task `sourceId`s (`calendar-*`).
- Learner-relevant: Demonstrates a schedule feed shape for a "day-at-a-glance" view.

### fixtures/mission-control-fixtures/slack.json

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/fixtures/mission-control-fixtures/slack.json]]`
- Purpose: 5 fictional channel messages with `channel`, `author`, `sentAt`, `text`, `needsResponse`, `url`.
- Key exports: `fictional`, `notice`, `referenceDate`, `timeZone`, `messages[]`.
- Dependencies: Referenced by task `sourceId`s (`slack-*`).
- Learner-relevant: Shows a messages feed with a `needsResponse` flag feeding "messages needing a response."

### fixtures/mission-control-fixtures/gmail.json

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/fixtures/mission-control-fixtures/gmail.json]]`
- Purpose: 4 fictional email previews with `from`, `subject`, `preview`, `receivedAt`, `needsResponse`, `url` (all `example.com`).
- Key exports: `fictional`, `notice`, `referenceDate`, `timeZone`, `messages[]`.
- Dependencies: Referenced by task `sourceId`s (`gmail-*`).
- Learner-relevant: Same feed pattern as Slack; shows unifying multiple sources behind shared adapters.

### assets/mission-control-moodboard.png

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/assets/mission-control-moodboard.png]]`
- Purpose: Binary moodboard image used as visual direction for the Mission Control prompt (colors, tactile materials, soft shapes, generous spacing, playful bento composition).
- Key exports: None (binary; not read).
- Dependencies: Referenced by `prompts/mission-control.txt`.
- Learner-relevant: Illustrates using a visual reference as art direction that must be translated, not copied.

### user-insights/AGENTS.md

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/AGENTS.md]]`
- Purpose: Project-level Codex map for the app. A "Start here" list of real commands (`pnpm run dev|typecheck|build`), a "Choose the matching skill" rule (use `blossomview-card-builder` for cards/charts), a repository map (who owns state/data/styles), code/component conventions (React + strict TS, `@/` alias, reuse primitives/recharts/lucide/tokens), UI validation (specific widths 390/720/721/768/1440, overflow check, console errors), PR visual-evidence rules, PR title format, and scope rules (no ExecPlan unless asked).
- Key exports: None.
- Dependencies: Points to `skills/blossomview-card-builder/SKILL.md` and `references/dashboard-card-patterns.md`.
- Learner-relevant: A rich, realistic `AGENTS.md` that separates policy (this file) from repeatable detail (the skill) — the central example of how instructions steer Codex in an existing repo.

### user-insights/package.json

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/package.json]]`
- Purpose: Project manifest (`name: blossomview`). Scripts: `dev`, `build` (`tsc -b && vite build`), `preview`, `typecheck` (`tsc -b --pretty`). Dependencies include React 19, `cobe` (globe), `recharts`, `lucide-react`, Radix avatar/separator/slot/tabs, `class-variance-authority`, `clsx`, `tailwind-merge`, Tailwind v4 + `@tailwindcss/vite`. Dev: TypeScript 5.9, Vite 7, `@vitejs/plugin-react`.
- Key exports: npm scripts and dependency list.
- Dependencies: All app source.
- Learner-relevant: `AGENTS.md` says "inspect `package.json` before claiming a command" — this is the authoritative list of available commands/libraries (and notably has no test script).

### user-insights/components.json

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/components.json]]`
- Purpose: shadcn/ui config: `style: new-york`, `tsx: true`, Tailwind CSS at `src/index.css`, `baseColor: neutral`, CSS variables on, `iconLibrary: lucide`, and the `@/` path aliases (`components`, `utils`, `ui`, `lib`, `hooks`).
- Key exports: shadcn schema config.
- Dependencies: `src/index.css`, `@/lib/utils`.
- Learner-relevant: Shows the design-system provenance (shadcn "new-york") and the alias scheme that the whole app follows.

### user-insights/vite.config.ts

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/vite.config.ts]]`
- Purpose: Vite config: React + Tailwind plugins, `@` → `./src` alias, dev server on `0.0.0.0:5173`, and `manualChunks` splitting vendor code into `charts` (recharts/d3), `globe` (cobe), and `icons` (lucide).
- Key exports: `defineConfig` default export.
- Dependencies: `node:path`, `@tailwindcss/vite`, `@vitejs/plugin-react`, `vite`.
- Learner-relevant: Shows production-minded bundling (manual chunking of heavy libraries) alongside the alias that components import through.

### user-insights/index.html

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/index.html]]`
- Purpose: App shell: lang, viewport, theme-color `#0a0b12`, meta description, title "BlossomView — Your world, in view.", preconnect + Google Fonts (DM Sans, Space Grotesk), `#root`, and `/src/main.tsx` module script.
- Key exports: None.
- Dependencies: Google Fonts; `src/main.tsx`.
- Learner-relevant: Shows the type choices the design system relies on (sans = DM Sans, display = Space Grotesk) and the dark theme color.

### user-insights/tsconfig.json, tsconfig.app.json, tsconfig.node.json

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/tsconfig.json]]`
- Purpose: Project references setup. `tsconfig.app.json` targets ES2022, `jsx: react-jsx`, strict, `noUnusedLocals`/`noUnusedParameters`, bundler resolution, and `@/*` paths, including `src`. `tsconfig.node.json` covers `vite.config.ts` with `types: ["node"]`.
- Key exports: Compiler options.
- Dependencies: TypeScript.
- Learner-relevant: Evidence of the "strict TypeScript" contract claimed in `AGENTS.md`.

### user-insights/src/main.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/main.tsx]]`
- Purpose: Entry point. Finds `#root` (throws a branded error if missing), renders `<App />` inside `StrictMode`, imports `@/index.css`.
- Key exports: None (side-effecting entry).
- Dependencies: `react`, `react-dom/client`, `@/App`, `@/index.css`.
- Learner-relevant: Standard React 19 Vite bootstrap with a defensive root check.

### user-insights/src/App.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/App.tsx]]`
- Purpose: Dashboard composition and single source of region/period state. Holds `region` (`Everywhere`) and `period` (`28d`) via `useState`, derives `selectedCities = useMemo(() => getCities(region), [region])`, and lays out `TopNav`, heading, `GlobeSection`, `.analytics-grid` (`AudienceChart`, `GeographicTable`), `InsightsRail`, and footer.
- Key exports: `App` (default).
- Dependencies: `@/components/*`, `@/data/insights` (`cities`, `getCities`, types).
- Learner-relevant: The state-ownership pattern the skill depends on — filtered `cities` flow down to every card so the whole dashboard follows the selected region.

### user-insights/src/data/insights.ts

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/data/insights.ts]]`
- Purpose: The app's typed data layer. Defines `Region`, `Period`, `UserCity`; exports `regions`, the seeded `cities` array (29 cities with lat/lng/users/active/growth), `activitySeed` (live activity events), `liveData` (32-point live series), and helpers `getCities(region)`, `getCountryTotals(selectedCities)` (aggregates + averages growth, sorts by users), `getGrowthData(period, selectedCities)` (deterministic sine/cosine synthetic series for 7d/28d/90d).
- Key exports: `Region`, `Period`, `UserCity`, `regions`, `cities`, `activitySeed`, `liveData`, `getCities`, `getCountryTotals`, `getGrowthData`.
- Dependencies: None (pure TypeScript).
- Learner-relevant: Demonstrates the "authoritative data contract" pattern the skill points to — region-sensitive components must derive from these typed helpers, not invent data.

### user-insights/src/lib/utils.ts

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/lib/utils.ts]]`
- Purpose: Shared utilities: `cn(...inputs)` merging `clsx` + `tailwind-merge`; `compactNumber(value, digits=1)` via `Intl.NumberFormat` compact notation; `preciseNumber(value)` full `en-US` formatting.
- Key exports: `cn`, `compactNumber`, `preciseNumber`.
- Dependencies: `clsx`, `tailwind-merge`.
- Learner-relevant: The formatting contract referenced throughout the skill (compact for headlines, precise for exact live counts) and the standard shadcn `cn` helper.

### user-insights/src/index.css

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/index.css]]`
- Purpose: The design system in CSS (974 lines). Tailwind v4 `@import` + `@theme inline` mapping `--color-*` to custom properties; `:root` dark tokens (`--background #0a0b12`, `--primary #ad96fb`, `--mint #86e7c1`, `--chart-1..5`, etc.); base styles; and class definitions for topbar, dashboard, globe, insights rail (`rail-*`, `country-*`, `distribution-*`, `activity-*`), analytics cards (`analytics-*`, `chart-*`, `geography-*`). Responsive breakpoints at `min-width:1600px` and `max-width:1000px|720px|440px`, plus a `prefers-reduced-motion` block.
- Key exports: CSS custom properties and utility/component classes (no JS exports).
- Dependencies: Tailwind v4.
- Learner-relevant: Shows how a design system lives in code as tokens + semantic classes, and the exact classes the skill tells Codex to reuse (`analytics-card`, `--primary`, `--mint`, etc.).

### user-insights/src/components/globe-section.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/globe-section.tsx]]`
- Purpose: The globe hero. Provides the region filter buttons (`regions.map`, `aria-pressed`, active class), renders `<WorldGlobe cities={cities} />`, and shows summary metrics (worldwide total, active now, city count, average growth) derived from the filtered `cities`.
- Key exports: `GlobeSection`.
- Dependencies: `lucide-react`, `@/components/world-globe`, `@/data/insights`, `@/lib/utils` (`cn`, `compactNumber`).
- Learner-relevant: Demonstrates deriving all displayed numbers from the passed-in filtered cities and wiring accessible region controls.

### user-insights/src/components/world-globe.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/world-globe.tsx]]`
- Purpose: Interactive WebGL globe via `cobe`. Builds `markers` from `cities` (lat/lng, size scaled by `active`, cycling colors), initializes the globe in a `useEffect` with DPR clamping, `ResizeObserver`, requestAnimationFrame rotation, `prefers-reduced-motion` respect, try/catch fallback if WebGL is unavailable, and pointer drag-to-rotate plus a pause/play control.
- Key exports: `WorldGlobe`.
- Dependencies: `cobe`, `lucide-react`, `react`, `@/components/ui/button`, `@/data/insights`.
- Learner-relevant: A nontrivial imperative-canvas integration inside React — lifecycle cleanup, responsive sizing, accessibility fallback, and reduced-motion handling.

### user-insights/src/components/audience-chart.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/audience-chart.tsx]]`
- Purpose: Full-size analytics card "Audience growth". Uses `getGrowthData(period, cities)`, Recharts `AreaChart` with gradient defs for this/previous period, period `Tabs`, a headline with compact number and growth badge, and a legend. `isAnimationActive={false}` for stable rendering.
- Key exports: `AudienceChart`.
- Dependencies: `lucide-react`, `recharts`, `@/components/ui/card`, `@/components/ui/chart`, `@/components/ui/tabs`, `@/data/insights`, `@/lib/utils`.
- Learner-relevant: The reference implementation for an accessible, token-styled Recharts card using the local `ChartContainer`/`ChartTooltip` wrappers.

### user-insights/src/components/geographic-table.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/geographic-table.tsx]]`
- Purpose: Analytics card "Geographic users". Gets top 6 countries via `getCountryTotals(cities).slice(0,6)` and renders a semantic `<table>` (scope="col") with flag, country, compact users, and growth.
- Key exports: `GeographicTable`.
- Dependencies: `lucide-react`, `@/components/ui/card`, `@/data/insights`, `@/lib/utils`.
- Learner-relevant: The reference analytics-table pattern, including typed props and accessible table markup.

### user-insights/src/components/insights-rail.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/insights-rail.tsx]]`
- Purpose: Right-hand live rail. Sections: "Active right now" (precise count + `liveData` area chart), "Top countries" (country rows with meters), "Regional distribution" (clickable rows with dots/fills toggling region), "Recent activity" from `activitySeed`, and a ghost "Explore all activity" button that smooth-scrolls to `#geographic-users`. Receives both filtered `cities` and unfiltered `allCities`.
- Key exports: `InsightsRail`.
- Dependencies: `lucide-react`, `recharts`, `@/components/ui/{button,card,chart,separator}`, `@/data/insights`, `@/lib/utils`.
- Learner-relevant: The compact-sidebar reference pattern, including when to use filtered vs global data and DOM scroll-to-section interaction.

### user-insights/src/components/top-nav.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/top-nav.tsx]]`
- Purpose: Top navigation bar. Brand link (BlossomMark + wordmark), search/notification ghost icon buttons with aria-labels, a Cmd-K hint, and an account button with `Avatar`/`AvatarFallback` "KV".
- Key exports: `TopNav`.
- Dependencies: `lucide-react`, `@/components/blossom-mark`, `@/components/ui/{avatar,button}`.
- Learner-relevant: Small composition example using the UI primitives with accessibility labels and title attributes.

### user-insights/src/components/blossom-mark.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/blossom-mark.tsx]]`
- Purpose: The brand logo as an inline SVG (four petals + two mint dots), using `currentColor` and `var(--background)`/`var(--mint)`.
- Key exports: `BlossomMark`.
- Dependencies: `@/lib/utils` (`cn`).
- Learner-relevant: Shows a small token-aware SVG asset that adapts to theme colors.

### user-insights/src/components/ui/card.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/ui/card.tsx]]`
- Purpose: Local Card primitives: `Card` (renders a `<section>` with `rounded-xl border bg-card`), `CardHeader`, `CardTitle` (h2), `CardDescription` (p), `CardContent`, `CardFooter`.
- Key exports: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- Dependencies: `react`, `@/lib/utils`.
- Learner-relevant: The simplest example of adapting shadcn primitives to semantic elements; the skill mandates reusing these rather than adding a new component system.

### user-insights/src/components/ui/chart.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/ui/chart.tsx]]`
- Purpose: Recharts wrapper. Defines `ChartConfig` type, `ChartContainer` (injects `--color-*` variables from config into style, wraps `ResponsiveContainer`, applies axis/legend styling), re-exports Recharts `Tooltip` as `ChartTooltip`, and `ChartTooltipContent` (custom tooltip reading config labels/colors, precise number formatting).
- Key exports: `ChartConfig`, `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`.
- Dependencies: `react`, `recharts`, `@/lib/utils`.
- Learner-relevant: A compact example of a chart design system: config-driven colors/labels, consistent tooltips, and token theming.

### user-insights/src/components/ui/button.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/ui/button.tsx]]`
- Purpose: Button with CVA variants (`default`, `secondary`, `outline`, `ghost`) and sizes (`default`, `sm`, `icon`), Radix `Slot` support via `asChild`, focus-visible rings, and icon sizing rules.
- Key exports: `buttonVariants`, `ButtonProps`, `Button`.
- Dependencies: `@radix-ui/react-slot`, `class-variance-authority`, `react`, `@/lib/utils`.
- Learner-relevant: Standard shadcn/CVA variant pattern; shows the token-based styling (`bg-primary`, `border-border`, `ring-ring`).

### user-insights/src/components/ui/tabs.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/ui/tabs.tsx]]`
- Purpose: Radix Tabs wrappers: `Tabs`, `TabsList`, `TabsTrigger` (active-state styling via `data-[state=active]`), `TabsContent`.
- Key exports: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`.
- Dependencies: `@radix-ui/react-tabs`, `react`, `@/lib/utils`.
- Learner-relevant: Shows wrapping an accessible headless primitive and styling its data-state attributes; used by the period selector.

### user-insights/src/components/ui/avatar.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/ui/avatar.tsx]]`
- Purpose: Radix Avatar wrappers: `Avatar`, `AvatarImage`, `AvatarFallback`.
- Key exports: `Avatar`, `AvatarImage`, `AvatarFallback`.
- Dependencies: `@radix-ui/react-avatar`, `react`, `@/lib/utils`.
- Learner-relevant: Another headless-primitive wrapper example.

### user-insights/src/components/ui/separator.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/components/ui/separator.tsx]]`
- Purpose: Radix Separator wrapper with horizontal/vertical orientation and `decorative` default.
- Key exports: `Separator`.
- Dependencies: `@radix-ui/react-separator`, `react`, `@/lib/utils`.
- Learner-relevant: Minimal accessible primitive wrapper used between rail sections.

### user-insights/skills/blossomview-card-builder/SKILL.md

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/skills/blossomview-card-builder/SKILL.md]]`
- Purpose: Project-local skill for adding BlossomView cards. Workflow: start with the existing system (read App/card/example cards/data/utils/CSS), choose card type (analytics-grid card vs compact rail insight vs chart), preserve the data contract (accept filtered `cities`, derive from typed helpers, guard empties, no invented endpoints/state), match BlossomView (`@/` alias, semantic classes, lucide `aria-hidden`, globe dominant, unique `id`, responsive breakpoints), and verify (`pnpm typecheck`/`build`, browser at breakpoints, Europe filter check, overflow/console checks). Ends with example invocation requests.
- Key exports: YAML frontmatter `name: blossomview-card-builder`, `description: ...`.
- Dependencies: `references/dashboard-card-patterns.md`, `assets/active-engagement-card.tsx`, the app source, `user-insights/AGENTS.md`.
- Learner-relevant: The clearest example of a "codebase-aware" skill: it names real files, real helpers, real CSS classes, and real validation steps so Codex builds like a team member rather than from scratch.

### user-insights/skills/blossomview-card-builder/references/dashboard-card-patterns.md

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/skills/blossomview-card-builder/references/dashboard-card-patterns.md]]`
- Purpose: The skill's detailed reference: project map, data contract (with `useState`/`getCities` snippet), full-size analytics card pattern (Card primitive composition), chart pattern (`ChartContainer` + Recharts bar config, `satisfies ChartConfig`), compact sidebar pattern, and the visual/interaction contract (tokens, formatting, breakpoints, overflow check, `package.json` inspection).
- Key exports: None (prose + code snippets).
- Dependencies: Referenced by `SKILL.md`; mirrors app files.
- Learner-relevant: Demonstrates progressive disclosure in skill design — `SKILL.md` stays short and points to a `references/` file with the deep, code-level contracts.

### user-insights/skills/blossomview-card-builder/assets/active-engagement-card.tsx

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/skills/blossomview-card-builder/assets/active-engagement-card.tsx]]`
- Purpose: A complete, working example card. `ActiveEngagementCard({ cities })` derives totals/active share, sorts countries by `active` (top 6), and renders the Card primitives plus a token-styled Recharts bar chart (`accessibilityLayer`, `isAnimationActive={false}`, aria-label).
- Key exports: `ActiveEngagementCard`.
- Dependencies: `lucide-react`, `recharts`, `@/components/ui/{card,chart}`, `@/data/insights`, `@/lib/utils`.
- Learner-relevant: A ready-to-adapt implementation asset showing the exact conventions the skill describes; the skill stresses renaming/adapting it rather than mounting it unchanged.

### user-insights/skills/blossomview-card-builder/agents/openai.yaml

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/skills/blossomview-card-builder/agents/openai.yaml]]`
- Purpose: Codex interface metadata for the skill: `display_name: "BlossomView Card Builder"`, short description, and `default_prompt` invoking `$blossomview-card-builder`.
- Key exports: `interface.display_name`, `interface.short_description`, `interface.default_prompt`.
- Dependencies: Sibling `SKILL.md`.
- Learner-relevant: Confirms the same skill-manifest convention at the project level as at the repo level.

### user-insights/.gitignore, src/vite-env.d.ts

- Locator: `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/.gitignore]]`, `[[sources/cordex-web/20261004/codex/master-dev-workshop/user-insights/src/vite-env.d.ts]]`
- Purpose: Standard ignores (`node_modules`, `dist`, `*.tsbuildinfo`, `.DS_Store`) and the Vite client type reference.
- Key exports: None.
- Dependencies: None.
- Learner-relevant: Small hygiene files; the type reference makes `import.meta.env` typed.

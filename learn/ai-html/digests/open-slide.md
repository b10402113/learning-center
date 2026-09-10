---
source: open-slide
source_type: codebase
source_lines: 87147
language: typescript
file_count: 581
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — open-slide

## Overview (L1)

- **open-slide** — An agent-native React slide framework. Slides are arbitrary React components rendered on a fixed 1920×1080 canvas; a coding agent writes pages in `slides/<id>/index.tsx`, and the runtime handles the canvas, scaling, navigation, present mode, inspector, asset management, and static export. Ships as a pnpm + Turbo monorepo with three publishable units: the core runtime, the CLI scaffolder, and a demo workspace.

- **packages/core** — `@open-slide/core` (v2.0.0-beta.1): the entire runtime — a Vite-powered React SPA with a slide viewer, presenter mode, inspector/ commenting system, design panel, theme gallery, folder manager, command menu, and export pipeline (HTML, PDF, PPTX). Also contains the `open-slide dev/build/preview/sync:skills` CLI and five bundled agent skills (slide-authoring, create-slide, create-theme, apply-comments, current-slide).

- **packages/cli** — `@open-slide/cli` (v2.0.0-beta.1): `npx @open-slide/cli init` scaffolder. Copies a project template (with preconfigured agent skills, Vite/React/tsconfig hidden inside core, and deploy configs for Vercel/Netlify) into the user's target directory, symlinks `.claude/skills` from `.agents/skills`, and runs the package manager install.

- **apps/demo** — Private dogfood workspace. Consumes `@open-slide/core` via `workspace:*`. Contains ~20 example slides (claude-code-intro, ssh-explained, vercel-ai-sdk, etc.), 5 theme definitions (aurora, bright-sans, minecraft, replit, sticker-pop), and `.claude/skills/` mirrors of the core skills for live authoring during development.

- **apps/web** — Private Next.js marketing site (v16) using Fumadocs for MDX documentation. Contains a landing page with interactive components (hero, live-demo, prompt-composer, inspector demo, anatomy diagram) and a docs section covering getting-started, CLI, core-features, primitives, skills, and migration guides.

## Structure (L2)

### Root Configuration

- Locator: `[[sources/ai-html/20260910/open-slide/]]`
- Purpose: Monorepo root. Defines workspace packages (`apps/*`, `packages/*`, `packages/core/e2e/fixture`), shared tooling (Biome 2.5.7 for formatting/linting, Turbo 2.10 for task orchestration, Vitest 4.1 for testing, Changesets for versioning), and top-level scripts (`pnpm dev`, `pnpm build`, `pnpm check`, `pnpm test`).
- Key exports: N/A (root config only)
- Dependencies: Turbo, Biome, Changesets, Vitest
- Learner-relevant: pnpm workspace + Turborepo monorepo pattern; Biome as a unified linter/formatter replacing ESLint+Prettier

### packages/core/src/app/ — Slide Viewer SPA

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/]]`
- Purpose: The browser-side React application. Entry is `main.tsx` → `app.tsx` (BrowserRouter with routes). The SPA renders on Vite's dev server or as a static build.
- Key exports: `App` (root component), route components (`Slide`, `Home`, `Presenter`, `AssetsPage`, `ThemesGalleryPage`)
- Dependencies: react-router-dom, next-themes, lucide-react, sonner, virtual:open-slide/config
- Learner-relevant: How a framework ships its UI as an embeddable SPA with virtual module injection; the "app inside a library" pattern

### packages/core/src/app/routes/slide.tsx — Slide Viewer

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/routes/slide.tsx]]`
- Purpose: The main slide editing/viewing route (~1241 lines). Renders the toolbar, thumbnail rail (resizable, drag-to-reorder), slide canvas with transition layer, inspector overlay, design panel, overview grid, command menu, and notes drawer. Handles keyboard navigation (arrow keys, F for fullscreen, P for presenter, O for overview, D for design panel), page duplication/deletion, and export dispatch (HTML, PDF, PPTX). Communicates selection state to the dev server via `import.meta.hot.send('open-slide:current', ...)`.
- Key exports: `Slide` (route component)
- Dependencies: inspector/*, style-panel/*, present/*, command/*, export-html, export-pdf, export-pptx, folders, keys, use-agent-socket
- Learner-relevant: Full-featured slide editor component — toolbar layout, resizable sidebar, keyboard shortcut handling, optimistic UI for page reorder/duplicate/delete, toast-driven export progress

### packages/core/src/app/routes/home.tsx — Slide Browser

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/routes/home.tsx]]`
- Purpose: The home/dashboard route showing all slides as a grid of cards with thumbnail previews. Supports folder filtering (All / Draft / per-folder), search, sort (by created date or title), slide rename/duplicate/move-to-folder/delete via dialogs, and drag-and-drop reordering into folders.
- Key exports: `Home` (route component)
- Dependencies: sidebar/folder-item, slide-canvas, folders, slides, page-context, sdk
- Learner-relevant: Slide management UI — folder organization, drag-and-drop, search/sort, card-based grid layout

### packages/core/src/app/routes/presenter.tsx — Presenter Mode

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/routes/presenter.tsx]]`
- Purpose: A separate window for the presenter. Shows the current slide (now-showing), next slide preview, speaker notes with adjustable font size, elapsed timer, deck switcher dialog, and blackout/whiteout controls. Communicates with the projection window via `BroadcastChannel` (usePresenterChannel).
- Key exports: `Presenter` (route component)
- Dependencies: present/use-presenter-channel, slide-canvas, step-context, slide-preload-layer
- Learner-relevant: Multi-window presenter pattern using BroadcastChannel; step-aware preview; timer and blackout features

### packages/core/src/app/components/player.tsx — Presentation Player

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/components/player.tsx]]`
- Purpose: The fullscreen/windowed presentation player (~472 lines). Handles keyboard/touch/wheel navigation, step-aware advance/retreat, control bar (auto-hide on idle), laser pointer, progress bar, jump input, blackout overlay, help overlay, and touch swipe. Manages presenter channel communication for sync with the presenter window.
- Key exports: `Player`, `openPresenterWindow`
- Dependencies: present/* (control-bar, help-overlay, jump-input, laser-pointer, progress-bar, blackout-overlay, use-presenter-channel, use-idle, use-touch-swipe, use-pointer-near-bottom), slide-canvas, slide-transition-layer, step-context, overview-grid
- Learner-relevant: Fullscreen presentation player with step-aware navigation, multi-input support (keyboard, touch, wheel), and presenter sync

### packages/core/src/app/components/inspector/ — In-Browser Inspector

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/components/inspector/]]`
- Purpose: The in-browser inspection system. Click any element to attach a comment (persisted as `@slide-comment` markers in source via the `apply-comments` skill). Includes: `inspect-overlay.tsx` (click-to-select), `comment-widget.tsx` (comment input), `inspector-panel.tsx` (comments list), `inline-text-editor.tsx` (direct text editing), `save-bar.tsx` (save/revert), `asset-picker-dialog.tsx` (image replacement), `image-crop-dialog.tsx` (crop tool).
- Key exports: `InspectorProvider`, `InspectOverlay`, `CommentWidget`, `InspectorPanel`, `InlineEditLayer`, `SaveBar`
- Dependencies: inspector/* (fiber, pick-target, use-comments, use-editor, use-notes), assets, text-diff
- Learner-relevant: The comment-driven editing loop — inspect → comment → /apply-comments → source modification; AST-based source rewriting

### packages/core/src/app/components/ — UI Component Library

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/components/]]`
- Purpose: 25 component directories/files forming the app's UI. Includes shadcn-generated primitives in `ui/` (button, dialog, dropdown-menu, tabs, tooltip, sonner), custom layout components (`slide-canvas.tsx` for the 1920×1080 viewport, `thumbnail-rail.tsx` for page thumbnails, `overview-grid.tsx` for grid overview), and feature components (command menu, sidebar, style panel, themes gallery, notes drawer, export progress toasts, language toggle, theme toggle).
- Key exports: `SlideCanvas`, `ThumbnailRail`, `OverviewGrid`, `NotesDrawer`, `SlideCommandMenu`, `DesignPanel`, `Sidebar`
- Dependencies: ui/*, lib/*, dnd-kit (drag and drop), cmdk (command palette), lucide-react
- Learner-relevant: Component architecture of a full-featured slide editor — canvas rendering, thumbnail grid, command palette, design panel

### packages/core/src/app/lib/ — Core Utilities and Hooks

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/app/lib/]]`
- Purpose: 36 files containing the framework's core abstractions. Key modules: `sdk.ts` (SlideModule/Page/SlideMeta types, CANVAS_WIDTH/HEIGHT constants), `design.ts` (DesignSystem type and CSS var generation), `slides.ts` (virtual module re-exports), `transition.ts` (SlideTransition/MorphTransition types), `step-context.tsx` (Step/Steps components for incremental reveals), `page-context.tsx` (page index/total provider), `export-html.ts` (static HTML export with asset inlining), `export-pdf.ts` (print-based PDF export), `export-pptx.ts` (image-per-slide PPTX export), `folders.ts` (folder manifest CRUD), `use-agent-socket.ts` (Vite HMR connection status), `text-diff.ts`, `inspector/` (Fiber-based DOM inspection, inline text editing, comment resolution, notes persistence).
- Key exports: `SlideModule`, `Page`, `DesignSystem`, `designToCssVars`, `defaultDesign`, `useSlidePageNumber`, `Step`, `Steps`, `useIsActivePage`, `CANVAS_WIDTH`, `CANVAS_HEIGHT`, `exportSlideAsHtml`, `exportSlideAsPdf`
- Dependencies: react, react-dom, html-to-image, fflate, use-sync-external-store
- Learner-relevant: Core abstractions — the SlideModule contract (default pages + meta + design + notes + transition), design system as CSS variables, step-based reveals, export pipelines

### packages/core/src/vite/ — Vite Plugin System

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/vite/]]`
- Purpose: 15 files forming the Vite plugin architecture. `config.ts` assembles the full Vite inline config (React, Tailwind, 9 custom plugins). `open-slide-plugin.ts` is the core plugin: resolves 3 virtual modules (`virtual:open-slide/slides`, `virtual:open-slide/config`, `virtual:open-slide/folders`), scans `slides/*/index.tsx` to generate the slides registry, watches for new/deleted slides, and handles HMR. `api-plugin.ts` registers all dev-server API routes. Other plugins: `themes-plugin.ts` (theme markdown → virtual module), `design-plugin.ts` (read/write `design` const in slide files), `notes-plugin.ts` (speaker notes persistence), `current-plugin.ts` (tracks current slide/page), `loc-tags-plugin.ts` (source location tags for inspector).
- Key exports: `createViteConfig`
- Dependencies: vite, @tailwindcss/vite, @vitejs/plugin-react, fast-glob
- Learner-relevant: Virtual module pattern for code generation; Vite plugin architecture with configureServer hooks; HMR for slide content changes

### packages/core/src/vite/routes/ — Dev Server API

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/vite/routes/]]`
- Purpose: 11 files implementing the dev-server HTTP API. `edit.ts` (CRUD operations on slide source: rename, reorder pages, duplicate/delete pages, apply comment edits), `comments.ts` (parse/write `@slide-comment` markers), `slides.ts` (slide list, create, duplicate, delete), `assets.ts` (upload, delete, list assets), `svgl.ts` (proxy to svgl.app for logo search), `folders.ts` (folder CRUD, slide-to-folder assignment), `update.ts` (in-app update check), `restart.ts` (server restart with exit code signaling), `watchers.ts` (file system watchers for HMR), `context.ts` (shared request context).
- Key exports: `registerEditRoutes`, `registerCommentRoutes`, `registerSlideRoutes`, `registerAssetRoutes`, `registerSvglRoutes`, `registerFolderRoutes`
- Dependencies: editing/*, files/*, http/request-guard
- Learner-relevant: Dev-server as an API backend for the in-browser editor; Babel AST-based source manipulation via HTTP endpoints

### packages/core/src/editing/ — Source Manipulation Engine

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/editing/]]`
- Purpose: 9 files (with tests) for AST-based source code manipulation. `babel-walk.ts` (parse TSX with Babel, find JSX ancestors/containers), `comments.ts` (parse/insert/delete `@slide-comment` markers as JSX comments with base64-encoded payloads), `edit-ops.ts` (~1223 lines: splice-based source rewriting — set-style, set-text, set-attr-asset, replace-placeholder-with-image, set-text-range-style), `slide-ops.ts` (~586 lines: slide name validation, meta title reading via AST, slide creation/deletion/rename/duplication via file operations), `revert-asset.ts` (replace asset references on revert).
- Key exports: `parseMarkers`, `findInsertion`, `applySplices`, `SLIDE_ID_RE`, `readMetaTitleInSource`, `EditOp`, `Comment`, `InsertionPlan`
- Dependencies: @babel/parser, @babel/types, files/short-id
- Learner-relevant: AST-based code editing — how the inspector translates visual comments into source-level splices; Babel for safe TSX manipulation

### packages/core/src/files/ — File System Utilities

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/files/]]`
- Purpose: 5 files (with tests) for file operations. `assets.ts` (asset upload with auto-rename, delete, list), `folders.ts` (folder manifest CRUD — read/write `.folders.json`), `short-id.ts` (generate short IDs for slides/comments).
- Key exports: `uploadWithAutoRename`, `foldersManifestPath`, `readManifest`, `writeManifest`, `shortId`
- Dependencies: node:fs, fast-glob
- Learner-relevant: File system abstraction layer for slides, assets, and folder manifests

### packages/core/src/cli/ — CLI Entry Points

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/cli/]]`
- Purpose: 11 files (with tests) for the `open-slide` CLI. `bin.ts` (entry point), `run.ts` (Commander-based subcommand router: dev, build, preview, sync:skills), `dev.ts` (~144 lines: supervised dev server with child process management, port forwarding, restart-on-update), `build.ts` (Vite production build), `preview.ts` (Vite preview server), `sync.ts` (sync built-in skills from core to workspace), `preflight.ts` (assert Vite resolves to core), `ui.ts` (terminal formatting: header, URLs, error display).
- Key exports: `run`, `dev`, `build`, `preview`, `syncSkills`
- Dependencies: commander, chalk, vite, ../vite/config, ../cli/sync
- Learner-relevant: CLI architecture — supervised dev server pattern (parent forks child, restarts on update via exit code), Commander subcommand routing

### packages/core/src/locale/ — Internationalization

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/src/locale/]]`
- Purpose: 7 files for UI localization. `types.ts` (Locale/Plural types), `format.ts` (string interpolation with named placeholders), `en.ts`, `ja.ts`, `zh-cn.ts`, `zh-tw.ts` (translations for English, Japanese, Simplified Chinese, Traditional Chinese).
- Key exports: `Locale`, `Plural`, `format`
- Dependencies: N/A (standalone)
- Learner-relevant: i18n pattern — typed locale objects with plural support, runtime language switching

### packages/core/skills/ — Agent Skills

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/skills/]]`
- Purpose: 5 bundled agent skills shipped with `@open-slide/core`. `slide-authoring/` (~373 lines: technical reference for writing slides — file contract, 1920×1080 canvas, type scale, layout, palette, assets, webfonts, stepped reveals, transitions, morph, speaker notes; references/ subdirectory with detailed per-primitive docs), `create-slide/` (~94 lines: workflow for drafting a new deck — theme selection, four scoping questions, structure planning), `create-theme/` (theme creation workflow), `apply-comments/` (process inspector markers into source edits), `current-slide/` (resolve deictic references like "this page").
- Key exports: SKILL.md files (agent-facing instructions)
- Dependencies: Referenced by the Vite CLI's `sync:skills` command
- Learner-relevant: Agent skill pattern — how framework authors ship reusable agent instructions as npm packages; the slide-authoring reference as a model for comprehensive AI-authored content guidelines

### packages/cli/ — Scaffolding CLI

- Locator: `[[sources/ai-html/20260910/open-slide/packages/cli/]]`
- Purpose: `@open-slide/cli` — the `npx @open-slide/cli init` scaffolder. `src/cli.ts` (entry), `src/index.ts` (Commander router), `src/init.ts` (~133 lines: scaffold function — copy template, materialize symlinks for `.claude/skills` from `.agents/skills`, set package name/version, write `.gitignore`), `src/package-manager.ts` (detect pnpm/npm/yarn/bun), `src/git.ts` (git init). `template/` contains the full project skeleton (package.json with `@open-slide/core` dep, open-slide.config.ts, AGENTS.md/CLAUDE.md, .claude/skills/, slides/, themes/, assets/, deploy configs for Vercel/Netlify). `scripts/sync-template-skills.mjs` copies skills from core into the template before build.
- Key exports: `scaffold`, `ScaffoldOptions`, `PackageManager`
- Dependencies: @clack/prompts, chalk, commander
- Learner-relevant: CLI scaffolding pattern — template copying with version stamping, cross-agent skill materialization (`.agents/skills/` → `.claude/skills/`)

### apps/demo/ — Example Workspace

- Locator: `[[sources/ai-html/20260910/open-slide/apps/demo/]]`
- Purpose: Private workspace consuming `@open-slide/core` via `workspace:*`. Contains ~20 example slide decks under `slides/` (claude-code-intro, ssh-explained, vercel-ai-sdk, nextjs-ppr-cache, harness-engineering, open-slide-anatomy, open-slide-launch, etc.), 5 theme definitions under `themes/` (aurora, bright-sans, minecraft, replit, sticker-pop — each with a `.md` spec and `.demo.tsx` live example), and `.claude/skills/` (mirrored from core for live authoring). `open-slide.config.ts` is an empty config (defaults only). Scripts: `open-slide dev`, `open-slide build`, `open-slide preview`.
- Key exports: N/A (private workspace)
- Dependencies: @open-slide/core (workspace:*), react, react-dom
- Learner-relevant: How a real slide workspace is structured — one folder per deck, theme specs, agent skills for authoring

### apps/web/ — Marketing Site

- Locator: `[[sources/ai-html/20260910/open-slide/apps/web/]]`
- Purpose: Private Next.js 16 marketing site using Fumadocs for MDX documentation. `app/layout.tsx` (Geist fonts, metadata, RootProvider), `app/(home)/page.tsx` (landing page), `app/docs/[[...slug]]/` (docs catch-all route). `components/landing/` (~24 components: hero, live-demo, prompt-composer, inspector demo, anatomy diagram, how-it-works, FAQ, footer, nav, frame, etc.). `content/docs/` contains MDX documentation organized into: getting-started, CLI, core-feature, primitive, reference, skills sections. `lib/source.ts` (Fumadocs source config), `lib/shared.ts` (app name, git config, site URL). Also serves LLM-friendly content at `/llms.txt`, `/llms-full.txt`, `/llms.mdx/`.
- Key exports: N/A (private website)
- Dependencies: next 16, fumadocs-core/ui/mdx, motion, geist, posthog-js, lucide-react
- Learner-relevant: Next.js + Fumadocs documentation site pattern; LLM-friendly content endpoints; marketing page component architecture

### packages/core/e2e/ — End-to-End Tests

- Locator: `[[sources/ai-html/20260910/open-slide/packages/core/e2e/]]`
- Purpose: Playwright e2e test suite (~14 spec files). Tests cover: viewer, home, present mode, presenter, inspector, design panel, themes, assets, build output, CLI commands, HMR, command menu, dev API. `fixture/` is a minimal open-slide workspace used as the test harness. `start-dev-server.mjs` boots the dev server for tests.
- Key exports: N/A (test-only)
- Dependencies: @playwright/test, @open-slide/core
- Learner-relevant: E2e testing pattern for a Vite-based framework — fixture workspace, Playwright against dev server

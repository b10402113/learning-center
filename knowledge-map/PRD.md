# PRD — Knowledge Nebula（知識星雲）

| | |
| --- | --- |
| Product | 知識星雲 — Knowledge Nebula |
| Project dir | `knowledge-map/` |
| Version | 0.3.0 (draft) |
| Status | Draft |
| Last updated | 2026-08-15 |

---

## 1. Project Overview

Knowledge Nebula is a single-page interactive visualization of a personal
learning system. The curriculum for each subject — its tiered lesson **nodes**,
reusable concept **elements**, and the relationships between them — is rendered in
two switchable views on a dark star-field:

- **星雲 (Nebula)** — the main view. A force-directed graph (`force-graph`
  engine): nodes and concept elements are graph nodes that repel, attract and settle
  into an Obsidian-like constellation; concept elements are pulled toward the
  nodes that teach them.
- **Roadmap (路線圖)** — the structural view. Each tier is a row, each lesson is a
  card, and the edges between lessons are drawn as navigable connections. Concept
  elements scatter irregularly around their tier's card row.

The product turns a plain folder of markdown lessons into a "cockpit" that the
learner can survey at a glance, zoom into, and read lessons from, while the
visualization itself is **generated from the same markdown sources** that the
learning pipeline already produces (`learn/<subject>/`), so the map can never
drift from the actual curriculum.

It is built as a static Vite app (React 19 + TypeScript + Tailwind v4) with zero
backend: all data ships in a generated `graph.json`, and personal state (manual
progress) lives in `localStorage`.

### Problem statement

A curriculum that lives as dozens of markdown files is hard to *see*:

- The learner cannot tell, at a glance, how far through a subject they are,
  what comes next, or which lessons share concepts.
- Text indexes (`ROADMAP.md`) list nodes but cannot convey tier structure,
  ordering, and cross-links spatially.
- There is no natural way to mark, share, or hand a visitor a specific lesson.

Knowledge Nebula answers this with one artifact: a shareable, pan/zoom map of the
whole course that doubles as a reading interface and a progress tracker.

### High-level architecture

```text
learn/<subject>/*.md(x)  ──scripts/generate-data.mjs──▶  src/data/graph.json
                                                            │
                    ┌───────────────┬──────────────────────┘
               App.tsx           (subject switch, hash routing, progress)
                │  │
        RoadMap.tsx          DetailPane.tsx
    (SVG map, camera, edges)  (reading panel, breadcrumb stack)
                │
   lib/layout.ts · lib/camera.ts · lib/hashlink.ts · lib/progress.ts
```

- **Static site.** Build output is pure static HTML/JS; deployable to any static
  host or opened as a local file.
- **Generated data.** `npm run generate` regenerates `graph.json` from the
  immutable markdown sources (deterministic; covered by vitest).
- **Client-only state.** Progress is per-browser `localStorage`, keyed by subject.

---

## 2. Goals

- **G1 — Survey.** Let the learner see an entire subject's structure at once:
  tiers, lesson order, status, and inter-lesson relationships.
- **G2 — Read in place.** Let the learner open any lesson and read its full
  article and concept pages without leaving the map — including rich content
  (syntax-highlighted code, math, interactive examples).
- **G3 — Track progress.** Reflect which lessons are written/charted, and let the
  learner manually mark unwritten lessons as done; persist across sessions.
- **G4 — Share precisely.** Any subject or lesson is addressable by URL; a
  deep-link opens the map and seats the camera on the target card.
- **G5 — Stay truthful.** The map is always regenerated from source markdown, so
  it never shows a node/element/edge that does not exist in the curriculum.
- **G6 — Find fast.** Full-text fuzzy search across lesson and element content,
  opened with ⌘K, indexed at generate time and shipped inside `graph.json`.

## 3. Non-Goals

- No server, accounts, or cloud sync of progress. The app is pure-static: it runs
  no backend of its own (see Appendix A for the one Sandpack external-runtime
  exception, ADR-0002).
- No editing of curriculum content from the UI (sources stay immutable).
- No real-time collaboration or multi-user state.
- No mobile-first redesign; the app is desktop-oriented with graceful fallbacks.
- Not a general-purpose graph viewer; the layout is specific to the
  tiered-lesson structure.

---

## 4. Personas

### Primary — The Learner (Andy)
Studying one or more subjects (e.g. `ai-agents-in-action`). Reads lessons,
marks progress, and returns over weeks. Needs a spatial sense of "where I am"
and "what's next", plus quick access to the full text of each lesson.

### Secondary — The Visitor
Gets a shared deep-link to a specific lesson. Should land exactly on that card,
see its context in the subject, and be able to read the article without setup.

### Implicit — The Author (the learning pipeline itself)
The agent writes nodes/elements/edges in markdown. The map must track those files
without hand-maintenance, so it stays current as nodes move `draft → edges-written`.

---

## 5. User Stories

### Survey & navigate
- As a learner, I want to see all tiers and lessons of a subject at once so I
  can understand the course shape before starting.
- As a learner, I want to switch between subjects from the top bar so I can move
  between my courses without reloading.
- As a learner, I want to zoom/pan the map (wheel, trackpad pinch, drag, and
  on-screen buttons) so I can read crowded areas and step back for the big picture.
- As a learner, I want a one-click "reset to overview" so I can re-frame the map
  whenever I get lost.
- As a learner, I want to see which lessons are charted (written) and which
  still need work, so I know what's finished at a glance.
- As a learner, I want to hover a card to see its title, status, and learning
  goal without opening it.

### Read
- As a learner, I want to click a lesson card and read its goal, full lesson,
  taught/related elements, and sources in a side panel.
- As a learner, I want to jump from a lesson to any element it teaches, and back,
  with a breadcrumb trail, so I can follow the concept graph.
- As a learner, I want a full-read mode that expands the article to the whole
  screen for comfortable long-form reading.
- As a learner, I want Escape to step back / close the panel using the keyboard.

### Progress
- As a learner, I want to mark an unwritten lesson as complete so my personal
  progress shows even where content is still pending.
- As a learner, I want my progress saved across visits so I don't re-track.
- As a learner, I want to reset my manual progress without touching written
  content's auto-completion.

### Share & deep-link
- As a visitor, I want to open a pasted link and land on the exact lesson, with
  the camera seated on its card, so sharing is meaningful.
- As a learner, I want the current view reflected in the URL so I can bookmark
  or share where I am.

### Trust & upkeep
- As the author/pipeline, I want the map to regenerate from markdown so newly
  written lessons appear without manual data entry.

---

## 6. Functional Requirements

### FR-1 Subject switcher (TopBar)
- List all subjects found in `graph.json` with per-subject counts
  (`{n} plates · {m} charted`).
- Selecting a subject re-fits the camera on the new roadmap and clears selection.

### FR-2 View switcher (TopBar)
- Toggle between the two map views: `星雲` (force-graph) and `Roadmap` (structural).
- Both views share selection, progress, hover card, and deep-link behaviour;
  switching keeps the current selection.

### FR-3 Nebula map rendering (ForceMap)
- Force-directed layout of the whole subject: one node per lesson, one small
  circle per concept element, links for spine / shared-concept / explicit edges
  plus a thin `teach` link from each lesson to the elements it teaches.
- Node styling: completed = brass, incomplete = dim, selected = beacon halo; link styles match the legend.
- The simulation settles after a cooldown (deterministic start state via the
  graph's stable id ordering), then fits the graph; selection, hover, and
  deep-link seating all re-render live on canvas.

### FR-4 Roadmap rendering (RoadMap)
- Render one row per tier: Roman numeral + tier title in the left lane.
- Render one card per lesson: order number, title, status label.
- Render three edge kinds with distinct styles:
  - **spine** — solid line + arrowhead: sequential node order (including across
    tier boundaries, drawn as drop curves).
  - **shared** — dashed line: nodes that teach the same element.
  - **explicit** — glowing line + arrowhead + label: element-to-element relationships
    lifted to their teaching nodes.
- Concept element markers render as small circles, laid out by a deterministic
  force simulation that tethers each element to the node cards that teach it
  (dashed link to each teaching card); a manually completed element fills brass
  instead of the dim outline. The roadmap's card/row/edge structure itself is
  untouched by the simulation.
- Decorative star-field, grid, sky/vignette gradients (deterministic per subject).

### FR-5 Camera (lib/camera.ts + per-view imperative handles)
- Roadmap: auto-fit on load / subject switch / resize; wheel = zoom-to-cursor;
  ctrl-wheel (pinch) and Safari gesture events also zoom; pointer drag = pan;
  clamp zoom to [0.08, 3]; animated seat to a card on deep-link.
- Nebula: `zoomToFit` / `centerAt` + `zoom` with animated transitions; deep-link
  seating waits for the force simulation to settle.

### FR-6 Status & charting (lib/colors.ts)
- Status model: `draft → confirmed → nodes-written → content-written → edges-written`.
- `content-written` / `edges-written` count as automatically charted (brass seal).
- A card is "lit" (seal + glow) if auto-written **or** manually completed.

### FR-7 Progress persistence (lib/progress.ts)
- Store `{ [subject]: string[] }` of manually completed node ids in
  `localStorage` under `knowledge-map:progress`.
- Toggle complete on unwritten cards; reset button clears only the current
  subject's manual entries (disabled when empty).

### FR-8 Detail pane (DetailPane)
- Opens on card click; shows goal, rendered lesson MDX, taught-element chips,
  related-element chips, and sources.
- Element chips push the view into the element's body; elements show "taught by" nodes.
- Breadcrumb stack with back / jump; Escape steps back then closes.
- Wikilinks inside article MDX (`.wikilink[data-target]`) navigate within the
  current subject; cross-subject and `sources/` targets are ignored/rendered inert.
- Full-read mode renders the node article MDX centered, Escape collapses it.

### FR-9 Hash deep-linking (lib/hashlink.ts)
- Canonical hash `#s=<subject>&p=<node-id>`; omit `p` when nothing selected.
- On load, resolve the hash; if valid, seat the camera on the card.
- Mirror state changes to the hash with `replaceState` (no history flooding).
- Listen to `hashchange` for back/forward and pasted/edited links.

### FR-10 Data generation (scripts/generate-data.mjs)
- `npm run generate` scans every `learn/<subject>/` with a `ROADMAP.md`, reads
  `nodes/`, `elements/`, `edges/`, parses frontmatter, renders markdown → HTML,
  and writes `src/data/graph.json`.
- Derive tiers from ROADMAP headings; derive `spine`, `shared-concept`, and
  `explicit` edges; compute `relatedElementIds` from element Connections (both
  directions). Deterministic output; edge case of duplicate element folders ignored.
- `npm test` covers frontmatter parsing, markdown rendering, graph building,
  edge derivation, and determinism.

### FR-11 Rich content rendering (scripts/generate-data.mjs pipeline)
- Lesson and element markdown render through a remark/rehype pipeline at generate
  time (ADR-0001); the client never renders markdown at runtime.
- Fenced code blocks highlight via Shiki (GitHub Dark theme), build-time, zero
  runtime cost; unlabeled fences stay unhighlighted.
- Math renders via KaTeX at generate time (CSS shipped in `app.css`).
- Rendered HTML passes through `rehype-sanitize` with a whitelist preserving
  `.wikilink[data-target]` and code classes.

### FR-12 Search palette (⌘K)
- Full-text fuzzy search over node titles/goals and lesson/element full text.
- The Fuse.js index is prebuilt at generate time and ships inside `graph.json`.
- Results group by subject; picking a result seats the camera and opens the
  DetailPane, consistent with deep-link behavior.

### FR-13 Interactive examples (Sandpack)
- Lessons declare examples with a ` ```sandpack ` code fence; the generator
  extracts them into `sandpack` configs in `graph.json`.
- The DetailPane renders them with Sandpack, lazy-loaded (`React.lazy`) only for
  lessons that contain one.
- Examples need network (client iframe + CDN resources); offline they degrade
  gracefully to a placeholder (ADR-0002 exception).

---

## 7. Non-Functional Requirements

- **Performance.** Roadmap view is pure SVG; the nebula view renders on a single
  `<canvas>`. Roadmap layout computed once per subject via `$derived`; the force
  simulation settles after a cooldown and redraws only on state changes
  (`autoPauseRedraw(false)`). Should pan/zoom smoothly on a modern laptop at
  full curriculum size (30+ lessons).
- **Determinism.** Generated JSON is byte-identical across runs (seeded RNG for
  stars).
- **Accessibility.** Keyboard (Escape) navigation; `aria-label`s on map, cards,
  buttons; semantic `role` on the detail panel; visible focus rings on controls.
- **Localization.** UI chrome in Traditional Chinese (`zh-Hant`); element deep-dive
  and connections content render per subject `MEMORY.md` language.
- **Robustness.** Malformed hash, missing subject/node, or corrupted
  `localStorage` must degrade gracefully (fallback subject, no selection, `{}`).
- **Maintainability.** Strict TypeScript (`noUnusedLocals` etc.), no comments
  unless necessary, small focused modules under `src/lib/`.

---

## 8. Success Metrics

- **Coverage:** every subject with a `ROADMAP.md` appears as a sheet in the map.
- **Freshness:** `graph.json` matches current markdown after each `npm run generate`.
- **Truthfulness:** every card corresponds to a real node file; every edge
  resolves to real cards (lint checks exist).
- **Engagement (personal):** the learner uses the map to survey subjects before
  starting and to pick the next unread lesson.

---

## 9. Out of Scope (v0.1)

- Editing curriculum from the UI.
- Server-side persistence / sync / accounts.
- Mobile-first layout; touch gestures beyond basic pan/zoom.
- Element graph view separate from the roadmap.
- Multi-subject views (one sheet at a time).

---

## 10. Open Questions

- Should "next up" be auto-suggested (first incomplete card in spine order)?
- Is an element-only graph view (elements + edges, no nodes) worth a future tier?
- Should completed cards expose a print/export of the full article?
- How should Sandpack examples behave offline — static placeholder, or a rendered
  snapshot for readers without network?
- Can Framer Motion `layout` animate roadmap card reflow inside React Flow without
  fighting the viewport transform? (spike; currently out of scope)

*Resolved: manual progress stays per-browser (`localStorage`); cross-device sync
is closed (no backend, per ADR-0002).*

---

## Appendix A — Tech stack

- **Build:** Vite 8 + TypeScript (strict) + React 19
- **UI:** React 19 components, Tailwind CSS v4 (`@tailwindcss/vite`),
  Radix UI (headless primitives, tooltips)
- **Graph:** force-graph (framework-agnostic 2D canvas engine) for the nebula view
- **Icons:** hand-written inline SVG components (`src/components/icons/`, stroke = `currentColor`),
  Feather Icons as the reference source for new icons (not a runtime dependency)
- **Toasts:** sonner
- **Animation:** View Transitions API (view switching + pane navigation, via
  `use-view-transitions`), React Spring (numeric interpolation: progress ring),
  Framer Motion (chrome micro-interactions, replacing CSS keyframes)
- **Search:** Fuse.js with a build-time index shipped in `graph.json`; ⌘K palette
- **Content pipeline (build-time):** remark/rehype + Shiki (GitHub Dark) +
  KaTeX + rehype-sanitize, in `scripts/generate-data.mjs` (ADR-0001)
- **Interactive examples:** Sandpack (`@sandpack/react`), lazy-loaded; the single
  external-runtime exception to the pure-static constraint (ADR-0002)
- **Utilities:** clsx + tailwind-merge (`cn`), tailwind-variants (button recipe)
- **Fonts:** IBM Plex Sans / Mono, Instrument Serif (display)
- **Tests:** Vitest (`src/__tests__/*.test.ts`)
- **Commands:** `npm run dev` · `npm run build` (tsc --noEmit + build) ·
  `npm run typecheck` · `npm test` · `npm run generate`

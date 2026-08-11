# Knowledge Nebula — a learning-route website

## Destination

A standalone Svelte 5 + Vite + Tailwind v4 website (new folder at repo root, e.g. `nebula/`) that renders the repo's learning system as an interactive "knowledge nebula" — each subject in `learn/<subject>/` becomes one tower map, styled in the spirit of `chartr/web`, where learners read the actual lessons (paths, nodes, connections, check-yourself questions) in the browser instead of raw markdown.

- **Data pipeline**: a build script parses `learn/<subject>/` (ROADMAP.md tiers + paths/nodes frontmatter + wikilinks) into one JSON graph per subject; generated JSON is gitignored, regenerated before dev/build.
- **Map**: one subject = one tower; a subject switcher at the top. Layout is a deterministic SVG layered graph — tier = horizontal band, `order` = column within the band, backbone arrows along tier/order, plus curved "shared node" edges between paths. Draft paths appear dimmed with their goal as a preview, not hidden.
- **Learning**: map page + full-page lesson route; rendered lesson markdown with `[[wikilink]]` navigation to node pages; node pages show Connections and Check-yourself Q&A.
- **Language**: chrome-only zh/en toggle; content stays as-authored (zh-Hant with English titles in parens). No content translation.
- **Progress**: soft — free browsing, completion marks + progress in localStorage; no hard tier locks.
- **Styles**: port the chartr/web design language (olive/warm-neutral dark tokens, shadcn-svelte primitives, IBM Plex) where it fits a standalone site, including a zh-Hant font strategy.

## Notes

- **Tracker**: this repo's wayfinder tracker is chartr's local-markdown convention (`.plan/maps/<slug>/`), per `chartr/CONTEXT.md` and `chartr/internal/prompt/assets/conventions.md`. Tickets use the chartr format: `type`/`blocked_by` frontmatter, status derived from `## Answer`/`## Ruled out`, never stored.
- **Domain**: Svelte 5 SPA + Vite + TypeScript + Tailwind v4 + shadcn-svelte. Style source of truth is `chartr/web` (`src/app.css` tokens, `src/lib/components/ui/`, `chartr/docs/design-system.md`). `chartr` itself is a separate Go project — the nebula site is standalone and does **not** modify it.
- **Data**: `learn/<subject>/` — ROADMAP.md tier headings; path/node frontmatter (`id`, `title`, `subject`, `tier`, `order`, `status`, `goal`, `nodes`, `paths`); wikilinks `[[learn/<subject>/nodes/<id>|Alias]]`, `[[learn/<subject>/paths/<id>|Alias]]`, `[[sources/<subject>/<file>#<section>]]`. No `edges/` files exist yet in any subject — shared-node edges are derived. Sources are immutable.
- **Skills to consult**: `/grilling` and `/domain-modeling` for every HITL ticket; Context7 for library docs (markdown parsing, Svelte, Tailwind). No `/research` or `/prototype` skill is installed — research tickets are worked by a general sub-agent; prototype tickets produce rough artifacts via grilling + domain-modeling.
- **Standing decisions (from charting)**: deterministic layout (same data → same layout, mirroring chartr's star-map guarantee); gitignored generated JSON; per-subject tower + subject switcher; chrome-only zh/en i18n; soft progress in localStorage; draft paths shown dimmed with goal preview; build script before dev/build.
- **Known data wrinkle**: `learn/design-data-intensive-applications/learn/` is a stray nested duplicate — the build script must flag, not crash on, inconsistent layout.

## Decisions so far

<!-- index — one bullet per resolved ticket; empty until tickets resolve -->

## Not yet specified

- **Hosting / serving.** How the built site is served — local dev only, or a static export target (gh-pages, etc.). Depends on the site's shape from tickets 04–05.
- **Source citations.** How `[[sources/<subject>/<file>#<section>]]` render on lesson pages — the sources are PDFs, so this is likely a citation/footnote treatment, not an embed. Sharp once the reading experience (ticket 05) is prototyped.
- **Search.** Whether the site offers cross-path/node search. Coarse until the data contract (ticket 03) lands.
- **Future `edges/` pages.** When the content pipeline starts writing `edges/` files, how the site surfaces them (the data contract keeps forward-compat in mind; the reading UX for edge pages is not yet specified).
- **Visual polish.** Motion/pulse/glow beyond the deterministic map — nice-to-have, only after tickets 04–05 are reacted to.

## Out of scope

- **Modifying chartr** — the nebula site is a standalone sibling; chartr and its cockpit are untouched.
- **Authoring learning content** — writing paths/nodes/edges is the `/nodes` and `/edges` pipeline's job, not this site's.
- **Translating lesson content to English** — chrome-only bilingual, decided at charting.
- **Hard progression locks** — Slay-the-Spire-style gating rejected at charting; soft progress only.
- **The legacy `wiki/` folder.**
- **Accounts / cloud sync** — progress stays in localStorage.

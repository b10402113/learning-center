# Adopt MDX, compiled in the frontend bundle

Status: proposed

We author node and element files as MDX — Markdown with embedded JSX for interactive components (quizzes, video embeds) — and compile them to React components in the frontend bundle with Vite + `@mdx-js/rollup`. The generated `graph.json` shrinks to graph structure only (tiers, node/element ids, edges, prerequisites) and stops carrying rendered HTML strings. We accept that Obsidian rendering of these files degrades (JSX shows as raw text).

## Considered Options

- **Static compile at generate time.** The generator compiles MDX to HTML strings back into `graph.json`. Pipeline change is small, but interactive components cannot hydrate — MDX becomes syntax sugar over static HTML.
- **Runtime compile in the browser.** No build-pipeline change, but poor performance and a large bundle; every article compiles on open.
- **Structured elements without MDX.** Quiz/video as frontmatter-driven React components only. Rejected: the learner wants arbitrary in-article interactivity, not just element-scoped blocks.

## Consequences

- `generate-data.mjs` no longer renders content; rendering happens in the app build. Content drift risk shifts to the app's import graph, so the frontend must import `learn/<subject>/**/*.mdx` directly.
- The `nodes` and `nodes/elements` writer skills must emit MDX (JSX blocks) instead of plain markdown.

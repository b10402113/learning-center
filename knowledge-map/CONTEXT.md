# Knowledge Nebula（知識星雲）

Single-page interactive visualization of a personal learning curriculum, generated
from the same markdown sources the learning pipeline produces.

## Architecture

**純靜態 / Pure-static**:
The product constraint — no server, no accounts, no cloud sync. Data ships as a
generated `graph.json`; personal state lives in `localStorage`. Defined as *no
backend of our own*, not *no external resources whatsoever* — see the Sandpack
exception below.
_Avoid_: offline app, static-first.

**建置期工具 / Build-time tool**:
Runs inside `scripts/generate-data.mjs` at generate time; zero runtime cost.
Includes Shiki (syntax highlighting) and KaTeX (math).
_Avoid_: compile-time (generation is not compilation).

**MDX 管線 / MDX pipeline**:
Node and element files are written as MDX. The Vite dev server uses
`@mdx-js/rollup` to compile `.mdx` files into React components at build time.
`graph.json` carries only structural data (tier, id, order, edge, type,
prerequisites) — no content HTML. The client renders MDX components directly.
_Avoid_: renderer, markdown engine.

**Sandpack 例外 / Sandpack exception**:
The single explicit external-runtime exception to pure-static. Interactive
examples render in a Sandpack client iframe loaded from CDN resources, so they
need network. Declared in lessons via ` ```sandpack ` code fences, lazy-loaded only
for lessons that contain one. Do not extend the exception to other runtime CDNs
without an ADR.
_Avoid_: CDN, external runtime.

**執行期依賴 / Runtime dependency**:
Ships to the browser. Includes Framer Motion, React Spring, Fuse.js.
_Avoid_: dependency.

**素材來源 / Asset source**:
A reference for hand-crafted assets, not a dependency. Feather Icons is an asset
source; its SVGs are copied and reworked into `src/components/icons/`.
_Avoid_: icon library.

## Views

**星雲 / Nebula**:
The force-directed graph view (`force-graph`). One node per lesson, small circles
per concept element, links for spine / shared-concept / explicit edges.
_Avoid_: graph view.

**Roadmap / 路線圖**:
The structural view (ReactFlow). Each tier is a row, each lesson a card, edges
drawn as navigable connections.
_Avoid_: tower, map view.

**視圖切換 / View switch**:
Transitioning between Nebula and Roadmap via the View Transitions API.
_Avoid_: page transition (there are no pages).

**Node 頁面 / Node page**:
The standalone full-page view of one node's lesson (`#/nodes/<subject>/<node-id>`),
rendered with the same three-column docs layout as element pages. Reading is
entered either through a transient reader modal or directly by deep-link.
_Avoid_: lesson view, node content.

**Element 頁面 / Element page**:
The standalone full-page view of one element
(`#/elements/<subject>/<element-id>`), carrying an optional `?from=<node-id>`
origin so the breadcrumb can return to the teaching lesson. Shares the docs
layout with node pages.
_Avoid_: concept page, element view.

**元素視窗 / Reader modal**:
The transient overlay that hosts the same node/element docs page when reading is
entered from the map, a checklist modal, chips, wikilinks, or search. "Expand"
navigates to the standalone page; closing returns to the surface underneath
(nested over the checklist modal). The retired DetailPane side panel is not a
reader modal.
_Avoid_: sidebar, popup, panel.

## Search

**全文搜尋 / Full-text search**:
Fuzzy search over lesson and element text, opened with ⌘K as a command palette.
The Fuse.js index is built at generate time and ships inside `graph.json`.
_Avoid_: search (overloaded).

**導航搜尋 / Navigation search**:
Formerly the ⌘K affordance that focused the subject selector; superseded by the
full-text search palette, which owns the ⌘K shortcut.
_Avoid_: search.

## Content

**課程內容 / Lesson content**:
The curriculum substance: prose lessons (zh-Hant), plus — planned — fenced code
blocks, math, and interactive examples.
_Avoid_: content, markdown (content is the substance; markdown is its storage format).

**互動範例 / Interactive example**:
A lesson-embedded widget the learner can manipulate, rendered with Sandpack
(client iframe) via a ` ```sandpack ` code fence.
_Avoid_: playground.

## Progress

**進度 / Progress**:
Manual element-level completion state, per subject, stored in `localStorage`.
The learner marks each element complete by hand; node completion is derived
automatically once every item in its list (taught elements + main article) is
complete. No tier gates, no unlock thresholds.
_Avoid_: likes, engagement — the blog's MongoDB likes are an engagement signal and
are out of scope here.

**元素類型 / Element type**:
Each element is `article` (default), `video`, or `question`. `video` elements
embed a `videoUrl` for in-app playback. `question` elements render an
interactive multiple-choice quiz; the learner must answer correctly before the
element counts as complete (self-test, not a gate).
_Avoid_: content type.

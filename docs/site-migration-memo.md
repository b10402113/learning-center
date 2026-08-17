# Site Migration Memo — step-DAG node model

Written for whoever picks up the `knowledge-map` frontend next. This memo records what the writing-pipeline change (ADRs 0003–0005) implies for the site, so the site can be updated without re-interviewing the design. This memo is a pointer, not a spec — decide the UI details when you get here.

## What changed in the data model

| Before | After |
|---|---|
| Node = one 10–15 min article file | Node = container file with a **step-DAG** (step ids + deps) + main lesson |
| `elements` = flat ordered list in node frontmatter | Steps reference the elements they teach; elements are keyword dictionary pages |
| Element completion is manual | **Step completion is the only completion unit** (via `/tackle`) |
| Node completion derived from elements+main | Node complete when **all steps in its DAG** are complete |
| `question` element type (graded) | Deprecated; graded verification lives in `/tackle` |
| `prepares/` preview notes | Removed (step-DAG confirmation replaces it) |
| tune-scope `nodes` | `steps` (step articles carry the voice) |

## What the site must absorb

### 1. `scripts/generate-data.mjs` — graph.json shape
Current behavior (PRD FR-10/FR-11): scans `learn/<subject>/`, reads `nodes/`, `elements/`, `edges/`, renders markdown → HTML at generate time, writes `src/data/graph.json`.

Needed changes:
- **Steps are a new node kind in the graph.** Each node file references step files under `learn/<subject>/nodes/<node-id>/<step-id>.mdx`. Parse the node's step-DAG (step ids + deps) and the step files' frontmatter; emit steps as graph nodes with:
  - their `deps` edges (the DAG),
  - the elements each step `teaches` (links),
  - their rendered article body (steps are articles now).
- The node's own article is now only its **main lesson**; the step articles are the teaching content.
- Mark `question`-typed elements as deprecated in the emitted data (or drop them).

### 2. Roadmap view
- Tiers still group nodes; node cards should now open into the step-DAG rather than a single article.
- Render the DAG (steps + deps) — the learner is expected to see "how this lesson goes" and confirm it at `/nodes` time; the site should reflect the same structure.

### 3. Nebula view
- Current: concept elements are pulled toward the nodes that teach them; `teach` links node → elements.
- Keep element nodes and node→element links, but add step nodes between: node → step (teaches) → element. Decide whether steps render as small intermediate chips or collapse into their node.

### 4. Detail pane / reading
- Reading a node = walking its steps in DAG order, not one article. Each step renders as an article with its element links.
- Element pages keep their full structure including the no-grade `Questions` self-check (rendering unchanged; they are now "dictionary" pages).

### 5. Completion & progress state
- Client-side progress must track **per-step completion** and derive node completion from the step-DAG (all steps tackled).
- Drop element checkbox completion (ADR-0005).
- `mastery` (`unknown | partial | solid`) lives in a per-subject file written by `/probe` and `/tackle` — the site can read it read-only to show "where you stand"; it is not client-owned state.

### 6. Search (FR-12)
- Fuse index should include step article bodies, not just node/main-lesson text.

### 7. Backward compatibility
- Old single-article nodes (pre-migration) and new step-DAG nodes may coexist while muscle-ladder migrates (ADR-0003 pilot). `generate-data.mjs` should handle a node with no steps gracefully (treat main lesson as its only content, completion = main read).

## Suggested implementation order
1. `generate-data.mjs`: emit steps + DAG into graph.json (keep old fields working).
2. Detail pane: render step articles and DAG order.
3. Completion: step-based tracking, derived node completion.
4. Nebula: step layer between node and element.
5. Search index over step bodies.

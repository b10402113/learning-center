# Learning System

A personal learning system that turns immutable source material into tiered lessons (nodes), reusable concept pages (elements), and relationship pages (edges), surfaced through a static interactive map ("Knowledge Nebula") built from the generated markdown.

## Language

**Subject**:
One curriculum, one folder under `learn/<subject>/`. Owns its own `MEMORY.md`, `ROADMAP.md`, nodes, elements, and edges.
_Avoid_: course, module

**Node**:
A single 10–15 minute lesson with one learning goal. Lives in `learn/<subject>/nodes/`.
_Avoid_: lesson article, unit

**Element**:
A reusable, self-contained concept page carrying the detailed explanation behind one or more nodes. Identified by an immutable kebab-case id.
_Avoid_: concept, card, page

**Edge**:
A relationship page that makes the learner compare, contrast, or judge two elements.

**Tier**:
A level in a subject's roadmap that groups nodes from general to specific. Tier 1 is the entrance floor.
_Avoid_: floor, chapter

**Roadmap**:
The subject-level index (`ROADMAP.md`) that partitions the material into tiers and ordered nodes. It never lists elements.
_Avoid_: plan, outline

**Digest**:
A two-level summary of an immutable source (`learn/<subject>/digests/`), written once per source and reused on hash match.

**Prepare note**:
An optional 3–5 minute "before you read" preview for one node (`learn/<subject>/prepares/<node-id>.mdx`).

**Tune**:
The voice profile of a YouTuber, extracted into `tune/<author-slug>/TUNE.md` and applied through a subject's `MEMORY.md` frontmatter.

**Spine**:
The sequential reading order of a subject's nodes, chained by `spine` edges.

**View**:
A mode of the knowledge map. The site keeps two views — **Roadmap** (list of tiers and ordered nodes) and **Nebula** (force-directed concept graph). The former tower view is discarded.
_Avoid_: 塔圖, tower

**Element type**:
Every element declares a type in its frontmatter: `article` (prose), `video` (embedded playback from a URL), or `question` (interactive quiz). A node's own lesson is the special `main` type and sits last in the node's list.
_Avoid_: kind, category

**Question element**:
An interactive multiple-choice element. It must be answered correctly before the learner can mark it complete.

**Video element**:
An element that embeds an external video (via URL) instead of prose.

**Prerequisite**:
An element or node that makes a given node easier to learn, listed in that node's view and color-coded by kind — elements and nodes are visually distinct.
_Avoid_: dependency, requirement

**Lesson content**:
Node and element files are authored in MDX — Markdown with embedded JSX for interactive components (quizzes, video embeds). MDX is compiled to React components in the frontend bundle; the generated `graph.json` carries graph structure only, not rendered content. Obsidian rendering of these files degrades (JSX shows as raw text).
_Avoid_: markdown pages, rendered HTML

**Completion**:
Element completion is manual. Node completion is derived: a node is complete automatically once every item in its list is complete — its taught elements plus its main article. A node with no elements requires only its main article.
_Avoid_: progress %, points

**Progress**:
Per-subject state stored client-side, tracking manual element completion and derived node completion.

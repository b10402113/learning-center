# Learning System

A personal learning system that turns immutable source material into tiered lessons (nodes), reusable concept pages (elements), and relationship pages (edges), surfaced through a static interactive map ("Knowledge Nebula") built from the generated markdown.

## Language

**Subject**:
One curriculum, one folder under `learn/<subject>/`. Owns its own `MEMORY.md`, `ROADMAP.md`, nodes, elements, and edges.
_Avoid_: course, module

**Node**:
A step-DAG — a container whose teaching process is a set of steps that branch and merge through their deps. One learning goal per node. The node file holds the DAG (step ids + deps), the reading order, and the main lesson; step articles live beside it. Lives in `learn/<subject>/nodes/`.
_Avoid_: lesson article, unit

**Element**:
A reusable keyword-style concept page — the canonical explanation of one concept, like a dictionary entry (e.g. the "Prompt" entry). Keeps its full explanatory structure, including a `Questions` section used as a no-grade preview self-check; carries no teaching process of its own. Identified by an immutable kebab-case id. Steps are the articles; elements are the keywords those articles use. The `question` element type is deprecated — graded verification lives only in `/tackle`.
_Avoid_: concept, card, page

**Step**:
A node's teaching-process unit, written as an article (e.g. "Writing good prompts" is a step; "Prompt" is the element it uses). A node has n steps; each step references the elements (keywords) it teaches and is verified via `/tackle`. Steps form a DAG through their deps — they branch and merge, so a node is a step-DAG, not a single line. Each step is a first-class file (`learn/<subject>/nodes/<node-id>/<step-id>.mdx`); the node file holds only the DAG, ordering, and the main lesson.
_Avoid_: section, chunk, lesson

**Edge**:
A relationship page that makes the learner compare, contrast, or judge two elements.

**Tier**:
A level in a subject's roadmap that groups nodes from general to specific. Tier 1 is the entrance floor.
_Avoid_: floor, chapter

**Roadmap**:
The subject-level index (`ROADMAP.md`) that partitions the material into tiers and ordered nodes along the learner-chosen learning path. It never lists elements.
_Avoid_: plan, outline

**Digest**:
A two-level summary of an immutable source (`learn/<subject>/digests/`), written once per source and reused on hash match.

**Probe**:
The per-node pre-view assessment stage (`/probe <subject>/<node-id>`), run after `/roadmap` and before `/nodes`: adaptive MCQ from shallow to deep across one node's source scope, binary-searching each strand. It is a hard gate — `/nodes` refuses a node that has not been probed. Outputs that node's mastery entry used to calibrate step depth. It never proposes pruning — all content stays complete and readable; mastery only shapes how deep each part is taught.
_Avoid_: pretest, entrance exam

**Mastery**:
A per-node, per-strand rating of the learner's current understanding (`unknown | partial | solid`), measured by `/probe <subject>/<node-id>` and written back by `/tackle`. Persisted in a per-subject file (`learn/<subject>/mastery.md`, keyed by node) so `/nodes` can calibrate step depth (teach shallow where `solid`, deep where `unknown`) and `/tackle` can target the strands the learner is weakest at. It never prunes content. Step completion is separate UI state and stays client-side.

**Tackle**:
The per-step verification stage (`/tackle <step-id>`): a runtime, adaptive MCQ session. Questions are generated on the fly from the step's elements, and targeted at the strands the node's probe (`/probe <subject>/<node-id>`) rated `unknown` or `partial` — `solid` strands get a light spot-check or are skipped. Starting level anchors to MEMORY and the probe's strand ratings, and difficulty adapts in real time to the learner's answers (correct → harder, wrong → easier, probing the edge of understanding). Passing means the system estimates the step's concepts at `solid` mastery — e.g. N consecutive correct at target difficulty — not a fixed score threshold. Passing marks the step complete and writes the mastery back, keeping the system calibrated.
_Avoid_: quiz, test, exam

**Polish template**:
Deprecated. Previously a hand-written style guide in `polish/<author-slug>/polish.md`, chosen per subject at `/learn-init` and stored in `MEMORY.md` frontmatter (`polish: <slug | none>`). The polish-agent would rewrite step article bodies in that style. Superseded by **teach-node** — step articles are now written directly in the teach-node writing standard; no separate polish pass. Existing `polish/` directories are retained for reference but no longer referenced by the pipeline.
_Avoid_: tone, style

**Teach-node**:
The writing standard for step articles — defines MDX component usage, section structure, and prose style. Replaces the polish-agent pipeline: sub-agents write step articles directly in teach-node style (one pass, no rewrite). Does not manage teaching design (ZPD, mission, resources) — that stays in the `teach` skill. Lives in `.opencode/skills/teach-node/`.
_Avoid_: teach-style, node-writing, polish-replacement

**MDX component**:
A reusable React component provided by the rendering framework (`knowledge-map/src/components/teach-node/`). Step articles use these to render structured content: `<KeyInsight>`, `<DecisionTable>`, `<DecisionTree>`, `<WarningBox>`, `<Analogy>`, `<Quiz>`, `<LearningGoal>`. Components are compiled by the MDX pipeline; they do not affect format checks.
_Avoid_: HTML component, UI component, widget

**Spine**:
The sequential reading order of a subject's nodes, chained by `spine` edges.

**View**:
A mode of the knowledge map. The site keeps two views — **Roadmap** (list of tiers and ordered nodes) and **Nebula** (force-directed concept graph). The former tower view is discarded.
_Avoid_: 塔圖, tower

**Element type**:
Every element declares a type in its frontmatter: `article` (prose) or `video` (embedded playback from a URL). The `question` type is deprecated — graded verification lives only in `/tackle`.
_Avoid_: kind, category

**Question element**:
Deprecated. Graded multiple-choice verification now lives only in `/tackle`; elements keep a no-grade `Questions` self-check section instead.

**Video element**:
An element that embeds an external video (via URL) instead of prose.

**Prerequisite**:
An element, step, or node that makes a given node or step easier to learn, listed in that node's view and color-coded by kind.
_Avoid_: dependency, requirement

**Lesson content**:
Node and element files are authored in MDX — Markdown with embedded JSX for interactive components. Step articles use globally shared MDX components (`components/`) for structured content: learning goals, key insights, decision tables, decision trees, warnings, analogies, and quizzes. MDX is compiled to React components in the frontend bundle; the generated `graph.json` carries graph structure only, not rendered content. Obsidian rendering of these files degrades (JSX shows as raw text).
_Avoid_: markdown pages, rendered HTML

**Completion**:
Step completion is the only completion unit: a step is complete when its `/tackle` passes (mastery reaches `solid`). Node completion is derived: a node is complete automatically once every step in its DAG is complete. Elements are keywords and are not marked complete.
_Avoid_: progress %, points

**Progress**:
Per-subject state split in two: **mastery** (measurement from `/probe` and `/tackle`, persisted in a file so `/nodes` calibrates step depth and `/tackle` targets weak strands) and **step completion** (UI display state kept client-side).

## Verification

**Deterministic check**:
A check a script can run mechanically, limited to **format correctness** — required frontmatter, ID/filename match, step↔DAG consistency, `teaches` agreement, link resolution, element section presence, digest `source_hash`, source-locator resolution, node-count baseline. It never judges prose quality or content semantics. Runs in the verification script, never by the LLM.
_Avoid_: lint, mechanical check

**Format check**:
A deterministic check on an article's structure and links — frontmatter keys, ID/filename match, DAG consistency, reference resolution, section presence. Prose style and content semantics are deliberately out of scope; the script never fails an article over how it is written.
_Avoid_: prose check, style check

**Judgment check**:
A check that needs LLM reading — depth-matches-calibration, contradictory or stale claims, verb nominalization, jargon. Not a per-node pipeline gate: the verification script checks format only, and the LLM only fixes what the script flags — it never re-reads an article to judge its prose. The learner is the final judge of these qualities.
_Avoid_: review, audit

**Verification script**:
The single CLI that runs all deterministic format checks, with two scopes — `--subject` (whole-subject lint, used by the AGENTS.md periodic lint) and `--node <subject>/<node-id>` (per-node gate in `/nodes` step 11). Emits a compact report the LLM reads instead of re-reading every file.
_Avoid_: linter, checker, test script

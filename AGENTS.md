# Learning Path Schema

This repo turns raw material into customized, subject-specific lessons. A **node** is a step-DAG — a container whose teaching process is a set of **steps** that branch and merge through their deps. A **step** is a first-class article: a 10–15 minute lesson that references the **elements** it teaches. An **element** is a keyword-style concept page (a dictionary entry) that carries the detailed explanation behind one or more steps. **Edges** connect elements for higher-order comparison and judgment.

## Architecture

```text
├── AGENTS.md          ← repository schema and workflow
├── CLAUDE.md          ← @AGENTS.md
├── docs/reference/    ← shared skill protocols (e.g. source-reading.md, tune.md)
├── sources/           ← raw, immutable inputs, one folder per subject
│   └── <subject>/
├── tune/              ← YouTuber transcripts (immutable) + TUNE.md voice profiles
│   └── <author-slug>/
├── learn/             ← generated learning material, one folder per subject
│   └── <subject>/
│       ├── MEMORY.md  ← learner profile from /learn-init (incl. language, tune, tune-scope)
│       ├── ROADMAP.md ← node index and course plan
│       ├── mastery.md ← per-area mastery report (unknown | partial | solid) from /probe, written back by /tackle
│       ├── digests/   ← two-level source digests from /learn-init & /roadmap
│       ├── nodes/     ← one container file per node + a folder of step files per node
│       ├── elements/  ← keyword-style concept pages (dictionary entries)
│       └── edges/     ← relationship pages between element pairs
├── wiki/              ← legacy, no longer maintained
└── *.md               ← pedagogy references
```

## Pipeline

```text
/tune <author>                ← optional, before /learn-init; produces tune/<author>/TUNE.md
/learn-init <subject>
    → /probe <subject>
    → /roadmap <subject>
    → /nodes <subject>/<node-name>
    → /edges <subject>/<node-name>
/tackle <step-id>             ← runtime skill, invoked per step at learning time
```

Each stage is user-invoked. `subject/node-name` is explicit so a node name never has to be unique across subjects. The probe stage measures per-area mastery; the roadmap stage partitions into nodes and writes node containers; the nodes stage reasons out the node's step-DAG, gets learner confirmation, then writes the step articles; the edges stage adds high-value relationships. `/tackle` verifies one step at learning time. A tune is a styling layer chosen per subject at `/learn-init` and applied by the writer skills.

## Core Principles

1. **Sources are immutable** — Never modify files in `sources/`. Transcripts in `tune/` are immutable the same way.
2. **Nodes are step-DAGs** — Each node has one learning goal and decomposes into a set of steps (articles) that branch and merge through their deps. A step is readable as a 10–15 minute lesson and may reference several elements.
3. **Elements crystallize** — An element is a keyword-style concept page (a dictionary entry), self-contained, reusable, and anchored to `MEMORY.md` or an earlier concept. The element carries detail; the step carries the lesson narrative.
4. **Elements compound** — Reusing a concept updates its canonical element incrementally. Preserve useful existing explanations while adding supported depth, examples, connections, and sources.
5. **Edges interleave** — Edges make the learner compare, contrast, and judge instead of retrieving in isolation. Prefer a few strong relationships.
6. **Knowledge stays traceable** — Every claim points to a source, and every step records the elements it teaches; the node records its step-DAG.
7. **Voice styles, pedagogy decides** — A tune supplies the voice; `MEMORY.md` owns the language and teaching constraints. Writer skills enforce both, and content stays cited to its subject sources.

## Skills

- `/tune <author>` — read one YouTuber's transcripts in `tune/<author>/` and write their `TUNE.md` voice profile (merge lifecycle, per `docs/reference/tune.md`)
- `/learn-init <subject>` — ensure the subject's source digests exist (sub-agent path for large sources per `docs/reference/source-reading.md`), interview the learner, and write `learn/<subject>/MEMORY.md` (including language, tune, and tune-scope)
- `/probe <subject>` — adaptive MCQ from shallow to deep across the whole source scope, binary-searching each strand; writes the per-area mastery report (`unknown | partial | solid`) and never prunes content
- `/roadmap <subject>` — partition the material into 10–15 minute nodes against the formula baseline, calibrated by probe mastery, propose the full candidate list for learner confirmation, then write `ROADMAP.md` and node containers
- `/nodes <subject>/<node-name>` — reason out the node's step-DAG and get learner confirmation, then extract or update the node's canonical elements and write each step article
- `/edges <subject>/<node-name>` — propose and incrementally write strong edges for the node, including justified cross-node edges
- `/tackle <step-id>` — runtime adaptive MCQ for one step; passing estimates its concepts at `solid`, marks the step complete, and writes mastery back

## Source reading

All stages share `docs/reference/source-reading.md`. Sources are read once into two-level digests (`learn/<subject>/digests/`) — L1 chapter overviews for `learn-init`/`roadmap`, L2 section detail with `[[sources/<subject>/<file>#<section>]]` locators for `nodes`. Raw text never enters the main context wholesale:

- Large source (> 5,000 `pdftotext` lines or > ~250 KB): parallel sub-agents write part digests, merged after.
- Small source: the main context reads it directly and writes the digest itself.
- Digest lifecycle: compare the stored `source_hash`; reuse on match, rebuild on missing/mismatch. Sources are immutable, so digests are stable.

**Node count baseline.** `target = clamp(round(total_pdftotext_lines / 1100), 3, 30)`. It is a soft target for the roadmap checkpoint, not a gate — the learner confirms or adjusts the final partition.

## Tune reading

`/tune` and the writer skills share `docs/reference/tune.md`. Transcripts in `tune/<author>/` are read once into a `TUNE.md` voice profile (sub-agent per transcript; merged, never overwritten). Writer skills apply the tune through `MEMORY.md` frontmatter — `language`, `tune`, `tune-scope` — with plain tone as the fallback when no tune is set. `tune-scope` is `steps` (step articles only), `elements-steps` (element prose too, sections kept), or `all` (also edges); steps are the article carriers, so the teaching voice applies to them.

## Formats

The writing skills are the single source of truth for generated templates.

- **Roadmap** — `learn/<subject>/ROADMAP.md`. Frontmatter: `subject, status, created`. It indexes nodes; it does not list elements.
- **Node (container)** — `learn/<subject>/nodes/<node-id>.mdx`. Frontmatter: `id, title, subject, tier, order, duration, status, goal, sources, steps, prerequisites, created, updated`. The node file holds the **step-DAG** — all step ids with their order and deps (`steps`) — plus the reading order and the main lesson. `elements` is no longer a flat node-frontmatter list; each step file declares the elements it teaches. Sections: Learning goal · Steps (the DAG) · Lesson · Sources. Tiers organize nodes from general to specific; they do not enumerate elements. `prerequisites` is a list of `learn/<subject>/elements/<id>` or `learn/<subject>/nodes/<id>` stable IDs; the generator merges these with connections derived from element `Connections` sections.
- **Step (article)** — `learn/<subject>/nodes/<node-id>/<step-id>.mdx`, a first-class article. Frontmatter: `id, title, subject, teaches, sources, created, updated` (plus `order` when the node's DAG does not set it). `teaches` lists the element IDs the step teaches. Deps are declared centrally in the node file's `steps` DAG, never in the step file. Sections: Learning goal · Lesson · Sources.
- **Element** — `learn/<subject>/elements/<element-id>.mdx`. Frontmatter: `id, title, subject, tier, order, type, nodes, sources, created, updated`. `type` is `article` (default) or `video`; `video` requires `videoUrl`. The `question` type is deprecated — graded verification lives only in `/tackle`, and a `question`-typed element is marked deprecated in the generated graph. Sections: Problem Statement · Why it matters · How it works · In plain terms (optional) · Analogy (optional) · Practical use · Prerequisites (optional) · Connections · Deep dive · Questions. The `Questions` section is a no-grade preview self-check and never affects completion. `Connections` and `Deep dive` stay in English; other headings render per `MEMORY.md` language.
- **Mastery** — `learn/<subject>/mastery.md`, the per-subject mastery report. Written by `/probe` and written back by `/tackle`; it never prunes content. Chunked by source area, each area rated `unknown | partial | solid`. It is calibration data only — step completion is separate client-side state.
- **Edge** — `learn/<subject>/edges/<edge-id>.mdx`. Frontmatter: `title, type, from, to, nodes, created, updated`. Sections: The relationship · Why it matters · When each applies · Interleave.
- **TUNE** — `tune/<author-slug>/TUNE.md`. Frontmatter: `id, title, files, created, updated`. Sections: Voice · Explanation moves · Style habits · Rhetorical devices · Exemplars · Negative list. Format and merge lifecycle per `docs/reference/tune.md`.

Element links use stable, node-qualified IDs with display aliases:

```markdown
[[learn/<subject>/elements/<element-id>|<Element title>]]
```

Source links use:

```markdown
[[sources/<subject>/<file>]]
```

Node links use stable node IDs with display aliases:

```markdown
[[learn/<subject>/nodes/<node-id>|<Node title>]]
```

Step links use stable, node-qualified step IDs with display aliases:

```markdown
[[learn/<subject>/nodes/<node-id>/<step-id>|<Step title>]]
```

## Status

The subject roadmap uses `draft → confirmed`. Each node uses:

```text
draft → confirmed → nodes-written → content-written → edges-written
```

`/roadmap` creates `draft` nodes. Invoking `/nodes <subject>/<node-id>` confirms that node automatically, then moves it through `nodes-written` and `content-written` (writing each step article). `/edges` asks for confirmation of its candidate edge set and only then marks the node `edges-written`.

Completion is step-based: a step is complete when its `/tackle` passes (mastery reaches `solid`); a node is complete automatically once every step in its DAG is complete; elements are keywords and are never marked complete.

## Operations

### Query

When the learner asks a question about a subject:

1. Search the subject's nodes, elements, and edges.
2. Synthesize an answer with stable element citations and source citations.
3. Offer to file a reusable answer as an element or edge when it adds durable knowledge.

### Lint

Periodically check `learn/<subject>/` for:

- Broken node-qualified element, step, or source links
- Element IDs that do not match their filenames
- Step IDs that do not match their filenames
- Steps whose `teaches` list disagrees with article links
- Node `steps` DAG entries whose step file does not exist, or step files with no entry in their node's `steps` DAG
- Elements missing two or more connections or retrieval questions
- Orphan nodes, steps, elements, or edges
- Contradictory or stale claims; mark stale claims `[needs update]` instead of deleting them
- Edges whose `from`, `to`, or `nodes` references no longer resolve
- Large sources missing a digest in `learn/<subject>/digests/`
- Node count deviating more than ±40% from the formula baseline
- Digest `source_hash` that no longer matches its source file
- Source locators in nodes, steps, or elements that cannot be found in the source's digest
- A `tune` in `MEMORY.md` that does not resolve to `tune/<slug>/TUNE.md`
- TUNE `files` hashes that no longer match their transcript files
- Transcripts in `tune/<author>/` with no `TUNE.md` (cannot be chosen at `/learn-init`)

## Quality Standards

- **Useful** — every node has one learner-facing goal; every step is a readable 10–15 minute lesson
- **Connected** — every element has at least two meaningful cross-references
- **Anchored** — every element ties to learner experience or an earlier concept
- **Checked** — every element ends with retrieval questions, including relationship and value-judgment questions; every step is verified by `/tackle`
- **Current** — later nodes and steps deepen canonical elements without erasing useful prior explanations
- **Cited** — every substantive claim traces back to an immutable source

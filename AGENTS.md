# Learning Path Schema

This repo turns raw material into customized, subject-specific lessons. A **node** is one 10–15 minute lesson article. An **element** is a reusable concept page that carries the detailed explanation behind one or more nodes. **Edges** connect elements for higher-order comparison and judgment.

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
│       ├── digests/   ← two-level source digests from /learn-init & /roadmap
│       ├── prepares/  ← optional per-node pre-lesson preview notes
│       ├── nodes/     ← one lesson file per node
│       ├── elements/  ← canonical concept pages
│       └── edges/     ← relationship pages between element pairs
├── wiki/              ← legacy, no longer maintained
└── *.md               ← pedagogy references
```

## Pipeline

```text
/tune <author>                ← optional, before /learn-init; produces tune/<author>/TUNE.md
/learn-init <subject>
    → /roadmap <subject>
    → /nodes <subject>/<node-name>
    → /edges <subject>/<node-name>
```

Each stage is user-invoked. `subject/node-name` is explicit so a node name never has to be unique across subjects. The roadmap stage creates lesson skeletons; the nodes stage extracts canonical elements and writes the lesson; the edges stage adds high-value relationships. A tune is a styling layer chosen per subject at `/learn-init` and applied by the writer skills.

## Core Principles

1. **Sources are immutable** — Never modify files in `sources/`. Transcripts in `tune/` are immutable the same way.
2. **Nodes teach** — Each node has one learning goal and is readable as a 10–15 minute lesson. A node may use several elements.
3. **Elements crystallize** — An element is self-contained, reusable, and anchored to `MEMORY.md` or an earlier concept. The element carries detail; the node carries the lesson narrative.
4. **Elements compound** — Reusing a concept updates its canonical element incrementally. Preserve useful existing explanations while adding supported depth, examples, connections, and sources.
5. **Edges interleave** — Edges make the learner compare, contrast, and judge instead of retrieving in isolation. Prefer a few strong relationships.
6. **Knowledge stays traceable** — Every claim points to a source, and every node records the elements it actually teaches.
7. **Voice styles, pedagogy decides** — A tune supplies the voice; `MEMORY.md` owns the language and teaching constraints. Writer skills enforce both, and content stays cited to its subject sources.

## Skills

- `/tune <author>` — read one YouTuber's transcripts in `tune/<author>/` and write their `TUNE.md` voice profile (merge lifecycle, per `docs/reference/tune.md`)
- `/learn-init <subject>` — ensure the subject's source digests exist (sub-agent path for large sources per `docs/reference/source-reading.md`), interview the learner, and write `learn/<subject>/MEMORY.md` (including language, tune, and tune-scope)
- `/roadmap <subject>` — partition the material into 10–15 minute nodes against the formula baseline, propose the full candidate list for learner confirmation, then write `ROADMAP.md` and node skeletons
- `/nodes <subject>/<node-name>` — extract or update the node's canonical elements from digests (lazy sub-agent pulls for section detail), write detailed element pages, and complete that node's lesson article
- `/edges <subject>/<node-name>` — propose and incrementally write strong edges for the node, including justified cross-node edges

## Source reading

All stages share `docs/reference/source-reading.md`. Sources are read once into two-level digests (`learn/<subject>/digests/`) — L1 chapter overviews for `learn-init`/`roadmap`, L2 section detail with `[[sources/<subject>/<file>#<section>]]` locators for `nodes`. Raw text never enters the main context wholesale:

- Large source (> 5,000 `pdftotext` lines or > ~250 KB): parallel sub-agents write part digests, merged after.
- Small source: the main context reads it directly and writes the digest itself.
- Digest lifecycle: compare the stored `source_hash`; reuse on match, rebuild on missing/mismatch. Sources are immutable, so digests are stable.

**Node count baseline.** `target = clamp(round(total_pdftotext_lines / 1100), 3, 30)`. It is a soft target for the roadmap checkpoint, not a gate — the learner confirms or adjusts the final partition.

## Tune reading

`/tune` and the writer skills share `docs/reference/tune.md`. Transcripts in `tune/<author>/` are read once into a `TUNE.md` voice profile (sub-agent per transcript; merged, never overwritten). Writer skills apply the tune through `MEMORY.md` frontmatter — `language`, `tune`, `tune-scope` — with plain tone as the fallback when no tune is set.

## Formats

The writing skills are the single source of truth for generated templates.

- **Roadmap** — `learn/<subject>/ROADMAP.md`. Frontmatter: `subject, status, created`. It indexes nodes; it does not list elements.
- **Node** — `learn/<subject>/nodes/<node-id>.mdx`. Frontmatter: `id, title, subject, tier, order, duration, status, goal, sources, elements, prerequisites, created, updated`. Sections: Learning goal · Elements · Lesson · Sources. Tiers organize nodes from general to specific; they do not enumerate elements. `prerequisites` is a list of `learn/<subject>/elements/<id>` or `learn/<subject>/nodes/<id>` stable IDs; the generator merges these with connections derived from element `Connections` sections.
- **Element** — `learn/<subject>/elements/<element-id>.mdx`. Frontmatter: `id, title, subject, tier, order, type, nodes, sources, created, updated`. `type` is `article` (default), `video`, or `question`; `video` requires `videoUrl`, `question` requires a `questions:` block (each entry has `question`, `options`, `answer` — 0-indexed). Sections: Problem Statement · Why it matters · How it works · In plain terms (optional) · Analogy (optional) · Practical use · Prerequisites (optional) · Connections · Deep dive · Questions. `Connections` and `Deep dive` stay in English; other headings render per `MEMORY.md` language.
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

## Status

The subject roadmap uses `draft → confirmed`. Each node uses:

```text
draft → confirmed → nodes-written → content-written → edges-written
```

`/roadmap` creates `draft` nodes. Invoking `/nodes <subject>/<node-id>` confirms that node automatically, then moves it through `nodes-written` and `content-written`. `/edges` asks for confirmation of its candidate edge set and only then marks the node `edges-written`.

## Operations

### Query

When the learner asks a question about a subject:

1. Search the subject's nodes, elements, and edges.
2. Synthesize an answer with stable element citations and source citations.
3. Offer to file a reusable answer as an element or edge when it adds durable knowledge.

### Lint

Periodically check `learn/<subject>/` for:

- Broken node-qualified element links or source links
- Element IDs that do not match their filenames
- Nodes whose `elements` list disagrees with article links
- Elements missing two or more connections or retrieval questions
- Orphan nodes, elements, or edges
- Contradictory or stale claims; mark stale claims `[needs update]` instead of deleting them
- Edges whose `from`, `to`, or `nodes` references no longer resolve
- Large sources missing a digest in `learn/<subject>/digests/`
- Node count deviating more than ±40% from the formula baseline
- Digest `source_hash` that no longer matches its source file
- Source locators in nodes or elements that cannot be found in the source's digest
- Prepare notes whose `node` frontmatter does not match an existing `<subject>/<node-id>`
- A `tune` in `MEMORY.md` that does not resolve to `tune/<slug>/TUNE.md`
- TUNE `files` hashes that no longer match their transcript files
- Transcripts in `tune/<author>/` with no `TUNE.md` (cannot be chosen at `/learn-init`)

## Quality Standards

- **Useful** — every node has one learner-facing goal and a readable lesson
- **Connected** — every element has at least two meaningful cross-references
- **Anchored** — every element ties to learner experience or an earlier concept
- **Checked** — every element ends with retrieval questions, including relationship and value-judgment questions
- **Current** — later nodes deepen canonical elements without erasing useful prior explanations
- **Cited** — every substantive claim traces back to an immutable source

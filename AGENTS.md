# Learning Path Schema

This repo turns raw material into customized, subject-specific lessons. A **path** is one 10–15 minute lesson article. A **node** is a reusable concept page that carries the detailed explanation behind one or more paths. **Edges** connect nodes for higher-order comparison and judgment.

## Architecture

```text
├── AGENTS.md          ← repository schema and workflow
├── CLAUDE.md          ← @AGENTS.md
├── sources/           ← raw, immutable inputs, one folder per subject
│   └── <subject>/
├── learn/             ← generated learning material, one folder per subject
│   └── <subject>/
│       ├── MEMORY.md  ← learner profile from /learn-init
│       ├── ROADMAP.md ← path index and course plan
│       ├── paths/     ← one lesson file per path
│       ├── nodes/     ← canonical concept pages
│       └── edges/     ← relationship pages between node pairs
├── wiki/              ← legacy, no longer maintained
└── *.md               ← pedagogy references
```

## Pipeline

```text
/learn-init <subject>
    → /roadmap <subject>
    → /nodes <subject>/<path-name>
    → /edges <subject>/<path-name>
```

Each stage is user-invoked. `subject/path-name` is explicit so a path name never has to be unique across subjects. The roadmap stage creates lesson skeletons; the nodes stage extracts canonical concepts and writes the lesson; the edges stage adds high-value relationships.

## Core Principles

1. **Sources are immutable** — Never modify files in `sources/`.
2. **Paths teach** — Each path has one learning goal and is readable as a 10–15 minute lesson. A path may use several nodes.
3. **Nodes crystallize** — A node is self-contained, reusable, and anchored to `MEMORY.md` or an earlier concept. The node carries detail; the path carries the lesson narrative.
4. **Nodes compound** — Reusing a concept updates its canonical node incrementally. Preserve useful existing explanations while adding supported depth, examples, connections, and sources.
5. **Edges interleave** — Edges make the learner compare, contrast, and judge instead of retrieving in isolation. Prefer a few strong relationships.
6. **Knowledge stays traceable** — Every claim points to a source, and every path records the nodes it actually teaches.

## Skills

- `/learn-init <subject>` — read `sources/<subject>/`, interview the learner, and write `learn/<subject>/MEMORY.md`
- `/roadmap <subject>` — partition the material into 10–15 minute paths, write `ROADMAP.md` and path skeletons, and ask for confirmation
- `/nodes <subject>/<path-name>` — extract or update the path's canonical nodes, write detailed node pages, and complete that path's lesson article
- `/edges <subject>/<path-name>` — propose and incrementally write strong edges for the path, including justified cross-path edges

## Formats

The writing skills are the single source of truth for generated templates.

- **Roadmap** — `learn/<subject>/ROADMAP.md`. Frontmatter: `subject, status, created`. It indexes paths; it does not list nodes.
- **Path** — `learn/<subject>/paths/<path-id>.md`. Frontmatter: `id, title, subject, tier, order, duration, status, goal, sources, nodes, created, updated`. Sections: Learning goal · Nodes · Lesson · Sources. Tiers organize paths from general to specific; they do not enumerate nodes.
- **Node** — `learn/<subject>/nodes/<node-id>.md`. Frontmatter: `id, title, subject, tier, order, paths, sources, created, updated`. Sections: Big picture · The idea · Why it matters / when it applies · Connections · Deep dive · Check yourself · Answers.
- **Edge** — `learn/<subject>/edges/<edge-id>.md`. Frontmatter: `title, type, from, to, paths, created, updated`. Sections: The relationship · Why it matters · When each applies · Interleave.

Node links use stable, path-qualified IDs with display aliases:

```markdown
[[learn/<subject>/nodes/<node-id>|<Node title>]]
```

Source links use:

```markdown
[[sources/<subject>/<file>]]
```

Path links use stable path IDs with display aliases:

```markdown
[[learn/<subject>/paths/<path-id>|<Path title>]]
```

## Status

The subject roadmap uses `draft → confirmed`. Each path uses:

```text
draft → confirmed → nodes-written → content-written → edges-written
```

`/roadmap` creates `draft` paths. Invoking `/nodes <subject>/<path-id>` confirms that path automatically, then moves it through `nodes-written` and `content-written`. `/edges` asks for confirmation of its candidate edge set and only then marks the path `edges-written`.

## Operations

### Query

When the learner asks a question about a subject:

1. Search the subject's paths, nodes, and edges.
2. Synthesize an answer with stable node citations and source citations.
3. Offer to file a reusable answer as a node or edge when it adds durable knowledge.

### Lint

Periodically check `learn/<subject>/` for:

- Broken path-qualified node links or source links
- Node IDs that do not match their filenames
- Paths whose `nodes` list disagrees with article links
- Nodes missing two or more connections or retrieval questions
- Orphan nodes, paths, or edges
- Contradictory or stale claims; mark stale claims `[needs update]` instead of deleting them
- Edges whose `from`, `to`, or `paths` references no longer resolve

## Quality Standards

- **Useful** — every path has one learner-facing goal and a readable lesson
- **Connected** — every node has at least two meaningful cross-references
- **Anchored** — every node ties to learner experience or an earlier concept
- **Checked** — every node ends with retrieval questions, including relationship and value-judgment questions
- **Current** — later paths deepen canonical nodes without erasing useful prior explanations
- **Cited** — every substantive claim traces back to an immutable source

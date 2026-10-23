# Learning Path Notes

> Turn raw learning material into customized, subject-specific Markdown courses.

This repo is a personal learning system. You put raw material in `sources/`; the agent uses your learner profile to plan lesson **nodes**, write each node's ordered **steps**, and generate each step as a readable Markdown **article**. The course viewer renders the Markdown directly — there is no HTML lesson pipeline and no MDX.

## Structure

| Path | What it is |
| --- | --- |
| `sources/<subject>/` | Raw, immutable learning material. |
| `learn/<subject>/MEMORY.md` | Learner profile from `/learn-init`, including language. |
| `learn/<subject>/ROADMAP.md` | Tiered subject index. Every node is a relative Markdown link. |
| `learn/<subject>/digests/` | One L1 overview plus an L2 line map per source. |
| `learn/<subject>/nodes/<node>.md` | Node container: frontmatter `steps` plan, `## Lesson`, and `## Steps`. |
| `learn/<subject>/nodes/<node>/<step>.md` | The step article. |
| `learn/<subject>/nodes/<node>/<step>-assets/` | Generated WebP figures. |
| `learn/<subject>/edges/` | Optional relationship pages between steps or nodes. |
| `course-app/` | React viewer; renders articles, quizzes, sources, and prev/next. |
| `legacy/` | Retired HTML/MDX pipeline, kept for reference only. |

## Pipeline

```text
/learn-init <subject>
    → /ingest <subject>              ← only when adding new source material
    → /roadmap <subject>
    → /nodes <subject>/<node-id>
    → /article <subject>/<node-id> [--images]
    → /edges <subject>/<node-id>     ← optional

/absorb <subject>                    ← integrate pending digests
```

1. **`/learn-init`** — Interview the learner, write `MEMORY.md`, extract PDFs to `.txt`, and build line-addressed digests.
2. **`/ingest`** — Archive new source files and write `pending` digests. It does not touch the roadmap, nodes, or articles.
3. **`/roadmap`** — Propose at least five learning paths, confirm one, partition the material into nodes, and write `ROADMAP.md` plus `draft` node containers.
4. **`/nodes`** — Write the node's ordered `steps` array (`id`, `title`, `purpose`, `sources`), create H1-only article skeletons, and set the node to `confirmed`.
5. **`/article`** — Generate one article per missing step from its purpose and cited source slices. `--images` plans and generates figures.
6. **`/edges`** — Add a small set of strong relationships between steps or nodes.
7. **`/absorb`** — Integrate `pending` digests by appending steps or creating nodes, then roll affected nodes back to `confirmed`.

`/practice` (generated practice sets) is out of scope. Articles may still contain a `quiz` block, which the viewer renders as an interactive question.

## Node, step, digest

- **Node** — One Markdown container with one learning goal. Its `steps` array is the teaching order; there is no `deps`, `type`, or per-step `order`.
- **Step** — One article at `learn/<subject>/nodes/<node>/<step>.md`, with no frontmatter and an H1 equal to the node's step title.
- **Digest** — A discovery layer: an L1 overview plus an L2 `#Lx-Ly` line map. Articles cite `.txt` lines, and verify checks that each citation sits inside a digest range.

Source citations use line-addressed wiki links because the CLI and verify parse them:

```markdown
[[sources/<subject>/<file>.txt#Lx-Ly]]
```

Links in documentation use standard Markdown so they resolve in an editor and on GitHub:

```markdown
[Agent Harness node](learn/agent-harness/nodes/what-a-harness-is.md)
```

## Status

```text
draft → confirmed → written
```

`/roadmap` creates `draft` nodes, `/nodes` sets `confirmed`, `/article` sets `written` once every step has a body, and `/absorb` rolls a changed node back to `confirmed`. There is no probe gate, mastery report, element page, or completion tracking.

## Verify and build

```bash
node scripts/verify.mjs --subject agent-harness
cd course-app && npm test && npm run build
```

`verify` is a hard format gate covering node frontmatter, step/article pairing, source locators and digest coverage, code provenance, quiz JSON, images, and relative links. See [docs/reference/verify.md](docs/reference/verify.md).

## Design principles

- **Sources are immutable.** Never modify files in `sources/`.
- **The node is the plan.** Step array order is teaching order.
- **The step is the article.** course-app renders the Markdown directly.
- **Everything is cited.** Substantive claims trace to immutable source lines.
- **Code is source-grounded.** Quote it verbatim or mark it `derived`.
- **Images are generated.** `/article --images` owns placement and file names.

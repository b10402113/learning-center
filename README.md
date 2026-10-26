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
| `learn/<subject>/nodes/<node>/<step>.quiz.json` | 3–8 generated single-choice questions. |
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
    → /article <subject>/<node-id> [--no-images] [--no-continuity]
    → /quiz-gen <subject>/<node-id> [--step <id>] [--force]
    → /edges <subject>/<node-id>     ← optional

/batch-nodes <subject> [tier<N> | <node-id> ...] [flags]
                                     ← optional bulk path: /nodes → /article → /quiz-gen

/absorb <subject>                    ← integrate pending digests
```

1. **`/learn-init`** — Interview the learner, write `MEMORY.md`, extract PDFs to `.txt`, and build line-addressed digests.
2. **`/ingest`** — Archive new source files and write `pending` digests. It does not touch the roadmap, nodes, or articles.
3. **`/roadmap`** — Propose at least five learning paths, confirm one, partition the material into nodes, and write `ROADMAP.md` plus `draft` node containers.
4. **`/nodes`** — Write the node's ordered `steps` array (`id`, `title`, `purpose`, `sources`), create H1-only article skeletons, and set the node to `confirmed`.
5. **`/article`** — One `publisher` subagent per step writes the original and an image plan; `article-agent` rewrites once with figures; publish writes the step and verifies; the main agent then adds continuity between steps.
6. **`/quiz-gen`** — One `quiz-agent` per published step reads the article and writes 3–8 single-choice questions; `scripts/quiz.mjs` validates and writes `<step>.quiz.json`; the viewer renders them after the article.
7. **`/batch-nodes`** — Optional bulk path over a tier or node list: parallel Nodes subagents write the step plans, batched `publisher` subagents write and publish the articles with continuity, then batched `quiz-agent` subagents write the sidecars. It resumes from node state; `-force` regenerates articles and quizzes.
8. **`/edges`** — Add a small set of strong relationships between steps or nodes.
9. **`/absorb`** — Integrate `pending` digests by appending steps or creating nodes, then roll affected nodes back to `confirmed`.

`/practice` (generated practice sets) is out of scope. Generated questions live in the `<step>.quiz.json` sidecar; the legacy `quiz` block still renders for old content.

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

`verify` is a hard format gate covering node frontmatter, step/article pairing, source locators and digest coverage, code provenance, quiz sidecars, images, and relative links. See [docs/reference/verify.md](docs/reference/verify.md).

## Design principles

- **Sources are immutable.** Never modify files in `sources/`.
- **The node is the plan.** Step array order is teaching order.
- **The step is the article.** course-app renders the Markdown directly.
- **Everything is cited.** Substantive claims trace to immutable source lines.
- **Code is source-grounded.** Quote it verbatim or mark it `derived`.
- **Images are generated.** The `publisher` decides placement while writing each step; `/article` writes the WebP files.
- **Quizzes are sidecars.** `/quiz-gen` writes `<step>.quiz.json`; the article Markdown is never modified.

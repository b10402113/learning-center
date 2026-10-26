# Learning Path Schema

This repo turns raw material into customized, subject-specific **Markdown courses**. A **node** is one Markdown container with one learning goal; its `steps` array is the whole teaching plan, in order. A **step** is a first-class Markdown article that course-app renders directly. There is no HTML lesson pipeline and no MDX.

The pilot lives in [`learn/agent-harness/`](learn/agent-harness/) — one node, two steps, two digests, line-addressed citations.

## Architecture

```text
├── AGENTS.md                 ← repository schema and workflow
├── CLAUDE.md                 ← @AGENTS.md
├── docs/reference/           ← shared protocols: source reading, verify, polish, skill scope
├── sources/                  ← raw, immutable inputs, one folder per subject
├── learn/<subject>/
│   ├── MEMORY.md             ← learner profile from /learn-init (incl. language)
│   ├── ROADMAP.md            ← tiered node index and course plan
│   ├── digests/              ← one L1 overview + L2 line map per source
│   ├── nodes/
│   │   ├── <node>.md         ← node container: frontmatter plan + lesson
│   │   └── <node>/
│   │       ├── <step>.md     ← the step article
│   │       ├── <step>.quiz.json  ← 3–8 generated single-choice questions
│   │       └── <step>-assets/image-N.webp
│   └── edges/                ← optional relationship pages between steps/nodes
├── src/                      ← article.mjs, article-cli.mjs, article-agent-bridge.mjs, quiz.mjs, llm.mjs, image-provider.mjs
├── prompts/                  ← article.txt, image-plan.txt, image.txt
├── scripts/                  ← verify.mjs, quiz.mjs, publish-article.mjs, run-article-agent.mjs, pdf-backfill.mjs, digest-status.mjs
├── article-agent/            ← git submodule: publisher-era rewrite pipeline (prompts/rewrite.txt, src/pipeline.mjs)
├── course-app/               ← React (Vite + Tailwind) course viewer
├── previews/                 ← static design previews for the course viewer
├── .opencode/agent/          ← subagent definitions (publisher, quiz-agent, …)
├── .opencode/skills/         ← active slash-command skills
├── legacy/                   ← retired HTML/MDX pipeline; no active flow imports it
└── wiki/                     ← legacy, no longer maintained
```

`src/` needs `npm install` at the repo root and a root `.env` (see [.env.example](.env.example)) holding the text and image API keys.

## Pipeline

```text
/learn-init <subject>
    → /ingest <subject>              ← add new source material: digests only
    → /roadmap <subject>
    → /nodes <subject>/<node-id>
    → /article <subject>/<node-id> [--no-images] [--no-continuity]
    → /quiz-gen <subject>/<node-id> [--step <id>] [--force]
    → /edges <subject>/<node-id>     ← optional high-value relationships

/batch-nodes <subject> [tier<N> | <node-id> ...] [flags]
                                     ← optional bulk path: /nodes → /article → /quiz-gen

/absorb <subject>                    ← integrate pending digests into the graph
```

| Stage | Role |
| --- | --- |
| `/learn-init` | Write `MEMORY.md`, extract PDFs to `.txt`, build digests (L1 + line-addressed L2). |
| `/ingest` | Archive new source files and write `pending` digests. Does not touch roadmap, nodes, or articles. |
| `/roadmap` | Propose ≥5 learning paths, confirm one, partition into nodes, write `ROADMAP.md` and `draft` node containers. |
| `/nodes` | Reasoning checkpoint per node: write the `steps` array (`id`, `title`, `purpose`, `sources`), create H1-only article skeletons, set `confirmed`. |
| `/article` | `prepare` slices each step into a material bundle; one `publisher` subagent per step writes that step's original and its 1–5 item image plan; `article-agent` rewrites once with image markers and generates the figures; `publish` writes `<step>.md` and its WebP figures, then verifies. The main agent then edits prose only to add continuity between steps. |
| `/quiz-gen` | One `quiz-agent` per published step reads the article and writes 3–8 single-choice questions; `scripts/quiz.mjs` validates and writes `<step>.quiz.json`; course-app renders them after the article. |
| `/batch-nodes` | Optional bulk path over a tier or node list: parallel Nodes subagents write the step plans, batched `publisher` subagents write and publish the articles (with continuity), then batched `quiz-agent` subagents write the sidecars. Resumes from node state; `-force` regenerates articles and quizzes. |
| `/absorb` | Read `pending` digests, append steps to existing nodes or create new nodes, mark digests `absorbed`, roll affected nodes back to `confirmed`. |
| `/edges` | Optional relationship pages between steps or nodes. |
| `/reset-nodes` | Reset chosen nodes to `confirmed`, delete generated articles and figures, keep the plan. |

`/practice` (generated practice sets) is **out of scope**. Step quizzes are generated sidecars (`<step>.quiz.json`); course-app renders them after the article. The legacy fenced `quiz` block still renders for old content, but new questions belong in the sidecar.

## Core Principles

1. **Sources are immutable** — never modify anything under `sources/`. Archived transcripts in `legacy/tune/` are immutable too.
2. **The node is the plan** — `steps` array order is teaching order. There is no `deps`, `type`, or per-step `order`.
3. **The step is the article** — `learn/<subject>/nodes/<node>/<step>.md`, with no frontmatter, opens with `# <step title>`.
4. **Citations are line-addressed** — every source link is `[[sources/<subject>/<file>#Lx-Ly]]` into a `.txt`, covered by a digest L2 range. PDFs are never cited.
5. **Verify is the format gate** — `scripts/verify.mjs` is the single source of truth; every format rule is a hard failure with a negative fixture.
6. **No HTML, no MDX** — the course-app renders Markdown. Nothing in the active flow imports from `legacy/`.
7. **Code is source-grounded** — quote source code verbatim when the source has it, write it from the prose otherwise, and mark every fenced block with `<!-- source: sources/…#Lx-Ly -->` or `<!-- derived -->`.
8. **Images are generated, not hand-placed** — the `publisher` decides the image plan while writing each step, and `/article` writes `image-N.webp`; it reuses existing files on rerun.
9. **Quizzes are sidecars** — `/quiz-gen` writes `<step>.quiz.json`; the article Markdown stays untouched, and course-app renders the questions after the article.

## Formats

### Roadmap — `learn/<subject>/ROADMAP.md`

Frontmatter: `subject`, `status`, `created` (optionally `path`). The body groups nodes into `### Tier N — <name>` sections. Every node line is a standard relative Markdown link:

```markdown
1. **[Agent Harness：LLM 之外的那些東西](nodes/what-a-harness-is.md)**
```

### Node — `learn/<subject>/nodes/<node-id>.md`

```yaml
---
id: what-a-harness-is
title: "Agent Harness：LLM 之外的那些東西"
subject: agent-harness
tier: 1
order: 1
status: written            # draft | confirmed | written
goal: "建立 agent = LLM + harness 的心智模型。"
prerequisites: []
steps:
  - id: harness-is-the-product
    title: "Harness 才是產品：LLM 之外的基礎設施"
    purpose: "能用「LLM + harness」解釋 agent，並說出 memory、tools、long-running 為什麼屬於 harness。"
    sources:
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L7-L25]]"
created: 2026-10-22
updated: 2026-10-22
---
```

Rules:

- `id` equals the filename; `subject` equals the subject argument.
- `steps` is an ordered array; each entry has exactly `id`, `title`, `purpose`, `sources`.
- `purpose` is one short sentence (≤ 120 characters), not an article summary.
- A `draft` node may have `steps: []`; `confirmed` and `written` need at least one step.
- The body is `# <title>`, a short `## Lesson`, and a `## Steps` list whose titles, ids, and order match the frontmatter. Links are relative to the node file.
- There is no node-level `sources` field; sources live on step entries.
- `prerequisites` holds stable node paths such as `learn/<subject>/nodes/<id>.md`.

### Step article — `learn/<subject>/nodes/<node-id>/<step-id>.md`

- No frontmatter. The first non-empty line is `# <step title>`.
- Free length and free `##` sections; Traditional Chinese, short paragraphs, editorial tone.
- Do **not** write a source list or inline citations — course-app aggregates the step's sources below the article.
- Do **not** write a practice section or inline quiz. Generated questions live in the sibling `<step>.quiz.json`.
- Images: `![第 N 段配圖](./<step>-assets/image-N.webp)` followed by `*AI 生成示意圖*`.
- Every fenced code block needs a provenance comment immediately above it. The legacy `quiz` fence is data and carries none.

### Quiz sidecar — `learn/<subject>/nodes/<node-id>/<step-id>.quiz.json`

```json
{
  "quiz-generated": true,
  "questions": [
    {
      "question": "...",
      "options": ["...", "..."],
      "answer": 1,
      "explain": "..."
    }
  ]
}
```

One file per step. `questions` has 3–8 entries; every entry has a non-empty `question`, 2–5 non-empty `options`, a 0-based integer `answer`, and a non-empty `explain`. `/quiz-gen` writes this file; course-app renders the questions after the article and before the source list. The file is not merged into the Markdown.

The legacy fenced `quiz` block is still accepted by the renderer and `verify`, but new content should not add one.

### Digest — `learn/<subject>/digests/<stem>.md`

```markdown
---
source: sources/<subject>/<path>.txt
source_type: text
source_lines: 216
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

- <key point>

# L2 detail

- `#L1-L11` — <what these lines explain>
- `#L12-L25` — <what these lines explain>
```

PDFs are extracted once into a sibling `.txt` by `node scripts/pdf-backfill.mjs --subject <subject>`; an existing `.txt` is never overwritten. Citations point at the `.txt`, and `source_lines` equals its actual line count. Digest `status` is `pending | absorbed`.

### Edge — `learn/<subject>/edges/<edge-id>.md`

Frontmatter: `title`, `type`, `from`, `to`, `nodes`, `created`, `updated`. `from` and `to` are node-qualified step ids (`<node>/<step>`), or node ids when the edge compares whole nodes. Sections: The relationship · Why it matters · When each applies · Interleave.

### Course viewer

`course-app/` reads `learn/` directly. The node page lists steps in `steps` array order and marks a step without a body as `尚未產生`. The step page renders the Markdown article, turns a fenced `quiz` block into an interactive question, renders the `<step>.quiz.json` questions under a `自我檢查` section, resolves figures under `<step>-assets/`, aggregates the step's sources at the end, and shows prev/next links in array order. There is no status badge or progress tracking.

## Status

```text
draft → confirmed → written
```

- `/roadmap` creates `draft` nodes with `steps: []`.
- `/nodes` writes the ordered step plan and sets `confirmed`.
- `/article` sets `written` once every step in the node has an article body.
- `/absorb` may add a step and rolls the node back to `confirmed`; rerun `/article` for the new step.

There is no probe gate, mastery report, element page, or completion tracking in the data model.

## Operations

### Article and image generation

```bash
node src/article-cli.mjs prepare --subject <s> --node <n> [--step <id>] [--force]
node src/article-cli.mjs publish --subject <s> --node <n> [--step <id>] [--force]
node src/article-cli.mjs article --subject <s> --node <n> [--step <id>] [--force] [--images]
node src/article-cli.mjs image   --subject <s> --node <n> [--step <id>] [--force] [--plan-only]
```

- Default engine: `prepare` writes one material bundle per missing step to `learn/<subject>/output/materials/`; one `publisher` subagent per step writes that step's original under `learn/<subject>/output/jobs/` and its `plan` to `learn/<subject>/output/image-plans/<node>/<step>.json`; `run-article-agent.mjs` validates the plan, protects code blocks, and runs `article-agent`'s single rewrite plus the figures; `publish` restores the code, converts the figures to WebP under `<step>-assets/`, rewrites their links, normalizes the H1, writes `learn/<subject>/nodes/<node>/<step>.md`, and runs verify.
- The main agent then reads the published steps in order and edits prose only (openings, handoffs, repeated term definitions); it never moves code blocks, image lines, `quiz` blocks, or the H1.
- The subtitle `article` command remains as a deprecated single-request engine: one text request per missing step, straight from the cited source slices.
- Missing or H1-only articles are generated; articles with a body are skipped unless `--force`.
- The `publisher` decides how many figures a step gets (1–5), spread across the article; `--no-images` skips the plan requirement and the figures entirely.
- Existing images are reused; a second run with no changes makes no image requests.
- `image --plan-only` writes the plan to `learn/<subject>/output/image-plans/<node>/<step>.json` and generates nothing; edit it, then rerun `image` to generate from that plan. `--plan-only --force` rebuilds the plan; plain `--force` regenerates images from the current plan.
- The CLI prints JSON per-step status plus the verify result.

### Quiz generation

```bash
node scripts/quiz.mjs prepare --subject <s> --node <n> [--step <id>] [--force]
node scripts/quiz.mjs write   --subject <s> --node <n> --step <id> --input <file|-> [--force]
node scripts/quiz.mjs status  --subject <s> --node <n>
```

- `/quiz-gen` runs `prepare`, dispatches one `quiz-agent` per ready step, writes the agent's JSON to `learn/<subject>/output/quiz-candidates/`, then runs `write` to validate and publish `<step>.quiz.json`.
- Each step gets 3–8 questions. The length ceiling is `min(8, max(3, round(CJK字數 / 250)))`; an article that cannot support 3 distinct questions fails instead of padding.
- `prepare` skips existing quiz files unless `--force`; `write` refuses to overwrite without `--force`.
- Nothing is inserted into the article Markdown. Regenerate course-app data with `npm --prefix course-app run gen`.
- After a batch, run `node scripts/verify.mjs --node <subject>/<node>`.

### PDF backfill

```bash
node scripts/pdf-backfill.mjs --subject <subject> [--dry-run]
```

Idempotent: existing `.txt` files are not overwritten, so line numbers stay stable.

### Node reset

```bash
node scripts/reset-nodes.mjs --subject <subject> (--all | --tier <n> | --node <id> ...) [--dry-run]
```

Keeps each node container and its step plan; sets `status: confirmed`, rewrites every step article as a bare H1 skeleton, removes figures, and deletes the node's intermediate `output/` artifacts (material bundles, job files, image plans, article-agent run folders, quiz candidates). `/article` then regenerates the bodies from scratch.

### Lint

```bash
node scripts/verify.mjs --subject <subject>
node scripts/verify.mjs --node <subject>/<node-id>
```

It checks format only: node frontmatter, `id`/filename, status, flat step entries, step/article pairing, H1, `## Steps`, source locators and digest coverage, code provenance, quiz sidecars, image files and orphans, relative links, and `.mdx` absence. See [docs/reference/verify.md](docs/reference/verify.md). Content judgment stays with the learner.

### Query

When the learner asks a question about a subject:

1. Search the subject's `ROADMAP.md`, nodes, step articles, and edges.
2. Answer in the subject's `MEMORY.md` language, citing the step article and its source ranges.

## Quality Standards

- **Useful** — every node has one learner-facing goal; every step is a readable article.
- **Connected** — edges compare steps or nodes that are worth contrasting.
- **Anchored** — every article starts from the reader's situation and stays with the subject's sources.
- **Checked** — `verify` passes for the node and the whole subject.
- **Current** — later articles deepen earlier ones without erasing useful explanations.
- **Cited** — every substantive claim traces to an immutable source line range.

## Source links vs. document links

Source citations in YAML keep the wiki-link form, because the CLI and verify parse it:

```markdown
[[sources/<subject>/<file>.txt#Lx-Ly]]
```

Links inside documentation use standard Markdown so they work in an editor and on GitHub:

```markdown
[Agent Harness node](learn/agent-harness/nodes/what-a-harness-is.md)
```

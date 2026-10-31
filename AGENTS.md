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
│   │       ├── <step>.md     ← the step article: text + <!--image:N--> markers
│   │       ├── <step>.quiz.json  ← 3–8 generated single-choice questions
│   │       └── <step>-assets/image-N.webp  ← written by /generate-images
│   ├── output/               ← generated intermediates (ignored by git)
│   │   ├── image-plans/<node>/<step>.json  ← the only image plan
│   │   ├── humanized/<node>/<step>.json    ← humanize record
│   │   └── humanize/<node>/<step>/         ← humanize workspace
│   └── edges/                ← optional relationship pages between steps/nodes
├── src/                      ← article.mjs, article-cli.mjs, render-images.mjs, article-agent-bridge.mjs, quiz.mjs, llm.mjs, image-provider.mjs
├── prompts/                  ← article.txt, image-plan.txt, image.txt
├── scripts/                  ← verify.mjs, quiz.mjs, publish-article.mjs, run-article-agent.mjs, set-step-title.mjs, humanize-article.mjs, pdf-backfill.mjs, digest-status.mjs, backfill-node-digests.mjs
├── article-agent/            ← git submodule: publisher-era rewrite pipeline (prompts/rewrite.txt, src/pipeline.mjs)
├── course-app/               ← React (Vite + Tailwind) course viewer
├── previews/                 ← static design previews for the course viewer
├── .opencode/agent/          ← subagent definitions (publisher, humanize-article, quiz-agent, …)
├── .opencode/skills/         ← active slash-command skills (article, humanize-article, generate-images, quiz-gen, …)
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
    → /article <subject>/<node-id> [--no-continuity]
    → /humanize-article <subject>/<node-id> [--step <id>] [--force]
    → /generate-images <subject>/<node-id> [--step <id>] [--force] [--max-parallel <n>]
    → /quiz-gen <subject>/<node-id> [--step <id>] [--force]
    → /edges <subject>/<node-id>     ← optional high-value relationships

/batch-nodes <subject> [tier<N> | <node-id> ...] [flags]
                                     ← optional bulk path: /nodes → /article
                                       → /humanize-article → /generate-images → /quiz-gen

/absorb <subject>                    ← integrate pending digests into the graph
```

| Stage | Role |
| --- | --- |
| `/learn-init` | Write `MEMORY.md`, extract PDFs to `.txt`, build digests (L1 + line-addressed L2), including code and image supplements. |
| `/ingest` | Archive new source files and write `pending` digests. Does not touch roadmap, nodes, or articles; a `pending` digest makes the subject check fail until `/absorb` resolves it. |
| `/roadmap` | Propose ≥5 learning paths, confirm one, partition into nodes, write `ROADMAP.md` and `draft` node containers with their `digests` lists, and resolve every read digest to `absorbed` or `skipped`. |
| `/nodes` | Reasoning checkpoint per node: write the `steps` array (`id`, `purpose`, `sources`), create empty article skeletons, set `confirmed`. The publisher writes each title with its article. |
| `/article` | `prepare` writes each step's material bundle — its purpose plus the source files it cites; one `publisher` subagent per step reads those sources in full, writes that step's original and its 1–5 item image plan, chooses its title, and runs `titleCommand` to write the title back to the node; `article-agent` rewrites once and leaves `<!--image:N-->` markers; `publish` writes `<step>.md` and verifies. It never calls the image model and never creates `<step>-assets/`. The main agent then edits prose only to add continuity between steps. |
| `/humanize-article` | Processes only steps with a plan: a `humanize-article` subagent rewrites the article and the plan's `heading` / `prompt` in a workspace; `scripts/humanize-article.mjs` validates the protected parts, writes both files back, and records their hashes in `output/humanized/`. Reruns skip recorded steps; `--force` redoes them. |
| `/generate-images` | Thin shell over `src/render-images.mjs`: reads the plan and the article's `<!--image:N-->` markers, generates or reuses `image-N.webp` under `<step>-assets/`, and replaces each marker with an uncaptioned image line. With `--force` it also repaints the files behind existing image lines. It never plans, edits prose, or reads `anchor`. |
| `/quiz-gen` | One `quiz-agent` per published step reads the article and writes 3–8 single-choice questions; `scripts/quiz.mjs` validates and writes `<step>.quiz.json`; course-app renders them after the article. |
| `/batch-nodes` | Optional bulk path over a tier or node list: Nodes → Article → Humanize → Generate → Quiz. Parallel Nodes, `publisher`, `humanize-article`, and `quiz-agent` subagents do the writing; Generate is one render CLI call per node. Resumes from node state; `-force` regenerates generated content without rebuilding a node's step plan. |
| `/absorb` | Read `pending` digests, append steps to existing nodes or create new nodes, add each used digest to the node's `digests`, resolve every digest to `absorbed` or `skipped`, roll affected nodes back to `confirmed`. |
| `/edges` | Optional relationship pages between steps or nodes. |
| `/reset-nodes` | Reset chosen nodes to `confirmed`, delete generated articles and figures, keep the plan. |

`/practice` (generated practice sets) is **out of scope**. Step quizzes are generated sidecars (`<step>.quiz.json`); course-app renders them after the article. The legacy fenced `quiz` block still renders for old content, but new questions belong in the sidecar.

## Core Principles

1. **Sources are immutable** — never modify anything under `sources/`. Archived transcripts in `legacy/tune/` are immutable too.
2. **The node is the plan** — `steps` array order is teaching order. There is no `deps`, `type`, or per-step `order`.
3. **The step is the article** — `learn/<subject>/nodes/<node>/<step>.md`, with no frontmatter, opens with the H1 the publisher chose and wrote back to the step entry.
4. **Citations are line-addressed** — every source link is `[[sources/<subject>/<file>#Lx-Ly]]` into a `.txt`, covered by a digest L2 range. PDFs are never cited.
5. **Verify is the format gate** — `scripts/verify.mjs` is the single source of truth; every format rule is a hard failure with a negative fixture.
6. **No HTML, no MDX** — the course-app renders Markdown. Nothing in the active flow imports from `legacy/`.
7. **Code is source-grounded** — quote source code verbatim when the source has it, write it from the prose otherwise, and mark every fenced block with `<!-- source: sources/…#Lx-Ly -->` or `<!-- derived -->`.
8. **Images are rendered from a plan, not hand-placed** — the `publisher` decides the 1–5 item image plan while writing each step and `/article` leaves `<!--image:N-->` markers; `/generate-images` alone turns those markers into `image-N.webp` and reuses existing files on rerun.
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
digests:
  - 1-what-is-an-agent-harness.md
prerequisites: []
steps:
  - id: harness-is-the-product
    purpose: "能用「LLM + harness」解釋 agent，並說出 memory、tools、long-running 為什麼屬於 harness。"
    sources:
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L7-L25]]"
created: 2026-10-22
updated: 2026-10-22
---
```

Rules:

- `id` equals the filename; `subject` equals the subject argument.
- `steps` is an ordered array; a planned entry has exactly `id`, `purpose`, `sources`. The publisher adds `title` when it writes the article, and that title is the article's H1.
- `purpose` is one short sentence (≤ 120 characters), not an article summary.
- A `draft` node may have `steps: []`; `confirmed` and `written` need at least one step.
- The body is `# <title>`, a short `## Lesson`, and a `## Steps` list whose ids and order match the frontmatter. Each link label is the step's `title` once published, and the step `id` while the article is still unwritten. Links are relative to the node file.
- There is no node-level `sources` field; sources live on step entries.
- `digests` lists the digest filenames this node teaches; `/roadmap` declares it up front and `/nodes` and `/absorb` keep it true. Every step source must come from a declared digest, a declared digest must be `absorbed`, and a `confirmed`/`written` node may not declare a digest no step cites.
- `prerequisites` holds stable node paths such as `learn/<subject>/nodes/<id>.md`.

### Step article — `learn/<subject>/nodes/<node-id>/<step-id>.md`

- No frontmatter. The first non-empty line is the H1, written by the publisher and identical to the step entry's `title`.
- Free length and free `##` sections; Traditional Chinese, short paragraphs, editorial tone.
- Do **not** write a source list or inline citations — course-app aggregates the step's sources below the article.
- Do **not** write a practice section or inline quiz. Generated questions live in the sibling `<step>.quiz.json`.
- Before rendering, each planned figure is an `<!--image:N-->` marker on its own line, surrounded by blank lines, numbered 1..N in plan order.
- After `/generate-images`, each marker becomes `![第 N 段配圖](./<step>-assets/image-N.webp)`. New figures carry no caption; the legacy `*AI 生成示意圖*` line may remain only on old articles.
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
status: absorbed         # pending | absorbed | skipped
absorbed_at: 2026-10-22
skip_reason: ""          # required non-empty when status is skipped
supplements:            # optional; a supplement digest plus its L1 or L2 entry
  - <dir-stem>.md#Lx-Ly
  - <image-stem>.md#L1
---

# L1 overview

- <key point>

# L2 detail

- `#L1-L11` — <what these lines explain>
- `#L12-L25` — <what these lines explain>
```

PDFs are extracted once into a sibling `.txt` by `node scripts/pdf-backfill.mjs --subject <subject>`; an existing `.txt` is never overwritten. Citations point at the `.txt`, and `source_lines` equals its actual line count. Digest `status` is `pending | absorbed | skipped`; `skipped` means the material was read and deliberately left untaught, and it needs a non-empty `skip_reason`. A subject check fails on any `pending` digest, on an `absorbed` digest no node lists, and on a text digest skipped while its supplement stays absorbed. A `text` digest may list `supplements` — sibling `codebase` or `image` digests plus the L1 (`<digest>.md#L1`) or L2 (`<digest>.md#Lx-Ly`) entry that carries the code or figures the text refers to.

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

### Article, humanize, and image generation

```bash
node src/article-cli.mjs prepare --subject <s> --node <n> [--step <id>] [--force]
node src/article-cli.mjs publish --subject <s> --node <n> [--step <id>] [--force]
node src/article-cli.mjs render  --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>]
node scripts/humanize-article.mjs prepare --subject <s> --node <n> [--step <id>] [--force]
node scripts/humanize-article.mjs apply   --subject <s> --node <n> --step <id> [--summary <text>]
node src/article-cli.mjs article --subject <s> --node <n> [--step <id>] [--force] [--images]  (deprecated)
node src/article-cli.mjs image   --subject <s> --node <n> [--step <id>] [--force] [--plan-only]  (deprecated)
```

- `prepare` writes one material bundle per missing step to `learn/<subject>/output/materials/`; each bundle carries the step's `purpose` and `sources` as `{path, locator}` pointers, not source text; one `publisher` subagent per step reads every cited source file in full, writes that step's original under `learn/<subject>/output/jobs/` and its plan to `learn/<subject>/output/image-plans/<node>/<step>.json`; `run-article-agent.mjs --markers-only` validates the plan, protects code blocks, and runs `article-agent`'s single rewrite, which leaves `<!--image:N-->` markers. It never generates figures.
- `publish` restores the code, keeps the markers, normalizes the H1, writes `learn/<subject>/nodes/<node>/<step>.md`, marks the node `written`, and runs verify. It never syncs, copies, or deletes `<step>-assets/` unless `--force` succeeds. With `--force`, a successful write clears that step's stale `image-N.webp` files and humanize record.
- The main agent then reads the published steps in order and edits prose only (openings, handoffs, repeated term definitions); it never moves code blocks, `<!--image:N-->` markers, image lines, `quiz` blocks, or the H1.
- Missing or H1-only articles are generated; articles with a body are skipped unless `--force`.
- `humanize-article.mjs prepare` copies each eligible step's article and plan into `output/humanize/<node>/<step>/`, skipping steps without an article, without a plan, without a marker or image line, or with a matching record. `apply` validates the workspace against its backup (H1, markers, image lines, code, provenance, quiz, links, plan length/order/`anchor`), writes the article and plan back, records both sha256 hashes in `output/humanized/<node>/<step>.json`, and removes the workspace. A failed validation leaves the official files untouched and keeps the workspace.
- `render` reads the plan and the article's markers. It generates only the missing `image-N.webp` files, reuses existing ones, and replaces each marker with `![第 N 段配圖](./<step>-assets/image-N.webp)` — no caption. It does not plan, edit prose, or read `anchor`. It needs an image key but no text key. If the step's humanize record still matches the pre-render article, `render` refreshes that record's article hash so a later humanize run still reports `skipped-record`.
- The legacy `article` and `image` commands are deprecated. They remain usable for repairs on old articles but are not part of the current pipeline; `image --plan-only` still writes the shared plan path.
- The CLI prints JSON per-step status plus the verify result.

### Batch pipeline

`/batch-nodes` runs Nodes → Article → Humanize → Generate → Quiz and gates each phase before dispatching. Flags: `-max-subagents N` (default 3), `-nodes-only`, `-skip-article`, `-skip-humanize`, `-skip-images`, `-skip-quiz`, `-no-continuity`, `-force`. `-no-images` is removed; use `-skip-images` to skip rendering. `-force` regenerates generated content but never rebuilds a node's step plan. Failure propagates downstream: a failed Article node leaves Humanize, Generate, and Quiz; a failed Humanize node leaves Generate and Quiz; a failed Generate node leaves Quiz. Successful files stay in place.

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

### Digest status and coverage

```bash
node scripts/digest-status.mjs <subject>                    # list digests, the nodes that use them, and coverage
node scripts/digest-status.mjs <subject> --set absorbed
node scripts/digest-status.mjs <subject> --set skipped --reason "<why it is not used>"
node scripts/digest-status.mjs <subject> --from pending --to absorbed

node scripts/backfill-node-digests.mjs [--subject <s>] [--write] [--skip-unused --reason "<text>"]
```

`digest-status` prints one row per digest: status, the nodes whose `digests` list it, and its `skip_reason`; the footer counts absorbed, pending, skipped, and absorbed digests no node claims. `skipped` requires `--reason`. `backfill-node-digests` derives each node's `digests` from its step sources — dry run by default, `--write` applies it, and with `--skip-unused --reason` it also marks absorbed digests that no node claims as `skipped`. It never overwrites a step-less node's existing declarations.

### PDF backfill

```bash
node scripts/pdf-backfill.mjs --subject <subject> [--dry-run]
```

Idempotent: existing `.txt` files are not overwritten, so line numbers stay stable.

### Node reset

```bash
node scripts/reset-nodes.mjs --subject <subject> (--all | --tier <n> | --node <id> ...) [--dry-run]
```

Keeps each node container and its step plan; sets `status: confirmed`, rewrites every step article as an empty skeleton, removes step titles from the plan, removes figures, and deletes the node's intermediate `output/` artifacts (material bundles, job files, the formal image plans, humanize records and workspaces, article-agent run folders, quiz candidates). `/article` then regenerates the bodies and plans from scratch, and `/generate-images` renders the figures.

### Lint

```bash
node scripts/verify.mjs --subject <subject>
node scripts/verify.mjs --node <subject>/<node-id>
```

It checks format only: node frontmatter, `id`/filename, status, flat step entries, step/article pairing, the publisher-written title and H1, `## Steps`, source locators and digest coverage, node ↔ digest declarations (`node-digest-unknown`, `node-digest-status`, `node-digest-undeclared`, `node-digest-unused`, `digest-unreferenced`, `digest-pending`, `digest-skip-reason`), code provenance, quiz sidecars, image files and orphans, relative links, and `.mdx` absence. See [docs/reference/verify.md](docs/reference/verify.md). Content judgment stays with the learner.

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

# Learning Path Schema

This repo turns raw material into customized, subject-specific **Markdown courses**. A **node** is one Markdown container with one learning goal; its `steps` array is the whole teaching plan, in order. A **step** is a first-class Markdown article that course-app renders directly. There is no HTML lesson pipeline and no MDX.

The pilot lives in [`learn/agent-harness/`](learn/agent-harness/) — one node, two steps, two digests, line-addressed citations.

## Architecture

```text
├── AGENTS.md                 ← repository schema and workflow
├── CLAUDE.md                 ← @AGENTS.md
├── docs/reference/           ← shared protocols: source reading, verify, polish, skill scope
├── sources/                  ← raw inputs, one folder per subject; a dated folder holds course/, supplement/, and raw/ (or the legacy flat layout)
├── learn/<subject>/
│   ├── MEMORY.md             ← learner profile from /learn-init (incl. language)
│   ├── ROADMAP.md            ← tiered node index and course plan
│   ├── digests/              ← one L1 overview + L2 line map per source
│   ├── nodes/
│   │   ├── <node>.md         ← node container: frontmatter plan + lesson
│   │   └── <node>/
│   │       ├── <step>.md     ← the step article: text + <!--image:N--> markers
│   │       ├── <step>.plan.json   ← the 1–5 item image plan (tracked)
│   │       ├── <step>.quiz.json  ← 3–8 generated single-choice questions
│   │       └── <step>-assets/image-N.webp  ← written by /generate-images
│   ├── output/               ← generated intermediates (ignored by git)
│   │   └── <node>/
│   │       ├── prepare.json
│   │       ├── teaching-plan.md
│   │       └── <step>/
│   │           ├── material.json  ← the step's purpose plus the publisher's curated source text
│   │           ├── original.md    ← composed by the CLI text model, never rewritten
│   │           ├── polish.md      ← polished draft (publish reads this)
│   │           ├── humanized.md   ← humanize work copy, copied back only after validation
│   │           ├── humanized.plan.json  ← humanize work copy of the plan
│   │           └── blocks.json / request.json / result.json / compose.json
│   └── blocks/               ← standalone knowledge blocks and coverage.json
├── src/                      ← article.mjs, article-cli.mjs, render-images.mjs, article-agent-bridge.mjs, quiz.mjs, llm.mjs, image-provider.mjs
├── prompts/                  ← article.txt, image-plan.txt, image.txt
├── scripts/                  ← verify.mjs, blocks.mjs, quiz.mjs, publish-article.mjs, run-article-agent.mjs, set-step-title.mjs, humanize-article.mjs, transcript-backfill.mjs, pdf-backfill.mjs, split-sources.mjs, classify-sources.mjs, digest-status.mjs, backfill-node-digests.mjs
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

/batch-nodes <subject> [tier<N> | <node-id> ...] [flags]
                                     ← optional bulk path: /nodes → /article
                                       → /humanize-article → /generate-images → /quiz-gen

/absorb <subject>                    ← integrate pending digests into the graph
```

| Stage | Role |
| --- | --- |
| `/learn-init` | Write `MEMORY.md` with `source_layout: course-supplement`, convert subtitles and PDFs to `.txt`, split long sources and books, classify every file into `course/`, `supplement/`, or `raw/`, then build digests (L1 + line-addressed L2), including code and image supplements. |
| `/ingest` | Archive new source files, convert subtitles and PDFs, split and classify them, then write `pending` digests. Does not touch roadmap, nodes, or articles; a `pending` digest makes the subject check fail until `/absorb` resolves it. |
| `/roadmap` | Propose ≥5 learning paths, confirm one, partition into nodes, confirm the prerequisite DAG, write `ROADMAP.md` and `draft` node containers with their `digests` lists and `prerequisites`, and resolve every read digest to `absorbed` or `skipped`. |
| `/nodes` | Reasoning checkpoint per node: write the `steps` array (`id`, `purpose`, `sources`), create empty article skeletons, set `confirmed`. The compose model writes each title with its article. |
| `/article` | `prepare` writes each step's material bundle into `output/<node>/<step>/` — its purpose plus the source files it cites; one `publisher` subagent per step reads those sources in full and curates the material (all cited course text plus short supplement prose and code excerpts, each piece keeping `path`/`locator`; long code keeps the head and tail with `...` in the middle), runs `article-cli compose` to have the text model choose the H1 from the purpose and write `original.md` (no image markers), reads `original.md` to write the 1–5 item plan to `nodes/<node>/<step>.plan.json`, runs `article-cli mark` to insert the `<!--image:N-->` markers, then runs `polish-article.mjs draft` to write `polish.md` and polish the plan while keeping the markers, and `titleCommand` to write the title back to the node; `publish` writes `<step>.md` from `polish.md` and verifies. It calls the text model for compose and polish but never the image model, and never creates `<step>-assets/`. The main agent then edits prose only to add continuity between steps. |
| `/humanize-article` | Processes only steps with a plan: `scripts/humanize-article.mjs prepare` copies `step.md` to `output/<node>/<step>/humanized.md` and the plan to `humanized.plan.json`; a humanize subagent edits only those copies; `apply` validates the protected parts and only then writes `step.md` and the plan back. A failed validation leaves the official files untouched and keeps the copies. There is no hash record and no separate plan backup. |
| `/generate-images` | Thin shell over `src/render-images.mjs`: reads the plan and the article's `<!--image:N-->` markers, generates or reuses `image-N.webp` under `<step>-assets/`, and replaces each marker with an uncaptioned image line. With `--force` it also repaints the files behind existing image lines. It never plans, edits prose, or reads `anchor`. |
| `/quiz-gen` | One `quiz-agent` per node reads its published steps and writes 3–8 single-choice questions each; the agent self-checks candidates with `quiz.mjs check`; `quiz.mjs write` validates and writes `<step>.quiz.json`; course-app renders them after the article. |
| `/batch-nodes` | Optional bulk path over a tier or node list: Nodes → Article → Humanize → Generate → Quiz. Parallel Nodes, `publisher`, humanize, and `quiz-agent` subagents do the writing; Generate is one render CLI call per node. Article dispatches one publisher per step, or one per node with `-article-per-node`; the publisher curates material and runs `compose`/`mark`/`polish`, and `-skip-polish` publishes the first draft through a `--copy` polish. Resumes from node state; `-force` regenerates generated content without rebuilding a node's step plan. |
| `/absorb` | Read `pending` digests, append steps to existing nodes or create new nodes, add each used digest to the node's `digests`, resolve every digest to `absorbed` or `skipped`, roll affected nodes back to `confirmed`. |
| `/reset-nodes` | Reset chosen nodes to `confirmed`, delete generated articles, image plans, figures and quizzes, keep the node container and its step array. |

`/practice` (generated practice sets) is **out of scope**. Step quizzes are generated sidecars (`<step>.quiz.json`); course-app renders them after the article. The legacy fenced `quiz` block still renders for old content, but new questions belong in the sidecar.

## Core Principles

1. **Sources are immutable** — never edit anything under `sources/` by hand. The exceptions are the scripts that generate derived files: `scripts/transcript-backfill.mjs` writes sibling `.txt` transcripts, `scripts/pdf-backfill.mjs` writes sibling `.txt` extractions, `scripts/split-sources.mjs` replaces a long `.txt` with generated part files and a `<stem>.parts.json` manifest, and `scripts/classify-sources.mjs` moves files into `course/`, `supplement/`, and `raw/`. Archived transcripts in `legacy/tune/` are immutable too.
2. **The node is the plan** — `steps` array order is teaching order. There is no `deps`, `type`, or per-step `order`.
3. **The step is the article** — `learn/<subject>/nodes/<node>/<step>.md`, with no frontmatter, opens with the H1 the publisher chose and wrote back to the step entry.
4. **Citations are line-addressed** — every source link is `[[sources/<subject>/<date>/<role>/<file>#Lx-Ly]]` into a `.txt` under `course/` or `supplement/`, covered by a digest L2 range. `raw/` originals and PDFs are never cited.
5. **Verify is the format gate** — `scripts/verify.mjs` is the single source of truth; every format rule is a hard failure with a negative fixture.
6. **No HTML, no MDX** — the course-app renders Markdown. Nothing in the active flow imports from `legacy/`.
7. **Code is source-grounded** — quote a short excerpt of the source code (keep head and tail, elide the middle with a single `...`) when the source has it, write it from the prose otherwise, and mark every fenced block with `<!-- source: sources/…#Lx-Ly -->` or `<!-- derived -->`.
8. **Images are rendered from a plan, not hand-placed** — the `publisher` curates the material and, after `article-cli compose` writes the article, reads `original.md` to write the 1–5 item image plan to `nodes/<node>/<step>.plan.json`; `article-cli mark` then inserts the `<!--image:N-->` markers; `/generate-images` alone turns those markers into `image-N.webp` and reuses existing files on rerun.
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
- `steps` is an ordered array; a planned entry has exactly `id`, `purpose`, `sources`. The compose model decides the H1 from the purpose; `publish`/`titleCommand` add `title` to the entry, and that title is the article's H1. `publish` also adds optional `author`: the `TEXT_MODEL` recorded by `compose` in `compose.json` (falling back to the current env), so each step records which model wrote its `original.md`.
- `purpose` is one short sentence (≤ 120 characters), not an article summary.
- A `draft` node may have `steps: []`; `confirmed` and `written` need at least one step.
- The body is `# <title>`, a short `## Lesson`, and a `## Steps` list whose ids and order match the frontmatter. Each link label is the step's `title` once published, and the step `id` while the article is still unwritten. Links are relative to the node file.
- There is no node-level `sources` field; sources live on step entries. In a `course-supplement` subject every step cites at least one `course/` source; a recap step may reuse an earlier course range.
- `digests` lists the digest filenames this node teaches; `/roadmap` declares it up front and `/nodes` and `/absorb` keep it true. Every step source must come from a declared digest, a declared digest must be `absorbed`, and a `confirmed`/`written` node may not declare a digest no step cites.
- `prerequisites` is the node-level prerequisite DAG: the earlier nodes a reader should finish first, as stable paths such as `learn/<subject>/nodes/<id>.md`, or `[]` for a root. `/roadmap` proposes the prerequisite links at its confirmation checkpoint. A prerequisite stays inside the subject, points at an existing node that is not the node itself, never creates a cycle, and never points at a later tier.

### Step article — `learn/<subject>/nodes/<node-id>/<step-id>.md`

- No frontmatter. The first non-empty line is the H1, chosen by the compose model and identical to the step entry's `title`.
- Free length and free `##` sections; Traditional Chinese, short paragraphs, editorial tone.
- In a `course-supplement` subject the article must cover the cited `course/` range completely. `supplement/` material only supports explanation, code, and figures.
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
source: sources/<subject>/<date>/<course|supplement>/<path>.txt   # or <path>.<n>.part.txt when split
source_type: text
source_lines: 216                        # the cited file's actual line count
part: 2                                  # optional; manifest part number when split
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

A digest `source` always points into `course/` or `supplement/`; a `raw/` original never gets a digest. Subtitles are converted to `.txt` by `node scripts/transcript-backfill.mjs --subject <subject>`, and PDFs are extracted once into a sibling `.txt` by `node scripts/pdf-backfill.mjs --subject <subject>`; an existing `.txt` is never overwritten. A text source over 3,000 lines or 250 KB (and a book whose chapters need separate roles) is split by `node scripts/split-sources.mjs --subject <subject> --dry-run [--chapters]` → confirm → `--apply`, which writes `<stem>.<n>.part.txt` plus `<stem>.parts.json` and deletes the original `.txt` while keeping the PDF. `node scripts/classify-sources.mjs --subject <subject>` then proposes the `course/supplement/raw` moves, the learner confirms a map, and `--map <file> --apply` moves the files and records each part's role. Citations point at the part file that holds the lines, and `source_lines` equals that chunk's actual line count. Digest `status` is `pending | absorbed | skipped`; `skipped` means the material was read and deliberately left untaught, and it needs a non-empty `skip_reason`. A subject check fails on any `pending` digest, on an `absorbed` digest no node lists, and on a text digest skipped while its supplement stays absorbed. A `text` digest may list `supplements` — sibling `codebase` or `image` digests plus the L1 (`<digest>.md#L1`) or L2 (`<digest>.md#Lx-Ly`) entry that carries the code or figures the text refers to.

### Block — `learn/<subject>/blocks/<block-id>.md`

A block is one standalone knowledge point: a reader who has not read any step can still understand it. Frontmatter: `id` (equal to the filename), `title` (display name), `label` (a noun or proper noun, not a sentence), `subject`, `type` (`concept | procedure | principle | contrast`), `status` (`draft | reviewed`), `summary` (one sentence, ≤120 characters), and `sources` (at least one); optional `slug` (kebab-case, defaults to the id), `aliases`, `prerequisites`, and `related`. `prerequisites` is directed, `related` is undirected, both stay inside the subject, and prerequisites never form a cycle. The body uses the required `##` sections for its type; code blocks keep provenance. A node step may list `blocks:` (bare ids, no duplicates) to link the knowledge points it teaches. `learn/<subject>/blocks/coverage.json` records each written step's concepts, their `block` (an id, or `null` when uncovered), and an optional `note`; `scripts/blocks.mjs apply` rebuilds it from the confirmed audits in `output/blocks/*.audit.json` plus each step's `blocks:`. `node scripts/blocks.mjs report|check` prints the coverage numbers and the drift. Verify enforces the block format and the block/step/coverage consistency. Inline `[[block-id]]` links are navigation only; graph relationships come from frontmatter only.

### Course viewer

`course-app/` reads `learn/` directly. A subject opens on its roadmap page: one tier per row, `prerequisites` drawn as links, and each node card linking to the node. Narrow screens fall back to a tier list. The node page lists steps in `steps` array order and marks a step without a body as `尚未產生`. The step page renders the Markdown article, turns a fenced `quiz` block into an interactive question, renders the `<step>.quiz.json` questions under a `自我檢查` section, resolves figures under `<step>-assets/`, aggregates the step's sources at the end, and shows prev/next links in array order. There is no status badge or progress tracking.

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
node src/article-cli.mjs prepare --subject <s> --node <n> [--step <id>] [--force] [--skip-polish]
node src/article-cli.mjs compose --subject <s> --node <n> [--step <id>] [--max-chars <n>]
node src/article-cli.mjs mark    --subject <s> --node <n> [--step <id>]
node scripts/polish-article.mjs draft --subject <s> --node <n> --step <id> [--instruction <text>] [--copy]
node src/article-cli.mjs publish --subject <s> --node <n> [--step <id>] [--force]
node src/article-cli.mjs render  --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>]
node scripts/humanize-article.mjs prepare --subject <s> --node <n> [--step <id>]
node scripts/humanize-article.mjs apply   --subject <s> --node <n> --step <id> [--summary <text>]
node src/article-cli.mjs article --subject <s> --node <n> [--step <id>] [--force] [--images]  (deprecated)
node src/article-cli.mjs image   --subject <s> --node <n> [--step <id>] [--force] [--plan-only]  (deprecated)
```

- `prepare` writes one material bundle per missing step to `learn/<subject>/output/<node>/<step>/material.json`; each bundle carries the step's `purpose` plus `course` and `supplement` source lists (legacy subjects use `sources`) as `{path, locator, type}` pointers, not source text; it infers `type: code` from code-like extensions and defaults to `article`. One `publisher` subagent per step reads every cited source file in full and curates the material — overwriting `material.json` with the course text in full and the selected supplement prose, code and formulas, each piece keeping `{path, locator, type}` (plus optional `language` for code) and adding `text`. `article-cli compose` reads that curated material and calls the text model once to write `original.md` (no image markers, and the model chooses the H1 from the purpose) plus `compose.json` (`model`, `composed_at`), enforcing the input size cap (`ARTICLE_MAX_MATERIAL_CHARS`, default 120000). For `code` and `formula` sources it gives the model a placeholder and replaces that placeholder with a short fenced excerpt plus provenance (long code keeps the head and tail with a `...` line; `ARTICLE_CODE_MAX_LINES`, default 24) or with display math. On a missing body, H1 or placeholder it retries with the previous draft and the missing placeholder list; if placeholders are still missing after three attempts it still writes a salvageable `original.md` (restoring the placeholders it did use, stripping leftovers) and reports `status: draft` with `compose.json.missing`, so the publisher can repair instead of losing the run. The publisher then reads `original.md` to write the 1–5 item plan to `learn/<subject>/nodes/<node>/<step>.plan.json`, and `article-cli mark` inserts the `<!--image:N-->` markers from that plan. `polish-article.mjs draft` reads `original.md`, writes `polish.md`, and polishes each plan `heading`/`prompt` while keeping the markers; when the model or validation fails it falls back to copying `original.md` to `polish.md` unchanged, reports `status: copied` with `fallback: true`, and the publisher continues. It calls the text model for compose and polish but never generates figures. `prepare --force` clears the step's stale `original.md`, `polish.md`, `result.json`, `compose.json`, `blocks.json` and `request.json` so an old run cannot publish; the publisher and CLI then rewrite `material.json`, `original.md`, `polish.md` and the plan. `draft --copy` skips the text model: it validates the plan, copies `original.md` to `polish.md` unchanged, and reports `copied`. `prepare --skip-polish` is what hands the publisher that copy command instead of the polish call.
- `publish` keeps the markers, normalizes the H1, writes `learn/<subject>/nodes/<node>/<step>.md` from `polish.md`, stamps the step's `author` from `compose.json` (falling back to the current text model), marks the node `written`, and runs verify. It never syncs, copies, or deletes `<step>-assets/` unless `--force` succeeds. With `--force`, a successful write clears that step's stale `image-N.webp` files, its `<step>.quiz.json`, its `humanized.md` / `humanized.plan.json`, and its polish record.
- The main agent then reads the published steps in order and edits prose only (openings, handoffs, repeated term definitions); it never moves code blocks, `<!--image:N-->` markers, image lines, `quiz` blocks, or the H1.
- Missing or H1-only articles are generated; articles with a body are skipped unless `--force`.
- `humanize-article.mjs prepare` copies each eligible step's article to `output/<node>/<step>/humanized.md` and its plan to `humanized.plan.json`, skipping steps without an article, without a plan, or without a marker or image line. `apply` validates the copies against the official files (H1, markers, image lines, code, provenance, quiz, links, plan length/order, and every existing `anchor`), writes the article and plan back only on success, and leaves `humanized.md` identical to `step.md`. A failed validation leaves the official files untouched and keeps the copies for repair. There is no hash record and no separate plan backup.
- `render` reads the plan and the article's markers. It generates only the missing `image-N.webp` files, reuses existing ones, and replaces each marker with `![第 N 段配圖](./<step>-assets/image-N.webp)` — no caption. It does not plan, edit prose, or read `anchor`. It needs an image key but no text key.
- The legacy `article` and `image` commands are deprecated. They remain usable for repairs on old articles but are not part of the current pipeline; `image --plan-only` writes `nodes/<node>/<step>.plan.json`.
- The CLI prints JSON per-step status plus the verify result.

### Batch pipeline

`/batch-nodes` runs Nodes → Article → Humanize → Generate → Quiz and gates each phase before dispatching. Flags: `-max-subagents N` (default 3), `-article-per-node`, `-nodes-only`, `-skip-article`, `-skip-polish`, `-skip-humanize`, `-skip-images`, `-skip-quiz`, `-no-continuity`, `-force`. `-article-per-node` dispatches one `publisher` per node instead of one per step; `-skip-polish` publishes the model's first draft through a `polishCommand` that carries `--copy`. `-no-images` is removed; use `-skip-images` to skip rendering. `-force` regenerates generated content but never rebuilds a node's step plan. Failure propagates downstream: a failed Article node leaves Humanize, Generate, and Quiz; a failed Humanize node leaves Generate and Quiz; a failed Generate node leaves Quiz. Successful files stay in place.

### Quiz generation

```bash
node scripts/quiz.mjs prepare --subject <s> --node <n> [--step <id>] [--force]
node scripts/quiz.mjs write   --subject <s> --node <n> --step <id> --input <file|-> [--force]
node scripts/quiz.mjs check   --subject <s> --node <n> --step <id> --input <file|->
node scripts/quiz.mjs status  --subject <s> --node <n>
```

- `/quiz-gen` runs `prepare`, dispatches one `quiz-agent` per node for its ready steps, and the agent writes its own candidates to `learn/<subject>/output/quiz-candidates/`; `write` then validates and publishes `<step>.quiz.json`.
- Each step gets 3–8 questions. The length ceiling is `min(8, max(3, round(CJK字數 / 250)))`; an article that cannot support 3 distinct questions fails instead of padding.
- `prepare` skips existing quiz files unless `--force`; `write` refuses to overwrite without `--force`; `check` runs the same validation and writes nothing, so a `quiz-agent` can self-check a candidate before returning.
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

### Block coverage

```bash
node scripts/blocks.mjs apply  --subject <s>   # rebuild blocks/coverage.json from audits + step links
node scripts/blocks.mjs report --subject <s>   # Step coverage, Course coverage, block counts, reuse factor, uncovered list
node scripts/blocks.mjs check  --subject <s>   # drift: stale steps, dropped sources, uncovered concepts, orphan blocks, broken relations
```

`apply` reads `learn/<subject>/output/blocks/<node>.audit.json` and each written step's `blocks:`; it writes `learn/<subject>/blocks/coverage.json` and never edits step prose or block bodies. `report` answers how many blocks exist now, how many the course needs after coverage, and both coverage ratios. `check` reports drift only; it does not rewrite anything.

### Transcript backfill

```bash
node scripts/transcript-backfill.mjs --subject <subject> [--dry-run] [--json]
```

Converts every `.srt` / `.vtt` into a sibling `.txt` with plain paragraphs and no timestamps. Idempotent: an existing `.txt` is never overwritten, and a transcript already classified under `course/` is reused. Originals are kept.

### PDF backfill

```bash
node scripts/pdf-backfill.mjs --subject <subject> [--dry-run]
```

Idempotent: existing `.txt` files are not overwritten, so line numbers stay stable; a PDF with `<stem>.*.part.txt` siblings is skipped, and a PDF in `raw/` whose text already lives under `course/` or `supplement/` is skipped.

### Classify sources

```bash
node scripts/classify-sources.mjs --subject <subject> [--map <file>] [--apply] [--json]
```

Dry run by default. Prints one row per planned move: proposed `course` / `supplement` / `raw` role, path, and reason. Defaults: `.srt`, `.vtt`, `.pdf`, and `.parts.json` → `raw`; `.txt` → `course`; code, images, and other files → `supplement`. `--apply` moves files and directories into the dated `course/`, `supplement/`, and `raw/` folders and adds each part's role to its parts manifest. Keys in `--map` are relative to the dated folder.

### Split long sources

```bash
node scripts/split-sources.mjs --subject <subject> (--dry-run | --apply) [--chapters] [--boundaries <file>] [--root <dir>] [--json]
```

`--dry-run` prints the chunk table and writes nothing; `/learn-init` and `/ingest` must show it and get explicit confirmation before `--apply`. `--chapters` forces one part per level-1 chapter heading, even for a short book, so course and supplement chapters can be classified separately. Size-based splitting applies only to `.txt` sources over 3,000 lines or 250 KB; it merges sub-200-line sections into the next chunk and splits oversized sections at subheadings or paragraph boundaries. `--chapters` instead emits one part per level-1 chapter heading, even for a shorter book, and refuses a source with no chapter headings. `--apply` writes `<stem>.<n>.part.txt` and `<stem>.parts.json`, deletes the original `.txt`, and keeps the PDF; rerunning never overwrites an existing part. Each chunk has exactly one digest part whose `source` points at the chunk. `verify` checks manifest tiling, part line counts, and the chunk/digest pairing.

### Node reset

```bash
node scripts/reset-nodes.mjs --subject <subject> (--all | --tier <n> | --node <id> ...) [--dry-run]
```

Keeps each node container and its step array; sets `status: confirmed`, rewrites every step article as an empty skeleton, removes step titles and authors from the plan, removes figures, image plans and quizzes, and deletes the node's intermediate `output/` artifacts (material bundles, stage articles including `humanized.md` and `humanized.plan.json`, run metadata, quiz candidates). `/article` then regenerates the bodies and plans from scratch, and `/generate-images` renders the figures.

### Lint

```bash
node scripts/verify.mjs --subject <subject>
node scripts/verify.mjs --node <subject>/<node-id>
```

It checks format only: node frontmatter, `id`/filename, status, flat step entries, step/article pairing, the compose-written title, the optional `author` string and H1, `## Steps`, the prerequisite DAG (`prerequisites-type`, `prerequisite-path`, `prerequisite-missing`, `prerequisite-subject`, `prerequisite-self`, `prerequisite-cycle`, `prerequisite-tier`), source locators and digest coverage, block frontmatter and sections, block relations, step `blocks`, block/step/coverage consistency, node ↔ digest declarations (`node-digest-unknown`, `node-digest-status`, `node-digest-undeclared`, `node-digest-unused`, `digest-unreferenced`, `digest-pending`, `digest-skip-reason`), the `course/supplement/raw` layout for new subjects (`source-layout`, `src-raw`, `src-course-missing`, `digest-source-raw`, `digest-source-layout`, `source-parts-role`), code provenance, quiz sidecars, image files and orphans, relative links, and `.mdx` absence. See [docs/reference/verify.md](docs/reference/verify.md). Content judgment stays with the learner.

### Query

When the learner asks a question about a subject:

1. Search the subject's `ROADMAP.md`, nodes, step articles, and blocks.
2. Answer in the subject's `MEMORY.md` language, citing the step article and its source ranges.

## Quality Standards

- **Useful** — every node has one learner-facing goal; every step is a readable article.
- **Connected** — related blocks link through `prerequisites` and `related`.
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

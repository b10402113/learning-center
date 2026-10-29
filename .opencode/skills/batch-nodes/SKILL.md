---
name: batch-nodes
description: Batch-create a subject's node step plans, write their step articles, humanize them, render their figures, and generate step quizzes, via parallel subagents. Use when the learner wants to build or resume many nodes in one run.
disable-model-invocation: true
argument-hint: "/batch-nodes <subject> [tier<N> | node-id ...] [-max-subagents N] [-nodes-only] [-skip-article] [-skip-humanize] [-skip-images] [-skip-quiz] [-no-continuity] [-force]"
---

Invoke as `/batch-nodes <subject> [scope] [flags]`.

Run the normal pipeline — `/nodes` → `/article` → `/humanize-article` → `/generate-images` → `/quiz-gen` — over many nodes in five phases. Each phase hands out work to parallel subagents where it has any, waits for the batch, records every outcome, and moves on. It does not invent a second content pipeline: the Nodes subagent follows `/nodes`, the Article phase dispatches one `publisher` per node and runs the `/article` CLI, the Humanize phase dispatches one `humanize-article` per node and runs `scripts/humanize-article.mjs`, the Generate phase runs the `/generate-images` render CLI, and the Quiz phase dispatches one `quiz-agent` per node and runs `/quiz-gen`'s CLI.

**Invocation modes:**

- `/batch-nodes <subject>` — every node in the roadmap.
- `/batch-nodes <subject> tier<N>` — every node under `### Tier <N>` in the roadmap (for example `tier1`, `tier3`).
- `/batch-nodes <subject> <node-id> [<node-id> ...]` — only the listed nodes.
- `-max-subagents N` — batch width in nodes (default 3). Each node is one subagent; a node's steps run inside it in order.
- `-nodes-only` — run the Nodes phase and stop.
- `-skip-article` — skip Article. Humanize, Generate, and Quiz still run against whatever is already on disk.
- `-skip-humanize` — skip Humanize. Article, Generate, and Quiz still run.
- `-skip-images` — skip Generate: no image plan is rendered and no image-API spend happens. Article still writes the plan and markers; a later `/generate-images` renders them.
- `-skip-quiz` — skip Quiz.
- `-no-continuity` — tell each publisher to write its node's steps as standalone articles, with no handoff between them.
- `-force` — regenerate generated content: Article rewrites step articles (and clears their old figures and humanize records after a successful write), Humanize redoes processed steps, Generate repaints every marker, and Quiz rewrites sidecars. It does not rebuild a node's step plan; use `/nodes` or `/reset-nodes` for that.

`-no-images` is removed. If someone passes it, stop and report: use `-skip-images` to skip figure rendering, or `-force` to repaint figures that already exist.

**State decides the work.** Rerunning the command resumes instead of redoing:

| State | Nodes | Article | Humanize | Generate | Quiz |
| --- | --- | --- | --- | --- | --- |
| `status: draft`, or `steps: []` | build the plan | write every new step | after Article | after Article | after articles exist |
| plan exists, some step is missing or H1-only | skip | write only the missing steps | on the new markers | render the new markers | after articles exist |
| every step has a body, no plan | skip | skip (existing article) | skip (`skipped-no-plan`) | skip (`no-plan`) | can run |
| step has a plan and markers | skip | skip | humanize or `skipped-record` | render or reuse | can run |
| step has a plan and image lines, no markers | skip | skip | humanize, protecting image lines | `already-rendered` | can run |
| step has a plan, no markers, no image lines | skip | skip | `skipped-not-published` | `no-markers` failure | can run |
| `<step>.quiz.json` exists | — | — | — | — | skip, unless `-force` |

Prereqs: `learn/<subject>/MEMORY.md`, `learn/<subject>/ROADMAP.md`, and `learn/<subject>/digests/` exist. Gate each enabled phase before it dispatches work, name anything missing, and stop without dispatching:

- **Article** — root `node_modules`, an initialized `article-agent/` with its own dependencies, and `TEXT_API_KEY` (or `OPENAI_API_KEY`) in the root `.env`.
- **Generate** — `IMAGE_API_KEY` (or `EVOLINK_API_KEY`) in the root `.env`.
- **Quiz** — `course-app`'s npm dependencies, so it can rebuild viewer data.
- **Nodes** and **Humanize** need no additional key.

1. **Resolve.** Parse `subject`, the flags, and the scope (`tier<N>` | explicit node ids | all) per [skill-scope](../../../docs/reference/skill-scope.md). Never infer the subject from prose. Validate every resolved node container at `learn/<subject>/nodes/<node-id>.md`. Read each node's `status` and `steps` array and build the phase queues:
   - **Nodes queue** — `status: draft` or `steps: []`.
   - **Article queue** — every node with a non-empty `steps` array. The `prepare` call in step 3 decides which steps actually need writing; a node whose steps all have bodies yields no publisher unless `-force`.
   - **Humanize queue** — rebuilt in step 4 from the nodes with a published article; `humanize-article.mjs prepare` decides which steps need editing.
   - **Generate queue** — rebuilt in step 5 from the nodes with at least one step plan under `learn/<subject>/output/image-plans/<node>/`.
   - **Quiz queue** — rebuilt in step 6 from the nodes with published articles; `quiz.mjs prepare` decides which sidecars are missing.

   Show a one-paragraph scope summary: resolved nodes, phase queues, and the flags in effect. Do not ask for confirmation; the invocation is the consent.

2. **Nodes.** Batch the Nodes queue into groups of `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per node in a single message, every call with `subagent_type: general` and the [Nodes-prompt](#nodes-prompt) filled in. Wait for every subagent, record `planned` or `failed` with the error, and print a progress line. A node that fails here is dropped from Article, Humanize, Generate, and Quiz. Do not read its article folders to compensate.

   Nodes that are already `confirmed` or `written` and have a non-empty `steps` array skip this phase entirely. Their plan is the contract; `-force` does not change it.

   After the batch, run `node scripts/verify.mjs --node <subject>/<node>` for every node that reached `planned`. Drop any node whose verify fails from Article, Humanize, Generate, and Quiz, and record the failures. Add every surviving node to the Article queue before starting step 3.

3. **Article** (skip with `-nodes-only` or `-skip-article`). Process the Article queue in roadmap order.

   **3a. Prepare.** Run one CLI call per node, without `--force` unless the flag was given:

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--force]
   ```

   Read the JSON. `root` is the absolute repo root and `nodeFile` is the node container's absolute path. `steps[]` is the work: each entry carries `id`, `title`, `purpose`, `material`, `original`, `plan`, and `command`; `material`, `original`, and `plan` are absolute paths, and `command` already carries absolute paths, `--root`, and `--markers-only`. `skipped[]` means the step already has a body; its entries carry `id`, `title`, `purpose`, `status`, `path`, and `article`, and they are continuity material for the publisher, not work. A node where every step is skipped yields no publisher. A prepare failure drops that node from the rest of Article, Humanize, Generate, and Quiz; record its error and continue with the next node.

   **3b. Dispatch publishers.** One `publisher` per node with a non-empty `steps[]`. Batch the ready nodes by `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per node in a single message, every call with `subagent_type: publisher` and the [Publisher-prompt](#publisher-prompt) filled in. Give each publisher only its own node's fields — `root`, `nodeFile`, `nodeTitle`, `nodeGoal`, `steps[]`, `skipped[]` — and nothing from another node. When the run was invoked with `-no-continuity`, add the standalone instruction the prompt describes. Wait for every call and record `completed`, `partial`, or `failed`.

   **3c. Publish.** After all publisher batches finish, publish each node whose publisher completed at least one step, in roadmap order:

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--force]
   ```

   Pass `--force` only when the run was invoked with `-force`, so a successful write clears the step's stale figures and humanize record. It restores protected code, keeps the `<!--image:N-->` markers, writes the step Markdown, marks the node `written` when every step has a body, and runs verify. It does not touch `<step>-assets/` or render figures. Record every step status and the verify result. A publisher that stopped before its last step publishes the finished steps, then marks the node failed and drops it from Humanize, Generate, and Quiz.

   **3d. Verify the phase.** For every node in the Article queue that did not fail prepare, run `node scripts/verify.mjs --node <subject>/<node>` even when no publisher ran, so an existing `written` node cannot slip into Humanize or Quiz with a broken link or a missing sidecar. Marker-only articles pass: `<!--image:N-->` is an HTML comment, not an image line. Drop any node whose verify fails and record the failures.

4. **Humanize** (skip with `-nodes-only` or `-skip-humanize`). Only steps with a plan are eligible; existing articles without a plan are never touched. Process the Humanize queue in roadmap order.

   **4a. Prepare.** Run one CLI call per node, without `--force` unless the flag was given:

   ```bash
   node scripts/humanize-article.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
   ```

   `steps[]` is the work: each entry carries `id`, `title`, `status: ready`, `article`, `plan`, `workArticle`, and `workPlan`. `skipped[]` carries `skipped-no-article`, `skipped-no-plan`, `skipped-not-published`, or `skipped-record`. `failed[]` carries plan-format errors. Record skips and continue; a prepare failure drops the node from Generate and Quiz. A node with no ready step yields no humanize agent.

   **4b. Dispatch humanize agents.** One `humanize-article` per node with a non-empty `steps[]`. Batch the ready nodes by `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per node in a single message, every call with `subagent_type: humanize-article` and the [Humanize-prompt](#humanize-prompt) filled in. Give the agent its node title and ready steps' `id`, `title`, `workArticle`, `workPlan`, and the instruction to write a `summary.txt` next to each pair. Never give it the official articles, the official plans, or another node's content.

   **4c. Apply and verify.** After the agent finishes a node, loop over that node's ready steps in order and run:

   ```bash
   node scripts/humanize-article.mjs apply --subject <subject> --node <node> --step <step> [--summary <text>]
   ```

   `apply` validates one step's workspace against its backup, writes the article and plan back, records both sha256 hashes, and deletes that workspace. A validation failure leaves the official files untouched, writes no record, and keeps the workspace; record it as `failed` and continue with the next step, including steps from the same node. After the node's ready steps are applied, run `node scripts/verify.mjs --node <subject>/<node>`; drop the node from Generate and Quiz if verify fails.

   **4d. Failure propagation.** Every step that fails validation is left with its official files unchanged. A node with any failed humanize step is dropped from Generate and Quiz. Other nodes continue.

5. **Generate** (skip with `-nodes-only` or `-skip-images`). Only nodes with at least one step plan are eligible. Process the Generate queue in roadmap order:

   ```bash
   node src/article-cli.mjs render --subject <subject> --node <node> [--force]
   ```

   `render` reads the article markers and the formal plan, reuses existing `image-N.webp` files, generates only what is missing, and replaces each marker with `![第 N 段配圖](./<step>-assets/image-N.webp)` — no caption. It never plans, never edits prose, and never reads `anchor`. Pass `--force` only when the run was invoked with `-force`.

   Read the per-step status and record it:

   - `rendered` / `already-rendered` / `no-plan` / `no-article` — success or expected skip.
   - `no-markers` / `failed` — record the error and mark the node failed. A failed node is dropped from Quiz; successful files and previously written images stay. Do not hand-place markers, do not retry automatically, and do not edit the article.

   Then run `node scripts/verify.mjs --node <subject>/<node>` for every Generate node that did not fail. Drop a node from Quiz if verify fails.

6. **Quiz** (skip with `-skip-quiz` or `-nodes-only`). Build the Quiz queue from the current node containers: every node not dropped by Nodes, Article, Humanize, or Generate whose steps have articles. With `-skip-article`, Article did not run, so let `quiz.mjs prepare` report any step without a body. Generate is not a prerequisite: quiz questions need the article text, not the figures.

   **6a. Prepare.** Run one CLI call per node, without `--force` unless the flag was given:

   ```bash
   node scripts/quiz.mjs prepare --subject <subject> --node <node> [--force]
   ```

   `steps[]` carries `id`, `article`, `title`, `characters`, `minQuestions`, and `maxQuestions`; `skipped[]` explains `article-missing`, `article-empty`, or `quiz-exists`. Record skips and continue.

   **6b. Dispatch quiz agents.** One `quiz-agent` per node with a non-empty `steps[]`. Batch the ready nodes by `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per node in a single message, every call with `subagent_type: quiz-agent` and the [Quiz-prompt](#quiz-prompt) filled in. Give the agent that node's ready steps — id, title, article path, character count, question range — and nothing from another node. The agent returns one JSON object keyed by step id and writes no files.

   **6c. Write and validate.** For each returned mapping, create the candidate directory if needed and write the value for each ready step, verbatim, to:

   ```text
   learn/<subject>/output/quiz-candidates/<node>/<step>.json
   ```

   A missing key, or a value carrying `error` instead of `questions`, fails that step with the agent's message; keep the other steps in the node.

   Then run:

   ```bash
   node scripts/quiz.mjs write --subject <subject> --node <node> --step <step> --input learn/<subject>/output/quiz-candidates/<node>/<step>.json [--force]
   ```

   The script validates the schema, the 3–8 question window, and the article's character-based ceiling before writing `<step>.quiz.json`. A failed step keeps its candidate file and error; continue with the next step. Never hand-write or hand-edit questions, and never insert them into the article Markdown.

   **6d. Verify and rebuild viewer data.** Run `node scripts/verify.mjs --node <subject>/<node>` for every node the Quiz phase processed. When at least one sidecar was written, run:

   ```bash
   npm --prefix course-app run gen
   ```

7. **Report.** Summarise per phase:

   - **Nodes** — planned / skipped / failed, with step counts and errors.
   - **Article** — publishers completed / partial / failed, published steps, skipped steps, markers written, failed nodes, verify results.
   - **Humanize** — per node: the agent's outcome; per step: humanized / skipped-record / skipped-no-plan / skipped-not-published / failed, each with `changed` and `summary`; verify results.
   - **Generate** — rendered / already-rendered / no-plan / no-article / no-markers / failed, image counts, reused counts, verify results.
   - **Quiz** — written sidecars, skipped steps with reasons, failed steps with validation errors, verify results, and the `course-app` data result.

   List every failure with its error. Suggest rerunning `/batch-nodes <subject> <failed-node>`, running `/generate-images <subject>/<node> [--step <id>]` for an image repair, running `/humanize-article <subject>/<node>` for a text pass, or running `/edges <subject>/<node>` on completed nodes.

Completion, for every phase that ran:

- **Nodes** — every node that needed a plan was dispatched to a Nodes subagent, reached `planned`, and verifies clean.
- **Article** — every node that needed an article was prepared and dispatched to its own publisher; every prepared step either published with a formal plan and matching markers or is reported as the step where that publisher stopped; every published node passes `node scripts/verify.mjs --node <subject>/<node>`.
- **Humanize** — every eligible step was either humanized or skipped for a recorded reason; official files change only after validation; records exist for every humanized step; every processed node verifies clean.
- **Generate** — every marker-backed step has its `image-N.webp` files and its markers replaced by uncaptioned image lines; rerun without `-force` reports `already-rendered` or reuses images; every processed node verifies clean.
- **Quiz** — every step that needed a sidecar was included in its node's quiz-agent dispatch and either has a validated sidecar or a recorded failure; `course-app` data was regenerated when any sidecar was written.

The final report lists the outcome of every phase that ran.

Never hand-write article prose, never hand-write quiz questions, never hand-place `<!--image:N-->` markers, never generate figures outside the Generate render CLI, and never edit a node's `steps` outside the Nodes phase.

## Nodes-prompt

Dispatch every call with `subagent_type: general`. Fill `<NODE-ID>` and `<SUBJECT>` before dispatching.

```
Build the step plan for one node. Node: <SUBJECT>/<NODE-ID>.

Load the /nodes skill via the skill tool (name: "nodes") and follow it for node <NODE-ID>.
When you reach step 4 — the checkpoint that asks the learner to confirm the plan — skip it. Do not ask questions and do not wait. Decide the step count, ids, titles, one-sentence purposes, and source ranges yourself from the digests, then continue at step 5. You own the plan.

Stop once the node container and every H1-only skeleton are written and `node scripts/verify.mjs --node <SUBJECT>/<NODE-ID>` exits 0. Do not write article prose; /article does that in a later phase.

Workspace:
- Subject root: learn/<SUBJECT>/
- Node container: learn/<SUBJECT>/nodes/<NODE-ID>.md
- Step files: learn/<SUBJECT>/nodes/<NODE-ID>/
- MEMORY.md: learn/<SUBJECT>/MEMORY.md
- Digests: learn/<SUBJECT>/digests/
- Source protocol: docs/reference/source-reading.md

Report back: step count, ordered step ids, skeleton files created, verify exit status, any missing digests or errors.
```

## Publisher-prompt

Dispatch every call with `subagent_type: publisher`. Fill `<SUBJECT>`, `<NODE-ID>`, `<NODE-FILE>`, node title and goal, one line per ready step from `prepare`'s `steps[]`, and one line per entry in `skipped[]`. Give the subagent no other node's content.

```
Write every step of one node, in order: original article, image plan, then the repo wrapper. This is one node only: do not read, write, or plan any other node's content.

Repo root: <ROOT>
Node: <SUBJECT>/<NODE-ID>
Node title: <NODE-TITLE>
Node goal: <NODE-GOAL>
Node plan: <NODE-FILE>   (the full steps plan; read it first)

Ready steps, in teaching order:
- <STEP-ID> | <TITLE> | <PURPOSE> | material <MATERIAL> | original <ORIGINAL> | plan <PLAN> | command <COMMAND>
- <STEP-ID> | <TITLE> | <PURPOSE> | material <MATERIAL> | original <ORIGINAL> | plan <PLAN> | command <COMMAND>

Already published steps (continuity material; read their articles):
- <STEP-ID> | <TITLE> | <PURPOSE> | article <ARTICLE>
- <STEP-ID> | <TITLE> | <PURPOSE> | article <ARTICLE>

Every path above is absolute. Use each string exactly as given; do not join, rewrite, or guess a path, and do not assume the current working directory. Each command already includes absolute paths, --root, and --markers-only.

For each ready step, in order: read its material bundle, write the original article to its original path, write a 1-5 item image plan to its plan path, then run its command and read the article it produced before starting the next step. Write in the language recorded in `<ROOT>/learn/<SUBJECT>/MEMORY.md` (this repo uses Traditional Chinese), grounded only in the material.

The image plan is a JSON array of objects with `heading`, `anchor`, and `prompt`; spread the figures across the article and make every `anchor` a short verbatim sentence from that step's original.

There is no `article_generate` tool in this repo. Writing the original and the plan, then running the command, replaces it. The command rewrites the original once and leaves a `<!--image:N-->` marker for every plan item. It does not generate figures and does not need IMAGE_API_KEY. Do not rewrite after it returns, do not hand-place markers, and do not retry automatically if it fails.

Hold the node together: each step's opening picks up the question or conclusion the previous step left, each step's ending hands the next question to the following step, a term is defined fully once and reused after that, and examples keep the same names. Never add facts, numbers, or quotations the material does not support. <CONTINUITY-MODE> is "write the steps as standalone articles with no handoff" when the run used -no-continuity, otherwise "connect the steps as described".

Stop at the first command that does not report completed. Leave finished originals, plans, and run output in `learn/<SUBJECT>/output/jobs/`.

Report back: steps completed out of steps dispatched, each command status, original paths, plan lengths, marker counts, the failing step, and its error.
```

## Humanize-prompt

Dispatch every call with `subagent_type: humanize-article`. Fill `<SUBJECT>`, `<NODE-ID>`, `<NODE-TITLE>`, and one line per ready step from `humanize-article.mjs prepare`'s `steps[]`. Give the subagent no other node's content.

```
Humanize every ready step of one node, in order. Work only on the workspace copies; never touch the official files.

Node: <SUBJECT>/<NODE-ID>
Node title: <NODE-TITLE>
Steps:
- <STEP-ID> | <TITLE> | work article <WORK-ARTICLE> | work plan <WORK-PLAN>
- <STEP-ID> | <TITLE> | work article <WORK-ARTICLE> | work plan <WORK-PLAN>

Load the `speak-human-tw` skill and work in non-interactive mode: skip the confirmation list, edit the workspace files directly, and write one post-hoc summary (original sentence / reason / replacement) to `summary.txt` in each step's folder.

Rules:
- Traditional Chinese (Taiwan).
- Change prose only; do not add facts, numbers, or quotations.
- Keep one term, one example, and one name across the whole node; define a term fully in the first step that uses it and reuse that wording later.
- Do not change the H1.
- Do not change fenced code blocks or provenance comments.
- Do not change `<!--image:N-->` markers.
- Do not change existing image lines or their captions.
- Do not change quiz blocks or relative / source links.
- In each plan, change only `heading` and `prompt`; never change `anchor`, the array length, the order, or the indices.
- If a sentence needs a fact you do not have, leave it or mark it; do not invent.

The main program validates each step's workspace against its backup. Any changed marker, image line, code block, quiz block, link, H1, plan structure, or `anchor` fails that step and the official files stay untouched; the other steps still apply. Do not run the apply command and do not write back yourself.

Report back: per step, whether you changed the article and/or plan and the `summary.txt` path; then one sentence on the terms you unified across the node.
```

## Quiz-prompt

Dispatch every call with `subagent_type: quiz-agent`. Fill `<SUBJECT>`, `<NODE-ID>`, and one line per ready step from `quiz.mjs prepare`'s `steps[]`. Give the subagent no other node's content.

```
Author the quiz sidecars for one node's published steps. Read only the articles listed below and return only one JSON object; do not modify any file.

Node: <SUBJECT>/<NODE-ID>
Steps:
- <STEP-ID> — <TITLE>; article <ARTICLE>; <CHARACTERS> CJK characters; <MIN-QUESTIONS>–<MAX-QUESTIONS> questions
- <STEP-ID> — <TITLE>; article <ARTICLE>; <CHARACTERS> CJK characters; <MIN-QUESTIONS>–<MAX-QUESTIONS> questions

Write each step its own single-choice questions within that step's range. Every correct answer must be directly supported by a sentence in that step's own article, and no two questions may test the same concept — within a step or across the node's steps. Use plausible distractors, keep each question self-contained, and write Traditional Chinese in the article's terminology. Return exactly the JSON object keyed by step id that your agent instructions describe, with an entry for every listed step and no commentary or code fence.
```

---
name: batch-nodes
description: Batch-create a subject's node step plans, write their step articles, humanize them, render their figures, and generate step quizzes, via parallel subagents. Use when the learner wants to build or resume many nodes in one run.
disable-model-invocation: true
argument-hint: "/batch-nodes <subject> [tier<N> | node-id ...] [-max-subagents N] [-nodes-only] [-skip-article] [-skip-humanize] [-skip-images] [-skip-quiz] [-no-continuity] [-force]"
---

Invoke as `/batch-nodes <subject> [scope] [flags]`.

Run the normal pipeline — `/nodes` → `/article` → humanize → `/generate-images` → `/quiz-gen` — over many nodes in five phases. Each phase hands out work to parallel subagents where it has any, waits for the batch, records every outcome, and moves on. It does not invent a second content pipeline: the Nodes subagent follows `/nodes`, the Article phase dispatches `publisher` subagents and runs the `/article` CLI, the Humanize phase dispatches `general` subagents that load the `speak-human-tw` skill and edit each step article plus its image plan's `heading` and `prompt` in place, the Generate phase runs the `/generate-images` render CLI, and the Quiz phase dispatches `quiz-agent` subagents and runs `/quiz-gen`'s CLI.

**Invocation modes:**

- `/batch-nodes <subject>` — every node in the roadmap.
- `/batch-nodes <subject> tier<N>` — every node under `### Tier <N>` in the roadmap (for example `tier1`, `tier3`).
- `/batch-nodes <subject> <node-id> [<node-id> ...]` — only the listed nodes.
- `-max-subagents N` — batch width (default 3).
- `-nodes-only` — run the Nodes phase and stop.
- `-skip-article` — skip Article. Humanize, Generate, and Quiz still run against whatever is already on disk.
- `-skip-humanize` — skip Humanize. Article, Generate, and Quiz still run.
- `-skip-images` — skip Generate: no image plan is rendered and no image-API spend happens. Article still writes the plan and markers; a later `/generate-images` renders them.
- `-skip-quiz` — skip Quiz.
- `-no-continuity` — skip the cross-step continuity edit and leave each article as its publisher and rewrite produced it.
- `-force` — regenerate generated content: Article rewrites step articles (and clears their old figures after a successful write), Generate repaints every marker, and Quiz rewrites sidecars. Humanize has no skip record, so every enabled run humanizes its eligible steps again; `-force` does not change that. It does not rebuild a node's step plan; use `/nodes` or `/reset-nodes` for that.

`-no-images` is removed. If someone passes it, stop and report: use `-skip-images` to skip figure rendering, or `-force` to repaint figures that already exist.

**State decides the work.** Rerunning the command resumes instead of redoing:

| State | Nodes | Article | Humanize | Generate | Quiz |
| --- | --- | --- | --- | --- | --- |
| `status: draft`, or `steps: []` | build the plan | write every new step | after Article | after Article | after articles exist |
| plan exists, some step is missing or H1-only | skip | write only the missing steps | on the new markers | render the new markers | after articles exist |
| every step has a body, no plan | skip | skip (existing article) | skip (`skipped-no-plan`) | skip (`no-plan`) | can run |
| step has a plan and markers | skip | skip | humanize | render or reuse | can run |
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
   - **Article queue** — every node with a non-empty `steps` array. The `prepare` call in step 3 decides which steps actually need writing; a node whose steps all have bodies yields no publishers unless `-force`.
   - **Humanize queue** — rebuilt in step 4 from the nodes with a published article; the eligibility rules in step 4a decide which steps need a subagent.
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

   Read the JSON. `steps[]` is the work: each entry carries `id`, `title` (may be `null`), `purpose`, `material`, `original`, `plan`, `command` (already `--markers-only`), and `titleCommand`. `skipped[]` means the step already has a body; keep it out of the publisher batch. A prepare failure drops that node from the rest of Article, Humanize, Generate, and Quiz; record its error and continue with the next node.

   **3b. Dispatch publishers.** Combine the ready `steps[]` from every prepared node into one list, preserving node and step order. Batch that list into groups of `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per step in a single message, every call with `subagent_type: publisher` and the [Publisher-prompt](#publisher-prompt) filled in. Give each publisher only its own step's fields — never another step's article, plan, or source material. Wait for every call and record `completed` or `failed`.

   **3c. Publish.** After all publisher batches finish, publish each node that has at least one prepared step, in roadmap order:

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--force]
   ```

   Pass `--force` only when the run was invoked with `-force`, so a successful write clears that step's stale figures. It restores protected code, keeps the `<!--image:N-->` markers, writes the step Markdown, marks the node `written` when every step has a body, and runs verify. It does not touch `<step>-assets/` or render figures. Record every step status and the verify result. If any publisher for the node failed, or publish reports a failed step, mark the node failed, keep the successful files, and drop the node from Humanize, Generate, and Quiz.

   **3d. Verify the phase.** For every node in the Article queue that did not fail prepare, run `node scripts/verify.mjs --node <subject>/<node>` even when no publisher ran, so an existing `written` node cannot slip into Humanize or Quiz with a broken link or a missing sidecar. Marker-only articles pass: `<!--image:N-->` is an HTML comment, not an image line. Drop any node whose verify fails and record the failures.

   **3e. Continuity** (skip with `-no-continuity`). For each node with more than one step where at least one step was published in this run, every prepared step published, every skipped step already had a body, and verify passed, run the continuity edit from `/article` yourself; do not delegate it to a subagent. Nodes whose articles were all skipped are left untouched. Read the published steps in `steps` order and edit prose only: connect each opening to the previous step's question or conclusion, hand the next question to the following step, define a term once, and keep names and examples consistent. Do not add facts, numbers, or quotations that the material does not support. Do not move paragraphs, and do not touch the H1, code fences and provenance comments, `<!--image:N-->` markers, existing image lines and captions, or `quiz` blocks. Re-run `node scripts/verify.mjs --node <subject>/<node>` after editing and drop the node from Humanize, Generate, and Quiz if it fails.

4. **Humanize** (skip with `-nodes-only` or `-skip-humanize`). Only steps with a plan are eligible; existing articles without a plan are never touched. Process the Humanize queue in roadmap order.

   **4a. Build the work list.** Do this yourself; there is no prepare CLI. For each node in the queue, walk its `steps` in order and classify each step:

   - **No article, or an empty / H1-only article** → `skipped-no-article`.
   - **No plan** at `learn/<subject>/output/image-plans/<node>/<step>.json` → `skipped-no-plan`.
   - **No `<!--image:N-->` marker and no image line** in the article → `skipped-not-published`.
   - Otherwise → ready. The work item is `{ node, step, title, article, plan }` where `article` is `learn/<subject>/nodes/<node>/<step>.md` and `plan` is `learn/<subject>/output/image-plans/<node>/<step>.json`.

   Before dispatching a ready step, copy its plan to `learn/<subject>/output/humanize/<node>/<step>.plan.backup.json`. The plan lives under the git-ignored `output/`, so this backup is the only way to check `anchor` afterwards.

   There is no hash record, so a rerun humanizes every eligible step again. Record every skip and continue. A node with no ready steps is not dispatched and is not a failure.

   **4b. Dispatch humanize agents.** Combine the ready steps from every node into one list, preserving node and step order, and batch it by `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per step in a single message, every call with `subagent_type: general` and the [Humanize-prompt](#humanize-prompt) filled in. Give the agent only that step's `title`, its `article` path, and its `plan` path. Never give it another step's content or the node plan.

   **4c. Verify.** The agent edits the official article and plan in place. After every ready step of a node has returned, run:

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   Then confirm the article changed prose only by reading its diff (`git diff -- learn/<subject>/nodes/<node>/`): no H1, code fences, provenance comments, `<!--image:N-->` markers, existing image lines or captions, quiz blocks, or links changed.

   For each plan, compare it with its backup:

   ```bash
   node -e 'const fs=require("fs");const [a,b]=process.argv.slice(1).map(f=>JSON.parse(fs.readFileSync(f,"utf8")));if(a.length!==b.length)throw new Error("plan length changed");a.forEach((x,i)=>{if(x.anchor!==b[i].anchor)throw new Error("plan anchor changed at "+i);if(typeof b[i].heading!=="string"||!b[i].heading.trim())throw new Error("empty heading at "+i);if(typeof b[i].prompt!=="string"||!b[i].prompt.trim())throw new Error("empty prompt at "+i)})' learn/<subject>/output/humanize/<node>/<step>.plan.backup.json learn/<subject>/output/image-plans/<node>/<step>.json
   ```

   Only `heading` and `prompt` may differ; length, order, and every `anchor` must match the backup.

   There is no rollback and no hash record; if a structural change slipped in, restore that file from git (or from the plan backup) and record the step as `failed`. Drop the node from Generate and Quiz if verify fails or any protected structure changed.

   **4d. Failure propagation.** A node with any failed humanize step is dropped from Generate and Quiz. Other nodes continue.

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

   `steps[]` carries `article`, `title`, `characters`, `minQuestions`, and `maxQuestions`; `skipped[]` explains `article-missing`, `article-empty`, or `quiz-exists`. Record skips and continue.

   **6b. Dispatch quiz agents.** Combine the ready steps from every node into one list and batch it by `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per step in a single message, every call with `subagent_type: quiz-agent` and the [Quiz-prompt](#quiz-prompt) filled in. Give the agent only that step's article path, title, character count, and question range. The agent returns JSON and writes no files.

   **6c. Write and validate.** For each agent response, create the candidate directory if needed and write the returned JSON verbatim to:

   ```text
   learn/<subject>/output/quiz-candidates/<node>/<step>.json
   ```

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
   - **Article** — published steps, skipped steps, markers written, continuity nodes, failed nodes, verify results.
   - **Humanize** — humanized / skipped-no-article / skipped-no-plan / skipped-not-published / failed, each with a one-line summary, article and plan status, plus verify results.
   - **Generate** — rendered / already-rendered / no-plan / no-article / no-markers / failed, image counts, reused counts, verify results.
   - **Quiz** — written sidecars, skipped steps with reasons, failed steps with validation errors, verify results, and the `course-app` data result.

   List every failure with its error. Suggest rerunning `/batch-nodes <subject> <failed-node>`, running `/generate-images <subject>/<node> [--step <id>]` for an image repair, running `/batch-nodes <subject> <node> -skip-article -skip-images -skip-quiz` for a text pass, or running `/edges <subject>/<node>` on completed nodes.

Completion, for every phase that ran:

- **Nodes** — every node that needed a plan was dispatched to a Nodes subagent, reached `planned`, and verifies clean.
- **Article** — every step that needed an article was prepared, dispatched to its own publisher, and either published with a formal plan and matching markers or reported failed; every multi-step node that received a new article also received the continuity edit unless `-no-continuity` was set; every published node passes `node scripts/verify.mjs --node <subject>/<node>`.
- **Humanize** — every eligible step was either humanized or skipped for a recorded reason; each humanized article kept its H1, code, provenance, markers, image lines, quiz blocks, and links; each plan kept its length, order, and every `anchor` with only `heading` and `prompt` changed; every processed node verifies clean.
- **Generate** — every marker-backed step has its `image-N.webp` files and its markers replaced by uncaptioned image lines; rerun without `-force` reports `already-rendered` or reuses images; every processed node verifies clean.
- **Quiz** — every step that needed a sidecar was dispatched to its own quiz-agent and either has a validated sidecar or a recorded failure; `course-app` data was regenerated when any sidecar was written.

The final report lists the outcome of every phase that ran.

Never hand-write article prose outside the continuity edit, never hand-write quiz questions, never hand-place `<!--image:N-->` markers, never generate figures outside the Generate render CLI, and never edit a node's `steps` outside the Nodes phase.

## Nodes-prompt

Dispatch every call with `subagent_type: general`. Fill `<NODE-ID>` and `<SUBJECT>` before dispatching.

```
Build the step plan for one node. Node: <SUBJECT>/<NODE-ID>.

Load the /nodes skill via the skill tool (name: "nodes") and follow it for node <NODE-ID>.
When you reach step 4 — the checkpoint that asks the learner to confirm the plan — skip it. Do not ask questions and do not wait. Decide the step count, ids, one-sentence purposes, and source ranges yourself from the digests, then continue at step 5. You own the plan; the publisher chooses each title when `/article` writes the article.

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

Dispatch every call with `subagent_type: publisher`. Fill `<NODE-ID>`, `<SUBJECT>`, `<STEP-ID>`, and the step's fields from `prepare`'s `steps[]`. Give the subagent no other step's content.

```
Write one step's original article and image plan, then run the repo wrapper. This is one step only: do not read, write, or plan any other step.

Step: <SUBJECT>/<NODE-ID>/<STEP-ID>
Title: <TITLE or "choose one">
Purpose: <PURPOSE>
Material bundle: <MATERIAL>
Original output: <ORIGINAL>
Image plan output: <PLAN>
Run this command: <COMMAND>   (already includes --markers-only)
Then run this command: <TITLE-COMMAND>

Read the material bundle. Its `purpose` is the article's main theme; use the Read tool to read every file named in its `sources` in full, all the way to the end — the `locator` is only the cited range for provenance, not the reading range. Write the original article to <ORIGINAL> in the language recorded in `learn/<SUBJECT>/MEMORY.md` (this repo uses Traditional Chinese), grounded only in those sources. The first line is the H1: use <TITLE> exactly when one is given; when it says "choose one", pick a title from a heading or phrase that actually appears in the sources, translated faithfully, and do not invent one.

Decide 1-5 places where a figure genuinely helps the reader and spread them across the article. Write the imagePlan as a JSON array of objects with `heading`, `anchor`, and `prompt`; every `anchor` must be a short verbatim sentence from the original.

There is no `article_generate` tool in this repo. Writing the original and the plan, then running the command from the repo root, replaces it. The command inserts one `<!--image:N-->` marker at each plan `anchor` and leaves the prose unchanged. It does not generate figures and does not need IMAGE_API_KEY. The original must contain no `<!--image:N-->` markers: do not hand-place them, do not rewrite after the command returns, and do not retry automatically if it fails.

After the wrapper reports `completed`, run <TITLE-COMMAND>. It copies the H1 into the node's step entry and updates the `## Steps` label. Do not write to `learn/<SUBJECT>/nodes/` any other way.

Report back: command and title-command status, chosen title, output path, plan length, marker count, and any error.
```

## Humanize-prompt

Dispatch every call with `subagent_type: general`. Fill `<SUBJECT>`, `<NODE-ID>`, `<STEP-ID>`, `<TITLE>`, `<ARTICLE>`, and `<PLAN>`. Give the subagent no other step's content.

```
Humanize one step's article and its image plan in place.

Step: <SUBJECT>/<NODE-ID>/<STEP-ID>
Title: <TITLE>
Article: <ARTICLE>
Image plan: <PLAN>

Load the `speak-human-tw` skill and work in non-interactive mode: skip the confirmation list, edit the article and the plan directly, and report a post-hoc summary (original sentence / reason / replacement) in your final message.

Edit <ARTICLE> and <PLAN> only. Never edit the node container, another step, or any other file.

Article rules:
- Traditional Chinese (Taiwan).
- Change prose only; do not add facts, numbers, or quotations.
- Do not change the H1.
- Do not change fenced code blocks or provenance comments.
- Do not change `<!--image:N-->` markers.
- Do not change existing image lines or their captions.
- Do not change quiz blocks, relative links, or source links.
- The plan's `anchor` values must still appear verbatim in the article after your edit; when an anchor is inside a sentence you rewrite, keep that sentence (or at least the anchor text) intact.

Plan rules:
- Change only each item's `heading` and `prompt`; make them read like natural Traditional Chinese written for this article.
- Never change `anchor`, the array length, the item order, or the indices.
- Keep every `heading` and `prompt` a non-empty string.
- Do not turn a `prompt` into article prose; it stays an image brief.

If a sentence needs a fact you do not have, leave it or mark it; do not invent.

There is no apply step and no rollback. The main agent runs `verify` afterwards and checks the article diff and the plan against a backup; a changed H1, code block, provenance comment, marker, image line, caption, quiz block, link, plan length, plan order, or `anchor` fails the step.

Report back: whether you changed the article and/or plan, the edit count, a short summary, and any anchor you had to keep untouched.
```

## Quiz-prompt

Dispatch every call with `subagent_type: quiz-agent`. Fill the fields from `quiz.mjs prepare`'s `steps[]`.

```
Author the quiz sidecar for one published step. Read only this article and return only JSON; do not modify any file.

Article: <ARTICLE>
Title: <TITLE>
CJK character count: <CHARACTERS>
Minimum questions: <MIN-QUESTIONS>
Maximum questions: <MAX-QUESTIONS>

Write between <MIN-QUESTIONS> and <MAX-QUESTIONS> single-choice questions. Every correct answer must be directly supported by a sentence in this article, and no two questions may test the same concept. Use plausible distractors, keep each question self-contained, and write Traditional Chinese in the article's terminology. Return exactly the JSON object described in your agent instructions, with no commentary and no code fence.
```

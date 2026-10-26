---
name: batch-nodes
description: Batch-create a subject's node step plans, write their step articles, and generate step quizzes, via parallel subagents. Use when the learner wants to build or resume many nodes in one run.
disable-model-invocation: true
argument-hint: "/batch-nodes <subject> [tier<N> | node-id ...] [-max-subagents N] [-nodes-only] [-skip-article] [-skip-quiz] [-no-images] [-no-continuity] [-force]"
---

Invoke as `/batch-nodes <subject> [scope] [flags]`.

Run the normal pipeline — `/nodes` → `/article` → `/quiz-gen` — over many nodes in three phases. Each phase hands out work to parallel subagents, waits for the batch, records every outcome, and moves on. It does not invent a second content pipeline: the Nodes subagent follows `/nodes`, the Article phase dispatches `publisher` subagents and runs the `/article` CLI, and the Quiz phase dispatches `quiz-agent` subagents and runs `/quiz-gen`'s CLI.

**Invocation modes:**

- `/batch-nodes <subject>` — every node in the roadmap.
- `/batch-nodes <subject> tier<N>` — every node under `### Tier <N>` in the roadmap (for example `tier1`, `tier3`).
- `/batch-nodes <subject> <node-id> [<node-id> ...]` — only the listed nodes.
- `-max-subagents N` — batch width (default 3).
- `-nodes-only` — run the Nodes phase and stop.
- `-skip-article` — run Nodes and Quiz, skipping the Article phase. Useful for regenerating quizzes without touching article prose or spending text/image calls.
- `-skip-quiz` — run Nodes and Article, then stop.
- `-no-images` — run the Article phase without figures: no image plan, no image-API spend. A step that is actually rewritten loses any figures it already had.
- `-no-continuity` — skip the cross-step continuity edit and leave each article as its publisher and rewrite produced it.
- `-force` — rewrite step articles and quiz sidecars instead of skipping existing ones. It does not rebuild a node's step plan; use `/nodes` or `/reset-nodes` for that.

The Article phase generates figures by default and therefore spends image-API money. Pass `-no-images` when you only want text.

**State decides the work.** Rerunning the command resumes instead of redoing:

| State | Nodes phase | Article phase | Quiz phase |
| --- | --- | --- | --- |
| `status: draft`, or `steps: []` | build the plan | write every new step | after articles exist |
| plan exists, some step is missing or H1-only | skip | write only the missing steps | after articles exist |
| every step has a body | skip | skip, unless `-force` | write missing sidecars, unless `-force` |
| `<step>.quiz.json` exists | — | — | skip, unless `-force` |

Prereqs: `learn/<subject>/MEMORY.md`, `learn/<subject>/ROADMAP.md`, and `learn/<subject>/digests/` exist. The Article phase also needs root `node_modules` (`npm install`), an initialized `article-agent/` with its own dependencies, and a root `.env` holding `TEXT_API_KEY`; unless `-no-images`, `IMAGE_API_KEY` (or `EVOLINK_API_KEY`) must also be set. Gate each phase's prereqs before its first subagent fires, name anything missing, and stop without dispatching.

1. **Resolve.** Parse `subject`, the flags, and the scope (`tier<N>` | explicit node ids | all) per [skill-scope](../../../docs/reference/skill-scope.md). Never infer the subject from prose. Validate every resolved node container at `learn/<subject>/nodes/<node-id>.md`. Read each node's `status` and `steps` array and build the three queues:
   - **Nodes queue** — `status: draft` or `steps: []`.
   - **Article queue** — every node with a non-empty `steps` array. The `prepare` call in step 3 decides which steps actually need writing; a node whose steps all have bodies yields no publishers unless `-force`.
   - **Quiz queue** — rebuilt in step 4 from the nodes with published articles; `quiz.mjs prepare` decides which sidecars are missing.

   Gate the subject files here. If the Article phase is enabled (`-nodes-only` and `-skip-article` are both off), gate `node_modules`, `article-agent/`, `TEXT_API_KEY`, and — unless `-no-images` — the image keys. The Quiz phase needs no external key. Show a one-paragraph scope summary: resolved nodes, phase queues, and the flags in effect. Do not ask for confirmation; the invocation is the consent.

2. **Nodes.** Batch the Nodes queue into groups of `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per node in a single message, every call with `subagent_type: general` and the [Nodes-prompt](#nodes-prompt) filled in. Wait for every subagent, record `planned` or `failed` with the error, and print a progress line. A node that fails here is dropped from the Article and Quiz phases. Do not read its article folders to compensate.

   Nodes that are already `confirmed` or `written` and have a non-empty `steps` array skip this phase entirely. Their plan is the contract; `-force` does not change it. Add every node that reached `planned` to the Article queue before starting step 3.

3. **Article** (skip with `-nodes-only` or `-skip-article`). Process the Article queue in roadmap order.

   **3a. Prepare.** Run one CLI call per node, without `--force` unless the flag was given:

   ```bash
   node src/article-cli.mjs prepare --subject <subject> --node <node> [--force]
   ```

   Read the JSON. `steps[]` is the work: each entry carries `id`, `title`, `purpose`, `material`, `original`, `plan`, and `command`. `skipped[]` means the step already has a body; keep it out of the publisher batch. A skipped entry with `images: incomplete` is a warning for the final report — do not regenerate those images automatically; `-force` is the deliberate repair path. A prepare failure drops that node from the rest of the Article phase and from Quiz; record its error and continue with the next node.

   **3b. Dispatch publishers.** Combine the ready `steps[]` from every prepared node into one list, preserving node and step order. Batch that list into groups of `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per step in a single message, every call with `subagent_type: publisher` and the [Publisher-prompt](#publisher-prompt) filled in. Give each publisher only its own step's fields — never another step's article, plan, or source material. Wait for every call and record `completed` or `failed`.

   With `-no-images`, set the publisher's image mode to `NO-IMAGES`. With figures enabled, set it to `WITH-IMAGES`.

   **3c. Publish.** After all publisher batches finish, publish each node that has at least one prepared step, in roadmap order:

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node>
   ```

   Do not pass `--force` here; `prepare --force` already marked every step for republishing.

   It restores protected code, converts figures to WebP, writes the step Markdown, marks the node `written` when every step has a body, and runs verify. Record every step status and the verify result. If any publisher for the node failed, or publish reports a failed step, mark the node failed, keep the successful files, and drop the node from continuity and Quiz.

   **3d. Verify the phase.** For every node in the Article queue that did not fail prepare, run `node scripts/verify.mjs --node <subject>/<node>` even when no publisher ran, so an existing `written` node cannot slip into Quiz with a broken link or a missing sidecar. Drop any node whose verify fails and record the failures.

   **3e. Continuity** (skip with `-no-continuity`). For each node with more than one step where at least one step was published in this run, every prepared step published, every skipped step already had a body, and verify passed, run the continuity edit from `/article` yourself; do not delegate it to a subagent. Nodes whose articles were all skipped are left untouched. Read the published steps in `steps` order and edit prose only: connect each opening to the previous step's question or conclusion, hand the next question to the following step, define a term once, and keep names and examples consistent. Do not add facts, numbers, or quotations that the material does not support. Do not move paragraphs, and do not touch the H1, code fences and provenance comments, image lines, or `quiz` blocks. Re-run `node scripts/verify.mjs --node <subject>/<node>` after editing and drop the node from Quiz if it fails.

4. **Quiz** (skip with `-skip-quiz` or `-nodes-only`). Build the Quiz queue from the current node containers: every node not dropped by Nodes or Article whose steps have articles. With `-skip-article`, the Article phase did not run, so let `quiz.mjs prepare` report any step without a body.

   **4a. Prepare.** Run one CLI call per node, without `--force` unless the flag was given:

   ```bash
   node scripts/quiz.mjs prepare --subject <subject> --node <node> [--force]
   ```

   `steps[]` carries `article`, `title`, `characters`, `minQuestions`, and `maxQuestions`; `skipped[]` explains `article-missing`, `article-empty`, or `quiz-exists`. Record skips and continue.

   **4b. Dispatch quiz agents.** Combine the ready steps from every node into one list and batch it by `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per step in a single message, every call with `subagent_type: quiz-agent` and the [Quiz-prompt](#quiz-prompt) filled in. Give the agent only that step's article path, title, character count, and question range. The agent returns JSON and writes no files.

   **4c. Write and validate.** For each agent response, create the candidate directory if needed and write the returned JSON verbatim to:

   ```text
   learn/<subject>/output/quiz-candidates/<node>/<step>.json
   ```

   Then run:

   ```bash
   node scripts/quiz.mjs write --subject <subject> --node <node> --step <step> --input learn/<subject>/output/quiz-candidates/<node>/<step>.json [--force]
   ```

   The script validates the schema, the 3–8 question window, and the article's character-based ceiling before writing `<step>.quiz.json`. A failed step keeps its candidate file and error; continue with the next step. Never hand-write or hand-edit questions, and never insert them into the article Markdown.

   **4d. Verify and rebuild viewer data.** Run `node scripts/verify.mjs --node <subject>/<node>` for every node the Quiz phase processed. When at least one sidecar was written, run:

   ```bash
   npm --prefix course-app run gen
   ```

5. **Report.** Summarise per phase:

   - **Nodes** — planned / skipped / failed, with step counts and errors.
   - **Article** — published steps, skipped steps, continuity nodes, image warnings, failed nodes, verify results.
   - **Quiz** — written sidecars, skipped steps with reasons, failed steps with validation errors, verify results, and the `course-app` data result.

   List every failure with its error. Suggest rerunning `/batch-nodes <subject> <failed-node>`, using `node src/article-cli.mjs image --subject <subject> --node <node> --step <step>` for an image repair, or running `/edges <subject>/<node>` on completed nodes.

Completion, for every phase that ran:

- **Nodes** — every node that needed a plan was dispatched to a Nodes subagent, reached `planned`, and verifies clean.
- **Article** — every step that needed an article was prepared, dispatched to its own publisher, and either published or reported failed; every multi-step node that received a new article also received the continuity edit unless `-no-continuity` was set; every published node passes `node scripts/verify.mjs --node <subject>/<node>`.
- **Quiz** — every step that needed a sidecar was dispatched to its own quiz-agent and either has a validated sidecar or a recorded failure; `course-app` data was regenerated when any sidecar was written.

The final report lists the outcome of every phase that ran.

Never hand-write article prose outside the continuity edit, never hand-write quiz questions, and never edit a node's `steps` outside the Nodes phase.

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

Dispatch every call with `subagent_type: publisher`. Fill `<NODE-ID>`, `<SUBJECT>`, `<STEP-ID>`, and the step's fields from `prepare`'s `steps[]`. Give the subagent no other step's content.

```
Write one step's original article and image plan, then run the repo wrapper. This is one step only: do not read, write, or plan any other step.

Step: <SUBJECT>/<NODE-ID>/<STEP-ID>
Title: <TITLE>
Purpose: <PURPOSE>
Material bundle: <MATERIAL>
Original output: <ORIGINAL>
Image plan output: <PLAN>
Image mode: <WITH-IMAGES or NO-IMAGES>
Run this command: <COMMAND>

Read the material bundle. Write the original article to <ORIGINAL> in the language recorded in `learn/<SUBJECT>/MEMORY.md` (this repo uses Traditional Chinese), grounded only in the material.

With images: decide 1-5 places where a figure genuinely helps the reader and spread them across the article. Write the imagePlan as a JSON array of objects with `heading`, `anchor`, and `prompt`; every `anchor` must be a short verbatim sentence from the original.
No images: do not create <PLAN>; skip the image-plan work and append `--no-images` to the command.

There is no `article_generate` tool in this repo. Writing the original (and, when enabled, the plan), then running the command from the repo root, is the equivalent of one `article_generate` call. The command rewrites the original once and generates the figures. Do not rewrite after it returns, do not hand-place figures, and do not retry automatically if it fails.

Report back: command status (completed/failed), output path, image count, and any error.
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

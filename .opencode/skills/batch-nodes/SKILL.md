---
name: batch-nodes
description: Batch-create a subject's node step plans, write their step articles, humanize them, render their figures, and generate step quizzes, via parallel subagents. Use when the learner wants to build or resume many nodes in one run.
disable-model-invocation: true
argument-hint: "/batch-nodes <subject> [tier<N> | node-id ...] [-max-subagents N] [-nodes-only] [-skip-article] [-skip-humanize] [-skip-images] [-skip-quiz] [-no-continuity] [-force]"
---

Invoke as `/batch-nodes <subject> [scope] [flags]`.

Run the normal pipeline — `/nodes` → `/article` → humanize → `/generate-images` → `/quiz-gen` — over many nodes in five phases. Each phase hands out work to parallel subagents where it has any, waits for the batch, records every outcome, and moves on. It does not invent a second content pipeline: the Nodes subagent follows `/nodes`, the Article phase dispatches `publisher` subagents and runs the `/article` CLI, the Humanize phase dispatches `general` subagents that load the `speak-human-tw` skill and edit each step's `humanized.md` plus its plan's `heading` and `prompt`, the Generate phase runs the `/generate-images` render CLI, and the Quiz phase dispatches `quiz-agent` subagents and runs `/quiz-gen`'s CLI.

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
   - **Generate queue** — rebuilt in step 5 from the nodes with at least one step plan at `learn/<subject>/nodes/<node>/<step>.plan.json`.
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

   Read the JSON. `steps[]` is the work: each entry carries `id`, `title` (may be `null`), `purpose`, `material`, `original`, `polish`, `plan`, `polishCommand`, `command` (already `--markers-only`), and `titleCommand`. `skipped[]` means the step already has a body; keep it out of the publisher batch. A prepare failure drops that node from the rest of Article, Humanize, Generate, and Quiz; record its error and continue with the next node.

   **3b. Dispatch publishers.** Combine the ready `steps[]` from every prepared node into one list, preserving node and step order. Batch that list into groups of `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per step in a single message, every call with `subagent_type: publisher` and the [Publisher-prompt](#publisher-prompt) filled in. Give each publisher only its own step's fields — never another step's article, plan, or source material. Each publisher writes the original and plan, runs `polishCommand` to produce `polish.md` and polish the plan, then runs the markers-only wrapper and the title command. Wait for every call and record `completed` or `failed`.

   **3c. Publish.** After all publisher batches finish, publish each node that has at least one prepared step, in roadmap order:

   ```bash
   node src/article-cli.mjs publish --subject <subject> --node <node> [--force]
   ```

   Pass `--force` only when the run was invoked with `-force`, so a successful write clears that step's stale figures. It restores protected code, keeps the `<!--image:N-->` markers, writes the step Markdown, marks the node `written` when every step has a body, and runs verify. It does not touch `<step>-assets/` or render figures. Record every step status and the verify result. If any publisher for the node failed, or publish reports a failed step, mark the node failed, keep the successful files, and drop the node from Humanize, Generate, and Quiz.

   **3d. Verify the phase.** For every node in the Article queue that did not fail prepare, run `node scripts/verify.mjs --node <subject>/<node>` even when no publisher ran, so an existing `written` node cannot slip into Humanize or Quiz with a broken link or a missing sidecar. Marker-only articles pass: `<!--image:N-->` is an HTML comment, not an image line. Drop any node whose verify fails and record the failures.

   **3e. Continuity** (skip with `-no-continuity`). For each node with more than one step where at least one step was published in this run, every prepared step published, every skipped step already had a body, and verify passed, run the continuity edit from `/article` yourself; do not delegate it to a subagent. Nodes whose articles were all skipped are left untouched. Read the published steps in `steps` order and edit prose only: connect each opening to the previous step's question or conclusion, hand the next question to the following step, define a term once, and keep names and examples consistent. Do not add facts, numbers, or quotations that the material does not support. Do not move paragraphs, and do not touch the H1, code fences and provenance comments, `<!--image:N-->` markers, existing image lines and captions, or `quiz` blocks. Re-run `node scripts/verify.mjs --node <subject>/<node>` after editing and drop the node from Humanize, Generate, and Quiz if it fails.

4. **Humanize** (skip with `-nodes-only` or `-skip-humanize`). Only steps with a plan are eligible; existing articles without a plan are never touched. Process the Humanize queue in roadmap order.

   **4a. Prepare.** Run one CLI call per node in roadmap order:

   ```bash
   node scripts/humanize-article.mjs prepare --subject <subject> --node <node>
   ```

   For every eligible step it creates `output/<node>/<step>/humanized.md` as an exact copy of `step.md` and `output/<node>/<step>/humanized.plan.json` as an exact copy of the plan. `steps[]` is the work; `skipped[]` explains `skipped-no-article`, `skipped-no-plan`, or `skipped-not-published`; `failed[]` carries an invalid plan. Record every skip and continue. A prepare failure drops that node from Generate and Quiz.

   There is no hash record and no separate plan backup, so a rerun prepares every eligible step again. A node with no ready steps is not dispatched and is not a failure.

   **4b. Dispatch humanize agents.** Combine the ready steps from every node into one list, preserving node and step order, and batch it by `max-subagents`. Run batches sequentially; within a batch dispatch one `task` call per step in a single message, every call with `subagent_type: general` and the [Humanize-prompt](#humanize-prompt) filled in. Give the agent only that step's `title`, its `humanized` path, and its `humanizedPlan` path. Never give it the official article, the official plan, another step's content, or the node plan.

   **4c. Apply.** After every ready step of a node has returned, run one apply call per step:

   ```bash
   node scripts/humanize-article.mjs apply --subject <subject> --node <node> --step <step> [--summary "<one-line summary>"]
   ```

   It validates `humanized.md` against the official article: H1, fenced code and provenance, marker sequence, existing image lines and captions, quiz blocks, and relative/source links must be unchanged. It validates `humanized.plan.json` against the official plan: length, item order, every other key, and every existing `anchor` must be unchanged, with only `heading` and `prompt` allowed to change; its length must also match the marker (or rendered image) count. Only then does it write `step.md` and the plan back. On failure both official files stay untouched and the humanized copies stay in place for repair; record the step as `failed` and drop the node from Generate and Quiz.

   After every ready step of a node has applied, run:

   ```bash
   node scripts/verify.mjs --node <subject>/<node>
   ```

   A successful apply leaves `humanized.md` identical to `step.md`. Drop the node from Generate and Quiz if verify fails.

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

   **6b. Dispatch quiz agents.** One `quiz-agent` per node, so a node's steps cost one subagent launch. Batch the nodes by `max-subagents`; within a batch dispatch one `task` call per node in a single message, every call with `subagent_type: quiz-agent` and the [Quiz-prompt](#quiz-prompt) filled in for that node's ready steps. Give the agent only its node's step fields and candidate paths. The agent writes `learn/<subject>/output/quiz-candidates/<node>/<step>.json` itself and returns the paths it wrote.

   **6c. Write and validate.** Run one `write` per ready step:

   ```bash
   node scripts/quiz.mjs write --subject <subject> --node <node> --step <step> --input learn/<subject>/output/quiz-candidates/<node>/<step>.json [--force]
   ```

   The script validates the schema, the 3–8 question window, the article's character-based ceiling, and the option shape (`quiz-option-length`, `quiz-answer-spread`). Only a passing file becomes `<step>.quiz.json`. The agent self-checks every candidate with `node scripts/quiz.mjs check` before returning, so `write` normally passes on the first call.

   When `write` reports `quiz-option-length`, `quiz-answer-spread`, or a `quiz-file-*` error, re-dispatch that node's agent once with the failed steps' errors quoted, then rerun `write` for those steps. A step that fails the second time keeps its candidate file and error and the batch continues. Never hand-write or hand-edit questions, and never insert them into the article Markdown.

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
- **Humanize** — every eligible step was either humanized or skipped for a recorded reason; each humanized article kept its H1, code, provenance, markers, image lines, quiz blocks, and links; each plan kept its length, order, and any existing `anchor` with only `heading` and `prompt` changed; every processed node verifies clean.
- **Generate** — every marker-backed step has its `image-N.webp` files and its markers replaced by uncaptioned image lines; rerun without `-force` reports `already-rendered` or reuses images; every processed node verifies clean.
- **Quiz** — every step that needed a sidecar was covered by its node's quiz-agent and either has a validated sidecar or a recorded failure; `course-app` data was regenerated when any sidecar was written.

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
Write one step's original article and image plan, polish both, then run the repo wrapper. This is one step only: do not read, write, or plan any other step.

Step: <SUBJECT>/<NODE-ID>/<STEP-ID>
Title: <TITLE or "choose one">
Purpose: <PURPOSE>
Material bundle: <MATERIAL>
Original output: <ORIGINAL>
Image plan output: <PLAN>
Run this command first: <POLISH-COMMAND>
Then run this command: <COMMAND>   (already includes --markers-only)
Then run this command: <TITLE-COMMAND>

Read the material bundle. Its `purpose` is the article's main theme; use the Read tool to read every file named in its `sources` in full, all the way to the end — the `locator` is only the cited range for provenance, not the reading range. Write the original article to <ORIGINAL> in the language recorded in `learn/<SUBJECT>/MEMORY.md` (this repo uses Traditional Chinese), grounded only in those sources. The first line is the H1: use <TITLE> exactly when one is given; when it says "choose one", pick a title from a heading or phrase that actually appears in the sources, translated faithfully, and do not invent one.

Decide 1-5 places where a figure genuinely helps the reader, spread them across the article, and put one `<!--image:N-->` marker at each place: its own line, blank lines before and after, numbered 1..N in article order. Write the imagePlan as a JSON array with one item per marker, in the same order; each item has `heading` and `prompt` only, no `anchor`. The plan length must equal the marker count.

There is no `article_generate` tool in this repo. After writing <ORIGINAL> and <PLAN>, run <POLISH-COMMAND> from the repo root. It polishes the prose and each plan item's `heading` and `prompt`, keeps the H1, markers, code, and links intact, and needs TEXT_API_KEY. If it fails, stop and report the error; do not edit the files to work around it and do not retry automatically. Do not modify <ORIGINAL> or <PLAN> after it succeeds.

Then run <COMMAND>. The command reads `polish.md` and validates that its `<!--image:N-->` markers match the plan in count and order and keeps them in place; it does not insert or move markers. It does not generate figures and does not need IMAGE_API_KEY. Do not rewrite the article after the command returns, and do not retry automatically if it fails.

After the wrapper reports `completed`, run <TITLE-COMMAND>. It copies the H1 into the node's step entry and updates the `## Steps` label. Do not write to `learn/<SUBJECT>/nodes/` any other way.

Report back: polish, command, and title-command status, chosen title, output path, plan length, marker count, and any error.
```

## Humanize-prompt

Dispatch every call with `subagent_type: general`. Fill `<SUBJECT>`, `<NODE-ID>`, `<STEP-ID>`, `<TITLE>`, `<HUMANIZED>`, and `<HUMANIZED-PLAN>`. Give the subagent no other step's content.

```
Humanize one step's article and image plan copies.

Step: <SUBJECT>/<NODE-ID>/<STEP-ID>
Title: <TITLE>
Article copy: <HUMANIZED>
Image plan copy: <HUMANIZED-PLAN>

Load the `speak-human-tw` skill and work in non-interactive mode: skip the confirmation list, edit the two copies directly, and report a post-hoc summary (original sentence / reason / replacement) in your final message.

Edit <HUMANIZED> and <HUMANIZED-PLAN> only. Never edit the official article, the official plan, the node container, another step, or any other file.

Article rules:
- Traditional Chinese (Taiwan).
- Change prose only; do not add facts, numbers, or quotations.
- Do not change the H1.
- Do not change fenced code blocks or provenance comments.
- Do not change `<!--image:N-->` markers.
- Do not change existing image lines or their captions.
- Do not change quiz blocks, relative links, or source links.
- If a plan item has an `anchor`, it must still appear verbatim in the article after your edit; when an anchor is inside a sentence you rewrite, keep that sentence (or at least the anchor text) intact. New plans have no anchors — their image positions are the `<!--image:N-->` markers.

Plan rules:
- Change only each item's `heading` and `prompt`; make them read like natural Traditional Chinese written for this article.
- Never change an `anchor` that exists, the array length, the item order, or the indices.
- Keep every `heading` and `prompt` a non-empty string.
- Do not turn a `prompt` into article prose; it stays an image brief.

If a sentence needs a fact you do not have, leave it or mark it; do not invent.

The main agent runs `scripts/humanize-article.mjs apply` afterwards. A changed H1, code block, provenance comment, marker, image line, caption, quiz block, link, plan length, plan order, plan key, or any existing `anchor` fails the step and leaves the official files untouched.

Report back: whether you changed the article and/or plan, the edit count, a short summary, and any existing anchor you had to keep untouched.
```

## Quiz-prompt

Dispatch every call with `subagent_type: quiz-agent`. Fill one block per ready step from that node's `quiz.mjs prepare` output.

```
Author the quiz sidecars for one node's published steps. Read only the articles listed and write only the candidate files listed.

Node: <SUBJECT>/<NODE>

Steps:
- id: <STEP-ID>
  Article: <ARTICLE>
  Title: <TITLE>
  CJK character count: <CHARACTERS>
  Questions: <MIN-QUESTIONS>-<MAX-QUESTIONS>
  Candidate file: learn/<SUBJECT>/output/quiz-candidates/<NODE>/<STEP-ID>.json

Every correct answer must be directly supported by a sentence in that step's article. No two questions may test the same concept, within a step or across these steps. Use plausible distractors, keep each question self-contained, and write Traditional Chinese in the article's terminology. The Option shape rules in your instructions are hard requirements: keep every option inside the one length band and rotate the correct index `(n − 1) mod <option count>`. When a range is a single number, write exactly that many questions.

Self-check every file with `node scripts/quiz.mjs check --subject <SUBJECT> --node <NODE> --step <STEP-ID> --input <CANDIDATE>` and fix until each reports `"status": "ok"`. That is the only command you may run. Then report the paths you wrote.
```

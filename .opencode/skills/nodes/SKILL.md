---
name: nodes
description: Reason out a node's step-DAG, create skeleton step files, and write the node container. Step content is filled by /teach.
disable-model-invocation: true
argument-hint: "Which subject/node should be written?"
---

Invoke as `/nodes <subject>/<node-id>`, or `/nodes <subject>/<node-id> skip-probe` when the learner knows nothing and wants every step taught deep.

**Prereqs.** `learn/<subject>/MEMORY.md` exists, node container exists. The node must be `probed` or further — a `draft` node stops you; tell the learner to run `/probe <subject>/<node-id>` first. Exception: `skip-probe` accepts `draft` directly (promotes to `confirmed` in step 1).

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.mdx`. Resolve source references from the node — do not infer the subject from a node name. Set the node to `confirmed` (the explicit `/nodes` invocation is the confirmation gate). A `draft` node only advances with `skip-probe`.

2. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read sources through `learn/<subject>/digests/` — never raw sources. When L2 detail is insufficient, dispatch a sub-agent to pull the exact section text by locator (one-off, returned in message).

3. **Calibrate step depth.** Read the node's entry in `learn/<subject>/mastery.md` (if it exists). Rate depth by the **most conservative** strand — any `unknown` makes the node deep; all-`solid` makes it shallow; otherwise mixed. Per-step: teach **shallow** where the strands are all `solid` (brief recall, then connections/edges/examples); **deep** where any strand is `unknown` (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites); **mixed** in between. Mastery is a depth input only — it never prunes, reorders, or deletes any step.

   With `skip-probe`: skip the lookup, treat every strand `unknown`, teach deep everywhere. Record the skip in `learn/<subject>/mastery.md` — create the node's entry with strands from the digest's `Key claims`/`Learner-relevant` lines, all `unknown`, and a note: `probe skipped via /nodes <subject>/<node-id> skip-probe on <YYYY-MM-DD>`.

4. **Reason the step-DAG.** Decompose the node into steps before writing anything. Each step is one coherent teaching unit with its own learner-facing goal. Give each step an immutable kebab-case `id`, a reading `order`, and `deps` naming the earlier steps it builds on; a step may branch from or merge into several. 2–5 steps is typical. The DAG is a deliberate plan reasoned from the digests, never improvised while writing articles.

5. **Confirm the DAG (checkpoint).** Present the step-DAG — step ids, one-line goals, order, deps, and each step's calibrated depth (shallow | mixed | deep) — and ask the learner to confirm. Exit options: accept; reorder or rename steps; add, remove, split, or merge steps. Do not write a single step file until this checkpoint passes.

6. **Create skeleton step files.** Each step gets a skeleton at `learn/<subject>/nodes/<node-id>/<step-id>.mdx` — frontmatter (`id`, `title`, `subject`, `sources`, `created`, `updated`), `<LearningGoal>` with the one-sentence goal, `## Lesson` heading only (empty body), and `## Sources` heading only. No lesson content. No sub-agents.

   **Path rule (non-negotiable).** Every step file MUST be written to `learn/<subject>/nodes/<node-id>/` — inside a subdirectory named after the node. Step files MUST NOT be written directly into `learn/<subject>/nodes/`. Before writing, ensure the subdirectory exists (create it if missing). The parent verifies every step file landed at the correct path after all writes.

7. **Write the node container.** Rewrite `learn/<subject>/nodes/<node-id>.mdx` as a container: `steps` frontmatter (id + order + deps), the reading order in `## Steps`, a short `## Lesson` main lesson (the overarching idea the steps build toward — not a second full article), and `## Sources`. Set `prerequisites` to the nodes the learner should know first. No flat lists.

8. **Verify via the script.** Run `node scripts/verify.mjs --node <subject>/<node-id>`. This checks format only — frontmatter, ID/filename match, step↔DAG consistency, step/node link resolution, source-path and digest-locator resolution (per `docs/reference/verify.md`). Fix each non-zero exit and re-run, up to 3 rounds. After the 3rd, list any remaining failures in step 9. Do not re-read article bodies for prose judgment — the script is the sole format gate.

9. **Report.** List the confirmed DAG (with each step's calibrated depth), skeleton step files created, the node container, the script result (exit status and surviving failures), and any unresolved source or link issues. Move the node to `nodes-written`. Tell the learner: run `/teach <subject>/<node-id>` to begin interactive learning — each step will be taught and its content written to the step file.

## Node container format

See [NODE-FORMAT.md](./NODE-FORMAT.md) for the full template and rules.

## Step format

See [STEP-FORMAT.md](./STEP-FORMAT.md) for the full template, rules, and lesson body-prose rules.

## Segmented writing protocol

When writing any artifact (step article or node container), never put the entire file body into a single `write` call. Large content (> ~3 KB) risks an Invalid tool error. Instead:

1. **Skeleton** — `write` the file with frontmatter + all section headings only (no body text). Example for a step article:
   ```markdown
   ---
   id: step-id
   title: Step title
   subject: <subject>
   sources:
     - "[[sources/<subject>/<file>#<section>]]"
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   ---
   # Step title
   ## Learning goal
   ## Lesson
   ## Sources
   ```
2. **Append sections** — for each section, use `edit` to replace the heading line with itself plus the body text. Match the heading as `oldString`, output heading + body as `newString`. Work through sections in order.
3. **Lesson body** — for long sections like `## Lesson` (≥ 1000 字), split the body into 2–3 logical paragraphs and append each via a separate `edit` call. This keeps each tool call within safe limits.

The same pattern applies to node containers (write skeleton with all `## ` headings, then fill each section via `edit`).

## Examples

Match the worked examples when writing artifacts. `examples/STEP.mdx` shows a finished step article (lesson with node-qualified source links). `examples/NODE.mdx` shows a finished node container (the `steps` DAG, reading order, and short main lesson). The examples carry prose and voice; the formats above stay the contract — frontmatter, sections, and links still come from the template even where an example omits them.

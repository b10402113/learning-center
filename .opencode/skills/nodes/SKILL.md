---
name: nodes
description: Reason out a node's step-DAG, then write each step article and the node container.
disable-model-invocation: true
argument-hint: "Which subject/node should be written?"
---

Invoke as `/nodes <subject>/<node-id>`, or `/nodes <subject>/<node-id> skip-probe` when the learner knows nothing and wants every step taught deep. Optional trailing integer sets concurrency `C` — max sub-agents simultaneously in steps 7–9 (default: unbounded). `-no-subagent` makes steps 7–9 write all content inline — the main agent composes every element, step article, and polish pass itself, no Task dispatch. Context cost rises; output quality stays identical (same templates, same verification). When `-no-subagent` is set, concurrency `C` is ignored.

**Prereqs.** `learn/<subject>/MEMORY.md` exists, node container exists. The node must be `probed` or further — a `draft` node stops you; tell the learner to run `/probe <subject>/<node-id>` first. Exception: `skip-probe` accepts `draft` directly (promotes to `confirmed` in step 1).

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.mdx`. Resolve source references from the node — do not infer the subject from a node name. Set the node to `confirmed` (the explicit `/nodes` invocation is the confirmation gate). A `draft` node only advances with `skip-probe`.

2. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read sources through `learn/<subject>/digests/` — never raw sources. When L2 detail is insufficient, dispatch a sub-agent to pull the exact section text by locator (one-off, returned in message).

3. **Calibrate step depth.** Read the node's entry in `learn/<subject>/mastery.md` (if it exists). Rate depth by the **most conservative** strand — any `unknown` makes the node deep; all-`solid` makes it shallow; otherwise mixed. Per-step: teach **shallow** where every element cites `solid` strands (brief recall, then connections/edges/examples); **deep** where any element cites `unknown` (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites); **mixed** in between. Mastery is a depth input only — it never prunes, reorders, or deletes any step or element.

   With `skip-probe`: skip the lookup, treat every strand `unknown`, teach deep everywhere. Record the skip in `learn/<subject>/mastery.md` — create the node's entry with strands from the digest's `Key claims`/`Learner-relevant` lines, all `unknown`, and a note: `probe skipped via /nodes <subject>/<node-id> skip-probe on <YYYY-MM-DD>`.

4. **Reason the step-DAG.** Decompose the node into steps before writing anything. Each step is one coherent teaching unit with its own learner-facing goal. Give each step an immutable kebab-case `id`, a reading `order`, and `deps` naming the earlier steps it builds on; a step may branch from or merge into several. 2–5 steps is typical. The DAG is a deliberate plan reasoned from the digests, never improvised while writing articles.

5. **Confirm the DAG (checkpoint).** Present the step-DAG — step ids, one-line goals, order, deps, and each step's calibrated depth (shallow | mixed | deep) — and ask the learner to confirm. Exit options: accept; reorder or rename steps; add, remove, split, or merge steps. Do not write a single step file or element until this checkpoint passes.

6. **Select concepts.** Identify the core concepts each step needs as elements — concepts that deserve independent explanation, reuse, or judgment. Ordinary one-off terms do not need element pages. Usually 3–7 per node. Reuse an existing element when the core concept is the same; a step-specific framing belongs in the step article, not a duplicate element. Never author a `question`-typed element — graded verification lives only in `/tackle`.

   **Element 是關鍵字，不是步驟標題。** 每個 element 必須是一個可獨立查閱的「概念詞」或「術語」，不可與任何 step ID 重複。判斷標準：這個詞能不能當作 dictionary entry 的標題？如果答案是「這太長了」或「這其實是個流程」，它就該留在 step article 裡，而不是變成 element。一個 step 通常對應 2–5 個 element；如果一個 step 只覆盖一個大概念，拆成 2–3 個可獨立查詢的子概念。

7. **Write elements.** For each selected concept, write `learn/<subject>/elements/<element-id>.mdx`. The frontmatter (`id`, `title`, `subject`, `tier`, `order`, `type`, `nodes`, `sources`, `created`, `updated`) is always the parent's. The body follows [ELEMENT-FORMAT.md](./ELEMENT-FORMAT.md): digest L2 sections for the element's sources, the prose rules from step 11, and the `language` from `MEMORY.md`. Two modes:

   - **Default (sub-agent).** Dispatch one `general` sub-agent (Task tool, parallel, respecting `C`) per element. Each prompt is a complete self-contained brief — the agent reads only the digest sections it needs (given as L2 locators by the parent) and fills the body. Wait for all element sub-agents to complete before step 8.
   - **`-no-subagent`.** Write each element inline — compose the body in the main agent's context and commit directly to disk. Work through elements sequentially; each write frees only the elements already done, not the source digests (still needed for later elements).

8. **Draft step articles.** Each step article follows [STEP-FORMAT.md](./STEP-FORMAT.md) — frontmatter, `## Learning goal`, `## Lesson` (≥ 1,000 字 on the body), `## Sources`. The brief carries the full step spec (node id, step id, title, goal, `teaches` element ids, deps, calibrated depth) **and the exact digest section locators** (from step 2), plus the writer brief below. Two modes:

   - **Default (sub-agent).** Dispatch one `general` sub-agent per step (parallel, respecting `C` — when bounded, dispatch in batches, waiting for each batch to finish; when unbounded, dispatch all at once). Each prompt is a complete self-contained brief — the agent reads only `MEMORY.md`, the digest, and the element pages it links. The writer commits directly to a single final pass. The parent's context holds only the step spec and locators; article text lives solely on disk.
   - **`-no-subagent`.** Write each step article inline — compose the `## Lesson` body in the main agent's context and commit directly to disk. Work through steps sequentially in DAG order; the main agent reads `MEMORY.md`, the digest sections, and the element pages it links for each step, then writes the article. Context accumulates across steps — the path rule and per-step verification still apply.

   **Path rule (non-negotiable).** Every step file MUST be written to `learn/<subject>/nodes/<node-id>/<step-id>.mdx` — inside a subdirectory named after the node. Step files MUST NOT be written directly into `learn/<subject>/nodes/`. Before writing, ensure the subdirectory `learn/<subject>/nodes/<node-id>/` exists (create it if missing). The parent verifies every step file landed at the correct path after all writes or sub-agents return.

9. **Polish step articles.** Read `MEMORY.md` frontmatter. When `polish` names a template, rewrite each step article into plain language in that template's style. Two bounds apply in both modes: the polish rewrites prose, not the contract — it preserves frontmatter (`id`, `subject`, `teaches`, `sources`, `created`, `updated`; `title` is the sole exception), section headings (`## Learning goal` · `## Lesson` · `## Sources`), and every element link and source citation; and the rewrite keeps the article in `language` and honors the prose rules below (step 11 verifies again). Regenerate from scratch — not sentence-by-sentence editing, since the draft is usually dense — preserving every fact, number, name, and source, never pruning content, so the body still clears the 1,000字 floor. Record each post-polish `## Lesson` character count for the report. `polish: none` (or a missing template) skips this step — the drafted article is final. Two modes:

   - **Default (sub-agent).** Dispatch one `polish-agent` per step (parallel, respecting `C`). Each agent reads `polish/<slug>/polish.md` and every example article in `polish/<slug>/examples/` first, then regenerates the body. It writes the regenerated body back, rewrites the frontmatter `title` SEO-friendly, and returns a one-line summary (naming old and new title when changed). After all return, sync each renamed step's display alias in the node container's step links.
   - **`-no-subagent`.** Apply polish inline — read the template and examples once, then rewrite each step article sequentially. The main agent reads the `## Lesson` body, regenerates it, and commits the rewrite directly to disk. Sync display aliases in the node container after all steps are polished.

10. **Write the node container.** Rewrite `learn/<subject>/nodes/<node-id>.mdx` as a container: `steps` frontmatter (id + order + deps), the reading order in `## Steps`, a short `## Lesson` main lesson (the overarching idea the steps build toward — not a second full article), and `## Sources`. Set `prerequisites` to the elements and nodes the learner should know first. No flat `elements` frontmatter list.

11. **Verify via the script.** Run `node scripts/verify.mjs --node <subject>/<node-id>`. This checks format only — frontmatter, ID/filename match, step↔DAG consistency, `teaches`/element/step/node link resolution, source-path and digest-locator resolution, element section presence, and polish-template resolution (per `docs/reference/verify.md`). Fix each non-zero exit and re-run, up to 3 rounds. After the 3rd, list any remaining failures in step 12. Do not re-read article bodies for prose judgment — the script is the sole format gate.

12. **Report.** List the confirmed DAG (with each step's calibrated depth), created/updated elements, written step articles (with `## Lesson` character count — from each sub-agent in default mode, measured after each inline write in `-no-subagent` mode), the node container, the script result (exit status and surviving failures), and any unresolved source or link issues. Move the node to `nodes-written` → `content-written`.

## Node container format

See [NODE-FORMAT.md](./NODE-FORMAT.md) for the full template and rules.

## Step format

See [STEP-FORMAT.md](./STEP-FORMAT.md) for the full template, rules, and lesson body-prose rules.

## Element format

See [ELEMENT-FORMAT.md](./ELEMENT-FORMAT.md) for the full template, body sections, and naming rules.

## Segmented writing protocol

When writing any artifact (element, step article, node container, or polish rewrite), never put the entire file body into a single `write` call. Large content (> ~3 KB) risks an Invalid tool error. Instead:

1. **Skeleton** — `write` the file with frontmatter + all section headings only (no body text). Example for a step article:
   ```markdown
   ---
   id: step-id
   title: Step title
   subject: <subject>
   teaches:
     - <subject>/<element-id>
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

The same pattern applies to elements (write skeleton with all `## ` headings, then fill each section via `edit`) and node containers.

## Examples

Match the worked examples when writing artifacts. `examples/ELEMENT.mdx` shows finished element pages (plain-first prose, the `language` term first with the English name glossed in parentheses, rendered section headings). `examples/STEP.mdx` shows a finished step article (lesson with `teaches` frontmatter and node-qualified element links). `examples/NODE.mdx` shows a finished node container (the `steps` DAG, reading order, and short main lesson). The examples carry prose and voice; the formats above stay the contract — frontmatter, `Connections`, `Deep dive`, and `Questions` still come from the template even where an example omits them.

---
name: nodes
description: Reason out a node's step-DAG, then write each step article and the node container.
disable-model-invocation: true
argument-hint: "Which subject/node should be written?"
---

Turn one probed node into a step-DAG of step articles. Invoke as `/nodes <subject>/<node-id>`, or `/nodes <subject>/<node-id> skip-probe` when the learner knows nothing about the topic and wants to skip the probe entirely — every strand counts as `unknown`, so every step is taught deep (step 3). You may also pass a concurrency limit: `/nodes <subject>/<node-id> [skip-probe] <max-agents>` (e.g. `/nodes ai/transformer 4`) to spawn at most `max-agents` sub-agents at a time in step 8. When omitted, the default concurrency is used (all steps dispatched in parallel). A **node** is a container holding a step-DAG (step ids + order + deps), the reading order, and a short main lesson; a **step** is a first-class article file that declares the **elements** it teaches; an **element** is a keyword dictionary page that carries the detailed explanation behind a step's narrative. Depth is calibrated from the node's probe mastery (step 3) — it only shapes depth, never prunes content.

Prereqs: `learn/<subject>/MEMORY.md` exists and the node container exists. The node must be `probed` or further — a `draft` node was never probed, so stop and tell the learner to run `/probe <subject>/<node-id>` first. The sole exception is `/nodes <subject>/<node-id> skip-probe`: the learner explicitly asserts they don't know the topic at all, so no probe is needed and a `draft` node is accepted (it promotes to `confirmed` in step 1). If the node is already `confirmed` or further along, continue directly — later steps update incrementally.

Parse the invocation: the first positional arg is `<subject>/<node-id>`. An optional `skip-probe` flag follows. An optional trailing integer sets the concurrency limit `C` — the maximum number of sub-agents to spawn simultaneously in steps 7, 8 and 9. When omitted, `C` is unbounded (all eligible steps dispatched at once).

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.mdx`. Resolve the node's exact source references — do not infer the subject from a node name. Set the node to `confirmed` now: the explicit `/nodes` invocation is the confirmation gate. A `draft` node is only accepted with `skip-probe` — it moves `draft → confirmed` directly, bypassing `probed`.
2. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read the node's sources through `learn/<subject>/digests/` — never raw sources. When a digest's L2 detail is insufficient for a concept, dispatch a sub-agent to pull the exact section text by locator (one-off, returned in message).
3. **Calibrate step depth from the node's probe mastery.** With `skip-probe`, the learner has asserted they know nothing about the topic: skip the calibration lookup, treat every strand as `unknown`, and teach the node **deep** everywhere (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites). Record the skip in `learn/<subject>/mastery.md` — create the node's entry in `/probe`'s format with its strands named from the digest's `Key claims`/`Learner-relevant` lines, all rated `unknown`, and a `Notes` line `probe skipped via /nodes <subject>/<node-id> skip-probe on <YYYY-MM-DD>` — so `/tackle` targets everything and a later `/probe` re-measures from scratch. Otherwise read the node's entry in `learn/<subject>/mastery.md` **if it exists** (written by `/probe <subject>/<node-id>`). Rate the node's depth by its **most conservative** strand — any `unknown` strand makes the node deep; all-`solid` makes it shallow; otherwise mixed. Carry this into per-step depth: a step is taught **shallow** where every element it will teach cites a `solid` strand (a brief recall refresher, then spend the step on connections, edges, and new examples); **deep** where it cites an `unknown` strand (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites); and in between for `partial`. Mastery is a depth input only — it never prunes, reorders, or deletes any step or element; every part of the node stays complete and readable. No node entry → no calibration: write all steps at uniform depth, it is not an error.
4. **Reason the step-DAG.** Decompose the node into steps before writing anything. Each step is one coherent teaching unit with its own learner-facing goal. Give each step an immutable kebab-case `id`, a reading `order`, and `deps` naming the earlier steps it builds on; a step may branch from or merge into several. 2–5 steps is typical. The calibrated depth (step 3) sizes each step: a deep step covers less ground and unfolds one mechanism fully; a shallow step can cover more and spend its length on connections. The DAG is a deliberate plan reasoned from the digests, never improvised while writing articles.
5. **Confirm the DAG (checkpoint).** Present the step-DAG — step ids, one-line goals, order, deps, and each step's calibrated depth (shallow | mixed | deep) — and ask the learner to confirm before writing any step article or element. Exit options: accept; reorder or rename steps; add, remove, split, or merge steps. Do not write a single step file or element until this checkpoint passes.
6. **Select concepts.** Identify the core concepts each step needs as elements — concepts that deserve independent explanation, reuse, or judgment. Ordinary one-off terms do not need element pages. Usually 3–7 per node, adjusted to the lesson. Reuse an existing element when the core concept is the same; a step-specific framing belongs in the step article, not in a duplicate element. Never author a `question`-typed element — graded verification lives only in `/tackle`, and an element's `Questions` section is a no-grade self-check.

7. **Dispatch element sub-agents and wait.** For each selected concept, dispatch one `general` sub-agent (Task tool, run in parallel, respecting concurrency limit `C` — shared with step 8) to write `learn/<subject>/elements/<element-id>.mdx`. Each dispatch prompt is a complete self-contained brief — the agent reads only the digest sections it needs (given as L2 section locators by the parent). It carries the full element spec: element ID, title, subject, tier, order, type, nodes (the current `<subject>/<node-id>`), sources, created date, and the exact L2 section locators. The parent writes the frontmatter (`id`, `title`, `subject`, `tier`, `order`, `type`, `nodes`, `sources`, `created`, `updated`) and lets the sub-agent fill the body. After dispatch, the parent waits for all element sub-agents to complete, then proceeds to step 8.
8. **Draft step articles via sub-agents.** Dispatch `general` sub-agent per step (Task tool, run in parallel, respecting concurrency limit `C` — when `C` is set, dispatch in batches of up to `C` agents, waiting for each batch to finish before dispatching the next; when `C` is unbounded, dispatch all steps at once) to write `learn/<subject>/nodes/<node-id>/<step-id>.mdx` to disk. Each dispatch prompt is a complete self-contained brief — the agent reads only `MEMORY.md`, the digest, and the element pages it links. It carries the full step spec (node id, step id, title, learner-facing goal, `teaches` element ids, deps, calibrated depth) **and the exact digest section locators that step draws on** (from step 2), plus the inline writer brief: write prose directly in `language` — the `language` term first with the English name glossed in parentheses on first use (the pattern in `examples/ELEMENT.mdx`) — following the step format below. The writer commits directly to a single final pass: it writes the article to disk once and returns immediately. The parent's context holds only the step spec and locators; article text lives solely in the file on disk. Each agent writes one complete article and finishes there. The article honors the depth calibration — extend to fill the floor, preserving all content throughout.
9. **Polish step articles via polish-agent.** Read `MEMORY.md` frontmatter. When `polish` names a template (a `polish/<slug>/polish.md` exists), dispatch one `polish-agent` sub-agent per step (Task tool, run in parallel, respecting concurrency limit `C` — same batching rules as step 8) to rewrite the article into plain, easy-to-read language in that template's style. Each agent reads its tone specification `polish/<slug>/polish.md` and every example article in `polish/<slug>/examples/` first (per the agent's instruction), then **reads the `## Lesson` body until it understands it and regenerates it from scratch** in plain language matching the template — it does not edit the draft sentence by sentence, since the draft is usually dense — while keeping every fact, number, name, and source, and never pruning content, so the body still clears the 1,000-字 floor. It writes the regenerated body back to the step file, rewrites the frontmatter `title` into an SEO-friendly title (per the agent's instruction), and returns a one-line summary of its main changes, naming old and new title when the title changed. Two bounds hold: the polish agent rewrites prose, not the contract — it preserves the frontmatter (`id`, `subject`, `teaches`, `sources`, `created`, `updated`; `title` is the sole exception, rewritten SEO-friendly), the section headings (`## Learning goal` · `## Lesson` · `## Sources`), and every element link `[[learn/<subject>/elements/…]]` and source citation; and the rewrite keeps the article in `language` and still honors the body-prose rules below (step 11 verifies them again). Record each agent's post-polish `## Lesson` character count for the report (step 12). After all polish agents return, sync each renamed step's display alias in the node container's step links to its new title (parallel polish agents never edit the container themselves). `polish: none` (or a missing template) skips this step entirely — the drafted article is the final article.

10. **Write the node container.** Rewrite `learn/<subject>/nodes/<node-id>.mdx` as a container: `steps` frontmatter (id + order + deps), the reading order in `## Steps`, a short `## Lesson` main lesson (the overarching idea that ties the steps together — not a second full article), and `## Sources`. Set `prerequisites` to the elements and nodes the learner should know first. No flat `elements` frontmatter list.
11. **Verify via the script.** Run `node scripts/verify.mjs --node <subject>/<node-id>`. This checks format correctness only — frontmatter, ID/filename match, step↔DAG consistency, `teaches`/element/step/node link resolution, source-path and digest-locator resolution, element section presence, and polish-template resolution (per `docs/reference/verify.md`). If it exits non-zero, fix each reported failure and re-run, up to 3 rounds. After the 3rd round, list any remaining failures in step 12 for the learner to adjudicate. Do not re-read article bodies for prose judgment — the script is the sole gate, and prose quality is owned by the learner. When a polish template applies (`polish: <slug>`), the draft is still checked by the script after step 9.
12. **Report.** List the confirmed DAG (with each step's calibrated depth), created and updated elements, the written step articles (with each `## Lesson` character count as reported by its sub-agent and after the polish (step 9)), the completed node container, the script result (exit status and any failures that survived the 3-round fix loop), and any unresolved source or link issues. Move the node through `nodes-written` (DAG confirmed, elements written) and `content-written` (all step articles and the container written, all checks pass).

Completion: the step-DAG is confirmed; every step article exists, declares its `teaches`, and has a lesson body that obeys the body-prose rules, and has been polished into plain language by the polish-agent (step 9) when `MEMORY.md` names a polish template; the node container holds the DAG and the main lesson with no flat `elements` list; every element is an `article`/`video` page with retrieval questions; all citations resolve; `node scripts/verify.mjs --node <subject>/<node-id>` exits 0 (format gate); each step's depth follows the mastery calibration (step 3) or the `skip-probe` deep calibration, with nothing pruned; the node is `content-written`.

## Node container format

```markdown
---
id: <node-id>
title: <Node title>
subject: <subject>
tier: <node tier>
order: <node order>
status: <draft | confirmed | nodes-written | content-written | edges-written>
goal: <learner-facing outcome>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
steps:
  - id: <step-id>
    order: 1
  - id: <step-id>
    order: 2
    deps:
      - <step-id>
prerequisites:
  - learn/<subject>/elements/<element-id>
  - learn/<subject>/nodes/<node-id>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Node title>

## Learning goal

<learner-facing outcome>

## Steps

<Reading order — deps show what must come first.>

1. [[learn/<subject>/nodes/<node-id>/<step-id>|<Step title>]] — <one-line goal>
2. [[learn/<subject>/nodes/<node-id>/<step-id>|<Step title>]] — <one-line goal> (after step 1)
3. [[learn/<subject>/nodes/<node-id>/<step-id>|<Step title>]] — <one-line goal> (after steps 1–2)

## Lesson

<The node's main lesson — the overarching idea the steps build toward, a few paragraphs.>

## Sources

- [[sources/<subject>/<file>#<section>]]
```

`steps` is the step-DAG: every step id with its `order` and `deps`. `order` is the reading order; `deps` name the steps that must come first. A step with no `deps` is an entry point. `prerequisites` is a list of stable IDs (`learn/<subject>/elements/<id>` or `learn/<subject>/nodes/<id>`); omit the field when the node has none.

## Step format

```markdown
---
id: <step-id>
title: <Step title>
subject: <subject>
teaches:
  - <subject>/<element-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Step title>

## Learning goal

<learner-facing outcome for this step>

## Lesson

<The step article — phenomenon before term, gloss first use, in the subject's language. The `## Lesson` body must run at least 1000 字 (character-script subjects count characters; English ≈ 1000 words), measured on the body only, headings and sources excluded.>

## Sources

- [[sources/<subject>/<file>#<section>]]
```

`teaches` lists the subject-qualified element ids this step teaches (`<subject>/<element-id>`). Deps are not declared here — they live in the node's `steps` DAG. Omit `order`; the DAG sets it. A step links the elements it teaches at their first useful appearance, so the reader can reach the dictionary page from the article.

### Lesson body-prose rules

The `## Lesson` body is written for a stranger — someone with no access to the book, no context, and no idea a source exists. It must stand alone as a complete lesson:

1. **No source links in the body.** `[[sources/…]]` links live only in frontmatter `sources:` and the `## Sources` list — never inside `## Lesson` prose. Element links (`[[learn/<subject>/elements/…]]`) remain welcome at their first useful appearance.
2. **No source commentary.** Never reference the material's packaging — no 「書裡的定義是…」「作者說…」「這一章提到…」「書裡給了兩個詞」 or equivalents. State the definition, the terms, and the reasoning directly, as if the article itself were the primary source. Attribution and locators belong to `## Sources` and the elements' `Deep dive`, not the narrative.
3. **Reproduce, don't point.** When the source teaches through a table, list, or diagram, the article reproduces it as a proper markdown table/list in its own wording — never 「書中的表格」「下表的內容來自書裡」 or any gesture at material the reader cannot see. Every table must be fully present and self-explanatory in the article.
4. **Self-contained examples.** Numbers, examples, and scenarios from the source are rewritten into the article's own narrative with full context, so a reader who has never opened the source understands them completely.
5. **Prose discipline (writing-time, not verify-time).** For Chinese `language` subjects, the writer and polish-agent keep the `## Lesson` body plain: no 翻案腔 (不是…而是… and variants), no colons outside direct quotes, no 3+ 同構排比, no verb-noun compounds, no `—`/`——`/`–` break dashes, no冒号 `：`/`:` for non-quote purposes, no "說白了"/"說穿了"/"先說結論", no verb nominalization, no business/model jargon. These are owned by the writer and polish-agent — the verification script does not check them (it is format-only), and the learner is the final judge. When a polish template applies (`polish: <slug>`), the polished prose follows the template's style and the subject's `language` from `MEMORY.md`.

## Element format

Elements keep their keyword-dictionary structure. `type` is `article` (default) or `video`; `video` requires `videoUrl`. The `question` type is deprecated and never authored here — graded verification lives only in `/tackle`.

```markdown
---
id: <element-id>
title: <Title>
subject: <subject>
tier: <canonical abstraction depth>
order: <stable canonical order>
type: <article | video>
nodes:
  - <subject>/<node-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

The `article` body uses the sections in `examples/ELEMENT.mdx` (`Problem Statement` · `Why it matters` · `How it works` · optional `In plain terms` / `Analogy` · `Practical use` · optional `Prerequisites` · `Connections` · `Deep dive` · `Questions`). A `video` element adds `videoUrl: "<embed URL>"` and uses a shorter body (`Why this video` · `Key takeaways` · `Connections` · `Deep dive` · `Questions`). `tier` is the element's subject-level abstraction depth and `order` its stable canonical display order — neither is the step's teaching order. The `Questions` section is a no-grade preview self-check; it never affects completion. `Connections` and `Deep dive` stay in English; the other headings render per `MEMORY.md` `language`.

## Examples

Match the worked examples when writing artifacts. `examples/ELEMENT.mdx` shows finished element pages (`article` and `video`): plain-first prose, the `language` term first with the English name glossed in parentheses, and the rendered section headings. `examples/STEP.mdx` shows a finished step article: the lesson with `teaches` frontmatter and node-qualified element links. `examples/NODE.mdx` shows a finished node container: the `steps` DAG, reading order, and the short main lesson. The examples carry the prose and voice; the formats above stay the contract — frontmatter, `Connections`, `Deep dive`, and `Questions` still come from the template even where an example omits them.

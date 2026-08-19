---
name: nodes
description: Reason out a node's step-DAG, then write each step article and the node container.
disable-model-invocation: true
argument-hint: "Which subject/node should be written?"
---

Turn one probed node into a step-DAG of step articles. Invoke as `/nodes <subject>/<node-id>`, or `/nodes <subject>/<node-id> skip-probe` when the learner knows nothing about the topic and wants to skip the probe entirely — every strand counts as `unknown`, so every step is taught deep (step 4). A **node** is a container holding a step-DAG (step ids + order + deps), the reading order, and a short main lesson; a **step** is a first-class article file that declares the **elements** it teaches; an **element** is a keyword dictionary page that carries the detailed explanation behind a step's narrative. Depth is calibrated from the node's probe mastery (step 4) — it only shapes depth, never prunes content.

Prereqs: `learn/<subject>/MEMORY.md` exists and the node container exists. The node must be `probed` or further — a `draft` node was never probed, so stop and tell the learner to run `/probe <subject>/<node-id>` first. The sole exception is `/nodes <subject>/<node-id> skip-probe`: the learner explicitly asserts they don't know the topic at all, so no probe is needed and a `draft` node is accepted (it promotes to `confirmed` in step 1). If the node is already `confirmed` or further along, continue directly — later steps update incrementally.

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.mdx`. Resolve the node's exact source references — do not infer the subject from a node name. Set the node to `confirmed` now: the explicit `/nodes` invocation is the confirmation gate. A `draft` node is only accepted with `skip-probe` — it moves `draft → confirmed` directly, bypassing `probed`.
2. **Tune.** Read `MEMORY.md` frontmatter and apply the voice per `docs/reference/tune.md`: write prose in `language`, put the `language` term first with the English name glossed in parentheses on first use (the pattern in `examples/ELEMENT.mdx`). Apply the voice where `tune-scope` says: `steps` voices step articles only; `elements-steps` and `all` also voice element prose (sections kept). `tune: none`, a missing `tune`, or a missing `tune/<slug>/TUNE.md` means plain tone. For a Chinese `language`, the human-writing prose layer (body-prose rule 5) is mandatory on every step article's `## Lesson` body — the tune supplies the voice persona, human-writing the sentences; where they pull in different directions, the step contract and pedagogy win.
3. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read the node's sources through `learn/<subject>/digests/` — never raw sources. When a digest's L2 detail is insufficient for a concept, dispatch a sub-agent to pull the exact section text by locator (one-off, returned in message).
4. **Calibrate step depth from the node's probe mastery.** With `skip-probe`, the learner has asserted they know nothing about the topic: skip the calibration lookup, treat every strand as `unknown`, and teach the node **deep** everywhere (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites). Record the skip in `learn/<subject>/mastery.md` — create the node's entry in `/probe`'s format with its strands named from the digest's `Key claims`/`Learner-relevant` lines, all rated `unknown`, and a `Notes` line `probe skipped via /nodes <subject>/<node-id> skip-probe on <YYYY-MM-DD>` — so `/tackle` targets everything and a later `/probe` re-measures from scratch. Otherwise read the node's entry in `learn/<subject>/mastery.md` **if it exists** (written by `/probe <subject>/<node-id>`). Rate the node's depth by its **most conservative** strand — any `unknown` strand makes the node deep; all-`solid` makes it shallow; otherwise mixed. Carry this into per-step depth: a step is taught **shallow** where every element it will teach cites a `solid` strand (a brief recall refresher, then spend the step on connections, edges, and new examples); **deep** where it cites an `unknown` strand (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites); and in between for `partial`. Mastery is a depth input only — it never prunes, reorders, or deletes any step or element; every part of the node stays complete and readable. No node entry → no calibration: write all steps at uniform depth, it is not an error.
5. **Reason the step-DAG.** Decompose the node into steps before writing anything. Each step is one coherent teaching unit with its own learner-facing goal. Give each step an immutable kebab-case `id`, a reading `order`, and `deps` naming the earlier steps it builds on; a step may branch from or merge into several. 2–5 steps is typical. The calibrated depth (step 4) sizes each step: a deep step covers less ground and unfolds one mechanism fully; a shallow step can cover more and spend its length on connections. The DAG is a deliberate plan reasoned from the digests, never improvised while writing articles.
6. **Confirm the DAG (checkpoint).** Present the step-DAG — step ids, one-line goals, order, deps, and each step's calibrated depth (shallow | mixed | deep) — and ask the learner to confirm before writing any step article or element. Exit options: accept; reorder or rename steps; add, remove, split, or merge steps. Do not write a single step file or element until this checkpoint passes.
7. **Select concepts.** Identify the core concepts each step needs as elements — concepts that deserve independent explanation, reuse, or judgment. Ordinary one-off terms do not need element pages. Usually 3–7 per node, adjusted to the lesson. Reuse an existing element when the core concept is the same; a step-specific framing belongs in the step article, not in a duplicate element. Never author a `question`-typed element — graded verification lives only in `/tackle`, and an element's `Questions` section is a no-grade self-check.
8. **Update elements.** For each selected concept, create or incrementally update `learn/<subject>/elements/<element-id>.mdx` as `article` (or `video`). Preserve useful existing explanations; add supported depth, examples, connections, sources, and retrieval questions — never replace a useful element with a shallower rewrite. Add the current `<subject>/<node-id>` to `nodes` and deduplicate `sources`.
9. **Draft step articles via sub-agents.** Dispatch one `general` sub-agent per step (Task tool, run in parallel) to write `learn/<subject>/nodes/<node-id>/<step-id>.mdx` to disk. Each dispatch prompt is a complete self-contained brief — the agent reads only `MEMORY.md`, the digest, the element pages it links, and (for Chinese) the human-writing skill and its two reference files. It carries the full step spec (node id, step id, title, learner-facing goal, `teaches` element ids, deps, calibrated depth) **and the exact digest section locators that step draws on** (from step 5), plus the inline writer brief: the `language` and tune voice from `MEMORY.md`, the step format below, and the body-prose rules below (including the human-writing mandate — the agent loads `.opencode/skills/human-writing/SKILL.md`, reads `references/forum-prose.md` before drafting and `references/revision.md` after, and applies the hard bans in the subject's script variant). The parent keeps no article text in its own context. Each agent writes one complete article, then **self-verifies before returning**: it counts its own `## Lesson` body characters and extends until it clears the floor (Step format), applies the human-writing revision pass, and only then returns the final character count. The article honors the depth calibration — extend to fill the floor, never prune content.
10. **Polish step articles via polish-agent.** After every step article is drafted, dispatch one `polish-agent` sub-agent per step (Task tool, run in parallel) to rewrite the article's prose into plain, easy-to-read language. Each agent reads its own style examples first (per the agent's instruction), then rewrites the `## Lesson` body in place — simplify phrasing, shorten sentences, cut jargon and nominalization — while keeping every fact, number, name, and source, and never pruning content, so the body still clears the 3,000-字 floor. It edits the step file directly and returns a one-line summary of its main changes. Two bounds hold: the polish agent rewrites prose, not the contract — it preserves the frontmatter (`id`, `title`, `subject`, `teaches`, `sources`, `created`, `updated`), the section headings (`## Learning goal` · `## Lesson` · `## Sources`), and every element link `[[learn/<subject>/elements/…]]` and source citation; and the rewrite keeps the article in `language` and still honors the body-prose rules below (step 12 verifies them again). Record each agent's post-polish `## Lesson` character count for the report (step 13).

11. **Write the node container.** Rewrite `learn/<subject>/nodes/<node-id>.mdx` as a container: `steps` frontmatter (id + order + deps), the reading order in `## Steps`, a short `## Lesson` main lesson (the overarching idea that ties the steps together — not a second full article), and `## Sources`. Set `prerequisites` to the elements and nodes the learner should know first. No flat `elements` frontmatter list.
12. **Verify.** Check every step file exists and matches a `steps` DAG entry (and vice versa); every step's `teaches` element resolves; every element and step link resolves; every source link points into `sources/<subject>/` and its section locator resolves in the digest; every element has at least two meaningful connections and relationship + value-judgment retrieval questions; each step's depth matches the calibration (step 4). Verify the lesson body-prose rules below hold on every step — anything found is rewritten into direct, self-contained prose (tables reproduced in markdown) before the node can pass. For a Chinese `language`, run `python3 .opencode/skills/human-writing/scripts/check_prose.py <step-file>` on every step file (it masks frontmatter, code, and links itself) — a second gate over the revision pass each agent already ran — and return any exit-1 article to its sub-agent to rewrite until the hard failures clear; its 需要人工判断 warnings are reviewed, and Traditional-script variants of the hard bans are checked by hand since the script detects only Simplified forms. When a tune applies, check the prose follows the voice and language from `MEMORY.md`.
13. **Report.** List the confirmed DAG (with each step's calibrated depth), created and updated elements, the written step articles (with each `## Lesson` character count as reported by its sub-agent and after the polish (step 10)), the completed node container, and any unresolved source or link issues. Move the node through `nodes-written` (DAG confirmed, elements written) and `content-written` (all step articles and the container written, all checks pass).

Completion: the step-DAG is confirmed; every step article exists, declares its `teaches`, and clears the 3,000-字 floor (Step format) with a lesson body that obeys the body-prose rules, and has been polished into plain language by the polish-agent (step 10); the node container holds the DAG and the main lesson with no flat `elements` list; every element is an `article`/`video` page with retrieval questions; all citations resolve; each step's depth follows the mastery calibration (step 4) or the `skip-probe` deep calibration, with nothing pruned; Chinese lesson bodies follow the human-writing prose layer and pass its checker; the node is `content-written`.

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

<The step article — phenomenon before term, gloss first use, in the subject's language and tune. The `## Lesson` body must run at least 3,000 字 (character-script subjects count characters; English ≈ 3,000 words), measured on the body only, headings and sources excluded.>

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
5. **Human-writing prose layer (Chinese subjects).** Load and follow `.opencode/skills/human-writing/SKILL.md` (活人感写作) for the `## Lesson` body: read its `references/forum-prose.md` before drafting and its `references/revision.md` after. Its hard bans bind in the subject's script variant - 翻案腔 in any wording (不是…而是… and its variants), colons outside direct quotes, dashes, 3+ 同構排比, 名詞化, business/model jargon, insight road-signs - and its checker script only detects Simplified forms, so check Traditional forms by hand. Its material gate is met by the digests and element pages; constructed teaching examples stay concrete and serve the concept. Tune (if any) supplies the voice persona on top; when the layers pull in different directions, the step contract and pedagogy win.

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

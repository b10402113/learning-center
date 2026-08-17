---
name: nodes
description: Reason out a node's step-DAG, then write each step article and the node container.
disable-model-invocation: true
argument-hint: "Which subject/node should be written?"
---

Turn one probed node into a step-DAG of step articles. Invoke as `/nodes <subject>/<node-id>`. A **node** is a container holding a step-DAG (step ids + order + deps), the reading order, and a short main lesson; a **step** is a first-class article file that declares the **elements** it teaches; an **element** is a keyword dictionary page that carries the detailed explanation behind a step's narrative. Node and step depth are calibrated from the node's probe mastery (written by `/probe <subject>/<node-id>`) when it exists — teach shallow where `solid`, deep where `unknown` — and mastery only shapes depth, never prunes content.

Prereqs: `learn/<subject>/MEMORY.md` exists, the node container exists, and the node has been probed (`status` is `probed` or further — run `/probe <subject>/<node-id>` first). A `draft` node is not ready: stop and tell the learner to probe it. Invoking `/nodes <subject>/<node-id>` is the learner's confirmation for that node: if its status is `probed`, set it to `confirmed` before starting work. If already `confirmed` (or further along), continue directly — later steps update incrementally.

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.mdx`. Resolve the node's exact source references. Do not infer the subject from a node name. The node must be `probed` or further — a `draft` node was never probed, so stop and tell the learner to run `/probe <subject>/<node-id>` first. Set a `probed` node to `confirmed` now — the explicit `/nodes` invocation is the confirmation gate.
2. **Tune.** Read `MEMORY.md` frontmatter and apply the voice per `docs/reference/tune.md`: write prose in `language`, put the `language` term first with the English name glossed in parentheses on first use (the pattern in `examples/ELEMENT.mdx`). Apply the voice where `tune-scope` says: `steps` voices step articles only (element prose stays neutral); `elements-steps` and `all` also voice element prose (sections kept). `tune: none`, a missing `tune`, or a missing `tune/<slug>/TUNE.md` means plain tone. Pedagogy, source citations, and the step contract are enforced regardless.
3. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read the node's sources through `learn/<subject>/digests/` — never raw sources. When a digest's L2 detail is insufficient for a concept, dispatch a sub-agent to pull the exact section text by locator (one-off, returned in message).
4. **Calibrate step depth from the node's probe mastery.** Read the node's entry in `learn/<subject>/mastery.md` **if it exists** (written by `/probe <subject>/<node-id>`). Rate the node's depth by its **most conservative** strand — any `unknown` strand makes the node deep; all-`solid` makes it shallow; otherwise mixed. Carry this into per-step depth: a step is taught **shallow** where every element it will teach cites a `solid` strand (a brief recall refresher, then spend the step on connections, edges, and new examples); **deep** where it cites an `unknown` strand (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites); and in between for `partial`. Mastery is a depth input only — it never prunes, reorders, or deletes any step or element; every part of the node stays complete and readable. No node entry → no calibration: write all steps at uniform depth, it is not an error.
5. **Reason the step-DAG.** Decompose the node into steps before writing anything. Each step is one coherent teaching unit with its own learner-facing goal. Give each step an immutable kebab-case `id`, a reading `order`, and `deps` naming the earlier steps it builds on; a step may branch from or merge into several. 2–5 steps is typical. The calibrated depth (step 4) sizes each step: a deep step covers less ground and unfolds one mechanism fully; a shallow step can cover more and spend its length on connections. The DAG is a deliberate plan reasoned from the digests, never improvised while writing articles.
6. **Confirm the DAG (checkpoint).** Present the step-DAG — step ids, one-line goals, order, deps, and each step's calibrated depth (shallow | mixed | deep) — and ask the learner to confirm before writing any step article or element. Exit options: accept; reorder or rename steps; add, remove, split, or merge steps. Do not write a single step file or element until this checkpoint passes.
7. **Select concepts.** Identify the core concepts each step needs as elements — concepts that deserve independent explanation, reuse, or judgment. Ordinary one-off terms do not need element pages. Usually 3–7 per node, adjusted to the lesson. Reuse an existing element when the core concept is the same; a step-specific framing belongs in the step article, not in a duplicate element. Never author a `question`-typed element — graded verification lives only in `/tackle`, and an element's `Questions` section is a no-grade self-check.
8. **Update elements.** For each selected concept, create or incrementally update `learn/<subject>/elements/<element-id>.mdx` as `article` (or `video`). Preserve useful existing explanations; add supported depth, examples, connections, sources, and retrieval questions — never replace a useful element with a shallower rewrite. Add the current `<subject>/<node-id>` to `nodes` and deduplicate `sources`.
9. **Draft step articles via sub-agents.** Dispatch one `general` sub-agent per step (Task tool, run in parallel) to write `learn/<subject>/nodes/<node-id>/<step-id>.mdx` to disk. Each dispatch prompt carries the full step spec — node id, step id, title, learner-facing goal, `teaches` element ids, deps, calibrated depth — and points the agent at what to read itself: `MEMORY.md` (language + tune) and `docs/reference/tune.md`, `examples/STEP.mdx` and this file's step format, the node's digests (never raw sources), and the element pages it links. Each agent writes one complete article to its file and returns its `## Lesson` character count in the subject's `language`; the parent keeps no article text in its own context. The article honors the depth calibration (a shallow step refreshes briefly and spends its length on connections and new examples; a deep step unfolds the full phenomenon → term → mechanism) — extend to fill the floor, never prune content.
10. **Enforce the length floor.** Every step's `## Lesson` body must run at least 3,000 字 of prose in the subject's `language` — Chinese and other character-script subjects count characters; English subjects ≈ 3,000 words. The step contract is a floor, not a ceiling. The count covers only the `## Lesson` body: frontmatter, headings, and the `## Sources` list are excluded. Return any article that measures short to its sub-agent to extend until it passes — do not accept a short article, and do not compress a long one.
11. **Write the node container.** Rewrite `learn/<subject>/nodes/<node-id>.mdx` as a container: `steps` frontmatter (id + order + deps), the reading order in `## Steps`, a short `## Lesson` main lesson (the overarching idea that ties the steps together — not a second full article), and `## Sources`. Set `prerequisites` to the elements and nodes the learner should know first. No flat `elements` frontmatter list.
12. **Verify.** Check every step file exists and matches a `steps` DAG entry (and every DAG entry has a step file); every step's `## Lesson` runs at least 3,000 字 in the subject's `language` (character count of the body only, headings and sources excluded); every step's `teaches` element resolves; every element and step link resolves; every source link points into `sources/<subject>/` and its section locator resolves in the digest; every element has at least two meaningful connections and relationship + value-judgment retrieval questions; each step's depth matches the calibration (shallow where its elements cite `solid` areas, deep where `unknown`). When a tune applies, check the prose follows the voice and language from `MEMORY.md`.
13. **Report.** List the confirmed DAG (with each step's calibrated depth), created and updated elements, the written step articles (with each `## Lesson` character count), the completed node container, and any unresolved source or link issues. Move the node through `nodes-written` (DAG confirmed, elements written) and `content-written` (all step articles and the container written, all checks pass).

Completion: the step-DAG is confirmed, every step article exists and declares the elements it `teaches` with a `## Lesson` of at least 3,000 字 in the subject's `language`, the node container holds the DAG and the main lesson with no flat `elements` list, every element is an `article`/`video` page with retrieval questions, all citations resolve, each step's depth follows the mastery calibration (uniform when no report exists) with nothing pruned, and the node is `content-written`.

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

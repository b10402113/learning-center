---
name: nodes
description: Reason out a node's step-DAG, then write each step article and the node container.
disable-model-invocation: true
argument-hint: "Which subject/node should be written?"
---

Turn one confirmed node into a step-DAG of step articles. Invoke as `/nodes <subject>/<node-id>`. A **node** is a container holding a step-DAG (step ids + order + deps), the reading order, and a short main lesson; a **step** is a first-class article file that declares the **elements** it teaches; an **element** is a keyword dictionary page that carries the detailed explanation behind a step's narrative. Node and step depth are calibrated from the subject's mastery report when it exists — teach shallow where `solid`, deep where `unknown` — and mastery only shapes depth, never prunes content.

Prereqs: `learn/<subject>/MEMORY.md` exists and the node container exists. Invoking `/nodes <subject>/<node-id>` is the learner's confirmation for that node: if its status is `draft`, set it to `confirmed` before starting work. If already `confirmed` (or further along), continue directly — later steps update incrementally.

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.mdx`. Resolve the node's exact source references. Do not infer the subject from a node name. Set a `draft` node to `confirmed` now — the explicit `/nodes` invocation is the confirmation gate.
2. **Tune.** Read `MEMORY.md` frontmatter and apply the voice per `docs/reference/tune.md`: write prose in `language`, put the `language` term first with the English name glossed in parentheses on first use (the pattern in `examples/ELEMENT.mdx`). Apply the voice where `tune-scope` says: `steps` voices step articles only (element prose stays neutral); `elements-steps` and `all` also voice element prose (sections kept). `tune: none`, a missing `tune`, or a missing `tune/<slug>/TUNE.md` means plain tone. Pedagogy, source citations, and the 10–15 minute step contract are enforced regardless.
3. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read the node's sources through `learn/<subject>/digests/` — never raw sources. When a digest's L2 detail is insufficient for a concept, dispatch a sub-agent to pull the exact section text by locator (one-off, returned in message).
4. **Calibrate step depth from mastery.** Read `learn/<subject>/mastery.md` **if it exists**. Map the node's source areas (its `sources` locators) to the report areas and rate the node's depth by its **most conservative** area — any `unknown` area makes the node deep; all-`solid` makes it shallow; otherwise mixed. Carry this into per-step depth: a step is taught **shallow** where every element it will teach cites a `solid` area (a brief recall refresher, then spend the step on connections, edges, and new examples); **deep** where it cites an `unknown` area (full phenomenon → term → mechanism, gloss every term, no hidden prerequisites); and in between for `partial`. Mastery is a depth input only — it never prunes, reorders, or deletes any step or element; every part of the node stays complete and readable. No report → no calibration: write all steps at uniform depth, it is not an error.
5. **Reason the step-DAG.** Decompose the node into steps before writing anything. Each step is one coherent 10–15 minute teaching unit with its own learner-facing goal. Give each step an immutable kebab-case `id`, a reading `order`, and `deps` naming the earlier steps it builds on; a step may branch from or merge into several. 2–5 steps is typical. The calibrated depth (step 4) sizes each step: a deep step covers less ground and unfolds one mechanism fully; a shallow step can cover more and spend its length on connections. The DAG is a deliberate plan reasoned from the digests, never improvised while writing articles.
6. **Confirm the DAG (checkpoint).** Present the step-DAG — step ids, one-line goals, order, deps, and each step's calibrated depth (shallow | mixed | deep) — and ask the learner to confirm before writing any step article or element. Exit options: accept; reorder or rename steps; add, remove, split, or merge steps. Do not write a single step file or element until this checkpoint passes.
7. **Select concepts.** Identify the core concepts each step needs as elements — concepts that deserve independent explanation, reuse, or judgment. Ordinary one-off terms do not need element pages. Usually 3–7 per node, adjusted to the lesson. Reuse an existing element when the core concept is the same; a step-specific framing belongs in the step article, not in a duplicate element. Never author a `question`-typed element — graded verification lives only in `/tackle`, and an element's `Questions` section is a no-grade self-check.
8. **Update elements.** For each selected concept, create or incrementally update `learn/<subject>/elements/<element-id>.mdx` as `article` (or `video`). Preserve useful existing explanations; add supported depth, examples, connections, sources, and retrieval questions — never replace a useful element with a shallower rewrite. Add the current `<subject>/<node-id>` to `nodes` and deduplicate `sources`.
9. **Write step articles.** For each step, write `learn/<subject>/nodes/<node-id>/<step-id>.mdx` as a first-class 10–15 minute article. Frontmatter declares `teaches` — the subject-qualified element ids this step teaches (`<subject>/<element-id>`); deps live in the node's DAG, never in the step file. Write prose in the subject's `language` with the tune applied per `tune-scope`. Link each element at its first useful appearance with a stable node-qualified link; cite sources with locators. Write per `docs/reference/article-writing.md`: phenomenon before the term, a gloss for every non-trivial term on first use within the file, and no hidden prerequisites. Honor the step's calibrated depth: a shallow step refreshes briefly and spends its length on connections and new examples; a deep step unfolds the full phenomenon → term → mechanism; neither drops required content.
10. **Write the node container.** Rewrite `learn/<subject>/nodes/<node-id>.mdx` as a container: `steps` frontmatter (id + order + deps), the reading order in `## Steps`, a short `## Lesson` main lesson (the overarching idea that ties the steps together — not a second full article), and `## Sources`. Set `prerequisites` to the elements and nodes the learner should know first. No flat `elements` frontmatter list.
11. **Verify.** Check every step file exists and matches a `steps` DAG entry (and every DAG entry has a step file); every step's `teaches` element resolves; every element and step link resolves; every source link points into `sources/<subject>/` and its section locator resolves in the digest; every element has at least two meaningful connections and relationship + value-judgment retrieval questions; each step's depth matches the calibration (shallow where its elements cite `solid` areas, deep where `unknown`). When a tune applies, check the prose follows the voice and language from `MEMORY.md`.
12. **Report.** List the confirmed DAG (with each step's calibrated depth), created and updated elements, the written step articles, the completed node container, and any unresolved source or link issues. Move the node through `nodes-written` (DAG confirmed, elements written) and `content-written` (all step articles and the container written, all checks pass).

Completion: the step-DAG is confirmed, every step article exists and declares the elements it `teaches`, the node container holds the DAG and the main lesson with no flat `elements` list, every element is an `article`/`video` page with retrieval questions, all citations resolve, each step's depth follows the mastery calibration (uniform when no report exists) with nothing pruned, and the node is `content-written`.

## Node container format

```markdown
---
id: <node-id>
title: <Node title>
subject: <subject>
tier: <node tier>
order: <node order>
duration: 10-15 minutes
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
<Reading order — each step is a 10–15 minute article; deps show what must come first.>

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
<The 10–15 minute article — phenomenon before term, gloss first use, in the subject's language and tune.>

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

Match the worked examples when writing artifacts. `examples/ELEMENT.mdx` shows finished element pages (`article` and `video`): plain-first prose, the `language` term first with the English name glossed in parentheses, and the rendered section headings. `examples/STEP.mdx` shows a finished step article: the 10–15 minute lesson with `teaches` frontmatter and node-qualified element links. `examples/NODE.mdx` shows a finished node container: the `steps` DAG, reading order, and the short main lesson. The examples carry the prose and voice; the formats above stay the contract — frontmatter, `Connections`, `Deep dive`, and `Questions` still come from the template even where an example omits them.

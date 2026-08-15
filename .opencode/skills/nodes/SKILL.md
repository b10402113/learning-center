---
name: nodes
description: Extract canonical elements and write one detailed lesson article for a confirmed node.
disable-model-invocation: true
argument-hint: "Which subject/node should be written?"
---

Write the canonical concepts and lesson article for one confirmed node. Invoke as `/nodes <subject>/<node-id>`. A node is the 10–15 minute narrative; elements are reusable pages that carry the detailed explanations behind that narrative.

Prereqs: `learn/<subject>/MEMORY.md` exists and the node file exists. Invoking `/nodes <subject>/<node-id>` is the learner's confirmation for that node: if its status is `draft`, change it to `confirmed` before starting work. If it is already `confirmed`, continue directly. Existing `nodes-written` or `content-written` nodes are eligible for incremental updates.

1. **Resolve and confirm.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.md`. Resolve the exact source references in the node. Do not infer the subject from a node name. Once the node exists and its sources are resolvable, set a `draft` node to `confirmed`; the explicit `/nodes` invocation is the confirmation gate.
2. **Tune.** Read `MEMORY.md` frontmatter and apply the voice per `docs/reference/tune.md`: write prose in `language`, put the `language` term first with the English name glossed in parentheses on first use (the pattern in `examples/ELEMENT.md`), and apply the voice to the artifacts listed in `tune-scope` (element prose keeps its section contract; the node `Lesson` is fully voiced). `tune: none`, a missing `tune`, or a missing `tune/<slug>/TUNE.md` means plain tone. Pedagogy, source citations, and the 10–15 minute lesson contract are enforced regardless. Write per `docs/reference/article-writing.md`: phenomenon before the term, a gloss for every non-trivial term on first use within the file, one claim per paragraph with a two-number cap, and no hidden prerequisites.
3. **Extract.** Follow the shared `docs/reference/source-reading.md` protocol. Read the node's sources via their digests (`learn/<subject>/digests/`) — never raw sources. When the digest detail is insufficient for a concept, dispatch a sub-agent to pull the exact section's original text by locator (one-off, returned in message). Identify only the core concepts that need independent explanation, reuse, or judgment. Ordinary one-off terms do not need element pages. Usually create 3–7 elements, adjusted to the lesson.
4. **Canonicalize.** Give each concept an immutable kebab-case `id`. Reuse an existing element when the core concept is the same. A node-specific framing belongs in the node article, not in a duplicate element.
5. **Update elements.** For each selected concept, create or incrementally update `learn/<subject>/elements/<element-id>.md`. Preserve useful existing explanations. Add supported depth, examples, connections, source references, and retrieval questions; never replace a useful element with a shallower rewrite. Add the current `<subject>/<node-id>` to `nodes` and deduplicate `sources`.
6. **Set canonical metadata.** `tier` is the element's subject-level abstraction depth. `order` is its stable canonical display order; neither is the element's order in this lesson. The node's `elements` array is the teaching order.
7. **Write the prepare note (optional).** Check whether `learn/<subject>/prepares/<node-id>.md` exists. When it does not, write a short prepare note following the format below — one page of "before you read" concepts, 3–5 minutes to read, so the learner builds a first-pass mental model before the lesson. It is a preview, not a condensed lesson. Skip it when the node is simple, when the learner prefers to dive straight in, or when this is an incremental update of an already-written lesson. When updating an existing prepare note, preserve useful prior content.
8. **Write the node article.** After all selected element files exist, update the node file's `elements` array and write a self-contained 10–15 minute `## Lesson` following `docs/reference/article-writing.md`. Link the core concepts at their first useful appearance with stable node-qualified element links. The article teaches the node's main idea without copying every element's deep dive. Write the lesson as a flowing narrative in the register of `examples/NODE.md`.
9. **Verify.** Check that every node element exists, every article element link resolves, every source link points into `sources/<subject>/` and its section locator resolves in the source's digest, every element has at least two meaningful connections, and each element has relationship and value-judgment retrieval questions. When a tune applies, check the prose follows the voice and language from `MEMORY.md`.
10. **Report.** List created elements, updated elements, the completed node article, any prepare note written, and any unresolved source or link issues. Move the node through `nodes-written` and `content-written` only when those checks pass.

Completion: the selected canonical elements exist or are updated without losing prior useful content, the node's `elements` list matches its article links, the node article is complete and readable in 10–15 minutes, all citations resolve, and — when a tune applies — the prose is in the subject's `language` and follows the voice.

## Element format

Elements are written as **MDX** files. The frontmatter carries a `type` field that determines the element's interactive shape.

```markdown
---
id: <immutable-kebab-case-id>
title: <Title>
subject: <subject>
tier: <canonical abstraction depth>
order: <stable canonical order>
type: <article | video | question>
nodes:
  - <subject>/<node-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### `type` field

| `type` | Default | Conditional fields | Notes |
|--------|---------|--------------------|-------|
| `article` | yes (when omitted) | none | Standard concept page with prose sections |
| `video` | — | `videoUrl: "<embed URL>"` required | Frontmatter must include `videoUrl`; body is optional supplementary notes |
| `question` | — | `questions:` block required | Each entry: `question` (string), `options` (string array), `answer` (0-indexed number) |

Only one conditional field set appears per element — `video` carries `videoUrl` (not `questions`); `question` carries `questions` (not `videoUrl`); `article` carries neither.

### `article` element body

```markdown
# <Title>

## Problem Statement
One or two sentences posing the problem this concept solves, framed as the learner's question.

## Why it matters
The one-line value judgment: what breaks without it.

## How it works
The mechanism, taught plain-first. Introduce the mechanism before the term, gloss every non-trivial term on first use within this file per `docs/reference/article-writing.md`, and anchor it to `MEMORY.md` or an earlier concept. The element is self-contained.

## In plain terms
(Optional; omit when the mechanism is simple) Restate the idea without jargon.

## Analogy
(Optional; omit when no good metaphor exists) A concrete everyday metaphor for the idea.

## Practical use
When you actually reach for this at work, tied to `MEMORY.md` anchors where possible.

## Prerequisites
(Optional; omit the whole section when none) Concepts that make this element easier to learn. Known concepts link to their elements; unknown ones stay plain terms with a one-line reminder.
- [[learn/<subject>/elements/<element-id>|<Element title>]] — what it gives you
- <plain term> — one-line reminder

## Connections
- [[learn/<subject>/elements/<element-id>|<Element title>]] — why it connects
- [[learn/<subject>/elements/<element-id>|<Element title>]] — why it connects

## Deep dive
- [[sources/<subject>/<file>#<section>]] — what it adds

## Questions
### Q1. <relationship question>
A1. <answer>

### Q2. <value-judgment question>
A2. <answer>

### Q3. <optional recall or application question>
A3. <answer>
```

### `video` element body

```markdown
---
id: <id>
title: <Title>
subject: <subject>
tier: <tier>
order: <order>
type: video
videoUrl: "https://www.youtube.com/embed/<video-id>"
nodes:
  - <subject>/<node-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Title>

## Why this video
One or two sentences on what the learner should notice while watching.

## Key takeaways
- <takeaway 1>
- <takeaway 2>

## Connections
- [[learn/<subject>/elements/<element-id>|<Element title>]] — why it connects

## Deep dive
- [[sources/<subject>/<file>#<section>]] — what it adds

## Questions
### Q1. <relationship question>
A1. <answer>

### Q2. <value-judgment question>
A2. <answer>
```

### `question` element body

```markdown
---
id: <id>
title: <Title>
subject: <subject>
tier: <tier>
order: <order>
type: question
questions:
  - question: "<question text>"
    options:
      - "<option A>"
      - "<option B>"
      - "<option C>"
    answer: 1
  - question: "<question text>"
    options:
      - "<option A>"
      - "<option B>"
    answer: 0
nodes:
  - <subject>/<node-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Title>

## Context
One or two sentences framing what this question tests and why it matters.

## Connections
- [[learn/<subject>/elements/<element-id>|<Element title>]] — why it connects

## Deep dive
- [[sources/<subject>/<file>#<section>]] — what it adds
```

`answer` is 0-indexed. The renderer presents options as interactive choices; the learner must answer correctly before the element counts as complete (self-test, not a gate).

Rendered section headings follow `MEMORY.md` `language`. `Problem Statement`, `Connections`, `Deep dive`, and `Questions` stay in English; the other headings translate, with the rendered set shown in `examples/ELEMENT.md`.

## Node format

Nodes are written as **MDX** files. The frontmatter carries a `prerequisites` list that names the elements or nodes the learner should know before this lesson.

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
elements:
  - <subject>/<element-id>
prerequisites:
  - learn/<subject>/elements/<element-id>
  - learn/<subject>/nodes/<node-id>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Node title>

## Learning goal
<learner-facing outcome>

## Elements
<!-- /nodes fills this list in teaching order. -->

## Lesson
<!-- /nodes writes the 10–15 minute article here. -->

## Sources
- [[sources/<subject>/<file>#<section>]]
- [[sources/<subject>/<file>#<section>]]
```

### `prerequisites` field

`prerequisites` is a list of stable IDs. Each entry is either:
- `learn/<subject>/elements/<element-id>` — an element the learner should complete first
- `learn/<subject>/nodes/<node-id>` — a node the learner should complete first

The generator parses `prerequisites` from frontmatter and merges them with connections derived from element `Connections` sections. Frontmatter entries are tagged `source: "frontmatter"`; derived entries are tagged `source: "derived"`. The node detail view renders them in different colors so the learner can distinguish explicit prerequisites from inferred ones.

Omit the field (or use `prerequisites: []`) when the node has no prerequisites.

## Prepare note format

An optional short preview for one node: `learn/<subject>/prepares/<node-id>.md`. It exists to lower cognitive load before the 10–15 minute lesson — 2–4 key ideas in plain language, a glossary of terms to watch, and links to already-known concepts. Readable in 3–5 minutes. Headings render in the `MEMORY.md` `language`.

```markdown
---
node: <subject>/<node-id>
tier: <tier>
duration: 3-5 minutes
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Node title> — <預習>

## <Key ideas>
1. <plain-language preview of one key idea the lesson will build>
2. <...>
3. <...>

## <術語預告 (gloss)>
- **<term>** — one-line plain gloss
- **<term>** — one-line plain gloss

## <已有基礎 (related concepts)>
- [[learn/<subject>/elements/<element-id>|<Element title>]] — one-line reminder
```

The generator picks a prepare note up by matching its filename to the node id (`prepares/<node-id>.md`); the `node` frontmatter records the owner for traceability. A prepare note is never created by `/roadmap`.

## Examples

Match the worked examples when writing artifacts. `examples/ELEMENT.md` shows a finished element page: plain-first prose, the `language` term first with the English name glossed in parentheses, and the rendered section headings. `examples/NODE.md` shows the node lesson's narrative register: a flowing essay that teaches, with definitions, recap, and discussion questions. The examples carry the prose and voice; the format above stays the contract — frontmatter, `Connections`, `Deep dive`, and `Questions` still come from the template even where an example omits them.

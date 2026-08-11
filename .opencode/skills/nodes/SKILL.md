---
name: nodes
description: Extract canonical nodes and write one detailed lesson article for a confirmed path.
disable-model-invocation: true
argument-hint: "Which subject/path should be written?"
---

Write the canonical concepts and lesson article for one confirmed path. Invoke as `/nodes <subject>/<path-id>`. A path is the 10–15 minute narrative; nodes are reusable pages that carry the detailed explanations behind that narrative.

Prereqs: `learn/<subject>/MEMORY.md` exists and the path file exists. Invoking `/nodes <subject>/<path-id>` is the learner's confirmation for that path: if its status is `draft`, change it to `confirmed` before starting work. If it is already `confirmed`, continue directly. Existing `nodes-written` or `content-written` paths are eligible for incremental updates.

1. **Resolve and confirm.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/paths/<path-id>.md`. Resolve the exact source references in the path. Do not infer the subject from a path name. Once the path exists and its sources are resolvable, set a `draft` path to `confirmed`; the explicit `/nodes` invocation is the confirmation gate.
2. **Tune.** Read `MEMORY.md` frontmatter and apply the voice per `docs/reference/tune.md`: write prose in `language`, put the `language` term first with the English name glossed in parentheses on first use (the pattern in `examples/NODE.md`), and apply the voice to the artifacts listed in `tune-scope` (node prose keeps its section contract; the path `Lesson` is fully voiced). `tune: none`, a missing `tune`, or a missing `tune/<slug>/TUNE.md` means plain tone. Pedagogy, source citations, and the 10–15 minute lesson contract are enforced regardless. Write per `docs/reference/article-writing.md`: phenomenon before the term, a gloss for every non-trivial term on first use within the file, one claim per paragraph with a two-number cap, and no hidden prerequisites.
3. **Extract.** Follow the shared `docs/reference/source-reading.md` protocol. Read the path's sources via their digests (`learn/<subject>/digests/`) — never raw sources. When the digest detail is insufficient for a concept, dispatch a sub-agent to pull the exact section's original text by locator (one-off, returned in message). Identify only the core concepts that need independent explanation, reuse, or judgment. Ordinary one-off terms do not need node pages. Usually create 3–7 nodes, adjusted to the lesson.
4. **Canonicalize.** Give each concept an immutable kebab-case `id`. Reuse an existing node when the core concept is the same. A path-specific framing belongs in the path article, not in a duplicate node.
5. **Update nodes.** For each selected concept, create or incrementally update `learn/<subject>/nodes/<node-id>.md`. Preserve useful existing explanations. Add supported depth, examples, connections, source references, and retrieval questions; never replace a useful node with a shallower rewrite. Add the current `<subject>/<path-id>` to `paths` and deduplicate `sources`.
6. **Set canonical metadata.** `tier` is the node's subject-level abstraction depth. `order` is its stable canonical display order; neither is the node's order in this lesson. The path's `nodes` array is the teaching order.
7. **Write the path article.** After all selected node files exist, update the path file's `nodes` array and write a self-contained 10–15 minute `## Lesson` following `docs/reference/article-writing.md`. Link the core concepts at their first useful appearance with stable path-qualified node links. The article teaches the path's main idea without copying every node's deep dive. Write the lesson as a flowing narrative in the register of `examples/PATH.md`.
8. **Verify.** Check that every path node exists, every article node link resolves, every source link points into `sources/<subject>/` and its section locator resolves in the source's digest, every node has at least two meaningful connections, and each node has relationship and value-judgment retrieval questions. When a tune applies, check the prose follows the voice and language from `MEMORY.md`.
9. **Report.** List created nodes, updated nodes, the completed path article, and any unresolved source or link issues. Move the path through `nodes-written` and `content-written` only when those checks pass.

Completion: the selected canonical nodes exist or are updated without losing prior useful content, the path's `nodes` list matches its article links, the path article is complete and readable in 10–15 minutes, all citations resolve, and — when a tune applies — the prose is in the subject's `language` and follows the voice.

## Node format

```markdown
---
id: <immutable-kebab-case-id>
title: <Title>
subject: <subject>
tier: <canonical abstraction depth>
order: <stable canonical order>
paths:
  - <subject>/<path-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Title>

## Problem Statement
One or two sentences posing the problem this concept solves, framed as the learner's question.

## Why it matters
The one-line value judgment: what breaks without it.

## How it works
The mechanism, taught plain-first. Introduce the mechanism before the term, gloss every non-trivial term on first use within this file per `docs/reference/article-writing.md`, and anchor it to `MEMORY.md` or an earlier concept. The node is self-contained.

## In plain terms
(Optional; omit when the mechanism is simple) Restate the idea without jargon.

## Analogy
(Optional; omit when no good metaphor exists) A concrete everyday metaphor for the idea.

## Practical use
When you actually reach for this at work, tied to `MEMORY.md` anchors where possible.

## Prerequisites
(Optional; omit the whole section when none) Concepts that make this node easier to learn. Known concepts link to their nodes; unknown ones stay plain terms with a one-line reminder.
- [[learn/<subject>/nodes/<node-id>|<Node title>]] — what it gives you
- <plain term> — one-line reminder

## Connections
- [[learn/<subject>/nodes/<node-id>|<Node title>]] — why it connects
- [[learn/<subject>/nodes/<node-id>|<Node title>]] — why it connects

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

Rendered section headings follow `MEMORY.md` `language`. `Problem Statement`, `Connections`, `Deep dive`, and `Questions` stay in English; the other headings translate, with the rendered set shown in `examples/NODE.md`.

## Examples

Match the worked examples when writing artifacts. `examples/NODE.md` shows a finished node page: plain-first prose, the `language` term first with the English name glossed in parentheses, and the rendered section headings. `examples/PATH.md` shows the path lesson's narrative register: a flowing essay that teaches, with definitions, recap, and discussion questions. The examples carry the prose and voice; the format above stays the contract — frontmatter, `Connections`, `Deep dive`, and `Questions` still come from the template even where an example omits them.

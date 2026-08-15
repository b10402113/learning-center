---
name: edges
description: Propose and incrementally write strong relationships for a confirmed learning node.
disable-model-invocation: true
argument-hint: "Which subject/node should have edges written?"
---

Write high-value relationship pages for one node. Invoke as `/edges <subject>/<node-id>`. Edges are where interleaving happens: the learner compares, contrasts, and judges instead of retrieving in isolation. Less is more.

Prereqs: the selected node has `elements` and its referenced element files exist.

1. **Resolve.** Read `ROADMAP.md`, `MEMORY.md`, the selected node, every element in its `elements` array, and any existing edges involving those elements. Source locators come from the digests per the shared `docs/reference/source-reading.md` protocol — never raw sources. Skim other subject elements only to find justified cross-node relationships. When `MEMORY.md` sets `tune-scope: all`, apply the voice to edge prose per `docs/reference/tune.md` (and the subject's `language`); otherwise write edges in plain tone. Write edge prose for a **cold reader** per `docs/reference/article-writing.md`: gloss every non-trivial term on first use within the file and assume no hidden prerequisites.
2. **Propose.** Generate candidate pairs. Prefer relationships inside the selected node, cross-tier comparisons, conditional choices, and value judgments. A cross-node edge must add a useful connection that the selected lesson cannot get from its own elements.
3. **Prioritize.** Keep a small set of strong edges. Drop pairs that only restate an element's existing connection or add no decision value.
4. **Update.** Create or incrementally update one page per selected edge at `learn/<subject>/edges/<edge-id>.md`. Preserve useful existing explanations. Use immutable element IDs in `from` and `to`; record every involved node in `nodes`.
5. **Confirm.** Present the candidate edge set to the learner. Add or remove edges before finalizing. Mark the selected node `edges-written` only after confirmation.
6. **Verify.** Check that every `from`, `to`, and `nodes` reference resolves, no duplicate relationship page exists, and each edge has an interleave prompt. When a tune applies, check the prose follows the voice and language from `MEMORY.md`. Run the cold-read self-check per `docs/reference/article-writing.md` (Rule 4) on each edge page before finishing. Then run the **AI-tell audit** per Rule 5 and `docs/reference/humanize.md`: load the `humanizer` skill, use the tune as the calibration sample when one is set, rewrite only sentences (never paragraphs, glosses, numbers, links, or frontmatter), and re-run the cold-read self-check on every edge page the audit changed.

Completion: the learner confirmed a small, high-value edge set, every edge resolves to existing elements and nodes, each edge passes the cold-read self-check and the AI-tell audit, and the selected node is marked `edges-written`.

## Edge types

- **relationship** — X depends on, drives, or precedes Y
- **comparison** — X vs Y, where they overlap and diverge
- **tradeoff** — choosing X costs Y
- **analogy** — X works like Y, mapping known onto new

## Edge format

Edge files are written as **MDX**. The `from` and `to` fields use stable element IDs (immutable kebab-case), which remain valid regardless of element `type` (`article`, `video`, or `question`). Cross-node edges may also reference node IDs.

```markdown
---
title: <X vs Y | X drives Y | ...>
type: <relationship | comparison | tradeoff | analogy>
from: <element-id>
to: <element-id>
nodes:
  - <subject>/<node-id>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Title>

## The relationship
One clear sentence: what connects these two.

## Why it matters
Why the learner should care that these connect.

## When each applies
When to reach for A versus B, or how they work together.

## Interleave
A prompt that forces the learner to actively compare, contrast, or judge the pair.

## Element links
- [[learn/<subject>/elements/<from-id>|<From title>]]
- [[learn/<subject>/elements/<to-id>|<To title>]]
```

---
name: edges
description: Propose and incrementally write strong relationships for a confirmed learning node.
disable-model-invocation: true
argument-hint: "Which subject/node should have edges written?"
---

Write high-value relationship pages for one node. Invoke as `/edges <subject>/<node-id>`. Edges are where interleaving happens: the learner compares, contrasts, and judges instead of retrieving in isolation. Less is more.

Prereqs: the selected node is `confirmed` or `written`, its `steps` array is filled, and the step articles exist.

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, the selected node, its step articles, and any existing edges that touch those steps. Source locators come from the digests per the shared `docs/reference/source-reading.md` protocol — never raw sources. Skim other nodes only to find justified cross-node relationships. Edge prose is always written in plain tone in the subject's `language` from `MEMORY.md`. Gloss every non-trivial term on first use and assume no hidden prerequisites.
2. **Propose.** Generate candidate pairs among steps inside the selected node, plus justified comparisons across nodes. Prefer conditional choices and value judgments over restating what a step already says.
3. **Prioritize.** Keep a small set of strong edges. Drop pairs that only repeat an existing relationship or add no decision value.
4. **Update.** Create or incrementally update one page per selected edge at `learn/<subject>/edges/<edge-id>.md`. Preserve useful existing explanations. `from` and `to` are node-qualified step ids (`<node>/<step>`), or node ids when the edge compares whole nodes; record every involved node in `nodes`.
5. **Confirm.** Present the candidate edge set to the learner. Add or remove edges before finalizing.
6. **Verify.** Check that every `from`, `to`, and `nodes` reference resolves to an existing node or step, no duplicate relationship page exists, each edge has an interleave prompt, and every relative link in the body resolves. There is no `edges-written` node status in the current schema.

Completion: the learner confirmed a small, high-value edge set, every reference resolves, and each edge passes a cold-read check.

## Edge types

- **relationship** — X depends on, drives, or precedes Y
- **comparison** — X vs Y, where they overlap and diverge
- **tradeoff** — choosing X costs Y
- **analogy** — X works like Y, mapping known onto new

## Edge format

Edge files are Markdown (`.md`). `from` and `to` use node-qualified step ids or node ids.

```markdown
---
title: <X vs Y | X drives Y | ...>
type: <relationship | comparison | tradeoff | analogy>
from: <node-id>/<step-id>
to: <node-id>/<step-id>
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

## Step links
- [<From title>](../nodes/<node-id>/<step-id>.md)
- [<To title>](../nodes/<node-id>/<step-id>.md)
```

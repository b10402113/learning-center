---
name: nodes
description: Reason out a node's step list, write the step entries into the node container, and create empty article skeletons. Article content is filled by /article.
disable-model-invocation: true
argument-hint: "Which subject/node should be planned?"
---

Invoke as `/nodes <subject>/<node-id>`.

A node is one Markdown container. Its `steps` array is the whole plan: each entry carries `id`, `title`, `purpose`, and `sources`, and the array order is the teaching order. `/nodes` writes that plan; it does not write article prose — `/article` does.

**Prereqs.** `learn/<subject>/MEMORY.md` exists, `learn/<subject>/ROADMAP.md` exists, and the node container `learn/<subject>/nodes/<node-id>.md` exists. A `draft` node moves to `confirmed` when this skill runs; no separate probe gate exists.

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.md`. Resolve source references from the roadmap and digests — do not infer the subject from a node name.

2. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read through `learn/<subject>/digests/` — never the whole raw source. Use the digest's L2 `#Lx-Ly` map to find the lines each step needs. Pull exact slices only when the digest is insufficient. When a digest declares `supplements`, read each supplement digest too — it carries the code or figures the text refers to, and the text digest alone is incomplete for a step about that code.

3. **Reason the steps.** Decompose the node into 2–5 coherent steps. Each step is one teaching unit with its own learner-facing outcome. For each step decide:
   - `id` — immutable kebab-case, unique within the node.
   - `title` — the article's H1 and the node list label. It must come from a heading or phrase that actually appears in the source material, translated faithfully into Traditional Chinese; do not invent one.
   - `purpose` — **one short sentence (≤ 120 characters)** stating what the learner can do after the step. It is a purpose, not an article summary: no second sentence, no list, no "本節將介紹…".
   - `sources` — every `[[sources/<subject>/<file>#Lx-Ly]]` slice the article will need. PDFs are never cited; cite the extracted `.txt`. When a text digest declares a `codebase` supplement, every step that teaches that code must cite the real files covered by the supplement's named L2 entry (`<digest>.md#Lx-Ly`) — `[[sources/<subject>/<YYYYMMDD>/<dir>/<file>#Lx-Ly]]`. A supplement that applies to the step is never left out of `sources`, and a digest `.md` is never cited. An `image` supplement is referenced as `#L1`; it has no line ranges, so it stays out of `sources` and feeds `/article`'s image plan instead.

4. **Confirm the plan (checkpoint).** Present the ordered step list — id, title, purpose, and source ranges — and ask the learner to confirm. Exit options: accept; reorder or rename steps; add, remove, split, or merge steps. Do not write anything until this checkpoint passes.

5. **Write the step entries.** Rewrite the node's `steps` frontmatter as an ordered array. Array order is teaching order — do not add `deps`, `type`, or `order`. Example:

   ```yaml
   steps:
     - id: harness-is-the-product
       title: "Harness 才是產品：LLM 之外的基礎設施"
       purpose: "能用「LLM + harness」解釋 agent，並說出 memory、tools、long-running 為什麼屬於 harness。"
       sources:
         - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L7-L25]]"
   ```

6. **Create the article skeletons.** For each step write `learn/<subject>/nodes/<node-id>/<step-id>.md` containing exactly one heading:

   ```markdown
   # <step title>
   ```

   No frontmatter, no body. The file exists so every `## Steps` link resolves and verify passes; `/article` fills the body. Never write an article body here.

   **Path rule (non-negotiable).** Every step file MUST live at `learn/<subject>/nodes/<node-id>/<step-id>.md` — inside a subdirectory named after the node. Step files MUST NOT be written directly into `learn/<subject>/nodes/`.

7. **Write the `## Steps` list.** Replace the node body's `## Steps` section with an ordered Markdown list whose links are relative to the node file. Titles and order MUST match the frontmatter exactly:

   ```markdown
   ## Steps

   1. [Harness 才是產品：LLM 之外的基礎設施](what-a-harness-is/harness-is-the-product.md)
   2. [Demo agent 為什麼一進 production 就死](what-a-harness-is/demo-vs-production.md)
   ```

8. **Update the node metadata.** Set `status: confirmed` and bump `updated`. Keep `goal`, `tier`, `order`, and `prerequisites`; there is no node-level `sources` field.

9. **Verify.** Run `node scripts/verify.mjs --node <subject>/<node-id>`. Every failure must be fixed; re-run up to 3 rounds. The skeleton articles satisfy the article-presence and H1 rules. Treat the script as the sole format gate — do not re-read article bodies for prose judgment.

10. **Report.** List the confirmed steps (id, title, purpose, source count), the skeleton files created, and the verify exit status. Move the node to `confirmed` and tell the learner to run `/article <subject>/<node-id>` to write the articles.

Completion: the node's `steps` array is ordered and complete, each entry has a one-sentence purpose and cited line ranges, every `codebase` supplement that a step teaches is cited by that step, every skeleton article exists at the node-qualified path, `## Steps` matches the array exactly, the node is `confirmed`, and `node scripts/verify.mjs --node <subject>/<node-id>` exits 0.

## Formats

See [NODE-FORMAT.md](./NODE-FORMAT.md) for the node container contract and [STEP-FORMAT.md](./STEP-FORMAT.md) for the article contract.

## Segmented writing protocol

When writing a node container, never put the entire file body into a single `write` call if it is large (> ~3 KB). Write the frontmatter and headings first, then fill each section with `edit`.

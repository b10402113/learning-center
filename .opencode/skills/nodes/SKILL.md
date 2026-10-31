---
name: nodes
description: Reason out a node's step list, write the step entries into the node container, and create empty article skeletons. Article content is filled by /article.
disable-model-invocation: true
argument-hint: "Which subject/node should be planned?"
---

Invoke as `/nodes <subject>/<node-id>`.

A node is one Markdown container. Its `steps` array is the whole plan: each entry carries `id`, `purpose`, and `sources`, and the array order is the teaching order. `/nodes` writes that plan; it does not write article prose — `/article` does. The publisher chooses each article's title while writing it and writes that title back to the step entry.

**Prereqs.** `learn/<subject>/MEMORY.md` exists, `learn/<subject>/ROADMAP.md` exists, and the node container `learn/<subject>/nodes/<node-id>.md` exists. A `draft` node moves to `confirmed` when this skill runs; no separate probe gate exists.

1. **Resolve.** Read `learn/<subject>/ROADMAP.md`, `MEMORY.md`, and `learn/<subject>/nodes/<node-id>.md`. Resolve source references from the roadmap and digests — do not infer the subject from a node name.

2. **Read sources via digests.** Follow `docs/reference/source-reading.md`: read the node's declared `digests` — never the whole raw source, and not the other digests in the subject. Use the digest's L2 `#Lx-Ly` map to find the lines each step needs. Pull exact slices only when the digest is insufficient. When a digest declares `supplements`, read each supplement digest too — it carries the code or figures the text refers to, and the text digest alone is incomplete for a step about that code.

3. **Reason the steps.** Decompose the node into 2–5 coherent steps. Each step is one teaching unit with its own learner-facing outcome. For each step decide:
   - `id` — immutable kebab-case, unique within the node. It is the only label an unplanned article has.
   - `purpose` — **one short sentence (≤ 120 characters)** stating what the learner can do after the step. It is a purpose, not an article summary: no second sentence, no list, no "本節將介紹…". The publisher turns it into the article's title later.
   - `sources` — every `[[sources/<subject>/<file>#Lx-Ly]]` slice the article will need, all drawn from the node's declared digests. If a step genuinely needs another digest, add that filename to the node's `digests` list first; `verify` fails with `node-digest-undeclared` otherwise. PDFs are never cited; cite the extracted `.txt`. When a text digest declares a `codebase` supplement, every step that teaches that code must cite the real files covered by the supplement's named L2 entry (`<digest>.md#Lx-Ly`) — `[[sources/<subject>/<YYYYMMDD>/<dir>/<file>#Lx-Ly]]`. A supplement that applies to the step is never left out of `sources`, and a digest `.md` is never cited. An `image` supplement is referenced as `#L1`; it has no line ranges, so it stays out of `sources` and feeds `/article`'s image plan instead.

4. **Confirm the plan (checkpoint).** Present the ordered step list — id, purpose, and source ranges — and ask the learner to confirm. Exit options: accept; reorder steps; add, remove, split, or merge steps. Do not write anything until this checkpoint passes.

5. **Write the step entries.** Rewrite the node's `steps` frontmatter as an ordered array. Array order is teaching order — do not add `deps`, `type`, or `order`. Example:

   ```yaml
   steps:
     - id: harness-is-the-product
       purpose: "能用「LLM + harness」解釋 agent，並說出 memory、tools、long-running 為什麼屬於 harness。"
       sources:
         - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L7-L25]]"
   ```

6. **Create the article skeletons.** For each step write an empty `learn/<subject>/nodes/<node-id>/<step-id>.md`. Zero bytes: no frontmatter, no heading, no body. The file exists so every `## Steps` link resolves; `/article` writes the H1 and the body. Never write an article body here.

   **Path rule (non-negotiable).** Every step file MUST live at `learn/<subject>/nodes/<node-id>/<step-id>.md` — inside a subdirectory named after the node. Step files MUST NOT be written directly into `learn/<subject>/nodes/`.

7. **Write the `## Steps` list.** Replace the node body's `## Steps` section with an ordered Markdown list whose links are relative to the node file. Titles and order MUST match the frontmatter exactly:

   ```markdown
   ## Steps

   1. [harness-is-the-product](what-a-harness-is/harness-is-the-product.md)
   2. [demo-vs-production](what-a-harness-is/demo-vs-production.md)
   ```

   Label each link with the step id until the publisher writes a title.

8. **Update the node metadata.** Set `status: confirmed` and bump `updated`. Keep `goal`, `tier`, `order`, and `prerequisites`; there is no node-level `sources` field.

9. **Verify.** Run `node scripts/verify.mjs --node <subject>/<node-id>`. Every failure must be fixed; re-run up to 3 rounds. The skeleton articles satisfy the article-presence and H1 rules. Treat the script as the sole format gate — do not re-read article bodies for prose judgment.

10. **Report.** List the confirmed steps (id, purpose, source count), the skeleton files created, and the verify exit status. Move the node to `confirmed` and tell the learner to run `/article <subject>/<node-id>` to write the articles.

Completion: the node's `steps` array is ordered and complete, each entry has only `id`, `purpose`, and cited line ranges from the node's declared `digests`, every `codebase` supplement that a step teaches is cited by that step, every skeleton article exists at the node-qualified path and is empty, `## Steps` labels match the ids exactly, the node is `confirmed`, and `node scripts/verify.mjs --node <subject>/<node-id>` exits 0.

## Formats

See [NODE-FORMAT.md](./NODE-FORMAT.md) for the node container contract and [STEP-FORMAT.md](./STEP-FORMAT.md) for the article contract.

## Segmented writing protocol

When writing a node container, never put the entire file body into a single `write` call if it is large (> ~3 KB). Write the frontmatter and headings first, then fill each section with `edit`.

---
name: documentation
description: Design one node's teaching plan from its material bundles, using Diátaxis to choose each step's article type and fixing reader profile, concept order, per-section questions, cited facts, examples, and step handoffs. Use when a course node needs its structure settled before any article is written.
---

# Teaching plan: material bundles → one plan per node

Turn a node's material bundles into a single `teaching-plan.md`. The plan decides what each step teaches, in what order, which grounded facts it uses, and what the reader must be able to do afterwards. It is not a draft and never contains article prose.

Work without asking the learner questions. Read the reader profile from `learn/<subject>/MEMORY.md`.

## Inputs

The dispatch supplies:

- the node container `learn/<subject>/nodes/<node-id>.md` — the steps array is the contract
- `learn/<subject>/MEMORY.md` — reader profile and output language
- one material bundle per ready step at `learn/<subject>/output/materials/<node>/<step>.json`
- the published articles of skipped steps, when any exist
- the plan path: `learn/<subject>/output/jobs/<node-id>/teaching-plan.md`
- the output language

Use every path exactly as given. A bundle's `sources[]` carries `path`, `locator`, and `text`; `text` is the exact cited slice. Open the source file only to tighten a locator or check the lines around a slice.

Work from local material only. Do not search the web, and do not add outside knowledge the bundles do not support.

## Steps

### 1. Read the material

Read every slice of every ready step before planning that step. If a slice is missing or unreadable, stop and report the step and the error.

A fact the plan uses is one the article may assert. Record it as a claim plus the citation `[[sources/<subject>/<file>.txt#Lx-Ly]]`, pointing at a `.txt`, never a PDF. Numbers, names, API signatures, and quotations always carry their exact locator. A claim you cannot tie to a locator does not go in the plan.

### 2. Set the reader

From `MEMORY.md`, write down what the reader already knows, what they are trying to do, and how much background each step may assume. Every later decision must fit that reader. If the profile is silent on something, assume competence in the subject's prerequisites and zero knowledge of this node's specific topic.

### 3. Classify each step

Use Diátaxis to pick one type per step:

| Signal | Type |
| --- | --- |
| The reader must understand why a design is the way it is | **Explanation** |
| The reader must reproduce a result, with checkable progress | **Tutorial** |
| The reader must solve a known problem in their own setup | **How-to** |

A step teaches one type. When a step carries both a concept and a procedure, make the concept the type and keep the procedure as one section, or split the concept into its own step only if the node plan already allows it. Reference is not a type for a step.

### 4. Order the concepts

Across the node:

- the first step carries every prerequisite the reader lacks
- a concept is defined in full once, in the step that needs it first; later steps reuse that wording
- each step opens by picking up the question the previous step left and ends by handing off the next one
- skipped steps already published for this node are part of the order; read them so new steps connect without re-teaching

Write the result as a **Spine**: one line per step, `step-id — the question it answers → the question it hands off`.

### 5. Write one section per step

For each ready step, decide:

- the type and the reason for it
- what the reader can do after the step
- the prerequisites the step may assume
- an outline of 2–6 sections: for each, the reader's question at that point, the facts it uses with their citations, the example it uses, and the takeaway
- the handoff sentence to the next step
- what the step deliberately does not teach, so the article does not sprawl

Section headings must convey information. "Why a real capacitor stops behaving like a capacitor above its self-resonant frequency" beats "Background".

### 6. Write the plan

Write the plan path. Use this shape:

```markdown
# Teaching plan — <node title>

## Reader
- Knows: <...>
- Wants: <...>
- May assume: <...>

## Spine
1. <step-id> — <question it answers> → hands off: <next question>
2. <step-id> — <question it answers> → hands off: <next question>

## <step-id> — <step title>

- Type: Explanation | Tutorial | How-to
- Why this type: <one sentence>
- After this step the reader can: <observable outcome>
- Prerequisites: <what may be assumed, or "none">
- Outline:
  1. **<section heading>** — reader question: <...>; facts: <claim> [[sources/<subject>/<file>.txt#Lx-Ly]], <claim> [[sources/<subject>/<file>.txt#Lx-Ly]]; example: <...>; takeaway: <...>
  2. **<section heading>** — reader question: <...>; facts: <...>; example: <...>; takeaway: <...>
- Handoff: <the sentence that hands the next question to the next step>
- Deliberately not taught: <what belongs to another step or another node>
```

## Completion

The work is done when:

- the plan has one section per ready step, in the node's steps order
- every section names a type and an observable outcome
- every fact in every section carries a locator inside that step's material
- the Spine names the same steps, in the same order, as the node container
- no concept is defined twice, and every handoff has a matching pickup in the next step
- skipped steps are accounted for in the Spine as already published

## Boundaries

- Write only the teaching-plan file named by the dispatch.
- Do not write article prose, image plans, or anything under `learn/<subject>/nodes/`.
- Do not run the article wrapper or any model CLI.

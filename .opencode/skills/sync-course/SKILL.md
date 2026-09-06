---
name: sync-course
description: Sync current conversation insights back into course files. Use when new decisions, examples, or clarifications from this chat should be folded into existing MDX step articles and HTML lessons — not lost in chat.
disable-model-invocation: true
argument-hint: "/sync-course <subject>/<node-id> or <subject>/<node-id>/<step-id>"
---

The current discussion has surfaced material worth keeping — a sharper explanation, a new example, a decision about what to teach and how. This skill folds it back into the HTML lesson so the next learner gets the improved version.

## Extraction

Scan the current conversation. Extract items that are **worth keeping** — not every utterance qualifies:

- **Sharper explanations** — a rewording that landed better than the original
- **New examples or analogies** — concrete illustrations not already in the course
- **Clarifications** — resolving ambiguity the original content left open
- **Corrected claims** — factual fixes or refinements to existing material

Each extracted item must name its **target step**. An item with no clear target is discussion noise — skip it.

Present the extraction list to the user for confirmation before writing anything. Group by target step.

## Locate

For each confirmed item:

1. **HTML lesson** — `learn/<subject>/lessons/<step-id>.html`. Read the current teaching sections.
2. **Node container** — `learn/<subject>/nodes/<node-id>.mdx`. Read for context on the step's position in the DAG.

If the HTML does not exist (node not yet taught), skip it and report which items could not be synced.

## Update HTML

Update `learn/<subject>/lessons/<step-id>.html`. Follow the lesson's existing structure — same CSS classes, same section pattern, same quiz widget variant. Do not introduce new inline styles or change the quiz format mid-lesson.

**Tables first.** If the new material improves or adds a `<table>`, update or insert it before editing prose — tables carry the densest information and are the most likely to be stale.

If the new material adds a teaching section, append it before the quiz. If it modifies an existing section, edit in place. If it replaces a quiz question, update the question, options, correct index, and explanation together.

Bump any visible date or version indicator if the lesson carries one.

## Verify

After all edits:

1. Run `node scripts/verify.mjs --node <subject>/<node-id>` to confirm no format violations.
2. Report what was synced: a table of step → item count → HTML changed.
3. If the node was at `content-written` before sync, it stays there. If it was at `nodes-written`, it stays there — sync does not advance node status.

## Completion criterion

Every confirmed extraction item has been written into its HTML lesson, dates bumped, and the verify script passes. No item from the confirmed list is left unapplied.

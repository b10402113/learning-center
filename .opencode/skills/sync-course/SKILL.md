---
name: sync-course
description: Sync current conversation insights back into course files. Use when new decisions, examples, or clarifications from this chat should be folded into existing MDX step articles and HTML lessons — not lost in chat.
disable-model-invocation: true
argument-hint: "/sync-course <subject>/<node-id> or <subject>/<node-id>/<step-id>"
---

The current discussion has surfaced material worth keeping — a sharper explanation, a new example, a decision about what to teach and how. This skill folds it back into the course files so the next learner gets the improved version.

## Extraction

Scan the current conversation. Extract items that are **worth keeping** — not every utterance qualifies:

- **New decisions** — choices about what to teach, in what order, at what depth
- **Sharper explanations** — a rewording that landed better than the original
- **New examples or analogies** — concrete illustrations not already in the course
- **Clarifications** — resolving ambiguity the original content left open
- **Corrected claims** — factual fixes or refinements to existing material

Each extracted item must name its **target**: which step it belongs to, and whether it modifies the MDX lesson body, the HTML lesson, or both. An item with no clear target is discussion noise — skip it.

Present the extraction list to the user for confirmation before writing anything. Group by target step.

## Locate

For each confirmed item:

1. **MDX step file** — `learn/<subject>/nodes/<node-id>/<step-id>.mdx`. Read the current `## Lesson` body.
2. **HTML lesson** — `learn/<subject>/lessons/<step-id>.html`. Read the current teaching sections.
3. **Node container** — `learn/<subject>/nodes/<node-id>.mdx`. Read for context on the step's position in the DAG.

If the step file or HTML does not exist (node not yet taught), skip it and report which items could not be synced.

## Update MDX

For each step that received new material, edit `## Lesson` in the step file via `edit` calls — segmented writes, never a full rewrite. Rules from [STEP-FORMAT.md](../nodes/STEP-FORMAT.md) still hold:

- No `[[sources/...]]` links inside `## Lesson` prose
- No source commentary — state claims directly
- Phenomenon before term; gloss first use
- Plain language in the subject's `language` from `MEMORY.md`

Preserve the existing structure — do not reorder sections or strip content that was already there. New material extends or replaces; it does not reorganise.

Bump `updated` in the frontmatter to today's date.

## Update HTML

For the same steps, update `learn/<subject>/lessons/<step-id>.html`. Follow the lesson's existing structure — same CSS classes, same section pattern, same quiz widget variant. Do not introduce new inline styles or change the quiz format mid-lesson.

**Tables first.** If the new material improves or adds a `<table>`, update or insert it before editing prose — tables carry the densest information and are the most likely to be stale.

If the new material adds a teaching section, append it before the quiz. If it modifies an existing section, edit in place. If it replaces a quiz question, update the question, options, correct index, and explanation together.

Bump any visible date or version indicator if the lesson carries one.

## Verify

After all edits:

1. Run `node scripts/verify.mjs --node <subject>/<node-id>` to confirm no format violations.
2. Report what was synced: a table of step → item count → MDX changed / HTML changed.
3. If the node was at `content-written` before sync, it stays there. If it was at `nodes-written`, it stays there — sync does not advance node status.

## Completion criterion

Every confirmed extraction item has been written into its target file (MDX and/or HTML), dates bumped, and the verify script passes. No item from the confirmed list is left unapplied.

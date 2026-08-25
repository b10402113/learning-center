# Step Format

`learn/<subject>/nodes/<node-id>/<step-id>.mdx` — a first-class article written in teach-node style. Step files live inside a subdirectory named after the node (`nodes/<node-id>/`), never directly in `nodes/`. Deps live in the node's `steps` DAG, not here.

```mdx
---
id: <step-id>
title: <Step title>
subject: <subject>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

<LearningGoal>
<one sentence: the learner-facing outcome for this step>
</LearningGoal>

## Lesson

<The step article>

## Sources

- [[sources/<subject>/<file>#<section>]]
```

## Rules

- Deps live in the node's `steps` DAG — not here. Omit `order`; the DAG sets it.
- `<LearningGoal>` is always present, always first. One sentence.
- MDX components are provided by the rendering framework and used naturally in `## Lesson` prose. See [teach-node STEP-WRITING.md](../../.opencode/skills/teach-node/STEP-WRITING.md) for available components and when to use them.
- No separate polish pass — the article is written in teach-node style directly.

## Lesson body-prose rules

The `## Lesson` body is written for a stranger — someone with no access to the book, no context, and no idea a source exists. It must stand alone:

1. **No source links in the body.** `[[sources/…]]` links live only in frontmatter `sources:` and `## Sources` — never inside `## Lesson` prose.
2. **No source commentary.** Never reference the material's packaging — no 「書裡的定義是…」「作者說…」 or equivalents. State the definition and reasoning directly, as if the article were the primary source.
3. **Reproduce, don't point.** When the source teaches through a table, list, or diagram, reproduce it as a proper markdown table/list or MDX component in the article's own wording — never 「書中的表格」 or gestures at material the reader cannot see.
4. **Self-contained examples.** Numbers, examples, and scenarios are rewritten with full context so a reader who has never opened the source understands them completely.
5. **Phenomenon before term.** Describe the situation first, then name the concept. Don't open with jargon.
6. **Gloss first use.** Technical terms get a parenthetical translation on first use: `B-tree（B 樹）`. The `language` from `MEMORY.md` determines the parenthetical form.
7. **Plain language.** Write in the subject's `language` (from `MEMORY.md`). Short sentences. Active voice. No nominalization. No filler.

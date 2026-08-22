# Step Format

`learn/<subject>/nodes/<node-id>/<step-id>.mdx` — a first-class article. Step files live inside a subdirectory named after the node (`nodes/<node-id>/`), never directly in `nodes/`. Deps live in the node's `steps` DAG, not here.

```markdown
---
id: <step-id>
title: <Step title>
subject: <subject>
teaches:
  - <subject>/<element-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Step title>

## Learning goal

<learner-facing outcome for this step>

## Lesson

<The step article — phenomenon before term, gloss first use, in the subject's language. The `## Lesson` body must run at least 1000 字 (character-script subjects count characters; English ≈ 1000 words), measured on the body only, headings and sources excluded.>

## Sources

- [[sources/<subject>/<file>#<section>]]
```

## Rules

- `teaches` lists the subject-qualified element ids this step teaches (`<subject>/<element-id>`). Deps live in the node's `steps` DAG — not here. Omit `order`; the DAG sets it. Link elements at their first useful appearance.

## Lesson body-prose rules

The `## Lesson` body is written for a stranger — someone with no access to the book, no context, and no idea a source exists. It must stand alone:

1. **No source links in the body.** `[[sources/…]]` links live only in frontmatter `sources:` and `## Sources` — never inside `## Lesson` prose. Element links (`[[learn/<subject>/elements/…]]`) remain welcome.
2. **No source commentary.** Never reference the material's packaging — no 「書裡的定義是…」「作者說…」 or equivalents. State the definition and reasoning directly, as if the article were the primary source.
3. **Reproduce, don't point.** When the source teaches through a table, list, or diagram, reproduce it as a proper markdown table/list in the article's own wording — never 「書中的表格」 or gestures at material the reader cannot see.
4. **Self-contained examples.** Numbers, examples, and scenarios are rewritten with full context so a reader who has never opened the source understands them completely.

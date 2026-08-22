# Element Format

Elements keep their keyword-dictionary structure. `type` is `article` (default) or `video`; `video` requires `videoUrl`. The `question` type is deprecated — graded verification lives only in `/tackle`.

```markdown
---
id: <element-id>
title: <Title>
subject: <subject>
tier: <canonical abstraction depth>
order: <stable canonical order>
type: <article | video>
nodes:
  - <subject>/<node-id>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

## Body sections

The `article` body uses sections in `examples/ELEMENT.mdx`:

- `Problem Statement`
- `Why it matters`
- `How it works`
- optional `In plain terms` / `Analogy`
- `Practical use`
- optional `Prerequisites`
- `Connections`
- `Deep dive`
- `Questions`

A `video` element adds `videoUrl: "<embed URL>"` and uses a shorter body:

- `Why this video`
- `Key takeaways`
- `Connections`
- `Deep dive`
- `Questions`

## Rules

- `tier` is the element's subject-level abstraction depth and `order` its stable canonical display order — neither is the step's teaching order.
- `Questions` is a no-grade self-check; it never affects completion.
- `Connections` and `Deep dive` stay in English; other headings render per `MEMORY.md` `language`.
- **Element 是關鍵字，不是步驟標題。** 每個 element 必須是一個可獨立查閱的「概念詞」或「術語」，不可與任何 step ID 重複。判斷標準：這個詞能不能當作 dictionary entry 的標題？如果答案是「這太長了」或「這其實是個流程」，它就該留在 step article 裡，而不是變成 element。一個 step 通常對應 2–5 個 element；如果一個 step 只覆盖一個大概念，拆成 2–3 個可獨立查詢的子概念。

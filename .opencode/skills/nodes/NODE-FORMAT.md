# Node Container Format

`learn/<subject>/nodes/<node-id>.md` — the plan for one node. It holds the ordered `steps` array and a short lesson overview. There is no node-level `sources` field and no step-DAG metadata.

```markdown
---
id: <node-id>
title: "<Node title>"
subject: <subject>
tier: <node tier>
order: <node order>
status: <draft | confirmed | written>
goal: "<learner-facing outcome>"
prerequisites: []
steps:
  - id: <step-id>
    title: "<Step title>"
    purpose: "<one short sentence>"
    sources:
      - "[[sources/<subject>/<file>#Lx-Ly]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Node title>

## Lesson

<2–3 sentences tying the steps together.>

## Steps

1. [<Step title>](<node-id>/<step-id>.md)
2. [<Step title>](<node-id>/<step-id>.md)
```

## Rules

- `id` equals the filename without `.md`.
- `status` is `draft` (planned, no steps yet), `confirmed` (`/nodes` wrote the step plan), or `written` (every step article has a body).
- `steps` array order is teaching order. A step entry has exactly `id`, `title`, `purpose`, and `sources`. It must not declare `deps`, `type`, or `order`.
- `purpose` is one sentence of at most 120 characters. It states the learner-facing outcome, not a summary of the article.
- `sources` cite `[[sources/<subject>/<file>#Lx-Ly]]` line ranges in extracted `.txt` files. PDF locators, slugs, and whole-folder references are invalid. When a text digest declares a `codebase` supplement (`<digest>.md#Lx-Ly`), a step that teaches that code also cites the real files covered by that L2 entry — `[[sources/<subject>/<YYYYMMDD>/<dir>/<file>#Lx-Ly]]`. Digest `.md` files are never cited, and a supplement that applies to the step is never omitted. An `image` supplement (`#L1`) carries no line ranges and stays out of `sources`; it feeds the image plan.
- `prerequisites` is a list of relative node paths such as `learn/<subject>/nodes/<node-id>.md`; use `[]` when none.
- The `## Steps` list is an ordered relative Markdown list. Link targets are relative to the node file (`<node-id>/<step-id>.md`) and must match the frontmatter's ids, titles, and order one-to-one.
- A `draft` node may have `steps: []`. A `confirmed` or `written` node needs at least one step.

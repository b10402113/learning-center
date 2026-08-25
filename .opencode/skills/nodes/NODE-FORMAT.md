# Node Container Format

`learn/<subject>/nodes/<node-id>.mdx` — a step-DAG container with reading order and short main lesson.

```markdown
---
id: <node-id>
title: <Node title>
subject: <subject>
tier: <node tier>
order: <node order>
status: <draft | confirmed | nodes-written | content-written | edges-written>
goal: <learner-facing outcome>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
steps:
  - id: <step-id>
    order: 1
  - id: <step-id>
    order: 2
    deps:
      - <step-id>
prerequisites:
  - learn/<subject>/nodes/<node-id>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Node title>

## Learning goal

<learner-facing outcome>

## Steps

<Reading order — deps show what must come first.>

1. [[learn/<subject>/nodes/<node-id>/<step-id>|<Step title>]] — <one-line goal>
2. [[learn/<subject>/nodes/<node-id>/<step-id>|<Step title>]] — <one-line goal> (after step 1)
3. [[learn/<subject>/nodes/<node-id>/<step-id>|<Step title>]] — <one-line goal> (after steps 1–2)

## Lesson

<The node's main lesson — the overarching idea the steps build toward, a few paragraphs.>

## Sources

- [[sources/<subject>/<file>#<section>]]
```

## Rules

- `steps` is the step-DAG: every step id with its `order` and `deps`. `order` is reading order; `deps` name the steps that must come first. A step with no `deps` is an entry point.
- `prerequisites` is a list of stable node IDs (`learn/<subject>/nodes/<id>`); omit when the node has none.

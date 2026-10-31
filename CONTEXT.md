# Domain Model

The learning system has one vocabulary. This file defines it; [AGENTS.md](AGENTS.md) holds the format contracts and workflow.

## Subject

One course folder under `learn/<subject>/`, backed by immutable material under `sources/<subject>/`. A subject owns one `MEMORY.md`, one `ROADMAP.md`, a `digests/` folder, `nodes/`, and optional `edges/`.
_Avoid_: course, track, topic folder

## Learner profile

`learn/<subject>/MEMORY.md`. Records the learner's language, background, preferences, and concrete anchors. Every article is written in the profile's language.
_Avoid_: user config, persona

## Roadmap

`learn/<subject>/ROADMAP.md`. The tiered node index and chosen learning path. Every node line is a standard relative Markdown link to `nodes/<node-id>.md`. The roadmap plans nodes; it does not write step content.
_Avoid_: syllabus, outline

## Node

One Markdown container at `learn/<subject>/nodes/<node-id>.md` with one learning goal. Its ordered `steps` array is the whole teaching plan. The body is `# <title>`, a short `## Lesson`, and a `## Steps` list matching the frontmatter. Status moves `draft → confirmed → written`.
_Avoid_: lesson, chapter, unit, node container file

## Step

One entry in a node's `steps` array. A planned entry carries `id`, `purpose`, and `sources`; the publisher adds `title` when it writes the article. The array order is teaching order — there is no `deps`, `type`, or per-step `order`.
_Avoid_: lesson step, unit, element

## Article

The step's readable body at `learn/<subject>/nodes/<node>/<step-id>.md`. No frontmatter; opens with the H1 the publisher chose and wrote back to the step entry. It may contain a `quiz` block and generated figures. The viewer aggregates the step's sources below the article, so the article does not repeat them.
_Avoid_: lesson HTML, MDX, page

## Source slice

A line-addressed citation: `[[sources/<subject>/<file>.txt#Lx-Ly]]` (single line: `#Lx`). It points into an extracted `.txt`, never at a PDF. The `article` CLI slices exactly this range and hands it to the text model.
_Avoid_: PDF citation, slug locator, section link

## Locator

The `#Lx` or `#Lx-Ly` suffix of a source slice. Line numbers are fixed when a PDF is extracted at ingest time and never re-extracted, so citations stay stable.
_Avoid_: anchor, page number, section id

## Digest

`learn/<subject>/digests/<stem>.md`. A discovery layer, not a content store: an **L1 overview** plus an **L2 line map** of `#Lx-Ly` ranges. `source_lines` equals the `.txt` line count. Status is `pending | absorbed`. `/nodes` reads digests; `/article` pulls the raw slice it needs.
_Avoid_: summary, notes, index

## Edge

An optional relationship page at `learn/<subject>/edges/<edge-id>.md`. It compares or connects steps or nodes so the learner has to contrast and judge, not just retrieve. Frontmatter `from` and `to` are node-qualified step ids (`<node>/<step>`) or node ids.
_Avoid_: link, connection note

## Verify

`scripts/verify.mjs`. The single deterministic format gate: frontmatter, ids, statuses, step/article pairing, H1, `## Steps`, source ranges and digest coverage, code provenance, quiz JSON, images, relative links, and `.mdx` absence. It never judges prose quality.
_Avoid_: lint, grader, content check

## Article CLI

`src/article-cli.mjs`. Reads the node plan and source slices, makes one text call per missing article, and with `--images` plans figures and writes WebP files. It skips existing articles and reuses existing images unless `--force`.
_Avoid_: pipeline, generator, teach

## Active flow

`/learn-init → /ingest → /roadmap → /nodes → /article [--images] → /edges`, plus `/absorb` for pending digests.

## Out of scope

`/practice` (generated practice sets) is not part of the active flow. The `quiz` block format and renderer are retained for articles that include one.

## Retired concepts

Probe, tackle, mastery, element, element type, step DAG, `deps`, step `type`, per-step `order`, HTML lessons, MDX step files, and `output/` working files no longer exist in the active data model. Their old implementation lives only in [legacy/](legacy/).

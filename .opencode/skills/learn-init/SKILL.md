---
name: learn-init
description: Profile the learner and create MEMORY.md for a learning subject.
disable-model-invocation: true
argument-hint: "What subject are you starting to learn? (e.g. /learn-init vibe-engineering)"
---

Start a new learning subject. The subject **comes from the argument** — `sources/<subject>/` must exist. If no argument is given, ask for it. Before any roadmap can be built you must know the learner — every element anchors to their experience, so the profile is the foundation.

## Read the material first

Follow the shared `docs/reference/source-reading.md` protocol — never read a PDF directly and never load a large source into the main context wholesale. Concretely:

1. **Ensure digests.** For each file in `sources/<subject>/` (that folder only — do not browse `sources/` or `wiki/` or any other subject's folder), check `learn/<subject>/digests/<source-stem>.md`. Reuse it if the stored `source_hash` matches; build it via the sub-agent workflow if it is missing, stale, or the source is large. Small sources: read directly in the main context and write the digest yourself.
2. **Load L1 + TOC.** Read only the L1 overviews (and the sub-agents' compact TOC lines), not the L2 section detail. This is the ground truth your grilling questions will probe and your MEMORY will anchor to.
3. **Pull detail lazily.** If a grilling question needs a specific section, dispatch a sub-agent to extract it — one-off, returned in message.

If digests already exist and hashes match, skip reading entirely.

Run a `/grilling` session focused on the learner: work in rounds, one frontier per round, each question numbered with your recommendation. Cover every branch:

- **Goal** — what they want to *be able to do* when this subject is done. Concrete, not "understand X": "ship a production MCP server", "read retrieval papers".
- **Why** — the motivation underneath. The anchor that carries the subject when it gets hard.
- **Prior experience** — what they already know that this subject can build on.
- **Anchors** — concrete experiences the elements can connect to. Push for real specifics ("I run a Rails app", "I've used VS Code"), not "some backend".
- **Habits & constraints** — time per week, when they learn, environment.
- **Knowledge type** — where the subject sits on declarative (facts/concepts) vs procedural (doing/skill). See `Interleaving table.md`.
- **How they learn best** — what made past learning stick, what bored them, how they like being taught.

Finding *facts* is your job, never the learner's — check `learn/<subject>/` and `sources/<subject>/` before asking anything you can look up. Ask only what only they can answer.

## Output configuration

After the profile is settled, ask three output questions and store the answers in `MEMORY.md` frontmatter:

- **Language** — what language every generated article for this subject should be in (e.g. `en`, `zh-Hant`). This is a hard commitment: later nodes, elements, and edges are written in this language.
- **Tune** — which voice the articles should use. Auto-list the available tunes (folders under `tune/*/` that contain a `TUNE.md`) plus the option **none**. If no tune exists yet, offer none and point the learner to `/tune <author-slug>` first. Profile reading and application rules live in `docs/reference/tune.md`.
- **Tune scope** — which artifacts get the voice: `nodes` (lesson narratives only), `elements-nodes` (lesson plus element prose, sections kept), or `all` (also edges). Default `elements-nodes`.

Write `learn/<subject>/MEMORY.md` in the template below, then confirm the profile is accurate before ending the session.

## MEMORY.md

```markdown
---
subject: <subject>
language: <output language for all articles, e.g. en | zh-Hant>
tune: <author-slug | none>
tune-scope: <nodes | elements-nodes | all>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# MEMORY — <subject>

## Goal
<what the subject should let them do>

## Why
<the motivation underneath>

## Prior experience
- <what they can build on>
- ...

## Anchors
- <a concrete experience an element can link to>
- ...

## Habits & constraints
- <time, when, environment>

## Knowledge type
<declarative | procedural | mixed — and which dominates>

## How to teach me
<what sticks, what bores, how they like being taught>
```

Completion: every branch has a settled answer, `MEMORY.md` is written, and the learner confirms it's accurate.

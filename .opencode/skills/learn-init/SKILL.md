---
name: learn-init
description: Profile the learner and create MEMORY.md for a learning subject.
disable-model-invocation: true
argument-hint: "What subject are you starting to learn? (e.g. /learn-init vibe-engineering)"
---

Start a new learning subject. The subject **comes from the argument** — `sources/<subject>/` must exist. If no argument is given, ask for it. Before any roadmap can be built you must know the learner — every element anchors to their experience, so the profile is the foundation.

## Archive source files

Before reading, move each source file **and directory** into a dated subfolder so the active `sources/<subject>/` stays clean:

1. Create `sources/<subject>/YYYYMMDD/` (today's date) if it does not exist.
2. For every entry in `sources/<subject>/` (skip `.DS_Store`): if it is a file, move it into `sources/<subject>/YYYYMMDD/` keeping the original filename; if it is a directory, move the whole directory into `sources/<subject>/YYYYMMDD/` preserving its internal structure. Example: `sources/<subject>/20260903/AI Agents in Action, Second Edi - Micheal Lanham.pdf` and `sources/<subject>/20260903/codebase/src/auth.ts`.
3. After moving, `sources/<subject>/` contains only the `YYYYMMDD/` subfolder.

Skip this step entirely if `sources/<subject>/` already contains only dated subfolders.

## Read the material first

Follow the shared `docs/reference/source-reading.md` protocol — never read a source directly and never load a large source into the main context wholesale. Concretely:

1. **Ensure digests.** For each entry in `sources/<subject>/YYYYMMDD/` subfolders (do not browse `sources/` or `wiki/` or any other subject's folder):
   - **PDF / text file:** check `learn/<subject>/digests/<source-stem>.md`. If it exists and has `status: pending`, skip. If missing, build it via the sub-agent workflow (large sources) or read directly in the main context and write it yourself (small sources). The `source-stem` is the original filename without extension.
   - **Codebase directory:** detect by file extension — if the directory contains ≥ 1 source code file (`.py`, `.ts`, `.js`, `.go`, `.rs`, `.java`, `.c`, `.cpp`, `.rb`, `.swift`, `.kt`, `.php`), treat it as a codebase. Check `learn/<subject>/digests/<dir-stem>.md` (small) or `learn/<subject>/digests/<dir-stem>.*.part.md` (large). If it exists and has `status: pending`, skip. If missing, build it per the codebase digest workflow in `source-reading.md`. The `dir-stem` is the directory name.
   Every new digest must have `status: pending` in its frontmatter.
2. **Load L1 + TOC.** Read only the L1 overviews (and the sub-agents' compact TOC lines), not the L2 section detail. This is the ground truth your grilling questions will probe and your MEMORY will anchor to.
3. **Pull detail lazily.** If a grilling question needs a specific section, dispatch a sub-agent to extract it — one-off, returned in message.

If digests already exist with `status: pending`, skip reading entirely — the digests are ready for `/roadmap`.

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

After the profile is settled, ask one output question and store the answer in `MEMORY.md` frontmatter:

- **Language** — what language every generated article for this subject should be in (e.g. `en`, `zh-Hant`). This is a hard commitment: later nodes, elements, and edges are written in this language.

Write `learn/<subject>/MEMORY.md` in the template below, then confirm the profile is accurate before ending the session.

## MEMORY.md

```markdown
---
subject: <subject>
language: <output language for all articles, e.g. en | zh-Hant>
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

Next stage: `/roadmap <subject>` — the learner runs it next to plan the nodes; each node is then probed via `/probe <subject>/<node-id>` before it is viewed.

---
source: sources/js-mastery-engineer/20261107/course/037 - sync- Understand It Then Automate It.en.txt
source_type: text
source_lines: 79
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Frames the drift problem: implementation code and the guidance files (AGENTS.md, specs, scope) slowly diverge until the code describes one project and the files another.
- Introduces the `sync` skill, run at the end of work before merging, which reconciles the guidance files against what actually shipped.
- Shows sync depending on git, so on a fresh project it first detects no repo and the user initializes git and makes a baseline commit.
- Demonstrates sync needing a change set: with an empty diff it stops, so a second audit run is used to produce real changes to AGENTS.md and scope.
- Shows sync reading not just changed files but added and deleted ones, while discarding docs, tests, configs, logs, and generated outputs as evidence of product change.
- Notes sync is lightweight and safe to run every time, unlike the heavier develop skill, and closes the loop of planning, decisions, code, and memory.

# L2 detail

- `#L1-L19` — Describes how guidance drifts from code, what sync closes, when to run it, and why a non-git project forces a git init first.
- `#L20-L39` — Initializes git with a baseline commit, finds nothing to diff, reruns audit to record ESLint/Biome conventions, and marks scope items complete.
- `#L40-L63` — Manually fixes a too-tall homepage card via a screenshot and two iterations, yielding two changed files (agents and scope).
- `#L64-L79` — Sync reads added/deleted files, filters out non-product evidence, marks stack and architecture done, and is safe to run each time.

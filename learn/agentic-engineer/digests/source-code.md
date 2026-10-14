---
source: source-code
source_type: html
source_lines: 7
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — SOURCE CODE (course index page)

## Overview (L1)

- This is a saved SingleFile copy of the JSMastery course landing page `https://jsmastery.com/course/agentic-engineering-course` ("Agentic Engineering Course", jsmastery.com, saved 2026-09-11). Its rendered text is only "Agentic Engineering Course · Discord community · Source code · Every repo and skill file used in the course." — the lesson list lives in the page's serialized payload, not the visible text.
- The page is the authoritative index of the course: it enumerates all 102 lessons across 13 chapters (the `jsmastery.com/course/agentic-engineering-course/<chapter>/<lesson>` slugs), including lessons, `exercise-*`, `challenge-*`, and `interview-*` items that do **not** all have downloaded transcripts.
- It links the single external source repo the course points learners at: `https://github.com/jsmastery-pro/skills` (the JSM Skills System, mirrored in `sources/agentic-engineer/20261014/skills/`).

## Sections (L2)

### course-index

- Locator: `[[sources/agentic-engineer/20261014/SOURCE CODE.html#course-index]]`
- Summary: Ordered list of chapters and their lesson slugs for the whole course. Chapters: setup-orientation, agentic-mindset, how-coding-agents-work, the-building-blocks, context-engineering, skills-the-system-you-needed, vibe-coding-vs-agentic-engineering, workflow-ship-something-real, workflow-prove-it-runs, workflow-ship-it-like-a-team, workflow-find-the-root-cause, workflow-code-you-didn-t-write, idea-to-first-ship-greenfield.
- Key claims: 102 unique lesson slugs total; the local `sources/agentic-engineer/20261014/` transcripts cover the video lessons but omit most `interview-*`, `exercise-*`, and `challenge-*` items; the only external repo referenced is `jsmastery-pro/skills`.
- Learner-relevant: gives the canonical per-chapter lesson order for roadmap partitioning and flags which course items have no local source (interviews, exercises, some challenges).

### external-repo

- Locator: `[[sources/agentic-engineer/20261014/SOURCE CODE.html#external-repo]]`
- Summary: The page's "Source code" section points to `https://github.com/jsmastery-pro/skills` — "Every repo and skill file used in the course."
- Key claims: the course's own code is distributed via that repo and via in-video demos, not as a bundled download; local `ai-course-demos/` and `skills/` are the captured copies.
- Learner-relevant: anchors which code is expected to exist locally vs. fetched from the course repo.

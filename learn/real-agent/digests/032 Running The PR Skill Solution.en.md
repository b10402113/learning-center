---
source: sources/real-agent/20261030/Review/032 Running The PR Skill Solution.en.srt
source_type: text
source_lines: 247
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- A single prompt ("write a PR body for PR 34") loads the skill, runs type checking and the test suite for evidence, and posts a structured body.
- The body is short on prose and leans on a JSX-style diff; it uses the glossary's "student" rather than "learner", showing the skill reads domain language.
- The evidence is weak: the agent reasoned from code alone, and admits type check and tests pass but nothing covers bookmarks or notes.
- The merge-danger call is a one-way door because migration O12 only adds tables; rollback means orphan tables or deleting student-written data, with privacy as the blast radius.
- The agent surfaces a glossary contradiction (notes are private to the student, yet instructors see them) and quality problems (N+1 queries, `on delete no action` foreign keys).
- Takeaway: the PR body already tells you this PR is low quality, so run automated review before spending human review time.

# L2 detail

- `#L1-L44` — Prompt to write a PR body for PR 34; the skill loads; the agent runs type checking and tests for evidence; a proposed body is offered and posted without prior review; it also flags code inconsistencies.
- `#L45-L96` — Body walkthrough: minimal prose, a large JSX-style diff; bookmark toggle in the lesson viewer, save-note in lesson notes, a saved button in the sidebar, students-only visibility; "students" comes from the glossary, not free choice.
- `#L97-L144` — Saved route lists bookmarks newest-first and notes most-recently-edited-first; instructor roster shows each student's notes; schema adds bookmarks and notes tables.
- `#L145-L192` — Evidence critique: reasoning from code only, no bookmark or note test coverage; merge danger is a one-way door because O12 only adds tables, so rollback orphans tables or deletes student data, with privacy as the blast radius.
- `#L193-L247` — Glossary contradiction between private notes and instructor visibility; quality complaints including three queries per item and `on delete no action` foreign keys; a one-way door needs human review, but the PR is low quality, so automated review should come first.

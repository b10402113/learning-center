---
source: sources/real-agent/20261030/Review/030 The PR Skill.en.srt
source_type: text
source_lines: 595
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Human review should improve on two axes: speed of understanding a PR, and correct prioritization of which PRs deserve scrutiny.
- Agents are persistently bad at PR descriptions; the fix is a skill that forces structure instead of free prose.
- The PR skill is adapted from Dex Horthy's Show Me skill: skip preamble, keep text short, explain the change with visual pseudocode and diffs.
- A PR body needs three things: a fast "why" summary, hard before/after evidence that the change works, and a merge-danger rating.
- Merge danger is two independent axes: one-way vs two-way door, and blast radius. Together they set review priority.
- Priority is project-relative: personal software is mostly two-way doors, regulated domains more one-way; two-way with small blast radius may skip human review once automated review is solid.

# L2 detail

- `#L1-L56` — Two goals for human review: make a PR understandable as fast as possible, and spend review time proportionally; agents write PR bodies full of garbage that discourage review.
- `#L57-L116` — Origin story: the assumption that agents would always write slop; Show Me by Dex Horthy at HumanLayer; it teaches the current topic visually, skips preamble, uses visual pseudocode explainers for UI and file responsibility.
- `#L117-L212` — Pseudocode use cases: component interaction, mermaid over time, diffs of components, file layout, call trees; understanding intent before reading code speeds review; Show Me tweaked into a PR skill via `npm run reset add pr skill`; skill is a PR-body template with a summary plus Show Me sections copied verbatim.
- `#L213-L292` — Speed has two parts: the summary delivers the why, and evidence proves the right change was made; before/after evidence (failure then success) forces the agent to show the thing was broken and is now fixed.
- `#L293-L336` — What good evidence looks like: concrete, with a before and after; screenshots are S-tier when the change is visual; execution-based evidence (console output, test results, a test that fails then passes) is A-tier; this raises confidence and speed.
- `#L337-L428` — Review priority: reviewing some PRs more than others; the merge-danger section; doors from AWS; two-way doors can be walked back, one-way doors cause data loss, cost, security exposure, mass email, or a public breaking change.
- `#L429-L504` — One-way doors get closer review; blast radius is separate from door direction; a two-way door can be bad yet reversible, a one-way door with huge blast radius demands the closest read; both concepts set priority; project type shifts the mix.
- `#L505-L595` — Personal software is ~95% two-way doors, medical or finance more one-way but still uneven; two-way doors with small blast radius might not need human review at all, but only after automated checks and review are solid; quiz prompt before the hands-on PR.

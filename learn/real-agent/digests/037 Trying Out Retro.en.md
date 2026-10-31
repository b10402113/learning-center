---
source: sources/real-agent/20261030/Retro/037 Trying Out Retro.en.srt
source_type: text
source_lines: 143
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- The exercise runs retro across every session that produced a given PR.
- PR comments are pulled in explicitly so retro can read the human review locally.
- Review here targets process, not implementation: comments should become general rules.
- Even non-experts should read the diff and use the teach skill to understand it.
- The workflow is: brief human review, then run retro and inspect what it returns.

# L2 detail

- `#L1-L19` — Sets the goal: retro over all sessions behind the PR; copy the PR number and ask retro to also grab all PR comments.
- `#L20-L68` — Leaves line-by-line GitHub comments on the diff so retro reads them locally; keeps review process-focused and deletes an implementation-level comment.
- `#L69-L112` — Looks for comments that can become coding standards; domain expertise sharpens this, but non-experts should still read the code and ask the teach skill.
- `#L113-L139` — Recalls the teach skill from the crash course; instructs a brief human review followed by running retro to ingest everything.
- `#L140-L143` — Hands off to the solution lesson.

---
source: sources/real-agent/20261030/Review/033 The _code-review Skill.en.srt
source_type: text
source_lines: 315
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Automated review is underused and token-efficient: it raises quality at each stage so human review never wastes effort on bad code.
- Implement is overburdened — explore, implement, debug — so a separate reviewer on the finished diff gets a fresh context and the whole instruction budget.
- Code review runs as a sub-agent invoked from implement, so it sees the diff in place without needing to find or change anything.
- Reviewer behavior is configured through `codingstandards.md`, which is deliberately hidden from the implementer.
- Division of labor: implement makes it work, code review makes it good; the implementer is free to produce a rough draft.

# L2 detail

- `#L1-L52` — Automated review is underrepresented and token-efficient; quality rises through automated checks, automated review, then human review; the goal is to never spend human effort on crap code.
- `#L53-L120` — Why not have implement get it right first time: implement must explore the codebase, implement, and debug; a reviewer on the finished diff skips exploration and file changes and can carry many extra instructions.
- `#L121-L172` — Typical flow: run implement, call code review from inside it, code review runs in a sub-agent and gets a fresh context; the skill's standards sources point at `codingstandards.md`.
- `#L173-L232` — Example standards already in the repo: no `any`, no non-null `!`, throw instead of returning errors, validate untrusted input with a schema; automated review is an extra line of defense for things the model might do anyway.
- `#L233-L292` — Why not put standards in `agents.md`: keeping them out of the implementer lets it produce a rough draft; code review then polishes using the extra rules.
- `#L293-L315` — Recap of splitting implement and code review and tuning automated review over time; next lesson runs code review on the weak PR.

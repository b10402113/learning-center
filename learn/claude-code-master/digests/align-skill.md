---
source: sources/claude-code-master/20261031/3-Volume B - Skills/2-Module B2 - Creating Good Skills/resources/align/align-SKILL.md
source_type: text
source_lines: 103
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Skill identity — `name: align`, a "pre-work alignment check" skill; before starting a task it asks short numbered clarifying questions so direction is clear before effort is spent.
- Trigger phrases — fires on `/align`, "align", `/align [task]`, "align [task]"; the body explicitly forbids invoking itself silently, so it only runs when the user asks.
- Process — identify the target request, generate at most five load-bearing numbered questions (at least one, always), wait for a single round of answers, then restate direction in 1–2 lines and start work.
- Question design — short layman language, A/B/C options only where faster than open answers, mix open and option-style, prioritized as scope > format > audience > constraints > nice-to-haves, with a fixed restatement-plus-numbered-list format.
- Answer handling — users may answer all, skip some (assume best judgment), say "do whatever you recommend" (use judgment throughout), or add new direction; no follow-up rounds unless requested.
- Anti-patterns — no more than five first-round questions, no questions already answered by context or memory, no generic padding, no long restatement, no repeated asking, no self-initiated alignment.
- Scope and example — a single task per invocation, not a persistent mode; worked example aligns a launch email with five questions covering audience, goal, length, tone, and a feature number.

# L2 detail

- `#L1-L20` — Frontmatter (`name: align`, description of the pre-work check and trigger list) and the "what this does" and "when to use" sections: pause the pending or current request, the three invocation shapes, and the rule that the skill never fires on its own.
- `#L21-L51` — Process steps 1 and 2: identifying the target (explicit task, most recent unhandled request, or a single "align on what?" question), then the question rules (cap at five, at least one, expand on request, short language, inline A/B/C options, mixed styles, the scope > format > audience > constraints > nice-to-haves priority) and the output format block.
- `#L52-L74` — Process steps 3 and 4: waiting for one round of answers and how to treat partial answers, "do whatever you recommend," and added direction; then restating the locked-in direction in 1–2 lines, calling out reversals from default assumptions, and starting work without further confirmation.
- `#L75-L103` — What not to do (six prohibitions on question count, obvious questions, padding, long restatement, repeat rounds, and self-invocation), the single-task scope note, and the `/align write a launch email for our new feature` example showing a five-question opening.

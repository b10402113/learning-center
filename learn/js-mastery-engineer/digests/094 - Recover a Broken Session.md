---
source: sources/js-mastery-engineer/20261107/supplement/094 - Recover a Broken Session.txt
source_type: text
source_lines: 192
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Recognise a broken session by repetition without progress: the same function rewritten five times, the same files reopened, the diff getting messier, and the agent contradicting its own earlier decisions.
- A hallucination gives wrong content; a loop gives a broken process, and adding instructions makes a loop worse because the instructed agent is part of the failure.
- Make one judgement: is the context this session built worth keeping? Productive but low on room means compact; full of failed attempts and repeated assumptions means clear.
- The escalation, in order: stop it (Esc, not Ctrl+C), ask what it believes and what assumption might be wrong, give it less with a narrow finishable task and a hard boundary, roll the code back yourself, then clear and bring the exact evidence forward.
- Checkpoints may not restore files changed through shell commands; git restore for working-tree changes and git reset when the repository must move are the universal fallback.
- Prevent loops by planning before editing, so a bad approach can be rejected while it is still a few lines of text.
- Every stuck session ends one of three ways: steer out, reset to good, or rethink (back to /architect or /scope).
- A reference card maps each action to Claude Code, Codex and Cursor, and should be verified and dated because it goes stale fast.

# L2 detail

- `#L1-L10` — recognising the repetition-without-progress signal and why instructions make loops worse.
- `#L11-L24` — the one judgement: keep and compact, or clear, and the cost of getting it backwards.
- `#L25-L40` — escalation steps 1-2: stop with Esc, then ask what it believes and what assumption is wrong.
- `#L41-L67` — escalation steps 3-4: give it a narrower task with a hard boundary, then roll the code back.
- `#L68-L80` — escalation step 5: clear and bring the exact error, test and missing fact forward.
- `#L81-L85` — prevention: have the agent plan before editing.
- `#L86-L106` — the three outcomes of a stuck session: steer out, reset to good, rethink.
- `#L107-L192` — the per-tool reference card for stop, inspect, narrow, restore, start fresh, compact and plan.

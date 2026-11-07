---
source: sources/js-mastery-engineer/20261107/supplement/095 - Challenge- Diagnose a Session.txt
source_type: text
source_lines: 55
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The challenge is to break your own project three times, once in each category, naming the category out loud before you act.
- Break one, a normal code bug: change a real value, operator or boundary to produce wrong output rather than a crash, run /debug, read the hypothesis before letting it change anything, and confirm the regression test fails without the fix.
- Break two, make AI-written code fail: feed an agent-built feature something real (a long value, an empty state, a duplicate, a user who should not have access), recover intent from the spec, then name which of the four patterns it was.
- If there was no spec at all, you have found a decision nobody made, and that goes to /architect rather than /debug.
- Break three, get an agent stuck: give it something too broad on purpose, watch for repetition without progress, then recover by exposing the assumption, narrowing the task, rolling back, or clearing with the fact it kept missing.
- The test that matters: can you explain in one sentence what was actually wrong — the cause, not the change? Otherwise you probably patched the symptom and it will return.
- Closing rule: a fix you cannot explain is a bug you have not caught.

# L2 detail

- `#L1-L9` — the setup: three breaks, once per category, named before acting.
- `#L10-L19` — break one, a normal code bug, and the regression-test check.
- `#L20-L32` — break two, failing AI-written code, the four patterns, and the no-spec case.
- `#L33-L39` — break three, getting an agent stuck and recovering.
- `#L40-L55` — the one-sentence cause test and the closing rule.

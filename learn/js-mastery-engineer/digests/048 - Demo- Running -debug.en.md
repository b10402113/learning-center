---
source: sources/js-mastery-engineer/20261107/course/048 - Demo- Running -debug.en.txt
source_type: text
source_lines: 65
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Demonstrates the `debug` skill, which runs the six-step debugging method with discipline instead of the vibe of change-until-green.
- Explains the essential input: the observed behavior, the expected behavior, and the steps to reproduce, or the skill must stop and ask for evidence.
- Notes that if it cannot reproduce, it adds instrumentation to make the failure reproducible before reporting back.
- Reuses the earlier `check verify data model` findings as input, then runs `debug data model`.
- Emphasizes reviewing for a single hypothesis: stop any agent changing several unrelated things hoping the failure disappears.
- Shows the root cause found in a small fix: env config read `.env` while secrets lived in `.env.local`, so all seven tests ran with empty values; the fix is one line.
- Contrasts debug with blind "vibe debugging": debug requires reproduction, one hypothesis, evidence, a minimal fix, and a regression test so the result can be explained.
- Notes an extra difficulty with agent-written code: you cannot reason from the author's intent, you have to recover it.

# L2 detail

- `#L1-L16` — Introduces debug, the three essential inputs, and how it instruments to reproduce when it cannot.
- `#L17-L43` — Reuses the check-verify findings, runs debug on the data model, enforces one hypothesis, and finds the `.env` vs `.env.local` root cause.
- `#L44-L65` — Notes the one-line fix, contrasts debug with vibe debugging, lists debug's required elements, and flags recovering intent in agent-written code.

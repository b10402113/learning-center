---
source: sources/js-mastery-engineer/20261107/supplement/091 - Demo- Running -debug pdf.txt
source_type: text
source_lines: 89
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- /debug needs three inputs: what you observed (the actual behaviour, not your theory), what you expected (so it knows what "correct" looks like), and the exact steps (so it can reproduce before investigating); "this is broken" makes it stop and ask for all three.
- It refuses to fix what it cannot reproduce, adding instrumentation and labelling the cause unproven instead.
- It tests one hypothesis per experiment, corrects the faulty transformation rather than clamping the final value, refuses unrelated cleanup/refactor/features, and sends a missing decision to /architect.
- Review it with one question: can you state the proven cause and why this exact change removes it? Otherwise you have a green result and an unproven fix.
- Versus a fixing prompt, /debug reproduces, hypothesises, proves, fixes and protects, and leaves a regression test that fails without the fix; but a direct fix is faster for an obvious typo.
- Reach for it when a test fails for an unclear reason, /check verify exposes broken behaviour, or the application produces the wrong result — not when the code is fine and the agent has lost the path.
- Limits: the result is only as strong as the reproduction, the one-hypothesis discipline is a behaviour not a guarantee, and ugly surrounding code stays ugly.
- It runs the investigation in a helper subagent so large files, logs and repeated experiments stay out of the main session.

# L2 detail

- `#L1-L21` — the three things to give /debug and why a vague "this is broken" stalls it.
- `#L22-L45` — what it refuses to do: unreproducible fixes, multiple hypotheses, hiding symptoms, unrelated work, patching a missing decision.
- `#L46-L65` — how to review it, and the comparison against a fixing prompt.
- `#L66-L83` — when to reach for it and its honest limits.
- `#L84-L89` — the helper subagent keeping investigation noise out of the main session.

---
source: sources/js-mastery-engineer/20261107/supplement/075 - Demo- Running -check verify pdf.txt
source_type: text
source_lines: 90
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Every acceptance criterion gets one of four verdicts: Met (behaviour happened and evidence was captured), Specced but missing (never built, go back to /develop), Specced but not applied (code exists but is not live; apply migrations, env, config), and Blocked (could not be exercised because the observing tool was unavailable; fix tooling and re-run).
- A feature passes only when every criterion is Met and every required surface exists; one unapplied migration fails the whole run even with a green test suite.
- The evidence rule is the point: reading code, a passing test, or reasoning that something should work cannot produce a green result — no evidence, no pass, and when it cannot know it says Blocked.
- Missing vs not applied is separated because the fix differs: missing is work never done, not applied is work that exists but is not live.
- It reads the build approach first: on Tracer Bullet a real action should hit real data, while on Facade a screen on sample data can be correct.
- It can run at any tier because the tier decides what must happen before a feature closes, not which skills are allowed; with no spec it works from visible behaviour.
- Refactors are another use: capture behaviour before and after the change and treat any difference as a regression.
- Honest limits: verification is only as strong as the tools available, and the captured proof is not kept as permanent history.

# L2 detail

- `#L1-L4` — title block and lecture summary header
- `#L5-L43` — the four verdicts, what each means, what to do, and the all-criteria-Met pass rule
- `#L44-L56` — the evidence rule: no evidence, no pass; Blocked instead of pretending
- `#L57-L61` — distinguishing specced-but-missing from specced-but-not-applied
- `#L62-L74` — reading the build approach first (Tracer Bullet vs Facade)
- `#L75-L79` — running it at any tier, with or without a spec
- `#L80-L84` — using it on refactors via before/after behaviour capture
- `#L85-L90` — honest limits on tools and on retained proof

---
source: sources/js-mastery-engineer/20261107/supplement/081 - Demo - Running -check review pdf.txt
source_type: text
source_lines: 77
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Severities are Blocker (cannot ship safely), Major (needs a meaningful change), Minor (worth correcting) and Nit (optional polish).
- Verdicts are Approve, Approve with nits, Changes requested, and Blocked.
- The report lands in `docs/reviews/`, ordered by severity and kept on disk like PR comments; the scope's review step gets ticked, recording that the review happened, not that it passed.
- Honest severity is the whole product: a reviewer that calls everything a Blocker gets ignored, and an ignored reviewer is worth less than none; the goal is findings you will act on.
- It deliberately does not run the app (/check verify already proved behaviour), does not write tests (/test already protects it), and is read-only — it reports, you fix through /develop or /debug, then run it again.
- It respects your testing choice: if you deliberately rely on type checking and verification without a suite, it reads that from project settings and stops asking.
- The one unbendable rule: the model that wrote the feature is not the model that approves it — "review my changes" in the authoring session is the author grading its own paper.
- Honest limits: two models from one provider share training and blind spots (a second reader, not an independent audit), some tools cannot run a helper on a different model, and the guarantee rests on the authoring model you confirm at the start.
- Unlike CodeRabbit and Greptile, its trade is running inside your process, keeping code local, and knowing the spec, conventions and testing choices; the goal is trusted findings, not the most findings.

# L2 detail

- `#L1-L22` — severity levels and what each means
- `#L23-L41` — verdicts, where the report lands, how the review step is ticked, and why honest severity matters
- `#L42-L48` — what it deliberately does not do: run the app, write tests, or edit code
- `#L49-L57` — respecting a deliberate no-suite testing choice
- `#L58-L61` — the rule that the authoring model cannot approve its own work
- `#L62-L69` — honest limits on shared provider blind spots and confirmed authorship
- `#L70-L77` — how it differs from PR review tools like CodeRabbit and Greptile

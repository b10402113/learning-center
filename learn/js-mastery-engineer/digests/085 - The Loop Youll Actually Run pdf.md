---
source: sources/js-mastery-engineer/20261107/supplement/085 - The Loop Youll Actually Run pdf.txt
source_type: text
source_lines: 133
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- This Extra shows the shape the individual skills make together, beyond what the Module 07 pipeline map could tell you.
- You run only what the work needs: a bug gets /debug, a wording change gets /develop then a quick verify, a normal feature gets the loop at your project's tier, and payments/access/private data get the whole thing.
- The tier decides how much proof a feature needs, and the decision check decides when development must stop because a real choice has not been made.
- Every artifact has exactly one owner: the plan to /scope, specs to /architect, the implementation to /develop, AGENTS.md to /audit and /sync, and proof/reviews/records to the skill that produced them.
- One owner per artifact keeps the repo a source of truth and lets your own wording survive the next run, because the owning skill knows which lines it wrote and which a person changed.
- State lives in files, not the conversation: the plan is in the scope, decisions in specs, conventions in AGENTS.md, and proof/reviews/records in the repo, so you can clear the conversation after every stage and lose nothing.
- The tiers are one idea at four heights, each moving the check further from the model that wrote the code: Prototype (the builder checks itself), Alpha (the running application), Beta (tests continuously), GA (a different model plus a written record).
- Pick a tier by what being wrong would cost, not by how professional it sounds; and /develop may not invent a load-bearing decision and hide it in the implementation.

# L2 detail

- `#L1-L10` — framing: this Extra is what the pipeline map could not yet tell you.
- `#L11-L38` — table of work types and the minimal skill set each needs; tier and decision drive the choice.
- `#L39-L74` — artifact ownership table and why exactly one owner keeps the files trustworthy and editable.
- `#L75-L87` — state lives in files not the conversation, so fresh sessions and teammates continue from the repo.
- `#L88-L114` — the four tiers as the same idea at increasing distance from the author.
- `#L115-L133` — tracing "done" backwards, and the rule that /develop stops rather than hides a load-bearing decision.

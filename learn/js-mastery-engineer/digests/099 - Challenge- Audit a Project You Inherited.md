---
source: sources/js-mastery-engineer/20261107/supplement/099 - Challenge- Audit a Project You Inherited.txt
source_type: text
source_lines: 90
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The challenge is to run the workflow on an open-source repo you care about or the codebase you work in daily, ending with one small, safe, verified change you could genuinely ship.
- Workflow: run /audit to build the context files, then do the human pass — read the generated instructions against the actual source, run the recorded commands, and correct anything it misunderstood.
- Then pick one small useful change: /scope to plan, /architect in enhancement mode so it reads the current implementation, /develop so it follows the surrounding code, and /check verify to prove the new behaviour and confirm surrounding behaviour still works.
- Two difficulty options: for a single project run /audit at the root; for a monorepo run /audit at the root for shared rules and available workspaces, then again only inside the workspace you plan to change.
- Splitting the audit means you never load the whole monorepo into one context window: you load the shared root rules plus the detailed map for one workspace.
- The real test is not whether the agent can write code; the danger is a clean, convincing change that neither you nor the agent fully understands.
- Before shipping, answer four questions: what changed, why this was the correct place, that the new behaviour works, and that the surrounding behaviour did not break.
- AI amplifies the process you give it: a vague task with no context or verification creates mistakes faster than you can find them, while accurate instructions, a narrow change, clear decisions and real proof make it dependable.

# L2 detail

- `#L1-L8` — the challenge goal: one small, safe, verified change.
- `#L9-L30` — the workflow from /audit through /scope, /architect, /develop and /check verify.
- `#L31-L48` — the single-project and monorepo difficulty options.
- `#L49-L55` — why the monorepo audit is split and how to stay safe inside one workspace.
- `#L56-L71` — the real test and the warning about clean, convincing but ununderstood changes.
- `#L72-L90` — the four pre-ship questions and how AI amplifies the process you give it.

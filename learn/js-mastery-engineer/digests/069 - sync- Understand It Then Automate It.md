---
source: sources/js-mastery-engineer/20261107/supplement/069 - sync- Understand It Then Automate It.txt
source_type: text
source_lines: 80
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- /sync maintains root and nested AGENTS.md, scope checkboxes and feature state, and a spec's Status line only.
- It never touches a spec's decision, criteria or reasoning (/architect owns those), the implementation, or anything requiring a judgement call.
- Context vs policy: context is what happened in this change, policy is what should always happen; /sync writes policy only when the change shows enough of an area to justify it — all files newly added counts, even one modified file means the area predates the change and nothing is written.
- The evidence rule: it reads git file states, not just filenames, and treats added, changed and deleted differently; docs, tests, config, lockfiles and generated output are excluded, so a docs-only change produces no reconciliation.
- Scope boxes are ticked from the implementation, never from a commit message or a model's summary.
- Run it before every merge, after several features shipped quickly, and after work continued across cleared sessions; it is idempotent, so a second run on an unchanged project does nothing.
- Flags are deliberately pointed at rather than repaired, because contradictions and conflicts do not fix themselves.
- At higher tiers it reconciles more surfaces (verification, testing, review) and reports features built before their required decisions as still owed; it stays narrow on purpose so running it every merge is realistic.

# L2 detail

- `#L1-L22` — what /sync owns and what it never touches
- `#L23-L34` — context vs policy and the evidence threshold for writing policy
- `#L35-L47` — the evidence rule: git file states, exclusions, and ticking scope from the implementation
- `#L48-L55` — when to run it and why idempotence makes automation safe
- `#L56-L64` — acting on flags: it points rather than repairs
- `#L65-L69` — more surfaces reconciled at higher tiers
- `#L70-L80` — why it is narrow on purpose and how that restraint prevents generated-summary documentation

---
source: sources/js-mastery-engineer/20261107/supplement/064 - Reading a Spec- What the Build Sees and What You Keep.txt
source_type: text
source_lines: 162
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- A spec is a markdown file in `docs/specs/` with no special format to learn.
- Shape follows the size of the decision, not the project: default to a single file such as `docs/specs/0003-commentthreads.md`, and use a directory only for an umbrella of sub-decisions or a foundational decision read on every build.
- In a directory the folder carries the number and the top file is always `index.md` (never `0001-stack/0001-stack.md`).
- The key idea is the audience split: `index.md` holds what /develop reads (summary, acceptance criteria, decision, build plan), while `rationale.md` holds the argument /develop skips (context, options considered, rationale, references, consequences, follow-up).
- Status has two lifecycles: a feature spec goes Proposed → In Progress → Accepted, where Accepted means shipped; a standalone decision spec goes Proposed → Accepted on ratification; a spec documenting already-shipped work is born Accepted.
- An Assumed spec is written when /develop hits an undecided thing and you keep going; it has four minimal sections plus the git author, and it blocks done at every tier until /architect clears it.
- Reversed decisions are replaced, not edited: the old spec gets `Superseded by [NNNN]` and a link, so the reasoning stays readable.
- To read a spec fast, open `index.md`, read `## Summary` and `## Requirements`; go to `rationale.md` only to challenge the decision.

# L2 detail

- `#L1-L5` — intro: a spec is markdown in docs/specs/, worth five minutes to learn to read
- `#L6-L10` — two shapes and the rule that shape follows decision size
- `#L11-L44` — single-file vs directory shapes, the naming rule, and why the stack got a directory
- `#L45-L101` — the audience split between index.md (the decision) and rationale.md (the argument), and why it applies only to heavy specs
- `#L102-L121` — status lifecycles for feature specs, decision specs, and specs of already-shipped work
- `#L122-L144` — Assumed specs: four sections, git author, blocking done, and how /architect clears or corrects them
- `#L145-L151` — decisions are replaced not edited, with Superseded-by links that keep old reasoning
- `#L152-L159` — how to read any spec fast: Summary and Requirements first, rationale only to challenge
- `#L160-L162` — next: turning the plan and decision into a project

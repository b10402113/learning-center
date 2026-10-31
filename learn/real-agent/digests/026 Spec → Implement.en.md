---
source: sources/real-agent/20261030/Spec/026 Spec → Implement.en.srt
source_type: text
source_lines: 67
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- A finished Wayfinder map is raw decision history; it must be compressed into a spec before implementation.
- The chain is `/to-spec` (map in) → `/to-tickets` (spec in) → clear context → `/implement-spec`.
- The spec is the compression layer: it flattens the map into one artifact an agent can consume cheaply.
- Links are load-bearing: the spec points back to the map, and each ticket points back to the map and its prototype.
- Success criterion is a PR that works first time and can be QA'd, not a plausible-looking diff.

# L2 detail

- `#L1-L16` — Premise: the Wayfinder map is complete, so `/to-spec` is run with the map as input; tickets then come from the spec via `/to-tickets`.
- `#L17-L32` — Context is cleared before `/implement-spec`; stated end state is a spec implemented, PR'd to the repo, and ready to QA.
- `#L33-L44` — Expectation set: notifications work on the first attempt because the agent sees the whole map and the spec.
- `#L45-L60` — The linking discipline: spec links back to the map, tickets link back to map and prototypes, yielding an extremely detailed context.
- `#L61-L67` — Closing thesis: dense, linked context is what makes "it should just work" a reasonable bet; handoff to the solution.

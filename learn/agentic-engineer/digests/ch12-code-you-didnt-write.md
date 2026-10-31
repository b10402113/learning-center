---
source: sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write
source_type: text
source_lines: 1783
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
supplements:
  - code-jsm-skills-system.md#L1-L108
  - code-reel-agentic-skills.md#L1-L259

---

# L1 overview

- **Code You Didn't Write** — Most professional engineering is brownfield: you inherit a system someone else built, users depend on it, and its unwritten conventions are invisible to the agent. The failure mode is not weak models but a missing map, so the workflow runs `/audit` first to record stack, commands, conventions and boundaries, then uses `/scope` → `/architect` → `/develop` → `/check verify|review` so every change reads before it writes and proves existing behavior still works.
- **Two demos, one discipline** — On the BookWise library app (hand-written, 62+ source files, no AGENTS.md), `/audit` scans the repo and produces a root AGENTS.md plus nested ones only where an area has genuinely different rules, and hands skill/MCP risk calls back to the human. A first change to the return-a-book flow then touches four files because scope mapped the feature inventory, architect traced what already existed, and develop matched local patterns.

# L2 detail

- `#L1-L48` — `1. Nobody Starts from Scratch (9_11_2026 1：52：40 PM).txt` — Why real work is brownfield, why an agent without a map guesses and breaks unwritten rules, the two risks (what goes into the repo, what leaves the org), and the understand-then-touch order the rest of the workflow enforces.

- `#L1-L123` — `2. Demo Running audit on a Real Open-Source Project.srt` — Introducing BookWise: 140 file changes, source over two years old, no AGENTS.md existed then; the scenario is "someone hands you this codebase", so the map must come before any change.
- `#L124-L257` — `2. Demo Running audit on a Real Open-Source Project.srt` — `/audit` routes to its whole-repo phase for an established codebase (migrations, auth), asks whether to build agent skills and MCP servers, and dispatches a subagent so the main conversation keeps findings rather than every file it opened.
- `#L258-L498` — `2. Demo Running audit on a Real Open-Source Project.srt` — What audit writes and discovers: stack, daily commands, patterns, newcomer surprises; skills for Neon/Drizzle/AuthJS/Upstash; MCP candidates for Neon, Upstash, ImageKit; conflicting scanner risk ratings on an Auth.js package are surfaced and left to the human's judgment.
- `#L499-L785` — `2. Demo Running audit on a Real Open-Source Project.srt` — Reading the generated map against reality (stack, commands, conventions), the nested database and app AGENTS.md files with their own rules, the "only when the area genuinely needs it" restraint, monorepo variation, and the user's duty to verify before trusting the map.

- `#L1-L152` — `3. Demo Your First Change in Legacy Code.srt` — Same skills, different behavior on a non-empty repo: `/scope` reads the AGENTS.md map first, scans existing features into an inventory, asks which slice to plan (return/renewal), and writes `docs/scope.md` marking what exists versus what is planned.
- `#L153-L300` — `3. Demo Your First Change in Legacy Code.srt` — `/architect` reads how the feature works today, traces the request through files, checks dependents, then decides fit; scope already notes that most return-flow pieces exist, so the job is hooking them up rather than rebuilding with mismatched libraries.
- `#L301-L500` — `3. Demo Your First Change in Legacy Code.srt` — Requirements and the spec: minimal scope, no gratuitous rewrites, gradual replacement with old paths removed only when unused, explanation of migration and old-vs-new behavior when data or workflow is affected, and the rule never to delete odd code whose purpose is not obvious.
- `#L501-L720` — `3. Demo Your First Change in Legacy Code.srt` — `/develop` reads surrounding files before writing, copies local patterns for structure, errors, data access and tests, wires the return-book server action and admin menu, and can push deep scans into a read-only helper to keep the main session clean.
- `#L721-L949` — `3. Demo Your First Change in Legacy Code.srt` — Guardrails in practice: reuse utilities, follow naming and structure, stay inside the spec's boundary, search every reference before removing old code, keep unrelated cleanup out, separate pre-existing lint from new lint, then offer `/check verify` and `/check review`; the result touched four files, and the takeaway is to use as much process as the change deserves.

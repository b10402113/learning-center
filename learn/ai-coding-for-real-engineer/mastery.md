---
subject: ai-coding-for-real-engineer
created: 2026-10-01
updated: 2026-10-01
---

# Mastery — ai-coding-for-real-engineer

## Summary
Calibration data only — mastery never prunes content. Nodes built with skip-probe were not measured, so every strand is `unknown` and all steps are taught deep.

## Nodes

### kanban-backlog
- Status: unknown
- Notes: probe skipped via /nodes ai-coding-for-real-engineer/kanban-backlog skip-probe on 2026-10-01; teach every step deep.
- Strands:
  - PRD and plan stored as GitHub issues, one backlog for features and bugs — unknown
  - HITL vs AFK division by taste (planning and QA stay human) — unknown
  - Kanban dependency graph vs multi-phase plan — unknown
  - PRD-to-issues skill: vertical slices, blocked-by, HITL/AFK tags, final QA issue — unknown
  - Tracer-bullet check and merging thin slices — unknown
  - Running the AFK Ralph loop and feeding manual QA back as new issues — unknown
- Sources:
  - [[sources/ai-coding-for-real-engineer/20261001/lesson70.en.srt#lesson70]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson71.en.srt#lesson71]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson72.en.srt#lesson72]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson73.en.srt#lesson73]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson74.en.srt#lesson74]]

### afk-interactive
- Status: unknown
- Notes: probe skipped via /nodes ai-coding-for-real-engineer/afk-interactive skip-probe on 2026-10-01; teach every step deep.
- Strands:
  - Multi-phase plans need a human to choose "do phase N" (HITL) — unknown
  - "do phase N" is a for loop that can be automated — unknown
  - December 2025 inflection: models good enough for well-defined delegated tasks; Ralph / AFK agents — unknown
  - Sandcastle is agent- and sandbox-agnostic; interactive.ts vs main.ts — unknown
  - Start interactive with no sandbox to watch and optimize prompt.md before unattended use — unknown
  - prompt.md prompt expansion (! plus code block), cat, PRD/plan location args — unknown
  - Single-task discipline keeps the run inside the smart zone — unknown
  - First interactive run: permission requests, commit, tracer-bullet output — unknown
- Sources:
  - [[sources/ai-coding-for-real-engineer/20261001/lesson59.en.srt#lesson59]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson60.en.srt#lesson60]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson61.en.srt#lesson61]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson62.en.srt#lesson62]]

### issue-queue
- Status: unknown
- Notes: probe skipped via /nodes ai-coding-for-real-engineer/issue-queue skip-probe on 2026-10-01; teach every step deep.
- Strands:
  - Queue replaces a fixed plan/PRD: the agent selects the next task, not just executes one — unknown
  - Task-selection priority order: critical bug fixes → dev infrastructure → tracer bullets → polish/quick wins → refactors — unknown
  - Never churn commits onto a broken CI or app — unknown
  - Scaling to ~20–30 tasks and winnowing with labels/assignees (e.g. ready-for-agent) — unknown
  - Provisioning a private issue repo: local copy, delete git history, create a new repo owned by you — unknown
  - gh CLI as the LLM-to-GitHub interface; prompt expansion fetches open issues as JSON (number, title, body, comments) — unknown
  - Close/comment lifecycle after commit; comments as a running record pulled back into context — unknown
  - Injecting a PAT into the sandbox and scoping it to least privilege (read/comment/close, not create) — unknown
- Sources:
  - [[sources/ai-coding-for-real-engineer/20261001/lesson66.en.srt#lesson66]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson67.en.srt#lesson67]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson68.en.srt#lesson68]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson69.en.srt#lesson69]]

### research-cache
- Status: unknown
- Notes: probe skipped via /nodes ai-coding-for-real-engineer/research-cache skip-probe on 2026-10-01; teach every step deep.
- Strands:
  - Explore is the most expensive context phase; caching external docs into research.md shrinks it across repeated Ralph loops — unknown
  - Upfront research saves tokens and keeps the agent in the smart zone by not spending context on rediscovery — unknown
  - Research is human-in-the-loop because taste guides direction and which option is chosen — unknown
  - Not all tasks need research; growing codebases and precedent-less decisions benefit most — unknown
  - A good research doc holds requirements, recommended approach, implementation design, integration points, and alternatives considered (usable as an ADR) — unknown
  - Research lives as a local file in plans/ (not a GitHub issue) so the implementing AI can discover and reference it — unknown
  - Research files rot; audit them like steering files and delete them after QA when the decision is obsolete (git history preserves them) — unknown
  - For production, verify and investigate each service in depth rather than trusting the AI — unknown
- Sources:
  - [[sources/ai-coding-for-real-engineer/20261001/lesson75.en.srt#lesson75]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson76.en.srt#lesson76]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson77.en.srt#lesson77]]

### prototyping
- Status: unknown
- Notes: probe skipped via /nodes ai-coding-for-real-engineer/prototyping skip-probe on 2026-10-01; teach every step deep.
- Strands:
  - Prototype as a decades-old HITL technique that makes a plan concrete before the AFK loop runs — unknown
  - Imposing taste before implementation; research + prototype combine, prototype the options and feed the best into the PRD — unknown
  - Not useful for bug fixing (behavior known) or extending existing features; great when redesigning an entire system — unknown
  - Keep the prototype close and human-driven (do-work skill) rather than delegating it AFK — unknown
  - Prototype skill two branches: logic (tiny interactive terminal app stepping a data model through time with key presses) and UI (radically different variants on one route, switched by URL search param) — unknown
  - Scope the prototype to a throwaway dev-only route and produce a reusable local asset for the eventual implementer — unknown
  - Apply TDD and code standards so the later implementation copies production-ready code; export reusable components — unknown
  - Verify a service prototype end to end: Ably API key with right scopes in .env, presence updating in real time across two browser sessions — unknown
- Sources:
  - [[sources/ai-coding-for-real-engineer/20261001/lesson78.en.srt#lesson78]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson79.en.srt#lesson79]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson80.en.srt#lesson80]]
  - [[sources/ai-coding-for-real-engineer/20261001/lesson81.en.srt#lesson81]]

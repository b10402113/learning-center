---
source: sources/js-mastery-engineer/20261107/course/033 - Demo- Running -scope.en.txt
source_type: text
source_lines: 247
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Demonstrates the `scope` skill on a greenfield project, turning a one-sentence idea ("client feedback app with pinned comments on a live preview") into an ordered project plan.
- Shows how scope detects a greenfield repo, loads only the template it needs, and asks questions in small batches with recommended answers instead of leaving the user to design the product.
- Covers the three founding decisions scope forces up front: the MVP boundary, how a client accesses a shared project without an account, and whether billing is in scope.
- Explains the four build approaches (tracer bullet, skateboard, journey, facade) and why tracer bullet is recommended here: the risky part is a pin surviving the round trip from a framed page to the dashboard.
- Details the workflow/rigor tiers (prototype, alpha, beta, GA) and how each adds verification, tests, review, and documentation at increasing cost.
- Records the output in `docs/scope/scope.md` with foundations, thin threads, features, and current state; scope deliberately avoids library names because those belong to architecture.
- Explains how scope adapts: brownfield runs audit first, monorepos keep plans local, and re-running without arguments reconciles the plan against what actually shipped.
- Ends by handing off to the architect skill, since the stack and architecture are the largest unresolved technical decisions.

# L2 detail

- `#L1-L9` — Recaps what scope sets up (build approach and workflow tier) and how to launch an agent via CLI, VS Code, or any agentic system.
- `#L10-L34` — Opens a new project folder and runs scope with a single-sentence client feedback app idea; explains that more input yields better output.
- `#L35-L48` — Scope reads the greenfield signal and the scope template, then plans question rounds, inferring obvious entities like users, projects, previews, and comments.
- `#L49-L87` — First question round: choose the smallest MVP, what the client pins comments onto, how passwordless link access works, and whether billing is included.
- `#L88-L111` — Second round: multi-select capabilities (sign-in, notifications, live updates, image attachments), cross-cutting concerns, and default rigor tier.
- `#L112-L143` — Slicing decision: tracer bullet recommended because the pin round trip is the core risk; contrast with skateboard, journey, and facade approaches.
- `#L144-L157` — References question (declined for now), plus a warning that agentic development is non-deterministic so questions vary between runs.
- `#L158-L177` — Explains what each verification tier adds after develop: verify at alpha, test at beta, fresh-model review plus docs at GA.
- `#L178-L207` — Scope plan completes (10 features, 14 deferred, tracer bullet, beta tier), writes `docs/scope/scope.md`, and shows the plan avoids library names.
- `#L208-L243` — Scope's adaptability: brownfield needs an audit first, monorepo plans stay local, new features can be added, and rerunning without arguments reconciles state.
- `#L244-L247` — Closing recap and handoff: the project still needs a stack and framework, so the next skill is architect.

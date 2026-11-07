---
source: sources/js-mastery-engineer/20261107/course/027 - Workflow-First- Decide Before You Build.en.txt
source_type: text
source_lines: 49
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Gives highlights of the agentic engineering build, noting each skill gets its own full lesson later.
- The Scope skill receives the same app prompt but instead interviews the developer about MVP boundaries, audience, and what is explicitly out, then writes an ordered plan to a file with stack, data model, and design system before any feature.
- The Architect skill asks one question at a time with real options and a recommended pick instead of inventing choices; the $0.35 caching decision becomes a question on screen with trade-offs.
- The chosen answer becomes an acceptance criterion in a written spec in the repo, readable by the future self, the team, and the agent, which can be held to it.
- Develop builds what Architect planned and specified, leading the process while the developer remains in charge, and never invents undecided things.
- Check-verify launches the app and proves features against the spec's criteria with real requests, optionally using Playwright MCP for real browser testing.
- Review cross-verifies the spec with another agent, Test writes the test suite for what changed, and Sync records what shipped so the next session starts smart.
- The full flow is scope, architect, develop, check, test, sync — more steps than "please build me an app", with the payoff shown next lesson.

# L2 detail

- `#L1-L8` — Previews the build highlights and shows the Scope skill receiving the same movie app prompt.
- `#L9-L14` — Describes Scope interviewing for MVP boundary, audience, and exclusions, then writing an ordered plan with stack, data model, and design system first.
- `#L15-L28` — Describes Architect asking one question at a time with options and a recommendation, turning the caching decision into a recorded acceptance criterion in a repo spec.
- `#L29-L34` — Describes Develop building what Architect planned and spec'd while never inventing undecided things.
- `#L35-L38` — Describes Check-verify launching the app and proving features against spec criteria with real requests, plus optional Playwright MCP browser testing.
- `#L39-L42` — Describes Review cross-verifying the spec with another agent.
- `#L43-L46` — Describes Test writing the suite for what changed, Sync recording what shipped, and names the full scope-architect-develop-check-test-sync flow.
- `#L47-L49` — Sets up the next lesson's side-by-side code comparison.

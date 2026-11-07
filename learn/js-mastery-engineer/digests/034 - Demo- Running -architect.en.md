---
source: sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt
source_type: text
source_lines: 351
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Demonstrates the `architect` skill under its core rule: one load-bearing decision per run, examined and written down before code can depend on it.
- Shows architect starting a fresh session per skill, reading the scope, specs, AGENTS.md, and git state so it reserves user questions for what only the user can answer.
- Walks the interview rounds: app shape, framework, data platform, preview method, auth, ORM, hosting, API shape, client identity, share-link format, image upload, styling, validation, testing, rate limiting, package manager, migrations, and code organization.
- Highlights the mandatory offer of agent skills and MCP servers after a stack decision, and the pruning of bundled skills down to the relevant set.
- Explains the writing phase: architect reads its spec template and writes `specs/0001-stack-architecture/index.md` plus a `rationale.md` capturing context, options, evidence, and references.
- Covers the independent cross-check by a different model, whose reviewer checks completeness and soundness and surfaces gaps without silently patching decisions.
- Emphasizes separation of concerns: the index carries what the build must follow, the rationale preserves why the choice was made and is loaded only when needed.
- Notes this is the heaviest skill in the set (~150,000 tokens), justified for foundational choices but excessive for small edits.

# L2 detail

- `#L1-L9` — Frames the stack as the top unresolved decision and states architect's one-decision-per-run rule.
- `#L10-L19` — Starts a new session (relying on project memory, not chat history) and points architect at the stack decision.
- `#L20-L37` — Architect reads project files, scope, and specs, checks for AGENTS.md and git state to minimize the questions it must ask.
- `#L38-L63` — First question is about fetching references; explains sub-agent research and asks whether the build is a real product, teaching build, or both.
- `#L64-L73` — Reports the landscape check (Next.js 16, TanStack Start RC, BetterAuth 1.6, Drizzle nearing 1.0) and notes the researcher's self-imposed budget.
- `#L74-L91` — Round one: app shape, framework, data platform, and preview approach, with one recommendation and a clear reason each time.
- `#L92-L103` — Auth chosen as Supabase Auth, email/password sign-in, Drizzle ORM on the server, Vercel hosting, and the API shape decision.
- `#L104-L127` — Client identity, share-link security format, and image attachment upload via short-lived signed URLs; each round depends on the previous.
- `#L128-L145` — Rounds three and four: product-specific pieces, Tailwind plus shadcn styling, Zod validation, and Vitest vs Playwright testing tradeoffs.
- `#L146-L161` — Round five setup: pnpm, local-vs-real Supabase, DrizzleKit migrations, and route groups organized per audience.
- `#L162-L181` — Round six: password reset email plan, CI/CD deferral, and error monitoring deferred to platform logs.
- `#L182-L227` — Mandatory agent-skill and MCP offer: explains skills vs MCP, finds nine candidates, installs five official skills and three MCP servers, then prunes 20 bundled extras.
- `#L228-L253` — Reads writing rules on demand, writes the index and rationale specs, and offers an independent cross-check by another model.
- `#L254-L279` — Reviewer checks completeness and soundness, catches unset values and an incorrect row-level-security claim, and recommends values without patching silently.
- `#L280-L295` — Applies approved fixes as targeted spec edits; explains the separation that keeps the interview focused on reasoning rather than document structure.
- `#L296-L317` — Reviews the index summary and rationale, accepts the spec, and moves it to in progress.
- `#L318-L351` — Notes architect is the heaviest skill, records ~150k token spend, shows the updated scope, and hands off to develop.

---
source: agentic-engineer.16
source_type: text
source_lines: 3121
part: 16
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — agentic-engineer (part 16) — Greenfield: Scope Architecture Skills

## Overview (L1)
- Install the skill set — start the agentic engineering workflow by installing the skills package (`npx skills@latest add js-mastery-pro-skills`) into Claude Code and restarting the session; 9 skills available, installable per-project or globally.
- `/scope` the idea — pass a short prompt ("build me a movie recommendation app") and let the skill interview you to produce a detailed `scope.md`, driving MVP line, app shape, recommendation-engine smartness, monetization, scope cuts, cross-cutting concerns, and constraints.
- Reject features is the real architecting — deciding what NOT to build matters more than what you add; scope choices shape everything downstream.
- `/architect` the stack — choose build approach (tracer bullet / skateboard / journey / facade), then answer multi-round questions on framework, database, ORM, auth, LLM SDK/models, embeddings, host, background jobs, storage, caching, styling, validation, testing, authorization, quotas, env vars, and movie provider.
- Agent skills + MCP servers — after choosing the stack, the workflow finds and installs the right agent skills and MCP servers (Supabase, Vercel, Playwright) so the build follows real conventions and can inspect the live system.
- Cross-check the spec — use a second model to critique the foundational spec; it found 6 real gaps (RLS backstop, pooler prepared statements, over-claimed Supabase email, etc.); apply fixes only on approval.
- Clear between units — after the spec is on disk, run `clear` (or open a new window) to start fresh; the conversation stops costing tokens while all decisions persist in files; then run `/develop` stack and architecture.

## Sections (L2)
### install-skills
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#install-skills]]`
- Summary: The workflow begins by opening a new Claude Code window (CLI or VS Code extension) and installing the skill set from the GitHub repo's installation section. The install command pulls a package and prompts which skills to add and where.
- Key claims: The whole agentic engineering workflow starts with installing the skills package; you can install within the project or globally across all projects; a restart is required to gain access; verify with `/` + skill name.
- Learner-relevant: Concrete command is `npx skills@latest add js-mastery-pro-skills` (spoken as "MPX skills at latest, add JS mastery pro skills"); 9 skills total; install into Claude Code instantly.

### scope-the-idea
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#scope-the-idea]]`
- Summary: Run `/scope` with a short description; the skill reads `plan.md`, detects a greenfield project (working folder only holds an unrelated demo, no scope yet), and interviews you to build a detailed specification. Answers can be brief but shape the whole product.
- Key claims: `/scope` interviews you toward a detailed spec `scope.md`; deciding what NOT to build matters more than what you add; the questions are cheap for the agent to ask and cheap for you to answer, but the thinking is what makes you the architect; references section (with web-verified links) is optional and only needed for enterprise-grade specs.
- Learner-relevant: Example prompt "build me a movie recommendation app"; MVP line answered as "onboard, then feed with reasons" (sign in, one onboarding path, CSV import or swipe, personalized feed where each pick carries a short reason, vibe search right after); app shape = web app + marketing site for SEO; engine = taste profile + LLM for reasons (no training); monetization = no billing yet; extra capabilities: watchlist/save/seen/hide in scope, full catalog browse/search and social follow deferred; cross-cutting concerns: SEO for marketing pages yes, analytics/error monitoring/accessibility/privacy/cookies later; constraints: none, build it properly.

### choose-build-approach
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#choose-build-approach]]`
- Summary: `/scope` asks how the work should be sliced and sequenced, offering the most popular software-building approaches. The choice determines which extra instruction file the agent reads next.
- Key claims: Tracer bullet = every feature built as a thin vertical slice working end to end through storage, logic, and screen before the next one starts, so nothing sits half-wired; skateboard = ship the thinnest usable whole product first then thicken it (fast to users, costs rework); journey = each phase completes one whole user path start to finish (good when the funnel is the product); facade = show something visually first, make it production ready later; process rigor ("medium" recommended) is a separate question.
- Learner-relevant: Chosen approach = tracer bullet because there's no deadline and the recommendation loop only proves itself once it runs on real data end to end; selecting it made the agent read `tracerbullet.md` (34 lines) from the `.agents` folder — it only reads that file after you select it.

### architect-stack-interview
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#architect-stack-interview]]`
- Summary: The first of 11 build parts is stack and architecture. Run `/architect` stack and architecture; it reads the scope and asks multi-round questions. It can spin up parallel web searches so greenfield picks aren't stale, then writes a specification document as the source of truth.
- Key claims: A greenfield stack pick goes stale fastest and agents' knowledge has a cutoff, so web fetches (extra tokens) are worth it; the "what is the build for" answer changes almost every later recommendation; the architect skill writes a decision spec (with `index.md` carrying summary/decision/proposed stack/consequences/follow-up and a `rationale.md` with web-verified references) but no build plan, since scaffold steps belong to the develop skill; run context is kept hygienic with `clear` between units and `compact` mid-unit.
- Learner-relevant: Chosen stack = single fullstack Next.js app (Next.js 16 app router + TypeScript); database = Supabase Postgres (regular tables + pgvector + file upload); ORM = Drizzle (overtook Prisma for new TS projects); auth = Supabase Auth; LLM calls via Vercel AI SDK (provider-agnostic), model = Sonnet 5 for harder vibe queries and Haiku for quick reasons; embeddings = OpenAI Text Embeddings 3 Small (Anthropic offers no embedding model, so a second provider is required); similarity = embed each movie once from synopsis/genres/crew, store vector next to the movie row, neighbors via HNSW index; host = Vercel; background jobs = Inngest (free tier covers scale; reliability separates demo from product); CSV upload = Supabase storage; cache = Postgres + Next.js caching; styling = Tailwind v4 + shadcn/ui; single app with PNPM; validation = Zod; testing = Vitest + Playwright; authorization = server actions gate + RLS backstop; quotas = per-user usage table (counts per account per day); env vars validated with Zod at startup; movie provider = TMDB (free, synopses/genres/cast/crew/posters, Letterboxd exports map to TMDB IDs).

### agent-skills-and-mcp
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#agent-skills-and-mcp]]`
- Summary: After the stack is chosen, the workflow offers to find the agent skills and MCP servers for that exact stack. Agent skills teach the agent real conventions; MCP servers give live access to the real system. The workflow proposed a core set to install and flagged risk levels.
- Key claims: Both skills and MCP servers are optional and usually make the build better; MCP servers let the agent check the real system (e.g. Supabase database) rather than assume; the agent flagged the Playwright CLI as high risk (from `allowed-tools: playwright-cli, Bash, npx` broad pre-authorizations) and several others medium; Playwright MCP does the same job without that grant, so the CLI was removed.
- Learner-relevant: Stack matched against Next.js, Supabase, Drizzle, Tailwind, shadcn/ui, AI SDK, Inngest, Zod, Playwright, Vercel; core skills: Supabase agent skills + Postgres best practices (must-have), Vercel React best practices, shadcn/ui, Vercel AI SDK, supporting skills (Inngest durable functions, Playwright CLI, Tailwind v4 docs, Drizzle patterns); chosen MCP servers: Supabase (highest value), Vercel (deploy status/build logs), Playwright (drive a real browser for Check/Verify); install via `npx skills@latest add ...` (9 skills installed one by one); remove Playwright CLI with `npx skills remove playwright-cli`; add MCPs via `claude mcp add supabase` (must run in a real interactive terminal, not through the agent).

### spec-cross-check
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#spec-cross-check]]`
- Summary: The workflow asks whether to cross-check the spec using a second model before reviewing it. A different model can catch what the writer is blind to; its main job is decision completeness — finding calls the build would otherwise have to invent. Fixes are applied only if found and approved.
- Key claims: A foundational gap here propagates through all 11 features, so the cross-check is strongly recommended; run took ~17 seconds and returned a verdict that it is not yet safe to build on; fixes change reasoning, not just add detail, so they matter.
- Learner-relevant: Six findings — (1) RLS backstop does not work: Supabase policies key off `auth.uid()` from a JWT the Supabase client sets per request, but a direct Drizzle connection sets no such claims so `auth.uid()` is null and policies are inert; fix = keep RLS enabled but deny-by-default policies (public anon key reads nothing; app connects server-side); (2) pooling rule is half a rule: Supabase transaction pooler does not support server-side prepared statements and the Postgres driver prepares by default, throwing "prepared statement already exists" under concurrent load; fix = `prepare: false`; (3) session wiring asserted but never named; (4) Supabase built-in email sender is not production-grade (its default is rate-limited and explicitly not for production, so the stated justification for Supabase Auth was over-claimed; fix = add custom SMTP Resend as a stack row); (5) Inngest database connections never addressed; (6) vector distance metric unnamed; the learner accepted all six; the final spec decisions are recorded in the stack/architecture spec, decisions, `rationale.md` (four full stack options with real cons/ rationale/ web-verified references), and the scope's architectural rules (e.g. "application is the only gate on user data"; nothing over a few seconds runs in a request, it goes to Inngest functions; Supabase Auth and Drizzle seam — users live in Supabase's auth schema while app tables live in Drizzle migrations carrying FKs to auth.users).

### clear-context-and-continue
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/1. Scope Architecture Skills.srt#clear-context-and-continue]]`
- Summary: With the spec on disk, run `clear` (or open a new window) to start a fresh session; nothing is lost because all choices persist in files. This is the token-hygiene payoff of the workflow. Then the next task is `/develop` stack and architecture.
- Key claims: This long conversation stops costing tokens immediately yet every choice remains in the spec file; the workflow warns you to clear before running develop (it refuses otherwise); always `clear` between units and features, `compact` mid-unit if a run gets long; if lost, open `docs/scope` to see which of the 11 features you're on.
- Learner-relevant: Mode used for the agent: auto with medium effort, thinking on, switch models, flagged messages on, default model at recording = Opus 5 (workflow matters more than the model); spend shown = `claude max plan`, 6% of 5-hour limit and 1% of weekly limit, 14% of usage at higher context, 17% from the architect skill, ~162,000 tokens on Opus 5; node/feature map has 11 parts (stack & architecture, coding standards & tooling, data model, movie catalog & cache, design system & UI foundation, then slices); next step = run `clear`, then `/develop` stack and architecture to scaffold from the decision spec.

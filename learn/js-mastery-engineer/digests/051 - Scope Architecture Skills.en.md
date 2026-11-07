---
source: sources/js-mastery-engineer/20261107/course/051 - Scope Architecture Skills.en.txt
source_type: text
source_lines: 519
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The module walks the full agentic engineering loop on a real project — a movie recommendation app that learns taste from a Letterboxd CSV export or swipe onboarding and explains each pick in one sentence, with vibe search by mood.
- Installing the skills comes first (`npx skills add jsmastery-pro-skills`, project or global), then `/scope` interviews the user: MVP line, platform, recommendation intelligence, monetization, extra capabilities, feedback loop, cross-cutting concerns, constraints, slicing approach, process tier, and references.
- Scope decisions: both onboarding paths plus feed in the MVP, vibe search in the first release, web app plus marketing site, taste profile plus an LLM for reasons (no trained recommender), no billing, watchlist in, catalog search/social/email out, tracer-bullet slicing, medium process tier, no references section.
- The scope becomes 11 parts, foundations first: stack and architecture, coding standards and tooling, data model, movie catalog and cache, design system and UI foundation, then feature slices.
- `/architect stack and architecture` runs a long decision interview (build purpose, scale, framework, database, ORM, auth, model routing, similarity, hosting, background jobs, CSV storage, caching, styling, validation, testing, authorization, quotas, env validation, TMDB) with web-verified options for a greenfield pick.
- Chosen stack: one Next.js 16 App Router TypeScript app, Supabase Postgres with pgvector and HNSW, Drizzle, Supabase Auth, Vercel AI SDK with Sonnet for vibe queries and Haiku for reasons, OpenAI text-embedding-3-small, InGest background jobs, Vercel hosting, Tailwind v4 + shadcn, Zod, Vitest/Playwright, server-action gate plus RLS backstop, per-user model quotas, TMDB.
- A second model cross-checks the spec and finds six load-bearing gaps (inert RLS over a direct Drizzle connection, pooler prepared statements, non-production Supabase email sender, unaddressed InGest connections, unnamed distance metric); all six are applied.
- The spec, rationale, architecture rules, consequences (including the Supabase Auth/Drizzle seam), and follow-ups are written to disk, the three MCP servers are connected, and the session is cleared after about 162k tokens.

# L2 detail

- `#L1-L24` — Introduces the movie recommendation idea, the critique of Letterboxd/IMDb recommendations, and installing the JSM skills package.
- `#L25-L42` — Runs `/scope` with a short prompt, sees greenfield detection, and answers the MVP question (onboarding plus feed, vibe search in first release).
- `#L43-L56` — Chooses both onboarding paths, describes vibe search, and picks a web app plus marketing site.
- `#L57-L74` — Weighs recommendation-engine options, settles on taste profile plus LLM-written reasons, and rules out billing for now.
- `#L75-L91` — Decides extra capabilities (watchlist in; catalog search, social, email later) and discusses why deciding what not to build matters.
- `#L92-L113` — Settles the feedback loop, cross-cutting concerns (SEO only for now), and constraints (none: build it properly).
- `#L114-L140` — Compares tracer bullet, skateboard, journey, and facade approaches, chooses tracer bullet, medium rigor, and no references section.
- `#L141-L160` — Reads the written scope: product summary, tracer-bullet approach, develop/check/test workflow, architect gate, and the 11-part build.
- `#L161-L176` — Frames the first decision (stack and architecture), explains context hygiene (clear between units), and starts architect.
- `#L177-L201` — Describes agent modes, then watches architect read the scope and design-conversation files and ask about references and build purpose.
- `#L202-L231` — Answers course-demo vs real-product framing, scale (hundreds to low thousands), and sees parallel web research on Drizzle/Prisma, Neon/Supabase/pgvector, and the Vercel AI SDK.
- `#L232-L256` — Picks a single full-stack Next.js app, Next 16 App Router, Supabase Postgres, Drizzle, and Supabase Auth.
- `#L257-L280` — Chooses Sonnet/Haiku model routing, pgvector embeddings with HNSW, Vercel hosting, InGest jobs, Supabase Storage for CSV, and Postgres plus Next caching.
- `#L281-L317` — Settles Tailwind v4/shadcn, Zod, Vitest/Playwright, the server-action gate plus RLS backstop, per-user quotas, env validation, and TMDB as the provider.
- `#L318-L340` — Explains the embeddings-provider gap (Anthropic has none), chooses OpenAI text-embedding-3-small, and defines agent skills vs MCP servers.
- `#L341-L363` — Reviews discovered skills (Supabase, React, shadcn, AI SDK, InGest, Playwright, Tailwind, Drizzle), picks Supabase/Vercel/Playwright MCPs, installs, and notes risk flags.
- `#L364-L390` — Sees the decision spec and rationale files, then accepts the cross-check offer so a second model audits the foundational spec.
- `#L391-L427` — Reviews the cross-check findings: inert RLS via direct Drizzle connection, pooler prepared statements, Supabase email sender limits, unaddressed InGest connections, and unnamed vector metric.
- `#L428-L444` — Applies all six findings and summarizes the final stack decision.
- `#L445-L475` — Walks the spec, decisions, rationale, architecture rules, security, consequences (auth/drizzle seam), and follow-ups; then starts connecting MCPs and removing the Playwright CLI.
- `#L476-L501` — Explains the Playwright skill's broad pre-authorization, removes it, adds Supabase/Vercel/Playwright MCPs, and clears the session.
- `#L502-L519` — Reports token/usage cost (~162k tokens, 6% of the 5-hour limit) and hands off to `develop stack and architecture`.

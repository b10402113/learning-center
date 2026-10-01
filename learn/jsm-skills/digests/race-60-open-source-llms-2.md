---
source: race-60-open-source-llms-2
source_type: text
source_lines: 1860
part: 2
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — Race 60+ Free Open Source LLMs (part 2)

## Overview (L1)

- The build-along finishes wiring the foundation and moves through features 1–4 of the LLM Arena app: security (Arcjet), data (Prisma), coding standards/tooling, data model, and design/app shell.
- Arcjet is installed agentically via its own skill prompt plus a "guard protection" skill; the agent asks a rate-limit keying question and picks "require signin on API chat," then adds keys, site, and SDK.
- Prisma is set up manually (account, project, plugin, npm commands, `env.local`, migrate/generate) and the client is instantiated in `lib/prisma.ts`.
- Feature 1 is verified end-to-end (real prompt reaches a real model via an OpenRouter curl, Clerk/Arcjet/PostHog checked); token-per-second honesty is decided as output tokens ÷ (finish − request-start).
- Teaching aside: context degradation (18 models, a 200k window measurably degrades at 50k) → clear the session and start fresh. Feature 2 adds coding standards + ESLint/husky/lint-staged; feature 3 designs the Prisma data model; feature 4 invokes the frontend-design plugin for typography and builds the design proof + app shell. Two PRs are opened and Greptile scores the shell PR 4/5.

## Structure (L2)

### Arcjet install: decisions vs guards, rate-limit keying, CLI login

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#31:36]]`
- Summary: Conceptual setup for Arcjet. An older half makes request-time decisions (SDK `protect`); a newer half called "guards" runs the same rules where there is no request — inside a tool handler, a queue consumer, or a workflow step. The agent installs Arcjet by pasting a prompt into a new Claude window that adds the Arcjet skill on top of MPX skills plus a "guard protection" skill. The add-guard-protection skill name doesn't exist in the repo but the agent infers intent, detects the SDK baseline (Node, from "2414"), and returns a plan touching the POST API chat call across named files.
- Key claims: The agent surfaces a real fork — rate limiting needs an identity to key on, but Clerk currently protects no routes so signed-out visitors can hit `/api/chat`. Options offered: user ID when signed in + IP when not, or require sign-in on `/api/chat`. The learner picks "require signin on API chat" (matching later app behavior). Installation then requires `npx @arcjet/cli@latest login` — a browser window confirms a terminal code, then "Login successful, credentials saved."
- Learner-relevant: A worked example of the "recommend one option, engineer decides" rule — the agent raises a load-bearing security decision and waits. Also concrete evidence of agents interpreting an imperfect skill name.

### Arcjet site/key + Prisma setup + `lib/prisma.ts`

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#34:01]]`
- Summary: The agent creates a new "LLM arena" Arcjet site, installs dependencies, appends the real Arcjet key, and confirms it shows in `.env.local`. In parallel the learner sets up Prisma: new account/project, "LLM Arena" project, skip to dashboard, copy the Prisma agent plugin and `npx plugins add prisma-plugin`, then "connect your database → setup by framework → Next.js" to get install commands and env. After `prisma init` reports the `prisma/` folder already exists (Claude Code created it during initial setup), they run `prisma migrate dev` + `npx prisma generate`. The DB syncs with the schema and injects env from `env.local`.
- Key claims: A `lib/prisma.ts` file is created at root with pasted code; it initially can't find the Prisma client, which the agent will wire during the database-focused feature. Arcjet is confirmed live on `/api/chat`, verified against the real service, with ENVs added. The Arcjet dashboard shows the requests/smoke tests, including hits that correctly tripped a rate limit.
- Learner-relevant: Concrete install/tooling sequence (plugin add, migrate dev, generate) and the pattern of accepting a transient import error because a later agent pass owns it.

### Verification pass, token-speed decision, feature 1 done; context-degradation aside

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#38:00]]`
- Summary: The learner reopens the original Claude session and tells it all env/tools are set up. The agent checks repo state and creates to-dos: apply the first Prisma migration to the real DB, confirm a real prompt reaches a real model, confirm Clerk/Arcjet/PostHog behavior, update the scope. It notes the migration was already done (learner was a step ahead). It flags that tokens-per-second was producing "dishonest numbers" and asks how to compute it; the learner chooses output tokens ÷ (finish − request start), which never produces absurd values and is comparable across streaming and buffering providers. Scope is updated "done and verified end to end."
- Key claims: The agent ran a real curl to OpenRouter and got a streamed model response back — proving the wiring; only UI + database remain. Arcjet's bot detection denies curl before the token bucket (so it must be tested in a real browser). No PostHog event has yet been confirmed landing in the dashboard ("script loads and initializes, but nothing has landed"), parked for later. Teaching aside: research across 18 models showed every one degrades as tokens increase; a 200k-token window can measurably degrade at 50k, so clear the session and start fresh even with room left.
- Learner-relevant: The metric-definition decision is a reusable lesson about honest benchmarking. The context-degradation claim is a cited teaching anchor for context management.

### Feature 2 kickoff, PR/commit via agent, Greptile auto-skip

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#41:30]]`
- Summary: With 112 uncommitted changes, the learner opens a PR through the agent rather than manually (`git add/commit/push`). The agent produces a better-documented commit ("wire the app to a model: OpenRouter, Prisma, Clerk, PostHog, and Arcjet") and confirms no environment variables leaked into `.env.example`. The PR shows ~15,000 changes across 112 files (mostly agent skills) with a generated description. Greptile skips the review because there were too many files; the learner agrees, since the work is mostly configuration, and merges.
- Key claims: Agent-driven commits yield richer metadata that Greptile may use even though it does its own research. The learner distinguishes config-heavy PRs (fine to merge without review) from future business-logic PRs (worth reviewing). Example skill: the agent as a commit/PR assistant, with the human deciding to merge.
- Learner-relevant: Practical PR hygiene for agentic work and a rule of thumb for when a code review is worth spending.

### Feature 2 built: coding standards, linter vs review split, pre-commit hook

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#45:19]]`
- Summary: The agent asks how heavy the pre-commit hook should be; the learner approves lint/prettier/eslint, and the plan uses husky + lint-staged + prettier + eslint --fix on staged files only. Feature 2 is built with every rule "probe tested rather than assumed." Outputs: the official coding-standards doc, conventions split into what the linter enforces vs what only review can, an ESLint config, public env config infrastructure, and a `pnpm lint` command — all linked from CLAUDE.md so agents can find it.
- Key claims: The coding-standards file is "the plan," and it keeps two parts honest: tooling (prettier, pre-commit hook) vs conventions enforced only by the linter. Its purpose is consistency so multiple parallel agent chats read as one developer on one team. This framing ("this is how a real modern company workflow looks") is explicitly the lesson payoff.
- Learner-relevant: A template for encoding standards so independent agent sessions converge — directly useful for a repo whose AI agents write all content.

### Feature 3: the data model (turn fan-out, model-agnostic responses, votes)

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#49:00]]`
- Summary: The agent reads the scope and proposes the schema: User, Thread, Turn, ModelResponse, plus Vote on Turn. The unit is a turn, not a flat message — one turn holds the user's prompt once and fans out to one model response per model. Because many models can be chosen from OpenRouter's free-tier catalog, there is no Model table; the model ID is just a string on the response. The agent asks how "a vote only exists once two or more models answered" should be enforced; the learner picks in-app logic inside a transaction, not a DB constraint. The agent extends the Prisma schema, migrates, confirms tables, type-checks/lints/formats, passes a production build, and removes the temporary verification route.
- Key claims: Vote hangs off a Turn (not a message), which is what makes "voted on by comparison" expressible at all. ModelResponse records failures, not just successes. The data model is called the app's most important feature because mistakes force migrations and broad code changes. Teaching aside contrasts agentic engineering (does typecheck/lint/verify/build from the first try) with year-old vibe coding (agent wrote 1–2 files, you fixed the breakage).
- Learner-relevant: A concrete schema-design rationale (fan-out turn, failure rows, no model table) and the recurring "surface the fork, let the engineer decide" pattern.

### Feature 4: design/look — typography, frontend-design plugin, proof page

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#52:00]]`
- Summary: The frontend-design skill must be invoked before any design code. The agent reads the scope, three sketches, global CSS, and stack, and asks one question: typography (the single thing that determines the look). The learner picks the warm/editorial recommendation over the modern fonts. The agent then asks to install the `frontend-design` plugin for Claude Code (`plugins install frontend-design`, user scope, reload), reads it, and builds feature 4. The dev server runs on port 3000 showing a design-proof page: type scale, control states, response cards, dark mode, leaderboard, failure states.
- Key claims: The proof page's acceptance criterion is qualitative — "does the rust button ever sink into the brown behind it? Look at it in both themes," toggle, reload, tab through controls. The learner's reaction: warm editorial feel is exactly wanted, and dark mode works. This is the first real frontend build, deliberately outside the VS Code/Claude/terminal loop.
- Learner-relevant: A reusable technique — render a design-proof page and manually inspect theme interaction before building the real UI; typography as the highest-leverage look decision.

### App shell: route shape, placeholders, sidebar; commit + Greptile 4/5 review

- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#56:10]]`
- Summary: The learner asks the agent to build the app shell UI (feature 7 scope) using placeholder content where a real feature is missing (live model catalog, real streaming, persisting a vote), deferring real logic to features 5–7. One fork is flagged as hard to change: thread URL shape. The sketch's breadcrumb ("arena / thread one") hints at nesting, but feature 8 public sharing makes every thread a link; the learner chooses `/arena/thread/[id]` (own URL) over everything under `/arena`. The agent builds the homepage route for the arena, the `/thread/[id]` route plus leaderboard and models, a hand-written sidebar (not pulled from shadcn), and a standing strip in the top bar as the shell signature. 46 files change; the learner opens a PR (single commit, since `package.json`/lockfile span features 2–4 and can't be split meaningfully). Greptile reviews and scores 4/5.
- Key claims: Greptile's two suggestions: P1 — `castVote` (lines 71–91) lets concurrent votes bypass the already-voted guard and throw a raw Prisma error because Prisma defaults to read-committed isolation; two racing requests can both read `turn.vote == null`; fix by try/catch on P2025 for the turn ID returning a refusal. P2 — using the first 24 chars of paragraph text as a React key is fragile. The learner copies the review comment into a new chat and has the agent validate and fix both. Greptile's summary includes an ERD (User: id, clerkId, datetime → owns Thread → Turn → ModelResponse; Turn voted on) and deems it "safe to merge for a foundational shell PR; nothing user-facing yet; every placeholder labeled with its replacement feature."
- Learner-relevant: Routes as a load-bearing early decision (public sharing dependency), placeholders labeled by replacing feature as an incrementality discipline, and a worked example of feeding a bot code review back into the agent to validate/fix rather than auto-applying.

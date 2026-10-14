---
source: agentic-engineer.17
source_type: text
source_lines: 1470
part: 17
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — agentic-engineer (part 17) — Greenfield: Stack Tooling

## Overview (L1)
- Scaffolding the project — the "develop the stack and architecture" step takes the spec (spec 0001) as a scaffold subtask and creates the first files, using Next.js 16 with Turbopack by default, pnpm, and a scratchpad-then-move-in flow.
- Env keys and runnable scaffold — the agent generates an `.env` example (Supabase database/direct URLs, Anthropic and OpenAI API keys, TMDB API key, ingest keys, Resend email key), then checks the build and fetches the homepage for a 200.
- Standards capture via audit — audit is a standards capture (not a codebase scan) for a greenfield/single-package repo; it records architecture style (functional), folder split (by feature), lint/format choice (Biome), testing convention, pre-commit checks, and Git handling into `AGENTS.md`/`CLAUDE.md`.
- Tooling enforcement — `develop tooling` installs Biome plus a Lefthook pre-commit hook and mechanically enforces named architecture rules (e.g. a raw-DB-handle import ban); the agent then reconciles spec drift with `/scope` and `/sync`.
- Test-suite reversal and ownership safety — the learner drops test suites and the Playwright CLI, replacing test protection with scoped query helpers so user-owned reads/writes go through one function.
- GitHub push — after the architecture/stack and tooling features are done, the project is pushed to a new GitHub repo (remote origin added, `main` and feature branches pushed).
- Handoff to the data model — data model is the next (huge) feature touching all core entities: users, movies, ratings, taste profiles, feed pics with reasons, watchlist entries, and import runs.

## Sections (L2)
### scaffold-stack-architecture
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#scaffold-stack-architecture]]`
- Summary: The learner runs "develop the stack and architecture" on the spec document (spec 0001 records the stack). The agent builds a flow to create the first-ever application files, checks the scaffolding tool's real flags before running (no Git repo yet, so no freshness checks), and scaffolds into a scratchpad first because the project route already holds docs/agents files.
- Key claims: This is a `scaffold` subtask whose job is creating the project; Next.js 16 with Turbopack is used by default; the scaffold is created in a scratchpad then moved in because the tool refuses to overwrite the docs/agents route; the agent immediately creates the example env file so required variables are known early.
- Learner-relevant: Supports the greenfield startup stage — it fixes the initial framework/toolchain (Next.js 16, Turbopack) and surfaces required secrets up front so they can be gathered while the agent keeps working.

### env-keys-and-verification
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#env-keys-and-verification]]`
- Summary: The example env file lists the variables the app will need: the database URL and direct URL from Supabase (plus more Supabase values), Anthropic and OpenAI API keys, a TMDB API key, ingest keys for background jobs, and a Resend API key for emails. After scaffolding, the agent checks that the build passes and tries to run the server and fetch the homepage, getting a 200.
- Key claims: Getting the keys while the agent develops is useful because they'll be needed sooner or later; the scaffold is verified by running the server and confirming a 200 on the homepage; the generated file/folder structure includes app, components, DB, jobs, a library for Supabase, and the server.
- Learner-relevant: Shows the required third-party accounts/keys for the movie recommendation app and the verification loop (build + run + fetch homepage) that proves the scaffold is runnable before moving on.

### audit-standards-capture
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#audit-standards-capture]]`
- Summary: Running audit confirms a greenfield workflow case — a new project, so it is a standards capture rather than a codebase scan of a single-package monorepo. It interviews the learner for architecture style, folder organization, coding standards, linting, pre-commit behavior, testing conventions, CI, and Git handling, then writes `AGENTS.md` (and `CLAUDE.md` as a pointer).
- Key claims: Architecture style chosen is functional programming (plain functions, immutable data) rather than clean architecture, DDD, or OOP; folders are split by feature, not by layer; extra standards added include named exports only, one error-handling pattern, accessibility, and documented public functions; linting uses Biome (linting + formatting in one config) over ESLint + Prettier; pre-commit runs lint, format, and type check; Git is handled automatically (branch and commit per feature).
- Learner-relevant: Defines the project's durable conventions written into `AGENTS.md` — the rules the agent will follow for every later feature; note the greenfield/standards-capture mode distinction versus a code-based scan.

### testing-decision-and-ownership
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#testing-decision-and-ownership]]`
- Summary: The learner chooses no test suites and only type check plus manual verification, contradicting both an earlier statement and the spec. The agent pushes back, asking what protects ownership scoping (e.g. a forgotten `where user ID` in one server action exposing another person's rating history). The learner picks scoped query helpers — a single function every read and write of user-owned data goes through.
- Key claims: Testing conventions option chosen is type check + manual verify only (no unit/integration suites, no TDD); the conflict with the spec is reconciliation (spec 1 open follow-ups) before tooling proceeds; scoped query helpers substitute for test protection of ownership; the scoped query helper is deferred into feature three.
- Learner-relevant: Captures an explicit tradeoff — dropping tests in exchange for a mechanical ownership-safety mechanism; useful when deciding what guards correctness when tests are absent.

### tooling-enforcement
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#tooling-enforcement]]`
- Summary: `develop tooling` installs Biome and a pre-commit hook. Because `AGENTS.md` requires lint/format/type check before each commit but nothing enforces it, the agent adds a Lefthook (`lefthook.yaml`) stage file; it also immediately adds the Biome rule banning raw DB-handle imports outside the `source/lib DB` and `source DB` paths.
- Key claims: Lefthook (a stage-file filtering tool) is chosen over Husky for the pre-commit hook; the raw DB import restriction goes live the moment the data-model feature creates the DB handle; after tooling, `AGENTS.md` still lists only install/dev/build/type check, so `/sync` and `/scope` must reconcile the new commands; scope/architecture/`AGENTS.md` end up with the same information.
- Learner-relevant: Shows the enforcement layer that turns documented standards into mechanical checks — the concrete tools being Biome (lint+format), Lefthook (pre-commit), and import-restriction rules tied to spec-named paths.

### git-and-github-push
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#git-and-github-push]]`
- Summary: The workflow initializes a Git repo and handles Git out of the box, branching and committing per feature automatically. After features one and two (architecture/stack and coding tools) are done, the learner creates a new empty GitHub repo (github.com/new, named for the agentic engineering workflow) and asks the agent to push.
- Key claims: The first commit captures the scaffold, docs, installed skills, and the new `AGENTS.md` to give a clean diff baseline; Git handled automatically includes raising the remote origin and pushing `main` plus the feature branch; the agent offers to open a PR, which the learner opens/merges manually after reviewing the code.
- Learner-relevant: Demonstrates the version-control automation and how a greenfield project lands on GitHub with a feature branch for coding standards tooling, ready for review and merge.

### skills-and-context-management
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#skills-and-context-management]]`
- Summary: Audit reports that eight agent skills are already installed and identifies gaps with no skills yet — Drizzle, Zod, Vitest, Resend, TMDB — then searches for and installs them (installing Resend, declining non-official/community ones and Vitest). As work proceeds the context window grows, so the learner runs `/clear` before each next feature (e.g. at ~130k tokens before architecting the data model).
- Key claims: Agent skills teach the agent tools/real conventions, so spending time up front is worthwhile; only official skills are installed; the context is cleared between features to keep working cleanly; the flow uses `/architect`, `/scope`, `/sync`, `/clear` and `develop tooling` as recurring commands.
- Learner-relevant: Establishes the skills-first setup and the context-hygiene habit (`/clear` per feature) that keeps the agent effective across the build.

### data-model-handoff
- Locator: `[[sources/agentic-engineer/20261014/13. Idea to First Ship — Greenfield/2. Stack Tooling.srt#data-model-handoff]]`
- Summary: With the first two features fully done and pushed, the next feature is architecting the data model — described as the most important part, touching all core entities. Its open follow-ups include the scoped query helper and the Supabase region (confirm the project region and match Vercel).
- Key claims: Core entities are users, movies, ratings, taste profiles, feed pics with their reasons, watchlist entries, and import runs; deferred items include error tracking (analytics/error monitoring) and custom SMTP (feature six), plus error tracking should be decided before launch rather than after a first silent failure; the data model is feature three.
- Learner-relevant: Names the domain schema the whole app stands on and the deferred follow-ups, framing what the next stage will build.

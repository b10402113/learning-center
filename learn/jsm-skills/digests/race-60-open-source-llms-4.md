---
source: race-60-open-source-llms-4
source_type: text
source_lines: 1855
part: 4
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — Race 60+ Free Open Source LLMs (part 4)

## Overview (L1)

- The final stretch of the build-along: hardening the app with Arcjet, shipping the real leaderboard, adding PostHog analytics, and deploying.
- Covers three PR-style tool integrations run as agent prompts: Arcjet (security), PostHog (product analytics), and Vercel MCP (deployment), each audited by the agent before implementation.
- Feature 9 (real leaderboard from votes) is implemented and tested with fresh open-source models.
- Greptile does a final PR review (5/5, 7 PRs reviewed, 5 bugs caught), then the app is merged and deployed to production.
- A production redirect bug (router.push + router.refresh race) is diagnosed and fixed live.
- Closes with reflection on agentic engineering and a challenge: add a feature and wire Clerk billing into a subscription SaaS.

## Structure (L2)

### T-Rex review filtering and Arcjet MCP security scope
- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:33:45]]`
- Summary: Wraps up the T-Rex (Greptile) GitHub integration by filtering which PRs get auto-reviewed, then shifts the lesson to security. The agent installs the Arcjet MCP (`claude mcp add arcjet`) so it can test the app directly. The new public thread-sharing route is identified as an unauthenticated surface.
- Key claims: T-Rex reviews can be filtered by repositories, branches, labels, keywords, or files changed; the newly shipped public read route hits the DB on every page load and can be abused (10,000 requests, scraping thread IDs); read-only is not the same as safe, and the authenticated chat route was never protected either, just harder to find.
- Learner-relevant: Anchors a lesson on threat-modeling a feature the moment it is shipped — a new URL changes the app's security surface even if the code "works".

### Arcjet skill audit, recommendations, and thread protection
- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:35:37]]`
- Summary: A single Arcjet skill prompt has the agent read its own scope and recommend or rule out each Arcjet feature against the specific codebase before writing code. It reports what is already in place (memoized base client turning on Shield app-wide, chat route bot-denial and rate limiting keyed to Clerk user IDs) and identifies the gap: the thread page is a React Server Component, not a route handler, so request-based `protect` cannot see a request — only the proxy with Clerk middleware can.
- Key claims: Recommended: Shield (already house default), bot detection, and rate limiting (token bucket or fixed/sliding window) keyed differently than chat; ruled out: prompt injection detection, sensitive info/email detection, and filter rules, because the route only reads a thread ID and returns stored data. Implemented by adding a guard in `proxy.ts` and updating scopes; two prompts protected the app.
- Learner-relevant: Lesson could anchor on "the security layer is one prompt" for agentic builds, and on choosing where a guard can physically live (proxy vs. RSC page) — constraints, then features.

### Feature 9 — real leaderboard
- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:40:25]]`
- Summary: Implements feature 9, replacing dummy leaderboard data with a real query. Ledger updates its own to-dos: write the standings DB query, update the leaderboard screen to accept the rows, and update the page for search params to call the query. The query lives in `features/leaderboard/leaderboard-standings.ts`, server-only, reading the infrastructure DB directly, grouped by model joined from votes, averaging over completed answers (no cost column yet), ranked by win rate descending. A toggle shows real votes vs. the default leaderboard.
- Key claims: In testing, the "pneumatron" model won 80% (4/5) despite taking longest to answer; win rate alone is misleading, so count (e.g. 1/1 = 100% vs 4/5 = 80%) plus average time-to-first-token and average tokens/second matter; everything follows from decisions features 3, 7, and 8 already made — no forks.
- Learner-relevant: Lesson on deriving a real aggregate query from a data model, and on why a single win-rate number needs sample size and latency context to be meaningful.

### PostHog audit — what to track, what to skip
- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:43:08]]`
- Summary: Instead of building a custom analytics dashboard (a week of work plus a marketing hire), the workflow uses PostHog. An agent prompt asks which PostHog features are already present, what is tracked, and what is worth adding given the app's actual loop (send prompt → stream → vote → share). It recommends implementing four items and skipping the rest.
- Key claims: Add: thread visibility changed (the only real gap — no way to know how many threads get shared), public thread viewed, adblocker proxying (ad blockers strip direct post traffic), and autocapture for unhandled client exceptions. Skip: feature flags, group analytics, and surveys. The funnel dashboard insight should be built manually in PostHog rather than in code.
- Learner-relevant: Anchors a lesson on analytics as product instrumentation — tracking the real funnel (share → view → signup) is what separates a hobby project from a product people use.

### Model testing and the PostHog dashboard
- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:46:22]]`
- Summary: Tests the app with entirely new models (Lagona extra small, Inclusion AI Ling 3.0 flash, North Mini Code) on playful and serious prompts. Fun prompt "write the git commit message for the worst thing you've ever shipped to production" produces funny responses (leaked dev password, debug email blasting receipts for 3 days) and a clear winner. A serious prompt asks for a TypeScript debounce that cancels in-flight calls; GPT-OSS wins. Then PostHog's activity view and AI chat build a custom dashboard.
- Key claims: PostHog's AI chat can answer schema-level questions the app was never instrumented for — e.g. "do people who open a shared thread ever sign up?" — by recognizing `.t...` paths as shared thread URLs and chaining `identify` into a funnel (3 opened, 1 signed up, 2 dropped). It then builds daily prompts sent, daily active users, prompt→vote funnel, votes by model, average response time by model, and tokens used into one drag-and-drop dashboard.
- Learner-relevant: Lesson on using AI-driven analytics to validate the product thesis with no bespoke dashboard, and on reading model-quality tradeoffs (tokens vs. latency vs. answer quality) from real metrics.

### Final Greptile review and Vercel deployment
- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:55:27]]`
- Summary: Commits, pushes, and opens a PR implementing feature 9 and closing the thread security/analytics gaps. Greptile reviews it (5/5): across the repo, 7 PRs reviewed with 5 bugs caught, all meaningful user-facing issues rather than nitpicks. Meanwhile a new chat with the Vercel MCP connected deploys the project on a single agent command.
- Key claims: Deploy links the project, uploads env vars, and triggers production. First load shows a server error: `DATABASE_URL` is not present — the env value is Postgres but wrapped in double-quoted strings, which the Zod validation rejects; saving without the quotes and redeploying fixes it. T-Rex logs note it blocked the leaderboard navigation during review due to the Clerk dummy environment, so UI elements could not be validated, but the sequence diagram was sufficient.
- Learner-relevant: Lesson on end-to-end agentic deploy and on a real-world env-var parsing bug (quoted secrets breaking schema validation) — a concrete production failure mode.

### Post-deploy bug hunt and closing reflections
- Locator: `[[sources/jsm-skills/20261001/Race 60+ Free Open Source LLMs _ Build and Deploy the App Yourself.srt#01:59:37]]`
- Summary: The deployed app is tested live; a bug appears — running a prompt stays on the homepage and a new thread only shows after reload, and one model (of the racing models) failed to respond. The redirect bug is fixed: in the arena screen on a new thread, `router.push` fires immediately followed by an unawaited `router.refresh`, which in production refetches the RSC tree for the wrong route and snaps the client back to `/`. Reflecting, the host notes the app grew from one written idea and a sketch, Greptile gave good reviews (including catching missing response metrics), every tool solved a real problem rather than being a sponsor, and issues an optional challenge.
- Key claims: One model failing to respond is expected and isolated (its issue, not the app's), with a "try again" affordance; a subscription SaaS requires Clerk billing plus one more genuinely wanted feature; meetups/final thoughts tie agentic engineering to thinking for yourself rather than copy-paste tutorial hell.
- Learner-relevant: Closes a lesson on production debugging from live symptoms to root cause, and on the difference between a portfolio project and a subscription product (billing + real instrumentation).

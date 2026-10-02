---
source: How to Build Real Mobile Apps with Claude - FULL COURSE
source_type: text
source_lines: 11194
part: 3
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Claude - FULL COURSE (part 3)

## Overview (L1)

- Finishing onboarding & plan generation — Wraps up the onboarding survey (weekly goal, aggressive/classic diet) and kicks off an OpenAI-backed background call to compute plan values, then moves to the auth page.
- Clerk authentication setup — Creates a Clerk application, picks Google + Apple sign-in (Apple is mandatory if Google is present or App Store review rejects the build), selects the Expo quick start, writes the publishable key env var, and installs Clerk AI skills for agent context.
- Building & testing the auth UI — Prompts Claude to render themed Google/Apple buttons at the end of onboarding, verifies sign-up/sign-in in the simulator, confirms the user appears in the Clerk dashboard, adds the Google icon, and round-trips sign out/sign in.
- Committing changes — Ignores the `.env` file in `.gitignore` so secrets stay out of GitHub, recaps the plan → UI design → feature → build → self-check workflow, mentions an AI code reviewer (CodeRabbit, optional), and commits/pushes to the repo.
- The database-sync problem & webhooks — Clerk holds the user but the Postgres database is empty; introduces webhooks as automated event messages and subscribes to `user.created`, `user.updated`, `user.deleted` to mirror users into the DB automatically.
- Clerk webhook endpoint + ngrok — Adds an endpoint in the Clerk dashboard; since local dev only has localhost, uses ngrok's free domain to expose the local API, and reasons through the dashboard via screenshots to Claude instead of guessing.
- API route & webhook signing secret — Creates the endpoint at `app/api/webhooks/clerk`, copies the Clerk signing secret into the env file, and runs a dedicated ngrok terminal alongside Expo (with a third reserved for trigger.dev).
- Database setup with Neon + Drizzle — Adds the Neon Postgres connection string as `DATABASE_URL`, has Claude initialize the DB with Drizzle ORM from `plan.md` (users + meals tables), reviews `schema.ts`, `index.ts`, `drizzle.config.ts`, and the `db:generate`/`db:migrate` loop.
- Trigger.dev background jobs — Explains why webhook handlers need retries (DB slow/down, first-run failures) and installs the Trigger.dev skills (getting started, realtime, frontend) to write 5–10-line task methods.
- Implementing webhook tasks with Trigger.dev — Creates `trigger.config.ts` with the project ID, sets Expo `app.json` to `server` for API routes, writes three ~60-line task methods (user created/updated/deleted) using trigger's `task` API, and verifies tasks in the dashboard.
- End-to-end testing & trigger secret key — Deletes the Clerk user, signs up fresh, confirms the user lands in both Clerk and Postgres, fixes the missed trigger.dev terminal, and grabs the trigger secret key from the dashboard API keys.

## Sections (L2)

### Finishing onboarding and launching the plan background job

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Completes the onboarding flow — accepting the "not the best UI" screen, setting a weekly goal (1 kg/week, aggressive but fine) and a classic diet — then starts a background job that fetches plan values with OpenAI and routes the user onward to authentication.
- Key claims: Onboarding state feeds a background computation; plan values are produced by an OpenAI call, not locally.
- Learner-relevant: Anchors the pattern of deferring expensive computation to a background job while the UI advances.

### Clerk authentication setup (Google + Apple, Expo quick start, skills)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Creates a Clerk application, enables Google and Apple sign-in, explains that offering Google without Apple triggers App Store rejection, omits email auth, selects the Expo SDK quick start, pastes the `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` into `.env`, and installs Clerk AI skills so the agent has current docs.
- Key claims: Google sign-in requires Apple sign-in for App Store approval; Clerk AI skills give the agent up-to-date documentation; skills are reusable modular instructions for multi-step agent workflows.
- Learner-relevant: A concrete auth-provider checklist plus the skill-installation workflow reused later for Trigger.dev.

### Building and testing the authentication UI

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Prompts Claude to place themed Google/Apple buttons at the end of onboarding and implement real sign-in with Clerk, then manually tests: sign-up, verify the user in the Clerk dashboard, sign out, sign in again, and add the Google icon beside "Continue with Google."
- Key claims: Manual simulator verification is the self-check after each feature; auth is confirmed by the user appearing in the Clerk users list.
- Learner-relevant: Demonstrates the feature → manual test → polish cycle before committing.

### Committing changes and protecting secrets

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Adds `.env`/`.env.local` to `.gitignore` before committing, recaps the workflow (plan → UI design → feature breakdown → build → self-check), mentions an optional AI code reviewer (CodeRabbit, 14-day free trial, not sponsored), then stages, commits, and syncs changes to GitHub.
- Key claims: Secrets must never be pushed to GitHub; a code-review pass belongs before opening a PR.
- Learner-relevant: Covers the secrets-hygiene step and the commit/push habit that closes each feature section.

### The database-sync problem and webhooks

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Identifies that Clerk has the signed-up user but the Postgres database is empty, then introduces webhooks as automated messages sent on events (`user.created`, `user.updated`, `user.deleted`). Clerk stores the user for auth and fires an event; the app listens, matches the event name, and mirrors the user into the DB.
- Key claims: Auth users and app data are separate stores that must be synced; webhooks make the sync automatic and scalable (can't copy 10,000 users by hand); separate handlers are needed per event type.
- Learner-relevant: The core architectural justification for webhooks and event handlers.

### Clerk webhook endpoint and ngrok tunnel

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Adds an endpoint under Clerk's Configure → Developers → Webhooks, discovers it needs a deployed URL, and uses ngrok (free domain) to bridge Clerk's servers to the local machine during development. Selects all user events, then screenshots the Clerk and ngrok dashboards to Claude with explicit context instead of guessing.
- Key claims: A localhost URL will not work for a webhook endpoint; ngrok fakes a public URL that forwards to localhost; screenshots plus described intent beat letting the AI guess.
- Learner-relevant: Teaches the local-webhook-development pattern and the "screenshot + context" debugging habit.

### Creating the API route and storing the signing secret

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Creates the webhook route at `app/api/webhooks/clerk/api.ts`, uses the ngrok domain plus `/api/webhooks/clerk` as the Clerk endpoint URL, copies the generated Clerk signing secret into the env file, and runs the ngrok tunnel in a second terminal (Expo is the first; trigger.dev will be a third).
- Key claims: The webhook signing secret authenticates events; ngrok must stay running alongside Expo; the endpoint URL combines the ngrok domain with the route path.
- Learner-relevant: The concrete wiring of a signature-verified webhook receiver.

### Database setup with Neon and Drizzle

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Pastes the Neon Postgres connection string into `DATABASE_URL`, then has Claude initialize the database with Drizzle ORM using `plan.md` for the data model. Reviews `schema.ts` (users + meals tables, with meal image URL, owning user ID, and analysis status), `index.ts` (exports schema + DB instance), and `drizzle.config.ts` (Postgres, schema/out paths, casing, env var), then confirms migrations created both tables.
- Key claims: The migration loop is edit `schema.ts` → `db:generate` → `db:migrate`; hand-writing schemas is obsolete — describe in detail and let the agent build it.
- Learner-relevant: A complete ORM setup and migration workflow for a Postgres app.

### Trigger.dev background jobs and skill installation

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Explains that webhook methods can fail (DB slow or down) and need automatic retries, which Trigger.dev provides as managed infrastructure; you write 5–10 lines per method and it retries until success. Installs the Trigger.dev skills via its terminal command, selecting Claude and the getting-started, realtime, and frontend skills.
- Key claims: Trigger.dev supplies the retry/durability infrastructure for background webhook jobs; the skill installer supports multiple agent CLIs; a "cost savings" skill even exists.
- Learner-relevant: The reliability rationale and setup for background job infrastructure.

### Implementing the webhook tasks with Trigger.dev

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Creates `trigger.config.ts` with the project ID (from the dashboard command), switches Expo `app.json` build output to `server` to enable API routes, and produces three ~60-line task methods — user created, updated, deleted — using the trigger `task` API plus the Clerk signature-verification file. Tasks appear in the Trigger.dev dashboard matching their ids and run successfully.
- Key claims: Expo API routes require `app.json` set to `server`; each webhook event maps to its own trigger task; the Clerk API file verifies the event signature so events are genuine.
- Learner-relevant: A full worked example of event → task → DB mutation with verification.

### End-to-end testing and the trigger secret key

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Deletes the Clerk user and signs up again to confirm the user is created in both Clerk and Postgres; discovers the DB row is missing because the trigger.dev terminal wasn't running, starts it via the command Claude provides, and copies the trigger secret key from the dashboard's API keys into `.env`.
- Key claims: The trigger.dev dev process must be running for tasks to execute; a missing env secret (trigger key) breaks the pipeline; end-to-end verification requires checking both stores.
- Learner-relevant: Debugging method — when the DB sync fails, check whether the background worker is running and whether its env key is set.

## Sources

- `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]` — lines 3801–5700, timestamps ~01:05:14–01:38:17.

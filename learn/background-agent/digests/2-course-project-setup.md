---
source: sources/background-agent/20261105/2-course-project-setup.vtt
source_type: text
source_lines: 700
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L692-L811
  - server.md#L1007-L1034
  - service.md#L1-L221
---

# L1 overview

- Repo and env bootstrap — check out the `lesson-one` branch, `npm install`, copy `.env.example` to `.env`; the course needs a Postgres database but deliberately not a local install.
- Database via Neon — `neon.new` → "try it in a browser" hands you a free Postgres connection string to paste into `.env` (unclaimed instances expire in ~72h); local Postgres is allowed, but the instructor avoids Windows support issues.
- OpenAI key — create a secret key on the platform (name, project, expiration) and fund the account; a couple of dollars is plenty and `gpt-4o` suffices — no o1-class model needed; Claude API is usable via the same AI SDK by swapping the model id.
- Schema push and preflight — `npm run db:push` (Drizzle) pushes the project schema to Neon; `npm run preflight` verifies Node, a synced schema, and an OpenAI key, added because bad setup instructions previously broke students.
- Seed and the three processes — `npm run db:seed` loads starter data, then the day runs three things: the agent API (currently a near-empty route — the thing being built), the web dashboard, and the mock checkout service.
- Run commands and Inngest — `npm run dev:agent` (agent API + Inngest), `npm run dev` (web app + Inngest dev server and its URL), `npm run dev:checkout` (the fake service, not needed yet); Inngest is deferred to the durable-execution lesson.
- Fault-injection flags and branch workflow — the checkout service accepts fault type, alert count, interval, and self-recover flags for building demo incidents; live coding happens on the current branch with the solution on the next lesson's branch, which the instructor jumps to directly (notes contain the exact diffs) and students may either carry their code forward or catch up by checkout/notes.

# L2 detail

- `#L1-L105` — Setup start: check out the `lesson-one` branch, `npm install`, and copy the provided `.env.example` into your own `.env`; then the database discussion — no local install, no account, no credit card, because `neon.new`'s browser flow yields a free Postgres connection string (unclaimed instances vanish in ~72 hours, and he notes they appear to be sunsetting it in favor of claimable Neon); local Postgres is fine too, but he avoids it for fear of unhelpable Windows problems.
- `#L106-L272` — The OpenAI API key: platform → API keys → create secret key (name, optional project, expiration — he picks one day), fund the account with the minimum (a couple of dollars covers the day), "we're not boiling water" so `gpt-4o` or a small local model is fine; he confirms the display model should go in the env config; answers a student's question that the Claude API works unchanged except swapping the model name, since the AI SDK is provider-agnostic.
- `#L273-L408` — Migrations and a safety check: `npm run db:push` pushes the schema (his output says "no changes detected" only because he already pushed — students will see something else); `npm run preflight` then verifies Node.js is installed, the schema is synced, and an OpenAI key exists — he added it explicitly because past bad instructions left students unable to run anything, and the check tells them whether they can even do the course.
- `#L409-L470` — `npm run db:seed` seeds the starter data (he accepts that it wipes his existing data); then he frames what will be running: the agent endpoint, which today is just an API route / regular handler that "does almost nothing" and is the main thing the day turns into an agent, the web app, and the mock checkout service.
- `#L471-L570` — Command-by-command walkthrough, all also visible in `package.json`: `npm run dev:agent` starts the agent API and brings up Inngest (used only to handle events passing between the mock checkout service and the agent); `npm run dev` starts the web app *and* the Inngest dev server and prints the URL you open; `npm run dev:checkout` runs the fake service — not needed yet because nothing is built to talk to it.
- `#L571-L630` — The checkout service CLI flags for generating incidents: fault type, number of alerts, interval, and whether it should self-recover — the exact mechanism he used for the demo incidents; these become the way to test the agent later (what it does after recovery, what it does for a dependency-related fault), and are unused for now.
- `#L631-L700` — Branch/flow mechanics and how to catch up: he live-codes on the branch they're on and then checks straight out to `lesson-two` for the solution (not carrying his code, because he walked backwards through every diff into the notes, so the two should be identical); students may instead keep their own code and continue, and anyone who falls behind can check out the next branch or ask a coding agent to apply the notes.

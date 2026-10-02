---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 5
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 5)

## Overview (L1)

- Building remaining UI screens from design images — Uses generated design mockups (appointments, profile detail) as references and has Claude build each screen, iterating with a screenshot-vs-design comparison loop until identical.
- Code review and pull requests with CodeRabbit — Explains PRs and branching conceptually, then walks through creating a branch, publishing it, opening a PR, and using CodeRabbit to review ~13,000 lines of code, categorize changes, fix issues via suggested agent prompts, and merge.
- Expo Observe for post-launch performance — Introduces Expo's new observability tool for tracking real-world app metrics (startup, JS load, first screen, interactivity) across devices and network conditions.
- Backend foundations: Next.js pages and API routes — Uses plan.md as source of truth to build the Next.js web pages and API routes, database, and core business logic, including obtaining an OpenAI API key for the AI assistant.
- Database schema and seed data — Schema file defines Postgres tables (users, patients, medical histories, dentists, services) via Drizzle; a seed file populates test data and a demo account.
- Syncing Clerk users to the database via webhooks — Explains the user-not-in-DB problem and webhooks as event-driven messages, then sets up a Clerk webhook endpoint (user events) tunneled through ngrok for local development.

## Sections (L2)

### Building remaining UI screens from design references

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The instructor generates upscaled design images in GPT for the appointments and profile detail screens, attaches them to Claude as references, and instructs it to build each screen and self-iterate by screenshotting the simulator and comparing against the design until identical. Claude builds the appointment screen (partially working), personal details, medical history, and notification screens, then stops when told.
- Key claims: Attaching a design image and instructing "build this screen" is understood by default; an agentic loop of screenshot-and-compare can converge on a design; built screens are still hard-coded with no real data at this stage.
- Learner-relevant: Anchors the workflow of turning design mockups into working UI screens and the self-verification loop used before wiring real data.

### Code review via pull requests and CodeRabbit

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: A conceptual walkthrough of pull requests — branching off main, committing features, and merging back rather than committing directly to production, including multi-teammate branching. In VS Code the instructor creates a branch, stages and commits with an AI-generated message, publishes it, and opens a PR on GitHub. CodeRabbit reviews ~13,000 lines across 128 files in ~10 minutes, producing a summary, a file-by-file walkthrough, prioritized inline critical comments, an organized Change Stack with ~12 categories, a chat-with-PR agent tab, and unit-test/docstring/multi-step-fix generation. Issues are fixed by copying CodeRabbit's suggested agent prompt into Claude and committing; the PR is then merged and the master branch synced.
- Key claims: The current differentiator is not writing code but reviewing it; CodeRabbit prioritizes critical severity comments as inline comments when volume is high; its Change Stack categorizes changes alphabetically which git platforms like GitHub/GitLab do not do well; a free CodeRabbit VS Code extension mirrors the dashboard.
- Learner-relevant: Supports a real-world code-review and PR workflow, and the pattern of delegating review-fix prompts back to the AI agent.

### Expo Observe for post-launch observability

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Expo's newly introduced Observe tracks how an app performs after shipping to real users, measuring app open time, JavaScript load time, time to first screen, and time until interactive. Because it lives in the same Expo/EAS ecosystem, it shows performance changes over time across devices, OSes, and network conditions.
- Key claims: Behavior that feels fine on a developer's own phone can differ across thousands of users and devices; Observe can show a regression (e.g., a new update slowing startup) as a change over time; further detail is in a linked article.
- Learner-relevant: Anchors the concept of production performance monitoring and why real-user observability matters beyond local testing.

### Backend foundations: Next.js pages and API routes

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: After finishing the mobile UI, the instructor asks Claude (pointing to plan.md as source of truth) to build the Next.js web pages and API routes, set up the backend foundations including database and core business logic, and ensure the backend supports the mobile app with real data. Decisions: keep the calendar implementation simple, do not implement mobile video calling yet, build the AI assistant API, keep the dashboard lean, and add an OpenAI API key to the web .env (obtained from platform.openai.com; ~$5 credit, or Gemini as an alternative).
- Key claims: plan.md acts as the source of truth driving the build order; the AI assistant backend needs an OpenAI API key supplied via env; backend runs via `npm run web` which starts the Next.js application.
- Learner-relevant: Supports the transition from hard-coded UI to a real backend and the practice of scoping MVP features explicitly.

### Database schema and seed data

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Under web/src/database, index.ts creates the DB connection instance and validates the database URL env var (crashing the app if missing). schema.ts defines Postgres tables using the pg table method (e.g., users with id, clerk id, email, role fields; plus patients, medical histories, dentists, services), and seed.ts inserts test data such as services, dentist accounts, patients, and a demo user. The instructor verifies the generated tables and test data in the database dashboard.
- Key claims: Schema files are now AI-generated in seconds rather than typed by hand; seeds create test data and accounts so the app has data before real users exist; a demo account was seeded under users.
- Learner-relevant: Anchors the schema/seed workflow and how AI accelerates database scaffolding while remaining verifiable.

### Syncing Clerk users to the database via webhooks

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: A user exists in the Clerk dashboard but not in the app's users table; webhooks solve this by copying the user into the database on auth events. Webhooks are explained as automated messages sent when something happens (e.g., user.created, user.updated, user.deleted). Setup: create a Clerk webhook endpoint (subscribe to user events), obtain a forwarding URL/token via ngrok since the app runs on localhost, run `npm run web`, run the ngrok command with the token, and paste the ngrok URL into the Clerk endpoint; the instructor also shows querying Claude for step-by-step, non-overexplained instructions.
- Key claims: Webhooks bridge Clerk identity events into the app's own database; ngrok is a free way to expose a localhost endpoint for the Clerk webhook during local development; the webhook endpoint must subscribe to the relevant user events.
- Learner-relevant: Anchors event-driven sync between an auth provider and app database, plus local tunneling as a development practice.

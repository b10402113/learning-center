---
source: How to Build Real Mobile Apps with Claude - FULL COURSE
source_type: text
source_lines: 11194
part: 1
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to Build Real Mobile Apps with Claude - FULL COURSE (part 1)

## Overview (L1)

- Course intro & Cal AI demo — the instructor clones Cal AI (a calorie tracker making $6M/month) and shows the finished end result: onboarding → AI-generated calorie targets → sign-in → home/food-scan/profile tabs, calendar, streak, meal photo scanning via OpenAI, plus Apple-mandated privacy policy, terms, delete-account, and a Sentry feedback button.
- Course scope, workflow & tech stack — the video is a playbook, not a VIP coding tutorial; the workflow is plan → generate UI → build feature-by-feature with self-test and AI code review → commit; stack is React Native + Expo, Clerk (auth), Neon Postgres, trigger.dev (AI agents/background jobs), ImageKit (images), Sentry (monitoring), OpenAI for analysis.
- Environment setup, Claude in VS Code & the build loop — requires Node.js and the Claude Code VS Code extension (Opus 5 chosen over "Fable 5" for token cost); the described loop is: build a screen, test in simulator/phone, ask AI for a code review, commit on success, repeat until no features remain.
- Plan mode prompt & describing the project — paste an interview-style plan-mode prompt so the AI never guesses; describe the Cal AI clone (meal photo → AI macros, onboarding for age/height/weight/goal, auth, home with food history, camera screen, profile) and the chosen stack, then have Claude produce a `plan.md` before any Expo scaffold.
- Setting up external services — create accounts for trigger.dev (AI agents, long-running (10–15s) failure-prone image analysis, real-time hooks, auto-retries), Neon (free cloud Postgres), ImageKit (keys + endpoint, SDKs), and Sentry (error tracking, $80 free credits).
- Answering Claude's planning question batches — the instructor works through grouped batches: AI computes calorie targets, onboarding-before-auth order, direct-to-ImageKit upload, manual macro correction, home-screen contents (macro bars, date strip, meal list, streak), per-user timezone, and optimistic camera card.

## Sections (L2)

### Course intro & Cal AI clone demo

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The instructor built his own version of Cal AI (a calorie tracker reportedly making $6M/month) and published it to the App Store in 14 days, landing his first customer 5 days after launch; this course builds a simplified clone. The end-result demo walks onboarding (gender, birthday, height, weight, goal, aggressiveness, diet), AI-generated daily calorie targets, sign-in, and the signed-in UI with home / food-scan / profile screens.
- Key claims: Onboarding data is sent to OpenAI to compute personalized daily targets; the meal scanner uploads a photo to OpenAI (or any AI platform) which returns calories, protein, carbs, and fat and appends the meal to the home log; the app cannot show the camera in the simulator but works on a real phone, and gallery images work in the simulator.
- Learner-relevant: Anchors the "what we are building" target and the end-to-end user flow the whole course reproduces.

### Course scope, workflow & tech stack overview

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Pitched as a playbook (not "yet another VIP coding tutorial") for turning ideas into real apps with AI, with AI-influencer marketing at the end. Defines the workflow diagram: (1) plan/describe the project — idea, goals, features, screens, user flow, tech stack; (2) generate UI designs with AI prompts; (3) build features screen-by-screen, self-testing in the simulator/phone, then asking AI for a code review, committing when the feature completes, and looping on issues until all features are done. Stack: React Native + Expo (one codebase for iOS and Android), Clerk (auth), Neon-hosted Postgres, trigger.dev (AI agents/background jobs + retries), OpenAI, ImageKit (image storage/optimization), Sentry (error tracking + AI code review).
- Key claims: Expo/React Native is "one of the best ways to build a mobile app as of 2026"; privacy policy and terms pages are mandatory or Apple rejects the app; delete-account is not optional; if you offer Google sign-in you must also offer Apple sign-in or Apple rejects it.
- Learner-relevant: Gives the reusable build loop and the concrete free-tier toolchain before any code is written, plus App Store review compliance rules.

### Environment setup, Claude in VS Code & the build loop

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Start from an empty folder in VS Code. Node.js must be installed (download from nodejs.org, defaults). The instructor uses Claude (opencode note: "Claude Code") via the VS Code extension (desktop app or terminal also work; any agent — Codex, Cursor, Antigravity, Windsurf — is fine), selects Opus 5 as the model, and talks to it by voice or text. The feature loop is restated: build with AI, test in simulator or on the phone, ask the AI to review, commit and move on, or rerun the loop on problems.
- Key claims: Coding by hand is "extremely slow" and no longer the norm; "Fable 5" may be better than Opus 5 but consumes far more tokens; the Claude Code extension must be installed and logged into before the button appears in VS Code.
- Learner-relevant: Establishes the minimal editor/agent environment and the test → review → commit loop that every later feature follows.

### Plan mode prompt & describing the project

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Step 1 of the workflow. Paste a "plan mode" prompt that instructs the AI to interview the learner in small batches (three to six questions at a time, grouped by topic) so it never guesses and both sides stay aligned. The instructor then describes the Cal AI clone — meal photo sent to OpenAI which analyzes calories/protein/fat/carbs, personalized via onboarding (age, height, weight, cut vs. gain), plus an auth screen, home with food history, a camera screen, and a profile screen where info is editable. Tech stack restated (Clerk with Google and Apple, Neon Postgres, trigger.dev, Sentry, ImageKit), and the instruction to create a `plan.md` at the end without initializing the Expo project yet.
- Key claims: The plan-mode prompt is essential — the AI must not guess features; the instructor fixes a typo ("expo" vs "expo") and renames the clone "Cal AI"; actual project screens are auth, onboarding, camera, home, and profile.
- Learner-relevant: The central planning discipline — a reusable interview-driven prompt whose output, `plan.md`, seeds UI generation and the feature breakdown.

### Setting up external services (trigger.dev, Neon, ImageKit, Sentry)

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: Set up the tools before answering Claude's questions. trigger.dev is "the main engine of this project" — a TypeScript platform for AI agents and workflows: because meal analysis takes 10–15 seconds and can fail halfway, it cannot run inside a mobile request cycle; trigger.dev runs agents on its infrastructure with no timeouts, no servers, automatic retries, and real-time hooks to update the UI during analysis (open source, generous free tier, GitHub login). Neon provides a free cloud Postgres DB (create project, copy the env variable into `.env`). ImageKit handles image storage, optimization, and transformations (grab public/private keys and endpoint URL under developer options, use the Expo or Node SDK). Sentry is the error-tracking and monitoring platform used by Slack, Cloudflare, Vercel, Linear, and GitHub (free credits, ~$80 via the partner link).
- Key claims: "Everything our AI agents do runs on trigger.dev"; long-running, failure-prone AI work must be offloaded from the mobile request cycle; all tools are free to start and need no credit card.
- Learner-relevant: Identifies the background-job infrastructure and the credentials/env vars each service requires, plus the real-time hook pattern for progress UI.

### Answering Claude's planning question batches

- Locator: `[[sources/mobile-app-course/20261001/How to Build Real Mobile Apps with Claude - FULL COURSE.srt]]`
- Summary: The instructor answers Claude's grouped questions, often deliberately choosing non-recommended options. Decisions: daily calorie targets are computed by AI (not deterministically); onboarding questions come before authentication, then "building your plan" UI, then sign-up, then data stored to the DB; meal photos upload directly from the app to ImageKit (fastest, Claude-recommended); users can manually edit returned macros; the home screen shows calorie/macro bars, a horizontal date strip, today's meal log, and a streak counter; device time zone is captured and stored per user; the camera UX shows an optimistic card that fills in live while analysis runs. OpenAI is noted as extremely cheap for this use case (~$0.01 per run).
- Key claims: The goal is the workflow, not an identical end result; the recommended option is usually fine but the instructor overrides it where his real app differs (e.g., plan-building UI before sign-up); batch order and questions may differ for each learner and that is fine; completing within ~20 days and getting a first client is the real target.
- Learner-relevant: Models how to make concrete product decisions during planning and shows the exact screen flows, home-screen contents, and timezone/upload choices that later implementation steps must honor.

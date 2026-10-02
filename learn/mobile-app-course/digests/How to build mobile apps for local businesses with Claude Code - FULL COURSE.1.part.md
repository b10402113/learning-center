---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 1
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 1)

## Overview (L1)

- Course intro & Dentify demo — a dentist/clinic app for a local business built from scratch with Claude Code, showing signup, onboarding, 4 tabs (home, bookings, chat, profile), iOS liquid glass, AI assistant, and real-time video calls; a web dashboard and landing page (privacy policy, terms) are also promised since Apple rejects apps without account-deletion and legal pages.
- Tech stack & prerequisites — Expo (React Native) for the app, Stream for chat/video, PostgreSQL on Neon, Clerk for auth, Sentry for error monitoring, CodeRabbit for AI code review, ImageKit for image uploads, OpenAI for the AI assistant; all have free plans. Requires VS Code, Node.js, an Expo account, and the Claude Code VS Code extension.
- Planning phase (workflow step 1) — never build UI/features immediately; first define idea, goals, features, pages, user flow, and tech stack, then use a plan-mode prompt that interviews the learner so the AI does not guess features; answers are gathered in batches and Claude produces a `plan.md`.
- Expo project generation & structure — run the Expo create command with `.` to scaffold in place, pick the latest SDK, then move the app into an `apps/mobile` monorepo folder (a `web`/Next.js folder comes later) and run the `reset project` script to strip demo screens.
- Claude Code configuration — enabling "bypass permissions"/auto mode (and reloading VS Code) so Claude edits without prompting; explanation of `CLAUDE.md` vs `AGENTS.md` as agent-readme files auto-loaded into context (put conventions in `AGENTS.md`, reference it from `CLAUDE.md`).
- GitHub setup — create a repo and push the local project (Claude can run the push command), establishing version control before development.

## Sections (L2)

### Course intro & Dentify app demo

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The instructor demos the finished app he built (calorie tracker, published in 14 days) then walks through the target project — a dentist app called Dentify for a local business — covering signup, onboarding, the four-tab home/booking/chat/profile layout, iOS liquid glass UI, AI assistant, and real-time video calls.
- Key claims: Account deletion is mandatory or Apple rejects the app; a web dashboard plus a landing page with privacy policy and terms of service are required for approval; mockup images will be generated for future projects.
- Learner-relevant: Anchors the "what we are building" target and surfaces Apple review compliance requirements (account deletion, legal pages) as a first-class concern.

### Tech stack & prerequisites

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Lists the tools used and their roles — Expo/React Native (best way to build mobile apps with AI), Stream (video calls + real-time chat, with agent skills), PostgreSQL hosted on Neon, Clerk (auth), Sentry (error monitoring), CodeRabbit (AI code review for security), ImageKit (image uploads/optimization); all have generous free plans and need no credit card.
- Key claims: Expo is "the best way to build mobile applications nowadays especially with AI"; Stream agent skills teach AI to build video/chat features in under 10 minutes; no self-hosted infrastructure is required.
- Learner-relevant: Gives the learner the concrete toolchain and the "free to follow along" constraint before any code is written.

### Environment setup & prerequisites

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Starting from an empty folder opened in VS Code — the learner needs VS Code (or Cursor/other agent editor), Node.js installed with defaults, and an Expo account for Dev Builds; the Claude Code VS Code extension is preferred over the desktop app or terminal.
- Key claims: The exact editor does not matter as long as an AI agent is available; signup links in the description give extra free credits.
- Learner-relevant: Establishes the minimal reproducible environment so the workflow can be followed exactly.

### Planning & describing the project with plan mode

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The core workflow step 1: do not build features/UI immediately — first define idea, goals, features, pages, user flow, and tech stack. Paste a "plan mode" prompt that asks the AI to interview the learner in batches of ~4 questions so it never guesses features; the instructor answers questions about roles (patients + dentist/staff), appointments, AI scope, dashboard (separate web app via Next.js API routes + Drizzle), notifications (push), payments (pay at clinic), onboarding, compliance, signup policy, images, and AI provider (OpenAI cheap GPT model for MVP).
- Key claims: "If you don't know what to build, how would AI know?" — the learner must give every detail up front; the first real day was spent only planning; `/by the way` sends a side request without ending the session; the plan is written to `plan.md`, and real projects need manual review rather than blind auto-accept.
- Learner-relevant: The central planning discipline of the course — a reusable interview-driven planning prompt and a `.md` plan artifact that seeds UI generation and feature breakdown.

### Expo project generation, folder restructure & demo reset

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Scaffold an Expo app with the official create command (append `.` to generate into the current folder), choose the latest SDK (57 at recording time), then Claude moves the app into an `apps/mobile` folder to make room for the future `web`/Next.js app; the `reset project` npm script removes boilerplate demo screens and styling. The goal is a workflow, not an identical end result.
- Key claims: The end product need not match the instructor's exactly — the source code is free on GitHub; Expo works on both Windows and Mac (Windows needs an Android simulator).
- Learner-relevant: Teaches the monorepo layout decision (mobile + web under `apps/`) and the clean-slate reset that every Expo project needs.

### Claude Code auto mode & bypass permissions

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: To avoid constant permission prompts, enable bypass permissions (via a prompt in an empty Claude instance) so auto mode performs edits without asking; reload VS Code with `Cmd+Shift+P → Reload Window` if needed.
- Key claims: Bypass mode can delete files without asking, so extra care is required, though the instructor never hit that problem; auto mode by default will not do everything until bypass permission is set.
- Learner-relevant: Removes friction from the AI-assisted loop while flagging the safety trade-off.

### CLAUDE.md and AGENTS.md

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Explains that `CLAUDE.md` and `AGENTS.md` are plain-markdown instruction files auto-loaded into the AI's context at the start of a session — a "README for AI agents" — where you put rules, conventions, and "always/never" guidance. `CLAUDE.md` is Claude-only; `AGENTS.md` applies to all agents; the convention is to keep conventions in `AGENTS.md` and import/reference it from `CLAUDE.md`.
- Key claims: These files are loaded before the first prompt, so the AI already knows the rules; the app already generated `.env.example` files (test placeholders for now) alongside the folders.
- Learner-relevant: Directly relevant to this repo's own AGENTS.md/CLAUDE.md pattern and to persisting project conventions for agents.

### GitHub repo setup & first push

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Create a GitHub repository (can be private) and push the local project; non-technical learners can copy the repo push command and hand it to Claude, which runs it in the terminal and pushes everything.
- Key claims: Coding agents make writing code super fast and effective; the repo will be public by viewing time; version control is established before feature work.
- Learner-relevant: Establishes the version-controlled baseline and reinforces the "delegate git operations to the agent" habit.

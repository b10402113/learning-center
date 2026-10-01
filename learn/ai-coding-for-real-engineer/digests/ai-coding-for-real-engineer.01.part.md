---
source: ai-coding-for-real-engineer.01
source_type: text
source_lines: 2894
part: 1
status: absorbed
absorbed_at: 2026-10-01
created: 2026-10-01
updated: 2026-10-01
---

# Digest — ai-coding-for-real-engineer (part 1: lessons 1-10)

## Overview (L1)

- lesson 1 — Course manifesto for cohort v2: developers should own their process rather than adopt ready-made frameworks (GSDS, spec-kit, BMAD). Introduces a seven-phase process (grill/interview → research → prototype → documents → issues → implement → review) with an AFK (away-from-keyboard) implementation phase so you parallelize yourself against the agent.
- lesson 2 — Course logistics/onboarding: the Discord server, channel layout, cohort-004 role and question channels, office-hours question channel, and the "hero" role. Mostly admin chatter with little engineering content.
- lesson 3 — Workspace setup: clone the cohort-004 project repo, install Node.js LTS (22/24), enable corepack to get pnpm, `pnpm install`, `pnpm db:seed`, `pnpm dev` on localhost, then install a CLI coding agent (Claude Code shown).
- lesson 4 — Database primer: SQLite is a file-based DB (`data.db`); deleting it and re-seeding resets everything. Schema lives in `schema.ts` (Drizzle ORM), `db:generate` creates migration files, `db:migrate` applies them — the agent rarely remembers to run migrate.
- lesson 5 — Choosing a model and subscription tier for Claude Code: use the default for your tier (Opus 4.6 on max, Sonnet 4.6 on pro), avoid Haiku, keep medium effort; decide between Pro and 5x/20x Max by budget.
- lesson 6 — Repo state management tooling: `pnpm reset` snaps your repo to any recorded course commit (destructive), `pnpm cherry-pick` preserves your own work, and `pnpm pull` fetches upstream course updates. Branch strategy and AI-assisted merge-conflict resolution.
- lesson 7 — Office-hours logistics: optional 30–45 min YouTube live streams on day 1, 5, and 8 with VODs kept; time for in-depth walkthroughs. Almost entirely scheduling info.
- lesson 8 — Why the course uses Claude Code: a popular CLI harness, but the course is harness-agnostic. Points to a dedicated section covering Claude Code basics plus advanced tips.
- lesson 9 — Claude Code fundamentals: run from the VS Code integrated terminal; `/terminal-setup`, shift+Enter for multi-line prompts, `/usage`, `/context` (context-window graph), `/clear`, and Escape/"go" to interrupt/resume.
- lesson 10 — Claude Code prompting tips: `@`-reference files (auto-completed and auto-read into context), Ctrl+S to stash a draft prompt, Ctrl+C to discard it, and pasting images into the chat (does not work on WSL).

## Sections (L2)

### lesson 1

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson1.en.srt#lesson1]]`
- Summary: The instructor frames cohort v2 as teaching a personal process rather than a fixed framework. Coding agents have leapt forward in capability since ~December, but getting good code reliably still requires real engineering skills, heuristics, and industry experience. The course is interactive, using a ~20,000-line playground app (a TypeScript/Node/React course platform) where learners build real features.
- Key claims: Developers should own and iterate on their own process, not adopt frameworks like GSDS, spec-kit, or BMAD wholesale; the outcome is a seven-phase process — grill/interview, research, prototype, create documents, turn documents into issues, implement, review; the implementation phase must run AFK (away from keyboard) so the developer parallelizes planning with the agent shipping; agents thrive in healthy code bases, so good practices raise output; learners may use either the cohort repo or their own repo, trading support for applicability.
- Learner-relevant: Establishes the mental model and vocabulary for the whole course — "own your process", the seven phases, AFK implementation, and the human role of imposing taste and knowing when to intervene. Anchors later lessons on PRDs, issues, and agent workflows.

### lesson 2

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson2.en.srt#lesson2]]`
- Summary: A walkthrough of the community Discord server. It explains general channels versus course-gated channels unlocked by the cohort-004 role, the dedicated questions channel, a channel for questions to be answered in office hours, and the "hero" recognition role. Substantive teaching content is minimal; this is onboarding/logistics.
- Key claims: The cohort-004 role unlocks the course channels (cohort-003 buyers also retain access); the questions channel is the main route to support; there is a separate channel for office-hours questions where popular questions float to the top; a hero role is awarded to helpful community members; a setup link recovers purchased roles if channels are hidden.
- Learner-relevant: Tells a learner where to get help and how community support is organized, but contributes little to the technical skill graph.

### lesson 3

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson3.en.srt#lesson3]]`
- Summary: Step-by-step environment setup for the cohort project. Clone the repo, install Node.js, enable pnpm via corepack, install dependencies, seed the local database, run the dev server, and install a CLI coding agent. The instructor uses Claude Code but notes any CLI-based agent works.
- Key claims: Repo is `aihero.dev/cohort-004-project`; install Node.js LTS (22 or 24) and verify with `node -v`; `corepack enable` installs pnpm (faster and more disk-efficient than npm, "industry standard"); run `pnpm install`, `pnpm db:seed` to seed the local SQLite DB, and `pnpm dev` to serve the app on localhost (5175 in the demo); the course works with nearly any CLI-based agent.
- Learner-relevant: Gives the reproducible starting state all exercises assume, and introduces pnpm and the course platform (a Cadence-style video platform with courses, users, quizzes, enrollments, lesson-progress, and watch events).

### lesson 4

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson4.en.srt#lesson4]]`
- Summary: A beginner database lesson explaining SQLite, seeding, and migration workflow. SQLite is a single file on disk, so deleting `data.db` resets the database; running the app without it errors with "no such table: courses". It then explains how Drizzle schema changes become migrations and are applied.
- Key claims: SQLite is file-based (`data.db`, plus `-shm`/`-wal` files) versus hosted DBs like Postgres that need a server or Docker; schema is defined in `schema.ts` using Drizzle ORM and does not auto-sync to the DB; `pnpm db:generate` turns schema changes into migration files, `pnpm db:migrate` applies pending migrations; agents usually know to generate but often forget to migrate, so you must deliberately keep DB and code in sync; delete `data.db` + `pnpm db:seed` to reset (it is dummy data).
- Learner-relevant: Teaches the schema → generate → migrate mental model used in production, and why a human must run migrations — a recurring failure mode when working with coding agents.

### lesson 5

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson5.en.srt#lesson5]]`
- Summary: Advice on picking a Claude Code model, effort level, and subscription. Use the default model for your tier and medium effort; avoid Haiku because it cannot handle the course workflows. A closing editor's note explains the model names will drift but the tier structure stays.
- Key claims: Select the model with `/model`; Opus 4.6 is the top model available on 5x/20x Max, Sonnet 4.6 is the Pro default, and Haiku is not recommended ("not capable enough"); prefer whatever effort default the harness suggests (medium for most work); subscription options are Pro, Max 5x, and Max 20x — the course was built on Max 5x, Pro+Sonnet is usable but may hit limits; across providers expect an Opus-level top model, a mid-tier model, and a cheap Haiku-level model.
- Learner-relevant: Calibrates tooling spend and capability expectations, teaching that model choice should track the task's complexity rather than defaulting to the fastest/cheapest model.

### lesson 6

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson6.en.srt#lesson6]]`
- Summary: Explains the repo-history tooling used across the course so learners can reproduce any lesson's starting state. `pnpm reset` lets you pick a recorded commit (searchable by name or number) and switch/create a branch, but is destructive. `pnpm cherry-pick` preserves your work, and `pnpm pull` brings in upstream course updates.
- Key claims: `pnpm reset` resets the branch to a recorded commit and removes unrelated uncommitted work, so it is not for preserving custom work; you cannot reset `main` directly, so it prompts for a new branch name (demo uses `dev`); `pnpm cherry-pick` reapplies a recorded commit while preserving your changes but can produce merge conflicts, which you can resolve by asking Claude to "fix this merge conflict" or bail with `git cherry-pick abort`; `pnpm pull` is analogous to `git pull` from the parent course repo and preserves your work.
- Learner-relevant: Teaches a non-destructive-to-your-work way to jump around a course codebase, and demonstrates using the agent itself to resolve git merge conflicts.

### lesson 7

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson7.en.srt#lesson7]]`
- Summary: Office-hours scheduling. There are optional 30–45 minute YouTube live streams on day 1, day 5, and day 8 where learners can comment and ask anything; recordings stay up as VODs. The instructor notes interesting material gets re-recorded as course explainers. Almost no technical content.
- Key claims: Office hours run on day 1, day 5, and day 8; they are live streams via YouTube comments; they are optional/"for vibes" but are the venue for deep walkthroughs; VODs remain available; highlights are captured as standalone course explainers so you need not watch the whole stream.
- Learner-relevant: Purely logistics; useful only for knowing where to bring questions in depth.

### lesson 8

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson8.en.srt#lesson8]]`
- Summary: A short framing lesson on tooling choice. The course demonstrates with Claude Code because it is popular and the instructor's daily driver, but emphasizes the course is harness-agnostic for any CLI-based agent. A dedicated section gives beginners the Claude Code basics and adds advanced tips for experienced users.
- Key claims: Claude Code is used for demonstrations but is not required; any CLI-based coding harness works; a dedicated section covers Claude Code fundamentals and a few advanced techniques; even experienced Claude Code users may pick up tips.
- Learner-relevant: Sets expectations that the process, not the specific harness, is the transferable skill.

### lesson 9

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson9.en.srt#lesson9]]`
- Summary: Hands-on tour of the core Claude Code commands and UI. It covers running Claude from VS Code's integrated terminal, setting up terminal key bindings, composing multi-line prompts, and monitoring usage and context. It closes by showing how to interrupt and resume the agent.
- Key claims: Run Claude inside the VS Code integrated terminal; `/terminal-setup` installs key bindings so shift+Enter inserts new lines (needed for complex prompts); `/usage` shows session and weekly plan limits (plus a Sonnet-only weekly meter); `/context` graphs context-window consumption (demo ~21k of 200k tokens, ~10%); `/clear` wipes conversation history back to zero context; Escape interrupts a running response and typing "go" resumes it; control+C twice exits the session.
- Learner-relevant: Equips the learner with the essential daily commands and introduces context-window awareness, which the course treats as a central concept.

### lesson 10

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson10.en.srt#lesson10]]`
- Summary: Practical Claude Code prompting tips. Shows how to reference specific files with `@` so they are auto-loaded into context, how to stash a draft prompt with Ctrl+S and restore it later, and how to paste images into the chat. Includes a caveat that image paste does not work on WSL.
- Key claims: Typing `@` searches and auto-completes file paths (tab to select), and referenced files are read directly into the context window, saving Claude the effort of finding them and giving it exactly what it needs; Ctrl+S stashes the current prompt so you can send something else, then rehydrates it afterward — useful when you need to give feedback before a long prompt; Ctrl+C discards a stashed prompt; images can be copied/pasted into Claude Code for visual reference (demonstrated with a photo of Lake Bled, Slovenia), but this does not work on Windows Subsystem Linux.
- Learner-relevant: Teaches explicit context provisioning (`@`-references) and prompt management (stash), reinforcing that feeding the agent the right context is a core skill.

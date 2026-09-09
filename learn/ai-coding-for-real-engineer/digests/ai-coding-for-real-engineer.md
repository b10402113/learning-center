---
source: ai-coding-for-real-engineer
source_lines: 39326
created: 2026-08-18
updated: 2026-09-02
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — ai-coding-for-real-engineer

# Digest part 1 — lessons 1–15

## Overview (L1)
- lesson1 — Course intro: a seven-phase process (grilling/interviewing, research, prototyping, documents, issues, implementation, review) that wraps any coding agent; core tenet is running implementation AFK (away from keyboard) to parallelize your work; a 20k-line TypeScript/React playground repo, usable on your own repo instead.
- lesson2 — Tour of the course Discord server: general channels vs. course channels, cohort roles, question threads, office-hours questions, and the "hero" role for helpful members.
- lesson3 — Hands-on setup: clone the `aihero/coho-004-project` repo, install Node (LTS), enable corepack to get pnpm, run `pnpm install`, `pnpm db:seed`, and `pnpm dev`, then install Claude Code.
- lesson4 — How databases and migrations work: the project uses SQLite (a file DB) with Drizzle ORM; `schema.ts` is the source of truth, `db generate` makes migration files, `db migrate` applies them; delete `data.db` + reseed to reset.
- lesson5 — Choosing model and subscription for Claude Code: use the default model per plan (Opus 4.6 on Max 5x, Sonnet 4.6 on Pro), never Haiku; choose medium effort; Max 5x recommended, Pro usable.
- lesson6 — Playground state tools: `pnpm reset` (destructive — deletes unrelated work), `pnpm cherry-pick` (preserves existing work, can hit merge conflicts), and `pnpm pull` (brings in instructor's upstream changes).
- lesson7 — Office hours logistics: ~30–45 min YouTube live streams on days 1/5/8; not mandatory; interesting bits get recorded as explainer videos in the course.
- lesson8 — Harness-agnostic framing: course demos use Claude Code but any CLI-based coding agent works; this section gives Claude Code basics plus some advanced tips.
- lesson9 — Claude Code basics: run in VS Code integrated terminal, `/terminal-setup`, shift+enter for newlines, `/usage`, `/context` (tokens consumed), `/clear` (reset context), escape to interrupt, type "go" to resume.
- lesson10 — Prompting tips: reference files with `@` + tab completion (auto-loaded into context), Ctrl-S stashes a prompt for later, Ctrl-C discards it, and pasting images into the prompt works (not on WSL).
- lesson11 — IDE integration: `/ide` shows connection status; the Claude Code VS Code extension makes diffs reviewable in the IDE instead of the terminal; accept edits or save the file to approve.
- lesson12 — Going backwards/forwards: press escape twice for rewind mode (restore code and/or conversation), `/resume` picks a past session, `claude --continue` re-enters the last session; sessions persist locally.
- lesson13 — Bash command management: `!` enters bash mode (output visible to Claude), Ctrl-B backgrounds a long-running command (e.g. dev server) so Claude can read its logs, Ctrl-Z suspends Claude so you can run hidden commands, `fg` brings it back.
- lesson14 — Risk vs reward and the permissions model: Claude Code prompts before commands; approvals recorded in `.claude/settings.local.json` `permissions.allow`/`deny` arrays (with wildcards); renaming to `settings.json` shares per-repo rules with the team; web search/fetch also gated.
- lesson15 — LLM constraints: attention scales quadratically with tokens (context window), so there's a "smart zone" and a "dumb zone" (hallucinations); LLMs are a fuzzy-JPEG database, not a reliable one; knowledge cutoffs; completely stateless — clearing context wipes everything.

## Sections (L2)

### Lesson 1
- Locator: `[[sources/ai-coding-for-real-engineer/lesson1.en.srt]]`
- Summary: Course kickoff explaining why the instructor (Matt Pocock) rejects big pre-built agent frameworks (GSD, spec kits, be mad) in favor of a personal, owned process built on 30 years of engineering heuristics, delivered as interactive exercises in a playground repo.
- Key claims: Developers should own their process rather than adopt big frameworks; the course teaches a seven-phase process — grilling/interviewing, research, prototyping, creating documents, turning documents into issues, implementing, and reviewing; the implementation step should run completely AFK (away from keyboard) so you can parallelize with the agent; agents thrive in good code bases.
- Learner-relevant: Anchor: the payoff promise — plan while the AI ships, know when to intervene, and end with a healthier code base; choice between following the cohort repo (more support) or applying exercises to your own repo (real code, less support).

### Lesson 2
- Locator: `[[sources/ai-coding-for-real-engineer/lesson2.en.srt]]`
- Summary: Walkthrough of the cohort's Discord server layout — public general channels versus course-only channels gated by the cohort role, question threads, office-hours questions, and the hero recognition system.
- Key claims: Discord is the primary support surface for getting questions answered; course-specific channels are visible with the cohort 004 role (previous cohort 003 members also have access); questions for office hours are collected in a dedicated channel and the best ones floated up; a "hero" role rewards members who are especially helpful.
- Learner-relevant: Anchor: know where to get help — course questions, setup issues, and office-hours questions each have a dedicated channel.

### Lesson 3
- Locator: `[[sources/ai-coding-for-real-engineer/lesson3.en.srt]]`
- Summary: Step-by-step environment setup: clone the playground repo, install Node LTS, enable corepack to get pnpm, install dependencies, seed a local database, start the dev server, and install the coding agent (Claude Code).
- Key claims: pnpm is faster than npm, saves disk space, and is described as industry standard; `pnpm db:seed` seeds a local database for the course platform (users, categories, quizzes, enrollments, lesson progress, quiz attempts, video watch events); `pnpm dev` runs the app on localhost:5175; the course is workable with nearly any CLI-based agent, and you should deliberately not explore the code base yet (a later lesson covers exploring new code bases).
- Learner-relevant: Anchor: the full local setup checklist — clone, Node, corepack/pnpm, seed, dev, agent login — reusable for any repo-based course.

### Lesson 4
- Locator: `[[sources/ai-coding-for-real-engineer/lesson4.en.srt]]`
- Summary: Explains how database and migrations work in the playground, addressing a common source of confusion: the project uses a SQLite database managed by Drizzle ORM, with a schema-to-migration-to-database workflow.
- Key claims: SQLite is a file-based database (data.db, data.db-shm, data.db-wal) unlike hosted Postgres; the Drizzle `schema.ts` is the source of truth but changes don't auto-sync; you run `db generate` to produce migration files and `db migrate` to apply pending ones to the database; agents usually figure out generate but often need to be told to run migrate; you can always reset by deleting data.db and running `pnpm db:seed` again since it's dummy data.
- Learner-relevant: Anchor: the mental model that the database must be deliberately kept in sync with code state — a pattern that recurs whenever the agent touches the DB during the course.

### Lesson 5
- Locator: `[[sources/ai-coding-for-real-engineer/lesson5.en.srt]]`
- Summary: Recommendations for which Claude Code model and subscription to use during the course, plus a recorded note that model names change over time while the underlying tier logic stays the same.
- Key claims: Choose the default model for your subscription — Opus 4.6 on Max 5x, Sonnet 4.6 on Pro; do not use Haiku (too weak for the workflows); prefer medium effort over low/high; the course was built against Max 5x, but Pro with Sonnet should get you through; every provider has an equivalent Opus-level, mid-tier, and cheap Haiku-level model.
- Learner-relevant: Anchor: the tiering principle (top / mid / budget model per provider) survives model renames — check your subscription's default rather than memorizing model names.

### Lesson 6
- Locator: `[[sources/ai-coding-for-real-engineer/lesson6.en.srt]]`
- Summary: Introduces three pnpm commands that control the playground's git state so you can match the exact code state from each recorded exercise.
- Key claims: `pnpm reset` destructively resets your branch to a chosen recorded commit (it deletes unrelated work, e.g. an added npm script), and it can't reset main directly (you create a new branch); `pnpm cherry-pick` preserves existing work but can produce merge conflicts, which Claude is good at resolving (`Claude fix this merge conflict for me`) or you can `git cherry-pick --abort`; `pnpm pull` fetches the instructor's upstream changes into your branch without resetting, and conflicts should be handed to Claude.
- Learner-relevant: Anchor: three commands — reset (match recording exactly), cherry-pick (keep your work), pull (sync upstream fixes) — map to git concepts the learner already knows.

### Lesson 7
- Locator: `[[sources/ai-coding-for-real-engineer/lesson7.en.srt]]`
- Summary: Describes the optional office-hours live streams that run on days one, five, and eight of the cohort.
- Key claims: Office hours are ~30–45 minute YouTube live streams where you can comment and chat; they're not mandatory viewing ("mostly for vibes"); VODs stay up; notable Q&A is repackaged into small explainer videos inside the course.
- Learner-relevant: Anchor: even if skipped live, office-hours takeaways are captured as course explainers, so no content is lost.

### Lesson 8
- Locator: `[[sources/ai-coding-for-real-engineer/lesson8.en.srt]]`
- Summary: Frames the course as harness-agnostic: Claude Code is the demo agent because it's popular and the instructor's daily driver, but any CLI-based coding agent works; the next lessons cover Claude Code basics plus advanced tips.
- Key claims: The course is harness agnostic as long as the harness runs in a CLI; even experienced Claude Code users are likely to pick up something, since the section covers more than basics.
- Learner-relevant: Anchor: the mental separation between "the agent/harness" and "the process" — the process is the transferable thing.

### Lesson 9
- Locator: `[[sources/ai-coding-for-real-engineer/lesson9.en.srt]]`
- Summary: The first Claude Code walkthrough: core terminal UI habits and the essential slash commands for session control.
- Key claims: Run Claude in the VS Code integrated terminal; `/terminal-setup` installs key bindings (shift+enter adds new lines in the input); `/usage` shows plan usage limits for the session and week; `/context` visualizes context-window consumption (e.g. ~21k of 200k tokens) and is the way to introspect how context is used; `/clear` resets the context window to zero (like a fresh chat); escape interrupts a running Claude and typing "go" resumes it.
- Learner-relevant: Anchor: the recurring theme the course returns to — tracking and clearing context deliberately, with `/usage`, `/context`, and `/clear` as the concrete tools.

### Lesson 10
- Locator: `[[sources/ai-coding-for-real-engineer/lesson10.en.srt]]`
- Summary: Prompting quality-of-life tips in Claude Code: referencing files, stashing prompts, and pasting images.
- Key claims: Use `@` plus up/down + tab to reference specific files; referenced files are auto-read into the context window (costs a little upfront time but gives Claude exactly what it needs); Ctrl-S stashes the current prompt so you can run another command and restore later (Ctrl-C discards it instead); images can be pasted into prompts (not supported on WSL).
- Learner-relevant: Anchor: file `@`-references and prompt stashing are concrete techniques to make prompts precise and recoverable.

### Lesson 11
- Locator: `[[sources/ai-coding-for-real-engineer/lesson11.en.srt]]`
- Summary: Shows how Claude Code integrates with an IDE (VS Code via the Claude Code extension) for much richer diff management.
- Key claims: `/ide` shows/installs the IDE integration; without it, diffs render awkwardly in the terminal, but with the VS Code extension you get a scrollable rich diff; you approve changes with "Accept Proposed Changes" or by simply saving the file; this is why the instructor runs Claude inside VS Code — reviewing and tweaking diffs is far nicer in a proper IDE.
- Learner-relevant: Anchor: the IDE integration is primarily a review workflow — a human-in-the-loop gate before accepting agent edits.

### Lesson 12
- Locator: `[[sources/ai-coding-for-real-engineer/lesson12.en.srt]]`
- Summary: Covers navigating backwards and forwards in a Claude Code conversation and resuming sessions, since sessions are persisted locally.
- Key claims: You can ask Claude to "revert that" to undo its last change; pressing escape twice enters rewind mode where you can restore the code and/or the conversation to a prior point (most-used option: restore both); sessions persist locally, so you can exit with Ctrl-C twice and resume later via `claude resume <uuid>`, `/resume` (pick from history), or `claude --continue`; a "summarize from here" option is teased for later.
- Learner-relevant: Anchor: the statelessness of LLMs (lesson 15) is partly mitigated by harness-side session persistence — rewind and resume are the recovery mechanisms.

### Lesson 13
- Locator: `[[sources/ai-coding-for-real-engineer/lesson13.en.srt]]`
- Summary: How to run and manage bash commands from within Claude Code, turning the agent from a passive writer into something that can close feedback loops with the project.
- Key claims: Bash commands let the agent seek feedback loops and use shell power (e.g. run type checks, run the dev server); prefixing with `!` enters bash mode and the command output lands in Claude's context (demo: `npm run typecheck` surfaced errors and Claude diagnosed that Zod was listed but not installed); Ctrl-B backgrounds a long-running command (dev server) whose output is written to a file and viewable from the status line — invaluable for debugging server issues; Ctrl-Z suspends Claude so you can run commands invisibly, `fg` brings it back with all state; the decision tree is: want Claude to see output → `!` bash mode (Ctrl-B to background), want it hidden → Ctrl-Z suspend; shortcuts differ on Mac.
- Learner-relevant: Anchor: the concrete decision tree for when Claude should (or shouldn't) see a command's output, which foreshadows context management in later lessons.

### Lesson 14
- Locator: `[[sources/ai-coding-for-real-engineer/lesson14.en.srt]]`
- Summary: The permissions/approval model in Claude Code, framed as a risk-versus-reward tradeoff over how much power you hand the agent.
- Key claims: Claude Code is strict by default to avoid catastrophic actions (e.g. deleting the filesystem); for bash commands it shows the exact command and the reason, with options to allow once, allow always in the project, or deny (and tab to suggest a different command, e.g. `npx tsc` instead of `pnpm typecheck`); your choices are written to `.claude/settings.local.json` under `permissions.allow`/`deny` with exact commands or wildcards (e.g. all pnpm commands); web search/web fetch is separately gated; renaming `settings.local.json` to `settings.json` makes the rules shared per-repo so any teammate or fresh Claude instance picks them up automatically.
- Learner-relevant: Anchor: pre-authorize a known-good command set per repo (via settings files) rather than grinding through prompts each session — the seed of repo-level agent configuration.

### Lesson 15
- Locator: `[[sources/ai-coding-for-real-engineer/lesson15.en.srt]]`
- Summary: The core constraints of LLMs that shape every later technique in the course: quadratic attention scaling, unreliable parametric memory, knowledge cutoffs, and statelessness.
- Key claims: Context scales quadratically — each new token adds relationships to every other token (4 tokens → 6 relationships, 8 → 28, 100 → ~5,000), so filling the context window strains the model; this yields a "smart zone" (clear reasoning, hallucination-free) and a "dumb zone" (hallucinations, worse reasoning, recall failure); the instructor gets paranoid around 40% (≈80k of 200k tokens); LLMs are not a reliable database — training data is compressed into parameters, "a fuzzy JPEG of all of human knowledge," so parametric answers are unreliable by design while context-window answers are reliable (until you stuff it into the dumb zone); knowledge cutoff dates matter less when you distrust parametric recall anyway; LLMs are completely stateless — clearing context wipes all built-up "tribal knowledge," so codebase quality and documentation become key; a later note updates the numbers: the dominant context window has grown to 1M tokens and the smart zone is now roughly 100k raw tokens, so think in token counts, not percentages.
- Learner-relevant: Anchor: the two big practical take-aways — keep context lean to stay in the smart zone, and rely on context + docs rather than the model's memory, since it's stateless between sessions.

# Digest part 2 — lessons 16–30

## Overview (L1)
- lesson16 — Sub-agents as a context-saving delegation mechanism: the orchestrator spawns child agents with fresh context windows that report summaries back.
- lesson17 — Exercise: explore the course repo with Claude Code to understand its tech stack and purpose, and watch for sub-agent usage.
- lesson18 — Solution: shows how prompting with the word "Explore" triggers a dedicated Explore sub-agent and far deeper exploration.
- lesson19 — Exercise: build a course review system (star ratings) and observe Claude Code's default behavior with context paranoia.
- lesson20 — Solution: walks through plan mode, the plan sub-agent, context clearing, the review/commit flow, and QA of the built feature.
- lesson21 — Agents are non-deterministic next-token machines; the same prompt gives different results, so expectations must adapt.
- lesson22 — Setup: install a status-line package so context-window usage is visible at all times instead of hidden in `/context`.
- lesson23 — Why plan mode is no longer recommended: it skips the shared-design-concept interview phase; GrillMe is the recommended replacement.
- lesson24 — Exercise: use the GrillMe skill to design a lesson comments feature through a one-question-at-a-time interview.
- lesson25 — Solution: walks a full GrillMe session to a V1 spec, then implements the comments feature and QA's it.
- lesson26 — Compacting: what the auto-compact buffer does, the sediment problem of repeated compacts, and when compacting is worth it.
- lesson27 — Handoff: a skill that writes a temporary markdown doc so a fresh agent can continue work in a new context window.
- lesson28 — Memory: CL AUDE.md/AGENTS.md as the project-level instruction file; its global, token-costing, and often-ignored nature.
- lesson29 — Exercise: implement a bookmarks feature with a CL AUDE.md rule (object params) fighting codebase conventions — which wins?
- lesson30 — Solution: Claude.md steering wins; adds a durable "services must have tests" rule and re-runs the agent to backfill tests.

## Sections (L2)
### Lesson 16
- Locator: `[[sources/ai-coding-for-real-engineer/lesson16.en.srt]]`
- Summary: Explains Claude Code's strategy for squeezing more value out of a limited context window: the orchestrator agent (the one you talk to) spawns sub-agents, each with its own fresh context window, that burn tokens doing a task and return only a summary.
- Key claims: The less context spent on exploration, the more tokens remain in the "smart zone" for implementation; sub-agents are a delegation mechanism (lead developer pawns work off to a junior who reports back); orchestrators can spawn multiple sub-agents in parallel; sub-agents can use different system prompts and cheaper models (Haiku is common for fast, high-quality exploration); sub-agents are a context-saving mechanism used extremely aggressively by Claude Code.
- Learner-relevant: The "smart zone vs dumb zone" framing of the context window; expect to see sub-agents everywhere in Claude Code UI; sub-agent usage is the tool's core trick for long sessions.

### Lesson 17
- Locator: `[[sources/ai-coding-for-real-engineer/lesson17.en.srt]]`
- Summary: Exercise framing: because LLMs are stateless and get dropped into a codebase with zero memory every time, exploration is a foundational skill for working with coding agents. The task is to prompt Claude Code inside VS Code to explain the repo's tech stack and intended purpose, then query it further.
- Key claims: Statelessness is the most onerous constraint and the first to think about; every session starts with exploration from scratch, so understanding exploration is essential to getting good with agents; the initial prompt is "Tell me what the tech stack of this repo is and what its intended purpose is"; learners should watch for sub-agent use in the UI and ask follow-up questions to deepen understanding.
- Learner-relevant: Prompt idea for bootstrapping any new repo; observe whether a sub-agent spawns; a list of prepared questions is offered to reach a strong mental model of the codebase.

### Lesson 18
- Locator: `[[sources/ai-coding-for-real-engineer/lesson18.en.srt]]`
- Summary: Solution video showing that the plain tech-stack prompt reads only six files and spawns no sub-agent, while adding the word "Explore" triggers an Explore sub-agent that reads many more files and returns a deep PPP (purchasing-power-parity) breakdown.
- Key claims: Ctrl-O expands the UI into a verbose mode showing bash commands and file reads; without the Explore keyword no sub-agent spawns and coverage is shallow; with "Explore ... how PPP works in this repo" Claude spawns an Explore sub-agent with a customized system prompt; the sub-agent took ~60 seconds, used ~64k tokens (~32% of its context window), and made 25 tool calls; word choice matters — the verb "Explore" connects to the Explore sub-agent in the model's latent space; this is a concrete hint for forcing in-depth exploration.
- Learner-relevant: Prompting trick "use the verb Explore to get deep repo exploration"; Ctrl-O verbose mode for inspecting agent behavior; token/tool-call statistics show what aggressive exploration costs.

### Lesson 19
- Locator: `[[sources/ai-coding-for-real-engineer/lesson19.en.srt]]`
- Summary: Exercise: build a course review system where enrolled students leave a 1–5 star rating on courses (no written reviews), with the average shown on course list and detail pages. Learners run Claude Code, watch its behavior, and steer lightly.
- Key claims: Start with a fresh session (`clear` to reset conversation history); a simple couple-of-sentence prompt suffices; observe whether an Explore sub-agent spawns and watch for permission prompts to change files; run `/context` to check usage; the key takeaway is "context paranoia" — start worrying around 40% usage of the main orchestrator agent; approach the session observationally with light steering.
- Learner-relevant: The ~40% smart-zone threshold as a working rule; building the habit of running `/context`; a canonical example prompt for a full-stack feature.

### Lesson 20
- Locator: `[[sources/ai-coding-for-real-engineer/lesson20.en.srt]]`
- Summary: Solution video: Claude auto-enters plan mode, spawns an Explore sub-agent, then interviews the user with clarifying questions (enrolled-only, 1–5 scale, dashboard display), spawns a plan sub-agent, presents a multi-step plan with options, and implements, commits, and demonstrates the review feature.
- Key claims: Plan mode lets you answer clarifying questions with tab/arrow keys and numbers, and you can escape to ask your own follow-ups; a plan sub-agent is another context-saving mechanism that reads files and designs an implementation plan; plan options include auto-accept edits, keep manual approval, clear context + auto-accept, or type changes to the plan; context was ~36% and clearing it re-triggered an Explore sub-agent to catch back up — but it's worth it to avoid the dumb zone; database migrations are operations to keep manual control over; the final `/context` was ~32%, comfortably in the smart zone; `commit` makes Claude stage and commit with a permissioned message; the feature worked end-to-end with two users (Emma Wilson, Olivia Martinez) averaging to 4.5 stars.
- Learner-relevant: The full plan-mode workflow with its four end-of-plan options; how context clearing costs a re-exploration but keeps quality high; keeping migrations as a manual permission point; `commit` as a built-in verb.

### Lesson 21
- Locator: `[[sources/ai-coding-for-real-engineer/lesson21.en.srt]]`
- Summary: A short expectations-setting detour: agents are non-deterministic, so different runs of the same prompt produce different results, and some outputs will be odd outliers.
- Key claims: Agents are next-token chooser machines sampling from a probability distribution, not deterministic; same question twice can give two answers; in the first run of the course (~2,500 students) some had wildly different agent behavior on the same exercise — this is normal and baked in; you can make agents more consistent (especially later in the "AFK phase" with feedback loops) but some weirdness always remains; ride the wave.
- Learner-relevant: Normalizes the frustration when your agent diverges from the instructor's demo; calibrates expectations for the rest of the course.

### Lesson 22
- Locator: `[[sources/ai-coding-for-real-engineer/lesson22.en.srt]]`
- Summary: Fixes the pain point of monitoring context usage in Claude Code's default UI by installing a community status-line package that displays context-window usage at all times.
- Key claims: Cursor and OpenCode show context percentage clearly, Claude Code's default UI hides it, forcing the `/context` escape; Claude Code supports a customizable status line; setup is done by pasting a provided article into Claude Code which configures it in the global user settings (`~/.claude`), not the project; the status line shows raw token count plus dimmed percentage; since the recording, Anthropic announced a 1M-token window for Opus 4.6/Sonnet 4.6, so percentages alone are no longer the right gauge — worry around 80k–100k tokens (instructor recorded with a 200k limit, so 40% ≈ 80k tokens).
- Learner-relevant: Concrete setup step to keep context in view; the token-count threshold as the modern replacement for the 40% rule; awareness that global vs project config differ.

### Lesson 23
- Locator: `[[sources/ai-coding-for-real-engineer/lesson23.en.srt]]`
- Summary: Argues against using plan mode (which exists in Claude Code, Codex, and elsewhere) because it truncates the interview phase and skips establishing a shared design concept; recommends an interview-driven workflow instead.
- Key claims: In default/implement mode an agent can write files, read files, run bash, and call MCP servers; plan mode drops file-writing and discourages active changes; planning itself is good — it aids understanding, alignment, and forces exploration — but in practice the interview phase is often just one or two questions before a wall-of-text plan is produced, and reviewers skip over misalignments; cites Frederick P. Brooks's "The Design of Design" — a design concept is the ephemeral thing shared between all participants, not an asset; the failure mode is skipping design-concept establishment; the recommended process is explore → interview (the focus, can take a while) → implement; the instructor's GrillMe skill relentlessly interviews until shared understanding, filling the context window with valuable intent that can become a spec or go straight to implementation.
- Learner-relevant: The four agent capabilities (files, bash, MCP); critique of plan mode; introduction of the shared-design-concept idea and GrillMe as the replacement workflow.

### Lesson 24
- Locator: `[[sources/ai-coding-for-real-engineer/lesson24.en.srt]]`
- Summary: Exercise: build a lesson comments feature using the GrillMe skill, deliberately left vague so learners must interview the agent to pin down scope.
- Key claims: Use a new Claude Code session in default mode (no plan mode, no auto-accept edits); the GrillMe skill is a single markdown file whose instructions are: interview relentlessly until shared understanding, walk each branch of the design tree resolving dependencies one by one, provide recommended answers for each question, ask one question at a time, and explore the codebase instead of asking anything answerable that way; because the skill says "Explore", it will actually explore; treat the session as a sandbox, take notes, and note improvement ideas for the skill.
- Learner-relevant: See the actual minimal skill file content; learn that a skill is just an instruction document — its design principles (one question at a time, explore first, recommend answers) are reusable.

### Lesson 25
- Locator: `[[sources/ai-coding-for-real-engineer/lesson25.en.srt]]`
- Summary: Solution video: runs GrillMe for a "lesson comments feature" with a V1-first prompt, answering each question (who can post/read, threading model, content format, edit/delete, placement, sort order, pagination, notifications, character limit, moderation), then implements and QA's the aligned result.
- Key claims: The instructor's favorite reply to GrillMe is "Correct" to accept a recommendation; asking follow-up questions drives the interview (e.g., "what version would be hard to row back from?"); reversibility ranking — pure flat is the most reversible, fully nested threads are hardest to escape because data meaning depends on depth; chosen V1 scope: enrolled students + course instructor post/read, comments scoped to one lesson, pure flat list, plain text + auto-link, soft delete only, no editing, discussion section below lesson content/quiz, thread-like sort order, instructor badge, load all, no notifications, 2000-char limit, admin delete capability; one question at a time keeps focus and prevents lazily deprioritizing decisions; after grilling (~40k tokens, still smart zone) it went straight to implement without creating a plan asset — schema, migration, comment service, tests, and UI were built, all tests passing, ~78k tokens at UI stage; QA confirmed per-access controls (James Park sees no comments, Olivia can't delete) and soft-delete placeholders; no steering needed during implementation because alignment came from the interview.
- Learner-relevant: A full worked example of the GrillMe interview → implement flow; the reversibility lens for picking designs; evidence that interview-first yields aligned implementations with zero mid-implementation steering.

### Lesson 26
- Locator: `[[sources/ai-coding-for-real-engineer/lesson26.en.srt]]`
- Summary: Explains what happens at the far end of the context window: the auto-compact buffer reserves tail tokens and triggers `compact`, which uses an LLM to summarize the conversation into a small markdown document.
- Key claims: The context command reveals an auto-compact buffer (~33k tokens ≈ 16.5% of the window) reserved at the end; crossing into it automatically runs compact; compact reduces a large conversation (e.g., 49% → 12%, 23k tokens) into a summary that keeps key files in context, references other files, preserves user messages and any pending tasks, and stores the full transcript in a file; compaction costs tokens but re-exploring costs tokens too; repeated compacts leave "sediment" layers in context that affect output unpredictably — a fresh, empty context gives more predictable, higher-quality output and fewer tokens; compacting multiple times is considered an anti-pattern; the instructor compacts rarely (once per conversation), mainly after a big session when adding feedback or when debugging a complex error, and treats the goal as a harness that never needs compacting; caveated as opinion/mental model.
- Learner-relevant: The mechanical behavior of the auto-compact buffer; the sediment argument for preferring `clear` over `compact`; when compact genuinely pays off (long debug sessions, follow-up feedback).

### Lesson 27
- Locator: `[[sources/ai-coding-for-real-engineer/lesson27.en.srt]]`
- Summary: Introduces the Handoff skill: a way to condense the current conversation into a temporary markdown file so a fresh agent session can continue a subtask in its own context window without clearing or growing the original session.
- Key claims: When a side task (bug fix, test fix) surfaces mid-session, it doesn't make sense to clear context (you still need the main task) nor to run it in the same window; handoff writes a doc to a temp path, suggests skills for the next session, avoids duplicating content already in other artifacts (links instead), and tailors the doc to what the next session will focus on if the user passes instructions; use cases: fixing a discovered broken test in a separate session, splitting off a specific part of a long GrillMe to grill/prototype/research in a fresh window, then handing back; enables expand-then-contract flows passing documents back and forth; offered as the answer to "what to do when a grilling session goes into the dumb zone".
- Learner-relevant: The handoff pattern for context-window management across sessions; a concrete skill file to inspect; mental model of sessions as compressible/expendable work units.

### Lesson 28
- Locator: `[[sources/ai-coding-for-real-engineer/lesson28.en.srt]]`
- Summary: Introduces AGENTS.md (Claude Code's variant: CLAUDE.md) as the persistent project memory mechanism for teaching the agent preferences and conventions.
- Key claims: AGENTS.md is an open format — "a readme for agents" — supported by Gemini CLI, Devin, Codex, Cursor, but notably not Claude Code, which reads only CLAUDE.md; a CLAUDE.md at the repo root is pulled into every conversation with no opt-in (global scope); everything in it costs tokens on every request — a 2000-line file burned ~10% of context, and real-world files of 500–1000 lines exist; the `/init` command auto-generates a CLAUDE.md by exploring the repo, but the instructor doesn't recommend it because much of it is discoverable by the agent itself and goes stale quickly; Claude Code injects a system reminder saying the CLAUDE.md content "may or may not be relevant" and the model may ignore it, so steering is not fully reliable; summary: AGENTS.md and CLAUDE.md are the same concept except Claude Code only listens to CLAUDE.md; it's global, ignored by design, and should only hold content relevant to every request.
- Learner-relevant: The global/token-cost/ignored trade-offs of CLAUDE.md; why `claude init` is risky; the discipline of keeping memory files minimal and universal.

### Lesson 29
- Locator: `[[sources/ai-coding-for-real-engineer/lesson29.en.srt]]`
- Summary: Exercise: implement a bookmarks feature (private, persistent, in-line only, no dedicated page) from a provided plan, with a CLAUDE.md rule ("object parameters instead of positional params") deliberately conflicting with the codebase's existing style.
- Key claims: The plan for the bookmarks feature is provided to copy-paste into Claude; a CLAUDE.md rule was added that objects with multiple same-type parameters should take an object parameter, because positional params like `addUserToPost(userId, postId)` are easy to swap by mistake; the dummy repo is full of the positional pattern, so the exercise is a conflict: codebase convention vs CLAUDE.md instruction — observe which wins and note patterns you'd want to steer against; this builds an instinct for steering the LLM, even though CLAUDE.md may not be the perfect steering vehicle.
- Learner-relevant: The object-params design rule itself; the experiment of pitting memory-file rules against codebase conventions; observing generated code for steer-worthy patterns.

### Lesson 30
- Locator: `[[sources/ai-coding-for-real-engineer/lesson30.en.srt]]`
- Summary: Solution video: shows the CLAUDE.md steering winning — the Bookmark Service uses the `opts` object pattern from the memory file for all its functions — then fixes a gap where the agent wrote no tests, by adding a durable CLAUDE.md rule and re-running the agent.
- Key claims: The agent obeyed the CLAUDE.md object-parameter rule (matched the same `opts` parameter name) across `isLessonBookmarked` and `getBookmarkedLessonIDs`; it built schema, migration, BookmarkService, and LessonViewer but wrote no tests because the plan didn't mention them — a high-value CLAUDE.md instruction; the added rule: "Anything marked as a service by the name of the file ... should have tests written for them in an accompanying test.ts file"; this is high-leverage because it names no specific files, so it won't rot or go stale — "service" is sticky project jargon that will keep meaning "a tested unit"; CLAUDE.md changes are not picked up mid-session, so the instructor told the running agent to "review your work with the updated CLAUDE.md in mind" rather than starting a new session; 10 tests passed and the feature QA'd working (bookmark added to the section header), all while staying inside the smart zone.
- Learner-relevant: Evidence that memory-file rules can override codebase conventions; the recipe for a durable, rot-resistant rule (convention-based, not file-based); the trick of re-reviewing with an updated CLAUDE.md without a fresh session.

# Digest part 3 — lessons 31–45

## Overview (L1)
- lesson 31 — A bloated CLAUDE.md dumps every instruction into global scope where it competes with the prompt; introduces *progressive disclosure*: split instructions into separate files and link to them so the agent pulls only what it needs
- lesson 32 — Agent Skills: an open format (invented by Anthropic for Claude Code) for progressively disclosed instructions — folders of scripts/resources the agent *discovers*; only name + description is visible until the agent invokes the skill
- lesson 33 — Exercise: use the "Write a Skill" skill to refactor a CLAUDE.md full of coding standards into a coding-standards skill with progressively disclosed reference docs
- lesson 34 — Solution: dictating to Claude Code produces a short SKILL.md with 5 reference files (database, front-end, routes/forms, services, testing) and a tiny CLAUDE.md context pointer; explains *context pointers* and double-linkage
- lesson 35 — Claude's automatic memory: the `memory` command surfaces user memory, project memory, and an auto-written `memory.md`; check it periodically because auto-memory can go stale or conflict with your intent
- lesson 36 — Section intro on big builds: tasks too large for one context window must be split across sessions using two documents — a PRD (destination) and a plan.md (journey) — prompted as "do phase N" + PRD + whole plan
- lesson 37 — Exercise: the "to PRD" skill turns a grill-me conversation into a PRD; task is to grill then write (not implement) a PRD for an instructor analytics dashboard
- lesson 38 — Solution walkthrough: grilling the analytics dashboard shapes scope (revenue + ratings, time-series with range selector, line chart, KPI strip, sales vs enrollments) and to-PRD emits problem statement, user stories, implementation/technical/testing decisions and an out-of-scope list
- lesson 39 — Exercise: the naive plan — new session, pull PRD with `@`, "turn this into a multi-phase plan, save as a local markdown file" and nothing else
- lesson 40 — Solution critique: the naive plan is horizontal (all of a layer per phase), over-specified with function names that will go stale, and fails to reference the PRD's user stories
- lesson 41 — *Tracer Bullets* (from The Pragmatic Programmer): two words that flip LLM planning from horizontal layers to vertical slices, giving early, frequent feedback; the AI already knows the concept
- lesson 42 — Exercise: run the "PRD to plan" skill (written with copious tracer-bullet mentions) in a clean session, after deleting the naive plan, and compare outputs
- lesson 43 — Solution: the skill explores (using a cheaper model), proposes phases and asks for feedback; the result is 3 vertical-slice phases referencing PRD user stories with durable decisions only
- lesson 44 — Exercise: implement it — pass PRD + plan to a fresh session, say "do phase one", clear the context per phase, and commit at the end of each phase
- lesson 45 — Solution: watching tracer-bullet implementation — minimal-but-working service, tests, QA, a chart bug fixed in-context, admin role checks, and the payoff of detailed commit messages as context for future sessions

## Sections (L2)
### Lesson 31
- Locator: `[[sources/ai-coding-for-real-engineer/lesson31.en.srt]]`
- Summary: Shows a realistic, team-bloated CLAUDE.md and argues that putting every instruction in global scope wastes context — all instructions compete with the prompt even when a session only touches front-end code. Groups the instructions into per-topic files that CLAUDE.md links to, and names the underlying principle: progressive disclosure.
- Key claims: A CLAUDE.md with many instructions makes every instruction a gray blob in the context window whether it is relevant or not; instructions that are likely to be needed together should live in the same file; instead of throwing all complexity at the agent at once, give it a map (links) to navigate — progressive disclosure from UI/UX design; this idea recurs throughout the course (steering, architecture, codebase design).
- Learner-relevant: Audit your own CLAUDE.md for rules that only apply to a minority of sessions; split them out and link them instead of letting them bloat every request.

### Lesson 32
- Locator: `[[sources/ai-coding-for-real-engineer/lesson32.en.srt]]`
- Summary: Introduces Agent Skills as the community-standard way to do progressive disclosure when steering agents. Skills are folders of instructions, scripts, and resources; by default only the skill's name and description reach the agent, which can then "call" the skill when needed. Shows two real example skills and the frontmatter that controls who can invoke a skill.
- Key claims: Skills are an open format accepted across coding agents (Claude Code/Anthropic invented it, then gave it away); the agent only sees name + description by default and can choose to load the rest; example skills — "PNPM not found" (run `corepack enable`) and "better SQLite3 rebuild" (run `npm/pnpm rebuild` on node-module/Node-version mismatch) — are ideal because the errors are rare but high-leverage to fix; skills can bundle scripts (referenced by markdown link) and even images; skills live project-scoped (easy to share with teammates) or user-scoped; the `skills` command lists available skills; frontmatter `disable model invocation: true` hides the description from the model (user-invoked only), while `user invocable: false` hides it from the command list (model-invoked only); skills must have a name + description to be valid/distributable.
- Learner-relevant: Convert your own recurring error-fixes and framework notes into skills; use `disable model invocation` for skills you always want to run yourself.

### Lesson 33
- Locator: `[[sources/ai-coding-for-real-engineer/lesson33.en.srt]]`
- Summary: Sets up an exercise: the best way to learn to write a skill is to use a skill to write a skill. The repo ships a "Write a Skill" skill; the learner should use it to package a ~100-line CLAUDE.md of coding standards into a progressively disclosed coding-standards skill, leaving only a reference to the skill in CLAUDE.md.
- Key claims: Keeping all coding standards in CLAUDE.md means every request pays the context cost whether it needs them or not; a skill keeps them available without actively pushing them into context; the conversation with the agent matters and is left to the learner, with the solution shown next.
- Learner-relevant: Practice the "use a skill to write a skill" meta-technique; think about which context you are paying for on every request.

### Lesson 34
- Locator: `[[sources/ai-coding-for-real-engineer/lesson34.en.srt]]`
- Summary: Solution run — dictates the coding-standards-skill idea into Claude Code, which eagerly groups the CLAUDE.md rules into five reference files and a concise SKILL.md that points to them; CLAUDE.md shrinks to a single pointer. Explains the resulting context-pointer chain and why double-linking improves pickup.
- Key claims: Resulting structure — reference files: database, front-end & UI, routes & forms, services, testing, plus a short SKILL.md whose description ("Project coding standards for this codebase... use whenever writing or reviewing code, conducting a review, or implementing any feature") loads into context; the chain is agent → skill description → SKILL.md → reference files, and a pointer in CLAUDE.md gives a second context pointer so the skill is more likely to be used; reference files can grow without bloating the parent context because the agent reads them only when needed; a trimmed description (drop the redundant "Skill.md indexes" line) keeps the loaded text small; this pattern can standardize coding standards across an organization.
- Learner-relevant: The "context pointer" pattern — a chain of short links the agent follows on demand — and trimming skill descriptions to the essential trigger phrases.

### Lesson 35
- Locator: `[[sources/ai-coding-for-real-engineer/lesson35.en.srt]]`
- Summary: Walks through Claude's automatic memory feature: running `memory` in a fresh instance shows user memory (user CLAUDE.md), project memory (project CLAUDE.md), and an auto-memory folder where Claude writes its own steering documentation over time.
- Key claims: Auto-memory is relatively new and lets Claude steer itself between sessions; a real example wrote per-project rules like `npm install --force` instead of `--legacy-peer-deps` and testing patterns (`effect DB test with pg-lite`, `vMock is hoisted`); the instructor is cautious — some hints are redundant, some refer to already-deprecated behavior (e.g. `push schema`) and soon-to-be-removed platforms (effect platform node); recommend reviewing the auto memory file every couple of weeks to remove stale or conflicting content, because the worst failure mode of memory systems is going out of date with the repo.
- Learner-relevant: Know where auto-memory lives and treat it as editable, reviewable state rather than trusted ground truth; memory going stale is the core risk.

### Lesson 36
- Locator: `[[sources/ai-coding-for-real-engineer/lesson36.en.srt]]`
- Summary: Opens the big-build section: for tasks that cannot fit in one context window's "smart zone", the answer is breaking the task into small tasks that each run in a fresh window — but that needs planning documents that span multiple context windows. Names the two documents the community coalesced around.
- Key claims: Small features/bug fixes fit a single context window, but a large refactor bursts into the dumb zone; the fix is to decompose big tasks (how devs always have) and plan across windows; document 1 is the *destination* — spec/PRD (product requirements document) that encodes the human's taste; document 2 is the *journey* — a plan.md that breaks the PRD into phases; the prompt becomes "we're going to do phase N" + PRD + the entire plan, so phases don't step on each other's toes; writing great PRDs and plans is this section's topic.
- Learner-relevant: For any build too big for one window, keep two artifacts — destination (PRD) and journey (plan) — and pass both in each phase prompt.

### Lesson 37
- Locator: `[[sources/ai-coding-for-real-engineer/lesson37.en.srt]]`
- Summary: Presents the "to PRD" skill — it reads the current conversation context and produces a PRD locally. The workflow is: start with a grill-me session to figure out the destination, then, if it's too big to implement in the same window, call to-PRD. The PRD template is shown: problem statement, solution (both from the user's perspective), and a long numbered list of user stories.
- Key claims: The two-step flow is grill-me → to-PRD; the PRD template is still open to debate (the instructor expects the community to argue about its shape for years); the exercise is an instructor analytics dashboard — instructors currently can't see earnings, enrollments, completion/quiz rates, or lesson drop-off; the learner should grill, write the PRD, jot observations about the template, and commit the PRD without implementing.
- Learner-relevant: The grill-then-capture pattern converts an open-ended feature into a durable destination document you can hand to a fresh session.

### Lesson 38
- Locator: `[[sources/ai-coding-for-real-engineer/lesson38.en.srt]]`
- Summary: Full walkthrough of grilling the instructor analytics dashboard and running to-PRD. Tracks every scope decision, then shows the resulting PRD structure. A running theme is that the human stays in charge of taste while the agent grills adversarially.
- Key claims: Scope decisions — cross-course overview (not per-course), a new analytics route (not merging into the instructor page), admins need access too, pull back to a revenue-focused dashboard with ratings (drop quiz/geo), time-series with a range selector (7d/30d/12m/all) kept as a URL parameter, single aggregate line chart plus a sortable per-course table, table columns list price/revenue/sales/enrollments (sales ≠ enrollments because of team purchases)/average rating + count, published-only filter, KPI strip (total revenue, enrollments, average rating), line chart via bare recharts (not a shadcn wrapper), sidebar nav item, 30-day default, and a single "no revenue data yet" empty state; implementation details can and should be specified by the human; running two or three grill-me sessions in parallel while one plans is a technique; when the agent's questions get rapid-fire and obvious, shared understanding is near; to-PRD read the context (~52.2k tokens) and produced problem statement, solution, numbered user stories (as an instructor I want X so that Y), implementation decisions (new analytics service module, instructor route, admin instructor route, shared component), technical decisions, testing decisions, an out-of-scope list, and further notes.
- Learner-relevant: A fully-worked example of turning taste into a constrained PRD — including the sales-vs-enrollments domain nuance that separates a good spec from a fuzzy plan.

### Lesson 39
- Locator: `[[sources/ai-coding-for-real-engineer/lesson39.en.srt]]`
- Summary: Exercise for the "naive" plan.md: in a fresh Claude Code session, pull the PRD in with `@`, and say only "turn this into a multi-phase plan and save it as a local markdown file" — nothing else. The learner should note what it creates and how they would improve it, especially phase/task sizing.
- Key claims: There is a good and a naive way to write plan.md, and this lesson deliberately produces the naive one; task sizing and what happens inside each context window are the most important judgments.
- Learner-relevant: See what an unspec-ed plan produces so you can later compare it against the skill-driven plan.

### Lesson 40
- Locator: `[[sources/ai-coding-for-real-engineer/lesson40.en.srt]]`
- Summary: Reviews the naive plan Claude produced (an explore then an eager write). It is a four-phase, horizontally-layered plan: analytics service first, then the shared dashboard component + recharts, then the route that uses the UI, then the admin route and link. The instructor critiques it.
- Key claims: The plan is horizontal — each phase covers an entire layer, so there is no end-to-end feedback until a late phase; it over-specifies implementation by naming functions that may not exist when later phases run (they go stale the moment a human changes an earlier phase's implementation); it never references the PRD's user stories, losing the "why"; acceptance criteria per phase are a nice touch; task sizing is mostly reasonable (phase one may be heavy, phases 3+4 could be merged); being eager to produce an asset before grilling is a contrast with the rich to-PRD conversation.
- Learner-relevant: Recognize the failure signatures of naive agent planning — horizontal slicing, premature implementation detail, and lost traceability to the PRD.

### Lesson 41
- Locator: `[[sources/ai-coding-for-real-engineer/lesson41.en.srt]]`
- Summary: Two words that change how AI prioritizes and plans: Tracer Bullets, from The Pragmatic Programmer. LLMs naturally code horizontally (layer by layer), which delays any working-system feedback; tracer bullets force vertical slices that touch every layer per phase.
- Key claims: Systems have layers (database, API, front end, or services) that must integrate to produce something useful; LLMs plan horizontally — e.g. all of analytics-service in phase one, all of the component in phase two — so nothing can be validated until later phases; the WW2 anti-aircraft metaphor: tracer rounds let gunners see where their shots are going and adjust; in code, phases go through every layer so each phase yields feedback and validates the architecture across integration points; because tracer bullets are already a famous engineering concept, saying "use tracer bullets" (plus a short explanation) is enough — the AI just gets it; the instructor uses it for the rest of the course.
- Learner-relevant: Add "use tracer bullets / vertical slices" to planning prompts to force early, frequent, cross-layer feedback instead of horizontal layers.

### Lesson 42
- Locator: `[[sources/ai-coding-for-real-engineer/lesson42.en.srt]]`
- Summary: Exercise — run a new skill, "PRD to plan", in a clean, zero-context session to see if its output beats the naive plan. The skill was written using the skill-writing skill and is loaded with tracer-bullet mentions.
- Key claims: Invoke it as "PRD to plan" with the PRD passed in (`@...tab` autocomplete); for a fair test, delete the previous plan file first so the LLM can't read and manipulate it; observe whether the new plan improves on the naive one and how it could be improved further.
- Learner-relevant: Compare planning outputs under controlled conditions (clean session, no stale artifacts) — a fair-experiment habit for evaluating agent tools.

### Lesson 43
- Locator: `[[sources/ai-coding-for-real-engineer/lesson43.en.srt]]`
- Summary: Runs PRD-to-plan. The skill explores the codebase first (using a cheaper Sonnet 4.6 model — good resource use), proposes a phase breakdown, and asks for feedback before writing the plan. The proposed phase one is a true vertical slice: analytics service + instructor route + summary cards.
- Key claims: Phase one is explicitly a tracer bullet "that wires up the full stack with the simplest possible data (three summary numbers)", so by its end you know the whole thing works and the unknown unknowns are flushed out; the human merged phases 2+3 (both UI concerns) and 4+5 (admin access + empty states, same code area) into a 3-phase plan; the resulting plan describes each phase with what to build and which PRD user stories it references, with far less implementation leakage than the naive plan; the skill instructs the model to "identify durable architectural decisions before slicing" — high-level decisions unlikely to change — because you shouldn't plan what you can't plan; the durable decisions it captured: route location, schema, new analytics service, auth helper, dependencies.
- Learner-relevant: The "durable decisions only, plan what you can't know later" principle, plus the value of a planning skill that proposes then asks before committing.

### Lesson 44
- Locator: `[[sources/ai-coding-for-real-engineer/lesson44.en.srt]]`
- Summary: Implementation exercise. With the PRD and plan in hand, open a new session, pass both files, and prompt "do phase one" with edits accepted (Shift-Tab, no plan mode) — just let it churn out code. Then choose how to run subsequent phases.
- Key claims: Expect an explore phase first; after phase one you can either continue in the same context or clear the context and rerun the same prompt for phase two (default to clearing at the end of each phase if unsure); commit at the end of each phase to have a safe point to return to; the payoff is "watching it roll down the hill" because the spec and plan are already done.
- Learner-relevant: The context-clearing and per-phase-commit cadence for keeping each implementation window in the smart zone.

### Lesson 45
- Locator: `[[sources/ai-coding-for-real-engineer/lesson45.en.srt]]`
- Summary: Runs the whole 3-phase implementation. Each phase explores (~1 minute), writes the minimum to satisfy the tracer bullet, runs tests, then the human QA's in the UI and commits. Ends with the big picture: once destination and journey are clear, implementation is mostly hands-off and the approach scales.
- Key claims: Phase one kept the analytics service minimal ("just enough to satisfy the tracer bullet"), ran 12 passing tests, and landed the dashboard + route at ~32k tokens — well inside the smart zone; QA immediately revealed a bug ("free" shown as total revenue) queued for the later bug-report loop; switching instructors showed correct per-instructor data; the instructor cleared context at ~34k for phase two — the re-explore costs ~30 seconds but lands at ~15.5k in the smart zone; a show-stopper (no visible lines on the chart) was fixed in the same context at ~30k, and the guidance is: if you're heading into the dumb zone, clear + commit and start a new session from just that bug, or batch several bug fixes; committing with Claude Code is recommended because detailed commit messages become high-value context/signal for future Claude instances — "commit history matters again"; phase three added the admin route enforcing the admin role and validating instructor ID, plus empty states, and was QA'd as admin (breadcrumb, "view analytics" button, same view as the instructor); a non-admin hitting the route got a 401 where a 404 would be preferable (don't reveal the page exists) — logged to backlog; the summary claim: with a clear PRD and a tracer-bullet plan, implementation is mostly autonomous, and this scales to very large builds (just longer PRD + more journey planning).
- Learner-relevant: A complete end-to-end reference for the PRD → tracer-bullet plan → phased implementation → QA → commit loop, including when to clear context, when to fix bugs in-window, and why commit messages are the durable signal that carries state between sessions.

# Digest part 4 — lessons 46–60

## Overview (L1)
- lesson46 — Brief aside on Claude's "ask user question" tool UI: an opt-in multiple-choice question widget; the instructor dislikes it and suppresses it via his global CLAUDE.md ("don't use the ask user question tool").
- lesson47 — Live office-hours Q&A (morning session, cohort 4): biggest workflow change (GitHub as first-class agent runner via Sandcastle in GitHub Actions), HITL vs AFK tasks, short-skill philosophy, where to apply steering (review > planning/CLAUDE.md/implementation), dumb zone & context management (handoff, compact, ~120k dumb-zone line), progressive disclosure via context pointers, automated review pipeline, distrust of memory systems, goal vs Ralph loop, MCP vs cached research.
- lesson48 — Live office-hours Q&A (afternoon session): encoding best practices (e.g. DDD) into every skill plus a review agent; cheap-implementation + expensive-review split; tactical vs strategic programming (strategic survives AI); model adoption (adopt day one, employee-evaluation analogy); grill→PRD→issues in one session; handoff vs fork/compact; don't optimize cost; memory.md rant; SDLC collapse (implementation ≈ zero, more planning/QA); golden-hammer mindset; making a pre-AI code base AI-ready via test seams and feedback loops.
- lesson49 — Thought experiment refuting "code is cheap": software quality matters more in the AI age; agents copy the code base (their biggest input) and are more sensitive to a bad code base than humans, so AI currently accelerates software entropy (easy-to-change definition from *Philosophy of Software Design*, entropy from *The Pragmatic Programmer*).
- lesson50 — Feedback loops: proactive steering (CLAUDE.md/skills) only raises probability, feedback loops enforce quality deterministically; strong types (TypeScript) and automated tests (vitest) are the core loops; introduces the "do work" skill (plan → implement → seek feedback → commit).
- lesson51 — Exercise: use the writer skill to create a do-work skill for the repo, instructing the agent to plan, implement, seek feedback via `pnpm typecheck` / `pnpm run test`, then commit.
- lesson52 — Solution walkthrough: review the generated do-work skill; keep it ~35 lines and project-local (not user-global); five-step workflow (understand → plan → implement → validate → commit); don't over-steer with all-caps or excessive rules.
- lesson53 — Exercise: run the do-work skill on the in-app-notifications PRD (instructors can't see when students enroll); fresh Claude Code session, pass plan + PRD, "do phase one", and observe whether the agent follows the skill and runs the feedback loops.
- lesson54 — Solution: do-work skill in action — agent explores, skips replanning, implements, hits a failing ordering test (fixes with ID-desc tiebreaker), runs typecheck/test loops, commits (allowed via `git add`/`git commit` wildcards); QA confirms the enrollment notification flow end-to-end.
- lesson55 — Pre-commit hooks: deterministically enforce feedback loops before every commit; the friction humans hate (long waits) is free for agents; set up husky + lint-staged + prettier, plus typecheck and test in `.husky/pre-commit`; verified by pushing a failing test that the hook blocks and the agent then fixes.
- lesson56 — Red-Green-Refactor / TDD (Kent Beck, *Extreme Programming Explained*): write a failing test first, prove the bug, minimal implementation to go green, refactor while keeping CI (types + tests) green; combined with tracer bullets (one vertical-slice test at a time) it forces testable code, gives the agent feedback before writing code, and is hard for the LLM to fake.
- lesson57 — Exercise: update the do-work skill's implementation step to red-green-refactor in tracer-bullet style, backend only (no frontend test setup yet); then test it on the coupon-redemption-notifications PRD (team admins need to know when coupons are redeemed).
- lesson58 — Solution: models already know TDD, so the skill stays short; repeat red→green per test with one refactor at the end; agent writes failing tests (more than one — slightly rushing), goes green in the coupon service, updates frontend, validates, commits (hook runs again); QA: redeemed-coupon notification reaches the team admin; note it didn't strictly follow tracer-bullet (would emphasize it more in the skill).
- lesson59 — AFK agents: "do phase N" is a human-in-the-loop for-loop that can be automated; inspired by Geoffrey Huntley's Ralph-Wiggum loop article; the instructor's "AFK agents" pattern (renamed) sends well-specified tranches of work to run without supervision; Dec 2025 was the inflection point where models got good enough; all prior lessons (feedback loops, planning, specs, tracer bullets) lead here.
- lesson60 — Ramping up to AFK agents: work interactively first so you don't make mistakes you can't see; two run modes — `interactive.ts` (no sandbox, uses a prompt.md that mimics the final agent) and `main.ts`; introduces Sandcastle, the instructor's tool for running any agent inside any sandbox provider (Claude Code + docker/podman/Vercel or custom).

## Sections (L2)

### Lesson 46
- Locator: `[[sources/ai-coding-for-real-engineer/lesson46.en.srt]]`
- Summary: A short aside about the Claude-specific "ask user question tool" — a UI that presents the agent's clarifying questions as selectable multiple-choice options or a free-text field instead of plain chat text.
- Key claims: The tool is Claude-only (as far as the instructor knows, others may copy it with different naming); it is opt-in per prompt or skill ("use the ask user question tool"); the instructor dislikes it and has "don't use the ask user question tool" in his global CLAUDE.md so he never sees it; if you like it you can add it to your skills/prompts instead.
- Learner-relevant: Anchor: global CLAUDE.md is a personal preferences layer that can suppress or enable agent behaviors (here a UI widget) across all sessions.

### Lesson 47
- Locator: `[[sources/ai-coding-for-real-engineer/lesson47.en.srt]]`
- Summary: Morning office-hours Q&A covering the instructor's current workflow and philosophy: his biggest recent change is using GitHub as a first-class runner for agents (Sandcastle inside GitHub Actions triggered by issue labels), rather than only local/Docker runs; he warns against pathologically tracking every model release and instead advises focusing on your own skills.
- Key claims: Tasks split into HITL (human-in-the-loop, e.g. grilling) and AFK (away from keyboard) tasks — plan/review with HITL, execute with AFK; cloud sandboxes make isolation trivial compared to local work trees; skills should be short and cut down aggressively ("delete as much as you can", short skills are easier for the agent to consume and maintain); steering instructions belong in automated review, not in planning, CLAUDE.md, or implementation (all worse spots); dumb zone sits around ~120k tokens and 250k-token start contexts are "mad"; hand off (markdown handoff artifact) or `/compact` when hitting the dumb zone; progressive disclosure via context pointers (CLAUDE.md → docs/coding-standards.md → deeper files) beats dumping rules into the context window; automated review then human review (implementation → automated review → commits + observations → human final check); he distrusts memory systems because stateless agents are easier to optimize; goal mode blows through context vs AFK/Ralph loops which slice work into vertical slices in the smart zone; he doesn't use MCP servers and prefers caching research into local markdown files; code quality matters more than ever because an agent is "an external contractor on their first day every single time".
- Learner-relevant: Anchor: the HITL-vs-AFK split, the review-is-where-to-steer rule, and the "agents are always new starters" framing all recur in later lessons (do-work skill, git hooks, AFK agents).

### Lesson 48
- Locator: `[[sources/ai-coding-for-real-engineer/lesson48.en.srt]]`
- Summary: Afternoon office-hours Q&A continuing the same themes: how to enforce a practice like DDD (encode it into every skill you use plus a review agent — e.g. spend fewer/cheaper tokens on implementation and let an expensive review agent check against the spec, coding standards, and best practices), tactical vs strategic programming, and how AI reshapes the SDLC.
- Key claims: TDD / red-green-refactor is recommended (covered in week 2) because agents excel with feedback loops; tactical programming (narrow, short-term) is ~90–95% eaten by AI while strategic programming (long-term design, velocity) remains the human's job — and strategic skills are what you should pitch for career progression; context-window size is partly marketing — the smart zone is a working assumption; adopt new models day one without formal evaluation, but design processes "so any employee can succeed" and switch providers quickly; write skills when you find a gap needing a reusable command (e.g. a diagnose skill), keep them concise and security-vet them; produce a handoff artifact every time you touch an AI as a team (summarize the call → grill → PRD → issues; don't clear context between grilling and PRD, since the PRD is the handoff artifact); large projects aren't inherently more expensive to explore — make code bases easy to explore (shared language, deep modules); handoff is more flexible than branch-fork+compact (works across projects/agents, e.g. hand off from Claude to Codex); don't optimize for cost — optimize for quality or you spend your own time fixing agent mistakes; he hates Claude Code's memory.md ("garbage", wants full context-window control); SDLC shifts to planning-heavy and QA-heavy since implementation ≈ zero time and estimates break; he does research without AI (books + an Obsidian graph) and is building a "teach" skill; AI turns immersive tasks into process/AFK tasks ("golden hammer" is fine — e.g. a Todoist label → webhook → Sandcastle server that gathers everything you need); onboarding a legacy code base = same medicine as *Working Effectively with Legacy Code* (Michael Feathers, 2004): add test seams and feedback loops.
- Learner-relevant: Anchor: the "cheap implementation + expensive review" pattern and "make the code base easy to explore" directly feed the feedback-loop section that follows (lessons 49–58).

### Lesson 49
- Locator: `[[sources/ai-coding-for-real-engineer/lesson49.en.srt]]`
- Summary: A thought experiment against the "code is cheap" mantra: with agents churning out code, some claim bugs and quality no longer matter because you can always churn out fixes; the instructor argues the opposite — software quality matters more now and agents are *more* sensitive to a bad code base than humans.
- Key claims: Software quality = "is the code base easy to change?" (John Ousterhout, *The Philosophy of Software Design*), including how related info is grouped, whether changes ripple, and the quality of feedback loops; software entropy (*The Pragmatic Programmer*) means code tends toward worse, and every thoughtless commit raises the "cludge meter"; AI massively increases commit volume but is currently bad at entropy-saving commits (design/refactor — the hardest engineering task); the three inputs to any AI session are the prompt, steering (skills/CLAUDE.md), and the code base — and the code base is the most important because agents copy it as the source of truth; agents are stateless, so they can't develop memory/workarounds for a bad code base and have no feedback loops to detect bad code; "a code base that is hard to change is a killer for an AI agent" — garbage in, garbage out; therefore code is NOT cheap — cheap code just accelerates you to a maxed-out cludge meter where no agent can function; feedback loops are the essential defense.
- Learner-relevant: Anchor: this reframing motivates the entire feedback-loop section; the Ousterhout "easy to change" definition returns in lesson 48's tactical-vs-strategic discussion.

### Lesson 50
- Locator: `[[sources/ai-coding-for-real-engineer/lesson50.en.srt]]`
- Summary: Moves from steering (raising probability) to feedback loops (deterministically enforcing quality): the agent produces code → the loop gives feedback → the agent iterates until quality is sufficient.
- Key claims: Great engineers don't trust their instincts — they build feedback loops; applying the same practice to agents gives better output with more/better loops; strongly typed TypeScript over weakly typed JS (compile-time typo/type errors are feedback); automated tests that actually run the code give the highest-value signal; this repo already has `typecheck` (React Router TypeGen + TSC) and `test` (vitest) scripts, with service-level tests (e.g. `purchaseService.test.ts`); rather than putting loop instructions in CLAUDE.md for every session, create a per-repo **do-work skill** (plan → implement → seek feedback → commit) and invoke it on every change; it's the nicest way to steer the LLM into a loop you can iterate on.
- Learner-relevant: Anchor: the plan→implement→feedback→commit cycle is the skeleton for the next several lessons (do-work skill, pre-commit hooks, TDD, AFK agents).

### Lesson 51
- Locator: `[[sources/ai-coding-for-real-engineer/lesson51.en.srt]]`
- Summary: Exercise — write your own do-work skill using the writer skill inside a Claude Code instance: "write a skill that creates a do work skill that represents a unit of work within this repository… plan out the piece of work then implement, then seek feedback via the feedback loops in `pnpm typecheck` and `pnpm run test`, final step commits the code."
- Key claims: The skill should encode plan → implement → feedback-loop → commit for a unit of work; the instructions (typecheck/test by name) make it repo-specific; the learner is expected to end with a usable skill to put into practice next.
- Learner-relevant: Anchor: this is the "write the skill" half of the lesson-50 plan; the exact commands named should match the repo's own feedback loops.

### Lesson 52
- Locator: `[[sources/ai-coding-for-real-engineer/lesson52.en.srt]]`
- Summary: Solution walkthrough — reviewing the do-work skill Claude generated and trimming it to the essentials.
- Key claims: Keep the skill in the project directory (it's tied to the repo's structure and feedback loops), not the user/global directory; the generated five-step workflow is right — understand the task (read reference plan/PRD) → plan → implement → validate → commit; cut convention/file-list noise and "repeat until both pass with zero errors" harshness — AI doesn't need to be that hard-steered; drop advice about commit messages and staging (long commit messages are actually beneficial); make planning optional ("if the task has not already been planned, create a plan") because do-work usually runs against a large PRD or multi-phase plan; the final skill is ~35 lines and concise is better — the important part is just the five headings.
- Learner-relevant: Anchor: the light-steering principle — name the feedback loops, keep the skill short, let the agent fill in the rest — carries into the TDD skill edit later.

### Lesson 53
- Locator: `[[sources/ai-coding-for-real-engineer/lesson53.en.srt]]`
- Summary: Exercise — test the do-work skill on a prepared PRD: "in-app notifications" so instructors on the Cadence platform learn when new students enroll (they currently must check lists/dashboards manually).
- Key claims: The feature is small enough for a single-phase plan, making it a good do-work test; the invocation pattern is a fresh Claude Code session, invoke the do-work skill, pass in the plan (in-app-notifications) and the PRD, then say "do phase one"; the learner should observe whether the agent actually follows the skill's steps and runs the feedback loops, and note anything unexpected for Discord.
- Learner-relevant: Anchor: this exercise demonstrates the plan/PRD/phase invocation convention that later becomes the AFK-agent prompt format.

### Lesson 54
- Locator: `[[sources/ai-coding-for-real-engineer/lesson54.en.srt]]`
- Summary: Solution — running the do-work skill on the notifications feature: the agent explores, skips replanning (it has the plan + full context), implements, validates, and commits.
- Key claims: The agent's task list includes "validate with type check and tests", so the do-work skill is doing its job; configure permissions narrowly — allow `pnpm run typecheck` and `pnpm run test` in `.claude/settings.local.json`, not a broad `pnpm run` (which would also permit migration scripts); a test failed (both notifications got the same `createdAt` timestamp, fixed by ordering by ID descending as a tiebreaker) — the instructor accepts this slightly weird dependency because the feedback loop will catch future ID changes; he permits `git add`/`git commit` wildcards since commits are always rollback-able; QA: James Park enrolls in a Marcus Johnson course and Marcus receives the "James Park enrolled in Building REST APIs with Node.js" notification linking to his student roster; minor "paper cuts" (bell misalignment) are acceptable; the do-work skill is now a canvas to layer more workflow complexity onto.
- Learner-relevant: Anchor: concrete lesson in scoping permission allow-lists — grant the specific commands the feedback loop needs, not the whole prefix.

### Lesson 55
- Locator: `[[sources/ai-coding-for-real-engineer/lesson55.en.srt]]`
- Summary: Git hooks — making the feedback loops run deterministically before every commit instead of relying on the agent's discretion.
- Key claims: A pre-commit hook runs before each commit and can fail the commit with typecheck/tests; the 3-minute wait that annoys human developers is irrelevant to an agent (it just waits), so the friction flips from negative to a feature; setup via husky (manages hooks) + lint-staged (runs formatting only on staged files) + prettier, plus `pnpm typecheck` and `pnpm run test` in `.husky/pre-commit`; the result: the AI deterministically cannot commit unformatted or failing code; demonstration: after setup, a deliberately broken test blocks the commit with a clear error ("expected x to have a length of 999 but got 5"), the agent sees it, fixes/restores the code, and commits — a beautiful deterministic feedback loop every project should have.
- Learner-relevant: Anchor: hooks are the "enforce, don't just encourage" counterpart to the do-work skill's requested loops; expect a pre-commit hook to also fire during the later TDD exercise.

### Lesson 56
- Locator: `[[sources/ai-coding-for-real-engineer/lesson56.en.srt]]`
- Summary: Teaches red-green-refactor / test-driven development (Kent Beck, *Extreme Programming Explained*) as the implementation technique to bake into the do-work skill so implementation *increases* code quality rather than eroding it.
- Key claims: TDD says tests drive development, which is even more true in the AI age where feedback loops matter; the red-green-refactor loop: write a failing test first and run it (red) to prove the bug exists, write a minimal implementation to make CI green, then refactor while keeping CI green (CI = types + tests); for AI, a failing test first lets it run and test code before writing it, forces the code it creates to be testable (hence changeable), and lets it instrument with logs; combining red-green-refactor with tracer bullets (one failing vertical-slice test → minimal implementation → next failing test) stops the AI from spraying a horizontal layer of mostly-fake tests; seeing a test go red then green is hard for the LLM to fake, so the user gains confidence; each cycle leaves the repo with better tests on existing code.
- Learner-relevant: Anchor: "writing a failing test first is hard for the LLM to fake" is the verification insight — it previews the /tackle-style confidence the learner should feel when watching the agent.

### Lesson 57
- Locator: `[[sources/ai-coding-for-real-engineer/lesson57.en.srt]]`
- Summary: Exercise — modify the do-work skill so its implementation step uses red-green-refactor: one test at a time in a tracer-bullet style, and backend only (the repo has no frontend-facing test setup yet — that comes later).
- Key claims: Then test the skill on a new PRD — coupon redemption notifications for team admins (admins buy seats, distribute coupons, but have no way to know when coupons are redeemed; solution: extend the existing in-app notification system to alert team admins when a coupon belonging to their team is redeemed); a small feature with backend changes, ideal for TDD; same invocation as before: fresh session, do-work skill, PRD + plan, "do phase one"; watch the agent go through the red-green-refactor loop.
- Learner-relevant: Anchor: note the deliberate backend-only scope decision — the skill must be matched to the feedback loops the repo actually has (recurring principle).

### Lesson 58
- Locator: `[[sources/ai-coding-for-real-engineer/lesson58.en.srt]]`
- Summary: Solution — updating the do-work skill to TDD, then running it on the coupon-redemption PRD end to end.
- Key claims: Models already know TDD/red-green-refactor — no need to point them at external docs; trim the verbose frontend branch to "implement directly without TDD" and keep the backend instruction to "use Red Green Refactor" (more vague guidance is better — it "ticks the latent space"); reorder so the agent repeats red→green per test and does one refactor at the end; the agent then explores (notifications + coupon systems), says "let me create tasks and start implementing with TDD — let me write the first failing test first"; it wrote several tests at once (slightly rushing — not strict tracer-bullet), red phase fails, green implements in the coupon service, all tests pass, frontend updated, final validate (typecheck + tests) runs, then the pre-commit hook runs the loops once more before committing; QA: Liam Thompson buys 5 seats, shares a coupon link, Matthew Pocock signs up and redeems it, and Liam sees "Matthew Pocock redeemed a coupon for Introduction to TypeScript — 4 of 5 seats remaining"; he'd re-emphasize tracer bullets in the skill for a real app since the agent skipped the one-test-at-a-time pattern; red-green-refactor builds a network of feedback loops that makes the AI one-shot the feature.
- Learner-relevant: Anchor: "cheap to generate tests because AI is patient" — the huge test network the agent leaves behind is itself the code-quality win, not just the feature.

### Lesson 59
- Locator: `[[sources/ai-coding-for-real-engineer/lesson59.en.srt]]`
- Summary: Introduces AFK agents — automating the "do phase N" command so the human doesn't sit and steer each phase of a multi-phase plan.
- Key claims: Multi-phase plans fit work into the agent's smart zone but require three inputs: the destination (PRD), the journey (plan), and a "do phase N" instruction — the latter is a human-in-the-loop for-loop that can be automated; around December 2025 models hit an inflection point where well-defined tasks could be sent off unsupervised; Geoffrey Huntley's article on the Ralph-Wiggum loop (running a simple for-loop prompt over tranches of work) inspired this; the instructor renamed the pattern **AFK agents** (away from keyboard) after drifting from Ralph's original vision; AFK lets you delegate huge amounts of code production while you plan future work or queue more agent runs — a game changer for throughput; everything learned so far (feedback loops, planning, specs, tracer bullets) converges on this.
- Learner-relevant: Anchor: "do phase N is a for loop" is the mental pivot — the human moves from loop-body executor to queue manager.

### Lesson 60
- Locator: `[[sources/ai-coding-for-real-engineer/lesson60.en.srt]]`
- Summary: Frames how the course will ramp up to AFK agents — there is a learning curve so you don't make mistakes you can't see; you interact with the agent and check in first, shipping prompt updates as you go.
- Key claims: Two run modes: `main.ts` (the eventual AFK runner) and `interactive.ts` (first, interactive mode using no sandbox to start, since sandbox setup is fiddly); the interactive mode uses a `prompt.md` that mimics what the later AFK agent will do, so you can watch and optimize the setup; this is powered by **Sandcastle**, the instructor's own tool for running agents in repos/sandboxes — pass in an agent (Claude Code), a sandbox provider (Docker, Podman, Vercel remote isolated sandboxes, or your own), and a prompt file or direct prompt; it fills what he sees as an ecosystem gap: a provider/sandbox-agnostic way to run agents; the next few exercises experiment with the interactive setup before going AFK.
- Learner-relevant: Anchor: "optimize the setup while you can still watch it" — the interactive→AFK progression is a safe-onboarding pattern for any delegation tool.

# Digest part 5 — lessons 61–75

## Overview (L1)
- lesson 61 — Intro to the AFK agent: the interactive Sandcastle script, prompt.md with code-block expansion, PRD/plan injection, running `npx tsx sandcastle/interactive.ts` to execute only phase one of the Admin Analytics plan.
- lesson 62 — Running the interactive AFK agent: it inlines the PRD and plan into the prompt, implements only phase one, needs permission approvals, commits, and produces a working tracer-bullet admin dashboard.
- lesson 63 — Why YOLO mode is unsafe; setting up a Docker sandbox (Docker Desktop or Podman), env vars (Anthropic API key), building the image, and smoke-testing with `sandcastle/test.ts`.
- lesson 64 — The AFK loop script (`sandcastle/main.ts`): positional PRD/plan args, `run` mode, `maxIterations` loop, and a `no more tasks` completion signal.
- lesson 65 — Running the full AFK loop: it detects phase one done, works phases two and three, commits per phase, signals completion, and returns working code with tests.
- lesson 66 — Switching from PRD+plan to an issue-tracker queue: the agent fetches open GitHub issues and prioritizes them (critical bug fixes → dev infra → tracer bullets → polish → refactors).
- lesson 67 — Setting up a private fork of the cohort repo with its own issue tracker so every learner's issues don't collide.
- lesson 68 — Wiring GitHub CLI into the prompt expansion: fetch open issues as JSON, task selection, close/comment on issues after commits; adding a GitHub PAT to env and filing a real bug issue.
- lesson 69 — The agent fixes the filed bug end-to-end: explores the repo, identifies the root cause, commits with hooks passing, closes the issue with an explanation; use fine-grained tokens so agents only get read/comment/close scopes.
- lesson 70 — Putting PRDs and plans into GitHub as issues so the AFK agent sees the whole backlog (features + bugs) and picks work itself; planning loop runs without touching the codebase.
- lesson 71 — Human-in-the-loop vs autonomous work: taste, judgment, and QA must stay human; the agent does the grunt work and applies the human's taste to the code.
- lesson 72 — Why multi-phase plans are awkward: Kanban boards with issue dependency graphs are more natural; introduces the `PRD to issues` skill (vertical slices, human-in-the-loop vs AFK, final QA issue), plus a naming fix note (`to issues`).
- lesson 73 — Exercise: paste a gamification PRD as a GitHub issue, run `PRD to issues` in Claude, then run a Ralph loop that picks up only AFK tasks.
- lesson 74 — Solution walkthrough: reviewing the vertical slices, merging small issues, creating five issues incl. a QA checklist issue, running the AFK loop (100 max iterations default), then manual QA of XP/levels/streaks.
- lesson 75 — Caching expensive explore phases: a pre-loop human research phase (research.md asset) cuts token spend and keeps the agent in the smart zone; research files need lifecycle auditing like steering files.

## Sections (L2)
### Lesson 61
- Locator: `[[sources/ai-coding-for-real-engineer/lesson61.en.srt]]`
- Summary: First exercise on the AFK agent. Instructor walks the Sandcastle `interactive.ts` script: `prompt.md` mirrors the `do work` skill but uses Sandcastle syntax — code blocks in backticks prefixed with `!` are executed and inlined into the prompt (e.g. `!cat <file>`), plus PRD and plan location arguments are read and injected. Students run `npx tsx sandcastle/interactive.ts` (npx runs arbitrary npm packages; tsx runs TypeScript files), answer an interactive UI for PRD/plan paths, and the agent executes only phase one of the Admin Analytics PRD (platform-wide revenue/perf metrics for admins).
- Key claims: Prompt files can expand shell commands inline via `!`+backticks; the AFK prompt should instruct the agent to explore the repo, complete one task, run feedback loops, then commit; the key rule is "only work on a single task" per run to avoid the dumb zone from multi-phase work in one context window; prompts are fully customizable.
- Learner-relevant: A template for building a one-task-per-run autonomous agent prompt that reuses the do-work skill structure, and the general npx/tsx invocation pattern for running scripts.

### Lesson 62
- Locator: `[[sources/ai-coding-for-real-engineer/lesson62.en.srt]]`
- Summary: Solution run of the interactive AFK agent. The prompt has the full PRD and plan inlined, only implements phase one (summary cards + root), writes code, still issues permission requests (not fully AFK yet), runs tests, commits, and reports phase one complete. Demo: logged in as admin Alex Rivera, the analytics dashboard shows basic summary cards for all-time (12 months).
- Key claims: Inlining the PRD and plan into the prompt keeps the agent aligned; permission requests are the only thing standing between this and a fully AFK loop; with permissions removed you get a repeatable loop that "churns code".
- Learner-relevant: Validates the single-phase tracer-bullet payoff and sets up the motivation for sandboxing to remove permission prompts.

### Lesson 63
- Locator: `[[sources/ai-coding-for-real-engineer/lesson63.en.srt]]`
- Summary: Permission requests block true AFK operation. YOLO mode (bypass all permissions) is dangerous — Claude Code docs restrict it to isolated containers/VMs because the agent may delete the home directory, exfiltrate company-sensitive code, or act on prompt injection. Claude's own sandbox can be escaped, so it's a non-starter. Solution: Docker sandbox — `main.ts` runs the agent in a Docker container (Node 22 + Claude Code installed, working dir `/home/agent`) with the repo bind-mounted in, so it sees only that directory and all bash runs inside. Setup: install Docker Desktop (or free Podman), fill `.env` from `.env.example` (Anthropic API key; using the Claude subscription is blocked by an unresolved legal issue), `pnpm sandcastle docker build image`, then smoke-test with `npx tsx sandcastle/test.ts` (prompt "hello how are you") and inspect live agent logs.
- Key claims: Unsupervised agents make dangerous choices, so restrict them to the smallest possible option set; Docker gives the agent repo access without host access; YOLO mode is only acceptable inside an isolated container/VM; Claude's built-in sandbox is escapable and untrusted.
- Learner-relevant: The concrete recipe for sandboxing an AFK coding agent with Docker/Podman and verifying it with a hello-world run.

### Lesson 64
- Locator: `[[sources/ai-coding-for-real-engineer/lesson64.en.srt]]`
- Summary: Building the AFK script proper in `sandcastle/main.ts`. Unlike the interactive version, PRD and plan come as positional CLI args (`npx tsx sandcastle/main.ts <prd-path> <plan-path>`). The script uses Claude Code in the Docker sandbox with the same prompt file, but three differences: `run` mode instead of `interactive`, `maxIterations`, and a completion signal. The loop re-runs the prompt up to `maxIterations` times or until the agent outputs `no more tasks` (the prompt instructs it to emit that when no tasks remain). Instructor usually sets max iterations high (10–50) trusting the completion signal.
- Key claims: AFK loops are a repeat-run loop terminated by an iteration cap or an explicit completion string in agent output; the completion signal is reliable enough to trust; model choice is passed straight through to Claude Code (Sonnet 4.6 preferred at time of filming over 4.7).
- Learner-relevant: The two termination mechanisms (max iterations vs completion signal) and how a looped prompt with a completion sentinel replaces interactive supervision.

### Lesson 65
- Locator: `[[sources/ai-coding-for-real-engineer/lesson65.en.srt]]`
- Summary: Solution run of the AFK loop. Logs show iteration 1 of 3: agent detects phase one already done, works phase two (revenue-over-time Recharts line chart), runs type checks/tests, fixes syntax, commits. Iteration 2: phases one and two done, builds the course breakdown table with instructor filter, commits. Ends with `no more tasks` emitted after two iterations, commit collection, context windows printed (64k then 80k). Result: working dashboard (revenue chart + per-course breakdown, filterable by instructor) while the instructor stepped away for tea.
- Key claims: Multi-iteration AFK runs resume from prior committed work ("phase one already done"); completion signal stopped the loop cleanly; tests were written throughout; planning pays off because you align the agent then point it at a direction; parallelizing yourself with the agent (human plans while agent codes) is "the future of development".
- Learner-relevant: A live demo that AFK loops compound — each iteration checks what's done, picks up the next phase, and commits, so you can walk away and return to working code.

### Lesson 66
- Locator: `[[sources/ai-coding-for-real-engineer/lesson66.en.srt]]`
- Summary: Moves the AFK agent from pointing at a PRD+plan to pulling from an issue-tracker queue so it picks its own next task. The prompt now fetches open GitHub issues and includes a task selection prompt with priority order: critical bug fixes → development infrastructure (tests/types/dev scripts) → tracer bullets for new features → polish/quick wins → refactors. This prioritization must be crafted carefully per project; it works well up to ~20–30 tasks, and you can winnow via GitHub labels or assignment labels. This creates a virtuous loop: agent produces code → human reviews → feedback/new issues → agent produces more code; the instructor used this setup to build Sandcastle itself (403 closed issues, a `ready for agent` label).
- Key claims: An AFK agent can both do a task and choose the next task if prompted carefully; priority order matters (fixing broken CI/app before stacking commits); the human-in-the-loop review loop is what makes the issue-tracker-driven approach productive; it scales to tens of tasks per batch.
- Learner-relevant: A concrete, reusable task-priority prompt and the GitHub-label pattern for signaling which issues the agent may pick up.

### Lesson 67
- Locator: `[[sources/ai-coding-for-real-engineer/lesson67.en.srt]]`
- Summary: Setup chore: each learner needs their own GitHub repo so issues don't collide (a plain fork of the instructor's repo would push everyone's issues into one shared pool). Steps: copy the local cohort project into a new directory, delete git history, create a new GitHub repo owned by the learner with its own issue tracker.
- Key claims: Forking the instructor's repo would share a single issue pool across every student ("total carnage"); a fresh repo with its own issue tracker isolates each learner's issues.
- Learner-relevant: The isolation reason behind giving each AFK setup its own issue tracker rather than a fork.

### Lesson 68
- Locator: `[[sources/ai-coding-for-real-engineer/lesson68.en.srt]]`
- Summary: Wiring GitHub to the AFK agent via the GitHub CLI. LLMs know the `gh` CLI extremely well, so it's an elegant interface. In the Sandcastle prompt expansion, `!gh issue list ... --json` returns open issues (number, title, body, comments) into the prompt; comments matter because they become the running record on an issue. After commit, the prompt says: if the task is complete, close the original GitHub issue; otherwise comment on it with what was done. A multi-phase plan can live in one issue and the agent just comments per phase, with comments pulled back into context next run. Setup: add a GitHub personal access token to `.env` (the Dockerfile already installs the GitHub CLI). Exercise: file a real bug issue (dev UI user selector doesn't close after selecting a user), rebuild the image for the new fork repo, run `npx tsx sandcastle/main.ts`.
- Key claims: GitHub CLI is a reliable LLM-GitHub bridge; issue comments double as an append-only work log the agent re-reads; the agent closes completed issues and comments on incomplete ones.
- Learner-relevant: The prompt patterns for GitHub-driven AFK work (fetch open issues as JSON, close on complete / comment on incomplete) and the PAT-in-.env setup.

### Lesson 69
- Locator: `[[sources/ai-coding-for-real-engineer/lesson69.en.srt]]`
- Summary: Solution run: the agent fetched the one open issue (37 tokens), explored the repo, found the dev UI component and API route, diagnosed the bug (form submits via React Router client-side navigation so the dropdown open state stays true and never closes), fixed it, committed with pre-commit hooks passing, ran `gh issue close` with an explanatory comment, emitted `no more tasks`, using a 30k context window. GitHub shows zero open / one closed issue with the resolution note. Answering the common worry: use a fine-grained access token scoped to only read/comment/close issues — not even issue creation. Verifying manually: switching user in the dev UI now closes the panel.
- Key claims: The full autonomous loop works end-to-end for a real bug (explore → fix → test → commit → close issue); scope agent tokens narrowly to the minimum actions; issue-close comments give observability into why work was done.
- Learner-relevant: Proof that a minimal issue-tracker-driven AFK agent can autonomously churn backlog items, and the security pattern (least-privilege tokens) that makes it safe.

### Lesson 70
- Locator: `[[sources/ai-coding-for-real-engineer/lesson70.en.srt]]`
- Summary: Extends the issue-tracker pattern to features: put the PRD and the plan into GitHub as issues (using the same templates) instead of local files, so the AFK agent sees the whole backlog — new features, bug fixes, tracer bullets — and prioritizes via its task selection prompt. The `PRD to plan` skill is updated to write issues. This means the entire planning loop (PRD → plan → issues) happens without creating local files that could mess up the AFK agent working in the codebase, and it lets you parallelize planning with implementation.
- Key claims: Storing plans as GitHub issues keeps the planning loop out of the codebase; the AFK agent then triages features and bugs together; this parallelizes human planning with agent implementation.
- Learner-relevant: The pattern of the human driving PRD→issues in their local loop while the AFK agent consumes only the issue backlog.

### Lesson 71
- Locator: `[[sources/ai-coding-for-real-engineer/lesson71.en.srt]]`
- Summary: Frame-setting for the human-in-the-loop section. An AFK agent can't do all your work; when planning a feature you must decide which parts are human-in-the-loop (you must be present) and which are autonomous. Human-in-the-loop work includes planning (the human holds the source of truth for what's being built) and QA (a human tests feel, speed, purpose — things absent from the AI's feedback loops). The unifying idea is "taste" — human judgment/feel applied to both external UX and internal architecture. Delegating 100% yields a tasteless app that often just doesn't work.
- Key claims: Human taste (judgment, feel, design sense) is required for planning, QA, and design choices; AI should do the grunt work and apply the human's taste to the code canvas; the best division is humans and AI each doing what they're best at.
- Learner-relevant: A framework for partitioning any feature's work into human-in-the-loop vs AFK, motivating the upcoming Kanban skill.

### Lesson 72
- Locator: `[[sources/ai-coding-for-real-engineer/lesson72.en.srt]]`
- Summary: Argues multi-phase plans are awkward for AI because human developers don't work that way — they use a Kanban board of issues with dependency (blocked-by) relationships. Kanban is less prescriptive, easier to extend (add an issue + a blocking relationship without rewriting the plan), and easier to QA (mark an issue done, QA it, file feedback as a new issue). Introduces the `PRD to issues` skill: locate the PRD, explore the codebase if needed, draft vertical slices (tracer bullets), mark each slice human-in-the-loop (architectural decision/design review) or AFK (implement+merge without human), prefer AFK where possible, and always create a final QA issue with a detailed manual QA plan — so you can step away and come back to a QA checklist. It then quizzes the user on granularity/dependencies and creates GitHub issues with a template referencing the parent PRD and a `blocked by` section. The Ralph prompt is adjusted to "work on the AFK issues only" and emit `no more tasks` when all AFK tasks are done (with a note you may want to enforce deterministically via labels). Closing edit: in the skills repo the skill is renamed `to issues` — it can turn anything in context (or a referenced issue) into vertical slices, not just PRDs.
- Key claims: Kanban issue graphs beat linear multi-phase plans for AI work — easier to extend and QA; separating AFK from human-in-the-loop slices lets the agent grind while the human holds taste; a final QA issue is a high-value deliverable; the agent must be told (or constrained) to skip human-in-the-loop issues.
- Learner-relevant: The full workflow — PRD → vertical slices (tracer bullets) → human/AFK labeling → dependency-linked GitHub issues → final QA plan — plus the failure mode of an agent touching human-only tasks.

### Lesson 73
- Locator: `[[sources/ai-coding-for-real-engineer/lesson73.en.srt]]`
- Summary: Hands-on exercise with the Kanban skill. A new gamification PRD (XP, levels, streaks user stories) is provided as a GitHub gist. Steps: copy the gist into a new GitHub issue, note the PRD issue number (e.g. 57), run `PRD to issues` in Claude Code passing that issue number, observe the breakdown, then run a Ralph loop on the resulting issues — it should pick up only AFK tasks and leave human-in-the-loop QA for review.
- Key claims: The Kanban skill converts a PRD issue into granular issues; a subsequent Ralph loop executes only the AFK slices.
- Learner-relevant: The end-to-end invocation: PRD as issue → `PRD to issues <number>` → Ralph loop over the generated issues.

### Lesson 74
- Locator: `[[sources/ai-coding-for-real-engineer/lesson74.en.srt]]`
- Summary: Solution run of the Kanban workflow. The skill reviews the PRD issue, explores the repo, and proposes slices: (1) XP on lesson completion + sidebar level display as a tracer bullet (XP events table, migration, XP service test, UI), (2) streak tracking, (3) quiz XP, (4/5) two small pieces, (6) full gamification verification QA plan. Instructor checks the first slice is a real tracer bullet, merges the two small slices, approves, and whitelists `gh issue create` in settings to skip per-issue permission prompts. Five issues are created (58–62), including a merged dashboard summary card + completion toast issue and a QA checklist issue (checkboxes for everything to verify) — showing the QA plan to the LLM reinforces the acceptance criteria. Then runs the AFK loop (now defaulting to 100 max iterations) full-AFK; after four iterations it completes all AFK issues, leaving only the PRD and the human QA issue open, with ~400 tests. Manual QA: run migration locally, verify XP on lesson completion, no duplicate XP on repeat, +5 XP on first quiz pass. Highlights: AFK and human-loop tasks are first-class, you can plan huge tranches before applying taste, QA can be broken into sections and delegated to team members.
- Key claims: Reviewing generated slices for tracer-bullet quality and merging too-small ones is part of the human role; whitelisting the exact CLI command in settings accelerates issue creation; a QA-plan issue makes human verification a first-class step the LLM also sees; 100 max iterations with the completion signal is a workable full-AFK default.
- Learner-relevant: A realistic human-in-the-loop review pass over AI-generated slices, and the observation that a QA plan issue is the human's entry point back into the loop.

### Lesson 75
- Locator: `[[sources/ai-coding-for-real-engineer/lesson75.en.srt]]`
- Summary: Caching expensive explore phases. Some work (integrating an external service without local/public docs, or hard-to-find things in a growing codebase) makes the explore phase of each context window long and costly; over many Ralph loop runs that spend adds up. The fix is a pre-loop human research phase: cache the external documentation and decisions into a local research asset (e.g. a `research.md` file about a library/service or an approach like SSE vs WebSockets). Research is a human-in-the-loop task because taste matters when choosing between libraries or multiple service mechanisms (streams vs webhooks). After the upfront research, every subsequent Ralph loop benefits and spends more time in the smart zone. Research files need a monitored lifecycle — audit them like steering files/CLAUDE.md/skills, since stale markdown hurts LLM performance.
- Key claims: Long explore phases repeated across a Ralph loop are a major token cost; caching exploration into a research.md before the loop cuts that cost; research is inherently human-in-the-loop due to taste; research files must be actively maintained or they become stale context that degrades performance.
- Learner-relevant: A concrete cost-control technique (research phase → cached asset → cheaper AFK loops) and a stewardship rule for keeping those assets fresh.

# Digest part 6 — lessons 76–90

## Overview (L1)
- lesson 76 — Assignment: use Claude Code to research several approaches for a "live presence indicator" feature, iterate with the user, back it up with web research, and save a research markdown document in `plans/` (no skill needed; the point is comparing approaches and applying human judgment).
- lesson 77 — Solution walkthrough: the agent explores the stack (React Router v7, full-stack SSR, no real-time infra), grills the user on scale/fidelity expectations, spawns background research agents on PartyKit/Pusher/Ably/LiveBlocks, recommends Ably, and writes a ~300-line research doc; keep research in-repo for the implementing agent but watch doc rot.
- lesson 78 — Concept lesson: prototyping makes a plan concrete, lets the human impose taste before the Ralph loop, and flushes out unknown unknowns early; great for front-end design, new libraries, and new services; not useful for bug-fixing or extending existing features.
- lesson 79 — Assignment: prototype the live-presence research on a throwaway dev-only route, creating a reusable local asset for the future implementing agent; uses the do-work skill, requires signing up for an Ably API key.
- lesson 80 — Solution: do-work skill keeps TDD/rigor on prototypes so they are production-ready; the agent made prototype components reusable/exported for direct reuse, gave a step-by-step Ably key guide, and a two-tab demo (dev users Emma/Olivia) shows live presence working; unknown unknowns flushed, so the real implementation can go AFK.
- lesson 81 — Bonus: the author's prototype skill (in progress) has two branches — UI testing (radically different variants on one route, switched via URL param + floating bottom bar) and logic testing (tiny interactive terminal app, key presses to push a data model through time).
- lesson 82 — Architecture as human-in-the-loop work: current agents design systems hard for themselves to use. Bad codebases = many small modules with import chains the AI must trace. Fix: deep modules (John Osterhout) — thin interface over a large implementation — so AI reads the interface fast, tests hit stable public seams, and developer cognitive load drops (devs read tests more than implementations; "gray boxes").
- lesson 83 — The improve-codebase-architecture skill: defines deep modules, uses an explore subagent to find friction (small-file bouncing, shallow modules, pure functions extracted only for testability, tightly coupled modules), proposes candidates for the user to pick, spawns parallel agents for radically different interface designs, recommends a hybrid, and emits a refactor RFC as a GitHub issue.
- lesson 84 — Solution demo: the skill flags a quiz subsystem (raw SQLite mixed with Drizzle ORM, no tests) as the top candidate; three interface-design agents (minimal / flexible / caller-optimized) produce designs, design B (a `createQuizModule` factory) wins with a hybrid tweak, and a GitHub issue with before/after caller code is created.
- lesson 85 — Prevention, not just cure: the updated PRD skill adds a step that sketches major modules and actively looks for extractable deep modules before writing the template, checking with the user — bringing module awareness into the design moment so shallow modules never get created.
- lesson 86 — Course summary: the seven phases of AI development — grill → research (may include prototyping) → PRD → issues → implement (human-in-the-loop or AFK) → review (against PRD, standards, and process) → compound/improve; a personal take, not dogma, and "AI coding gives you permission to build."
- lesson 87 — Appendix: Greenfield vs Brownfield. Greenfield starts with grilling, research markdown, and prototypes before a PRD; introduces AX (agent experience) alongside UX — the first greenfield PRD often needs to specify feedback loops, tech choices, module shape, and testing strategy before UX.
- lesson 88 — Appendix: ADRs + shared glossary. Agents source info from code, commit history, GitHub/issues, and user messages but can't answer "why did you do it this way" (ADRs) or "what is an X" (business jargon, glossary at `context.md`, from domain-driven design's ubiquitous language); create both during grilling, before the PRD; the grill-with-docs skill automates this.
- lesson 89 — Week-two office hours (long, live Q&A + teach-skill demo): DX vs AX; skepticism of GraphiFi-style knowledge graphs (filesystem + grep works best); tactical vs strategic programming; agent security via sandboxing outbound traffic; the 120k "smart zone" is a gentle curve; poly-repo wrapper repos vs monorepos; teach skill demo (mission, HTML lessons, glossary/cheat card, learning records, zone of proximal development, "teach me about this repo"); context-gathering fixes via cached research; automated review stage for coding standards.
- lesson 90 — Day-six office hours (long, live Q&A + GitHub Actions demo): Anthropic's plans change pushes AFK work to Codex; "good enough" = defining questions answered, judged via prototypes; collaborative grilling then single-person implementation; Sandcastle driving label-triggered GitHub Actions (agent-implement → draft PR → agent-review → ready; merge-conflict resolver; 9am cron architecture-review issues; PRD label auto-creating sub-issues); continuous shipping; extracting coding standards from review comments; learn TypeScript (your knowledge caps the agent); review now spans UX, DX, and AX.

## Sections (L2)

### Lesson 76
- Locator: `[[sources/ai-coding-for-real-engineer/lesson76.en.srt]]`
- Summary: Assigns the "research" exercise for the live presence indicator feature (show icons of people viewing the same lesson, add/remove as they join/leave). The task is to prompt Claude Code inside the project to research several approaches, iterate with the user, ask good questions, validate assumptions on the web, and write an implementation-focused research document into the `plans/` directory.
- Key claims: The prompt's key ask is for several different approaches so the human can compare and apply judgment; research happens before implementation, using no dedicated skill — just Claude Code; the research doc can later feed a PRD or Kanban board.
- Learner-relevant: This is the model prompt for the research phase: state the feature, ask for multiple approaches, request iteration + questions, demand web-backed validation, and specify the output document location.

### Lesson 77
- Locator: `[[sources/ai-coding-for-real-engineer/lesson77.en.srt]]`
- Summary: Solution walkthrough. The agent explores the project (React Router v7, full-stack SSR, no existing real-time infrastructure), then grills the user on scale expectations, real-time fidelity vs simplicity, and UI details. It launches background agents researching PartyKit, Pusher, Ably, and LiveBlocks, concludes Ably is best (with a generous free tier), and writes a nearly 300-line research markdown file.
- Key claims: Human-in-the-loop judgment is essential — the user steers (e.g., "make Ably the recommended approach"); for production you'd go into each service and verify what the AI claimed; the research doc (requirements, recommended approach, implementation design, integration points, alternatives) doubles as an architectural decision record; only ~18 context was used, so a PRD could be generated straight from it.
- Learner-relevant: Store research in the local repo rather than GitHub issues so the implementing agent can discover and read it; reference it from the PRD/issues; be aggressive about deleting it once the feature + QA are done because doc rot actively harms the agent (Git history preserves it).

### Lesson 78
- Locator: `[[sources/ai-coding-for-real-engineer/lesson78.en.srt]]`
- Summary: Explains prototyping as a core planning technique. Where plan mode works out in text what to build, a prototype makes it concrete, letting the human impose taste before the Ralph loop. Prototypes are ideal for front-end design (multiple options on a throwaway route), trying new libraries/tools, and testing new services — often research and prototyping pair up.
- Key claims: Prototyping flushes out unknown unknowns early; it's not useful for bug fixes (desired behavior is known) or extending existing features (composing existing pieces); for whole-system redesigns it's powerful; the author prefers a normal human-in-the-loop do-work run over a dedicated prototyping skill so they stay close and apply taste; the janky prototype becomes a reference asset for the real implementation.
- Learner-relevant: Treat prototyping as a form of research that also simplifies the implementation step — prototype before or as part of the PRD, then feed the prototype into the Ralph loop and Kanban board.

### Lesson 79
- Locator: `[[sources/ai-coding-for-real-engineer/lesson79.en.srt]]`
- Summary: Assignment for the live-presence prototype. The instructor's prompt: invoke the do-work skill, point at the research doc, ask to build a prototype of the research on a throwaway route visible only to developers, and create a local asset the real implementing agent can use.
- Key claims: The throwaway-route/devs-only constraint keeps the prototype out of production traffic; explaining the purpose of the prototype in the prompt matters; because the design is already settled, one working version is enough rather than multiple design options; completing it requires signing up to Ably and getting an API key.
- Learner-relevant: A copy-pasteable prompt template for prototyping research: skill → reference the research → build prototype on throwaway route → produce reusable local asset → let the agent ask follow-up questions.

### Lesson 80
- Locator: `[[sources/ai-coding-for-real-engineer/lesson80.en.srt]]`
- Summary: Solution run. The do-work skill still applies TDD and rigorous code standards to the prototype, so the code is genuinely production-ready when copied into the real app. The agent made the prototype components reusable and exported for direct reuse, gave a "how to test it" note, and even a step-by-step guide for acquiring an Ably API key with the right scopes.
- Key claims: Using a do-work skill on prototypes means the implementation copies production-ready code and the AFK implementation becomes trivial; the agent designed the prototype to be pulled out and dropped into the real app; the demo (two tabs, dev users Emma Wilson and Olivia Martinez via an incognito session) shows presence joining and leaving in real time; with unknown unknowns flushed, the rest can be worked out AFK.
- Learner-relevant: Prototyping is human-in-the-loop work invested early to validate assumptions about an unknown unknown; the tight feedback loop with the AI during prototyping pays dividends at implementation time vs just going AFK.

### Lesson 81
- Locator: `[[sources/ai-coding-for-real-engineer/lesson81.en.srt]]`
- Summary: Shows the author's new prototype skill (in progress, available in his skills repo). It has two branches: UI testing and logic testing.
- Key claims: The UI branch generates several radically different UI variations on a single route, switchable via a URL search param plus a floating bottom bar (click left/right to A/B/C), great for iterating on visual design; the logic branch builds a tiny interactive terminal app that pushes the machine through cases hard to reason about on paper — with key presses to move data through time, ideal for complex or time-changing data models; more branches may come.
- Learner-relevant: The two branch archetypes cover most prototyping: radical UI variants for design decisions and terminal-based time-stepping for logic/data-model questions.

### Lesson 82
- Locator: `[[sources/ai-coding-for-real-engineer/lesson82.en.srt]]`
- Summary: Argues that defining software architecture is the most important place for human-in-the-loop work, because current agents are bad at architecture and design systems that are hard for themselves to use. Shows what a "bad codebase" looks like to an AI and introduces deep modules as the cure.
- Key claims: A bad codebase (dozens of small modules) forces the AI to traverse import/export chains to find functionality, and small modules produce weak, change-coupled tests; deep modules (John Osterhout) have a thin, rarely-changing interface over a large implementation, so the AI can read the interface and instantly understand purpose; bonus: deep modules cut developer cognitive load, which spikes when AI keeps reshuffling code; devs then review interfaces and read tests more than implementations ("gray boxes").
- Learner-relevant: Concrete case: his video editor (frontend + ~20 interrelated backend API files + a CLI + DB modules) was refactored into one service (SDK + API handler) = a single deep module, making the whole editor flow TDD-testable end to end; identifying the need to deepen the module is not something AI can do alone — you need the language of deep modules to prompt it, embedded in your planning.

### Lesson 83
- Locator: `[[sources/ai-coding-for-real-engineer/lesson83.en.srt]]`
- Summary: Presents the improve-codebase-architecture skill that turns the deep-modules idea into a concrete workflow. It defines deep modules, explores the codebase with a subagent, and probes for specific failure patterns before proposing candidates.
- Key claims: Friction signals the skill looks for: understanding a concept requires bouncing between small files; modules so shallow the interface is nearly as complex as the implementation; pure functions extracted purely for testability while real bugs hide in how they're called (a common LLM habit); tightly coupled modules creating integration risk at the seams. After exploration it presents candidate clusters (no interface designs yet); the user picks one; step four spawns multiple subagents in parallel to produce radically different interface designs, then gives a recommendation and optionally a hybrid.
- Learner-relevant: Run it clean or pointed at a specific area; the parallel-divergent-design step is what yields diversity, and the output is a refactor RFC (GitHub issue) you can convert into a Kanban board.

### Lesson 84
- Locator: `[[sources/ai-coding-for-real-engineer/lesson84.en.srt]]`
- Summary: Runs the improve-codebase-architecture skill on the cohort project. The skill identifies a quiz subsystem (scoring, CRUD, XP) as the top candidate — deliberately left as a badly-coded service (raw SQLite mixed with Drizzle ORM, no tests).
- Key claims: The quiz scoring service is the only place mixing raw SQL with Drizzle, so it's the obvious target; the skill spawns three interface-design agents (minimal / flexible / caller-optimized interfaces); design B wins: a `createQuizModule` factory taking the database, a configurable scoring strategy, and pass-XP, with methods like getQuizForLesson, getBestAttempt, getLatestAttempt, attemptHistory, getStats, submitAttempt, saveQuiz, deleteQuiz; the recommendation hybridizes B with A's "XP awarded boolean" since XP amount is an implementation detail; a GitHub issue is created showing before/after caller code (two calls instead of an orchestration chain).
- Learner-relevant: Interface design is a deep skill you develop by seeing many options; you don't need it perfect the first time because a later run can target what you built; the module becomes a gray box you test entirely from outside.

### Lesson 85
- Locator: `[[sources/ai-coding-for-real-engineer/lesson85.en.srt]]`
- Summary: Prevention. The updated PRD skill adds module awareness at the design moment so bad shallow modules never get created in the first place.
- Key claims: The PRD skill became a three-step process — just before writing the template it sketches the major modules to build or modify, actively looks for deep modules that can be tested in isolation, and checks with the user that the modules match expectations; this bakes architecture thinking into the most important moment (designing the new implementation), so the right seams get tested and TDD loops are enforced.
- Learner-relevant: This is the "prevent vs cure" pairing with the improve-codebase-architecture skill — plan the module seams up front, especially for multi-session AFK features.

### Lesson 86
- Locator: `[[sources/ai-coding-for-real-engineer/lesson86.en.srt]]`
- Summary: Course wrap-up. The instructor summarizes the whole process as seven phases of AI development, walked through in a "weird circular order."
- Key claims: The seven phases: (1) grill — interview to harden the idea; (2) research — third-party APIs, tooling, options, possibly prototyping mid-grilling; (3) PRD — the destination document, reviewable by the team; (4) turn PRD into issues with blocking relationships; (5) implement — human-in-the-loop or fully AFK; (6) review — against the PRD, coding standards, and the process itself (update prompts/skills); (7) compound — write down your process and get better; the order is personal, not dogma.
- Learner-relevant: Anchor: "AI coding allows you permission to build stuff that you wouldn't have thought possible before" — the whole pipeline exists to keep human judgment in charge while scaling output.

### Lesson 87
- Locator: `[[sources/ai-coding-for-real-engineer/lesson87.en.srt]]`
- Summary: Appendix on Greenfield projects (new repo, nothing before) vs Brownfield (existing constraints). The cohort app work was all Brownfield; this lesson explains how to start from a blank page.
- Key claims: Greenfield start: grilling session first, capture outputs into research markdown files in the repo, then prototypes, then the PRD; introduces AX — agent experience — alongside UX: in a greenfield codebase the first PRD must specify feedback loops (types, tests, pre-commit hooks, formatting), technology choices, module shape (deep modules), and testing strategy (mocks, test database) before or alongside UX goals; AX and UX must be tied together — you can't sacrifice AX for UX; once AX is sorted (often via its own PRD), the codebase behaves like a brownfield and the normal loop applies.
- Learner-relevant: Greenfield difficulty is mostly setting up the agent experience; the first PRD is usually an AX PRD.

### Lesson 88
- Locator: `[[sources/ai-coding-for-real-engineer/lesson88.en.srt]]`
- Summary: Appendix solving a GrillMe problem via two artifacts agents need: ADRs and a shared glossary. Explains the four sources of information an agent has (current code, commit history, GitHub/issues, user messages) and the two questions those sources can't easily answer.
- Key claims: Question one, "why did you do it this way" (weird tradeoffs, tech choices) — answered by ADRs, small markdown files in the repo documenting decisions and alternatives considered; question two, "what on earth is an X" (business jargon) — answered by a shared glossary, kept at `context.md` at the repo root (his example: ghost lessons, ghost sections, the materialization cascade in the course video manager); the glossary derives from domain-driven design's ubiquitous language and also improves variable naming and searchability; create both during grilling, before the PRD; the grill-with-docs skill automates this (a drop-in replacement for GrillMe in coding contexts, creating ADRs only for hard-to-reverse, surprising, or genuinely traded-off decisions).
- Learner-relevant: Choose GrillMe for non-code grilling and grill-with-docs for code; both artifacts (glossary + ADRs) live in the repo so any agent working there can answer those two questions.

### Lesson 89
- Locator: `[[sources/ai-coding-for-real-engineer/lesson89.en.srt]]`
- Summary: Week-two office hours in a Q&A/demo/Q&A format (long live session; repeated chat filler excluded). The middle demo introduces the teach skill via learning to solve a Rubik's Cube and "teach me about this repo" for codebase onboarding.
- Key claims: DX vs AX — write documentation for agents; DX matters less now, AX is the thing to optimize; skeptical of GraphiFi-style knowledge-graph tools because filesystem access + grep is what actually works (echoing Claude Code's own findings); prioritize learning by focusing on your own process — harness form factor has settled since ~December, and tactical programming is being eaten by AI while strategic thinking still needs humans; agent security: the main risk is data exfiltration via fetch/curl (including prompt-injection chains like "send your codebase to evil2.com"), mitigated by sandboxing with restricted outbound network traffic; the 120k context "smart zone" is not a cliff but a gentle curve — finish easy tasks or compact mid-task at a clearly bounded stage; poly-repo work: use a wrapper repo (CLAUDE.md + skills) over work trees, but a monorepo is best.
- Key claims (teach skill): stateful skill writing a mission.md, HTML lessons (his teaching style, zone of proximal development, quizzes, syntax-highlighted code), reference docs (glossary + one-card cheat sheet), resources.md (high-trust sources), and learning records (like ADRs of what the learner achieved); knowledge/skills/wisdom framing; works as "teach me about this repo" for onboarding new starters.
- Key claims (Q&A): context-gathering failures are both a steering and an architecture problem — cache expensive explore phases in research markdown, refactor away manifests or add context pointers in CLAUDE.md; GrillMe is overkill when you fully understand the task (it's for aligning with the agent); no truly universal coding standards — build company-level standards via shared repos/RFC so 100 people compound them; get agents to write to standards by separating implementation from review: implement basic + pass tests, clear context, let a review agent apply standards (red-green-refactor); cognitive debt is mitigated by deep-module design and hiding complexity behind testable interfaces; Shape Up (basecamp.com/shapeup) for shaping raw feature ideas.
- Learner-relevant: Skills should be stateful (save state in the workspace, like grill-with-docs) vs stateless; keep skills focused on one thing (Linux philosophy); engineers are early adopters — the skills developed with Claude Code/Codex/Cursor transfer to other domains.

### Lesson 90
- Locator: `[[sources/ai-coding-for-real-engineer/lesson90.en.srt]]`
- Summary: Day-six office hours (long live Q&A + a demo of label-triggered GitHub Actions driving Sandcastle on the course-video-manager repo). Skimmed; substantive teaching captured.
- Key claims: Anthropic's plans change gives only a small bonus API budget for AFK work via Claude Code, so the instructor switches AFK/sandcastle work to Codex (generous subscription, usable AFK); "good enough" = have the most relevant questions that define the feature's success been answered — good prototypes are the secret weapon for judging value and tradeoffs (e.g., WebSockets vs SSE vs third-party).
- Key claims (team/process): collaboration is concentrated before the PRD (collaborative grilling, e.g. via GitHub ACE agent coding environments, sharing prototypes and transcripts), then one person implements issues, then group review; add a QA-plan issue assigned to a user so review is a click-through.
- Key claims (demo): GitHub Actions workflows (all open source in the repo) run Sandcastle without Docker: adding an `agent-implement` label implements the issue (runs `implement.ts` → `sandcastle run` with no sandbox, commits, pushes, opens a draft PR with an `agent-review` label); that triggers a review action that checks the PR and marks it ready; also: a merge-conflict-resolution action (rebase, then agent fixes failures), a cron job at 9am weekdays running a version of the improve-codebase-architecture prompt that opens architecture-improvement issues, and a PRD label that auto-creates sub-issues which agent-implement then completes like a Ralph loop; PRDs belong in hosted issues (GitHub/Jira/Linear), not local files; local-only sandcastle is fine for open-source code and tokens are read-only.
- Key claims (Q&A): steer Claude.md to use Haiku for explore/subagents (two orders of magnitude cheaper) rather than alternate LLMs; Claude workflows (parallel spawned agents) could replace the implement step but should stay sandboxed; learn TypeScript — your understanding is the agent's ceiling, and encoded knowledge compounds through your "fleet of agents"; keep effort level in check (Opus 4.8 defaults to extra-high, spendy); GrillMe is unopinionated so you must hold both UX and AX in mind during greenfield grilling; the QA/tests posture: continuous shipping (release every CI run, trickle of code) beats "optimal tests before ship" — bugs trace to exact diffs; extract coding standards from your review-comment history via API (a growing dataset) rather than asking the agent to derive standards from code (code is self-describing); AI SDK stays relevant for building AI-powered apps, not for being an AI-powered developer; TDD for backend is standard but front-end visual testing is still unsolved; Sandcastle works with Codex via bind-mounting the `~/.codex` auth folder (undocumented); review now happens on three axes — UX (users), DX (developers, still important but demoted), and AX (agent experience, now critical because bad AX produces bad code).
- Learner-relevant: The label-triggered workflow pattern shows how flexible the whole strategy is — you can run the same agents on GitHub Actions, self-hosted runners, or webhook-triggered third-party services; grill/research/prototype/review stay human-in-the-loop; only implementation is automated.


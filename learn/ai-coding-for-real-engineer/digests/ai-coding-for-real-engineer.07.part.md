---
source: ai-coding-for-real-engineer.07
source_type: text
source_lines: 2386
part: 7
status: absorbed
absorbed_at: 2026-10-01
created: 2026-10-01
updated: 2026-10-01
---

# Digest — ai-coding-for-real-engineer (part 7: lessons 61-70)

## Overview (L1)

- lesson 61 — Walks through `interactive.ts`, a single-loop AFK agent harness built on Sandcastle that runs one phase of a PRD/plan and stops; introduces prompt expansion with `!`-prefixed code blocks, `cat`, and PRD/plan location prompt args.
- lesson 62 — Runs the interactive agent on the Admin Analytics PRD (phase one: summary + route), observes permission requests, and reviews the tracer-bullet output in the dev UI.
- lesson 63 — Explains why you should never run `--dangerously-skip-permissions` (YOLO) on your host, then sets up Sandcastle's Docker sandbox (Node 22 + Claude Code, bind-mounted repo, env-injected API key) and verifies it with a hello-world test.
- lesson 64 — Introduces `main.ts`, the multi-iteration AFK runner: same prompt but loops up to `max iterations`, stopping early on a completion signal (`no more tasks`), with agent/model customizable.
- lesson 65 — Runs the AFK agent and reviews logs: it detects completed phases, does phase two/three (recharts chart, course breakdown table), commits, emits `no more tasks` after two iterations, and reports context-window usage.
- lesson 66 — Upgrades the AFK agent from a fixed plan to a task queue pulled from an issue tracker, introducing a task-selection priority order: critical bug fixes → dev infrastructure → tracer bullets → polish/quick wins → refactors.
- lesson 67 — Sets up a dedicated GitHub repo (fork copy with git history deleted) so each learner has a private issue tracker instead of a shared course repo.
- lesson 68 — Hooks the AFK agent to GitHub via the GitHub CLI: prompt expansion fetches open issues as JSON, passes a personal access token into the sandbox, completes a task, and closes/comments the issue.
- lesson 69 — Solves a real bug (dev UI user selector not closing) end-to-end via the issue-tracker loop, discusses fine-grained token scoping, and verifies the fix in the dev UI.
- lesson 70 — Extends the loop to features by putting PRDs and plans into GitHub issues, updating the local planning skills to publish the backlog without creating local files that could confuse the AFK agent, enabling planning/implementation parallelism.

## Sections (L2)

### lesson 61

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson61.en.srt#lesson61]]`
- Summary: Introduces the `interactive.ts` harness, which runs an AFK coding agent (Claude Code, by default) for a single loop. Its `prompt.md` resembles the course's "do work" skill but adds Sandcastle-specific prompt expansion: a code block prefixed with `!` runs the shell command and inlines its output into the prompt. It demonstrates reading a PRD and plan via `cat` plus PRD-location and plan-location prompt args, then instructing the agent to explore the repo, complete the task, run feedback loops, commit, and work on only one task.
- Key claims: Prompt expansion (`!` + backtick code block) inlines shell output like `cat` of a PRD/plan into the agent prompt; a conditional outputs "no more tasks" when there is nothing left; restricting the agent to a single task prevents it from burning through a whole multi-phase plan in one context window (the "dumb zone"); the exercise uses the Admin Analytics PRD (read-only platform-wide metrics, since existing analytics is instructor-scoped) with a three-phase plan; run via `npx tsx sandcastle/interactive.ts`, sandbox currently set to `no sandbox`.
- Learner-relevant: A concrete mental model for the minimal AFK-agent prompt and the one-task-per-loop discipline; teaches prompt expansion as an input mechanism and shows how a PRD + multi-phase plan is handed to an autonomous agent.

### lesson 62

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson62.en.srt#lesson62]]`
- Summary: A demo run of the interactive agent on phase one of the Admin Analytics plan. The logs show the full PRD and plan inlined into the prompt and the agent correctly scoping itself to phase one (summary + route). It writes code, requests permission to run the feedback loop, commits, and reports phase one complete. The instructor inspects the resulting admin analytics page (basic summary cards) in the dev UI and calls it a good tracer bullet.
- Key claims: Prompt expansion inlines the entire PRD and plan; even a constrained run still prompts for permissions when not fully AFK; the produced phase-one output is a bare-bones route with basic summary cards; once permission requests are removed, the loop can be run repeatedly to churn code.
- Learner-relevant: Shows what a successful tracer-bullet run looks like end-to-end and highlights that permission handling is the remaining blocker to true AFK operation.

### lesson 63

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson63.en.srt#lesson63]]`
- Summary: Explains the danger of YOLO mode (`--dangerously-skip-permissions` in Claude Code): unsupervised agents may delete home directories or exfiltrate sensitive code (especially after prompt injection), so the docs warn to use it only in isolated containers/VMs. The instructor notes Claude Code's own sandbox can be escaped and is therefore a non-starter. He then sets up Sandcastle's Docker-based sandbox: a Dockerfile installing Node 22 and Claude Code with working dir `/home/agent`, bind-mounting the repo so the agent only touches chosen files, and injecting env vars for authentication. Setup steps: install Docker Desktop or podman, copy `.env.example` to `.env`, add the Anthropic API key, run `pnpm sandcastle docker build image`, then test with `npx tsx sandcastle/test.ts`.
- Key claims: YOLO/`--dangerously-skip-permissions` is unsafe outside an isolated container/VM because of destructive commands and prompt-injection exfiltration; Claude Code's built-in sandbox can be broken out of and cannot be trusted with YOLO; Docker/podman provides real isolation by bind-mounting only the repo and running all bash inside the container; using a subscription with the sandbox was unresolved at recording time, so an Anthropic API key is recommended; the test run logged a hello reply, sandbox setup time, no commits, and ~19k context used.
- Learner-relevant: Core safety mental model for autonomous agents and a reusable sandbox recipe (Docker/podman, env injection, bind mounts) applicable to any AFK agent setup.

### lesson 64

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson64.en.srt#lesson64]]`
- Summary: Introduces the AFK runner `sandcastle/main.ts`, invoked as `npx tsx sandcastle/main.ts <prd> <plan>` with positional arguments (e.g. `prd/admin-analytics.md`, `plans/admin-analytics-plan.md`) instead of the interactive UI. It reuses the same prompt but changes three things: it uses `run` instead of `interactive`, and it adds `max iterations` plus a completion signal. The loop repeats the prompt until either max iterations is reached or the completion signal "no more tasks" appears. The agent and model are configurable and passed straight to Claude Code.
- Key claims: `run` loops the prompt instead of a single interactive pass; the loop terminates on `max iterations` or the `no more tasks` completion signal; the instructor often sets max iterations high (10–50) relying on the completion signal, but keeps it low here to save tokens; model choice is yours (latest was 4.7; instructor preferred 4.6 at recording).
- Learner-relevant: The key mechanism turning a single agent run into an autonomous loop, and how termination (iteration cap vs. sentinel string) governs safety and cost.

### lesson 65

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson65.en.srt#lesson65]]`
- Summary: A full AFK run and log review. The agent recognizes phase one is already complete, works through phase two (a recharts line chart for revenue over time) and phase three (per-course breakdown table with instructor filter), running type checks and tests, committing after each, and finally emitting `no more tasks` after two iterations. Logs surface tool calls, iteration count, per-iteration context windows (64k, then 80k), and collected commits. The instructor steps away and returns to working code, framing the loop as "the future of development."
- Key claims: The agent correctly reads prior phase state and skips completed work; each iteration runs explore → implement → typecheck/test → commit; sandbox is re-set-up each iteration; completion was signaled after two iterations; context windows reported 64k and 80k; planning pays off because you align the agent with a plan and let it run; the loop lets you parallelize yourself (e.g., planning future work) against the agent.
- Learner-relevant: Demonstrates the payoff of planning + multi-iteration AFK, introduces context-window accounting, and gives the "parallelize yourself with the agent" working model.

### lesson 66

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson66.en.srt#lesson66]]`
- Summary: Reframes the AFK agent's input: rather than pointing it at a fixed PRD and plan, give it a queue to pull the next task from, so it decides *what* to work on as well as doing it. The commit replaces the plan/PRD input with a fetch of open GitHub issues (GitHub as issue tracker, though any tracker works), plus a task-selection prompt that prioritizes work: (1) critical bug fixes, (2) development infrastructure (tests/types/dev scripts), (3) tracer bullets for new features, (4) polish and quick wins, (5) refactors. This works well up to ~20–30 tasks; GitHub labels/assignees can further narrow the set.
- Key claims: The agent should select the next task, not just execute one; prioritization order is critical bug fixes → dev infra → tracer bullets → polish/quick wins → refactors; never churn commits onto a broken CI/app; task-selection prompt must be tailored to the project's stage; the setup scales to ~20–30 tasks and can be winnowed with labels/assignment; this creates a virtuous loop of agent code → human review → issues → agent code; the instructor built Sandcastle itself this way (403 closed issues, a `ready-for-agent` label).
- Learner-relevant: The architectural shift from scripted plan execution to an issue-queue-driven agent, plus a concrete, transferable prioritization rubric.

### lesson 67

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson67.en.srt#lesson67]]`
- Summary: Setup lesson for giving each learner a private GitHub issue tracker. Forking the course repo would funnel every student's issues into a single shared pool, so instead the instructions copy the local project into a new directory (`cohort-004-project-fork`), delete all git history, and create a fresh GitHub repo owned by the learner with its own issue tracker. The instructor provides a series of bash commands/instructions for this.
- Key claims: Forking the project repo would create a shared issue pool and chaos across all students; the workflow is local copy → delete git history → create a new GitHub repo owned by you; the end state is a private repo whose issues no one else can interact with.
- Learner-relevant: Practical repo-provisioning so an AFK agent has an isolated backlog; reinforces that the agent's issue tracker must be per-user.

### lesson 68

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson68.en.srt#lesson68]]`
- Summary: Connects the AFK agent to GitHub using the GitHub CLI, which LLMs are said to know well and rarely misuse. Sandcastle prompt expansion runs `gh` to fetch open issues as JSON (number, title, body, comments), feeds them through the task-selection prompt, and after committing, closes the issue on completion or comments with progress if incomplete. A GitHub personal access token is added to `.env` so the sandboxed agent can call `gh`; the Dockerfile already installs the GitHub CLI. The exercise creates a small real bug issue and runs the agent to fix it.
- Key claims: GitHub CLI is an elegant, reliable LLM-to-GitHub interface; prompt expansion fetches open issues as JSON including comments; issue comments become a running record and are pulled back into the agent's context each run, so multi-phase plans can live in an issue; a personal access token enables the sandboxed agent to reach GitHub; on completion the agent closes the issue, otherwise comments; rebuild the Docker image after switching to the new repo (`pnpm sandcastle docker build image`), then run `npx tsx sandcastle/main.ts`.
- Learner-relevant: A complete pattern for issue-tracker-driven agents — fetch backlog as JSON, act, then close/comment — plus the security-relevant PAT injection and the GitHub-CLI-as-interface insight.

### lesson 69

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson69.en.srt#lesson69]]`
- Summary: The payoff run: the agent reads the open issue (37 tokens), explores the repo, locates the dev UI component and API route, diagnoses the bug (client-side react-router navigation leaves the dropdown open state `true`), fixes it, passes pre-commit hooks, commits, closes the issue with an explanatory comment, and emits `no more tasks` (30k context). The instructor verifies the fix in the dev UI and addresses the common worry about sharing a GitHub token by emphasizing fine-grained, narrowly-scoped access tokens (read/comment/close issues only).
- Key claims: Fine-grained GitHub tokens can be scoped to only what the agent needs (read, comment, close issues; not even create issues); the agent produced a correct diagnosis and fix autonomously with observability via the closing comment; closed issue count went to 1 and the fix was confirmed live; the loop can churn through backlog items and can be extended by reporting QA findings as new issues.
- Learner-relevant: Demonstrates the full backlog-fix cycle and the security principle of least-privilege tokens for agent access.

### lesson 70

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson70.en.srt#lesson70]]`
- Summary: Extends the workflow from bug fixes to new features by storing PRDs and plans as GitHub issues rather than local files. The planning skills are updated so that, instead of writing local PRD/plan files, they create a GitHub issue using the same template. The AFK agent then reads the whole backlog (features + bugs) and applies its task-selection prompt to choose the next item. This keeps the planning loop out of the codebase, avoiding local files that could confuse the AFK agent, and lets planning run in parallel with implementation.
- Key claims: Put PRD and plan into GitHub issues using the existing template; the AFK agent treats features and bugs uniformly via the task-selection prompt; keeping planning artifacts out of the working tree avoids confusing the AFK agent; this architecture lets you parallelize planning with implementation by running a local planner that publishes issues consumed by a local agent.
- Learner-relevant: Completes the mental model of the agent-driven backlog loop, showing how feature work and bug work unify and how to run planning alongside an active AFK agent without file conflicts.

---
source: ai-coding-for-real-engineer.06
source_type: text
source_lines: 2290
part: 6
status: absorbed
absorbed_at: 2026-10-01
created: 2026-10-01
updated: 2026-10-01
---

# Digest — ai-coding-for-real-engineer (part 6: lessons 51-60)

## Overview (L1)

- lesson 51 — Hands-on exercise: use the repo's writer skill inside Claude Code to author a project-local "do work" skill that plans a unit of work, implements it, runs feedback loops (`pnpm typecheck`, `pnpm run test`), then commits.
- lesson 52 — Solution walkthrough of the generated do-work skill: keep it concise (~35 lines), name the real feedback commands explicitly, and treat the "create a plan" step as optional since most runs consume an existing plan/PRD.
- lesson 53 — Exercise: test the do-work skill against a single-phase "in-app notifications" PRD (instructors notified when students enroll), invoking it with both the plan and PRD plus "do phase one," and watch whether the agent obeys the skill.
- lesson 54 — Live demo of the do-work skill end-to-end: explore → task list → typecheck/tests → fix a failing ordering test → commit; plus permission scoping in `.claude/settings.local.json` and QA of the notification feature.
- lesson 55 — Deterministic enforcement of feedback loops with git pre-commit hooks (Husky + lint-staged + Prettier) so unformatted or failing code can never be committed; the friction humans hate is ideal for agents.
- lesson 56 — Red Green Refactor / TDD from Kent Beck's *Extreme Programming Explained*: write and run a failing test (red), make the minimal change to pass (green), refactor; combine with tracer-bullet tests to stop the AI spraying untested horizontal code.
- lesson 57 — Exercise: fold red-green-refactor into the do-work skill's implementation step (one test at a time, tracer-bullet style, backend only), then prove it on a coupon-redemption-notification PRD.
- lesson 58 — Solution/demo of the TDD do-work skill: trim the skill, run with a clean context, observe red→green→refactor plus the pre-commit hook, QA the coupon feature, and note the AI ignored the tracer-bullet instruction.
- lesson 59 — Why multi-phase plan execution should be automated: replace the human "do phase N" loop (HITL) with AFK agents driven by a for loop, citing Geoffrey Huntley's Ralph article and a Dec 2025 model inflection point.
- lesson 60 — Introducing the AFK-agent tooling: the instructor's Sandcastle library for running any agent in any sandbox provider, starting interactively with a `prompt.md` and no sandbox before moving to the full `main.ts` runner.

## Sections (L2)

### lesson 51

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson51.en.srt#lesson51]]`
- Summary: The first of a paired exercise/solution set. The learner opens Claude Code in the repo, invokes the writer skill, and prompts it to write a "do work" skill representing a unit of work: plan the work, implement it, seek feedback via the feedback loops `pnpm typecheck` and `pnpm run test`, then commit the code as the final step.
- Key claims: A do-work skill should represent a single unit of work in the repo; the skill must direct the agent to plan, implement, and then seek feedback via the repo's named feedback loops (`pnpm typecheck`, `pnpm run test`); committing belongs as the final step of the skill; the writer skill is used to author it.
- Learner-relevant: Shows that skills are themselves authored by prompting an agent, and establishes the plan → implement → verify → commit shape that later lessons refine with TDD and hooks.

### lesson 52

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson52.en.srt#lesson52]]`
- Summary: Solution walkthrough of the do-work skill generated in lesson 51. The instructor steers lightly rather than harshly, moves the skill into the project directory (it belongs with the project because it names project-specific feedback loops), and trims the output to a concise five-step workflow: understand the task, read the reference plan or PRD, plan implementation, implement, validate (`pnpm run typecheck`, `pnpm run test`), then commit.
- Key claims: Skills should be concise — the important part is the headings and the five-step workflow (down to ~35 lines); the skill should name the actual feedback commands explicitly; the planning step should be optional ("if the task has not already been planned, create a plan") because runs usually consume an existing multi-phase plan or large PRD; you don't need to over-specify commit-message rules or stage-only-changed-files advice; a project-local skill ties to the project's feedback loops rather than living in the user directory.
- Learner-relevant: Teaches prompt-steering economy (light hand, delete the guff) and the mental model that a skill is a short, decluttered workflow skeleton, not exhaustive instructions.

### lesson 53

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson53.en.srt#lesson53]]`
- Summary: Exercise applying the do-work skill to a prepared PRD on the "Cadence" platform: instructors currently have no way to know when new students enroll and must check manually. The fix adds an in-app notification for instructors. A matching plan exists and is a single phase, making it ideal to test the skill. The learner opens a fresh Claude Code session, invokes the do-work skill passing both the plan and the PRD, and issues "do phase one."
- Key claims: Small, single-phase features are good tests for a do-work skill; the skill invocation pattern is to pass the plan, the PRD, then a phase instruction; while it runs, the learner should observe whether the agent actually follows the skill's steps and runs the feedback loops.
- Learner-relevant: Demonstrates the concrete invocation contract (plan + PRD + phase) and reinforces observing/verifying agent behavior against the skill rather than assuming compliance.

### lesson 54

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson54.en.srt#lesson54]]`
- Summary: Live solution for lesson 53. The agent explores, decides it has full context and skips replanning, builds a task list (including validate with typecheck and tests), implements, and runs `pnpm typecheck` then `pnpm run test`. A test failure (two notifications share a `created_at` timestamp) is fixed by ordering by ID descending as a tiebreaker. The agent commits, and the feature is QA'd by enrolling a student and checking the instructor's notification.
- Key claims: `Shift+Tab` enables auto-accept edits so the agent can run; permissions should be scoped narrowly in `.claude/settings.local.json` — allow `pnpm run typecheck` and `pnpm run test` specifically rather than a bare `pnpm run *` wildcard that would also permit migration scripts; commits are effectively safe because they can be rolled back; the instructor generally adds `git add *` and `git commit *` to allowed permissions so the agent commits without manual prompting; a feedback loop makes an ugly implementation dependency (ordering by ID) acceptable because a future ID change will break the test before production; the working do-work skill is a canvas to layer complexity onto.
- Learner-relevant: Concrete permission-hygiene practice, the value of an explicit feedback loop as a safety net, and a full worked example of the skill producing a real, working feature.

### lesson 55

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson55.en.srt#lesson55]]`
- Summary: Adds deterministic enforcement of feedback loops via git hooks. A pre-commit hook runs automatically before each commit, so types/tests (and formatting) always pass before code lands. The lesson sets this up with Husky (manages hooks), lint-staged (runs linters on staged files), and Prettier (the formatter), wiring `.husky/pre-commit` to run `npx lint-staged`, `pnpm typecheck`, and `pnpm run test`.
- Key claims: Pre-commit hooks are hated by human developers (they force a multi-minute wait on every commit) but are perfect for agents, which are patient and unbothered by long runs; `Husky` + `husky init` manage hooks simply; `lint-staged` only lints staged files; a `lint-staged` config running Prettier on staged files deterministically prevents the AI from committing unformatted code; the hook catches a deliberately failing test, blocks the commit, and reports the failure back to the AI so it can fix it; this deterministic loop belongs in every project.
- Learner-relevant: A key mental model — friction that is painful for humans is an asset for agents — plus a concrete, reusable Husky/lint-staged/Prettier recipe and the technique of testing a hook by deliberately committing a failing test.

### lesson 56

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson56.en.srt#lesson56]]`
- Summary: Lecture introducing Red Green Refactor (TDD), grounded in Kent Beck's *Extreme Programming Explained*. The loop: write a failing test and actually run it to see it fail (red), write the minimal implementation to make it pass (green), then refactor to raise code quality — running feedback loops throughout to keep "CI" green. The lesson argues this is especially powerful with AI and should be combined with tracer-bullet tests one at a time.
- Key claims: Tests should drive the whole development process, and this matters even more in the AI era where feedback loops are central; writing/running the failing test first proves a bug exists and is excellent for bug fixing; a failing test forces the AI to produce testable code, which is easier to test and change; the AI can run and instrument the code before writing it; combine Red Green Refactor with tracer bullets by creating one failing test (one vertical slice) then the minimal implementation to pass it, repeating, which prevents the AI from spraying a horizontal layer of speculative tests; a failing-to-passing test is relatively hard for an LLM to fake convincingly; "CI" is developer shorthand for types and tests.
- Learner-relevant: Supplies the core TDD mental model and the specific anti-pattern (horizontal test spraying) that the tracer-bullet discipline solves — foundational for the implementation steps that follow.

### lesson 57

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson57.en.srt#lesson57]]`
- Summary: Exercise to upgrade the do-work skill's implementation step from "work through the plan step by step" to Red Green Refactor. Using the writer skill in a fresh Claude Code instance, the learner adds: do one test at a time in tracer-bullet style, and apply TDD only to backend code because the current test suite is backend-only. The learner then tests it on a coupon-redemption-notification PRD (alert team admins when a team's coupon is redeemed), a small extension of the existing notification system.
- Key claims: The implementation step should explicitly instruct red-green-refactor rather than plain step-by-step implementation; encourage one test at a time (tracer-bullet) and restrict TDD to backend code since there is no front-end test setup yet; invoke the do-work skill as before with the plan and PRD and "do phase one"; watch the agent closely to confirm it actually performs the red-green-refactor loop.
- Learner-relevant: Shows how to iteratively specialize a skill and why scoping TDD to where tests actually exist (backend) keeps the instruction honest.

### lesson 58

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson58.en.srt#lesson58]]`
- Summary: Solution/demo for lesson 57. The instructor edits the skill's generated text to be leaner (drop front-end detail to "implement directly without PRD," specify "for backend code use Red Green Refactor"), reorders the loop to repeat red-green then do one refactor at the end, and prefers vague guidance over brittle examples. After committing the skill change, he runs `/clear` for a clean context, pulls in the PRD and plan, invokes do work, "do phase one," and watches two explore agents, failing tests (red), implementation to pass (green), front-end update, typecheck/tests, and the pre-commit hook on commit.
- Key claims: Models already know TDD/Red Green Refactor, so no external docs are needed; keep prompting vague enough to "tick all the latent space" rather than over-specifying examples; use `/clear` to get a clean context before a fresh run; QA flow — Liam Thompson buys five seats and distributes a coupon, new user Matthew Pocock redeems it, Liam gets a "redeemed a coupon" notification showing seats remaining; TDD increases the chance of one-shotting a feature because it builds a large network of feedback loops the AI can rely on; the AI ignored the tracer-bullet instruction (wrote multiple tests at once), so the instructor would emphasize it more in the skill.
- Learner-relevant: Reinforces concise skill authoring, context hygiene (`/clear`), and honest evaluation — noticing when the agent deviates from a skill and tightening the skill rather than accepting it.

### lesson 59

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson59.en.srt#lesson59]]`
- Summary: Conceptual bridge from multi-phase plans to unattended execution. The plan (journey) plus PRD (destination) plus "do phase N" requires a human in the loop (HITL), but "do phase N" is just a for loop, so it can be automated. The instructor calls these "AFK agents" (agents run while away from the keyboard), crediting Geoffrey Huntley's article on the Ralph loop (Ralph Wiggum) as the inspiration and pointing to a December 2025 inflection point where models became reliably good at well-defined delegated tasks.
- Key claims: Multi-phase plans exist to break work into the agent's "smart zone"; the human-chosen "do phase N" step is a wasteful HITL pattern that is really a for loop; Geoffrey Huntley's Ralph article uses a simple for loop to run a prompt repeatedly to complete tranches of work; the instructor's variant is "AFK agents" — run agents while away from the keyboard to delegate large amounts of work; models got good enough around December 2025 to trust them with well-defined tasks; everything prior (feedback loops, planning, specs, tracer bullets) converges into this pattern.
- Learner-relevant: The key mental model of unattended automation — recognizing HITL loops and converting them into for-loops — and the vocabulary (AFK agents, Ralph loop) used through the rest of the course.

### lesson 60

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson60.en.srt#lesson60]]`
- Summary: Sets up the AFK-agent tooling. There's a learning curve so you don't make invisible mistakes; you periodically check in to ship prompt updates and adjust workflow. Two runners are introduced: `interactive.ts` (first) and `main.ts` (later). The key tool is Sandcastle, a library the instructor built to run any agent (here Claude Code) inside any sandbox (here Docker; also Podman or Vercel as a remote isolated provider) with a prompt file or inline prompt. The section starts with the interactive function and no sandbox (setup is a pain), using a `prompt.md` that mimics the later AFK agent so the setup can be optimized by watching it closely.
- Key claims: Ramps into AFK agents need a learning curve with periodic check-ins and prompt updates to avoid mistakes you can't see; two run modes — `interactive.ts` for supervised iteration and `main.ts` for the full runner; Sandcastle is a provider/sandbox-agnostic tool for running agents in sandboxes; you pass in an agent, a sandbox provider (Docker/Podman/Vercel), and a prompt file or prompt; start with the interactive function and no sandbox, using `prompt.md` to mirror what the later AFK agent will do; watch the agent carefully to optimize the setup around it.
- Learner-relevant: Introduces the concrete harness (Sandcastle, `interactive.ts`/`main.ts`, `prompt.md`, Docker/Podman) and the disciplined approach of supervised iterations before letting an AFK agent run unattended.

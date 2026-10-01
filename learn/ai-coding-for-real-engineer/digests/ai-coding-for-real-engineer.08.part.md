---
source: ai-coding-for-real-engineer.08
source_type: text
source_lines: 2906
part: 8
status: absorbed
absorbed_at: 2026-10-01
created: 2026-10-01
updated: 2026-10-01
---

# Digest — ai-coding-for-real-engineer (part 8: lessons 71-80)

## Overview (L1)

- lesson 71 — Frames the section: not all work should be delegated to an autonomous agent. Planning and QA are inherently human-in-the-loop because they require taste; the human supplies judgment, the AI applies it to the codebase.
- lesson 72 — Replaces the multi-phase plan with a Kanban/dependency-graph of GitHub issues. Introduces the PRD-to-issues skill (vertical slices, human-in-the-loop vs AFK, mandatory final QA issue) and the Ralph prompt tweak to only work the AFK tasks.
- lesson 73 — Exercise: take a gamification PRD (XP, levels, streaks), paste it into a GitHub issue, run PRD-to-issues to generate issues, then run a Ralph loop that picks up only the AFK tasks and leaves human QA behind.
- lesson 74 — Solution walkthrough: review the generated issues for tracer-bullet quality, merge thin slices, allow `gh issue create` in `settings.local.json`, run the AFK Ralph loop, then manually work the QA plan (XP on lesson completion, no duplicate XP, quiz XP) and file new issues for UI polish.
- lesson 75 — Research as an upfront cache of expensive explore phases. A `research.md` file lets many Ralph loops skip repeated web/doc exploration; it is human-in-the-loop work (taste picks options) and must be audited for doc rot.
- lesson 76 — Exercise: research several approaches to a live presence indicator. Prompt pattern asks the agent to present multiple options, iterate with questions, validate on the web, and write a research doc into the `plans/` directory (no skill used).
- lesson 77 — Solution walkthrough: agent explores the stack (React Router v7, full-stack SSR, no real-time infra), asks taste questions about scale and fidelity, spawns background agents to compare PartyKit/Pusher/Ably/LiveBlocks, and lands on Ably. Produces a ~300-line research doc; discusses doc rot and deleting it after QA.
- lesson 78 — Prototyping as a human-in-the-loop technique before the PRD. Throwaway routes, multiple design options, and testing new libraries/services surface unknown unknowns early; contrasts with when not to prototype (bug fixes, feature extensions).
- lesson 79 — Exercise: turn the presence research into a prototype using the do-work skill, on a throwaway dev-only route, producing a local asset the eventual implementer can reuse; requires an Ably signup.
- lesson 80 — Solution walkthrough: run the prototype with the do-work skill, keeping TDD and code standards so the copied code is production-ready. The agent exports reusable components, then an Ably API key is created, placed in `.env`, and presence is verified in real time across two browser sessions.

## Sections (L2)

### lesson 71

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson71.en.srt#lesson71]]`
- Summary: Having set up an autonomous agent, this lesson argues you still need to plan which work is human-in-the-loop and which can be AFK. The dividing line is taste — human judgment and feel. Planning needs taste because the human is the source of truth for what is being built; QA needs taste because the human judges the finished artifact, its feel, and its speed.
- Key claims: Planning must stay human-in-the-loop because without a human the AI has no source of truth to bounce off; QA requires a human to surface things absent from the AI's feedback loops (does it feel good, is it fast enough, does it serve the purpose); human-in-the-loop is needed anywhere taste applies, both externally (users) and internally (architecture); the human supplies taste, the AI does the grunt work; delegating 100% to AI yields a "tasteless application" that often simply doesn't work.
- Learner-relevant: Establishes the mental model for the whole section — decide per unit of work whether it is human-in-the-loop or AFK, and route human judgment to planning/QA/architecture while AI handles implementation.

### lesson 72

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson72.en.srt#lesson72]]`
- Summary: Argues against multi-phase plans because human developers plan as a Kanban board of issues with blocking relationships (a dependency graph), not one rigorous document. Describes replacing the PRD-to-plan skill with a PRD-to-issues skill that breaks a PRD into independently grabbable, traceable vertical slices and classifies each as human-in-the-loop or AFK.
- Key claims: A Kanban/dependency graph is less prescriptive, easier to extend, and easier to QA than a multi-phase plan because feedback just becomes another issue; slices are vertical and traceable, human-in-the-loop slices need decisions/reviews while AFK slices can be implemented and merged with no human; the skill always creates a final QA issue with a detailed manual QA plan; it quizzes the user on granularity/dependency relationships before creating issues via a template that references the parent PRD and has a `blocked by` section; the Ralph prompt is edited to work only AFK issues and output "no more tasks" when done, optionally enforced with labels; in the cohort the skill is "PRD to issues" but in Matt's repo it is "to issues" (works from whatever is in context or an issue reference, not only a PRD).
- Learner-relevant: A concrete workflow and skill convention for converting a spec into parallelizable, human/AFK-tagged GitHub issues that feed the Ralph loop and end with a human QA checklist.

### lesson 73

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson73.en.srt#lesson73]]`
- Summary: A hands-on exercise applying the Kanban skill to a gamification PRD (earn XP for completing lessons, plus levels and streaks). The learner pastes the PRD into a GitHub issue, notes its number, runs "PRD to issues" with that number, then runs a Ralph loop expected to pick up only AFK tasks and leave human-in-the-loop QA behind.
- Key claims: The PRD is provided as a GitHub gist and pasted into a new issue (issue 57 in the demo); the command is `PRD to issues` with the issue number as argument; the learner should observe how the Kanban board works and whether they like it; after issue creation run a Ralph loop that should pick up only AFK tasks; the endpoint is a set of human-in-the-loop QA tasks to review.
- Learner-relevant: Practice run of the full PRD → issues → Ralph loop → human QA chain, with the learner invited to form an opinion on the Kanban approach.

### lesson 74

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson74.en.srt#lesson74]]`
- Summary: Solution walkthrough of the gamification Kanban run. The agent reviews the PRD issue and returns a candidate issue list; Matt checks that the first issue is a proper tracer bullet (XP on lesson completion plus sidebar level display, with XP events table, migration, XP service test, and UI), merges two thin slices, and creates five issues (58–62). He runs the AFK Ralph loop, then manually works the QA checklist.
- Key claims: Always check the first generated issue is a tracer bullet, not a "horizontal splurge"; the first issue bundles DB migration + service test + UI, later slices extend it (streaks, quiz XP), and the final slice is a full gamification verification/QA plan; `settings.local.json` was edited to allow `gh issue create` (any tracker with a CLI or MCP server works); running Ralph at 10 iterations and recently 100 as default; after ~4 iterations all AFK issues were done with nearly 400 tests and issues completed in order; QA actions: run `pnpm db migrate`, complete a lesson to earn 10 XP, re-complete to verify no duplicate XP, pass a quiz to earn 5 XP; QA feedback and taste complaints (light-mode icons, top padding) become new GitHub issues; AFK and human-in-the-loop tasks are first-class, so you can plan large tranches before knowing how taste will apply.
- Learner-relevant: Shows the concrete output shape of the Kanban skill, the tracer-bullet check, permission configuration for issue creation, and how a human QA pass feeds new issues back into the board.

### lesson 75

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson75.en.srt#lesson75]]`
- Summary: Introduces research as a way to cache expensive explore phases so multiple Ralph loops don't repeat them. External docs (or docs that don't exist/publicly) make the explore phase long and costly; doing the research upstream and caching it into a local `research.md` shrinks each later loop's explore phase, saving tokens and keeping the agent in the "smart zone."
- Key claims: The explore/implementation/testing context phases say the longer the explore phase, the more a reduction helps — especially across a big Ralph loop run many times; before the Ralph loop, do a research phase and cache external documentation into a local `research.md`; research can be about a specific library/service or a design approach (e.g. SSE vs WebSockets); research is human-in-the-loop because taste guides direction and which option is chosen; not all tasks need it, but growing codebases benefit; research files have a lifecycle and must be audited like steering files, `CLAUDE.md`, or skills, because stale markdown actively hurts LLM performance.
- Learner-relevant: A reusable tactic for reducing token spend and repeated exploration, with the important caveat to treat research files as perishable artifacts that need auditing.

### lesson 76

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson76.en.srt#lesson76]]`
- Summary: Exercise to research approaches for a live presence indicator on lessons (showing icons of other students viewing the same lesson). The learner must handle presence arrival/departure (polling, WebSockets, or an external service) by co-researching with Claude Code and producing a research document in the `plans/` directory.
- Key claims: Many approaches exist — simple polling, WebSockets, or an external service; the presence UI must know when someone quits (remove from UI) and arrives (add back); the prompt should ask for several different approaches so they can be compared, request questions/iteration toward a solid approach, ask for web validation of assumptions, and require a research document in the `plans/` directory focused on implementation and intended usage; no skill is used here — just rely on Claude Code; only the markdown documents are produced in this lesson, though it may be turned into a PRD/Kanban board.
- Learner-relevant: A concrete, reusable research prompt pattern (multiple options, iterative questioning, web validation, written output) that the learner can copy for their own unknowns.

### lesson 77

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson77.en.srt#lesson77]]`
- Summary: Solution walkthrough of the presence research. The agent explores the stack (React Router v7, full-stack SSR, no existing real-time infrastructure) and asks taste questions about scale or fidelity; Matt answers (about 20 concurrent students, true real-time, "Matt, Sarah and two others are here," ephemeral data, external service preferred). Background agents compare PartyKit, Pusher, Ably, and LiveBlocks, and Ably is chosen for its generous free tier.
- Key claims: The agent's questions are effectively PRD territory and grilling the user about expectations; this is the first time in the course it launches background agents to research services; SuperBase real-time and LiveBlocks were ruled out, leaving Pusher/Ably/PartyKit, with Ably recommended and chosen partly for its free tier; the resulting research doc is ~300 lines with requirements, recommended approach, implementation design, integration points in the existing codebase, and alternatives considered (usable as an architectural decision record); research lives in the local file system (not a GitHub issue) so the implementing AI can discover it easily and reference it from the PRD/issues, and original research helps later bug fixing; doc rot warning — if you move away from Ably or its SDK changes, delete the research after the Ralph loop and QA (Git history preserves it); for production, verify and investigate each service in depth rather than trusting the AI.
- Learner-relevant: Shows what a good research doc contains, why it lives in the repo, and the discipline of deleting stale research to avoid harming future agent performance.

### lesson 78

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson78.en.srt#lesson78]]`
- Summary: Makes the case for prototyping as a human-in-the-loop technique for big builds without precedent. Where plan mode is you and the AI working out in text what to build, a prototype makes it concrete so the human can impose taste before the Ralph loop runs AFK. Good for front-end design (multiple options on a throwaway route), testing new libraries/services, and flushing out unknown unknowns early.
- Key claims: Prototyping is a decades-old technique — give a prototype to a client to play with and give feedback; it lets the human impose taste before implementation; use throwaway routes and get multiple front-end options; prototypes are also great for spinning up a new library (maybe in a throwaway repo) or testing a new service; research and prototypes combine — research options, prototype them, QA the prototypes, then feed the best into a PRD and issues for the Ralph loop; prototyping is not useful for bug fixing (desired behavior is known) or extending existing features (composing existing functionality, e.g. a new model among 100 models), but is great when redesigning an entire system; Matt uses the do-work skill for a normal human-in-the-loop run rather than a prototype skill, because he wants to stay close to the prototype applying taste; prototyping is a form of research that makes the implementation step simpler rather than saving explore phases.
- Learner-relevant: A decision framework for when to prototype and how it feeds the PRD/Kanban pipeline, plus the habit of keeping prototypes close and human-driven.

### lesson 79

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson79.en.srt#lesson79]]`
- Summary: Exercise to prototype the presence research before implementing it AFK. The learner runs the do-work skill with the `plans/live-presence-indicator` research, builds the prototype on a throwaway developer-only route, and creates a local asset the eventual implementer can reuse. Seeing it work validates whether the AFK wait is worth it and flushes out bugs.
- Key claims: Prototype before AFK implementation to confirm the wait is worthwhile, see it working, and fix implementation bugs; the prompt specifies the do-work skill, points at the research, and asks for a throwaway route visible only to developers plus a reusable local asset for the implementer; the prompt should explain the purpose of the prototype; optionally ask for multiple design options, but here the design is already clear so only one is needed; actually running it requires signing up to Ably.
- Learner-relevant: A copy-pasteable prototyping prompt and the practice of scoping a prototype to a dev-only throwaway route that produces a reusable asset.

### lesson 80

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson80.en.srt#lesson80]]`
- Summary: Solution walkthrough of the prototype. Matt keeps using the do-work skill for human-in-the-loop mini sprints and applies TDD and rigorous code standards even to the prototype so the later implementation copies production-ready code. The agent adds Ably, makes the prototype components reusable/exported for drop-in use, then an Ably API key is created with the right scopes, stored in the environment, and presence is verified in real time across two browser sessions.
- Key claims: The do-work skill encodes feedback loops and TDD for human-in-the-loop work; applying code standards to prototypes means the AFK implementation copies genuinely production-ready code; the agent ran `pnpm add ably`, ran types and tests, committed, and exported reusable prototype components designed to be dropped into the real app; it produced a "how to test it" note; obtaining an Ably API key was confusing, so Matt asked for a detailed step-by-step guide with the exact scopes ("get the API key, set the right capabilities"), which the research made easy; the key was placed in `.env`, then on the `dev presence` route presence updated in real time (Olivia Martinez appeared; leaving removed her instantly); at this point all unknown unknowns are flushed out and the rest can be worked out AFK; the key lesson is to categorize prototyping as human-in-the-loop work that validates assumptions before committing to an AFK build.
- Learner-relevant: End-to-end demonstration that a small human-in-the-loop prototype de-risks an unknown unknown and makes the subsequent AFK implementation trivial, with the concrete Ably key/scope and multi-tab verification steps.

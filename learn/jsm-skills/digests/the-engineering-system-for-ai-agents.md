---
source: The Engineering System for AI Agents
source_type: text
source_lines: 1306
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — The Engineering System for AI Agents

## Overview (L1)

- The talk opens with the "decay" problem: when you build with AI by prompting feature after feature, every feature makes the next one harder, not easier — missing features, silent breakage, no reuse, and a codebase that drifts because nothing holds the project together.
- It argues this is not a prompt problem but an engineering problem: "you never gave the AI a plan, you gave it a wish," and the plan-first discipline software solved decades ago was thrown out when people started building with AI.
- The workflow (phase-based skills: scope → architect → develop → audit/sync → check verify / test / check review / document → debug) puts that discipline back, making the AI recommend while the engineer decides, and keeping state in files.
- It demonstrates the same workflow on inherited legacy code (a 15-year-old PHP codebase with no JavaScript), showing the whole discipline bends around code you didn't write.
- Closing thesis: the difference between prompting an AI and engineering with it is judgment — decide what to build first, make hard calls on purpose, keep state in files, and never let the AI decide something important silently.

## Structure (L2)

### The decay problem — every feature makes the next one harder

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#00:00]]`
- Summary: The agent builds fast (frontend, backend, database), but closer inspection shows missing features and unwanted additions. Fixing one thing quietly breaks another; a few prompts in, the engineer has half forgotten the original goal and is circling — re-explaining, re-fixing — while hours and tokens burn. Then the AI ships a whole new component/function for logic that already exists; nothing is reused, the app slows, code gets messier, and new features break old ones.
- Key claims: Building this way does not compound — it decays. "Every feature makes the next one harder because nothing is holding the project together." No plan the agent remembers, no record of decisions, nothing making it build with what already exists.
- Learner-relevant: The motivating failure mode — anchors a lesson on why plan/decision artifacts matter, and gives the "decay vs. compound" framing for the whole subject.

### A wish, not a plan — the root cause is an engineering problem

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#02:30]]`
- Summary: Almost all the spiral traces to one thing: "You never gave the AI a plan. You gave it a wish." No serious engineering team opens the editor first — they plan what they're building, what's in v1, what's explicitly out, in what order. Requirements before code. We solved this decades ago, but quietly threw the step out when building with AI.
- Key claims: "Changing a line in a plan is free, but changing a decision that's already spread across your codebase is a rewrite." This was never something a better prompt could fix — it's an engineering problem.
- Learner-relevant: The core thesis and the cost asymmetry (cheap plan edits vs. expensive codebase-wide rewrites) that justifies the whole workflow.

### Scope — turn a vague idea into a real ordered plan

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#03:19]]`
- Summary: The scope skill puts the planning step back. Given an idea, instead of jumping to code it interviews you like a senior engineer: who is this for, what's in v1 vs. what waits, what depends on what. It then recommends how to shape the build — prove one thin slice end-to-end, ship the smallest usable version, or finish a full journey at a time — and says why.
- Key claims: Scope deliberately never touches tech (database, framework, libraries) so the plan doesn't rot when you change tools; the "how" (stack, database) is its own later decision. It turns a vague idea into a real ordered plan *you* made, not one the AI guessed in a hurry.
- Learner-relevant: A lesson could anchor on the deliberate "what, not how" separation and the build-shaping strategies.

### Architect — make the hidden decisions on purpose

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#04:40]]`
- Summary: A plan isn't a design. You must decide database design, stack, critical logic, and how to architect for scale without overbuilding. Every feature hides decisions the AI makes silently (how data is stored, failure behavior, pagination, provider) and buries them in code — you inherit the choice and its breaks. The architect skill runs the design conversation a senior engineer would: patterns first, opinions a good engineer holds.
- Key claims: Defaults include start with a monolith, relational DB by default, paginate every list, rate-limit every public endpoint, never keep secrets in code. For each real decision it lays out the recommendation and the honest alternative with the reason it lost — written down where you can overrule it. A specific check names the source of every value a feature must show or compute (a total, a date, a status); any value with no source is a decision nobody made, caught at design time instead of invented mid-build.
- Learner-relevant: The value-provenance check is the concrete safeguard, and the "decisions on purpose, surfaced for the engineer" convention is central to the whole system.

### Develop — an AI that refuses to build on unmade decisions

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#07:09]]`
- Summary: When building, develop unexpectedly stops: it refuses to build because doing so would mean inventing a decision nobody made. The detection is mechanical, not vibes — an AI will happily convince itself a real decision is "just wiring," so develop lists every value the feature must produce and checks where each comes from; any value with no source is a decision owed, so it stops and sends you back to make the call.
- Key claims: You can still override and build anyway, but the assumption gets written down and flagged on the feature until it's properly decided — even the corner you cut is visible in a file, not lost in chat. It won't catch 100%, but catching almost all is a different world from making all decisions silently.
- Learner-relevant: The gate is the workflow's most memorable mechanic — a lesson can anchor on mechanical (not felt) detection and on flagging rather than enforcing.

### Keep the state in files — audit and sync the context

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#09:02]]`
- Summary: Every agentic setup runs on a context file (AGENTS.md, CLAUDE.md, etc.) telling the agent the stack, commands, conventions. Without it, each new session opens blind and guesses differently, so the codebase drifts into three styles. Setting one up well is fiddly, especially across a monorepo or split services where one giant file bloats every session. The audit skill reads the actual project, structure, stack, and the decisions architect already made, and writes the context from what's really there.
- Key claims: A single app gets one clean file; a monorepo gets a lean root file plus separate ones beside parts with their own rules. Audit never overwrites handwritten edits — it only fills gaps — and when code disproves a doc claim it flags the conflict for you to decide. The sync skill reconciles the files against what the repo actually shows, so month-three context still describes the real app.
- Learner-relevant: "Your project's knowledge no longer lives in a chat that vanishes when you close it; it lives in a file" — a lesson could anchor on lean, correctly-placed context and on the honesty/safety conventions.

### Real inherited code — running the workflow on a legacy codebase

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#11:28]]`
- Summary: Most tutorials (including the speaker's) build on clean, new projects, but the real job is someone else's years-old codebase with no or outdated docs, conventions you must reverse-engineer, often not even the stack from the tutorials. The question isn't "can AI read this" (of course it can) but "can a whole engineering workflow operate on a mess you inherited." Audit pays off again: pointed at a real project it reads what's there and writes down how it actually works — even a 15-year-old PHP codebase with no JavaScript, because it captures engineering context, not a framework.
- Key claims: Once the project is understood, the rest of the workflow bends around it — scope enrolls what's already built and plans the next slice on top of reality, designed against the existing system's constraints rather than in a vacuum. The point is reuse instead of regeneration, and the entire discipline (plan, decide, build) runs on code you didn't write in whatever language it's in. Taking over inherited code and moving it forward without breaking it is what you'll spend most of your career doing, and almost nobody teaches it.
- Learner-relevant: The legacy-codebase application is the talk's strongest differentiator — a lesson could anchor on audit-as-entry-point and designing against real constraints.

### Verification — four separate jobs, matched to risk

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#14:27]]`
- Summary: The AI says "done" and it doesn't — the button does nothing, an edge case crashes, or a planned screen was never built. Green tests only prove the code the AI thought to test; they never prove the feature exists. The workflow keeps four jobs separate: check verify drives the real app (clicks the flow, hits the endpoint) against the plan's criteria; test writes the suite a senior engineer would (what a caller relies on, what would genuinely break something); check review reads the diff on a different model than the one that wrote it; document writes the human record (PR description, changelog) from the actual diff, not the AI's memory.
- Key claims: A model reviewing its own work carries its own blind spots, so review uses fresh eyes that rank findings. How many of the four you run is up to you and the project — a throwaway prototype self-checks, a payment system runs all four; match effort to risk. It's not done when it renders in the browser; the plan promised screens must actually exist.
- Learner-relevant: The four jobs and the reviewer-on-a-different-model rule are concrete, teachable mechanisms; the risk-matching principle ties back to the "suggestions, never gates" convention.

### Debug — investigate the cause instead of guessing

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#17:25]]`
- Summary: When something still slips through and you tell the AI to fix it, it starts thrashing — one change, still broken, three more, still broken — and 20 minutes later you have five random edits, the original bug, and two new ones. That's pattern-matching a fix instead of finding the cause: the decay in its purest form. The debug skill investigates the way a real engineer does.
- Key claims: Reproduce the bug reliably first (a bug you can't reproduce on command is one you can't prove you fixed); narrow to the smallest failing spot; form exactly one theory about the root cause and test that one thing before touching anything else; if wrong, throw the change away and learn. Fix the cause, not the symptom (don't clamp a null to hide the error — find why it was null). Write a test that fails without the fix and passes with it so the bug can never quietly return, hunt for the same mistake elsewhere, and if the real issue is a bad decision, say so and send you back to redesign rather than papering over it.
- Learner-relevant: The one-theory-at-a-time discipline and fail-without-fix/pass-with-fix test are directly teachable habits; the "react to symptom vs. investigate cause" contrast is a strong lesson framing.

### Adapt to the project — and closing

- Locator: `[[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#19:45]]`
- Summary: It's not a rigid process run identically every time — a small app doesn't need the same workflow as a massive codebase, and a brand-new project differs from one that's been around for years. The workflow looks at what you're building, how big it is, where it's going, and adapts, guiding like a senior engineer instead of forcing every project into one process. That's the difference between a pile of prompts and an actual engineering system.
- Key claims: The recap — plan it properly, make decisions on purpose, keep state in files, work on real code, prove it actually runs, and fix it with discipline when it breaks: a workflow that compounds instead of decays. All the skills are open source and free; running them is the easy part, but knowing when to run which one and how to judge the AI's recommendation is the un-installable judgment the course exists to teach. Final lesson: decide what to build first, make the hard calls on purpose, keep state in files, and never let the AI decide something important without telling you.
- Learner-relevant: The adaptive, override-able framing summarizes the system's philosophy; the closing recap is a ready-made lesson outline for the subject.

---
source: ai-coding-for-real-engineer.04
source_type: text
source_lines: 3422
part: 4
status: absorbed
absorbed_at: 2026-10-01
created: 2026-10-01
updated: 2026-10-01
---

# Digest — ai-coding-for-real-engineer (part 4: lessons 31-40)

## Overview (L1)

- lesson 31 — Introduces progressive disclosure: a bloated CLAUDE.md pushes narrow, session-specific instructions into global scope where they compete with the prompt. Better to group related instructions into separate reference files and link them from CLAUDE.md so complexity is disclosed on demand; the concept recurs in steering and architecture.
- lesson 32 — Defines Agent Skills as an open, cross-agent format invented by Anthropic and given away: discoverable folders of instructions/scripts/resources where only `name` + `description` are visible by default and the agent invokes a skill to load its body. Covers project vs user scoping, `skill.md` frontmatter, bundling scripts, and LLM-invoked vs user-invoked skills (`disable-model-invocation`, user-invocable false).
- lesson 33 — Exercise: use a "Write a Skill" skill to refactor CLAUDE.md coding standards into a progressive-disclosure `coding-standards` skill with linked reference documents. Only the prompt is given; the solution is in the next lesson.
- lesson 34 — Solution to the exercise: builds a `coding-standards` skill that groups rules into reference files (database, front end/UI, routes and forms, services and testing) with a concise `skill.md` pointing to them. CLAUDE.md becomes a small context pointer; two pointers (CLAUDE.md + skill description) raise pickup odds and reference files avoid context bloat.
- lesson 35 — Claude Code's automatic memory: the `memory` command reveals user memory (user CLAUDE.md), project memory (project CLAUDE.md), and an auto-memory folder containing a Claude-written `memory.md`. Warns the auto memory can be arcane, stale, or conflicting and should be reviewed/edited every couple of weeks.
- lesson 36 — Ties large tasks to context-window management (smart zone vs dumb zone): break big work into small tasks and plan across multiple context windows with a PRD (destination/spec) plus a `plan.md` (journey/phases). The per-phase prompt passes the phase number, the PRD, and the whole plan so phases don't collide.
- lesson 37 — Writing a PRD: the `to-PRD` skill turns the current conversation context into a locally saved PRD. Workflow is grill-me to find the destination, then to-PRD; template is problem statement, solution, and a numbered user-story list, written after exploring the repo. Demo uses an instructor analytics dashboard; only the PRD is created and committed.
- lesson 38 — Live grilling demo for the instructor analytics dashboard, ending in a generated PRD (~52.2k tokens). Socratic questions pin scope (cross-course vs per-course), route placement, metrics (pulled back to revenue + rating), time-series ranges, table columns, chart type/library, nav entry, default range, and empty states; the PRD captures problem, solution, user stories, implementation/testing decisions, and out-of-scope.
- lesson 39 — Naive plan exercise: start a new Claude Code session, pull the PRD in with `@`, and ask it to "turn this into a multi-phase plan and save it as a local Markdown file" with no further guidance. Learner notes improvements and reasons about task/phase sizing; solution is next.
- lesson 40 — Review of the naive plan: the model eagerly produced `plans/instructor-analytics-dashboard.md` (no grilling) in four horizontal/layered phases (analytics service → shared dashboard component + recharts → route UI → admin route + link). Critique: overly specific implementation detail that goes stale and names functions that may never exist, and no linkage to the PRD user stories; the sizing and acceptance criteria are good.

## Sections (L2)

### lesson 31

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson31.en.srt#lesson31]]`
- Summary: Uses a bloated CLAUDE.md (one a team has layered "sediment" into) to show that dumping narrow, context-specific instructions into global scope wastes context and competes with the prompt. Refactors the idea by grouping related instructions into separate markdown files linked from CLAUDE.md, naming the underlying principle "progressive disclosure" from UI/UX design.
- Key claims: Global-scope instructions are not relevant to every request and compete with prompt instructions; related rules (React Router advice, DB rules, timestamps/IDs, importing) belong grouped together in separate files; CLAUDE.md should link out to those files via markdown links so complexity is disclosed on demand; progressive disclosure = reduce upfront choices and let the user/agent navigate a map instead of taking all complexity at once; the concept recurs throughout the course (steering, software architecture, codebase design).
- Learner-relevant: Foundational mental model for why CLAUDE.md should stay small; frames context as a budget and introduces the "gray blobs in the context window" intuition that later justifies skills.

### lesson 32

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson32.en.srt#lesson32]]`
- Summary: Presents Agent Skills as the community-standard mechanism for progressive disclosure: an open format (invented by Anthropic, then given away) where a skill is a folder of instructions, scripts, and resources the agent can discover rather than be forced to read. Only the skill's name and description are visible by default; invoking the skill loads its instructions.
- Key claims: Skills are discoverable, not force-fed into the context window; default exposure is name + description, and the body becomes available only when invoked; project-scoped skills live in `.claude/skills` and are easier to share with teammates than user-scoped ones; `skill.md` starts with front matter holding `name` and `description`; examples are a `pnpm-not-found` skill (run `corepack enable`) and a `better-sqlite3-rebuild` skill (run `npm`/`pnpm rebuild` on native module version mismatch); skills can bundle scripts/images and reference them via markdown links ("context pointers"); two types exist — LLM-invoked and user-invoked — controlled by front matter (`disable-model-invocation: true` hides the description from the model; user-invocable false makes it model-only); the `skills` command lists available skills; skills need name+description to be distributed.
- Learner-relevant: Teaches the concrete file convention and invocation model for skills, plus the skill-selection heuristic (rare but high-leverage guidance that shouldn't bloat global config).

### lesson 33

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson33.en.srt#lesson33]]`
- Summary: Sets an exercise: use the provided "Write a Skill" skill to build a `coding-standards` skill that encapsulates the ~100+ lines of coding standards sitting in CLAUDE.md. The goal is to organize the standards into progressively disclosed sections the LLM can find when needed without pushing them into every request's context.
- Key claims: Best way to learn to write a skill is to use a skill to write one; a large CLAUDE.md is included on every request and is wasteful; the target is a `coding-standards` skill with grouped sections and reference documents; after refactoring, the CLAUDE.md content (or all of CLAUDE.md) can be removed, leaving only a reference/pointer to the skill; the conversation with the agent is central to learning skill authoring.
- Learner-relevant: Practice-oriented prompt and workflow for converting a monolithic config into a skill; reinforces the pointer pattern from lessons 31–32.

### lesson 34

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson34.en.srt#lesson34]]`
- Summary: Solution demo of the exercise: dictating a prompt into Claude Code to create a `coding-standards` skill that buckets the disparate CLAUDE.md instructions and references external documents. The agent eagerly groups rules into five reference files (database, front end/UI, routes and forms, services and testing) plus a concise `skill.md`, and CLAUDE.md is reduced to a tiny pointer.
- Key claims: The skill description is what loads into context, so keep the skill body short; the skill is essentially a set of reference files linked from `skill.md` by markdown links; two context pointers (one in CLAUDE.md, plus the skill description) increase the chance the skill is picked up; reference files prevent bloat of the parent context because only needed content is pulled; recommended usage is manual reviews ("review this code, use the coding standards in this skill"); the pattern can be shared across an organization to standardize coding standards; the setup behaves "kind of like a file system" the agent pulls from as needed.
- Learner-relevant: Shows the concrete end state and clarifies that the skill is an index over reference docs; models a practical, shareable documentation structure.

### lesson 35

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson35.en.srt#lesson35]]`
- Summary: Covers Claude Code's relatively new automatic memory, which lets Claude steer itself over time. The `memory` command reveals user memory (user-level CLAUDE.md), project memory (project CLAUDE.md), and an auto-memory folder where Claude can write its own `memory.md`.
- Key claims: Automatic memory writes Claude's own steering documentation into a `memory.md` that is placed into context alongside CLAUDE.md; the contents can be arcane/overspecific (e.g. `npm install --force` vs `--legacy-peer-deps`, Vitest/testing patterns like `vi.mock` hoisting, DB test setup) and can go stale or conflict with repo reality; recommended practice is to inspect and edit it every couple of weeks and delete anything unwanted or outdated; the speaker is still undecided how to feel about it.
- Learner-relevant: Awareness of a second, model-authored steering surface beyond CLAUDE.md; teaches a maintenance habit and the risk of stale/conflicting auto-generated context.

### lesson 36

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson36.en.srt#lesson36]]`
- Summary: Frames the "task too big for one context window" problem in terms of the context-window "smart zone" and "dumb zone." Since large work (like a big refactor) can't fit, break it into small tasks and plan across multiple context windows using two documents: a PRD (the destination) and a `plan.md` (the journey/phases).
- Key claims: Staying in the early ("smart") part of the context window is fine for small features and bug fixes but fails for large refactors; the long-standing technique is breaking a big task into small tasks; a destination document (also called spec or PRD) tells the system where it is heading; a `plan.md` next to the PRD describes the journey by breaking the PRD into phases; each phase's prompt has three ingredients — "we're doing phase N", the PRD, and the entire plan; passing the whole plan prevents phases from stepping on each other.
- Learner-relevant: The core multi-session planning mental model and the PRD + plan pairing that the rest of the section builds on.

### lesson 37

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson37.en.srt#lesson37]]`
- Summary: Introduces the `to-PRD` skill, which takes the current conversation context and produces a PRD saved locally. The intended workflow is to start with a grill-me session to find the destination and, if it is too big to implement in one context window, call `to-PRD`.
- Key claims: `to-PRD` runs a simple two-step process — explore the repo to understand the current state, then write the PRD from a template; the PRD template is: problem statement (from the user's perspective), solution (from the user's perspective), and a long numbered list of user stories; the template is offered as an evolving artifact open to debate; the demo feature is an instructor analytics dashboard (sales, completion rates, quiz scores, lesson drop-off); the point of the exercise is to judge whether the PRD captures the shared design concept — not to implement it yet, only create and commit.
- Learner-relevant: Concrete skill and template for writing a destination document; introduces user stories as the link between requirements and later task breakdown.

### lesson 38

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson38.en.srt#lesson38]]`
- Summary: A live, extended grilling session that produces the analytics-dashboard PRD. Grill-me asks adversarial, Socratic questions and the speaker steers the decisions, pulling scope back to a small v1; `to-PRD` then emits the document from the accumulated context (~52.2k tokens).
- Key claims: Decisions made — cross-course overview (not per-course); a new analytics route rather than replacing the instructor page, visible to admins too; metrics pulled back to revenue + rating (dropping completion rate, drop-off, quiz, and geographic breakdown as unreliable/out-of-control); a time series with a range selector kept in the URL (7 days / 30 days / 12 months / all time, default 30 days); a single aggregate line plus a sortable table (list price, revenue, sales, enrollments, average rating, rating count — sales differ from enrollments because of team purchases); KPI summary cards (total revenue, total enrollments, average rating); line chart over bar chart, zero-dollar buckets still rendered; bare `recharts` rather than a ShadCN wrapper; a new sidebar item at route `instructor/analytics`; simplified empty state ("no revenue data yet, publish a course"). Meta-points: the human stays in charge, specify implementation details when you have a view, deep domain understanding matters, running two or three grill sessions in parallel panels is a habit, and grill-me may ask up to ~100–200 questions. The PRD contains problem statement, solution, numbered user stories, implementation decisions (new analytics service, instructor/admin routes, shared component), technical and testing decisions, out-of-scope list, and further notes.
- Learner-relevant: Models how to steer an agent-driven requirements conversation and what a finished PRD looks like; shows the exact kinds of scope/metrics/UI decisions a destination doc should resolve.

### lesson 39

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson39.en.srt#lesson39]]`
- Summary: A short exercise introducing the "naive" way to create `plan.md`: open a fresh Claude Code session, pull the PRD into context with the `@` reference, and ask it to convert the PRD into a multi-phase plan saved as a local Markdown file, with no further specification.
- Key claims: There is a good and a naive way to produce a plan; the naive prompt is simply "turn this into a multi-phase plan and save it as a local Markdown file" after referencing the PRD; task/phase sizing and what happens inside each context window matter; the learner should note how they would improve the output and compare divergent results.
- Learner-relevant: Sets up the critique in lesson 40 by having the learner attempt (and observe) an under-specified plan-generation prompt.

### lesson 40

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson40.en.srt#lesson40]]`
- Summary: Reviews the naive plan the agent produced in `plans/instructor-analytics-dashboard.md`. The model eagerly explored the codebase and wrote a four-phase plan without any grilling, organizing the work in horizontal layers.
- Key claims: The generated plan uses four horizontal/layered phases — (1) analytics service + tests, (2) shared dashboard component + install recharts, (3) use the UI in a route, (4) admin analytics route + user page link; it embeds implementation-guide-level detail inside steps; the critique is that naming specific functions is risky because they may not exist by the time later phases run (especially if the human overrides phase one), so the details go stale quickly; it fails to reference the PRD user stories that the design "sweated over," losing the link back to the why; positives are the acceptance criteria and reasonable task sizing, with phases three and four possibly condensable; sets up the forthcoming explanation of why horizontal layering is bad.
- Learner-relevant: Teaches how to critically review an agent-generated plan and the specific failure modes (over-specification, staleness, missing traceability to user stories) to guard against.

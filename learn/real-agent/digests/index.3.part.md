---
source: sources/real-agent/20261030/index.txt
source_type: text
source_lines: 3964
part: 3
status: skipped
skip_reason: "consolidated duplicate of the 38 per-lesson .srt transcripts, which are digested individually; kept only as the source of the [FIGURE] annotations"
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- Spec → Implement (practice) — The finished Wayfinder map is too dense to hand to an implementer, so it is converted in two compression steps: `/to-spec` flattens the decisions into a single spec that links back to the map, then `/to-tickets` breaks the spec into blocked-by-linked build tickets. Implementation then runs from a cleared context via `/implement-spec`, and the learner QA's the result against what the map decided.
- Spec → Implement Solution (solution) — A full walkthrough of the compression chain on the Cadence notifications feature: 61 user stories and the vendor/catalog/preferences decisions collapse into one spec, then eight tickets (prefactor, tracer bullet, five parallel, one opt-in). The orchestrator/merger agents catch their own problems (test duplication from `.claude/worktrees/`, glossary violations), code review fixes 15 findings, and remaining human work is narrowed by discovering Knock's Management API and writing a short skill so future agents know the push-workflows script.
- Grill vs Wayfinder vs Ship First (lesson) — A decision tree for choosing process weight: one-shot when the diff is tiny and cheap to redo, `/grill-with-docs` as the default for anything medium or larger, and `/wayfinder` as a graduation path only when grilling reveals far more fog than expected. The asymmetry matters: escalating grill → wayfinder keeps the earlier work, while starting with wayfinder and finding the work simple wastes the ceremony and is hard to unwind. Concrete axes: up-front alignment vs review-after-the-diff, single session vs multiple sessions, and whether prototypes and a map are produced.

# L2 detail

- `#L2708-L2710` — Lesson banner for "Spec → Implement" (practice) and its separator rule.
- `#L2711-L2720` — Practice framing: two start paths (reset + seed the finished map, or seed `07b-tickets` to skip ahead), and the premise that the raw map is too dense to hand directly to an implementation agent.
- `#L2721-L2733` — Steps To Complete: Choose Your Path — reset/seed commands for path 1, and using your own finished map as path 2.
- `#L2734-L2742` — Turn The Map Into A Spec: run `/to-spec` with the map issue URL; the spec must link back to the map so every decision stays traceable.
- `#L2743-L2750` — Create The Tickets: run `/to-tickets`; each ticket links back to the map and its prototypes so a picking agent has full context.
- `#L2751-L2761` — Implement And Ship: clear context, run `/implement-spec <spec-issue>`, then QA the feature against the map's decisions; expected to work first time.
- `#L2762-L2765` — Lesson banner for "Spec → Implement Solution" (solution).
- `#L2766-L2771` — Solution setup: feed prototype removed, Wayfinder skills and glossary in place; deliverables include `/implement-spec` output plus `scripts/push-knock-workflows.ts` and the knock-workflows skill.
- `#L2772-L2781` — Running `/to-spec` against the map issue; the skill knows nothing about Wayfinder and simply pulls in every decision ticket.
- `#L2782-L2787` — Proposing seams: `/to-spec` proposes test seams, giving an overview of the modules that will be created; accepted, then spec generation proceeds.
- `#L2788-L2808` — Reading the spec ("In-app Notifications for Cadence"): problem statement, 61 user stories, implementation decisions (Knock as vendor, catalog, firing services, preferences, user sync, client feed port, feed UI), prototype branches, and the whole map — a compressed map ready for an agent.
- `#L2809-L2812` — Why bother with a spec: the map could be passed directly, but the spec flattens and spoon-feeds information so agents find what they need easily.
- `#L2813-L2840` — `/to-tickets` breakdown: 12 proposed is too many, trimmed to eight; the ticket table with blocked-by edges (prefactor, tracer bullet, then parallel feed/questions/refunds/seat-claims/user-sync, then opt-in enrollment), and eight sub-issues created under the spec.
- `#L2841-L2849` — Running `/implement-spec`: `/clear` then pass the spec number; deliberately not babysat — left to run before an autopsy.
- `#L2850-L2856` — The autopsy begins: hours of implementation; the agent explored the Knock prototypes, saved notes to `cohort-005-notes`, created implementers, and merged the first pieces on `feature/notifications`.
- `#L2857-L2865` — Orchestrator self-correction: it noticed the implementer picked up test files inside `.claude/worktrees/`, inflating test counts, and had a follow-up agent add `".claude/**"` to the vitest exclude list.
- `#L2866-L2872` — Parallel implementers and merging: tracer bullet built, a merger agent integrates each finished branch as it lands, five tickets run at once, partial verification (after-cursor paging, seen/read) works while some checks still need a browser.
- `#L2873-L2882` — Code review: spec review plus standards review find two hard violations and glossary misuse (the `addLearner` test helper, "Coupon", seat-claims error messages), plus smells and spec drift; a fix agent resolves all 15 findings while leaving the five flagged to keep.
- `#L2883-L2888` — What still needs a human: commit the eight Knock workflows in development, move discussion reply to its own category, run `npm run knock:sync-users` for default preferences, and check the UI in a browser.
- `#L2889-L2899` — Avoiding the Knock wizard: the agent reports Knock has a Management API and CLI that create/commit workflows from JSON, needing a service token — judged worth it.
- `#L2900-L2915` — Compacting the session: `/compact` keeps the PR's main details and discards sub-agent chatter; research confirms the Management API does everything the dashboard wizard does, enabling `npm run knock:push-workflows`.
- `#L2916-L2936` — Teaching the agent about the script via `/writing-for-agents`, while creating the service token in the Knock dashboard, adding `KNOCK_SERVICE_TOKEN` to `.env`, pushing workflows, and hitting an error to hand back.
- `#L2937-L2971` — The written knock-workflows skill (~25 lines): description triggers, workflows as code, the two sources of truth (`WORKFLOWS`/`CATEGORY_KEYS` and `TEMPLATES` typed by `NotificationKind`), steps, credentials, and asking the human for a token.
- `#L2972-L2999` — Letting the agent debug: the push-workflows error (422, template needs exactly one of `action_url`/`action_buttons`) is fixed by the agent; the digression on agents needing perfect information and a safe button to press to hill-climb; all eight workflows then commit successfully.
- `#L3000-L3021` — Browser QA: notification popover and settings icon, categories (Enrollments, Discussion Questions, Discussion Replies); testing a discussion question as Emma Wilson to Marcus Johnson, a reply back, and preference toggling that correctly suppresses the notification.
- `#L3022-L3031` — Payoff of upfront planning: high-fidelity pre-planning lets the result mirror decisions; fidelity table contrasts the super-high-fidelity notification bar prototype with the low-fidelity settings/feed where the agent used its own creativity.
- `#L3032-L3035` — Lesson banner for "Grill vs Wayfinder vs Ship First" (lesson).
- `#L3036-L3042` — Framing: the full Wayfinder flow (grill → prototype → research → tasks → spec → implement) is heavy; still a lot of grilling, prototyping, and thinking before any code.
- `#L3043-L3053` — Three options and their table: one-shot (code without grilling), `/grill-with-docs` (agent questions you first), `/wayfinder` (align across sessions with prototypes and tasks).
- `#L3054-L3059` — The decision tree from a new session, branching to one-shot, grill-with-docs, and wayfinder.
- `#L3060-L3080` — "Is the diff tiny?" — button color, failing test, tiny review; grilling exists to prevent a huge unwanted diff, but a small diff is cheap to redo, so one-shot UI tweaks (icons, text, sizing, margins) and review afterwards.
- `#L3081-L3084` — Start with Grill with Docs for anything medium or larger; recommended as the default for every session you don't intend to one-shot.
- `#L3085-L3098` — Graduating to Wayfinder from inside a grill session ("Let's turn this into a wayfinding map"), and the failure case of starting with Wayfinder: the ceremony is already built and hard to recover from when the work turns out simpler than expected.
- `#L3099-L3109` — Summarized decision tree: one-shot tiny diffs and align after; otherwise start with `/grill-with-docs`; escalate into a Wayfinder map when the session enters the dumb zone or fog exceeds expectations; use Wayfinder as an escape hatch, not a default.

---
source: sources/real-agent/20261030/index.txt
source_type: text
source_lines: 3964
part: 5
status: skipped
skip_reason: "consolidated duplicate of the 38 per-lesson .srt transcripts, which are digested individually; kept only as the source of the [FIGURE] annotations"
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- Why Retro — Human review has a third purpose beyond speed and prioritization: improving the system that produced the code. Every review comment is a signal that should become a rule so you never leave the same comment twice, which feeds into automated review and (later) automated checks.
- The retro ritual — `/retro` reads an agent session (or many, found as saved transcript files on disk) and proposes environment improvements across coding standards, global AGENTS.md, tool economy, automated checks, and navigation. It is worth running because agents suffer in silence about a bad setup.
- Trying Out Retro — Practice run: do a brief process-focused human review of PR #34, leaving only comments that describe a reusable rule, then run `/retro` over every session behind the PR plus its comments and read the candidates.
- Trying Out Retro Solution — Worked example: review comments on glossary-consistent UI labels, a shared `TestDb` type, tests built through module functions, no explanatory comments, and branded Markdown/PlainText types. Then `/retro` over six sessions, judge its report critically, apply only chosen items, and land the changes.
- Takeaway — Retro changes the calculus of whether human review is worth doing: it converts review comments into durable standards and can be re-run on any session that produced a bug.

# L2 detail

- `#L3663-L3671` — Lesson banner and setup steps: merge the Bookmarks/Notes PR with code review fixes, then add the retro skill.
- `#L3672-L3687` — The third lens: human review is not just checking the diff but improving the system that made it; every comment should enter the system so it never has to be repeated.
- `#L3688-L3696` — The two downstream layers human review feeds: automated review (LLM-as-a-judge) and automated checks (deterministic); this lesson focuses on automated review.
- `#L3697-L3707` — Installing the skill with `npm run cherry-pick add-retro-skill` (not reset, to keep the PR) and where SKILL.md lands.
- `#L3708-L3724` — What the retro skill does and its five categories: coding standards, global AGENTS.md pruning, tool economy, automated checks, and navigation.
- `#L3725-L3732` — Running retro on one session or across many; it works because harnesses persist session files locally, and it reads the raw material the agent saw.
- `#L3733-L3739` — Why it is worth running: agents will not complain about their setup, and regular retros reveal how poor the environment and its opportunities actually are.
- `#L3740-L3750` — Practice lesson banner and framing: a fix only fixes once, so the habit remains; the exercise is process-focused review plus retro over every PR session.
- `#L3751-L3762` — Human review steps: read the diff, ask /teach about unclear code, leave line comments that describe patterns/rules rather than implementation details, delete comments that are too code-specific.
- `#L3763-L3775` — Run-retro steps: point `/retro` at all sessions behind the PR and ask it to grab the PR comments, then read the candidates it proposes.
- `#L3776-L3785` — Solution lesson banner and the promised outcome: two new CODING_STANDARDS rules, banner comments removed, shared TestDb type, branded Markdown/PlainText types.
- `#L3786-L3822` — Reviewing the sidebar "Saved" label (violates the glossary) and test setup that inserts rows raw instead of going through module functions; the reasoning that tests should survive a database swap.
- `#L3823-L3834` — Disliking comments that restate obvious code, and using branded types to separate Markdown from plain text in the type system; ends with four or five review comments.
- `#L3835-L3852` — Running retro on the PR sessions: it loads the writing-for-agents skill as context, finds all six sessions including /code-review sub-agents, and is token-expensive so batch across sub-agents for large runs.
- `#L3853-L3862` — Judging the report: retro can be wrong and, if allowed to self-apply fixes, loops into worse states; item one (rerun code review after fixes) is judged too hardcore and rejected.
- `#L3863-L3892` — Item two in depth: unwritten preferences lost to existing banner-comment conventions, plus raw db inserts in tests; retro proposes two CODING_STANDARDS rules and deletion of the banner comments, including the point that code must change too.
- `#L3893-L3902` — Choosing fixes to apply: ignore item one, accept all of item two, also do items five and six, leave the rest; the exact instruction given to the agent.
- `#L3903-L3930` — Agent implements branded types: unique-symbol branded `Markdown`/`PlainText` with constructors, then schema columns annotated via `$type<Markdown>()` and `$type<PlainText>()`.
- `#L3931-L3951` — Agent moves `TestDb` into shared test setup, deletes all module banner comments, and appends the two new rules to CODING_STANDARDS.md.
- `#L3952-L3964` — Wrap-up: the standards now reflect intent, retro changes whether and how much human review is worth doing, it can be run on a session that produced a bug, and closing sign-off.

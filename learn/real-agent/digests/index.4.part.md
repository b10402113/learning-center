---
source: sources/real-agent/20261030/index.txt
source_type: text
source_lines: 3964
part: 4
status: skipped
skip_reason: "consolidated duplicate of the 38 per-lesson .srt transcripts, which are digested individually; kept only as the source of the [FIGURE] annotations"
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- The Three Kinds Of Review — A software factory needs brakes, not just acceleration. Three brakes: automated checks (deterministic, costs CPU only), automated review (agents), and human review (you). This section covers the latter two; checks come later in the feedback-loop section.
- The PR Skill — Human review improves on two axes: speed and priority. Agents write bad PR bodies, so the `pr` skill (adapted from HumanLayer's show-me) forces a template: visual Summary, Before/After Evidence, and Merge Danger. Merge Danger combines door type (one-way vs two-way) with blast radius to set how much review a PR deserves.
- Running The PR Skill — Practice: turn a commit into a draft PR with `npm run create-pr`, have the agent load the pr skill and rewrite the body from the diff, then judge the summary, the evidence, and whether the change is a one-way door.
- Running The PR Skill Solution — Solution walkthrough: agent self-loads the pr skill, runs typecheck and tests, posts a JSX-style summary diff. Evidence is weak (no tests cover the feature), door is one-way because migration 0012 adds tables, and blast radius is privacy because instructor roster contradicts the glossary's "notes are private". Verdict: one-way door, low quality, so automated review first.
- The /code-review Skill — Automated review is cheap, token-efficient, and underused. `/implement` makes it work; `/code-review` makes it good, running in a sub-agent with fresh context so it can be loaded with many instructions. Point it at `CODING_STANDARDS.md` to encode standards; the implementer is deliberately left free to produce a rough draft.
- Testing Out The Code Review Skill — Practice: review PR #34 on two axes, standards and spec. Put the spec in a GitHub issue, run `/code-review` with "fix what you find" plus the issue number, then inspect the result before human review.
- Testing Out The Code Review Skill Solution — Solution: review finds its fixed point, launches standards and spec reviews in parallel, reports violations and judgement calls, then fixes proactively. Spec review catches missing user stories, unasked-for features, and wrong cap/access checks. Result: better tests, pseudocode evidence, rewritten PR body, smaller blast radius — and still no human file-by-file review.

# L2 detail

- `#L3110-L3113` — Banner opening the Review module, lesson 1: The Three Kinds Of Review.
- `#L3114-L3119` — Title and framing: a software factory is like driving, so learn to brake first; only accelerating produces a "slop cannon".
- `#L3120-L3129` — The three brakes table: automated checks (CPU-driven), automated review (agents), human review (you).
- `#L3130-L3143` — Automated checks (unit tests, typecheck, linters; cost CPU not tokens, so stack them) and automated review (agent-driven, seen in /code-review).
- `#L3144-L3156` — Human review as the final layer, plus what the section covers: improving human review, how much and when to look at code, then using human review to strengthen automated review.
- `#L3157-L3165` — Banner for lesson 2, The PR Skill, plus the seed/start/result cues.
- `#L3166-L3177` — Goals for improving human review: speed (understand a PR fast) and priority (not all PRs deserve equal treatment).
- `#L3178-L3196` — Agents are persistently bad at PR descriptions; the fix is Dex Horthy's show-me skill, useful for UI, file responsibility, component interaction, Mermaid timelines, and diffs.
- `#L3197-L3237` — Adapting show-me into the `pr` skill: `npm run reset add-pr-skill`, its frontmatter, and the PR body template (Summary, Evidence, Merge Danger).
- `#L3238-L3258` — Before/after evidence: prove the old behavior was broken and the new one works; screenshots are S-tier, execution-based evidence is A-tier; the agent must actually run code.
- `#L3259-L3265` — Introducing review priority via the Merge Danger section: a door plus a blast radius.
- `#L3266-L3285` — One-way vs two-way doors (AWS framing) and blast radius, with the table mapping door/blast radius to review attention.
- `#L3286-L3299` — Priority varies by project (personal software mostly two-way; medical/finance mostly one-way); small two-way PRs may skip human review, but only once automated checks and review are solid.
- `#L3300-L3312` — Banner for the practice lesson Running The PR Skill, plus its setup: a commit turned into a draft PR with an empty body.
- `#L3313-L3330` — Create the draft PR: run `npm run create-pr`, inspect the base/PR branches and Files changed tab, note the PR number.
- `#L3331-L3353` — Write the PR body: confirm `.agents/skills/pr/SKILL.md` is auto-loaded, prompt the agent with the PR number, then read the summary, evidence, and merge danger; tinker with the skill.
- `#L3354-L3361` — Banner for the solution lesson, plus the seed cues.
- `#L3362-L3381` — Solution: the short prompt "Could you take PR number 34 and write a PR body for it?", the agent self-loading the pr skill and running typecheck/tests, then posting the body.
- `#L3382-L3406` — Reading the summary: a JSX-style diff covering lesson viewer bookmark toggle and note, sidebar Saved link, /saved route ordering, instructor roster, and schema; glossary enforced ("students", not "learners").
- `#L3407-L3428` — Weak evidence (no tests cover bookmarks/notes), Merge Danger (one-way due to migration 0012, blast radius privacy from glossary contradiction), other risks (N+1 on /saved, ON DELETE no action FKs), and the decision to run automated review before human review.
- `#L3429-L3444` — Banner and opening of The /code-review Skill: most teams under-use automated review; work flows through checks, automated review, human review, with quality rising at each stage.
- `#L3445-L3463` — Why not have the implementer do it right first time: /implement explores, implements, debugs; review has a different shape (diff already found, no exploration, no files to change) and runs in a sub-agent with fresh context.
- `#L3464-L3493` — Loading the review agent: step 3 of the skill identifies standards sources like `CODING_STANDARDS.md`; the repo's three standards (no `any`/`!`, throw instead of returning errors, parse untrusted input with a schema).
- `#L3494-L3510` — CODING_STANDARDS.md vs AGENTS.md: hiding standards from the implementer lets it draft rough while review polishes; implement makes it work, code-review makes it good.
- `#L3511-L3522` — Banner for the practice lesson Testing Out The Code Review Skill, plus the key idea: automated review should fix what it finds, not just file comments.
- `#L3523-L3541` — Find PR #34 and get the spec into a GitHub issue using the gist's script; two-axis review needs standards and spec.
- `#L3542-L3561` — Run `/code-review` in a fresh session with three parts (PR number, "fix what you find", spec issue number), then check the findings and decide whether to merge.
- `#L3562-L3571` — Banner for the solution lesson, plus the opening: run /code-review and watch.
- `#L3572-L3597` — It identifies its fixed point (main), launches standards and spec reviews in parallel, then proactively fixes; the standards report lists rule breaks (error return, "learner", Note privacy, contradictory comments) and judgement calls (duplication, N+1, untested route logic, data clumps).
- `#L3598-L3623` — Instructions on judgement calls, the spec report (missing last-edited display, note box placement, unasked-for instructor notes, wrong 2000-char cap, no content-access check), what it changed, and the follow-up conversation prompt.
- `#L3624-L3648` — Pushing fixes to the PR (declining a follow-up issue), the rewritten PR description via the pr skill, and the saveNote pseudocode (trim, empty/length refusals, upsert).
- `#L3649-L3662` — Richer evidence (real test runs now cover the feature), unchanged door but reduced blast radius (no instructor/admin read of note bodies), and the wrap-up: automated review radically lifts quality before a human looks, with human file review still pending.

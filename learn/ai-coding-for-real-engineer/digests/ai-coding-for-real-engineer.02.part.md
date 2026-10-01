---
source: ai-coding-for-real-engineer.02
source_type: text
source_lines: 3502
part: 2
status: absorbed
absorbed_at: 2026-10-01
created: 2026-10-01
updated: 2026-10-01
---

# Digest — ai-coding-for-real-engineer (part 2: lessons 11-20)

## Overview (L1)

- lesson 11 — Connecting Claude Code to an IDE (VS Code, Cursor, Windsurf, Antigravity) via the `ide` command; the payoff is richer in-editor diff review and acceptance instead of cramped terminal diffs.
- lesson 12 — Going backwards and forwards in a session: ask Claude to revert, use double-Escape **rewind mode** (restore code and/or conversation, or summarize from here), and resume persisted sessions with `claude resume <UUID>`, `/resume`, or `claude --continue`.
- lesson 13 — Managing bash from inside Claude Code: `!` to enter bash mode (output enters context), Ctrl+B to background long-running commands (logs to a local file, viewable/stopable), and Ctrl+Z suspend + `fg` to run hidden commands.
- lesson 14 — The permissions model: risk vs reward, per-command approval flow, and editing/setting `.claude/settings.local.json` (allow/deny arrays, wildcards) vs sharing via `settings.json`.
- lesson 15 — Core LLM constraints: token/context windows, quadratic attention, the **smart zone vs dumb zone**, LLMs-as-fuzzy-JPEG-database, knowledge cutoffs, and total statelessness; edit note that windows grew 200k → 1M and the smart zone is ~100k tokens.
- lesson 16 — How Claude Code mitigates context limits with **subagents**: the orchestrator spawns fresh context windows that explore in their own smart zone and report summaries back; can be cheaper models, run in parallel.
- lesson 17 — Exploration exercise: statelessness makes exploration a foundational skill; prompt Claude to state the repo's tech stack and purpose while watching for subagent use.
- lesson 18 — Exploration solution: a plain prompt read only 6 files and spawned no subagent, but using the word **"Explore"** triggered an Explore subagent (60s, 64k tokens, 25 tool calls) that produced a deep report.
- lesson 19 — First feature exercise: build a course review system (star rating only, averages on list/course pages), clear context first, watch for subagents/permissions, and run `/context` with ~40% as the nervousness threshold.
- lesson 20 — Feature solution: plan mode, agent clarifying questions, a plan subagent producing a multi-step plan, the four plan-approval options (including clear-context), implementation with DB migration permissions, UI verification, and `commit`.

## Sections (L2)

### lesson 11

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson11.en.srt#lesson11]]`
- Summary: How Claude Code connects to an IDE and why that matters. The `ide` command manages integrations and shows status (the instructor is connected to VS Code via the Claude Code for VS Code extension); IDEs like Cursor, Windsurf, and Antigravity are named as alternatives. The main benefit is diff management — Claude's proposed edits appear as a rich, scrollable diff in the editor rather than awkward terminal output.
- Key claims: The `ide` command manages IDE integrations and shows connection status; the integration is mainly for diff management; accepting a change is either "Accept Proposed Changes" or saving the file in the editor, which counts as agreeing to the change.
- Learner-relevant: A learner gains an in-editor review loop for approving AI edits and can tweak Claude Code output before accepting — the 99%-of-the-time workflow the instructor uses.

### lesson 12

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson12.en.srt#lesson12]]`
- Summary: How to move backwards and forwards in a Claude Code conversation. You can ask Claude to "revert that," or press Escape twice to enter rewind mode, where you pick a checkpoint and choose what to restore. Claude also persists sessions locally, so an interrupted session can always be resumed.
- Key claims: Rewind mode offers restore code + conversation, restore conversation only, or restore code only (plus a "summarize from here" option mentioned for later); sessions persist locally and can be resumed via `claude resume <UUID>`, `/resume` (with search across sessions in the repo), or `claude --continue` for the previous session.
- Learner-relevant: A learner gains safe experimentation — trying a change, reverting precisely, and recovering context after quitting or interruption.

### lesson 13

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson13.en.srt#lesson13]]`
- Summary: Running bash commands is what turns the agent from a passive code writer into something that can seek feedback loops. Typing `!` enters bash mode, so a command's output lands in Claude's context; long-running commands can be backgrounded and managed. A suspend feature lets you run commands that Claude never sees.
- Key claims: `!` enters bash mode and puts output into Claude's context (e.g. `npm run typecheck` errors revealed Zod was in package.json but not installed, leading to `npm install`); Ctrl+B backgrounds a long-running command like `npm run dev`, whose output is written to a local file and shown as a status-line background task you can view, scroll, and stop; Ctrl+Z suspends Claude Code to run hidden commands, and `fg` restores it with state intact.
- Learner-relevant: A learner gains a decision tree — use bash mode + Ctrl+B when the agent should see output, use Ctrl+Z suspend when it should not; especially useful for debugging dev servers.

### lesson 14

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson14.en.srt#lesson14]]`
- Summary: The permissions model that balances risk versus reward. Claude Code is strict by default: safe commands (like `echo`) run automatically, while others (like a typecheck) trigger an approval showing the exact command and the reason. Decisions are recorded in a project settings file you can also edit by hand.
- Key claims: The approval prompt offers allow-once, allow-always-for-this-command-in-project, or deny, and Tab lets you give a reason or substitute a command (e.g. `npx tsc` instead); preferences land in `.claude/settings.local.json` under a `permissions` object with `allow` and `deny` arrays using syntax like `bash(pnpm typecheck)` or a wildcard for all `pnpm`; web search/fetch also require permission; `settings.local.json` is gitignored for personal use, and renaming it to `settings.json` shares the rules with the team so newcomers get fast setup.
- Learner-relevant: A learner gains control over what the agent may do unattended, and a mental model of how to pre-authorize or hard-deny risky commands such as `git push`.

### lesson 15

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson15.en.srt#lesson15]]`
- Summary: The strange constraints of LLMs before using Claude Code. It walks through the context window and quadratic attention, the smart-zone/dumb-zone split, why garbage mental models (LLM as a database) mislead, knowledge cutoff dates, and total statelessness. An edit note updates the numbers: context windows grew from 200k to 1M tokens.
- Key claims: Attention relationships scale quadratically with tokens (4 tokens → 6 relationships, 8 → 28, 100 → ~5,000), so filling the window strains the model into the "dumb zone" where hallucination rises and recall degrades; the instructor gets paranoid around 40% (≈80k of a 200k window); an LLM is not a database but a "fuzzy JPEG" of all human knowledge, so pretrained answers are unreliable while context-window content is directly readable and reliable; models are stateless (the "Memento" analogy) — clearing context wipes tribal knowledge, so documentation and codebase quality are key; post-recording update: default Claude Code window is now 1M tokens, extra capacity is mostly more dumb zone, and the smart zone sits around 100k tokens (so think in raw tokens, not percentages).
- Learner-relevant: A learner gains the foundational mental model (smart zone/dumb zone, fuzzy JPEG, statelessness) that justifies every context-management technique in the rest of the course.

### lesson 16

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson16.en.srt#lesson16]]`
- Summary: How Claude Code squeezes more out of the context window using subagents. The orchestrator agent you talk to spawns subagents — effectively new context windows — to do token-heavy work in their own smart zones, then report a summary back. It's a delegation/offloading mechanism used aggressively throughout Claude Code.
- Key claims: The dream is to shrink exploration so more smart-zone tokens remain for implementation, but skimping on exploration produces worse context and worse implementation, which subagents resolve; the orchestrator acts like a lead developer delegating to a junior, and can spawn multiple parallel subagents that report back to the parent; subagents can use different system prompts and different models, commonly a cheaper/faster model like Haiku for exploration.
- Learner-relevant: A learner understands subagents as a context-saving mechanism and why they appear constantly in Claude Code — the key to reading the UI and preserving the orchestrator's smart zone.

### lesson 17

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson17.en.srt#lesson17]]`
- Summary: An exercise video (mostly instructions) framing exploration as the foundational skill. Because the LLM is stateless, it is dropped into the codebase fresh every time and must re-explore to understand patterns, layout, and purpose. The learner is asked to explore a large repo using Claude.
- Key claims: Statelessness makes exploration the first thing to master; the prompt is "Tell me what the tech stack of this repo is and what its intended purpose is"; the learner should watch for when a subagent is used (visible in the UI), then query the result with follow-up questions, and use the provided question list to build a strong understanding of the repo.
- Learner-relevant: A learner practises driving an agent to explore an unfamiliar codebase and recognizes subagent invocation as a cue, directly applying the statelessness constraint from lesson 15.

### lesson 18

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson18.en.srt#lesson18]]`
- Summary: The exploration solution, showing word choice changes agent behavior. The initial "tell me the tech stack" prompt read only six files and spawned no subagents, giving a shallow summary. Adding the word **"Explore"** (asking to "Explore how PPP works in this repo") triggered an Explore subagent that ran aggressively and produced a genuinely in-depth report.
- Key claims: Ctrl+O toggles verbose/expanded mode showing the bash commands and file reads; the first prompt spawned no Explore subagent, so only six files were read — not a full picture; the second prompt spawned an Explore subagent with a customized system prompt that took ~60 seconds, used ~64k tokens (~32% of its window), made 25 tool calls, and returned a summary to the orchestrator that "reads almost as well as if we wrote it ourselves"; using the verb "Explore" is a useful hint to trigger deep exploration.
- Learner-relevant: A learner learns a concrete prompt pattern (use "Explore") for depth and how to inspect a subagent's token/tool costs via the UI.

### lesson 19

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson19.en.srt#lesson19]]`
- Summary: The first feature-building exercise: a course review system where students leave a star rating (no written reviews) and averages show wherever courses are visible (list page and course page). It's chosen as a meaty feature that touches every area of the codebase without heavy UI work. The learner is told to watch the agent closely while building.
- Key claims: The starting prompt is a few sentences ("I would like to create a course review system where students can review courses by leaving a star rating… show the average rating on the courses in the list page and on the course page itself"); run `clear` to reset conversation history before starting; the learner should watch for explore-subagent spawning, permission requests, and run `/context` throughout; ~40% usage of the main orchestrator is the point to get nervous; the goal is to fall into an observational mode and learn the default behavior of Claude Code.
- Learner-relevant: A learner applies context paranoia and observation discipline to their first end-to-end feature, connecting the LLM constraints to a real build.

### lesson 20

- Locator: `[[sources/ai-coding-for-real-engineer/20261001/lesson20.en.srt#lesson20]]`
- Summary: The feature solution, end to end. Claude enters plan mode, spawns an explore subagent, asks clarifying questions, and then a plan subagent produces a multi-step plan. The instructor reviews the plan, decides whether to clear context, watches implementation with selective permission for database migrations, verifies the feature in the running app, and commits.
- Key claims: Plan mode coordinates an explore subagent, then a plan subagent (another context-saving mechanism) that reads the files deeply to design a plan using existing patterns; Claude asks clarifying questions (only enrolled students can rate, 1–5 stars, whether the dashboard shows averages) navigable with tab/arrows and option 4 to "chat about this"; the plan lists schema changes, a rating service, course list/detail page updates, and verification steps, and the four approval options are yes-auto-accept-edits, yes-but-manually-approve, clear-context-and-auto-accept, or type into option 4 to edit the plan; at 36% context the instructor chose clear-context, accepting that the explore agent must re-run as the price of escaping the dumb zone; implementation added a course ratings table to the schema and a rating service, with database migration/seed requiring per-run permission (migrations always kept under personal control); verification: logging in as Emma Wilson and rating an enrolled course updated the global average (3 and 5 → 4.5); ending context was 32%, comfortably in the smart zone; typing `commit` staged and committed the code while asking to approve the generated commit message; homework is to note observations and open questions (what is plan mode, how to debug with the agent, how much to review code).
- Learner-relevant: A learner sees the complete default workflow — plan → clarify → plan subagent → context decision → implement → migrate → verify → commit — and the reasoning behind clearing context and gating migrations.

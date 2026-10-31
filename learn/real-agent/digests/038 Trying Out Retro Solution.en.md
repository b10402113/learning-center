---
source: sources/real-agent/20261030/Retro/038 Trying Out Retro Solution.en.srt
source_type: text
source_lines: 635
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- A real human review produces four or five comments phrased so retro can turn them into standards.
- Comments cover glossary-consistent UI labels, shared test setup, test isolation through module functions, and type-level text/markdown distinction.
- Retro loads the Writing for Agents skill, finds all six sessions behind the PR including subagents, and reads the PR comments.
- Retro is token-expensive; batching many sessions into subagents is the recommended scaling move.
- Its report contains mistakes and must be reviewed; auto-applying fixes can send it into an improvement loop.
- Only chosen recommendations are implemented, ending with new standards, branded types, a shared test DB type, and removed banner comments.

# L2 detail

- `#L1-L52` — First comment: a sidebar label should use glossary terms (bookmarks/notes) rather than "saved"; phrasing aims at a reusable standard.
- `#L53-L72` — Second comment: the test DB type defined in a bookmarks server test should live somewhere more global.
- `#L73-L127` — Third comment: tests set up via raw database calls instead of module functions; argues this keeps tests stable when the DB layer changes and frames it as an opinion worth passing to the agent.
- `#L128-L188` — Rejects comments that restate simple code and prefers obvious code; proposes branded types to separate plain text from markdown at the type level.
- `#L189-L224` — TypeScript-expert aside; four or five comments is enough; runs retro over sessions behind PR 34.
- `#L225-L288` — Retro loads Writing for Agents for skill and `AGENTS.md` design context; finds six sessions including code-review subagents; notes token cost and the subagent batching strategy for 25 sessions.
- `#L289-L372` — Reading the report: some findings are wrong; explains why auto-applying is risky; example fix (rerun code review after fixes) is judged too hardcore.
- `#L373-L424` — Recommendation 2: preferences are undocumented while existing code teaches the opposite (banner headers, 32 added comment lines), so automated review is misaligned.
- `#L425-L472` — Proposed rules: let code explain itself, reserve comments for a why the code cannot express, and arrange test setup through the module under test.
- `#L473-L528` — Notes missing Fowler guidance in the review skill; proposes deleting banner comments from five modules so new modules stop copying them; updates both standards and code.
- `#L529-L584` — Implements only #2, #5, and #6: branded types, one shared test DB type, banner comments removed, two new rules added to `coding-standards.md`.
- `#L585-L635` — Concludes that standards now match intent; retro is among the most powerful skills and changes the calculus for doing human review, including retroing a session that produced a bug.

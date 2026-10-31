---
source: sources/real-agent/20261030/Review/031 Running The PR Skill.en.srt
source_type: text
source_lines: 183
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Exercise: generate a real-looking draft PR from an existing commit with `npm run create PR`, then have the agent write the missing PR body.
- The scaffolding creates a fresh base branch plus a PR branch with the extra commits, so files-changed looks like a genuine pull request.
- The task: take the PR number, tell the agent to rewrite the body from the diff, and confirm the pr skill markdown is picked up automatically.
- Judge the result by the pseudocode explainer, the evidence it gathered, and its merge-danger call (one-way or two-way door).
- The skill is intentionally tinkerable; the point is faster review and deciding how much review a PR actually needs.

# L2 detail

- `#L1-L44` — Run `npm run create PR`; an existing PR is offered for replacement; a draft PR for the seed bookmarks/notes diff appears, with a new base branch and the PR branch holding the extra commits.
- `#L45-L96` — Files changed reads like a real PR to a real repo; the only missing piece is the PR body; the exercise is to grab the PR number (34 in the demo) and ask the agent to write it from the diff.
- `#L97-L140` — Before starting, confirm the agent can see the pr skill markdown and will pick it up without explicit invocation; then read the pseudocode it generates to understand the diff, and check what evidence it found.
- `#L141-L183` — Inspect the evidence that the change works and the merge-danger judgement; then critique and adapt the skill to your own process; goal is review speed and the right amount of review, not a fixed template.

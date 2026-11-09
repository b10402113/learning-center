---
source: sources/background-agent/20261109/course/21-building-the-approval-flow.txt
source_type: text
source_lines: 187
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- New imports and persistence — adds `getProposal`, `proposedAction`, and `staleProposal` from the agent data layer so each approval request is stored as a proposed action in the app's own database and linked back to an inbox button.
- Stale-proposal reasoning — because approvals are async, the state can drift between proposal and decision; a saved state snapshot/version lets the harness detect staleness and force another loop.
- Building the approval branch — replaces the empty approval-policy branch with a propose step, a correlated `waitForEvent`, a reread of the decision, and an escalation path on rejection.
- Reading from the database, not cache — re-fetches the proposal and state at each step because the run may resume much later and the cached value may be overridden; mirrors the discipline of database transactions.
- Freshness fence and invalidation — re-checks the world version after approval, marks stale proposals stale (clearing the inbox), and loops back instead of acting on an outdated state.

# L2 detail

- `#L1-L6` — Introduces the lesson: wire the approval / human-in-the-loop flow into the workflow file, starting with three new imports from agent data.
- `#L7-L20` — Explains `getProposal` (DB lookup of a saved proposal), `proposedAction` (an action parked in the database when it needs approval, so the inbox can restore it later), and the case for owning this in app logic rather than leaning on Inngest state.
- `#L21-L41` — Defines the stale proposal: an approval sent today may be answered a week later, so a snapshot/version of state is saved with the proposal and compared on decision to detect drift and force another observation loop.
- `#L42-L51` — Enters the approval-policy branch that currently does nothing; gathers inputs, using `state.world.version` as a lightweight snapshot reference rather than passing snapshots around.
- `#L52-L58` — Creates a proposal ID to track the request, keeps the cycle counter, and opens an async step for the meaningful work.
- `#L59-L66` — Builds the `proposedAction` call with environment ID, run ID, `decision.action`, and the input state, then returns the new proposal ID.
- `#L67-L73` — Starts a second step to fetch the proposal by ID instead of reusing the in-scope variable, and poses why it is done this way.
- `#L74-L86` — Answers: because the workflow is async, nothing should be cached or hoisted; read fresh from the database so an override or long delay cannot leave a stale in-memory value.
- `#L87-L100` — Admits the trap was learned the hard way (stuck two hours during curriculum writing): reading the cached proposal produced stale approvals because days passed between proposal and use.
- `#L101-L108` — Draws the analogy to database transactions: you wait for the write to finalize and then read from the database as the source of truth, never trusting an earlier value.
- `#L109-L120` — Opens a while loop on `proposal.status === pending`, increments the check counter, and calls `step.waitForEvent` for the human decision.
- `#L121-L131` — Uses the event `agent/approval.decided`, filters on `async.data.proposal.ID` matching this proposal so one approval cannot unlock unrelated tasks, and sets a 10-second timeout.
- `#L132-L136` — Cleans up a misplaced argument, then confirms the wait: event, filter, 10-second timeout.
- `#L137-L149` — Reconciles the answered proposal in a step, re-fetches the latest proposal, then after the loop checks status; anything not `approved` goes to a stop step that sets the run to `escalated`.
- `#L150-L158` — Discusses disapproval policy: some agents retry another path, but this one gives up and escalates, and records the human decision before returning.
- `#L159-L169` — On approval, re-fetches fresh state in a step; motivates with a money-transfer example where conditions may have changed between request and approval, so the action must be re-validated.
- `#L170-L175` — Suggests a more proactive alternative: on every state change, scan pending proposals and clear invalid ones so people never see stale approvals (not built in this lesson).
- `#L176-L182` — Compares the fresh world version to the input version; on mismatch, runs an invalidate-approval step and marks the proposal stale so it leaves the inbox.
- `#L183-L187` — Continues the outer loop to re-observe state after invalidation, then removes the leftover return statement so approved-and-fresh runs fall through to execute the action.

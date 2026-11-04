---
source: sources/background-agent/20261105/21-building-the-approval-flow.vtt
source_type: text
source_lines: 1431
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L217-L504
  - web.md#L1-L713
---

# L1 overview

- Proposals live in your database — `proposedAction()` persists the decision + inputs so the inbox button can restore that exact action and its arguments later; relying on Inngest state instead would bury application logic in the workflow engine.
- Staleness is a first-class field — the proposal is saved with `expectedVersion = state.world.version` (a reference to the server-side snapshot), because an approval sent today may be clicked a week later against drifted state.
- Propose then re-read — one step creates the proposal and returns only `proposal.id`, the next step (`read human`) re-queries the DB instead of reusing the local variable; the instructor lost two hours to the opposite pattern producing permanently stale proposals.
- The wait is `step.waitForEvent("wait for human")` on `agent/approval.decided`, filtered on `async.data.proposal.id` with a 10s timeout, inside a `while (proposal.status === "pending")` poll — without that filter, one person's approval would approve every proposal in the system.
- Rejection path — `stop after human` step sets the run status to `escalated` and returns the human decision, deliberately giving up ("I told you I needed to do this and you're saying no, so you figure it out"); other agents retry another path instead.
- Approved path — `recheck approved state` re-reads the world; if `fresh.world.version !== input.version` the `invalidate approval` step calls `staleProposal()` (clearing it from the inbox) and `continue`s the outer loop to re-decide, otherwise execution falls through to the action.
- Proactive alternative — invalidate stale pending proposals on every state change so the operator never even sees an obsolete inbox item; not built in the course.
- Remaining work flagged at the end: self-approval, and deleting the leftover guard `return` so a fresh, approved proposal reaches the execute step.

# L2 detail

- `#L1-L46` — New imports from the agent data layer: `getProposal`, `proposedAction`, `staleProposal`; `getProposal` just queries the saved proposal.
- `#L47-L160` — Why store a proposed action at all: approval through the inbox has to find the original action and its arguments to re-run them; application logic belongs in your DB, while Inngest owns workflow logic — and it enables a dashboard/history of everything your agents proposed.
- `#L161-L315` — The stale-proposal concept: state snapshotted at propose time, a person may look a week later when the state is different, so the agent should loop again and re-observe rather than run an action against a world that moved.
- `#L316-L378` — Inside `if policy === "approval"`: build inputs with `expectedVersion: state.world.version`; the version is a pointer reconciled against the snapshot the fake server stores on every state change, so snapshots aren't passed around.
- `#L379-L481` — Step one, `propose action`: `proposedAction({ envId, runId, actionId: decision.action, inputs: state, cycle })` then `return proposal.id`, keeping the cycle counter.
- `#L482-L524` — Step two, `read human`: `getProposal(proposalId)` in its own `step.run`, deliberately named apart from the local variable (no hoisting confusion).
- `#L525-L668` — The gotcha and its fix: don't carry the created proposal forward — a step result can be a cached/overridden value that no longer matches the DB, so always re-read the source of truth; the same rule as a database transaction where you wait for the write before reading. Instructor re-hit this trap while writing the curriculum and got stale proposals for two hours.
- `#L669-L770` — Q&A sharpening the trap: the service can stop mid-step and restart, someone else may have resolved and cleaned up the proposal meanwhile, so the row can differ from creation time to read time.
- `#L771-L902` — The pending loop: `while (proposal.status === "pending")`, increment check, `step.waitForEvent("wait for human", { cycle })`, then re-fetch the proposal every pass (poll-like); includes a TypeScript inference hissy fit on the proposal id that resolves to a missing second argument.
- `#L903-L1039` — Event contract: `agent/approval.decided` filtered on `async.data.proposal.id === proposalId` (otherwise one approval approves all tasks, "you would lose your job"), `timeout: "10s"`, plus a misplaced argument the instructor removes, then `reconcile human` to grab the latest answered proposal.
- `#L1040-L1170` — Outside the loop: `if (proposal.status !== "approved")` → `step.run("stop after human")` sets the run to `escalated` and returns `humanDecision`; discusses why escalated (not completed, not errored) and other rejection strategies like finding an alternate path.
- `#L1171-L1236` — Approved branch: `step.run("recheck approved state")` → `getAgentState(envId, runId)`; the money-transfer example — you had funds when the approval was sent, you approved three weeks later with an empty account, so check before acting.
- `#L1237-L1293` — Proactive alternative design: on every state change, sweep pending proposals and delete the invalid ones from the inbox so a person only ever sees approvable, relevant actions (left as an exercise).
- `#L1294-L1431` — The guard: `if (fresh.world.version !== input.version)` → `step.run("invalidate approval")` → `staleProposal(proposalId)` marks it stale so it leaves the inbox, then `continue` the outer loop to look at state again; deleting the old `return` finally lets an approved+fresh proposal fall through and execute the action.

---
source: sources/background-agent/20261105/lessons/04-human-approval/index.md
source_type: text
source_lines: 140
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L217-L504
  - server.md#L812-L877
  - web.md#L1-L713
---

# L1 overview

- Approval gate — noticing a bad release is not authority to roll it back; the harness converts a model-selected `rollback_release` into a persisted inbox proposal instead of a tool call, so the model proposes and the human authorizes.
- Inbox as the durable handoff — a proposal states action, reason, expected state version, and expiry; it lives in PostgreSQL so the human can answer after the original request and browser are gone, while the workflow history lives in Inngest.
- Propose → wait → re-read → re-observe — `proposeAction`, `step.waitForEvent('agent/approval.decided')` correlated by `proposalId` with a 10s timeout, `getProposal` reconciliation after wake, then `agentState` again before acting.
- Scoped capability — approval is valid for this run, this action, this `expectedVersion`, before expiry; `staleProposal` invalidates it when the world changed, and the operations API re-checks the version as the final precondition (time-of-check/time-of-use).
- Approval is not a safety shield — untrusted log content can drive a proposal, availability and no-response must be designed (expiry → escalate), and errors should map to harness policy, not prompt wording.

# L2 detail

- `#L1-L5` — Header: start `lesson-4` → solution `lesson-5`; outcome that a release rollback becomes a persisted inbox proposal and a durable human decision.
- `#L6-L12` — Human-in-the-loop as the intended middle of the workflow, the inbox item contract (what, why, expected state, expiry), and the reason background agents can multiply output without giving up control.
- `#L13-L19` — The ordered sequence (persist proposal with observed version → durable decision wait → re-read stored decision → re-observe before executing), rejection/expiry escalation, and the endpoint-restart demonstration that nothing depends on the original browser request.
- `#L20-L33` — Where judgment adds value (not read-only inspections; disruptive, irreversible, expensive, or ambiguous cases), scoped-capability approval with a TOCTOU recheck, the decision-packet idea, and "approval is not a universal safety shield" (AgentDojo prompt injection, human availability, expiry).
- `#L34-L44` — "See it in the lab" with `--fault release` (agent currently escalates) and live-coding framing: persist the proposal, wait for a correlated decision, reread it, re-observe, keep the operations API version check as the final precondition.
- `#L45-L65` — Edit 1 diff: add `getProposal`, `proposeAction`, `staleProposal` to the `./agent-data` import list in `server/agent-workflow.ts`.
- `#L66-L118` — Edit 2 diff: replace `approval-unavailable-{cycle}` with `input = { expectedVersion: state.world.version }`, `propose-action-{cycle}` returning `proposal.id`, `read-human-{cycle}`, a `while (proposal.status === 'pending')` loop over `wait-for-human-{cycle}-{check}` on `agent/approval.decided` (correlated by `proposalId`, 10s timeout) plus `reconcile-human-{cycle}-{check}`, escalation via `stop-after-human-{cycle}` for any non-approved status, then `recheck-approved-state-{cycle}` and `invalidate-approval-{cycle}` calling `staleProposal` when `fresh.world.version !== input.expectedVersion`.
- `#L119-L125` — Format/lint/typecheck gate; Verify: approve in the inbox and the same incident rolls back, observes healthy, completes; Deny escalates without changing the release.
- `#L126-L133` — "Break it on purpose" (restart agent vs restart checkout: one keeps the proposal valid, the other makes it stale) and the challenge to define approval as a scoped capability with subject, run, action, precondition, expiry, and audit record.
- `#L134-L140` — Catch up to `lesson-5`; common mistake (approval for version 1 is not a blanket permission) and the optional decision-packet extension that avoids exposing untrusted log text as instruction.

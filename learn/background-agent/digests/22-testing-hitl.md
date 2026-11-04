---
source: sources/background-agent/20261105/22-testing-hitl.vtt
source_type: text
source_lines: 755
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L812-L877
  - web.md#L1-L713
---

# L1 overview

- The test scenario — `fault release` (not a full incident), and the harness blocks the rollback at policy level, so `proposedAction()` writes a row and the inbox picks it up by reading that table; nothing is pushed anywhere.
- The run parks forever — after proposing, the workflow sits inside `step.waitForEvent`; the instructor notes it would have waited a year, and locally that pause is simulated with a while loop because the Node server never shuts down.
- Approval card is only as good as the action's inputs — the demo tools take no arguments, so the card shows "I propose rollback release, please review the exact action before I proceed" plus a state version number that means nothing to a human; real actions need real inputs.
- Approve → event → resume — clicking approve resolves the inbox item, writes the audit entry, fires `agent/approval.decided`, and the workflow re-runs replaying cached steps straight to the wait; the rollback mutated state from version 1 to version 2, proving the effect landed.
- Reject / stale / execute are the three terminal outcomes — not approved escalates and stops, version drift marks the proposal stale so it leaves the inbox then `continue`s the loop, and anything that lands past both branches executes the action.
- Waiting is a runtime property, not app code — Temporal needs workers, Inngest doesn't; deployed to Vercel the function would shut down to zero compute at the wait, which is why only the local server needs the while-loop trick.
- Visualize in Inngest — numbered cycles/checks make the loop traceable; expand any step to see outputs and metadata, which beats hand-drawn sequence diagrams for this conditional logic.

# L2 detail

- `#L1-L17` — Recap of the branch logic: not fresh means stale, which continues and loops back to the top.
- `#L18-L64` — Starting the dev agent (one false start that breaks), then running `fault release` instead of the full flow.
- `#L65-L120` — The inbox already has a fresh item; the new run is visible in Inngest, slowed by the `sleep` on the `lesson 4` branch.
- `#L121-L173` — The agent proposes a rollback, the harness blocks it as approval-required, and `proposedAction` writes the request to the database — the inbox is just pulling that table, so it appears without anything being sent.
- `#L174-L249` — Card copy and the honesty gap: only the state version is shown as an argument, which is meaningless to a person — the fix is giving actions real inputs (what rollback target, from where).
- `#L250-L299` — Clicking approve resolves the item, shows "approved", and the audit log immediately records "Rollback release — approved".
- `#L300-L360` — On resume the state is read again and moved from version 1 to version 2 (so the action mutated state), the rollback return value is visible, the service-recovered event arrives, and the sleep slows the next observation.
- `#L361-L475` — Second observation shows everything healthy and nothing left to do; Q&A on whether listening/waiting is framework or DIY — it depends on the durable runtime (Inngest vs Temporal's workers) and the deploy target.
- `#L476-L520` — Locally the while loops simulate frozen compute because a Node server keeps running; on serverless the function would just shut down to zero compute for free.
- `#L521-L616` — Code walkthrough after the click: the approve button fires `agent/approval.decided`, the workflow re-runs, cached steps replay instantly to the wait, `getProposal` reads what the human said from the DB, and the loop exits.
- `#L617-L690` — The three buckets explained: no approval → record `escalated` and let the `return` stop the workflow; version mismatch → `continue` marks the proposal stale, removes it from the inbox, and re-thinks; anything else → execute the action. Ends on "the best tool to visualize this is Inngest."
- `#L691-L755` — Inngest run view: `loop one`, `loop two`, `while check 1/2` — three loops before completion — with per-step outputs and metadata you can click into.

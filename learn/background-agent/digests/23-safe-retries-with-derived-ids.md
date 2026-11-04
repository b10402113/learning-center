---
source: sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt
source_type: text
source_lines: 556
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L217-L504
  - service.md#L1-L221
---

# L1 overview

- Retry safety is idempotency — a stable action ID is an idempotency key, so an uncertain tool call can retry without repeating its effect; backstory via the AWS idempotent-APIs documentation and Inngest's guide.
- One side effect per step — batching three mutations in one step means a failure on the third replays the first two; separate steps get separate retries for free.
- Non-idempotent business logic re-breaks on retry — 50 lines that create a user and then blow up will fail again with "user already exists"; idempotent code skips what already happened, which is what Stripe's idempotency keys enforce.
- Swap the random UUID for a derived ID — `runId + cycle + decision` is deterministic and recomputable, unlike the earlier throwaway UUID ("I literally do not care if this thing is random" — now he cares).
- Guard the run itself with `cancelOn` — matching `agent/run.canceled` on `data.runId` prevents two workflows operating on the same run ID, which would be two cursors typing in the same Google Doc: race conditions and gibberish.

# L2 detail

- `#L1-L65` — Framing: outcome of this lesson is a stable action ID that lets an uncertain tool call retry without repeating its effect; points at the AWS "idempotent APIs" doc as the best explanation of what idempotency even means.
- `#L66-L131` — Inngest's own idempotency guidance, then the rule: any step whose code changes something must be resilient to being retried, so keep each async side effect in its own step.
- `#L132-L231` — The batched-step failure mode: three calls in one step, two succeed and the third fails, the step reruns and the first two run again — because they were never split out.
- `#L232-L297` — The step that isn't idempotent even alone: an API route creating a user halfway through its 50 lines fails, reruns, and dies on "a user already exists"; idempotent code would skip the completed work and resume where it broke.
- `#L298-L325` — Stripe's behavior as the model: it will not let the same transaction happen twice when you pass the idempotency key — "so we're doing the same thing, we're just calling them action IDs," assigned before the action is created.
- `#L326-L420` — Code change: delete the random UUID, use Inngest's built-in mechanism — add `cancelOn` to the workflow's start options with an event object matching `agent/run.canceled` on `data.runId`, so a duplicate run is cancelled before it does anything.
- `#L421-L470` — Why cancel: two workflows with the same run ID share state and everything else, reach different conclusions at the same time, and race — the shared Google Doc with both cursors in one spot analogy, which yields gibberish.
- `#L471-L520` — Tightening the ID: the old random-ish ID wasn't scoped well enough, so derive it from `runId + cycle + decision` — now the action ID is deterministic and always derivable from the same inputs.
- `#L521-L556` — No new test written (it is known to work), but the point stands: spinning up a second service running stuff would have broken immediately and there was no way to cancel the duplicate — now there is.

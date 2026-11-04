---
source: sources/background-agent/20261105/10-durable-execution.vtt
source_type: text
source_lines: 401
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L217-L504
  - server.md#L1007-L1034
---

# L1 overview

- One step is not durable — a step is the unit of memoization, so with the entire loop inside a single step, any resume replays everything: inspect logs, the model call, the feature disable. Durability is a property of how finely work is divided, not of the fact that a workflow exists.
- Break work into individual steps — each piece of work becomes its own unit so a resume after an outage continues from the last unfinished step instead of redoing the whole loop, without losing any information the agent had already gathered.
- Determinism is required of the workflow body — everything inside the function but outside `step.run` must be deterministic. Branching on `Date`, or calling `Math.random` twice, means replay can never reproduce the same path; these tools check for it and may throw.
- Idempotency is required of the steps — a step performing a mutation must not mutate twice when replayed. The canonical example is Stripe's idempotency key: replay returns 200 without re-charging, because "you don't want to charge somebody twice."
- Failure handling is configurable per level — Inngest lets you set retry policy at the workflow level or per step, so a failing API inside the loop is a policy choice, not a framework surprise.
- "Resume" is not stack replay — the biggest misconception for experienced JS engineers: nothing replays the JS call stack or context. Each step's result is memoized; if a result is recorded for a step, it is not run again. That's the whole trick.
- Determinism buys the ordering guarantee — because the body is deterministic, steps always run in the same order, so a replay with some steps already done lines up recorded results with the right steps and returns identical outputs.

# L2 detail

- `#L1-L94` — The cost of a single step: today the agent has one step, so a resume after "the server dies before the step is done" would re-run inspect logs, the model call, and the bad-feature disable. He restates the loop's contents and says the fix is to break those pieces into "their own steps," so a resume continues with only the unfinished ones and loses none of the previously gathered information.
- `#L95-L123` — The plan and the constraint it introduces: split the loop's work across steps, and think about how the steps map onto loop iterations and what that affects, because once you build on a durable execution layer the workflow layer itself imposes rules.
- `#L124-L204` — Determinism rule, shown against `inngest.createFunction`: everything inside the function but outside `step.run` must be deterministic, and steps should be idempotent. "If a date... oh if the time is, do this" — that is non-deterministic, gives different results per replay, and "would completely break how this is replayed." Inngest-style tools try to detect non-determinism and may hard-error; two random draws in the high-level part make the workflow unre-runnable.
- `#L205-L283` — Idempotent steps: a step that mutates must know it already ran and skip the second application. Stripe's idempotency key is the worked example — reuse the key, the API answers "we already did this," returns 200, and the charge never happens twice, which is exactly the property you need when a step is replayed after a crash.
- `#L284-L312` — Student question: what if the APIs inside the loop fail — does Inngest keep running or stop and restart? Answer: you control it, with retry policy configurable at the workflow level or the step level, which he calls "super flexible."
- `#L313-L364` — Debunking "resume": he is not going to restore the JS stack or replay a JavaScript execution context — "it's not that deep." Every step gets memoized; if results are recorded for a step, we don't do them again. And because the workflow is deterministic, the step order is guaranteed stable.
- `#L365-L401` — Closing formulation: replaying with some steps already done always yields the same results "no matter what," which is precisely why the workflow cannot depend on anything dynamic. Net summary: durable execution "is just memoizing functions at the end of the day and then replaying them."

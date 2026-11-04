---
source: sources/background-agent/20261105/7-loop-walkthrough.vtt
source_type: text
source_lines: 635
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L970-L1006
  - server.md#L1052-L1066
---

# L1 overview

- Full loop recap — one event-ingest workflow function containing one `step.run` step, and inside it a `for` loop capped at 8 iterations. The whole cycle in order: observe the world → deterministic goal check → ask the LLM what to do next → bookkeeping → safety gates → execute or return.
- Observation first, per iteration — read the current checkout-service state ("the current world") and decide deterministically whether it is already a good state; if it is, job done and no tokens are spent. Only a bad state escalates to the model.
- The decision step — the model gets the overall goal, the current view of the world, whatever system prompt is configured, and the list of all possible actions, and is asked which action is most likely, why, and in more detail. That recommendation is then recorded, not executed.
- Harness-owned safety gates before execution — `wait` and `request_help` need Inngest-specific behaviour (pause the workflow or step, notify a person, wait indefinitely for a reply); `complete` needs something special (a final summarising LLM pass, an update, an email). None are implemented yet, so each is stubbed with a `return` — caught but not yet handled.
- Approval-by-policy — `rollback_release` must never be executed autonomously, so it is gated with another `if` and a `return`; the human-in-the-loop plumbing arrives in later lessons. Everything that isn't gated runs autonomously, and the action itself is just an API call because the actions live on the service.
- Actions must mutate observable state — otherwise, on the next loop, the exact same state plus the action it just ran leaves the agent doubting reality ("I swear I did the thing"), blaming caching, and going into what he calls psychosis. Letting the agent ignore the state when it disagrees defeats the entire design.
- Predicate vs prompt conflict — when the deterministic goal check says "not complete" but the agent's chosen action says "complete", the gap is your code and your goal/system prompt pulling in different directions; that's a developer bug, and it may not be closable deterministically. Alternative: make `goalSatisfied` itself an LLM call with its own narrower prompt and its own evals — smaller surface, higher accuracy, possibly a different model.
- Live run attempt — `npm run dev agent` for the API, with the usual port contention (whichever app starts first claims the port, and the docs can steal it), checkout service already running, dashboard on 5173.

# L2 detail

- `#L1-L29` — Sets up the recap: one ingest workflow function containing one step, and inside that step a `for` loop that loops no more than eight times.
- `#L30-L45` — Start of each iteration: fetch the current state, i.e. the current world — here the checkout service and whatever state it is currently in.
- `#L46-L57` — The loop's first decision is deterministic: can we tell from that state whether it is a good state? If it is, job done, we are finished.
- `#L58-L103` — If it is not a good state, ask the LLM what to do next given the overall goal, the current view of the world, the configured system prompt, and the full list of possible actions — which action is most likely, why, and the breakdown of what it is trying to do.
- `#L104-L112` — Housekeeping immediately after the decision: update the loop count and record that the LLM decided this.
- `#L113-L149` — Why waiting and requesting help are special: they need Inngest-specific machinery — pause the workflow or the step, send something to a person, and wait indefinitely until something comes back; we want to do something special in those cases.
- `#L150-L176` — `complete` also needs something special (another LLM pass for a final summary, an update somewhere, an email), and since none of it is implemented yet these are all just `return` for now.
- `#L177-L204` — The `rollback_release` guardrail: we do not want it executed autonomously without human intervention, so the `if` stops it — the human-input work lands in the next few lessons.
- `#L205-L246` — Everything else is allowed to run on its own: make the API call to the service (the actions live there rather than in the agent), get the results, record the action, and that is it.
- `#L247-L292` — The loop continues only if no gate returned and nothing threw; the next iteration re-reads the state — which is exactly why actions are expected to change it, so the agent can see what changed.
- `#L293-L360` — The CSS analogy: you set the background to red, save, watch the server restart, then the site is still not red — you would conclude something is broken, and so will the agent.
- `#L361-L411` — The failure mode named: it goes into psychosis, claims the state is cached or broken, and cannot make progress; and if you let it assume the action worked and ignore the state, none of the design works anymore — "that has nothing to do with LLM, that's just you making sure the systems work".
- `#L412-L519` — Mark's question on whether the in-loop `goalSatisfied` check catches the last iteration (yes, if the predicate can express the completion condition), then the real gap: the deterministic check said not complete while the agent decided complete — that conflict lives between your predicate code and the goal/system prompt, and closing it is your job.
- `#L520-L635` — David's question on making `goalSatisfied` itself a reasoning call — yes, it gives a much smaller surface with its own prompt and its own evals, better accuracy, and freedom to pick another model; then the run attempt: `npm run dev agent` for the API, docs/app port contention ("whichever one you start first claims the port"), checkout service already up, dashboard at 5173.

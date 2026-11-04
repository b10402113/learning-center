---
source: sources/background-agent/20261105/13-generate-a-decision.vtt
source_type: text
source_lines: 884
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L878-L928
---

# L1 overview

- The decision must be a step — `await step.run("choose action cycle N", () => chooseAction({ run, goal, state }))`. The model call is the one thing that must never live at workflow top level: it is stochastic, so replaying it would violate the determinism contract and re-price every resume.
- Replay semantics made explicit — on recovery the runtime re-executes the whole workflow body from the top; every non-step expression runs again, every named `step.run` is hydrated from its recorded return value instead of recomputed.
- React `useMemo` analogy — a step is a `useMemo`: the component (workflow) re-renders on server restart, dashboard replay or retry, but memoized regions keep their value. There is no dependency array — only memoized or not.
- Why re-deciding corrupts downstream steps — the later cached steps were recorded against the *first* decision's inputs; a fresh LLM call yields a different action, so the cached results no longer describe the same world. Three costs: dollars, latency, and result divergence.
- Iteration counter must be memoized — `step.run("set iteration cycle N")` writes `{ runId, cycle }`; if it re-ran the cycle numbering would drift out of sync with the steps already recorded for that cycle.
- Batching inside a step is a real trade-off — iteration + decision could share one step because re-writing the same iteration for the same cycle is a harmless DB write, but he keeps them separate to avoid even that penalty; some products bill per memoized step.
- Inngest cache vs your database — a step's return is only a cache keyed by step name inside the workflow; the application still needs `recordDecision` in its own store to know what to do next. Both exist, for different reasons.

# L2 detail

- `#L1-L60` — Opens `const decision` and immediately asks "does this need a step?"; sets up the crash-at-two-different-points thought experiment (before vs after the LLM call) that the rest of the segment resolves.
- `#L61-L140` — Walks what actually happens on restart: the workflow is replayed from the top, every non-step line and the `for` loop initialization execute again, and the first step name found in state hydrates its variable from the recorded value.
- `#L141-L220` — Reaches the LLM line and shows the consequence: outside a step it is hit again on every replay "no matter what"; argues this is not desirable — money, latency, and a different answer than the one the crash interrupted.
- `#L221-L310` — Explains the deeper failure: cached downstream steps assumed the first decision's input, so a re-generated decision desynchronizes them; emphasizes LLMs are probabilistic and that a top-level LLM call is effectively a determinism violation.
- `#L311-L400` — Distills the rule to "we only want deterministic things at workflow level" and shows the absurdity of expecting stable step results when their input changes on every replay.
- `#L401-L470` — The crisp restatement of replay: in a step, the returned value is taken as the value and it is never executed again; at workflow top level, it is executed again.
- `#L471-L540` — The `useMemo` framing for steps and re-render framing for workflow replay, listing replay triggers (dashboard replay button, server stop/start, retries) and confirming `createFunction` *is* the top-level workflow.
- `#L541-L620` — Writes the decision step: `await step.run("choose action cycle " + cycle, () => chooseAction({ run, goal, state }))`, arriving at `const decision`.
- `#L621-L700` — `step.run("set iteration cycle N")` calling `setIteration({ runId, cycle })` and why it must be memoized — otherwise the loop counters and recorded step names stop lining up.
- `#L701-L790` — Considers folding iteration-write and decision-record into one step; analyzes the retry consequence (iteration rewritten for the same cycle ⇒ same row) and concludes it is *virtually* safe but still chooses two steps.
- `#L791-L884` — Answers the DB-vs-Inngest boundary question — Inngest only caches step return values (like Redis keyed by step name), your app still needs the real state — then implements `recordDecision({ environmentId, runId, cycle, action, reason })` with `reason` kept for auditability.

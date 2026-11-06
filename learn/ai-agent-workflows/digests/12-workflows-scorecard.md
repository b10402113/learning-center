---
source: sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt
source_type: text
source_lines: 218
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Workflows are ordinary code paths with an LLM inside: a chain is a function calling a function, a router a switch statement, parallelization `Promise.all`, and a gate an `if`.
- No fancy graph library is needed; cron jobs, functions, API calls, databases, and schema validation already cover the best workflows.
- Workflow designs compose, so voting can live inside an evaluator-optimizer.
- Scorecard: context is bounded, each step is testable in isolation, and cost is controlled by limiting the number of calls.
- Workflows fail when requirements have combinatorial eligibility branches, such as hundreds of scholarships with yearly-changing criteria.
- On a stop condition or failed evaluation, prefer returning an error over a bad answer.
- Wrapping up at N−1 turns can produce a summary worth logging and feeding back into the system prompt.
- Workflows put gates and error checks at every call; orchestrator-workers can retry workers but is still not quite an agent.

# L2 detail

- `#L1-L16` — Workflows are not magic but predefined code paths with an LLM in the middle: chain = function calling a function, router = switch, parallelization = `Promise.all`, gate = `if`.
- `#L17-L40` — The best workflows use what developers already know (cron job, function, API, database, schema validation), and designs can be combined, e.g. voting inside evaluator-optimizer.
- `#L41-L73` — Scorecard: context is bounded because each step only sees what it needs, reliability is good because steps can be tested in isolation, and cost is controlled by limiting calls and stop conditions.
- `#L74-L105` — Where workflows break: scholarship and loan eligibility branches multiply (athlete → swim team vs basketball team), with hundreds of scholarships and dozens of criteria that change every year or semester.
- `#L106-L132` — Handling a stop condition: if the loop or time limit is hit and the evaluator is unhappy, output an error rather than trusting a half-finished trajectory.
- `#L133-L150` — Alternative: tell the agent at N−1 turns to wrap up into a summary, log it, and later feed it back or use it to revise the system prompt and scope.
- `#L151-L174` — If the orchestrator stops running, use error checks and gates everywhere: timeout, schema mismatch, and other failures should be caught; workflows allow this more easily than agents.
- `#L175-L192` — Rationale for returning error codes: users tend to blame themselves for an error, while a bad answer is a bad experience that drives them away.
- `#L193-L218` — Orchestrator-workers can re-call the same fixed workers after seeing poor results (e.g. send unclear career options back), which is agent-like looping and retry but not technically an agent.

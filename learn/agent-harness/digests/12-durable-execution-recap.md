---
source: 12-durable-execution-recap
source_type: pdf
source_lines: 214
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 12-durable-execution-recap

## Overview (L1)

- Recap: no new logic, only steps — The original runtime (a while loop executing tools until none remain, then generating a response) is unchanged; the entire exercise was wrapping three kinds of side effect into durable steps persisting their results so they are not re-run within a workflow.
- Why the three wraps matter — `emit` writes to the database and would duplicate events in the UI; tool calls would rerun with real consequences; `streamText` would rerun and burn money and tokens.
- Opting out of the AI SDK and owning tools — Removing the `execute` function from every tool opts out of SDK auto-execution, requiring a custom tool runner that switches on the requested tool and calls the matching function.
- Step boundary design — The model turn and the tool step are each grouped into one step rather than many small ones, deliberately so that related effects happen together and never partially.
- Disconnect behavior Q&A — On reconnect, `on connection` replays all history, and any client message starts the workflow, which either continues a broken workflow or begins a new one.
- LLM continuation semantics — A model continues generating whenever the last message in the array is a `user` or `tool` role; a trailing `assistant` role would mean replying to itself, so it does not.

## Sections (L2)

### recap-runtime-unchanged

- Locator: `[[sources/agent-harness/20260915/12-durable-execution-recap.txt#recap-runtime-unchanged]]`
- Summary: Reassures the learner that the familiar while-loop runtime with tool execution is still intact, and frames the entire change as wrapping selected effects in steps.
- Key claims: The while loop still executes tools until no more tool requests exist and then generates a response; the only change is persisting the results of those actions into a database so they are not re-run in a workflow context; individually the edits look large but conceptually they are small.
- Learner-relevant: The mental model that keeps durability from feeling like a rewrite — it is refactoring, not new logic.

### why-wrap-emit-toolcall-streamtext

- Locator: `[[sources/agent-harness/20260915/12-durable-execution-recap.txt#why-wrap-emit-toolcall-streamtext]]`
- Summary: Explains the three things wrapped in steps and the concrete cost of each re-running after a restart or retry.
- Key claims: Emits would create duplicate persisted events visible in the UI; tool calls can have serious real-world consequences; streamText re-runs cost money and tokens; durability means these are safe from restarts and retries.
- Learner-relevant: The cost/impact ranking that justifies prioritising which effects to make idempotent first.

### opt-out-of-ai-sdk-tools

- Locator: `[[sources/agent-harness/20260915/12-durable-execution-recap.txt#opt-out-of-ai-sdk-tools]]`
- Summary: Describes how the AI SDK's automatic tool execution was disabled by stripping `execute` from every tool and replacing it with a custom tool runner.
- Key claims: AI SDK previously ran tools for the developer; deleting the `execute` function opts out; the replacement runner is a switch over which tool was requested that calls the corresponding function; this control was needed to place tool execution inside a durable step.
- Learner-relevant: The key architectural trade — giving up SDK convenience to gain durability control.

### step-grouping-rationale

- Locator: `[[sources/agent-harness/20260915/12-durable-execution-recap.txt#step-grouping-rationale]]`
- Summary: Explains why the model turn and tool logic are each consolidated into a single step instead of many granular steps.
- Key claims: `modelTurn` is unchanged code (streamText, iterating text deltas, emitting) now returning a result object; the tool step wraps all tool handling in one function; the grouping is intentional so no sub-effect can happen without the others — e.g. emitting without the tool actually running would desync the client; the model turn's streaming and drain must likewise occur together.
- Learner-relevant: The atomicity principle for choosing step granularity, directly transferable to other durable designs.

### disconnect-and-reconnect-q

- Locator: `[[sources/agent-harness/20260915/12-durable-execution-recap.txt#disconnect-and-reconnect-q]]`
- Summary: Answers how the front end waits and continues across a server disconnect: reconnection triggers history replay, and incoming client messages start or continue the workflow.
- Key claims: The `on connection` handler fires whenever the client reconnects regardless of which side restarted; all events are replayed immediately; when the client boots it sends a message that starts a workflow, which either continues a broken workflow or creates a new one from a submitted task.
- Learner-relevant: Clarifies the roles of replay vs workflow start in resuming after outages.

### llm-message-array-continuation

- Locator: `[[sources/agent-harness/20260915/12-durable-execution-recap.txt#llm-message-array-continuation]]`
- Summary: Explores why a restarted workflow knows to generate again, based on the role of the last message in the array.
- Key claims: If the last message is role `user` or `tool`, the LLM knows it must respond; if the last message were `assistant` it would not reply, since that would mean replying to itself and produce two consecutive assistant messages; in the demo the cancellation left a tool result unanswered, so the model naturally resumed.
- Learner-relevant: The mechanism that makes resumption "just work" without explicit client instruction.


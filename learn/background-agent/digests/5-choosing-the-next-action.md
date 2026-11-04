---
source: sources/background-agent/20261105/5-choosing-the-next-action.vtt
source_type: text
source_lines: 1112
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L878-L928
  - server.md#L1052-L1066
  - server.md#L217-L504
---

# L1 overview

- If `goalSatisfied` is false, the harness asks the model for the next action — `chooseAction(goal, state)` — and the supplied adapter is nothing but a one-off `generateText` call. The LLM is "the least important part": it is used strictly as a reasoning function, and once you're doing AI engineering at a high level that is the easiest piece.
- Stateless by design, not a chatbot — there is no `messages` array and no conversation history. Every call receives only the goal, the current world snapshot and the system prompt; the harness, not the transcript, carries the memory.
- Structured outputs — the model is forced into a JSON schema (`action`, `reason`, `detail`), and frontier models fine-tuned for structured output guarantee that shape, so the harness doesn't hand-validate. `action` must be one of the finite catalog of actions supplied in the prompt, which is what makes every downstream gate possible.
- Bookkeeping after each decision — `setIteration(runId, cycle)` for observability and `recordDecision(environmentId, runId, cycle, action, reason)`. This changes no behavior; it is the audit trail that replaces "scroll up in the chat" for something running in the background, and without it you can never explain how you got here or improve the agent.
- Special / terminal decisions are harness responsibilities — `wait`, `complete` and `request_help` trigger infrastructure behavior (pausing, waiting on a human, writing a final summary) rather than plain execution. Catching `complete` when the deterministic predicate disagreed is a diagnostic: either the predicate is missing something or the `chooseAction` instructions are misleading.
- State design is the actual hard part — deciding what "good" looks like, how the state gets mutated, whether it's immutable or append-only, and how to describe it vividly. It is not always a JSON object: browser agents use screenshots with bounding boxes plus the DOM, computer use uses X/Y coordinates, a game agent might use server state.
- Use the LLM where reasoning is unavoidable — if a goal check genuinely requires judgement, put an LLM call in `goalSatisfied` and write evals against it (that's where the money goes); the rest of the harness stays deterministic so the system remains trustworthy in production.
- Model choice is a secondary, eval-driven decision — Jamba/an open-source equivalent could fit because the action set is finite, but only if the action arguments can also be derived deterministically; it is not a drop-in replacement for the `chooseAction` line.

# L2 detail

- `#L1-L45` — The branch: when the goal is not satisfied, have the LLM make a decision via `chooseAction(goal, state)`; he opens the already-written adapter and its system prompt and explains he is not making students write it because it is "just calling an LLM".
- `#L46-L135` — The LLM as the least important part — a chatbot would pass a `messages` array, but this harness keeps no messages at all; every call only gets the goal and "what the world looks like", so it is completely stateless and there is no conversation to remember.
- `#L136-L169` — Inside `chooseAction`: a single one-off `generateText` call to the model, the easiest part of AI engineering once you are building harnesses, with structured outputs as the only twist.
- `#L170-L251` — Structured outputs explained from scratch: instead of free text you ask for JSON backed by a schema; the model must return `action` (one of the supplied actions), the reason it chose it, and more detail — frontier models are fine-tuned for this so the shape is guaranteed and you do not hand-validate.
- `#L252-L321` — The prompt it assembles (system prompt, role, background, the goal, the state so far) and the decision object that comes back, which is what the loop has in hand from that point on.
- `#L322-L342` — Housekeeping: `setIteration(runId, cycle)` to bump the iteration count now that the agent has looped again.
- `#L343-L432` — `recordDecision(environmentId, runId, cycle, action, reason)` and why it exists — it changes no behavior, it is the audit trail that replaces "scroll up in the chat", so later you can see what decisions were made, who approved them, and how the agent ever got here.
- `#L433-L523` — The harness philosophy in one block: guardrails, housekeeping, exposing only certain things to the agent, LLM as a "reasoning function" sitting among deterministic side-effect-free functions; the old "I want the AI to do everything" mindset means you will never have something you can trust in production — if you do, you have found AGI.
- `#L524-L597` — Q&A on which parts count as thinking functions: `goalSatisfied` *could* be an LLM, but here it is deterministic because the state is an object and we are the domain experts — it takes the current state plus a `goalCondition` and asks whether a path in that object equals a value (e.g. `rollback_release === true`, or the feature is no longer broken).
- `#L598-L699` — What "good" and "state" mean is the business logic you must design per agent, and it is not always JSON — browser agent: screenshot with boxes around elements plus the DOM; computer use: X/Y coordinates of clickable targets; game agent: whatever server data shows player positions.
- `#L700-L825` — Describing the state vividly and defining its contract (does it mutate, is it immutable, is it append-only) may consume most of your time and has nothing to do with the LLM; if the goal check genuinely requires reasoning, put an LLM call there and write evals against it — that is where you spend the money.
- `#L826-L936` — Recaps the `recordDecision` metadata, then introduces the special/terminal decision types `wait` and `complete`: if the deterministic check did not pass but the model decided it was complete, first ask whether the model is right, and if it is, find what your predicate missed — the gap is usually misleading instructions inside `chooseAction`.
- `#L937-L1112` — The Jamba Q&A: a finite action set makes a fast cheap model attractive, but Jamba will not reason out action arguments, so the harness would have to derive them itself; it is not a drop-in replacement for the `chooseAction` line and he would only re-architect after evals show cost and latency are the bottleneck.

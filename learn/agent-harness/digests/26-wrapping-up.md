---
source: 26-wrapping-up
source_type: pdf
source_lines: 277
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 26-wrapping-up

## Overview (L1)

- Sandboxing resources — Hosted sandboxing solutions for production are linked at the bottom of the course; the instructor flags these as among the best known options and recommends them for deploying tools safely.
- Bleeding-edge practice — The material is presented as bleeding-edge: most engineers do not understand sub-agents, supervision, or durable harnesses. The encouragement is to keep building agents, stay curious, read research papers for inspiration, and use evals to measure whether a change actually improves output.
- Minimum harness stack — For a chat-based agent, the minimum is tool calling, memory persisted under your own control, and compression. Durable execution that decouples the agent from the client (e.g. surviving a page refresh over SSE) is the next thing to add.
- Infinite/background agents — A forward-looking model: agents given a task or waiting on events run indefinitely and reach out through an inbox. Durable execution is table stakes, the messages API is unnecessary since there is no conversation, and the hard part is evaluating and constraining them.
- Closing notes — A browser-agent-with-preview project was considered but cut because it was too agent-specific; the instructor experiments with a voice-driven computer-use agent and closes with contact and feedback details.

## Sections (L2)

### sandboxing-resources

- Locator: `[[sources/agent-harness/20260915/26-wrapping-up.txt#sandboxing-resources]]`
- Summary: Points to hosted sandboxing solutions for production use.
- Key claims: Resources for hosted sandboxing are linked at the bottom of the course material; they are described as some of the best options the instructor knows, with likely more available elsewhere.
- Learner-relevant: The production-hardening next step — where to run agent tool execution safely outside the course's local setup.

### bleeding-edge-and-practice

- Locator: `[[sources/agent-harness/20260915/26-wrapping-up.txt#bleeding-edge-and-practice]]`
- Summary: Encourages continued practice, framing the course material as rare, cutting-edge knowledge.
- Key claims: The instructor estimates only about four people he knows personally could teach this content; most people say "Claude does it" without knowing how to build or verify it; knowing what the system should look like lets you detect hallucination; improvement should be validated with evals; learning comes from building many agents and drawing inspiration from research papers even without understanding the math.
- Learner-relevant: Motivation and a learning method (build, measure with evals, stay curious) rather than a technical deliverable.

### minimum-harness-stack

- Locator: `[[sources/agent-harness/20260915/26-wrapping-up.txt#minimum-harness-stack]]`
- Summary: Answers what the minimum stack is for shipping a chat-based harness to users.
- Key claims: Tool calling is essentially free in every SDK; memory is usually free but must be persisted somewhere you control (as done with the database); compression of memory is required; durable execution that makes the agent independent of the client (so an SSE refresh does not lose the run) is the next addition but can be deferred initially; AI SDK provides much of this out of the box, and a turn limit (about ten) prevents runaway loops.
- Learner-relevant: A concrete build-order checklist for a first deployable harness, prioritizing memory persistence and compression over durability.

### infinite-background-agents

- Locator: `[[sources/agent-harness/20260915/26-wrapping-up.txt#infinite-background-agents]]`
- Summary: Describes long-horizon "infinite"/background agents and the inbox interaction model.
- Key claims: These agents are not chatted with; they are given a task or wait idle for an event (webhook, alerting system) and run infinitely; the durable execution layer is table stakes and the good intro to this; the messages API is unneeded because there is no conversation; the interaction model is an inbox the agent posts to (questions, approvals, choices); evaluating and constraining them well is the hard part — "making it is easy, making it good is hard."
- Learner-relevant: The forward-looking architecture the course's durable-execution foundation builds toward, plus a realistic warning about the difficulty of keeping such agents good.

### closing-notes

- Locator: `[[sources/agent-harness/20260915/26-wrapping-up.txt#closing-notes]]`
- Summary: Closing remarks, a cut project idea, and contact information.
- Key claims: A browser agent with a live browser preview was planned but cut because it was too specific to the agent rather than the harness; a suggested challenge is to build one using a streamable headless browser in the cloud; current personal experiments include a voice-driven Mac computer-use agent; feedback is welcome via Twitter or email.
- Learner-relevant: An open-ended practice direction and a note on where the course deliberately stopped.

## Sources

- [[sources/agent-harness/20260915/26-wrapping-up.txt]]

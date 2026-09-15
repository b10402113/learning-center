---
source: 13-code-mode-security
source_type: pdf
source_lines: 168
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 13-code-mode-security

## Overview (L1)

- Feature caveat — Everything demonstrated (sandboxes, handoffs, etc.) is a use case exercise, not a requirement; these are optional tools for the tool belt, and Claude Code works well as a single agent without them.
- Why sandbox agent-written code — Coding or analysis agents need to run Bash, SQL, or arithmetic, and that generated code must not run on the developer's machine or production servers.
- Code mode — Instead of a dozen tool-call turns (call, wait, reason, repeat), the LLM writes one program that strings the tools together and returns the final result in a single turn, reserved for cases where a decision must be reached faster.
- Code is deterministic and LLMs excel at writing it — Letting an agent write and run code (especially for arithmetic) beats inference, which is probabilistic and hallucinates numbers and dates.
- Sandbox isolation requirement — The sandbox must not be escapable, mirroring why one would never expose a stranger to production; production deployments should use a dedicated sandbox product, while the course uses an offline Node `vm`-based version despite past escape vulnerabilities.
- The plan — Add sandboxing and a `run_code` tool that writes and executes a program, then expose it to the API.

## Sections (L2)

### optional-tools-caveat

- Locator: `[[sources/agent-harness/20260915/13-code-mode-security.txt#optional-tools-caveat]]`
- Summary: Sets expectations that the upcoming sandboxing, handoffs, and similar features are illustrative capabilities, not mandatory architecture.
- Key claims: The instructor is inventing use cases to justify the features; not every agent needs handoffs or sandboxes; Claude Code is a single agent with none of this and works well; these features are non-trivial to set up and are added to a tool belt only when a problem calls for them.
- Learner-relevant: Protects the learner from cargo-culting complexity; frames feature selection as problem-driven.

### why-sandbox-generated-code

- Locator: `[[sources/agent-harness/20260915/13-code-mode-security.txt#why-sandbox-generated-code]]`
- Summary: Poses the core security question of an agent that can generate code: how do you trust code the model writes, and where should it run?
- Key claims: Scenarios include a coding agent wanting to run Bash and an analysis agent running SQL or arithmetic; that code should not run on your machine or servers; the agent needs the ability to generate and execute code inside a sandbox.
- Learner-relevant: Establishes the threat model that motivates the node's sandbox work.

### code-mode-explained

- Locator: `[[sources/agent-harness/20260915/13-code-mode-security.txt#code-mode-explained]]`
- Summary: Defines code mode (a term Claude coined, with many equivalent versions) as letting the LLM write code that chains tools instead of making many sequential tool calls.
- Key claims: The illustrated flow shows ~12 sequential tool-use turns, each requiring a call, a wait, a model reasoning step, and a result; parallelism might reduce that to roughly 3 turns but the round-trip pattern remains; code mode lets one turn write and execute a function that strings the tools together for the final result; complexity that runs across many patterns is the target ("a decision faster"); agents are especially strong at arithmetic and code is deterministic; a quadratic-formula example contrasts many calculator functions with one Python script; references small-agents and CodeActs from Hugging Face.
- Learner-relevant: The payoff model for code mode — fewer turns, deterministic results, and where it applies.

### isolation-and-sandbox-products

- Locator: `[[sources/agent-harness/20260915/13-code-mode-security.txt#isolation-and-sandbox-products]]`
- Summary: Argues the sandbox must be inescapable and surveys the sandbox product landscape, then states the course's offline approach.
- Key claims: Exposing an agent to production is as unwise as exposing a stranger to it — an agent messing up on a production server is worse than on a laptop; many sandbox products exist; the course uses an offline Node VM approach even though a past vulnerability permitted sandbox escapes (possibly patched), and production should use a dedicated process or product instead.
- Learner-relevant: Teaches the isolation guarantee and names the trade-off between a quick learning implementation and production hardening.

### run-code-tool-plan

- Locator: `[[sources/agent-harness/20260915/13-code-mode-security.txt#run-code-tool-plan]]`
- Summary: Closes the segment by stating the concrete deliverable: a `run_code` tool that writes a program and executes it, exposed to the API.
- Key claims: The sandbox will be added to the harness; the tool writes a program and executes that program; it will then be exposed to the API.
- Learner-relevant: The bridge to the next source's implementation work.


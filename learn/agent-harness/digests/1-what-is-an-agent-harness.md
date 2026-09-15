---
source: 1-what-is-an-agent-harness
source_type: pdf
source_lines: 216
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 1-what-is-an-agent-harness

## Overview (L1)

- Defining the harness — Scott's working definition: an agent = LLM + harness; the harness is the infrastructure that makes an agent conversational, memory-bearing, durable, and self-healing, versus bare transactional inference calls.
- Harness components in practice — How the harness solves memory (short/long-term, scratchpad, facts), tools (own implementation vs MCP, server management), and long-running/durable tasks across app closures and notifications.
- Harness examples and the primacy of harness engineering — Claude Code as a case study (terminal UI, skills, file-mention UX, auto-compaction, autonomous sub-agents), other harnesses (OpenCode, OpenClaw, Hermes, Pi), and the claim that the best harness beats the best model.
- What to prioritize and experience-dependence — The harness follows the target experience (trading bot → self-healing, guardrails, approvals, PII security, self-eval loop); table stakes are memory and tool calling, durable execution is situational.

## Sections (L2)

### defining-the-harness

- Locator: `[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#defining-the-harness]]`
- Summary: Scott gives his definition of a harness, acknowledging the term is as overloaded as "agent." He argues an agent is the combination of an LLM plus a harness, and the harness is the infrastructure that turns raw model calls into a usable, durable product.
- Key claims: Agent = LLM + harness; without a harness you only have one-off transactional inference calls; a harness enables conversation, memory, durability, self-healing, and the ability to exercise different architectures for different problems; the harness is infrastructure, and you cannot build a production agent without it; other definitions of harness are derivatives of "all the infrastructure an agent needs to be hardened, accurate, durable, and resilient."
- Learner-relevant: The foundational definition that frames every later design decision and justifies treating the harness as its own engineering discipline.

### harness-components

- Locator: `[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#harness-components]]`
- Summary: Zooms into the harness to enumerate the concrete problems it must solve: memory, tools, and long-running tasks. These become the recurring sub-systems the course builds.
- Key claims: Memory must be solved across short-term, long-term, scratchpad, and facts; tools must be introduced and managed — whether a standard tool-call implementation or MCP, and how tool servers get managed; long-running tasks need durable execution so a ten-minute deep-research job survives the user closing the app and can notify them later; the harness is the infrastructure that powers the agent.
- Learner-relevant: Enumerates the design surfaces (memory, tools, durability) that the learner will reason about and later implement.

### harness-examples-and-harness-engineering

- Locator: `[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#harness-examples-and-harness-engineering]]`
- Summary: Uses Claude Code as a concrete example of harness boundaries, then names other harness implementations around the same models. Scott argues harness quality, not model quality, is the differentiator.
- Key claims: Strip away the model selection in Claude Code and the harness is the terminal UI, the skills implementation, the file-mention UX, auto-compaction when history grows, and the ability to spawn sub-agents unprompted; OpenCode, OpenClaw, Hermes, and Pi are all harnesses around the same underlying models; harnesses using inferior models can outperform harnesses with superior models; harness engineering and evals are the two most valuable AI skills, roughly 90% of the work.
- Learner-relevant: Builds intuition for what "counts" as harness and motivates investing effort in harness quality over chasing the newest model.

### what-to-prioritize

- Locator: `[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#what-to-prioritize]]`
- Summary: Answers what to focus on when building a harness: everything depends on the experience you want to deliver. Scott walks through a trading-agent example and then names the table-stakes capabilities.
- Key claims: Harness priorities depend on the target experience — an always-on trading agent needs self-healing, guardrails, approval systems, and PII/security mechanisms; consider tying in an eval loop so the agent self-judges and improves; table stakes are memory and tool calling; durable execution is needed here but not by every agent (e.g. simple send-message/get-response agents); summarized as "models work the way that harnesses allow them to."
- Learner-relevant: Teaches learners to derive harness requirements from the desired experience rather than applying a fixed checklist, and identifies which capabilities are non-negotiable.

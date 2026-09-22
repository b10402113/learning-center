---
source: 第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment
source_type: pdf
source_lines: 312
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment

## Overview (L1)

- Theme: the five-component anatomy of an Agent — One-sentence definition plus formula: `Agent = LLM + Tools + Memory + Loop + Environment`. The definition contains no "LLM" because Agents predate LLMs (RL agents, game NPCs); LLMs only lowered the engineering barrier.
- Five components — LLM (decision engine), Tools (action capability), Memory (state carrier), Loop (cyclic execution), Environment (interaction target); five components + one loop = the full technical skeleton.
- Loop mechanics — ReAct: Reasoning → Acting → Observation, looping until completion or max steps; the loop must also handle stop conditions, error recovery, context compression, and multi-model switching. ~80% of a framework's complexity lives in the Loop.
- Worked trace — A README translation task moves through Environment → Memory → 4 loop turns (read file → translate → write file → done), exercising all five components.
- Component deep-dives — LLM only issues commands (framework executes); Tools define the autonomy boundary (MCP standardizes pluggability); Memory splits short-term (context) vs. long-term (structured/vector/hybrid); Environment sets capability ceiling and safety floor (Sandbox is its safety design).
- Agent vs. non-Agent — Real vs. fake Agents distinguished by Tools + Environment and the presence of an "autonomous decision loop"; LLM alone, chatbot, and workflow are not Agents.
- From Agent to Agent OS — An enterprise's real problem is running many Agents stably, requiring process management, workspace isolation + sandbox, multi-model routing, observability, and cost control — an application vs. an operating system distinction.

## Sections (L2)

### agent-definition

- Locator: `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#agent-definition]]`
- Summary: Defines an Agent as a program that senses its environment, decides autonomously, acts, and iterates on a feedback loop; formalizes it as five components plus a loop.
- Key claims: The definition deliberately omits "LLM" since Agents predate LLMs; LLM merely drops the engineering barrier — Agent ≠ "made with an LLM".
- Learner-relevant: The foundational definition reused to classify any claimed Agent.

### five-components

- Locator: `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#five-components]]`
- Summary: Introduces LLM (receives state, decides next step), Tools (write files, call APIs, query DBs), Memory (short-term context + long-term), Loop (repeated decide-act-observe), and Environment (files, network, DB, user).
- Key claims: Any Agent system, however complex, can be explained by these five components — complexity only means deeper per-component work.
- Learner-relevant: The reusable decomposition lens for system design.

### loop-mechanics

- Locator: `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#loop-mechanics]]`
- Summary: Explains ReAct (Reasoning → Acting → Observation) and the four things a good loop must manage.
- Key claims: A single LLM call is a chatbot; only looping decision-act-observe makes an Agent; the four concerns are stop conditions, error recovery, context compression, and multi-model switching; the loop holds ~80% of framework complexity.
- Learner-relevant: Core mechanism behind all agent runtimes, tying to the Loop Engine methodology pillar.

### worked-trace

- Locator: `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#worked-trace]]`
- Summary: Traces a translation task through the components: task enters Environment, is stored in Memory, then four loop turns (read_file, translate internally, write_file, judge done).
- Key claims: All five components participate; translation is done by the LLM itself without a tool, showing not every turn needs a tool.
- Learner-relevant: Concrete runtime trace that makes the abstract architecture intuitive.

### component-deep-dive

- Locator: `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#component-deep-dive]]`
- Summary: Details LLM (single vs. multi-model routing), Tools (local/network/DB/system/MCP), Memory (short-term context vs. long-term structured/vector/hybrid), and Environment (capability boundary + engineering constraints).
- Key claims: LLM only outputs structured calls while the framework acts; the autonomy boundary equals the Tools boundary; short-term memory is mandatory while long-term is advanced and separates "tool" from "assistant"; Sandbox is the security design of Environment.
- Learner-relevant: Connects components to downstream Sandbox/Memory/Provider work in OryxOS.

### agent-vs-non-agent

- Locator: `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#agent-vs-non-agent]]`
- Summary: Distinguishes real Agents (same skeleton, differing in Tools and Environment) from LLM, chatbot, and workflow, which lack the autonomous decision loop.
- Key claims: Claude Code / Codex / customer-service Agents share the five-component skeleton; the test is whether there is an "autonomous decision loop"; workflow is predefined and deterministic, not exploratory.
- Learner-relevant: The classification criterion for judging any Agent product.

### agent-to-agent-os

- Locator: `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf#agent-to-agent-os]]`
- Summary: Transitions from a single Agent (an application) to Agent OS (an operating system supporting many Agents) with process management, isolation + sandbox, multi-model routing, observability, and cost control.
- Key claims: Running one Agent is easy; running many stably is the enterprise problem; the L2 runtime layer is the scarcest talent layer in 2026 and what OryxOS targets.
- Learner-relevant: Sets up the Agent OS lesson and the OryxOS project.

## Sources

- `[[sources/geek-ai-agent/20260922/第8节：Agent 架构拆解：LLM + Tools + Memory + Loop + Environment.pdf]]`

---
source: 企业级 AI 编程先导课程 - 第三节
source_type: pdf
source_lines: 820
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 企业级 AI 编程先导课程 - 第三节

## Overview (L1)

- Agent OS as infrastructure — Agent OS is the 2026 standard for enterprise AI landing; MCP's late-2024 standardization decoupled tools from runtime, giving Agent OS a foundation to stand on.
- Five components of an Agent — LLM + Memory + Loop + Tools + Environment; any Agent decomposes into these.
- ReAct loop — Reason + Act = ReAct, a clear loop (<100 lines of Java in OryxOS); ReAct is magic-free and derivable.
- Industry comparison — OpenClaw (personal-grade extreme, Node.js) vs Hermes Agent (enterprise-direction explorer, Python), and the three gaps they leave.
- Why Java and OryxOS positioning — Java is a hard constraint (Spring Boot standard, high Java engineer density, mature JVM tooling, regulated-industry fit); OryxOS is Java + enterprise scenario + private deployment + day-one governance.
- Architecture and capabilities — Five-layer architecture, five core capabilities, three-tier Plugin Tool access, SKILL.md zero-code scenario, deployment modes, and a 3-week 12-hour-to-1.0 plan driven by Spec-Kit.

## Sections (L2)

### agent-os-infra
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#agent-os-infra]]`
- Summary: Why Agent OS now — enterprises must run many Agents sharing one base; MCP became the industry standard in late 2024; channel access, LLM routing, memory, tool calls, and security auditing belong in the base.
- Key claims: OpenClaw (247k stars, Node.js) and Hermes (135k stars, Python) validated the direction, but the Java ecosystem is a vacuum; with an Agent OS, launching an Agent only needs a Profile + Tool.
- Learner-relevant: Frames the project's market gap and necessity.

### five-components
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#five-components]]`
- Summary: The five components: LLM (brain, 12 models via Provider abstraction), Memory (session + long-term MEMORY.md + episodic), Loop (ReAct), Tools (function calling, 5 built-in + plugin extension), Environment (Sandbox isolation, .oryxos/ workspace, Channel triggers).
- Key claims: any Agent is a combination of these five; without Memory an Agent isn't an assistant but a tool; Environment is the container an Agent exists in.
- Learner-relevant: The universal ruler for decomposing any Agent and the architecture's organizing principle.

### react-loop
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#react-loop]]`
- Summary: The ReAct loop: input → Reason (LLM thinking) → Act (tool execution) → Observe (result backfill) → continue, with MAX_ITER = 10 and session message accumulation.
- Key claims: every round's LLM response and tool result append to session history for auditability; when history exceeds context window, recent history is kept; implemented in under 100 lines of Java.
- Learner-relevant: The core mechanism any Agent behavior can be derived from.

### ops-scenario
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#ops-scenario]]`
- Summary: A 3 a.m. ops-alert walkthrough showing the five components cooperating: webhook routes to ops-agent, ReAct starts, log_query tool runs in Sandbox, OOM found with a known mitigation in MEMORY.md, restart_service runs, notify pushes to WeCom.
- Key claims: unattended, data stays in the intranet, every step auditable, and MEMORY.md remembers the incident for next time.
- Learner-relevant: Makes the abstract five-component model concrete.

### openclaw
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#openclaw]]`
- Summary: OpenClaw as the personal-grade Agent OS extreme — 247k stars, 25 channels, 13,729 community skills, Node.js/TypeScript, MIT, released Nov 2025 by Pete Steinberger, author joined OpenAI Feb 2026.
- Key claims: Cisco rated it "unacceptable cybersecurity risk" with CVE-2026-25253 (1-click RCE); identity, permission, auditability, and compliance are missing from day one; Tank OS is a patch, not day-one design.
- Learner-relevant: Shows that "personal-first" and "enterprise-first" are different designs.

### hermes
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#hermes]]`
- Summary: Hermes Agent as the enterprise-direction explorer — 135k stars, 18 channels, 3-layer memory + Honcho 12-layer user modeling, Python, released Feb 2026 by NousResearch.
- Key claims: self-evolving Curator grades/consolidates/prunes skill library every 7 days; memory writes are scanned for prompt injection; PTG offers it as enterprise management service at $40k + retainer; multi-tenancy is HERMES_HOME switching, not RBAC/SSO; audit must be self-added.
- Learner-relevant: Presents the closest-to-enterprise option and its remaining gaps.

### comparison-and-gaps
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#comparison-and-gaps]]`
- Summary: A side-by-side comparison (language, positioning, channels, memory, security, multi-tenancy, audit, IT integration, commercialization) and the three shared gaps: complete enterprise governance, deep enterprise-IT integration, and a fully empty Java ecosystem.
- Key claims: both validate the market but lack Java + day-one enterprise governance; gap 3 is the biggest opportunity — a different quadrant, not competition.
- Learner-relevant: Defines OryxOS's strategic whitespace.

### why-java
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#why-java]]`
- Summary: Six reasons Java is a hard constraint: Spring Boot is the de facto enterprise standard; Spring AI Alibaba already solves LLM calls (12 connectors); Java engineer density is highest; the JVM tooling chain is mature; existing Java systems have the lowest integration cost; regulated industries standardize on Java.
- Key claims: installing a Java Agent OS equals installing a Spring Boot app; GraalVM Native Image resolves the startup-speed concern.
- Learner-relevant: Justifies the stack choice with engineering and market logic rather than preference.

### oryxos-positioning
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#oryxos-positioning]]`
- Summary: OryxOS is a Java-based, enterprise-oriented, open-source, privately-deployable Agent OS; its relationships with OpenClaw (same class, different tier; SKILL.md interoperable), Hermes (day-one governance), Dify (complementary workflow vs runtime), and Spring AI (reuse).
- Key claims: data stays entirely on the enterprise's own infrastructure; Apache 2.0, fully auditable, forkable.
- Learner-relevant: A crisp one-paragraph positioning the learner can reuse.

### architecture
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#architecture]]`
- Summary: The five-layer architecture: CLI/HTTP access layer, ReAct engine core, core capabilities (Provider/Memory/Tool/Web Service), support modules (Profile/Bootstrap/SessionManager/Sandbox/ToolRegistry), and storage (SQLite, .oryxos/, MCP Server).
- Key claims: the ReAct loop is the engine, the four capabilities are the fuel; the storage layer exposes sessions / tool_invocations / llm_calls and profiles/memory/skills/logs.
- Learner-relevant: The structural blueprint the learner will build against.

### five-capabilities
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#five-capabilities]]`
- Summary: The five core capabilities: Provider (LLM access, zero lock-in), Memory (three layers), Tool system (built-in 5 + plugin three tiers), Web Service (10 REST endpoints), all driven by the ReAct loop.
- Key claims: the ReAct loop is the engine and the four capabilities are fuel — without any one the engine can't run; Web Service is what distinguishes OryxOS from a "personal assistant."
- Learner-relevant: The capability breakdown the course builds module by module.

### plugin-tools
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#plugin-tools]]`
- Summary: Three-tier Plugin Tool access: zero-code (SKILL.md + existing MCP servers), light-code (write your own MCP server in any language), heavy-code (@Tool annotation on Java methods, auto-scanned and registered).
- Key claims: prefer lower barriers; SKILL.md is compatible with the agentskills.io open standard so OpenClaw's 13,729 community skills can theoretically be imported.
- Learner-relevant: The extension model business teams use to add Agent capabilities.

### skill-zero-code
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#skill-zero-code]]`
- Summary: A concrete zero-code scenario: a daily-pr-digest.md SKILL.md with frontmatter (name, cron trigger, required_tools github-mcp + slack-mcp) and a task description, executed by SkillLoader → McpClientService → ToolRegistry → cron → LLM tool composition.
- Key claims: the whole flow is 0 lines of code; Profile YAML references skill and mcp_servers to start a new Agent scenario.
- Learner-relevant: Shows the declarative extension experience OryxOS aims for.

### deployment
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#deployment]]`
- Summary: Three run modes (oryxos chat, oryxos serve on port 8080 with Java 21 virtual threads, oryxos gateway daemon) and the .oryxos/ workspace structure (profiles, memory/MEMORY.md, skills, mcp_servers.yaml, sessions, logs, oryxos.db, AGENTS.md/SOUL.md/USER.md).
- Key claims: stack is JDK 21 + Spring Boot 3.x + Spring AI Alibaba + SQLite + Picocli, single executable JAR; runs with no external service dependencies and fits existing K8s/Java tooling.
- Learner-relevant: The operational picture for private enterprise deployment.

### three-week-plan
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#three-week-plan]]`
- Summary: The 3-week, 12-hour plan to OryxOS 1.0: week 1 (LLM + ReAct: Maven skeleton, ProviderService, ReActLoop + PromptBuilder + ToolExecutor, HTTP Tool + CLI Channel), week 2 (Memory + Tool: MemoryService, built-in memory/file/shell tools, McpClientService, SkillLoader), week 3 (Web Service + engineering: Spring MVC + virtual threads, 6 controllers + 10 REST endpoints, SQLite sessions, BootstrapLoader + 12 CLI commands, structured logs + homepage, a community doc PR).
- Key claims: each week ends with a demonstrable result; demos progress from "check weather" to "remember my preference" to full REST integration.
- Learner-relevant: Sets the milestone cadence and concrete outputs.

### spec-kit
- Locator: `[[sources/geek-ai-agent/20260922/企业级 AI 编程先导课程 - 第三节.pdf#spec-kit]]`
- Summary: Spec-Kit-driven development — OryxOS's industry research + requirements + technical design feed directly into Spec-Kit without rewriting: constitution.md (6 principles), spec.md (5 user stories), plan.md (technical design → implementation plan), tasks.md (per-US tasks).
- Key claims: user-story order US-1 → US-2 → US-3+US-4 parallel → US-5, each with an acceptance demo; run /speckit.analyze after each US to detect spec-code drift; lesson four demonstrates this live.
- Learner-relevant: The workflow spine for turning documents into AI-executable tasks.

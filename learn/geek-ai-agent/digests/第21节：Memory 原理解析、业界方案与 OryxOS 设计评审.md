---
source: 第21节：Memory 原理解析、业界方案与 OryxOS 设计评审
source_type: pdf
source_lines: 437
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第21节：Memory 原理解析、业界方案与 OryxOS 设计评审

## Overview (L1)

- Memory 是什么 / 为什么需要 — LLMs are stateless and context windows are finite/expensive, so Agent Memory manages remembering beyond the window; the #1 barrier from demo to production.
- 短期 vs 长期记忆与压缩 — short-term (working memory in the window) vs long-term (external, retrieved back); context compression differs from memory compression; extraction is key.
- 业界方案盘点 — Mem0, Zep/Graphiti, Letta/MemGPT, Cognee, LangMem, ReMe, plus deep dives on MemGPT's "memory as OS" and Mem0's plug-and-play layer.
- 知识图谱记忆 — when facts change over time, temporal knowledge graphs solve the "relationship/time" blind spots of vector search.
- OryxOS 设计评审 — interface-first `MemoryService`, phase-1 file+SQLite with core/session/archive layers, agent-driven `save_memory`, signal-driven phase-2 vector upgrade, and the build-vs-integrate decision.
- 分阶段路线 — interface wall stable forever; phase 1 files, phase 2 vectors behind the same facade.

## Sections (L2)

### 一-为什么-agent-需要-memory

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#一-为什么-agent-需要-memory]]`
- Summary: Every LLM call is stateless — history must be injected by the caller; agents need multi-turn dialogue, cross-session user memory and long tasks, while the context window is limited and expensive.
- Key claims: Agent Memory's essence is managing remembering outside the finite window; in 2026 it is a headline barrier (Monday the agent passes evals, Wednesday it forgets the user's name — a memory problem, not a model problem).
- Learner-relevant: Motivates Memory as one of the三大能力 alongside ReAct and Tool.

### 二-短期记忆与长期记忆

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#二-短期记忆与长期记忆]]`
- Summary: Short-term/working memory is the current conversation/task context in the window (limited, short-lived, fast); long-term memory is persisted across sessions and retrieved back; long-term subdivides into episodic (events), semantic (facts/preferences) and procedural (how-to, sometimes skills/rules) memory.
- Key claims: A core loop moves important short-term content into long-term storage and retrieves relevant long-term content back into context.
- Learner-relevant: Gives the two-layer vocabulary reused by OryxOS's three-tier design.

### 三-上下文压缩-vs-记忆压缩

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#三-上下文压缩-vs-记忆压缩]]`
- Summary: Context compression shortens what is being said now (summarize/cut turns) to keep the current conversation from overflowing; memory compression consolidates/dedupes/abstracts the accumulated long-term store to keep it lean and retrievable.
- Key claims: One sentence distinction — context compression shortens the present window, memory compression tidies the long-term warehouse.
- Learner-relevant: Clarifies a commonly conflated pair before implementation decisions.

### 四-记忆提炼

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#四-记忆提炼]]`
- Summary: Raw dialogue is verbose and low-signal, so it must be extracted into structured, concise memory entries; extraction is typically done by the model (optionally with rules).
- Key claims: Extraction quality directly determines long-term memory quality — extract well and retrieval is useful; extract badly and the store is a garbage dump.
- Learner-relevant: The step that makes long-term memory usable, referenced later when choosing agent-driven vs automatic writing.

### 五-完整循环

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#五-完整循环]]`
- Summary: The closed loop: accumulate during dialogue → compress + extract → write to long-term → periodically consolidate → retrieve and re-inject into context → back to the start.
- Key claims: These concepts are one system because they are different stages of this single loop.
- Learner-relevant: The mental model the OryxOS phase-1 loop later instantiates.

### 六-业界方案盘点

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#六-业界方案盘点]]`
- Summary: Survey of the mature 2026 open-source ecosystem: Mem0 (47K+ stars, plug-and-play, user/session/agent scopes, vector+graph+KV), Zep/Graphiti (temporal knowledge graph, ~63.8% vs Mem0 ~49% on LongMemEval), Letta/MemGPT (memory-as-OS, stateful agents), Cognee (graph-native, self-improving ECL pipeline), LangMem (LangGraph official), ReMe (transparent file-based).
- Key claims: LongMemEval is the de-facto stress test and architectures can differ by ~15 points on temporal retrieval — it is an architecture-choice problem, not a yes/no one; extraction/compression map to per-project features (Cognee cognify/memify, Letta autonomy); frameworks mostly avoid context compression, preferring to externalize.
- Learner-relevant: Supplies the reference landscape for the build-vs-integrate decision.

### 七-重点解剖-memgpt

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#七-重点解剖-memgpt]]`
- Summary: MemGPT's core insight: LLM context = memory (fast, expensive, small), external storage = disk (slow, cheap, huge); manage them like an OS manages virtual memory. Two layers — main context with a small always-present Core Memory, and external context with Archival Memory + full history that must be retrieved.
- Key claims: MemGPT gives the Agent tools to manage its own memory and a "memory pressure" signal when context nears full, so the Agent decides what to summarize/write/archive/discard; two ideas are directly useful to OryxOS — the core-memory tier (phase 1) and pressure-triggered consolidation (extension candidate).
- Learner-relevant: The思想 source for OryxOS's three-tier layering and the "signal-driven" upgrade philosophy.

### 八-重点解剖-mem0

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#八-重点解剖-mem0]]`
- Summary: Mem0 packages auto-extraction + conflict resolution + hybrid storage + multi-scope into a library: `add`/`search` hide everything. Its core is extraction and update, not storage — on add it compares new facts against existing memory (contradiction → update, duplicate → merge, unrelated → add). Scopes are user/session/agent (by ownership), unlike OryxOS's importance/lifecycle split.
- Key claims: This "add即消解" is the practical landing of memory compression and exposes the weakness of OryxOS's pure-append MEMORY.md; Mem0 is a self-hostable library, not a runtime, so it will not collide with OryxOS's positioning; costs are an extra model call per add, a black-box conflict-resolution path, and data flowing through an external pipeline.
- Learner-relevant: The primary integration candidate and the reference for the future memory-compression problem.

### 九-知识图谱记忆

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#九-知识图谱记忆]]`
- Summary: Vector search is good at "similar meaning" but blind to "relationships" and "time" — e.g. it may recall an outdated "works at A" over a newer "works at B". Graphiti/Zep's temporal KG stores entities as nodes and timestamped relations as edges; a new fact expires the old edge rather than overwriting it.
- Key claims: Files/KV suit "what is", vectors suit "similar meaning", knowledge graphs suit "who relates to whom and when" — strong memory layers mix all three; because OryxOS target scenarios are preference/fact-heavy with low relational complexity, graph memory ranks below vector, relies on Agent judgment for temporal consistency, and if ever needed should integrate a self-hostable Graphiti rather than be built.
- Learner-relevant: Explains the vector blind spot and OryxOS's deliberate lower priority for graph memory.

### 十-设计原则

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十-设计原则]]`
- Summary: OryxOS's first principle is not the strongest memory system but a sufficient, controllable one that can grow smoothly — direction clear, interface right, implementation only for now; the dividing line is the interface wall.
- Key claims: Aligns with the project's "phased restraint, no over-design" tone; strong frameworks are references and fallbacks, not complexity to import on day one.
- Learner-relevant: The reusable design philosophy shared with Sandbox and scheduler modules.

### 十一-接口原则

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十一-接口原则]]`
- Summary: `MemoryService` is the facade; the engine only calls abstract methods like "recall" and "remember" and never knows whether the backend is files, SQLite, a vector store or an external framework.
- Key claims: Nailing the interface first matters more than choosing storage; this mirrors MemGPT exposing stable memory operations behind its own swapping.
- Learner-relevant: The technical precondition for "grow smoothly without upper-layer changes".

### 十二-阶段一文件式

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十二-阶段一文件式]]`
- Summary: Core phase uses file-based `MEMORY.md` but borrows MemGPT to cut three tiers: core memory (always present, small, fixed block atop MEMORY.md), session memory (current session, SQLite), archival memory (on-demand, files + keyword match); core+archival are written by the Agent actively calling `save_memory`, not by system extraction.
- Key claims: Automatic extraction (MemGPT-style trigger on session end/context pressure) is an unverified need — it needs extra model calls and "when to trigger" logic, so it is deferred to the extension phase pending real signals; the full phase-1 loop is zero external dependencies, fitting the single-binary goal.
- Learner-relevant: The concrete phase-1 design and the explicit "no auto-extraction" decision.

### 十三-阶段二信号驱动

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十三-阶段二信号驱动]]`
- Summary: Three signals justify vector search: (1) keyword retrieval starts missing similar-meaning memories, (2) archival volume crosses into hundreds/thousands, (3) a real need for precise cross-session recall. Upgrade by swapping the implementation behind `MemoryService` — interface unchanged.
- Key claims: Without these signals, adopting vectors is over-design and a heavy dependency; resist "everyone uses vectors" anxiety and let real signals decide.
- Learner-relevant: The signal-driven upgrade rule reused by Sandbox and scheduler.

### 十四-自造还是集成

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十四-自造还是集成]]`
- Summary: Distinguish Letta (a stateful Agent runtime — a peer/competitor in OryxOS's layer) from Mem0 (a memory library designed to be integrated). Letta should never be integrated, only its ideas (core memory, pressure triggers) learned. Mem0 may be integrated if memory is "necessary but non-differentiating".
- Key claims: Current leaning: core-phase file memory is self-built (simple, controllable, private-deployable); phase-2 vector layer prefers a thin self-built implementation for data-sovereignty, integrating a self-hostable option only if self-built clearly lags and memory is not a focus; the decision anchor is always "is memory a core differentiating capability".
- Learner-relevant: The decision framework for integrating external infrastructure without compromising positioning.

### 十五-分阶段路线总览

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十五-分阶段路线总览]]`
- Summary: Tabular route: interface layer (`MemoryService` facade) permanent from day one; phase 1 core memory always present + session in SQLite + archival in files/keyword, agent-driven writes, zero external deps; phase-2 trigger signals; phase 2 vector retrieval behind the same facade; build-vs-integrate as above.
- Key claims: Changing from left to right behind the interface changes no upper-layer code.
- Learner-relevant: The roadmap the implementation lesson (22) executes.

### 十六-评审自查

- Locator: `[[sources/geek-ai-agent/20260922/第21节：Memory 原理解析、业界方案与 OryxOS 设计评审.pdf#十六-评审自查]]`
- Summary: Self-check questions: can you distinguish short/long-term and context/memory compression in one sentence; is the `MemoryService` wall impermeable (does ReAct know implementation details?); where do the three tiers live and why agent-driven `save_memory`; can you recite the three vector signals; what is the build-vs-integrate anchor.
- Key claims: If any answer requires "everyone is using it", the design is not yet thought through.
- Learner-relevant: A retrievable review checklist to confirm understanding before coding.

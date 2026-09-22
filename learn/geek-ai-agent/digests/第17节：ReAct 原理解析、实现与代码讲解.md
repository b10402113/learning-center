---
source: 第17节：ReAct 原理解析、实现与代码讲解
source_type: pdf
source_lines: 340
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第17节：ReAct 原理解析、实现与代码讲解

## Overview (L1)

- ReAct 是什么 — the Reasoning+Acting loop (2022, now the de-facto standard) that lets the model think/act/observe repeatedly until the task is done.
- 动手前想清楚 — the loop only schedules: it stores responses and results, delegates prompt building, model calls and tool execution; write it yourself rather than using a framework black box.
- 代码怎么写 — `ReActLoop` + `PromptBuilder` + `ToolExecutor`, plus `AgentService` orchestration, `ProfileContext` ThreadLocal, and `ContextLoader`.
- 验收 harness — five test classes, all unit tests, each regression-pinning one of the three named traps.
- 做完怎么验 — run Demo 1 end to end with a real model; confirm the loop is hand-written, not a framework agent.

## Sections (L2)

### 一-react-是什么

- Locator: `[[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#一-react-是什么]]`
- Summary: One turn is fixed as Reason (decide next step) → Act (call one tool) → Observe (take result back into context); the loop stops when the model emits no tool call, or hits the max-iteration cap (default 10).
- Key claims: ReAct itself calls neither the model nor tools — it commands, using Provider to call the LLM and ToolExecutor to run tools; Claude Code, Cursor and LangChain all run this pattern.
- Learner-relevant: Frames the loop as the "brain loop" that connects Provider, Tool and Memory into one agent.

### 二-动手前先想清楚

- Locator: `[[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#二-动手前先想清楚]]`
- Summary: Split responsibilities (loop only schedules; PromptBuilder builds context, ProviderService calls the model, ToolExecutor executes); why hand-write instead of a framework loop (stop conditions, tool failures, context growth, model switching must be controllable); three traps — no iteration cap (infinite loop), unbounded context, and not accumulating responses/results back into the Session.
- Key claims: The main loop is only tens of lines; the difficulty is the boundaries, which must be decided at design time, not patched afterward.
- Learner-relevant: Establishes the "short loop, delegated duties, self-controlled boundaries" discipline reused by every later module.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#三-代码怎么写]]`
- Summary: `ReActLoop.run` caps iterations, calls `promptBuilder.build`, calls `providerService.chat(session.id(), ...)`, appends responses, returns when there is no tool call, else executes each `ToolCall` via `toolExecutor` and appends results. `PromptBuilder` assembles four parts (system prompt + current datetime, long-term Memory, recent N=20 history turns, available tools); `ToolExecutor` finds the tool, runs the sandbox/whitelist check, executes, wraps `ToolResult` and audits `tool_invocations` on success and failure.
- Key claims: Every model response and tool result is appended to the Session for auditability; `sessionId` is threaded into both `llm_calls` and `tool_invocations`; `AgentService.process` is the single orchestrator for CLI/Web/scheduler and uses a `ProfileContext` ThreadLocal because `OryxTool.execute` carries no Profile; `ContextLoader` re-reads Bootstrap/SKILL.md every build (no cache) and errors on missing referenced files.
- Learner-relevant: Provides the code-level deliverable anchors and the "execution rights live in exactly one place" rule that justifies disabling Spring AI auto-execution.

### 四-验收-harness

- Locator: `[[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#四-验收-harness]]`
- Summary: Five unit-test classes with no network: `ReActLoopTest` (one-turn finish, tool round-trip, max-iteration stop, accumulation), `PromptBuilderTest` (four-part order, history truncation, datetime suffix), `ToolExecutorTest` (success/failure audit), `AgentServiceTest` (`ProfileContext` set/cleared even on exception), `ContextLoaderTest` (no cache, missing-file handling).
- Key claims: The two most valuable regressions are "model keeps requesting tools → stops at exactly 10 iterations" and "ProfileContext is cleared in `finally` even when processing throws" — the latter guards a ThreadLocal leak invisible in single-request tests.
- Learner-relevant: Shows how to pin subtle concurrency/lifecycle bugs that only appear on thread reuse.

### 五-做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第17节：ReAct 原理解析、实现与代码讲解.pdf#五-做完怎么验]]`
- Summary: Manual confirmation: Demo 1 conversational version runs with a real model over multiple turns (Agent calls `http_get`, gets data, gives advice), and code review confirms the loop is hand-written with no framework Agent wrapper.
- Key claims: Deferred to extension phase — parallel tool calls, agent delegation, streaming, context compression (core phase uses "keep last N turns").
- Learner-relevant: Defines the pass bar as Demo 1 completing end to end alongside Provider.

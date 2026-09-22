---
source: 第20节：Tool 体系 原理解析、实现与代码讲解
source_type: pdf
source_lines: 533
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第20节：Tool 体系 原理解析、实现与代码讲解

## Overview (L1)

- Tool 是什么 — the Agent's "hands": LLM decides what to call, OryxOS finds/executes it and returns results; the "Act" step of ReAct.
- 动手前想清楚 — one unified `OryxTool` abstraction hides tool origin; three plugin tiers; every execution passes a safety whitelist first.
- 代码怎么写 — `OryxTool`/`ToolResult`/`ToolRegistry`, `@Tool` annotated tools, `McpClientService`/`McpToolAdapter`, and the `ToolExecutor` flow.
- 验收 harness — four blocks of mostly unit tests including the contract test every registered tool must pass and MCP failure isolation.
- 怎么用怎么验 — three plugin tiers, `oryxos tool list`, manual real runs.
- 补齐到业界水准 — five added built-in tools (`edit_file`/`grep`/`glob`/`ask_user`/`web_search`) proving the abstraction's value.

## Sections (L2)

### 一-tool-是什么

- Locator: `[[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#一-tool-是什么]]`
- Summary: LLMs generate text only; tools let the Agent actually read files, run commands and call APIs. Built-in tools in the core phase are nine: `read_file`/`write_file`/`list_dir` (files), `shell` (command), `http_get`/`http_post` (requests), `save_memory`/`recall_memory` (memory), and `notify`.
- Key claims: Two categories — built-in Tool and Plugin Tool (business extensions); the focus of this lesson is how Plugin Tool is designed.
- Learner-relevant: Establishes Tool as the concrete "Act" implementation and the boundary between platform base tools and business capability.

### 二-动手前先想清楚

- Locator: `[[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#二-动手前先想清楚]]`
- Summary: Three decisions: define a unified `OryxTool` registered in a `ToolRegistry` so ReAct is source-agnostic (and check early code has `getInputSchema()` — early versions often omit it and block Function Calling); give Plugin Tool three tiers (tier 1 zero-code AGENT.md + reuse MCP servers, tier 2 light-code own MCP server, tier 3 heavy-code `@Tool` Java bean), preferring tier 1 when possible; every tool execution passes an application-layer whitelist.
- Key claims: Selection rule is "use tier 1 over 2 over 3"; the whitelist (path/command/domain) is the only Tool governance mechanism in the core phase and must be designed into the execution chain.
- Learner-relevant: Anchors the "unified abstraction first" principle and the progressive-disclosure plugin story.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#三-代码怎么写]]`
- Summary: `OryxTool` has `getName`/`getDescription`/`getInputSchema`/`execute(JsonNode)`; `ToolResult` carries success flag, content, error and retryable; `McpClientService.connectAll` reads `.oryxos/mcp_servers.yaml`, connects via stdio/SSE, wraps each `tools/list` entry into `McpToolAdapter` and registers it, logging WARN and skipping failed servers. `http_get` shows the pattern: `sandbox.enforce(...)` first, then the request. `ToolRegistry` collects all sources, each Agent filters by Profile `tools`; `ToolExecutor` finds by name → whitelist → execute → wrap `ToolResult` + write `tool_invocations`.
- Key claims: MCP call failure maps to a retryable `ToolResult`; an unreachable external MCP server must never become a startup failure; execution flows through lesson 17's ToolExecutor.
- Learner-relevant: Provides the exact abstractions, MCP adapter contract, and the "check first, then act" hard rule.

### 四-验收-harness

- Locator: `[[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#四-验收-harness]]`
- Summary: Four test blocks: `OryxToolContractTest` (parameterized over every registered tool asserting name/description/inputSchema non-null), `ToolRegistryTest` (all three sources register as `OryxTool`; Profile filter yields an exact subset — no more, no less), `FileToolsTest`/`ShellToolsTest`/`HttpToolsTest` (normal + blocked), `McpToolAdapterTest`/`McpClientServiceTest` (mock client; failed server only WARNs and does not break startup).
- Key claims: The contract test automatically red-flags any tool missing `getInputSchema()`, which would otherwise deadlock Provider's Function Calling translation; the filter test's "exact subset" catches both under- and over-filtering.
- Learner-relevant: Shows contract testing and external-dependency isolation as reusable quality patterns.

### 五-怎么用做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#五-怎么用做完怎么验]]`
- Summary: Adding tools follows the three tiers; `oryxos tool list` shows registered tools. Manual checks: tier 1 SKILL.md + real MCP server completes a task, tier 3 `@Tool` example visible/callable, every tool call written to `tool_invocations`.
- Key claims: Deferred to extension phase — Tool Policy (allow/deny), on-demand loading, OryxOS as an MCP server, container-level sandbox, parallel tool calls; core phase uses whitelist + Profile `tools` field.
- Learner-relevant: Confirms Tool completes the "actually go check weather" action of Demo 1.

### 六-把基础工具补齐到业界水准

- Locator: `[[sources/geek-ai-agent/20260922/第20节：Tool 体系 原理解析、实现与代码讲解.pdf#六-把基础工具补齐到业界水准]]`
- Summary: Compared with Claude Code/Cursor/OpenAI Assistants, five high-frequency tools were added: `edit_file` (unique old-text replacement, errors if absent or multiple — so no mis-edits), `grep` (regex content search, 200-result cap, skips binary/non-UTF8 files), `glob` (wildcard path search, same cap), `ask_user` (human-in-the-loop via a `UserInteraction` interface with Console and Unsupported implementations), and `web_search` (network, so it passes the HTTP whitelist; `SearchProvider` interface with a DuckDuckGo default).
- Key claims: These are "base tools" not "business capability", so they belong in the built-in list; adding all five only cost "write one class / register one adapter" because the Sandbox check, `tool_invocations` audit and Profile filter work automatically unchanged.
- Learner-relevant: Proves that a good abstraction keeps new-tool cost constant, and shows interface-first for `ask_user`/`web_search`.

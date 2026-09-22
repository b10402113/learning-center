---
source: 第16节：Agent Provider 原理解析、实现与代码讲解
source_type: pdf
source_lines: 417
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第16节：Agent Provider 原理解析、实现与代码讲解

## Overview (L1)

- Provider 是什么 — the LLM-facing abstraction layer of OryxOS: it selects a model by Profile and performs one call, shielding the upper ReAct loop from per-vendor API differences.
- 动手前想清楚 — narrow the responsibility (select / call / translate / audit only), reuse Spring AI Alibaba for protocol conversion, and avoid three traps.
- 代码怎么写 — one thin `ProviderService` plus `Profile` / `ProfileLoader` / `ProfileRegistry`, a tool-schema adapter, and an `llm_calls` audit path.
- 验收 harness — unit tests (mocked `ChatModel`) for routing, validation, audit, translation, plus an integration smoke test.
- 做完怎么验 — manual checks: dependency resolution, a real smoke run, no plaintext keys, harness green.

## Sections (L2)

### 一-provider-是什么

- Locator: `[[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#一-provider-是什么]]`
- Summary: Defines Provider as the "front desk" (前台) between the Agent and the LLM; the upper layer passes a Profile (config) plus a Prompt, and Provider picks the matching model and returns the raw response.
- Key claims: Provider handles model selection, one call, tool-schema translation and audit; it never executes tools (Function Calling only returns a "wants to call X" request that is handed back to the loop for ToolExecutor); swapping models is config-only.
- Learner-relevant: Anchors the Agent = LLM + Tools + Memory + Loop + Environment model by isolating the LLM "brain" behind an engineering seam.

### 二-动手前先想清楚

- Locator: `[[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#二-动手前先想清楚]]`
- Summary: Three traps: multiple providers are indistinguishable by type alone (需要显式映射表 name→ChatModel); Spring AI auto-executes tools (must be turned off so our ReActLoop/ToolExecutor keeps execution rights); example provider names (deepseek/kimi/qwen) are illustrative — verify the starter dependency exists in your locked Spring AI BOM first.
- Key claims: Build an explicit `Map<String, ChatModel>` table; set `autoExecuteTools=false`; run `mvn dependency:tree` before assuming a provider works.
- Learner-relevant: Teaches boundary-first design and the "verify before you code" habit that prevents double execution and sandbox bypass.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#三-代码怎么写]]`
- Summary: Deliver `Profile` (full record), `ProfileLoader` (scans `.oryxos/profiles/*.yaml`, validates provider exists, bad profiles log and do not block startup), `ProfileRegistry` (in-memory index), and `ProviderService.chat(sessionId, Profile, Prompt)`.
- Key claims: Config is two-layered — global `application.yaml` declares providers and credentials (from `${ENV}`), Profile YAML declares which model/temperature; a Profile referencing an unknown provider must hard-fail; audit writes `llm_calls` on both success (`success=true`) and failure (`success=false` + `error_message`), so the table needs both columns; SQLite uses hand-maintained schema scripts, not `ddl-auto=update`.
- Learner-relevant: Gives the deliverable list for Spec-Kit decomposition and the exact failure-audit contract reused by later modules.

### 四-验收-harness

- Locator: `[[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#四-验收-harness]]`
- Summary: Split by whether real network is needed: unit tests mock `ChatModel` (routing, validation, audit, translation); one `@Tag("integration")` smoke test really calls the model, skipped in CI.
- Key claims: Every "trap" named during design deserves a regression test; the three most valuable tests verify no cross-talk between two providers, that failed calls still write `success=false` audit records, and that auto-execution is off in the captured request.
- Learner-relevant: Demonstrably turns acceptance criteria into executable tests — the chapter's engineering form of "验收".

### 五-做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第16节：Agent Provider 原理解析、实现与代码讲解.pdf#五-做完怎么验]]`
- Summary: Manual checklist beyond automation: confirmed starter dependency is resolvable in the locked BOM, smoke test ran with a real key, keys only from environment (`grep -r "sk-"` finds nothing).
- Key claims: Provider has no independent entry point — it is validated by supporting Demo 1's LLM call together with ReAct.
- Learner-relevant: Sets the completion bar as "one stable successful call", deferring fallback/hedging/circuit-breaking to the extension phase.

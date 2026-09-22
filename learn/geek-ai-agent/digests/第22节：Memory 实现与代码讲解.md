---
source: 第22节：Memory 实现与代码讲解
source_type: pdf
source_lines: 610
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第22节：Memory 实现与代码讲解

## Overview (L1)

- 这节要实现什么 — a `MemoryService` facade plus a pluggable `LongTermMemoryStore` backend interface, three implementations (Markdown / SQLite / Mem0) chosen by config, session memory in SQLite, and two built-in tools.
- 动手前想清楚 — two layers (facade + backend interface); the three backends' positioning; four behavior contracts all implementations must obey.
- 代码怎么写 — facade interface, backend interface, three implementations, config-driven wiring, and `MemoryTools`.
- 验收 harness — a contract test parameterized over all three stores, plus per-implementation tests.
- 做完怎么验 — switch backends and run a dialogue; optional real Mem0; confirm no cache, no core truncation, no USER.md writes.

## Sections (L2)

### 一-这节要实现什么

- Locator: `[[sources/geek-ai-agent/20260922/第22节：Memory 实现与代码讲解.pdf#一-这节要实现什么]]`
- Summary: One `MemoryService` facade over a pluggable `LongTermMemoryStore`; core phase ships three backends (Markdown file, SQLite, Mem0) selected by config; session memory via SQLite; two built-in tools read/write long-term memory.
- Key claims: The three backends correspond to lesson 21's evolution route — Markdown phase-1 default, SQLite as structured upgrade, Mem0 as the self-hosted external-integration tier when auto-extraction/semantic retrieval is truly needed; writes always go through the Agent actively calling `save_memory`.
- Learner-relevant: Demonstrates the interface wall's value by switching from "a Markdown file" to "an external memory framework" with unchanged upper-layer code and tests.

### 二-动手前先想清楚

- Locator: `[[sources/geek-ai-agent/20260922/第22节：Memory 实现与代码讲解.pdf#二-动手前先想清楚]]`
- Summary: Layering — `MemoryService` faces up (methods fixed for PromptBuilder and MemoryTools), `LongTermMemoryStore` faces down (three implementations). Backend positioning: Markdown is phase-1 default (zero deps, human-readable, git-trackable), SQLite is the structured upgrade (thousands of entries, scope/time queries, LIMIT truncation), Mem0 is the external tier (needs a deployed Mem0 server, data stays on-prem).
- Key claims: Four contracts all backends must obey — (1) no caching, re-read every time so `save_memory` takes effect next round; (2) core memory is never truncated (only archival is); (3) scope (core/archival, default archival) is explicitly specified by the Agent; (4) recall is simple keyword matching (line scan / LIKE / Mem0 search), no regex or tokenization.
- Learner-relevant: The contract set is what makes one test suite run against all three implementations.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第22节：Memory 实现与代码讲解.pdf#三-代码怎么写]]`
- Summary: Step 1 facade `MemoryService` (`buildContext(Session)`, `remember(content, MemoryScope)`, `recall(keyword)`) and backend `LongTermMemoryStore` (`append`, `load`, `recallByKeyword`). Step 2 `MarkdownMemoryStore` with `## 核心记忆` / `## 归档记忆` sections, `MAX_ARCHIVE_CHARS=4000`, `load()` doing `Files.readString` each time, truncation applied only to the archive section. Step 3 `SqliteMemoryStore` with a hand-maintained `memory_entries` table, `MAX_ARCHIVE_ROWS=100`, core fetched in full via `findByScope("CORE")`, archive via `findRecentArchival` (LIMIT), recall via SQL LIKE. Step 4 `Mem0MemoryStore` translating `append`/`load`/`recall` into Mem0 REST calls (`/v1/memories/`, self-hosted `${MEM0_BASE_URL}`). Step 5 config `memory.backend: markdown|sqlite|mem0` and wiring. Step 6 `MemoryTools` with `save_memory`/`recall_memory`, and the PromptBuilder integration point `memoryService.buildContext(session)`.
- Key claims: In the Mem0 tier, truncation/extraction/conflict resolution are delegated to Mem0 and `Mem0MemoryStore` only does protocol translation — contract four is "upgraded" to semantic retrieval; Mem0 is an external service whose pipeline memory data flows through, so strict "data-not-leaving-domain" scenarios must self-host on the intranet; that is why Markdown is default, not Mem0.
- Learner-relevant: The concrete implementation anchors and the visible proof that changing `memory.backend` touches no code above `MemoryService`.

### 四-验收-harness

- Locator: `[[sources/geek-ai-agent/20260922/第22节：Memory 实现与代码讲解.pdf#四-验收-harness]]`
- Summary: `MemoryStoreContractTest` is parameterized over all three backends running the same assertions: write-then-immediately-read (contract 1), truncation only touches archive and core stays intact (contract 2), scope routes to the right section (contract 3), recall searches only archive (contract 4). Per-implementation tests cover Markdown string truncation/header parsing, SQLite schema/LIMIT/LIKE, and Mem0 via a mocked RestClient; `MemoryToolsTest` covers scope defaulting and a miss returning "没有找到相关记忆" without throwing; `MemoryServiceImplTest` covers `buildContext`.
- Key claims: The contract test is the most valuable design — any backend that breaks a contract goes red on its parameterized line, and you can tell which tier broke it; the Mem0 contract run uses an in-memory fake store, with real REST interactions verified in `Mem0MemoryStoreTest`.
- Learner-relevant: Shows contract testing as the automation guarantee for "interface unchanged, implementation freely swapped".

### 五-做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第22节：Memory 实现与代码讲解.pdf#五-做完怎么验]]`
- Summary: Manual checks: switch `memory.backend` between markdown/sqlite and run the same dialogue to feel the identical experience on a different backend; optionally deploy self-hosted Mem0 and verify `save_memory` enters it and `recall` semantically retrieves; run a real model dialogue where the Agent calls `save_memory`, then open a new session and see core memory in the system prompt; confirm `USER.md` is read-only and only MEMORY.md/SQLite/Mem0 are writable.
- Key claims: This completes "will think (ReAct), will act (Tool), remembers (Memory)" and enables Demo 2's "daily tech digest reflects user preferences".
- Learner-relevant: The final human-verification path and the USER.md/MEMORY.md role distinction.

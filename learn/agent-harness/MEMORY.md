---
subject: agent-harness
language: zh-Hant
created: 2026-09-15
updated: 2026-09-15
---

# MEMORY — agent-harness

## Goal

用 TypeScript 從零打造並掌握一個持久化的 agent harness，逐一補上每個能力——durable execution、sandbox/code mode、memory compaction、handoff、階層式監督 sub-agents、durable human-in-the-loop——不只跑得起來，還能擴充它。真正的收穫是能把同一套模式在自己的 runtime（OryxOS / Java）上重新推導，而不只是讀懂 TS 版；並附帶長出 harness 判斷力：看到一個 agent 產品或故障，能說出需要哪一層 harness、何時該自建、何時用 Claude Code。

## Why

補完整 agentic engineering 的技術棧。工作流層（SDD + Harness）與認知層都學過了，缺的正是 runtime 層：持久化、沙箱、記憶、監督——這層讓「一個人交付遠超一個人的事」從口號變成可運作的系統。同時服務 OryxOS 野心：把 harness 能力帶回自己的 Agent OS。把這層動機講明白，才撐得過 DBOS / Neon 的環境設定摩擦。

## Prior experience

- TypeScript / React / Node 熟悉——本主題的主場，可直接進真實程式碼。
- 操作過 Postgres（其他主題的實務經驗）。
- LangGraph 多節點 agent + SSE 串流（llm-project 動手做過）。
- 規劃/打造過自寫 ReAct loop 的 Agent OS（OryxOS，JDK 21 + Spring Boot）。
- 分散式持久化概念（design-data-intensive-applications）：event log、冪等、exactly-once、一致性——讀過。
- 新領域，當新知識帶、不教 basics：Vercel AI SDK（`streamText` / `generateObject` / `tool()`）、DBOS 等持久化執行引擎、Drizzle ORM、`node:vm` / 沙箱 / code mode。

## Anchors

- OryxOS 自己寫的 ReAct loop——harness 正是包在它外面的那層；每個能力都可對照「我的 loop 缺這層會怎樣」。
- 日常使用 opencode / Claude Code——你本身就是一個具備 auto-compaction、sub-agent、approval 的 harness 的重度使用者，可從「使用者的體感」反推「內部怎麼做」。
- geek-ai-agent 的 SDD + Harness——工作流層的 harness 概念，與 runtime 層的 harness 相互對照。
- design-data-intensive-applications——event log、冪等、exactly-once 可直接掛上 DBOS step 與 durable bus。
- llm-project 的 LangGraph 節點圖 + SSE 串流——可對照單 agent loop、supervisor 的 plan→dispatch→fan-in。
- 課程 repo 的 inspector——event log 是系統的真相；每個能力的成果都用同一條 event stream 驗證。

## Habits & constraints

- 每週 2–3 小時，週末或晚間長段；無硬性 deadline，中等壓力。
- 環境：本機 Mac + Node，能跑課程 repo 的 `npm run dev`（server + inspector）。
- Postgres：Neon 免費 DB（`DATABASE_URL` 需拔掉 `-pooler`）或本機 Postgres 皆可。
- 沙箱只用本機 `node:vm`；暫不接 e2b / Cloudflare 等托管沙箱——留到真的部署 OryxOS 時再談。

## Knowledge type

mixed，以 procedural 為主。核心是「會做且能重複地建出這套 runtime」——把 side effect 包成 step、寫 workflow、接 sandbox、寫 compaction、做 handoff。declarative 概念（durability、冪等、token 預算、控制權轉移的語意）在「做的過程」裡講，不單獨空談理論。

## How to teach me

- 每個能力先給完整實跑：壞掉的最小 agent → 觀察到什麼故障 → harness 補上哪一層 → 貼 code → 看 inspector 的 event log，再讓我上手改。
- 簡潔、密度高、不要廢話；不耐冗長鋪陳。
- 跳過工具安裝與 basics（TS 已熟）；只講新 API（DBOS / AI SDK / Drizzle）的最小用法。
- 用「為什麼這層存在」的機制講解，幫我記住「怎麼做」。
- 每步結尾落在「真的能跑或真的能決定」的事上。
- 輸出語言 zh-Hant；程式碼、識別字、API 名稱保持英文。

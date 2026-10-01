---
subject: jsm-skills
language: zh-Hant
created: 2026-10-01
updated: 2026-10-01
---

# MEMORY — jsm-skills

## Goal

把整套 JSM 工程階段流程真正用在自己的專案上：從一個想法走到出貨，能在真實 repo 上跑 `scope → audit → architect → develop → check verify → test → check review → document → sync`（`debug` 隨時）。終點是「遇到狀況就立刻知道下一步該跑哪個 skill、該做哪個決定」，而不是只讀懂這套系統——尤其要補上「卡住時不知道用哪個 skill」與「git / commit 時機」這兩塊。

## Why

想讓 AI 蓋的功能**會複利、而不是腐化**。現在是一個功能接一個功能地生，越加越難改、東西默默壞掉、決策只存在對話裡；要的是把「計畫先行、決策當面做、狀態放檔案」這套紀律裝回自己的開發流程，讓每多一個功能是資產而非負債。學習卡住時（環境摩擦、agent 亂搞）靠這股動機撐著往前走。

## Prior experience

- TS / React / Node 熟練——主場，可直接進真實程式碼，不需 basics。
- Claude Code / opencode 重度使用者；本 repo 就是一堆 skill 的家，對 skill 生態不陌生。
- 學過 SDD + harness（`geek-ai-agent`、`agent-harness`），自己設計過 OryxOS 的 ReAct loop（Java / Spring）。
- 已有一套 `grill → spec → tickets → implement → review` 流程——本主題要**對照**，不是從零學。
- 這套 JSM skill：**用過一點**（至少跑過 `scope`、看過 `docs/scope/index.md`），但**很多地方不懂**——當「用過但沒串起來的初學者」帶。

## Anchors

- 自己的 **greenfield 專案**——全新、沒有既有程式碼，正好走 `/scope → /architect → scaffold → /audit →` feature loop。這是實作場。
- 痛點一：**常常卡在「不知道下一步要做什麼」**——對應「情境 → 該跑哪個 skill」的決策地圖（orchestration）。
- 痛點二：**看不懂為什麼 `docs/scope/index.md` 有時候沒打勾**——對應 scope 的 milestone 語意：`develop` 只前進、不勾完；built ≠ verified；`/scope`（bare）與 `/sync` 才會 reconcile 回真實狀態。
- opencode 的日常使用——檔案狀態工作流的體感，可反推「為何狀態要放檔案而不是留在對話」。
- 現有的 `grill → spec → tickets → implement → review` 流程——與這套逐一對照（grill ↔ architect 的決策訪談、spec ↔ spec、tickets ↔ scope、review ↔ check review、implement ↔ develop + check verify + test）。

## Habits & constraints

- 每週 1–3 小時，時間破碎、不固定；長段落在週末或晚間。
- Mac 環境；主場是 **opencode**（不是 Claude Code）。
- 打算用 `npx skills add JavaScript-Mastery-Pro/skills` 安裝來實跑；需處理 opencode 的落地位置（`.opencode/skills` 或代理）與 Claude Code 預設路徑的差異。
- arena build-along 只當示意——**不重現**它的付費 stack（Next.js 16 / Prisma / Clerk / OpenRouter / Vercel）。

## Knowledge type

mixed，**procedural 為主**。核心是「會做、能重複地跑」——跑 scope、寫 spec、過 develop 的閘門、verify、決定 commit 時機；declarative（擁有權模型、spec 生命週期 `Proposed`/`In Progress`/`Accepted`/`Assumed`/`Superseded`、acceptance-criteria 主線、閘門為何存在）是支撐判斷力的背景，要在操作脈絡裡講，不空談。

## How to teach me

- 先看一遍**完整實跑**（從想法到出貨，在真實 repo 上），再上手做；每個能力先給「壞掉／卡住的最小情境 → 這套補上哪一層 → 實際跑一次」，再讓我改。
- 簡潔、密度高、不要廢話；不耐冗長鋪陳。
- 跳過安裝與 basics（TS / React / Node 已熟）；只講這套 skill 特有的東西（ownership、gate、spec 狀態、檔案狀態的交接）。
- 用「為什麼這層存在」的機制講解，幫我記住「怎麼做」。
- 每步結尾落在「真的能跑」或「你真的做了一個決定」上。
- 用測驗／追問驗收，不用講課。
- 輸出語言 `zh-Hant`；程式碼、識別字、API、CLI 指令、skill 名稱（`/scope`…）保持英文。

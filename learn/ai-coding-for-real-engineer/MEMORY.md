---
subject: ai-coding-for-real-engineer
language: zh-Hant
created: 2026-10-01
updated: 2026-10-01
---

# MEMORY — ai-coding-for-real-engineer

## Goal
用 **AFK（away-from-keyboard）自走 agent 出貨功能**：把一個沙箱化的 coding agent 接上任務佇列（GitHub issue backlog），讓它無人值守地完成功能與修 bug，人在規劃與審查的閘門做判斷。最終能在自己的 side project 上端到端跑完整套流程，而不只是叫 agent 改零碎小東西。

## Why
**一人當一個團隊，大幅提升出貨速度。** 想把自己從「一次只能做一件事」放大成能平行推進多條工作線；AFK agent 是達成這件事的槓桿。

## Prior experience
- 全端 / 後端為主，日常寫 TypeScript / Node，能跟上課程的 TS 全端 repo。
- 用過 coding agent（Claude Code / Cursor / Copilot 類），但多停在「叫它改一個小東西」的層次。
- 還沒建過 skill、subagent、AFK 流程這類系統化用法 — 這正是本主題要補的斷層。

## Anchors
- 自己的 side project（TS/Node 全端），可自由實驗、拆開跑自走流程、建立 issue backlog。
- 前端：React / Next.js。
- 後端：Node（Express / Fastify / Hono / Nest 類）。
- 資料：關聯式 DB + ORM（Postgres/MySQL + Prisma/Drizzle 類）— 對應課程的 schema/migration 與「agent 常忘記跑 migrate」。
- 測試：Vitest / Jest / Playwright — 對應課程的 feedback loops 與 red-green-refactor。
- GitHub + CI/CD — 對應 issue 驅動的 AFK 佇列、PR、Actions。
- 容器 / 部署（Docker、Vercel、Fly 類）— 對應 Sandcastle 沙箱。
- 環境：macOS，有 Docker 可用。

## Habits & constraints
- 每週約 6–10 小時（一晚加週末零碎時間）。
- 在 macOS 上開發，具備容器環境。

## Knowledge type
procedural 主導、混合 declarative。核心是「練會一套做法」（grill → research → prototype → PRD → issues → implement → review，以及搭 AFK 流程、寫 skill、設回饋迴圈）；底下有一層必須理解的觀念（context window、smart/dumb zone、agent 非決定性、progressive disclosure、tracer bullet、deep module），不理解觀念就做不順。

## How to teach me
- **直接在真實 side project 上動手做任務** — 每個概念都綁到實際操作，不要純讀。
- **看真實 demo／操作拆解** — 一邊操作一邊解釋背後原因。
- **先建立大圖再往下鑽** — 先讓我知道整體在做什麼、各階段如何相扣，再進入細節。
- 因為目標偏 procedural，章節要能被「照著做」並在專案上驗證；觀念只講到足以支撐決策的深度即可。

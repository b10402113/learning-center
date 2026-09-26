---
subject: vibe-coding-fengjianyingyue
language: zh-Hant
created: 2026-09-26
updated: 2026-09-26
---

# MEMORY — vibe-coding-fengjianyingyue

## Goal

能只用白話提示詞，把任何產品點子從一句話推進到「可交付的完整產品」——走完 PRD → UI 原型 → 前端 + 後端 + DB → 企業級後端 → 後台 → 跨端 App → 測試 → 交付 → 內容運營 → 資料視覺化 → 文案推廣。真正要拿到的是一個**可重複的 12 階段 playbook**（以角色分資料夾的專案骨架 + `AGENTS.md`/`CLAUDE.md` 設定 + 一組提示詞模板），能直接搬到自己的產品上。並長出判斷力：什麼時候該用白話 vibe coding 快跑、什麼時候該升級成工程級的 spec 流程。

## Why

一人產品工作室的吞吐量動機——一個人交付遠超一個人的事。工程那半邊你已經有（`ai-coding-for-real-engineer` 的 SDD、`geek-ai-agent` 的 OryxOS 交付），缺的是**非工程的 70%**：UI 生成、資料庫、後台、跨端 App、QA、上線、行銷。這門補上「整包產品」的廣度，讓點子真的能變成能賣、能推廣的成品。

## Prior experience

- **已會（不重教）**：Claude Code / opencode 重度使用；Java 21 / Spring Boot / Maven（OryxOS、geek-ai-agent）；Node / Express；MySQL；git；前端 HTML/CSS/JS 與 Vue；獨自做過全端專案。
- **要教**：uni-app 框架本身（Vue 語法已熟，差在 `uni.request`、`pages.json`、`manifest.json`、跨端／跨瀏覽器差異）；Google Stitch / AI 生成 UI；MyBatis 細節；這套「白話驅動全生命週期」的流程與提示詞工藝。
- 已有工程級流程對照：`ai-coding-for-real-engineer`（grill → spec → tickets → implement → review）、`geek-ai-agent`（SDD + Harness + Loop）。

## Anchors

- **要開發的產品：一個知識視頻生成 agent**（素材進 → HTML slides/articles → 全動畫知識影片出）。這是本課的實作載體，也是與 `ai-html`、`faceless-explainer` / `hyperframes` 的接點——用財務管家的 12 階段 playbook 去推自己的這條產線。
- **OryxOS（Java / Spring Boot）**——直接對照 005 的企業級後端重寫，以及「agent 平台」如何再長出「全產品交付」。
- **每天用的 Claude Code / opencode**——從使用者的體感反推提示詞工藝：`AGENTS.md`/`CLAUDE.md` 怎麼寫、MCP 怎麼接、怎麼讓 agent 不亂搞。
- **`ai-coding-for-real-engineer` 的 SDD 流程**——持續對照：vibe coding 何時夠用、何時必須升級成規格化流程。
- **公司 Java 平台**——playbook 最終要搬回去的地方。
- **財務管家案例本身**——每個階段的容器與示範，皆可對照「我自己的知識視頻 agent 這階段會長怎樣」。

## Habits & constraints

- 每週 1–3 小時，且碎片化；長段落在週末或晚間。
- Mac 環境；能跑 Node、Java/Spring、MySQL；可自行安裝 uni-app 相關工具。
- 無硬性 deadline，中等壓力。
- 做法：每階段「先讀案例 → 再做小重現」，不是整包複製財務管家。

## Knowledge type

mixed，**procedural 為主**。核心是「會做、能複製」的交付能力（跑一個階段、寫一組提示詞、產出可跑的東西）；declarative 部分（12 階段各自的目的、何時選哪個技術棧、提示詞模式的分類、AI 生成碼的典型失敗模式與風險）在「做的脈絡」裡講，不空談理論。

## How to teach me

- 每個階段先給**完整實跑**：提示詞 → agent 行為 → 產出，再讓我上手小重現。
- 密度高、不鋪陳、**跳過 Java / Spring / Node / 前端 basics 與工具安裝**；只講新東西（uni-app、MyBatis、Stitch、這套流程）的最小用法。
- 用「**為什麼這層存在**」的機制講解（為什麼要按角色分資料夾、為什麼 icon ligature 會跑版、為什麼 AI 寫的測試會假綠），幫我記住「怎麼做」。
- 每篇要能**碎片化讀完**，結尾落在「真的能跑或真的能決定」的事上。
- 特別標記 AI 生成碼的**失敗模式與風險**（假綠測試、截斷／硬編碼、跨端漂移、敏感資訊外洩），練成判斷力。
- 輸出語言 **zh-Hant**；程式碼、識別字、API 名稱保持英文。

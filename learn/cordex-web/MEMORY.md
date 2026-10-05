---
subject: cordex-web
language: zh-Hant
created: 2026-10-04
updated: 2026-10-04
---

# MEMORY — cordex-web

## Goal
用 Codex 端到端出貨真實的 web 專案。具體終點：能指著一個真實 web 專案，讓 Codex 帶你走完 idea → 部署 → 驗證；前端要能用 prompt／視覺範例生出並部署到 ChatGPT Sites，全端要能用 Codex 在真實專案上做出含並發、即時、佇列、付款、可觀測性的功能。附帶產出「判斷力」：能講清楚什麼時候該用 Codex、什麼時候用 Claude Code。兩門課都要完整做，不是只挑一門。

## Why
讓 Codex 成為**可靠的第二個 harness**——把它的前端／Sites／browser-goal 工作流摸透到能刻意選它，而不是被 Claude 綁死；並用它把已經在付的 ChatGPT 訂閱用得更兇，出自己想要的 web side project。這條動機撐得住後面遇到 Sites 範圍、permission mode、token 帳單等摩擦。底層延續其他主題那條「一人當一個團隊」的主線。

## Prior experience
- 全端／後端為主，日常寫 TypeScript / Node，前端 React / Next.js——兩門課的棧都是主場。
- 已深度使用 Claude Code / opencode，agent 體感熟：approval、sub-agent、skill、hook、worktree、MCP。
- 自寫過 OryxOS 的 ReAct loop，並打造過 TypeScript agent harness——harness／context 管理這層不用教。
- 讀過／做過 DDIA（冪等、event log）、LangGraph 多節點 agent；Docker 可用。
- **Codex 本身偏淺**：裝了桌面版、開過 browser／computer-use／visualize plugin、有 `frontend-design` plugin、用過 `/goal`、裝過 skill，但沒用 Codex 認真跑過一個專案。Codex 專屬的東西算新知。
- 未做過：ChatGPT Sites 部署、以 Codex 為主的視覺範例 prompt、browser/CDP 除錯迴圈、execplans。

## Anchors
- 課程 companion repo 是 ground truth：`master-dev-workshop`（user-insights／BlossomView 前端）與 `master-dot-dev-codex-course-live`（拍賣 app，附 GRILL.md、codex-logs 可看 Codex 的推理過程）。
- 自己的 web side project——練習場（尚未指名具體專案；練習時再定，用來把課程手法搬回去）。
- 既有 TS / Node 全端棧（React / Next 前端、Node 後端、關聯式 DB + migration）——對應拍賣課的 schema、並發、API。
- 既有 agent harness 經驗——對照 Codex 的 harness 行為、plan mode、`/goal`、sub-agents。
- 日常 Claude Code / opencode 使用——從「使用者的體感」反推 Codex 的差異與優劣。
- 機器上實際的 Codex 安裝（`~/.codex`）——plugin、skill、goal、computer-use 都摸得到、可直接對照。

## Habits & constraints
- 每週 1–3 小時，時間零碎；長段落在週末或晚間。
- 環境：Mac；有 Docker，願意跑全端課的 Postgres／Redis／RabbitMQ／Jaeger（或只挑切片跑）。
- 無硬性 deadline，中等壓力。
- 每篇要能一次讀完、可隨時中斷再繼續。

## Knowledge type
mixed，**procedural 為主**。核心是「會操作、能自己出貨」——下 prompt、跑 plan mode、下 `/goal`、寫 skill／AGENTS.md、用 browser 除錯、把功能推到部署。declarative 那層（何時用哪個介面／模型 / reasoning effort、permission mode、plan vs grill、context 管理、何時該放手讓它自走）是支撐判斷力的背景，在操作的脈絡裡講，不空談。

## How to teach me
- **先講「這解掉什麼問題」再進核心**；不要一開頭丟定義或結論，不要名詞轟炸。
- **每個概念先給完整實跑**：真實情境 → 在 Codex 上怎麼操作 → 產出什麼 → 我照著做一次小重現。
- **跳過通用 agentic 基礎**（context window、harness、context 管理、sub-agent 概念）；**深教 Codex 專屬**（surface／模型／effort、permission mode、plan mode vs grill、`/goal`、skills 與 AGENTS.md、browser／CDP 除錯迴圈、execplans、ChatGPT Sites）。
- 簡潔、密度高、不要廢話；不耐冗長鋪陳。
- 用「為什麼要這樣設計」的機制講解，幫我記住「怎麼做」。
- 每篇能**碎片化讀完**，結尾落在「真的做得出一個東西或真的能決定一件事」上。
- 輸出語言 **zh-Hant**；程式碼、識別字、API 名稱與產品名稱保持英文。

## Sources
- `codex`——Agentic Frontend Development with Codex（Katia/OpenAI）transcripts + `master-dev-workshop` repo。
- `fullstack-app-codex`——Fullstack App with Codex（Spencer）transcripts + `master-dot-dev-codex-course-live` 拍賣 app repo。

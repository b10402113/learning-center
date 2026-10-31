---
subject: claude-code-master
language: zh-Hant
created: 2026-10-31
updated: 2026-10-31
---

# MEMORY — claude-code-master

## Goal

照課程順序 A → G 完整走一遍，把四層 ARMS（Apps、Routines、Memory、Skills）裝進自己的 workspace，而不是再懂一次名詞。

驗收判準是「重複工作真的被自動化」：至少一條 routine 在排程上自己跑、產出自己真的會用；一個 skill 會自己觸發而不是每次手打；memory 大到能被檢索而不是塞在一個長檔；一個原本沒有 connector 的 app 接得上；最後用 design system 做出一個真的上線的網站。

## Why

重複工作現在還是手動做：固定時間整理資料、寫摘要、產內容、巡檢專案狀態。skills 與 memory 的知識已經有了（agent-harness2、background-agents、agentic-engineer、real-agent 都碰過），缺的是把它們裝成一個每天在跑的工作區——知識停在「知道可以這樣做」，沒有變成「它已經在幫我做」。

## Prior experience

- TypeScript／Node.js、macOS；Claude Code 每天在用（VS Code extension 為主，terminal 为辅）。
- 自己寫過 `/last30days`、`/robo` 這類 skill，知道 name／description 觸發與 lazy-loaded body；也用過 `.agents/skills/`、`.opencode/skills/`。
- 分層 memory 已經在用：`learning-center` 每個科目一份 `MEMORY.md` 指向其他檔案，不是單一長檔。
- 走過 agent-harness2（context hydration／compaction、subagent）、background-agents（durable runtime、排程與喚醒）、agentic-engineer（scope／ADR／verify）、real-agent（跨 session 的 ticket 與 glossary）。
- 讀過 MCP／API／CLI 的差別與 token 成本，但沒有實際把一個沒有官方 connector 的 app 接起來過。
- 沒做過：Volume F 的 design system → 建站 → 部署流程、micro apps、Modal 的 deterministic routine、cloud routine。

## Anchors

- `learning-center` 這個 repo 就是現成的 workspace／second brain：`sources/` → `digests/` → `nodes/` → `articles/`，正是課程講的「context 就是你的 workspace」。
- 自己寫的 `/last30days`、`/robo` ↔ 課程的 `/align`、`/calibrate`、`/tweak`：同一個 skill 機制，差在有沒有接進 routine。
- 「每個禮拜都手動整理一次資料、寫一份摘要」→ local／cloud routine 與「routine 建議 routine」那幾課。
- 「skills 越長越多，context 一開就吃掉兩三萬 token」→ `/context`、`/usage`、skill 審計與 model routing。
- 「重開一個 session 就變笨」→ CLAUDE.md／MEMORY.md／prompt cache 的壽命與 compaction。
- 「有一個 app 沒有 MCP，只好手動複製貼上」→ CLI、Printing Press、HAR 抓真實 API 那條路。
- 「網站只有本機預覽，沒有網址可以給人看」→ Craft 五階段與 Vercel 部署。
- kubernetes 的 desired state ↔ routine 的排程：同一種「宣告一次，之後自己收斂」。
- Claude Code 的 auto-compact、`/init`、`/memory`、approve 提示 → 課程正在拆解的那些介面。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次（沿用既有節奏）。
- macOS；VS Code extension + terminal，可同時開多個 session。
- 願意排真的 routine（Desktop app 要在開機狀態）、開 Modal 免費額度、Vercel／Resend 免費帳號；有 GitHub repo 可以放雲端 routine 的 skills。
- 一次一小段，能跑起來比讀完更重要；跑不起來時接受先照抄可運作版本再回頭拆。
- 名詞保留英文（skill、memory、routine、context、connector、MCP、CLI、design system），不硬翻。

## Knowledge type

mixed，但**程序性主導**。事實（方案價格、模型層級、每個模式的差別）只學到夠用；重心是判斷——什麼時候該把一段 prompt 存成 skill、什麼該留在 memory、哪種 routine 該用 local／cloud／deterministic、什麼時候該換連接方式、什麼時候該開新 session。

## How to teach me

- 先看失敗長相，再學機制：routine 沒跑、skill 沒被觸發、context 爆掉、部署失敗、connector 權限不足。
- 每個抽象立刻綁到一個檔案、一個指令或一次 `/context` 輸出；不要停在「它會自動幫你」。
- 每個 node 留一個「弄壞它」的動作：把 routine 時間改壞、把 skill description 拿掉、把 memory 塞爆、把 connector 的 scope 收窄。
- 已經走過的概念（skills 的觸發、memory 兩層、durable routine）一句話帶過，篇幅留給沒實作過的部分：Apps 的 connector 選擇、Volume F 的建站流程、Agentic OS 的三個等級。
- 照課程順序走，但每個 node 要能回答「這一段做完，我的 workspace 多了什麼」。
- 不喜歡：名詞堆疊、沒有前因後果的功能清單、被要求先學完理論再動手。

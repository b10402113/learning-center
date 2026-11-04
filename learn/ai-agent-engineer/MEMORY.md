---
subject: ai-agent-engineer
language: zh-Hant
created: 2026-11-03
updated: 2026-11-03
---

# MEMORY — ai-agent-engineer

## Goal

在自己的 repo 上，把這門課的七層（model、prompt、context、harness、memory、loop、boundary）逐一補起來，最後在自有機器上跑一個 24/7 的 AI employee：專用 inbox、rootless Docker sandbox、skills 與 hooks、MCP server、共用的第二個大腦、fallback chain、cron bug loop，以及晨間 PR triage。

判準不是「再做一次課程 demo」，而是能指著每一層說出「拿掉它會怎麼壞」，並且真的讓那個 employee 開出一個可 review 的 PR：綠色 CI、有失敗測試先重現、沒有 merge、diff 裡沒有新的網路呼叫或跳過的測試。

第二個判準：對 durable execution、sandbox、routines 這三塊，能從空白說出「狀態在哪、誰負責重跑、邊界畫在哪、排程怎麼 claim」，而不是只認得名詞。

## Why

零件已經有了，但還不能組成一個敢放著跑的營運單位。agent-harness2 給了 harness 與 durable 的心智模型，background-agents 走過 Inngest 的 step／event／retry，agentic-engineer 給了 scope／review 的流程，claude-code-master 走過 skills、memory、routines。問題是這三塊——durable execution、sandbox、routines——自認還不熟：看得懂，關掉檔案給一張白紙卻拼不出來。

這門課的價值在於它把「一個 agent 跑一次」推到「一個 employee 跑 24/7」：boundary 先畫好（box、sandbox、allowlist），loop 才有意義；routines 與 cron 讓它不必由你啟動；memory 讓它記得你上次否決了什麼；review 工程讓你不必逐行讀它開的 PR。想要的是「跑起來之後還敢讓它跑」，不是再多一個示範。

## Prior experience

- TypeScript／Node.js，讀得懂 Next.js 與 React；基本 SQL 與 Postgres；macOS。
- agent-harness2：agent = LLM + harness、durable event log、副作用包進 step、context hydration／compaction、handoff 與 supervision、human-in-the-loop approval。
- background-agents：Inngest 的 step／event／retry、run 生命週期、安全重試與 idempotency。**但這塊仍不熟：能認得，不能從空白重建。**
- agentic-engineer：scope／spec／ADR、skills、MCP 與 CLI 的分界、review 與 verify gate、以 acceptance criteria 驅動驗收。
- claude-code-master：skills 的 name／description 觸發、CLAUDE.md／MEMORY.md、三種 routines、MCP 與 CLI、權限模式。**routines 只到「用過」，不到「自己設計 claim、重試、去重」。**
- real-agent：grilling ticket、ADR、PR skill、/code-review。
- 沒做過或只碰過表面：自己建 MCP server（每人一把 key、scope、deep link）、mutation／property／QuickE2E、PR Tour／PR Triage、prompt injection 的 lethal trifecta 防線、Hermes 與 host／sandbox 分層、sandbox 的設計與營運。

## Anchors

- `learning-center` 這個 repo 本身：一堆 node／step 由 agent 產出，是「預設漂出來 vs 被決定」的現成對照。
- TicketBay：售票 app、`./box`、CI gate、MCP server，這門課的每個例子都在這裡；退款與已開演場次是最直接的失敗長相。
- `./box` 的 `Dockerfile`、`devcontainer.json`、`init-firewall.sh`：sandbox 不是提示詞，是檔案與網路層。
- `AGENTS.md` 裡「測試只能透過公開 API、不能 mock 領域層」：instruction file 的兩個測試（agent 查不到、全 repo 成立）。
- 「退款手續費 2%，promoters 已同意，未經他們同意不得更改」：memory 要放的是程式碼看不出來的商業脈絡。
- 客訴 email：loop 的 untrusted input，與你的指令在同一個 window 裡。
- 「測試全綠，但 refund 對已開演的場次仍成功」：verification 的起點。
- 「agent 開的 PR 是往年的十倍」：review tax 與 PR Triage 的風險排序。
- 「Anthropic 的權限提示 93% 被核准」：boundary 不能靠 approval。
- 你自己的 Mac 與一台可 24/7 的機器（VPS 或備用機）：Hermes 的實際落地點。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次。
- macOS；願意開 Docker／Colima、一台 24/7 機器、OpenRouter key、GitHub 與 Discord。
- 課程 repo 有 lesson 分支；切換前要 commit 或另開分支，這個紀律一開始就要講清楚。
- 一次一小段，能跑起來比讀完更重要；跑不起來時接受先照抄可運作版本，再回頭拆。
- 已會的主題（harness 心智模型、skills 基本操作、CLAUDE.md、context／compaction、基本 review 流程）不重教，只留回顧與連接口。

## Knowledge type

mixed，但**程序性主導**。事實（有哪些 hook、每個參數、指令長相）只學到能跑；重心是判斷——sandbox 邊界畫在哪、什麼時候該建 loop、哪個測試替身才誠實、哪個 PR 該先讀、哪個決策要寫進 brain、哪個動作要留 approval。

## How to teach me

- 先看失敗長相，再學機制：重複扣款、context 爆掉、測試全綠卻退款成功、prompt injection 把 key 送出去、24/7 employee 卡在無人可回答的 approval。
- 每個抽象立刻綁到一個檔案、一個函式、一次錯誤訊息（`src/domain/refund.ts`、`box`、`init-firewall.sh`、`guard-network.sh`、`SOUL.md`）。
- 每個節點都要有「弄壞它」的動作：關掉 firewalls、讓測試 red、餵一封攻擊信、把 fallback 主模型切斷、讓 cron 重複 claim 同一封信。
- durable execution 一律拿 agent-harness2／background-agents 的版本對照，說清楚「同一件事在這門課的 loop 與 employee 長什麼樣、書沒有回答的那一段是什麼」。
- 名詞保留英文（harness、sandbox、routine、durable execution、mutation、property、gate、triage），不要硬翻；不要名詞堆疊、不要沒有前因後果的功能清單。
- 不熟的 durable execution、sandbox、routines 放慢、放多步；已會的部分快速帶過。

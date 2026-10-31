---
subject: agent-harness2
language: zh-Hant
created: 2026-10-29
updated: 2026-10-29
---

# MEMORY — agent-harness2

## Goal

用 DBOS + Postgres + Vercel AI SDK，從空白檔把這套 harness 重寫一遍：durable event log、可重放的 workflow、harness 自己執行的工具、`node:vm` sandbox 與 code mode、token 預算的 context hydration 與 compaction、agent handoff、plan-driven supervisor 平行 fan-out、DBOS 暫停式 approval。

判準是能指著每一層說出「拿掉它會怎麼壞」：斷線後狀態在哪、重跑時哪一行不會重打 LLM、重複的 tool 副作用被誰擋下、context 爆掉前誰先壓縮、哪個 agent 根本沒有 `issueRefund`、approval 卡住時 compute 停在哪。

完成後把同一套骨架搬進自己的專案，跑一個真實場景的 agent，而不是再留一個課程 demo。

## Why

看懂了但寫不出來。agent-harness 給了控制面／狀態面／執行面／context 面的心智模型，background-agents 用 Inngest 跑過一次 durable runtime，但把檔案關掉、給我一個空白的 `runtime.ts`，我拼不出 event log → step → workflow 的順序。

也想要一個自己擁有的 durable 層。Inngest 是別人的服務，DBOS 是把 checkpoint 寫進我的 Postgres，出問題時我能直接查表、看 `seq`、看哪個 step 重跑了。這門課剛好是那個版本。

## Prior experience

- TypeScript／Node.js，讀得懂 Express 與 React；基本 SQL 與 Postgres。
- 走過 agent-harness：agent = LLM + harness，memory／tools／long-running 屬於 harness。
- 走過 background-agents：Inngest 的 step、event、重試、Neon Postgres、inbox 式喚醒；知道 checkpoint、replay、idempotency 在講什麼。
- Vercel AI SDK 只到「會呼叫 `streamText`」的程度；沒用過 `generateObject` 的 schema-backed 輸出。
- 沒寫過 sandbox（`vm`、timeout、注入 API），沒做過 supervisor 的平行 fan-out 與 partial failure 處理。
- 沒用過 DBOS。

## Anchors

- Inngest 的 `step.run` ↔ DBOS 的 `runStep`：同一個「把副作用包起來」的動作，換一套 API 與資料表。
- 「服務重啟，記憶體裡的 messages 不見」→ 為什麼 event log 是真相來源、為什麼要 `history` replay。
- 「重新整理就多送一封信」→ `sendReply` 這種不可逆工具為什麼必須在 step 裡、為什麼要 approval。
- 「PR 要人 approve 才能 merge」→ `issueRefund` 的 `DBOS.recv` 暫停與 `DBOS.send` 恢復。
- 「session 聊久了就變笨」→ 為什麼 context 要每次即時組裝、為什麼 compaction 要以 turn 為單位。
- 「叫模型心算退款金額會算錯」→ code mode：讓模型寫程式，harness 負責給它一個邊界。
- 「一個 agent 什麼都做，權限也全都給」→ handoff 與 tool set 就是權限設計。
- Claude Code 的 auto-compact、sub-agent、approve 提示 → 對照這門課自己把那層寫出來。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次。
- 願意開 Neon 免費 Postgres、用現有 OpenAI key；可同時開三個 terminal。
- 課程 repo 是 lesson branch：切換前要 commit 或另開分支，這個紀律要一開始就講清楚。
- 一次一小段，能跑起來比讀完更重要；跑不起來時接受先照抄可運作版本再回頭拆。

## Knowledge type

mixed，但**程序性主導**。DBOS／AI SDK 的 API 形狀只學到能跑；重心是工程判斷——什麼該包進 step、什麼必須留在 deterministic 的 workflow 主體、沙箱邊界該畫在哪、什麼時候該壓縮 context、哪個動作要 handoff、哪個要 approval。

## How to teach me

- 先看失敗長相，再學機制：重複扣款、重送信、context 爆掉、斷線後從頭跑。
- 每個抽象立刻綁到一個檔案、一個函式、一次錯誤訊息（`harness/runtime.ts` 的 `toolStep`、`DBOS.recv` 卡住的那一行）。
- 每個節點都要有「弄壞它」的動作：殺掉 server 再重啟、讓 sub-agent 失敗、把 timeout 關掉、把 token 門檻調低。
- durable 概念一律拿 Inngest 版對照，說清楚「同一件事在兩邊長什麼樣、DBOS 多做了什麼」。
- 不喜歡：名詞堆疊、沒有前因後果的機制清單、先學完理論才准動手。

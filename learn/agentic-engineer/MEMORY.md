---
subject: agentic-engineer
language: zh-Hant
created: 2026-10-30
updated: 2026-10-30
---

# MEMORY — agentic-engineer

## Goal

能在自己的 repo 上，從一句想法或一個 issue 出發，自己跑完整條 `scope → architect → develop → check → test → document → sync`，並且能指著每一個 gate 說出「拿掉它會怎麼壞」。

完成的判準不是「做出一個 demo」，而是交出一個 slice 加上它留下的決策痕跡：scope 裡的 `Done when`、ADR 的 trade-off、`verify.md` 的 PASS/FAIL 與證據、review 的 ranked findings、從真實 diff 寫出來的 PR 描述。

第二個判準：讀任何一個 agent 寫的 codebase，能分辨哪些地方是**被決定的**，哪些是**預設漂出來的**。

## Why

我已經會叫 agent 寫程式，也走過 agent 的底層（agent-harness2 的 durable loop、background-agents 的 Inngest runtime、claude-code-master 的 skills 與 routines）。缺的是中間那一層工程判斷：決策沒有先寫下來，驗收沒有證據，程式碼長成「誰都可以改、但沒人知道為什麼」。

這門課的立場正好相反於「換更強的模型」：差別不在模型，在誰做決定、決定有沒有留下來。Vibe build 當場就能跑、還能 demo，壞在 demo 之後——成本、漂移、以及每個人都說不出某一行為什麼存在。

## Prior experience

- TypeScript／Node.js，讀得懂 Express 與 React；基本 SQL 與 Postgres。macOS，能裝套件、開免費 Supabase。
- agent-harness2：agent = LLM + harness、durable event log、context hydration 與 compaction、subagent 與 handoff。
- background-agents：Inngest step／event／重試、checkpoint 與 idempotency、human-in-the-loop approval。
- claude-code-master：skills 的 name/description 觸發與 lazy-loaded body、memory、routines、MCP 與 CLI 的分界。
- 沒做過：scope／ADR 這類決策文件流程、跨模型 review、以 acceptance criteria 驅動的 verify，以及把「資料模型」「設計系統」當成有驗收條件的 slice 來建。

## Anchors

- `learning-center` 這個 repo 本身：一堆 node／step 由 agent 產出，正好是「預設 vs 決策」的對照素材。
- agent-harness2 的經驗：agent 會 sprint 到 code，把沒被決定的地方自己填一個看起來合理的答案。
- claude-code-master：skill 不是更聰明的模型，是把重複的程序寫下來，讓判斷力回去做判斷。
- 「session 聊久了就變笨」→ 為什麼要在寫 code 前先把決策落到檔案，而不是靠一條長對話撐住。
- 課程的兩個 Reel app（vibe 版 vs workflow 版）：同一份需求、同一個模型、同一天，差別在誰做決定。
- 「程式碼能跑，但沒人敢改」的體感 → 為什麼 ADR、`verify.md`、AC-tagged tests 是給下一個人的介面。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次（沿用既有節奏）。
- 照課程的模組順序走：先照老師的步調完整跑一遍流程，再搬回自己的專案。
- 願意安裝那套 nine-skill 系統、開一個免費 Supabase 專案、必要時用兩個模型互相 review。

## Knowledge type

mixed，但**程序性主導**。事實（有哪些 skill、每個 skill 的參數、指令長相）只學到能跑；重心是判斷——什麼時候該退回 `/architect`、什麼算 proof、哪個決策值得寫成 ADR、review 該找的是風險還是風格。

## How to teach me

- 先看失敗長相（vibe 版的 35¢/頁、40 秒的 feed、三個 tab 三個答案），再回到機制。
- 每個抽象立刻綁到一個檔案、一行輸出或一次錯誤：`scope.md` 的 feature 列、`0002-data-model` 的 CHECK 約束、`verify.md` 的 PASS/FAIL、review 的 ranked findings。
- 每個 node 留一個「弄壞它／拿掉這個 gate 會怎樣」的動作，讓我看到機制真的在作用。
- 名詞保留英文（scope、spec、ADR、AC、gate、review、verify），不要硬翻；不要名詞堆疊、不要沒有前因後果的功能清單。

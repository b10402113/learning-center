---
subject: real-agent
language: zh-Hant
created: 2026-10-30
updated: 2026-10-30
---

# MEMORY — real-agent

## Goal

能在自己的 repo 上，用一組檔案把「跟 agent 合作」變成可重複的流程：`GLOSSARY.md`／ADR 先把語言與決策釘住，`/grill-with-docs` 把一個模糊需求問到能動工，Wayfinder 的 map 把大功能拆成幾十個一個 session 就吃得下的 ticket，`/to-spec` → `/to-tickets` → `/implement-spec` 把決策壓成可執行的清單，三種 review 把關，`/retro` 把 review 的每一句話變回規則。

完成的判準不是「跑過一次 demo」，而是：我能交出一個功能，並指著每一段痕跡說出它擋掉了什麼——glossary 條目擋掉的命名漂移、ADR 擋掉的「為什麼當初不這樣做」、ticket 的 resolution 擋掉的下一輪重問、Merge Danger 擋掉的不該上線、retro 產生的新標準擋掉的重複 review 意見。

第二個判準：拿到一個 agent 寫的功能，我能分辨哪些部分是「被決定的」，哪些是它自己填空漂出來的。

## Why

我已經會叫 agent 寫程式，也走過它的底層（agent-harness2 的 loop、background-agents 的 durable runtime、claude-code-master 的 skills）與九個 skill 的工程骨架（agentic-engineer 的 scope／ADR／verify／review）。真正卡住我的不是「它寫不出來」，是**規模**：一個 session 聊到 200–300K token 就進入 dumb zone，而我想做的功能光是把需求問清楚就超過一個 session；換 session 又會斷在互相牽連的決策上。

這門課給的答案不是更強的模型，是把「問清楚」本身拆成可以跨 session 累積的產物：地圖、ticket、glossary、ADR。它跟 agentic-engineer 是同一條線的兩半——那邊是單一 slice 的 gate，這邊是跨 session 與跨輪次的記憶。

## Prior experience

- TypeScript／Node.js，讀得懂 Express 與 React；基本 SQL 與 Postgres。macOS，能裝套件、開 GitHub repo。
- agent-harness2：agent = LLM + harness、context hydration／compaction、subagent 與 handoff。
- background-agents：durable runtime、事件觸發、human-in-the-loop approval。
- claude-code-master：skill 的 name/description 誘發與 lazy-loaded body、memory、routines、MCP 與 CLI 的分界。
- agentic-engineer：九個 skill 的骨架、scope 的 `Done when`、ADR 的 trade-off、`verify.md` 的 PASS/FAIL、review 的 ranked findings、從真實 diff 寫 PR 描述。
- 沒做過：把規劃拆成「一張 map + 一群互相 blocking 的 ticket」、用 scenario table 決定一個概念要有幾個詞、把 review 意見回灌成 CODING_STANDARDS.md 的規則。

## Anchors

- `learning-center` 這個 repo 本身：大量 node／step 由 agent 產出，正是「命名漂移、決策沒留」的現成對照素材。
- 「同一個東西在 UI 叫 cancel、email 叫 reversal、settings 叫 chargeback」→ 課程 Cadence 的三個名字，換成我自己 repo 裡的同義詞亂象。
- agent-harness2 的體感：session 聊久了就變笨 → 為什麼要在地圖與 ticket 上切，而不是靠一條長對話撐住。
- agentic-engineer 的 vibe build vs workflow build 對照 → 為什麼「先決定再建」在跨 session 時才真正划算。
- 自己寫過 `/last30days`、`/robo` 這類 skill → 對照 `/grill-with-docs`、`/wayfinder`、`/pr` 的 name/description 設計。
- 「PR 開出來沒人敢 review，或 review 只挑風格」→ Merge Danger（one-way door × blast radius）與 `/code-review` 的存在理由。
- 「同一句 review 意見講第三次」→ `/retro` 與把意見變成 CODING_STANDARDS.md 規則。
- Claude Code 的 `/compact`、subagent、`.agents/skills/` 都是我平常用的介面。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次（沿用既有節奏）。
- 一次一小段，能真的在自己機器上跑起來比讀完更重要。
- 環境：本機 Node.js／TypeScript 專案、GitHub repo、可裝套件；願意用 Claude Code 開多個 session／terminal。
- 照課程模組順序走：先看老師怎麼跑，再搬回自己的 repo。
- 名詞保留英文（glossary、ADR、map、ticket、fog、frontier、spec、retro、blast radius），不硬翻。

## Knowledge type

mixed，但**程序性主導**。事實（Wayfinder 的 ticket 種類、skill 的參數、PR 模板長相）只學到能跑；重心是判斷——什麼時候一句話直接改、什麼時候要 grill、什麼時候該升級成 Wayfinder、哪些詞該進 glossary、哪些 ADR 該刪、這個 PR 值不值得人看、這句 review 意見該不該變成規則。

## How to teach me

- 先看失敗長相（三個名字指同一件事、session 撐不住、PR 沒人敢看），再回到機制。
- 每個抽象立刻綁到一個檔案、一段輸出或一次錯誤：GLOSSARY.md 的條目、ADR 的 0008、map issue 的 blocker 表、PR body 的 Evidence 段、retro 報告的候選清單。
- 每個 node 留一個「弄壞它／拿掉這一步會怎樣」的動作，讓我看到機制真的在作用。
- 跟 agentic-engineer 重疊的地方（ADR、code review、skills）一句話帶過，篇幅留給 glossary 剪枝、Wayfinder 的四種 ticket、Merge Danger、retro。
- 不喜歡：名詞堆疊、沒有前因後果的功能清單、被要求先學完理論再動手。

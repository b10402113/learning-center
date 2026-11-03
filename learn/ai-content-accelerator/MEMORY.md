---
subject: ai-content-accelerator
language: zh-Hant
created: 2026-11-03
updated: 2026-11-03
---

# MEMORY — ai-content-accelerator

## Goal

把內容從「知道重要」變成每天真的在跑的產線：定出一個說得清楚的 content identity，用自己寫的 skills 把「找點子 → 寫腳本 → 錄 → 剪 → 排程發佈」串起來，並在 TikTok／Instagram／YouTube Shorts 上真的發出至少 15 則內容。

判準不是讀完課程，而是手上有痕跡：一個寫下來的 identity（小池塘 + content trifecta）、一份可重複使用的 skill 組（`/latest`、`/hooks`、`/tone`、`/post` 或等價物）、一串能點開的貼文連結，以及一個自己會看的每週節奏。若 30 天後只有筆記、沒有貼文，這個 subject 就算失敗。

## Why

工程能力已經夠了，缺的是「被看見」那一半。`agent-as-service` 已經在練賣服務，但網路上沒有個人品牌、沒有 inbound，客戶只能靠 cold outreach 認識我。內容是那個缺掉的信任層：它讓我的 agent 工程能力有公開證據，讓潛在客戶先相信我，也讓「賣服務」不必每次從零開始。

還有一層更個人的動機：我想驗證自己能不能經營觀眾，而不只是造工具。這件事沒辦法靠再讀一門課得到答案，只能靠真的發出去、看回饋、迭代。

## Prior experience

- TypeScript／Node.js 工程師；macOS；Claude Code 每天在用（VS Code extension 為主）。
- 自己寫過 `/last30days`、`/robo` 這類 skill，熟悉 name／description 觸發、lazy-loaded body、`.agents/skills/` 與 `.opencode/skills/`。
- 走過 agent-harness2、background-agents、agentic-engineer、claude-code-master、real-agent；能自己 build 出課程裡多數的自動化與 agent demo。
- 會寫技術文章與結構化筆記（`learning-center` 本身就是產物），但那是給自己看的，不是給觀眾看的。
- 沒做過：對外經營帳號、拍影片、剪片、寫 hook、排程發佈、用內容換 inbound；`agent-as-service` 的 MEMORY 已明確記著「沒有經營過對外內容」。
- 沒有既有觀眾或舊帳號可承接；起點是零追蹤。

## Anchors

- `learning-center` 這個 repo：`sources/ → digests/ → nodes/ → articles/` 的管線，正好可以改寫成「點子 → 腳本 → 貼文」的內容管線，也是現成的拍攝素材（螢幕錄影、實際操作）。
- 自己寫的 `/last30days`、`/robo` ↔ 課程的 `/latest`、`/outliers`、`/post`：同一個 skill 機制，差在有沒有接上「選題 → 發佈」。
- `agent-as-service` 的 warm outreach 名單與定位練習：內容是把同一套定位講給更多人聽，而不是另一套人格。
- 「我會 build agent，但沒人知道」→ 第一週的 content identity 與小池塘練習。
- 「每次都要重寫 prompt、重貼格式」→ tone of voice skill 與 Rubric Scripts 那條自動化。
- 「錄完螢幕，影片躺在資料夾裡」→ 自動剪輯、caption、`/post` 排程那一段。
- Claude Code 的 slash command、skill 觸發、approve 提示 → 課程講的 agent-ready 工具與內容 OS。
- 課程反覆出現的數字（1,000 true fans、一天三支 shorts、一支長片等於六十支短片、15 則貼文里程碑）→ 每個都拿自己的節奏重算一遍。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次（沿用既有節奏）；課程原設計 30 天，拉長成幾個月走，不追課程時程。
- macOS；VS Code + terminal；可螢幕錄影，但不打算買攝影器材，也不打算露臉作為前提。
- 願意真的開新帳號、真的發文、真的接排程工具；免費或低成本方案優先（Blotato 試用、YouTube Data API 免費 key）。
- 一次一小段，能跑起來比讀完更重要；跑不起來時接受先照抄可運作版本再回頭拆。
- 名詞保留英文（hook、caption、outlier、content identity、content trifecta、content pyramid、shorts／longs、warm-up），不硬翻。

## Knowledge type

mixed，但**程序性主導**。課程的原則與市場數字（1,000 true fans、品質門檻、平台差異）只學到能用；重心是動作——identity 怎麼寫、hook 怎麼選、腳本怎麼像自己、caption 怎麼被搜到、排程怎麼接、每週怎麼維持出貨。

## How to teach me

- 先看失敗長相，再學機制：零觀看的貼文長怎樣、hook 太長長怎樣、腳本一眼被認出是 AI 寫的長怎樣、新帳號接排程被限流長怎樣。
- 每個抽象立刻綁到一個要發出的真實產物：identity 綁第一則貼文、hook 模式綁一支 30 秒短片、tone skill 綁一次重寫、`/post` 綁一週排程。
- 每個 node 留一個「弄壞它／拿掉它會怎樣」的動作：拿掉 hook、把 caption 寫成重貼、跳過 warm-up、把 tone skill 關掉。
- 已經會的 agent／skill 機制一句話帶過；篇幅留給沒做過的：選題品味、hook 寫作、鏡頭表達、剪輯節奏、平台差異、發佈節奏。
- 不要名詞堆疊、不要沒有前因後果的原則清單、不要激勵雞湯；每篇文章以「讀完你要發出的那個東西」收尾。
- 小池塘預設：**agent engineering for solo builders／TypeScript developers**，用真實 repo 與 agent 工作流當素材；必要時再縮到「用 agent 做真的能賺錢的事」。

---
subject: agent-eval
language: zh-Hant
created: 2026-10-29
updated: 2026-10-29
---

# MEMORY — agent-eval

## Goal

替一個自己真的在跑的 agent 建出一套可運作的 eval:從真實 trace 建資料集、做 open/axial coding 出 failure taxonomy、把每個 failure mode 寫成 code check 或 LLM-as-judge、用 TPR/TNR 與 bootstrap 信賴區間修正 judge、最後接進 CI 當上線閘門。

判準不是「知道有哪些 metric」,而是:我能指著一份 trace 集說「這版通過率 0.87,區間 [0.81, 0.93],上版是 0.79」,並且能說出這個數字為什麼可信、哪裡還不可信。

## Why

先前的 agent 都是靠「讀幾筆輸出、感覺還行」就上線。問題不是不知道要測,而是不知道怎麼測才有意義:輸出沒有標準答案、同一個輸入每次不一樣、改完 prompt 之後「好像變好」也說不出是真變好還是換了樣本。

真正的動機是把「改 prompt / 換模型 / 加工具」從玄學變成實驗:有 baseline、有 failure mode、有比率、有信賴區間,能回答「這次改動值不值得」。

## Prior experience

- 會寫 TypeScript／Node.js,讀得懂 Express 與 React;基本 SQL 與 Postgres。
- 走過 `agent-harness`、`background-agents`、`claude-code-master`:懂 model 與 harness 的分界、context window、tool call、durable state、trace 大概長什麼樣。
- 會呼叫 LLM API、寫過 prompt、用過 structured output 的概念;沒寫過自動化 evaluator。
- 統計是初學:沒算過 Cohen's kappa、沒用過 bootstrap、不熟 TPR/TNR 與信賴區間如何在決策上使用。
- 沒做過多人標註流程,也沒有現成的 gold-standard dataset。

## Anchors

- `learning-center` 這個 repo 自己就有 eval 的雛形與缺口:`scripts/verify.mjs` 是 code-based evaluator(格式對錯),但文章「寫得好不好」只能靠人讀 —— 正好對照 rule-based 與 LLM-as-judge 的分工。
- 每次改 `prompts/article.txt` 之後只能看兩三篇輸出決定好壞 → 對照「沒有 baseline、沒有 failure mode、沒有比率」的 vibe check。
- Claude Code 聊久了變笨、忘記前面講過的偏好 → 對照 multi-turn 的 anchoring failure 與 context 相關的 coherence 問題。
- 「PR 要人 approve 才能 merge」→ 對照 CI gate 與 guardrail:什麼該擋在 critical path,什麼該事後抽樣。
- 背景 agent 重試後行為不一樣 → 對照 nondeterminism:同一條 query 要重跑、要跑多次、要用區間而不是單點。
- 寫過 SQL / 用過 lint 與單元測試 → 對照 executability check、schema 驗證、golden dataset 當 smoke test。
- 看過排行榜選模型 → 對照為什麼 leaderboard 分數不能直接當應用層的成功率。

## Habits & constraints

- 每次 45–60 分鐘,一週 2–3 次。
- 一次一小段,能跑起來比讀完更重要;接受先照抄可運作版本再回頭拆解。
- 環境:本機 Node.js／TypeScript,可裝套件;願意用免費額度的 API key、Neon Postgres、開源 observability(Phoenix 之類)。
- 沒有大量真實 production trace,資料要靠現有 repo 產出 + 少量合成;樣本數會小,必須面對小樣本的信賴區間。
- 語言:台灣繁體中文,技術名詞保留英文(trace、judge、rubric、kappa、bootstrap、guardrail 不硬翻)。

## Knowledge type

mixed,但**程序性主導**。重心是工程判斷:什麼該用 code check、什麼才輪到 judge、資料集要多大、kappa 到多少才算能動、區間多寬才敢上線。

但這門課有一層無法回避的 declarative 核心 —— kappa、TPR/TNR、Rogan-Gladen 修正、bootstrap CI。這層不能只用「先動手」帶過,必須每次都綁到一個可以算的數字與一個決策後果,否則會變成背公式。

## How to teach me

- 先看失敗長什麼樣子(一段爛 trace、一個騙過 judge 的輸出、一個 85% 一致卻 kappa 0.48 的例子),再學對應的機制。
- 每個抽象立刻綁到一個具體檔案、一個欄位、一個指令或一個數字;禁止名詞堆疊。
- 每一段都要有「你現在去跑會看到什麼」:spreadsheet 的一欄、一段 Python、一個 CLI 輸出。
- 每個節點保留一個「弄壞它」的動作:讓 judge 偏袒、把 gold set 洩漏進 prompt、把資料集換成不代表性的樣本,看指標怎麼騙人。
- 統計概念一律用「這個數字會讓你做出什麼決定」來教,不要從定義開始。
- 不喜歡:沒有前因後果的機制清單、被要求先學完理論再動手、把 eval 講成工具介紹。

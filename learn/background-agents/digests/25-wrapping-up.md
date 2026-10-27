---
source: sources/background-agents/20261027/25-wrapping-up.md
source_type: text
source_lines: 51
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 課程收尾與延伸 — capstone 留作作業，延伸 HITL 控制、context 與 runbook，並提醒 evals 在此類系統中的重要性。
- 其他 durable execution 選項 — DBOS、Temporal、Vercel Workflows、Upstash Workflows（HTTP based）各有取捨，挑順手的即可。
- durable runtime 是 agent 的靈魂 — 它讓 agent 持續存在、傾聽、醒著；沒有它，agent 只是一個 server 或 API。
- 規模化軟體開發的 harness — 自訂 harness 不必自己寫 coding agent，而是提供 tool 與 hosted coding agent 互動，決定哪些交給 harness、哪些交給 agent。

# L2 detail

- `#L1-L4` — 介紹 capstone 作為課後作業，涵蓋更多 human-in-the-loop 控制與不確定知識，並強調 evals 的重要性。
- `#L5-L9` — 盤點替代方案：DBOS 把狀態存資料庫、Temporal、Vercel Workflows、HTTP based 的 Upstash Workflows。
- `#L10-L12` — 最推薦的下一步是回家自己做：把筆記丟給 coding agent，用一個點子建出 background agent 再試著弄壞它。
- `#L13-L17` — 以需要自己電腦的 agent 為例，說明 durable execution runtime 是讓 agent「活著」的靈魂。
- `#L18-L24` — 回答用 Claude 生成是否等價：差別在架構品味與取捨判斷，agent 知道名詞但不會有強烈立場。
- `#L25-L31` — 與 email 整合的架構約 70% 相同；作者正從管理自己的信箱轉向 agent mail，避開 SMTP/IMAP 的麻煩。
- `#L32-L42` — 討論 Browser Base、Browser Use、Orgo 等雲端瀏覽器與整台電腦方案，以及每月 25 美元讓 agent 擁有自己電腦的實驗。
- `#L43-L51` — 回答能否規模化軟體開發：打造不寫程式的員工型 harness，用 tool 跟 hosted coding agent 互動，並比照本課決定職責切分。

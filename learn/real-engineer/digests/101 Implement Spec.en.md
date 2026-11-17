---
source: sources/real-engineer/20261116/course/101 Implement Spec.en.txt
source_type: text
source_lines: 25
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L42
---

# L1 overview

- 目前最野心勃勃的一題：把 implement spec 裡寫在 text 內的邏輯，翻成由 orchestrator 與 runner 組成的 deterministic 流程。
- 目標是讓 AFK agent 能排入長時間工作、自己產出大量程式碼——這是工廠出貨功能的核心。
- 加一個 quality-of-life 改動：輸入只給 spec，不給 ticket；讓 agent 自己在 tracker 開票。
- 關鍵認知：tickets 不是線性步驟清單，而是一張 task graph，因此任何時刻都存在一個「frontier」——已經準備好可以被拿取的票。
- 流程會一次實作整個 frontier，並用 sub-agent 把成果 merge 進 integration branch。
- 最後還有一輪 review pass（簡化起見可以拿掉，因為前面已示範過）。
- 別忘了一開始還有 exploration sub-agent，它會把一批 markdown 筆記存到某個目錄，而且必須讓之後所有 sub-agent 都存取得到。
- 完成後的定位：這會是工廠出貨功能的「心跳」，白天 wayfind、晚上由它把程式碼堆進去。

# L2 detail

- `#L1-L10` — 題目定位：把 implement spec 的文字邏輯轉成 deterministic 的 orchestrator + runner 組合，讓 AFK agent 能長時間執行並產出大量程式碼；同時加一個便利改動——輸入只給 spec，由 agent 自己開票。
- `#L11-L23` — 關鍵結構與難點：tickets 是 task graph 而非線性清單，因此永遠存在一個可被拿取的 frontier；流程要一次做完 frontier 上的所有票，用 sub-agent merge 進 integration branch，最後再走一輪 review（可省略）；也別忘了最前面的 exploration sub-agent 會產出 markdown 筆記，必須存放在所有後續 sub-agent 都讀得到的地方。
- `#L24-L25` — 收束：這題很硬，但完成後會是工廠出貨功能的核心，白天 wayfind、晚上由它把程式碼堆進去。

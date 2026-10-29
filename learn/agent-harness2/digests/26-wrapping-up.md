---
source: sources/agent-harness2/20261029/26-wrapping-up.txt
source_type: text
source_lines: 277
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 補充 hosted sandbox 資源；強調課程內容屬於前沿實務，多數人日常不會接觸。
- 學習方式是不斷親手做 agent、讀論文找靈感，並把 durable execution 等工具放進口袋，搭配 evals 驗證是否真的改善輸出。
- 具備判斷力後，即使請 Claude 代寫，也能看出哪裡在 hallucination。
- Chat agent 的最小 stack：tool calling、持久化 memory、context 壓縮；durable execution 是下一步。
- 長時程／背景型 «infinite agents» 以 inbox 模式互動，durable execution 是地基，難點在評估與約束。
- 課程結尾邀請提問與回饋，並預告更垂直的 agent 題目。

# L2 detail

- `#L1-L12` — 補充 hosted sandboxing 的資源清單，建議正式環境可採用。
- `#L13-L58` — 勉勵：這些是前沿內容，靠大量實作與讀論文累積；保持好奇並分享，把工具放進口袋搭配 evals 驗證。
- `#L59-L83` — 知道「好的樣子」後就能辨識幻覺；harness 還有許多未涵蓋的深度，垂直化 agent 更複雜。
- `#L84-L119` — 原本想做 browser agent（聊天加瀏覽器預覽）但太偏應用；鼓勵挑戰看似不可能的題目，如用語音操作 Mac 的 computer-use agent。
- `#L120-L183` — 回答最小 stack：tool calling、存在自己資料庫的 memory、context 壓縮；durable execution 與 client 獨立性是下一步，多數 SDK 已附帶。
- `#L184-L215` — 討論十 turn 上限與長時程執行；提出 infinite／background agents：給任務就離開，或閒置等 webhook 等事件。
- `#L216-L269` — 背景 agent 不需 messages API，改用 inbox 模型回報待辦與核准；durable execution 是基礎，真正難的是持續評估與約束。
- `#L270-L277` — 結尾致謝，邀請透過 Twitter 或 email 提供回饋。

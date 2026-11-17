---
source: sources/real-engineer/20261116/course/092 Improve Codebase Architecture Solution.en.txt
source_type: text
source_lines: 71
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 基本骨架：orchestrator 每天跑一次 loop → spawn 一台跑 improve-codebase-architecture 的 runner → 產出結果後開 ticket 給人看，人 review 後貼 label 再交給下游 implement 流程。
- 相較於部署 HTML 報告，作者更在意「要通知到人」，所以選擇開新 ticket 當交付形式。
- 最大風險是同一批建議一再重複開票，因此 ticket 要帶專屬 label，並在流程裡加一道「既有同類票超過 5 張就停」的閘門。
- 由於 skill 一次輸出多個 candidate，可以選擇在 runner 內只留一個（每次一張票），或每個 candidate 各開一張票（閘門提高到 20）。
- 可調變數共三類：loop 頻率、停止條件的張數門檻、以及 runner 內「只要很強的 candidate」這種嚴格度。
- 另一個更激進的版本：runner 直接判斷哪些 candidate 可實作，可實作的當場用 sub-agent 做完並開 PR，只把需要人看的留在 ticket；缺點是 refactor 非常吃 context，容易撞上下文上限或在 dumb zone 做白工。
- 兩個版本的核心差異就是「人在流程中的位置」，也是工廠節奏的設計選擇。

# L2 detail

- `#L1-L13` — 冷啟動設計：orchestrator 每天跑一次 loop，spawn 一台執行 improve-codebase-architecture 的 runner；HTML 報告不是重點，重點是跑完要通知人，因此開一張新 ticket 回到 tracker，由人 review 後貼 label 再驅動後續 implement runner。
- `#L14-L23` — 防止重複與失控：runner 必須有正確 context 才不會每天重複開一樣的票，所以要能依 label 篩選出「來自此流程」的票；再加上「既有票超過 5 張就停」的停止條件，等於在人不再關注時自動暫停。
- `#L24-L36` — 多 candidate 的處理與節奏調整：skill 的輸出是多個候選，可只在 runner 內挑一個（一天一票），或每個 candidate 各開一張票並把閘門拉高到 20 張；一天 3–6 張可能太快，可改成兩天一次；可調變數是 loop 頻率、停止門檻、candidate 嚴格度，且因為需要人工 review，天然有上限。
- `#L37-L60` — 更激進的變體：runner 自行判斷哪些 candidate 已可實作，全部先開 labeled ticket 以保留資訊；需人看的留在 tracker，可實作的當場在同一個 runner 內用 sub-agent 實作並逐票開 PR 給人 review；作者對這步持保留，因為大型 refactor 極吃 context，容易撞上限或落進 dumb zone。
- `#L61-L71` — 收束：兩個版本分別代表「人在前面 review ticket」與「人晚點才介入、先多產出程式碼」；重點學會 orchestrator 能排程與跑 loop，且必須內建煞車（label 篩選與停止條件），順帶避免重複建議已完成的工作。

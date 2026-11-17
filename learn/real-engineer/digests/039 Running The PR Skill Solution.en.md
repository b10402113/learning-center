---
source: sources/real-engineer/20261116/course/039 Running The PR Skill Solution.en.txt
source_type: text
source_lines: 53
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 實跑：要求 agent 為 PR 34 寫 body，skill 成功載入，並主動跑 type checking 與測試當證據。
- Summary 文字很少，主要靠 JSX 風格的 diff 呈現：bookmark toggle、lesson notes、sidebar 的 saved 按鈕、saved route、instructor student roster、schema 新表。
- 用詞是 students 而非 learners，因為 PR skill 會查 glossary 使用專案領域語言。
- Evidence 偏弱：只說型別檢查與測試通過，但沒有測試涵蓋 bookmarks 或 notes，skill 自己也承認這點。
- Merge Danger 判為 one-way door：migration O12 只新增表，但學生一旦寫筆記，rollback 就得留下孤兒表或刪掉他們的資料；blast radius 是隱私，並指出 glossary 說筆記私人、roster 卻顯示給講師的矛盾。
- 也點出 N+1 查詢與 foreign key `on delete no action` 等品質問題，結論是先跑 automated review 再花人力。

# L2 detail

- `#L1-L9` — 起手式：請 agent 為 PR 34 寫 PR body；skill 成功載入，agent 邊跑 type checking 與測試邊蒐集證據，先把 body 貼出去，並順帶發現一些程式不一致。
- `#L10-L26` — 檢視 Summary：文字極少，靠一大塊 JSX 風格 diff 說明 lesson viewer 的 bookmark toggle、lesson notes 的 save note、sidebar 的 saved 按鈕、saved route 中 bookmarks（新到舊）與 notes（最近編輯優先）、instructor student roster 的學生筆記、schema 的新表；特別指出它說 students 而非 learners，因為會查 glossary。
- `#L27-L37` — 證據薄弱：只根據程式說「原本沒有 bookmark／note、也沒有 saved route」，但坦白說型別檢查與測試雖過、卻沒有測試涵蓋 bookmarks 或 notes；Merge Danger 判為 one-way door（migration O12 只加表，rollback 會留下孤兒表或刪掉學生筆記），blast radius 是隱私，並抓到 glossary 說筆記私人、roster 卻顯示給講師的矛盾。
- `#L38-L53` — 其他品質問題：saved 每個 bookmark／note 跑三次查詢（N+1）、被參照的 lessons 與 users 因 `on delete no action` 無法刪除；作者評論這短短摘要資訊量驚人，既確認需要人工審（one-way door），也顯示 PR 品質低，應先跑自動審查再花人力。

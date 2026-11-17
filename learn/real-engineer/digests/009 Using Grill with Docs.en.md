---
source: sources/real-engineer/20261116/course/009 Using Grill with Docs.en.txt
source_type: text
source_lines: 23
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.1.part.md#L1-L237
  - cohort-005-project.1.part.md#L1-L1235
---

# L1 overview

- 本課任務：進到應用裡，替 `pending chargeback` / `reversal` / `cancellation` 這件事找出「正確的字」，再用這個字統一整個應用。
- 做法是在全新 session 用 `grill-with-docs`，並自己先想一個能啟動討論的 prompt。
- 此時專案完全沒有 `GLOSSARY.md`，所以不只會新增一個詞，還得補上讓這個詞說得通的周邊詞。
- 可能得先弄清這個功能的狀態機，才有辦法替它命名。
- 三步：先找對字、再補足周邊詞彙、最後把程式碼統一成 glossary 的講法。

# L2 detail

- `#L1-L8` — 開場：要修的是上次發現的 `pending chargeback` vs `reversal` vs `cancellation` 問題。第一件工作是進到應用裡找出正確的詞，再用 `grill-with-docs` 把應用統一在這個詞上；在新 session 啟用 skill，並自行設計啟動討論的 prompt。
- `#L9-L19` — 現況：專案目前沒有任何 glossary，所以建立 glossary 時不會只造一個描述該 entity 的詞，還得定義其他讓這條 entry 成立的詞；甚至可能需要先理解功能真正處於什麼狀態，才造得出這個詞。
- `#L20-L23` — 收尾：第一個任務用 `grill-with-docs` 找出對的字，第二個任務把周圍的詞補到足以說明新詞，接著讓程式碼與 glossary 對齊；完成後功能對使用者和對我們都不再那麼令人困惑。

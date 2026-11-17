---
source: sources/real-engineer/20261116/course/048 Searching For Shallow Modules.en.txt
source_type: text
source_lines: 29
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.2.part.md#L1-L2264
---

# L1 overview

- Deletion test 是判斷 shallow／deep 的實用判準：把這個 module 刪掉、改用它所包裝的東西，行為與複雜度若不變（甚至更簡單），它就是 shallow。
- 範例：一個只呼叫 `JSON.stringify` 的 `stringify` 函式，刪掉後直接寫 `JSON.stringify`，行為完全相同、還少學一個自訂名稱。
- 另一種處理是 deepening：當同一個 module 被反覆以相同順序呼叫時，把那段功能收進單一 interface。
- 練習只找候選、不改任何 code；重點是用 glossary 的詞（interface、implementation、leverage、locality）讀懂 agent 在說什麼。

# L2 detail

- `#L1-L14` — 把術語付諸實作：用 codebase design skill 獵捕 shallow module，主判準是 deletion test。以 `stringify` 包 `JSON.stringify` 為例說明：刪掉它、以內建函式取代，行為一模一樣、複雜度不變、甚至更好，因為不必再學一個自訂名稱。
- `#L15-L24` — 另一個線索是重複：當 caller 反覆以相同方式呼叫 module，就可以 deepen，把更多功能收到單一 interface 後面。提示語要 invoke codebase design skill，並要求「以 deletion test 找可刪的，或找可 deepen 的」候選。本課不動 code，只判斷候選好不好。
- `#L25-L29` — 練習的真正目的在檢驗詞彙理解：觀察 agent 怎麼使用 interface、implementation、leverage、locality，確認自己聽得懂，再據此挑出值得後續處理的改進候選。

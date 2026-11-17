---
source: sources/real-engineer/20261116/course/081 Retro A Run.en.txt
source_type: text
source_lines: 29
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L16
---

# L1 overview

- 這個 PR 已被 agent 審過，但 review 本身有明顯可改進處。
- 問題一：是一大面文字牆，「standards changes requested」太龐大，應改用 Show Me skill 精簡。
- 問題二：資訊重複——spec 段落與行內 code comment 講同一件事。
- 問題三：action 執行紀錄裡有大量資訊，可判斷這次是好 run 還是壞 run、agent 在哪裡卡住。
- 這正是 retro skill 的用途：它不只適用本機，也能對遠端 run 做 retrospective。
- 做法是把所有相關 action 的 URL 丟給 retro skill，外加一段表達你對這份 review 感受的 prompt。
- 特別要它讀「rules this review wanted but could not find」那一段，產出具體改善清單並實際套用。

# L2 detail

- `#L1-L10` — PR 已由 agent 審完，但 review 品質可改進：整段是巨大的文字牆，changes requested 段太大，適合用 Show Me skill 簡化；而且 spec 段落與行內 code comment 之間有大量重複；再看 action 本身，裡面資訊很多，足以判斷這次 run 是好是壞、agent 在哪裡掙扎。
- `#L11-L20` — 因此要對 software factory 跑 retrospective；retro skill 不只給本機 run 用，也能處理遠端 run，是把工廠調成自己偏好、提升效率的關鍵工具；做法是回到 agent，把所有導致目前結果的 action URL（作者是 agent review 那次與幾個 implement run）交給 retro skill。
- `#L21-L29` — 接著寫一段表達自己對這份 code review 感受的 prompt，特別關注「rules this review wanted but could not find」那節；目標是得到一份具體的工廠改善清單，並且當場套用，讓之後的 run 與實驗都受益。

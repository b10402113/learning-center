---
source: sources/real-engineer/20261116/course/093 The Ratchet.en.txt
source_type: text
source_lines: 19
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 問題來自 feedback loop 章節留下的空白：新 lint rule 寫好後，要怎麼在整個 repo 落地？目前 file size checker 只檢查 staged files，等於 agent 邊做邊撞見。
- 直覺解法是一次性全 repo 修完，讓 implementer 不必再被擋；作者改用另一種技巧：lint rule ratchet。
- ratchet 的定義：每天找出一個失敗的 lint rule，開一個 PR 修掉其中一個實例，最後由人 review。
- ratchet 之所以叫 ratchet，是因為棘輪只能往一個方向轉——每次套用就再鎖緊一格，直到該規則完全在 repo 上成立。
- 這個練習同樣要思考加速器（可調的數字）、避免同一個 lint rule 在多個 PR 重複修，以及人沒來 review 時怎麼辦。

# L2 detail

- `#L1-L8` — 問題來源：新 lint rule 寫好後要怎麼在全 repo 落地？現況是 file size checker 只跑 staged files，等於 agent 邊做邊隨機撞見；直覺上「一次全修完」會讓 implementer 解脫，但作者改用一個技巧——lint rule ratchet。
- `#L9-L16` — 做法與設計考量：每天找出一個失敗的 lint rule、開一個 PR 修掉一個實例，最後由人 review，流程應該相對簡單；同時要像前一個練習一樣思考 accelerators（可調快慢的數字）、避免同一個 rule 在多個 PR 重複修，以及人沒來 review 時怎麼處理。
- `#L17-L19` — 命名緣由：棘輪只允許往一個方向轉；每套用一次 workflow 就再鎖緊一格，該 lint rule 會越來越安全，直到完全在 repo 上建立起來。

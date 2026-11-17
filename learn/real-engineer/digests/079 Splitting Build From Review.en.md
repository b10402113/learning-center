---
source: sources/real-engineer/20261116/course/079 Splitting Build From Review.en.txt
source_type: text
source_lines: 13
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L48
---

# L1 overview

- PR 之所以是 draft，是因為 automated checks 雖過、automated review 還沒做，所以不能給人審。
- repo 上已有現成 label：`agent:review`。
- 貼上該 label 會用 code review skill 審這個 PR、試著修掉找到的問題，再把它標成 ready for review。
- 練習就是貼 label、讀 action、看整個流程串起來，最後得到一個可以讓人審的 PR。

# L2 detail

- `#L1-L5` — 這個 PR 是 draft，原因不是檢查沒過，而是 automated checks 過了但還沒做 automated review，因此尚未準備好給人工審查。
- `#L6-L9` — 解法是 repo 上已備好的 `agent:review` label：它會在這個 PR 上跑 code review skill、嘗試修掉發現的問題，然後把 PR 變成 ready for review。
- `#L10-L13` — 練習內容：貼上 label、讀 action、觀察整個流程如何合起來，目標是得到一個可供人工審查的 PR。

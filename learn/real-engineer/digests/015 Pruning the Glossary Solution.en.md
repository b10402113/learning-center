---
source: sources/real-engineer/20261116/course/015 Pruning the Glossary Solution.en.txt
source_type: text
source_lines: 129
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.1.part.md#L1-L286
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- 開場 prompt 只有一句：glossary 有點臃腫、裡面有不屬於我們 domain 的東西。
- Q1 砍掉 8 條實作與通用程式詞：`refunds table`、`refunded_at`、`resolved_by user ID`、`button`、`component`、`CWD`、`loader`、`slug`——理由是實作細節會變，glossary 不該跟著改。
- Q2 `slug` 只是 routing 細節、不是 ubiquitous，即使有爭議空間也選擇省略。
- Q3 `watch limit` 寫「two hours」但程式已改 one hour，於是乾脆拿掉數字，避免每次調整就過時。
- Q4 用 `enrolment` 取代「place on a course」；Q5 `lapsed`（有過 enrolment、之後失去但仍有進度）保留並移到 enrolments 旁。
- Q6 原本選 `learner`，查到 code 有 student 180 次 vs learner 8 次（跨 23 檔 112 次）後改為統一用 **student**。
- Q9 把 ADR 裡的「place on a course」與 ADR 檔名都改成 `enrolment`；glossary 由 113 行降到 87 行。

# L2 detail

- `#L1-L14` — prompt 刻意簡短。Q1 建議移除 8 條實作與通用程式 entry：`refunds table`、`refunded_at`、`resolved_by user ID` 等。作者指出這是 agent 最愛加的實作細節，而實作細節一直在變，放進 glossary 就得每次都改，且這幾條對 domain model 毫無貢獻。
- `#L15-L34` — 另一類是太通用的詞：`button`（可點擊、按下觸發動作）、`component`、`CWD`、`loader`、`slug`。我們要 model 的是課程管理應用，這些太泛、不屬於 Cadence，因此全部同意移除。Q2 追問：learner / instructor / admin 平常會說 slug 嗎，或只是 routing 細節？結論是路由細節、不 ubiquitous；若哪天 UI 要「choose a slug」、有邏輯與 bug 要談，才可能納入。作者選擇省略，並強調建 glossary 是藝術不是科學。
- `#L35-L51` — Q3：`watch limit` 條目寫「two hours watch」，程式已改成 one hour——正是把實作細節寫進 glossary 的痛。建議拿掉數字，作者同意。Q4：發現用片語「place on a course」而可壓縮成一個字，決定用 `enrolment`。
- `#L52-L78` — Q5：`lapsed` 指「不再 active 的 enrolment」，會以 badge 顯示在 instructor 的 student roster，確實對使用者溝通，因此保留並移到 enrolments 附近；新定義為「失去某課 enrolment 但仍有進度」。Q6：`learner` 出現在約 8 條定義卻從未定義，且部分程式寫 `student`；作者原本對兩者無偏好、傾向 learner，但…（下一段結論反轉）。Q7：glossary 內部標題結構怎麼排，作者說完全不在意。
- `#L79-L99` — 送出後 glossary 從 113 行變成 87 行。作者追問 student vs learner 的規模：student 在 23 個檔案出現 112 次，全 code base 180 次；learner 只有 8 次。於是改口：原本 50/50，看到遷移成本後決定沿用 **student**，並把既有 learner 條目改成 student。回頭補答 Q9：既然片語已定為 `enrolment`，ADR 內文也該改成 enrolment。
- `#L100-L129` — agent 逐檔改，主要在註解（作者指出註解是強化領域語言的好地方）；`docs/adr` 內文改為「buyer loses their enrolment」並用 student。再問 ADR **檔名**是否也改——同意；程式中的「place on the course」也改成 enrolment。作者承認這很 hardcore，但用 agent 做這種修補極便宜，等於順手修好所有破窗。最終結構：`watch limit` 併入 refund 區塊、enrolments 章節定義「a student's place on a course」、people 章節含 student / instructor / platform admin / team admin。結論：修剪是藝術，投入越多越有用，語言會越來越精確、程式跟著受益。

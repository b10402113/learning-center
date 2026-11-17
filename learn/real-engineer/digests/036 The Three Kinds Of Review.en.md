---
source: sources/real-engineer/20261116/course/036 The Three Kinds Of Review.en.txt
source_type: text
source_lines: 37
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L89
---

# L1 overview

- 軟體工廠像開車：先學會踩煞車，只會加速就只會產出 slop cannon。
- 三道煞車分層：automated checks、automated review、human review，品質逐層升高。
- automated checks 是確定性檢查（單元測試、type checking、linter），只花 CPU 不花 token，可以鋪好鋪滿。
- automated review 由 agent 驅動，課程先前已在 code review skill 與 implement spec skill 中示範過。
- human review 是最後一層：真人看 code，本節重點在提升它的效率與判斷該看多少。
- 策略是用 human review 的產出回頭強化 automated review，讓 agent 多做、人少做。

# L2 detail

- `#L1-L11` — 承接前面「與 agent 對齊、規劃大塊工作」，用學開車的比喻說明：先學減速，否則 software factory 只會變成 slop cannon；並點出三道主要煞車的框架。
- `#L12-L19` — automated checks 的定義：確定性、檢查程式品質的機制，如單元測試、type checking、linter；因為只消耗 CPU 不消耗 token，可以大量堆疊來約束 agent 行為。
- `#L20-L26` — automated review：與前者不同，是由 agent 驅動的審查，之前已在 code review skill 與 implement spec skill 中出現過，這裡預告還有很多可榨出的價值。
- `#L27-L37` — human review：真人檢查程式碼；本節聚焦底下兩層（automated review 與 human review），automated checks 留到後面的 feedback loop 章節，最終目標是用 human review 改進 automated review，讓自動審查越做越多、人工越看越少。

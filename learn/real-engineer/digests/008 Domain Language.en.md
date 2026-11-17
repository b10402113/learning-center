---
source: sources/real-engineer/20261116/course/008 Domain Language.en.txt
source_type: text
source_lines: 77
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.1.part.md#L1-L237
  - cohort-005-project.1.part.md#L1-L286
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- 與 agent 協作的品質，很大程度取決於雙方共用的語言；agent 愛發明又壓縮又省 token 的名字，對讀者卻是災難。
- 示範 bad case：問「learner 能不能拿回錢」，agent 回覆 `reversal eligibility envelope`、`cancellation gate`、`chargeback settlement handler`、`entitlement lease` 四個 code base 裡根本不存在的名字。
- 真實 bug 其實是語言問題：同一個東西在 UI 叫 `cancel my purchase`、email 叫 `reversal request`、settings 叫 `pending chargeback`，程式裡還有 `get cancellation offer`、`build reversal email`。
- 解法是 `GLOSSARY.md` 加上 `docs/adr/`：`grill-with-docs` = `grilling` + `domain-modeling`，後者會挑戰用詞、發明邊界情境、並在決策成形當下寫下 glossary 與 decision record。
- 理論來源是 Eric Evans 的 DDD **ubiquitous language**：只取 glossary 這個點子，不碰 aggregates、event sourcing。
- 語言必須在團隊對話、程式碼、產品三處完全一致；找到正確名字，等於已經把東西設計出來。

# L2 detail

- `#L1-L24` — 開場：AI coding 之後作者對「語言」著迷。agent 把大量語意塞進短名字以重複使用、不必自我解釋，但沒解釋給使用者就變成 nightmare；解方是共用的 `GLOSSARY.md`，好處延伸到輸出品質與下游使用者體驗。
- `#L25-L45` — 實例：以 Liam Thompson 登入、到 Introduction to TypeScript 按 cancel my purchase，畫面說 pending chargeback、終端機 email 說 reversal request pending；三個名字指同一件事。grep `cancellation`/`reversal`/`chargeback` 找到 `get cancellation offer`、`pending chargebacks`、`build reversal email`，造成 agent 找不到東西而重複寫程式。
- `#L46-L59` — 修法：建構時同時決定語言。`grill-with-docs` 以 `grilling` 為基礎，疊上 `domain-modeling`；它挑戰術語、發明 edge case、在決策 crystallize 時寫 `GLOSSARY.md` 與 `docs/ADR` 資料夾，其他 skill 都從 glossary 讀取以維持一致。
- `#L60-L77` — DDD 脈絡：取自 Eric Evans《Domain Driven Design》的 ubiquitous language，只取一兩個點子，不談 aggregates、event sourcing。重點是 ubiquitous：團隊怎麼講、產品叫什麼、程式碼用什麼，全部要一致；命名正確就等於理解了怎麼在對話中談它、怎麼對 AI 描述它。

---
source: sources/background-agents/20261027/shared
source_type: codebase
source_lines: 13
language: TypeScript
file_count: 1
status: skipped
skip_reason: "Repository scaffolding, not part of the course material."
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 動作目錄（`ACTIONS`）— 以 `as const` 定義七個合法動作：`inspect_logs`、`inspect_changes`、`disable_feature`、`rollback_release`、`request_help`、`complete`、`wait`。agent 的 structured output、tool policy 與 checkout `/operations` 都收斂在這份清單上。
- 名稱型別（`ActionName`）— 由 tuple 推導的 union，讓「模型選了目錄外的動作」在編譯期就失敗，而不是執行期才發現。
- 世界狀態（`WorldState`）— `Record<string, unknown>` 的寬鬆快照型別；真正形狀由 checkout 的 `/state` 與 `observe` 驗證，shared 只負責傳遞。
- 完成條件（`GoalCondition`）— `{ path, equals } | null`，把 goal 從一句 prompt 變成可用 dot path 機械檢查的條件。

# L2 detail

- `#L1-L10` — shared/types.ts — 匯出 `ACTIONS` 常數 tuple 與 `ActionName = (typeof ACTIONS)[number]`。這十行是整個系統的動作契約：`agent-brain` 的 `decisionSchema` 用它限制模型輸出，`tool-policy` 用它建立 `Record<ActionName, ...>`，checkout 的 Zod enum 也對齊同一組名稱。學習重點：把「agent 能做什麼」放在共用型別，而不是散落在 prompt 或各個服務。
- `#L11-L13` — shared/types.ts — 匯出 `WorldState`（`Record<string, unknown>`）與 `GoalCondition`（`{ path: string; equals: string | number | boolean } | null`）。前者讓 harness 能傳遞任意 checkout snapshot 而不在型別層假設欄位；後者讓 `goalSatisfied` 以 `path` 取值、與 `equals` 比對，`null` 代表沒有完成條件。學習重點：狀態是資料、完成是 predicate，兩者都不該寫死在 agent 的推理裡。

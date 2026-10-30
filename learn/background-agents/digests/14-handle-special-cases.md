---
source: sources/background-agents/20261027/14-handle-special-cases.md
source_type: text
source_lines: 72
status: skipped
skip_reason: "The source lesson is not covered by the current node partition."
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **特殊 action 分支** — `wait`、`complete`、`request help` 各有不同的暫停與收尾邏輯，需逐一處理。
- **complete 也要先寫報告** — 報告由 LLM 產生，必須包在 step 內；之後再把 run 標成 completed。
- **step.run 是免費 checkpoint** — 已完成的 step 直接跳過，節省時間、算力與 LLM 成本（money complexity）。
- **action ID 不需進 step** — 只要唯一、不被任何邏輯依賴，重播時重新產生也無妨；例外是需打 API 取得時可為效能而包 step。
- **policy 抽象層** — 把 30 個 action 的 if 收斂成 read、write、approval、help、terminal 五種 policy 判斷。

# L2 detail

- `#L1-L5` — 前置特殊情況（wait、complete、request help）不能直接複製，需分別處理。
- `#L6-L13` — `wait` 或 `complete` 且有 goal condition 時，先以 step 標記 unavailable 並設定 run 訊息，之後再 `return`。
- `#L14-L22` — `complete`：先以 step 寫報告，再以另一步驟把 run 標為 completed，避免重複處理已解問題。
- `#L23-L29` — `request help`：與 wait 類似，先記錄 help unavailable 與 human help 尚未建立。
- `#L30-L34` — 目前沒新增 business logic，只讓流程更 durable；`step.run` 即 checkpoint，可視為節省金錢與預算複雜度。
- `#L35-L47` — action ID 不需 memoize，因無邏輯依賴；若取得成本高（需打 API）才值得放進 step。
- `#L48-L72` — policy 對照（read/write/approval）與 harness 的解讀方式，將逐 action 判斷收斂為逐 policy 判斷，read 作為 fallback。

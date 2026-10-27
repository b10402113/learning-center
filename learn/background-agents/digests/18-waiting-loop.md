---
source: sources/background-agents/20261027/18-waiting-loop.md
source_type: text
source_lines: 62
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 等待迴圈的實作選擇 — 這一節把 `wait` 搭起來，用 `let check = 0` 加 `while (true)` 當第一個可運作的版本，先求說得通再談優化。
- 每輪先讀事件再確認 run 狀態 — 迴圈內用 `read event sequence` 帶 `cycle` 取值，再用 `getRun` 確認 run 沒被完成、取消或 superseded，因為非同步系統的狀態隨時會變。
- 用 `step.waitForEvent` 取代 sleep — 等 `incident/updated` 並以 `async.data.runId` 過濾、timeout 10 秒，事件一到就往下走，而非睡滿才查。
- 收尾回到外層迴圈 — 等待結束後 `continue` 回上一層，並刪掉已重複的 `requestHelp` 判斷，讓等待邏輯只有一處。

# L2 detail

- `#L1-L7` — 開場說明等待沒有標準答案，宣告 `let check = 0` 記錄檢查輪次，並以 `while (true)` 作為第一個範例。
- `#L8-L14` — 迴圈內先 `step.run("read event sequence", ...)` 取得 `latest`，再 `getRun` 拿目前 run 的最新資料。
- `#L15-L19` — 判斷 `latest.status`：completed、failed、canceled、escalated 或被 superseded 就停止等待。
- `#L20-L24` — 解釋為何每個步驟前都要重查：系統非同步、同一 run ID 可能被另一個 workflow 收掉，分散式狀態會變。
- `#L25-L29` — 以 `latest.eventSequence > state.eventSequence` 判斷有新事件，跳出 `while` 並把 `check` 加一。
- `#L30-L38` — 呼叫 `step.waitForEvent("wait for service")`，等待事件名稱 `incident/updated`，並說明斜線只是命名慣例。
- `#L39-L47` — `if` 條件用 `async.data.runId === runId` 過濾本 run 的事件，timeout 10 秒，概念像帶條件的 `setTimeout`。
- `#L48-L56` — 比較 `step.sleep`：睡完才查會延遲發現事件，若是等 30 分鐘更不可接受，所以 `waitForEvent` 較好。
- `#L57-L62` — 等待後 `continue` 回外層迴圈，移除重複的 `decision.action === "requestHelp"` 分支，並提到 TypeScript 型別的好處。

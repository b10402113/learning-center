---
source: sources/background-agents/20261027/15-executing-actions.md
source_type: text
source_lines: 97
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **執行 action 必須冪等且在 step 內** — 重播時不能讓轉帳之類的副作用發生兩次，靠 idempotency key 保證。
- **`expectedVersion` 與 stale 結果** — read 可不帶版本；stale 表示已執行過，或部署後 action 已被移除，需記錄供事後追查。
- **state 是 agent 的觀察依據** — 動作改變世界後若沒更新 state，agent 會持續誤判、無法收斂。
- **一次完整 run 的實測** — 四輪迴圈依序 inspect log、inspect changes、disable feature，最後自我驗證 recovery。
- **blast radius 與權限** — 本課尚未接上 inbox/approval，關閉 feature 這類高影響動作仍是後續要收緊的權限。

# L2 detail

- `#L1-L5` — 暫時假設所有走到執行階段的 action 都允許執行，其他 policy 留待後續課程補上。
- `#L6-L17` — 執行 action 包在 `step.run`；強調 idempotent 與同一個 run 使用同一個 idempotency key。
- `#L18-L23` — 呼叫 `executeAction`，帶 `environmentId` 與 `decision.action`；read policy 傳 `undefined`，否則可傳 `state.world.version`。
- `#L24-L35` — `result.stale` 的兩種來源（已執行過、部署後 action 不存在），記錄 `decision.thought`、action 與版本。
- `#L36-L47` — 處理完後回到 loop 頂端；保留更新 run 的邏輯、移除 sleep，並確認 record tool action 已由 helper 處理。
- `#L48-L63` — 實跑：feature fault 觸發後 agent 產出報告，指出 payment confirmation 錯誤率 42，並停用 Express feature。
- `#L64-L71` — 重申 state 必須更新；state 是 agent 判斷恢復的依據，否則行為會嚴重錯亂。
- `#L72-L91` — 四輪迴圈細節：inspect log、inspect changes（發現開啟 feature 的 commit）、disable、觀察 healthy 與錯誤率降至 1。
- `#L92-L97` — 結論：step、服務告警/恢復、state 更新三者到位才成功；下一步要處理 inbox 與 blast radius。

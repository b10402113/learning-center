---
source: sources/background-agents/20261027/service
source_type: codebase
source_lines: 221
language: TypeScript
file_count: 1
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 假 checkout 服務（`service/checkout.ts`）— 單一 Express 程式，啟動時用 `--fault feature|release|dependency` 決定故障型態，用 `--alerts`、`--interval-ms`、`--recover-after-ms` 控制告警節奏與自動恢復。它是 agent 要觀察與修復的「會變動的世界」。
- 讀取介面（`/health`、`/state`、`/logs`、`/changes`）— 提供 instance id、version、健康狀態、release、feature flag 與最近日誌／變更；`/state` 是 agent 每次決策前必須重新讀取的現況，event payload 不能取代它。
- 動作介面與冪等（`POST /operations`）— 只接受四種動作；以 `actionId` 記住結果，同 ID 不同參數回 409，重送相同請求回放原結果；`disable_feature` 與 `rollback_release` 還要通過 `expectedVersion` 檢查，否則回 `{ stale: true }`。
- Outbox 與事件送達 — `pendingEvents` 保存未確認事件，每秒重送到 operator API `http://127.0.0.1:3001/api/service/events`；失敗就保留同一個 event id，讓重試不會變成重複事故。
- 故障生命週期 — 啟動後依排程送出 `health.alert`，動作成功時 `recover()` 升版並送 `health.recovered`；`dependency` 故障可設定時間到自動恢復。學習重點：效果由服務擁有，agent 只提出意圖並在事後驗證。

# L2 detail

- `#L1-L12` — service/checkout.ts — 匯入 `randomUUID`、`express`、`zod`，定義 `Fault`（none、feature、release、dependency）與 `ServiceState`（service、health、release、featureEnabled、upstreamHealthy）。這兩個型別就是整個模擬器的狀態契約，後續所有動作都在改動它們。
- `#L13-L48` — service/checkout.ts — 啟動參數與初始狀態。`flag(name, fallback)` 讀 `process.argv`；`fault`、`alertCount`（0–100）、`intervalMs`（100–60000）、`recoverAfterMs` 全部經 Zod 驗證，`--lose-next-action-response` 則模擬「效果已提交、回應遺失」。`instanceId` 每次啟動都不同，`version` 從 1 起算；初始 `state` 依 fault 設定 `healthy/degraded`、`errorRate`、`v2-bad` 或 `v1-stable`、feature 開關與 upstream 健康。學習重點：故障是啟動設定，不是隨機事件。
- `#L49-L100` — service/checkout.ts — 記憶體資料與 outbox。`logs`、`changes` 是有上限思維的陣列，`outcomes` 以 `actionId` 保存 fingerprint 與結果，`pendingEvents` 保存待送事件，`delivering` 防止並行投遞。`faultLog` 把四種 fault 翻成人話；`recordLog`、`recordChange` 加上 ISO 時間；`deliverEvents` 逐筆 POST 到 operator，成功才刪除，失敗保留同 id；`emit` 產生含 `serviceId: 'checkout'`、`instanceId`、`type`、`data` 的事件。學習重點：producer 端也需要 outbox，才能處理 operator 尚未啟動的窗口。
- `#L101-L113` — service/checkout.ts — 恢復路徑與啟動紀錄。`recover(reason)` 在仍有故障時清掉 `activeFault`、把健康度設回 `healthy`/`errorRate: 1`、遞增 `version`、寫 log 並送出 `health.recovered`；啟動時依 fault 寫入第一筆 info 或 error log，release 與 feature 故障各補一筆 change。學習重點：恢復也要產生事件，讓 operator 能解釋狀態為何改變。
- `#L114-L122` — service/checkout.ts — Express 讀取面。`express.json()` 後提供 `/health`（含 `pendingEvents` 數量）、`/state`（含 `instanceId`、`version`、`state`）、`/logs` 與 `/changes`（各取最近 20 筆）。這些端點是 agent `observe` 的來源，刻意與寫入面分開。
- `#L123-L182` — service/checkout.ts — `POST /operations` 的核心。Zod 限制 `actionId`、四種 `name` 與選填 `expectedVersion`；fingerprint 由 `name` 加 `expectedVersion` 組成，重複 `actionId` 若參數不同回 409，相同則回放 `prior.result`。寫入型動作先比對 `expectedVersion`，不符就回 `stale` 與 `currentVersion`。`inspect_logs`、`inspect_changes` 只讀；`disable_feature` 關掉 flag、記錄 change，若正在 feature 故障就 `recover`，否則只升版；`rollback_release` 回到 `v1-stable`，release 故障時恢復。結果寫入 `outcomes` 後，必要時以 503 模擬 acknowledgement 遺失。學習重點：idempotency key 要綁定參數，版本前置條件要與效果同一次提交。
- `#L183-L193` — service/checkout.ts — 錯誤中介層：任何拋出的錯誤（多為 ZodError）都轉成 400 與 `{ error: message }`，其餘錯誤用 `Invalid request`。這讓 agent 收到可讀的失敗，而不是 express 預設 HTML。
- `#L194-L221` — service/checkout.ts — 啟動與故障時序。監聽 `127.0.0.1:3004`，每秒跑一次 `deliverEvents`，立刻送出 `service.started`；若有 fault，依 `alertCount` 與 `intervalMs` 排程 `health.alert`（帶 `errorRate` 與 `alertNumber`），且在送達前再次確認 `activeFault !== 'none'`；`dependency` 故障可於 `recoverAfterMs` 後把 `upstreamHealthy` 設回 true 並 `recover`。學習重點：告警是「通知」，真正的狀態仍要回到 `/state` 讀。

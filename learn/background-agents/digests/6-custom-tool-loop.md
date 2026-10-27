---
source: sources/background-agents/20261027/6-custom-tool-loop.md
source_type: text
source_lines: 88
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 為何自寫 tool loop — 需要在工具被呼叫前攔截（暫停、求助、核准），現成 SDK 的內部迴圈做不到。
- `generateText` 的內部迴圈 — 傳入 tools 會自動循環到條件成立，但本課只要它回一個決策，迴圈由 harness 控制；request for help 與 rollback release 都先標成 escalated 並 return。
- 動作在服務端執行 — 用 `fetch` 打 checkout service 的 operations route，商業邏輯留在服務本身。
- 送出與回寫 — body 帶 `actionId`、動作名稱、`expectedVersion`；每個動作都必須改變 state，因為 state 就是 agent 的 UI。
- 收尾 — stale 狀態不記錄；離開迴圈後一律 `setRun` escalated、理由 decision limit reached（上限 8）。

# L2 detail

- `#L1-L7` — 處理 `decision.action` 為 request for help 的特殊情況；現成 tool loop 難以在呼叫前攔截，因此要自寫。
- `#L8-L18` — `generateText` 傳 tools 時有內部迴圈，但需要基礎設施層處理（暫停、求助）時必須拆出來，由 harness 掌控迴圈。
- `#L19-L23` — 遇到 request for help：`setRun` 標成 escalated，因第一輪尚未實作暫停，先直接 `return`。
- `#L24-L28` — rollback release 不自動執行：同樣 escalated，理由 approvals 尚未建好。
- `#L29-L33` — 其餘動作不再檢查，agent 選什麼就執行什麼。
- `#L34-L38` — 以 run ID 加隨機 UUID 產生 action ID，強調背景 agent 的追蹤必須精準。
- `#L39-L47` — 以 `fetch` 呼叫 checkout service 的 operations route 改變服務狀態，商業邏輯留在服務端。
- `#L48-L56` — POST body 用 `JSON.stringify` 帶 `actionId`、動作名稱與 `expectedVersion`（state 的版本保險）。
- `#L57-L70` — 假設動作會完成且一定修改 state；否則下一輪觀察不到變化，agent 會反覆懷疑（state 即 UI 的比喻）。
- `#L71-L75` — 錯誤處理最小化：`response.json()`、非 OK 就 `throw`，深入 retry policy 留待他課。
- `#L76-L82` — `result.stale` 不為 true 才 `recordToolAction`，記錄 environment／run／action ID、動作、`state.world.version` 與結果。
- `#L83-L88` — for 迴圈外的收尾：不論如何結束都 `setRun` escalated，理由 decision limit reached（上限 8），說明 `return` 會離開整個 call stack。

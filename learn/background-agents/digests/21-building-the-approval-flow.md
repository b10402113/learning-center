---
source: sources/background-agents/20261027/21-building-the-approval-flow.md
source_type: text
source_lines: 156
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- approval 流程的資料模型 — 用 `proposedAction` 把待批准動作存進自己的資料庫，之後才能找回參數與執行方式；`getProposal` 讀取、`staleProposal` 標記過期。
- 為什麼要另開 step 從資料庫重讀 — 非同步 workflow 可能被 override 或中斷重啟，不能信任前一行的變數，資料庫是唯一真相來源，與資料庫交易同理。
- 等待、批准與拒絕的處理 — 以 `while (proposal.status === "pending")` 搭 `waitForEvent("wait for human")` 輪詢，事件 `agent.approval.decided` 需用 `proposalId` 過濾；未批准則把 run 設為 escalated。
- 執行前必須再確認狀態 — 批准後用 `recheck approved state` 比對 `world.version`，若已漂移就 `staleProposal` 並 `continue` 回迴圈重想，避免拿過期狀態硬跑。

# L2 detail

- `#L1-L5` — 回到 workflow 檔，從 agent data 加入 `getProposal`、`proposedAction`、`staleProposal` 三個 import。
- `#L6-L12` — 說明為何把 proposal 存進資料庫：批准回來時需要找回 action 的參數與執行方式，才能接上收件匣按鈕。
- `#L13-L19` — 應用邏輯應放在自己的資料庫，Ingest 只管 workflow 邏輯；未來也能查詢所有 agent 的 proposed actions。
- `#L20-L30` — `staleProposal` 的概念：提案當下存狀態快照，回頭比對現況，不同就代表 action 已過期。
- `#L31-L37` — stale 時的處理是讓 agent 再跑一輪重新決策，比拿過期狀態硬跑可靠。
- `#L38-L49` — 進入 policy 為 approval 的分支，取得 input 快照並比對 `state.world.version`；只傳版本號作為 snapshot reference。
- `#L50-L62` — 建立 proposal ID 與 `cycle`，在 step 中呼叫 `proposedAction` 傳入 environment ID、run ID、`decision.action`、inputs，回傳 `proposal.id`。
- `#L63-L74` — 另開 `get proposal` step 從資料庫重讀；不直接沿用變數，避免快取、override 與跨次執行的不一致。
- `#L75-L81` — 作者兩次踩坑經驗：拿到 stale proposal 卡了兩小時，因為 step 可能中斷重啟、期間資料已被處理。
- `#L82-L86` — 與資料庫交易的原則相同：等寫入真正完成再讀，不相信手上的舊值。
- `#L87-L98` — `check = 0` 後以 `while (proposal.status === "pending")` 輪詢，每輪 `check++`、`waitForEvent("wait for human")` 再從資料庫重抓。
- `#L99-L107` — 事件名稱為 `agent.approval.decided`，必須以 `async.data.proposalId` 過濾，否則任一批准會誤放行所有任務，timeout 10 秒。
- `#L108-L112` — 通過等待後開 `reconcile human` step，重新取得最新的 proposal。
- `#L113-L125` — 若 `proposal.status !== "approved"`，開 `stop after human` step 把 run 設為 escalated，並記錄 `humanDecision`。
- `#L126-L134` — 批准後執行 `recheck approved state`，確認執行前狀態仍一致；以轉帳餘額不足為例說明為何不能盲跑。
- `#L135-L141` — 提出更主動的替代方案：每次狀態變更就掃描所有 pending proposal，主動清掉過期的。
- `#L142-L152` — 比對 `fresh.world.version` 與啟動時版本，不同則 `invalidate approval`、呼叫 `staleProposal` 並 `continue` 回外層迴圈。
- `#L153-L156` — 移除原本的 `return`，讓 approved 且狀態新鮮的流程落到執行 action 的那一行。

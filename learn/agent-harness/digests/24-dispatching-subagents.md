---
source: sources/agent-harness/20260915/24-dispatching-subagents.txt
source_type: text
source_lines: 326
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 所有 sub-agent 以各自的 context window 平行執行，但被包在同一個 DBOS step 裡，因此重試時會整批重跑。
- 這是明確的取捨：換取真正的平行，代價是無法只重試失敗的那一個 investigation。
- `Promise.allSettled` 搭配 `plan.steps.map`，讓每個 plan step 啟動一個可觀測的 investigation。
- 每個 investigation 會 emit started 與 completed 事件，携帶 workflow ID、step ID、agent 與 objective。
- 只把 fulfilled 的 findings 交給 synthesis；失敗的項目另外記成 step，必要時可回報給 supervisor。
- `synthesize` 因為是非同步、非確定性且成本高，必須放進 DBOS step。
- 伺服器依 `message.mode === "supervised"` 分流：supervised 走 supervisor workflow，其餘走原本的 agent workflow。
- Supervisor workflow 與 handoff 互斥：handoff 只存在於一般 agent workflow。

# L2 detail

- `#L1-L19` — 決定平行 dispatch：所有 sub-agent 共用一個 step，以换取同時執行與整批重試。
- `#L20-L46` — 用 `Promise.allSettled` 與 `plan.steps.map` 建立 step，emit `sub-agent started` 事件帶出 agent 與 objective。
- `#L47-L78` — 在 step 內呼叫 `runInvestigation` 取得 findings，再 emit 完成事件，回傳 agent 與 findings 並替 step 命名。
- `#L79-L113` — 從 settled 結果篩出 fulfilled 的 findings；失敗者寫成 step，並討論是否要回饋給 supervisor（本次不做）。
- `#L114-L157` — 在 DBOS step 中執行 `synthesize`；說明非同步、非確定性、 costly 的工作為何要進 step；修掉忘記 return 的 bug。
- `#L158-L177` — 回傳 reply，並用 `DBOS.registerWorkflow` 註冊 supervisor workflow。
- `#L178-L209` — 在 server handler 依 `message.mode` 選擇 workflow：supervised 或預設 agent workflow。
- `#L210-L248` — 實測 supervised 模式；確認 supervisor 路徑不支援 handoff，handoff 只實作在 agent workflow。
- `#L249-L326` — 檢視輸出：billing 查重複扣款、technical 查 KB 與 Safari bug、sales 處理 50 seats；回看 plan、事件時序，建議補一個 investigation completed 事件。

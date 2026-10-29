---
source: sources/agent-harness2/20261029/24-dispatching-subagents.txt
source_type: text
source_lines: 326
supplements:
  - harness-engineering.1.part.md#L1-L128
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 所有 subagent 必須在同一個 DBOS step 內平行 fan-out，才能同時執行、同時重試，各自擁有獨立 context window。
- 以 `Promise.allSettled` 包住 `plan.steps.map`，每個項目用 `DBOS.startRunStep` 執行並 emit 開始與完成事件。
- 只有 fulfilled 的結果會進入 findings；失敗的項目另寫一個 step 記錄原因，之後才做整合。
- 整合回覆也包在 step 中，之後 emit model completed 並回傳 reply。
- Supervisor workflow 需註冊到 DBOS，server 依 message.mode 決定走 supervised 或一般 agent workflow。
- supervisor workflow 完全不支援 handoff，handoff 只存在於 agent workflow。

# L2 detail

- `#L1-L19` — 平行派的理由：全部在同一個 step 內同時跑、一起重試；承認這不是最優化，但符合本課設計。
- `#L20-L78` — 用 `Promise.allSettled` 與 `plan.steps.map`，每個 step 以 `DBOS.startRunStep` 執行，emit sub-agent started 後呼叫 runInvestigator。
- `#L79-L113` — 再 emit 完成事件並回傳 agent 與 findings；把 step 命名為 sub-agents；失敗項目只記錄，不進階回饋 supervisor。
- `#L114-L158` — 用 DBOS step 執行 synthesize 取得 reply；說明非同步、非確定性或高成本的工作都該放進 step。
- `#L159-L209` — emit model completed、回傳 reply、註冊 supervisor workflow；server 依 `message.mode === supervised` 選擇 workflow。
- `#L210-L248` — 以 supervised 模式實測；確認 supervisor 流程不處理 handoff，handoff 只實作在 agent workflow。
- `#L249-L291` — 檢視結果：統整回覆、billing 調查重複扣款、technical 查 KB、sales 只查 50 seats 相關定價。
- `#L292-L326` — 檢視 plan 物件與事件順序：plan、三個 sub-agent started／completed、model completed；建議可再加 investigation completed。

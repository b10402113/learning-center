---
source: sources/agent-harness2/20261029/23-supervisor-workflow.txt
source_type: text
source_lines: 269
supplements:
  - harness-engineering.1.part.md#L1-L128
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- Supervisor 的職責是先判斷要不要開 investigator，並產生一份可執行的 plan。
- 使用 `generateObject` 取得 schema-backed 結構化輸出，plan 的形狀是 id、agent、objective。
- `makePlan` 把 task 轉成 plan；舊版靠重試解析 JSON，新模型已在模型層支援 JSON 輸出。
- `synthesize` 用 `generateText` 把各 investigator 的 findings 整合成給客戶的一封回覆，缺漏處要明說會再追蹤。
- Supervisor workflow 是另一個 DBOS workflow，以 workflowID 識別、以 step 保存計畫。
- `makePlan` 必須包在 DBOS step 中，否則 workflow 重跑時會重新規劃；事件可視為 checkpoint。

# L2 detail

- `#L1-L53` — supervisor 的目標：決定是否需要 investigators、產生 plan；匯入 DBOS、generateObject、runInvestigator、events、model。
- `#L54-L72` — 定義 plan schema（id、agent、objective），`z.infer` 讓 TypeScript 型別直接從 Zod schema 推導。
- `#L73-L119` — `makePlan`：接收 task，呼叫 `generateObject` 並帶入 schema，回傳結構化物件而非文字。
- `#L120-L143` — generateObject 已被標記 deprecated，官方建議改用 generateText 加 output 設定；作者選擇暫不改。
- `#L144-L181` — `synthesize`：接收 task 與 findings，用 generateText 以 support lead 角色寫一封回覆，缺漏的調查要簡短說明並承諾後續。
- `#L182-L248` — 建立 supervisor DBOS workflow：取得 workflowID、emit 開始事件、以 DBOS step 執行 makePlan 讓計畫只產生一次。
- `#L249-L269` — 把事件視為 checkpoint，emit plan created 事件並帶上 plan 的 steps 供 UI 顯示。

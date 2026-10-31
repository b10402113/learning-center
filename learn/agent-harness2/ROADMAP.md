---
subject: agent-harness2
status: draft # draft → confirmed
path: problem-driven
created: 2026-10-29
---

# ROADMAP — agent-harness2

## Goal

用 DBOS + Postgres + Vercel AI SDK，從空白檔把這套 harness 重寫一遍：durable event log、可重放的 workflow、harness 自己執行的工具、`node:vm` sandbox 與 code mode、token 預算的 context hydration 與 compaction、agent handoff、plan-driven supervisor 平行 fan-out、DBOS 暫停式 approval。

判準是能指著每一層說出「拿掉它會怎麼壞」：斷線後狀態在哪、重跑時哪一行不會重打 LLM、重複的 tool 副作用被誰擋下、context 爆掉前誰先壓縮、哪個 agent 根本沒有 `issueRefund`、approval 卡住時 compute 停在哪。

## Learning path

**problem-driven（問題驅動）** — 每個節點是一個會真的發生的 production 故障，機制按「這個故障需要什麼」拉進來，而不是按功能清單排列。

- **角度：** 先看失敗長相（斷線失憶、重跑重複扣款、模型寫的程式跑在本機、context 無限長、一個 agent 什麼都能做、sub-agent 一半失敗、要等人 approve 等三天），再補上修它的那一層。
- **優化：** 立即適用性與判斷力——每學完一個節點，就多一個「這裡斷掉狀態去哪裡」的答案。
- **如何排 Tier：** Tier 1 先把 harness 與最脆弱的 loop 立起來；Tier 2 處理斷線與重跑（durable execution）；Tier 3 管執行邊界與 context；Tier 4 做協調（handoff／supervision）；Tier 5 收在信任面與自己的最小 stack。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 先看清楚 harness 這層

1. **[Agent 是 LLM 加上 harness](nodes/agent-is-llm-plus-harness.md)**
   - Goal: 用「LLM + harness」解釋為什麼同一個模型結果差很多，並指出本課要補的七個能力。
2. **[工具是 agent 的 runbook](nodes/tools-are-the-runbook.md)**
   - Goal: 寫出 tool 的 description／schema／execute，並說出為什麼不可逆工具交給 naive harness 會出事。
3. **[Harness runtime：把 loop 攤開](nodes/harness-runtime.md)**
   - Goal: 用 `streamText` + `maxSteps` 寫出回合迴圈、把串流 chunk 變成事件，並指出 demo 的重複送信與未經核准呼叫。

### Tier 2 — 斷線與重跑

4. **[斷線就失憶：把事件寫進資料庫](nodes/durable-event-log.md)**
   - Goal: 說出 checkpoint／replay／idempotency，並把 in-memory bus 換成先落地再廣播的 Postgres bus。
5. **[重跑就重複扣款：把副作用包進 step](nodes/side-effects-in-steps.md)**
   - Goal: 移除 AI SDK 的 `execute`、自己跑工具，把 tool call 與 emit 包成 `runStep`，示範重跑不會重打 LLM。
6. **[重啟之後，從哪一行接回來](nodes/reconnect-after-restart.md)**
   - Goal: 啟動 DBOS、以 workflow ID 接回、client 重連時 replay 事件，並實際殺掉 server 驗證。

### Tier 3 — 邊界與 context

7. **[模型寫的程式，跑在哪裡](nodes/where-model-code-runs.md)**
   - Goal: 寫出 `runInSandbox`、說出 `vm` 不是真沙箱，並用 code mode 算對退款金額。
8. **[聊越久它越笨：hydration 與 compaction](nodes/hydrate-and-compact.md)**
   - Goal: 分開 history／state／context，用 token 預算做以 turn 為單位的壓縮，並在 log 看到 `MemoryCompacted`。

### Tier 4 — 協調

9. **[把控制權交出去：handoff](nodes/hand-off-control.md)**
   - Goal: 說出 handoff ≠ subagent，實作 runtime 攔截 handoff、切換 agent、補對應 tool result。
10. **[先計畫，再平行派人：supervision](nodes/plan-then-fan-out.md)**
    - Goal: 產出 schema-backed plan、`allSettled` 平行 fan-out、部分失敗時 degrade 再 synthesize。

### Tier 5 — 信任與收束

11. **[要等人三天：human-in-the-loop](nodes/wait-for-human.md)**
    - Goal: 在 harness 層實作 needs-approval 對照表與 `DBOS.recv`／`DBOS.send` 的暫停恢復，並收束自己的最小 stack。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

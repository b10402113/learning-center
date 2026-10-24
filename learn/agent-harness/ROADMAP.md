---
subject: agent-harness
status: confirmed
path: systems
created: 2026-10-24
updated: 2026-10-24
---

# ROADMAP — agent-harness

## Goal

能自己寫出一個最小但可運作的 harness 骨架：agent 迴圈、durable 重啟、工具執行邊界、context 壓縮，並能用它解釋為什麼 demo 可以、production 會死。不是背名詞，是能指著程式碼說出「這一行斷掉之後，狀態去哪裡了」。

## Learning path

**Systems / architecture** — 把 harness 當成一個由多個平面組成的系統來拆：控制面（runtime 迴圈）、執行面（tools 與 sandbox）、狀態面（event log 與 checkpoint）、context 面（memory）、編排面（routing 與 supervision）、人類面（approval），最後是可觀測性與 production 營運。

這條路徑最佳化的是「介面與責任邊界」：每個節點先問這個平面負責什麼、跟誰交換什麼，再往下看實作。它適合想自己設計 harness、而不只是照課打一遍的人。

Tier 1 先建立整體系統觀；Tier 2 拆核心平面（控制、執行、狀態、durability）；Tier 3 進入專用平面（sandbox、memory、routing、supervision、approval）；Tier 4 收束到 production 與可觀測性。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 系統全貌

1. **[Harness 是一個系統，不是一個迴圈](nodes/what-a-harness-is.md)**
   - Goal: 用控制面、狀態面、執行面、context 面拆開 agent 系統，並說出 demo 與 production 的差異。

### Tier 2 — 核心平面

2. **[Runtime：一回合的控制平面](nodes/runtime-control-loop.md)**
   - Goal: 追出一則 user 訊息如何變成 model turn、tool call 與 UI 事件，並指出迴圈的終止條件。

3. **[Tools：Harness 拿回執行權](nodes/execution-boundary-tools.md)**
   - Goal: 區分 tool schema 與執行，說明為什麼 execute 必須由 harness 掌控。

4. **[Event log：系統的狀態面](nodes/durable-event-log.md)**
   - Goal: 說明事件如何先落 Postgres 再廣播，並用 seq 與 replay 重建斷線後的時間軸。

5. **[Workflow：把不該重跑的事包成 step](nodes/durable-workflow-checkpoints.md)**
   - Goal: 判斷哪些動作必須 durable，並解釋 recovery 為什麼會重跑 workflow body。

### Tier 3 — 專用平面

6. **[Sandbox：不可信程式的執行邊界](nodes/sandbox-code-mode.md)**
   - Goal: 用 code mode 解釋為什麼要跑模型寫的程式，並說出 vm 沙箱擋得住與擋不住什麼。

7. **[Memory：History、State、Context 三層](nodes/context-memory-plane.md)**
   - Goal: 分辨 history/state/context，並實作以 token 預算觸發的 compaction。

8. **[Routing：Agent 是資料，handoff 是控制轉移](nodes/agent-routing-handoff.md)**
   - Goal: 把 agent 定義成 name + prompt + tools，並在 runtime 攔截 handoff 完成換手。

9. **[Supervision：Plan、Fan-out、Fan-in](nodes/supervisor-subagents.md)**
   - Goal: 用 plan 與 Promise.allSettled 平行派工，並讓單一 sub-agent 失敗不拖垮 workflow。

10. **[Approval：人類等待是一種 durable state](nodes/human-approval.md)**
    - Goal: 用 DBOS recv/send 讓 workflow 停在審批點，重啟後仍能續行。

### Tier 4 — 營運與收束

11. **[Production：可觀測性、託管邊界與 evals](nodes/production-and-observability.md)**
    - Goal: 從 inspector 事件流讀出系統行為，並列出上 production 還缺什麼。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

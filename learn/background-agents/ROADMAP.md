---
subject: background-agents
status: draft
path: concept-first
created: 2026-10-27
updated: 2026-10-27
---

# ROADMAP — background-agents

## Goal

能從零建出一個可運作的背景 agent harness：事件觸發開 run、觀察現況、選動作、需要時暫停等待、被人工或事件喚醒後接回、安全重試、最後自我驗證完成；並且能指著每個 step 說出「這裡斷掉之後，狀態去哪裡」。以課程的 incident-response agent 為載體，最後能把同一套模式換成自己的場景。

## Learning path

**Concept-first（概念優先）** — 先建立心智模型，再學運作規則，最後才動手收斂。

這條路徑最佳化的是「先懂為什麼，再寫 code」：Tier 1 先把 background agent 的兩個根基釘死——它是 LLM + harness + durable runtime，而不是一段對話；它的輸入是狀態快照、輸出是受目錄約束的動作，目標是機械可驗證的條件。Tier 2 再把五個機制各自展開成規則（step/checkpoint、run 生命週期、等待、人工閘門、安全重試），每個都綁在 incident-response agent 的具體檔案與錯誤上。Tier 3 沿一個 run 的一生把機制連成圖，並換到自己的場景。

它適合想先拿到整張地圖、再逐塊填實作的人。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型

1. **[Background agent 是什麼：LLM + harness + durable runtime](nodes/what-is-a-background-agent.md)**
   - Goal: 能用「LLM + harness + durable runtime」解釋 background agent，說出它和 chat agent 的差別，以及為什麼「需不需要核准」不能交給 LLM。

2. **[Agent 眼中的世界與目標](nodes/the-world-and-the-goal.md)**
   - Goal: 說出 agent 做決策時真正看到什麼（world state 快照、run state、execution history），以及目標是機械可驗證的 GoalCondition、動作目錄為什麼很小。

### Tier 2 — 運作規則與機制

3. **[Durable execution：把 loop 拆成 step](nodes/durable-execution-steps.md)**
   - Goal: 解釋為什麼要把 loop 拆成 step、replay 的真相（memoize 而非重播 stack），以及 deterministic workflow + idempotent step 兩條規則。

4. **[Run 的生命週期與資料模型](nodes/run-lifecycle.md)**
   - Goal: 說出 run 是什麼、eventSequence 的角色、schema 核心表，以及 business state 與 workflow state 的區別。

5. **[等待與事件關聯：醒來之後接回](nodes/wait-and-resume.md)**
   - Goal: 用「event 是門鈴不是快照」解釋醒來為何要重讀 state，以及 waitForEvent + eventSequence 對帳、timeout、resume。

6. **[Human-in-the-loop：inbox 與 approval](nodes/human-in-the-loop.md)**
   - Goal: 說出 inbox 為何是背景 agent 的介面、proposal 持久化 → correlated wait → 重讀 → 重驗 → 執行，以及 approval 是 harness 的確定性邏輯（不讓 agent 知道）。

7. **[安全重試與 idempotency](nodes/safe-retries-idempotency.md)**
   - Goal: 說出為何拆 step 不夠、還需要 idempotency key 與 derived action ID、expectedVersion 最後柵欄、cancelOn 與 lost-ack。

### Tier 3 — 實作收斂

8. **[Capstone：把模式換成自己的場景](nodes/capstone-own-harness.md)**
   - Goal: 沿一個 run 的完整生命週期做整合驗證，並能把 durable runtime 選型與權限邊界套到自己的背景工作流程。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

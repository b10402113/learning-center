---
subject: background-agent
status: confirmed
path: concept-first
created: 2026-11-05
---

# ROADMAP — background-agent

## Goal

用 TypeScript 與 Inngest 建出會自己醒來、能等待、能請人批准、能安全重試的事件代理；重點不是模型，而是它周圍的 harness 與耐久執行。

## Learning path

**Concept-first**：先建立「背景代理 = standing goal + harness + durable runtime」的心智模型，再學操作規則（迴圈、step、事件、權威、重試），最後才進實驗室演練與評估。這個順序最佳化的是遷移能力：讀完之後能推理任何耐久代理，而不只是複製這個 repo。Tier 1 建立模型，Tier 2 把模型變成可執行的規則，Tier 3 用四個故障情境驗證並推向生產化。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes background-agent/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型

1. **[打造不會睡的 AI 代理](nodes/build-agents-that-never-sleep.md)**
   - Goal: 能用 standing goal、durability 與 operator inbox 說明背景代理和聊天代理的差別。
2. **[給代理一個目標](nodes/give-the-agent-a-goal.md)**
   - Goal: 能畫出 observe → decide → act 迴圈，並指出 harness 擁有工具目錄、決策上限與完成判定。
3. **[世界就是被觀察的服務狀態](nodes/world-is-observed-state.md)**
   - Goal: 能說明事件 payload 不是快照，並列出 checkout 的四種故障模式與操作契約。
4. **[權威問題：誰說了算](nodes/the-authority-question.md)**
   - Goal: 能區分模型、harness、service、人類的權限，並解釋為何不能讓 LLM 自己判斷要不要問人。
5. **[兩個時鐘、兩個存放區](nodes/two-clocks-two-stores.md)**
   - Goal: 能分清 world state、run state、execution history，以及 Postgres 與 Inngest 各存什麼。

### Tier 2 — 操作規則與實驗室

6. **[設定：三個程序與故障注入](nodes/setup-three-processes.md)**
   - Goal: 能從乾淨 repo 啟動 checkout、operator、agent 三個程序，並用 fault flags 造出可觀察的事件。
7. **[第一個可跑的迴圈](nodes/first-runnable-loop.md)**
   - Goal: 能實作 observe → 目標檢查 → chooseAction → 執行，並用決策上限收尾。
8. **[讓進度可持久](nodes/make-progress-durable.md)**
   - Goal: 能解釋 replay 為何跳過已完成 step，並說明 workflow body 必須確定性、step 必須幂等。
9. **[把迴圈拆成獨立步驟](nodes/split-the-loop-into-steps.md)**
   - Goal: 能替觀察、決策、行動各建 step，並用 cycle 編號讓重播對得上。
10. **[等待世界改變](nodes/wait-for-the-world.md)**
    - Goal: 能說明事件只負責喚醒、醒來必須重讀狀態，並用 waitForEvent + eventSequence 避免漏接。
11. **[等待迴圈](nodes/the-waiting-loop.md)**
    - Goal: 能實作可重播的等待迴圈，並用同一個 run 完成 wait → 醒來 → 重新觀察 → 完成。
12. **[讓人類掌握控制權](nodes/put-a-human-in-control.md)**
    - Goal: 能實作 propose → wait → 重讀 → 重驗版本的批准流程，並處理 stale approval。
13. **[讓重試安全](nodes/make-retries-safe.md)**
    - Goal: 能用 derived action ID 與 expectedVersion，讓「效果已落地但回應遺失」的重試不重複執行。
14. **[求助並交接](nodes/ask-for-help-and-hand-off.md)**
    - Goal: 能實作 request_help 的暫停與恢復，並說明人的回答是上下文、不是世界已恢復的證據。

### Tier 3 — 演練、評估與生產化

15. **[事件演練：四個 trial](nodes/incident-drill.md)**
    - Goal: 能跑完 feature、release、retry、dependency 四場演練，並用 world outcome、action trajectory、human boundary 判定成敗。
16. **[評估工作，不只是最後一句話](nodes/evaluate-the-work.md)**
    - Goal: 能分開評估世界狀態、行動軌跡與人類邊界，並在報告漂亮但路徑錯誤時正確歸因。
17. **[耐久執行是靈魂，不是全部](nodes/durable-execution-is-the-soul.md)**
    - Goal: 能選一個 durable runtime，說出它沒解決的周邊問題，並把同一個 harness 轉移到 email 或 coding agent。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

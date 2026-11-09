---
subject: background-agent
status: confirmed
path: workshop-order
created: 2026-11-09
---

# ROADMAP — background-agent

## Goal

用 TypeScript 與 Inngest 建出會自己醒來、能等待、能請人批准、能安全重試的事件代理；重點不是模型，而是它周圍的 harness 與耐久執行。

## Learning path

**Workshop order（課程順序）**：照原始課程的弧線走，先建立背景代理的心智模型與實驗室，再依六堂課的實作順序前進：目標與迴圈 → 耐久步驟 → 等待世界 → 人類核准 → 安全重試 → 求助交接，最後用 capstone 四場 trial 驗收。這個順序最佳化的是「照著課程真的做得出來」：每個節點都假設前一個節點的程式與心智模型已經在手，範例、分支與故障注入都沿用課程原始安排。Tier 1 建模型與環境，Tier 2 完成第一個迴圈並把它耐久化，Tier 3 補上等待、授權、重試與求助，Tier 4 用演練與評估收尾。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes background-agent/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型與實驗室

1. **[打造不會睡的 AI 代理](nodes/build-agents-that-never-sleep.md)**
   - Goal: 能用 standing goal、lifecycle、harness 與 inbox 說明背景代理和聊天代理的差別，並說出課程要蓋什麼。
2. **[課程專案設定](nodes/course-project-setup.md)**
   - Goal: 能從乾淨 repo 啟動 checkout、operator、agent 三個程序，用 fault flags 造出可觀察的事件，並跑過 preflight/db:seed。

### Tier 2 — 第一個迴圈與耐久化

3. **[給代理一個目標](nodes/give-the-agent-a-goal.md)**
   - Goal: 能建立 goal + harness 的 observe → decide → act 骨架，並用結構化輸出取得一次決策。
4. **[自訂工具迴圈](nodes/custom-tool-loop.md)**
   - Goal: 能觀察一次真實 run 的 observe → predict → act 軌跡，並用 Inngest dashboard 與資料庫解釋它為何重複行動、停在決策上限。
5. **[讓進度可持久](nodes/make-progress-durable.md)**
   - Goal: 能說明 replay/memoization 與 workflow 確定性，並把迴圈拆成具名 durable steps。
6. **[決策、特例與行動執行](nodes/decisions-special-cases-and-actions.md)**
   - Goal: 能把 LLM 決策包成 step、處理 complete/wait/help 特例，並用 idempotency 執行 action。

### Tier 3 — 等待、授權、重試與求助

7. **[等待世界](nodes/wait-for-the-world.md)**
   - Goal: 能用 waitForEvent + eventSequence 讓同一個 run 等待、醒來、重新觀察並完成，並跑過 dependency fault 測試。
8. **[讓人類掌握控制權](nodes/put-a-human-in-control.md)**
   - Goal: 能實作 propose → wait → 重讀 → 重驗版本的核准流程，並處理 stale approval 與 rejection。
9. **[測試人類介入流程](nodes/test-human-in-the-loop.md)**
   - Goal: 能從 inbox 核准 rollback、讀 audit log，並解釋 durable suspension 與 resume 機制。
10. **[讓重試安全](nodes/make-retries-safe.md)**
    - Goal: 能用 derived action ID、expectedVersion 與 cancelOn，讓遺失回應的重試不重複執行效果。
11. **[求助並交接](nodes/ask-for-help-and-hand-off.md)**
    - Goal: 能實作 request_help 的暫停、回答與 resume，並說明人的回答是上下文、不是世界已恢復的證據。

### Tier 4 — 演練與評估

12. **[專題演練：你能信任這個事件代理嗎？](nodes/trust-this-incident-agent.md)**
    - Goal: 能跑完 feature / release / lost-response / dependency 四場 trial，並用 world outcome、action trajectory、human boundary 判定成敗。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

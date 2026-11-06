---
subject: ai-agent-workflows
status: draft
path: concept-first
created: 2026-11-05
---

# ROADMAP — ai-agent-workflows

## Goal

none

## Learning path

Concept-first: 先建立「盒子與箭頭」的控制權心智模型，再看 agent 的配備（tools、MCP、skills）與知識供給（RAG、context、memory），接著依控制權由少到多走一遍 workflows、single-agent systems、multi-agent systems，最後用 evaluations 把選型收回來。Tier 1 建立心智模型，Tier 2 補知識與 context，Tier 3–5 依「誰畫箭頭」分層，Tier 6 用評估與成績單收束。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型

1. **[Reasoning LLM 與 agent：誰來畫箭頭](nodes/reasoning-llm-vs-agent.md)**
   - Goal: 用盒子與箭頭說明 LLM、workflow、agent 的差別，並說出控制權與可靠度、成本的取捨。

2. **[Agent 能做什麼：tools、MCP 與 skills](nodes/tools-mcp-skills.md)**
   - Goal: 判斷一個能力該做成 tool、MCP server 還是 skill，並寫出模型看得懂的 tool metadata。

### Tier 2 — 知識與 context

3. **[RAG、context 與 agent memory](nodes/rag-context-memory.md)**
   - Goal: 設計在有限 context 內取用外部知識與記憶的 agent，並說出 RAG、compaction、長期記憶的取捨。

### Tier 3 — Workflows：開發者畫箭頭

4. **[Prompt chaining 與 routing](nodes/prompt-chaining-routing.md)**
   - Goal: 把可拆解的任務寫成 chain 或 routing 的程式碼，並在步驟之間放 gate。

5. **[Parallelization 與其他 workflows：workflows 成績單](nodes/parallelization-workflows-scorecard.md)**
   - Goal: 選出正確的 workflow 形狀（sectioning／voting／evaluator-optimizer／orchestrator-workers），並用三欄成績單說明選擇。

### Tier 4 — Single-agent：模型畫箭頭

6. **[Single-agent 系統：ReAct 與 plan-and-execute](nodes/react-plan-execute.md)**
   - Goal: 實作有停止條件的 ReAct 迴圈，並判斷何時改用 plan-and-execute。

7. **[Reflexion、CodeAct 與 single-agent 成績單](nodes/reflexion-codeact-scorecard.md)**
   - Goal: 用外部訊號替單一 agent 加上反思迴圈，並說明它相對 workflow 的代價。

### Tier 5 — Multi-agent

8. **[Sequential 與 parallel multi-agent](nodes/sequential-parallel-multi-agent.md)**
   - Goal: 把單一 agent 組成 fixed pipeline 或 fan-out／merge，並說出交接物件與合併步驟的失敗模式。

9. **[動態編排：supervisor、dispatcher、evaluator-optimizer、peer-to-peer](nodes/dynamic-orchestration.md)**
   - Goal: 依「誰決定下一個 agent」選出四種拓撲之一，並用成本與可除錯性說明理由。

### Tier 6 — 評估

10. **[Evaluations 與選型](nodes/evaluations-and-selection.md)**
    - Goal: 為自己的場景設計最小 eval，並用 pass@k／pass^k 與成績單選出最簡單可用的系統。

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written

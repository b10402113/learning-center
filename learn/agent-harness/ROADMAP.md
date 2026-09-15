---
subject: agent-harness
status: draft
path: practice-first
created: 2026-09-15
---

# ROADMAP — agent-harness

## Goal

用 TypeScript 從零打造並掌握一個持久化的 agent harness，逐一補上每個能力——durable execution、sandbox/code mode、memory compaction、handoff、階層式監督 sub-agents、durable human-in-the-loop——不只跑得起來，還能擴充它。真正的收穫是能把同一套模式在自己的 runtime（OryxOS / Java）上重新推導，而不只是讀懂 TS 版；並附帶長出 harness 判斷力：看到一個 agent 產品或故障，能說出需要哪一層 harness、何時該自建、何時用 Claude Code。

## Learning path

**實作優先（practice-first）。** 角度：從壞掉的最小 agent 出發，沿課程的建構順序一層層補上 harness，每一步都留下一個能跑的成品。每個節點以「痛點 → 故障 → harness 補上哪層 → 實跑 → 生產現實」的節奏推進，所以判斷力是從動手過程中長出來的，而不是先講理論。

它優化的是動能與可遷移性：學完手上有一個真的 harness，且每一層都能對照回自己的 runtime（OryxOS / Java）。Tier 由一般到具體：Tier 1 心智模型 → Tier 2 核心迴圈與工具 → Tier 3 持久化執行 → Tier 4 沙箱與 Code Mode → Tier 5 記憶 → Tier 6 路由與編排 → Tier 7 信任與生產。深度在 `/nodes` 階段依每個節點的 `/probe` 結果校準，此處不標註。

## How to use

依序讀節點。每個節點是一個 step-DAG。先跑 `/probe agent-harness/<node-id>` 量測該節點，再跑 `/nodes agent-harness/<node-id>` 確認節點並展開它的 step-DAG，之後由 `/teach` 互動教學。

## Nodes

### Tier 1 — 心智模型

1. **[[learn/agent-harness/nodes/what-a-harness-is|什麼是 Agent Harness]]**
   - Goal: 建立「agent = LLM + harness」的心智模型，說得出裸迴圈的失敗模式，判斷何時該用 Claude Code、何時自建，並看懂課程專案與 inspector 的驗證面。
   - Sources:
     - [[sources/agent-harness/20260915/0-introduction.txt#course-framing-and-motivation]]
     - [[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#defining-the-harness]]
     - [[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#harness-components]]
     - [[sources/agent-harness/20260915/2-course-project-setup.txt#running-the-app]]
     - [[sources/agent-harness/20260915/harness-engineering/README.md]]

### Tier 2 — 核心迴圈與工具

2. **[[learn/agent-harness/nodes/tools-and-agent-contract|工具與 Agent 的契約]]**
   - Goal: 用 AI SDK 的 `tool()` 定義工具（description + Zod schema + execute），做出 KB 檢索與 classify/draft/send 工具與 system prompt，並解釋為何護欄不能只寫在 prompt 裡。
   - Sources:
     - [[sources/agent-harness/20260915/3-agent-tools-setup.txt#anatomy-of-an-agent-loop]]
     - [[sources/agent-harness/20260915/3-agent-tools-setup.txt#why-the-naive-loop-fails]]
     - [[sources/agent-harness/20260915/3-agent-tools-setup.txt#search-knowledge-base-tool]]
     - [[sources/agent-harness/20260915/4-classify-reply-tools.txt#classify-item-tool]]
     - [[sources/agent-harness/20260915/4-classify-reply-tools.txt#send-reply-tool]]
     - [[sources/agent-harness/20260915/4-classify-reply-tools.txt#system-prompt]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/tools.ts]]

3. **[[learn/agent-harness/nodes/harness-runtime-loop|Harness Runtime 迴圈]]**
   - Goal: 寫出 harness 自己擁有的 agent loop——messages 陣列、maxSteps、`streamText`、stream part 轉事件、工具呼叫語意與串流必要性——並用 dry run 看見裸迴圈的缺口。
   - Sources:
     - [[sources/agent-harness/20260915/5-harness-runtime.txt#message-array-construction]]
     - [[sources/agent-harness/20260915/5-harness-runtime.txt#stream-part-types-and-events]]
     - [[sources/agent-harness/20260915/5-harness-runtime.txt#tool-calling-semantics]]
     - [[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#appending-model-responses]]
     - [[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#dry-run-and-inspector]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/runtime.ts]]

### Tier 3 — 持久化執行

4. **[[learn/agent-harness/nodes/why-durable-execution|為什麼需要持久化執行]]**
   - Goal: 說清楚 client 無關性與崩潰存活的需求，用冪等／exactly-once 解釋不可逆動作為何不能重跑，並比較 DBOS 與其他工作流引擎、取得 Postgres。
   - Sources:
     - [[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#what-is-durable-execution]]
     - [[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#cicd-as-distributed-analogy]]
     - [[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#why-the-agent-needs-durability]]
     - [[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#dbos-and-postgres-durable-stores]]

5. **[[learn/agent-harness/nodes/making-the-loop-durable|讓迴圈持久化]]**
   - Goal: 建 event_log + Drizzle client + durable bus，把 model turn、tool call、emit 包成 DBOS steps 並註冊 workflow，接上 server 與 history replay，完成「殺掉 server 重啟後續跑」的示範。
   - Sources:
     - [[sources/agent-harness/20260915/8-implementing-durable-execution.txt#event-log-table-schema]]
     - [[sources/agent-harness/20260915/8-implementing-durable-execution.txt#durable-bus-subscribe-emit-history]]
     - [[sources/agent-harness/20260915/9-durable-tools.txt#model-turn-function]]
     - [[sources/agent-harness/20260915/9-durable-tools.txt#tool-step-function]]
     - [[sources/agent-harness/20260915/10-durable-agent-loop.txt#register-workflow]]
     - [[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#submit-task-starts-workflow]]
     - [[sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt#history-replay]]
     - [[sources/agent-harness/20260915/12-durable-execution-recap.txt#recap-runtime-unchanged]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/db.ts]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/bus.ts]]
     - [[sources/agent-harness/20260915/harness-engineering/server/index.ts]]

### Tier 4 — 沙箱與 Code Mode

6. **[[learn/agent-harness/nodes/sandboxed-code-mode|沙箱與 Code Mode]]**
   - Goal: 用 `node:vm` 實作 `runInSandbox`（注入 API/console、async IIFE、timeout race）並接上 `run_code` 工具，讓 agent 以一段程式取代多次工具往返；同時指出 `vm` 不是真正的安全邊界。
   - Sources:
     - [[sources/agent-harness/20260915/13-code-mode-security.txt#code-mode-explained]]
     - [[sources/agent-harness/20260915/13-code-mode-security.txt#isolation-and-sandbox-products]]
     - [[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#run-in-sandbox-signature]]
     - [[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#context-tools-and-console]]
     - [[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#execution-timeout-result]]
     - [[sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt#sandbox-api-charges-kb]]
     - [[sources/agent-harness/20260915/15-updating-the-system-prompt.txt#why-code-beats-inference]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/sandbox.ts]]
     - [[sources/agent-harness/20260915/harness-engineering/scripts/test-sandbox.ts]]

### Tier 5 — 記憶

7. **[[learn/agent-harness/nodes/memory-hydration-compaction|記憶：脈絡注入與壓縮]]**
   - Goal: 區分 History / State / Context，做出 token 估算器、`buildContext` 與 LLM summarizer，把壓縮以 turn 為單位接進 runtime 並包成 durable step，用 `memory_compacted` 事件驗證。
   - Sources:
     - [[sources/agent-harness/20260915/16-memory-context-hydration.txt#estimate-tokens]]
     - [[sources/agent-harness/20260915/16-memory-context-hydration.txt#build-context]]
     - [[sources/agent-harness/20260915/16-memory-context-hydration.txt#summarize-function]]
     - [[sources/agent-harness/20260915/17-summarization-compaction.txt#turn-based-sliding-window]]
     - [[sources/agent-harness/20260915/17-summarization-compaction.txt#durable-summarize-step]]
     - [[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#observing-compaction]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/memory.ts]]

### Tier 6 — 路由與編排

8. **[[learn/agent-harness/nodes/handoffs-and-routing|Handoff 與 Agent 路由]]**
   - Goal: 判斷何時該拆 agent（避開 swarm 陷阱），把 agent 變成資料（name + systemPrompt + toolSet），用 runtime 攔截 handoff 做控制權橫向轉移，示範 triage → billing 與最小權限。
   - Sources:
     - [[sources/agent-harness/20260915/19-agent-handoffs.txt#handoff-vs-subagent]]
     - [[sources/agent-harness/20260915/19-agent-handoffs.txt#agent-primitive]]
     - [[sources/agent-harness/20260915/19-agent-handoffs.txt#triage-agent]]
     - [[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#runtime-level-handoff-handling]]
     - [[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#issue-refund-tool]]
     - [[sources/agent-harness/20260915/21-agent-triage-handoff.txt#intercept-handoff-call]]
     - [[sources/agent-harness/20260915/21-agent-triage-handoff.txt#handoff-event-and-agent-swap]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/agents.ts]]

9. **[[learn/agent-harness/nodes/hierarchical-supervision|階層式監督與 Sub-agents]]**
   - Goal: 用 supervisor 完成 plan → 平行 dispatch 唯讀 investigators → allSettled fan-in → synthesize，把 plan 當第一級持久化產物，用 `generateObject` 取結構化輸出並容忍子 agent 失敗。
   - Sources:
     - [[sources/agent-harness/20260915/22-supervision-with-subagents.txt#plan-mode-artifact]]
     - [[sources/agent-harness/20260915/22-supervision-with-subagents.txt#investigator-registry]]
     - [[sources/agent-harness/20260915/23-supervisor-workflow.txt#structured-outputs]]
     - [[sources/agent-harness/20260915/23-supervisor-workflow.txt#supervisor-workflow-scaffold]]
     - [[sources/agent-harness/20260915/24-dispatching-subagents.txt#handling-settled-results]]
     - [[sources/agent-harness/20260915/24-dispatching-subagents.txt#supervised-mode-routing]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/supervisor.ts]]
     - [[sources/agent-harness/20260915/harness-engineering/harness/investigators.ts]]

### Tier 7 — 信任與生產

10. **[[learn/agent-harness/nodes/human-in-the-loop|Human-in-the-Loop 審批]]**
    - Goal: 把審批做成 harness 層的決定性機制（不靠 LLM 求情），用 DBOS `recv`/`send` 實作可無限期暫停與恢復的 approval gate，並接上 UI 批准流程。
    - Sources:
      - [[sources/agent-harness/20260915/25-human-in-the-loop.txt#deterministic-approvals]]
      - [[sources/agent-harness/20260915/25-human-in-the-loop.txt#dbos-pause-resume]]
      - [[sources/agent-harness/20260915/25-human-in-the-loop.txt#approval-exercise]]
      - [[sources/agent-harness/20260915/harness-engineering/harness/runtime.ts]]
      - [[sources/agent-harness/20260915/harness-engineering/server/index.ts]]

11. **[[learn/agent-harness/nodes/production-harness|生產級 Harness 與下一步]]**
    - Goal: 收斂 chat agent 的最小 harness 清單（tool calling + 自己掌握記憶 + 壓縮），判斷哪些能力是 table stakes、哪些 situational，並理解 durable 解耦、infinite/background agent 與 inbox、託管沙箱與 eval。
    - Sources:
      - [[sources/agent-harness/20260915/26-wrapping-up.txt#minimum-harness-stack]]
      - [[sources/agent-harness/20260915/26-wrapping-up.txt#infinite-background-agents]]
      - [[sources/agent-harness/20260915/26-wrapping-up.txt#sandboxing-resources]]
      - [[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#what-to-prioritize]]
      - [[sources/agent-harness/20260915/0-introduction.txt#claude-code-vs-programmatic-agents]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written

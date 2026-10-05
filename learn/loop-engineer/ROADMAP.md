---
subject: loop-engineer
status: confirmed
path: practice-first
created: 2026-10-03
---

# ROADMAP — loop-engineer

## Goal

把散落在 OryxOS、agent-harness、Claude Code 日常使用裡的 loop 經驗，收斂成一套可複製的工程準則，並能用固定契約（goal / evidence / tools / state / guardrails / termination）設計、實作、驗證一個可上線的 **issue-resolution agent**。兩份 mock exam 當 readiness gate；決策框架（看到 agent 產品或故障能說出缺哪層 loop control、該 approve/fix/escalate）是副產品。

## Learning path

**practice-first（實作優先）**。先用最小可跑的 loop 建立手感，再按「痛點到了才補概念」的節奏往外長：工具與容錯 → 狀態與 context → 控制與驗證 → 規模化與 Claude Code 實作 → 生產監管與交付。每一層都是前一層跑起來後自然撞到的需求，concept 在做的脈絡裡補。最適靠動手維持動能、不想先讀完整理論的人。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe loop-engineer/<node-id>` to measure a node, then `/nodes loop-engineer/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 先把最小 loop 跑起來

1. **[[learn/loop-engineer/nodes/loop-foundations|Loop Engineering 基礎與四層堆疊]]**
   - Goal: 說出 loop 的核心循環，並分清 model / harness / tools / execution environment 四層的邊界與何時該用 agent。
   - Sources:
     - [[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/1. What Is Loop Engineering.en.srt#what-is-loop-engineering]]
     - [[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/2. Single LLM Call vs. Agentic Loop.en.srt#single-llm-call-vs-agentic-loop]]
     - [[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/4. Models, Harnesses, Tools, and Execution Environments.en.srt#models-harnesses-tools-execution-environments]]
     - [[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/5. When to Use an Agent—and When Not To.en.srt#when-to-use-an-agent-and-when-not-to]]

2. **[[learn/loop-engineer/nodes/minimal-loop-and-goals|最小可執行 Loop 與 Goal 契約]]**
   - Goal: 寫出並跑起一個四階段最小控制迴圈，並把模糊需求寫成可驗收的 goal 契約。
   - Sources:
     - [[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/3. Goal–Act–Observe–Evaluate.en.srt#goal-act-observe-evaluate]]
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/7. Design a Minimal Executable Loop.en.srt#design-a-minimal-executable-loop]]
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/8. Define Goals and Completion Criteria.en.srt#define-goals-and-completion-criteria]]

3. **[[learn/loop-engineer/nodes/first-labs|入門實作：Tool Dispatcher 與 Loop Map]]**
   - Goal: 動手把 tool call 接進 loop，並端到端追蹤一個 agent loop 的 goal→completion 路徑。
   - Sources:
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/1. Build a Python Tool Dispatcher.html#build-a-python-tool-dispatcher]]
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/9. Tool Calling as Agent Action.en.srt#tool-calling-as-agent-action]]
     - [[sources/loop-engineer/20261003/1 - Understand the Agentic Loop/6. Lab Map an Agent Loop from Goal to Completion.html#lab-map-an-agent-loop]]
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/2. Agent Loops and Tool Calling.html#agent-loops-and-tool-calling]]

### Tier 2 — 讓 loop 可靠、記得住

4. **[[learn/loop-engineer/nodes/tools-and-schemas|Tool Schema 設計與邊界驗證]]**
   - Goal: 寫出可穩定選用與驗證的 tool schema，並在工具邊界前後各設一道驗證。
   - Sources:
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/10. Design Clear Tool Schemas.en.srt#design-clear-tool-schemas]]
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/11. Validate Tool Requests and Results.en.srt#validate-tool-requests-and-results]]

5. **[[learn/loop-engineer/nodes/failure-handling-lab|容錯與 Test–Fix–Retest Lab]]**
   - Goal: 把失敗視為正常，設計 detect→classify→recover→verify 路徑，做出以測試證據收尾的修復 agent。
   - Sources:
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/12. Handle Errors, Timeouts, and Retries.en.srt#handle-errors-timeouts-and-retries]]
     - [[sources/loop-engineer/20261003/2 - Build a Tool-Using Agent/13. Lab Build a Test–Fix–Retest Agent.html#lab-build-a-test-fix-retest-agent]]

6. **[[learn/loop-engineer/nodes/state-memory-checkpoint|State、Memory 與 Checkpoint／Resume]]**
   - Goal: 分清執行期 state 與跨執行 memory，讓 run 中斷後能從確認點安全續跑且不重工。
   - Sources:
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/14. Working State vs. Long-Term Memory.en.srt#working-state-vs-long-term-memory]]
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/15. Preserve Progress Across Iterations.en.srt#preserve-progress-across-iterations]]
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/16. Checkpoint, Resume, and Prevent Duplicate Actions.en.srt#checkpoint-resume-and-prevent-duplicate-actions]]
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/2. Resume an Agent Without Repeating Work.html#resume-an-agent-without-repeating-work]]
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/3. State, Memory, and Context.html#state-memory-and-context]]

7. **[[learn/loop-engineer/nodes/context-management|Context 預算、壓縮與防漂移]]**
   - Goal: 在固定 context 預算內挑對資訊，用摘要／壓縮／檢索維持長 loop 聚焦，並防止需求漂移。
   - Sources:
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/17. Context Budgets and Information Prioritization.en.srt#context-budgets-and-information-prioritization]]
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/18. Summarization, Compaction, and Retrieval.en.srt#summarization-compaction-and-retrieval]]
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/19. Prevent Context Drift and Lost Requirements.en.srt#prevent-context-drift-and-lost-requirements]]
     - [[sources/loop-engineer/20261003/3 - Manage State, Memory, and Context/20. Lab Recover an Interrupted Agent Run.html#lab-recover-an-interrupted-agent-run]]

### Tier 3 — 讓 loop 收得住、值得信

8. **[[learn/loop-engineer/nodes/loop-control-and-termination|迴圈控制與終止]]**
   - Goal: 用四態結束、budgets 與非進展偵測，讓每個 loop 都停在明確且可審計的終點。
   - Sources:
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/21. Define Success, Failure, Blocked, and Escalated Outcomes.en.srt#define-success-failure-blocked-and-escalated-outcomes]]
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/22. Turn, Time, Token, and Cost Limits.en.srt#turn-time-token-and-cost-limits]]
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/23. Detect Repetition, Oscillation, and Non-Progress.en.srt#detect-repetition-oscillation-and-non-progress]]
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/3. Stop or Continue an Agent Loop.html#stop-or-continue-an-agent-loop]]
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/1. Stop, Continue, or Escalate an Agent Run.html#stop-continue-or-escalate-an-agent-run]]
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/4. Termination and Guardrails.html#termination-and-guardrails]]

9. **[[learn/loop-engineer/nodes/guardrails-and-approval|護欄與高風險核准]]**
   - Goal: 由 policy engine（而非 agent）決定 allow/ask/deny，並在不可逆動作前插入人類核准閘。
   - Sources:
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/24. Apply Tool Permissions and Action Boundaries.en.srt#apply-tool-permissions-and-action-boundaries]]
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/25. Add Input, Output, and Execution Guardrails.en.srt#add-input-output-and-execution-guardrails]]
     - [[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/26. Require Approval for High-Risk Actions.en.srt#require-approval-for-high-risk-actions]]

10. **[[learn/loop-engineer/nodes/evidence-and-verification|證據收尾與生成／驗證分離]]**
    - Goal: 用 evidence vault 對照驗收條件收尾，並讓 verifier 獨立、懷疑、以證據決策。
    - Sources:
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/27. Evidence-Based Completion.en.srt#evidence-based-completion]]
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/28. Use Tests, Linters, and Validators as Feedback.en.srt#tests-linters-validators-as-feedback]]
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/29. Separate Generation from Verification.en.srt#separate-generation-from-verification]]
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/30. Evaluator–Optimizer and Correction Loops.en.srt#evaluator-optimizer-correction-loops]]

11. **[[learn/loop-engineer/nodes/tracing-diagnosis-replay|Trace、診斷與重播修復]]**
    - Goal: 產出可重播的 trace，依域分類失敗並重播到根因做最小修補。
    - Sources:
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/31. Trace Decisions, Actions, and State Changes.en.srt#trace-decisions-actions-state]]
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/32. Diagnose Planning, Tool, Context, and Control Failures.en.srt#diagnose-planning-tool-context-control-failures]]
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/33. Replay and Repair Failed Runs.en.srt#replay-and-repair-failed-runs]]
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/34. Lab Debug a Faulty Agent Loop.html#lab-debug-a-faulty-agent-loop]]
      - [[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/5. Verification and Debugging.html#quiz-verification-and-debugging]]

### Tier 4 — 規模化與 Claude Code 實作

12. **[[learn/loop-engineer/nodes/one-agent-and-patterns|單代理判斷與協作模式]]**
    - Goal: 判斷何時一個 agent 就夠，並用 sub-agent / agent-as-tool / handoff 與 handoff contract 設計最小足夠的協作。
    - Sources:
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/35. When One Agent Is Enough.en.srt#when-one-agent-is-enough]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/36. Sub-Agent, Agent-as-Tool, and Handoff Patterns.en.srt#sub-agent-agent-as-tool-and-handoff-patterns]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/40. Create Clear Handoff Contracts.en.srt#create-clear-handoff-contracts]]

13. **[[learn/loop-engineer/nodes/orchestrator-routing-delegation|Orchestrator、路由與防 Delegation Loop]]**
    - Goal: 用 orchestrator–worker、平行聚合與專業路由組織多代理，並防 delegation loop 與衝突。
    - Sources:
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/37. Orchestrator–Worker Architecture.en.srt#orchestrator-worker-architecture]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/38. Parallel Work and Result Aggregation.en.srt#parallel-work-and-result-aggregation]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/39. Specialist Routing and Delegation.en.srt#specialist-routing-and-delegation]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/41. Prevent Delegation Loops and Conflicting Work.en.srt#prevent-delegation-loops-and-conflicting-work]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/4. Route Tasks to Specialist Workers.html#route-tasks-to-specialist-workers]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/2. Repair a Failed Agent Handoff.html#repair-a-failed-agent-handoff]]
      - [[sources/loop-engineer/20261003/6 - Design Multi-Agent Systems/6. Multi-Agent Patterns.html#multi-agent-patterns]]

14. **[[learn/loop-engineer/nodes/claude-code-loop-engineering|用 Claude Code 做 Loop Engineering]]**
    - Goal: 把 Claude Code 當受控執行環境，用 instructions/skills/MCP/sub-agents/worktrees/hooks/permissions 設計可治理的 loop。
    - Sources:
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/42. Claude Code as an Agentic Execution Environment.en.srt#claude-code-as-an-agentic-execution-environment]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/43. Guide Agent Behavior with Project Instructions.en.srt#guide-agent-behavior-with-project-instructions]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/44. Use Skills for Repeatable Procedures.en.srt#use-skills-for-repeatable-procedures]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/45. Extend Capabilities with Plugins and MCP.en.srt#extend-capabilities-with-plugins-and-mcp]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/46. Create Specialized Sub-Agents.en.srt#create-specialized-sub-agents]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/47. Isolate Parallel Work with Git Worktrees.en.srt#isolate-parallel-work-with-git-worktrees]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/48. Use Hooks and Automations.en.srt#use-hooks-and-automations]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/49. Manage Permissions and Dangerous Operations.en.srt#manage-permissions-and-dangerous-operations]]
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/7. Claude Code Loop Engineering.html#claude-code-loop-engineering-quiz]]

15. **[[learn/loop-engineer/nodes/issue-to-change-lab|Issue-to-Verified-Change Lab]]**
    - Goal: 動手把結構化 issue 轉成有範圍、可驗證、可回滾的程式變更。
    - Sources:
      - [[sources/loop-engineer/20261003/7 - Apply Loop Engineering with Claude Code/50. Lab Build an Issue-to-Verified-Change Workflow.html#lab-build-an-issue-to-verified-change-workflow]]

### Tier 5 — 上生產與交付

16. **[[learn/loop-engineer/nodes/human-oversight-and-approval|人類監督與核准閘]]**
    - Goal: 依風險決定 HITL／HOTL 與 checkpoint 位置，並用 pause/resume 與 escalation package 讓人快速決策。
    - Sources:
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/51. Human-in-the-Loop vs. Human-on-the-Loop.en.srt#human-in-the-loop-vs-human-on-the-loop]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/52. Place Checkpoints According to Risk.en.srt#place-checkpoints-according-to-risk]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/53. Pause and Resume for Human Approval.en.srt#pause-and-resume-for-human-approval]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/54. Build Useful Escalation Packages.en.srt#build-useful-escalation-packages]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/5. Pause for Human Approval.html#pause-for-human-approval]]

17. **[[learn/loop-engineer/nodes/monitoring-and-recovery|監控、最小權限與復原]]**
    - Goal: 用 telemetry、least privilege／audit 與復原／回滾守住生產，並跑一次 production readiness review。
    - Sources:
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/55. Monitor Quality, Latency, Tokens, and Cost.en.srt#monitor-quality-latency-tokens-and-cost]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/56. Apply Least Privilege and Audit Logging.en.srt#apply-least-privilege-and-audit-logging]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/57. Recover, Roll Back, and Fail Safely.en.srt#recover-roll-back-and-fail-safely]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/58. Lab Conduct an Agent Production Readiness Review.html#lab-conduct-an-agent-production-readiness-review]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/3. Approve, Reject, or Escalate an Agent Release.html#approve-reject-or-escalate-an-agent-release]]
      - [[sources/loop-engineer/20261003/8 - Add Human Oversight and Production Controls/8. Human Oversight and Operations.html#human-oversight-and-operations]]

18. **[[learn/loop-engineer/nodes/capstone|Capstone：可上線的 Issue-Resolution Agent]]**
    - Goal: 端到端做出並交付一個有 goal/evidence、state/checkpoint、termination/guardrails、reviewer 驗證與 human approval 的 issue-resolution agent。
    - Sources:
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/59. Review the Capstone Scenario and Requirements.en.srt#review-the-capstone-scenario-and-requirements]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/60. Define Goals and Evidence of Completion.en.srt#define-goals-and-evidence-of-completion]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/61. Implement the Tool-Calling Loop.en.srt#implement-the-tool-calling-loop]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/62. Add State, Context, and Checkpoints.en.srt#add-state-context-and-checkpoints]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/63. Add Termination and Guardrails.en.srt#add-termination-and-guardrails]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/64. Delegate Verification to a Reviewer Agent.en.srt#delegate-verification-to-a-reviewer-agent]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/65. Add a Human Approval Checkpoint.en.srt#add-a-human-approval-checkpoint]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/66. Execute, Trace, and Debug the System.en.srt#execute-trace-and-debug-the-system]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/67. Submit the Final Agent and Execution Report.en.srt#submit-the-final-agent-and-execution-report]]
      - [[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/68. Capstone Evaluation Rubric.en.srt#capstone-evaluation-rubric]]

19. **[[learn/loop-engineer/nodes/architecture-review-and-readiness|架構審查與 Readiness]]**
    - Goal: 能審查一個 agent loop 的六個域、辨認常見設計錯誤，並用 readiness checklist 做出 approve/fix/escalate 的放行決策。
    - Sources:
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/69. Loop Engineering Architecture Review.en.srt#loop-engineering-architecture-review]]
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/70. Common Design Mistakes.en.srt#common-design-mistakes]]
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/71. Scenario-Based Question Strategy.en.srt#scenario-based-question-strategy]]
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/72. Final Readiness Checklist.en.srt#final-readiness-checklist]]
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/73. Review Mock Exam 1 Explanations.en.srt#review-mock-exam-1-explanations]]
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/74. Course Conclusion and Next Steps.en.srt#course-conclusion-and-next-steps]]
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/1. Loop Engineering Mock Exam 1.html#loop-engineering-mock-exam-1]]
      - [[sources/loop-engineer/20261003/10 - Assessment and Readiness/2. Final Readiness Assessment.html#final-readiness-assessment]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written

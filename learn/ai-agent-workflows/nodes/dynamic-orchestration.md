---
id: dynamic-orchestration
title: 動態編排：supervisor、dispatcher、evaluator-optimizer、peer-to-peer
subject: ai-agent-workflows
tier: 5
order: 9
status: written
goal: 依「誰決定下一個 agent」選出四種拓撲之一，並用成本與可除錯性說明理由。
digests:
  - 22-supervisor.md
  - 23-dispatcher.md
  - 24-evaluator-optimizer.md
  - 25-peer-to-peer.md
  - 26-multi-agent-systems-summary.md
  - practical-ai-agents-code-exercise-main.md
prerequisites:
  - learn/ai-agent-workflows/nodes/sequential-parallel-multi-agent.md
steps:
  - id: supervisor-hub-and-spoke
    author: google/gemini-3.8-flash
    title: Supervisor 多代理系統：主管拆解，子 agent 不必互相認識
    purpose: 能用「主管拆解、子 agent 互不相識」說明 supervisor，並用 context、成本與失敗模式判斷是否適用。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L1-L25]]'
      - >-
        [[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L42-L110]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L111-L171]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L172-L232]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L233-L281]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSupervisorMultiAgent.js#L1-L154]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSupervisorMultiAgent.js#L155-L242]]
  - id: dispatcher-one-lane
    author: google/gemini-3.8-flash
    title: Dispatcher 多代理系統：一次分類，只走一條 lane
    purpose: 能用分類器只選一條 lane 說明 dispatcher，並說出錯誤路由的代價與 recovery 做法。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L1-L38]]'
      - >-
        [[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L39-L116]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L117-L157]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L158-L256]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerDispatcherMultiAgent.js#L1-L153]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerDispatcherMultiAgent.js#L154-L262]]
  - id: evaluator-optimizer-loop
    author: google/gemini-3.8-flash
    title: Evaluator-Optimizer：生成、批評、再生成，直到停止條件
    purpose: 能設計有停止條件的 generator-critic 迴圈，並用外部訊號判斷何時該信任 evaluator。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/24-evaluator-optimizer.txt#L1-L67]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/24-evaluator-optimizer.txt#L68-L120]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/24-evaluator-optimizer.txt#L121-L168]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerEvaluatorOptimizerMultiAgent.js#L1-L161]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerEvaluatorOptimizerMultiAgent.js#L162-L261]]
  - id: peer-to-peer-mesh
    author: google/gemini-3.8-flash
    title: Peer-to-Peer：沒有協調者，關係數隨 agent 數量暴增
    purpose: 能說明 peer-to-peer 沒有協調者時，關係數與可除錯性如何隨 agent 增加而惡化。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L1-L38]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L39-L89]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L90-L136]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L137-L208]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerPeerToPeerMultiAgent.js#L1-L166]]
      - >-
        [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerPeerToPeerMultiAgent.js#L167-L268]]
  - id: choose-topology-by-arrows
    author: google/gemini-3.8-flash
    title: 誰在畫箭頭？四種多代理拓撲，選最簡單可用的那一個
    purpose: 能用「誰決定下一個 agent」與成本、可除錯性選出四種拓撲中最簡單可用的那一個。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L1-L34]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L35-L87]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L88-L105]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L106-L151]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L152-L205]]
created: 2026-11-05
updated: 2026-11-05
---

# 動態編排：supervisor、dispatcher、evaluator-optimizer、peer-to-peer

## Lesson

這四種拓撲的差別，是誰在 runtime 決定下一個 agent：supervisor 自己拆解與派工，dispatcher 用分類器選一條路，evaluator-optimizer 用 critic 決定要不要再一輪，peer-to-peer 則讓 agent 彼此直接對話。最後用多 agent 總結把成本、可除錯性與「誰畫箭頭」收成選型規則。

## Steps

1. [Supervisor 多代理系統：主管拆解，子 agent 不必互相認識](dynamic-orchestration/supervisor-hub-and-spoke.md)
2. [Dispatcher 多代理系統：一次分類，只走一條 lane](dynamic-orchestration/dispatcher-one-lane.md)
3. [Evaluator-Optimizer：生成、批評、再生成，直到停止條件](dynamic-orchestration/evaluator-optimizer-loop.md)
4. [Peer-to-Peer：沒有協調者，關係數隨 agent 數量暴增](dynamic-orchestration/peer-to-peer-mesh.md)
5. [誰在畫箭頭？四種多代理拓撲，選最簡單可用的那一個](dynamic-orchestration/choose-topology-by-arrows.md)

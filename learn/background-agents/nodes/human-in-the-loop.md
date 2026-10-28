---
id: human-in-the-loop
title: "Human-in-the-loop：inbox 與 approval"
subject: background-agents
tier: 2
order: 6
status: written
goal: "說出 inbox 為何是背景 agent 的介面、proposal 持久化 → correlated wait → 重讀 → 重驗 → 執行，以及 approval 是 harness 的確定性邏輯（不讓 agent 知道）。"
prerequisites: []
steps:
  - id: inbox-not-chat
    title: "Inbox 才是背景 agent 的介面"
    purpose: "能用「沒有聊天歷史」說明背景 agent 為何用 inbox，並說出 approval 是 harness 的確定性邏輯、不讓 agent 知道。"
    sources:
      - "[[sources/background-agents/20261027/20-hitl-human-in-the-loop.md#L1-L37]]"
      - "[[sources/background-agents/20261027/20-hitl-human-in-the-loop.md#L38-L57]]"
      - "[[sources/background-agents/20261027/20-hitl-human-in-the-loop.md#L68-L84]]"
  - id: proposal-correlated-wait
    title: "Approval 流程：proposal 持久化 → correlated wait → 重讀"
    purpose: "能沿 proposal 持久化 → correlated wait → 重讀的資料流，說出每個 step 為什麼存在、為什麼要另開 step 重讀。"
    sources:
      - "[[sources/background-agents/20261027/21-building-the-approval-flow.md#L1-L86]]"
      - "[[sources/background-agents/20261027/21-building-the-approval-flow.md#L87-L125]]"
  - id: break-it-stale-proposal
    title: "弄壞它：批准期間 state 漂移 → stale proposal"
    purpose: "能重現「批准期間 state 漂移」，並說出 staleProposal 如何讓 agent 重想，而不是拿過期狀態硬跑。"
    sources:
      - "[[sources/background-agents/20261027/21-building-the-approval-flow.md#L126-L156]]"
      - "[[sources/background-agents/20261027/22-testing-hitl.md#L1-L46]]"
created: 2026-10-27
updated: 2026-10-27
---

# Human-in-the-loop：inbox 與 approval

## Lesson

背景 agent 沒有聊天窗，它的介面是 inbox。危險動作先持久化 proposal，等 correlated 的決定，喚醒後重讀再重驗版本。approval 是 harness 的確定性邏輯，agent 不該知道自己被擋。

## Steps

1. [Inbox 才是背景 agent 的介面](human-in-the-loop/inbox-not-chat.md)
2. [Approval 流程：proposal 持久化 → correlated wait → 重讀](human-in-the-loop/proposal-correlated-wait.md)
3. [弄壞它：批准期間 state 漂移 → stale proposal](human-in-the-loop/break-it-stale-proposal.md)

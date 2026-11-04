---
id: the-authority-question
title: "權威問題：誰說了算"
subject: background-agent
tier: 1
order: 4
status: written
goal: "能區分模型、harness、service、人類的權限，並解釋為何不能讓 LLM 自己判斷要不要問人。"
digests:
  - 1-background-agents.md
  - 6-custom-tool-loop.md
  - 20-hitl-human-in-the-loop.md
  - lessons-01-goal-and-harness.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/give-the-agent-a-goal.md
steps:
  - id: four-authorities
    author: "google/gemini-3.8-flash"
    title: "誰有權威？"
    purpose: "能區分模型、harness、service、人類四層權威，並說出每一層能做與不能做的事。"
    sources:
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L581-L735]]"
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L736-L862]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L19-L24]]"
      - "[[sources/background-agent/20261105/lessons/01-goal-and-harness/index.md#L126-L129]]"
  - id: why-the-model-cannot-decide
    author: "google/gemini-3.8-flash"
    title: "它不該知道自己需要批准"
    purpose: "能解釋為何把「要不要問人」交給 LLM 會幻覺，並說明不確定性與確定性工作如何分工。"
    sources:
      - "[[sources/background-agent/20261105/1-background-agents.vtt#L581-L735]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L191-L295]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L609-L677]]"
      - "[[sources/background-agent/20261105/server/agent-brain.ts#L1-L51]]"
  - id: ask-versus-approve
    author: "google/gemini-3.8-flash"
    title: "它比較像收件匣"
    purpose: "能區分求助與批准兩種收件匣項目，並說明代理為何不該知道哪個動作需要批准。"
    sources:
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L296-L405]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L406-L500]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L678-L742]]"
      - "[[sources/background-agent/20261105/20-hitl-human-in-the-loop.vtt#L743-L790]]"
  - id: authority-in-code
    author: "google/gemini-3.8-flash"
    title: "這件事不能沒有批准就做"
    purpose: "能從 policy 表、動作攔截與 derived actionId 說明 harness 如何在效果發生前守住權威。"
    sources:
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L176-L299]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L300-L399]]"
      - "[[sources/background-agent/20261105/6-custom-tool-loop.vtt#L400-L569]]"
      - "[[sources/background-agent/20261105/server/tool-policy.ts#L1-L15]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L156-L288]]"
created: 2026-11-05
updated: 2026-11-04
---

# 權威問題：誰說了算

## Lesson

一旦代理無人看管，就必須先回答誰有權威：模型提案、harness 把關、service 執行、人類批准或提供資訊。這個節點把「不要讓 LLM 自己決定要不要問人」變成一張可實作的政策表。

## Steps

1. [誰有權威？](the-authority-question/four-authorities.md)
2. [它不該知道自己需要批准](the-authority-question/why-the-model-cannot-decide.md)
3. [它比較像收件匣](the-authority-question/ask-versus-approve.md)
4. [這件事不能沒有批准就做](the-authority-question/authority-in-code.md)

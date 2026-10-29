---
id: tools-are-the-runbook
title: "工具是 agent 的 runbook"
subject: agent-harness2
tier: 1
order: 2
status: written
goal: "寫出 tool 的 description／schema／execute，並說出為什麼不可逆工具交給 naive harness 會出事。"
prerequisites: []
steps:
  - id: tools-file-and-fake-knowledge-base
    title: "建立 tools 檔與假的 knowledge base"
    purpose: "能在 harness 建立 tools 檔，並用外部 knowledge base 當 agent 的處理 runbook。"
    sources:
      - "[[sources/agent-harness2/20261029/3-agent-tools-setup.txt#L159-L241]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L1-L129]]"
  - id: description-input-schema-execute
    title: "工具的 description、input schema 與 execute"
    purpose: "能寫出 tool 的 description、input schema 與 execute，並說明三者各自約束什麼。"
    sources:
      - "[[sources/agent-harness2/20261029/3-agent-tools-setup.txt#L242-L395]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L1-L129]]"
  - id: classify-item-and-draft-reply
    title: "classify item 與 draft reply"
    purpose: "能用 Zod 建立 classify item 與 draft reply，並用 describe 補足欄位語意。"
    sources:
      - "[[sources/agent-harness2/20261029/4-classify-reply-tools.txt#L1-L180]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L1-L129]]"
  - id: send-reply-and-system-prompt
    title: "send reply：不可逆工具與失敗的文字 guardrail"
    purpose: "能解釋 send reply 為何不能在 naive harness 直接執行，以及為什麼 system prompt 不是 guardrail。"
    sources:
      - "[[sources/agent-harness2/20261029/4-classify-reply-tools.txt#L181-L279]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L1-L129]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/agents.ts#L1-L65]]"
created: 2026-10-29
updated: 2026-10-29
---

# 工具是 agent 的 runbook

## Lesson

Agent 能做的事等於你給它的工具。這裡先建 mock 的 knowledge base 與工具，逐一處理 description、input schema、execute 三個欄位，然後刻意放一個不可逆的 `sendReply`，讓你看到 naive harness 為什麼危險。

## Steps

1. [建立 tools 檔與假的 knowledge base](tools-are-the-runbook/tools-file-and-fake-knowledge-base.md)
2. [工具的 description、input schema 與 execute](tools-are-the-runbook/description-input-schema-execute.md)
3. [classify item 與 draft reply](tools-are-the-runbook/classify-item-and-draft-reply.md)
4. [send reply：不可逆工具與失敗的文字 guardrail](tools-are-the-runbook/send-reply-and-system-prompt.md)

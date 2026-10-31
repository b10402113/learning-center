---
id: execution-boundary-tools
title: "Tools：Harness 拿回執行權"
subject: agent-harness
tier: 2
order: 3
status: written
goal: "區分 tool schema 與執行，說明為什麼 execute 必須由 harness 掌控。"
digests:
  - 3-agent-tools-setup.md
  - 4-classify-reply-tools.md
  - 6-stream-messages-to-the-ui.md
  - 9-durable-tools.md
prerequisites: []
steps:
  - id: anatomy-of-a-tool
    title: "一個 tool 的三個部位：description、schema、execute"
    purpose: "能拆開 tool 的三個部位，並說出各自影響模型還是影響伺服器。"
    sources:
      - "[[sources/agent-harness/20260915/3-agent-tools-setup.txt#L159-L191]]"
      - "[[sources/agent-harness/20260915/3-agent-tools-setup.txt#L242-L279]]"
      - "[[sources/agent-harness/20260915/3-agent-tools-setup.txt#L280-L321]]"
      - "[[sources/agent-harness/20260915/3-agent-tools-setup.txt#L322-L360]]"
  - id: schema-is-the-contract
    title: "Schema 是模型與程式之間的契約"
    purpose: "能用 Zod enum 與 describe 把參數約束成程式真的能處理的形狀。"
    sources:
      - "[[sources/agent-harness/20260915/4-classify-reply-tools.txt#L1-L33]]"
      - "[[sources/agent-harness/20260915/4-classify-reply-tools.txt#L100-L152]]"
  - id: execute-belongs-to-the-harness
    title: "把 execute 拿回來：為什麼 harness 要自己執行"
    purpose: "能指出 AI SDK 自動執行會繞過什麼，並說明為什麼 execute 要留在 harness。"
    sources:
      - "[[sources/agent-harness/20260915/4-classify-reply-tools.txt#L34-L58]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L215-L258]]"
      - "[[sources/agent-harness/20260915/9-durable-tools.txt#L50-L98]]"
  - id: prompt-is-not-a-guardrail
    title: "Description 寫「請先問使用者」不是護欄"
    purpose: "能用 send reply 的例子說明安全機制不能只寫在 prompt 裡。"
    sources:
      - "[[sources/agent-harness/20260915/4-classify-reply-tools.txt#L183-L219]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L259-L311]]"
  - id: tool-results-are-an-interface
    title: "Tool result 也是給模型看的介面"
    purpose: "能設計回傳值，讓模型知道成功、失敗與下一步該做什麼。"
    sources:
      - "[[sources/agent-harness/20260915/3-agent-tools-setup.txt#L361-L395]]"
      - "[[sources/agent-harness/20260915/4-classify-reply-tools.txt#L153-L182]]"
created: 2026-10-24
updated: 2026-10-27
---

# Tools：Harness 拿回執行權

## Lesson

Tool 不是模型能直接呼叫的函式，而是 harness 提供的能力介面：description 與 schema 給模型看，真正執行留在 harness。把 execute 從 AI SDK 手上拿回來，後面的 durable step、sandbox 與 approval 才能攔在同一點。

## Steps

1. [一個 tool 的三個部位：description、schema、execute](execution-boundary-tools/anatomy-of-a-tool.md)
2. [Schema 是模型與程式之間的契約](execution-boundary-tools/schema-is-the-contract.md)
3. [把 execute 拿回來：為什麼 harness 要自己執行](execution-boundary-tools/execute-belongs-to-the-harness.md)
4. [Description 寫「請先問使用者」不是護欄](execution-boundary-tools/prompt-is-not-a-guardrail.md)
5. [Tool result 也是給模型看的介面](execution-boundary-tools/tool-results-are-an-interface.md)

---
id: tools-mcp-skills
title: Agent 能做什麼：tools、MCP 與 skills
subject: ai-agent-workflows
tier: 1
order: 2
status: written
goal: 判斷一個能力該做成 tool、MCP server 還是 skill，並寫出模型看得懂的 tool metadata。
digests:
  - 2-tools.md
  - 3-mcp-skills.md
prerequisites:
  - learn/ai-agent-workflows/nodes/reasoning-llm-vs-agent.md
steps:
  - id: tools-extend-reach
    author: google/gemini-3.8-flash
    title: 工具讓 LLM 能與環境互動
    purpose: 說明 tool 是 harness 接給模型的外部能力，並舉例它如何讓 agent 取得訓練資料以外的資訊。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L21-L58]]'
      - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L59-L105]]'
  - id: tool-metadata
    author: google/gemini-3.8-flash
    title: 模型只看得到工具的 metadata
    purpose: 寫出讓模型聽得懂的 tool 名稱、描述與參數，並說明模糊 metadata 為何是工具錯誤主因。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L106-L198]]'
      - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L297-L334]]'
  - id: tool-execution
    author: google/gemini-3.8-flash
    title: LLM 只是輸出一段字串
    purpose: 說明 LLM 只輸出呼叫、harness 執行工具並把結果當 observation 餵回模型的完整流程。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L199-L296]]'
    blocks:
      - tool-calling
  - id: mcp-standard
    author: google/gemini-3.8-flash
    title: MCP 標準化傳輸與格式，不標準化工具本身
    purpose: 用 client/server 角色說明 MCP 標準化的是連接與格式，並解釋它如何分攤 API 變更的維運。
    sources:
      - '[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L1-L127]]'
  - id: skills-lazy-loading
    author: google/gemini-3.8-flash
    title: skill 的 metadata 常駐，指示只在被呼叫時載入
    purpose: 用 SKILL.md 與 lazy loading 判斷何時該把指示或腳本包成 skill，而不是做成 tool。
    sources:
      - >-
        [[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L128-L266]]
      - >-
        [[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L267-L281]]
created: 2026-11-05
updated: 2026-11-05
---

# Agent 能做什麼：tools、MCP 與 skills

## Lesson

LLM 只處理文字，所以「能做事」其實是 harness 把工具接上去的結果。這五個 step 依序拆開 tool 的形狀與 metadata、執行責任的歸屬、MCP 如何標準化連接、以及 skill 如何用 lazy loading 提供指示與腳本，讓你在同一張能力地圖上選對接口。

## Steps

1. [工具讓 LLM 能與環境互動](tools-mcp-skills/tools-extend-reach.md)
2. [模型只看得到工具的 metadata](tools-mcp-skills/tool-metadata.md)
3. [LLM 只是輸出一段字串](tools-mcp-skills/tool-execution.md)
4. [MCP 標準化傳輸與格式，不標準化工具本身](tools-mcp-skills/mcp-standard.md)
5. [skill 的 metadata 常駐，指示只在被呼叫時載入](tools-mcp-skills/skills-lazy-loading.md)

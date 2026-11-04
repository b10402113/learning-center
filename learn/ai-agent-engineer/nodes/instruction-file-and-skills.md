---
id: instruction-file-and-skills
title: "Instruction file 與 skills"
subject: ai-agent-engineer
tier: 2
order: 8
status: written
goal: "用兩個測試寫 AGENTS.md，用 description 與 progressive disclosure 寫一個會被觸發的 skill。"
digests:
  - agentic-coding-handbook.2.part.md
  - agentic-coding-handbook.3.part.md
  - skills.1.part.md
  - skills.2.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/model-prompt-context.md"
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps:
  - id: instruction-file-two-tests
    author: "gpt-6-luna"
    title: "每一行都要過的兩個測試"
    purpose: "用「agent 查不到、全 repo 成立」兩個測試，篩掉 AGENTS.md 裡不該存在的規則。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L69-L94]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L95-L216]]"
  - id: route-rules-and-audit
    author: "gpt-6-luna"
    title: "其餘的規則，去哪？"
    purpose: "把不屬於 AGENTS.md 的內容分流到資料夾檔案、skill、doc 或 hook，並用 expiry test 與逐行 audit 決定去留。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L95-L216]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L56-L65]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L205-L237]]"
  - id: skill-progressive-disclosure
    author: "gpt-6-luna"
    title: "一個資料夾，不是一段提示"
    purpose: "用 progressive disclosure 控制 context、用 description 當觸發器，寫出不含 no-op 且留得住 gotchas 的 skill。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L217-L313]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/grill-me/SKILL.md#L1-L23]]"
  - id: build-and-test-a-skill
    author: "gpt-6-luna"
    title: "寫出一個好 skill"
    purpose: "照 write-great-skill 的訪談、目錄結構與 fires.sh 觸發測試，做出一個真的會被載入的 skill。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/SKILL.md#L1-L91]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/references/skill-template.md#L1-L75]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/references/review-checklist.md#L1-L40]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/scripts/check-skill.mjs#L1-L178]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/write-great-skill/scripts/fires.sh#L1-L39]]"
created: 2026-11-03
updated: 2026-11-04
---

# Instruction file 與 skills

## Lesson

Instruction file 放 agent 查不到、且全 repo 都成立的規則；其餘內容分流到 skill、文件或 hook。Skill 平時只有 name 與 description 佔 context，真正需要時才載入全文。兩者都是把專案知識交給 agent 的檔案，而不是更長的提示詞。

## Steps

1. [每一行都要過的兩個測試](instruction-file-and-skills/instruction-file-two-tests.md)
2. [其餘的規則，去哪？](instruction-file-and-skills/route-rules-and-audit.md)
3. [一個資料夾，不是一段提示](instruction-file-and-skills/skill-progressive-disclosure.md)
4. [寫出一個好 skill](instruction-file-and-skills/build-and-test-a-skill.md)

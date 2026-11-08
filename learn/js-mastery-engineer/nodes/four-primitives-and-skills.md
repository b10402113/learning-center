---
id: four-primitives-and-skills
title: "四個基本元素：Tools、MCP、Subagents 與 Skills"
subject: js-mastery-engineer
tier: 2
order: 5
status: written
goal: "能用四個基本元素對照任何新工具，判斷何時該用 MCP／subagent，並把重複的紀律寫成一個 SKILL.md。"
digests:
  - 015 - The Four Primitives- Your Vocabulary Map.en.md
  - 016 - MCP- Extending the Agent and When Its Worth It.en.md
  - 017 - Subagents- Agents with Their Own Context.en.md
  - 020 - Skills- The Discipline You Did by Hand.en.md
  - 021 - How to Read a SKILL md file.en.md
  - 022 - Build Your Own Skill.en.md
  - 026 - The Four Primitives- Your Vocabulary Map pdf.md
  - 027 - The Four Primitives- Your Vocabulary Map.md
  - 028 - Tools- What the Model Can Call.md
  - 029 - MCP- Extending the Agent and When Its Worth It pdf.md
  - 030 - MCP- Extending the Agent and When Its Worth It.md
  - 031 - Subagents- Agents with Their Own Context pdf.md
  - 032 - Subagents- Agents with Their Own Context.md
  - 033 - Configuring And Using A Subagent.md
  - 034 - Mapping Primitives Across Tools.md
  - 035 - Choosing a Model- Harness vs Reasoning.md
  - 042 - Skills- The Discipline You Did by Hand pdf.md
  - 043 - Skills- The Discipline You Did by Hand.md
  - 044 - How to Read a SKILL md file pdf.md
  - 045 - How to Read a SKILL md file.md
  - 046 - Build Your Own Skill pdf.md
  - 047 - Build Your Own Skill.md
  - 048 - Skills vs MCP- Which to use and when.md
prerequisites:
  - learn/js-mastery-engineer/nodes/the-agent-loop.md
steps:
  - id: four-primitives-map
    author: "google/gemini-3.8-flash"
    title: "掌握四個基礎元素，看懂所有 AI 開發工具"
    purpose: "能用 tools、skills、MCP、subagents 四個名稱拆解任何新工具，並說明模型只占兩成、harness 才決定成敗"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/015 - The Four Primitives- Your Vocabulary Map.en.txt#L1-L11]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/026 - The Four Primitives- Your Vocabulary Map pdf.txt#L1-L94]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/027 - The Four Primitives- Your Vocabulary Map.txt#L1-L15]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/028 - Tools- What the Model Can Call.txt#L1-L87]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/034 - Mapping Primitives Across Tools.txt#L1-L100]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/035 - Choosing a Model- Harness vs Reasoning.txt#L1-L90]]"
  - id: mcp-when-worth-it
    author: "google/gemini-3.8-flash"
    title: "MCP 如何把外部服務變成 Agent 工具：接合時機與設定範圍"
    purpose: "能說明 MCP 如何把外部服務變成工具，並用即時資料與依賴風險判斷該不該接，以及放 local、user 還是 project"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/016 - MCP- Extending the Agent and When Its Worth It.en.txt#L1-L117]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/029 - MCP- Extending the Agent and When Its Worth It pdf.txt#L1-L213]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/030 - MCP- Extending the Agent and When Its Worth It.txt#L1-L23]]"
  - id: subagents-own-context
    author: "google/gemini-3.8-flash"
    title: "何時該將重活交給 Subagent，以及如何設定專屬代理人"
    purpose: "能判斷何時該把重活丟給 subagent，並用 name、description、tools、model 四個欄位設定一個只回傳結果的 agent"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/017 - Subagents- Agents with Their Own Context.en.txt#L1-L57]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/031 - Subagents- Agents with Their Own Context pdf.txt#L1-L27]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/032 - Subagents- Agents with Their Own Context.txt#L1-L27]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/033 - Configuring And Using A Subagent.txt#L1-L239]]"
  - id: skills-and-skill-md
    author: "google/gemini-3.8-flash"
    title: "把手動紀律化為 Skill：SKILL.md 的觸發機制與按需載入架構"
    purpose: "能把重複的紀律寫成 skill，並讀懂 SKILL.md 的 description 觸發條件與按需載入的 scripts、references、assets"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/020 - Skills- The Discipline You Did by Hand.en.txt#L1-L65]]"
      - "[[sources/js-mastery-engineer/20261107/course/021 - How to Read a SKILL md file.en.txt#L1-L57]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/042 - Skills- The Discipline You Did by Hand pdf.txt#L1-L23]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/043 - Skills- The Discipline You Did by Hand.txt#L1-L25]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/044 - How to Read a SKILL md file pdf.txt#L1-L41]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/045 - How to Read a SKILL md file.txt#L1-L23]]"
  - id: build-and-place-a-skill
    author: "google/gemini-3.8-flash"
    title: "用 Skill Creator 打造自訂 Skill：個人設定、專案共用與 MCP 分工"
    purpose: "能用 Skill Creator 做出一個 teach-me skill，決定放 personal 還是 project，並分清 skill 與 MCP 各自補哪一半"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/022 - Build Your Own Skill.en.txt#L1-L131]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/046 - Build Your Own Skill pdf.txt#L1-L38]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/047 - Build Your Own Skill.txt#L1-L21]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/048 - Skills vs MCP- Which to use and when.txt#L1-L57]]"
created: 2026-11-07
updated: 2026-11-07
---

# 四個基本元素：Tools、MCP、Subagents 與 Skills

## Lesson

新工具一直出現，但底下只有四個東西：tools、MCP、subagents、skills；學會一次，之後只是換口音。這一節也把「你重複做過的紀律」寫成檔案，讓 agent 每次都用同一個方式跑。

## Steps

1. [掌握四個基礎元素，看懂所有 AI 開發工具](four-primitives-and-skills/four-primitives-map.md)
2. [MCP 如何把外部服務變成 Agent 工具：接合時機與設定範圍](four-primitives-and-skills/mcp-when-worth-it.md)
3. [何時該將重活交給 Subagent，以及如何設定專屬代理人](four-primitives-and-skills/subagents-own-context.md)
4. [把手動紀律化為 Skill：SKILL.md 的觸發機制與按需載入架構](four-primitives-and-skills/skills-and-skill-md.md)
5. [用 Skill Creator 打造自訂 Skill：個人設定、專案共用與 MCP 分工](four-primitives-and-skills/build-and-place-a-skill.md)

---
id: why-ai-coding-falls-apart
title: "AI 寫程式為什麼會崩"
subject: js-mastery-engineer
tier: 1
order: 1
status: written
goal: "能說出 agent 失敗的兩個根因，並用「人是架構師、agent 是引擎」取代許願式提示。"
digests:
  - 001 - What This Course Will and Wont Make You.en.md
  - 002 - Prerequisites- Who is this course for.en.md
  - 003 - The Two Scenarios Youll Build In.en.md
  - 004 - Install the CLI in Your IDE.en.md
  - 005 - How to Take This Course Use the Cheat Sheet.en.md
  - 006 - Why AI Coding Falls Apart.en.md
  - 007 - Direct the AI Dont Rely on Hope.en.md
  - 008 - The perfect wish to outsmart a genie – Chris Jack.en.md
  - 009 - Vibe Coding vs Agentic Engineering.en.md
  - 002 - What This Course Will and Wont Make You.md
  - 003 - Prerequisites Who is this course for.md
  - 004 - The Two Scenarios Youll Build In.md
  - 006 - Install the CLI in Your IDE.md
  - 007 - How to Take This Course Use the Cheat Sheet.md
  - 008 - Why AI Coding Falls Apart.md
  - 009 - Direct the AI Dont Rely on Hope pdf.md
  - 010 - Direct the AI Dont Rely on Hope.md
  - 011 - Vibe Coding vs Agentic Engineering pdf.md
  - 012 - Vibe Coding vs Agentic Engineering.md
prerequisites: []
steps:
  - id: two-root-causes
    author: "google/gemini-3.8-flash"
    title: "AI 寫程式為何從驚豔走向失控？兩個讓你越寫越累的真正根因"
    purpose: "能用「缺少你的程式碼上下文」與「默默補完你沒做的決定」兩個根因，解釋 AI 寫程式為何從驚豔走向失控。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/006 - Why AI Coding Falls Apart.en.txt#L1-L59]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/008 - Why AI Coding Falls Apart.txt#L10-L20]]"
  - id: architect-not-genie
    author: "google/gemini-3.8-flash"
    title: "人是架構師，Agent 是引擎：別再用「許願」跟 AI 寫程式"
    purpose: "能用「人是架構師、agent 是引擎」取代精靈式許願，並說明模糊指令為何換來難以審查的巨大 diff。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/007 - Direct the AI Dont Rely on Hope.en.txt#L1-L53]]"
      - "[[sources/js-mastery-engineer/20261107/course/006 - Why AI Coding Falls Apart.en.txt#L60-L69]]"
      - "[[sources/js-mastery-engineer/20261107/course/008 - The perfect wish to outsmart a genie – Chris Jack.en.txt#L1-L10]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/009 - Direct the AI Dont Rely on Hope pdf.txt#L21-L65]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/010 - Direct the AI Dont Rely on Hope.txt#L10-L21]]"
  - id: vibe-vs-agentic
    author: "google/gemini-3.8-flash"
    title: "Vibe Coding 與 Agentic Engineering：決定權在誰手上？"
    purpose: "能從同一件 Stripe checkout 任務的 A/B 對照，指出 vibe coding 與 agentic engineering 的差別是誰在做決定。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/009 - Vibe Coding vs Agentic Engineering.en.txt#L1-L49]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/011 - Vibe Coding vs Agentic Engineering pdf.txt#L10-L72]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/012 - Vibe Coding vs Agentic Engineering.txt#L11-L23]]"
  - id: two-scenarios
    author: "google/gemini-3.8-flash"
    title: "寫程式不再是難事，工程師該練的是「判斷力」"
    purpose: "能說出 Greenfield 與 Brownfield 兩個建置場景，並用「判斷力」說明這門課要練什麼、適合誰。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/003 - The Two Scenarios Youll Build In.en.txt#L1-L27]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/004 - The Two Scenarios Youll Build In.txt#L5-L22]]"
      - "[[sources/js-mastery-engineer/20261107/course/001 - What This Course Will and Wont Make You.en.txt#L1-L41]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/002 - What This Course Will and Wont Make You.txt#L5-L19]]"
      - "[[sources/js-mastery-engineer/20261107/course/002 - Prerequisites- Who is this course for.en.txt#L1-L41]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/003 - Prerequisites Who is this course for.txt#L5-L24]]"
  - id: setup-and-order
    author: "google/gemini-3.8-flash"
    title: "安裝 Claude Code 與掌握學習節奏"
    purpose: "能裝好 Claude Code、選對付費方案，並用 cheat sheet 與課程順序安排自己的實作節奏。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/004 - Install the CLI in Your IDE.en.txt#L1-L23]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/006 - Install the CLI in Your IDE.txt#L5-L22]]"
      - "[[sources/js-mastery-engineer/20261107/course/005 - How to Take This Course Use the Cheat Sheet.en.txt#L1-L33]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/007 - How to Take This Course Use the Cheat Sheet.txt#L5-L21]]"
created: 2026-11-07
updated: 2026-11-07
---

# AI 寫程式為什麼會崩

## Lesson

先看清失敗的形狀：程式碼是別人的、決策是預設填的，所以問題不在提示寫得好不好，而在有沒有人做決定。這一節把「許願」換成「指派」，也先把課程會用到的兩個場景與環境講清楚。

## Steps

1. [AI 寫程式為何從驚豔走向失控？兩個讓你越寫越累的真正根因](why-ai-coding-falls-apart/two-root-causes.md)
2. [人是架構師，Agent 是引擎：別再用「許願」跟 AI 寫程式](why-ai-coding-falls-apart/architect-not-genie.md)
3. [Vibe Coding 與 Agentic Engineering：決定權在誰手上？](why-ai-coding-falls-apart/vibe-vs-agentic.md)
4. [寫程式不再是難事，工程師該練的是「判斷力」](why-ai-coding-falls-apart/two-scenarios.md)
5. [安裝 Claude Code 與掌握學習節奏](why-ai-coding-falls-apart/setup-and-order.md)

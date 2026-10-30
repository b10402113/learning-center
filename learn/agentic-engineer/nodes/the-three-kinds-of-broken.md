---
id: the-three-kinds-of-broken
title: "The Three Kinds of Broken"
subject: agentic-engineer
tier: 4
order: 19
status: written
goal: "能先分類是三種壞掉的哪一種，再用一次一個可證偽的假設找出根因，而不是改到紅燈變綠。"
digests:
  - ch11-find-the-root-cause.md
  - code-ai-course-demos-login-bug.md
  - code-jsm-skills-system.md
prerequisites: []
steps:
  - id: what-kind-of-broken-is-this
    title: "這是哪一種壞掉？"
    purpose: "能用三種壞掉的辨識訊號分類眼前的故障，並說出分錯時各自要付的代價。"
    sources:
      - "[[sources/agentic-engineer/20261030/11. Workflow Find the Root Cause/1. The Three Kinds of Broken.srt#L1-L142]]"
      - "[[sources/agentic-engineer/20261030/11. Workflow Find the Root Cause/1. The Three Kinds of Broken.srt#L143-L276]]"
      - "[[sources/agentic-engineer/20261030/11. Workflow Find the Root Cause/5. Recover a Broken Session (9_11_2026 1：52：08 PM).txt#L1-L37]]"
  - id: defects-in-ai-written-code
    title: "AI 寫的 code 特有的缺陷"
    purpose: "能從四個已知模式認出 AI 寫的 code 的缺陷，並在沒有 spec 時判斷該退回 /architect。"
    sources:
      - "[[sources/agentic-engineer/20261030/11. Workflow Find the Root Cause/4. Debugging Code You Didn't Write (9_11_2026 1：51：47 PM).txt#L1-L40]]"
      - "[[sources/agentic-engineer/20261030/ai-course-demos/001-login-btn-issue/overview.md#L1-L90]]"
      - "[[sources/agentic-engineer/20261030/ai-course-demos/001-login-btn-issue/app/actions/auth-actions.ts#L1-L30]]"
      - "[[sources/agentic-engineer/20261030/ai-course-demos/001-login-btn-issue/lib/auth.ts#L1-L62]]"
      - "[[sources/agentic-engineer/20261030/ai-course-demos/001-login-btn-issue/components/login-form.tsx#L1-L61]]"
      - "[[sources/agentic-engineer/20261030/ai-course-demos/001-login-btn-issue/tsconfig.json#L1-L34]]"
  - id: the-method-that-works-on-any-code
    title: "在任何程式碼上都有效的方法"
    purpose: "能用自己的話跑一次觀察→單一假設→實驗→證據的迴圈，並說出為什麼 /debug 不能替你判斷根因。"
    sources:
      - "[[sources/agentic-engineer/20261030/11. Workflow Find the Root Cause/2. The Method That Works on Any Code.srt#L1-L104]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/debug/SKILL.md#L1-L100]]"
  - id: demo-running-debug
    title: "Demo：跑一次 /debug"
    purpose: "能把 observed／expected／repro 交給 /debug，並用修正大小判斷它真的找到根因。"
    sources:
      - "[[sources/agentic-engineer/20261030/11. Workflow Find the Root Cause/3. Demo Running debug.srt#L1-L180]]"
      - "[[sources/agentic-engineer/20261030/11. Workflow Find the Root Cause/3. Demo Running debug.srt#L181-L343]]"
created: 2026-10-30
updated: 2026-10-30
---

# The Three Kinds of Broken

## Lesson

東西壞掉時第一個動作不是技術，是一個問題：這是哪一種壞？普通的 code bug、AI 寫的 code 特有的缺陷、還是 agent 自己任務跑掉了卻還很自信——三者長得很像，卻需要相反的反應。分類錯了，你會去 prompt 一個它看不見的 bug，或清掉一個其實已經蒐集完證據的 session。

## Steps

1. [這是哪一種壞掉？](the-three-kinds-of-broken/what-kind-of-broken-is-this.md)
2. [AI 寫的 code 特有的缺陷](the-three-kinds-of-broken/defects-in-ai-written-code.md)
3. [在任何程式碼上都有效的方法](the-three-kinds-of-broken/the-method-that-works-on-any-code.md)
4. [Demo：跑一次 /debug](the-three-kinds-of-broken/demo-running-debug.md)

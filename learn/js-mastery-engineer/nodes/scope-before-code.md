---
id: scope-before-code
title: "/scope：先挑戰想法，再寫程式"
subject: js-mastery-engineer
tier: 4
order: 7
status: written
goal: "能用 `/scope` 把一句話想法逼成有 MVP 邊界、build 順序與 workflow tier 的 `docs/scope/scope.md`。"
digests:
  - 032 - scope- Challenge the Idea Before Any Code.en.md
  - 033 - Demo- Running -scope.en.md
  - 051 - Scope Architecture Skills.en.md
  - skills.md
  - 061 - scope- Challenge the Idea Before Any Code pdf.md
  - 062 - scope- Challenge the Idea Before Any Code.md
  - 063 - Demo- Running -scope.md
  - 066 - Challenge- Scope Your Own Real Idea.md
  - 100 - Scope Architecture Skills.md
prerequisites:
  - learn/js-mastery-engineer/nodes/context-engineering.md
  - learn/js-mastery-engineer/nodes/install-the-skills-system.md
steps:
  - id: project-defaults
    author: "google/gemini-3.8-flash"
    title: "別讓 Agent 默默替你決定：專案預設的三個面向"
    purpose: "能說出專案預設的三個面向，並解釋 vibe build 為何讓 agent 默默替你決定它們。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/032 - scope- Challenge the Idea Before Any Code.en.txt#L1-L11]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/062 - scope- Challenge the Idea Before Any Code.txt#L5-L21]]"
  - id: scope-the-idea
    author: "google/gemini-3.8-flash"
    title: "用 /scope 把一句話收斂成 MVP 規格與不做清單"
    purpose: "能跑完 /scope 的提問，把一句話想法收斂成有 MVP 邊界與明確不做清單的計畫。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/033 - Demo- Running -scope.en.txt#L10-L111]]"
      - "[[sources/js-mastery-engineer/20261107/course/051 - Scope Architecture Skills.en.txt#L25-L111]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/063 - Demo- Running -scope.txt#L5-L17]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/100 - Scope Architecture Skills.txt#L1-L26]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/SKILL.md#L13-L34]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/modes/plan.md#L1-L25]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/modes/plan-greenfield.md#L1-L20]]"
  - id: build-approach-and-tier
    author: "google/gemini-3.8-flash"
    title: "依風險決定 Build 策略與 Workflow Tier"
    purpose: "能依風險選出四種 build 策略之一，並用 workflow tier 決定每個特徵要多少驗證。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/033 - Demo- Running -scope.en.txt#L112-L177]]"
      - "[[sources/js-mastery-engineer/20261107/course/051 - Scope Architecture Skills.en.txt#L114-L160]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/061 - scope- Challenge the Idea Before Any Code pdf.txt#L54-L225]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/SKILL.md#L52-L57]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/modes/plan.md#L27-L42]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/approaches/tracer-bullet.md#L1-L34]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/approaches/skateboard.md#L1-L33]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/approaches/journey.md#L1-L31]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/approaches/facade.md#L1-L33]]"
  - id: scope-artifact-and-replan
    author: "google/gemini-3.8-flash"
    title: "讀懂 scope.md 並用 replan 對齊開發進度"
    purpose: "能讀懂 `docs/scope/scope.md` 的結構，並用 replan 讓計畫跟實際進度對齊。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/033 - Demo- Running -scope.en.txt#L178-L247]]"
      - "[[sources/js-mastery-engineer/20261107/course/051 - Scope Architecture Skills.en.txt#L141-L176]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/061 - scope- Challenge the Idea Before Any Code pdf.txt#L1-L53]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/061 - scope- Challenge the Idea Before Any Code pdf.txt#L216-L252]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/SKILL.md#L36-L50]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/scope-template.md#L1-L148]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/modes/replan.md#L1-L13]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/modes/plan-brownfield.md#L1-L11]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/modes/plan-monorepo.md#L1-L8]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/scope/modes/add.md#L1-L12]]"
  - id: challenge-your-idea
    author: "google/gemini-3.8-flash"
    title: "帶著 Agent 的三個訓練傾向檢查 Scope：開工前的四項自檢"
    purpose: "能用 agent 的三個訓練傾向檢查自己的 scope，並在開工前跑完四項自檢。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/supplement/066 - Challenge- Scope Your Own Real Idea.txt#L14-L131]]"
      - "[[sources/js-mastery-engineer/20261107/course/051 - Scope Architecture Skills.en.txt#L364-L444]]"
      - "[[sources/js-mastery-engineer/20261107/course/033 - Demo- Running -scope.en.txt#L144-L157]]"
created: 2026-11-07
updated: 2026-11-07
---

# /scope：先挑戰想法，再寫程式

## Lesson

`/scope` 把一句話想法問成一條可執行的計畫：MVP 邊界、什麼明確不做、四種 build 策略與 workflow tier。輸出是 `docs/scope/scope.md`，之後每個 skill 都靠它知道現在在做什麼。

## Steps

1. [別讓 Agent 默默替你決定：專案預設的三個面向](scope-before-code/project-defaults.md)
2. [用 /scope 把一句話收斂成 MVP 規格與不做清單](scope-before-code/scope-the-idea.md)
3. [依風險決定 Build 策略與 Workflow Tier](scope-before-code/build-approach-and-tier.md)
4. [讀懂 scope.md 並用 replan 對齊開發進度](scope-before-code/scope-artifact-and-replan.md)
5. [帶著 Agent 的三個訓練傾向檢查 Scope：開工前的四項自檢](scope-before-code/challenge-your-idea.md)

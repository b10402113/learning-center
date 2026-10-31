---
id: code-you-didnt-write
title: "Code You Didn't Write：brownfield 的一天"
subject: agentic-engineer
tier: 4
order: 21
status: confirmed
goal: "能在沒有 AGENTS.md 的 repo 上跑 `/audit`，再用 scope → architect → develop 改一個既有流程而不弄壞它。"
digests:
  - ch12-code-you-didnt-write.md
  - code-reel-agentic-docs.md
  - code-jsm-skills-system.md
prerequisites: []
steps:
  - id: nobody-starts-from-scratch
    title: "Nobody Starts from Scratch：brownfield 才是常態"
    purpose: "能說出 agent 在既有 codebase 上為什麼會猜，並指認進 repo 與出 org 兩種風險。"
    sources:
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/1. Nobody Starts from Scratch (9_11_2026 1：52：40 PM).txt#L1-L48]]"
  - id: audit-before-any-change
    title: "Running audit：先畫地圖，再改一行"
    purpose: "能在沒有 AGENTS.md 的 repo 上跑完整庫 audit，並說出主執行緒與唯讀 scout 的分工。"
    sources:
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/2. Demo Running audit on a Real Open-Source Project.srt#L1-L123]]"
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/2. Demo Running audit on a Real Open-Source Project.srt#L124-L257]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/audit/SKILL.md#L1-L108]]"
  - id: read-the-map-against-reality
    title: "Reading the Map Against Reality：對照 stack、指令與慣例"
    purpose: "能逐項核對 audit 寫出的地圖，並判斷哪個區域真的值得一份巢狀 AGENTS.md。"
    sources:
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/2. Demo Running audit on a Real Open-Source Project.srt#L258-L498]]"
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/2. Demo Running audit on a Real Open-Source Project.srt#L499-L785]]"
      - "[[sources/agentic-engineer/20261030/reel-agentic_engineering/AGENTS.md#L1-L75]]"
      - "[[sources/agentic-engineer/20261030/reel-agentic_engineering/README.md#L1-L36]]"
  - id: scope-existing-features-first
    title: "Scope on Legacy Code：先登記 existing，再切這一刀"
    purpose: "能在既有 repo 上讓 /scope 分開 existing 與 in-progress，再挑出下一個 slice。"
    sources:
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/3. Demo Your First Change in Legacy Code.srt#L1-L152]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/scope/modes/plan-brownfield.md#L1-L11]]"
  - id: architect-then-develop
    title: "Guardrails in Practice：architect 追現況，develop 沿用慣例"
    purpose: "能追出既有請求路徑與依賴，用周邊檔案的慣例改動，並證明舊行為沒有被弄壞。"
    sources:
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/3. Demo Your First Change in Legacy Code.srt#L153-L300]]"
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/3. Demo Your First Change in Legacy Code.srt#L301-L500]]"
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/3. Demo Your First Change in Legacy Code.srt#L501-L720]]"
      - "[[sources/agentic-engineer/20261030/12. Workflow Code You Didn't Write/3. Demo Your First Change in Legacy Code.srt#L721-L949]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/architect/agent-modes/enhancement.md#L1-L45]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/develop/flow/build.md#L1-L128]]"
created: 2026-10-30
updated: 2026-10-30
---

# Code You Didn't Write：brownfield 的一天

## Lesson

大多數職業工程是 brownfield：你接手別人建的系統，使用者依賴它，而它沒寫下來的慣例對 agent 完全隱形。失敗原因不是模型弱，是缺一張地圖。這個 node 在一個手寫的 library app 上跑 `/audit`，再用一次真實改動看 scope 怎麼盤點、architect 怎麼追既有實作、develop 怎麼沿用本地慣例。

## Steps

1. [Nobody Starts from Scratch：brownfield 才是常態](code-you-didnt-write/nobody-starts-from-scratch.md)
2. [Running audit：先畫地圖，再改一行](code-you-didnt-write/audit-before-any-change.md)
3. [Reading the Map Against Reality：對照 stack、指令與慣例](code-you-didnt-write/read-the-map-against-reality.md)
4. [Scope on Legacy Code：先登記 existing，再切這一刀](code-you-didnt-write/scope-existing-features-first.md)
5. [Guardrails in Practice：architect 追現況，develop 沿用慣例](code-you-didnt-write/architect-then-develop.md)

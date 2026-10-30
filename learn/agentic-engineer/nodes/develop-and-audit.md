---
id: develop-and-audit
title: "Demo: Planning a Feature with develop"
subject: agentic-engineer
tier: 3
order: 14
status: written
goal: "能說明 plan 上沒有的工作怎麼被 gate 成一張 `Assumed` spec，並用 `/audit` 寫出短而有用的 AGENTS.md。"
digests:
  - ch08-workflow-ship-something-real.1.part.md
  - ch08-workflow-ship-something-real.2.part.md
  - code-jsm-skills-system.md
prerequisites: []
steps:
  - id: scaffold-before-feature
    title: "Greenfield 的第一件事不是 feature，是架構地基"
    purpose: "能說明 /develop 在 greenfield 上先 scaffold 架構地基、只裝第一個 slice 需要的依賴，並證明它能跑"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/9. Demo Planning a Feature with develop.srt#L1-L300]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/develop/flow/build.md#L1-L128]]"
  - id: develop-off-the-plan
    title: "把 develop 指向 plan 上沒有的工作"
    purpose: "能在工作不在 plan 上時通過 build gate，並留下一張記名 git author 的 Assumed spec"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/9. Demo Planning a Feature with develop.srt#L301-L620]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/develop/SKILL.md#L1-L144]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/architect/SKILL.md#L1-L206]]"
  - id: derive-the-design-system
    title: "從一張截圖推導 design system，而不是照抄"
    purpose: "能從一張 mock-up 推導 design.md 與各狀態的可重用元件，而不是把截圖照抄成靜態頁"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/9. Demo Planning a Feature with develop.srt#L621-L900]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/develop/ui/generate.md#L1-L131]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/develop/ui-guide.md#L1-L140]]"
  - id: audit-the-smallest-context
    title: "用 /audit 寫下最小但會改變行為的 AGENTS.md"
    purpose: "能說明 /audit 為什麼只寫會改變行為的最小 context，並在慣例衝突時指出兩個檔案"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/10. Demo Running audit.srt#L1-L640]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/audit/SKILL.md#L1-L108]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/audit/agent-prompt.md#L1-L378]]"
created: 2026-10-30
updated: 2026-10-30
---

# Demo: Planning a Feature with develop

## Lesson

`/develop` 是唯一會寫程式的階段，所以它的第一個動作不是寫，是問「這是實作還是決策」。這個 node 看它怎麼把 plan 上沒有的工作擋下來、寫一張具名的 `Assumed` spec 再往下走，以及 `/audit` 如何在之後把專案慣例收成一份短到會被讀完的 AGENTS.md。

## Steps

1. [Greenfield 的第一件事不是 feature，是架構地基](develop-and-audit/scaffold-before-feature.md)
2. [把 develop 指向 plan 上沒有的工作](develop-and-audit/develop-off-the-plan.md)
3. [從一張截圖推導 design system，而不是照抄](develop-and-audit/derive-the-design-system.md)
4. [用 /audit 寫下最小但會改變行為的 AGENTS.md](develop-and-audit/audit-the-smallest-context.md)

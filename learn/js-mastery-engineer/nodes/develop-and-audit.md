---
id: develop-and-audit
title: "/develop 與 /audit：照 spec 建，寫出 AGENTS.md"
subject: js-mastery-engineer
tier: 4
order: 9
status: written
goal: "能讓 `/develop` 依 spec 建、遇到未決策就停，並用 `/audit` 產出 agent 必讀的 AGENTS.md 與命令清單。"
digests:
  - 035 - Demo- Planning a Feature with -develop.en.md
  - 036 - Demo- Running -audit.en.md
  - 038 - Install Supabase MCP.en.md
  - 052 - Stack Tooling.en.md
  - 058 - Implement the Movie Catalog and Cache.en.md
  - 059 - Setup Design System and UI Foundation.en.md
  - 060 - Update the Design System.en.md
  - 061 - Design System Output.en.md
  - 062 - First Slice- Core taste loop.en.md
  - 063 - App Showcase.en.md
  - skills.md
  - 067 - Demo-Planning a Feature with -develop.md
  - 068 - Demo- Running -audit.md
  - 071 - Install Supabase MCP.md
  - 101 - Stack Tooling.md
  - 107 - Implement the Movie Catalog and Cache.md
  - 108 - Setup Design System and UI Foundation.md
  - 109 - Update the Design System.md
  - 110 - Design System Output.md
  - 111 - First Slice- Core taste loop.md
  - 112 - App Showcase.md
prerequisites:
  - learn/js-mastery-engineer/nodes/architect-the-spec.md
steps:
  - id: develop-spec-gate
    author: "google/gemini-3.8-flash"
    title: "`/develop` 開工前的檢查機制：讀取 Scope、Spec 與處理未決策"
    purpose: "能說明 `/develop` 開工前如何讀 scope 與 spec，並在遇到未決策時停下來交回 `/architect`。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/035 - Demo- Planning a Feature with -develop.en.txt#L1-L9]]"
      - "[[sources/js-mastery-engineer/20261107/course/035 - Demo- Planning a Feature with -develop.en.txt#L54-L99]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/067 - Demo-Planning a Feature with -develop.txt#L5-L24]]"
      - "[[sources/js-mastery-engineer/20261107/course/038 - Install Supabase MCP.en.txt#L1-L65]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/071 - Install Supabase MCP.txt#L5-L25]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/develop/SKILL.md#L1-L144]]"
  - id: develop-scaffold-and-jit
    author: "google/gemini-3.8-flash"
    title: "用官方 Initializer 建立專案骨架與即時依賴"
    purpose: "能用框架官方 initializer 建出可跑的骨架、只裝當下需要的依賴，並自己證明它能啟動。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/035 - Demo- Planning a Feature with -develop.en.txt#L10-L53]]"
      - "[[sources/js-mastery-engineer/20261107/course/052 - Stack Tooling.en.txt#L1-L52]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/101 - Stack Tooling.txt#L1-L29]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/develop/flow/build.md#L1-L128]]"
  - id: develop-ui-and-design-system
    author: "google/gemini-3.8-flash"
    title: "用 /develop 從截圖與 design.md 建出設計系統與完整畫面"
    purpose: "能讓 `/develop` 從截圖或 design.md 建出 design system 與畫面，並自己驗證視覺與對比。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/035 - Demo- Planning a Feature with -develop.en.txt#L100-L193]]"
      - "[[sources/js-mastery-engineer/20261107/course/059 - Setup Design System and UI Foundation.en.txt#L1-L232]]"
      - "[[sources/js-mastery-engineer/20261107/course/060 - Update the Design System.en.txt#L1-L67]]"
      - "[[sources/js-mastery-engineer/20261107/course/061 - Design System Output.en.txt#L1-L31]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/108 - Setup Design System and UI Foundation.txt#L1-L26]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/109 - Update the Design System.txt#L1-L23]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/110 - Design System Output.txt#L1-L22]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/develop/ui-guide.md#L1-L140]]"
  - id: audit-writes-agents-md
    author: "google/gemini-3.8-flash"
    title: "透過 /audit 建立專案脈絡：AGENTS.md 的設定、Gap-fill 與巢狀架構"
    purpose: "能用 `/audit` 產出含 stack、指令與規則的 AGENTS.md，並判斷何時用 gap-fill 與 nested 檔。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/036 - Demo- Running -audit.en.txt#L1-L147]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/068 - Demo- Running -audit.txt#L1-L22]]"
      - "[[sources/js-mastery-engineer/20261107/course/052 - Stack Tooling.en.txt#L53-L107]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/audit/SKILL.md#L1-L108]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/audit/modes/gapfill.md#L1-L12]]"
  - id: develop-audit-loop
    author: "google/gemini-3.8-flash"
    title: "走過真實功能的 develop、audit 與 check verify"
    purpose: "能在真實功能上跑完 develop 與 audit，讀懂 check verify 抓到的缺陷，並用 sync 補回過時的 AGENTS.md。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/058 - Implement the Movie Catalog and Cache.en.txt#L1-L71]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/107 - Implement the Movie Catalog and Cache.txt#L1-L24]]"
      - "[[sources/js-mastery-engineer/20261107/course/062 - First Slice- Core taste loop.en.txt#L1-L201]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/111 - First Slice- Core taste loop.txt#L1-L24]]"
      - "[[sources/js-mastery-engineer/20261107/course/063 - App Showcase.en.txt#L1-L53]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/112 - App Showcase.txt#L1-L26]]"
      - "[[sources/js-mastery-engineer/20261107/course/052 - Stack Tooling.en.txt#L108-L229]]"
created: 2026-11-07
updated: 2026-11-07
---

# /develop 與 /audit：照 spec 建，寫出 AGENTS.md

## Lesson

`/develop` 照 spec 建，遇到 spec 沒寫的決策就停下來問，而不是自己補。`/audit` 則把 stack、指令與慣例寫成 AGENTS.md，讓之後每個 skill 不必重新猜一次。

## Steps

1. [`/develop` 開工前的檢查機制：讀取 Scope、Spec 與處理未決策](develop-and-audit/develop-spec-gate.md)
2. [用官方 Initializer 建立專案骨架與即時依賴](develop-and-audit/develop-scaffold-and-jit.md)
3. [用 /develop 從截圖與 design.md 建出設計系統與完整畫面](develop-and-audit/develop-ui-and-design-system.md)
4. [透過 /audit 建立專案脈絡：AGENTS.md 的設定、Gap-fill 與巢狀架構](develop-and-audit/audit-writes-agents-md.md)
5. [走過真實功能的 develop、audit 與 check verify](develop-and-audit/develop-audit-loop.md)

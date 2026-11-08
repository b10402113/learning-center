---
id: architect-the-spec
title: "/architect：一次一個承載決策"
subject: js-mastery-engineer
tier: 4
order: 8
status: written
goal: "能讓 `/architect` 每次只解一個承載決策，並寫出 `index.md` 與 `rationale.md` 的 spec。"
digests:
  - 034 - Demo- Running -architect.en.md
  - 053 - Data Model.en.md
  - 057 - Architect the Movie Catalog and Cache.en.md
  - skills.md
  - 064 - Reading a Spec- What the Build Sees and What You Keep.md
  - 065 - Demo- Running -architect.md
  - 102 - Data Model.md
  - 106 - Architect the Movie Catalog and Cache.md
prerequisites:
  - learn/js-mastery-engineer/nodes/scope-before-code.md
steps:
  - id: one-load-bearing-decision
    author: "google/gemini-3.8-flash"
    title: "為什麼 /architect 一次只解一個承載決策？"
    purpose: "能判斷哪個技術選擇會左右後續程式碼，並說明 `/architect` 為何一次只解一個承載決策。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt#L1-L9]]"
      - "[[sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt#L10-L19]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/065 - Demo- Running -architect.txt#L5-L20]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/SKILL.md#L13-L28]]"
  - id: read-context-before-asking
    author: "google/gemini-3.8-flash"
    title: "在設計訪談前讀完專案脈絡，精準定位規格"
    purpose: "能在開問前讀完 scope、specs 與 AGENTS.md，推斷 mode 與平台並定位 spec 的編號與形狀。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt#L20-L37]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/SKILL.md#L89-L122]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/internal/design-conversation.md#L3-L43]]"
  - id: run-the-gated-interview
    author: "google/gemini-3.8-flash"
    title: "逐維度架構訪談：把資料模型、API 與邊界情況問到能寫成 Spec"
    purpose: "能用逐維度、每題一個建議的訪談，把資料模型、API、安全與邊界情況問到可寫成 spec。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt#L38-L91]]"
      - "[[sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt#L92-L181]]"
      - "[[sources/js-mastery-engineer/20261107/course/053 - Data Model.en.txt#L15-L128]]"
      - "[[sources/js-mastery-engineer/20261107/course/057 - Architect the Movie Catalog and Cache.en.txt#L14-L81]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/102 - Data Model.txt#L11-L22]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/106 - Architect the Movie Catalog and Cache.txt#L10-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/internal/design-conversation.md#L45-L122]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/SKILL.md#L50-L62]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/agent-modes/feature.md#L7-L36]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/agent-modes/architecture.md#L14-L48]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/internal/tool-discovery.md#L5-L32]]"
  - id: write-index-and-rationale
    author: "google/gemini-3.8-flash"
    title: "拆分 index.md 與 rationale.md：讓 Build 讀契約、人讀決策理由"
    purpose: "能把確認的答案寫成 `index.md` 與 `rationale.md`，讓 build 讀契約、人讀決策理由。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt#L228-L253]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/064 - Reading a Spec- What the Build Sees and What You Keep.txt#L11-L101]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/SKILL.md#L64-L79]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/spec-template.md#L7-L224]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/agent-prompt.md#L136-L212]]"
  - id: cross-check-and-ratify
    author: "google/gemini-3.8-flash"
    title: "用第二顆模型審查架構規格：缺口修補、生命週期與定案流程"
    purpose: "能用另一顆模型抓出 spec 缺口，處理 status、Assumed 與 supersede，並在確認後定案。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/034 - Demo- Running -architect.en.txt#L254-L330]]"
      - "[[sources/js-mastery-engineer/20261107/course/053 - Data Model.en.txt#L129-L152]]"
      - "[[sources/js-mastery-engineer/20261107/course/057 - Architect the Movie Catalog and Cache.en.txt#L114-L145]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/064 - Reading a Spec- What the Build Sees and What You Keep.txt#L102-L151]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/064 - Reading a Spec- What the Build Sees and What You Keep.txt#L152-L159]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/065 - Demo- Running -architect.txt#L21-L32]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/internal/after-subagent.md#L7-L88]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/SKILL.md#L24-L36]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/skills/skills/architect/SKILL.md#L179-L194]]"
created: 2026-11-07
updated: 2026-11-07
---

# /architect：一次一個承載決策

## Lesson

`/architect` 一次只處理一個會左右程式碼的決定：給你真實選項與建議，選完才寫進 spec。`index.md` 是 build 要遵守的契約，`rationale.md` 是留給未來自己與團隊的為什麼。

## Steps

1. [為什麼 /architect 一次只解一個承載決策？](architect-the-spec/one-load-bearing-decision.md)
2. [在設計訪談前讀完專案脈絡，精準定位規格](architect-the-spec/read-context-before-asking.md)
3. [逐維度架構訪談：把資料模型、API 與邊界情況問到能寫成 Spec](architect-the-spec/run-the-gated-interview.md)
4. [拆分 index.md 與 rationale.md：讓 Build 讀契約、人讀決策理由](architect-the-spec/write-index-and-rationale.md)
5. [用第二顆模型審查架構規格：缺口修補、生命週期與定案流程](architect-the-spec/cross-check-and-ratify.md)

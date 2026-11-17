---
id: spec-to-implement
title: "從 map 到 spec，再一次平行實作"
subject: real-engineer
tier: 2
order: 6
status: written
goal: "能把清完霧的 map 壓成 spec、切成 ticket，並判斷何時該 grill、Wayfinder 或直接 one-shot。"
digests:
  - 033 Spec → Implement.en.md
  - 034 Spec → Implement Solution.en.md
  - 035 Grill vs Wayfinder vs Ship First.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/wayfinder-map.md
  - learn/real-engineer/nodes/ticket-types.md
steps:
  - id: spec-flattens-the-map
    author: "google/gemini-3.8-flash"
    title: "從決策地圖到規格書：用 to-spec 收斂架構並確認測試接縫"
    purpose: "能把清完霧的 map 用 to-spec 壓成一份 spec，並在寫之前先確認測試 seam。"
    sources:
      - "[[sources/real-engineer/20261116/course/033 Spec → Implement.en.txt#L1-L15]]"
      - "[[sources/real-engineer/20261116/course/034 Spec → Implement Solution.en.txt#L1-L31]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/docs/agents/issue-tracker.md#L1-L14]]"
  - id: tickets-as-task-graph
    author: "google/gemini-3.8-flash"
    title: "將規格切成帶阻擋關係的 Tracer-Bullet 工單"
    purpose: "能把 spec 切成帶 blocking edges 的 tracer-bullet ticket，並依平行度調整顆粒度。"
    sources:
      - "[[sources/real-engineer/20261116/course/034 Spec → Implement Solution.en.txt#L32-L50]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/docs/agents/issue-tracker.md#L36-L45]]"
  - id: implement-spec-frontier
    author: "google/gemini-3.8-flash"
    title: "放手讓 AI 寫程式：implement-spec 如何用 worktree 與 merger 平行實作"
    purpose: "能說明 implement-spec 如何把 ticket 當 task graph、用 worktree 與 merger 平行推進 frontier。"
    sources:
      - "[[sources/real-engineer/20261116/course/034 Spec → Implement Solution.en.txt#L51-L79]]"
  - id: finish-the-last-mile
    author: "google/gemini-3.8-flash"
    title: "收尾無人看管的實作 Run：從 Review 修復、補足工具 Skill 到真實帳號 QA"
    purpose: "能替一次無人看管的實作 run 收尾：讀 review 發現、補工具、寫 skill，並用真實帳號 QA。"
    sources:
      - "[[sources/real-engineer/20261116/course/034 Spec → Implement Solution.en.txt#L80-L195]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/CODING_STANDARDS.md#L1-L25]]"
  - id: choose-your-planning-mode
    author: "google/gemini-3.8-flash"
    title: "依 Diff 大小選擇開發流程：One-shot、Grill with Docs 與 Wayfinder"
    purpose: "能用 diff 大小決定 one-shot、grill with docs 或 Wayfinder，並說明為何從 grill 起手。"
    sources:
      - "[[sources/real-engineer/20261116/course/035 Grill vs Wayfinder vs Ship First.en.txt#L1-L57]]"
created: 2026-11-16
updated: 2026-11-16
---

# 從 map 到 spec，再一次平行實作

## Lesson

map 清完霧之後，真正的產出是一份把決策攤平的 spec，再從 spec 切出可以平行實作的 ticket。這個 node 也回答「那我到底該用哪一種規劃」：diff 很小的直接 one-shot，不確定的先 grill with docs，只有在霧很濃時才升到 Wayfinder——而且升級容易、降級很難。

## Steps

1. [從決策地圖到規格書：用 to-spec 收斂架構並確認測試接縫](spec-to-implement/spec-flattens-the-map.md)
2. [將規格切成帶阻擋關係的 Tracer-Bullet 工單](spec-to-implement/tickets-as-task-graph.md)
3. [放手讓 AI 寫程式：implement-spec 如何用 worktree 與 merger 平行實作](spec-to-implement/implement-spec-frontier.md)
4. [收尾無人看管的實作 Run：從 Review 修復、補足工具 Skill 到真實帳號 QA](spec-to-implement/finish-the-last-mile.md)
5. [依 Diff 大小選擇開發流程：One-shot、Grill with Docs 與 Wayfinder](spec-to-implement/choose-your-planning-mode.md)

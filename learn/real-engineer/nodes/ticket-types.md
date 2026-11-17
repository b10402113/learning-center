---
id: ticket-types
title: "四種 ticket：grilling、research、task、prototype"
subject: real-engineer
tier: 2
order: 5
status: written
goal: "能依決策性質選對 ticket 類型，把一張 map 走完並清空 fog of war。"
digests:
  - 023 Grilling Ticket.en.md
  - 024 Grilling Ticket Solution.en.md
  - 025 Grilling Ticket 2.en.md
  - 026 Grilling Ticket 2 Solution.en.md
  - 027 Task Ticket.en.md
  - 028 Task Ticket Solution.en.md
  - 029 Prototype Ticket.en.md
  - 030 Prototype Ticket Solution.en.md
  - 031 Finish The Map.en.md
  - 032 Finish The Map Solution.en.md
prerequisites:
  - learn/real-engineer/nodes/wayfinder-map.md
steps:
  - id: grilling-to-decision
    author: "google/gemini-3.8-flash"
    title: "執行一張 Grilling Ticket：從釐清決策到結案寫回地圖"
    purpose: "能跑完一張 grilling ticket，問到決策收斂，並把決議寫回 map 後關票。"
    sources:
      - "[[sources/real-engineer/20261116/course/023 Grilling Ticket.en.txt#L1-L13]]"
      - "[[sources/real-engineer/20261116/course/024 Grilling Ticket Solution.en.txt#L1-L81]]"
  - id: grilling-hits-its-limit
    author: "google/gemini-3.8-flash"
    title: "在 Grilling 遇上無法決定的事：用 Prototype 與 Task 撥開迷霧"
    purpose: "能判斷哪些決策在 grilling 問不出來，改開 task 或 prototype，而不是硬問下去。"
    sources:
      - "[[sources/real-engineer/20261116/course/025 Grilling Ticket 2.en.txt#L1-L11]]"
      - "[[sources/real-engineer/20261116/course/026 Grilling Ticket 2 Solution.en.txt#L1-L61]]"
  - id: task-ticket-for-human-work
    author: "google/gemini-3.8-flash"
    title: "用互動式精靈處理只有人類能做的設定任務"
    purpose: "能把只有人能做的設定工作開成 task ticket，用 wizard 帶人做完並把結果記回 map。"
    sources:
      - "[[sources/real-engineer/20261116/course/027 Task Ticket.en.txt#L1-L17]]"
      - "[[sources/real-engineer/20261116/course/028 Task Ticket Solution.en.txt#L1-L87]]"
  - id: prototype-at-high-fidelity
    author: "google/gemini-3.8-flash"
    title: "用 Prototype Ticket 把決策拉到高擬真度，驗證行為才關票"
    purpose: "能用 prototype ticket 把決策拉到高 fidelity，驗到行為正確才關票。"
    sources:
      - "[[sources/real-engineer/20261116/course/029 Prototype Ticket.en.txt#L1-L33]]"
      - "[[sources/real-engineer/20261116/course/030 Prototype Ticket Solution.en.txt#L1-L193]]"
  - id: finish-the-map
    author: "google/gemini-3.8-flash"
    title: "清空迷霧：推進 Ticket 並收斂出完整的 Wayfinder 地圖"
    purpose: "能走完剩下的 ticket、清空 not yet specified，把整張 map 收成可轉 spec 的狀態。"
    sources:
      - "[[sources/real-engineer/20261116/course/031 Finish The Map.en.txt#L1-L17]]"
      - "[[sources/real-engineer/20261116/course/032 Finish The Map Solution.en.txt#L1-L195]]"
created: 2026-11-16
updated: 2026-11-16
---

# 四種 ticket：grilling、research、task、prototype

## Lesson

map 上的每一格都是一張 ticket，而 ticket 的類型取決於它卡住的是「決策」、「外部事實」、「人的手」還是「看不見的東西」。grilling 把決策問到收斂，research 取回外部資訊，task 交還給人做，prototype 則把東西拉到高 fidelity 讓人真的看見。把四種都跑過一輪，霧才會真的散。

## Steps

1. [執行一張 Grilling Ticket：從釐清決策到結案寫回地圖](ticket-types/grilling-to-decision.md)
2. [在 Grilling 遇上無法決定的事：用 Prototype 與 Task 撥開迷霧](ticket-types/grilling-hits-its-limit.md)
3. [用互動式精靈處理只有人類能做的設定任務](ticket-types/task-ticket-for-human-work.md)
4. [用 Prototype Ticket 把決策拉到高擬真度，驗證行為才關票](ticket-types/prototype-at-high-fidelity.md)
5. [清空迷霧：推進 Ticket 並收斂出完整的 Wayfinder 地圖](ticket-types/finish-the-map.md)

---
id: wayfinder-map
title: "Wayfinder：地圖、霧與 frontier"
subject: real-engineer
tier: 2
order: 4
status: written
goal: "能為一塊充滿未知的工作畫出 map、定出 destination，並認出第一個可動工的 frontier。"
digests:
  - 019 The Limits Of One Session.en.md
  - 020 Charting The Way.en.md
  - 021 Chart The Map.en.md
  - 022 Chart The Map Solution.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/brakes-and-accelerators.md
steps:
  - id: one-session-limit
    author: "google/gemini-3.8-flash"
    title: "單一 Grilling Session 的極限：從 Dumb Zone 到失去整體形狀"
    purpose: "能說明單一 grilling session 為何會掉進 dumb zone，以及為什麼把它拆成多個 session 會丟掉整體形狀。"
    sources:
      - "[[sources/real-engineer/20261116/course/019 The Limits Of One Session.en.txt#L1-L9]]"
      - "[[sources/real-engineer/20261116/course/019 The Limits Of One Session.en.txt#L10-L23]]"
      - "[[sources/real-engineer/20261116/course/019 The Limits Of One Session.en.txt#L24-L33]]"
  - id: fidelity-ladder
    author: "google/gemini-3.8-flash"
    title: "運用精細度階梯規劃任務：善用 Agent 的低成本原型"
    purpose: "能依 fidelity 階梯替計畫的每一部分決定何時停在討論、何時拉高到 prototype，並知道 agent 讓拉高變便宜。"
    sources:
      - "[[sources/real-engineer/20261116/course/019 The Limits Of One Session.en.txt#L34-L53]]"
      - "[[sources/real-engineer/20261116/course/019 The Limits Of One Session.en.txt#L54-L69]]"
  - id: map-and-destination
    author: "google/gemini-3.8-flash"
    title: "用 Wayfinder 繪製地圖：設定 Destination 與撥開 Fog of War"
    purpose: "能開一張 map issue、寫下 destination 與 fog of war，並把程式工作的 destination 定成一份 spec。"
    sources:
      - "[[sources/real-engineer/20261116/course/020 Charting The Way.en.txt#L1-L9]]"
      - "[[sources/real-engineer/20261116/course/020 Charting The Way.en.txt#L10-L20]]"
      - "[[sources/real-engineer/20261116/course/020 Charting The Way.en.txt#L21-L33]]"
      - "[[sources/real-engineer/20261116/course/020 Charting The Way.en.txt#L46-L58]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/docs/agents/issue-tracker.md#L1-L45]]"
  - id: blocking-and-frontier
    author: "google/gemini-3.8-flash"
    title: "用 Ticket 的 Blocking 關係畫出 DAG，並找出可執行的 Frontier"
    purpose: "能用 blocking 關係排出 ticket 的 DAG，並從 open、unblocked、unclaimed 的 children 認出 frontier。"
    sources:
      - "[[sources/real-engineer/20261116/course/020 Charting The Way.en.txt#L59-L70]]"
      - "[[sources/real-engineer/20261116/course/020 Charting The Way.en.txt#L71-L90]]"
      - "[[sources/real-engineer/20261116/course/022 Chart The Map Solution.en.txt#L78-L113]]"
      - "[[sources/real-engineer/20261116/course/022 Chart The Map Solution.en.txt#L114-L143]]"
  - id: chart-the-map
    author: "google/gemini-3.8-flash"
    title: "啟動第一次 Wavefinder Charting：從迷霧中定出規格地圖"
    purpose: "能跑完第一次 charting session：定出 destination、標出霧、派出 research，並認出第一個可動工的 frontier。"
    sources:
      - "[[sources/real-engineer/20261116/course/021 Chart The Map.en.txt#L1-L17]]"
      - "[[sources/real-engineer/20261116/course/021 Chart The Map.en.txt#L18-L27]]"
      - "[[sources/real-engineer/20261116/course/021 Chart The Map.en.txt#L28-L33]]"
      - "[[sources/real-engineer/20261116/course/022 Chart The Map Solution.en.txt#L1-L15]]"
      - "[[sources/real-engineer/20261116/course/022 Chart The Map Solution.en.txt#L16-L30]]"
      - "[[sources/real-engineer/20261116/course/022 Chart The Map Solution.en.txt#L31-L50]]"
      - "[[sources/real-engineer/20261116/course/022 Chart The Map Solution.en.txt#L51-L77]]"
created: 2026-11-16
updated: 2026-11-16
---

# Wayfinder：地圖、霧與 frontier

## Lesson

單一 session 的極限不是 token，而是問答一多就掉進 dumb zone；把規劃拆成多個 session 又會丟掉上下文。Wayfinder 的答案是一張存在 issue tracker 裡的 map：destination 決定方向，fog of war 標出還看不清的部分，frontier 則是現在真正可以動工的那幾張 ticket。這個 node 只做 charting，不把功能做完。

## Steps

1. [單一 Grilling Session 的極限：從 Dumb Zone 到失去整體形狀](wayfinder-map/one-session-limit.md)
2. [運用精細度階梯規劃任務：善用 Agent 的低成本原型](wayfinder-map/fidelity-ladder.md)
3. [用 Wayfinder 繪製地圖：設定 Destination 與撥開 Fog of War](wayfinder-map/map-and-destination.md)
4. [用 Ticket 的 Blocking 關係畫出 DAG，並找出可執行的 Frontier](wayfinder-map/blocking-and-frontier.md)
5. [啟動第一次 Wavefinder Charting：從迷霧中定出規格地圖](wayfinder-map/chart-the-map.md)

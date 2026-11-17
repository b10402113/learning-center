---
id: good-codebases
title: "好 codebase 的語言"
subject: real-engineer
tier: 4
order: 9
status: written
goal: "能用 leverage、locality 與 deep／shallow module 診斷 codebase，找出該加深的模組。"
digests:
  - 046 Rescuing A Legacy Codebase.en.md
  - 047 A Language For Good Codebases.en.md
  - 048 Searching For Shallow Modules.en.md
  - 049 Searching For Shallow Modules Solution.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
prerequisites:
  - learn/real-engineer/nodes/brakes-and-accelerators.md
steps:
  - id: codebase-is-the-environment
    author: "google/gemini-3.8-flash"
    title: "你的程式庫就是 Agent 的環境：戰術與戰略的重新分工"
    purpose: "能用「codebase 就是 agent 的環境」說明 tactical 與 strategic 的分工，並認出自己該負責的那一半。"
    sources:
      - "[[sources/real-engineer/20261116/course/046 Rescuing A Legacy Codebase.en.txt#L1-L71]]"
  - id: interface-depth-leverage
    author: "google/gemini-3.8-flash"
    title: "用五個核心詞彙判斷模組的深與淺"
    purpose: "能用 interface、implementation、depth、leverage、locality 這五個詞判斷一個 module 是深還是淺。"
    sources:
      - "[[sources/real-engineer/20261116/course/047 A Language For Good Codebases.en.txt#L1-L153]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/access.server.ts#L1-L202]]"
  - id: deletion-test
    author: "google/gemini-3.8-flash"
    title: "用 Deletion Test 揪出淺模組：該刪除還是加深？"
    purpose: "能用 deletion test 指出該刪的 module，並認出反覆以同序呼叫時該 deepen 的時機。"
    sources:
      - "[[sources/real-engineer/20261116/course/048 Searching For Shallow Modules.en.txt#L1-L29]]"
  - id: find-shallow-modules-in-cadence
    author: "google/gemini-3.8-flash"
    title: "在 Route 層找出淺模組並排定深化清單"
    purpose: "能在 Cadence 的 route 層找出該 deepen 的模組，並排出一份有先後順序的候選清單。"
    sources:
      - "[[sources/real-engineer/20261116/course/049 Searching For Shallow Modules Solution.en.txt#L1-L67]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.$slug.lessons.$lessonId.tsx#L1-L1714]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/access.server.ts#L1-L202]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/instructor.$courseId.tsx#L1-L2264]]"
created: 2026-11-16
updated: 2026-11-17
---

# 好 codebase 的語言

## Lesson

codebase 就是 agent 的環境，所以「好不好改」直接決定 agent 表現。這個 node 建立一套診斷語言：deep module 用小小的介面換來大量 leverage 與 locality，shallow module 則相反——看起來只是一個檔案一個 route，裡面什麼責任都混在一起。學會用這組詞，才有辦法把「這段程式很難改」講成一句 agent 聽得懂的話。

## Steps

1. [你的程式庫就是 Agent 的環境：戰術與戰略的重新分工](good-codebases/codebase-is-the-environment.md)
2. [用五個核心詞彙判斷模組的深與淺](good-codebases/interface-depth-leverage.md)
3. [用 Deletion Test 揪出淺模組：該刪除還是加深？](good-codebases/deletion-test.md)
4. [在 Route 層找出淺模組並排定深化清單](good-codebases/find-shallow-modules-in-cadence.md)

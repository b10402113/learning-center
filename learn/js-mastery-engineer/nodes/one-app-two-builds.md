---
id: one-app-two-builds
title: "同一支 App，兩種建法"
subject: js-mastery-engineer
tier: 1
order: 2
status: written
goal: "能從 vibe build 的 40 秒／35 美分與 workflow build 的免費快取，說明「決定有沒有被做」比程式碼寫得好不好更決定成敗。"
digests:
  - 023 - The Experiment- One App Two Builds.en.md
  - 024 - The Vibe Build- A Working App in One Session.en.md
  - 025 - Watch It Break.en.md
  - 026 - Autopsy- Reading the Vibe Codebase.en.md
  - 027 - Workflow-First- Decide Before You Build.en.md
  - 028 - Autopsy- The Workflow Codebase.en.md
  - 029 - Challenge- Break It Yourself.en.md
  - 049 - The Experiment- One App Two Builds.md
  - 050 - The Vibe Build- A Working App in One Session.md
  - 051 - Watch It Break.md
  - 052 - Autopsy- Reading the Vibe Codebase.md
  - 053 - Workflow-First- Decide Before You Build.md
  - 054 - Autopsy- The Workflow Codebase.md
  - 055 - The Two Bills.md
  - 056 - Challenge- Break It Yourself pdf.md
  - 057 - Challenge- Break It Yourself.md
prerequisites:
  - learn/js-mastery-engineer/nodes/why-ai-coding-falls-apart.md
steps:
  - id: the-experiment-and-the-vibe-build
    author: "google/gemini-3.8-flash"
    title: "打造同一款 App 兩次：對照實驗的條件與 Vibe Coding 的 Demo 迷思"
    purpose: "說出這場對照實驗的條件，並說明 vibe build 的 demo 為什麼看起來真的能用。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/023 - The Experiment- One App Two Builds.en.txt#L1-L26]]"
      - "[[sources/js-mastery-engineer/20261107/course/024 - The Vibe Build- A Working App in One Session.en.txt#L1-L25]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/049 - The Experiment- One App Two Builds.txt#L1-L16]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/050 - The Vibe Build- A Working App in One Session.txt#L1-L22]]"
  - id: watch-it-break
    author: "google/gemini-3.8-flash"
    title: "40 秒、35 美分與三個分頁：為什麼 Vibe App 一進真實環境就崩潰"
    purpose: "用 40 秒、35 美分與三個分頁三種答案，解釋 vibe app 為什麼在真實請求下崩掉。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/024 - The Vibe Build- A Working App in One Session.en.txt#L26-L37]]"
      - "[[sources/js-mastery-engineer/20261107/course/025 - Watch It Break.en.txt#L1-L33]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/051 - Watch It Break.txt#L1-L21]]"
  - id: vibe-autopsy
    author: "google/gemini-3.8-flash"
    title: "剖析 Vibe Codebase：找出四個致命傷與未決定的架構"
    purpose: "在 vibe codebase 指出四個殺手，並自己找出一個沒人做過的架構決定。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/026 - Autopsy- Reading the Vibe Codebase.en.txt#L1-L71]]"
      - "[[sources/js-mastery-engineer/20261107/course/029 - Challenge- Break It Yourself.en.txt#L1-L37]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/052 - Autopsy- Reading the Vibe Codebase.txt#L1-L37]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/056 - Challenge- Break It Yourself pdf.txt#L1-L16]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/057 - Challenge- Break It Yourself.txt#L1-L22]]"
  - id: workflow-first
    author: "google/gemini-3.8-flash"
    title: "打造具備工程思維的 AI 工作流程：在寫程式前先做好決定"
    purpose: "用 scope→architect→develop→check→test→sync 說明 workflow build 如何把決定寫在程式之前。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/027 - Workflow-First- Decide Before You Build.en.txt#L1-L49]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/053 - Workflow-First- Decide Before You Build.txt#L1-L31]]"
  - id: decisions-in-code-and-the-two-bills
    author: "google/gemini-3.8-flash"
    title: "從每次 35 美分到近乎零成本：兩個 Codebase 的架構抉擇"
    purpose: "比較兩個 codebase 的執行成本，說明快取與其他決定如何把每次 35 美分壓到近零。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/028 - Autopsy- The Workflow Codebase.en.txt#L1-L109]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/054 - Autopsy- The Workflow Codebase.txt#L1-L25]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/055 - The Two Bills.txt#L1-L353]]"
created: 2026-11-07
updated: 2026-11-07
---

# 同一支 App，兩種建法

## Lesson

同一支電影推薦 App 用兩種方式各建一次：一種一路許願，一種先把決策寫下來。demo 看起來一樣好，但打開原始碼與帳單就會看到差別——差別不在誰寫的程式碼，而在哪些決定從來沒有人做。

## Steps

1. [打造同一款 App 兩次：對照實驗的條件與 Vibe Coding 的 Demo 迷思](one-app-two-builds/the-experiment-and-the-vibe-build.md)
2. [40 秒、35 美分與三個分頁：為什麼 Vibe App 一進真實環境就崩潰](one-app-two-builds/watch-it-break.md)
3. [剖析 Vibe Codebase：找出四個致命傷與未決定的架構](one-app-two-builds/vibe-autopsy.md)
4. [打造具備工程思維的 AI 工作流程：在寫程式前先做好決定](one-app-two-builds/workflow-first.md)
5. [從每次 35 美分到近乎零成本：兩個 Codebase 的架構抉擇](one-app-two-builds/decisions-in-code-and-the-two-bills.md)

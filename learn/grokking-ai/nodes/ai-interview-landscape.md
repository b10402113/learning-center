---
id: ai-interview-landscape
title: AI 系統設計面試的全貌
subject: grokking-ai
tier: 1
order: 1
status: written
goal: 說出這場面試考什麼、五種題目形式、你的角色該深入哪一區，以及每次都要交代的四件事。
digests:
  - 1. Introduction The AI Interview Landscape.en.md
  - 2. How AI System Design Shows Up in Interviews.en.md
prerequisites: []
steps:
  - id: what-the-interview-tests
    author: google/gemini-3.8-flash
    title: 模型不是難點，難點是外面的系統：AI 系統設計面試在考什麼
    purpose: 用「模型不是難點、難點是它外面的系統」說明這場面試考什麼，以及 45 分鐘用來設計什麼。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/1. Introduction The AI Interview
        Landscape.en.txt#L1-L9]]
      - >-
        [[sources/grokking-ai/20261119/course/1. Introduction The AI Interview
        Landscape.en.txt#L61-L63]]
    blocks:
      - ai-system-design-interview
  - id: five-question-forms
    author: google/gemini-3.8-flash
    title: 辨識 AI 系統設計面試的五種題目形式
    purpose: 在開場判斷題目屬於五種形式中的哪一種，並說出這個判斷把這一小時的力氣導向哪裡。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/2. How AI System Design Shows Up
        in Interviews.en.txt#L11-L43]]
    blocks:
      - question-forms
  - id: lane-by-role
    author: google/gemini-3.8-flash
    title: AI 系統設計面試的賽道：模型該當黑箱還是打開？
    purpose: 依面試 loop 的職位決定模型要當黑箱還是打開，並在 lane 不明確時問出範圍。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/2. How AI System Design Shows Up
        in Interviews.en.txt#L45-L69]]
    blocks:
      - interview-lane
  - id: four-areas-every-answer-covers
    author: google/gemini-3.8-flash
    title: 設計 AI 系統必須交代的四個關鍵維度
    purpose: 對任何題目都交代具體需求數字、完整回饋迴路、成本延遲現實感與失敗誠實這四件事。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/2. How AI System Design Shows Up
        in Interviews.en.txt#L71-L111]]
    blocks:
      - four-design-dimensions
  - id: first-minute-read
    author: google/gemini-3.8-flash
    title: 在 AI 系統設計面試開場 30 秒內定錨對話
    purpose: 用分類形式、確認 lane、說出計畫三步在 30 秒內開場，並避開模型數學、模型名稱與框架冷知識。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/2. How AI System Design Shows Up
        in Interviews.en.txt#L113-L143]]
    blocks:
      - ai-system-design-interview
      - question-forms
      - interview-opening
      - four-design-dimensions
      - interview-lane
created: 2026-11-19T00:00:00.000Z
updated: 2026-11-19T00:00:00.000Z
---

# AI 系統設計面試的全貌

## Lesson

這門課從一個判斷開始：模型通常不是難的部分，難的是它外面的系統。這兩個 node 先把面試的形式講清楚——題目怎麼給、你的角色該深入哪一區、哪四件事每次都要交代——讓你之後看任何一題都知道該往哪裡放時間。

## Steps

1. [模型不是難點，難點是外面的系統：AI 系統設計面試在考什麼](ai-interview-landscape/what-the-interview-tests.md)
2. [辨識 AI 系統設計面試的五種題目形式](ai-interview-landscape/five-question-forms.md)
3. [AI 系統設計面試的賽道：模型該當黑箱還是打開？](ai-interview-landscape/lane-by-role.md)
4. [設計 AI 系統必須交代的四個關鍵維度](ai-interview-landscape/four-areas-every-answer-covers.md)
5. [在 AI 系統設計面試開場 30 秒內定錨對話](ai-interview-landscape/first-minute-read.md)

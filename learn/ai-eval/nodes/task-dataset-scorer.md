---
id: task-dataset-scorer
title: "每個 eval 都是 task、dataset、scorer"
subject: ai-eval
tier: 1
order: 3
status: written
goal: "能把任何 eval 拆成 task／dataset／scorer 三塊，並說出 eval 是 build→test→monitor 的迴路。"
digests:
  - lesson1.en.md
  - ByteByteGo_AI_Evals_Week1_SlideDeck.md
  - lesson2.en.md
prerequisites:
  - learn/ai-eval/nodes/why-ai-products-need-evals.md
steps:
  - id: task-is-the-jobs-to-be-done
    author: "google/gemini-3.8-flash"
    title: "定義 AI Eval 的任務：從任務目標、成功條件到禁止行為"
    purpose: "能把一個 eval 的 task 寫成 jobs-to-be-done、可驗收的成功條件，以及明確的禁止行為。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L408-L600]]"
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1001-L1100]]"
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L201-L320]]"
  - id: dataset-is-a-set-of-scenarios
    author: "google/gemini-3.8-flash"
    title: "為 AI 任務建立涵蓋典型、邊界與對抗案例的評測資料集"
    purpose: "能為一個 task 組出涵蓋典型、邊界與對抗案例的 dataset，並標明每個案例的預期結果。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L408-L600]]"
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1101-L1210]]"
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L721-L852]]"
      - "[[sources/ai-eval/20261108/supplement/lesson2.en.txt#L71-L170]]"
      - "[[sources/ai-eval/20261108/supplement/lesson2.en.txt#L561-L660]]"
  - id: scorer-turns-judgment-into-a-verdict
    author: "google/gemini-3.8-flash"
    title: "AI 評估三腳架：如何為任務選對 Code、LLM Judge 與真人評分者"
    purpose: "能為同一個 task 選對 code、LLM judge 或 human scorer，並說明每個選擇的誤判風險。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L408-L600]]"
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1001-L1100]]"
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L201-L320]]"
      - "[[sources/ai-eval/20261108/supplement/lesson2.en.txt#L71-L170]]"
  - id: eval-is-a-build-test-monitor-loop
    author: "google/gemini-3.8-flash"
    title: "把離線評測與線上監控接成完整迴路：從 Build、Test 到 Monitor 的 AI 迭代法"
    purpose: "能把 offline batch 測試與線上監控接成 build→test→monitor 的迴路，並說明失敗如何變成回歸案例。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L408-L600]]"
      - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L601-L700]]"
      - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L201-L320]]"
      - "[[sources/ai-eval/20261108/supplement/lesson2.en.txt#L261-L360]]"
      - "[[sources/ai-eval/20261108/supplement/lesson2.en.txt#L561-L660]]"
created: 2026-11-08
updated: 2026-11-08
---

# 每個 eval 都是 task、dataset、scorer

## Lesson

不論用 Braintrust、LangSmith 或自寫腳本，一個 eval 都離不開三塊：要測什麼（task／jobs-to-be-done）、用什麼案例測（dataset）、用什麼判斷（scorer）。這條節點也建立 eval 的迴路觀：offline 的 batch 測試與線上監控不是二選一，而是同一個 loop 的兩端。學會這個骨架後，換工具只是換標籤。

## Steps

1. [定義 AI Eval 的任務：從任務目標、成功條件到禁止行為](task-dataset-scorer/task-is-the-jobs-to-be-done.md)
2. [為 AI 任務建立涵蓋典型、邊界與對抗案例的評測資料集](task-dataset-scorer/dataset-is-a-set-of-scenarios.md)
3. [AI 評估三腳架：如何為任務選對 Code、LLM Judge 與真人評分者](task-dataset-scorer/scorer-turns-judgment-into-a-verdict.md)
4. [把離線評測與線上監控接成完整迴路：從 Build、Test 到 Monitor 的 AI 迭代法](task-dataset-scorer/eval-is-a-build-test-monitor-loop.md)

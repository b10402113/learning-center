---
id: binary-judge-rubric
title: "寫出 binary judge rubric"
subject: ai-eval
tier: 2
order: 6
status: written
goal: "能用五個元素寫出單一判準、輸出格式固定的 binary judge prompt。"
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
  - Week-2-Assignment-1-Step-by-Step-Walkthrough.md
prerequisites:
  - learn/ai-eval/nodes/evaluator-types.md
steps:
  - id: binary-beats-likert
    author: "google/gemini-3.8-flash"
    title: "打造可靠的 LLM Judge：為什麼你該放棄 1 到 5 分量表，改用單一判準 PASS/FAIL"
    purpose: "能說明為什麼單一判準的 binary PASS/FAIL 比 1–5 分量表可靠，並避免一個 judge 量多個判準。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L851-L1010]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L121-L230]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L231-L340]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L461-L583]]"
  - id: five-elements-of-a-judge-prompt
    author: "google/gemini-3.8-flash"
    title: "設計可靠 LLM Judge Prompt 的五個關鍵元素"
    purpose: "能列出可靠 judge prompt 的五個元素，並說出每個元素各自防止哪種誤判。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L851-L1010]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L121-L230]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L584-L700]]"
  - id: turn-a-failure-code-into-a-rubric
    author: "google/gemini-3.8-flash"
    title: "將失敗代碼轉為精準的評估 Rubric：打造五元素齊備的單一判準"
    purpose: "能把一條 failure code 翻成五元素齊備、有具體標準與邊界例子的單一判準 rubric。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L731-L850]]"
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L1681-L1830]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L231-L340]]"
      - "[[sources/ai-eval/20261108/supplement/code/Week-2-Assignment-1-Step-by-Step-Walkthrough.txt#L51-L69]]"
  - id: rubric-to-strict-verdict
    author: "google/gemini-3.8-flash"
    title: "把 Rubric 化為 System Prompt：用嚴格的 PASS/FAIL 打造 LLM Judge"
    purpose: "能把 rubric 當 system prompt 餵給 judge，並用嚴格的 PASS/FAIL 首行輸出驗證判決。"
    sources:
      - "[[sources/ai-eval/20261108/course/lesson3.en.txt#L851-L1010]]"
      - "[[sources/ai-eval/20261108/course/code/AI_Evals_InPractice_Week2_Deck.txt#L121-L230]]"
      - "[[sources/ai-eval/20261108/supplement/code/Week-2-Assignment-1-Step-by-Step-Walkthrough.txt#L70-L80]]"
      - "[[sources/ai-eval/20261108/supplement/code/Week-2-Assignment-1-Step-by-Step-Walkthrough.txt#L96-L109]]"
created: 2026-11-08
updated: 2026-11-09
---

# 寫出 binary judge rubric

## Lesson

一個可靠的 judge 靠的不是更長的 prompt，而是五個元素：auditor 角色、一個 binary 問題、明確的 PASS/FAIL 定義、邊界例子、固定輸出格式。這條節點解釋為什麼 binary 比 1–5 分量表可靠，以及為什麼一個 judge 只量一個判準。實作上會用 Week 2 的 assignment 把 failure code 翻成 rubric。

## Steps

1. [打造可靠的 LLM Judge：為什麼你該放棄 1 到 5 分量表，改用單一判準 PASS/FAIL](binary-judge-rubric/binary-beats-likert.md)
2. [設計可靠 LLM Judge Prompt 的五個關鍵元素](binary-judge-rubric/five-elements-of-a-judge-prompt.md)
3. [將失敗代碼轉為精準的評估 Rubric：打造五元素齊備的單一判準](binary-judge-rubric/turn-a-failure-code-into-a-rubric.md)
4. [把 Rubric 化為 System Prompt：用嚴格的 PASS/FAIL 打造 LLM Judge](binary-judge-rubric/rubric-to-strict-verdict.md)

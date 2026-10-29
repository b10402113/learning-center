---
id: judge-build
title: "Build a judge: rubric → binary Pass/Fail prompt"
subject: agent-eval
tier: 2
order: 2
status: written
goal: "Write a single-criterion binary Pass/Fail judge (clear definitions, few-shot examples, structured JSON) for one failure mode, and name the three biases it must survive."
prerequisites: []
steps:
  - id: code-check-or-judge
    title: "先判斷：這條 failure mode 該用 code check 還是 judge"
    purpose: "能依 failure mode 判斷該寫 code check 或 LLM-as-judge，並說出兩者的能力邊界。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1290-L1299]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1300-L1325]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1326-L1348]]"
  - id: one-criterion-binary
    title: "一個 judge 只審一個 criterion，答案只有 Pass / Fail"
    purpose: "能把一個 failure mode 收斂成單一 criterion，並寫出可判定的 Pass/Fail 定義。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1272-L1289]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1360-L1369]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1687-L1705]]"
  - id: four-part-template
    title: "四段式 judge prompt：任務、定義、few-shot、JSON"
    purpose: "能組出含 reasoning 與 answer 的 JSON 輸出，並用 Example 5-1 寫出可跑的 judge。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1337-L1348]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1360-L1444]]"
  - id: few-shot-and-splits
    title: "Few-shot 從哪裡來：人工標註與不泄漏的資料切分"
    purpose: "能從人工標註的 trace 挑 few-shot，並切出 train/dev/test 避免範例泄漏進 eval。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1370-L1444]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1445-L1454]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1671-L1677]]"
  - id: three-biases
    title: "Judge 必須活下來的三種偏誤：position、verbosity、self-enhancement"
    purpose: "能指出 position、verbosity、self-enhancement 三種偏誤，並說明它們在什麼情況下發作。"
    sources:
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1349-L1359]]"
      - "[[sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt#L1671-L1677]]"
created: 2026-10-29
updated: 2026-10-29
---

# Build a judge: rubric → binary Pass/Fail prompt

## Lesson

This opens the judge spine: turning a rubric into a working LLM-as-judge for exactly one narrow criterion, with a binary Pass/Fail decision and structured output. You build the four-part prompt template and learn the three systematic biases (position, verbosity, self-enhancement) the judge will have to be defended against later.

## Steps

1. [先判斷：這條 failure mode 該用 code check 還是 judge](judge-build/code-check-or-judge.md)
2. [一個 judge 只審一個 criterion，答案只有 Pass / Fail](judge-build/one-criterion-binary.md)
3. [四段式 judge prompt：任務、定義、few-shot、JSON](judge-build/four-part-template.md)
4. [Few-shot 從哪裡來：人工標註與不泄漏的資料切分](judge-build/few-shot-and-splits.md)
5. [Judge 必須活下來的三種偏誤：position、verbosity、self-enhancement](judge-build/three-biases.md)

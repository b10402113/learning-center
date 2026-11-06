---
id: llm-as-a-judge
title: "LLM-as-a-Judge（模型裁判）"
label: "LLM-as-a-Judge"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用另一個 LLM 依規則替待測輸出打分或比較，適合沒有單一標準答案的任務。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L360-L463]]"
created: 2026-11-06
updated: 2026-11-06
---

# LLM-as-a-Judge（模型裁判）

## 定義

LLM-as-a-judge 是用另一個語言模型擔任裁判，依給定的規則替待測模型的輸出打分、分類或兩兩比較。裁判的輸出可能是分數、排序，或一段判斷理由。

## 為什麼重要

很多 agent 任務沒有單一正確答案，例如摘要品質、建議是否得體、回覆是否有幫助。這些情況難以用 regex 或測試套件判分，於是用 LLM 當裁判成為常見替代方案。

## 如何運作

流程通常是把題目、待測輸出與評分規準一起送進裁判模型，請它給出分數或選擇較好的一方。若是兩兩比較，則把兩個候選答案放進同一個 prompt，讓裁判選出較佳者。裁判模型可以與待測模型相同，也可以不同。

## 例子

要比較兩個模型寫的客服回覆，可以把兩份回覆與評分規則交給裁判，請它判斷哪一份更符合政策、更有幫助。裁判給出的排序，就成為這次評測的結果。

## 邊界與常見誤解

裁判分數不是 ground truth。LLM 裁判有系統性偏誤，例如偏好同家族模型、被自信語氣說服、受答案順序影響。把裁判輸出當成絕對正確，會讓評測看起來精確，實際上只是換了一種猜測。

## 進階

比較穩健的作法是把 LLM 裁判與人工抽查並用：用裁判做大規模初篩，再抽樣人工確認。裁判的 prompt 與 rubric 也要版本化，因為改一句評分說明，分數分布就可能改變。

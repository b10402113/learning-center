---
id: lost-in-the-middle
title: "Lost in the Middle（迷失在中間）"
label: "Lost in the Middle"
subject: ai-agent-workflows
type: concept
status: draft
summary: "模型對 context 開頭與結尾記得較牢，夾在中段的重要資訊容易被忽略。"
aliases: []
prerequisites: []
related:
  - context-budget
  - compaction
  - maximal-marginal-relevance
sources:
  - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L324-L400]]"
  - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L27-L52]]"
created: 2026-11-06
updated: 2026-11-06
---

# Lost in the Middle（迷失在中間）

## 定義

Lost in the Middle 是一個 attention 現象：語言模型通常對 context 的開頭與結尾記得最清楚，夾在正中間的資訊則容易被忽略。即使這些內容確實存在於 prompt 裡，模型也可能在生成回答時漏掉它。

## 為什麼重要

Context window 變大不代表模型會平均使用所有內容。當 prompt 塞進大量文件或長對話時，關鍵事實很可能落在中段，被前後文淹沒。研究甚至指出，文件多到把視窗填滿時，模型找出中段資訊的表現可能比完全不給文件還差。對 agent 而言，這會直接變成錯誤決策，而使用者只會覺得 agent 很笨。

## 如何運作

模型對不同位置的內容有不同的注意力權重，開頭與結尾較容易被取用，中段較弱。當 context 裡堆滿無關或重複的片段，真正重要的一句話如果位在中間，就更容易被忽略。因此控制 context 的總量與中段雜訊，比單純擴大視窗更有效。

## 例子

一個單一 agent 的職涯顧問系統，把學生的 GPA、家庭資訊、學校清單與獎學金資格全部放進同一個視窗。學生說過「我想留在南卡羅來納州、靠近父母」，但這句話被埋在約 25 萬 token 的位置。模型最後推薦了奧勒岡州的學校，不是因為它沒收到這句話，而是它迷失在中間。

## 邊界與常見誤解

- **視窗變大不能解決**：塞進更多內容只會讓中段更厚。
- **這不是檢索失敗**：資料已經在 context 裡，問題出在模型沒有有效使用它。
- **不只是長文件問題**：多 agent 往返對話也會把關鍵訊息推到中段。
- **省成本與防失焦是同一件事**：壓縮中段、剔除無關資訊同時改善兩者。

## 進階

實務上的對策是少放一點、放得更精：用 [[compaction]] 壓縮中段、用 [[maximal-marginal-relevance]] 去除重複，並用 [[reranker]] 確保進來的片段真的有用。這些都屬於 [[context-budget]] 的一部分。

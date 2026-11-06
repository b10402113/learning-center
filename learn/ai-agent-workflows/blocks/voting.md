---
id: voting
title: Voting（多數決）
label: Voting
subject: ai-agent-workflows
type: concept
status: draft
summary: 對同一個任務平行跑多次，再彙整答案，用冗餘換取準確度與信心。
aliases: []
prerequisites: []
related:
  - sectioning
  - parallelization
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L33-L54]]
  - >-
    [[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L86-L129]]
  - >-
    [[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L41-L51]]
created: 2026-11-06
updated: 2026-11-06
---

# Voting（多數決）

## 定義

Voting 是平行化的另一種型態：對同一個任務同時發出多次呼叫，再比對或統計這些結果。各次呼叫可以是同一個 prompt 搭配不同溫度，也可以是不同模型，重點是用重複換取可靠的共識。

## 為什麼重要

單次 LLM 呼叫本質上是不穩定的；同一個問題可能這次答 A、下次答 B。當任務無法乾淨拆成獨立子任務時，voting 用冗餘（redundancy）提升準確度與信心，也讓系統能在多個答案不一致時明確發現不確定性。

## 如何運作

系統把同一份輸入平行送給 N 個呼叫，收集所有回傳後做彙整。彙整方式有兩種：

- **確定性程式碼**：建立計數物件統計每個答案出現幾次，取票數最高者。快、便宜、完全可預測。
- **LLM 綜整**：把原始結果交給另一個模型，寫成連貫敘事並解釋為何某個答案獲得最高共識。

實作時通常讓 temperature 保持一點隨機性，否則多次取樣會得到同一個答案，投票就失去意義。

## 例子

職涯諮詢系統把使用者的個性、興趣與目標同時送給三個「選職業」呼叫。三次分別回傳軟體工程師、UX 設計師、軟體工程師，程式碼統計後由軟體工程師以兩票勝出；若三票全散，就代表模型沒有共識，可考慮報錯或再取樣。

<!-- derived -->
```javascript
const calls = Array.from({ length: NUM_VOTERS }, () => callLLM(PICK_CAREER_PROMPT, input));
const votes = (await Promise.all(calls)).map((raw) => JSON.parse(raw).career.trim());
return majority(votes);
```

## 邊界與常見誤解

- **多數決不等於正確**：三個模型可能一起錯，冗餘只降低隨機誤差，不修正系統性偏誤。
- **票數一樣時需要規則**：平手要有明確的決勝方式，例如最早得票者優先。
- **成本是倍數成長**：跑 N 次就是 N 倍呼叫，必須先確認準確度的提升值得這個代價。
- **投票不是 sectioning**：sectioning 拆不同子任務，voting 重複同一個任務。

## 進階

Voting 可以整個放進其他 workflow 裡，例如在 evaluator-optimizer 的某一步用 voting 決定草稿方向。這種堆疊見 [[parallelization]] 與 [[workflow-scorecard]]。

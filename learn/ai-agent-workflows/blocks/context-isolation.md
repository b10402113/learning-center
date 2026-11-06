---
id: context-isolation
title: "Context Isolation（上下文隔離）"
label: "Context Isolation"
subject: ai-agent-workflows
type: concept
status: draft
summary: "讓每個 agent 只看自己任務所需的 context，而不是整條管線的完整歷史。"
aliases: []
prerequisites: []
related:
  - minimal-handoff-object
  - sequential-multi-agent
  - error-compounding
sources:
  - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L191-L199]]"
created: 2026-11-06
updated: 2026-11-06
---

# Context Isolation（上下文隔離）

## 定義

Context isolation 是把每個 agent 的上下文限制在它自己任務所需的內容：自己的 system prompt、必要的輸入，以及上一棒交出的結果。它不繼承整條管線的完整對話與推理過程。

## 為什麼重要

單一 agent 把所有規則、工具與歷史塞進同一個 context，很快就會擁擠、失焦、遺忘重點。隔離後，巨大的 prompt 被拆成數個小而專注的 prompt，每個 agent 只需要處理與自己任務相關的資訊，混亂與幻覺的機率也隨之下降。

## 如何運作

系統為每個 agent 準備獨立的 context：角色描述、專屬工具清單、這次任務的輸入。上游完成後，只把約定好的輸出交給下游，而不是把整份 transcript 複製過去。各 agent 因此可以各自使用不同模型與提示詞，也不必知道彼此存在。

## 例子

在 sequential 職涯管線中，career agent 只看到使用者的興趣與職涯目標，training agent 只看到選定的職業，funding agent 只看到訓練路徑。三者共用同一條流程，卻各自維持很小的 context。

## 邊界與常見誤解

- **不是完全沒有共享資訊**：必要的輸入與交接結果仍然要傳，只是不傳整個過程。
- **不是靠模型自己過濾**：隔離是由程式碼決定傳什麼，不能期待模型自動忽略雜訊。
- **不一定永遠更好**：若下游真的需要上游的推理脈絡，過度隔離反而讓它缺少判斷依據。

## 進階

隔離的關鍵是設計 [[minimal-handoff-object]]：只傳下一棒真正需要的欄位。這同時也是對抗 [[error-compounding]] 的手段，因為雜訊與半成品不會被完整複製到下一站。

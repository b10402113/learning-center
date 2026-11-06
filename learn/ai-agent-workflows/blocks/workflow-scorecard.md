---
id: workflow-scorecard
title: Workflow Scorecard（工作流成績單）
label: Workflow Scorecard
subject: ai-agent-workflows
type: concept
status: draft
summary: 用 context、reliability、cost 三欄評估 workflow 形狀，判斷何時該換成 agent。
aliases: []
prerequisites: []
related:
  - bounded-context
  - three-column-scorecard
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L41-L73]]
created: 2026-11-06
updated: 2026-11-06
---

# Workflow Scorecard（工作流成績單）

## 定義

Workflow scorecard 是一套評估工作流體質的三欄框架：context 是否有界、reliability 是否夠高、cost 是否可控。它用來比較不同 workflow 形狀，也用来判斷什麼時候該把控制權交給 agent。

## 為什麼重要

工作流看起來像魔法，拆開後其實只是熟悉的程式結構：chain 是函式呼叫函式、router 是 `switch`、parallelization 是 `Promise.all`、gate 是 `if`。既然形狀可以任意堆疊，就需要一個一致的判準來選，而不是憑感覺挑最複雜的圖。

## 如何運作

三欄各自有明確的判斷方式：

- **Context 有界（bounded context）**：每個步驟只看到開發者明確餵給它的資訊。把任務拆成多個 LLM 步驟的最大好處，就是嚴格控制上下文的大小與乾淨程度。
- **可靠度高（high reliability）**：步驟越多，幻覺或非確定性輸出的機會越多；但每個步驟都能獨立隔離測試，步驟之間也能插入驗證，整體仍然穩定。
- **成本可控（controllable cost）**：呼叫次數由程式碼掌握，通常只有一兩次，反覆生成的模式也有明確停止條件，不會莫名燒光預算。

## 例子

一個投票 workflow 只呼叫三次模型、每次只看一份使用者資料，最後用程式碼計票。它的 context 小、每一步可單獨測試、成本上限是三倍呼叫；用成績單看，就知道它適合「需要一點容錯但變化不大」的職涯推薦，而不是規則每年翻新的獎學金資格審核。

## 邊界與常見誤解

- **成績單不是萬能**：它評估的是體質，不評估「這個任務的分支能不能事先窮舉」。後者決定該用 workflow 還是 agent。
- **可靠度高不等於零錯誤**：步驟隔離測試降低了風險，但 LLM 呼叫本身的非確定性仍在。
- **形狀可以堆疊**：一個 evaluator-optimizer 迴圈裡可以放入 voting，成績單要針對整體而不是單一零件填寫。

## 進階

當分支數量爆炸、規則持續變動，手寫 `if/else` 根本窮舉不完時，成績單再漂亮也救不了。這時就是 workflow 交棒給 agent 的時刻，判斷線索見 Workflow-Agent Handoff，三欄的來源見 [[bounded-context]]。

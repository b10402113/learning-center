---
id: self-refine
title: Self-Refine（自我精煉）
label: Self-Refine
subject: ai-agent-workflows
type: procedure
status: draft
summary: 同一個模型依序扮演生成、批評與精煉三個角色，在沒有外部訊號的情況下反覆改寫答案。
aliases: []
prerequisites: []
related:
  - reflection
  - evaluator-optimizer
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L180-L219]]
  - >-
    [[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L28-L48]]
created: 2026-11-06
updated: 2026-11-06
---

# Self-Refine（自我精煉）

## 問題

模型第一次產出的答案常常不完整或有小錯，但手上沒有外部工具可以驗證。若直接送出，品質就停在第一版；若想改善，又沒有新的錯誤訊號可用。

## 前置條件

同一個模型要能扮演三個角色：生成初版、批評初版、依批評重寫。另外需要一個停止條件，可以是固定次數上限，也可以是模型自己判定「夠好了」。

## 步驟

1. 模型生成第一版答案。
2. 把答案丟回同一個模型，問它「這段內容有什麼問題？你會怎麼改？」
3. 把原答案與模型自己給的批評一起打包，要求模型重寫。
4. 重複第 2、3 步，直到達到次數上限或模型自認足夠好。

整個過程沒有外部訊號介入，三個角色都由同一個模型包辦，這正是它與 [[reflection]] 的分界。

## 例子

2023 年的 Self-Refine 論文在七個任務上測試，平均比「只回答一次」約提升 20%。但流程的箭頭仍由開發者畫下：是開發者決定加入批評步驟、決定讓模型重試、決定何時停止。

## 失敗模式

- **把正確答案改錯**：沒有新資訊時，模型可能為了「有事做」而修改本來沒錯的地方。
- **批評空泛**：只說「可以更好」而不指出具體問題，重寫自然不會改善。
- **成本失控**：若把迴圈與停止判斷全交給模型，可能反覆重試燒掉預算。
- **控制權轉移**：越接近讓模型自己決定何時停，越難保證流程符合預期。

## 進階

Self-Refine 本質上是自動化版的 [[evaluator-optimizer]]，差別在於少了程式碼寫死的迴圈與閘門。若要上 production，應由程式碼控制重試次數，並盡量把批評標準換成 External Signal；沒有訊號時，至少用 Bounded Retry Loop 守住成本。

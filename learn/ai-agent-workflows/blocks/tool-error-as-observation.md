---
id: tool-error-as-observation
title: "Tool Error Observation（工具錯誤回餵）"
label: "Tool Error Observation"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把工具錯誤當成一般文字 observation 回餵模型，讓它讀到錯誤並自行重試。"
aliases: []
prerequisites: []
related:
  - react
  - tool-calling
sources:
  - "[[sources/ai-agent-workflows/20261105/course/14-react.txt#L255-L308]]"
created: 2026-11-06
updated: 2026-11-06
---

# Tool Error Observation（工具錯誤回餵）

## 定義

Tool error observation 是一種錯誤處理方式：當工具執行失敗、參數格式錯誤或模型選了不存在的工具時，程式不直接讓 agent 崩潰，而是把錯誤訊息當成普通的觀察文字，附加回對話紀錄，讓模型在下一輪讀到並決定怎麼修正。

## 為什麼重要

Agent 的優勢之一，是能在同一任務裡根據回饋調整。如果工具錯誤直接中斷程式，這個優勢就消失了；模型永遠沒機會知道自己哪裡做錯。把錯誤回餵，等於把「失敗」轉成模型可推理的資訊，讓它能重新選擇工具、修正參數或改用別的做法。

## 如何運作

程式在執行 action 時檢查兩件事：模型指定的工具是否存在，以及呼叫是否拋出例外。任何失敗都轉成一段簡短、可讀的文字，例如「Invalid action. Use one of the listed tools with the exact format.」，再以 `Observation: ...` 的形式附加到 transcript。下一輪模型看到這段文字，重新推理。

## 例子

模型輸出一個不存在的工具名稱。程式找不到對應工具，但不丟出例外，而是回傳「Invalid action...」。模型在下一輪的 thought 中讀到這個 observation，於是改用工具清單裡的正確名稱，重新發出 action。

## 邊界與常見誤解

- **不是所有錯誤都能重試**：權限不足、服務中斷等問題，重試幾次也不會成功，仍需要停止條件。
- **錯誤訊息要短且可行動**：把整段 stack trace 回餵只會浪費 context，模型也難以消化。
- **不要洩漏敏感資訊**：錯誤文字可能包含金鑰、路徑或內部細節，回餵前要清理。
- **回餵不是萬能**：模型可能重複同一個錯誤，因此重試次數仍需上限。

## 進階

錯誤回餵讓 agent 能在失敗後自我修正，但也會拉長 transcript 並增加成本。設計時要同時考慮錯誤文字的長度、重試上限與整體停止條件。工具端的錯誤型態見 [[tool-calling]]，迴圈中的位置見 [[react]]。

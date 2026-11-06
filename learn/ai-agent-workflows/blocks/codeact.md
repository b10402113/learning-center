---
id: codeact
title: CodeAct（動作即程式碼）
label: CodeAct
subject: ai-agent-workflows
type: concept
status: draft
summary: 把 agent 的動作從 JSON 工具呼叫換成可直接在沙箱執行的程式碼，用一次執行走完多個查詢。
aliases: []
prerequisites: []
related:
  - tool-calling
sources:
  - '[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L1-L8]]'
  - '[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L71-L93]]'
created: 2026-11-06
updated: 2026-11-06
---

# CodeAct（動作即程式碼）

## 定義

CodeAct 是一種 agent 的行動表示法：模型輸出的 action 不是 JSON 工具呼叫，而是一段可直接在受控執行環境中執行的程式碼。模型寫程式碼去查資料、呼叫 API、過濾與組合結果，而不是逐一輸出「呼叫哪個工具、帶什麼參數」。

## 為什麼重要

JSON 工具呼叫每做一次動作，都要經歷「產生 JSON、應用程式解析並呼叫、等結果、塞回 prompt」的完整往返。任務需要三、四個工具時，這個往返要重複三、四次，既慢又耗 token。程式碼可以把手續串在同一個區塊裡，一次執行就完成。

另一個理由是模型的預訓練資料裡有大量程式碼，但它從來沒看過你臨時發明的工具規格。要求模型理解一組陌生 schema，通常比要求它寫一段呼叫 API 的程式碼更難。

## 如何運作

1. 模型讀到任務後推理，寫下一段可執行的程式碼，而不是 JSON 工具呼叫。
2. 程式碼送到沙箱執行；沙箱預先配置好可用的 API 與網路權限。
3. 沙箱回傳執行輸出，模型把它當成 observation。
4. 模型判斷資訊是否足夠；不夠就再寫一段程式碼，直到能給出最終答案。

整體迴圈和 [[react]] 很像，差別只在 action 的型態與執行位置。

## 例子

使用者問：「我很有創意、喜歡幫助人，有哪些職涯適合我？有哪些進修課程？我又該如何付費？」

JSON 版本會依序呼叫職涯查詢、等回傳、呼叫課程查詢、等回傳、呼叫助學金查詢。CodeAct 版本則寫一段程式碼，同時查職業資料庫、依查到的職業名稱搜尋課程、再找資助方案，一次執行就回傳整合後的結構化結果。

## 邊界與常見誤解

- **不是「模型直接上網」**：能力來自沙箱預先配置的 API 與權限，不是模型自己突破環境。
- **風險是執行模型生成的程式碼**：程式碼是即時生成、未經審查的，可能危險或具破壞性，因此需要 Sandbox 與 guardrails。
- **架設成本高**：傳統 ReAct agent 可能半小時能寫完，安全跑 CodeAct 需要受控執行環境與維運能力。
- **不是所有工具都有程式介面**：沒有 API 的能力仍得靠其他方式接出來。

## 進階

CodeAct 的核心假設是「模型寫程式取得答案的能力，勝過理解你自訂的工具規格」，這也是 Tool Parameter Schema 為什麼是它的弱點。實務上可把 CodeAct 當內層執行動作、外層再套 [[reflexion]] 之類的反思機制。

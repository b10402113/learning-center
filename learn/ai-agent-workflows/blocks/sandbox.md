---
id: sandbox
title: "Sandbox（沙箱）"
label: "Sandbox"
subject: ai-agent-workflows
type: concept
status: draft
summary: "受控的隔離執行環境，限制程式碼能存取的資源與網路，讓模型生成的程式碼可以安全執行。"
aliases: []
prerequisites: []
related:
  - codeact
  - prompt-injection-defense
  - tool-guardrails
sources:
  - "[[sources/ai-agent-workflows/20261105/course/17-codeact.txt#L49-L70]]"
created: 2026-11-06
updated: 2026-11-06
---

# Sandbox（沙箱）

## 定義

沙箱是一個受控、隔離的執行環境。它限制程式碼能讀寫的檔案、能連的網路、能呼叫的系統資源，並在外層加上 guardrails，讓不可信的程式碼即使出錯也無法傷害宿主系統。

## 為什麼重要

[[codeact]] 的動作是模型即時生成、從未經人工審查的程式碼。直接在主機上執行這種程式碼，本質上具備危險性或破壞性；沙箱是讓 CodeAct 從「理論上很酷」變成「可以上線」的必要條件。它同時也是 prompt injection 防禦的第一道防線。

## 如何運作

1. 在隔離的 runtime 中執行模型生成的程式碼，而不是在應用程式主行程裡。
2. 限制可用的系統呼叫、檔案系統與網路範圍。
3. 只開放任務需要的 API 與憑證，例如職涯資料庫、課程查詢、助學金 API。
4. 加上 guardrails 監控輸出與副作用，必要時中止執行。
5. 把執行結果回傳給 agent 當 observation。

## 例子

職涯規劃 agent 的沙箱預先配置 career database API、education programs API 與 financial aid API 的存取權限。模型寫一段程式碼同時查三個來源，沙箱執行後回傳結構化結果；模型不需要外部程式逐一轉發工具。

## 邊界與常見誤解

- **沙箱不是萬靈丹**：它能隔離執行，但不能阻止模型被惡意指令誘導去執行「合法但有害」的操作，仍需 [[prompt-injection-defense]]。
- **隔離越強，能力越弱**：限制太嚴會讓 agent 連正常 API 都用不了，需要在安全與可用性之間取捨。
- **維運成本真實存在**：需要團隊有能力架設與維護受控環境，這正是 CodeAct 難以隨手實作的原因。
- **不是所有任務都需要**：只有會執行動態程式碼或高風險工具時才需要這種等級的隔離。

## 進階

把沙箱與確定性檢查、每步 guardrail 疊成多層防禦，比單靠任何一層都可靠。真正的目標不是「保證零風險」，而是把風險降到可接受，並在出事時能快速定位與止血。

---
id: prompt-injection-defense
title: "Prompt Injection Defense（提示注入防禦）"
label: "Prompt Injection Defense"
subject: ai-agent-workflows
type: procedure
status: draft
summary: "用沙箱、確定性檢查與 guardrails 多層攔截惡意輸入，避免 agent 被誘導執行不該做的事。"
aliases: []
prerequisites: []
related:
  - sandbox
  - codeact
  - tool-guardrails
sources:
  - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L113-L141]]"
created: 2026-11-06
updated: 2026-11-06
---

# Prompt Injection Defense（提示注入防禦）

## 問題

當 agent 具備工具呼叫或程式碼執行能力時，惡意輸入可能藏在使用者訊息、網頁內容或工具回傳的資料裡，誘導 agent 去執行原本不該執行的動作。模型無法可靠分辨「指令」與「資料」，單靠叫它「不要聽壞人的話」並不足夠。

## 前置條件

需要一個能限制執行範圍的 [[sandbox]]、可在執行前檢查輸入的確定性程式碼，以及每一步都能驗證合規的 guardrails。最好還有日誌與人工審批，讓高風險動作多一道關卡。

## 步驟

1. **沙箱隔離**：限制程式碼能存取的檔案、網路與系統資源。
2. **確定性檢查**：在真正執行前，用傳統程式邏輯檢查輸入與指令，過濾已知的惡意特徵。
3. **每步 guardrail**：在 agent 的每個步驟加入驗證，確認動作合規才放行。
4. **分層攔截**：讓多層防禦互相補位，而不是依賴單一機制。
5. **記錄與審批**：保留執行紀錄，對不可逆或高風險操作要求人工確認。

## 例子

防禦思路和防 SQL injection 一樣：不是等到字串送進資料庫才祈禱它安全，而是在送入前先用確定性規則檢查。Agent 也該在把模型生成的指令送進執行環境前，先檢查其中是否包含特定危險模式。

## 失敗模式

- **只靠沙箱**：沙箱能隔離執行，但擋不住「合法權限內的有害操作」。
- **只靠 prompt 指示**：模型可能被更強的指令覆蓋，文字層的防線不可靠。
- **檢查太晚**：動作已經執行才檢查，傷害已經造成。
- **誤擋正常輸入**：規則太粗暴會讓合法請求也失敗，需要在安全與可用性間調整。

## 進階

防禦不可能達到百分之百，但把沙箱與確定性護欄結合，實務上能攔下大約 98% 到 99% 的注入風險。重點是把它當成持續對抗，而不是一次設定就永久有效；新的攻擊手法出現時，規則也要更新。

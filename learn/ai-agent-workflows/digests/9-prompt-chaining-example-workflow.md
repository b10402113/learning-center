---
source: sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt
source_type: text
source_lines: 408
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- 講者在 Copilot 現場生成 prompt chain workflow，並刻意 fake LLM calls，讓示範保持 deterministic。
- 重點論點：困難的不是接上 LLM，而是把 code flow 與 agent 本身寫對；之後只要把假呼叫換成真呼叫。
- Prompt 明確要求「LLM-powered workflow，不是 agent、不是多 agent」，使用 JavaScript、單一檔案、大量註解。
- 產出結構：user input → LLM 1 選職涯 → code gate → LLM 2 訓練路徑 → output，第三步因程式碼較長而略過。
- Gate 用一般程式碼而非 LLM：沒有輸入就不花錢呼叫；要求 JSON 方便確定性檢查；模型有時會包裹 JSON，gate 會攔下。
- 假資料示範 park ranger（4–5 年、natural resources/forestry/biology、USA Jobs）與 chef（學徒、culinary school、2–5 年）。
- LLM 在工作流中沒有控制權：只收文字、回文字，下一步全由程式碼決定。
- LangChain／LangGraph 能簡化工具、模型與對話歷史，但講者做 workflow 時偏好自己寫；每個步驟可用不同大小的模型。

# L2 detail

- `#L1-L12` — 進入程式碼示範：打開新 chat，先看實際在 production 建 workflow 與 agent 長什麼樣、有多難。
- `#L13-L40` — 先聲明會 fake LLM calls 並用註解標出替換位置；理由是保持 deterministic，且真正困難的是 code flow，不是把 LLM 放進去。
- `#L41-L64` — 給 Copilot 的 prompt：LLM-powered workflow、不要 agent 或多 agent、prompt chain、使用者喜好、選職涯、下一個 LLM 說明如何到達，並提示學校或證照。
- `#L65-L98` — 追加要求：JavaScript、大量註解、fake calls 與 API key 位置註解、單一檔案、盡量少行但保持清楚、可隨時提問。
- `#L99-L120` — 要求它查 prompt chaining workflow 以確認正確性；使用 reasoning model，允許 fetch 內容後讓它執行。
- `#L121-L143` — 提醒語言與檔案結構都可替換；產生 `prompt chain workflow` 檔案並保留。
- `#L144-L178` — 執行後 reasoning 消失但輸出說明：分成固定序列、每個 call 接前一個 output、步驟間有 plain code gate，符合 Anthropic 的 prompt chaining 描述。
- `#L179-L209` — 圖解：user input、LLM 1 選職涯、gate、LLM 2 如何到達、output；第三步略過；gate 用來及早停止、避免錯誤擴散。
- `#L210-L232` — 檢視假資料：park ranger 需 4–5 年、natural resources/forestry/biology 學位、季節性或志工經驗、透過 USA Jobs 或州立公園系統申請；chef 走學徒或 culinary school，2–5 年。
- `#L233-L257` — 唯一的 LLM 呼叫點：system 加 prompt 輸入、回傳文字；假版用粗略關鍵字比對，真模型則會從「喜歡戶外、討厭室內」推理。
- `#L258-L297` — 使用 free text 勝過表單；gate「沒有使用者輸入就不要付費呼叫」；step 1 要求只回 JSON（career、job title、reason），讓 step 2 的 gate 能用程式碼讀取。
- `#L298-L325` — 發出 career counselor 的 system prompt 與使用者輸入、記錄輸出；下一個 plain code gate 檢查失敗就停止，並能抓到模型多包一層的 JSON。
- `#L326-L356` — 第二個 LLM call 用自己的 system prompt，接收第一個 call 的職涯、理由與喜好，回答如何到達；兩個固定步驟後結束，LLM 無法觸發下一次呼叫，下一步由程式碼決定。
- `#L357-L375` — 問答：LangChain／LangGraph 確實能讓工具、模型選擇與對話歷史更容易；講者做 workflow 時仍偏好自己寫。
- `#L376-L408` — 鏈上每個步驟可各自使用不同模型與 system prompt：職涯適配可用小模型，需要最新學校資訊或更多 tool call 時改用大模型。

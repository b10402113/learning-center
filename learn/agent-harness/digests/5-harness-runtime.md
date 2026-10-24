---
source: sources/agent-harness/20260915/5-harness-runtime.txt
source_type: text
source_lines: 476
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- `runtime` 是 harness 的主體；先匯入 `streamText`、model、tools、system prompt，並設定 `maxSteps` 防止失控迴圈與帳單暴增。
- 一個 step 等同一個 turn：要求模型做事、執行、再讓它思考一輪。
- `runAgent` 先建立 workflow ID 並發出 workflow started，再組出 messages 陣列：第一則永遠是 system，第二則是用戶輸入。
- 用 `streamText` 而非 `generateText`，是為了 token 逐一串流到 UI；不 await 是因為拿到的是可迭代的 stream。
- 逐一處理 stream part 的型別：text delta、tool call、tool result、error，各自轉成對應的 UI 事件。
- Tool calling 的關鍵事實：LLM 不會執行函式，只回傳工具名稱與參數；真正執行與回填結果是伺服器的責任。
- tool call ID 是請求與結果的關聯鍵，沒帶回去多數模型會壞掉。
- 事件要帶上參數，才能做人類審批；只說「agent 想送出回覆」而不顯示內容，使用者無法判斷。
- 錯誤要轉成 workflow failed 事件並確保訊息是字串；沒有串流，這個產品根本不會有人用。

# L2 detail

- `#L1-L54` — 進入 runtime：匯入 `streamText`、model、tools、system prompt，說明串流的理由與 `maxSteps`（預設 10）如何避免 runaway agent，並定義 step 為一輪 tool 往返。
- `#L55-L118` — `runAgent` 的起手式：產生 workflow ID、發出 workflow started，組出 model messages；解釋 system／user／assistant／tool 四種 role 及為何第一則放 system prompt。
- `#L119-L149` — 進入 step 迴圈：以 `maxSteps` 為上限，呼叫 `streamText` 但不 await，因為回傳的是 stream reference；傳入 model、messages、tools。
- `#L150-L186` — 迭代 `fullStream`，依 part type 分派：text delta 是 token、tool call 是模型要求執行工具、另有結果與錯誤；每一種都要轉成 UI 能顯示的事件。
- `#L187-L266` — 處理 text delta：用 switch 攔截，透過 emit 把 `model delta` 事件推給 client；強調 transport 可換成 polling 或第三方服務，真正重要的是「呼叫 LLM 並通知關心此流程的 client」。
- `#L267-L322` — 處理 tool call 並拆解 tool calling 的責任分工：模型只給工具名稱與參數，函式必須在自家伺服器執行，結果再回餵模型；順帶區分 provider 託管工具與 client-side 工具。
- `#L323-L380` — 發出 `tool request` 事件：帶 workflow ID、tool call ID、工具名稱與參數；tool call ID 必須原樣回傳，否則模型無法配對結果而報錯。
- `#L381-L419` — 為何要把參數送到 UI：人類審批時必須看到實際內容，否則無從判斷；以寄信與銀行轉帳為例說明「只問是否核准」的荒謬。
- `#L420-L460` — 收尾事件：tool result 以 `tool completed` 帶回 output；模型或連線出錯時發 `workflow failed`，並用 `String()` 強制轉成字串。
- `#L461-L476` — 總結：整段程式只有在串流時才存在，若改成等待最終結果，大半程式可刪，但這種產品不會有人願意付費使用。

---
source: sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt
source_type: text
source_lines: 330
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- LLM 是無狀態的：每次呼叫都必須把整段對話重新送進去，否則模型看不到自己上一輪說了什麼。
- 串流只是「過程」，要等 stream 結束後才把 `result.messages` 併入 messages array，避免寫入半成品。
- 對話越長、tokens 越多，就越慢也越貴；這個成本問題是後續課程要處理的伏筆。
- 沒有 tool calls 時，harness 直接收尾：先發 `model completed`，再發 `workflow completed` 並帶上最終文字。
- 跳出 while loop 就代表異常（例如撞到 max steps），此時發出 `workflow failed` 給使用者。
- 另一個提問點出關鍵缺口：目前只有 WebSocket 串流、沒有持久化層，client 沒收到就等於永遠遺失。
- 用 API key 設定（`dev.vars`）把 Provider 憑證與程式碼分離，換 provider 就要換變數名稱。
- 作者刻意不用 AI SDK 內建的 agent loop／hooks，只拿它來呼叫 LLM，把 harness 的控制權留在自己手上。
- 試跑時暴露出 harness 的真實問題：重複送出回覆、未經核准就送出 draft，這些都要靠 harness 補上。

# L2 detail

- `#L1-L38` — 說明為何必須把 LLM 回覆 append 回 messages：模型端不保留任何對話記憶，memory 都留給 inference，所以成本隨對話長度上升。
- `#L39-L82` — 串流完成後 `await` 取得完整回應，再把 `result.messages` 逐筆 spread 進 messages array；反覆強調「等 stream 結束才 push」，不寫入片段結果。
- `#L83-L108` — 觀眾提問：WebSocket 另一端沒消費怎麼辦？帶出目前完全沒有 persistence layer，斷線即遺失，並預告需要可重播的儲存層。
- `#L109-L151` — `await` 取得 tool calls；若這一輪沒有 tool call，就取出最終文字，依序發出 model completed 與 workflow completed 兩個事件。
- `#L152-L179` — 整理多餘的 emit，並把迴圈外的收尾事件改成 workflow failed，說明「能離開 loop 只有 max steps 或例外」。
- `#L180-L214` — 設定 API key：複製 `dev.vars.example` 為 `dev.vars` 填入 OpenAI key；換 provider 需查各自的變數命名。
- `#L215-L258` — 重啟 dev server 實測 hello，並回答 maxRetries 與自製 max steps 的差異：用 SDK 的內建 loop 等於被綁進它的 harness 與 hooks。
- `#L259-L311` — 用範例 prompt 跑一次 dry run：只發 tool 事件、不真的執行工具，藉此暴露重複回覆與未經核准就送出 draft 的產品級缺陷。
- `#L312-L330` — 用 inspector 檢視每個 emit 出來的事件，理解 text delta 就是逐 token、以及模型與 workflow 的完成事件如何落地。

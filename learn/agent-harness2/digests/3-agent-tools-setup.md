---
source: sources/agent-harness2/20261029/3-agent-tools-setup.txt
source_type: text
source_lines: 395
supplements:
  - harness-engineering.1.part.md#L1-L129
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 最基本、沒有 harness 的 agent 就是一個 LLM 迴圈：帶入 tools 與使用說明，模型要求執行 tool 與參數，結果回灌直到它願意回答。
- 這個迴圈 demo 效果極強，卻不能上 production：無限迴圈、沒有失敗處理、沒有 approval，像「花錢工具」這種呼叫沒人把關。
- 真正的差距一半在 evals，一半在支撐用的基礎設施，也就是本課要補的 harness。
- 課程分支慣例：在 lesson branch 現場寫，解答已放在下一個 branch；切換前要自行 commit 或另開分支。
- 先建 tools 檔案，用 AI SDK 的 tool 建立工具；再用假的 knowledge base（billing、refund、export、pricing）當 agent 的 runbook。
- 每個 tool 需要 description（給 LLM 判斷何時用）、input schema（強制參數契約）與 execute（實際執行並回傳要餵回 LLM 的輸出）。
- search knowledge base 以 in-memory、轉小寫的 includes 做極簡搜尋，並特意設計「查無資料」時給 LLM 的提示。

# L2 detail

- `#L1-L40` — 說明沒有 harness 的 agent 解剖：對 LLM 迴圈，模型回傳要用的 tool 與參數，執行後把結果送回，直到模型有足夠 context 回答。
- `#L41-L64` — 指出這個迴圈不能上 production：wild loop、任何步驟都可能失敗、沒有 approval layer，遇到花錢的 tool 就出事。
- `#L65-L90` — 解釋為何這種迴圈 demo 很震撼（給對工具甚至能生成 3D 遊戲），但 LLM 是機率性的，結果難以重現與衡量。
- `#L91-L132` — 區分問題的兩半：evals 與基礎設施；本課只談後者，並說會照著畫面另一側的講義 live code 以免偏離。
- `#L133-L158` — 說明分支工作流：在 lesson one 現場寫，解答在下一個 branch；直接切換不會帶走修改，要先 commit 或另開分支。
- `#L159-L178` — 在 harness 建立 tools 檔案，從 AI SDK 匯入 tool 函式，並閒聊 @ai-sdk 套件命名。
- `#L179-L241` — 建立假 knowledge base：billing、refund、export、pricing 的處理指示，角色像 agent 的 runbook；外部化可避免每輪塞滿 context，並預告需要 evals 衡量其效果。
- `#L242-L292` — 建立 tools 物件與 search knowledge base：description 是 LLM 判斷是否呼叫的依據；input schema 強制參數契約，避免收到無法處理的參數。
- `#L293-L321` — 定義 query 字串欄位並用 describe 說明用途；以「向新同事介紹工具」比喻 description 該怎麼寫。
- `#L322-L343` — 實作 execute：接收 schema 定義的物件，可做任何事（甚至再呼叫 LLM），但必須回傳，因為輸出會餵回 LLM。
- `#L344-L371` — 以 Object.entries 遍歷 knowledge base，將 query 轉小寫後用 includes 比對 key，再取回對應文章；明言這不是 production 級 RAG。
- `#L372-L395` — 設計回傳物件：包含 articles 與命中數量，查無資料時回傳 no exact match 並提示可用最佳判斷或請使用者補資料。

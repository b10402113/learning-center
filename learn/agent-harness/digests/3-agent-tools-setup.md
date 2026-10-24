---
source: sources/agent-harness/20260915/3-agent-tools-setup.txt
source_type: text
source_lines: 395
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 沒有 harness 的 agent 本質上就是一個迴圈：給 LLM 工具與說明，LLM 決定要不要呼叫，我們執行後把結果餵回去，直到它願意回答。
- 這個迴圈 demo 效果極強，卻不能上 production：沒有失敗處理、沒有 approval、沒有護欄，而且 LLM 是機率性的，好結果難以複現與量測。
- 補救分兩條路：evals 與基礎設施；本課專注後者，也就是 harness。
- 講者邊看筆記邊 live code，並說明 branch 策略：解答在下一個 branch，想保留自己的版本要先 commit 或另開 branch。
- 課程刻意把 agent 做得很笨，所有工具與知識庫都是 mock，重點是有一個 fixture 可以拿來測試 harness。
- Knowledge base 是外掛的資訊 corpus，避免把大量內容塞進 context 吃掉 token，agent 再透過 RAG 或搜尋查詢。
- 一個 tool 由三部分組成：description 影響 LLM 是否選它、input schema 約束參數、execute 真正執行並回傳給 LLM 的結果。
- description 與欄位 describe 的寫法，就像對新進同事說明這個工具何時用、參數是什麼。

# L2 detail

- `#L1-L40` — 從教材中的最小範例複習 agent 的解剖：工具加描述、LLM 判斷是否呼叫、回傳結果、持續迭代直到足以回答。
- `#L41-L90` — 為何這個迴圈不能直接上 production：無界迴圈、缺乏失敗處理、沒有花錢前的 approval 層，而且成果是機率性的，不能靠一次漂亮 demo 判斷好壞。
- `#L91-L132` — 將問題拆成 evals 與基礎設施兩塊，本課處理基礎設施；同時說明講者如何對照筆記 live code，避免教出不同版本的解答。
- `#L133-L158` — branch 操作建議：解答已在下一個 branch，直接 checkout 不會帶走本地修改，若要延續自己的實作必須先 commit 或開新 branch。
- `#L159-L191` — 建立 `tools` 檔案並從 AI SDK 匯入 `tool`；同時建立假的 knowledge base，因為課程要的是 harness，不是聰明 agent。
- `#L192-L241` — 解釋 knowledge base 的用途與價值：外部化資訊、節省 context token、可透過 RAG 或搜尋查詢；內容對應 billing、refund、export、pricing 的 runbook，並提醒其效果需要用 evals 衡量。
- `#L242-L279` — 拆解 tool 的第一部分 description：它是 LLM 決定是否呼叫的主要依據，寫法沒有標準答案，本質是向新同事說明何時該用與工具在做什麼。
- `#L280-L321` — 第二部分 input schema：用 schema 強制 agent 提供必要參數，形成程式端的契約；每個欄位可加 describe 說明用途，避免收到無法處理的隨機參數。
- `#L322-L360` — 第三部分 execute：可執行任何邏輯（甚至再呼叫 LLM），但必須回傳值，因為輸出會成為餵回 LLM 的 tool result。
- `#L361-L395` — 示範極簡的 in-memory 關鍵字搜尋，並說明回傳物件是給 LLM 看的介面：有結果就回傳文章，沒結果就給訊息並提示下一步該怎麼做。

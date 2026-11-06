---
source: sources/ai-agent-workflows/20261105/course/6-agent-memory.txt
source_type: text
source_lines: 302
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- LLM 本身 stateless：每輪讀完 context、回覆後就忘記；聊天機器人「記得」是因為 app 重送完整歷史。
- COALA（2024）不是軟體也不是 agent，而是一套描述 agent 的詞彙：memory、actions、如何選 action。
- Agent 的 working memory 保存目標、已嘗試的事、tool 結果與 reasoning 筆記，context 只是每輪重建的臨時窗口。
- 長期記憶分三類：semantic（事實，通常就是 RAG）、episodic（經驗）、procedural（技能與做法）。
- Episodic 儲存方式：完整 transcript、對話摘要、向量資料庫、agent run log、純文字 notes 檔。
- 長期記憶回到 context 的方式：永遠載入（簡單但佔空間）或 on-demand 檢索（可擴展但怕檢索失敗）。
- Procedural memory 一部分在模型權重裡，其餘由 system prompt、tool 定義與任務程式碼提供，agent 也能自行寫新技能。
- 記憶只有在進入 context 後才有用；agent 必須反覆執行 retrieve → think → act → save 的循環。

# L2 detail

- `#L1-L19` — 主題是短期記憶；2024 年 COALA（Cognitive Architectures for Language Agents）提供描述 agent 的三個面向：memory、actions、decision。
- `#L20-L33` — LLM 沒有自己的記憶，完全 stateless；chatbot 看似記得，是 app 每次都把整段對話送回模型。
- `#L34-L52` — Working memory 追蹤使用者目標、嘗試過什麼、tool 結果、reasoning 筆記；每次呼叫前重建 context，回覆後存回 state。
- `#L53-L63` — Context window 有上限，塞滿要花時間與金錢；agent 要決定摘要舊回合、丟掉不相關 tool output、保留目標。
- `#L64-L84` — 長期記憶的定義與 semantic memory：客服的 help center 文章、退款政策等事實，通常就是人們說的 RAG。
- `#L85-L107` — Episodic memory 是經驗：過去 ticket、上次來電、承諾的退款；也包含 agent 給自己的教訓，例如研究 agent 註記某篇論文不相關。
- `#L108-L139` — 跨 session 記得訂單與承諾就是 episodic；常見做法是把完整 transcript 依 session ID 一列列存進一般資料庫，完整但可能太大。
- `#L140-L164` — 另一做法是只存摘要，COALA 建議在互動結束時學習並摘要；退款客服只需知道使用者要什麼、得到什麼。
- `#L165-L173` — 也可用向量資料庫存過去訊息或摘要，依語意搜尋相關經驗，等於把 RAG 用在經驗而非文件。
- `#L174-L192` — 可保存 agent run log：記錄步驟與成敗，讓 agent 避開失敗路徑，長期下來真的會變好。
- `#L193-L218` — 純文字 notes 檔：coding agent 在 session 開始讀取；Cursor 等 harness 的 session 資訊可能就藏在這類檔案。
- `#L219-L239` — 永遠載入適合小量資料，例如使用者簡短 profile 或最近幾份摘要；簡單但無論相關與否都佔 context。
- `#L240-L262` — On-demand 檢索：由程式觸發或模型呼叫 search memory tool；擴展性好，但依賴搜尋到正確內容。
- `#L263-L268` — LLM 非決定性，要盡量提供讓行為更確定的選項。
- `#L269-L289` — Procedural memory 是技能與 how-to：部分在權重中，其餘是 system prompt、tool 定義與任務程式碼；Minecraft 研究 agent 曾保存做劍的程式碼重複使用。
- `#L290-L302` — 記憶不進 context 就沒用；retrieval 取回、learning 存下，agent 要持續重複這個循環並提醒自己保存值得留的東西。

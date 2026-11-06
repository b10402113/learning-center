---
source: sources/ai-agent-workflows/20261105/course/5-context.txt
source_type: text
source_lines: 400
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Context 是有限資源，光是 system prompt 就塞滿行為規則、可揭露範圍與 tool-calling 格式。
- Multi-agent 系統還要放其他 agent 的知識、工具與 skill 定義、agent 之間的對話，而 agent 特別 verbose。
- 小模型 context window 更小，multi-agent 的成本又可能快速指數上升，因此必須嚴格控制 context。
- RAG 只取相關文件，但論文與書籍互相引用會把大量重複內容帶進 context。
- Re-ranker 區分「與 query 相關」和「真的能回答問題」：Seabiscuit 是馬，卻無助於解答秀馬問題。
- Context 不夠時用 compression／compaction：把歷史放到 cache 或資料庫（無損），或請 LLM 摘要（有損）。
- 去重複可用 1990 年代的 maximal marginal relevance（MMR）：相關性減去與既有內容的相似度。
- Lost in the middle 使壓縮更關鍵；RAG、re-rank、compaction 都要花錢，但換回 context 空間與可靠度。

# L2 detail

- `#L1-L17` — 開場：context 有限，之後還會回來談；prompt engineering 課幾乎整堂都在講 context。
- `#L18-L39` — System prompt 內容：模型在做什麼、該做與不該做的事、不該對外分享的資訊，以及不會原生呼叫工具時要輸出的格式。
- `#L40-L85` — 其他 agent 的知識、工具與 skill 定義、agent 間對話都佔 context；agent 講話冗長，小模型 window 更小，multi-agent 要更小心。
- `#L86-L117` — Multi-agent 成本可能指數上升；RAG 只抓相關資訊，但檢索回來的論文與書籍常互相引用，造成重複內容。
- `#L118-L146` — Re-ranker 檢查文件是否真的有助回答 query；Seabiscuit 例子說明「相關」不等於「有幫助」。
- `#L147-L164` — 想塞的東西太多而 token 有限；compression 是縮減 token 的策略，compaction 是 compression 的一種。
- `#L165-L187` — 無損做法：把整段對話移到 cache 或外部資料庫，例如 AI spouse 把對話歷史存在外部 DB 以維持時空感。
- `#L188-L216` — 有損做法：到某個門檻就請 LLM 摘要；是否接受丟失細節取決於 use case。
- `#L217-L235` — 偏好的壓縮法：找出重複文件，十篇論文若五篇重複就刪掉多餘副本。
- `#L236-L271` — MMR 來自 1990 年代：每個候選分數＝與 query 的相關性減去與既有內容的相似度；如何調參仍有爭論。
- `#L272-L288` — 重複保留還是保持乾淨取決於使用者需求；聽眾提問：RAG 不是已經排序了嗎，re-ranker 是另一步還是只多送資料。
- `#L289-L323` — 解答：embedding 找語意相似，re-ranker 判斷能否回答實際 query；兩者通常一起用。
- `#L324-L354` — RAG 資料量沒有通則，取決於 embedding、搜尋、維運資料庫的成本；相似文件太多反而會一次拉回過多內容。
- `#L355-L372` — Multi-agent 互相對話會讓更多東西卡在 context 中間，lost in the middle 因此更嚴重。
- `#L373-L400` — 成本記分板：RAG、re-rank、compaction 各有一筆 call 或儲存成本，但換回 context 與可靠度；retrieval 會出錯且錯得更自信，仍須持續評估與測試。

---
source: sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt
source_type: text
source_lines: 209
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Workflow 就是程式碼：script、function、lambda 或 if-else，是開發者寫好的 control flow。
- 即使加入 LLM，模型也只是其中一步，不能決定下一步；這是 Anthropic 對 workflow 的定義：路徑事先由人指定。
- 控制權光譜：workflow 由人寫所有箭頭；single agent 讓模型從預設集合挑箭頭；multi-agent 連誰挑下一個箭頭都交給模型。
- Prompt chaining：前一次呼叫的 output 成為下一次的 input，適合能乾淨拆解的任務。
- 相比單一大 prompt，小 prompt 更好處理、可在步驟間放 gate 驗證、能使用較小的模型。
- 代價是 latency：必須等前一個 call 回來才能餵給下一個。
- 貫穿全天的範例產品是職涯規劃：職涯適配 → 訓練路徑 → 資金選項 → 最終回覆。
- 也很適合除錯情境：必須先拿到第一份資料，才知道下一步該看哪裡。

# L2 detail

- `#L1-L15` — 主題是「不是 agent 的 LLM workflow」；先定義 workflow：它就是 code，可能是 script、function、lambda 或 if-else，是我們早已會寫的 control flow。
- `#L16-L33` — Workflow 裡可以有一部用 LLM 處理困難或需要自然語言生成的步驟，但模型不能選下一步；Anthropic 也把 workflow 描述成事先定義好的路徑。
- `#L34-L51` — 控制權光譜：workflow 由人寫所有箭頭；single agent 由模型從預設箭頭集合中選；multi-agent 由模型選箭頭與下一個行動者。
- `#L52-L64` — 即使步驟是人寫的，仍有設計模式要學；這些模式之後在 multi-agent 章節會再出現。
- `#L65-L77` — Prompt chaining 的定義與優點：任務可乾淨分解、小 prompt 優於大 prompt、步驟間可放 gate、用 latency 換 accuracy。
- `#L78-L93` — 每個設計都會套用到今天的職涯規劃產品，以比較相似處、差異與各自強弱。
- `#L94-L119` — Workflow 中每個 LLM 有固定工作；輸入是人格、興趣、目標，第一個 call 依此推薦職涯方向。
- `#L120-L147` — 第一個 call 的輸出成為第二個「訓練路徑」call 的輸入，再成為第三個「資金選項」call 的輸入，最後組出職涯、路徑與付費方式的回應。
- `#L148-L168` — 為何要用：整包丟給一個 LLM 理論上可行，但選項太多；拆成小而有定義的 prompt 通常答案更好，還能用小模型，換得準確度與結構。
- `#L169-L184` — 代價是 latency，因為序列依賴；若應用極度要求低延遲，這可能不是最佳選擇。
- `#L185-L209` — 除錯比喻：先看一份資料、判斷哪裡不對，才能決定看下一份；這也是 prompt chaining 很適合的場景。

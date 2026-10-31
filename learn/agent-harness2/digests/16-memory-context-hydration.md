---
source: sources/agent-harness2/20261029/16-memory-context-hydration.txt
source_type: text
source_lines: 407
supplements:
  - harness-engineering.1.part.md#L1-L74
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- context 無限成長會讓模型變笨、變慢、變貴：中間內容形同遺失，最終還會超過硬上限而報錯。
- 百萬 token window 不代表品質更好；對話型應用遲早必須 compaction。
- 使用者看到的完整歷史 ≠ LLM 實際看到的內容；後者只是即時組裝的一小段。
- 本課新增 hydrator（`buildContext`）與 token 門檻式 compactor，並用事件日誌保存歷史。
- `estimateTokens` 以 4 字元≈1 token 粗略估算；production 應使用與模型一致的 tokenizer。
- `summarize` 用 `generateText`（非串流）把舊回合併入滾動摘要，且只保留最近 token 預算。

# L2 detail

- `#L1-L49` — 問題：context 一直長大會讓模型「變笨」——開頭與結尾記得，中間內容視同遺忘；同時更慢、更貴，因為每次都要重送整段對話，最後甚至會因超出上限直接報錯，所有對話型 AI 應用終將遇到。
- `#L50-L83` — 常見解法是 auto/manual compact 或背景摘要；UI 顯示從頭到尾的聊天記錄，但模型實際只看到最後一小段，這是物理限制。本課要做的是壓縮持續膨脹的 event log，並按需組裝 context。
- `#L84-L107` — 定義兩個角色：hydrator 負責即時供給 agent 此刻需要的 context；compactor 依 token 門檻觸發，示範刻意把門檻設得很低以便觀察。接著切到 lesson 4 分支並建立 `memory.ts`。
- `#L108-L149` — `memory.ts` 匯入 `generateText`（compaction 不需串流給使用者）、型別、model 與 prompts；設定 `MAX_CONTEXT_TOKENS` 500、`KEEP_CONTEXT_TOKENS` 200，並說明 token 約 4 字元、實際取決於模型 encoder。
- `#L150-L195` — 實作 `estimateTokens`：直接以字元數除以 4 估算；坦白這不該用在 production，應使用與模型相同 encoder 的 tokenizer（如 TikToken），但 TypeScript 生態缺乏好用且即時的版本。
- `#L196-L220` — token 預算說明：要量測整個 messages 陣列；模型宣稱的 context window 是輸入與輸出的合計，輸入 token 預算通常比輸出小，因為使用者說的話通常少於模型輸出。
- `#L221-L257` — `buildContext(task, summary, turns)` 的骨架：先建立 baseline messages，第一則是 system prompt，第二則是 role user 的使用者任務；每次新訊息進來都重建 context，壓縮檢查也發生在這裡。
- `#L258-L299` — 若有 prior summary，應以 `content +=` 併入 system message，而不是再 push 第二則 system message；兩則 system message 雖可運作但會收到警告，是 bad practice。
- `#L300-L335` — 逐一將 turn push 進 context；接著寫 `summarize`：使用 `generateText` 而非 `streamText`，因為摘要不需要串流，必須等結果完成才能繼續任務；並修正 turns 是 array of arrays 的型別問題。
- `#L336-L407` — summarizer 就是一次 LLM 呼叫：先 flatten 舊 transcript、截取約 6000 字元，附上 prior summary，使用專屬 system prompt 要求保留事實、item ID、分類、draft ID、金額與已寄送內容；messages 最後必須是 user role，否則模型不會動作，最後回傳更新後的摘要文字。

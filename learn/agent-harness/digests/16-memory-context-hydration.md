---
source: sources/agent-harness/20260915/16-memory-context-hydration.txt
source_type: text
source_lines: 407
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Context 不是越大越好：內容一多，模型會變笨、變慢、變貴，而且中間段落最容易被忽略，這就是 context rot 的實際表現。
- UI 上看到完整對話歷史，不代表 LLM 真的看到全部；agent app 通常只在背景餵入最近一小段 context。
- 百萬 token context window 不是解法，模型仍會退化，最後還會直接撞到硬上限而報錯。
- 本課要補上兩塊 harness 能力：用 compactor 把持續膨脹的 event log 壓縮，用 hydrator 在每次呼叫前按需組裝 context。
- compactor 採 token 門檻策略：估計目前 token 數，超過上限就摘要最舊的 turns。
- token 估計在教學版用「約 4 字元等於 1 token」粗算；production 應使用與模型 encoder 一致的 tokenizer，例如 tiktoken。
- buildContext 以 system prompt、本次 user task、累積 summary、近期 turns 重建 messages；summary 併入 system prompt，而不是新增第二個 system message。
- summarize 用 generateText 而非 streamText，因為摘要必須先完成才能繼續跑任務，並且要能把舊 summary 摺進新 summary，形成 summaries of summaries。

# L2 detail

- `#L1-L49` — 說明 context 無限成長的後果：middle-of-context 資訊被遺忘、延遲與成本上升、最後因超過 window 而直接出錯，因此所有對話型 AI 應用遲早都會壞。
- `#L50-L83` — 對照使用者看到的完整歷史與 LLM 實際看到的少量內容，指出 auto compact、手動 compact 都是同一類解法，並宣告本課要做 compaction 與 on-demand context assembly。
- `#L84-L107` — 定義 hydrator（每次即時提供 agent 需要的 context）與 compactor（以 token 門檻觸發），並切到 lesson 4 分支開始實作。
- `#L108-L149` — 建立 memory.ts，匯入 generateText、model、system prompts，設定 maxContextTokens 與 keepContextTokens 兩個超低門檻以便觀察，並解釋 token 與 model encoder 的關係。
- `#L150-L220` — 實作 estimateTokens：以每 4 字元估算整段 messages 的 token 數，說明為何 production 應改用與模型一致的 tokenizer，並區分 input 與 output token 預算。
- `#L221-L299` — 實作 buildContext：以 system prompt 為基底、放入本次 user task、把既有 summary 併入 system content，再逐 turn 接回近期 messages，同時提醒不要建立兩個 system messages。
- `#L300-L358` — 實作 summarize：改用會等待完成的 generateText，將舊 turns 攤平並字串化，帶入 prior summary，讓摘要可以遞迴累積。
- `#L359-L407` — 設計 summarizer 專用的 system prompt（保留事實、ID、金額、已寄出的內容、保持精簡），並強調 messages 陣列最後必須是 user message，LLM 才會動手產出更新後的 summary。

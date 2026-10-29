---
source: sources/agent-harness2/20261029/17-summarization-compaction.txt
source_type: text
source_lines: 321
supplements:
  - harness-engineering.1.part.md#L1-L74
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- runtime 在每次 model turn 之前檢查 token，先壓縮再呼叫 LLM，避免 context 超限。
- 以 `turns` 與 `summary` 兩個狀態貫穿 workflow， summary 可跨多次壓縮累積。
- 壓縮採 sliding window：`turns.shift()` 把最舊回合移入 `old`，直到降到 `KEEP_CONTEXT_TOKENS`。
- 必須以 turn 為單位而非 message 為單位，否則會留下懸空的 tool call。
- `summarize` 包成 DBOS step，並發出 `MemoryCompacted` 事件讓使用者知道內容被摘要。
- hydrate 時用 `buildContext(task, summary, turns)` 重建 messages，再交給 model turn。

# L2 detail

- `#L1-L29` — 從 `memory` 匯入 `buildContext`、`summarize`、`estimateTokens`、`MAX_CONTEXT_TOKENS`、`KEEP_CONTEXT_TOKENS`；提高 max steps 以容納更多 token；在 workflow 內初始化 `turns = []` 與 `summary = ""`。
- `#L30-L57` — 壓縮必須發生在 model turn 之前：先估算 `turns.flat()` 的 token，若超過 `MAX_CONTEXT_TOKENS` 就開始處理，因為真正會爆掉的位置就是呼叫 LLM 的當下。
- `#L58-L98` — 以 `while (turns.length > 1 && estimateTokens(turns.flat()) > KEEP_CONTEXT_TOKENS)` 把最舊的 turn `shift` 到 `old`；這是 sliding window。強調以 turn 為單位，若以 message 為單位可能讓陣列停在半個 tool call，造成 broken state。
- `#L99-L150` — 若 `old` 非空，用 `DBOS.runStep` 呼叫 `summarize(old, summary)` 產生新摘要；重新以 `estimateTokens` 量測 hydrate 後的 context；再發 `MemoryCompacted` 事件，帶上 workflow ID、摘要回合數、目前 token 數與摘要內容。
- `#L151-L197` — hydrate：用 `buildContext(userInput, summary, turns)` 取得含摘要的 context，並把傳給 model turn 的參數從原始 `messages` 改成 `context`，確保模型看到的是壓縮後版本。
- `#L198-L277` — 以 `turn.response.messages` 取得 `turnMessages`，push 回 `turns`；說明 `Turn` 型別包含 text、toolCalls、responseMessages，因此一個 turn 必定是完整循環（user input → 可能 tool call → response），以此為壓縮單位可避免大量 role 判斷與破損狀態。
- `#L278-L321` — 更新 system prompt，要求模型一次處理一個 item、完成四步後再進行下一個，並在全部完成後簡短摘要；這是為了在 demo 中強迫產生足夠 token 以觸發 compaction，實務上未必需要。最後同步更新 sample task。

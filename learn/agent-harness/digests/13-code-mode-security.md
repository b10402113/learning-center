---
source: sources/agent-harness/20260915/13-code-mode-security.txt
source_type: text
source_lines: 168
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 先立下前提：sandbox、handoff 這類機制是工具箱選項，不是 agent 的必備條件；Claude Code 用單一 agent 也運作良好。
- 第一個動機是安全：當 agent 要跑 Bash、SQL 或算術時，不該讓模型產生的程式碼直接跑在你的機器或正式環境。
- 第二個動機是 code mode：與其讓模型一輪一輪呼叫工具，不如讓它寫一段程式把多個工具串起來、一次執行。
- Code mode 把十幾次 tool call 壓縮成一次，換來更快的決策、更少的 token，以及 deterministic 的計算結果。
- LLM 擅長寫程式、不擅長算數，所以「讓它寫程式去算」比「讓它推理算數」更可靠。
- 沙箱必須無法逃脫；正式環境應使用專門的 sandbox 產品，課程則用 Node 的 `vm` 做離線示範。
- 本段預告要實作 `runCode` 工具：接收程式碼、在沙箱執行、把結果回傳給 agent。

# L2 detail

- `#L1-L40` — 開場免責聲明：所有示範都是「如果 agent 需要，可以這樣做」，不是每個 agent 都該具備的能力，重點是放進工具箱。
- `#L41-L61` — 說明何時需要 sandbox：coding agent 想跑 Bash、分析型 agent 想跑 SQL 或算術，你都不會想讓那些程式碼直接跑在自己的機器或伺服器上。
- `#L62-L104` — 介紹 code mode：現在每個工具是一輪對話（示範 12 輪），若讓 LLM 自己寫一段串接工具的程式，就能用一個工具拿到所有答案。
- `#L105-L134` — 為何 code mode 有效：agent 擅長寫程式，算術交給程式比交給模型更快、更準，因為程式是 deterministic 的。
- `#L135-L162` — 沙箱的邊界要求：必須無法逃脫，就像你不會把正式環境暴露給陌生人；課程用 Node `vm`（即使曾有逃脫漏洞）做離線版，正式環境另有產品。
- `#L163-L168` — 收尾預告：新增一個 `runCode` 工具，讓模型寫程式並執行，再從 API 暴露出去。

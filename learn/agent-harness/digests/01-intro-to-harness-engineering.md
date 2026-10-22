---
source: sources/agent-harness/20260915/harness-engineering/lessons/01-intro-to-harness-engineering/index.md
source_type: text
source_lines: 311
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

第一課的講義，定調整門課：不造垂直 agent，造能跑任何 agent 的 harness。

- 全課主軸：agent systems are workflow systems；LLM 決定下一個語意步驟，harness 擁有執行。
- 課程提供外殼：Express + WebSocket、event bus、inspector UI、stubbed `runAgent`。
- Brittle agent 是一個 `while` 迴圈：一次模型呼叫、執行 tool、把結果塞回 messages。
- 六個 production 斷點：crash 失狀態、tool 無中介、context 無限成長、單一 agent 做全部、sub-agent 無恢復、approval 阻塞 server。
- 講義要求學員跑起來後親手弄壞它：中斷、未審批副作用、大量工單、角色混雜。
- 後續課程逐一補上 durable execution、sandbox、memory、routing、supervision、approval。

# L2 detail

- `#L1-L10` — 課程定位與主軸：harness 是主角，agent 是 crash-test dummy。
- `#L12-L30` — 起始專案提供的伺服器、event bus、inspector、stubbed `runAgent`。
- `#L32-L58` — Demo agent 的 `while` 迴圈與六個 production 斷點清單。
- `#L60-L140` — 建立 tools：`searchKnowledgeBase`、`classifyItem`、`draftReply`、`sendReply`，其中 `sendReply` 無中介。
- `#L142-L165` — system prompt 與 sample task：明確要求送出回覆。
- `#L167-L264` — 實作 brittle agent loop：in-memory messages、`streamText` 單回合、事件轉發、`MAX_STEPS`。
- `#L266-L289` — 迴圈逐段解說與執行方式。
- `#L291-L311` — 弄壞它：中斷、未審批寄信、大量工單、角色混雜；對應到 LangGraph、Mastra 等 production 工具。

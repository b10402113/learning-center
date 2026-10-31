---
source: sources/agent-harness2/20261029/15-updating-the-system-prompt.txt
source_type: text
source_lines: 223
supplements:
  - harness-engineering.1.part.md#L1-L65
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- system prompt 要明確告知模型可使用 `run code` tool，並在算術時優先寫程式。
- 示範任務：找出重複扣款並算出精確退款金額。
- 模型自行產生 JS，`await tools.getCharges`、查 KB 退款政策、算出 $49。
- 一次程式執行取代多次工具呼叫，比要求模型心算更快、更準。
- LLM 對數字與日期容易 hallucinate；把輸入交給 deterministic 程式可避免。
- 追問釐清 timeout 設定：預設 2 秒，可傳 options，`Promise.race` 決定程式或計時器先結束。

# L2 detail

- `#L1-L37` — 更新 system prompt，加入「需要算術時請使用 run code tool，寫 JavaScript 並在 async 包裝函式中執行」的指示；講者強調寫法沒有標準答案，能讓模型知道工具存在即可。
- `#L38-L67` — 放入 billing 範例任務：找出重複扣款並告訴使用者精確的美元退款金額；重啟 app、送出同類 prompt，準備觀察模型是否自行呼叫 run code。
- `#L68-L107` — 模型先分類、接著呼叫 run code；產生的程式 await `tools.getCharges`、log 出資料、找出同一天兩筆 $49 的扣款，並在結果中給出 refund amount。
- `#L108-L140` — 講者比較：這比提供 search charges 等細碎工具、再讓模型自己推理算術快得多；程式在 VM sandbox 中安全執行，但坦言這在 production 仍屬 bleeding edge，只有專職團隊在做。
- `#L141-L177` — 討論幻覺：模型會把使用者給的數字當模板亂替換，日期與算術尤其不可靠；讓模型寫程式並固定輸入，結果才會可重現。LLM 很會寫程式，但不會數數。
- `#L178-L223` — 觀眾提問 timeout：runtime 層可設定，sandbox 預設 2 秒，`runTool` 目前沒傳 options；`withTimeout` 建立一個在時限後 reject 的 promise，與執行程式的 promise 做 race，先完成者決定結果。

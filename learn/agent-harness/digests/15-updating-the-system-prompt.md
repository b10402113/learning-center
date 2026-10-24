---
source: sources/agent-harness/20260915/15-updating-the-system-prompt.txt
source_type: text
source_lines: 223
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- System prompt 只需補上一句：需要算術時，用 `runCode` 寫一段 JavaScript 在 async 包裝中執行；寫法沒有標準答案。
- 端到端驗證用一個真實任務：「找出重複扣款並算出確切退款金額」，觀察模型是否主動選擇 `runCode`。
- 模型自行寫出程式：呼叫 `getCharges`、輸出 log、比對同一天同金額的扣款，最後得出 $49 的退款。
- 這證明 code mode 的價值：不是模型變聰明，而是把計算外包給 deterministic 的程式，速度快且不會算錯。
- 工具呼叫次數大幅下降，是 code mode 相對「一工具一輪」最直接的成本效益。
- 延伸討論：LLM 對數字與日期本質上不可靠，因為生成是機率性的；寫程式再把輸入固定住才能穩定重現。
- 追問 timeout：`runInSandbox` 已支援 `options.timeoutMs`，但 `runTool` 目前沒傳；`Promise.race` 就是逾時控制的機制。
- 課程對 code mode 的定位是 bleeding edge：概念清楚、效益明確，但正式環境仍少見。

# L2 detail

- `#L1-L37` — 更新 system prompt：新增「需要 arithmetic 時請用 `runCode` 產生 JavaScript 並在 async 函式中執行」，並說明這裡沒有唯一正確寫法。
- `#L38-L67` — 準備測試：挑一個退款金額的 billing 任務，重新 `npm install` 與 `npm run dev`，把提示送進 app。
- `#L68-L109` — 觀察結果：模型分類後直接呼叫 `runCode`，產生查詢 charges 並印出 log 的程式，找出同一天兩筆 $49 的重複扣款。
- `#L110-L140` — 效益分析：一個 `runCode` 取代多輪工具呼叫，比讓模型自己推理算術更快，且執行發生在安全的 VM 沙箱內。
- `#L141-L178` — 延伸問答：模型會把提供的數字當模板亂替換，涉及數字與日期時應讓它寫程式；LLM 很會寫程式，但不會數數。
- `#L179-L223` — 回答 timeout 問題：沙箱預設 2 秒且可傳 `timeoutMs`，目前呼叫端未傳；並解說 `Promise.race` 如何在程式與逾時之間先到先贏。

---
source: sources/agent-harness/20260915/14-sandbox-boundary-runcode-tool.txt
source_type: text
source_lines: 302
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 建立 `harness/sandbox.ts`：從 Node 的 `vm` 模組取得 `runInContext` 與 `createContext`，自己實作一個最小沙箱。
- `runInSandbox(code, api, options)` 的介面：程式碼字串、可用的 API 對照表、可選的 timeout（預設 2 秒）與 log 收集。
- `createContext` 只注入兩樣東西：受控的 API 函式表與自製 `console`，後者把 log 收進陣列而不是輸出到終端。
- 用 async IIFE 包住模型寫的程式，讓它可以直接使用 top-level `await`，不必自己處理 async 細節。
- `runInContext` 回傳 promise，再用 `withTimeout` 的 `Promise.race` 保證不會無限執行。
- 回傳值刻意設計成 `{ ok: true, result, logs }` 或 `{ ok: false, error }`，因為模型看得懂這種簡化的成功／失敗訊號。
- 示範工具 `charge`：sandbox API 提供 `getCharges` 與 `searchKnowledgeBase`，讓模型有真實資料可組合。
- `runCode` 工具只是把模型的程式碼交給 `runInSandbox`；新增工具的模式固定為「定義工具 + 在 switch 中處理」。

# L2 detail

- `#L1-L27` — 新增 `sandbox.ts`，從 `node:vm` 匯入所需 API，並帶入 `SandboxResult` 與 `SandboxAPI` 型別，開始自建沙箱。
- `#L28-L57` — 定義 `runInSandbox` 的簽章：程式碼字串、sandbox API、可選設定；timeout 以毫秒計、預設 2 秒，另準備 logs 陣列收集輸出。
- `#L58-L90` — 用 `createContext` 建立執行環境，注入 API 函式表，並自製 `console.log` 把參數轉字串後推進 logs。
- `#L91-L107` — 用帶 `async` 的 IIFE 包裝模型程式碼，讓 top-level `await` 可用，降低模型寫錯的機率。
- `#L108-L148` — 以 `runInContext` 執行程式取得 promise，再用 `withTimeout`（`Promise.race`）讓程式與計時器賽跑，先結束者決定結果。
- `#L149-L168` — 成功時回傳 `{ ok: true, result, logs }`，失敗時回傳 `{ ok: false, error }`；`ok` 旗標是給模型看的白話訊號。
- `#L169-L243` — 建立 `charge` 工具與假資料，定義 `sandboxApi` 的 `getCharges`、`searchKnowledgeBase`，並把 KB 查詢抽成共用的 `searchKB` 輔助函式。
- `#L244-L302` — 定義 `runCode` 工具（描述可用 `tools.getCharges`、`tools.knowledgeBase`、`console.log`、`return`），並在 `runTool` 的 switch 補上 `runCode`、`getCharges`、`searchKB` 三個 case。

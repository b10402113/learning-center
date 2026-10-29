---
source: sources/agent-harness2/20261029/14-sandbox-boundary-runcode-tool.txt
source_type: text
source_lines: 302
supplements:
  - harness-engineering.1.part.md#L1-L60
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 在 `harness/sandbox.ts` 用 Node `vm` 建立自製 sandbox，入口是 `runInSandbox(code, api, options)`。
- context 只注入 `tools` 與自訂 `console.log`， logs 收集成字串陣列回傳。
- 程式碼包進 async IIFE，讓模型能直接寫 top-level `await`。
- timeout 用 `Promise.race` 實作，預設 2 秒；`vm` 的 timeout 與外層 race 是兩層防線。
- 回傳 `{ ok, result/error, logs }`，用 `ok` 布林值讓模型容易判斷成敗；再新增 `runCode` tool 與 `getCharges`、`searchKnowledgeBase` API。

# L2 detail

- `#L1-L57` — 建立 `harness/sandbox.ts`，從 `node:vm` 匯入；宣告 `SandboxResult`、`SandboxApi` 型別與 `runInSandbox` 簽章：接收 code 字串、sandbox API、可選 options（timeout 毫秒，預設 2 秒），並準備 `logs` 字串陣列。
- `#L58-L90` — 用 `vm.createContext` 建立 sandbox 環境，注入 `tools`（允許 sandbox 呼叫的函式 map）與自訂 `console`；`console.log` 的參數轉字串後以空格 join，push 進 `logs`，不輸出到宿主 process。
- `#L91-L107` — 把模型程式碼包成 `(async () => { ... })()`，讓它可以直接使用 `await` 執行非同步程式，不需要自己包 async 函式。
- `#L108-L147` — 以 try/catch 包住 `vm.runInContext(wrapped, context, { timeout })` 取得 pending promise；再以自製 `withTimeout` 做 `Promise.race`，讓「程式完成」與「計時器到期 reject」先到者勝出。
- `#L148-L167` — 成功回傳 `{ ok: true, result, logs }`，失敗回傳 `{ ok: false, error }`；`ok` 欄位是刻意設計給 LLM 看的白話訊號，讓模型一看就知道這次執行是好是壞。
- `#L168-L196` — 新增 `charge` 工具作為範例：金額算術不該交給語言模型（連 strawberry 有幾個 R 都數錯），應由程式計算；載入 `runInSandbox`、`SandboxApi`、charge 型別與假資料。
- `#L197-L243` — 建立 `sandboxApi`：只暴露 `getCharges(customerId)` 與 `searchKnowledgeBase(query)` 兩個唯讀函式；把原本內嵌的 KB 搜尋抽象成 `searchKB(q)` helper，供 sandbox 與一般工具共用。
- `#L244-L266` — 定義 `runCode` tool：description 說明可寫 async function body、使用 `await tools.getCharges`／`await tools.knowledgeBase`、可用 `console.log`、以 `return` 回傳任意 JSON；input schema 只有 `code` 字串。
- `#L267-L302` — 在 `runTool` 的 switch 新增 `runCode`（轉呼叫 `runInSandbox`）、`getCharges`、`searchKB` 三個 case；結論是新增 sandbox 能力的固定流程：定義 tool、在 runTool 處理、把允許的 API 放進 sandbox。

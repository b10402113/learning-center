---
source: sources/agent-harness/20260915/harness-engineering
source_type: codebase
source_lines: 573
file_count: 10
language: TypeScript
part: 2
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- `server/index.ts` — harness 的宿主。啟動順序本身就是設計：先建 schema、再 `DBOS.launch()`（同時 recovery 未完成的 workflow），然後才開 WebSocket 廣播事件、把瀏覽器送來的 task 丟進 durable workflow。
- `server/env.ts` — 六行的載入順序修正。因為 ES module 的 import 早於 top-level 敘述，讀 env 的模組（`harness/db.ts`）必須排在 dotenv 之後。
- `shared/events.ts` — server 與 browser 之間唯一的契約。事件列舉 + discriminated union，讓「UI 只渲染事件流、不碰模型與工具」成為編譯期可檢查的事實。
- `scripts/inspect-log.ts` — 直接讀 Postgres 驗證 durability 的小 CLI：統計事件型別，並找出被 requested 超過一次的 tool call，也就是重複的副作用。
- `scripts/test-sandbox.ts` — 不需要 agent 失控也能示範護欄：timeout 殺同步迴圈、`require` 不存在、錯誤以結構化形式回傳。
- `package.json` / `vite.config.ts` / `tsconfig.json` — 依賴清單就是課程能力地圖（DBOS 對 durability、AI SDK 對 model、Drizzle 對 event log），alias 則讓 `@shared` 同時被 server 與 web 使用。
- `course.yml` — 課程本身是資料。每一課都寫成「failure mode → capability」，並附上五步授課節奏。
- `README.md` — 用 branch-per-lesson 發佈：每支 branch 帶前一課的解答與本課講義，`main` / `complete` 指向最新狀態；也明說學員不寫 UI。

# L2 detail

- `#L1-L48` — `server/index.ts`（啟動與路由）— `import "./env"` 必須是第一行；`ensureSchema()` 先於 `DBOS.setConfig` / `launch()`，因為 launch 會撿起上次死掉時在飛的 workflow。Express 這層只做三件事：健康檢查、清空日誌、把審批決定 `DBOS.send` 回暫停中的 workflow。
- `#L49-L92` — `server/index.ts`（WebSocket）— `subscribe` 把每個事件轉發給所有 inspector；連線時先註冊 message handler 再 `await history()`，否則客戶端一連上就送的 `submit_task` 會掉。`DBOS.startWorkflow` 是 fire-and-forget，進度只透過事件回報。
- `#L93-L98` — `server/env.ts` — 把 dotenv 隔離成獨立模組並最先 import。這是「模組載入時就讀 env」這種設計的標準解法，也是 trace 不到的啟動錯誤來源。
- `#L99-L138` — `shared/events.ts`（`EventType`）— 事件詞彙表就是 harness 的可觀測性介面：workflow 生命週期、模型串流、工具呼叫、記憶體壓縮、handoff、plan/subagent、approval、log。用常數而非字串，讓每個新能力都必須先宣告事件。
- `#L139-L169` — `shared/events.ts`（payload 與 client 訊息）— 每個事件型別都綁定自己的 payload（`from`/`to`/`reason`、`subagent.*` 的 `stepId`…），`AgentEvent` 再蓋上 `id` + `ts`。`ClientMessage.mode` 是唯一能選擇 runtime 的欄位：default 走單 agent，supervised 走 supervisor。
- `#L170-L202` — `scripts/inspect-log.ts` — 把 durability 的宣稱變成可量測的數字：事件總數、各型別計數、distinct tool calls，以及 `DUPLICATED calls`。最後一項若大於零，就代表「副作用剛好一次」被破壞了。
- `#L203-L236` — `scripts/test-sandbox.ts` — 四個案例直接對應沙箱的四個承諾：Code Mode 能取資料並計算、同步無窮迴圈被 timeout 砍掉、`require("fs")` 直接不存在、程式 bug 變成模型讀得懂的結構化錯誤。
- `#L237-L294` — `package.json` — 相依性讀起來就是課程大綱：`@dbos-inc/dbos-sdk`（durable execution）、`ai` + `@ai-sdk/openai`（模型）、`drizzle-orm` + `postgres`（event log）、`ws` + `express`（host）、`radix-ui` + Tailwind + prompt-kit 系列（inspector）。scripts 只有 dev/dev:server/dev:web/docs/typecheck，沒有給 server 的 build step（用 `tsx` 直跑）。
- `#L295-L317` — `vite.config.ts` — 前端 root 在 `web/`，兩個 alias：`@` → `web/src`（shadcn 慣例）、`@shared` → `shared/`（與 server 共用事件型別）。`server.fs.allow` 放行 repo 根，否則 Vite 不讓 web 匯入 `shared/`。
- `#L318-L339` — `tsconfig.json` — 單一 strict 設定同時涵蓋 server、shared、harness、web；`moduleResolution: bundler` + `verbatimModuleSyntax` 對齊 Vite/tsx 的執行模型，`noEmit` 表示型別檢查與打包分離。
- `#L340-L409` — `course.yml`（課程定位）— 一句話賣點「Stop building scripts」；七條 Benefits 正好是七課的能力清單，Summary 則明說 agent 刻意無聊、harness 才是主角，並把成品對應到 LangGraph / Mastra / Temporal / agent SDK 提供的那一層。
- `#L410-L474` — `course.yml`（課表）— 每課都以「failure mode」起頭再接「capability」，註解還留下貫穿全課的主線：`stateStore.load()` → hydrateContext、`agent.next()` → policy.check、`eventLog.append()` → checkpoint。五步節奏（講失敗 → 看它壞 → 補機制 → 重跑 → 對應 production 工具）是這份教材的敘事骨架。
- `#L475-L573` — `README.md` — 課程的取得方式與心智模型：不是一個越長越大的專案，而是每課一個架構 pattern；教學用 branch 切分，`lesson-N` 含前一課解答。Tech stack 段落也點明「harness 擁有 transport，UI 由課程提供」。

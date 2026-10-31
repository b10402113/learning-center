---
source: sources/agent-harness2/20261029/harness-engineering
source_type: codebase
source_lines: 2512
language: TypeScript
file_count: 22
part: 2
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- `web/` — 整個 inspector 是 harness 事件流的投影：它不呼叫模型、不持有 agent 狀態，只透過一條 WebSocket 收 `AgentEvent`、送 `ClientMessage`。
- `web/src/App.tsx` + `main.tsx` — 應用外殼：掛載、雙欄版面、連線指示燈與主題切換；把 `events`/`send` 往下傳給兩個 pane。
- `web/src/useHarnessSocket.ts` — 前端唯一真相來源：append-only 事件陣列加一個送命令的 `send`，沒有 request/response 配對。
- `web/src/components/TaskPane.tsx` — 把事件摺成對話 transcript：串流文字、工具卡、handoff 分隔線、supervisor 子代理樹、核准卡都在這裡。
- `web/src/components/InspectorPane.tsx` — 原始事件日誌，依 `type` 前綴上色；讓 harness 的內部步驟變成可觀察的表面。
- `web/src/components/ui/*` — 課程預先寫好的 shadcn/prompt-kit 原語，學生不用自己刻；`tool.tsx` 與 `markdown.tsx` 直接支撐串流體驗。
- `web/src/styles.css` + `useTheme.ts` + `index.html` — Tailwind v4 的 oklch 設計 token 與 class 式深色模式，並在首次繪製前套用以避免閃爍。

# L2 detail

- `#L1-L23` — `web/index.html` — 23 行的外殼：`#root` 掛載點、載入 `/src/main.tsx`，以及一段在首次繪製前讀 `localStorage.theme`（否則用 `prefers-color-scheme`）就替 `<html>` 加上 `.dark` 的 inline script。選學重點：主題在 React 之前就決定，所以重整不會先閃白再變暗。
- `#L1-L10` — `web/src/main.tsx` — `createRoot` + `StrictMode` 掛載 `App`，並 import `styles.css`。沒有 router、沒有 provider 堆疊；整個應用的進入點就這三件事。
- `#L1-L54` — `web/src/App.tsx` — 唯一呼叫 `useHarnessSocket()` 與 `useTheme()` 的地方，把 `events`/`send` 往下傳給兩個 pane，`connected` 只拿來點綠燈。版面是 `grid grid-cols-2`：左 `TaskPane`、右 `InspectorPane`，標頭放連線狀態與明暗切換。選學重點：App 不持有任何 agent 狀態，UI 只是事件的函式；換掉 harness 實作不需要動這個檔案。
- `#L1-L32` — `web/src/useHarnessSocket.ts` — 匯出 `useHarnessSocket()`：連 `ws://<host>:8787/ws`，`onmessage` 把每個 JSON 解析成 `AgentEvent` 後 `setEvents(prev => [...prev, event])`，`onopen`/`onclose` 維護 `connected`。`send` 用 ref 送出 `ClientMessage`（`submit_task`，之後的 `approve`），unmount 時關閉 socket。選學重點：事件流是唯一真相，前端不做 request/response 配對，也不用 AI SDK 的 `useChat`，因為它表達不了伺服器主動發起的事件。
- `#L1-L423` — `web/src/components/TaskPane.tsx` — 核心是純函式 `toTranscript(events)`，把 `AgentEvent[]` 摺成 `Turn` union：`ModelDelta` 累加進同一個 assistant turn、`ModelCompleted` 覆寫全文，`ToolRequested/Completed/Failed` 用 `toolsById` 就地改 `ToolPart.state`，`PlanCreated` 加 `SubagentStarted/Completed/Failed` 則長出 supervisor 樹。`open` 計數器決定 `running`（顯示 loader、鎖住輸入），`submit()` 送 `{ type: "submit_task", input, mode }`；核准卡打 `POST /api/approve/:workflowId`，「Clear」打 `/api/clear` 後 reload 重播空日誌。`TurnView` 再把每種 turn 對到 `Markdown`、`Tool`、`ChainOfThought`、手繪核准卡。選學重點：同一條事件流能同時投影成對話、工具卡、子代理樹與核准 modal，因為事件型別本身就是 UI 契約。
- `#L1-L67` — `web/src/components/InspectorPane.tsx` — 右欄把事件原樣依序列出：時間戳、`ev.type`（依 `type.split(".")[0]` 對應 workflow/model/tool/log 的顏色）、以及剝掉 `id/ts/type/workflowId` 後 `JSON.stringify` 的 payload；空陣列時顯示等待字樣。選學重點：這是「把不可見的基礎設施變可見」的最小版本，之後的 checkpoint、sub-agent、approval 都只是同一條流上的新事件型別。
- `#L1-L26` — `web/src/useTheme.ts` — `getInitialTheme()` 先讀 `localStorage`、否則看 `prefers-color-scheme`；effect 把 `dark` class 掛到 `<html>` 並寫回 storage。shadcn 的深色模式就只是這個 class，沒有 context 或 CSS-in-JS。
- `#L1-L111` — `web/src/styles.css` — Tailwind v4 寫法：`@import "tailwindcss"`、`@plugin "@tailwindcss/typography"`，並用 `@custom-variant dark (&:is(.dark *))` 定義 class 式深色模式。`:root` 與 `.dark` 各一組 oklch 設計 token，`@theme inline` 再映射成 `--color-*` 讓 utility 可用；base layer 讓 `html/body/#root` 滿高。
- `#L1-L7` — `web/src/lib/utils.ts` — 匯出 `cn(...inputs)`，實作是 `twMerge(clsx(inputs))`：先處理條件 class，再解 Tailwind 衝突。所有 shadcn 元件的 `className` 合併都靠這七行。
- `#L1-L499` — `web/src/components/ui/*` — 13 個預先寫好的 shadcn/prompt-kit 原語；本段檢視範圍以最大的 `loader.tsx`（L1-L499）為代表，另有 `tool.tsx`（L1-L213）、`prompt-input.tsx`（L1-L233）、`chain-of-thought.tsx`（L1-L148）、`markdown.tsx`（L1-L110）、`code-block.tsx`、`message.tsx`、`avatar.tsx`、`chat-container.tsx`、`collapsible.tsx`、`button.tsx`、`textarea.tsx`、`tooltip.tsx`。`tool.tsx` 的 `ToolPart` 是工具呼叫的四態機（input-streaming → input-available → output-available / output-error）；`markdown.tsx` 用 `marked.lexer` 切塊後逐塊 `memo`，讓串流時只重繪變動的區塊。這一層是課程明說「學生不用自己寫」的部分，學員只需讀懂它如何消費事件。
